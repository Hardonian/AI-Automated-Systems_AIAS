"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { motionVariants } from "@/lib/style/motion";
import { cn } from "@/lib/utils";



interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingState({
  message = "Loading...",
  className,
  size = "md",
  "aria-label": ariaLabel,
}: LoadingStateProps) {
  return (
    <motion.div
      animate="visible"
      initial="hidden"
      variants={motionVariants.fadeIn}
      {...({ className: cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )} as any)}
      aria-label={ariaLabel || message}
      aria-live="polite"
      role="status"
    >
      <Loader2 
        aria-hidden="true" 
        className={cn("animate-spin text-muted-foreground", sizeMap[size])}
      />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      )}
    </motion.div>
  );
}
