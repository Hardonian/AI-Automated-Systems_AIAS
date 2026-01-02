"use client";

import { motion, AnimatePresence } from "framer-motion";
import { motionVariants, prefersReducedMotion } from "@/lib/style/motion";
import { ReactNode } from "react";

export interface PageTransitionProps {
  /**
   * Content to transition
   */
  children: ReactNode;
  /**
   * Unique key to trigger transitions
   */
  transitionKey: string | number;
  /**
   * Transition direction
   * @default "forward"
   */
  direction?: "forward" | "backward";
  /**
   * Custom className
   */
  className?: string;
}

/**
 * PageTransition - Wrapper for page/route transitions
 * 
 * Provides smooth transitions between pages or steps
 * Respects prefers-reduced-motion
 */
export function PageTransition({ 
  children, 
  transitionKey, 
  direction = "forward",
  className 
}: PageTransitionProps) {
  const reducedMotion = prefersReducedMotion();
  
  const variants = reducedMotion 
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { 
          opacity: 0, 
          x: direction === "forward" ? 20 : -20,
        },
        animate: { 
          opacity: 1, 
          x: 0,
          transition: motionVariants.pageTransition.animate.transition,
        },
        exit: { 
          opacity: 0, 
          x: direction === "forward" ? -20 : 20,
          transition: motionVariants.pageTransition.exit.transition,
        },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={className}
        {...({} as any)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
