import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dashboard | AI Automated Systems',
  description: 'Protected workspace entry for client and team operations.',
  canonical: '/dashboard',
});

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow='Client workspace'
        title='Dashboard access is invite-only'
        description='This workspace is reserved for authenticated client and team sessions. Request access to begin onboarding.'
      />

      <PageSection>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>No active session detected</h2>
          <p className='mt-3 max-w-2xl text-muted-foreground'>
            We provision dashboard access after kickoff so each workspace maps to current engagements and governance controls.
          </p>
        </SurfaceCard>
      </PageSection>

      <PageCta
        title='Request dashboard access'
        description='Book a strategy call and we will confirm fit, kickoff scope, and workspace provisioning steps.'
        primary={{ label: 'Request access / book a call', href: getPrimaryCtaHref() }}
        secondary={{ label: 'Contact team', href: '/contact' }}
      />
    </>
  );
}
