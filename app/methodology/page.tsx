import type { Metadata } from 'next';

import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { methodologySections } from '@/src/content/moat';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Methodology | AI Automated Systems',
  description: 'Technical methodology for deterministic AI execution, governance, and deployment models.',
  canonical: '/methodology',
});

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        eyebrow='Methodology whitepaper'
        title='Public Methodology'
        description='A systems-first operating method for enterprise AI delivery with deterministic control boundaries.'
      />

      <PageSection width='narrow'>
        <div className='space-y-6'>
          {methodologySections.map(section => (
            <SurfaceCard key={section.title}>
              <h2 className='text-2xl font-bold'>{section.title}</h2>
              <p className='mt-3 text-muted-foreground'>{section.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
