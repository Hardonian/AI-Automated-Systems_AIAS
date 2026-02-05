'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Users, TrendingUp } from 'lucide-react';

import {
  getSectionClasses,
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';

const outcomes = [
  {
    icon: Zap,
    label: 'Faster Intake → Triage → Action',
    description: 'Reduced time from request to resolution',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    label: 'Less Manual Ops Overhead',
    description: 'Reusable patterns reduce repeated work',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    label: 'Clear Governance + Audit Trails',
    description: 'Full visibility into every automated decision',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    label: 'Reusable Agent Patterns',
    description: 'Runbooks you can apply across workflows',
    gradient: 'from-orange-500 to-red-500',
  },
];

export function StatsSection() {
  return (
    <section className={getSectionClasses('default', 'muted')}>
      <div className={getContainerClasses('default', 'relative z-10')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({
            className: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${GRID_GAPS.default}`,
          } as any)}
        >
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon;
            return (
              <motion.div
                key={outcome.label}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                {...({ className: 'text-center group' } as any)}
              >
                <motion.div
                  transition={{ type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  {...({
                    className: `inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${outcome.gradient} mb-4 shadow-lg group-hover:shadow-xl transition-shadow`,
                  } as any)}
                >
                  <Icon className='h-8 w-8 text-white' />
                </motion.div>
                <div className={`${TYPOGRAPHY.h4} mb-2`}>{outcome.label}</div>
                <div
                  className={`${TYPOGRAPHY.bodySmall} text-muted-foreground`}
                >
                  {outcome.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
