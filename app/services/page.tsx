import type { Metadata } from 'next';

import { FeatureIllustration } from '@/components/visual/FeatureIllustration';
import { WorkflowDiagram } from '@/components/visual/WorkflowDiagram';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Services | AI Automated Systems',
  description:
    'Explore AIAS consultancy services for agent architecture, workflow automation, and enterprise-grade implementation.',
};

const serviceVisuals: Record<string, 'agents' | 'automation' | 'security' | 'integration'> = {
  'AI Agent Architecture': 'agents',
  'Workflow Automation': 'automation',
  'Tax & Finance Workflow Automation': 'automation',
  'Enterprise Security & Compliance': 'security',
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section with Visual */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Services
              </p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                What we deliver
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                Practical, deterministic automation programs designed for production operations. 
                We build systems that your team can trust, operate, and extend.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                  <span className="text-xs">🍁</span> Made in Canada
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                  <span className="text-xs">⚡</span> 10+ hrs/week saved
                </span>
              </div>
            </div>
            <div className="hidden lg:block">
              <WorkflowDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {siteContent.services.map((service, index) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg"
            >
              <div className="mb-6">
                <FeatureIllustration 
                  type={serviceVisuals[service.title] || 'automation'} 
                  className="h-28 opacity-90 transition-opacity group-hover:opacity-100"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold">{service.title}</h2>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-4 text-muted-foreground">{service.description}</p>
              <p className="mt-4 text-sm font-medium text-primary">{service.outcome}</p>
              <ul className="mt-6 space-y-3">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">✓</span>
                    {deliverable}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Process Preview */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">How we work</h2>
            <p className="mt-4 text-muted-foreground">
              Our &ldquo;Discover to Pilot&rdquo; cycle is typically 2-4 weeks. 
              Full production rollout follows within 4-8 weeks.
            </p>
            <div className="mt-8 grid grid-cols-5 gap-2 md:gap-4">
              {['Discover', 'Map', 'Automate', 'Ship', 'Monitor'].map((step, i) => (
                <div key={step} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:h-12 md:w-12 md:text-base">
                      {i + 1}
                    </div>
                    <p className="mt-2 text-xs font-medium md:text-sm">{step}</p>
                  </div>
                  {i < 4 && (
                    <div className="absolute left-1/2 top-5 hidden h-0.5 w-full -translate-y-1/2 bg-primary/30 md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
