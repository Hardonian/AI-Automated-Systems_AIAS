import type { Metadata } from "next";
import { RedirectClient } from "@/components/shared/redirect-client";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "Private AI Benchmark | AIAS",
  description:
    "Benchmark your private AI infrastructure — GPU utilization, inference throughput, model portfolio, and operational readiness.",
  canonical: "/proof-benchmark",
});

export default function ProofBenchmarkPage() {
  return (
    <RedirectClient
      target="https://api.aiautomatedsystems.ca/proof-benchmark"
      label="Private AI Benchmark"
    />
  );
}
