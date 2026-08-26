import type { Metadata } from "next";
import { FAQSection } from "@/components/content/faq-section";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { PageHero, PageSection } from "@/components/ui/section-primitives";
import { RelatedPages } from "@/components/content/related-pages";
import { siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "AI Automation FAQ — Pricing, Process, Security | AIAS",
  description:
    "Frequently asked questions about AIAS consulting engagements, delivery model, pricing, and onboarding.",
  canonical: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Engagement clarity"
        title="Frequently Asked Questions"
        description="AIAS supports teams that need trustworthy automation outcomes with clear governance and measurable reliability. This FAQ explains how we scope work, structure engagement tracks, and protect operational integrity. Discovery comes first so implementation commitments are realistic and accountable."
      />
      <FAQSection
        entries={siteContent.faq}
        subtitle="Answers on engagement models, timelines, governance, and how we keep rollouts practical and low-risk."
        title="Detailed questions and answers"
      />
      <PageSection background="muted">
        <RelatedPages
          links={[
            { label: "Services", href: "/services" },
            { label: "Diagnostic", href: "/diagnostic" },
            { label: "Framework", href: "/framework" },
            { label: "Start intake", href: "/contact" },
          ]}
        />
      </PageSection>
    </>
  );
}
