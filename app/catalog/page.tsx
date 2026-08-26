import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
} from 'lucide-react';

import { PageHero, PageSection } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { siteContent } from '@/src/content/site';
import { CatalogDirectoryClient } from '@/components/catalog/catalog-directory-client';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Product Catalog & Hardonia Store Gateway | AIAS',
  description:
    'Browse ready-to-deploy automation software engines, deterministic workflow packs, and Hardonia ecosystem products.',
  canonical: '/catalog',
});

export default function ProductCatalogPage() {
  const products = siteContent.catalogProducts || [];

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: 'Product Catalog' }]} />
      </div>

      <PageHero
        eyebrow="Prong 03 // Turnkey Software & Hardonia Store"
        title="Software Engines & Product Catalog"
        description="Browse our tested library of deployable automation engines, deterministic governance kits, and Hardonia ecosystem software. Engineered for immediate integration with full code ownership."
      />

      <PageSection>
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
              Every software engine and workflow pack can be customized, integrated into legacy
              systems, and hardened for enterprise data residency by our senior architects.
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
