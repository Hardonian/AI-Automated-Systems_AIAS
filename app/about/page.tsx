import type { Metadata } from 'next';

import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'About | AI Automated Systems',
  description:
    'Learn about AIAS and our deterministic approach to consultancy-led AI automation programs.',
};

export default function AboutPage() {
  return (
    <section className='container py-16'>
      <h1 className='text-4xl font-bold'>About AI Automated Systems</h1>
      <p className='mt-4 max-w-3xl text-muted-foreground'>{siteContent.brand.description}</p>
      <div className='mt-8 grid gap-6 md:grid-cols-3'>
        {siteContent.secretSauce.pillars.map(pillar => (
          <article key={pillar.title} className='rounded-xl border bg-card p-6'>
            <h2 className='text-xl font-semibold'>{pillar.title}</h2>
            <p className='mt-3 text-muted-foreground'>{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
