"use client";

import { AlertCircle } from "lucide-react";
import { Reveal, AnimatedCard, AnimatedButton } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

export interface ErrorMessageProps {
  /**
   * Error message
   */
  message: string;
  /**
   * Optional title
   */
  title?: string;
  /**
   * Optional error details
   */
  details?: string;
  /**
   * Show retry button
   * @default false
   */
  showRetry?: boolean;
  /**
   * Retry button label
   * @default "Retry"
   */
  retryLabel?: string;
  /**
   * Retry callback
   */
  onRetry?: () => void;
  /**
   * Show dismiss button
   * @default false
   */
  showDismiss?: boolean;
  /**
   * Dismiss callback
   */
  onDismiss?: () => void;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * ErrorMessage - Error feedback component
 * 
 * Displays error message with shake animation
 * Supports retry and dismiss actions
 */
export function ErrorMessage({
  message,
  title,
  details,
  showRetry = false,
  retryLabel = "Retry",
  onRetry,
  showDismiss = false,
  onDismiss,
  className,
}: ErrorMessageProps) {
  return (
    <Reveal variant="fadeInUp">
      <AnimatedCard variant="fadeInUp">
        <Card className={cn("border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20", className)}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {title && (
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    {title}
                  </h3>
                )}
                <p className="text-sm text-red-800 dark:text-red-200">
                  {message}
                </p>
                {details && (
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    {details}
                  </p>
                )}
                {(showRetry || showDismiss) && (
                  <div className="flex gap-2 mt-3">
                    {showRetry && onRetry && (
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        {retryLabel}
                      </AnimatedButton>
                    )}
                    {showDismiss && onDismiss && (
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={onDismiss}
                        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        Dismiss
                      </AnimatedButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </Reveal>
  );
}
