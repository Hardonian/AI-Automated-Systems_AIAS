import type { Metadata } from "next";
import Link from "next/link";
import {
  type LucideIcon,
  ArrowUpRight,
  BookOpen,
  Braces,
  CheckCircle2,
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { RelatedPages } from "@/components/content/related-pages";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Documentation | AI Automated Systems",
  description:
    "Working guides, blueprints, governance notes, evidence standards, and operational boundaries for reliable AI automation.",
  canonical: "/docs",
});

const categoryIcons: Record<
  (typeof siteContent.docsPage.categories)[number]["icon"],
  LucideIcon
> = {
  book: BookOpen,
  code: Braces,
  shield: ShieldCheck,
  evidence: FileCheck2,
};

export default function DocsPage() {
  const { categories, hero, operatingModel, resources } = siteContent.docsPage;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((category) => {
            const CategoryIcon = categoryIcons[category.icon];

            return (
              <SurfaceCard
                key={category.title}
                className="flex h-full flex-col"
              >
                <div className="flex items-start gap-4 border-b border-border pb-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                    <CategoryIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">{category.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-2 divide-y divide-border/70">
                  {category.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="group flex items-start justify-between gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                        href={item.href}
                      >
                        <span>
                          <span className="flex items-center gap-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                            {item.label}
                            {item.format === "markdown" ? (
                              <span className="border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                MD
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            );
          })}
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {operatingModel.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {operatingModel.title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {operatingModel.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {operatingModel.commitments.map((commitment) => (
              <SurfaceCard key={commitment.title} className="h-full">
                <CheckCircle2
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-bold">{commitment.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {commitment.detail}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Interactive resources
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Move from reading to a decision
          </h2>
          <p className="mt-4 text-muted-foreground">
            Run the tools locally in your browser. No account, database, or
            backend submission is required.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <Link
              className="group block h-full"
              href={resource.href}
              key={resource.href}
            >
              <SurfaceCard className="h-full transition-colors group-hover:border-primary/60">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-bold transition-colors group-hover:text-primary">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {resource.description}
                </p>
              </SurfaceCard>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <RelatedPages
            title="Ready to apply the framework?"
            links={[
              { label: "Run the diagnostic", href: "/diagnostic" },
              { label: "Review services", href: "/services" },
              { label: "See engagement models", href: "/pricing" },
              { label: "Start an intake", href: "/contact" },
            ]}
          />
        </div>
      </PageSection>
    </>
  );
}
