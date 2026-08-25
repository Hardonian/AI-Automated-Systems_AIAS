import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { blueprints } from '@/src/content/moat';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blueprint Library | AI Automated Systems',
  description: 'Open implementation blueprints for governance, deterministic workflows, and execution fabric design.',
  canonical: '/blueprints',
});

export default function BlueprintsPage() {
  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: 'Blueprints' },
          ]}
        />
      </div>

      <PageHero
        eyebrow='Open blueprint library'
        title='Blueprints'
        description='Reference architectures for governance, deterministic workflows, agent orchestration, and hardening.'
      />


      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          {blueprints.map(blueprint => (
            <SurfaceCard className='space-y-4' key={blueprint.slug}>
              <h2 className='text-xl font-bold'>{blueprint.title}</h2>
              <p className='text-sm text-muted-foreground'>{blueprint.summary}</p>
              <div className='flex flex-wrap gap-2'>
                {blueprint.tags.map(tag => (
                  <span className='rounded bg-muted px-2 py-1 text-xs font-semibold' key={tag}>{tag}</span>
                ))}
              </div>
              <div className='flex gap-4 text-sm font-semibold'>
                <Link className='text-primary underline underline-offset-4' href={`/blueprints/${blueprint.slug}`}>
                  View blueprint
                </Link>
                <a className='underline underline-offset-4' href={blueprint.downloadPath}>
                  Download markdown
                </a>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>
    </>
  );
}
