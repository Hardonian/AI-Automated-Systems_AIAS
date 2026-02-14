import type { Metadata } from 'next';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

import { WorkflowDiagram } from '@/components/visual/WorkflowDiagram';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Process | AI Automated Systems',
  description:
    'Our proven methodology for delivering agentic automation: Discover, Map, Automate, Ship, Monitor.',
};

export default function ProcessPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Our Process
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              From discovery to deployment
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A battle-tested methodology for delivering deterministic automation 
              that your team can trust and operate.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" /> 2-4 week pilot cycle
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                <Circle className="h-4 w-4" /> Zero disruption rollout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: Steps */}
          <div className="space-y-6">
            {siteContent.process.map((step, index) => (
              <article
                key={step.step}
                className="relative flex gap-6 rounded-2xl border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  {index < siteContent.process.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}
                </div>
                <div className="pb-8">
                  <h2 className="text-xl font-semibold">{step.title}</h2>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right: Visual */}
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">Workflow Engine</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                See how our agentic system processes inputs through classification, 
                planning, and execution.
              </p>
              <div className="mt-6">
                <WorkflowDiagram />
              </div>
            </div>

            <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
              <h3 className="text-lg font-semibold">Timeline</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discovery to Pilot</span>
                  <span className="font-semibold">2-4 weeks</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-1/3 rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pilot to Production</span>
                  <span className="font-semibold">4-8 weeks</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to start your automation journey?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Book a free strategy call to discuss your workflows and identify 
              high-impact automation opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={getPrimaryCtaHref()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Book a Strategy Call
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                View Case Studies
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
