"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ListPlus,
  Search,
  ShieldCheck,
  Target,
  X,
  Zap,
} from "lucide-react";

import type { CatalogPageContent, CatalogProduct } from "@/src/content/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";

const CATEGORIES = [
  "All",
  "Software Engines",
  "Turnkey Workflows",
  "Governance Kits",
  "UI Kits",
] as const;
const LICENSES = ["All", "Commercial", "Open Source"] as const;

type Category = (typeof CATEGORIES)[number];
type License = (typeof LICENSES)[number];

export function CatalogDirectoryClient({
  products,
  buyerPaths,
  proofBar,
}: {
  products: CatalogProduct[];
  buyerPaths: CatalogPageContent["buyerPaths"];
  proofBar: CatalogPageContent["proofBar"];
}) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedLicense, setSelectedLicense] = useState<License>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPathId, setSelectedPathId] = useState<string>("all");
  const [shortlist, setShortlist] = useState<string[]>([]);

  const selectedPath = buyerPaths.find((path) => path.id === selectedPathId);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesLicense =
        selectedLicense === "All" ||
        product.license.toLowerCase() === selectedLicense.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.techStack.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesBuyerPath =
        !selectedPath || selectedPath.productIds.includes(product.id);

      return (
        matchesCategory && matchesLicense && matchesSearch && matchesBuyerPath
      );
    });
  }, [products, selectedCategory, selectedLicense, searchQuery, selectedPath]);

  const shortlistedProducts = useMemo(
    () => products.filter((product) => shortlist.includes(product.id)),
    [products, shortlist],
  );

  const shortlistHref =
    shortlist.length > 0
      ? `/contact?ref=catalog&products=${encodeURIComponent(shortlist.join(","))}`
      : "/contact?ref=catalog";

  const toggleShortlist = (product: CatalogProduct) => {
    setShortlist((current) => {
      const isSelected = current.includes(product.id);
      if (!isSelected && current.length >= 3) return current;

      const next = isSelected
        ? current.filter((id) => id !== product.id)
        : [...current, product.id];

      track(
        isSelected ? "catalog_shortlist_removed" : "catalog_shortlist_added",
        {
          product: product.id,
          shortlist_size: next.length,
        },
      );
      return next;
    });
  };

  return (
    <div className="space-y-10">
      <section aria-labelledby="catalog-path-title" className="space-y-5">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Decision route 01 // Start with the pressure
          </p>
          <h2
            className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl"
            id="catalog-path-title"
          >
            Which operating problem needs to move?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Choose the closest pressure to narrow the catalog. The result is a
            starting hypothesis—not an automated architecture decision.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {buyerPaths.map((path) => {
            const isSelected = selectedPathId === path.id;
            return (
              <button
                aria-pressed={isSelected}
                className={`border-2 p-5 text-left transition-colors ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-950/70"
                    : "border-border bg-card hover:border-primary"
                }`}
                key={path.id}
                onClick={() => {
                  setSelectedPathId(path.id);
                  track("catalog_buyer_path_selected", { path: path.id });
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm font-black uppercase text-foreground">
                      {path.title}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {path.description}
                    </p>
                  </div>
                  <Target
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 ${isSelected ? "text-cyan-300" : "text-primary"}`}
                  />
                </div>
                <ul className="mt-4 space-y-1.5">
                  {path.signals.map((signal) => (
                    <li
                      className="flex gap-2 text-xs text-muted-foreground"
                      key={signal}
                    >
                      <CheckCircle
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400"
                      />
                      {signal}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {selectedPath && (
          <button
            className="font-mono text-xs font-bold uppercase text-primary underline underline-offset-4"
            onClick={() => setSelectedPathId("all")}
            type="button"
          >
            Clear operational-priority filter
          </button>
        )}
      </section>

      <h2 className="sr-only">Catalog modules</h2>

      <div className="grid border-2 border-border bg-background sm:grid-cols-2 lg:grid-cols-4">
        {proofBar.map(({ label, value }) => (
          <div
            className="border-b-2 border-border p-4 last:border-b-0 sm:border-r-2 sm:even:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r-2 lg:even:border-r-2 lg:last:border-r-0"
            key={label}
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 font-mono text-xs font-bold uppercase text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Category and Search Filter Bar */}
      <div className="flex flex-col gap-4 border-2 border-border bg-card p-6 shadow-card">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`border-2 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "border-cyan-400 bg-cyan-800 text-cyan-50"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              aria-label="Search catalog"
              type="text"
              placeholder="SEARCH CATALOG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none border-2 border-border bg-background pl-9 font-mono text-xs uppercase tracking-wider focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Secondary License Filter */}
        <div className="flex items-center gap-3 border-t border-border/60 pt-4">
          <span className="font-mono text-[11px] font-bold uppercase text-muted-foreground">
            License Type:
          </span>
          {LICENSES.map((lic) => (
            <button
              key={lic}
              onClick={() => setSelectedLicense(lic)}
              className={`font-mono text-xs font-bold uppercase underline-offset-4 cursor-pointer ${
                selectedLicense === lic
                  ? "text-cyan-500 underline"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              type="button"
            >
              {lic}
            </button>
          ))}
        </div>
      </div>

      <div className="sticky top-20 z-20 border-2 border-primary bg-background/95 p-4 shadow-[4px_4px_0px_0px_hsl(var(--primary))] backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListPlus aria-hidden="true" className="h-4 w-4 text-primary" />
              <p className="font-mono text-xs font-black uppercase tracking-wider text-foreground">
                Solution shortlist · {shortlist.length}/3
              </p>
            </div>
            {shortlistedProducts.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {shortlistedProducts.map((product) => (
                  <button
                    aria-label={`Remove ${product.title} from shortlist`}
                    className="inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-foreground hover:border-primary"
                    key={product.id}
                    onClick={() => toggleShortlist(product)}
                    type="button"
                  >
                    {product.title}
                    <X aria-hidden="true" className="h-3 w-3" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Compare up to three systems, then carry the exact shortlist into
                a fit review.
              </p>
            )}
          </div>
          {shortlist.length > 0 ? (
            <Button asChild className="shrink-0">
              <Link
                href={shortlistHref}
                onClick={() =>
                  track("catalog_shortlist_fit_review_clicked", {
                    shortlist_size: shortlist.length,
                    products: shortlist.join("|"),
                  })
                }
              >
                Review this shortlist
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button className="shrink-0" disabled type="button">
              Review this shortlist
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`flex flex-col justify-between border-2 bg-card overflow-hidden transition-all hover:-translate-y-1 ${
              product.featured
                ? "border-cyan-500 shadow-[4px_4px_0px_0px_hsl(var(--secondary))]"
                : "border-border shadow-card hover:border-foreground"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Card Image Header */}
              {product.thumbnailSrc && (
                <div className="relative h-48 w-full overflow-hidden border-b-2 border-border bg-surface-muted group">
                  <Image
                    src={product.thumbnailSrc}
                    alt={product.title}
                    fill
                    loading="eager"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b-2 border-border pb-4">
                  <span className="border border-border bg-surface-muted px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-foreground">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`border px-2 py-0.5 font-mono text-[10px] font-black uppercase ${
                        product.license === "Open Source"
                          ? "border-green-500 bg-green-500/10 text-green-500"
                          : "border-cyan-500 bg-cyan-500/10 text-cyan-500"
                      }`}
                    >
                      {product.license}
                    </span>
                    <span className="border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                      {product.badge}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mt-5 font-mono text-lg font-black uppercase text-foreground">
                  {product.title}
                </h3>
                <p className="mt-1 font-mono text-xs font-semibold text-cyan-500">
                  {product.subtitle}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                <div className="mt-5 border-l-2 border-cyan-500 bg-background p-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                    Operational outcome
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-foreground">
                    {product.operationalOutcome}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Strongest fit
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {product.bestFit.map((fit) => (
                      <li
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                        key={fit}
                      >
                        <Target
                          aria-hidden="true"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                        />
                        {fit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-l-2 border-border bg-background p-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Architecture boundary
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {product.architectureSummary}
                  </p>
                </div>

                {/* Tech Stack Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-border bg-surface-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features List */}
                <div className="mt-6 border-t border-border/60 pt-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Core Architecture Features:
                  </p>
                  <ul className="space-y-1.5">
                    {product.keyFeatures.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-xs text-foreground"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Included Artifacts */}
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Included Artifacts:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.includedArtifacts.map((art) => (
                      <span
                        key={art}
                        className="border border-border/80 bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {art}
                      </span>
                    ))}
                  </div>
                </div>

                <details className="group mt-5 border-2 border-border bg-background">
                  <summary className="cursor-pointer list-none px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="flex items-center justify-between gap-3">
                      Review technical delivery brief
                      <span aria-hidden="true" className="text-primary">
                        +
                      </span>
                    </span>
                  </summary>
                  <div className="space-y-5 border-t-2 border-border p-4">
                    {[
                      ["Inputs", product.inputs],
                      ["Deterministic controls", product.controlPoints],
                      ["Outputs", product.outputs],
                    ].map(([label, items]) => (
                      <div key={label as string}>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                          {label}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {(items as string[]).map((item) => (
                            <li
                              className="flex gap-2 text-xs text-muted-foreground"
                              key={item}
                            >
                              <span aria-hidden="true" className="text-primary">
                                →
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <div>
                      <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
                        <ShieldCheck
                          aria-hidden="true"
                          className="h-3.5 w-3.5 text-primary"
                        />
                        Measurement contract
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {product.successSignals.map((signal) => (
                          <li
                            className="text-xs text-muted-foreground"
                            key={signal}
                          >
                            {signal}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-l-2 border-amber-500 bg-amber-500/5 p-3">
                      <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        <AlertTriangle
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        />
                        Not a fit when
                      </p>
                      {product.nonFit.map((item) => (
                        <p
                          className="mt-1 text-xs text-muted-foreground"
                          key={item}
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </details>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3 p-6 pt-0 md:grid-cols-2 md:p-8 md:pt-0">
                <Button
                  aria-pressed={shortlist.includes(product.id)}
                  className="w-full"
                  disabled={
                    shortlist.length >= 3 && !shortlist.includes(product.id)
                  }
                  onClick={() => toggleShortlist(product)}
                  type="button"
                  variant="outline"
                >
                  {shortlist.includes(product.id)
                    ? "Shortlisted"
                    : "Add to shortlist"}
                  <ListPlus aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
                {product.liveDemoHref && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground hover:bg-surface-muted transition-colors"
                  >
                    <Link href={product.liveDemoHref}>
                      Try Live Demo
                      <Zap className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  className="w-full rounded-none border-2 border-cyan-500 bg-cyan-500/10 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 shadow-[2px_2px_0px_0px_rgba(6,182,212,0.5)] hover:bg-cyan-700 hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(6,182,212,1)] hover:-translate-y-0.5 transition-all backdrop-blur-sm"
                >
                  <Link
                    href={product.inquiryHref}
                    onClick={() =>
                      track("catalog_product_scope_clicked", {
                        product: product.id,
                      })
                    }
                  >
                    Request Scope
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="border-2 border-dashed border-border p-12 text-center">
          <p className="font-mono text-sm uppercase text-muted-foreground">
            No products found matching your filter criteria.
          </p>
          <Button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedLicense("All");
              setSearchQuery("");
            }}
            variant="outline"
            className="mt-4 rounded-none border-2 border-border font-mono text-xs uppercase"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
