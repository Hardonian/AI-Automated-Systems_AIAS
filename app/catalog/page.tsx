import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";

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
  const products = siteContent.catalogProducts;

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: "Product Catalog" }]} />
      </div>

      <PageHero
        eyebrow="Prong 03 // Reference Systems & Modules"
        title="AI Systems & Module Catalog"
        description="Explore implementation-ready reference scopes for automation engines, deterministic governance kits, and operator tooling. Each module is adapted to your constraints before production use."
      />

      <PageSection>
        <div className="mb-8 border-l-2 border-primary bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-mono text-xs uppercase tracking-wider text-foreground">
            Catalog status:
          </strong>{" "}
          These are implementation reference scopes, not one-click software
          purchases. A fit review confirms integrations, controls, ownership,
          and delivery boundaries before work begins.
        </div>

        {/* Interactive Filterable Catalog Directory */}
        <CatalogDirectoryClient products={products} />

        {/* Custom Engineering Callout */}
        <div className="mt-16 border-2 border-primary bg-card p-8 md:p-10 shadow-[4px_4px_0px_0px_hsl(var(--primary))] flex flex-col md:flex-row items-center justify-between gap-6">
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
              model, and deployment boundary.
            </p>
          </div>
          <Button
            asChild
            className="rounded-none border-2 border-primary bg-primary px-6 py-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-transform flex-shrink-0"
          >
            <Link href="/hire">
              Hire Us for Custom Build
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageSection>
    </>
  );
}
