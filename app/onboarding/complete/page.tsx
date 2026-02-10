'use client';

import { Check, Sparkles, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// import { useRouter } from "next/navigation"; // Will be used for navigation
import { ShareInvite } from '@/components/plg/share-invite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { track } from '@/lib/telemetry/track';

export default function CompletePage() {
  // const router = useRouter(); // Will be used for navigation
  const [userId, setUserId] = useState<string | undefined>();
  const [referralCode, setReferralCode] = useState<string | undefined>();

  useEffect(() => {
    // Track onboarding completion
    const storedUserId = localStorage.getItem('user_id') || 'anonymous';
    setUserId(storedUserId);

    // TODO: Fetch referral code from API
    // For now, generate a simple referral code
    setReferralCode(
      storedUserId !== 'anonymous'
        ? `REF-${storedUserId.slice(0, 8)}`
        : undefined
    );

    track(storedUserId, {
      type: 'onboarding_completed',
      path: '/onboarding/complete',
      meta: {
        timestamp: new Date().toISOString(),
      },
      app: 'web',
    });
  }, []);

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='space-y-4 text-center'>
        <div className='mb-4 text-6xl'>🎉</div>
        <h1 className='text-4xl font-bold'>Congratulations!</h1>
        <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
          You've successfully completed onboarding and created your first
          workflow. You're now ready to automate and save time.
        </p>
      </div>

      <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Zap className='h-5 w-5 text-primary' />
              Quick Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Integration connected</span>
              </div>
              <div className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Workflow created</span>
              </div>
              <div className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Workflow tested</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5 text-primary' />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Create more workflows</span>
              </div>
              <div className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Explore templates</span>
              </div>
              <div className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Connect more integrations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-primary' />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Link
                className='block text-sm text-primary hover:underline'
                href='/help'
              >
                Help Center
              </Link>
              <Link
                className='block text-sm text-primary hover:underline'
                href='/case-studies'
              >
                Case Studies
              </Link>
              <Link
                className='block text-sm text-primary hover:underline'
                href='/blog'
              >
                Blog & Tutorials
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='mx-auto flex max-w-2xl flex-col justify-center gap-4 sm:flex-row'>
        <Button asChild size='lg'>
          <Link href='/dashboard'>Go to Dashboard</Link>
        </Button>
        <Button asChild size='lg' variant='outline'>
          <Link href='/templates'>Browse More Templates</Link>
        </Button>
      </div>

      {/* Viral Invite Flow */}
      <div className='mx-auto mt-8 max-w-2xl'>
        <ShareInvite referralCode={referralCode} userId={userId} />
      </div>
    </div>
  );
}
