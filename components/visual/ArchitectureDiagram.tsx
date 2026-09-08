"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { playClick } from "@/lib/audio/sound-fx";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  role: string;
  description: string;
  badge: string;
}

const NODES: NodeData[] = [
  {
    id: "reach",
    label: "Reach",
    sublabel: "Demand & Qualification",
    role: "Prong 01",
    badge: "INTAKE_CONTROLLER",
    description:
      "Deterministic intake validation, lead qualification, and constraint mapping before budget commitment.",
  },
  {
    id: "zeo",
    label: "Zeo",
    sublabel: "Platform Execution",
    role: "Prong 02",
    badge: "AUTOMATION_FABRIC",
    description:
      "Governed model execution, structured tool calling, and high-throughput workflow orchestration.",
  },
  {
    id: "settler",
    label: "Settler",
    sublabel: "Governance Operations",
    role: "Prong 03",
    badge: "POLICY_AUDIT_PLANE",
    description:
      "Policy guardrails, compliance assertion testing, telemetry ledgers, and human handoff procedures.",
  },
];

export function ArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<string>("zeo");

  const fallbackNode = NODES[1]!;
  const activeNode = NODES.find((n) => n.id === selectedNode) ?? fallbackNode;

  return (
    <TooltipProvider>
      <div className="border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_hsl(var(--text))]">
        {/* Header telemetry tag */}
        <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              AIAS Triad Architecture Pipeline
            </span>
          </div>
          <span className="border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-foreground">
            Deterministic Flow
          </span>
        </div>

        {/* Interactive 3-Prong Node Strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {NODES.map((node, i) => {
            const isSelected = selectedNode === node.id;
            return (
              <Tooltip key={node.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedNode(node.id);
                    }}
                    className={`relative flex flex-col items-start p-4 border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-[3px_3px_0px_0px_hsl(var(--primary))] -translate-y-0.5"
                        : "border-border bg-background hover:border-foreground"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between border-b border-border/50 pb-2 mb-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                        {node.role}
                      </span>
                      <span className="font-mono text-[10px] border border-border px-1 py-0.2 bg-muted/50">
                        {node.badge}
                      </span>
                    </div>

                    <h4 className="font-mono text-base font-black uppercase text-foreground">
                      {node.label}
                    </h4>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {node.sublabel}
                    </p>

                    {i < NODES.length - 1 && (
                      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                        <span className="flex h-5 w-5 items-center justify-center border border-border bg-card text-muted-foreground">
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="rounded-none border-2 border-border bg-background p-3 font-mono text-xs text-foreground shadow-card max-w-xs"
                >
                  <p className="font-bold uppercase text-primary mb-1">
                    {node.label} {"//"} {node.role}
                  </p>
                  <p className="text-muted-foreground">{node.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Selected Node Spec Inspector */}
        <div className="mt-6 border-t-2 border-border pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold uppercase text-primary">
              Active Layer: {activeNode.label} [{activeNode.role}]
            </span>
            <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Verified Deterministic Contract
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-mono">
            {activeNode.description}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
