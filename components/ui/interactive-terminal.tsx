"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Copy,
  Check,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  playClick,
  playTelemetryTone,
  playWarning,
  playSuccess,
} from "@/lib/audio/sound-fx";

interface TerminalCommand {
  id: string;
  name: string;
  command: string;
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

  const fallbackCommand: TerminalCommand = TERMINAL_COMMANDS[0]!;
  const activeCommand: TerminalCommand =
    TERMINAL_COMMANDS.find((c) => c.id === selectedCommandId) ??
    fallbackCommand;

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const initTimer = setTimeout(() => {
      if (cancelled) return;
      setIsRunning(true);
      setVisibleCount(0);
      playClick();

      activeCommand.lines.forEach((line, index) => {
        const lineTimer = setTimeout(() => {
          if (cancelled) return;
          setVisibleCount(index + 1);
          if (line.type === "warning") {
            playWarning();
          } else if (index === activeCommand.lines.length - 1) {
            playSuccess();
            setIsRunning(false);
          } else {
            playTelemetryTone();
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
  }, [selectedCommandId, activeCommand]);

  const handleCommandSwitch = (id: string) => {
    if (isRunning) return;
    setSelectedCommandId(id);
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
    <div className="w-full border-2 border-border bg-black shadow-[6px_6px_0px_0px_hsl(var(--text))] text-left overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border bg-zinc-950 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-none bg-red-500 border border-black" />
            <span className="h-2.5 w-2.5 rounded-none bg-yellow-500 border border-black" />
            <span className="h-2.5 w-2.5 rounded-none bg-green-500 border border-black" />
          </div>
          <span className="font-mono text-xs font-bold text-zinc-400 flex items-center gap-1.5 ml-2">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            aias-console // bash 80x24
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy terminal output"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Command Selector Buttons */}
      <div className="flex flex-wrap border-b border-zinc-800 bg-zinc-900/60 p-1.5 gap-1.5">
        {TERMINAL_COMMANDS.map((cmd) => (
          <button
            key={cmd.id}
            type="button"
            disabled={isRunning}
            onClick={() => handleCommandSwitch(cmd.id)}
            className={`px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition-all cursor-pointer border ${
              selectedCommandId === cmd.id
                ? "border-primary bg-primary/20 text-primary"
                : "border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            {cmd.name}
          </button>
        ))}
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-xs sm:text-[13px] h-[260px] overflow-y-auto flex flex-col justify-end bg-black/95">
        <div className="mb-2 text-zinc-500 text-[11px] flex items-center gap-2">
          <span className="text-emerald-400">$</span>
          <span className="text-zinc-300 font-bold">
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
                      ? "text-amber-400"
                      : "text-zinc-300"
              }`}
            >
              {line.type === "success" && (
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-400" />
              )}
              {line.type === "warning" && (
                <ShieldAlert className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
              )}
              {line.type === "system" && (
                <Cpu className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-sky-300 opacity-80" />
              )}
              <span className="leading-snug break-all">{line.text}</span>
            </motion.div>
          ))}

          {isRunning && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="w-2 h-4 bg-primary inline-block ml-1 mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}
