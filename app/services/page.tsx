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
        eyebrow={siteContent.servicesPage.hero.eyebrow}
        title={siteContent.servicesPage.hero.title}
        description={siteContent.servicesPage.hero.description}
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
            <h2 className='text-2xl font-bold'>{siteContent.servicesPage.engagementInclusions.title}</h2>
            <ul className='mt-5 space-y-3 text-muted-foreground'>
              {siteContent.servicesPage.engagementInclusions.items.map(item => (
                <li key={item} className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className='mt-6 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4'
              href={siteContent.servicesPage.engagementInclusions.processLinkHref}
            >
              {siteContent.servicesPage.engagementInclusions.processLinkLabel}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </SurfaceCard>

          <SurfaceCard>
            <h3 className='text-lg font-semibold'>{siteContent.servicesPage.workflowView.title}</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              {siteContent.servicesPage.workflowView.description}
            </p>
            <div className='mt-5'>
              <WorkflowDiagram />
            </div>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageCta
        title={siteContent.servicesPage.cta.title}
        description={siteContent.servicesPage.cta.description}
        primary={{ label: siteContent.servicesPage.cta.primaryLabel, href: getPrimaryCtaHref() }}
        secondary={{
          label: siteContent.servicesPage.cta.secondaryLabel,
          href: siteContent.servicesPage.cta.secondaryHref,
        }}
      />
    </>
  );
}
