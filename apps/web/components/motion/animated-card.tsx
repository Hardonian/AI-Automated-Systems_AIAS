"use client";

import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { motionVariants, motionSprings, motionScale, prefersReducedMotion, MotionVariant } from "@/lib/style/motion";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedCardProps {
  /**
   * Entrance animation variant
   * @default "fadeInUp"
   */
  variant?: MotionVariant;
  /**
   * Enable hover lift effect
   * @default true
   */
  hover?: boolean;
  /**
   * Stagger delay for list items (in seconds)
   */
  staggerDelay?: number;
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * AnimatedCard - Card with entrance and hover animations
 * 
 * Provides consistent card animations with entrance effects
 * Respects prefers-reduced-motion
 */
export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ variant = "fadeInUp", hover = true, staggerDelay = 0, className, children, ...props }, ref) => {
    const reducedMotion = prefersReducedMotion();
    const animationVariant = motionVariants[variant] || motionVariants.fadeInUp;
    
    const hoverProps = reducedMotion || !hover 
      ? {} 
      : {
          y: -4,
          scale: motionScale.hover,
          transition: motionSprings.gentle,
        };

    // Extract only the standard variant properties (hidden/visible) for TypeScript
    // Handle different variant structures: some have hidden/visible, others have enter/exit or initial/animate
    const standardVariants: Variants = (() => {
      // Check if variant has hidden/visible structure (most common)
      if ('hidden' in animationVariant && 'visible' in animationVariant) {
        return {
          hidden: animationVariant.hidden,
          visible: animationVariant.visible,
        };
      }
      // Handle enter/exit structure (e.g., stepTransition)
      if ('enter' in animationVariant && 'exit' in animationVariant) {
        return {
          hidden: animationVariant.exit,
          visible: animationVariant.enter,
        };
      }
      // Handle initial/animate structure (e.g., pageTransition)
      if ('initial' in animationVariant && 'animate' in animationVariant) {
        return {
          hidden: animationVariant.initial,
          visible: animationVariant.animate,
        };
      }
      // Fallback to fadeInUp structure
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    })();

    return (
      <motion.div
        ref={ref}
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={standardVariants}
        whileHover={hoverProps}
        transition={{
          ...(("visible" in (animationVariant as any)
            ? (animationVariant as any).visible?.transition
            : "enter" in (animationVariant as any)
              ? (animationVariant as any).enter?.transition
              : "animate" in (animationVariant as any)
                ? (animationVariant as any).animate?.transition
                : undefined) ?? {}),
          delay: staggerDelay,
        }}
        className={cn("w-full", className)}
        {...(props as any)}
      >
        <Card hover={hover}>{children}</Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";
