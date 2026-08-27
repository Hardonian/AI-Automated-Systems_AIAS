"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

const TERMINAL_LINES = [
  { text: "> INITIALIZING AIAS CORE...", type: "system", delay: 800 },
  { text: "Loading orchestration fabric", type: "info", delay: 1200 },
  { text: "[OK] Zero-trust context established", type: "success", delay: 2000 },
  { text: "> INGESTING WORKFLOW DATA", type: "system", delay: 3000 },
  { text: "Warning: Unstructured input detected", type: "warning", delay: 3800 },
  { text: "Applying extraction heuristics...", type: "info", delay: 4500 },
  { text: "[OK] Pipeline stabilized", type: "success", delay: 5500 },
  { text: "> AWAITING NEXT DIRECTIVE_", type: "system", delay: 6500 },
];

export function InteractiveTerminal() {
  const [lines, setLines] = useState<number[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    TERMINAL_LINES.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, index]);
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border border-border/60 bg-black shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-border/40">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Terminal className="w-3.5 h-3.5" />
          bash — 80x24
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 h-[240px] font-mono text-xs md:text-sm overflow-hidden flex flex-col justify-end">
        <div className="space-y-2">
          {lines.map((lineIndex) => {
            const line = TERMINAL_LINES[lineIndex];
            if (!line) return null;
            return (
              <motion.div
                key={lineIndex}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2 ${
                  line.type === "system" ? "text-cyan-400 font-bold" :
                  line.type === "success" ? "text-green-400" :
                  line.type === "warning" ? "text-yellow-400" :
                  "text-zinc-400"
                }`}
              >
                {line.type === "success" && <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {line.type === "warning" && <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {line.type === "system" && <Cpu className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-50" />}
                {line.type === "info" && <span className="w-4 flex-shrink-0" />}
                <span>{line.text}</span>
              </motion.div>
            );
          })}
          {lines.length > 0 && lines.length < TERMINAL_LINES.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-cyan-500 inline-block mt-2 ml-6"
            />
          )}
        </div>
      </div>
    </div>
  );
}
