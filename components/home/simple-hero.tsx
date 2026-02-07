'use client';

import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SimpleHero() {
  return (
    <section className='border-b border-border/50 bg-background'>
      <div className='container mx-auto px-4 py-20 md:py-28 lg:py-32'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary'>
            <Terminal className='h-4 w-4' />
            <span>Agentic Automation Consultancy</span>
          </div>
          <h1 className='mb-6 text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl'>
            AI automation systems that{' '}
            <span className='text-primary'>save teams 10+ hours/week</span>
          </h1>
          <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl'>
            Custom AI agents, workflow automation, and intelligent systems built
            for your context. Human-in-the-loop by design. All artifacts stay
            with your organization.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg' className='min-h-[48px] px-8'>
              <Link href='/demo'>
                Try Live Demo
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='min-h-[48px] px-8'
            >
              <Link href='/contact'>Book a discovery call</Link>
            </Button>
          </div>
          <p className='mt-6 text-sm text-muted-foreground'>
            🇨🇦 Canadian operations • SOC2 ready • No black-box lock-in
          </p>
        </div>
      </div>
    </section>
  );
}
