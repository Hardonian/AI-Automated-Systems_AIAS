'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { HeroContent } from '@/components/content/types';

export function ContentDrivenHero({ content }: { content: HeroContent }) {
  return (
    <section
      className='relative flex min-h-[68vh] items-center overflow-hidden py-12 [@media(max-height:420px)]:min-h-[100svh] [@media(max-height:420px)]:items-start [@media(max-height:420px)]:py-4 md:min-h-[78vh] md:py-20'
      id='top'
    >
      <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10' />
      <div className='grid-bg pointer-events-none absolute inset-0 opacity-50' />

      <div className='container relative z-10 mx-auto px-4'>
        <div className='mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='text-center lg:text-left'>
            {content.badgeText && (
              <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary sm:text-sm'>
                <Sparkles className='h-4 w-4' />
                <span>{content.badgeText}</span>
              </div>
            )}

            <h1 className='mb-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
              {content.title}
              <span className='mt-2 block text-xl font-semibold leading-snug text-primary sm:text-2xl md:text-3xl'>
                {content.subtitle}
              </span>
            </h1>

            <p className='mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0'>
              {content.description}
            </p>

            <div
              className='flex flex-wrap justify-center gap-3 lg:justify-start'
              data-testid='hero-cta-group'
            >
              {content.primaryCta?.visible && (
                <Button asChild size='lg' className='min-h-[48px] px-6 text-base font-bold'>
                  <Link href={content.primaryCta.href}>
                    {content.primaryCta.label}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              )}
              {content.secondaryCta?.visible && (
                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='min-h-[48px] px-6 text-base font-semibold'
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <aside
            className='mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card/90 p-5 shadow-lg backdrop-blur'
            data-testid='hero-impact-card-container'
          >
            <p className='mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
              {content.impactCardsLabel ?? 'At-a-glance impact'}
            </p>
            <div className='grid gap-3 sm:grid-cols-2' data-testid='hero-impact-card-grid'>
              <div className='contents' data-testid='hero-social-proof-grid'>
                {content.socialProof?.map(item => (
                  <div
                    key={item.text}
                    className='rounded-xl border bg-background p-3'
                    data-testid='hero-social-proof-card'
                  >
                    <p className='text-sm font-medium text-foreground'>{item.icon} {item.text}</p>
                  </div>
                ))}
              </div>
              <div className='contents' data-testid='hero-trust-badge-grid'>
                {content.trustBadges?.map(item => (
                  <div
                    key={item.text}
                    className='rounded-xl border bg-background p-3'
                    data-testid='hero-trust-badge-card'
                  >
                    <p className='text-sm font-medium text-foreground'>✓ {item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
