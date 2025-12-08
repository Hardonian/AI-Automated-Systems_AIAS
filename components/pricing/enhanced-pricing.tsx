/**
 * Enhanced Pricing Component
 * CRO-optimized pricing display with urgency and social proof
 */

'use client';

import React, { useState } from 'react';
import { pricingTiers, SubscriptionTier } from '@/lib/pricing/tiers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { trackCTAClick } from '@/lib/cro/optimization';

export function EnhancedPricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [hoveredTier, setHoveredTier] = useState<SubscriptionTier | null>(null);

  const handleCTAClick = (tier: SubscriptionTier, type: 'primary' | 'secondary') => {
    trackCTAClick(`pricing-${tier}-${type}`, 'pricing-page', 'high');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-md transition-all relative ${
              billingPeriod === 'yearly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge className="ml-2 text-xs">Save 17%</Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map((tier) => {
          const price = billingPeriod === 'monthly' ? tier.price.monthly : tier.price.yearly / 12;
          const isPopular = tier.id === 'pro';
          // const _isEnterprise = tier.id === 'enterprise';

          return (
            <Card
              key={tier.id}
              className={`relative transition-all duration-300 ${
                isPopular
                  ? 'border-primary shadow-lg scale-105'
                  : hoveredTier === tier.id
                  ? 'shadow-xl scale-102'
                  : ''
              }`}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  {tier.id === 'enterprise' && <Shield className="h-5 w-5 text-muted-foreground" />}
                </div>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  {tier.price.monthly === 0 ? (
                    <div className="text-3xl font-bold">Custom</div>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-muted-foreground">/{billingPeriod === 'monthly' ? 'month' : 'month'}</span>
                      {billingPeriod === 'yearly' && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Billed annually (${tier.price.yearly}/year)
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">
                        {feature.name}
                        {feature.limit && (
                          <span className="text-muted-foreground"> ({feature.limit})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full"
                    size="lg"
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleCTAClick(tier.id, 'primary')}
                  >
                    <Link href={tier.id === 'enterprise' ? '/contact' : `/signup?plan=${tier.id}`}>
                      {tier.cta.primary}
                    </Link>
                  </Button>
                  {tier.cta.secondary && (
                    <p className="text-xs text-center text-muted-foreground">
                      {tier.cta.secondary}
                    </p>
                  )}
                </div>

                {/* Urgency Indicators */}
                {isPopular && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      <span>Join 500+ businesses using Pro</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Social Proof */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Trusted by businesses across Canada
        </p>
        <div className="flex items-center justify-center gap-8 opacity-60">
          {/* Add logos here */}
          <div className="text-2xl font-bold">Company 1</div>
          <div className="text-2xl font-bold">Company 2</div>
          <div className="text-2xl font-bold">Company 3</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! Pro plan includes a 14-day free trial. No credit card required to start.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and bank transfers for Enterprise plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
