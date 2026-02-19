import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref } from '@/src/content/site';
import { caseStudies } from '@/lib/case-studies-generator';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Case Studies | AI Automated Systems',
  description:
    'Automated case studies powered by Reach, Zeo, and Settler metadata. Explore deterministic AI implementation evidence.',
  canonical: '/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow='Implementation Evidence'
        title='Systems-first automation case studies'
        description='Each case study is generated from internal project metadata, documenting constraints, architectural wins, and measurable ROI.'
      />

      <PageSection>
        <div className='grid gap-8 md:grid-cols-3'>
          {caseStudies.map((study) => (
            <SurfaceCard key={study.slug} className='flex flex-col h-full'>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold tracking-tight'>{study.title}</h2>
                <p className='mt-4 text-muted-foreground line-clamp-3'>{study.problem}</p>
                
                <div className='mt-6 flex flex-wrap gap-2'>
                  {study.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className='px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-muted rounded border border-border'>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button asChild className='mt-8 w-full' variant='outline'>
                <Link href={`/case-studies/${study.slug}`}>
                  Deep Dive
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background='muted' width='narrow'>
        <SurfaceCard className='text-center'>
          <h2 className='text-2xl font-bold'>Aligned with Reach, Zeo & Settler</h2>
          <p className='mt-4 text-muted-foreground'>
            Our case studies demonstrate the integrated power of our ecosystem. From demand shaping (Reach) to implementation (Zeo) and operations (Settler).
          </p>
          <div className='mt-6 flex justify-center'>
            <Button asChild size='lg'>
              <Link href='/ecosystem'>Explore Ecosystem Architecture</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>

      <PageCta
        title='Need a custom automation architecture?'
        description='We scope engagements based on technical constraints and measurable business outcomes.'
        primary={{ label: 'Book Strategy Call', href: getPrimaryCtaHref() }}
        secondary={{ label: 'View Engagement Models', href: '/pricing' }}
      />
    </>
  );
}
