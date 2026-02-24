import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { CaseStudySchema } from '@/components/seo/structured-data';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';
import { caseStudies } from '@/src/content/caseStudies';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Work | AI Automated Systems',
  description:
    'Explore our portfolio of successful automation engagements and client outcomes.',
  canonical: '/work',
});

export default function WorkPage() {
  return (
    <>
      {caseStudies.map(study => (
        <CaseStudySchema
          key={study.slug}
          description={study.summary}
          title={study.title}
          url={`https://aiautomatedsystems.ca/case-studies/${study.slug}`}
        />
      ))}
      <PageHero
        eyebrow='Client outcomes'
        title='Work that ships and scales'
        description='Each engagement starts with workflow mapping, then moves into deterministic implementation and measurable operational outcomes.'
      />

      <PageSection>
        <p className='mb-6 max-w-3xl text-sm text-muted-foreground'>
          AIAS helps teams that need measurable reliability and governance improvements from AI-enabled operations.
          These representative engagement scenarios show how discovery-first planning translates into faster throughput and tighter control.
          Outcomes are framed around operational metrics, not vanity adoption numbers.
        </p>
        <div className='mb-6 flex flex-wrap gap-3 text-sm'>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/services'>Services</Link>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/framework'>Framework</Link>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/what-we-measure'>What we measure</Link>
          <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/contact'>Start intake</Link>
        </div>
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
