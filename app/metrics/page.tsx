import type { Metadata } from "next";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { PageHero, PageSection } from "@/components/ui/section-primitives";
import { siteContent } from "@/src/content/site";
import { MetricsDashboard } from "@/components/content/metrics-dashboard";

export const metadata: Metadata = generateSEOMetadata({
  title: "Automation Metrics | AI Automated Systems",
  description:
    "A practical measurement contract for automation latency, quality, reliability, cost, and governance coverage.",
  canonical: "/metrics",
});

export default function MetricsPage() {
  return (
    <>
      <PageHero
        eyebrow={siteContent.metricsPage.hero.eyebrow}
        title={siteContent.metricsPage.hero.title}
        description={siteContent.metricsPage.hero.description}
      />

      <PageSection>
        <MetricsDashboard
          groups={siteContent.metricsPage.statGroups}
          comparisons={siteContent.metricsPage.efficiencyComparisons}
        />
      </PageSection>
    </>
  );
}
