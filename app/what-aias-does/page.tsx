import type { Metadata } from 'next';
import Link from 'next/link';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateSEOMetadata({
  title: 'What AIAS Actually Does | AI Automated Systems',
  description:
    'Concrete AIAS capability map and engagement formats for deterministic AI governance, control-plane architecture, evaluation integrity, and enterprise-safe operations.',
  canonical: '/what-aias-does',
});

const capabilityMap = [
  {
    title: 'Governance',
    points: ['Policy-first execution rules', 'Risk tiering and escalation logic', 'Audit-ready run artifacts'],
  },
  {
    title: 'Agent Infra',
    points: ['Agent orchestration and tool contracts', 'Deterministic routing before execution', 'Fallback and human review paths'],
  },
  {
    title: 'Eval + RAG',
    points: ['Evaluation integrity scorecards', 'Grounded retrieval patterns', 'Regression checks before rollout'],
  },
  {
    title: 'FinOps',
    points: ['Model and token cost visibility', 'Multi-model routing optimization', 'Budget-aware execution controls'],
  },
  {
    title: 'Growth Autopilot',
    points: ['Lead intake classification', 'Proposal and scope acceleration', 'Conversion loop instrumentation'],
  },
  {
    title: 'Ops Autopilot',
    points: ['Exception triage and response', 'Incident replay and postmortems', 'Operational readiness checkpoints'],
  },
];

const engagements = [
  {
    name: 'Diagnostic',
    description: 'Rapid system diagnosis to map failure modes, governance gaps, and ROI opportunities.',
  },
  {
    name: 'Architecture Sprint',
    description: 'Time-boxed design sprint for control-plane boundaries, orchestration flows, and rollout criteria.',
  },
  {
    name: 'Control-Plane Implementation',
    description: 'Build and deploy deterministic controls around multi-model, multi-agent workflows.',
  },
  {
    name: 'Agent Fleet Stabilization',
    description: 'Stabilize production agents with evaluation hardening, cost controls, and operating playbooks.',
  },
];

export default function WhatAiasDoesPage() {
  return (
    <>
      <PageHero
        eyebrow='Authority model'
        title='What AIAS actually does'
        description='AIAS is a control-plane and governance architecture partner for teams running high-stakes AI systems. We do not sell prompt tinkering or generic automation gigs.'
      />

      <PageSection>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Capability map</h2>
          <div className='mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {capabilityMap.map((capability) => (
              <article key={capability.title} className='rounded-xl border bg-muted/30 p-4'>
                <h3 className='text-lg font-semibold'>{capability.title}</h3>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                  {capability.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </PageSection>

      <PageSection background='muted'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Control-plane architecture</h2>
          <p className='mt-3 text-muted-foreground'>Simple architecture view of how governance and orchestration map into growth and operations autopilot loops.</p>
          <div className='mt-6 overflow-hidden rounded-xl border bg-slate-950 p-4 text-slate-100'>
            <svg viewBox='0 0 960 420' className='h-auto w-full' role='img' aria-label='AIAS control-plane architecture diagram'>
              <rect width='960' height='420' rx='24' fill='#0B1020' />
              <text x='40' y='48' fill='#E5E7EB' fontSize='22' fontWeight='700'>AIAS Control-Plane Architecture</text>
              <text x='40' y='72' fill='#9CA3AF' fontSize='13'>Deterministic governance governs execution, eval integrity, and cost controls.</text>
              <rect x='36' y='98' width='168' height='72' rx='12' fill='#1F2937' stroke='#374151' />
              <rect x='232' y='98' width='168' height='72' rx='12' fill='#1F2937' stroke='#374151' />
              <rect x='428' y='98' width='168' height='72' rx='12' fill='#1F2937' stroke='#374151' />
              <rect x='624' y='98' width='140' height='72' rx='12' fill='#1F2937' stroke='#374151' />
              <rect x='792' y='98' width='132' height='72' rx='12' fill='#1F2937' stroke='#374151' />
              <text x='52' y='126' fill='#F9FAFB' fontSize='14' fontWeight='700'>Governance</text>
              <text x='248' y='126' fill='#F9FAFB' fontSize='14' fontWeight='700'>Agent Infra</text>
              <text x='444' y='126' fill='#F9FAFB' fontSize='14' fontWeight='700'>Eval + RAG</text>
              <text x='640' y='126' fill='#F9FAFB' fontSize='14' fontWeight='700'>FinOps</text>
              <text x='808' y='126' fill='#F9FAFB' fontSize='14' fontWeight='700'>Readiness</text>
              <rect x='36' y='220' width='420' height='150' rx='14' fill='#111827' stroke='#374151' />
              <rect x='504' y='220' width='420' height='150' rx='14' fill='#111827' stroke='#374151' />
              <text x='56' y='252' fill='#F9FAFB' fontSize='15' fontWeight='700'>Growth Autopilot</text>
              <text x='524' y='252' fill='#F9FAFB' fontSize='15' fontWeight='700'>Ops Autopilot</text>
            </svg>
          </div>
        </SurfaceCard>
      </PageSection>

      <PageSection>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Engagement formats</h2>
          <div className='mt-6 grid gap-4 md:grid-cols-2'>
            {engagements.map((engagement) => (
              <article key={engagement.name} className='rounded-xl border p-4'>
                <h3 className='text-lg font-semibold'>{engagement.name}</h3>
                <p className='mt-2 text-sm text-muted-foreground'>{engagement.description}</p>
              </article>
            ))}
          </div>
          <div className='mt-7 flex flex-wrap gap-3'>
            <Button asChild><Link href='/book'>Book Diagnostic</Link></Button>
            <Button asChild variant='outline'><Link href='/contact'>Request Architecture Review</Link></Button>
            <Button asChild variant='outline'><Link href='/readiness-checklist'>Download Governance Checklist</Link></Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
