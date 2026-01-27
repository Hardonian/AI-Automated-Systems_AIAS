/**
 * UX Event Tracker
 * 
 * Tracks UX interactions for measurement and optimization
 * Logs locally in dev, stubs for backend integration
 */

import type {
  UXEvent,
  StepViewedEvent,
  StepCompletedEvent,
  FlowStartedEvent,
  FlowCompletedEvent,
  SuccessEvent,
  ErrorEvent,
  RetryEvent,
  MilestoneEvent,
} from "./types";

const isDev = process.env.NODE_ENV === "development";

/**
 * Event storage (in-memory for dev)
 */
const eventStore: UXEvent[] = [];

/**
 * Track a UX event
 */
export function trackUXEvent(event: UXEvent): void {
  // Add timestamp if not present
  const eventWithTimestamp: UXEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  // Store event
  eventStore.push(eventWithTimestamp);

  // Log in dev
  if (isDev) {
    console.log("[UX Event]", eventWithTimestamp);
  }

  // TODO: Send to backend in production
  // if (!isDev && window.gtag) {
  //   window.gtag('event', event.type, {
  //     event_category: 'UX',
  //     ...event.metadata,
  //   });
  // }
}

/**
 * Track step viewed
 */
export function trackStepViewed(
  flow: string,
  step: number,
  stepId: string,
  metadata?: Record<string, unknown>
): void {
  const event: StepViewedEvent = {
    type: "step_viewed",
    flow,
    step,
    stepId,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track step completed
 */
export function trackStepCompleted(
  flow: string,
  step: number,
  stepId: string,
  duration?: number,
  metadata?: Record<string, unknown>
): void {
  const event: StepCompletedEvent = {
    type: "step_completed",
    flow,
    step,
    stepId,
    duration,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track flow started
 */
export function trackFlowStarted(
  flow: string,
  metadata?: Record<string, unknown>
): void {
  const event: FlowStartedEvent = {
    type: "flow_started",
    flow,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track flow completed
 */
export function trackFlowCompleted(
  flow: string,
  duration: number,
  stepsCompleted: number,
  metadata?: Record<string, unknown>
): void {
  const event: FlowCompletedEvent = {
    type: "flow_completed",
    flow,
    duration,
    stepsCompleted,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track success
 */
export function trackSuccess(
  action: string,
  flow?: string,
  metadata?: Record<string, unknown>
): void {
  const event: SuccessEvent = {
    type: "success",
    flow,
    action,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track error
 */
export function trackError(
  error: string,
  flow?: string,
  errorCode?: string,
  retryable?: boolean,
  metadata?: Record<string, unknown>
): void {
  const event: ErrorEvent = {
    type: "error",
    flow,
    error,
    errorCode,
    retryable,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track retry
 */
export function trackRetry(
  attempt: number,
  flow?: string,
  step?: number,
  metadata?: Record<string, unknown>
): void {
  const event: RetryEvent = {
    type: "retry",
    flow,
    step,
    attempt,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Track milestone
 */
export function trackMilestone(
  milestone: string,
  flow?: string,
  metadata?: Record<string, unknown>
): void {
  const event: MilestoneEvent = {
    type: "milestone_reached",
    flow,
    milestone,
    timestamp: new Date().toISOString(),
    metadata,
  };
  trackUXEvent(event);
}

/**
 * Get recent events (for dev inspection)
 */
export function getRecentEvents(limit: number = 50): UXEvent[] {
  return eventStore.slice(-limit);
}

/**
 * Clear events (for testing)
 */
export function clearEvents(): void {
  eventStore.length = 0;
}
