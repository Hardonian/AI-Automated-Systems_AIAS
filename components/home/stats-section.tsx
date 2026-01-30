'use client';

import { motion } from 'framer-motion';
import { Users, Zap, Globe, TrendingUp } from 'lucide-react';

import {
  getSectionClasses,
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';

const stats = [
  {
    icon: Users,
    value: '2,000+',
    label: 'Active Users',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    value: '10+',
    label: 'Hours Saved/Week',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    value: '40+',
    label: 'Countries Served',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    value: '90%',
    label: 'Error Reduction',
    gradient: 'from-orange-500 to-red-500',
  },
];

export function StatsSection() {
  return (
    <section className={getSectionClasses('default', 'gradient')}>
      <div className={getContainerClasses('default', 'relative z-10')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({
            className: `grid grid-cols-2 md:grid-cols-4 ${GRID_GAPS.default}`,
          } as any)}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
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
                    className: `inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg group-hover:shadow-xl transition-shadow`,
                  } as any)}
                >
                  <Icon className='h-8 w-8 text-white' />
                </motion.div>
                <div
                  className={`${TYPOGRAPHY.stat} mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <div
                  className={`${TYPOGRAPHY.bodySmall} font-medium text-muted-foreground`}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
