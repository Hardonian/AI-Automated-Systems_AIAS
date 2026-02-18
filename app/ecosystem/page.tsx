import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { FAQSchema } from '@/components/seo/structured-data';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Ecosystem Architecture | AI Automated Systems',
  description:
    'AIAS ecosystem architecture connecting advisory, Reach, Zeo, and Settler with deterministic governance and deployment models.',
  canonical: '/ecosystem',
});

const lifecycle = ['Strategy', 'Design', 'Build', 'Automate', 'Govern', 'Scale'];

export default function EcosystemPage() {
  return (
    <>
      <FAQSchema faqs={siteContent.routeFaqs.ecosystem} />
      <PageHero
        eyebrow='Ecosystem architecture'
        title='How AIAS connects strategy to reliable automation delivery'
        description='The ecosystem aligns advisory, implementation, and deployment operations without sacrificing deterministic controls.'
      />

      <PageSection>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Layered system diagram</h2>
          <svg aria-label='Ecosystem architecture flow diagram' className='mt-6 w-full' viewBox='0 0 900 180'>
            {['Client', 'AIAS Advisory', 'Reach', 'Zeo', 'Settler'].map((node, index) => (
              <g key={node} transform={`translate(${20 + index * 175},40)`}>
                <rect fill='none' height='90' rx='10' stroke='currentColor' strokeWidth='2' width='150' />
                <text fontSize='16' textAnchor='middle' x='75' y='52'>{node}</text>
                {index < 4 ? <text fontSize='28' x='160' y='56'>→</text> : null}
              </g>
            ))}
          </svg>
        </SurfaceCard>
      </PageSection>

      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Automation lifecycle</h2>
            <ol className='mt-4 space-y-2 text-muted-foreground'>
              {lifecycle.map((step, index) => (
                <li key={step}>{index + 1}. {step}</li>
              ))}
            </ol>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Determinism vs intelligence</h2>
            <p className='mt-4 text-muted-foreground'>
              Deterministic systems own state transitions, validation, and policy enforcement. Intelligence layers propose,
              summarize, and optimize within strict contracts. The result is explainable automation with controlled risk.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Deployment models</h2>
            <ul className='mt-4 space-y-2 text-muted-foreground'>
              <li>• Self-hosted: full infrastructure control and custom compliance boundaries.</li>
              <li>• Managed: AIAS operates delivery with agreed service and governance terms.</li>
              <li>• Federated: shared control across teams or regulated entities with policy inheritance.</li>
            </ul>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Governance principles</h2>
            <ul className='mt-4 space-y-2 text-muted-foreground'>
              <li>• Policy before execution.</li>
              <li>• Human review for high-impact actions.</li>
              <li>• Auditable run artifacts and deterministic replay.</li>
              <li>• Explicit non-fit criteria to avoid unsafe deployments.</li>
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>
    </>
  );
}
