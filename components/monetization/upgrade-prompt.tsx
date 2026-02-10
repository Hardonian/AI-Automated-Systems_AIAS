'use client';

import { Sparkles, Lock, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlanTier } from '@/config/plans';

interface UpgradePromptProps {
  currentPlan: PlanTier;
  trialDaysRemaining?: number;
  feature?: string;
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export function UpgradePrompt({
  currentPlan,
  trialDaysRemaining,
  feature,
  variant = 'card',
  className = '',
}: UpgradePromptProps) {
  const isTrial = currentPlan === 'trial';
  const isFree = currentPlan === 'free';

  if (!isTrial && !isFree) {
    return null; // Already paid
  }

  const content = (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex-1'>
        <div className='mb-1 flex items-center gap-2'>
          <Lock className='h-4 w-4 text-primary' />
          <h4 className='font-semibold'>
            {isTrial && trialDaysRemaining
              ? `Trial ends in ${trialDaysRemaining} days`
              : 'Unlock Full Features'}
          </h4>
        </div>
        <p className='text-sm text-muted-foreground'>
          {feature
            ? `Upgrade to unlock ${feature} and more`
            : 'Get unlimited workflows, personalized insights, and priority support'}
        </p>
        {isTrial && trialDaysRemaining && trialDaysRemaining <= 7 && (
          <p className='mt-1 text-xs font-medium text-primary'>
            <Clock className='mr-1 inline h-3 w-3' />
            Don't lose your personalized setup
          </p>
        )}
      </div>
      <Button asChild size='sm'>
        <Link href='/pricing'>
          Upgrade Now
          <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </div>
  );

  if (variant === 'banner') {
    return (
      <div
        className={`rounded-lg border-2 border-primary/30 bg-primary/10 p-4 ${className}`}
      >
        {content}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Lock className='h-4 w-4 text-primary' />
        <span className='text-muted-foreground'>
          {feature
            ? `Upgrade to unlock ${feature}`
            : 'Upgrade to unlock this feature'}
        </span>
        <Button asChild className='h-auto p-0' size='sm' variant='ghost'>
          <Link href='/pricing'>
            Upgrade
            <ArrowRight className='ml-1 h-3 w-3' />
          </Link>
        </Button>
      </div>
    );
  }

  // Default: card variant
  return (
    <Card className={`border-2 border-primary/30 bg-primary/5 ${className}`}>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Sparkles className='h-5 w-5 text-primary' />
          <CardTitle className='text-lg'>Upgrade to Unlock More</CardTitle>
        </div>
        <CardDescription>
          {isTrial && trialDaysRemaining
            ? `Your trial ends in ${trialDaysRemaining} days. Upgrade to keep everything.`
            : 'Get unlimited access to all features'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
          <div className='flex items-start gap-2'>
            <TrendingUp className='mt-0.5 h-4 w-4 text-primary' />
            <div>
              <div className='font-semibold'>Unlimited Everything</div>
              <div className='text-xs text-muted-foreground'>
                Workflows, automations, email analysis
              </div>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <Sparkles className='mt-0.5 h-4 w-4 text-primary' />
            <div>
              <div className='font-semibold'>Personalized Insights</div>
              <div className='text-xs text-muted-foreground'>
                News feed, campaign recommendations
              </div>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <Lock className='mt-0.5 h-4 w-4 text-primary' />
            <div>
              <div className='font-semibold'>Onboarding Session</div>
              <div className='text-xs text-muted-foreground'>
                30-60 min strategy call included
              </div>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <ArrowRight className='mt-0.5 h-4 w-4 text-primary' />
            <div>
              <div className='font-semibold'>Priority Support</div>
              <div className='text-xs text-muted-foreground'>
                24-48h response time
              </div>
            </div>
          </div>
        </div>
        <Button asChild className='w-full' size='lg'>
          <Link href='/pricing'>
            Upgrade Now
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
        <p className='text-center text-xs text-muted-foreground'>
          Start your 30-day free trial • No credit card required
        </p>
      </CardContent>
    </Card>
  );
}
