"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { motionVariants, prefersReducedMotion, MotionVariant } from "@/lib/style/motion";
import { forwardRef, ReactNode } from "react";

export interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /**
   * Content to reveal
   */
  children: ReactNode;
  /**
   * Animation variant
   * @default "fadeInUp"
   */
  variant?: MotionVariant;
  /**
   * Delay before animation starts (in seconds)
   * @default 0
   */
  delay?: number;
  /**
   * Stagger delay for list items (in seconds)
   */
  staggerDelay?: number;
  /**
   * Whether to show immediately (skip animation)
   */
  immediate?: boolean;
}

/**
 * Reveal - Wrapper component for entrance animations
 * 
 * Provides consistent reveal animations for content
 * Respects prefers-reduced-motion
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ 
    children, 
    variant = "fadeInUp", 
    delay = 0, 
    staggerDelay = 0,
    immediate = false,
    className,
    ...props 
  }, ref) => {
    const reducedMotion = prefersReducedMotion() || immediate;
    const animationVariant = motionVariants[variant] || motionVariants.fadeInUp;
    
    const transition = {
      ...animationVariant.visible?.transition,
      delay: delay + staggerDelay,
    };

    return (
      <motion.div
        ref={ref}
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={animationVariant}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Reveal.displayName = "Reveal";
