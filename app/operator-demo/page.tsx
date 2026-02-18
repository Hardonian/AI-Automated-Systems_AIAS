import type { Metadata } from 'next';

import { OperatorConsole } from '@/components/content/operator-console';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { operatorMockLeads } from '@/src/content/moat';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Operator Demo | AI Automated Systems',
  description: 'Sanitized public demo of the AIAS operator console using mock pipeline data.',
  canonical: '/operator-demo',
});

export default function OperatorDemoPage() {
  return (
    <>
      <PageHero
        eyebrow='Public demo'
        title='Operator Console Demo'
        description='Sanitized concept preview. This page uses static mock records and does not expose client data.'
      />
      <PageSection width='narrow'>
        <SurfaceCard>
          <p className='text-sm text-muted-foreground'>Demo mode is read-only and intentionally excludes production account identifiers.</p>
        </SurfaceCard>
      </PageSection>
      <PageSection>
        <OperatorConsole initialLeads={operatorMockLeads} readOnly />
      </PageSection>
    </>
  );
}
