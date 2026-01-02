"use client";

import { motion, AnimatePresence } from "framer-motion";
import { motionVariants, prefersReducedMotion } from "@/lib/style/motion";
import { ReactNode } from "react";

export interface StepTransitionProps {
  /**
   * Content to transition
   */
  children: ReactNode;
  /**
   * Current step index (used as key)
   */
  step: number | string;
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
 * StepTransition - Wrapper for step-by-step transitions
 * 
 * Provides smooth transitions between steps in multi-step flows
 * Respects prefers-reduced-motion
 */
export function StepTransition({ 
  children, 
  step, 
  direction = "forward",
  className 
}: StepTransitionProps) {
  const reducedMotion = prefersReducedMotion();
  
  const variants = reducedMotion
    ? {
        enter: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : motionVariants.stepTransition;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step}
        custom={direction}
        initial="exit"
        animate="enter"
        exit="exit"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
