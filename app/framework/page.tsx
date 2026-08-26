import type { Metadata } from "next";
import { DiagnosticFrameworkDiagram } from "@/components/visual/DiagnosticFrameworkDiagram";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { RelatedPages } from "@/components/content/related-pages";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const frameworkSteps = [
  "Decision Surface Mapping",
  "Constraint Identification",
  "Failure Mode Matrix",
  "Tradeoff Modeling",
  "Architecture Alignment",
];

export const metadata: Metadata = generateSEOMetadata({
  title: "AIAS Diagnostic Framework | AI Automated Systems",
  description:
    "The AIAS five-step diagnostic framework used to map decisions, constraints, failure modes, and architecture tradeoffs before implementation.",
  canonical: "/framework",
});

export default function FrameworkPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://aiautomatedsystems.ca/" },
          { name: "Framework", url: "https://aiautomatedsystems.ca/framework" },
        ]}
      />
      <PageHero
        eyebrow="Signature framework"
        title="AIAS Diagnostic Architecture Framework"
        description="AIAS helps operations, product, and leadership teams move from AI uncertainty to governed execution. The outcome is a scoped architecture plan with clear tradeoffs, risk controls, and ownership. Discovery comes first because implementation quality depends on decision clarity."
      />

      <PageSection>
        <DiagnosticFrameworkDiagram />
      </PageSection>

      <PageSection>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {frameworkSteps.map((step) => (
            <SurfaceCard key={step} className="p-6">
              <h2 className="text-lg font-semibold">{step}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This step defines operating boundaries before tooling decisions,
                reducing brittle workflows and expensive rework.
              </p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted">
        <RelatedPages
          navAriaLabel="Framework related pages"
          linkAriaLabelPrefix="Framework related page"
          links={[
            { label: "How We Work", href: "/how-it-works" },
            { label: "Services", href: "/services" },
            { label: "Diagnostic", href: "/diagnostic" },
            { label: "Proof", href: "/work" },
          ]}
        />
      </PageSection>
    </>
  );
}
