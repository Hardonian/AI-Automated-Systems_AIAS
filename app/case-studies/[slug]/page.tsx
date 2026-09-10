import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";

import {
  PageCta,
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Button } from "@/components/ui/button";
import { getPrimaryCtaHref } from "@/src/content/site";
import { caseStudies, getCaseStudyBySlug } from "@/lib/case-studies-generator";
import { ArchitectureDiagram } from "@/components/visual/ArchitectureDiagram";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  CaseStudySchema,
  OrganizationSchema,
  ServiceSchema,
  FAQSchema,
} from "@/components/seo/structured-data";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study Not Found | AI Automated Systems",
    };
  }

  const title = `${study.title} | AIAS Case Study`;
  const description = `Reference scenario for the architecture, constraints, and validation plan behind ${study.title}.`;
  const metadata = generateSEOMetadata({
    title,
    description,
    canonical: `/case-studies/${slug}`,
  });

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article" },
  };
}

function SectionList({
  title,
  items,
  icon: Icon = CheckCircle2,
}: {
  title: string;
  items: string[];
  icon?: LucideIcon;
}) {
  return (
    <SurfaceCard>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm text-muted-foreground"
          >
            <Icon className="mt-1 h-4 w-4 shrink-0 text-primary/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

const PRICING_ALIGNMENT = [
  { label: "Build", href: "/contact?ref=build" },
  { label: "Train", href: "/contact?ref=train" },
  { label: "Operate", href: "/contact?ref=operate" },
  { label: "Scale", href: "/contact?ref=scale" },
];

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema />
      <ServiceSchema
        name={`${study.title} Implementation`}
        description={study.problem}
      />
      <CaseStudySchema
        title={study.title}
        description={study.problem}
        url={`https://aiautomatedsystems.ca/case-studies/${slug}`}
      />
      <FAQSchema
        faqs={[
          {
            question: `What was the primary objective of the ${study.title} project?`,
            answer: study.problem,
          },
          {
            question: `Which technologies were used in the ${study.title} architecture?`,
            answer: study.technologies.join(", "),
          },
        ]}
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: "Case Studies", href: "/case-studies" },
            { label: study.title },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Representative Architecture Scenario"
        title={study.title}
        description="A reference scenario covering architectural constraints, implementation choices, and the evidence required to validate outcomes in a real engagement."
      />

      <PageSection width="narrow">
        <div className="space-y-6">
          <SurfaceCard>
            <h2 className="text-2xl font-bold tracking-tight italic text-primary/80">
              01 / The Problem
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {study.problem}
            </p>
          </SurfaceCard>

          <SurfaceCard>
            <h2 className="text-2xl font-bold tracking-tight italic text-primary/80">
              02 / Interactive Architecture
            </h2>
            <p className="mt-2 mb-8 text-sm text-muted-foreground">
              Hover components to explore layer responsibilities.
            </p>
            <ArchitectureDiagram />
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          <SectionList
            title="03 / Architecture Components"
            items={study.architecture}
          />
          <SectionList
            title="04 / Implementation Highlights"
            items={study.implementationHighlights}
          />
          <SectionList
            title="05 / Automation Wins"
            items={study.automationWins}
          />
          <SectionList
            title="06 / Validation Plan"
            items={study.measurableImpact}
          />
        </div>
      </PageSection>

      <PageSection background="muted" width="narrow">
        <SurfaceCard className="border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold text-center">
            Aligned Engagement Paths
          </h2>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Select a path to deploy similar architecture in your environment.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PRICING_ALIGNMENT.map((item) => (
              <Button
                key={item.label}
                asChild
                variant="outline"
                className="bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Link href={item.href}>
                  {item.label}
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>
        </SurfaceCard>
      </PageSection>

      <PageCta
        title="Ready to automate your high-value workflows?"
        description="We scope engagements based on measurable ROI, governance needs, and technical constraints."
        primary={{ label: "Book Strategy Call", href: getPrimaryCtaHref() }}
        secondary={{ label: "Back to Case Studies", href: "/case-studies" }}
      />
    </>
  );
}
