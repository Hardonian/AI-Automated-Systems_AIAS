# Event Taxonomy

**Version:** 1.0.0  
**Last Updated:** 2025-02-03  
**Phase:** Phase 7 - Product Analytics & Experimentation

## Overview

This document defines the standardized event taxonomy for product analytics. All events follow a consistent structure and naming convention to enable reliable funnel analysis, cohort tracking, and experiment evaluation.

---

## Event Structure

All events include these **required fields**:

```typescript
{
  userId: string;           // User identifier (or sessionId for anonymous)
  event: string;            // Event name (from taxonomy)
  timestamp: string;        // ISO 8601 timestamp
  route?: string;           // Current route/path
  sessionId?: string;       // Session identifier
}
```

**Optional payload fields** vary by event type and are documented below.

---

## Core Events (Global)

### `app_opened`
**Description:** User opens the application  
**When:** On app initialization, page load  
**Payload:**
```typescript
{
  source?: string;          // 'direct', 'referral', 'search', etc.
  referrer?: string;       // Referrer URL
  userAgent?: string;       // Browser user agent
  viewport?: {              // Viewport dimensions
    width: number;
    height: number;
  };
}
```

### `page_view`
**Description:** User views a page  
**When:** On route change/page navigation  
**Payload:**
```typescript
{
  page: string;            // Page path/route
  title?: string;          // Page title
  referrer?: string;       // Previous page
  loadTime?: number;        // Page load time in ms
}
```

### `session_started`
**Description:** New user session begins  
**When:** First event in a session  
**Payload:**
```typescript
{
  sessionId: string;       // Unique session ID
  isNewUser?: boolean;     // First-time visitor
  isReturning?: boolean;   // Returning user
}
```

### `session_ended`
**Description:** User session ends  
**When:** On session timeout or explicit logout  
**Payload:**
```typescript
{
  sessionId: string;
  duration?: number;        // Session duration in seconds
  pageViews?: number;      // Total page views in session
  events?: number;         // Total events in session
}
```

---

## Onboarding Events

### `onboarding_started`
**Description:** User begins onboarding flow  
**When:** First step of onboarding  
**Payload:**
```typescript
{
  source?: string;         // How they arrived ('signup', 'invite', etc.)
  userId: string;
}
```

### `onboarding_step_completed`
**Description:** User completes an onboarding step  
**When:** After completing a step  
**Payload:**
```typescript
{
  stepIndex: number;       // Step number (1-indexed)
  stepName: string;       // Step identifier
  duration?: number;       // Time spent on step (ms)
  skipped?: boolean;      // Whether step was skipped
}
```

### `onboarding_completed`
**Description:** User completes entire onboarding  
**When:** After final onboarding step  
**Payload:**
```typescript
{
  totalSteps: number;      // Total steps completed
  totalDuration?: number;  // Total onboarding time (ms)
  skippedSteps?: string[]; // List of skipped step names
}
```

### `onboarding_abandoned`
**Description:** User abandons onboarding  
**When:** User leaves onboarding without completing  
**Payload:**
```typescript
{
  stepIndex: number;       // Last step attempted
  stepName: string;        // Last step identifier
  reason?: string;         // If known ('timeout', 'navigation', etc.)
}
```

---

## Core Product Actions

### `project_created`
**Description:** User creates a new project  
**When:** After project creation  
**Payload:**
```typescript
{
  projectId: string;
  projectName?: string;
  projectType?: string;
  source?: string;         // 'new', 'template', 'import', etc.
}
```

### `project_updated`
**Description:** User updates a project  
**When:** After project save/update  
**Payload:**
```typescript
{
  projectId: string;
  changes?: string[];      // List of changed fields
  source?: string;         // 'manual', 'api', 'automation', etc.
}
```

### `project_deleted`
**Description:** User deletes a project  
**When:** After project deletion  
**Payload:**
```typescript
{
  projectId: string;
  projectName?: string;
}
```

### `workflow_created`
**Description:** User creates a workflow  
**When:** After workflow creation  
**Payload:**
```typescript
{
  workflowId: string;
  workflowName?: string;
  workflowType?: string;
  source?: string;         // 'new', 'template', 'duplicate', etc.
}
```

### `workflow_executed`
**Description:** Workflow is executed  
**When:** After workflow run completes  
**Payload:**
```typescript
{
  workflowId: string;
  executionId: string;
  status: 'success' | 'failure' | 'partial';
  duration?: number;       // Execution time (ms)
  stepsCompleted?: number;
  stepsTotal?: number;
}
```

### `item_added`
**Description:** User adds an item (generic)  
**When:** After adding any item  
**Payload:**
```typescript
{
  itemType: string;        // 'task', 'note', 'file', etc.
  itemId: string;
  containerId?: string;    // Parent container ID
  source?: string;
}
```

### `item_published`
**Description:** User publishes an item  
**When:** After publishing  
**Payload:**
```typescript
{
  itemType: string;
  itemId: string;
  publishTarget?: string;  // 'public', 'team', 'specific', etc.
}
```

---

## Conversion & Commerce Events

### `checkout_started`
**Description:** User begins checkout process  
**When:** On checkout page load or first checkout step  
**Payload:**
```typescript
{
  cartValue?: number;      // Cart total
  currency?: string;       // Currency code
  items?: number;          // Number of items
  plan?: string;          // Selected plan
}
```

### `checkout_step_completed`
**Description:** User completes a checkout step  
**When:** After completing checkout step  
**Payload:**
```typescript
{
  stepIndex: number;
  stepName: string;        // 'billing', 'payment', 'review', etc.
  duration?: number;        // Time on step (ms)
}
```

### `checkout_completed`
**Description:** User completes checkout  
**When:** After successful payment  
**Payload:**
```typescript
{
  orderId: string;
  amount: number;
  currency: string;
  plan?: string;
  paymentMethod?: string;
  duration?: number;        // Total checkout time (ms)
}
```

### `checkout_abandoned`
**Description:** User abandons checkout  
**When:** User leaves checkout without completing  
**Payload:**
```typescript
{
  stepIndex: number;       // Last step reached
  stepName: string;
  cartValue?: number;
  reason?: string;         // If detectable
}
```

### `subscription_started`
**Description:** User starts a subscription  
**When:** After subscription activation  
**Payload:**
```typescript
{
  subscriptionId: string;
  plan: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
}
```

### `subscription_canceled`
**Description:** User cancels subscription  
**When:** After cancellation  
**Payload:**
```typescript
{
  subscriptionId: string;
  plan: string;
  cancellationReason?: string;
  effectiveDate?: string;  // When cancellation takes effect
}
```

---

## Engagement Events

### `cta_clicked`
**Description:** User clicks a call-to-action button  
**When:** On CTA click  
**Payload:**
```typescript
{
  ctaId: string;           // CTA identifier
  ctaText?: string;        // Button text
  location: string;        // Page/component location
  variant?: string;         // A/B test variant (if applicable)
}
```

### `feature_used`
**Description:** User uses a feature  
**When:** On feature interaction  
**Payload:**
```typescript
{
  featureName: string;     // Feature identifier
  featureType?: string;     // 'button', 'modal', 'command', etc.
  location?: string;        // Where feature was used
}
```

### `search_performed`
**Description:** User performs a search  
**When:** On search submission  
**Payload:**
```typescript
{
  query: string;           // Search query
  resultCount?: number;     // Number of results
  searchType?: string;      // 'global', 'projects', 'users', etc.
}
```

### `filter_applied`
**Description:** User applies a filter  
**When:** On filter change  
**Payload:**
```typescript
{
  filterType: string;       // Filter category
  filterValue: string;      // Selected value
  location?: string;        // Where filter was applied
}
```

### `dropdown_opened`
**Description:** User opens a dropdown (only for meaningful interactions)  
**When:** On dropdown open  
**Payload:**
```typescript
{
  dropdownId: string;      // Dropdown identifier
  location?: string;       // Page/component location
}
```

### `tab_changed`
**Description:** User switches tabs (only for meaningful interactions)  
**When:** On tab switch  
**Payload:**
```typescript
{
  tabGroup: string;        // Tab group identifier
  tabFrom: string;         // Previous tab
  tabTo: string;          // New tab
}
```

---

## Error & Friction Events

### `form_validation_failed`
**Description:** Form validation fails  
**When:** On validation error  
**Payload:**
```typescript
{
  formId: string;          // Form identifier
  fieldName?: string;      // Field with error
  errorType?: string;      // Error type ('required', 'format', etc.)
  attemptNumber?: number;   // Number of attempts
}
```

### `api_error_shown`
**Description:** API error is displayed to user  
**When:** On error display  
**Payload:**
```typescript
{
  errorCode?: string;      // Error code
  errorMessage?: string;   // Error message (sanitized)
  endpoint?: string;        // API endpoint
  statusCode?: number;      // HTTP status code
}
```

### `feature_flag_fallback_triggered`
**Description:** Feature flag resolution fails, fallback used  
**When:** On flag resolution failure  
**Payload:**
```typescript
{
  flagKey: string;         // Flag identifier
  fallbackValue: boolean;  // Fallback value used
  reason?: string;         // Failure reason
}
```

### `experiment_assignment_failed`
**Description:** Experiment variant assignment fails  
**When:** On assignment failure  
**Payload:**
```typescript
{
  experimentKey: string;   // Experiment identifier
  fallbackVariant: string; // Fallback variant used
  reason?: string;         // Failure reason
}
```

---

## Experiment Events

### `experiment_assigned`
**Description:** User is assigned to an experiment variant  
**When:** On experiment assignment  
**Payload:**
```typescript
{
  experimentKey: string;   // Experiment identifier
  variant: string;         // Assigned variant ('control', 'variant_a', etc.)
  userId: string;
  assignmentMethod?: string; // 'stable_hash', 'random', 'override', etc.
}
```

### `experiment_viewed`
**Description:** User views experiment variant  
**When:** On variant display  
**Payload:**
```typescript
{
  experimentKey: string;
  variant: string;
  viewDuration?: number;   // Time variant was visible (ms)
}
```

### `experiment_converted`
**Description:** User converts in experiment context  
**When:** On conversion event within experiment  
**Payload:**
```typescript
{
  experimentKey: string;
  variant: string;
  conversionType: string;  // 'signup', 'purchase', 'activation', etc.
  conversionValue?: number; // Monetary value if applicable
}
```

---

## Integration Events

### `integration_connected`
**Description:** User connects an integration  
**When:** After successful connection  
**Payload:**
```typescript
{
  provider: string;         // Integration provider name
  integrationId?: string;  // Integration instance ID
  source?: string;         // Where connection was initiated
}
```

### `integration_disconnected`
**Description:** User disconnects an integration  
**When:** After disconnection  
**Payload:**
```typescript
{
  provider: string;
  integrationId?: string;
  reason?: string;         // If provided by user
}
```

### `integration_synced`
**Description:** Integration sync completes  
**When:** After sync operation  
**Payload:**
```typescript
{
  provider: string;
  integrationId?: string;
  status: 'success' | 'partial' | 'failure';
  itemsSynced?: number;
  duration?: number;       // Sync duration (ms)
}
```

---

## Event Naming Conventions

### Rules:
1. **Use snake_case** for event names (`project_created`, not `projectCreated`)
2. **Use past tense** for completed actions (`workflow_executed`, not `workflow_execute`)
3. **Be specific** (`checkout_step_completed`, not `checkout_progress`)
4. **Group by domain** (onboarding_, checkout_, integration_, etc.)
5. **Avoid noise** - Don't track every click, only meaningful interactions

### Examples:
✅ Good:
- `onboarding_step_completed`
- `checkout_completed`
- `cta_clicked`

❌ Bad:
- `click` (too generic)
- `userDidSomething` (wrong case)
- `button_click` (not meaningful enough)

---

## Event Context

All events automatically include **context** when available:

```typescript
{
  // Experiment context (if user is in experiment)
  experimentKey?: string;
  variant?: string;
  
  // Feature flag context (if relevant)
  featureFlags?: Record<string, boolean>;
  
  // User context
  userId?: string;
  userSegment?: string;    // 'beta', 'enterprise', etc.
  
  // Session context
  sessionId?: string;
  sessionDuration?: number;
  
  // Device context
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
}
```

---

## Usage Guidelines

### When to Track:
- ✅ User actions that indicate intent (clicks, form submissions)
- ✅ State changes that matter (project created, workflow executed)
- ✅ Conversion events (signup, purchase, activation)
- ✅ Errors and friction points
- ✅ Experiment interactions

### When NOT to Track:
- ❌ Every mouse movement or scroll
- ❌ Internal system events (unless debugging)
- ❌ Events that don't inform product decisions
- ❌ Sensitive data (passwords, PII without consent)

### Best Practices:
1. **Track early** - Add events when building features, not retroactively
2. **Be consistent** - Use the taxonomy, don't invent new event names
3. **Include context** - Add relevant payload fields for analysis
4. **Test events** - Verify events fire correctly in development
5. **Document changes** - Update this taxonomy when adding events

---

## Migration Notes

If migrating from existing ad-hoc tracking:

1. Map existing events to this taxonomy
2. Update event names to match taxonomy
3. Ensure payloads match expected structure
4. Update dashboards/queries to use new event names
5. Deprecate old event names with a grace period

---

**Last Updated:** 2025-02-03  
**Maintainer:** Product Engineering Team
