import type { Metadata } from 'next';

import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Terms of Service | AI Automated Systems',
  description:
    'Review the terms that govern AI Automated Systems consulting engagements and deliverables.',
};

export default function TermsPage() {
  const { terms } = siteContent.legal;

  return (
    <main className='container py-16'>
      <header className='mb-10'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Legal
        </p>
        <h1 className='mt-2 text-4xl font-bold'>{terms.title}</h1>
        <p className='mt-3 text-sm text-muted-foreground'>
          Last updated: {terms.lastUpdated}
        </p>
      </header>
      <div className='space-y-8'>
        {terms.sections.map(section => (
          <section key={section.heading} className='space-y-2'>
            <h2 className='text-2xl font-semibold'>{section.heading}</h2>
            <p className='text-muted-foreground'>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
