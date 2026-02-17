import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import Image from 'next/image';
import Link from 'next/link';

import { CaseStudyTemplate } from '@/components/content/case-study-template';
import { FAQSection } from '@/components/content/faq-section';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Case Studies | AI Automated Systems',
  description:
    'Review measurable outcomes from AIAS automation engagements across operations and support workflows.',
  canonical: '/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <section className='container py-16'>
      <header className='mb-10 space-y-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Case studies
        </p>
        <h1 className='text-4xl font-bold'>Proof of impact</h1>
      </header>
      <div className='space-y-8'>
        {siteContent.caseStudies.map(study => (
          <article key={study.title} className='overflow-hidden rounded-xl border bg-card'>
            <Image
              alt={`${study.client} case study thumbnail`}
              className='h-auto w-full border-b object-cover'
              height={630}
              priority
              src={study.thumbnailSrc}
              width={1200}
            />
            <div className='p-6'>
              <div className='mb-4 flex justify-end'>
                <Image
                  alt={`${study.client} logo`}
                  className='h-10 w-auto'
                  height={40}
                  src={study.logoSrc}
                  width={150}
                />
              </div>
              <CaseStudyTemplate
                anonymized={study.client.toLowerCase().includes('organization')}
                challenge={study.challenge}
                clientLabel={study.client}
                results={study.results}
                solution={study.solution}
                title={study.title}
              />
              <Link
                className='mt-4 inline-block font-semibold text-primary underline'
                href={study.projectUrl}
                rel='noreferrer'
                target='_blank'
              >
                Visit project
              </Link>
            </div>
          </article>
        ))}
      </div>
      <FAQSection
        entries={siteContent.faq.slice(0, 3)}
        subtitle='Common questions about our delivery model and case-study documentation approach.'
        title='Case study FAQs'
      />
    </section>
  );
}
