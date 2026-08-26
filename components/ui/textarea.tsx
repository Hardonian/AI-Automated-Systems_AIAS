"use client";

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import * as React from "react";

import { motionTransitions, useSafeReducedMotion } from "@/lib/style/motion";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, success, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const prefersReduced = useSafeReducedMotion();

    const motionProps: HTMLMotionProps<"div"> = prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: motionTransitions.standard,
        };

    return (
      <motion.div className="relative w-full" {...motionProps}>
        <textarea
          ref={ref}
          aria-describedby={
            error ? `${props.id || "textarea"}-error` : undefined
          }
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500",
            focused && "border-primary/50 shadow-md",
            className,
          )}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          {...props}
        />
      </motion.div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
