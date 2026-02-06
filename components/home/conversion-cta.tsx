'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConversionCTA() {
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
            <Link href='/contact'>
              Book a discovery call
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='min-h-[48px] px-8'
          >
            <Link href='/services'>View services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
