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

export default function EcosystemPage() {
  return (
    <>
      <FAQSchema faqs={siteContent.routeFaqs.ecosystem} />
      <PageHero
        eyebrow={siteContent.ecosystemPage.hero.eyebrow}
        title={siteContent.ecosystemPage.hero.title}
        description={siteContent.ecosystemPage.hero.description}
      />

      <PageSection>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>{siteContent.ecosystemPage.diagram.title}</h2>
          <svg aria-label='Ecosystem architecture flow diagram' className='mt-6 w-full' viewBox='0 0 900 180'>
            {siteContent.ecosystemPage.diagram.nodes.map((node, index) => (
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
              {siteContent.ecosystemPage.lifecycle.map((step, index) => (
                <li key={step}>{index + 1}. {step}</li>
              ))}
            </ol>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>{siteContent.ecosystemPage.narrative.determinismVsIntelligence.title}</h2>
            <p className='mt-4 text-muted-foreground'>
              {siteContent.ecosystemPage.narrative.determinismVsIntelligence.body}
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>{siteContent.ecosystemPage.narrative.deploymentModels.title}</h2>
            <ul className='mt-4 space-y-2 text-muted-foreground'>
              {siteContent.ecosystemPage.narrative.deploymentModels.items.map(item => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>{siteContent.ecosystemPage.narrative.governancePrinciples.title}</h2>
            <ul className='mt-4 space-y-2 text-muted-foreground'>
              {siteContent.ecosystemPage.narrative.governancePrinciples.items.map(item => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>
    </>
  );
}
