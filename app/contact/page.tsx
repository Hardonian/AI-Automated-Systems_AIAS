import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Mail } from "lucide-react";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Button } from "@/components/ui/button";
import { IntakeForm } from "@/components/IntakeForm";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact AIAS | Enterprise Automation Inquiries",
  description:
    "Request an enterprise automation consultation or architecture review. Share the workflow, outcome, and existing constraints without sending sensitive records.",
  canonical: "/contact",
});

export default function ContactPage() {
  const bookingHref = getPrimaryCtaHref();
  const catalogOptions = siteContent.catalogProducts.map(({ id, title }) => ({
    id,
    title,
  }));

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Turn one blocked workflow into a decision-ready next step"
        description="Bring the workflow, approximate volume, failure pattern, accountable owner, and current systems. We will qualify the opportunity, name material risks, and recommend the smallest useful next step—even when that recommendation is not to build."
      />

      <PageSection>
        <div className="grid gap-8 md:grid-cols-2">
          <SurfaceCard className="border-primary/40 bg-primary/5">
            <BriefcaseBusiness
              aria-hidden="true"
              className="h-6 w-6 text-primary"
            />
            <h2 className="mt-4 text-2xl font-semibold">
              Enterprise project inquiries
            </h2>
            <p className="mt-3 text-muted-foreground">
              {siteContent.enterpriseEngagement.inquiryNote}
            </p>
            <Button asChild className="mt-6 w-full" size="lg">
              <a href={siteContent.enterpriseEngagement.inquiry.href}>
                {siteContent.enterpriseEngagement.inquiry.label}
              </a>
            </Button>
          </SurfaceCard>

          <SurfaceCard>
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold">
              Request architecture review
            </h2>
            <p className="mt-3 text-muted-foreground">
              Share context asynchronously and we will reply with next steps and
              suggested scope.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {siteContent.contact.responseTime}
            </p>
            <Button asChild className="mt-6 w-full" size="lg" variant="outline">
              <a href={`mailto:${siteContent.contact.email}`}>
                {siteContent.contact.email}
              </a>
            </Button>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Operating evidence",
              body: "Approximate volume, cycle time, exception rate, manual effort, and the business consequence of failure.",
            },
            {
              title: "System boundary",
              body: "Authoritative sources, current tools, downstream actions, access constraints, and the person who owns the outcome.",
            },
            {
              title: "Decision constraint",
              body: "Urgency, acceptable review load, security or retention requirements, and what would make the work not worth doing.",
            },
          ].map((item) => (
            <SurfaceCard key={item.title}>
              <h2 className="font-mono text-sm font-black uppercase text-foreground">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection width="narrow">
        <IntakeForm
          bookingHref={bookingHref}
          catalogOptions={catalogOptions}
          contactEmail={siteContent.contact.email}
        />
      </PageSection>

      <PageSection background="muted" width="narrow">
        <SurfaceCard>
          <h2 className="text-2xl font-bold">What happens after the brief</h2>
          <ol className="mt-5 space-y-3 text-muted-foreground">
            <li>1. Fit response and clarification questions.</li>
            <li>
              2. Recommended proof boundary, material risks, and explicit
              non-goals.
            </li>
            <li>
              3. Proposed engagement shape, decision owner, and measurement
              contract.
            </li>
          </ol>
          <Link
            className="mt-6 inline-block font-semibold text-primary underline underline-offset-4"
            href="/pricing"
          >
            Review engagement shapes
          </Link>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
