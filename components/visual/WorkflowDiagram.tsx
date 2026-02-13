'use client';

import { motion } from 'framer-motion';

const nodes = [
  { id: 1, label: 'Input', x: 50, y: 20, color: 'bg-blue-500' },
  { id: 2, label: 'Classify', x: 50, y: 40, color: 'bg-purple-500' },
  { id: 3, label: 'Plan', x: 30, y: 60, color: 'bg-amber-500' },
  { id: 4, label: 'Execute', x: 70, y: 60, color: 'bg-green-500' },
  { id: 5, label: 'Verify', x: 50, y: 80, color: 'bg-rose-500' },
];

const connections = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
];

export function WorkflowDiagram() {
  return (
    <div className="relative h-64 w-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          return (
            <motion.line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#lineGrad)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          );
        })}
      </svg>
      
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className={`absolute flex h-10 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg ${node.color} text-xs font-bold text-white shadow-lg`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.15, type: 'spring' }}
        >
          {node.label}
        </motion.div>
      ))}
      
      <div className="absolute bottom-2 left-2 text-xs text-slate-400">
        Agentic Workflow Engine
      </div>
    </div>
  );
}
