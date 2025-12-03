# Product Analytics Dashboards

**Version:** 1.0.0  
**Last Updated:** 2025-02-03  
**Phase:** Phase 7 - Product Analytics & Experimentation

## Overview

This document outlines recommended dashboards and metrics for product analytics. These dashboards help track user behavior, measure feature adoption, evaluate experiments, and identify friction points.

**Note:** This guide is tool-agnostic. Use with any analytics platform (Google Analytics, Amplitude, PostHog, Mixpanel, custom, etc.).

---

## Table of Contents

1. [Core Dashboards](#core-dashboards)
2. [Funnel Analysis](#funnel-analysis)
3. [Feature Adoption](#feature-adoption)
4. [Experiment Dashboards](#experiment-dashboards)
5. [Engagement Metrics](#engagement-metrics)
6. [Conversion Metrics](#conversion-metrics)
7. [Example Queries](#example-queries)

---

## Core Dashboards

### 1. User Activity Overview

**Purpose:** High-level view of user activity and engagement

**Metrics:**
- Daily/Monthly Active Users (DAU/MAU)
- New vs. Returning Users
- Session Duration (average, median)
- Page Views per Session
- Bounce Rate

**Events Used:**
- `session_started`
- `session_ended`
- `page_view`
- `app_opened`

**Visualization:**
- Time series: DAU/MAU over time
- Pie chart: New vs. Returning users
- Histogram: Session duration distribution

---

### 2. User Journey Map

**Purpose:** Understand how users navigate through the product

**Metrics:**
- Top entry pages
- Top exit pages
- Most common navigation paths
- Page-to-page flow

**Events Used:**
- `page_view`
- `session_started`
- `session_ended`

**Visualization:**
- Sankey diagram: User flow between pages
- Table: Entry/exit pages
- Heatmap: Common navigation patterns

---

## Funnel Analysis

### 1. Onboarding Funnel

**Purpose:** Track user progress through onboarding

**Funnel Steps:**
1. `onboarding_started`
2. `onboarding_step_completed` (step 1)
3. `onboarding_step_completed` (step 2)
4. `onboarding_step_completed` (step 3)
5. `onboarding_completed`

**Metrics:**
- Conversion rate at each step
- Drop-off rate between steps
- Average time per step
- Abandonment rate

**Query Example:**
```
Funnel: onboarding_started → step_1 → step_2 → step_3 → onboarding_completed
Group by: experiment variant (if applicable)
Time range: Last 30 days
```

**Visualization:**
- Funnel chart with conversion percentages
- Time-to-complete distribution
- Abandonment reasons (if tracked)

---

### 2. Checkout Funnel

**Purpose:** Track conversion through checkout process

**Funnel Steps:**
1. `checkout_started`
2. `checkout_step_completed` (billing)
3. `checkout_step_completed` (payment)
4. `checkout_step_completed` (review)
5. `checkout_completed`

**Metrics:**
- Conversion rate at each step
- Cart abandonment rate
- Average checkout time
- Revenue per completed checkout

**Query Example:**
```
Funnel: checkout_started → billing → payment → review → checkout_completed
Filter: experimentKey = 'checkout_flow_v2'
Compare: variant_a vs variant_b vs control
```

**Visualization:**
- Funnel chart with conversion rates
- Comparison by experiment variant
- Abandonment analysis

---

### 3. Activation Funnel

**Purpose:** Track user activation (key actions that indicate value)

**Funnel Steps:**
1. `user_signed_up` (or `onboarding_started`)
2. `integration_connected`
3. `workflow_created`
4. `workflow_executed`
5. `user_activated`

**Metrics:**
- Activation rate (% completing all steps)
- Time to activation
- Most common activation path

**Query Example:**
```
Funnel: signup → integration_connected → workflow_created → workflow_executed → user_activated
Time range: Last 90 days
Segment: By user plan
```

**Visualization:**
- Funnel chart
- Time-to-activation histogram
- Path analysis

---

## Feature Adoption

### 1. Feature Usage Dashboard

**Purpose:** Track which features are being used

**Metrics:**
- Feature usage count (by `feature_used` events)
- Unique users per feature
- Feature adoption rate (% of users who used feature)
- Feature usage frequency

**Events Used:**
- `feature_used`
- `project_created`
- `workflow_created`
- `integration_connected`

**Query Example:**
```
Event: feature_used
Group by: featureName
Metric: Count: Last 30 days
Unique users: Count distinct userId
```

**Visualization:**
- Bar chart: Feature usage count
- Table: Adoption rates
- Trend lines: Feature usage over time

---

### 2. Feature Flag Impact

**Purpose:** Measure impact of feature flags on usage

**Metrics:**
- Feature usage by flag state (enabled/disabled)
- Conversion rate with flag enabled vs. disabled
- User engagement with flagged features

**Query Example:**
```
Event: feature_used
Filter: featureName = 'new_dashboard'
Group by: featureFlags.new_dashboard (true/false)
Compare: Usage rate, engagement metrics
```

**Visualization:**
- Comparison chart: Enabled vs. Disabled
- Impact metrics: Conversion, engagement

---

## Experiment Dashboards

### 1. Experiment Overview

**Purpose:** Monitor all active experiments

**Metrics:**
- Active experiments count
- Users per experiment
- Experiment assignment rate
- Experiment health (assignment failures)

**Events Used:**
- `experiment_assigned`
- `experiment_assignment_failed`

**Query Example:**
```
Event: experiment_assigned
Group by: experimentKey, variant
Time range: Last 7 days
Metrics: Count, unique users
```

**Visualization:**
- Table: Active experiments
- Pie charts: Variant distribution per experiment
- Health indicators: Assignment success rate

---

### 2. Experiment Results Dashboard

**Purpose:** Compare experiment variants and measure impact

**Metrics:**
- Conversion rate by variant
- Primary metric comparison
- Statistical significance
- Sample size

**Events Used:**
- `experiment_assigned`
- `experiment_viewed`
- `experiment_converted`
- Conversion events (e.g., `checkout_completed`, `onboarding_completed`)

**Query Example:**
```
Experiment: checkout_flow_v2
Variants: control, variant_a, variant_b
Primary metric: checkout_completed count / checkout_started count
Time range: Experiment duration
```

**Visualization:**
- Comparison chart: Conversion rates by variant
- Statistical test results (p-value, confidence interval)
- Sample size indicators

---

### 3. Experiment Funnel Comparison

**Purpose:** Compare funnels across experiment variants

**Metrics:**
- Funnel conversion at each step by variant
- Drop-off rates by variant
- Time-to-convert by variant

**Query Example:**
```
Funnel: checkout_started → billing → payment → review → checkout_completed
Group by: experiment variant
Filter: experimentKey = 'checkout_flow_v2'
Compare: Conversion rates, drop-off points
```

**Visualization:**
- Side-by-side funnel charts
- Conversion rate comparison table
- Statistical significance indicators

---

## Engagement Metrics

### 1. User Engagement Score

**Purpose:** Measure overall user engagement

**Metrics:**
- Daily active users / Monthly active users (DAU/MAU ratio)
- Sessions per user
- Actions per session
- Feature usage breadth (how many features used)

**Events Used:**
- `session_started`
- `feature_used`
- `page_view`
- `cta_clicked`

**Query Example:**
```
Metrics:
- DAU/MAU ratio
- Average sessions per user (last 30 days)
- Average features used per user
- Average actions per session
```

**Visualization:**
- Scorecard: Engagement score
- Trend lines: Engagement over time
- Cohort analysis: Engagement by signup cohort

---

### 2. Feature Engagement Deep Dive

**Purpose:** Understand how users interact with specific features

**Metrics:**
- Feature usage frequency
- Time spent using feature
- Feature completion rate
- Feature abandonment rate

**Events Used:**
- `feature_used`
- Feature-specific events (e.g., `workflow_executed`, `project_created`)

**Query Example:**
```
Event: workflow_created
Metrics:
- Count per user
- Time between creation and execution
- Execution rate (workflow_executed / workflow_created)
```

**Visualization:**
- Usage frequency distribution
- Completion rate gauge
- Time-to-action histogram

---

## Conversion Metrics

### 1. Conversion Rate Dashboard

**Purpose:** Track key conversion metrics

**Metrics:**
- Signup → Activation conversion
- Trial → Paid conversion
- Visitor → Signup conversion
- Feature → Purchase conversion

**Events Used:**
- `onboarding_started`
- `onboarding_completed`
- `subscription_started`
- `checkout_completed`

**Query Example:**
```
Conversion rates:
1. onboarding_completed / onboarding_started
2. subscription_started / onboarding_completed
3. checkout_completed / checkout_started
Time range: Last 30 days
```

**Visualization:**
- Scorecards: Conversion rates
- Trend lines: Conversion over time
- Comparison: By experiment variant

---

### 2. Revenue Dashboard

**Purpose:** Track revenue and monetization metrics

**Metrics:**
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)

**Events Used:**
- `subscription_started`
- `subscription_canceled`
- `checkout_completed`

**Query Example:**
```
Event: subscription_started
Metrics:
- Sum of amount (MRR)
- Count of subscriptions
- Average amount (ARPU)
Group by: Plan type
```

**Visualization:**
- Revenue trend lines
- Revenue by plan type
- Churn analysis

---

## Example Queries

### Query 1: Onboarding Completion Rate

**Tool:** Any SQL/query interface

```sql
SELECT 
  COUNT(DISTINCT CASE WHEN event = 'onboarding_completed' THEN userId END) * 100.0 /
  COUNT(DISTINCT CASE WHEN event = 'onboarding_started' THEN userId END) AS completion_rate
FROM analytics_events
WHERE event IN ('onboarding_started', 'onboarding_completed')
  AND timestamp >= NOW() - INTERVAL '30 days'
```

**Amplitude/Mixpanel:**
```
Funnel: onboarding_started → onboarding_completed
Time range: Last 30 days
Metric: Conversion rate
```

---

### Query 2: Experiment Variant Comparison

**Tool:** Any SQL/query interface

```sql
SELECT 
  variant,
  COUNT(DISTINCT userId) AS users,
  COUNT(CASE WHEN event = 'checkout_completed' THEN 1 END) * 100.0 /
  COUNT(CASE WHEN event = 'checkout_started' THEN 1 END) AS conversion_rate
FROM analytics_events
WHERE experimentKey = 'checkout_flow_v2'
  AND event IN ('checkout_started', 'checkout_completed')
GROUP BY variant
```

**Amplitude/Mixpanel:**
```
Event: checkout_completed
Filter: experimentKey = 'checkout_flow_v2'
Group by: variant
Compare: Conversion rate (checkout_completed / checkout_started)
```

---

### Query 3: Feature Adoption Rate

**Tool:** Any SQL/query interface

```sql
SELECT 
  featureName,
  COUNT(DISTINCT userId) AS unique_users,
  COUNT(*) AS total_uses,
  COUNT(*) * 1.0 / COUNT(DISTINCT userId) AS uses_per_user
FROM analytics_events
WHERE event = 'feature_used'
  AND timestamp >= NOW() - INTERVAL '30 days'
GROUP BY featureName
ORDER BY unique_users DESC
```

**Amplitude/Mixpanel:**
```
Event: feature_used
Group by: featureName
Metrics: Unique users, Total count, Average per user
Time range: Last 30 days
```

---

### Query 4: Checkout Abandonment Analysis

**Tool:** Any SQL/query interface

```sql
SELECT 
  stepName,
  COUNT(DISTINCT userId) AS users_reached,
  COUNT(DISTINCT CASE WHEN event = 'checkout_abandoned' THEN userId END) AS abandoned,
  COUNT(DISTINCT CASE WHEN event = 'checkout_completed' THEN userId END) AS completed
FROM analytics_events
WHERE event IN ('checkout_step_completed', 'checkout_abandoned', 'checkout_completed')
  AND timestamp >= NOW() - INTERVAL '30 days'
GROUP BY stepName
ORDER BY users_reached DESC
```

**Amplitude/Mixpanel:**
```
Funnel: checkout_started → billing → payment → review → checkout_completed
Event: checkout_abandoned
Analysis: Drop-off at each step, abandonment reasons
```

---

## Dashboard Best Practices

### 1. Keep Dashboards Focused

- One dashboard per use case
- Limit to 5-10 key metrics
- Use clear titles and descriptions

### 2. Use Consistent Time Ranges

- Default: Last 30 days
- Comparison: Week-over-week, month-over-month
- Trend: Show at least 3 months of data

### 3. Include Context

- Add notes explaining metrics
- Document calculation methods
- Include data freshness indicators

### 4. Make Dashboards Actionable

- Highlight anomalies
- Show trends (not just snapshots)
- Include comparison baselines

### 5. Regular Review Schedule

- **Daily:** Core metrics (DAU, errors)
- **Weekly:** Feature adoption, experiments
- **Monthly:** Conversion funnels, revenue

---

## Key Metrics Summary

### User Metrics
- DAU/MAU ratio
- New vs. Returning users
- Session duration
- Page views per session

### Conversion Metrics
- Onboarding completion rate
- Checkout completion rate
- Activation rate
- Trial-to-paid conversion

### Engagement Metrics
- Features used per user
- Actions per session
- Feature adoption rate
- Return visit rate

### Experiment Metrics
- Variant assignment rate
- Conversion rate by variant
- Statistical significance
- Sample size

### Revenue Metrics
- MRR/ARR
- ARPU
- Churn rate
- LTV

---

## Integration with Analytics Platforms

### Google Analytics 4
- Use `gtag` events
- Map events to GA4 event names
- Set up custom dimensions for experiments

### Amplitude
- Use Amplitude SDK
- Create cohorts for segments
- Build funnels and retention charts

### PostHog
- Use PostHog SDK
- Create feature flags in PostHog
- Use PostHog experiments

### Mixpanel
- Use Mixpanel SDK
- Create funnels and cohorts
- Use Mixpanel experiments

### Custom Analytics
- Store events in database
- Build custom dashboards
- Use SQL queries for analysis

---

**Last Updated:** 2025-02-03  
**Maintainer:** Product Engineering Team
