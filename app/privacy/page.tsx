import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';

import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy | AI Automated Systems',
  description:
    'Learn how AI Automated Systems collects, uses, and safeguards data for consulting engagements and website visitors.',
  canonical: '/privacy',
});

export default function PrivacyPage() {
  const { privacy } = siteContent.legal;

  return (
    <>
      <PageHero
        eyebrow='Legal'
        title={privacy.title}
        description={`Last updated: ${privacy.lastUpdated}`}
      />

      <PageSection>
        <div className='space-y-6'>
          {privacy.sections.map(section => (
            <SurfaceCard key={section.heading}>
              <h2 className='text-2xl font-semibold'>{section.heading}</h2>
              <p className='mt-3 text-muted-foreground'>{section.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageCta
        title='Questions about data handling?'
        description='Book a strategy call or contact us directly for engagement-specific privacy and governance details.'
        primary={{ label: siteContent.positioning.primaryCTA.label, href: getPrimaryCtaHref() }}
        secondary={{ label: 'Contact team', href: '/contact' }}
      />
    </>
  );
}
