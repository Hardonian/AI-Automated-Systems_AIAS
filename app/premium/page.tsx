import { Check } from 'lucide-react';
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
  title: 'Premium Content — Systems Thinking + AI | AIAS Platform',
  description:
    'Get access to premium systems thinking frameworks, exclusive case studies, advanced GenAI content engine features, and premium RSS feed analysis.',
};

export default function PremiumPage() {
  return (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Premium Content & Features
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          Unlock premium systems thinking frameworks, exclusive case studies,
          and advanced features. Get deeper insights into how systems thinking
          is THE critical skill for the AI age — and how it drives job market
          success and business outcomes.
        </p>
      </div>

      <div className='mx-auto mb-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2'>
        {/* Premium Tier */}
        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle className='text-2xl'>Premium</CardTitle>
            <CardDescription className='text-lg'>$9/month</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Unlock all premium systems thinking articles</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>
                  Premium RSS feed with deeper systems thinking analysis
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Advanced 6-perspective frameworks and templates</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Exclusive case studies: Systems thinking in action</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Monthly systems thinking insights newsletter</span>
              </li>
            </ul>
            <Button asChild className='w-full' size='lg'>
              <Link href='/pricing'>Subscribe to Premium</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className='border-primary/20 bg-primary/5'>
          <CardHeader>
            <CardTitle className='text-2xl'>Pro</CardTitle>
            <CardDescription className='text-lg'>$19/month</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Everything in Premium</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>
                  Exclusive systems thinking methodologies (consultant-level)
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Priority support for systems thinking questions</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Early access to new systems thinking frameworks</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>Private systems thinking community discussions</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span>
                  Advanced GenAI Content Engine with systems thinking analysis
                </span>
              </li>
            </ul>
            <Button asChild className='w-full' size='lg'>
              <Link href='/pricing'>Subscribe to Pro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* What You Get */}
      <div className='mx-auto max-w-4xl space-y-8'>
        <section>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>What's Included</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='mb-2 font-semibold'>
                  🧠 Premium Systems Thinking Articles
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Access to exclusive articles that go deeper into systems
                  thinking: multi-perspective analysis, root cause
                  methodologies, leverage point identification, and how systems
                  thinking creates job market advantage in the AI age.
                </p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold'>
                  📰 Premium RSS Feed with Systems Thinking Lens
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Get deeper systems thinking analysis on AI and tech news. Each
                  news item analyzed through our 6-perspective framework
                  (Process, Technology, People, Data, Systems, Automation) with
                  exclusive editorial commentary.
                </p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold'>
                  📋 Advanced Systems Thinking Frameworks
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Access to exclusive frameworks used by consultants: causal
                  loop diagrams, stock/flow models, 5 Whys methodology, and the
                  holistic productivity methodology. These are the tools that
                  make systems thinking actionable.
                </p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold'>
                  📊 Exclusive Case Studies: Systems Thinking in Action
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Real-world case studies showing how systems thinking drives
                  business success: how it identifies root causes, reveals
                  leverage points, and creates sustainable competitive
                  advantages. Learn from businesses that applied systems
                  thinking to achieve breakthrough results.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className='rounded-lg bg-muted/50 p-8 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>
            Ready to Master Systems Thinking?
          </h2>
          <p className='mb-6 text-muted-foreground'>
            Systems thinking is THE critical skill for the AI age. Join premium
            subscribers and get exclusive access to frameworks, case studies,
            and methodologies that show how systems thinking creates job market
            advantage and drives business success.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/pricing'>View Pricing</Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/blog'>View Free Content</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
