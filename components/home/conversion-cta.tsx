'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';
import { track } from '@/lib/analytics';

export function ConversionCTA() {
  return (
    <section
      className='border-t-2 border-border bg-background px-4 py-24'
      id='contact'
    >
      <div className='container mx-auto max-w-3xl text-center'>
        <h2 className='mb-6 text-3xl font-black uppercase tracking-tighter md:text-5xl'>
          Book a 30-minute diagnostic — free, no strings
        </h2>
        <p className='mx-auto mb-4 max-w-2xl font-mono text-base text-muted-foreground md:text-lg'>
          Tell us which workflow is blocking your team. We&apos;ll map the constraints,
          identify quick wins, and recommend next steps — whether that involves us or not.
        </p>
        <p className='mb-10 font-mono text-sm text-primary'>
          {siteContent.contact.responseTime}
        </p>
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button
            asChild
            size='lg'
            className='rounded-none border-2 border-primary bg-primary px-10 font-mono text-base font-bold uppercase tracking-wider text-primary-foreground shadow-card transition-all hover:-translate-y-1 hover:shadow-lg'
          >
            <Link href={getPrimaryCtaHref()} onClick={() => track('primary_cta_clicked', { location: 'conversion_cta' })}>
              {siteContent.positioning.primaryCTA.label}
              <ArrowRight className='ml-3 h-5 w-5' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='rounded-none border-2 border-border bg-transparent px-10 font-mono text-base font-bold uppercase tracking-wider text-foreground shadow-card transition-all hover:-translate-y-1 hover:border-foreground'
          >
            <Link href={`mailto:${siteContent.contact.email}`} onClick={() => track('email_cta_clicked', { location: 'conversion_cta' })}>
              Email your challenge directly
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

