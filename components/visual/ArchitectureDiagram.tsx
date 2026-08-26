"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const nodes = [
  {
    id: "reach",
    label: "Reach",
    x: 100,
    y: 100,
    color: "bg-indigo-600",
    description: "Demand Shaping & Qualification Layer",
  },
  {
    id: "zeo",
    label: "Zeo",
    x: 300,
    y: 100,
    color: "bg-emerald-600",
    description: "Platform & Automation Execution Layer",
  },
  {
    id: "settler",
    label: "Settler",
    x: 500,
    y: 100,
    color: "bg-amber-600",
    description: "Deployment & Governance Operations Layer",
  },
];

const connections = [
  { from: "reach", to: "zeo" },
  { from: "zeo", to: "settler" },
];

export function ArchitectureDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="relative h-[250px] w-full rounded-2xl bg-slate-950/50 border border-slate-800 p-8 overflow-hidden backdrop-blur-sm">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 200">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>

          {connections.map((conn, i) => {
            const from = nodes.find((n) => n.id === conn.from)!;
            const to = nodes.find((n) => n.id === conn.to)!;
            return (
              <motion.line
                key={i}
                x1={from.x + 40}
                y1={from.y}
                x2={to.x - 40}
                y2={to.y}
                stroke="#334155"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.3 }}
              />
            );
          })}
        </svg>

        <div className="relative z-10 flex h-full items-center justify-around">
          {nodes.map((node, i) => (
            <Tooltip key={node.id}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`flex flex-col items-center gap-3 cursor-help`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div
                    className={`h-16 w-16 rounded-xl ${node.color} flex items-center justify-center shadow-xl shadow-black/20 border border-white/10`}
                  >
                    <span className="text-sm font-bold text-white uppercase tracking-tighter">
                      {node.label}
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none">
                    Component {i + 1}
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-slate-900 text-slate-200 border-slate-800"
              >
                <p className="font-semibold text-xs">{node.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="absolute top-4 left-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500">
            Live Architecture Model
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}
