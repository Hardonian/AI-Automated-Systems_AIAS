"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
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
  /**
   * Optional className (explicit to avoid framer-motion typing edge cases)
   */
  className?: string;
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
      ...(("visible" in (animationVariant as any)
        ? (animationVariant as any).visible?.transition
        : "enter" in (animationVariant as any)
          ? (animationVariant as any).enter?.transition
          : "animate" in (animationVariant as any)
            ? (animationVariant as any).animate?.transition
            : undefined) ?? {}),
      delay: delay + staggerDelay,
    };

    // Extract only the standard variant properties (hidden/visible) for TypeScript
    const standardVariants: Variants = (() => {
      if ("hidden" in (animationVariant as any) && "visible" in (animationVariant as any)) {
        return {
          hidden: (animationVariant as any).hidden,
          visible: (animationVariant as any).visible,
        };
      }
      if ("enter" in (animationVariant as any) && "exit" in (animationVariant as any)) {
        return {
          hidden: (animationVariant as any).exit,
          visible: (animationVariant as any).enter,
        };
      }
      if ("initial" in (animationVariant as any) && "animate" in (animationVariant as any)) {
        return {
          hidden: (animationVariant as any).initial,
          visible: (animationVariant as any).animate,
        };
      }
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    })();

    return (
      <motion.div
        ref={ref}
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={standardVariants}
        transition={transition}
        className={className}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

Reveal.displayName = "Reveal";
