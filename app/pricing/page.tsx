import type { Metadata } from 'next';
import Link from 'next/link';

import { siteContent, getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Pricing & Engagements | AI Automated Systems',
  description:
    'AIAS engagement model: pilot, scale, and enablement packages aligned to measurable business outcomes.',
};

const packages = [
  {
    name: 'Pilot Sprint',
    timeline: '2-4 weeks',
    scope: 'One high-value workflow with deterministic guardrails and measurable KPI baseline.',
  },
  {
    name: 'Scale Program',
    timeline: '4-8 weeks',
    scope: 'Multi-workflow rollout with reliability standards, runbooks, and team handoff.',
  },
  {
    name: 'Enablement Retainer',
    timeline: 'Monthly',
    scope: 'Optimization cycles, governance updates, and stakeholder reporting.',
  },
];

export default function PricingPage() {
  return (
    <section className='container py-16'>
      <header className='mb-10 space-y-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          Engagements
        </p>
        <h1 className='text-4xl font-bold'>Pricing by scope and outcomes</h1>
        <p className='max-w-3xl text-muted-foreground'>
          Engagement pricing is tailored to complexity and systems footprint. Typical structures:
        </p>
      </header>
      <div className='grid gap-6 md:grid-cols-3'>
        {packages.map(pkg => (
          <article key={pkg.name} className='rounded-xl border bg-card p-6'>
            <h2 className='text-xl font-semibold'>{pkg.name}</h2>
            <p className='mt-2 text-sm text-primary'>{pkg.timeline}</p>
            <p className='mt-4 text-muted-foreground'>{pkg.scope}</p>
          </article>
        ))}
      </div>
      <div className='mt-10 rounded-xl border bg-muted/30 p-6'>
        <p className='text-sm text-muted-foreground'>{siteContent.contact.responseTime}</p>
        <Link className='mt-3 inline-block font-semibold text-primary underline' href={getPrimaryCtaHref()}>
          {siteContent.positioning.primaryCTA.label}
        </Link>
      </div>
    </section>
  );
}
