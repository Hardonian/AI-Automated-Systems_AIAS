import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Work | AI Automated Systems',
  description:
    'Explore our portfolio of successful automation engagements and client outcomes.',
  canonical: '/work',
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow='Client outcomes'
        title='Work that ships and scales'
        description='Each engagement starts with workflow mapping, then moves into deterministic implementation and measurable operational outcomes.'
      />

      <PageSection>
        <div className='grid gap-8'>
          {siteContent.caseStudies.map(study => (
            <SurfaceCard key={study.title} className='overflow-hidden p-0'>
              <Image
                alt={`${study.client} case study thumbnail`}
                className='h-auto w-full border-b object-cover'
                height={630}
                sizes='(max-width: 768px) 100vw, 1200px'
                src={study.thumbnailSrc}
                width={1200}
              />
              <div className='p-8'>
                <h2 className='text-2xl font-bold'>{study.title}</h2>
                <p className='mt-3 text-muted-foreground'>{study.solution}</p>
                <ul className='mt-5 space-y-2 text-sm text-muted-foreground'>
                  {study.results.map(result => (
                    <li key={result}>• {result}</li>
                  ))}
                </ul>
                <Link
                  className='mt-5 inline-block font-semibold text-primary underline'
                  href={study.projectUrl}
                  rel='noreferrer'
                  target='_blank'
                >
                  Visit project
                </Link>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageCta
        title='Need outcomes like these?'
        description='Start with a strategy call, then we will map the smallest practical rollout for your team.'
        primary={{ label: siteContent.positioning.primaryCTA.label, href: getPrimaryCtaHref() }}
        secondary={{ label: 'Request proposal', href: '/contact' }}
      />
    </>
  );
}
