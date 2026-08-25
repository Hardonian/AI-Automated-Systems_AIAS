import type { Metadata } from 'next';

import { EngagementSimulator } from '@/components/content/engagement-simulator';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { WebApplicationSchema } from '@/components/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Engagement Simulator | AI Automated Systems',
  description: 'Self-serve walkthrough to generate a deterministic AIAS engagement brief.',
  canonical: '/engagement-simulator',
});

export default function EngagementSimulatorPage() {
  return (
    <>
      <WebApplicationSchema
        name="AIAS Engagement Simulator"
        description="Self-serve walkthrough to model scope and generate a deterministic AIAS engagement brief."
        url="https://aiautomatedsystems.ca/engagement-simulator"
        applicationCategory="BusinessApplication"
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: 'Tools', href: '/automation-demo' },
            { label: 'Engagement Simulator' },
          ]}
        />
      </div>

      <PageHero
        eyebrow='Self-serve qualification'
        title='Engagement Simulator'
        description='Assess current state, risk profile, and outcomes to generate a structured engagement brief.'
      />


      <PageSection width='narrow'>
        <EngagementSimulator />
      </PageSection>

      <PageSection width='narrow' background='muted'>
        <SurfaceCard>
          <h2 className='text-xl font-bold'>Optional next step</h2>
          <p className='mt-2 text-sm text-muted-foreground'>Bring your generated brief to a strategy call or email it to inquiries@aiautomatedsystems.ca. No signup is required.</p>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
