"use client";

import { motion } from "framer-motion";

import { motionTransitions, prefersReducedMotion } from "@/lib/style/motion";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "text" | "circular" | "rectangular";
}) {
  const baseClasses = "animate-pulse bg-muted/60";
  const variantClasses = {
    default: "rounded-md",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };
  
  // Respect reduced motion preference
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-hidden="true"
      className={cn(
        baseClasses,
        variantClasses[variant],
        shouldAnimate && "shimmer", // Add shimmer effect if motion is enabled
        className
      )}
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      role="presentation"
      transition={shouldAnimate ? motionTransitions.standard : { duration: 0.01 }}
      {...(props as any)}
    />
  );
}

export { Skeleton };
