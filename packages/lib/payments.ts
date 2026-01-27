import { config } from '@ai-consultancy/config';
import Stripe from 'stripe';

import { prisma } from './database';
import { logger } from './observability';

// Lazy initialize Stripe to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = config.stripe.secretKey;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover' as any,
    });
  }
  return stripeInstance;
}

export interface CreateCheckoutSessionParams {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateBillingPortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export class PaymentService {
  static async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata || {},
    };

    if (params.customerId) {
      sessionParams.customer = params.customerId;
    } else if (params.customerEmail) {
      sessionParams.customer_email = params.customerEmail;
    }

    return getStripe().checkout.sessions.create(sessionParams);
  }

  static async createBillingPortalSession(
    params: CreateBillingPortalSessionParams
  ) {
    return getStripe().billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  static async getCustomer(customerId: string) {
    return getStripe().customers.retrieve(customerId);
  }

  static async getSubscription(subscriptionId: string) {
    return getStripe().subscriptions.retrieve(subscriptionId);
  }

  static async cancelSubscription(subscriptionId: string) {
    return getStripe().subscriptions.cancel(subscriptionId);
  }

  static async updateSubscription(
    subscriptionId: string,
    params: Stripe.SubscriptionUpdateParams
  ) {
    return getStripe().subscriptions.update(subscriptionId, params);
  }

  static async listInvoices(customerId: string, limit = 10) {
    return getStripe().invoices.list({
      customer: customerId,
      limit,
    });
  }

  static async getUpcomingInvoice(customerId: string) {
    return (getStripe().invoices as any).retrieveUpcoming({
      customer: customerId,
    });
  }

  static async createUsageRecord(subscriptionItemId: string, quantity: number) {
    return (getStripe().subscriptionItems as any).createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp: Math.floor(Date.now() / 1000),
      }
    );
  }

  static async verifyWebhookSignature(payload: string, signature: string) {
    try {
      return getStripe().webhooks.constructEvent(
        payload,
        signature,
        config.stripe.webhookSecret || ''
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  }

  static async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );
        break;
      default:
        logger.info(
          { eventType: event.type },
          `Unhandled event type: ${event.type}`
        );
    }
  }

  private static async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!customerId || !subscriptionId) {
      logger.error('Missing customer or subscription ID in checkout session');
      return;
    }

    // Find organization by customer ID through subscription or create new one
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      include: { org: true },
    });

    let org = existingSubscription?.org;

    if (!org) {
      // Create new organization for this customer
      org = await prisma.organization.create({
        data: {
          name: 'New Organization',
          slug: `org-${Date.now()}`,
        },
      });
    }

    // Create or update subscription
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      update: {
        status: 'ACTIVE',
        stripePriceId: session.metadata?.priceId,
      },
      create: {
        orgId: org.id,
        status: 'ACTIVE',
        plan: this.getPlanFromPriceId(session.metadata?.priceId || ''),
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: session.metadata?.priceId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  private static async handleSubscriptionCreated(
    subscription: Stripe.Subscription
  ) {
    const customerId = subscription.customer as string;

    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      include: { org: true },
    });

    const org = existingSubscription?.org;

    if (!org) {
      logger.error({ customerId }, 'Organization not found for customer');
      return;
    }

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: this.mapStripeStatus(subscription.status),
        stripePriceId: subscription.items.data[0]?.price.id,
      },
      create: {
        orgId: org.id,
        status: this.mapStripeStatus(subscription.status),
        plan: this.getPlanFromPriceId(
          subscription.items.data[0]?.price.id || ''
        ),
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }

  private static async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: this.mapStripeStatus(subscription.status),
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }

  private static async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
      },
    });
  }

  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    // Handle successful payment
    logger.info({ invoiceId: invoice.id }, 'Invoice payment succeeded');
  }

  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    // Handle failed payment
    logger.warn({ invoiceId: invoice.id }, 'Invoice payment failed');
  }

  private static mapStripeStatus(
    status: Stripe.Subscription.Status
  ):
    | 'ACTIVE'
    | 'CANCELED'
    | 'INCOMPLETE'
    | 'INCOMPLETE_EXPIRED'
    | 'PAST_DUE'
    | 'TRIALING'
    | 'UNPAID' {
    switch (status) {
      case 'active':
        return 'ACTIVE';
      case 'canceled':
        return 'CANCELED';
      case 'incomplete':
        return 'INCOMPLETE';
      case 'incomplete_expired':
        return 'INCOMPLETE_EXPIRED';
      case 'past_due':
        return 'PAST_DUE';
      case 'trialing':
        return 'TRIALING';
      case 'unpaid':
        return 'UNPAID';
      default:
        return 'ACTIVE';
    }
  }

  private static getPlanFromPriceId(
    priceId: string
  ): 'BASIC' | 'PRO' | 'ENTERPRISE' | 'FREE' {
    if (priceId === config.stripe.prices.basic) {
      return 'BASIC';
    } else if (priceId === config.stripe.prices.pro) {
      return 'PRO';
    } else if (priceId === config.stripe.prices.addon) {
      return 'ENTERPRISE'; // Map addon to ENTERPRISE plan
    }
    return 'FREE';
  }
}
