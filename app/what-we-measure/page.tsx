import type { Metadata } from 'next';
import Link from 'next/link';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';

const metrics = [
  {
    title: 'Reliability',
    points: [
      'Workflow completion consistency under real operating load.',
      'Exception handling quality and mean-time-to-recovery.',
    ],
  },
  {
    title: 'Evaluation integrity',
    points: [
      'Coverage of critical business paths in pre-release checks.',
      'Drift monitoring for prompt, retrieval, and model changes.',
    ],
  },
  {
    title: 'Cost discipline',
    points: [
      'Unit economics by workflow stage and model class.',
      'Tradeoff visibility between latency, quality, and spend.',
    ],
  },
];

export const metadata: Metadata = generateSEOMetadata({
  title: 'What We Measure | AI Automated Systems',
  description:
    'How AIAS measures reliability, evaluation integrity, and cost discipline for governed AI systems.',
  canonical: '/what-we-measure',
});

export default function WhatWeMeasurePage() {
  return (
    <>
      <PageHero
        eyebrow='Measurement discipline'
        title='What We Measure'
        description='AIAS helps organizations that need reliable, auditable automation outcomes. We measure performance using business-aware reliability, evaluation integrity, and cost controls. Discovery comes first to ensure metrics reflect real operational constraints instead of vanity dashboards.'
      />
      <PageSection>
        <div className='grid gap-6 md:grid-cols-3'>
          {metrics.map(metric => (
            <SurfaceCard key={metric.title} className='p-6'>
              <h2 className='text-xl font-semibold'>{metric.title}</h2>
              <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                {metric.points.map(point => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
      <PageSection background='muted'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Related pages</h2>
          <div className='mt-4 flex flex-wrap gap-3 text-sm'>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/work'>Proof</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/diagnostic'>Diagnostic</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/framework'>Framework</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/services'>Services</Link>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
