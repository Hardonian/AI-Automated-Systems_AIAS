'use client';

import { ReactNode, useEffect, useState } from 'react';
import { logger } from '@/lib/logging/structured-logger';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  requiredPlan: 'starter' | 'pro';
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({
  feature,
  requiredPlan,
  children,
  fallback,
}: FeatureGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    try {
      const response = await fetch(
        `/api/entitlements/check?feature=${feature}`
      );
      if (response.ok) {
        const data = await response.json();
        setHasAccess(data.allowed);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      logger.error(
        'Failed to check feature access',
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'FeatureGate',
          action: 'checkAccess',
          feature,
        }
      );
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className='opacity-50'>{children}</div>;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className='relative'>
        <div className='pointer-events-none opacity-50'>{children}</div>
        <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm'>
          <div className='space-y-4 p-6 text-center'>
            <Lock className='mx-auto h-12 w-12 text-muted-foreground' />
            <div>
              <h3 className='mb-2 font-semibold'>
                This feature requires{' '}
                {requiredPlan === 'starter' ? 'Starter' : 'Pro'}
              </h3>
              <p className='mb-4 text-sm text-muted-foreground'>
                Upgrade to unlock this feature and more.
              </p>
              <Button asChild>
                <Link href='/pricing'>Upgrade Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
