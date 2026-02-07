interface RetryOptions {
  tries?: number;
  minMs?: number;
  maxMs?: number;
}

interface RetryAttempt {
  attemptNumber: number;
  error: unknown;
  timestamp: number;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const tries = options.tries ?? 5;
  const minMs = options.minMs ?? 400;
  const maxMs = options.maxMs ?? 6000;
  let last: any;
  let attemptCount = 0;

  const attempts: RetryAttempt[] = [];

  for (let i = 0; i < tries; i++) {
    attemptCount++;
    const attempt: RetryAttempt = {
      attemptNumber: attemptCount,
      error: null,
      timestamp: Date.now(),
    };
    attempts.push(attempt);

    try {
      return await fn();
    } catch (error) {
      last = error;

      // Update attempt with error info
      attempts[attemptCount - 1].error = error;

      // Log retry attempt with structured logging
      if (typeof console !== 'undefined') {
        console.warn(`Retry attempt ${attemptCount}/${tries} failed:`, {
          error: error instanceof Error ? error.message : String(error),
          functionName: fn.name || 'anonymous',
          attemptNumber: attemptCount,
          attempts,
        });
      }

      // Add exponential backoff for remaining attempts
      if (i < tries - 1) {
        const delay = Math.min(
          maxMs,
          Math.round(minMs * Math.pow(2, i)) + Math.random() * 250
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Log final retry summary
  if (attempts.length > 0) {
    const finalAttempt = attempts[attempts.length - 1];
    const success = finalAttempt.error === null;

    console.info(
      `Retry completed after ${finalAttempt.attemptNumber}/${tries} attempts: ${success ? 'SUCCESS' : 'FAILED'}`,
      {
        functionName: fn.name || 'anonymous',
        success,
        totalAttempts: attempts.length,
        finalError: finalAttempt.error,
      }
    );
  }

  throw last;
}
