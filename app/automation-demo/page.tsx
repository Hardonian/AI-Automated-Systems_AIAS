import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { AutomationEngineSimulator } from '@/components/content/automation-engine-simulator';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Interactive Automation Simulator | AI Automated Systems',
  description: 'Interactive execution demo showing deterministic policy gates, model orchestration, and telemetry guardrails.',
  canonical: '/automation-demo',
});

const architecturalPillars = [
  {
    icon: Database,
    title: 'Deterministic Input & Contract Layer',
    description: 'Every request is parsed against strict runtime Zod schemas. Invalid payloads and undefined edge states fail immediately with explicit errors before model invocation.',
  },
  {
    icon: Cpu,
    title: 'Governed AI Inference & Transformation',
    description: 'Models operate strictly within scoped prompts with temperature controls, grounded context injection, and timeout budgets to prevent runaway execution.',
  },
  {
    icon: ShieldCheck,
    title: 'Policy Gate & Safety Guardrails',
    description: 'Automated post-inference assertions inspect outputs for privacy, hallucination indices, math variance, and authorization ceilings.',
  },
  {
    icon: CheckCircle2,
    title: 'Auditable Runbooks & Human Handoff',
    description: 'Actions produce immutable JSON execution receipts and escalation signals when anomalies or threshold breaches are detected.',
  },
];

export default function AutomationDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Interactive Demo"
        title="Live Automation Engine & Control-Plane"
        description="Experience deterministic workflow execution in real time. Switch scenarios, inspect live telemetry, and test how safety guardrails intercept failure states."
      />

      {/* Main Interactive Simulator Section */}
      <PageSection>
        <AutomationEngineSimulator />
      </PageSection>

      {/* Architecture Deep Dive */}
      <PageSection background="muted">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-2">
            System Design
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
            How Deterministic Boundaries Protect Production
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            AI handles synthesis and unstructured reasoning; deterministic code handles math, privacy, permissions, and budget authority.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {architecturalPillars.map((pillar) => (
            <SurfaceCard key={pillar.title} className="flex flex-col h-full border-2 border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-black text-primary mb-4">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold uppercase text-foreground mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                {pillar.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      {/* Next Steps CTA */}
      <PageSection width="narrow">
        <SurfaceCard className="border-2 border-primary bg-card p-8 text-center shadow-card">
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Ready to implement deterministic controls on your stack?
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">
            Schedule a 30-minute diagnostic call with an AIAS systems architect to map your workflows, identify risk boundaries, and design your automation blueprint.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all">
              <Link href="/book">
                Book Architecture Diagnostic
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-widest hover:border-foreground transition-all">
              <Link href="/readiness-checklist">
                AI Readiness Scorecard
              </Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
