"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ErrorState } from "@/components/ui/empty-state";
import { telemetry } from "@/lib/monitoring/enhanced-telemetry";
import { logger } from "@/lib/utils/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Track error with telemetry
    telemetry.trackError(error, {
      digest: error.digest,
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    });
    // Use logger instead of console.error for environment-aware logging
    logger.error("Application error", error, {
      digest: error.digest,
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    });
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <ErrorState
        title="Something went wrong"
        description="We're sorry, but something unexpected happened. Please try again."
        error={error}
        onRetry={reset}
        showDetails={process.env.NODE_ENV === "development"}
      />
    </div>
  );
}
