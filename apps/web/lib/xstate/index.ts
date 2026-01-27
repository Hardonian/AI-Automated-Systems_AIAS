/**
 * XState System - Centralized exports
 * 
 * Provides state machine utilities, conventions, and patterns
 * across the application.
 */

// Conventions
export * from "./conventions";

// Utilities
export * from "./utils";

// Hooks
export * from "./hooks";

// Demo machine (for reference)
export { demoFormMachine } from "./demo-machine";
export type { DemoFormContext, DemoFormEvent } from "./demo-machine";

// Onboarding machine
export { onboardingMachine } from "./onboarding-machine";
export type { OnboardingContext, OnboardingEvent, OnboardingStepId, IntegrationProvider } from "./onboarding-machine";
