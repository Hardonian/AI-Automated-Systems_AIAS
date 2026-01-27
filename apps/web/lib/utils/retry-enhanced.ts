/**
 * Enhanced Retry Utility with Exponential Backoff
 * Improved version of retry logic with better error handling
 */

import { logger } from "@/lib/logging/structured-logger";

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: Array<new (...args: unknown[]) => Error>;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, "retryableErrors" | "onRetry">> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

/**
 * Check if error is retryable
 */
function isRetryableError(error: Error, retryableErrors?: Array<new (...args: unknown[]) => Error>): boolean {
  // Network errors are always retryable
  if (error.message.includes("network") || error.message.includes("fetch")) {
    return true;
  }

  // Timeout errors are retryable
  if (error.message.includes("timeout") || error.name === "TimeoutError") {
    return true;
  }

  // Check against custom retryable errors
  if (retryableErrors) {
    return retryableErrors.some((ErrorClass) => error instanceof ErrorClass);
  }

  return false;
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, "retryableErrors" | "onRetry">>): number {
  const delay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelayMs);
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      if (!isRetryableError(lastError, opts.retryableErrors)) {
        logger.warn("Non-retryable error encountered", { error: lastError.message, attempt });
        throw lastError;
      }

      // If this is the last attempt, throw the error
      if (attempt === opts.maxAttempts) {
        logger.error("Max retry attempts reached", lastError, { attempts: attempt });
        throw lastError;
      }

      // Call onRetry callback if provided
      if (opts.onRetry) {
        opts.onRetry(attempt, lastError);
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, opts);
      logger.info("Retrying after delay", { attempt, delay, error: lastError.message });
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error("Retry failed");
}

/**
 * Retry with custom condition
 */
export async function retryWithCondition<T>(
  fn: () => Promise<T>,
  _condition: (error: Error) => boolean,
  options: RetryOptions = {}
): Promise<T> {
  return retryWithBackoff(fn, {
    ...options,
    retryableErrors: options.retryableErrors || [],
  });
}
