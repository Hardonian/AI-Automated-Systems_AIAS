"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  Code2,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
} from "lucide-react";

import { CatalogProduct } from "@/src/content/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "All",
  "Software Engines",
  "Turnkey Workflows",
  "Governance Kits",
  "UI Kits",
] as const;

export function CatalogDirectoryClient({
  products,
}: {
  products: CatalogProduct[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLicense, setSelectedLicense] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

      return matchesCategory && matchesLicense && matchesSearch;
    });
  }, [products, selectedCategory, selectedLicense, searchQuery]);

  return (
    <div className="space-y-10">
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
                    ? "border-cyan-500 bg-cyan-500 text-white"
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
          {["All", "Commercial", "Open Source"].map((lic) => (
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

      {/* Product Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col justify-between border-2 bg-card overflow-hidden transition-all hover:-translate-y-1 ${
              product.featured
                ? "border-cyan-500 shadow-[4px_4px_0px_0px_hsl(var(--secondary))]"
                : "border-border shadow-card hover:border-foreground"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Card Image Header */}
              {product.thumbnailSrc && (
                <div className="relative h-48 w-full border-b-2 border-border bg-black/50 overflow-hidden group">
                  <Image
                    src={product.thumbnailSrc}
                    alt={product.title}
                    fill
                    className="object-cover opacity-80 mix-blend-screen transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
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
                  {product.keyFeatures.map((feat, idx) => (
                    <li
                      key={idx}
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
            </div>

            {/* Action Buttons */}
            <div className="p-6 md:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
              {product.liveDemoHref && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto flex-1 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground hover:bg-surface-muted transition-colors"
                >
                  <Link href={product.liveDemoHref}>
                    Try Live Demo
                    <Zap className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}

              <Button
                asChild
                className="w-full sm:w-auto flex-1 rounded-none border-2 border-cyan-500 bg-cyan-500/10 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 shadow-[2px_2px_0px_0px_rgba(6,182,212,0.5)] hover:bg-cyan-500 hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(6,182,212,1)] hover:-translate-y-0.5 transition-all backdrop-blur-sm"
              >
                <Link
                  href={product.storeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hardonia Store
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            </div>
          </motion.div>
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
