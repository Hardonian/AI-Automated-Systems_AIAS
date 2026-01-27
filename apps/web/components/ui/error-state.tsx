"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motionVariants } from "@/lib/style/motion";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  "aria-label"?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
  "aria-label": ariaLabel,
}: ErrorStateProps) {
  return (
    <motion.div
      animate="visible"
      initial="hidden"
      variants={motionVariants.fadeIn}
      {...({ className } as any)}
    >
      <Card 
        aria-label={ariaLabel || title}
        aria-live="assertive"
        className={cn("border-destructive")}
        role="alert"
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle 
              aria-hidden="true" 
              className="h-5 w-5 text-destructive flex-shrink-0"
            />
            <CardTitle className="text-destructive">{title}</CardTitle>
          </div>
          <CardDescription className="mt-2">{message}</CardDescription>
        </CardHeader>
        {onRetry && (
          <CardContent>
            <Button 
              aria-label="Retry loading content" 
              size="md" 
              variant="outline"
              onClick={onRetry}
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
