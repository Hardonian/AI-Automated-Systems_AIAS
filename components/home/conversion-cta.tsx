'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';
import { track } from '@/lib/analytics';

export function ConversionCTA() {
  const [status, setStatus] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteContent.contact.email);
      track('copy_email_clicked', { location: 'conversion_cta' });
      setStatus('Email copied to clipboard.');
    } catch {
      setStatus('Copy failed. Please use the email link.');
    }
  };

  return (
    <section
      className='border-t border-border/50 bg-muted/30 px-4 py-20'
      id='contact'
    >
      <div className='container mx-auto max-w-4xl text-center'>
        <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
          Ready to discuss your use case?
        </h2>
        <p className='mb-8 text-lg text-muted-foreground'>
          Book a discovery call. We will review your context and outline how we
          might help.
        </p>
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg' className='min-h-[48px] px-8'>
            <Link href={getPrimaryCtaHref()} onClick={() => track('primary_cta_clicked', { location: 'conversion_cta' })}>
              {siteContent.positioning.primaryCTA.label}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='min-h-[48px] px-8'
          >
            <Link href={`mailto:${siteContent.contact.email}`} onClick={() => track('email_cta_clicked', { location: 'conversion_cta' })}>
              Email {siteContent.contact.email}
            </Link>
          </Button>
          <Button
            aria-label='Copy contact email address'
            onClick={handleCopyEmail}
            size='lg'
            variant='ghost'
            className='min-h-[48px] px-8'
            type='button'
          >
            <Copy className='mr-2 h-4 w-4' />
            Copy email
          </Button>
        </div>
        {status && <p className='mt-4 text-sm text-primary'>{status}</p>}
      </div>
    </section>
  );
}
