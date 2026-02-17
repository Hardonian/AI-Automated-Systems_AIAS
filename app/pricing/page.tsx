import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  getContainerClasses,
  getSectionClasses,
  TYPOGRAPHY,
} from '@/lib/design-tokens';
import { getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Pricing | AI Automated Systems',
  description:
    'Flexible AIAS engagement models including workflow builds, strategic retainers, managed delivery, and team enablement.',
  canonical: '/pricing',
});

type EngagementPath = {
  name: string;
  label: string;
  bestFor: string[];
  timeline: string;
  investment: string;
  includes: string[];
  bestWhen: string;
  ctaLabel: string;
  ctaHref: string;
  popular: boolean;
};

const engagementPaths: EngagementPath[] = [
  {
    name: 'Build + handoff',
    label: 'Fixed-scope implementation',
    bestFor: ['Teams launching their first production workflow', 'Clear scope and fast delivery'],
    timeline: 'Defined sprint cadence with milestone handoff',
    investment: 'One-time project pricing',
    includes: [
      'Discovery and workflow mapping',
      'Production workflow implementation',
      'QA, documentation, and launch support',
      'Enablement session for your internal team',
    ],
    bestWhen: 'You want a complete delivery your team can own and operate.',
    ctaLabel: 'Request proposal',
    ctaHref: '/contact',
    popular: false,
  },
  {
    name: 'Build + manage',
    label: 'Strategic retainer',
    bestFor: ['Leaders prioritizing continuous gains', 'Multi-workflow programs with evolving needs'],
    timeline: 'Monthly planning and optimization cycles',
    investment: 'Retainer with usage-based scaling',
    includes: [
      'Roadmap prioritization and execution',
      'Monitoring, iteration, and quality management',
      'Capacity planning for token and automation usage',
      'Executive reporting and growth recommendations',
    ],
    bestWhen: 'You want an AI operations partner focused on outcomes, not tickets.',
    ctaLabel: 'Start pilot',
    ctaHref: '/contact',
    popular: true,
  },
  {
    name: 'Train your team',
    label: 'Capability accelerator',
    bestFor: ['Organizations building internal AI fluency', 'Operators who need governance and implementation skills'],
    timeline: 'Structured workshop and coaching program',
    investment: 'Program-based advisory package',
    includes: [
      'Use-case prioritization and readiness assessment',
      'Governance, risk, and rollout frameworks',
      'Hands-on workflow design coaching',
      'Playbooks and implementation templates',
    ],
    bestWhen: 'You want to build internal capability before scaling implementation.',
    ctaLabel: 'Book call',
    ctaHref: getPrimaryCtaHref(),
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className={getSectionClasses('large', 'gradient')}>
        <div className={getContainerClasses('default')}>
          <div className='mx-auto max-w-4xl text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Pricing</p>
            <h1 className={`${TYPOGRAPHY.h2} mt-4`}>Flexible commercial models for real AI delivery.</h1>
            <p className='mt-4 text-lg text-muted-foreground'>
              Start with a free 30-minute consult. Then choose the engagement model that matches
              your urgency, ownership preferences, and operational maturity.
            </p>
          </div>
        </div>
      </section>

      <section className={getSectionClasses('default', 'default')}>
        <div className={getContainerClasses('default')}>
          <div className='grid gap-8 lg:grid-cols-3'>
            {engagementPaths.map(path => (
              <article
                key={path.name}
                className={`relative rounded-2xl border bg-card p-8 ${path.popular ? 'border-primary shadow-lg' : ''}`}
              >
                {path.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <span className='inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground'>
                      <Sparkles className='h-4 w-4' />
                      Recommended for ongoing impact
                    </span>
                  </div>
                )}
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-primary'>{path.label}</p>
                <h2 className='mt-3 text-2xl font-bold'>{path.name}</h2>
                <p className='mt-2 text-sm font-semibold text-primary'>{path.investment}</p>
                <p className='mt-1 text-sm text-muted-foreground'>{path.timeline}</p>

                <div className='mt-5'>
                  <h3 className='text-sm font-semibold'>Best for</h3>
                  <ul className='mt-2 space-y-2 text-sm text-muted-foreground'>
                    {path.bestFor.map(item => (
                      <li key={item} className='flex items-center gap-2'>
                        <Check className='h-4 w-4 text-primary' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='mt-5'>
                  <h3 className='text-sm font-semibold'>Includes</h3>
                  <ul className='mt-2 space-y-2 text-sm text-muted-foreground'>
                    {path.includes.map(item => (
                      <li key={item} className='flex items-start gap-2'>
                        <Check className='mt-0.5 h-4 w-4 text-primary' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className='mt-6 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground'>
                  <span className='font-semibold text-foreground'>Best when:</span> {path.bestWhen}
                </p>

                <Button asChild className='mt-6 w-full' size='lg'>
                  <Link href={path.ctaHref}>
                    {path.ctaLabel}
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={getSectionClasses('default', 'muted')}>
        <div className={`${getContainerClasses('default')} grid gap-8 lg:grid-cols-2`}>
          <article className='rounded-2xl border bg-card p-8'>
            <h2 className='text-2xl font-bold'>Pay per workflow</h2>
            <p className='mt-4 text-muted-foreground'>
              Need one high-impact automation quickly? Choose a one-off workflow engagement with a
              tightly scoped brief and a clear delivery plan.
            </p>
            <ul className='mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2'>
              {[
                'Lead qualification routing',
                'Document intake + extraction',
                'Tax operations workpack prep',
                'Client reporting automation',
                'Support triage flows',
              ].map(example => (
                <li key={example} className='rounded-lg border bg-muted/40 p-3'>
                  {example}
                </li>
              ))}
            </ul>
          </article>

          <article className='rounded-2xl border bg-card p-8'>
            <h2 className='text-2xl font-bold'>Usage-based scaling</h2>
            <p className='mt-4 text-muted-foreground'>
              As automation volume grows, we align pricing to capacity bands and model usage so you
              can scale responsibly without exposing raw token math.
            </p>
            <div className='mt-6 grid gap-3 text-sm'>
              <p className='rounded-lg border bg-muted/40 p-3'>
                Included: baseline workflow capacity and monitoring guardrails.
              </p>
              <p className='rounded-lg border bg-muted/40 p-3'>
                Expandable: higher throughput, additional models, and priority support.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={getSectionClasses('default', 'default')}>
        <div className={getContainerClasses('narrow')}>
          <article className='rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center'>
            <h2 className='text-2xl font-bold'>Start with a free 30-minute consult</h2>
            <p className='mt-4 text-muted-foreground'>
              We&apos;ll map your current workflow, recommend the smallest practical engagement, and
              outline clear next steps.
            </p>
            <div className='mt-6 flex flex-col justify-center gap-3 sm:flex-row'>
              <Button asChild size='lg'>
                <a href={getPrimaryCtaHref()}>Book call</a>
              </Button>
              <Button asChild size='lg' variant='outline'>
                <Link href='/contact'>Request proposal</Link>
              </Button>
              <Button asChild size='lg' variant='outline'>
                <Link href='/contact'>Start pilot</Link>
              </Button>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
