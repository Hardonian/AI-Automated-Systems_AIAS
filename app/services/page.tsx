import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  PageCta,
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { FAQSchema, ServiceSchema } from "@/components/seo/structured-data";
import { ServiceTrackLinks } from "@/components/services/service-track-links";
import { RelatedPages } from "@/components/content/related-pages";
import FadeIn from "@/components/motion/fade-in";
import { FeatureIllustration } from "@/components/visual/FeatureIllustration";
import { WorkflowDiagram } from "@/components/visual/WorkflowDiagram";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "AI Automation Consulting Services — Audit, Build, Govern | AIAS",
  description:
    "Explore AIAS consultancy services for agent architecture, workflow automation, and enterprise-grade implementation.",
  canonical: "/services",
});

const serviceVisuals: Record<
  string,
  "agents" | "automation" | "security" | "integration"
> = {
  "AI Clarity Audit": "agents",
  "Stabilization Sprint": "automation",
  "Governance Architecture": "security",
  "Strategic Advantage Program": "integration",
};

export default function ServicesPage() {
  return (
    <>
      <FAQSchema faqs={siteContent.routeFaqs.services} />

      {siteContent.services.map((service) => (
        <ServiceSchema
          key={service.title}
          description={service.description}
          idSuffix={service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          name={service.title}
          provider={{
            name: "AI Automated Systems",
            url: "https://aiautomatedsystems.ca",
          }}
          serviceType="agentic automation consultancy"
        />
      ))}

      <PageHero
        eyebrow={siteContent.servicesPage.hero.eyebrow}
        title={siteContent.servicesPage.hero.title}
        description={siteContent.servicesPage.hero.description}
      />

      <PageSection>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
          AIAS helps operations, product, and leadership teams that need
          governed AI execution without delivery chaos. These services are
          designed to move from discovery through implementation with explicit
          ownership, risk controls, and measurable outcomes. We lead with
          diagnostic clarity so architecture choices are made against real
          constraints instead of assumptions.
        </p>
        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/how-it-works"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            How we work
          </Link>
          <Link
            href="/work"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Proof
          </Link>
          <Link
            href="/contact"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Start intake
          </Link>
        </div>
        <ServiceTrackLinks />

        <div className="mb-6">
          <RelatedPages
            headingClassName="text-lg font-semibold"
            links={[
              { label: "Framework", href: "/framework" },
              { label: "Point of view", href: "/point-of-view" },
              { label: "Diagnostic", href: "/diagnostic" },
              { label: "What we measure", href: "/what-we-measure" },
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {siteContent.services.map((service, index) => {
            // Bento logic: 0 spans 2, 1 spans 1, 2 spans 1, 3 spans 2
            const spanClass = 
              index % 4 === 0 || index % 4 === 3 
                ? "md:col-span-2" 
                : "md:col-span-1";
            
            return (
              <FadeIn key={service.title} delay={index * 0.05} className={spanClass}>
                <SurfaceCard className="h-full p-8 flex flex-col group overflow-hidden relative border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <FeatureIllustration
                    className="mb-6 h-20 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    type={serviceVisuals[service.title] || "automation"}
                  />
                  <h2 className="text-2xl font-bold tracking-tight relative z-10">{service.title}</h2>
                  <p className="mt-3 text-muted-foreground flex-grow relative z-10">
                    {service.description}
                  </p>
                  <div className="mt-6 border-t border-border/50 pt-5 relative z-10">
                    <p className="text-sm font-bold text-cyan-500 mb-3 uppercase tracking-widest text-[10px]">
                      {service.outcome}
                    </p>
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      {service.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-cyan-500 flex-shrink-0" />
                          <span className="leading-snug">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SurfaceCard>
              </FadeIn>
            );
          })}
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SurfaceCard>
            <h2 className="text-2xl font-bold">
              {siteContent.servicesPage.engagementInclusions.title}
            </h2>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              {siteContent.servicesPage.engagementInclusions.items.map(
                (item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <Link
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
              href={
                siteContent.servicesPage.engagementInclusions.processLinkHref
              }
            >
              {siteContent.servicesPage.engagementInclusions.processLinkLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SurfaceCard>

          <SurfaceCard>
            <h3 className="text-lg font-semibold">
              {siteContent.servicesPage.workflowView.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {siteContent.servicesPage.workflowView.description}
            </p>
            <div className="mt-5">
              <WorkflowDiagram />
            </div>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageCta
        title={siteContent.servicesPage.cta.title}
        description={siteContent.servicesPage.cta.description}
        primary={{
          label: siteContent.servicesPage.cta.primaryLabel,
          href: getPrimaryCtaHref(),
        }}
        secondary={{
          label: siteContent.servicesPage.cta.secondaryLabel,
          href: siteContent.servicesPage.cta.secondaryHref,
        }}
      />
    </>
  );
}
