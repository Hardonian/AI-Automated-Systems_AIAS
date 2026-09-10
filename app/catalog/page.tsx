import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Cpu } from "lucide-react";

import { PageHero, PageSection } from "@/components/ui/section-primitives";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { siteContent } from "@/src/content/site";
import { CatalogDirectoryClient } from "@/components/catalog/catalog-directory-client";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateSEOMetadata({
  title: "AI Systems & Module Catalog | AIAS",
  description:
    "Explore reference automation engines, governed workflow packs, and implementation-ready module scopes.",
  canonical: "/catalog",
});

export default function ProductCatalogPage() {
  const { catalogPage, catalogProducts: products } = siteContent;

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: "Product Catalog" }]} />
      </div>

      <PageHero
        eyebrow="Prong 03 // Reference Systems & Modules"
        title="AI Systems & Module Catalog"
        description="Start with an operating pressure, inspect the technical boundary, and shortlist the systems worth a fit review. Every module defines inputs, controls, outputs, evidence, and non-fit conditions before production work begins."
      />

      <PageSection className="scroll-mt-24">
        <div className="mb-8 border-l-2 border-primary bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-mono text-xs uppercase tracking-wider text-foreground">
            Catalog status:
          </strong>{" "}
          These are implementation reference scopes, not one-click software
          purchases. A fit review confirms integrations, controls, ownership,
          and delivery boundaries before work begins.
        </div>

        {/* Interactive Filterable Catalog Directory */}
        <CatalogDirectoryClient
          buyerPaths={catalogPage.buyerPaths}
          products={products}
          proofBar={catalogPage.proofBar}
        />
      </PageSection>

      <PageSection background="muted">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Delivery route // From reference to owned operation
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-foreground">
            Evidence at every exit
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Scope expands only when the previous stage produces decision-grade
            evidence. That keeps experimentation cheap and production risk
            visible.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {catalogPage.deliverySteps.map((item) => (
            <li className="border-2 border-border bg-card p-6" key={item.step}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-primary">
                  {item.step}
                </span>
                <h3 className="font-mono text-sm font-black uppercase text-foreground">
                  {item.title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-5 border-t-2 border-border pt-4">
                <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  <CheckCircle aria-hidden="true" className="h-3.5 w-3.5" />
                  Exit evidence
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.exitEvidence}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection width="narrow">
        <div className="text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Buyer questions // Answered directly
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-foreground">
            Before you shortlist a system
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {catalogPage.faqs.map((item) => (
            <details
              className="group border-2 border-border bg-card"
              key={item.question}
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-mono text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span aria-hidden="true" className="text-primary">
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t-2 border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted">
        {/* Custom Engineering Callout */}
        <div className="border-2 border-primary bg-card p-8 md:p-10 shadow-[4px_4px_0px_0px_hsl(var(--primary))] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <Cpu className="h-4 w-4" />
              <span>Need Bespoke Customization?</span>
            </div>
            <h2 className="font-mono text-xl font-black uppercase text-foreground sm:text-2xl">
              Hire AIAS Engineers to Adapt Any Catalog Module
            </h2>
            <p className="mt-2 text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Catalog entries are reference scopes. We can adapt the relevant
              architecture to your systems, control requirements, ownership
              model, and deployment boundary. Bring one representative workflow,
              approximate volume, known failure modes, and the person who owns
              the outcome.
            </p>
          </div>
          <Button
            asChild
            className="rounded-none border-2 border-primary bg-primary px-6 py-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-transform flex-shrink-0"
          >
            <Link href="/contact?ref=catalog&intent=custom-build">
              Start a Fit Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageSection>
    </>
  );
}
