import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Automation Demo | AI Automated Systems',
  description: 'Safe static demo of intake classification, system execution flow, and governance checkpoints.',
  canonical: '/automation-demo',
});

const mockFlow = [
  { stage: 'Intake', detail: 'Mock prospect submits workflow constraints and goals.' },
  { stage: 'Classification', detail: 'Deterministic rules assign advisory, co-build, managed, or enterprise path.' },
  { stage: 'System Execution', detail: 'Execution blueprint generated with policy gates and fallback controls.' },
  { stage: 'Governance Review', detail: 'Human review required before any high-impact rollout.' },
];

export default function AutomationDemoPage() {
  return (
    <>
      <PageHero
        eyebrow='Automation demo'
        title='Safe walkthrough: intake to governed execution'
        description='This static demo uses mock data to show how AIAS architecture routes demand into deterministic delivery paths.'
      />
      <PageSection>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Architecture diagram</h2>
          <svg aria-label='Intake execution governance diagram' className='mt-6 w-full' viewBox='0 0 800 120'>
            {mockFlow.map((item, index) => (
              <g key={item.stage} transform={`translate(${10 + index * 195},20)`}>
                <rect fill='none' height='80' rx='10' stroke='currentColor' strokeWidth='2' width='180' />
                <text fontSize='14' textAnchor='middle' x='90' y='34'>{item.stage}</text>
                {index < mockFlow.length - 1 ? <text fontSize='24' x='186' y='45'>→</text> : null}
              </g>
            ))}
          </svg>
        </SurfaceCard>
      </PageSection>
      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          {mockFlow.map((item) => (
            <SurfaceCard key={item.stage}>
              <h2 className='text-xl font-bold'>{item.stage}</h2>
              <p className='mt-3 text-muted-foreground'>{item.detail}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
