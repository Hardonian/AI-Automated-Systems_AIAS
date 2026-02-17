import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';

import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Terms of Service | AI Automated Systems',
  description:
    'Review the terms that govern AI Automated Systems consulting engagements and deliverables.',
  canonical: '/terms',
});

export default function TermsPage() {
  const { terms } = siteContent.legal;

  return (
    <>
      <PageHero
        eyebrow='Legal'
        title={terms.title}
        description={`Last updated: ${terms.lastUpdated}`}
      />

      <PageSection>
        <div className='space-y-6'>
          {terms.sections.map(section => (
            <SurfaceCard key={section.heading}>
              <h2 className='text-2xl font-semibold'>{section.heading}</h2>
              <p className='mt-3 text-muted-foreground'>{section.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageCta
        title='Need contract clarity before kickoff?'
        description='Use a strategy call to review scope, delivery boundaries, and governance expectations before signing.'
        primary={{ label: siteContent.positioning.primaryCTA.label, href: getPrimaryCtaHref() }}
        secondary={{ label: 'Request proposal', href: '/contact' }}
      />
    </>
  );
}
