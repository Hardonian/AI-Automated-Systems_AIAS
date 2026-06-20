import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { caseStudies } from '@/lib/case-studies-generator';

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI Automation Case Studies — Real Outcomes, Real Workflows | AIAS',
  description:
    'Implementation proof with metrics, before/after patterns, and governance maturity progression for AI control-plane programs.',
  canonical: '/case-studies',
});

const metrics = [
  { label: 'Reliability improvement', value: '+31%' },
  { label: 'Inference + ops cost reduction', value: '-24%' },
  { label: 'Evaluation pass-rate lift', value: '+27%' },
];

const maturityScale = ['Ad hoc', 'Repeatable', 'Defined', 'Controlled'];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow='Proof engine'
        title='Case studies with measurable architecture outcomes'
        description='Where client details are confidential, we publish transparent architecture-backed scenario studies labeled as representative.'
      />

      <PageSection>
        <div className='grid gap-8 md:grid-cols-3'>
          {caseStudies.map((study) => (
            <SurfaceCard key={study.slug} className='flex h-full flex-col'>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold tracking-tight'>{study.title}</h2>
                <p className='mt-4 line-clamp-3 text-muted-foreground'>{study.problem}</p>

                <div className='mt-6 flex flex-wrap gap-2'>
                  {study.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className='rounded border border-border bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider'>
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

      <PageSection background='muted'>
        <div className='grid gap-6 lg:grid-cols-3'>
          {metrics.map((metric) => (
            <SurfaceCard key={metric.label} className='p-6 text-center'>
              <p className='text-sm uppercase tracking-wider text-muted-foreground'>{metric.label}</p>
              <p className='mt-3 text-3xl font-bold text-primary'>{metric.value}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className='grid gap-6 lg:grid-cols-2'>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Before / After pattern</h2>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <article className='rounded-lg border bg-muted/30 p-4'>
                <h3 className='font-semibold'>Before</h3>
                <ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                  <li>Model behavior changes without release controls</li>
                  <li>Manual triage and opaque incident handling</li>
                  <li>Unclear model-cost accountability</li>
                </ul>
              </article>
              <article className='rounded-lg border p-4'>
                <h3 className='font-semibold'>After</h3>
                <ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                  <li>Deterministic control-plane with policy gates</li>
                  <li>Replayable incidents and measurable eval lift</li>
                  <li>Model routing with explicit FinOps controls</li>
                </ul>
              </article>
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Governance maturity scale</h2>
            <ol className='mt-4 space-y-3'>
              {maturityScale.map((level, idx) => (
                <li key={level} className='flex items-center gap-3 rounded-lg border p-3'>
                  <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>{idx + 1}</span>
                  <span className='font-medium'>{level}</span>
                </li>
              ))}
            </ol>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection background='muted' width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Case study template (transparent scenario format)</h2>
          <p className='mt-3 text-muted-foreground'>Template fields: Context → Failure Modes → Control-Plane Changes → Eval/Cost Metrics → Governance Progression. Scenario studies are explicitly labeled when anonymized.</p>
        </SurfaceCard>
      </PageSection>

      <PageCta
        title='Turn your stack into a measurable control-plane program'
        description='Choose your next action based on where your governance maturity sits today.'
        primary={{ label: 'Book Diagnostic', href: '/book' }}
        secondary={{ label: 'Request Architecture Review', href: '/contact' }}
      />
    </>
  );
}
