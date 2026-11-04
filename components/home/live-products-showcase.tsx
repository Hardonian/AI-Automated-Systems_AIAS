"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Layers } from "lucide-react";

import { siteContent } from "@/src/content/site";

interface Product {
  slug: string;
  name: string;
  price?: string;
  status: string;
  offer: string;
  checkout_url?: string;
}

export function LiveProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLiveApi, setIsLiveApi] = useState(false);

  useEffect(() => {
    const isProductionHost =
      typeof window !== "undefined" &&
      (window.location.hostname === "aiautomatedsystems.ca" ||
        window.location.hostname === "www.aiautomatedsystems.ca");
    if (!isProductionHost) return;

    fetch("https://api.aiautomatedsystems.ca/api/products", {
      signal: AbortSignal.timeout(4000),
    })
      .then((r) => r.json())
      .then((d) => {
        const ready = (d.products ?? [])
          .filter((p: Product) => p.status === "ready")
          .slice(0, 8);
        if (ready.length > 0) {
          setProducts(ready);
          setIsLiveApi(true);
        }
      })
      .catch(() => {
        // Graceful fallback to static catalog systems
      });
  }, []);

  const fallbackProducts = siteContent.catalogProducts.slice(0, 4);

  return (
    <section className="border-b-2 border-border py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 border-2 border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {isLiveApi
                ? "Live from the Sovereign Lab"
                : "Turnkey AI Systems & Modules"}
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tighter sm:text-4xl">
            READY-TO-DEPLOY SYSTEMS & MODULES
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-sm text-muted-foreground">
            Deterministic software engines, governed workflow packs, and runtime
            guardrail suites with full source delivery and auditable contracts.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLiveApi && products.length > 0
            ? products.map((p) => (
                <a
                  key={p.slug}
                  href={
                    p.checkout_url ||
                    `https://api.aiautomatedsystems.ca/p/${p.slug}`
                  }
                  className="group flex flex-col border-2 border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/40 bg-primary/5 px-2 py-0.5">
                      {p.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-mono text-sm font-bold uppercase text-foreground group-hover:text-primary">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {p.offer}
                  </p>
                  {p.price && (
                    <p className="mt-3 font-mono text-base font-black text-primary">
                      {p.price}
                    </p>
                  )}
                </a>
              ))
            : fallbackProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalog/${p.id}`}
                  className="group flex flex-col border-2 border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/40 bg-primary/5 px-2 py-0.5">
                      {p.badge}
                    </span>
                    <span className="font-mono text-[9px] uppercase text-muted-foreground">
                      {p.license}
                    </span>
                  </div>
                  <h3 className="mt-3 font-mono text-sm font-bold uppercase text-foreground group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {p.operationalOutcome}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                      Inspect Specs
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="font-mono text-sm font-bold uppercase tracking-widest text-primary underline decoration-2 underline-offset-8 transition-colors hover:text-foreground"
          >
            VIEW FULL SYSTEM CATALOG //
          </Link>
        </div>
      </div>
    </section>
  );
}
