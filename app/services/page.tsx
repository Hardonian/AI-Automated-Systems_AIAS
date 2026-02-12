import type { Metadata } from 'next';

import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Services | AI Automated Systems',
  description:
    'Explore AIAS consultancy services for agent architecture, workflow automation, and enterprise-grade implementation.',
};

export default function ServicesPage() {
  return (
    <section className='container py-16'>
      <header className='mb-10 space-y-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Services
        </p>
        <h1 className='text-4xl font-bold'>What we deliver</h1>
        <p className='max-w-3xl text-muted-foreground'>
          Practical, deterministic automation programs designed for production operations.
        </p>
      </header>
      <div className='grid gap-6 md:grid-cols-2'>
        {siteContent.services.map(service => (
          <article key={service.title} className='rounded-xl border bg-card p-6'>
            <h2 className='text-2xl font-semibold'>{service.title}</h2>
            <p className='mt-3 text-muted-foreground'>{service.description}</p>
            <p className='mt-3 text-sm font-medium text-primary'>{service.outcome}</p>
            <ul className='mt-4 space-y-2 text-sm text-muted-foreground'>
              {service.deliverables.map(deliverable => (
                <li key={deliverable}>• {deliverable}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
