import type { Metadata } from "next";
import { RedirectClient } from "@/components/shared/redirect-client";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "Sovereign AI Proof Score | AIAS",
  description:
    "Get your sovereign AI proof score — evidence-based assessment of your private AI stack's readiness, governance, and operational posture.",
  canonical: "/proof-score",
});

export default function ProofScorePage() {
  return (
    <RedirectClient
      target="https://api.aiautomatedsystems.ca/proof-score"
      label="Sovereign AI Proof Score"
    />
  );
}
