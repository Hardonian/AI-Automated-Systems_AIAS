import type { Metadata } from "next";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { RelatedPages } from "@/components/content/related-pages";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { WebApplicationSchema } from "@/components/seo/structured-data";
import { DiagnosticWizard } from "@/components/content/diagnostic-wizard";
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
      <WebApplicationSchema
        applicationCategory="BusinessApplication"
        description="Interactive architecture diagnostic and scoping wizard evaluating operational pressure, deterministic boundaries, and failure mode mitigations."
        name="AIAS AI Clarity Diagnostic Tool"
        url="https://aiautomatedsystems.ca/diagnostic"
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "AI Clarity Diagnostic" },
          ]}
        />
      </div>

      <PageHero
        description="AIAS works with teams facing delivery, governance, or reliability pressure in AI initiatives. Use our self-serve diagnostic wizard to evaluate your boundary allocations, or engage our team to pressure-test assumptions against operational truth."
        eyebrow="Discovery engagement"
        title="AI Clarity Diagnostic"
      />

      {/* Interactive Diagnostic Assessment Tool */}
      <PageSection>
        <DiagnosticWizard />
      </PageSection>

      {/* Structured Engagement Details */}
      <PageSection background="muted">
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard className="border-2 border-border p-6">
            <h2 className="text-xl font-mono font-bold uppercase text-foreground">
              What Happens During an Engagement
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We run stakeholder interviews, workflow tracing, and architecture
              review. Then we pressure-test assumptions against cost, control,
              and reliability targets before any code or model pipelines are
              deployed.
            </p>
          </SurfaceCard>
          <SurfaceCard className="border-2 border-border p-6">
            <h2 className="text-xl font-mono font-bold uppercase text-foreground">
              What Your Team Receives
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {deliverables.map((item) => (
                <li className="flex items-start gap-2" key={item}>
                  <span className="text-primary font-mono font-bold">▪</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection>
        <RelatedPages
          linkAriaLabelPrefix="Diagnostic related page"
          links={[
            { label: "Framework", href: "/framework" },
            { label: "Services", href: "/services" },
            { label: "Readiness checklist", href: "/readiness-checklist" },
            { label: "Start intake", href: "/contact" },
          ]}
          navAriaLabel="Diagnostic related pages"
        />
      </PageSection>
    </>
  );
}
