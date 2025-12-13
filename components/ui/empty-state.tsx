/**
 * Empty State Component
 * Displays helpful empty states with retry functionality
 */

"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  variant?: "default" | "error" | "loading";
}

export function EmptyState({
  title = "No data available",
  description = "There's nothing here yet. Try again or check back later.",
  icon,
  action,
  secondaryAction,
  variant = "default",
}: EmptyStateProps) {
  const defaultIcon =
    variant === "error" ? (
      <AlertCircle className="h-12 w-12 text-destructive" />
    ) : (
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
      </div>
    );

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{icon || defaultIcon}</div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {(action || secondaryAction) && (
        <CardContent className="flex flex-col sm:flex-row gap-2 justify-center">
          {action && (
            <Button onClick={action.onClick} variant={variant === "error" ? "default" : "outline"}>
              {variant === "error" && <RefreshCw className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>
                {secondaryAction.label === "Go home" && <Home className="mr-2 h-4 w-4" />}
                {secondaryAction.label}
              </Link>
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Error State Component
 * Specialized empty state for errors
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error. Please try again.",
  error,
  onRetry,
  showDetails = process.env.NODE_ENV === "development",
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <EmptyState
      title={title}
      description={description}
      variant="error"
      action={
        onRetry
          ? {
              label: "Try again",
              onClick: onRetry,
            }
          : undefined
      }
      secondaryAction={{
        label: "Go home",
        href: "/",
      }}
    >
      {showDetails && errorMessage && (
        <CardContent className="mt-4">
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">Error details</summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {errorMessage}
            </pre>
          </details>
        </CardContent>
      )}
    </EmptyState>
  );
}

/**
 * Loading State Component
 * Shows loading indicator
 */
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
