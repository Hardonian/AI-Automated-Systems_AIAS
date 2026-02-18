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

      <PageSection background='muted'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Deterministic vs AI boundaries</h2>
          <div className='mt-6 grid gap-4'>
            {siteContent.howItWorksPage.boundaryModel.map(boundary => (
              <article key={boundary.layer} className='rounded-xl border bg-background/70 p-5'>
                <h3 className='text-lg font-semibold'>{boundary.layer}</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  <span className='font-semibold text-foreground'>Deterministic:</span>{' '}
                  {boundary.deterministicBoundary}
                </p>
                <p className='mt-2 text-sm text-muted-foreground'>
                  <span className='font-semibold text-foreground'>AI-assisted:</span> {boundary.aiBoundary}
                </p>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
