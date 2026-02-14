import type { Metadata } from 'next';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

import { getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Pricing | AI Automated Systems',
  description:
    'AIAS engagement pricing paths for Foundation, Build + Empower, and Build + Manage + Scale with clear capacity bands.',
};

type EngagementPath = {
  name: string;
  label: string;
  bestFor: string[];
  timeline: string;
  investment: string;
  includes: string[];
  optional?: string[];
  bestWhen: string;
  popular: boolean;
};

const engagementPaths: EngagementPath[] = [
  {
    name: 'Foundation',
    label: 'Fixed Project',
    bestFor: ['First AI workflow', 'Pilot automation', 'Fast validation'],
    timeline: '4–6 weeks',
    investment: 'Starting at $X,XXX',
    includes: [
      'AI opportunity mapping',
      'Architecture design',
      'Build of 1–2 production-ready workflows',
      'Staff training session',
      'Documentation + handoff',
      'Post-launch support window',
    ],
    bestWhen: 'You want predictable scope and fixed pricing.',
    popular: false,
  },
  {
    name: 'Build + Empower',
    label: 'Implementation + Enablement',
    bestFor: ['Teams that want internal AI capability'],
    timeline: 'Structured implementation program',
    investment: 'Starting at $X,XXX',
    includes: [
      'Multi-workflow system design',
      'Custom integrations',
      'Governance framework',
      '2–3 staff training sessions',
      'Operational playbooks',
      'Adoption checkpoints',
    ],
    optional: ['Monthly refinement', 'Capacity upgrades'],
    bestWhen: 'You want your team confidently running the system.',
    popular: true,
  },
  {
    name: 'Build + Manage + Scale',
    label: 'Monthly Strategic Partnership',
    bestFor: ['Leaders who want continuous optimization and measurable gains'],
    timeline: 'Ongoing monthly cadence',
    investment: 'Starting at $X,XXX / month',
    includes: [
      'Ongoing workflow deployment',
      'Optimization cycles',
      'Monitoring + reporting',
      'Quarterly strategy reviews',
      'Priority response',
    ],
    bestWhen: 'You want outcomes and iteration, not tickets.',
    popular: false,
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">AI systems are infrastructure.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose a clear starting point. Lock in your build. Scale capacity and refinement as
              you grow.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every engagement includes architecture clarity, documentation, and enablement — so
              your team can own the system if desired.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {engagementPaths.map(path => (
            <article
              key={path.name}
              className={`relative rounded-2xl border bg-card p-8 ${path.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {path.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                    Recommended for capability building
                  </span>
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{path.label}</p>
              <h2 className="mt-3 text-2xl font-bold">{path.name}</h2>
              <p className="mt-2 text-sm font-semibold text-primary">{path.investment}</p>
              <p className="mt-1 text-sm text-muted-foreground">{path.timeline}</p>

              <div className="mt-5">
                <h3 className="text-sm font-semibold">Best for</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {path.bestFor.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-semibold">Includes</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {path.includes.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {path.optional && (
                <div className="mt-5 rounded-xl border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold">Optional</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {path.optional.map(item => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-6 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Best when:</span> {path.bestWhen}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16">
        <div className="container grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-bold">Usage & capacity</h2>
            <p className="mt-4 text-muted-foreground">
              Each engagement includes an AI processing capacity band. As usage grows, you upgrade
              seamlessly. No surprise invoices. No technical friction.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <p className="rounded-lg border bg-muted/40 p-3">We manage: AI compute, workflow execution, monitoring.</p>
              <p className="rounded-lg border bg-muted/40 p-3">You see: included capacity and a transparent upgrade path.</p>
            </div>
          </article>

          <article className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-bold">Standalone workflow builds</h2>
            <p className="mt-4 text-muted-foreground">
              Need one system built fast? We offer fixed scope, fixed price builds with an optional
              managed optimization add-on.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                'Lead qualification automation',
                'Reporting pipeline',
                'Document intelligence',
                'Compliance scanner',
                'Support triage AI',
              ].map(example => (
                <li key={example} className="rounded-lg border bg-muted/40 p-3">
                  {example}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-bold">AIAS Capability Accelerator</h2>
            <p className="mt-4 text-muted-foreground">Training-only option. Flat fee. No build required.</p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {[
                '3-session workshop',
                'Use-case mapping',
                'Implementation roadmap',
                'Governance checklist',
                'Templates + playbooks',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8">
            <h2 className="text-2xl font-bold">Not sure which path fits?</h2>
            <p className="mt-4 text-muted-foreground">
              Book a 20-minute scoping call. We&apos;ll recommend the smallest engagement that
              delivers a working system.
            </p>
            <a
              href={getPrimaryCtaHref()}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a 20-minute scoping call
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
