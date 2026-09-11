import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  PackageCheck,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { siteContent } from "@/src/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return siteContent.catalogProducts.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = siteContent.catalogProducts.find((item) => item.id === slug);

  if (!product) {
    return generateSEOMetadata({
      title: "Catalog system not found | AIAS",
      description: "The requested AIAS catalog system was not found.",
      canonical: "/catalog",
    });
  }

  return generateSEOMetadata({
    title: `${product.title} | AIAS System Catalog`,
    description: product.operationalOutcome,
    canonical: `/catalog/${product.id}`,
    keywords: [
      product.category,
      "deterministic automation",
      "governed AI system",
      ...product.techStack,
    ],
  });
}

function EvidenceList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <CheckCircle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function CatalogProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = siteContent.catalogProducts.find((item) => item.id === slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.title,
    description: product.description,
    category: product.category,
    provider: {
      "@type": "Organization",
      name: siteContent.brand.name,
      url: "https://aiautomatedsystems.ca",
    },
    url: `https://aiautomatedsystems.ca/catalog/${product.id}`,
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        id={`catalog-service-${product.id}`}
        type="application/ld+json"
      />
      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: "Catalog", href: "/catalog" },
            { label: product.title },
          ]}
        />
      </div>

      <PageHero
        description={product.operationalOutcome}
        eyebrow={`${product.category} // ${product.license}`}
        title={product.title}
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-72 overflow-hidden border-2 border-border bg-card lg:min-h-[440px]">
            {product.thumbnailSrc ? (
              <Image
                alt={product.title}
                className="object-cover"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 52vw"
                src={product.thumbnailSrc}
              />
            ) : null}
          </div>
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Operating boundary
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <p className="mt-4 border-l-2 border-primary bg-card p-4 text-sm leading-relaxed text-foreground">
                {product.architectureSummary}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Technology envelope
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.techStack.map((technology) => (
                  <span
                    className="border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={product.inquiryHref}>
                  Request fit review
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/catalog">Compare catalog systems</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Inputs", items: product.inputs, icon: Target },
            {
              title: "Deterministic controls",
              items: product.controlPoints,
              icon: ShieldCheck,
            },
            { title: "Outputs", items: product.outputs, icon: PackageCheck },
          ].map(({ title, items, icon: Icon }) => (
            <SurfaceCard key={title}>
              <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-mono text-lg font-black uppercase">
                {title}
              </h2>
              <EvidenceList items={items} />
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-2">
          <SurfaceCard>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Strongest fit
            </p>
            <h2 className="mt-3 text-2xl font-black">Use this pattern when</h2>
            <EvidenceList items={product.bestFit} />
          </SurfaceCard>
          <SurfaceCard className="border-amber-500/60">
            <AlertTriangle
              aria-hidden="true"
              className="h-5 w-5 text-amber-400"
            />
            <h2 className="mt-4 text-2xl font-black">Do not force the fit</h2>
            <EvidenceList items={product.nonFit} />
          </SurfaceCard>
          <SurfaceCard>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Measurement contract
            </p>
            <h2 className="mt-3 text-2xl font-black">Signals before claims</h2>
            <EvidenceList items={product.successSignals} />
          </SurfaceCard>
          <SurfaceCard>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Transfer package
            </p>
            <h2 className="mt-3 text-2xl font-black">Included artifacts</h2>
            <EvidenceList items={product.includedArtifacts} />
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Reference-to-production path
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase">
            Evidence at each expansion point
          </h2>
        </div>
        <ol className="mt-8 grid gap-5 md:grid-cols-2">
          {siteContent.catalogPage.deliverySteps.map((step) => (
            <li className="border-2 border-border bg-card p-5" key={step.step}>
              <p className="font-mono text-xs font-bold uppercase text-primary">
                {step.step} / {step.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-foreground">
                Exit evidence: {step.exitEvidence}
              </p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection width="narrow">
        <SurfaceCard className="text-center">
          <h2 className="text-3xl font-black uppercase">
            Qualify this system against your workflow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Bring approximate volume, current systems, failure patterns, and the
            accountable owner. The fit review will identify the smallest useful
            proof—or explain why this system should not be built.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href={product.inquiryHref}>
              Start system fit review
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </SurfaceCard>
      </PageSection>
    </>
  );
}
