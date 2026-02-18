import type { Metadata } from 'next';
import Link from 'next/link';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { getPrimaryCtaHref } from '@/src/content/site';
import { caseStudies } from '@/src/content/caseStudies';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Case Studies | AI Automated Systems',
  description:
    'Structured automation case studies covering website automation, app orchestration, and hybrid deterministic + AI SaaS systems.',
  canonical: '/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow='Case studies'
        title='Systems-first implementation evidence'
        description='Each case study documents problem constraints, architecture decisions, governance controls, and long-term scalability outcomes.'
      />

      <PageSection>
        <div className='grid gap-6 md:grid-cols-3'>
          {caseStudies.map((study) => (
            <SurfaceCard key={study.slug}>
              <h2 className='text-xl font-bold'>{study.title}</h2>
              <p className='mt-3 text-muted-foreground'>{study.summary}</p>
              <Link className='mt-6 inline-block font-semibold text-primary underline underline-offset-4' href={`/case-studies/${study.slug}`}>
                Open case study
              </Link>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageCta
        title='Need a similar system architecture outcome?'
        description='We scope engagements based on constraints, governance obligations, and operational risk tolerance.'
        primary={{ label: 'Book strategy call', href: getPrimaryCtaHref() }}
        secondary={{ label: 'View ecosystem architecture', href: '/ecosystem' }}
      />
    </>
  );
}
