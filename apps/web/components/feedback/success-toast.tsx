"use client";

import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Reveal, AnimatedCard } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SuccessToastProps {
  /**
   * Success message
   */
  message: string;
  /**
   * Optional title
   */
  title?: string;
  /**
   * Optional details
   */
  details?: string;
  /**
   * Show celebration animation
   * @default false
   */
  celebrate?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Auto-dismiss delay (ms). 0 = no auto-dismiss
   * @default 0
   */
  autoDismiss?: number;
  /**
   * Callback when dismissed
   */
  onDismiss?: () => void;
}

/**
 * SuccessToast - Success feedback component
 * 
 * Displays success message with animation
 * Respects reduced motion
 */
export function SuccessToast({
  message,
  title,
  details,
  celebrate = false,
  className,
  autoDismiss = 0,
  onDismiss,
}: SuccessToastProps) {
  // Auto-dismiss if specified
  useEffect(() => {
    if (autoDismiss > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  return (
    <Reveal variant="fadeInUp">
      <AnimatedCard variant={celebrate ? "fadeInUp" : "fadeInUp"}>
        <Card className={cn("border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20", className)}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {title && (
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    {title}
                  </h3>
                )}
                <p className="text-sm text-green-800 dark:text-green-200">
                  {message}
                </p>
                {details && (
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {details}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </Reveal>
  );
}
