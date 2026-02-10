'use client';
import { useEffect, useState } from 'react';

import SubscriptionPlans from '@/components/billing/SubscriptionPlans';
import { supabase } from '@/lib/supabase/client';

export default function BillingPage() {
  interface SubscriptionTier {
    tier: string;
    xp_multiplier: number;
    expires_at: string;
  }
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  async function loadCurrentSubscription() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('user_id', user.id)
      .gte('expires_at', new Date().toISOString())
      .single();

    setCurrentTier(data);
    setLoading(false);
  }

  if (loading) {
    return <div className='py-12 text-center'>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Subscription Plans</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Upgrade to unlock XP multipliers and exclusive features
        </p>
      </div>

      {currentTier && (
        <div className='rounded-2xl border bg-card p-4'>
          <div className='text-sm font-semibold'>Current Plan</div>
          <div className='mt-1 text-lg font-bold capitalize'>
            {currentTier.tier}
          </div>
          <div className='mt-1 text-sm text-muted-foreground'>
            {currentTier.xp_multiplier}x XP Multiplier
          </div>
          <div className='mt-2 text-xs text-muted-foreground'>
            Expires: {new Date(currentTier.expires_at).toLocaleDateString()}
          </div>
        </div>
      )}

      <SubscriptionPlans />
    </div>
  );
}
