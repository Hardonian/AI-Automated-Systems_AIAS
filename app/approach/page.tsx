import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { WorkflowDiagram } from '@/components/visual/WorkflowDiagram';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Approach | AI Automated Systems',
  description:
    'How AIAS runs discovery, workflow design, deterministic implementation, and ongoing optimization for automation engagements.',
  canonical: '/approach',
});

export default function ApproachPage() {
  return (
    <>
      <section className='relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24'>
        <div className='container'>
          <div className='mx-auto max-w-3xl text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Our approach</p>
            <h1 className='mt-4 text-4xl font-bold md:text-5xl'>From discovery to dependable delivery</h1>
            <p className='mt-4 text-lg text-muted-foreground'>
              We run a practical, low-risk delivery model: map the workflow, ship a scoped pilot,
              then scale with governance and measurable outcomes.
            </p>
            <div className='mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary'>
              <CheckCircle2 className='h-4 w-4' />
              Free 30-minute consult to assess fit and priorities
            </div>
          </div>
        </div>
      </section>

      <section className='container py-16'>
        <div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
          <div className='space-y-6'>
            {siteContent.process.map(step => (
              <article key={step.step} className='rounded-2xl border bg-card p-6'>
                <h2 className='text-xl font-semibold'>
                  {step.step}. {step.title}
                </h2>
                <p className='mt-2 text-muted-foreground'>{step.description}</p>
              </article>
            ))}
          </div>

          <div className='sticky top-24 rounded-2xl border bg-card p-6'>
            <h3 className='text-lg font-semibold'>Workflow execution model</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Every engagement uses deterministic checkpoints for quality, safety, and handoff
              readiness.
            </p>
            <div className='mt-6'>
              <WorkflowDiagram />
            </div>
          </div>
        </div>
      </section>

      <section className='border-t bg-muted/30 py-16'>
        <div className='container'>
          <div className='mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center md:p-12'>
            <h2 className='text-2xl font-bold md:text-3xl'>Ready to map your first automation workflow?</h2>
            <p className='mt-4 text-muted-foreground'>
              Book a free 30-minute consult and we will identify the highest-leverage workflow to
              launch first.
            </p>
            <a
              href={getPrimaryCtaHref()}
              className='mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90'
            >
              Book free consult
              <ArrowRight className='h-4 w-4' />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
