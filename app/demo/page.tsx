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
  title: 'Book Strategy Call — AIAS Consultancy | Schedule Consultation',
  description:
    'Schedule a personalized strategy call with AIAS Consultancy. Discuss your custom AI platform or automation needs. No commitment required.',
};

export default function DemoPage() {
  return (
    <div className='container py-16'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
            Schedule Strategy Call
          </h1>
          <p className='text-lg text-muted-foreground'>
            Book a 30-minute consultation with our automation architect. We'll
            discuss your specific business challenges and map out a custom
            solution.
          </p>
        </div>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>What We'll Discuss</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              <li className='flex items-start gap-2'>
                <span className='mt-1 text-primary'>✓</span>
                <span>
                  Your current operational bottlenecks and manual processes
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 text-primary'>✓</span>
                <span>Potential ROI from custom AI agents and automation</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 text-primary'>✓</span>
                <span>Technical feasibility of your project ideas</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 text-primary'>✓</span>
                <span>Roadmap and timeline estimates for a custom build</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 text-primary'>✓</span>
                <span>
                  How our consultancy vs. platform models compare for your needs
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className='mb-8 border-primary/20 bg-primary/5'>
          <CardHeader>
            <CardTitle>Select a Time</CardTitle>
            <CardDescription>
              Choose a time that works for you. No commitment required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center justify-center space-y-6 py-6'>
              <Button
                asChild
                className='h-14 w-full px-8 text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl md:w-auto'
                size='lg'
              >
                <a
                  href='https://calendly.com/aias-platform'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Open Calendar
                </a>
              </Button>
              <p className='text-center text-sm text-muted-foreground'>
                Prefer email?{' '}
                <a
                  className='text-primary hover:underline'
                  href='mailto:inquiries@aiautomatedsystems.ca'
                >
                  inquiries@aiautomatedsystems.ca
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Just exploring?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4 text-muted-foreground'>
                You can try our self-serve platform for free without a
                consultation.
              </p>
              <Button asChild className='w-full' variant='outline'>
                <Link href='/pricing'>View Platform Plans</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Have Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4 text-muted-foreground'>
                Check out our help center or read our case studies.
              </p>
              <Button asChild className='w-full' variant='outline'>
                <Link href='/case-studies'>Read Case Studies</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
