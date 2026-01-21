import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { checkIdempotencyKey, recordIdempotencyKey } from "@/lib/billing/idempotency";
import { env } from "@/lib/env";
import { SystemError, ValidationError, formatError } from "@/lib/errors";
import { logger } from "@/lib/logging/structured-logger";
import { telemetry } from "@/lib/monitoring/enhanced-telemetry";
import { recordError } from "@/lib/utils/error-detection";
import { retry } from "@/lib/utils/retry";
import { safeStripe, safeSupabase } from "@/lib/utils/server-guards";

// CRITICAL: This route MUST use Node.js runtime (not Edge) for raw body access
export const runtime = "nodejs";

// Initialize Stripe and Supabase clients lazily (avoid build-time side effects)
let stripe: Stripe | null = null;
let supabase: ReturnType<typeof safeSupabase> | null = null;

const initializeStripeClients = () => {
  if (stripe && supabase) {
    return { stripe, supabase };
  }

  try {
    stripe = safeStripe();
    supabase = safeSupabase(true); // Use service role for webhook
    return { stripe, supabase };
  } catch (error) {
    logger.error(
      "Failed to initialize Stripe/Supabase in webhook",
      error instanceof Error ? error : new Error(String(error))
    );
    stripe = null;
    supabase = null;
    return { stripe, supabase };
  }
};


interface WebhookResponse {
  received?: boolean;
  error?: string;
}

// Webhook handler - CRITICAL: Stripe sends webhooks as POST
// CRITICAL: Stripe webhooks require raw body for signature verification, so we MUST use Node.js runtime
// However, we still use proper error handling and validation
export async function POST(req: NextRequest): Promise<NextResponse<WebhookResponse>> {
  const startTime = Date.now();
  const sig = req.headers.get("stripe-signature");
  const {webhookSecret} = env.stripe;
  const { stripe, supabase } = initializeStripeClients();

  // Guard: Ensure Stripe and Supabase are initialized
  if (!stripe || !supabase) {
    const error = new SystemError("Stripe or Supabase client not initialized");
    recordError(error, { endpoint: '/api/stripe/webhook', action: 'webhook' });
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }

  if (!sig || !webhookSecret) {
    const error = new SystemError("Missing Stripe webhook configuration");
    recordError(error, { endpoint: '/api/stripe/webhook', action: 'webhook' });
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }

  // Get raw body (required for signature verification)
  const body = await req.text();
  
  // Track webhook receipt
  telemetry.trackPerformance({
    name: "stripe_webhook_received",
    value: Date.now() - startTime,
    unit: "ms",
    tags: { status: "received" },
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const error = new ValidationError(
      "Webhook signature verification failed",
      undefined,
      { originalError: err instanceof Error ? err.message : String(err) }
    );
    recordError(error, { endpoint: '/api/stripe/webhook', action: 'webhook_verification' });
    logger.error("Webhook signature verification failed", error instanceof Error ? error : new Error(String(error)), {
      component: "StripeWebhookAPI",
      action: "verifySignature",
    });
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }

  // Idempotency: Use Stripe event ID as idempotency key
  const idempotencyKey = `stripe_webhook_${event.id}`;
  const idempotencyCheck = await checkIdempotencyKey(idempotencyKey);
  
  if (idempotencyCheck.exists && idempotencyCheck.response) {
    // Already processed this webhook, return cached response
    logger.info("Webhook already processed (idempotency)", {
      eventId: event.id,
      eventType: event.type,
    });
    return NextResponse.json({ received: true, cached: true });
  }

  try {
    const responseData: { received: boolean; processed?: boolean } = { received: true };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Validate metadata with Zod schema
        const metadataSchema = z.object({
          userId: z.string().uuid("User ID must be a valid UUID"),
          tier: z.enum(["starter", "pro", "enterprise"], {
            errorMap: () => ({ message: "Tier must be one of: starter, pro, enterprise" }),
          }),
        });
        
        const metadataValidation = metadataSchema.safeParse(session.metadata);
        if (!metadataValidation.success) {
          const error = new ValidationError(
            "Invalid session metadata",
            metadataValidation.error.errors.map((e) => ({
              path: e.path.map(String),
              message: e.message,
            }))
          );
          recordError(error, { endpoint: '/api/stripe/webhook', action: 'checkout_session_validation' });
          const formatted = formatError(error);
          return NextResponse.json(
            { error: formatted.message, details: formatted.details },
            { status: formatted.statusCode }
          );
        }
        
        const { userId, tier } = metadataValidation.data;

        if (userId && tier) {
          const XP_MULTIPLIERS: Record<string, number> = {
            starter: 1.25,
            pro: 1.5,
            enterprise: 2.0,
          };

          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);

          // Retry database operation with exponential backoff
          await retry(
            async () => {
              const { error } = await supabase.from("subscription_tiers").upsert({
                user_id: userId,
                tier,
                xp_multiplier: XP_MULTIPLIERS[tier] || 1.0,
                expires_at: expiresAt.toISOString(),
              });
              if (error) {
                throw new Error(error.message);
              }
            },
            {
              maxAttempts: 3,
              initialDelayMs: 1000,
            }
          );

          // Also update Subscription table if it exists
          try {
            const { data: org } = await supabase
              .from("organizations")
              .select("id")
              .eq("owner_id", userId)
              .single();

            if (org) {
              await supabase.from("subscriptions").upsert({
                org_id: org.id,
                status: "ACTIVE",
                plan: tier.toUpperCase() as "STARTER" | "PRO" | "ENTERPRISE",
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: session.metadata?.priceId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: expiresAt,
                cancelAtPeriodEnd: false,
              });
            }
          } catch (subError) {
            // Log but don't fail - subscription_tiers is the primary source
            logger.warn("Failed to update Subscription table", subError instanceof Error ? subError : new Error(String(subError)));
          }

          responseData.processed = true;
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status in database
        try {
          const { data: sub } = await supabase
            .from("subscriptions")
            .select("id, org_id")
            .eq("stripeSubscriptionId", subscription.id)
            .single();

          if (sub) {
            const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING"> = {
              active: "ACTIVE",
              canceled: "CANCELED",
              past_due: "PAST_DUE",
              unpaid: "UNPAID",
              trialing: "TRIALING",
            };
            const normalizedStatus = subscription.status.toLowerCase().replace("-", "_");
            await supabase
              .from("subscriptions")
              .update({
                status: statusMap[normalizedStatus] || "ACTIVE",
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              })
              .eq("id", sub.id);
          }
        } catch (subError) {
          logger.warn("Failed to update subscription status", subError instanceof Error ? subError : new Error(String(subError)));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as canceled
        try {
          await supabase
            .from("subscriptions")
            .update({
              status: "CANCELED",
              cancelAtPeriodEnd: false,
            })
            .eq("stripeSubscriptionId", subscription.id);
        } catch (subError) {
          logger.warn("Failed to cancel subscription", subError instanceof Error ? subError : new Error(String(subError)));
        }
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`, { eventType: event.type });
    }

    const duration = Date.now() - startTime;
    
    // Record idempotency key with response
    await recordIdempotencyKey(
      idempotencyKey,
      "stripe_webhook",
      event.id,
      JSON.stringify(event),
      responseData,
      "completed"
    );
    
    // Track success
    telemetry.trackPerformance({
      name: "stripe_webhook_processed",
      value: duration,
      unit: "ms",
      tags: { status: "success", eventType: event.type },
    });
    
    return NextResponse.json(responseData);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const systemError = new SystemError(
      "Webhook handler error",
      error instanceof Error ? error : new Error(String(error))
    );
    recordError(systemError, { endpoint: '/api/stripe/webhook', action: 'webhook_handler' });
    
    // Record failed idempotency
    try {
      await recordIdempotencyKey(
        idempotencyKey,
        "stripe_webhook",
        event.id,
        JSON.stringify(event),
        { error: systemError.message },
        "failed"
      );
    } catch (idempError) {
      logger.warn("Failed to record idempotency for failed webhook", idempError instanceof Error ? idempError : new Error(String(idempError)));
    }
    
    // Track error
    telemetry.trackPerformance({
      name: "stripe_webhook_processed",
      value: duration,
      unit: "ms",
      tags: { status: "error" },
    });
    
    logger.error("Webhook handler error", systemError, {
      component: "StripeWebhookAPI",
      action: "handleWebhook",
    });
    const formatted = formatError(systemError);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}
