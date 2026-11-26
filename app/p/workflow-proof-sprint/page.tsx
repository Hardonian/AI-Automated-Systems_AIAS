import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Private AI Workflow Proof Sprint | AI Automated Systems",
  description:
    "Measure whether AI-assisted support triage saves labor without lowering quality. One workflow, human review, and a decision brief from a fixed-scope pilot.",
  canonical: "/p/workflow-proof-sprint",
});

export default function WorkflowProofSprintPage() {
  const { hero, steps, terms, privacy, cta } = siteContent.workflowProofSprint;

  return (
    <>
      <PageHero {...hero} />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <SurfaceCard key={step.id}>
              <h2 className="text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-muted-foreground">{step.description}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted" width="narrow">
        <div className="space-y-6">
          {[terms, privacy].map(({ title, description }) => (
            <SurfaceCard key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-muted-foreground">{description}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection width="narrow">
        <SurfaceCard className="bg-gradient-to-br from-primary/10 to-accent/10 text-center">
          <h2 className="text-2xl font-bold">{cta.title}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {cta.description}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={cta.primary.href}>
                {cta.primary.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
