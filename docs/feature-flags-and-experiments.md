# Feature Flags & Experiments Guide

**Version:** 1.0.0  
**Last Updated:** 2025-02-03  
**Phase:** Phase 7 - Product Analytics & Experimentation

## Overview

This guide explains how to use feature flags and run experiments in the codebase. Feature flags allow you to safely roll out features gradually, while experiments enable A/B testing to measure the impact of changes.

---

## Table of Contents

1. [Feature Flags](#feature-flags)
2. [Experiments](#experiments)
3. [Usage Patterns](#usage-patterns)
4. [Best Practices](#best-practices)
5. [Rollout Strategies](#rollout-strategies)
6. [Kill Switches](#kill-switches)

---

## Feature Flags

### What Are Feature Flags?

Feature flags are toggles that control whether a feature is visible or active. They enable:

- **Gradual rollouts** - Release features to a percentage of users
- **Safe deployments** - Deploy code without activating features
- **Quick rollbacks** - Disable features without code changes
- **Environment control** - Different flags per environment

### Flag Types

#### 1. Static Flags
Simple on/off toggle for all users.

```json
{
  "new_feature": {
    "enabled": true,
    "description": "New feature toggle"
  }
}
```

#### 2. Percentage Rollouts
Release to a percentage of users (0-100%).

```json
{
  "new_dashboard": {
    "enabled": true,
    "rolloutType": "percentage",
    "rolloutPercentage": 25
  }
}
```

#### 3. Segment-Based Flags
Enable for specific user segments.

```json
{
  "beta_sidebar": {
    "enabled": true,
    "rolloutType": "segment",
    "rolloutSegments": ["beta", "internal"]
  }
}
```

#### 4. Experiment-Driven Flags
Tie flag to an experiment variant.

```json
{
  "checkout_v2": {
    "enabled": true,
    "rolloutType": "experiment",
    "experimentKey": "checkout_flow_v2"
  }
}
```

### Using Feature Flags

#### In React Components

```tsx
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function Dashboard() {
  const isNewDashboard = useFeatureFlag('new_dashboard');
  
  if (isNewDashboard) {
    return <NewDashboard />;
  }
  
  return <LegacyDashboard />;
}
```

#### Multiple Flags

```tsx
import { useFeatureFlags } from '@/hooks/useFeatureFlag';

function App() {
  const flags = useFeatureFlags(['new_dashboard', 'beta_sidebar']);
  
  return (
    <>
      {flags.new_dashboard && <NewDashboard />}
      {flags.beta_sidebar && <BetaSidebar />}
    </>
  );
}
```

#### Server-Side (API Routes)

```typescript
import { isFeatureEnabled } from '@/lib/flags/flags';

export async function GET(request: Request) {
  const userId = getUserId(request);
  const enabled = isFeatureEnabled('new_api', userId);
  
  if (enabled) {
    return newApiHandler(request);
  }
  
  return legacyApiHandler(request);
}
```

---

## Experiments

### What Are Experiments?

Experiments (A/B tests) allow you to test different variants of a feature and measure their impact. Users are consistently assigned to variants, and analytics track conversion metrics.

### Experiment Structure

```json
{
  "experiments": {
    "checkout_flow_v2": {
      "key": "checkout_flow_v2",
      "description": "A/B test for new checkout flow",
      "enabled": true,
      "startDate": "2025-02-03T00:00:00Z",
      "endDate": "2025-03-03T00:00:00Z",
      "variants": [
        { "name": "control", "percentage": 50 },
        { "name": "variant_a", "percentage": 25 },
        { "name": "variant_b", "percentage": 25 }
      ],
      "primaryMetric": "checkout_completion_rate"
    }
  }
}
```

### Variant Assignment

- **Stable assignment** - Same user always gets same variant
- **Based on user ID** - Uses stable hash of `userId:experimentKey`
- **Consistent** - Assignment persists across sessions

### Using Experiments

#### In React Components

```tsx
import { useExperimentVariant } from '@/hooks/useExperiment';

function CheckoutFlow() {
  const variant = useExperimentVariant('checkout_flow_v2');
  
  if (variant === 'variant_a') {
    return <CheckoutFlowVariantA />;
  }
  
  if (variant === 'variant_b') {
    return <CheckoutFlowVariantB />;
  }
  
  return <CheckoutFlowControl />;
}
```

#### Check if User is in Experiment

```tsx
import { useIsInExperiment } from '@/hooks/useExperiment';

function Feature() {
  const isInTest = useIsInExperiment('onboarding_flow_v2');
  
  if (isInTest) {
    // User is in experiment (not control)
    return <ExperimentalFeature />;
  }
  
  return <StandardFeature />;
}
```

#### Multiple Experiments

```tsx
import { useExperimentVariants } from '@/hooks/useExperiment';

function App() {
  const variants = useExperimentVariants([
    'checkout_flow_v2',
    'dashboard_layout_test'
  ]);
  
  return (
    <>
      {variants.checkout_flow_v2 === 'variant_a' && <CheckoutA />}
      {variants.dashboard_layout_test === 'layout_a' && <DashboardA />}
    </>
  );
}
```

#### Server-Side Assignment

```typescript
import { assignExperimentVariant } from '@/lib/experiments/assign';

export async function POST(request: Request) {
  const userId = getUserId(request);
  const variant = await assignExperimentVariant('checkout_flow_v2', userId);
  
  // Variant assignment is automatically tracked to analytics
  return handleCheckout(variant, request);
}
```

---

## Usage Patterns

### Pattern 1: Feature Gate

Use a flag to gate a feature completely.

```tsx
const isEnabled = useFeatureFlag('new_dashboard');
return isEnabled ? <NewDashboard /> : <LegacyDashboard />;
```

### Pattern 2: Experiment Variants

Use an experiment to test different variants.

```tsx
const variant = useExperimentVariant('dashboard_layout_test');
switch (variant) {
  case 'layout_a':
    return <DashboardLayoutA />;
  case 'layout_b':
    return <DashboardLayoutB />;
  default:
    return <DashboardControl />;
}
```

### Pattern 3: Gradual Rollout

Use percentage rollout to gradually release.

```json
{
  "new_feature": {
    "enabled": true,
    "rolloutType": "percentage",
    "rolloutPercentage": 10  // Start with 10%
  }
}
```

Increase percentage over time: 10% → 25% → 50% → 100%

### Pattern 4: Segment Testing

Test with specific user groups first.

```json
{
  "beta_feature": {
    "enabled": true,
    "rolloutType": "segment",
    "rolloutSegments": ["beta", "internal"]
  }
}
```

### Pattern 5: Experiment + Flag Combination

Use experiment to test, flag to control.

```tsx
const variant = useExperimentVariant('checkout_flow_v2');
const isEnabled = useFeatureFlag('checkout_v2');

if (!isEnabled) {
  return <LegacyCheckout />;
}

// Experiment determines which variant
if (variant === 'variant_a') {
  return <CheckoutVariantA />;
}
return <CheckoutControl />;
```

---

## Best Practices

### 1. Always Provide Fallbacks

```tsx
// ✅ Good
const isEnabled = useFeatureFlag('new_feature');
return isEnabled ? <NewFeature /> : <LegacyFeature />;

// ❌ Bad - No fallback
const isEnabled = useFeatureFlag('new_feature');
if (isEnabled) return <NewFeature />;
// What if flag is false? Nothing renders!
```

### 2. Use Stable User IDs

Experiments require stable user IDs for consistent assignment.

```typescript
// ✅ Good - Use authenticated user ID
const userId = user.id;
const variant = getExperimentVariant('test', userId);

// ❌ Bad - Random or session-based IDs
const variant = getExperimentVariant('test', Math.random().toString());
```

### 3. Track Experiment Context

Include experiment info in analytics events.

```typescript
import { trackCtaClick } from '@/lib/telemetry/events';
import { useExperimentVariant } from '@/hooks/useExperiment';

function CTAButton() {
  const variant = useExperimentVariant('cta_test');
  
  const handleClick = () => {
    trackCtaClick('hero_primary', {
      location: '/home',
      variant, // Include variant in event
    });
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

### 4. Don't Break Core Flows

Experiments should never break critical user journeys.

```tsx
// ✅ Good - Experiment only affects non-critical UI
const variant = useExperimentVariant('button_color_test');
return <Button color={variant === 'blue' ? 'blue' : 'green'} />;

// ❌ Bad - Experiment affects critical flow
const variant = useExperimentVariant('checkout_test');
if (variant === 'broken') {
  throw new Error('Test variant'); // Don't do this!
}
```

### 5. Document Experiments

Add comments explaining what you're testing.

```tsx
/**
 * Experiment: checkout_flow_v2
 * Testing: Simplified checkout vs. multi-step checkout
 * Metric: checkout_completion_rate
 * Duration: 2 weeks
 */
const variant = useExperimentVariant('checkout_flow_v2');
```

### 6. Clean Up After Experiments

Remove experiment code after conclusion.

```tsx
// After experiment ends:
// 1. Analyze results
// 2. Choose winning variant
// 3. Remove experiment code
// 4. Keep only winning variant
```

---

## Rollout Strategies

### Strategy 1: Canary Release

1. Enable flag for 1% of users
2. Monitor metrics for 24-48 hours
3. Increase to 5%, then 10%, 25%, 50%, 100%
4. Watch for errors, performance issues, user feedback

### Strategy 2: Segment-Based Rollout

1. Enable for internal team (`internal` segment)
2. Enable for beta users (`beta` segment)
3. Enable for all users

### Strategy 3: Experiment → Rollout

1. Run experiment (50/50 split)
2. Measure primary metric
3. If variant wins, enable flag for all users
4. Remove experiment code

### Strategy 4: Gradual Percentage

```json
// Week 1
{ "rolloutPercentage": 10 }

// Week 2
{ "rolloutPercentage": 25 }

// Week 3
{ "rolloutPercentage": 50 }

// Week 4
{ "rolloutPercentage": 100 }
```

---

## Kill Switches

### Emergency Disable

If a feature causes issues, disable it immediately:

```json
{
  "problematic_feature": {
    "enabled": false  // ← Change to false
  }
}
```

No code deployment needed - change takes effect immediately.

### Environment-Based Control

Disable in production but keep enabled in staging:

```json
{
  "new_feature": {
    "enabled": true,
    "env": "staging"  // Only enabled in staging
  }
}
```

### Experiment Pause

Pause experiment without removing it:

```json
{
  "experiments": {
    "test_experiment": {
      "enabled": false  // ← Pause experiment
    }
  }
}
```

---

## Configuration Files

### Location

- **Flags:** `/config/flags.json`
- **Code:** `/lib/flags/flags.ts`
- **Hooks:** `/hooks/useFeatureFlag.ts`, `/hooks/useExperiment.ts`

### Schema

Flags and experiments follow JSON schema defined in `flags.json`.

### Environment Variables

Flags respect `NODE_ENV`:
- `development` - Development environment
- `staging` / `preview` - Staging environment
- `production` - Production environment

---

## Troubleshooting

### Flag Not Working

1. Check flag exists in `flags.json`
2. Verify `enabled: true`
3. Check environment restrictions (`env` field)
4. Verify user ID is available (for percentage/segment flags)
5. Check browser console for errors

### Experiment Assignment Inconsistent

1. Ensure user ID is stable (not random)
2. Check experiment is enabled
3. Verify date range (startDate/endDate)
4. Check segment targeting

### Events Not Tracking

1. Check analytics service is initialized
2. Verify user ID is available
3. Check network tab for API calls
4. Review browser console for errors

---

## Examples

### Example 1: Simple Feature Flag

```tsx
// Component
function Dashboard() {
  const isNewDashboard = useFeatureFlag('new_dashboard');
  return isNewDashboard ? <NewDashboard /> : <LegacyDashboard />;
}

// Config
{
  "flags": {
    "new_dashboard": {
      "enabled": true,
      "description": "New dashboard UI"
    }
  }
}
```

### Example 2: Percentage Rollout

```tsx
// Component
function Feature() {
  const isEnabled = useFeatureFlag('new_feature');
  return isEnabled ? <NewFeature /> : null;
}

// Config - 25% rollout
{
  "flags": {
    "new_feature": {
      "enabled": true,
      "rolloutType": "percentage",
      "rolloutPercentage": 25
    }
  }
}
```

### Example 3: A/B Test

```tsx
// Component
function Checkout() {
  const variant = useExperimentVariant('checkout_flow_v2');
  
  if (variant === 'variant_a') {
    return <CheckoutFlowA />;
  }
  
  if (variant === 'variant_b') {
    return <CheckoutFlowB />;
  }
  
  return <CheckoutFlowControl />;
}

// Config
{
  "experiments": {
    "checkout_flow_v2": {
      "key": "checkout_flow_v2",
      "enabled": true,
      "variants": [
        { "name": "control", "percentage": 50 },
        { "name": "variant_a", "percentage": 25 },
        { "name": "variant_b", "percentage": 25 }
      ]
    }
  }
}
```

---

## Next Steps

1. **Add a new flag:** Edit `/config/flags.json`
2. **Create an experiment:** Add to `experiments` in `flags.json`
3. **Use in code:** Import hooks and use in components
4. **Track events:** Include experiment context in analytics
5. **Monitor results:** Check dashboards for experiment metrics
6. **Clean up:** Remove experiment code after conclusion

---

**Last Updated:** 2025-02-03  
**Maintainer:** Product Engineering Team
