/**
 * Product Analytics Event Catalog
 * 
 * Typed event definitions and tracking helpers based on event taxonomy.
 * All events go through this catalog to ensure consistency and type safety.
 * 
 * Usage:
 *   import { trackEvent, trackCtaClick } from '@/lib/telemetry/events';
 *   trackEvent('project_created', { projectId: '123', projectName: 'My Project' });
 *   trackCtaClick('hero_primary', { variant: 'variant_a' });
 */

import { track } from './track';

// ============================================================================
// Event Payload Types
// ============================================================================

export interface BaseEventPayload {
  userId?: string;
  sessionId?: string;
  route?: string;
  timestamp?: string;
  // Experiment context
  experimentKey?: string;
  variant?: string;
  // Feature flag context
  featureFlags?: Record<string, boolean>;
  // User context
  userSegment?: string;
  // Device context
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
}

// Core Events
export interface AppOpenedPayload extends BaseEventPayload {
  source?: 'direct' | 'referral' | 'search' | 'social' | 'email' | 'other';
  referrer?: string;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

export interface PageViewPayload extends BaseEventPayload {
  page: string;
  title?: string;
  referrer?: string;
  loadTime?: number;
}

export interface SessionStartedPayload extends BaseEventPayload {
  sessionId: string;
  isNewUser?: boolean;
  isReturning?: boolean;
}

export interface SessionEndedPayload extends BaseEventPayload {
  sessionId: string;
  duration?: number;
  pageViews?: number;
  events?: number;
}

// Onboarding Events
export interface OnboardingStartedPayload extends BaseEventPayload {
  source?: 'signup' | 'invite' | 'trial' | 'other';
  userId: string;
}

export interface OnboardingStepCompletedPayload extends BaseEventPayload {
  stepIndex: number;
  stepName: string;
  duration?: number;
  skipped?: boolean;
}

export interface OnboardingCompletedPayload extends BaseEventPayload {
  totalSteps: number;
  totalDuration?: number;
  skippedSteps?: string[];
}

export interface OnboardingAbandonedPayload extends BaseEventPayload {
  stepIndex: number;
  stepName: string;
  reason?: 'timeout' | 'navigation' | 'error' | 'other';
}

// Product Actions
export interface ProjectCreatedPayload extends BaseEventPayload {
  projectId: string;
  projectName?: string;
  projectType?: string;
  source?: 'new' | 'template' | 'import' | 'duplicate' | 'other';
}

export interface ProjectUpdatedPayload extends BaseEventPayload {
  projectId: string;
  changes?: string[];
  source?: 'manual' | 'api' | 'automation' | 'other';
}

export interface ProjectDeletedPayload extends BaseEventPayload {
  projectId: string;
  projectName?: string;
}

export interface WorkflowCreatedPayload extends BaseEventPayload {
  workflowId: string;
  workflowName?: string;
  workflowType?: string;
  source?: 'new' | 'template' | 'duplicate' | 'other';
}

export interface WorkflowExecutedPayload extends BaseEventPayload {
  workflowId: string;
  executionId: string;
  status: 'success' | 'failure' | 'partial';
  duration?: number;
  stepsCompleted?: number;
  stepsTotal?: number;
}

export interface ItemAddedPayload extends BaseEventPayload {
  itemType: string;
  itemId: string;
  containerId?: string;
  source?: string;
}

export interface ItemPublishedPayload extends BaseEventPayload {
  itemType: string;
  itemId: string;
  publishTarget?: 'public' | 'team' | 'specific' | 'other';
}

// Conversion Events
export interface CheckoutStartedPayload extends BaseEventPayload {
  cartValue?: number;
  currency?: string;
  items?: number;
  plan?: string;
}

export interface CheckoutStepCompletedPayload extends BaseEventPayload {
  stepIndex: number;
  stepName: 'billing' | 'payment' | 'review' | 'confirmation' | 'other';
  duration?: number;
}

export interface CheckoutCompletedPayload extends BaseEventPayload {
  orderId: string;
  amount: number;
  currency: string;
  plan?: string;
  paymentMethod?: string;
  duration?: number;
}

export interface CheckoutAbandonedPayload extends BaseEventPayload {
  stepIndex: number;
  stepName: string;
  cartValue?: number;
  reason?: string;
}

export interface SubscriptionStartedPayload extends BaseEventPayload {
  subscriptionId: string;
  plan: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
}

export interface SubscriptionCanceledPayload extends BaseEventPayload {
  subscriptionId: string;
  plan: string;
  cancellationReason?: string;
  effectiveDate?: string;
}

// Engagement Events
export interface CtaClickedPayload extends BaseEventPayload {
  ctaId: string;
  ctaText?: string;
  location: string;
  variant?: string;
}

export interface FeatureUsedPayload extends BaseEventPayload {
  featureName: string;
  featureType?: 'button' | 'modal' | 'command' | 'shortcut' | 'other';
  location?: string;
}

export interface SearchPerformedPayload extends BaseEventPayload {
  query: string;
  resultCount?: number;
  searchType?: 'global' | 'projects' | 'users' | 'content' | 'other';
}

export interface FilterAppliedPayload extends BaseEventPayload {
  filterType: string;
  filterValue: string;
  location?: string;
}

export interface DropdownOpenedPayload extends BaseEventPayload {
  dropdownId: string;
  location?: string;
}

export interface TabChangedPayload extends BaseEventPayload {
  tabGroup: string;
  tabFrom: string;
  tabTo: string;
}

// Error Events
export interface FormValidationFailedPayload extends BaseEventPayload {
  formId: string;
  fieldName?: string;
  errorType?: 'required' | 'format' | 'length' | 'custom' | 'other';
  attemptNumber?: number;
}

export interface ApiErrorShownPayload extends BaseEventPayload {
  errorCode?: string;
  errorMessage?: string;
  endpoint?: string;
  statusCode?: number;
}

export interface FeatureFlagFallbackTriggeredPayload extends BaseEventPayload {
  flagKey: string;
  fallbackValue: boolean;
  reason?: string;
}

export interface ExperimentAssignmentFailedPayload extends BaseEventPayload {
  experimentKey: string;
  fallbackVariant: string;
  reason?: string;
}

// Experiment Events
export interface ExperimentAssignedPayload extends BaseEventPayload {
  experimentKey: string;
  variant: string;
  userId: string;
  assignmentMethod?: 'stable_hash' | 'random' | 'override' | 'segment' | 'other';
}

export interface ExperimentViewedPayload extends BaseEventPayload {
  experimentKey: string;
  variant: string;
  viewDuration?: number;
}

export interface ExperimentConvertedPayload extends BaseEventPayload {
  experimentKey: string;
  variant: string;
  conversionType: string;
  conversionValue?: number;
}

// Integration Events
export interface IntegrationConnectedPayload extends BaseEventPayload {
  provider: string;
  integrationId?: string;
  source?: string;
}

export interface IntegrationDisconnectedPayload extends BaseEventPayload {
  provider: string;
  integrationId?: string;
  reason?: string;
}

export interface IntegrationSyncedPayload extends BaseEventPayload {
  provider: string;
  integrationId?: string;
  status: 'success' | 'partial' | 'failure';
  itemsSynced?: number;
  duration?: number;
}

// ============================================================================
// Event Tracking Functions
// ============================================================================

/**
 * Get current user ID (from session/auth)
 */
function getUserId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  // Try to get from session storage or auth context
  const sessionUserId = sessionStorage.getItem('user_id');
  if (sessionUserId) return sessionUserId;
  
  // Fallback to session ID if no user ID
  return sessionStorage.getItem('analytics_session_id') || undefined;
}

/**
 * Get current session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get current route
 */
function getCurrentRoute(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

/**
 * Enrich payload with common context
 */
function enrichPayload<T extends BaseEventPayload>(payload: T): T {
  const userId = payload.userId || getUserId();
  const sessionId = payload.sessionId || getSessionId();
  const route = payload.route || getCurrentRoute();
  const timestamp = payload.timestamp || new Date().toISOString();
  
  return {
    ...payload,
    userId,
    sessionId,
    route,
    timestamp,
  };
}

/**
 * Track a generic event
 */
export async function trackEvent<T extends BaseEventPayload>(
  eventName: string,
  payload: T
): Promise<void> {
  try {
    const enriched = enrichPayload(payload);
    const userId = enriched.userId || enriched.sessionId || 'anonymous';
    
    await track(userId, {
      type: eventName,
      path: enriched.route,
      meta: {
        ...enriched,
        // Ensure event name is included
        event: eventName,
      } as Record<string, unknown>,
      app: 'web',
    });
  } catch (error) {
    console.error(`Failed to track event ${eventName}:`, error);
  }
}

// ============================================================================
// Core Event Helpers
// ============================================================================

export async function trackAppOpened(payload: AppOpenedPayload): Promise<void> {
  await trackEvent('app_opened', payload);
}

export async function trackPageView(payload: PageViewPayload): Promise<void> {
  await trackEvent('page_view', payload);
}

export async function trackSessionStarted(payload: SessionStartedPayload): Promise<void> {
  await trackEvent('session_started', payload);
}

export async function trackSessionEnded(payload: SessionEndedPayload): Promise<void> {
  await trackEvent('session_ended', payload);
}

// ============================================================================
// Onboarding Event Helpers
// ============================================================================

export async function trackOnboardingStarted(payload: OnboardingStartedPayload): Promise<void> {
  await trackEvent('onboarding_started', payload);
}

export async function trackOnboardingStepCompleted(payload: OnboardingStepCompletedPayload): Promise<void> {
  await trackEvent('onboarding_step_completed', payload);
}

export async function trackOnboardingCompleted(payload: OnboardingCompletedPayload): Promise<void> {
  await trackEvent('onboarding_completed', payload);
}

export async function trackOnboardingAbandoned(payload: OnboardingAbandonedPayload): Promise<void> {
  await trackEvent('onboarding_abandoned', payload);
}

// ============================================================================
// Product Action Helpers
// ============================================================================

export async function trackProjectCreated(payload: ProjectCreatedPayload): Promise<void> {
  await trackEvent('project_created', payload);
}

export async function trackProjectUpdated(payload: ProjectUpdatedPayload): Promise<void> {
  await trackEvent('project_updated', payload);
}

export async function trackProjectDeleted(payload: ProjectDeletedPayload): Promise<void> {
  await trackEvent('project_deleted', payload);
}

export async function trackWorkflowCreated(payload: WorkflowCreatedPayload): Promise<void> {
  await trackEvent('workflow_created', payload);
}

export async function trackWorkflowExecuted(payload: WorkflowExecutedPayload): Promise<void> {
  await trackEvent('workflow_executed', payload);
}

export async function trackItemAdded(payload: ItemAddedPayload): Promise<void> {
  await trackEvent('item_added', payload);
}

export async function trackItemPublished(payload: ItemPublishedPayload): Promise<void> {
  await trackEvent('item_published', payload);
}

// ============================================================================
// Conversion Event Helpers
// ============================================================================

export async function trackCheckoutStarted(payload: CheckoutStartedPayload): Promise<void> {
  await trackEvent('checkout_started', payload);
}

export async function trackCheckoutStepCompleted(payload: CheckoutStepCompletedPayload): Promise<void> {
  await trackEvent('checkout_step_completed', payload);
}

export async function trackCheckoutCompleted(payload: CheckoutCompletedPayload): Promise<void> {
  await trackEvent('checkout_completed', payload);
}

export async function trackCheckoutAbandoned(payload: CheckoutAbandonedPayload): Promise<void> {
  await trackEvent('checkout_abandoned', payload);
}

export async function trackSubscriptionStarted(payload: SubscriptionStartedPayload): Promise<void> {
  await trackEvent('subscription_started', payload);
}

export async function trackSubscriptionCanceled(payload: SubscriptionCanceledPayload): Promise<void> {
  await trackEvent('subscription_canceled', payload);
}

// ============================================================================
// Engagement Event Helpers
// ============================================================================

/**
 * Track CTA click with variant support for A/B testing
 */
export async function trackCtaClick(
  ctaId: string,
  options: {
    ctaText?: string;
    location: string;
    variant?: string;
    userId?: string;
  }
): Promise<void> {
  await trackEvent('cta_clicked', {
    ctaId,
    ctaText: options.ctaText,
    location: options.location,
    variant: options.variant,
    userId: options.userId,
  });
}

export async function trackFeatureUsed(payload: FeatureUsedPayload): Promise<void> {
  await trackEvent('feature_used', payload);
}

export async function trackSearchPerformed(payload: SearchPerformedPayload): Promise<void> {
  await trackEvent('search_performed', payload);
}

export async function trackFilterApplied(payload: FilterAppliedPayload): Promise<void> {
  await trackEvent('filter_applied', payload);
}

export async function trackDropdownOpened(payload: DropdownOpenedPayload): Promise<void> {
  await trackEvent('dropdown_opened', payload);
}

export async function trackTabChanged(payload: TabChangedPayload): Promise<void> {
  await trackEvent('tab_changed', payload);
}

// ============================================================================
// Error Event Helpers
// ============================================================================

export async function trackFormValidationFailed(payload: FormValidationFailedPayload): Promise<void> {
  await trackEvent('form_validation_failed', payload);
}

export async function trackApiErrorShown(payload: ApiErrorShownPayload): Promise<void> {
  await trackEvent('api_error_shown', payload);
}

export async function trackFeatureFlagFallbackTriggered(payload: FeatureFlagFallbackTriggeredPayload): Promise<void> {
  await trackEvent('feature_flag_fallback_triggered', payload);
}

export async function trackExperimentAssignmentFailed(payload: ExperimentAssignmentFailedPayload): Promise<void> {
  await trackEvent('experiment_assignment_failed', payload);
}

// ============================================================================
// Experiment Event Helpers
// ============================================================================

export async function trackExperimentAssigned(payload: ExperimentAssignedPayload): Promise<void> {
  await trackEvent('experiment_assigned', payload);
}

export async function trackExperimentViewed(payload: ExperimentViewedPayload): Promise<void> {
  await trackEvent('experiment_viewed', payload);
}

export async function trackExperimentConverted(payload: ExperimentConvertedPayload): Promise<void> {
  await trackEvent('experiment_converted', payload);
}

// ============================================================================
// Integration Event Helpers
// ============================================================================

export async function trackIntegrationConnected(payload: IntegrationConnectedPayload): Promise<void> {
  await trackEvent('integration_connected', payload);
}

export async function trackIntegrationDisconnected(payload: IntegrationDisconnectedPayload): Promise<void> {
  await trackEvent('integration_disconnected', payload);
}

export async function trackIntegrationSynced(payload: IntegrationSyncedPayload): Promise<void> {
  await trackEvent('integration_synced', payload);
}
