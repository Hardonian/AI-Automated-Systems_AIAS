'use client';

import { motion } from 'framer-motion';
import { Shield, Globe, CheckCircle, Award } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'SOC 2 Ready', color: 'text-blue-500' },
  { icon: Globe, label: 'Global Scale', color: 'text-emerald-500' },
  { icon: CheckCircle, label: 'PIPEDA Compliant', color: 'text-purple-500' },
  { icon: Award, label: 'Enterprise Grade', color: 'text-amber-500' },
];

export function TrustBadgeStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="flex items-center gap-2 text-sm text-muted-foreground"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <badge.icon className={`h-4 w-4 ${badge.color}`} />
          <span>{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
