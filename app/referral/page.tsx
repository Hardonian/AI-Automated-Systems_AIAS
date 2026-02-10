import { Check, Gift, Users, Share2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Referral Program — AIAS Platform | Get 1 Month Free',
  description:
    'Refer friends and get 1 month free for both of you. Share AIAS Platform and help others save 10+ hours/week with AI automation.',
};

export default function ReferralPage() {
  return (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          🎁 Referral Program • Get 1 Month Free
        </div>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Refer Friends, Get Rewarded
        </h1>
        <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
          Share AIAS Platform with friends and colleagues. When they sign up,
          you both get <strong>1 month free</strong>. Help others save 10+
          hours/week with AI automation.
        </p>
      </div>

      <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card className='border-primary/20'>
          <CardHeader>
            <div className='mb-2 flex items-center gap-3'>
              <Share2 className='h-6 w-6 text-primary' />
              <CardTitle>Share Your Link</CardTitle>
            </div>
            <CardDescription>
              Get your unique referral link and share it with friends,
              colleagues, or on social media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='referral-link'>Your Referral Link</Label>
                <div className='mt-2 flex gap-2'>
                  <Input
                    readOnly
                    className='font-mono text-sm'
                    id='referral-link'
                    value='https://aias-platform.com/signup?ref=YOUR_CODE'
                  />
                  <Button size='sm' variant='outline'>
                    Copy
                  </Button>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button className='flex-1' size='sm' variant='outline'>
                  Share on Twitter
                </Button>
                <Button className='flex-1' size='sm' variant='outline'>
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary/20'>
          <CardHeader>
            <div className='mb-2 flex items-center gap-3'>
              <Users className='h-6 w-6 text-primary' />
              <CardTitle>They Sign Up</CardTitle>
            </div>
            <CardDescription>
              When someone signs up using your referral link, they get 1 month
              free on any paid plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>
                  They start with 30-day free trial
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>
                  When they upgrade, they get 1 month free
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>
                  No credit card required for trial
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className='border-primary/20'>
          <CardHeader>
            <div className='mb-2 flex items-center gap-3'>
              <Gift className='h-6 w-6 text-primary' />
              <CardTitle>You Get Rewarded</CardTitle>
            </div>
            <CardDescription>
              When your referral upgrades to a paid plan, you get 1 month free
              added to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>
                  1 month free for each successful referral
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Unlimited referrals</span>
              </li>
              <li className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-sm'>Rewards applied automatically</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className='mx-auto max-w-3xl space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                1
              </div>
              <div>
                <h4 className='mb-1 font-semibold'>Get Your Referral Link</h4>
                <p className='text-sm text-muted-foreground'>
                  Sign in to your account and copy your unique referral link
                  from your dashboard.
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                2
              </div>
              <div>
                <h4 className='mb-1 font-semibold'>Share with Friends</h4>
                <p className='text-sm text-muted-foreground'>
                  Share your referral link via email, social media, or word of
                  mouth. Anyone who signs up using your link is your referral.
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                3
              </div>
              <div>
                <h4 className='mb-1 font-semibold'>They Sign Up</h4>
                <p className='text-sm text-muted-foreground'>
                  Your referral starts with a 30-day free trial. No credit card
                  required.
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                4
              </div>
              <div>
                <h4 className='mb-1 font-semibold'>Both Get Rewarded</h4>
                <p className='text-sm text-muted-foreground'>
                  When your referral upgrades to a paid plan (Starter or Pro),
                  they get 1 month free, and you get 1 month free added to your
                  account automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-3xl font-bold text-primary'>0</div>
                <div className='text-sm text-muted-foreground'>Referrals</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-primary'>0</div>
                <div className='text-sm text-muted-foreground'>Successful</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-primary'>0</div>
                <div className='text-sm text-muted-foreground'>Months Free</div>
              </div>
            </div>
            <p className='mt-4 text-center text-sm text-muted-foreground'>
              Sign in to see your referral stats and get your referral link.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='mt-12 space-y-4 text-center'>
        <h2 className='text-2xl font-bold'>Ready to Start Referring?</h2>
        <p className='text-muted-foreground'>
          Sign in to get your referral link and start earning free months.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg'>
            <Link href='/signup'>Sign Up to Get Started</Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link href='/signin'>Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
