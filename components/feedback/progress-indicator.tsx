"use client";

import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps {
  /**
   * Current step (0-indexed)
   */
  current: number;
  /**
   * Total steps
   */
  total: number;
  /**
   * Completed step IDs
   */
  completedSteps?: string[];
  /**
   * Step labels (optional)
   */
  stepLabels?: string[];
  /**
   * Show percentage
   * @default true
   */
  showPercentage?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * ProgressIndicator - Visual progress indicator for multi-step flows
 * 
 * Shows current step, progress bar, and step indicators
 * Animates progress changes smoothly
 */
export function ProgressIndicator({
  current,
  total,
  completedSteps = [],
  stepLabels,
  showPercentage = true,
  className,
}: ProgressIndicatorProps) {
  const progress = ((current + 1) / total) * 100;
  const steps = Array.from({ length: total }, (_, i) => i);

  return (
    <Reveal variant="fadeInUp" className={cn("space-y-4", className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Step {current + 1} of {total}</span>
          {showPercentage && (
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          )}
        </div>
        <Progress value={progress} className="h-2" aria-label={`Progress: ${Math.round(progress)}%`} />
      </div>

      {/* Step Indicators */}
      {stepLabels && stepLabels.length === total && (
        <div className="flex items-center justify-between" role="list" aria-label="Steps">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(stepLabels[index] || `step-${index}`);
            const isCurrent = index === current;
            
            return (
              <div key={index} className="flex items-center flex-1" role="listitem">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted text-muted-foreground"
                    )}
                    aria-label={`Step ${index + 1}: ${stepLabels[index]}${isCompleted ? " completed" : isCurrent ? " current" : ""}`}
                  >
                    {isCompleted ? (
                      <span className="text-sm font-semibold">✓</span>
                    ) : (
                      <span aria-hidden="true">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-center max-w-[100px] text-muted-foreground">
                    {stepLabels[index]}
                  </div>
                </div>
                {index < total - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 transition-colors",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </Reveal>
  );
}
