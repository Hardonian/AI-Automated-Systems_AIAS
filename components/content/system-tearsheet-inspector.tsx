"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Code2,
  Activity,
  ShieldCheck,
  Check,
  Copy,
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemScenario {
  id: string;
  name: string;
  badge: string;
  category: string;
  summary: string;
  slug: string;
  topologyNodes: Array<{
    stage: string;
    role: string;
    type: "deterministic" | "model" | "gate" | "storage";
  }>;
  schemaCode: string;
  telemetry: {
    passThroughRate: { before: string; after: string };
    unhandledErrors: { before: string; after: string };
    operatorLatency: { before: string; after: string };
    throughput: { before: string; after: string };
  };
  verification: {
    sha256: string;
    evalAssertions: string;
    dataResidency: string;
    ownershipModel: string;
  };
}

const SYSTEMS: SystemScenario[] = [
  {
    id: "hardonia-ops",
    name: "Hardonia Operations Fabric",
    badge: "Production Engine",
    category: "Retail & Supply Chain",
    summary:
      "Deterministic operational backbone connecting Shopify storefronts, warehouse inventory feeds, and automated supplier routing with reconciled audit records.",
    slug: "reach",
    topologyNodes: [
      { stage: "01. Ingestion", role: "Multi-channel webhook receiver & payload normalizer", type: "deterministic" },
      { stage: "02. Policy Intercept", role: "Zod inventory boundary & rate-limit circuit breaker", type: "gate" },
      { stage: "03. Scoped AI", role: "Unstructured supplier invoice & manifest extraction", type: "model" },
      { stage: "04. Reconciliation", role: "Deterministic ERP commit & automated ledger reconciliation", type: "storage" },
    ],
    schemaCode: `import { z } from "zod";

export const HardoniaSupplierOrderSchema = z.object({
  batchId: z.string().uuid(),
  supplierId: z.string().min(3).max(32),
  timestampUtc: z.string().datetime(),
  currency: z.enum(["CAD", "USD"]),
  lineItems: z.array(z.object({
    sku: z.string().regex(/^[A-Z0-9-]{4,16}$/),
    description: z.string().min(1),
    quantity: z.number().int().positive(),
    unitCostCents: z.number().int().positive(),
    allocatedWarehouse: z.enum(["TOR-01", "VAN-02", "MTL-01"]),
  })).min(1),
  totalCents: z.number().int().positive(),
  policyFlags: z.array(z.string()).default([]),
}).strict();`,
    telemetry: {
      passThroughRate: { before: "68.2%", after: "99.4%" },
      unhandledErrors: { before: "24.1%", after: "0.00%" },
      operatorLatency: { before: "45 mins", after: "3.8 mins" },
      throughput: { before: "14 orders/hr", after: "1,850 orders/hr" },
    },
    verification: {
      sha256: "8e4f1a9c3d2b7e5f0a6c8b1d4e7a2f5c9e3b1d7a4f6c8e0b2d5a7c9f1e3b5d7a",
      evalAssertions: "64/64 deterministic unit & invariant checks passed",
      dataResidency: "Sovereign Canadian Central (Montreal / Toronto VPC)",
      ownershipModel: "100% Client-Owned Source & IaC Scripts",
    },
  },
  {
    id: "settler-deployment",
    name: "Settler Release & Rollback Fabric",
    badge: "Control Plane",
    category: "Edge & CI/CD Governance",
    summary:
      "Release control plane built for static-first and edge-native deployments. Enforces 25-step verification suites, schema integrity, and automated rollback triggers.",
    slug: "settler",
    topologyNodes: [
      { stage: "01. Artifact Build", role: "Next.js static export & bundle budget validation", type: "deterministic" },
      { stage: "02. Invariant Scan", role: "Secrets scanner, CSP validator & pricing contract audit", type: "gate" },
      { stage: "03. Policy Gate", role: "Release gate checking SHA-256 release integrity tree", type: "gate" },
      { stage: "04. Edge Promotion", role: "Zero-downtime atomic promotion with instant rollback trigger", type: "storage" },
    ],
    schemaCode: `import { z } from "zod";

export const SettlerReleaseManifestSchema = z.object({
  releaseId: z.string().regex(/^rel_[a-f0-9]{16}$/),
  gitCommitSha: z.string().length(40),
  timestamp: z.string().datetime(),
  environment: z.enum(["staging", "production"]),
  verificationGates: z.object({
    lint: z.literal(true),
    typecheck: z.literal(true),
    unitTestsPassed: z.number().int().min(50),
    securityInvariants: z.literal(true),
    zeroBackendEnforced: z.literal(true),
  }),
  checksums: z.record(z.string(), z.string().length(64)),
}).strict();`,
    telemetry: {
      passThroughRate: { before: "76.0%", after: "100%" },
      unhandledErrors: { before: "18.4%", after: "0.00%" },
      operatorLatency: { before: "2.5 hours", after: "45 seconds" },
      throughput: { before: "3 deploys/wk", after: "40+ deploys/day" },
    },
    verification: {
      sha256: "3c7a9b1e5f2d4a6c8e0b7d9f1a3c5e7b2d4f6a8c0e2b4d6f8a1c3e5b7d9f2a4c",
      evalAssertions: "25/25 automated CI verification suites validated",
      dataResidency: "Zero-persistence Edge CDN with immutable artifact storage",
      ownershipModel: "Full source delivery with GitHub Actions runbooks",
    },
  },
  {
    id: "zeo-ingestion",
    name: "Zeo High-Throughput ETL Engine",
    badge: "Data Engine",
    category: "Financial Documents & Invoices",
    summary:
      "Converts high-variance incoming invoices, shipping manifests, and PDF contracts into strictly validated JSON records with automated confidence-gated human review.",
    slug: "zeo",
    topologyNodes: [
      { stage: "01. PDF Parse", role: "Local in-memory layout & text vector extraction", type: "deterministic" },
      { stage: "02. PII Sanitizer", role: "Deterministic regex mask for SIN, credit cards & health IDs", type: "gate" },
      { stage: "03. Model Extraction", role: "Bounded JSON extraction with confidence log-prob scoring", type: "model" },
      { stage: "04. Confidence Gate", role: "Deterministic router: >=0.92 commit vs. <0.92 review queue", type: "storage" },
    ],
    schemaCode: `import { z } from "zod";

export const ZeoInvoiceExtractionSchema = z.object({
  invoiceNumber: z.string().min(1).max(64),
  vendorName: z.string().min(2),
  vendorTaxId: z.string().regex(/^[A-Z0-9-]{9,15}$/).optional(),
  totalCents: z.number().int().positive(),
  subtotalCents: z.number().int().positive(),
  taxCents: z.number().int().nonnegative(),
  currency: z.enum(["CAD", "USD"]),
  confidenceScore: z.number().min(0).max(1),
  lineItems: z.array(z.object({
    sku: z.string().optional(),
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPriceCents: z.number().int().positive(),
  })).min(1),
}).strict();`,
    telemetry: {
      passThroughRate: { before: "54.0%", after: "98.7%" },
      unhandledErrors: { before: "31.2%", after: "0.00%" },
      operatorLatency: { before: "18 mins", after: "12 seconds" },
      throughput: { before: "25 docs/hr", after: "3,200 docs/hr" },
    },
    verification: {
      sha256: "5d9f1a3c7e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e1b3d5f",
      evalAssertions: "128 synthetic test invoices checked against golden set",
      dataResidency: "Zero Data Retention (ZDR) model contract enforced",
      ownershipModel: "Private VPC container deployment with client-owned keys",
    },
  },
];

export function SystemTearsheetInspector() {
  const [activeSystemId, setActiveSystemId] = useState<string>("hardonia-ops");
  const [activeTab, setActiveTab] = useState<"topology" | "schema" | "telemetry" | "verification">("topology");
  const [copied, setCopied] = useState(false);

  const activeSystem = SYSTEMS.find((s) => s.id === activeSystemId) ?? SYSTEMS[0]!;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeSystem.schemaCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full border-2 border-border bg-card p-6 sm:p-8 shadow-card text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            <Cpu className="h-3 w-3" />
            <span>Interactive Proof-of-Work Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
            SYSTEM TEARSHEET &amp; ARCHITECTURE INSPECTOR
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Inspect the exact topology, runtime Zod contracts, and verified telemetry from our production deployments.
          </p>
        </div>

        {/* System Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {SYSTEMS.map((system) => {
            const isSelected = system.id === activeSystemId;
            return (
              <button
                key={system.id}
                type="button"
                onClick={() => setActiveSystemId(system.id)}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {system.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active System Summary Header */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 border border-border p-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase text-primary tracking-widest">
              {activeSystem.name}
            </span>
            <span className="border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-foreground">
              {activeSystem.category}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground leading-relaxed max-w-2xl">
            {activeSystem.summary}
          </p>
        </div>

        <Button asChild size="sm" variant="outline" className="shrink-0 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-primary">
          <Link href={`/case-studies/${activeSystem.slug}`}>
            Full Case Study <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2" role="tablist" aria-label="System inspection views">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "topology"}
          onClick={() => setActiveTab("topology")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "topology"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          1. System Topology
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "schema"}
          onClick={() => setActiveTab("schema")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "schema"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          2. Runtime Schema Contract
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "telemetry"}
          onClick={() => setActiveTab("telemetry")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "telemetry"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          3. Verified Telemetry
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "verification"}
          onClick={() => setActiveTab("verification")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "verification"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          4. Release Integrity
        </button>
      </div>

      {/* Tab 1: Topology */}
      {activeTab === "topology" && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <p className="font-mono text-xs text-muted-foreground">
            Deterministic execution path through immutable gate nodes and pure-function model workers:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeSystem.topologyNodes.map((node, index) => (
              <div
                key={node.stage}
                className="border-2 border-border bg-background p-4 flex flex-col justify-between relative group hover:border-primary transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-primary">
                      {node.stage}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 border ${
                        node.type === "gate"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                          : node.type === "model"
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {node.type}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-mono leading-snug">
                    {node.role}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                  Node #{index + 1} // Guaranteed Invariant
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Runtime Schema */}
      {activeTab === "schema" && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              TypeScript / Zod Strict Boundary Specification:
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="h-7 border-border font-mono text-[10px] uppercase tracking-wider"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3 w-3 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3 w-3" /> Copy Schema
                </>
              )}
            </Button>
          </div>
          <pre className="overflow-x-auto border-2 border-border bg-black/90 p-4 font-mono text-xs leading-relaxed text-emerald-400">
            <code>{activeSystem.schemaCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 3: Telemetry */}
      {activeTab === "telemetry" && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <p className="font-mono text-xs text-muted-foreground">
            Measured production performance across baseline vs. hardened AIAS architecture:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-2 border-border bg-background p-4">
              <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                First-Pass Pass-Through
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-xs line-through text-muted-foreground">
                  {activeSystem.telemetry.passThroughRate.before}
                </span>
                <span className="font-mono text-xl font-black text-emerald-400">
                  {activeSystem.telemetry.passThroughRate.after}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Valid schema on first execution pass
              </p>
            </div>

            <div className="border-2 border-border bg-background p-4">
              <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                Unhandled Exceptions (500)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-xs line-through text-muted-foreground">
                  {activeSystem.telemetry.unhandledErrors.before}
                </span>
                <span className="font-mono text-xl font-black text-emerald-400">
                  {activeSystem.telemetry.unhandledErrors.after}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Zero silent failures or unparsed JSON drops
              </p>
            </div>

            <div className="border-2 border-border bg-background p-4">
              <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                Operator Triage Latency
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-xs line-through text-muted-foreground">
                  {activeSystem.telemetry.operatorLatency.before}
                </span>
                <span className="font-mono text-xl font-black text-primary">
                  {activeSystem.telemetry.operatorLatency.after}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Time required for exception resolution
              </p>
            </div>

            <div className="border-2 border-border bg-background p-4">
              <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                Processing Throughput
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-xs line-through text-muted-foreground">
                  {activeSystem.telemetry.throughput.before}
                </span>
                <span className="font-mono text-xl font-black text-foreground">
                  {activeSystem.telemetry.throughput.after}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Concurrent volume under peak load
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Release Integrity */}
      {activeTab === "verification" && (
        <div className="mt-6 space-y-3 font-mono text-xs animate-fade-in">
          <div className="border-2 border-border bg-background p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">Release SHA-256 Digest:</span>
              <span className="text-primary font-bold break-all sm:text-right">{activeSystem.verification.sha256}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">Evaluation Assertions:</span>
              <span className="text-foreground font-bold">{activeSystem.verification.evalAssertions}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">Data Residency Invariant:</span>
              <span className="text-foreground font-bold">{activeSystem.verification.dataResidency}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">Source Code Ownership:</span>
              <span className="text-emerald-400 font-bold">{activeSystem.verification.ownershipModel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
