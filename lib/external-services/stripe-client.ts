/**
 * Stripe Client with Circuit Breaker
 * Provides resilient Stripe API calls with automatic retry and fallback
 */

import { withCircuitBreaker } from '@/lib/resilience/circuit-breaker';
import { logger } from '@/lib/logging/structured-logger';
import { NetworkError } from '@/lib/errors';

/**
 * Call Stripe API with circuit breaker protection
 */
export async function callStripeAPI<T>(
  endpoint: string,
  options: RequestInit,
  apiKey: string
): Promise<T> {
  return withCircuitBreaker(
    'stripe',
    async () => {
      const maxRetries = 3;
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
            ...options,
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              ...options.headers,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new NetworkError(
              `Stripe API error: ${response.status} ${response.statusText}`,
              response.status >= 500, // Retryable for 5xx errors
              { status: response.status, error: errorData }
            );
          }

          const data = await response.json();
          
          logger.info('Stripe API call successful', {
            endpoint,
            attempt: attempt + 1,
          });

          return data as T;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          // Don't retry on non-retryable errors
          if (error instanceof NetworkError && !error.retryable) {
            throw error;
          }

          // If this is not the last attempt, wait before retrying
          if (attempt < maxRetries - 1) {
            const delayMs = Math.pow(2, attempt) * 1000; // Exponential backoff
            logger.warn('Stripe API call failed, retrying', {
              attempt: attempt + 1,
              maxRetries,
              delayMs,
              error: lastError.message,
            });
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        }
      }

      // All retries failed
      throw lastError || new NetworkError('Stripe API call failed after retries');
    },
    async () => {
      // Fallback - throw error as payment operations shouldn't silently fail
      throw new NetworkError('Stripe service is temporarily unavailable', true);
    },
    {
      failureThreshold: 5,
      timeout: 60000, // 1 minute
      successThreshold: 2,
    }
  );
}
