import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI Systems Readiness Checklist | AI Automated Systems',
  description: 'Download a practical checklist for deterministic + AI system readiness. Email is optional.',
  canonical: '/readiness-checklist',
});

export default function ReadinessChecklistPage() {
  return (
    <>
      <PageHero
        eyebrow='Lead magnet'
        title='AI Systems Readiness Checklist'
        description='Download the framework immediately. Optionally include an email if you want implementation feedback.'
      />
      <PageSection width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Download now</h2>
          <p className='mt-3 text-muted-foreground'>No backend form and no mandatory email gate. This is a direct static asset.</p>
          <a className='mt-6 inline-block font-semibold text-primary underline underline-offset-4' download href='/downloads/ai-systems-readiness-checklist.md'>
            Download checklist (.md)
          </a>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
