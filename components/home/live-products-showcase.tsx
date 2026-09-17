"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  slug: string;
  name: string;
  price: string;
  status: string;
  offer: string;
  checkout_url: string;
}

export function LiveProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("https://api.aiautomatedsystems.ca/api/products", {
      signal: AbortSignal.timeout(8000),
    })
      .then((r) => r.json())
      .then((d) => {
        const ready = (d.products ?? [])
          .filter((p: Product) => p.status === "ready")
          .slice(0, 8);
        setProducts(ready);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || products.length === 0) return null;

  return (
    <section className="border-b-2 border-border py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Live from the sovereign lab
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tighter sm:text-4xl">
            Ready-to-deploy products
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-sm text-muted-foreground">
            Built on real GPU infrastructure. Tested in production. Delivered
            with documentation and support.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <a
              key={p.slug}
              href={p.checkout_url || `https://api.aiautomatedsystems.ca/p/${p.slug}`}
              className="group flex flex-col border-2 border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {p.status}
              </p>
              <h3 className="mt-2 font-mono text-sm font-bold uppercase text-foreground group-hover:text-primary">
                {p.name}
              </h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {p.offer}
              </p>
              <p className="mt-3 font-mono text-base font-black text-primary">
                {p.price}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="font-mono text-sm font-bold uppercase tracking-widest text-primary underline decoration-2 underline-offset-8 transition-colors hover:text-foreground"
          >
            VIEW FULL CATALOG //
          </Link>
        </div>
      </div>
    </section>
  );
}
