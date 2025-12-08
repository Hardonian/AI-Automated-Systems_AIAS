/**
 * Tests for Billing Engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BillingService } from '@/lib/billing/engine';
import { SubscriptionTier } from '@/lib/pricing/tiers';

describe('BillingService', () => {
  let billingService: BillingService;

  beforeEach(() => {
    billingService = new BillingService();
  });

  describe('createSubscription', () => {
    it('should create a subscription', async () => {
      const subscription = await billingService.createSubscription(
        'user-1',
        'free' as SubscriptionTier
      );

      expect(subscription).toBeDefined();
      expect(subscription.userId).toBe('user-1');
      expect(subscription.tier).toBe('free');
      expect(subscription.status).toBe('trialing');
    });
  });

  describe('updateSubscription', () => {
    it('should update a subscription', async () => {
      const subscription = await billingService.createSubscription(
        'user-2',
        'free' as SubscriptionTier
      );

      const updated = await billingService.updateSubscription(subscription.id, {
        tier: 'pro' as SubscriptionTier,
      });

      expect(updated.tier).toBe('pro');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel a subscription', async () => {
      const subscription = await billingService.createSubscription(
        'user-3',
        'pro' as SubscriptionTier
      );

      const canceled = await billingService.cancelSubscription(subscription.id, true);
      expect(canceled.cancelAtPeriodEnd).toBe(true);
    });
  });

  describe('recordUsage', () => {
    it('should record usage metric', async () => {
      const metric = await billingService.recordUsage({
        userId: 'user-4',
        metricType: 'workflow_executions',
        quantity: 10,
      });

      expect(metric).toBeDefined();
      expect(metric.userId).toBe('user-4');
      expect(metric.metricType).toBe('workflow_executions');
      expect(metric.quantity).toBe(10);
    });
  });

  describe('getUsageSummary', () => {
    it('should get usage summary', async () => {
      const _subscription = await billingService.createSubscription(
        'user-5',
        'pro' as SubscriptionTier
      );

      await billingService.recordUsage({
        userId: 'user-5',
        metricType: 'workflow_executions',
        quantity: 50,
      });

      const summary = await billingService.getUsageSummary('user-5');
      expect(summary).toBeDefined();
      expect(summary.userId).toBe('user-5');
      expect(summary.metrics).toBeDefined();
    });
  });

  describe('checkUsageLimit', () => {
    it('should check usage limits', async () => {
      const _subscription = await billingService.createSubscription(
        'user-6',
        'free' as SubscriptionTier
      );

      const limit = await billingService.checkUsageLimit(
        'user-6',
        'workflow_executions',
        1
      );

      expect(limit).toBeDefined();
      expect(limit.allowed).toBeDefined();
      expect(limit.remaining).toBeDefined();
      expect(limit.limit).toBeDefined();
    });
  });
});
