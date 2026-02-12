import type { Metadata } from 'next';
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
      <div className='space-y-6'>
        {siteContent.caseStudies.map(study => (
          <article key={study.title} className='rounded-xl border bg-card p-6'>
            <h2 className='text-2xl font-semibold'>{study.title}</h2>
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
            <Link className='mt-4 inline-block font-semibold text-primary underline' href={study.projectUrl} target='_blank' rel='noreferrer'>
              Visit project
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
