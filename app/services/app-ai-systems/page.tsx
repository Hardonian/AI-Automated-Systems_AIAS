import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { FAQSchema, ServiceSchema } from '@/components/seo/structured-data';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'App + AI Systems | AI Automated Systems',
  description: 'Deterministic app orchestration and AI advisory layers with enterprise governance controls.',
  canonical: '/services/app-ai-systems',
});

export default function AppAiSystemsServicePage() {
  return (
    <>
      <FAQSchema faqs={siteContent.routeFaqs.appAiSystems} />
      <ServiceSchema name='App + AI Systems Engineering' description='Deterministic app orchestration with AI advisory layers.' serviceType='App orchestration consulting' />
      
      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: 'App + AI Systems' },
          ]}
        />
      </div>

      <PageHero
        eyebrow='Service'
        title='App orchestration + AI systems'
        description='We engineer deterministic execution fabrics with controlled AI assistance for enterprise-grade operations.'
      />

      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          <SurfaceCard><h2 className='text-xl font-bold'>Automation philosophy</h2><p className='mt-3 text-muted-foreground'>Critical paths stay deterministic. AI augments planning and triage under schema-bound contracts.</p></SurfaceCard>
          <SurfaceCard><h2 className='text-xl font-bold'>Governance model</h2><p className='mt-3 text-muted-foreground'>Policy enforcement, replayable logs, and human approval for high-impact actions.</p></SurfaceCard>
          <SurfaceCard><h2 className='text-xl font-bold'>Architecture approach</h2><p className='mt-3 text-muted-foreground'>Modular control plane, tool adapters, and environment-specific deployment profiles.</p></SurfaceCard>
          <SurfaceCard><h2 className='text-xl font-bold'>Performance + OSS alignment</h2><p className='mt-3 text-muted-foreground'>Open standards, auditable interfaces, and latency budgets tracked from design to rollout.</p></SurfaceCard>
        </div>
      </PageSection>
    </>
  );
}
