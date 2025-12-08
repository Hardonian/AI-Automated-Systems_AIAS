/**
 * Subscription Pricing Tiers
 * Free, Pro, and Enterprise plans with feature gating
 */

import { z } from 'zod';

export const subscriptionTierSchema = z.enum(['free', 'pro', 'enterprise']);

export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  availableIn: SubscriptionTier[];
  limit?: number; // For usage-based features
}

export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  description: string;
  features: PricingFeature[];
  limits: {
    workflows: number;
    agents: number;
    apiCalls: number;
    storage: number; // in MB
    teamMembers: number;
    integrations: number;
  };
  cta: {
    primary: string;
    secondary?: string;
  };
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'CAD',
    },
    description: 'Perfect for trying out AI automation',
    features: [
      {
        id: 'basic-workflows',
        name: 'Basic Workflows',
        description: 'Create up to 3 simple automation workflows',
        availableIn: ['free', 'pro', 'enterprise'],
        limit: 3,
      },
      {
        id: 'basic-ai-agents',
        name: 'Basic AI Agents',
        description: 'Access to pre-built AI agents',
        availableIn: ['free', 'pro', 'enterprise'],
        limit: 1,
      },
      {
        id: 'community-support',
        name: 'Community Support',
        description: 'Access to community forums and documentation',
        availableIn: ['free', 'pro', 'enterprise'],
      },
      {
        id: 'basic-analytics',
        name: 'Basic Analytics',
        description: 'View basic usage statistics',
        availableIn: ['free', 'pro', 'enterprise'],
      },
    ],
    limits: {
      workflows: 3,
      agents: 1,
      apiCalls: 1000,
      storage: 100,
      teamMembers: 1,
      integrations: 2,
    },
    cta: {
      primary: 'Get Started Free',
      secondary: 'No credit card required',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 99,
      yearly: 990, // 2 months free
      currency: 'CAD',
    },
    description: 'For growing businesses ready to scale',
    features: [
      {
        id: 'unlimited-workflows',
        name: 'Unlimited Workflows',
        description: 'Create unlimited automation workflows',
        availableIn: ['pro', 'enterprise'],
      },
      {
        id: 'custom-ai-agents',
        name: 'Custom AI Agents',
        description: 'Build and deploy custom AI agents',
        availableIn: ['pro', 'enterprise'],
        limit: 10,
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Detailed insights and reporting',
        availableIn: ['pro', 'enterprise'],
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Email support with 24-hour response time',
        availableIn: ['pro', 'enterprise'],
      },
      {
        id: 'api-access',
        name: 'API Access',
        description: 'Full API access for integrations',
        availableIn: ['pro', 'enterprise'],
      },
      {
        id: 'team-collaboration',
        name: 'Team Collaboration',
        description: 'Work with your team on workflows',
        availableIn: ['pro', 'enterprise'],
        limit: 5,
      },
    ],
    limits: {
      workflows: -1, // unlimited
      agents: 10,
      apiCalls: 100000,
      storage: 10000,
      teamMembers: 5,
      integrations: 20,
    },
    cta: {
      primary: 'Start Free Trial',
      secondary: '14-day trial, then $99/month',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: {
      monthly: 0, // Custom pricing
      yearly: 0,
      currency: 'CAD',
    },
    description: 'For organizations with advanced needs',
    features: [
      {
        id: 'everything-in-pro',
        name: 'Everything in Pro',
        description: 'All Pro features included',
        availableIn: ['enterprise'],
      },
      {
        id: 'unlimited-agents',
        name: 'Unlimited AI Agents',
        description: 'Deploy unlimited custom AI agents',
        availableIn: ['enterprise'],
      },
      {
        id: 'dedicated-support',
        name: 'Dedicated Support',
        description: 'Dedicated account manager and 24/7 support',
        availableIn: ['enterprise'],
      },
      {
        id: 'custom-integrations',
        name: 'Custom Integrations',
        description: 'Custom integrations built for your needs',
        availableIn: ['enterprise'],
      },
      {
        id: 'sla',
        name: 'SLA Guarantee',
        description: '99.9% uptime SLA with credits',
        availableIn: ['enterprise'],
      },
      {
        id: 'on-premise',
        name: 'On-Premise Option',
        description: 'Deploy on your infrastructure',
        availableIn: ['enterprise'],
      },
      {
        id: 'sso',
        name: 'SSO & Advanced Security',
        description: 'Single sign-on and advanced security features',
        availableIn: ['enterprise'],
      },
    ],
    limits: {
      workflows: -1,
      agents: -1,
      apiCalls: -1,
      storage: -1,
      teamMembers: -1,
      integrations: -1,
    },
    cta: {
      primary: 'Contact Sales',
      secondary: 'Custom pricing for your needs',
    },
  },
];

/**
 * Check if a feature is available in a tier
 */
export function isFeatureAvailable(featureId: string, tier: SubscriptionTier): boolean {
  const feature = pricingTiers
    .flatMap(t => t.features)
    .find(f => f.id === featureId);
  
  if (!feature) return false;
  return feature.availableIn.includes(tier);
}

/**
 * Get feature limit for a tier
 */
export function getFeatureLimit(featureId: string, tier: SubscriptionTier): number | null {
  const feature = pricingTiers
    .flatMap(t => t.features)
    .find(f => f.id === featureId);
  
  if (!feature || !feature.availableIn.includes(tier)) return null;
  return feature.limit ?? null;
}

/**
 * Get tier limits
 */
export function getTierLimits(tier: SubscriptionTier) {
  const tierConfig = pricingTiers.find(t => t.id === tier);
  return tierConfig?.limits ?? pricingTiers[0]?.limits ?? { workflows: 0, executions: 0, storage: 0, users: 0, apiCalls: 0 };
}

/**
 * Check if usage exceeds limit
 */
export function checkUsageLimit(
  tier: SubscriptionTier,
  feature: 'workflows' | 'agents' | 'apiCalls' | 'storage' | 'teamMembers' | 'integrations',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const limits = getTierLimits(tier);
  const limit = limits[feature];
  
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }
  
  const remaining = Math.max(0, limit - currentUsage);
  return {
    allowed: remaining > 0,
    limit,
    remaining,
  };
}
