import type { Metadata } from 'next';

import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { whyWeSayNoSections } from '@/src/content/moat';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Why We Say No | AI Automated Systems',
  description: 'Our criteria for declining work, avoiding AI misuse, and recommending in-house execution when appropriate.',
  canonical: '/why-we-say-no',
});

export default function WhyWeSayNoPage() {
  return (
    <>
      <PageHero
        eyebrow='Trust boundary'
        title='Why We Say No'
        description='Clear criteria for declines, misuse prevention, and situations where internal hiring is the better path.'
      />
      <PageSection width='narrow'>
        <div className='space-y-6'>
          {whyWeSayNoSections.map(section => (
            <SurfaceCard key={section.title}>
              <h2 className='text-2xl font-bold'>{section.title}</h2>
              <ul className='mt-4 space-y-2 text-muted-foreground'>
                {section.points.map(point => <li key={point}>• {point}</li>)}
              </ul>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
