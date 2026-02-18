import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'How It Works | AI Automated Systems',
  description: 'System transparency page covering tooling stack, governance, security, and deployment models.',
  canonical: '/how-it-works',
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow={siteContent.howItWorksPage.hero.eyebrow}
        title={siteContent.howItWorksPage.hero.title}
        description={siteContent.howItWorksPage.hero.description}
      />

      <PageSection>
        <div className='grid gap-6 lg:grid-cols-2'>
          {siteContent.howItWorksPage.sections.map(section => (
            <SurfaceCard key={section.title}>
              <h2 className='text-2xl font-bold'>{section.title}</h2>
              <p className='mt-3 text-muted-foreground'>{section.description}</p>
              <ul className='mt-4 space-y-2 text-sm text-muted-foreground'>
                {section.bullets.map(bullet => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
