import type { Metadata } from 'next';

import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Automated Systems',
  description:
    'Learn how AI Automated Systems collects, uses, and safeguards data for consulting engagements and website visitors.',
};

export default function PrivacyPage() {
  const { privacy } = siteContent.legal;

  return (
    <main className='container py-16'>
      <header className='mb-10'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Legal
        </p>
        <h1 className='mt-2 text-4xl font-bold'>{privacy.title}</h1>
        <p className='mt-3 text-sm text-muted-foreground'>
          Last updated: {privacy.lastUpdated}
        </p>
      </header>
      <div className='space-y-8'>
        {privacy.sections.map(section => (
          <section key={section.heading} className='space-y-2'>
            <h2 className='text-2xl font-semibold'>{section.heading}</h2>
            <p className='text-muted-foreground'>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
