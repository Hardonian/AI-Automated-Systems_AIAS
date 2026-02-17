'use client';

import { motion } from 'framer-motion';

export function HeroIllustration() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Central hub */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {[
        { angle: 0, label: 'Input', color: 'bg-blue-500', delay: 0.3 },
        { angle: 72, label: 'Plan', color: 'bg-amber-500', delay: 0.4 },
        { angle: 144, label: 'Execute', color: 'bg-green-500', delay: 0.5 },
        { angle: 216, label: 'Verify', color: 'bg-rose-500', delay: 0.6 },
        { angle: 288, label: 'Output', color: 'bg-purple-500', delay: 0.7 },
      ].map((node) => {
        const radius = 80;
        const x = Math.round(Math.cos((node.angle * Math.PI) / 180) * radius * 100) / 100;
        const y = Math.round(Math.sin((node.angle * Math.PI) / 180) * radius * 100) / 100;
        return (
          <motion.div
            key={node.label}
            className="absolute"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: x - 28, y: y - 12, opacity: 1, scale: 1 }}
            transition={{ delay: node.delay, type: 'spring' }}
          >
            <div className={`flex items-center gap-2 rounded-full ${node.color} px-3 py-1.5 text-xs font-bold text-white shadow-lg`}>
              {node.label}
            </div>
          </motion.div>
        );
      })}

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 256" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const radius = 80;
          const x1 = 200;
          const y1 = 128;
          const x2 = Math.round((200 + Math.cos((angle * Math.PI) / 180) * radius) * 100) / 100;
          const y2 = Math.round((128 + Math.sin((angle * Math.PI) / 180) * radius) * 100) / 100;
          return (
            <motion.line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#lineGrad)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Label */}
      <div className="absolute bottom-3 left-3 text-xs font-medium text-slate-400">
        Agentic Workflow Engine
      </div>
    </div>
  );
}
