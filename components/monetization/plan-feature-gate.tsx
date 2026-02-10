'use client';

import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlanTier } from '@/config/plans';

interface PlanFeatureGateProps {
  children: ReactNode;
  requiredPlan: 'starter' | 'pro';
  currentPlan: PlanTier;
  featureName: string;
  featureDescription: string;
  upgradeCTA?: string;
  showPreview?: boolean;
}

export function PlanFeatureGate({
  children,
  requiredPlan,
  currentPlan,
  featureName,
  featureDescription,
  upgradeCTA = 'Upgrade to Unlock',
  showPreview = true,
}: PlanFeatureGateProps) {
  const isPaid =
    currentPlan === 'starter' ||
    currentPlan === 'pro' ||
    currentPlan === 'enterprise';
  const hasAccess = isPaid || (requiredPlan === 'starter' && isPaid);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showPreview) {
    return (
      <div className='relative'>
        {/* Blurred preview */}
        <div className='pointer-events-none select-none opacity-50 blur-sm'>
          {children}
        </div>

        {/* Overlay with upgrade prompt */}
        <div className='absolute inset-0 flex items-center justify-center rounded-lg border-2 border-primary/30 bg-background/80 backdrop-blur-sm'>
          <Card className='mx-4 max-w-md border-2 border-primary shadow-xl'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent'>
                <Lock className='h-8 w-8 text-white' />
              </div>
              <CardTitle className='text-2xl'>{featureName}</CardTitle>
              <CardDescription className='mt-2 text-base'>
                {featureDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='rounded-lg bg-primary/10 p-4'>
                <p className='mb-2 text-sm font-semibold'>
                  Unlock with {requiredPlan === 'starter' ? 'Starter' : 'Pro'}{' '}
                  plan:
                </p>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  {requiredPlan === 'starter' && (
                    <>
                      <li>• Unlimited workflows & automations</li>
                      <li>• Personalized news feed</li>
                      <li>• Advanced email analysis</li>
                      <li>• 30-min onboarding session</li>
                    </>
                  )}
                  {requiredPlan === 'pro' && (
                    <>
                      <li>• Everything in Starter</li>
                      <li>• 50 AI agents</li>
                      <li>• Priority support</li>
                      <li>• 60-min onboarding session</li>
                    </>
                  )}
                </ul>
              </div>
              <Button asChild className='w-full' size='lg'>
                <Link href='/pricing'>
                  <Sparkles className='mr-2 h-4 w-4' />
                  {upgradeCTA}
                </Link>
              </Button>
              <p className='text-center text-xs text-muted-foreground'>
                Start your 30-day free trial • No credit card required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No preview - just show upgrade prompt
  return (
    <Card className='border-2 border-primary/30'>
      <CardHeader className='text-center'>
        <Lock className='mx-auto mb-4 h-12 w-12 text-primary' />
        <CardTitle>{featureName}</CardTitle>
        <CardDescription>{featureDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className='w-full' size='lg'>
          <Link href='/pricing'>{upgradeCTA}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
