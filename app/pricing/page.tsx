import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateSEOMetadata({
  title:
    "AI Automation Consulting Pricing — Transparent Engagement Models | AIAS",
  description:
    "Clear monetization structure for AIAS: Audit, Implementation, and Ongoing Governance with range-based pricing philosophy and ROI framing.",
  canonical: "/pricing",
});

type OfferTier = {
  title: string;
  outcome: string;
  scope: string[];
  pricingRange: string;
  ctaLabel: string;
  ctaHref: string;
};

const tiers: OfferTier[] = [
  {
    title: "Audit",
    outcome:
      "Diagnose control gaps, model risk, and delivery blockers before build spend.",
    scope: [
      "Deterministic governance baseline and risk map",
      "AI stack + model mix failure analysis",
      "Prioritized architecture plan and non-fit criteria",
    ],
    pricingRange:
      "Typical range: $7,500-$20,000 based on system breadth and compliance depth.",
    ctaLabel: "Book Diagnostic",
    ctaHref: "/book",
  },
  {
    title: "Implementation",
    outcome:
      "Implement control-plane architecture and orchestrated agents with measurable reliability targets.",
    scope: [
      "Control-plane workflow design and policy checkpoints",
      "Agent orchestration with eval instrumentation",
      "Runbooks, ownership transfer, and launch gates",
    ],
    pricingRange:
      "Typical range: $25,000-$120,000 depending on integrations, model routing, and rollout phases.",
    ctaLabel: "Request Architecture Review",
    ctaHref: "/contact",
  },
  {
    title: "Ongoing Governance",
    outcome:
      "Sustain reliability, cost control, and safety as AI systems evolve.",
    scope: [
      "Monthly evaluation integrity and incident review",
      "Model + cost optimization across active workloads",
      "Governance maturity progression with executive reporting",
    ],
    pricingRange:
      "Typical range: $6,000-$35,000 monthly by operating footprint and oversight cadence.",
    ctaLabel: "Download Governance Checklist",
    ctaHref: "/readiness-checklist",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Offer structure"
        title="How money flows in AIAS engagements"
        description="Three engagement tiers with explicit outcomes: Audit, Implementation, and Ongoing Governance. We price by risk surface, integration depth, and operating criticality."
      />

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <SurfaceCard key={tier.title} className="p-7">
              <h2 className="text-2xl font-bold">{tier.title}</h2>
              <p className="mt-3 text-muted-foreground">{tier.outcome}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {tier.scope.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">
                {tier.pricingRange}
              </p>
              <Button asChild className="mt-6" size="lg">
                <Link href={tier.ctaHref}>
                  {tier.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted" width="narrow">
        <SurfaceCard>
          <h2 className="text-2xl font-bold">
            ROI framing used in every scope
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong>Reliability ROI:</strong> reduce failed runs, escalations,
              and rollback incidents.
            </li>
            <li>
              <strong>Cost ROI:</strong> lower wasted inference spend, duplicate
              tooling, and manual rework hours.
            </li>
            <li>
              <strong>Evaluation ROI:</strong> improve benchmark confidence so
              releases move faster with fewer regressions.
            </li>
          </ul>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/book">Book Diagnostic</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Request Architecture Review</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
