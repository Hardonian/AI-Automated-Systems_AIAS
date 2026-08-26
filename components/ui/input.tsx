"use client";

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import * as React from "react";

import { motionTransitions, useSafeReducedMotion } from "@/lib/style/motion";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, error, success, icon, iconPosition = "left", ...props },
    ref,
  ) => {
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
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          aria-describedby={error ? `${props.id || "input"}-error` : undefined}
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "flex h-11 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500",
            focused && "border-primary/50 shadow-md",
            className,
          )}
          type={type}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </motion.div>
    );
  },
);
Input.displayName = "Input";

export { Input };
