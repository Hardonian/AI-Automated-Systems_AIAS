import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileCode,
  Users,
  Clock,
  Lock,
  LifeBuoy,
} from "lucide-react";

import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { siteContent } from "@/src/content/site";
import { Button } from "@/components/ui/button";
import { HireScopingWizard } from "@/components/hire/hire-scoping-wizard";

export const metadata: Metadata = generateSEOMetadata({
  title: "Hire AI Automation Systems Engineers & Architects | AIAS",
  description:
    "Hire AIAS to build bespoke deterministic automation pipelines, stabilize flaky AI agents, and architect enterprise-grade governance.",
  canonical: "/hire",
});

const commitmentIcons = {
  ownership: Lock,
  approval: ShieldCheck,
  recovery: LifeBuoy,
  handoff: Users,
};

export default function HireConsultancyPage() {
  const tracks = siteContent.consultancyTracks;
  const {
    hero,
    inquiry,
    proof,
    procurement,
    pilot,
    commitments,
    inquiryNote,
    tracks: trackCopy,
  } = siteContent.enterpriseEngagement;

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: "Hire AIAS" }]} />
      </div>

      <PageHero {...hero} className="!py-12 sm:!py-16">
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={inquiry.href}>
              {inquiry.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={proof.href}>{proof.label}</Link>
          </Button>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {inquiryNote}
        </p>
      </PageHero>

      <PageSection>
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <SurfaceCard>
            <h2 className="text-xl font-semibold">{procurement.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {procurement.description}
            </p>
          </SurfaceCard>
          <SurfaceCard className="border-primary/40 bg-primary/5">
            <h2 className="text-xl font-semibold">{pilot.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {pilot.description}
            </p>
            <Button asChild variant="outline" className="mt-5">
              <Link href={siteContent.workflowProofSprint.discovery.href}>
                {pilot.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </SurfaceCard>
        </div>

        <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => {
            const Icon = commitmentIcons[item.id];
            return (
              <SurfaceCard key={item.id} className="p-5">
                <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </SurfaceCard>
            );
          })}
        </div>

        {/* 4 Structured Engagement Tracks */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              {trackCopy.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {trackCopy.description}
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
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
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
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs font-medium text-foreground"
                        >
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
                    <a href={track.ctaHref}>
                      {track.ctaLabel}
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Scoping & Architecture Wizard */}
        <div className="mt-20">
          <HireScopingWizard inquiry={inquiry} />
        </div>

        {/* Cross-Prong Navigation Banner */}
        <div className="mt-16 border-2 border-border bg-surface-muted p-8 text-center max-w-4xl mx-auto">
          <h2 className="font-mono text-base font-black uppercase text-foreground">
            Looking for Self-Serve Tools or Turnkey Software Packages?
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Explore our browser-based simulators or purchase ready-to-deploy
            workflow code modules directly.
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
