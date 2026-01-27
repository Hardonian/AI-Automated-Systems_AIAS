/**
 * OpenAI Client with Circuit Breaker
 * Provides resilient OpenAI API calls with automatic retry and fallback
 */

import { NetworkError } from '@/lib/errors';
import { logger } from '@/lib/logging/structured-logger';
import { withCircuitBreaker } from '@/lib/resilience/circuit-breaker';

export interface OpenAIRequest {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

/**
 * Call OpenAI API with circuit breaker protection
 */
export async function callOpenAI(
  request: OpenAIRequest,
  apiKey: string
): Promise<OpenAIResponse> {
  return withCircuitBreaker(
    'openai',
    async () => {
      const maxRetries = 3;
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: request.model || 'gpt-4',
              messages: request.messages,
              temperature: request.temperature ?? 0.7,
              max_tokens: request.max_tokens ?? 1000,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new NetworkError(
              `OpenAI API error: ${response.status} ${response.statusText}`,
              response.status >= 500, // Retryable for 5xx errors
              { status: response.status, error: errorData }
            );
          }

          const data = await response.json();
          
          logger.info('OpenAI API call successful', {
            model: request.model || 'gpt-4',
            tokens: data.usage?.total_tokens,
            attempt: attempt + 1,
          });

          return data;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          // Don't retry on non-retryable errors
          if (error instanceof NetworkError && !error.retryable) {
            throw error;
          }

          // If this is not the last attempt, wait before retrying
          if (attempt < maxRetries - 1) {
            const delayMs = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
            logger.warn('OpenAI API call failed, retrying', {
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
      throw lastError || new NetworkError('OpenAI API call failed after retries');
    },
    async () => {
      // Fallback response when circuit is open
      logger.warn('OpenAI circuit breaker is open, using fallback response');
      return {
        choices: [{
          message: {
            content: "I'm temporarily unavailable due to service issues. Please try again in a moment.",
          },
        }],
      };
    },
    {
      failureThreshold: 5,
      timeout: 60000, // 1 minute
      successThreshold: 2,
    }
  );
}
