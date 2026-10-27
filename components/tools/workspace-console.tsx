"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  FileCode2,
  Hash,
  Mail,
  Plus,
  Share2,
  ShieldAlert,
  Upload,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  decryptClientState,
  encryptClientState,
  generateDiagnosticMailto,
  generateSHA256Receipt,
  useBroadcastChannel,
  useLocalStorage,
  useWebShare,
  type EncryptedClientExport,
} from "@/lib/utils/client-engines";

type Status =
  "idle" | "copied" | "hashed" | "encrypted" | "fault-verified" | "error";

interface BriefTemplate {
  id: string;
  label: string;
  badge: string;
  content: string;
}

const BRIEF_TEMPLATES: BriefTemplate[] = [
  {
    id: "finops-ledger",
    label: "FinOps Ledger Guard",
    badge: "0.00% Math Drift",
    content: [
      "Objective: Automate AP/AR invoice reconciliation and ERP posting with zero mathematical variance.",
      "Constraints: P95 latency < 2s | PIPEDA-informed data boundary | 100% double-entry balance check in TypeScript.",
      "Failure modes: Unvalidated LLM arithmetic drift; duplicate webhook replay; multi-currency rounding mismatch.",
      "Architecture topology:",
      "- Gate 01 (Deterministic): Strict Zod schema contract + idempotency key deduplication.",
      "- Gate 02 (Governed AI): Scoped OCR/entity extraction at temperature=0.0 with confidence >= 0.94.",
      "- Gate 03 (Policy Gate): Deterministic cents-level reconciliation check before ERP mutation.",
      "- Gate 04 (Audit Ledger): Immutable SHA-256 execution receipt + human-in-the-loop review queue.",
      "Next decision: Validate 50 historical exception invoices in a 2-week Architecture Sprint.",
    ].join("\n"),
  },
  {
    id: "support-triage",
    label: "Support Triage Airlock",
    badge: "Sub-500ms Triage",
    content: [
      "Objective: Classify, redact, and route multi-tenant customer escalations without cross-tenant context bleed.",
      "Constraints: Sub-500ms P95 routing | Zero PII in external model logs | Deterministic SLA tier assignment.",
      "Failure modes: Prompt injection via inbound ticket body; low-confidence misrouting; upstream CRM rate-limiting.",
      "Architecture topology:",
      "- Gate 01 (Deterministic): Pre-inference regex/NER PII redaction airlock + tenant namespace lock.",
      "- Gate 02 (Governed AI): Intent & urgency classification with strict JSON schema output.",
      "- Gate 03 (Policy Gate): Entitlement & SLA verification against deterministic rule table.",
      "- Gate 04 (Audit Ledger): Dead-letter fallback queue + signed triage telemetry.",
      "Next decision: Benchmark classification accuracy against last 1,000 resolved tickets.",
    ].join("\n"),
  },
  {
    id: "pipeda-rag",
    label: "PIPEDA RAG Boundary",
    badge: "Sovereign Residency",
    content: [
      "Objective: Synthesize compliance & policy answers with cryptographic source citations and zero hallucinated clauses.",
      "Constraints: Canadian sovereign VPC residency | Zero training retention | 100% verifiable document chunk citations.",
      "Failure modes: Outdated policy retrieval; ungrounded synthesis; unauthorized role access to restricted docs.",
      "Architecture topology:",
      "- Gate 01 (Deterministic): RBAC document ACL filter prior to vector/keyword retrieval.",
      "- Gate 02 (Governed AI): Citation-locked synthesis constrained strictly to retrieved chunk IDs.",
      "- Gate 03 (Policy Gate): Post-inference quote verification + automatic abstain on low grounding score.",
      "- Gate 04 (Audit Ledger): Full retrieval + prompt + citation trace signed via SHA-256.",
      "Next decision: Run adversarial red-team boundary audit on document permission tiers.",
    ].join("\n"),
  },
];

interface FaultScenario {
  id: string;
  label: string;
  trigger: string;
  interceptGate: string;
  latencyImpact: string;
  outcome: string;
  guardrailSnippet: string;
}

const FAULT_SCENARIOS: FaultScenario[] = [
  {
    id: "upstream-504",
    label: "Simulate Upstream 504 Timeout",
    trigger:
      "POST /v1/inference -> HTTP 504 Gateway Timeout (3,000ms deadline exceeded)",
    interceptGate: "Gate 03 // Circuit Breaker & Dead-Letter Fallback",
    latencyImpact: "+14ms failover overhead (Zero Hard-500)",
    outcome:
      "CONTAINED: Primary model circuit tripped open; payload preserved in idempotent retry queue and routed to deterministic rule fallback.",
    guardrailSnippet:
      "\n[Verified Guardrail // Upstream 504 Resilience]: Circuit breaker trips at 2,500ms P95; payload persisted to dead-letter queue with idempotency key.",
  },
  {
    id: "schema-drift",
    label: "Simulate Schema Drift",
    trigger:
      'Payload mutation: {"amount": "$1,200.00"} instead of integer cents',
    interceptGate: "Gate 01 // Zod Strict Contract Validator",
    latencyImpact: "+2ms parse rejection",
    outcome:
      "CONTAINED: Zod safeParse rejected malformed type before model or database invocation. Structured 422 schema diff emitted to telemetry.",
    guardrailSnippet:
      "\n[Verified Guardrail // Schema Drift Gate]: Strict Zod runtime contract enforces integer cents and rejects unknown keys prior to execution.",
  },
  {
    id: "pii-boundary",
    label: "Simulate PII Leak Attempt",
    trigger:
      "Inbound payload contains unredacted SIN / credit card pattern in free-text notes",
    interceptGate: "Gate 01 // Pre-Inference Redaction Airlock",
    latencyImpact: "+6ms deterministic token scrub",
    outcome:
      "CONTAINED: High-entropy PII pattern scrubbed and replaced with vault token [REDACTED_PII_01] prior to model context assembly.",
    guardrailSnippet:
      "\n[Verified Guardrail // PIPEDA Redaction Airlock]: Deterministic pre-inference PII scrubber strips sensitive tokens before external API egress.",
  },
];

const download = (name: string, content: string, type = "application/json") => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

export function WorkspaceConsole() {
  const [notes, setNotes] = useLocalStorage(
    "aias_workspace_notes",
    "Objective:\nConstraints:\nFailure modes:\nNext decision:",
  );
  const [jiraHost, setJiraHost] = useLocalStorage("aias_jira_host", "");
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [receipt, setReceipt] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "executive">("edit");
  const [activeFaultId, setActiveFaultId] = useState<string | null>(null);
  const { share } = useWebShare();
  const onRemoteNotes = useCallback(
    (message: { notes: string }) => {
      setNotes(message.notes);
    },
    [setNotes],
  );
  const { postMessage } = useBroadcastChannel<{ notes: string }>(
    "aias-workspace",
    onRemoteNotes,
  );

  const updateNotes = (value: string) => {
    setNotes(value.slice(0, 10_000));
    postMessage({ notes: value.slice(0, 10_000) });
  };

  const activeFault = useMemo(
    () => FAULT_SCENARIOS.find((f) => f.id === activeFaultId) ?? null,
    [activeFaultId],
  );

  const structuredSections = useMemo(() => {
    const lines = notes
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const sections: Array<{ title: string; body: string[] }> = [];
    let current: { title: string; body: string[] } = {
      title: "Architecture Summary",
      body: [],
    };

    for (const line of lines) {
      const headingMatch =
        /^#{1,3}\s+(.+)$/.exec(line) ||
        /^([A-Za-z][A-Za-z0-9\s/-]{2,28}):\s*(.*)$/.exec(line);
      if (headingMatch && headingMatch[1]) {
        if (current.body.length > 0) {
          sections.push(current);
        }
        current = {
          title: headingMatch[1].trim(),
          body: headingMatch[2] ? [headingMatch[2].trim()] : [],
        };
      } else {
        current.body.push(line.replace(/^[-*]\s+/, ""));
      }
    }
    if (current.body.length > 0) {
      sections.push(current);
    }
    return sections;
  }, [notes]);

  const appendFaultGuardrail = (fault: FaultScenario) => {
    if (!notes.includes(fault.guardrailSnippet.trim())) {
      updateNotes(`${notes.trimEnd()}\n${fault.guardrailSnippet}`);
    }
    setStatus("fault-verified");
  };

  const copyForSlack = async () => {
    await navigator.clipboard.writeText(
      `*AIAS Architecture Brief*\n\`\`\`\n${notes}\n\`\`\``,
    );
    setStatus("copied");
    window.open(
      "https://app.slack.com/client",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const openJira = () => {
    const host = jiraHost
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    if (!/^[a-z0-9][a-z0-9.-]*\.atlassian\.net$/.test(host)) {
      setStatus("error");
      return;
    }
    const query = new URLSearchParams({
      summary: "AIAS architecture review",
      description: notes,
    });
    window.open(
      `https://${host}/secure/CreateIssueDetails!init.jspa?${query}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const makeReceipt = async () => {
    const result = await generateSHA256Receipt(notes);
    setReceipt(`${result.receipt}\n\nFull SHA-256: ${result.hash}`);
    setStatus("hashed");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const encryptedExport = async () => {
    try {
      const payload = await encryptClientState(
        { notes, exportedAt: new Date().toISOString() },
        passphrase,
      );
      download(
        "aias-workspace.encrypted.json",
        JSON.stringify(payload, null, 2),
      );
      setStatus("encrypted");
    } catch {
      setStatus("error");
    }
  };

  const encryptedImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const encrypted = JSON.parse(text) as EncryptedClientExport;
      const decrypted = await decryptClientState<{ notes: string }>(
        encrypted,
        passphrase,
      );
      if (decrypted && typeof decrypted.notes === "string") {
        updateNotes(decrypted.notes);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section
      aria-labelledby="workspace-title"
      className="border-2 border-border bg-card p-6 shadow-card md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Local-first workspace
          </p>
          <h2
            className="mt-1 font-mono text-xl font-black uppercase"
            id="workspace-title"
          >
            Architecture handoff console
          </h2>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Saved only in this browser and synchronized across open AIAS tabs.
            Nothing is sent to a server.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Workspace readability mode"
            className="inline-flex border-2 border-border bg-background p-0.5"
          >
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              aria-pressed={viewMode === "edit"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                viewMode === "edit"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCode2 className="h-3 w-3" aria-hidden="true" />
              Operator Edit
            </button>
            <button
              type="button"
              onClick={() => setViewMode("executive")}
              aria-pressed={viewMode === "executive"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                viewMode === "executive"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3 w-3" aria-hidden="true" />
              Executive Readout
            </button>
          </div>
          <span
            aria-live="polite"
            className="border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold uppercase text-primary"
          >
            {status === "idle"
              ? "Local only"
              : status === "error"
                ? "Check input"
                : status === "fault-verified"
                  ? "Guardrail appended"
                  : status}
          </span>
        </div>
      </div>

      {/* 1-Click Reference Architecture Brief Templates */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border border-border/80 bg-muted/20 p-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mr-1">
          Load Reference Brief:
        </span>
        {BRIEF_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => {
              updateNotes(tpl.content);
              setStatus("idle");
            }}
            className="inline-flex items-center gap-2 border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-bold text-foreground transition-colors hover:border-primary hover:bg-primary/5 cursor-pointer"
          >
            <span>{tpl.label}</span>
            <span className="border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[9px] uppercase text-primary">
              {tpl.badge}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <label
          className="block font-mono text-xs font-bold uppercase"
          htmlFor="workspace-notes"
        >
          Diagnostic brief
        </label>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          {notes.length.toLocaleString()} / 10,000 chars • Cross-tab sync active
        </span>
      </div>

      {viewMode === "executive" ? (
        <div
          className="mt-2 grid gap-3 border-2 border-border bg-background p-4 sm:grid-cols-2"
          aria-label="Structured executive readout"
        >
          {structuredSections.map((sec, idx) => (
            <div
              key={`${sec.title}-${idx}`}
              className="border border-border bg-card p-3.5"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="font-mono text-xs font-black uppercase text-primary">
                  {sec.title}
                </span>
                <CheckCircle2
                  className="h-3.5 w-3.5 text-emerald-500"
                  aria-hidden="true"
                />
              </div>
              <ul className="mt-2 space-y-1.5 font-mono text-xs text-foreground">
                {sec.body.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      <textarea
        className={`mt-2 min-h-44 w-full border-2 border-border bg-background p-3 font-mono text-xs focus:border-primary focus:outline-none ${
          viewMode === "executive" ? "sr-only" : ""
        }`}
        id="workspace-notes"
        maxLength={10_000}
        onChange={(event) => updateNotes(event.target.value)}
        value={notes}
      />

      {/* Interactive Fault-Injection Stress Tester */}
      <div className="mt-4 border-2 border-border bg-muted/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-foreground">
              Interactive Fault-Injection Stress Tester
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Verify zero-hard-500 resilience before handoff
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {FAULT_SCENARIOS.map((scenario) => {
            const isSelected = activeFaultId === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() =>
                  setActiveFaultId(isSelected ? null : scenario.id)
                }
                aria-pressed={isSelected}
                className={`flex items-center justify-between border-2 px-3 py-2 text-left font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/60"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{scenario.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {activeFault ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 border border-primary/50 bg-background p-3.5 font-mono text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
              <span className="font-black uppercase text-primary flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {activeFault.interceptGate}
              </span>
              <span className="border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                {activeFault.latencyImpact}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">
              <strong className="text-foreground">Injected Anomaly:</strong>{" "}
              {activeFault.trigger}
            </p>
            <p className="mt-1 text-emerald-500 font-bold">
              {activeFault.outcome}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground">
                Add this deterministic mitigation rule directly to your active
                architecture brief:
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => appendFaultGuardrail(activeFault)}
                className="h-7 px-2.5 font-mono text-[10px] font-bold uppercase"
              >
                <Plus className="mr-1 h-3 w-3" aria-hidden="true" />
                Append Guardrail to Brief
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button onClick={makeReceipt} type="button" variant="outline">
          <Hash className="mr-2 h-4 w-4" />
          SHA-256 receipt
        </Button>
        <Button
          onClick={() =>
            share({
              title: "AIAS architecture brief",
              text: notes,
              url: window.location.href,
            })
          }
          type="button"
          variant="outline"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          onClick={() => {
            window.location.href = generateDiagnosticMailto({
              diagnosticData: { brief: notes.slice(0, 1500) },
            });
          }}
          type="button"
          variant="outline"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email diagnostic
        </Button>
        <Button onClick={copyForSlack} type="button" variant="outline">
          {status === "copied" ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copy + open Slack
        </Button>
        <div className="flex">
          <input
            aria-label="Jira workspace hostname"
            className="min-w-0 flex-1 border-2 border-r-0 border-border bg-background px-2 font-mono text-xs"
            onChange={(event) => setJiraHost(event.target.value)}
            placeholder="team.atlassian.net"
            value={jiraHost}
          />
          <Button className="shrink-0" onClick={openJira} type="button">
            Open Jira
          </Button>
        </div>
        <Button
          onClick={() =>
            download("aias-architecture-brief.md", notes, "text/markdown")
          }
          type="button"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download brief
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
        <input
          aria-label="Encryption passphrase"
          className="min-h-11 flex-1 border-2 border-border bg-background px-3 font-mono text-xs"
          minLength={12}
          onChange={(event) => setPassphrase(event.target.value)}
          placeholder="12+ character export passphrase"
          type="password"
          value={passphrase}
        />
        <Button onClick={encryptedExport} type="button">
          <Download className="mr-2 h-4 w-4" />
          Encrypted export
        </Button>
        <input
          accept=".json"
          aria-label="Upload encrypted workspace vault"
          className="hidden"
          onChange={encryptedImport}
          ref={fileInputRef}
          type="file"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Decrypt import
        </Button>
      </div>

      {receipt ? (
        <pre className="mt-4 overflow-x-auto border border-border bg-black p-3 text-[10px] text-green-400">
          {receipt}
        </pre>
      ) : null}

      {/* Direct Next-Action Conversion Strip */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border pt-4 font-mono text-xs">
        <span className="text-muted-foreground">
          Ready to validate this brief against our 6-capability risk matrix?
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/diagnostic"
            className="inline-flex items-center gap-1.5 border-2 border-border bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <span>Open Diagnostic Matrix</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 border-2 border-primary bg-primary px-3 py-1.5 font-mono text-xs font-bold uppercase text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span>Book Architect Review</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
