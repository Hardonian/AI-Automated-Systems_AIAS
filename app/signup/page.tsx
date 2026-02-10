import { Check, Sparkles } from 'lucide-react';
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
  title: 'Sign Up — Start Your Free Trial | AI Automated Systems',
  description:
    'Start your 30-day free trial of AIAS Platform. No credit card required. Automate workflows, save 10+ hours/week. Canadian-built, PIPEDA compliant.',
};

export default function SignUpPage() {
  return (
    <div className='container py-16'>
      <div className='mx-auto max-w-2xl px-4'>
        <div className='mb-12 text-center'>
          <div className='mb-6 flex items-center justify-center gap-2'>
            <Sparkles className='h-8 w-8 text-primary' />
            <h1 className='text-4xl font-bold md:text-5xl'>
              Start Your Free Trial
            </h1>
          </div>
          <p className='text-lg leading-relaxed text-muted-foreground md:text-xl'>
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>

        <Card className='mb-8'>
          <CardHeader className='pb-4'>
            <CardTitle className='mb-2 text-2xl'>What You Get</CardTitle>
            <CardDescription className='text-base'>
              Everything you need to start automating your business
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-base leading-relaxed'>
                  3 automation workflows
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-base leading-relaxed'>
                  100 automations per month
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-base leading-relaxed'>
                  Access to pre-built templates
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-base leading-relaxed'>
                  Community support and resources
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span className='text-base leading-relaxed'>
                  PIPEDA compliant • Canadian data residency
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Button
            asChild
            className='h-12 w-full text-base font-semibold'
            size='lg'
          >
            <Link href='/contact'>Request Access</Link>
          </Button>
          <p className='text-center text-sm text-muted-foreground md:text-base'>
            Already have an account?{' '}
            <Link
              className='font-medium text-primary hover:underline'
              href='/signin'
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className='mt-10 rounded-lg bg-muted p-6 md:p-8'>
          <h3 className='mb-3 text-lg font-semibold'>
            Trusted by Canadian Businesses
          </h3>
          <p className='text-sm leading-relaxed text-muted-foreground md:text-base'>
            🇨🇦 Built in Canada • 🔒 PIPEDA Compliant • 🛡️ Enterprise Security •
            ✅ 99.9% Uptime SLA
          </p>
        </div>
      </div>
    </div>
  );
}
