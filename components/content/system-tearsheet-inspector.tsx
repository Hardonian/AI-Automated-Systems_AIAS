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
  Download,
  FileCode2,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopologyNode {
  stage: string;
  role: string;
  type: "deterministic" | "model" | "gate" | "storage";
  latencyBudget: string;
  contract: string;
  failSafe: string;
}

interface SystemScenario {
  id: string;
  name: string;
  badge: string;
  category: string;
  summary: string;
  slug: string;
  topologyNodes: TopologyNode[];
  schemaCode: string;
  telemetry: {
    passThroughRate: { before: string; after: string; delta: string };
    unhandledErrors: { before: string; after: string; delta: string };
    operatorLatency: { before: string; after: string; delta: string };
    throughput: { before: string; after: string; delta: string };
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
    badge: "Reference Scenario",
    category: "Retail & Supply Chain",
    summary:
      "Deterministic operational backbone connecting Shopify storefronts, warehouse inventory feeds, and automated supplier routing with reconciled audit records.",
    slug: "reach",
    topologyNodes: [
      {
        stage: "01. Ingestion",
        role: "Multi-channel webhook receiver & payload normalizer",
        type: "deterministic",
        latencyBudget: "< 12ms",
        contract: "ZodNormalizedWebhookPayload",
        failSafe: "Dead-letter replay queue with zero loss",
      },
      {
        stage: "02. Policy Intercept",
        role: "Zod inventory boundary & rate-limit circuit breaker",
        type: "gate",
        latencyBudget: "< 3ms",
        contract: "InventoryBoundaryPolicyRule",
        failSafe: "Deterministic circuit trip to freeze over-ordering",
      },
      {
        stage: "03. Scoped AI",
        role: "Unstructured supplier invoice & manifest extraction",
        type: "model",
        latencyBudget: "< 450ms",
        contract: "SupplierInvoiceExtractionSchema",
        failSafe: "Confidence threshold fallback to manual queue (<0.92)",
      },
      {
        stage: "04. Reconciliation",
        role: "Deterministic ERP commit & automated ledger reconciliation",
        type: "storage",
        latencyBudget: "< 25ms",
        contract: "LedgerCommitReceipt",
        failSafe: "Atomic two-phase commit rollback",
      },
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
      passThroughRate: { before: "68.2%", after: "99.4%", delta: "+31.2%" },
      unhandledErrors: { before: "24.1%", after: "0.00%", delta: "-100%" },
      operatorLatency: {
        before: "45 mins",
        after: "3.8 mins",
        delta: "-91.5%",
      },
      throughput: {
        before: "14 orders/hr",
        after: "1,850 orders/hr",
        delta: "132x",
      },
    },
    verification: {
      sha256:
        "8e4f1a9c3d2b7e5f0a6c8b1d4e7a2f5c9e3b1d7a4f6c8e0b2d5a7c9f1e3b5d7a",
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
      {
        stage: "01. Artifact Build",
        role: "Next.js static export & bundle budget validation",
        type: "deterministic",
        latencyBudget: "< 35s",
        contract: "StaticExportBundleManifest",
        failSafe: "Immediate build abort on budget breach (> 180kb JS)",
      },
      {
        stage: "02. Gate Engine",
        role: "25-suite verification matrix (SEO, Typecheck, Invariants)",
        type: "gate",
        latencyBudget: "< 45s",
        contract: "VerificationMatrixAssertionList",
        failSafe: "Release lock on any gate exit code != 0",
      },
      {
        stage: "03. Synthetic Probe",
        role: "Headless crawler & semantic route smoke assertion",
        type: "model",
        latencyBudget: "< 12s",
        contract: "SyntheticRouteProbeAssertion",
        failSafe: "Automatic rollback to previous green SHA-256 build",
      },
      {
        stage: "04. Edge Promotion",
        role: "Global immutable CDN deployment with SHA-256 ledger",
        type: "storage",
        latencyBudget: "< 8s",
        contract: "EdgePromotionLedgerRecord",
        failSafe: "Instant atomic DNS flip to previous tag",
      },
    ],
    schemaCode: `import { z } from "zod";

export const SettlerReleaseManifestSchema = z.object({
  releaseId: z.string().regex(/^rel_[0-9a-f]{16}$/),
  gitCommitSha: z.string().length(40),
  artifactFingerprint: z.string().length(64),
  verificationGatesPassed: z.number().int().min(25),
  totalGatesChecked: z.literal(25),
  deploymentTarget: z.enum(["edge-production", "edge-staging"]),
  policyInvariants: z.object({
    zeroUnhandled500s: z.literal(true),
    staticFirstCompliance: z.literal(true),
    zeroBackendEnforced: z.literal(true),
  }),
  checksums: z.record(z.string(), z.string().length(64)),
}).strict();`,
    telemetry: {
      passThroughRate: { before: "76.0%", after: "100%", delta: "+24.0%" },
      unhandledErrors: { before: "18.4%", after: "0.00%", delta: "-100%" },
      operatorLatency: {
        before: "2.5 hours",
        after: "45 seconds",
        delta: "-99.5%",
      },
      throughput: {
        before: "3 deploys/wk",
        after: "40+ deploys/day",
        delta: "93x",
      },
    },
    verification: {
      sha256:
        "3c7a9b1e5f2d4a6c8e0b7d9f1a3c5e7b2d4f6a8c0e2b4d6f8a1c3e5b7d9f2a4c",
      evalAssertions: "25/25 automated CI verification suites validated",
      dataResidency:
        "Zero-persistence Edge CDN with immutable artifact storage",
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
      {
        stage: "01. PDF Parse",
        role: "Local in-memory layout & text vector extraction",
        type: "deterministic",
        latencyBudget: "< 120ms",
        contract: "NormalizedPdfLayoutVector",
        failSafe: "Fallback OCR worker on corrupted binary stream",
      },
      {
        stage: "02. PII Sanitizer",
        role: "Deterministic regex mask for SIN, credit cards & health IDs",
        type: "gate",
        latencyBudget: "< 8ms",
        contract: "MaskedEntityStream",
        failSafe: "Quarantine document if high-entropy PII detected",
      },
      {
        stage: "03. Model Extraction",
        role: "Bounded JSON extraction with confidence log-prob scoring",
        type: "model",
        latencyBudget: "< 650ms",
        contract: "ModelExtractedFinancialDocument",
        failSafe: "Escalate to Human-in-the-Loop review when confidence < 0.92",
      },
      {
        stage: "04. Confidence Gate",
        role: "Deterministic router: >=0.92 commit vs. <0.92 review queue",
        type: "storage",
        latencyBudget: "< 15ms",
        contract: "AuditedFinancialRecord",
        failSafe: "Encrypted review workspace routing",
      },
    ],
    schemaCode: `import { z } from "zod";

export const ZeoFinancialRecordSchema = z.object({
  documentId: z.string().uuid(),
  sha256SourceDigest: z.string().length(64),
  counterparty: z.object({
    name: z.string().min(1),
    taxId: z.string().regex(/^[A-Z0-9-]{8,15}$/),
    jurisdiction: z.string().length(2),
  }),
  invoiceDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  subtotalCents: z.number().int().nonnegative(),
  taxCents: z.number().int().nonnegative(),
  totalCents: z.number().int().positive(),
  extractionConfidence: z.number().min(0.92).max(1.0),
  humanReviewRequired: z.boolean(),
  routingAction: z.enum(["AUTO_RECONCILE", "FLAG_VARIANCE", "OPERATOR_TRIAGE"]),
}).strict();`,
    telemetry: {
      passThroughRate: { before: "58.5%", after: "99.1%", delta: "+40.6%" },
      unhandledErrors: { before: "28.3%", after: "0.00%", delta: "-100%" },
      operatorLatency: {
        before: "18 mins/doc",
        after: "45 secs/doc",
        delta: "-95.8%",
      },
      throughput: {
        before: "80 docs/day",
        after: "12,000 docs/day",
        delta: "150x",
      },
    },
    verification: {
      sha256:
        "7a1e3b5d9f0c2e4a6b8d0f1a3c5e7b9d1f3a5c7e9b0d2f4a6c8e0b1d3f5a7c9e",
      evalAssertions: "120/120 synthetic financial edge case vectors validated",
      dataResidency: "Customer-Dedicated AWS/GCP Single-Tenant KMS",
      ownershipModel: "100% Client-Owned Source & Self-Hostable IaC",
    },
  },
  {
    id: "sovereign-health-mesh",
    name: "Sovereign Intake & Compliance Mesh",
    badge: "Regulated Fabric",
    category: "Healthcare & Legal Compliance",
    summary:
      "Deterministic zero-leakage patient and client intake engine. Enforces PIPEDA-aligned data residency, client-side de-identification, and tamper-evident audit ledgers.",
    slug: "website-automation-system",
    topologyNodes: [
      {
        stage: "01. Intake Gateway",
        role: "Client-side sanitized multi-source form and document ingestion",
        type: "deterministic",
        latencyBudget: "< 15ms",
        contract: "StrictRawIntakePayload",
        failSafe: "Client-side validation reject with zero remote transmission",
      },
      {
        stage: "02. De-Identification Gate",
        role: "Deterministic regex & token mask for health numbers, SIN, names",
        type: "gate",
        latencyBudget: "< 5ms",
        contract: "SanitizedEntityTokenRecord",
        failSafe: "Immediate circuit trip on unrecognized PII pattern",
      },
      {
        stage: "03. Extraction Worker",
        role: "Constrained JSON triage worker operating on anonymized tokens only",
        type: "model",
        latencyBudget: "< 850ms",
        contract: "ClinicalExtractionTriageSchema",
        failSafe: "Fallback to clinician triage queue when confidence < 0.95",
      },
      {
        stage: "04. Immutable Ledger",
        role: "Cryptographic SHA-256 sealed commit into sovereign Canadian database",
        type: "storage",
        latencyBudget: "< 40ms",
        contract: "SealedAuditReceiptPayload",
        failSafe:
          "Local-first rollback with cryptographically signed failure proof",
      },
    ],
    schemaCode: `import { z } from "zod";

export const SovereignIntakeSchema = z.object({
  caseId: z.string().uuid(),
  intakeTimestampUtc: z.string().datetime(),
  jurisdiction: z.enum(["CA-ON", "CA-BC", "CA-QC", "CA-AB"]),
  complianceProfile: z.object({
    pipedaAligned: z.literal(true),
    zeroRemoteRetention: z.literal(true),
    encryptedInFlight: z.literal(true),
  }),
  deIdentifiedEntities: z.array(z.object({
    tokenRef: z.string().regex(/^TKN-[0-9A-F]{8}$/),
    classification: z.enum(["HEALTH_RECORD", "FINANCIAL_NOTE", "LEGAL_BRIEF"]),
    redactionScore: z.number().min(0.99),
  })).min(1),
  triagePriority: z.enum(["P1_URGENT", "P2_STANDARD", "P3_REVIEW"]),
  integrityHash: z.string().length(64),
}).strict();`,
    telemetry: {
      passThroughRate: { before: "52.4%", after: "99.8%", delta: "+47.4%" },
      unhandledErrors: { before: "31.0%", after: "0.00%", delta: "-100%" },
      operatorLatency: {
        before: "4 hours",
        after: "90 seconds",
        delta: "-99.4%",
      },
      throughput: {
        before: "8 intakes/hr",
        after: "650 intakes/hr",
        delta: "81x",
      },
    },
    verification: {
      sha256:
        "91b8d2e4a6f7c0e1b3d5a7f9c2e4b6a8d0f2e4b6a8c0d2e4f6a8b0c2d4e6f8a0",
      evalAssertions:
        "48/48 PIPEDA-aligned data residency and redaction proofs planned",
      dataResidency:
        "Sovereign Canada Central (Local-first + Montreal Encrypted Storage)",
      ownershipModel: "100% Client-Owned Source & Self-Hostable IaC",
    },
  },
];

export function SystemTearsheetInspector() {
  const [activeSystemId, setActiveSystemId] = useState<string>("hardonia-ops");
  const [activeTab, setActiveTab] = useState<
    "topology" | "schema" | "telemetry" | "verification"
  >("topology");
  const [copied, setCopied] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(0);
  const [showBaselineComparison, setShowBaselineComparison] = useState(true);

  const activeSystem =
    SYSTEMS.find((s) => s.id === activeSystemId) ?? SYSTEMS[0]!;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeSystem.schemaCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownloadDossier = (format: "json" | "md") => {
    try {
      let content = "";
      const filename = `aias-${activeSystem.id}-dossier.${format}`;
      let mimeType = "application/json";

      if (format === "json") {
        content = JSON.stringify(activeSystem, null, 2);
      } else {
        mimeType = "text/markdown";
        content = `# AIAS Architecture Tearsheet: ${activeSystem.name}
**Category**: ${activeSystem.category}
**Release Integrity Digest (SHA-256)**: \`${activeSystem.verification.sha256}\`
**Verification Status**: ${activeSystem.verification.evalAssertions}
**Data Residency**: ${activeSystem.verification.dataResidency}
**Source Code Ownership**: ${activeSystem.verification.ownershipModel}

## System Summary
${activeSystem.summary}

## Execution Pipeline Topology
${activeSystem.topologyNodes
  .map(
    (n) => `### ${n.stage}: ${n.role}
- **Type**: ${n.type}
- **Latency Budget**: ${n.latencyBudget}
- **Contract Boundary**: ${n.contract}
- **Fault-Safe Policy**: ${n.failSafe}`,
  )
  .join("\n\n")}

## Runtime Zod Boundary Specification
\`\`\`typescript
${activeSystem.schemaCode}
\`\`\`

## Illustrative Scenario Targets (not measured client results)
- First-Pass Pass-Through Rate: ${activeSystem.telemetry.passThroughRate.after} (Baseline: ${activeSystem.telemetry.passThroughRate.before})
- Unhandled 500 Exceptions: ${activeSystem.telemetry.unhandledErrors.after} (Baseline: ${activeSystem.telemetry.unhandledErrors.before})
- Operator Triage Latency: ${activeSystem.telemetry.operatorLatency.after} (Baseline: ${activeSystem.telemetry.operatorLatency.before})
- Concurrency / Throughput: ${activeSystem.telemetry.throughput.after} (Baseline: ${activeSystem.telemetry.throughput.before})
`;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
  };

  const selectedNode =
    selectedNodeIndex !== null
      ? activeSystem.topologyNodes[selectedNodeIndex]
      : null;

  return (
    <div className="w-full border-2 border-border bg-card p-6 sm:p-8 shadow-card text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            <Cpu className="h-3 w-3" />
            <span>Representative Architecture Scenarios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
            SYSTEM TEARSHEET &amp; ARCHITECTURE INSPECTOR
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Inspect the topology, runtime Zod contracts, and target metrics of
            representative architecture scenarios. Figures are validation
            targets, not attributed client results.
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
                onClick={() => {
                  setActiveSystemId(system.id);
                  setSelectedNodeIndex(0);
                }}
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

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="shrink-0 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-primary"
          >
            <Link href={`/case-studies/${activeSystem.slug}`}>
              Full Case Study <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownloadDossier("json")}
            className="shrink-0 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider"
          >
            <FileCode2 className="mr-1.5 h-3.5 w-3.5" /> Export Spec (.json)
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2"
        role="tablist"
        aria-label="System inspection views"
      >
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
          3. Scenario Targets
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
          4. Release Contract
        </button>
      </div>

      {/* Tab 1: Topology */}
      {activeTab === "topology" && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
            <span>
              Click any execution node to inspect its runtime invariant and
              fault-safe bounds:
            </span>
            <span className="text-[10px] uppercase text-primary">
              [ 4-Stage Strict Pipeline ]
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeSystem.topologyNodes.map((node, index) => {
              const isSelected = selectedNodeIndex === index;
              return (
                <button
                  type="button"
                  key={node.stage}
                  onClick={() => setSelectedNodeIndex(index)}
                  className={`border-2 p-4 text-left flex flex-col justify-between relative transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-[3px_3px_0px_0px_hsl(var(--primary))]"
                      : "border-border bg-background hover:border-foreground"
                  }`}
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
                  <div className="mt-4 pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>Node #{index + 1}</span>
                    <span className="text-primary font-bold">
                      {node.latencyBudget}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Selected Node Detail Drawer */}
          {selectedNode && (
            <div className="mt-4 border-2 border-dashed border-border bg-muted/20 p-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> Node Deep Inspection:{" "}
                  {selectedNode.stage} — {selectedNode.role}
                </span>
                <span className="border border-border bg-background px-2 py-0.5 text-[10px] uppercase">
                  TYPE: {selectedNode.type}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-border bg-card p-3">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">
                    Latency Commitment
                  </p>
                  <p className="text-base font-bold text-foreground mt-1">
                    {selectedNode.latencyBudget}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Enforced at edge gateway
                  </p>
                </div>
                <div className="border border-border bg-card p-3">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">
                    Contract Boundary
                  </p>
                  <p className="text-sm font-bold text-emerald-400 mt-1 font-mono truncate">
                    {selectedNode.contract}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Strict Zod schema validation
                  </p>
                </div>
                <div className="border border-border bg-card p-3">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">
                    Deterministic Fail-Safe
                  </p>
                  <p className="text-xs font-semibold text-amber-400 mt-1">
                    {selectedNode.failSafe}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Zero unhandled 500 exceptions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Runtime Schema */}
      {activeTab === "schema" && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              TypeScript / Zod Strict Boundary Specification:
            </span>
            <div className="flex items-center gap-2">
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadDossier("md")}
                className="h-7 border-border font-mono text-[10px] uppercase tracking-wider"
              >
                <Download className="mr-1.5 h-3 w-3" /> Markdown Brief
              </Button>
            </div>
          </div>
          <pre className="overflow-x-auto border-2 border-border bg-black/90 p-4 font-mono text-xs leading-relaxed text-emerald-400">
            <code>{activeSystem.schemaCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 3: Telemetry */}
      {activeTab === "telemetry" && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              Illustrative target metrics comparing ungoverned LLM scripts
              against a governed architecture. Not measured client performance:
            </p>
            <button
              type="button"
              onClick={() => setShowBaselineComparison((prev) => !prev)}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-primary border border-border bg-muted/30 px-3 py-1 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {showBaselineComparison
                ? "Show Absolute Values Only"
                : "Compare Baseline vs Target"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-2 border-border bg-background p-4">
              <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                First-Pass Pass-Through
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                {showBaselineComparison && (
                  <span className="font-mono text-xs line-through text-muted-foreground">
                    {activeSystem.telemetry.passThroughRate.before}
                  </span>
                )}
                <span className="font-mono text-xl font-black text-emerald-400">
                  {activeSystem.telemetry.passThroughRate.after}
                </span>
                <span className="ml-auto font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30">
                  {activeSystem.telemetry.passThroughRate.delta}
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
                {showBaselineComparison && (
                  <span className="font-mono text-xs line-through text-muted-foreground">
                    {activeSystem.telemetry.unhandledErrors.before}
                  </span>
                )}
                <span className="font-mono text-xl font-black text-emerald-400">
                  {activeSystem.telemetry.unhandledErrors.after}
                </span>
                <span className="ml-auto font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30">
                  {activeSystem.telemetry.unhandledErrors.delta}
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
                {showBaselineComparison && (
                  <span className="font-mono text-xs line-through text-muted-foreground">
                    {activeSystem.telemetry.operatorLatency.before}
                  </span>
                )}
                <span className="font-mono text-xl font-black text-primary">
                  {activeSystem.telemetry.operatorLatency.after}
                </span>
                <span className="ml-auto font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 border border-primary/30">
                  {activeSystem.telemetry.operatorLatency.delta}
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
                {showBaselineComparison && (
                  <span className="font-mono text-xs line-through text-muted-foreground">
                    {activeSystem.telemetry.throughput.before}
                  </span>
                )}
                <span className="font-mono text-xl font-black text-foreground">
                  {activeSystem.telemetry.throughput.after}
                </span>
                <span className="ml-auto font-mono text-[10px] font-bold text-foreground bg-foreground/10 px-1.5 py-0.5 border border-border">
                  {activeSystem.telemetry.throughput.delta}
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
        <div className="mt-6 space-y-4 font-mono text-xs animate-fade-in">
          <div className="border-2 border-border bg-background p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">
                Example SHA-256 Digest (illustrative format):
              </span>
              <span className="text-primary font-bold break-all sm:text-right">
                {activeSystem.verification.sha256}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">
                Planned Evaluation Assertions:
              </span>
              <span className="text-foreground font-bold">
                {activeSystem.verification.evalAssertions}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">
                Data Residency Invariant:
              </span>
              <span className="text-foreground font-bold">
                {activeSystem.verification.dataResidency}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-muted-foreground uppercase text-[10px]">
                Source Code Ownership:
              </span>
              <span className="text-emerald-400 font-bold">
                {activeSystem.verification.ownershipModel}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-[10px] text-muted-foreground">
              ALL ASSETS ISSUED UNDER DIRECT CLIENT REPOSITORY OWNERSHIP · ZERO
              RUNTIME SEAT LICENSES
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadDossier("json")}
              className="font-mono text-xs uppercase"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download Scenario
              Dossier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
