/**
 * XState Utilities
 * 
 * Helper functions for common state machine patterns
 */

import { GuardFn, ValidationResult, MachineError } from "./conventions";
import { EventObject } from "xstate";

/**
 * Create error from exception
 */
export function createMachineError(error: unknown): MachineError {
  if (error instanceof Error) {
    return {
      code: error.name || "UNKNOWN_ERROR",
      message: error.message,
      details: error,
      retryable: true,
    };
  }
  
  if (typeof error === "object" && error !== null && "code" in error) {
    return error as MachineError;
  }
  
  return {
    code: "UNKNOWN_ERROR",
    message: String(error),
    details: error,
    retryable: false,
  };
}

/**
 * Create a validation guard
 * Returns true if validation passes, false otherwise
 */
export function createValidationGuard<TContext, TEvent extends EventObject>(
  validator: (context: TContext, event: TEvent) => ValidationResult
): GuardFn<TContext, TEvent> {
  return (context, event) => {
    const result = validator(context, event);
    return result.valid;
  };
}

/**
 * Create a field validation guard
 * Validates a specific field in context
 */
export function createFieldGuard<TContext extends Record<string, unknown>>(
  field: keyof TContext,
  validator: (value: unknown) => boolean
): GuardFn<TContext, EventObject> {
  return (context) => {
    const value = context[field];
    return validator(value);
  };
}

/**
 * Create a retry guard
 * Checks if retry count is below max retries
 */
export function createRetryGuard<TContext extends { retryCount?: number }>(
  maxRetries: number = 3
): GuardFn<TContext, EventObject> {
  return (context) => {
    const retryCount = context.retryCount || 0;
    return retryCount < maxRetries;
  };
}

/**
 * Create a step validation guard
 * Validates that current step is valid
 */
export function createStepGuard<TContext extends { currentStep: number; totalSteps: number }>(): GuardFn<TContext, EventObject> {
  return (context) => {
    return context.currentStep >= 0 && context.currentStep < context.totalSteps;
  };
}

/**
 * Create a step completion guard
 * Checks if a step can be completed (has required data)
 */
export function createStepCompletionGuard<TContext extends { data: Record<string, unknown> }>(
  requiredFields: string[]
): GuardFn<TContext, EventObject> {
  return (context) => {
    return requiredFields.every((field) => {
      const value = context.data[field];
      return value !== undefined && value !== null && value !== "";
    });
  };
}

/**
 * Delay utility for state transitions
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry utility for async operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await delay(delayMs * (attempt + 1)); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}
