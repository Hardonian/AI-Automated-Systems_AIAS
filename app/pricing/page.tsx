import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Engagement Models | AI Automated Systems',
  description:
    'Value-based AIAS engagement models covering one-off workflow delivery, co-build execution, and managed system refinement.',
  canonical: '/pricing',
});

type EngagementShape = {
  title: string;
  description: string;
  bestFor: string;
  outcomes: string[];
  ctaLabel: string;
  ctaHref: string;
  timeline: string;
};

const engagementShapes: EngagementShape[] = [
  {
    title: 'One-off workflow',
    description: 'Focused architecture and implementation for a single high-value workflow.',
    bestFor: 'Teams that need one production-grade automation outcome quickly.',
    outcomes: ['Constraint mapping and success criteria', 'Deterministic build with QA', 'Operational handoff package'],
    ctaLabel: 'Scope one-off workflow',
    ctaHref: '/contact',
    timeline: '2-4 weeks depending on integration complexity.',
  },
  {
    title: 'Co-build',
    description: 'Shared sprint model where AIAS and your team build together with clear ownership.',
    bestFor: 'Technical teams that want transfer of capability while shipping.',
    outcomes: ['Sprint roadmap with checkpoints', 'Policy and governance controls', 'Enablement for internal operators'],
    ctaLabel: 'Plan co-build sprint',
    ctaHref: '/contact',
    timeline: '4-8 weeks for initial system and adoption workflow.',
  },
  {
    title: 'Managed refinement',
    description: 'Ongoing optimization program for reliability, governance, and scale.',
    bestFor: 'Organizations running automation as a core operating function.',
    outcomes: ['Monthly optimization cycles', 'Governance and risk reviews', 'Performance and change reporting'],
    ctaLabel: 'Discuss managed refinement',
    ctaHref: '/contact',
    timeline: 'Quarterly planning cycles with monthly execution cadence.',
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow='Engagement models'
        title='Value-based engagement packaging with explicit scoping'
        description='No arbitrary fixed-price anchors. We scope based on workflow criticality, governance obligations, and integration depth.'
      />

      <PageSection>
        <div className='grid gap-6 lg:grid-cols-3'>
          {engagementShapes.map(shape => (
            <SurfaceCard key={shape.title} className='p-7'>
              <h2 className='text-2xl font-bold'>{shape.title}</h2>
              <p className='mt-3 text-muted-foreground'>{shape.description}</p>
              <p className='mt-4 text-sm font-semibold text-primary'>Best for: {shape.bestFor}</p>
              <p className='mt-2 text-xs text-muted-foreground'>Typical timeline: {shape.timeline}</p>
              <ul className='mt-5 space-y-2 text-sm text-muted-foreground'>
                {shape.outcomes.map(item => (
                  <li key={item} className='flex items-start gap-2'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className='mt-6' size='lg'>
                <Link href={shape.ctaHref}>
                  {shape.ctaLabel}
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background='muted' width='narrow'>
        <SurfaceCard className='text-center'>
          <h2 className='text-2xl font-bold'>Scoping and risk clarity</h2>
          <p className='mt-4 text-muted-foreground'>
            Every engagement starts with constraints, non-fit criteria, and acceptance conditions. We document timeline assumptions before execution begins.
          </p>
          <div className='mt-6 flex flex-col justify-center gap-3 sm:flex-row'>
            <Button asChild size='lg'>
              <a href={getPrimaryCtaHref()}>Book strategy call</a>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/contact'>Request scoped proposal</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
