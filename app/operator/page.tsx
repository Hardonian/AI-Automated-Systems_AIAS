import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { OperatorConsole } from "@/components/content/operator-console";
import { PageHero, PageSection } from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { operatorMockLeads } from "@/src/content/moat";

export const metadata: Metadata = generateSEOMetadata({
  title: "Operator Console | AI Automated Systems",
  description:
    "Internal operator console for lead intake, stage tracking, risk score management, and notes.",
  canonical: "/operator",
});

export default function OperatorPage() {
  if (process.env.AIAS_ENABLE_OPERATOR !== "true") {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Internal only"
        title="Operator Console"
        description="Local-first pipeline management for intake, engagement stage tracking, risk scores, and operator notes."
      />
      <PageSection>
        <OperatorConsole initialLeads={operatorMockLeads} />
      </PageSection>
    </>
  );
}
