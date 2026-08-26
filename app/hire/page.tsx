import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileCode,
  Users,
  Clock,
  Lock,
  Layers,
  ExternalLink,
} from 'lucide-react';

import { PageHero, PageSection } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { siteContent } from '@/src/content/site';
import { Button } from '@/components/ui/button';
import { HireScopingWizard } from '@/components/hire/hire-scoping-wizard';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Hire AI Automation Systems Engineers & Architects | AIAS',
  description:
    'Hire AIAS to build bespoke deterministic automation pipelines, stabilize flaky AI agents, and architect enterprise-grade governance.',
  canonical: '/hire',
});

export default function HireConsultancyPage() {
  const tracks = siteContent.consultancyTracks || [];

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: 'Hire AIAS' }]} />
      </div>

      <PageHero
        eyebrow="Prong 02 // Enterprise Engineering"
        title="Hire AIAS to Build, Modernize & Automate"
        description="We architect, build, and operate production-grade automation systems for high-growth operations teams. From single workflow stabilization to end-to-end bespoke platform engineering."
      />

      <PageSection>
        {/* Value Proposition Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            {
              title: '100% IP & Code Ownership',
              description: 'You own every line of code, schema definition, and Docker configuration.',
              icon: Lock,
            },
            {
              title: 'Policy Before Execution',
              description: 'Zero unintercepted hallucinated actions or uncontrolled API dispatches.',
              icon: ShieldCheck,
            },
            {
              title: 'Zero Vendor Lock-in',
              description: 'Built on open standards (TypeScript, Python, Next.js, Zod, PostgreSQL).',
              icon: Layers,
            },
            {
              title: 'Operator Enablement',
              description: 'Complete runbooks, SOPs, and training sessions so your team operates independently.',
              icon: Users,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="border-2 border-border bg-card p-6 shadow-card transition-all hover:border-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-surface-muted text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-mono text-sm font-bold uppercase text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 4 Structured Engagement Tracks */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="border border-primary bg-primary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Structured Engagement Packages
            </span>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
              Choose How Your Team Engages
            </h2>
            <p className="mt-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Scoper-backed delivery models with transparent deliverables and zero runaway scopes.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex flex-col justify-between border-2 border-border bg-card p-8 shadow-card hover:border-primary transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b-2 border-border pb-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      {track.eyebrow}
                    </span>
                    <span className="inline-flex items-center gap-1.5 border border-border bg-surface-muted px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {track.timeline}
                    </span>
                  </div>

                  <h3 className="mt-5 font-mono text-xl font-black uppercase text-foreground">
                    {track.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs font-semibold text-primary">
                    {track.subtitle}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {track.description}
                  </p>

                  {/* Ideal For */}
                  <div className="mt-6 border-t border-border/60 pt-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Ideal For:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {track.idealFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-6 border-t border-border/60 pt-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Core Deliverables:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {track.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                          <FileCode className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t-2 border-border">
                  <Button
                    asChild
                    className="w-full rounded-none border-2 border-primary bg-primary py-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-transform"
                  >
                    <Link
                      href={track.ctaHref}
                      target={track.ctaHref.startsWith('http') ? '_blank' : undefined}
                      rel={track.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {track.ctaLabel}
                      {track.ctaHref.startsWith('http') ? (
                        <ExternalLink className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Scoping & Architecture Wizard */}
        <div className="mt-20">
          <HireScopingWizard />
        </div>

        {/* Cross-Prong Navigation Banner */}
        <div className="mt-16 border-2 border-border bg-surface-muted p-8 text-center max-w-4xl mx-auto">
          <h2 className="font-mono text-base font-black uppercase text-foreground">
            Looking for Self-Serve Tools or Turnkey Software Packages?
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Explore our browser-based simulators or purchase ready-to-deploy workflow code modules
            directly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider"
            >
              <Link href="/tools">
                Explore Quick Tools
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider"
            >
              <Link href="/catalog">
                Browse Product Catalog
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
