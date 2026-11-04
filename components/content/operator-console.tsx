"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Download,
  Send,
  Wand2,
} from "lucide-react";

import type { OperatorLead } from "@/src/content/moat";
import { SurfaceCard } from "@/components/ui/section-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  analyzeWorkspaceBrief,
  appendWorkspaceNotes,
  DEFAULT_WORKSPACE_TEMPLATE,
  generateSHA256Receipt,
  readWorkspaceNotes,
  useBroadcastChannel,
} from "@/lib/utils/client-engines";

const STORAGE_KEY = "aias-operator-leads";

const STAGE_OPTIONS: OperatorLead["stage"][] = [
  "intake",
  "scoping",
  "pilot",
  "governance-review",
  "active",
];

export function OperatorConsole({
  initialLeads,
  readOnly = false,
}: {
  initialLeads: OperatorLead[];
  readOnly?: boolean;
}) {
  const [leads, setLeads] = useState<OperatorLead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("all");
  const [isAddingLead, setIsAddingLead] = useState(false);

  // New lead form state
  const [newAccount, setNewAccount] = useState("");
  const [newOwner, setNewOwner] = useState("Scott H.");
  const [newStage, setNewStage] = useState<OperatorLead["stage"]>("intake");
  const [newRiskScore, setNewRiskScore] = useState(45);
  const [newNotes, setNewNotes] = useState("");

  // Live Workspace Handoff & Runbook Signing State
  const [workspaceNotes, setWorkspaceNotes] = useState<string>("");
  const [briefIngested, setBriefIngested] = useState(false);
  const [syncedToWorkspace, setSyncedToWorkspace] = useState(false);
  const [signedReceipt, setSignedReceipt] = useState<string | null>(null);

  const onRemoteWorkspace = useCallback((msg: { notes: string }) => {
    if (msg && typeof msg.notes === "string") {
      setWorkspaceNotes(msg.notes);
    }
  }, []);
  const { postMessage: postWorkspaceMessage } = useBroadcastChannel<{
    notes: string;
  }>("aias-workspace", onRemoteWorkspace);

  useEffect(() => {
    const current = readWorkspaceNotes();
    if (current && current !== DEFAULT_WORKSPACE_TEMPLATE) {
      queueMicrotask(() => setWorkspaceNotes(current));
    }
  }, []);

  const briefAudit = useMemo(
    () => (workspaceNotes ? analyzeWorkspaceBrief(workspaceNotes) : null),
    [workspaceNotes],
  );

  useEffect(() => {
    if (readOnly) {
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OperatorLead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLeads(parsed);
        }
      } catch {
        setLeads(initialLeads);
      }
    }
  }, [initialLeads, readOnly]);

  useEffect(() => {
    if (!readOnly) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
  }, [leads, readOnly]);

  const stats = useMemo(() => {
    if (leads.length === 0) {
      return { count: 0, averageRisk: 0, highRiskCount: 0, activeCount: 0 };
    }
    const totalRisk = leads.reduce((sum, l) => sum + l.riskScore, 0);
    const avg = Math.round(totalRisk / leads.length);
    const highRisk = leads.filter((l) => l.riskScore >= 70).length;
    const active = leads.filter(
      (l) => l.stage === "active" || l.stage === "pilot",
    ).length;

    return {
      count: leads.length,
      averageRisk: avg,
      highRiskCount: highRisk,
      activeCount: active,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage =
        selectedStageFilter === "all" || lead.stage === selectedStageFilter;

      return matchesSearch && matchesStage;
    });
  }, [leads, searchQuery, selectedStageFilter]);

  const updateLead = (index: number, patch: Partial<OperatorLead>) => {
    if (readOnly) {
      return;
    }

    setLeads((current) =>
      current.map((lead, leadIndex) =>
        leadIndex === index ? { ...lead, ...patch } : lead,
      ),
    );
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.trim()) return;

    const created: OperatorLead = {
      account: newAccount.trim(),
      stage: newStage,
      riskScore: newRiskScore,
      owner: newOwner.trim() || "Unassigned",
      notes: newNotes.trim() || "Initial intake logged via operator console.",
    };

    setLeads((prev) => [created, ...prev]);
    setNewAccount("");
    setNewNotes("");
    setIsAddingLead(false);
  };

  const handleResetToDefault = () => {
    if (readOnly) return;
    setLeads(initialLeads);
    setBriefIngested(false);
    setSignedReceipt(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const handleIngestWorkspaceBrief = () => {
    if (readOnly || !workspaceNotes || !briefAudit) return;
    const firstLine =
      workspaceNotes
        .split("\n")
        .map((l) => l.replace(/^#+\s*/, "").trim())
        .find((l) => l.length > 4) ?? "Active Architecture Brief";
    const computedRisk = Math.max(12, Math.min(85, 100 - briefAudit.score));
    const ingestedLead: OperatorLead = {
      account: `Workspace // ${firstLine.slice(0, 38)}`,
      stage: briefAudit.score >= 80 ? "scoping" : "governance-review",
      riskScore: computedRisk,
      owner: "Scott H. (Auto-Routed)",
      notes: `Readiness ${briefAudit.score}% (Grade ${briefAudit.grade}) · ${briefAudit.detectedGates} guardrail tokens detected.`,
    };
    setLeads((prev) => [ingestedLead, ...prev]);
    setBriefIngested(true);
  };

  const handleMitigateLeadRisk = (index: number) => {
    if (readOnly) return;
    setLeads((current) =>
      current.map((lead, idx) => {
        if (idx !== index) return lead;
        const nextRisk = Math.max(10, lead.riskScore - 22);
        const nextStage: OperatorLead["stage"] =
          lead.stage === "intake" || lead.stage === "governance-review"
            ? "pilot"
            : lead.stage;
        const tag = "[GATE-VERIFIED: Deterministic Zod + Circuit Breaker]";
        const nextNotes = lead.notes.includes(tag)
          ? lead.notes
          : `${lead.notes.trim()} ${tag}`;
        return {
          ...lead,
          riskScore: nextRisk,
          stage: nextStage,
          notes: nextNotes,
        };
      }),
    );
  };

  const handleSyncPipelineToWorkspace = () => {
    const summary = [
      "## Operator Control-Plane Pipeline Ledger",
      `- Total Records: ${stats.count} | Active/Pilot: ${stats.activeCount} | Mean Risk Score: ${stats.averageRisk}/100`,
      ...leads
        .slice(0, 5)
        .map(
          (l) =>
            `- **${l.account}** [${l.stage.toUpperCase()}] — Risk: ${l.riskScore}/100 · Owner: ${l.owner}`,
        ),
    ].join("\n");
    const updated = appendWorkspaceNotes(summary);
    setWorkspaceNotes(updated);
    postWorkspaceMessage({ notes: updated });
    setSyncedToWorkspace(true);
    setTimeout(() => setSyncedToWorkspace(false), 2500);
  };

  const handleExportSignedRunbook = async () => {
    const payloadString = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        stats,
        leads,
      },
      null,
      2,
    );
    const receipt = await generateSHA256Receipt(payloadString);
    setSignedReceipt(`${receipt.receipt}\nFull SHA-256: ${receipt.hash}`);
    const blob = new Blob(
      [
        JSON.stringify(
          {
            sha256: receipt.hash,
            issuedAt: receipt.timestamp,
            stats,
            leads,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aias-operator-runbook-${receipt.hash.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6" id="operator-console-root">
      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            Total Pipeline Leads
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-foreground">
            {stats.count}
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            Active / In-Flight
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-primary">
            {stats.activeCount}
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            Average Risk Score
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-foreground">
            {stats.averageRisk}{" "}
            <span className="text-xs text-muted-foreground">/100</span>
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            High Governance Oversight
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.highRiskCount}
          </p>
        </SurfaceCard>
      </div>

      {/* Active Workspace Handoff Ingestion Bar */}
      {briefAudit && (
        <SurfaceCard className="p-4 border-2 border-primary/50 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-primary">
              <Sparkles className="h-4 w-4" />
              <span>
                Live Handoff Brief Detected // Readiness: {briefAudit.score}% (
                {briefAudit.grade})
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {briefAudit.presentPillars.length}/5 architecture pillars verified
              · {briefAudit.detectedGates} deterministic gate tokens in local
              console.
            </p>
          </div>
          {!readOnly && (
            <Button
              type="button"
              size="sm"
              onClick={handleIngestWorkspaceBrief}
              disabled={briefIngested}
              className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase text-primary-foreground shrink-0"
            >
              <Wand2 className="mr-1.5 h-3.5 w-3.5" />
              {briefIngested
                ? "Brief Ingested into Pipeline ✓"
                : "Ingest Brief as Pipeline Record"}
            </Button>
          )}
        </SurfaceCard>
      )}

      {/* Control & Filter Toolbar */}
      <SurfaceCard className="p-4 sm:p-6 border-2 border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by account, architect, or notes..."
              className="pl-9 rounded-none border-2 border-border font-mono text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!readOnly && (
              <Button
                onClick={() => setIsAddingLead(!isAddingLead)}
                size="sm"
                className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-card"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                {isAddingLead ? "Cancel" : "Add Lead"}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSyncPipelineToWorkspace}
              variant="outline"
              size="sm"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {syncedToWorkspace ? "Synced ✓" : "Sync to Console"}
            </Button>
            <Button
              type="button"
              onClick={handleExportSignedRunbook}
              variant="outline"
              size="sm"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Sign Runbook (.json)
            </Button>
            {!readOnly && (
              <Button
                onClick={handleResetToDefault}
                variant="outline"
                size="sm"
                className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase hover:border-foreground"
                title="Reset demo data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        {signedReceipt && (
          <pre className="overflow-x-auto border border-border bg-black p-3 font-mono text-[10px] text-emerald-400">
            {signedReceipt}
          </pre>
        )}

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
          <button
            onClick={() => setSelectedStageFilter("all")}
            className={`px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              selectedStageFilter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({leads.length})
          </button>
          {STAGE_OPTIONS.map((stg) => {
            const count = leads.filter((l) => l.stage === stg).length;
            return (
              <button
                key={stg}
                onClick={() => setSelectedStageFilter(stg)}
                className={`px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                  selectedStageFilter === stg
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {stg} ({count})
              </button>
            );
          })}
        </div>
      </SurfaceCard>

      {/* Add Lead Form Tray */}
      {isAddingLead && (
        <SurfaceCard className="p-6 border-2 border-primary bg-card animate-fade-in shadow-card">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground mb-4">
            Create New Pipeline Record
          </h3>
          <form onSubmit={handleAddLeadSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-foreground mb-1">
                  Account Name *
                </label>
                <Input
                  required
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  placeholder="e.g. Ontario BioTech Networks"
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-foreground mb-1">
                  Assigned Architect
                </label>
                <Input
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-foreground mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={newStage}
                  onChange={(e) =>
                    setNewStage(e.target.value as OperatorLead["stage"])
                  }
                  className="w-full rounded-none border-2 border-border bg-background px-3 py-2 font-mono text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                >
                  {STAGE_OPTIONS.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex justify-between font-mono text-xs font-bold uppercase text-foreground mb-1">
                  <span>Initial Risk Score</span>
                  <span className="text-primary">{newRiskScore}</span>
                </div>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={newRiskScore}
                  onChange={(e) => setNewRiskScore(Number(e.target.value) || 0)}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase font-bold text-foreground mb-1">
                Context & Notes
              </label>
              <Input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Workflow friction, constraints, or next milestone..."
                className="rounded-none border-2 border-border font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingLead(false)}
                className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card"
              >
                Save Record
              </Button>
            </div>
          </form>
        </SurfaceCard>
      )}

      {/* Leads List */}
      <div className="grid gap-4">
        {filteredLeads.length === 0 ? (
          <SurfaceCard className="p-8 text-center border-2 border-border">
            <p className="font-mono text-sm text-muted-foreground">
              No matching records found in this view.
            </p>
          </SurfaceCard>
        ) : (
          filteredLeads.map((lead, index) => {
            const riskColor =
              lead.riskScore >= 70
                ? "text-destructive border-destructive bg-destructive/10"
                : lead.riskScore >= 40
                  ? "text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-500/10"
                  : "text-emerald-600 dark:text-emerald-400 border-emerald-600 bg-emerald-500/10";

            return (
              <SurfaceCard
                key={lead.account}
                className="border-2 border-border p-5 sm:p-6 space-y-4 hover:border-muted-foreground transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="font-mono text-base font-bold uppercase text-foreground">
                      {lead.account}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border ${riskColor}`}
                    >
                      Risk: {lead.riskScore}/100
                    </span>

                    {!readOnly && lead.riskScore > 20 && (
                      <button
                        type="button"
                        onClick={() => handleMitigateLeadRisk(index)}
                        className="inline-flex items-center gap-1 border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        <span>Enforce Gate (-22 Risk)</span>
                      </button>
                    )}

                    <label className="flex items-center font-mono text-xs font-bold uppercase text-foreground">
                      <span className="mr-2 text-muted-foreground">Stage:</span>
                      <select
                        disabled={readOnly}
                        value={lead.stage}
                        onChange={(e) =>
                          updateLead(index, {
                            stage: e.target.value as OperatorLead["stage"],
                          })
                        }
                        className="rounded-none border-2 border-border bg-background px-2 py-1 font-mono text-xs font-bold text-foreground focus:outline-none focus:border-primary disabled:opacity-80"
                      >
                        {STAGE_OPTIONS.map((stg) => (
                          <option key={stg} value={stg}>
                            {stg}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Lead Architect
                    </span>
                    <Input
                      disabled={readOnly}
                      value={lead.owner}
                      onChange={(e) =>
                        updateLead(index, { owner: e.target.value })
                      }
                      className="rounded-none border-2 border-border font-mono text-xs h-8"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Risk Score Modifier (0-100)
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        disabled={readOnly}
                        value={lead.riskScore}
                        onChange={(e) =>
                          updateLead(index, {
                            riskScore: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full accent-primary cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="font-mono font-bold text-foreground w-8 text-right">
                        {lead.riskScore}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                    Operator Notes & Incident Record
                  </span>
                  <Input
                    disabled={readOnly}
                    value={lead.notes}
                    onChange={(e) =>
                      updateLead(index, { notes: e.target.value })
                    }
                    className="rounded-none border-2 border-border font-mono text-xs"
                  />
                </div>
              </SurfaceCard>
            );
          })
        )}
      </div>
    </div>
  );
}
