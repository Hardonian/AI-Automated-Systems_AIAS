import type { Metadata } from "next";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { FAQSchema, ServiceSchema } from "@/components/seo/structured-data";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Automation Web Systems | AI Automated Systems",
  description:
    "Static-first website automation architecture with governed intake, conversion routing, and performance-first delivery.",
  canonical: "/services/automation-web",
});

export default function AutomationWebServicePage() {
  return (
    <>
      <FAQSchema faqs={siteContent.routeFaqs.automationWeb} />
      <ServiceSchema
        name="Website Automation Systems"
        description="Static-first automation websites with governance and deterministic routing."
        serviceType="Website automation consulting"
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: "Services", href: "/services" },
            { label: "Automation Web Systems" },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Service"
        title="Website automation systems"
        description="We build static-first websites that classify demand, route qualified opportunities, and expose governance checkpoints."
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard>
            <h2 className="text-xl font-bold">Automation philosophy</h2>
            <p className="mt-3 text-muted-foreground">
              Design deterministic paths first, then add intelligence where it
              improves throughput without increasing risk.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-xl font-bold">Governance model</h2>
            <p className="mt-3 text-muted-foreground">
              Every intake path has policy checks, escalation criteria, and
              explicit ownership.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-xl font-bold">Architecture approach</h2>
            <p className="mt-3 text-muted-foreground">
              Server components by default, static-safe pages, and JSON
              artifacts for downstream execution.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-xl font-bold">Ecosystem tie-in</h2>
            <p className="mt-3 text-muted-foreground">
              Reach handles demand strategy, Zeo handles implementation, and
              Settler supports operating handoff.
            </p>
          </SurfaceCard>
        </div>
      </PageSection>
    </>
  );
}
