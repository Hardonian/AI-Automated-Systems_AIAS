import type { Metadata } from "next";
import { RedirectClient } from "@/components/shared/redirect-client";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "Product Store | AIAS",
  description: "Browse AIAS products, tools, and workflow packs.",
  canonical: "/store",
});

export default function StorePage() {
  return <RedirectClient target="/catalog" label="Product Catalog" />;
}
