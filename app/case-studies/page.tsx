import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Case Studies | AI Automated Systems',
  description:
    'Review measurable outcomes from AIAS automation engagements across operations and support workflows.',
};

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
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <h2 className='text-2xl font-semibold'>{study.title}</h2>
                <Image
                  alt={`${study.client} logo`}
                  className='h-10 w-auto'
                  height={40}
                  src={study.logoSrc}
                  width={150}
                />
              </div>
              <p className='mt-2 text-sm text-muted-foreground'>Client: {study.client}</p>
              <p className='mt-4 text-muted-foreground'>{study.challenge}</p>
              <p className='mt-2'>{study.solution}</p>
              <ul className='mt-4 flex flex-wrap gap-2'>
                {study.results.map(result => (
                  <li key={result} className='rounded-full border px-3 py-1 text-sm'>
                    {result}
                  </li>
                ))}
              </ul>
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
    </section>
  );
}
