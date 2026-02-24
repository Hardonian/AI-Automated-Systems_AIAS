'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

import { useSafeReducedMotion } from '@/lib/style/motion';
import { cn } from '@/lib/utils';

export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number; children: ReactNode }) {
  const prefersReduced = useSafeReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={prefersReduced ? { duration: 0 } : { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
