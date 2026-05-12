'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

import { motionTransitions, useSafeReducedMotion } from '@/lib/style/motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
}

function Skeleton({
  className,
  variant = 'default',
  ...props
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-muted/60';
  const variantClasses = {
    default: 'rounded-md',
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  // Respect reduced motion preference - safe for SSR
  const prefersReduced = useSafeReducedMotion();
  const shouldAnimate = !prefersReduced;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-hidden='true'
      className={cn(
        baseClasses,
        variantClasses[variant],
        shouldAnimate && 'shimmer', // Add shimmer effect if motion is enabled
        className
      )}
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      role='presentation'
      transition={
        shouldAnimate ? motionTransitions.standard : { duration: 0.01 }
      }
      {...props}
    />
  );
}

export { Skeleton };
