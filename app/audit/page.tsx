import type { Metadata } from "next";
import { RedirectClient } from "@/components/shared/redirect-client";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "Free AI Lab Audit | AIAS",
  description:
    "Run a free AI lab audit: GPU truth, Ollama health, disk pressure, and monetization plays.",
  canonical: "/audit",
});

export default function AuditPage() {
  return (
    <RedirectClient
      target="https://api.aiautomatedsystems.ca/audit/"
      label="AI Lab Audit"
    />
  );
}
