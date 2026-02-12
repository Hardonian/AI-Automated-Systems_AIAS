import type { Metadata } from 'next';

import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Process | AI Automated Systems',
  description:
    'Understand the AIAS engagement process from discovery through monitoring and enablement.',
};

export default function ProcessPage() {
  return (
    <section className='container py-16'>
      <header className='mb-10 space-y-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Process
        </p>
        <h1 className='text-4xl font-bold'>How engagements run</h1>
      </header>
      <ol className='space-y-4'>
        {siteContent.process.map(step => (
          <li key={step.step} className='rounded-xl border bg-card p-6'>
            <p className='text-sm font-semibold text-primary'>Step {step.step}</p>
            <h2 className='mt-2 text-2xl font-semibold'>{step.title}</h2>
            <p className='mt-3 text-muted-foreground'>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
