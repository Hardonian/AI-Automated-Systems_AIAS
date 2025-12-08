/**
 * Type-safe Framer Motion wrapper components
 * Fixes className prop type issues
 */

import { motion, MotionProps } from "framer-motion";
import { forwardRef, ComponentPropsWithoutRef } from "react";

// Type-safe motion components that accept className
type MotionComponentProps<T extends keyof React.JSX.IntrinsicElements> = 
  ComponentPropsWithoutRef<T> & MotionProps & {
    className?: string;
  };

export const MotionDiv = forwardRef<HTMLDivElement, MotionComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return <motion.div ref={ref} className={className} {...(props as any)} />;
  }
);
MotionDiv.displayName = "MotionDiv";

export const MotionSpan = forwardRef<HTMLSpanElement, MotionComponentProps<'span'>>(
  ({ className, ...props }, ref) => {
    return <motion.span ref={ref} className={className} {...(props as any)} />;
  }
);
MotionSpan.displayName = "MotionSpan";

export const MotionP = forwardRef<HTMLParagraphElement, MotionComponentProps<'p'>>(
  ({ className, ...props }, ref) => {
    return <motion.p ref={ref} className={className} {...(props as any)} />;
  }
);
MotionP.displayName = "MotionP";

export const MotionSection = forwardRef<HTMLElement, MotionComponentProps<'section'>>(
  ({ className, ...props }, ref) => {
    return <motion.section ref={ref} className={className} {...(props as any)} />;
  }
);
MotionSection.displayName = "MotionSection";

// Re-export motion for cases where we need the original
export { motion };
