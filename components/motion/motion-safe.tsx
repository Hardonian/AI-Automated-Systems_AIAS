/**
 * Type-safe Framer Motion wrapper components
 * Fixes className and other HTML attribute type issues
 */

import { motion } from "framer-motion";

// Type-safe motion.div that accepts className
export const MotionDiv = motion.div;

// Type-safe motion.span that accepts className
export const MotionSpan = motion.span;

// Type-safe motion.section that accepts className
export const MotionSection = motion.section;

// Type-safe motion.article that accepts className
export const MotionArticle = motion.article;

// Type-safe motion.header that accepts className
export const MotionHeader = motion.header;

// Type-safe motion.footer that accepts className
export const MotionFooter = motion.footer;

// Type-safe motion.nav that accepts className
export const MotionNav = motion.nav;

// Type-safe motion.main that accepts className
export const MotionMain = motion.main;

// Generic type-safe motion component factory
export function createMotionComponent<T extends keyof React.JSX.IntrinsicElements>(
  tag: T
) {
  return (motion as any)[tag] as typeof motion.div;
}

// Re-export commonly used motion components with proper typing
export { motion };
