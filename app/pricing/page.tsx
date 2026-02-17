import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Pricing | AI Automated Systems',
  description:
    'Flexible AIAS engagement models including workflow builds, strategic retainers, managed delivery, and team enablement.',
  canonical: '/pricing',
});

type EngagementShape = {
  title: string;
  description: string;
  bestFor: string;
  outcomes: string[];
  ctaLabel: string;
  ctaHref: string;
};

const engagementShapes: EngagementShape[] = [
  {
    title: 'Consultation',
    description: 'Short advisory engagement to map priorities and define your first practical workflow.',
    bestFor: 'Teams that need strategic clarity before implementation.',
    outcomes: ['Current-state workflow review', 'Risk + readiness assessment', 'Prioritized rollout brief'],
    ctaLabel: 'Book consultation',
    ctaHref: getPrimaryCtaHref(),
  },
  {
    title: 'Pilot',
    description: 'Focused implementation to prove value in one workflow with measurable outcomes.',
    bestFor: 'Leaders validating ROI before broader expansion.',
    outcomes: ['Deterministic workflow build', 'Launch checklist and QA', 'Handoff docs + operator training'],
    ctaLabel: 'Start pilot discussion',
    ctaHref: '/contact',
  },
  {
    title: 'Managed / Retainer',
    description: 'Ongoing partnership for optimization, governance, and multi-workflow scaling.',
    bestFor: 'Organizations treating automation as a core operating capability.',
    outcomes: ['Monthly roadmap and delivery cycles', 'Monitoring + quality controls', 'Executive reporting and iteration'],
    ctaLabel: 'Discuss managed model',
    ctaHref: '/contact',
  },
  {
    title: 'Enablement & Training',
    description: 'Capability-building program for internal teams responsible for long-term ownership.',
    bestFor: 'Teams that want in-house execution strength and governance fluency.',
    outcomes: ['Role-based workshops', 'Governance playbooks', 'Coached implementation sprints'],
    ctaLabel: 'Plan team enablement',
    ctaHref: '/contact',
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow='Engagement shapes'
        title='Flexible commercial models that match your stage'
        description='We scope by outcomes and operating context, not rigid fixed-price tiers. Start small, validate quickly, then scale with the support level your team needs.'
      />

      <PageSection>
        <div className='grid gap-6 lg:grid-cols-2'>
          {engagementShapes.map(shape => (
            <SurfaceCard key={shape.title} className='p-7'>
              <h2 className='text-2xl font-bold'>{shape.title}</h2>
              <p className='mt-3 text-muted-foreground'>{shape.description}</p>
              <p className='mt-4 text-sm font-semibold text-primary'>Best for: {shape.bestFor}</p>
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
          <h2 className='text-2xl font-bold'>How we scope investment</h2>
          <p className='mt-4 text-muted-foreground'>
            Pricing is based on workflow complexity, integration depth, governance requirements,
            and the level of ongoing support. We share clear scope boundaries before work begins.
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
