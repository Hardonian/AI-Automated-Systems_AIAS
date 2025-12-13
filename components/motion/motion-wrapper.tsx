/**
 * Type-safe Framer Motion wrapper components
 * Fixes className prop type issues
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

// Type-safe motion components that accept className
type MotionComponentProps<T extends keyof React.JSX.IntrinsicElements> = 
  HTMLMotionProps<T> & {
    className?: string;
  };

export const MotionDiv = forwardRef<HTMLDivElement, MotionComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return <motion.div ref={ref} className={className} {...props} />;
  }
);
MotionDiv.displayName = "MotionDiv";

export const MotionSpan = forwardRef<HTMLSpanElement, MotionComponentProps<'span'>>(
  ({ className, ...props }, ref) => {
    return <motion.span ref={ref} className={className} {...props} />;
  }
);
MotionSpan.displayName = "MotionSpan";

export const MotionP = forwardRef<HTMLParagraphElement, MotionComponentProps<'p'>>(
  ({ className, ...props }, ref) => {
    return <motion.p ref={ref} className={className} {...props} />;
  }
);
MotionP.displayName = "MotionP";

export const MotionSection = forwardRef<HTMLElement, MotionComponentProps<'section'>>(
  ({ className, ...props }, ref) => {
    return <motion.section ref={ref} className={className} {...props} />;
  }
);
MotionSection.displayName = "MotionSection";

// Re-export motion for cases where we need the original
export { motion };
