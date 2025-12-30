/**
 * UX Event Types
 * 
 * Typed events for UX interaction tracking
 */

export type UXEventType =
  | "step_viewed"
  | "step_completed"
  | "step_abandoned"
  | "flow_started"
  | "flow_completed"
  | "flow_abandoned"
  | "success"
  | "error"
  | "retry"
  | "interaction"
  | "milestone_reached";

export interface UXEvent {
  type: UXEventType;
  flow?: string;
  step?: string | number;
  stepId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface StepViewedEvent extends UXEvent {
  type: "step_viewed";
  flow: string;
  step: number;
  stepId: string;
}

export interface StepCompletedEvent extends UXEvent {
  type: "step_completed";
  flow: string;
  step: number;
  stepId: string;
  duration?: number;
}

export interface FlowStartedEvent extends UXEvent {
  type: "flow_started";
  flow: string;
}

export interface FlowCompletedEvent extends UXEvent {
  type: "flow_completed";
  flow: string;
  duration: number;
  stepsCompleted: number;
}

export interface SuccessEvent extends UXEvent {
  type: "success";
  flow?: string;
  action: string;
}

export interface ErrorEvent extends UXEvent {
  type: "error";
  flow?: string;
  error: string;
  errorCode?: string;
  retryable?: boolean;
}

export interface RetryEvent extends UXEvent {
  type: "retry";
  flow?: string;
  step?: number;
  attempt: number;
}

export interface MilestoneEvent extends UXEvent {
  type: "milestone_reached";
  flow?: string;
  milestone: string;
}
