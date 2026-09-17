import type { Metadata } from "next";
import { AuditRedirectClient } from "./audit-redirect-client";

export const metadata: Metadata = {
  title: "Free AI Lab Audit | AIAS",
  description:
    "Run a free AI lab audit: GPU truth, Ollama health, disk pressure, and monetization plays.",
};

export default function AuditPage() {
  return <AuditRedirectClient />;
}
