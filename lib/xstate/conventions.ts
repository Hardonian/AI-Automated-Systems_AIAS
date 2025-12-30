/**
 * XState Conventions & Patterns
 * 
 * Standardized patterns for state machines across the application.
 * Ensures consistency, type safety, and maintainability.
 */

import { EventObject, StateMachine, TypedState } from "xstate";

/**
 * Standard async state values for async operations
 */
export type AsyncState = "idle" | "pending" | "success" | "error";

/**
 * Standard context shape for async operations
 */
export interface AsyncContext<TData = unknown, TError = Error> {
  data?: TData;
  error?: TError;
  retryCount?: number;
}

/**
 * Standard events for async operations
 */
export interface AsyncEvents<TInput = unknown> {
  type: "SUBMIT" | "RETRY" | "RESET" | "CANCEL";
  input?: TInput;
}

/**
 * Standard events for step-based flows
 */
export interface StepFlowEvents {
  type: "NEXT" | "PREVIOUS" | "GO_TO_STEP" | "RESET" | "COMPLETE";
  step?: number | string;
}

/**
 * Standard context for step-based flows
 */
export interface StepFlowContext {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  data: Record<string, unknown>;
}

/**
 * Guard function type for validation
 */
export type GuardFn<TContext, TEvent extends EventObject> = (
  context: TContext,
  event: TEvent
) => boolean;

/**
 * Action function type
 */
export type ActionFn<TContext, TEvent extends EventObject> = (
  context: TContext,
  event: TEvent
) => void | Promise<void>;

/**
 * Service invocation type for async operations
 */
export type ServiceInvoke<TInput, TOutput> = (
  input: TInput
) => Promise<TOutput>;

/**
 * Machine configuration helper
 * Ensures consistent structure across machines
 */
export interface MachineConfig<TContext, TEvent extends EventObject> {
  id: string;
  initial: string;
  context: TContext;
  states: Record<string, unknown>;
  predictableActionArguments?: boolean;
  preserveActionOrder?: boolean;
}

/**
 * Type helper for machine state
 */
export type MachineState<TMachine extends StateMachine<any, any, any>> =
  TypedState<TMachine>;

/**
 * Error handling pattern
 * Standard error shape for state machines
 */
export interface MachineError {
  code: string;
  message: string;
  details?: unknown;
  retryable?: boolean;
}

/**
 * Validation result for guards
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
