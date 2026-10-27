"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Terminal,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Copy,
  Check,
  RotateCcw,
  FastForward,
  ArrowRight,
} from "lucide-react";
import { playClick } from "@/lib/audio/sound-fx";

interface TerminalCommand {
  id: string;
  name: string;
  command: string;
  diagnosticHref: string;
  lines: Array<{
    text: string;
    type: "system" | "info" | "success" | "warning";
    delay: number;
  }>;
}

const TERMINAL_COMMANDS: TerminalCommand[] = [
  {
    id: "run-pipeline",
    name: "01 // Ingest & Gate",
    command: "aias run --contract=zod-strict --verify",
    diagnosticHref: "/diagnostic?workload=engineering-automation&step=2",
    lines: [
      {
        text: "> INITIALIZING AIAS CORE RUNTIME...",
        type: "system",
        delay: 100,
      },
      {
        text: "Loading deterministic orchestration fabric v1.1",
        type: "info",
        delay: 400,
      },
      {
        text: "[OK] Zero-trust context established (PIPEDA sovereign)",
        type: "success",
        delay: 800,
      },
      {
        text: "> INGESTING WORKFLOW DATA (0 CONTRACT ERRORS)",
        type: "system",
        delay: 1300,
      },
      {
        text: "Applying post-inference assertion checks...",
        type: "info",
        delay: 1800,
      },
      {
        text: "[OK] Variance: 0.00% | PII: 0 leaks | Budget: Clean",
        type: "success",
        delay: 2300,
      },
      {
        text: "> IMMUTABLE AUDIT RECEIPT SIGNED: SHA256-d7a8f9c1...02b3",
        type: "system",
        delay: 2800,
      },
      {
        text: "[OK] Pipeline stabilized. Output dispatched safely.",
        type: "success",
        delay: 3300,
      },
    ],
  },
  {
    id: "test-guardrail",
    name: "02 // Policy Intercept",
    command: "aias test --inject-anomaly --guardrail=strict",
    diagnosticHref: "/diagnostic?workload=compliance-audit&step=2",
    lines: [
      {
        text: "> TESTING BOUNDARY GUARDRAIL INTERCEPT...",
        type: "system",
        delay: 100,
      },
      {
        text: "Simulating unverified multi-tenant payload injection...",
        type: "info",
        delay: 400,
      },
      {
        text: "Warning: Ambiguous authorization boundary detected",
        type: "warning",
        delay: 800,
      },
      {
        text: "[SAFETY GATE TRIGGERED]: Rule #14 boundary assertion",
        type: "warning",
        delay: 1400,
      },
      {
        text: "Automated execution blocked. Zero hard-500 crash.",
        type: "info",
        delay: 1900,
      },
      {
        text: "[OK] Cryptographic incident bundle logged to audit store",
        type: "success",
        delay: 2400,
      },
      {
        text: "> ESCALATED: Assigned to Senior Architect diagnostic queue.",
        type: "system",
        delay: 2900,
      },
    ],
  },
  {
    id: "audit-trace",
    name: "03 // Cryptographic Trace",
    command: "aias audit --receipt=latest --verify-sla",
    diagnosticHref: "/diagnostic?workload=financial-ops&step=2",
    lines: [
      {
        text: "> QUERYING AUDIT LEDGER RECEIPT...",
        type: "system",
        delay: 100,
      },
      {
        text: "Verifying cryptographic proof chain across 4 gates...",
        type: "info",
        delay: 400,
      },
      {
        text: "[OK] Gate 01: Zod Schema Contract [PASSED]",
        type: "success",
        delay: 800,
      },
      {
        text: "[OK] Gate 02: Model Scoped Inference [PASSED]",
        type: "success",
        delay: 1200,
      },
      {
        text: "[OK] Gate 03: Deterministic Policy Check [PASSED]",
        type: "success",
        delay: 1600,
      },
      {
        text: "[OK] Gate 04: Immutable Runbook Ledger [SIGNED]",
        type: "success",
        delay: 2000,
      },
      {
        text: "> SLA LATENCY: 384ms (P95 < 500ms target satisfied)",
        type: "system",
        delay: 2500,
      },
    ],
  },
];

export function InteractiveTerminal() {
  const [selectedCommandId, setSelectedCommandId] =
    useState<string>("run-pipeline");
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [replayKey, setReplayKey] = useState<number>(0);

  const fallbackCommand: TerminalCommand = TERMINAL_COMMANDS[0]!;
  const activeCommand: TerminalCommand =
    TERMINAL_COMMANDS.find((c) => c.id === selectedCommandId) ??
    fallbackCommand;

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const initTimer = setTimeout(() => {
      if (cancelled) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        setVisibleCount(activeCommand.lines.length);
        setIsRunning(false);
        return;
      }

      setIsRunning(true);
      setVisibleCount(0);

      activeCommand.lines.forEach((line, index) => {
        const lineTimer = setTimeout(() => {
          if (cancelled) return;
          setVisibleCount(index + 1);
          if (index === activeCommand.lines.length - 1) {
            setIsRunning(false);
          }
        }, line.delay);
        timers.push(lineTimer);
      });
    }, 10);

    return () => {
      cancelled = true;
      clearTimeout(initTimer);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [selectedCommandId, activeCommand, replayKey]);

  useEffect(() => {
    const handleExternalScenario = (event: Event) => {
      const customEvent = event as CustomEvent<{ commandId?: string }>;
      const targetId = customEvent.detail?.commandId;
      if (targetId && TERMINAL_COMMANDS.some((c) => c.id === targetId)) {
        setSelectedCommandId(targetId);
      }
    };
    window.addEventListener(
      "aias:select-terminal-scenario",
      handleExternalScenario,
    );
    return () => {
      window.removeEventListener(
        "aias:select-terminal-scenario",
        handleExternalScenario,
      );
    };
  }, []);

  const handleCommandSwitch = (id: string) => {
    playClick();
    setSelectedCommandId(id);
  };

  const handleReplay = () => {
    playClick();
    setReplayKey((k) => k + 1);
  };

  const handleFastForward = () => {
    playClick();
    setVisibleCount(activeCommand.lines.length);
    setIsRunning(false);
  };

  const handleCopyText = async () => {
    try {
      const textToCopy = activeCommand.lines
        .slice(0, visibleCount)
        .map((l) => l.text)
        .join("\n");
      await navigator.clipboard.writeText(textToCopy);
      playClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="region"
      aria-label="Interactive architecture verification terminal"
      className="w-full border-2 border-border bg-black shadow-[6px_6px_0px_0px_hsl(var(--text))] text-left overflow-hidden transition-all duration-200"
    >
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border bg-zinc-950 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-none bg-red-500 border border-black" />
            <span className="h-2.5 w-2.5 rounded-none bg-yellow-500 border border-black" />
            <span className="h-2.5 w-2.5 rounded-none bg-green-500 border border-black" />
          </div>
          <span className="font-mono text-xs font-bold text-zinc-300 flex items-center gap-1.5 ml-2">
            <Terminal className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            aias-console // bash 80x24
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && (
            <button
              type="button"
              onClick={handleFastForward}
              aria-label="Skip terminal animation and reveal all logs"
              className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              title="Skip animation"
            >
              <FastForward className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">SKIP</span>
            </button>
          )}

          {!isRunning && (
            <button
              type="button"
              onClick={handleReplay}
              aria-label="Re-run terminal verification command"
              className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              title="Re-run command"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">REPLAY</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyText}
            aria-label={
              copied ? "Output copied to clipboard" : "Copy terminal output"
            }
            className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            title="Copy terminal output"
          >
            {copied ? (
              <>
                <Check
                  className="h-3 w-3 text-emerald-400"
                  aria-hidden="true"
                />
                <span className="text-emerald-400 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" aria-hidden="true" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Command Selector Buttons */}
      <div
        role="tablist"
        aria-label="Terminal simulation scenarios"
        className="flex flex-wrap border-b border-zinc-800 bg-zinc-900/70 p-1.5 gap-1.5"
      >
        {TERMINAL_COMMANDS.map((cmd) => {
          const isSelected = selectedCommandId === cmd.id;
          return (
            <button
              key={cmd.id}
              role="tab"
              type="button"
              aria-selected={isSelected}
              onClick={() => handleCommandSwitch(cmd.id)}
              className={`px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "border-primary bg-primary/20 text-primary shadow-sm"
                  : "border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {cmd.name}
            </button>
          );
        })}
      </div>

      {/* Terminal Body */}
      <div
        role="log"
        aria-live="polite"
        aria-atomic="false"
        className="p-4 font-mono text-xs sm:text-[13px] h-[260px] overflow-y-auto flex flex-col justify-end bg-black/95 select-text"
      >
        <div className="mb-2 text-zinc-400 text-[11px] flex items-center gap-2">
          <span className="text-emerald-400 font-bold" aria-hidden="true">
            $
          </span>
          <span className="text-zinc-200 font-bold tracking-tight">
            {activeCommand.command}
          </span>
        </div>

        <div className="space-y-1.5 overflow-hidden">
          {activeCommand.lines.slice(0, visibleCount).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-2 ${
                line.type === "system"
                  ? "text-sky-300 font-bold"
                  : line.type === "success"
                    ? "text-emerald-400"
                    : line.type === "warning"
                      ? "text-amber-300 font-medium"
                      : "text-zinc-300"
              }`}
            >
              {line.type === "success" && (
                <CheckCircle2
                  className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
              )}
              {line.type === "warning" && (
                <ShieldAlert
                  className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-300"
                  aria-hidden="true"
                />
              )}
              {line.type === "system" && (
                <Cpu
                  className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-sky-300 opacity-90"
                  aria-hidden="true"
                />
              )}
              <span className="leading-snug break-all">{line.text}</span>
            </motion.div>
          ))}

          {isRunning && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="w-2 h-4 bg-primary inline-block ml-1 mt-1"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Actionable CRO Conversion Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t-2 border-border bg-zinc-950 px-3.5 py-2.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            {isRunning ? "Running assertions..." : "Verification passed"}
          </span>
        </div>

        <Link
          href={activeCommand.diagnosticHref}
          className="group inline-flex items-center gap-1.5 border border-primary/70 bg-primary/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>Audit Your Stack</span>
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
