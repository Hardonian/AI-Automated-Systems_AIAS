import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';

import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { FAQSchema } from '@/components/seo/structured-data';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'How It Works | AI Automated Systems',
  description: 'System transparency page covering tooling stack, governance, security, and deployment models.',
  canonical: '/how-it-works',
});

export default function HowItWorksPage() {
  return (
    <>
      <FAQSchema faqs={siteContent.faq.slice(0, 4)} />
      <PageHero
        eyebrow={siteContent.howItWorksPage.hero.eyebrow}
        title={siteContent.howItWorksPage.hero.title}
        description={siteContent.howItWorksPage.hero.description}
      />

      <PageSection>
        <p className='mb-6 max-w-3xl text-sm text-muted-foreground'>
          AIAS helps operations, product, and leadership teams that need reliable AI outcomes without governance blind spots.
          We use a structured diagnostic framework to map decisions, constraints, and failure paths before implementation.
          The result is a delivery plan tied to business outcomes, with discovery first so architecture choices are evidence-based.
        </p>
        <div className='mb-6 flex flex-wrap gap-3 text-sm'>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/services'>Services</Link>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/framework'>Framework</Link>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/work'>Proof</Link>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/contact'>Start intake</Link>
        </div>
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
