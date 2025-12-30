/**
 * Motion System - Centralized exports
 * 
 * Provides consistent motion primitives and utilities
 * across the application.
 */

// Primitives
export { AnimatedButton } from "./animated-button";
export type { AnimatedButtonProps } from "./animated-button";
export { AnimatedCard } from "./animated-card";
export type { AnimatedCardProps } from "./animated-card";
export { Reveal } from "./reveal";
export type { RevealProps } from "./reveal";
export { PageTransition } from "./page-transition";
export type { PageTransitionProps } from "./page-transition";
export { StepTransition } from "./step-transition";
export type { StepTransitionProps } from "./step-transition";

// Wrappers (re-export existing)
export { MotionDiv, MotionSpan, MotionP, MotionSection, motion } from "./motion-wrapper";

// Utilities (re-export from lib)
export {
  motionDurations,
  motionEasing,
  motionSprings,
  motionTransitions,
  motionVariants,
  motionScale,
  motionTranslate,
  motionOpacity,
  staggerChildren,
  staggerConfigs,
  prefersReducedMotion,
  getTransition,
  cssTransition,
  transitionClasses,
} from "@/lib/style/motion";

export type {
  MotionDuration,
  MotionEasing,
  MotionSpring,
  MotionVariant,
} from "@/lib/style/motion";
