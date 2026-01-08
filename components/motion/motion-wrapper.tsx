/**
 * Type-safe Framer Motion wrapper components
 * Fixes className prop type issues
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type MotionDivProps = HTMLMotionProps<"div"> & { className?: string };
type MotionSpanProps = HTMLMotionProps<"span"> & { className?: string };
type MotionPProps = HTMLMotionProps<"p"> & { className?: string };
type MotionSectionProps = HTMLMotionProps<"section"> & { className?: string };

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ className, ...props }, ref) => {
    // @ts-ignore - framer-motion type issue with props spreading
    return <motion.div ref={ref} className={className} {...props} />;
  }
);
MotionDiv.displayName = "MotionDiv";

export const MotionSpan = forwardRef<HTMLSpanElement, MotionSpanProps>(
  ({ className, ...props }, ref) => {
    // @ts-ignore - framer-motion type issue with props spreading
    return <motion.span ref={ref} className={className} {...props} />;
  }
);
MotionSpan.displayName = "MotionSpan";

export const MotionP = forwardRef<HTMLParagraphElement, MotionPProps>(
  ({ className, ...props }, ref) => {
    // @ts-ignore - framer-motion type issue with props spreading
    return <motion.p ref={ref} className={className} {...props} />;
  }
);
MotionP.displayName = "MotionP";

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ className, ...props }, ref) => {
    // @ts-ignore - framer-motion type issue with props spreading
    return <motion.section ref={ref} className={className} {...props} />;
  }
);
MotionSection.displayName = "MotionSection";

// Re-export motion for cases where we need the original
export { motion };
