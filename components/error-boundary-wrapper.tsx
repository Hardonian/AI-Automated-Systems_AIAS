/**
 * Error Boundary Wrapper
 * Wraps pages/components with error boundary for graceful error handling
 */

"use client";

import { EnhancedErrorBoundary } from "@/lib/error-handling/error-boundary-enhanced";
import { ErrorState } from "@/components/ui/empty-state";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resetKeys?: Array<string | number>;
}

export function ErrorBoundaryWrapper({
  children,
  fallback,
  resetKeys,
}: ErrorBoundaryWrapperProps) {
  const defaultFallback = (
    <div className="container py-16">
      <ErrorState
        title="Something went wrong"
        description="We encountered an error loading this page. Please try again."
        onRetry={() => window.location.reload()}
      />
    </div>
  );

  return (
    <EnhancedErrorBoundary
      fallback={fallback || defaultFallback}
      resetKeys={resetKeys}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}
