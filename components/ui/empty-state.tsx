"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { motionVariants } from "@/lib/style/motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      animate="visible"
      initial="hidden"
      variants={motionVariants.fadeInUp}
      {...({ className: cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )} as any)}
      aria-live="polite"
      role="status"
    >
      {icon && (
        <div 
          aria-hidden="true" 
          className="mb-6 text-muted-foreground"
        >
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        {action && (
          <Button 
            aria-label={action.label} 
            variant={action.variant || "default"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button 
            aria-label={secondaryAction.label} 
            variant="outline"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
