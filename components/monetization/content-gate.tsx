/**
 * Content Gating Component
 * Gates premium content based on subscription tier
 */

'use client';

import React from 'react';
import { SubscriptionTier, isFeatureAvailable, getFeatureLimit } from '@/lib/pricing/tiers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ContentGateProps {
  featureId: string;
  userTier: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function ContentGate({
  featureId,
  userTier,
  children,
  fallback,
  showUpgrade = true,
}: ContentGateProps) {
  const available = isFeatureAvailable(featureId, userTier);
  const limit = getFeatureLimit(featureId, userTier);

  if (available) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Premium Feature</CardTitle>
        </div>
        <CardDescription>
          This feature is available in Pro and Enterprise plans
        </CardDescription>
      </CardHeader>
      {showUpgrade && (
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Upgrade to unlock this feature and more</span>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing?trial=pro">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Usage-based content gate
 */
interface UsageGateProps {
  tier: SubscriptionTier;
  feature: 'workflows' | 'agents' | 'apiCalls' | 'storage' | 'teamMembers' | 'integrations';
  currentUsage: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function UsageGate({
  tier,
  feature,
  currentUsage,
  children,
  fallback,
}: UsageGateProps) {
  const { checkUsageLimit } = require('@/lib/pricing/tiers');
  const { allowed, limit, remaining } = checkUsageLimit(tier, feature, currentUsage);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Usage Limit Reached</CardTitle>
        <CardDescription>
          You've reached your {limit === -1 ? 'limit' : `limit of ${limit}`} for {feature}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/pricing">Upgrade Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
