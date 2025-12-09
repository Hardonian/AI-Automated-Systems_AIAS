"use client";
import { motion } from "framer-motion";
export default function ProgressRing({ value, size=80, stroke=10 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke)/2; const c = 2*Math.PI*r; const o = c*(1 - Math.min(1, Math.max(0, value)));
  return (
    <svg className="drop-shadow-sm" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <circle cx={size/2} cy={size/2} fill="none" r={r} stroke="hsl(var(--border))" strokeWidth={stroke}/>
      <motion.circle
        animate={{ strokeDashoffset: o }} cx={size/2} cy={size/2}
        fill="none" initial={{ strokeDashoffset: c }} r={r}
        stroke="hsl(var(--accent))" strokeDasharray={c} strokeDashoffset={o}
        strokeLinecap="round" strokeWidth={stroke} transition={{ type:"spring", damping:18 }}
      />
    </svg>
  );
}
