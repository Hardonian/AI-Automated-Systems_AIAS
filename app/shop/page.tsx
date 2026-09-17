import type { Metadata } from "next";
import { RedirectClient } from "@/components/shared/redirect-client";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "Shop | AIAS",
  description: "Browse AIAS products, tools, and workflow packs.",
  canonical: "/shop",
});

export default function ShopPage() {
  return <RedirectClient target="/catalog" label="Product Catalog" />;
}
