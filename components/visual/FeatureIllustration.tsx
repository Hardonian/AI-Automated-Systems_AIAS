'use client';

import { motion } from 'framer-motion';

interface FeatureIllustrationProps {
  type: 'agents' | 'automation' | 'security' | 'integration';
  className?: string;
}

export function FeatureIllustration({ type, className = '' }: FeatureIllustrationProps) {
  const illustrations = {
    agents: (
      <svg viewBox="0 0 200 150" className="h-full w-full">
        <defs>
          <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100" cy="75" r="40"
          fill="none"
          stroke="url(#agentGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.circle
          cx="100" cy="75" r="25"
          fill="url(#agentGrad)"
          fillOpacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        />
        <motion.circle
          cx="100" cy="75" r="8"
          fill="#3b82f6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
        />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.line
            key={angle}
            x1="100"
            y1="75"
            x2={100 + 55 * Math.cos((angle * Math.PI) / 180)}
            y2={75 + 55 * Math.sin((angle * Math.PI) / 180)}
            stroke="#64748b"
            strokeWidth="1"
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        ))}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.circle
            key={angle}
            cx={100 + 70 * Math.cos((angle * Math.PI) / 180)}
            cy={75 + 70 * Math.sin((angle * Math.PI) / 180)}
            r="6"
            fill="#64748b"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          />
        ))}
      </svg>
    ),
    automation: (
      <svg viewBox="0 0 200 150" className="h-full w-full">
        <defs>
          <linearGradient id="autoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <motion.rect
          x="20" y="60" width="40" height="30" rx="4"
          fill="none"
          stroke="url(#autoGrad)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        />
        <motion.rect
          x="140" y="60" width="40" height="30" rx="4"
          fill="none"
          stroke="url(#autoGrad)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        />
        <motion.path
          d="M 60 75 L 90 75 L 90 55 L 110 55 L 110 75 L 140 75"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        <motion.circle
          cx="100" cy="45" r="15"
          fill="url(#autoGrad)"
          fillOpacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
        />
        <text x="40" y="78" textAnchor="middle" className="fill-slate-400 text-xs">Input</text>
        <text x="160" y="78" textAnchor="middle" className="fill-slate-400 text-xs">Output</text>
        <text x="100" y="49" textAnchor="middle" className="fill-emerald-400 text-xs font-bold">AI</text>
      </svg>
    ),
    security: (
      <svg viewBox="0 0 200 150" className="h-full w-full">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <motion.path
          d="M100 20 L160 45 L160 85 Q160 125 100 140 Q40 125 40 85 L40 45 Z"
          fill="none"
          stroke="url(#shieldGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.path
          d="M100 40 L140 58 L140 82 Q140 108 100 120 Q60 108 60 82 L60 58 Z"
          fill="url(#shieldGrad)"
          fillOpacity="0.15"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        />
        <motion.path
          d="M85 75 L95 85 L115 60"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
      </svg>
    ),
    integration: (
      <svg viewBox="0 0 200 150" className="h-full w-full">
        <defs>
          <linearGradient id="intGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {[40, 100, 160].map((x, i) => (
          <motion.rect
            key={x}
            x={x - 20}
            y="60"
            width="40"
            height="30"
            rx="4"
            fill="none"
            stroke={i === 1 ? 'url(#intGrad)' : '#64748b'}
            strokeWidth={i === 1 ? '2' : '1'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2, type: 'spring' }}
          />
        ))}
        <motion.line
          x1="60" y1="75" x2="80" y2="75"
          stroke="#64748b"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6 }}
        />
        <motion.line
          x1="120" y1="75" x2="140" y2="75"
          stroke="#64748b"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8 }}
        />
        <motion.circle
          cx="100" cy="75" r="12"
          fill="url(#intGrad)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        />
        <text x="40" y="78" textAnchor="middle" className="fill-slate-400 text-[8px]">CRM</text>
        <text x="100" y="78" textAnchor="middle" className="fill-white text-[8px] font-bold">Hub</text>
        <text x="160" y="78" textAnchor="middle" className="fill-slate-400 text-[8px]">ERP</text>
      </svg>
    ),
  };

  return (
    <div className={`h-32 w-full ${className}`}>
      {illustrations[type]}
    </div>
  );
}
