import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { FAQSchema } from '@/components/seo/structured-data';
import { ServiceTrackLinks } from '@/components/services/service-track-links';
import { FeatureIllustration } from '@/components/visual/FeatureIllustration';
import { WorkflowDiagram } from '@/components/visual/WorkflowDiagram';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Services | AI Automated Systems',
  description:
    'Explore AIAS consultancy services for agent architecture, workflow automation, and enterprise-grade implementation.',
  canonical: '/services',
});

const serviceVisuals: Record<string, 'agents' | 'automation' | 'security' | 'integration'> = {
  'AI Agent Architecture': 'agents',
  'Workflow Automation': 'automation',
  'Tax & Finance Workflow Automation': 'automation',
  'Enterprise Security & Compliance': 'security',
};

export default function ServicesPage() {
  return (
    <>
      <FAQSchema faqs={siteContent.routeFaqs.services} />
      <PageHero
        eyebrow='Services'
        title='Deterministic automation services built for production teams'
        description='Each service includes clear deliverables, documented handoff, and governance guardrails so your team can run confidently after launch.'
      />

      <PageSection>
        <ServiceTrackLinks />

        <div className='grid gap-8 md:grid-cols-2'>
          {siteContent.services.map(service => (
            <SurfaceCard key={service.title} className='p-7'>
              <FeatureIllustration
                className='mb-5 h-24 opacity-90'
                type={serviceVisuals[service.title] || 'automation'}
              />
              <h2 className='text-2xl font-semibold'>{service.title}</h2>
              <p className='mt-3 text-muted-foreground'>{service.description}</p>
              <p className='mt-4 text-sm font-semibold text-primary'>{service.outcome}</p>
              <ul className='mt-5 space-y-2 text-sm text-muted-foreground'>
                {service.deliverables.map(deliverable => (
                  <li key={deliverable} className='flex items-start gap-2'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background='muted'>
        <div className='grid gap-8 lg:grid-cols-2 lg:items-center'>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>What you get in every engagement</h2>
            <ul className='mt-5 space-y-3 text-muted-foreground'>
              {[
                'Workflow map with decision points and fallback paths',
                'Implementation artifacts your operators can review and own',
                'Risk controls, observability baselines, and launch checklist',
                'Enablement session to transfer capability into your team',
              ].map(item => (
                <li key={item} className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className='mt-6 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4'
              href='/process'
            >
              Review delivery process
              <ArrowRight className='h-4 w-4' />
            </Link>
          </SurfaceCard>

          <SurfaceCard>
            <h3 className='text-lg font-semibold'>Workflow view</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              We standardize around input validation, deterministic routing, controlled execution,
              and human escalation on low-confidence branches.
            </p>
            <div className='mt-5'>
              <WorkflowDiagram />
            </div>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageCta
        title='Need a service mix tailored to your operating model?'
        description='Start with a strategy call and we will scope the smallest practical rollout for your team.'
        primary={{ label: 'Book a strategy call', href: getPrimaryCtaHref() }}
        secondary={{ label: 'View engagement shapes', href: '/pricing' }}
      />
    </>
  );
}
