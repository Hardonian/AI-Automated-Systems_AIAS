import { Sparkles } from 'lucide-react';
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

export const metadata: Metadata = {
  title: 'Sign In — AI Automated Systems',
  description:
    'Sign in to your AIAS Platform account. Access your workflows, agents, and automation tools.',
};

export default function SignInPage() {
  return (
    <div className='container py-16'>
      <div className='mx-auto max-w-md px-4'>
        <div className='mb-12 text-center'>
          <div className='mb-6 flex items-center justify-center gap-2'>
            <Sparkles className='h-8 w-8 text-primary' />
            <h1 className='text-4xl font-bold md:text-5xl'>Sign In</h1>
          </div>
          <p className='text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Welcome back to AIAS Platform
          </p>
        </div>

        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='mb-2 text-2xl'>Access Your Account</CardTitle>
            <CardDescription className='text-base'>
              Sign in to continue managing your workflows and automations
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6 pt-6'>
            <Button
              asChild
              className='h-12 w-full text-base font-semibold'
              size='lg'
            >
              <Link href='/api/auth/login'>Sign In</Link>
            </Button>
            <p className='text-center text-sm text-muted-foreground md:text-base'>
              Don't have an account?{' '}
              <Link
                className='font-medium text-primary hover:underline'
                href='/signup'
              >
                Start your free trial
              </Link>
            </p>
            <div className='border-t pt-6'>
              <Link
                className='block text-center text-sm text-muted-foreground hover:text-foreground md:text-base'
                href='/help'
              >
                Need help? Visit our Help Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
