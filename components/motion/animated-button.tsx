"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { motion, HTMLMotionProps } from "framer-motion";
import { motionSprings, motionScale, prefersReducedMotion } from "@/lib/style/motion";
import { forwardRef } from "react";

export interface AnimatedButtonProps extends ButtonProps {
  /**
   * Animation variant for button interactions
   * @default "standard"
   */
  animationVariant?: "standard" | "subtle" | "bouncy";
  /**
   * Disable hover animations
   * @default false
   */
  disableHover?: boolean;
}

/**
 * AnimatedButton - Button with motion feedback
 * 
 * Provides consistent hover, active, and focus animations
 * Respects prefers-reduced-motion
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ animationVariant = "standard", disableHover = false, className, ...props }, ref) => {
    const reducedMotion = prefersReducedMotion();
    
    const springConfig = reducedMotion 
      ? { duration: 0.01 }
      : motionSprings[animationVariant === "bouncy" ? "bouncy" : animationVariant === "subtle" ? "gentle" : "standard"];

    const hoverScale = reducedMotion || disableHover ? 1 : motionScale.hover;
    const activeScale = reducedMotion || disableHover ? 1 : motionScale.active;

    return (
      <motion.button
        ref={ref}
        whileHover={reducedMotion || disableHover ? {} : { scale: hoverScale }}
        whileTap={reducedMotion || disableHover ? {} : { scale: activeScale }}
        transition={springConfig}
        className={className}
        {...(props as HTMLMotionProps<"button">)}
      >
        {props.children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
