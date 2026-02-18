import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Automation Metrics | AI Automated Systems',
  description:
    'Automation benchmark metrics for latency, conversion, reliability, and governance coverage.',
  canonical: '/metrics',
});

export default function MetricsPage() {
  return (
    <>
      <PageHero
        eyebrow={siteContent.metricsPage.hero.eyebrow}
        title={siteContent.metricsPage.hero.title}
        description={siteContent.metricsPage.hero.description}
      />

      <PageSection>
        <div className='grid gap-6 lg:grid-cols-2'>
          {siteContent.metricsPage.statGroups.map(group => (
            <SurfaceCard key={group.category}>
              <p className='text-xs font-semibold uppercase tracking-wider text-primary'>{group.period}</p>
              <h2 className='mt-2 text-xl font-bold'>{group.category}</h2>
              <div className='mt-5 space-y-4'>
                {group.metrics.map(metric => (
                  <article key={metric.label} className='rounded-xl border bg-background/60 p-4'>
                    <p className='text-sm text-muted-foreground'>{metric.label}</p>
                    <p className='mt-1 text-2xl font-semibold'>{metric.value}</p>
                    <p className='mt-1 text-sm font-semibold text-primary'>{metric.delta}</p>
                    <p className='mt-2 text-sm text-muted-foreground'>{metric.note}</p>
                  </article>
                ))}
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
