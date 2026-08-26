import type { Metadata } from "next";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { RelatedPages } from "@/components/content/related-pages";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const deliverables = [
  "Decision map showing what should remain deterministic versus AI-assisted.",
  "Constraint register covering compliance, latency, reliability, and ownership boundaries.",
  "Failure mode matrix with escalation paths and fallback behavior.",
  "Tradeoff brief with implementation recommendations and phased rollout sequence.",
];

export const metadata: Metadata = generateSEOMetadata({
  title: "Diagnostic Engagement | AI Automated Systems",
  description:
    "What happens during an AIAS diagnostic, what your team receives, and how the engagement de-risks implementation decisions.",
  canonical: "/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://aiautomatedsystems.ca/" },
          {
            name: "Diagnostic",
            url: "https://aiautomatedsystems.ca/diagnostic",
          },
        ]}
      />
      <PageHero
        eyebrow="Discovery engagement"
        title="AI Clarity Diagnostic"
        description="AIAS works with teams facing delivery, governance, or reliability pressure in AI initiatives. The outcome is a practical blueprint for what to build first, what to postpone, and how to control risk. Discovery comes first so implementation decisions are grounded in operational truth."
      />
      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard>
            <h2 className="text-2xl font-bold">What happens</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We run stakeholder interviews, workflow tracing, and architecture
              review. Then we pressure-test assumptions against cost, control,
              and reliability targets.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-2xl font-bold">What you get</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {deliverables.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>
      <PageSection background="muted">
        <RelatedPages
          navAriaLabel="Diagnostic related pages"
          linkAriaLabelPrefix="Diagnostic related page"
          links={[
            { label: "Framework", href: "/framework" },
            { label: "Services", href: "/services" },
            { label: "Readiness checklist", href: "/readiness-checklist" },
            { label: "Start intake", href: "/contact" },
          ]}
        />
      </PageSection>
    </>
  );
}
