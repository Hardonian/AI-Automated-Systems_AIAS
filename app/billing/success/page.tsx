'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import Confetti from '@/components/gamification/Confetti';
import { LoadingState, ErrorState } from '@/components/ui/empty-state';
import { RetryButton } from '@/components/ui/retry-button';
import { supabase } from '@/lib/supabase/client';

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const verifySubscription = useCallback(async (): Promise<void> => {
    // Clear any existing poll interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('Please sign in to verify your subscription');
        setLoading(false);
        return;
      }

      // Check subscription status in database
      // Poll for up to 10 seconds (webhook may be delayed)
      let attempts = 0;
      const maxAttempts = 10;
      const pollIntervalMs = 1000; // 1 second

      const checkSubscription = async (): Promise<boolean> => {
        const { data: tier } = await supabase
          .from('subscription_tiers')
          .select('*')
          .eq('user_id', user.id)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (tier) {
          setVerified(true);
          return true;
        }

        return false;
      };

      // Initial check
      if (await checkSubscription()) {
        setLoading(false);
        setCelebrating(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
        return;
      }

      // Poll for webhook processing
      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        if (await checkSubscription()) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setLoading(false);
          setCelebrating(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else if (attempts >= maxAttempts) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          // Webhook may be delayed, but show success anyway
          // User can check billing page if needed
          setLoading(false);
          setCelebrating(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      }, pollIntervalMs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to verify subscription'
      );
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (sessionId) {
      void verifySubscription().catch(err => {
        setError(
          err instanceof Error ? err.message : 'Failed to verify subscription'
        );
        setLoading(false);
      });
    } else {
      setError('Missing session ID');
      setLoading(false);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [sessionId, verifySubscription]);

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <LoadingState message='Verifying your subscription...' />
      </div>
    );
  }

  if (error && !celebrating) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='w-full max-w-md'>
          <ErrorState
            title='Verification Failed'
            description={error}
            onRetry={verifySubscription}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='space-y-4 text-center'>
        <div className='text-6xl'>🎉</div>
        <div className='text-2xl font-bold'>Subscription Activated!</div>
        <div className='text-muted-foreground'>
          {verified
            ? 'Your account has been upgraded. Redirecting to dashboard...'
            : 'Your payment was successful. Your subscription is being processed and will be active shortly.'}
        </div>
        {!verified && (
          <div className='mt-4 text-sm text-muted-foreground'>
            <p>
              If your subscription doesn't appear within a few minutes, please
              contact support.
            </p>
            <RetryButton
              onRetry={verifySubscription}
              label='Check again'
              variant='outline'
            />
          </div>
        )}
      </div>
      <Confetti when={celebrating} />
    </div>
  );
}
