/**
 * Billing, Subscription, Usage & Customer Management Engine
 * Stripe integration with webhooks, usage metering, and analytics
 */

import { z } from 'zod';

import { subscriptionTierSchema, SubscriptionTier } from '../pricing/tiers';

/**
 * Subscription Status
 */
export const subscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'past_due',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'unpaid',
  'paused',
]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

/**
 * Usage Metric
 */
export const usageMetricSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  metricType: z.enum([
    'workflow_executions',
    'agent_calls',
    'api_calls',
    'storage_mb',
    'team_members',
    'integrations',
  ]),
  quantity: z.number().int().min(0),
  timestamp: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

export type UsageMetric = z.infer<typeof usageMetricSchema>;

/**
 * Subscription
 */
export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  tier: subscriptionTierSchema,
  status: subscriptionStatusSchema,
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  cancelAtPeriodEnd: z.boolean().default(false),
  canceledAt: z.string().datetime().optional(),
  trialStart: z.string().datetime().optional(),
  trialEnd: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

/**
 * Usage Summary
 */
export const usageSummarySchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  metrics: z.record(z.object({
    current: z.number().int(),
    limit: z.number().int(),
    percentage: z.number().min(0).max(100),
  })),
  totalCost: z.number().optional(),
});

export type UsageSummary = z.infer<typeof usageSummarySchema>;

/**
 * Billing Event
 */
export const billingEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum([
    'subscription_created',
    'subscription_updated',
    'subscription_canceled',
    'payment_succeeded',
    'payment_failed',
    'invoice_created',
    'usage_recorded',
  ]),
  data: z.record(z.unknown()),
  timestamp: z.string().datetime(),
});

export type BillingEvent = z.infer<typeof billingEventSchema>;

/**
 * Billing Service
 */
export class BillingService {
  private subscriptions: Map<string, Subscription> = new Map();
  private usageMetrics: Map<string, UsageMetric[]> = new Map();

  /**
   * Create or update subscription
   */
  async createSubscription(
    userId: string,
    tier: SubscriptionTier,
    stripeCustomerId?: string
  ): Promise<Subscription> {
    const subscription: Subscription = {
      id: this.generateId(),
      userId,
      tier,
      status: 'trialing',
      stripeCustomerId,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: this.addDays(new Date(), 30).toISOString(),
      cancelAtPeriodEnd: false,
      trialStart: new Date().toISOString(),
      trialEnd: this.addDays(new Date(), 14).toISOString(),
    };

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    subscriptionId: string,
    updates: Partial<Subscription>
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const updated = { ...subscription, ...updates };
    this.subscriptions.set(subscriptionId, updated);
    return updated;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const updated: Subscription = {
      ...subscription,
      cancelAtPeriodEnd,
      canceledAt: cancelAtPeriodEnd ? undefined : new Date().toISOString(),
      status: cancelAtPeriodEnd ? subscription.status : 'canceled',
    };

    this.subscriptions.set(subscriptionId, updated);
    return updated;
  }

  /**
   * Record usage metric
   */
  async recordUsage(metric: Omit<UsageMetric, 'id' | 'timestamp'>): Promise<UsageMetric> {
    const usageMetric: UsageMetric = {
      ...metric,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    const key = metric.tenantId || metric.userId;
    const metrics = this.usageMetrics.get(key) || [];
    metrics.push(usageMetric);
    this.usageMetrics.set(key, metrics);

    return usageMetric;
  }

  /**
   * Get usage summary
   */
  async getUsageSummary(
    userId: string,
    tenantId?: string,
    period?: { start: Date; end: Date }
  ): Promise<UsageSummary> {
    const subscription = Array.from(this.subscriptions.values())
      .find(s => s.userId === userId && (!tenantId || s.tenantId === tenantId));

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const key = tenantId || userId;
    const metrics = this.usageMetrics.get(key) || [];
    const periodStart = period?.start || new Date(subscription.currentPeriodStart);
    const periodEnd = period?.end || new Date(subscription.currentPeriodEnd);

    const filteredMetrics = metrics.filter(m => {
      const timestamp = new Date(m.timestamp);
      return timestamp >= periodStart && timestamp <= periodEnd;
    });

    // Calculate usage by metric type
    const usageByType: Record<string, { current: number; limit: number }> = {};
    
    filteredMetrics.forEach(metric => {
      if (!usageByType[metric.metricType]) {
        usageByType[metric.metricType] = { current: 0, limit: 0 };
      }
      usageByType[metric.metricType]!.current += metric.quantity;
    });

    // Get limits from subscription tier
    const { getTierLimits } = await import('../pricing/tiers');
    const limits = getTierLimits(subscription.tier);

    const summary: UsageSummary = {
      userId,
      tenantId,
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString(),
      },
      metrics: {},
    };

    // Calculate metrics with limits
    Object.entries(usageByType).forEach(([type, usage]) => {
      const limitKey = type.replace('_', '') as keyof typeof limits;
      const limit = limits[limitKey] || -1;
      
      summary.metrics[type] = {
        current: usage.current,
        limit: limit === -1 ? Infinity : limit,
        percentage: limit === -1 ? 0 : (usage.current / limit) * 100,
      };
    });

    return summary;
  }

  /**
   * Check if usage exceeds limit
   */
  async checkUsageLimit(
    userId: string,
    metricType: UsageMetric['metricType'],
    quantity: number = 1
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const subscription = Array.from(this.subscriptions.values())
      .find(s => s.userId === userId && s.status === 'active');

    if (!subscription) {
      return { allowed: false, remaining: 0, limit: 0 };
    }

    const summary = await this.getUsageSummary(userId);
    const metric = summary.metrics[metricType];

    if (!metric) {
      return { allowed: true, remaining: Infinity, limit: Infinity };
    }

    const newUsage = metric.current + quantity;
    const allowed = metric.limit === Infinity || newUsage <= metric.limit;

    return {
      allowed,
      remaining: Math.max(0, metric.limit === Infinity ? Infinity : metric.limit - metric.current),
      limit: metric.limit,
    };
  }

  /**
   * Handle Stripe webhook
   */
  async handleStripeWebhook(event: {
    type: string;
    data: { object: Record<string, unknown> };
  }): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.syncStripeSubscription(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
    }
  }

  /**
   * Sync Stripe subscription
   */
  private async syncStripeSubscription(_stripeSubscription: Record<string, unknown>): Promise<void> {
    // Would sync with database
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(_stripeSubscription: Record<string, unknown>): Promise<void> {
    // Would update subscription status
  }

  /**
   * Handle payment succeeded
   */
  private async handlePaymentSucceeded(_invoice: Record<string, unknown>): Promise<void> {
    // Would update subscription and send confirmation
  }

  /**
   * Handle payment failed
   */
  private async handlePaymentFailed(_invoice: Record<string, unknown>): Promise<void> {
    // Would update subscription status and send notification
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add days to date
   */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

// Export singleton instance
export const billingService = new BillingService();
