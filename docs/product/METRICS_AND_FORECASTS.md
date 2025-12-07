# Metrics & Forecasts — AIAS Platform

**Version:** 1.0  
**Last Updated:** 2025-01-29  
**Status:** Active

---

## OVERVIEW

This document defines the key metrics, forecasting models, and success criteria for AIAS Platform. Metrics are organized by category (Activation, Retention, Revenue, Product) and include targets, tracking methods, and forecasting models.

**North Star Metric:** Monthly Active Organizations (MAO)

---

## NORTH STAR METRIC

### Monthly Active Organizations (MAO)

**Definition:** Organizations that have run at least one automation in the past 30 days.

**Why This Metric:**
- Measures product value (users getting value from automations)
- Predicts retention (active users = retained users)
- Correlates with revenue (active users = paying customers)

**Targets:**
- Month 1: 50 MAO
- Month 3: 300 MAO
- Month 6: 1,000 MAO
- Month 12: 10,000 MAO

**Tracking:**
- Database query: `SELECT COUNT(DISTINCT organization_id) FROM automations WHERE created_at >= NOW() - INTERVAL '30 days'`
- Dashboard: Real-time MAO count, trend chart
- Reporting: Weekly MAO report, cohort analysis

---

## ACTIVATION METRICS

### Activation Rate

**Definition:** Percentage of signups that activate (connect integration + create workflow) within 7 days.

**Formula:** `(Activated Users / Total Signups) * 100`

**Targets:**
- Month 1: > 50%
- Month 3: > 60%
- Month 6: > 65%
- Month 12: > 70%

**Tracking:**
- Event: `user_activated` (triggered when user connects integration + creates workflow)
- Dashboard: Activation funnel (signup → integration → workflow → activation)
- Reporting: Daily activation rate, cohort analysis

**Forecasting:**
- Baseline: 50% (Month 1)
- Growth: +2% per month (improved onboarding)
- Target: 70% (Month 12)

---

### Time-to-Activation

**Definition:** Median time from signup to activation (connect integration + create workflow).

**Targets:**
- Month 1: < 48 hours
- Month 3: < 24 hours
- Month 6: < 12 hours
- Month 12: < 6 hours

**Tracking:**
- Event: `user_activated` (timestamp: signup → activation)
- Dashboard: Time-to-activation distribution, median/mean
- Reporting: Weekly time-to-activation report

**Forecasting:**
- Baseline: 48 hours (Month 1)
- Improvement: -50% per quarter (better onboarding)
- Target: 6 hours (Month 12)

---

### Activation Funnel

**Definition:** Conversion rates at each stage of activation (signup → integration → workflow → activation).

**Stages:**
1. Signup → First Integration: Target > 60%
2. First Integration → First Workflow: Target > 80%
3. First Workflow → Activation: Target > 70%

**Tracking:**
- Events: `user_signed_up`, `integration_connected`, `workflow_created`, `user_activated`
- Dashboard: Funnel visualization, drop-off analysis
- Reporting: Weekly funnel report, cohort analysis

**Forecasting:**
- Baseline: 50% → 70% → 60% (Month 1)
- Improvement: +5% per stage per quarter
- Target: 70% → 85% → 75% (Month 12)

---

## RETENTION METRICS

### Day 1 Retention

**Definition:** Percentage of users who return on Day 1 after signup.

**Formula:** `(Users Active on Day 1 / Total Signups) * 100`

**Targets:**
- Month 1: > 50%
- Month 3: > 60%
- Month 6: > 65%
- Month 12: > 70%

**Tracking:**
- Event: `user_active` (triggered when user logs in or runs automation)
- Dashboard: Day 1 retention chart, cohort analysis
- Reporting: Daily retention report, weekly cohort analysis

**Forecasting:**
- Baseline: 50% (Month 1)
- Growth: +2% per month (better onboarding, engagement)
- Target: 70% (Month 12)

---

### Day 7 Retention

**Definition:** Percentage of users who return on Day 7 after signup.

**Formula:** `(Users Active on Day 7 / Total Signups) * 100`

**Targets:**
- Month 1: > 30%
- Month 3: > 40%
- Month 6: > 45%
- Month 12: > 50%

**Tracking:**
- Event: `user_active` (Day 7 after signup)
- Dashboard: Day 7 retention chart, cohort analysis
- Reporting: Weekly retention report, cohort analysis

**Forecasting:**
- Baseline: 30% (Month 1)
- Growth: +2% per month (better engagement, value realization)
- Target: 50% (Month 12)

---

### Day 30 Retention

**Definition:** Percentage of users who return on Day 30 after signup.

**Formula:** `(Users Active on Day 30 / Total Signups) * 100`

**Targets:**
- Month 1: > 20%
- Month 3: > 25%
- Month 6: > 30%
- Month 12: > 35%

**Tracking:**
- Event: `user_active` (Day 30 after signup)
- Dashboard: Day 30 retention chart, cohort analysis
- Reporting: Monthly retention report, cohort analysis

**Forecasting:**
- Baseline: 20% (Month 1)
- Growth: +1% per month (better retention, value realization)
- Target: 35% (Month 12)

---

### Monthly Active Users (MAU)

**Definition:** Users who have logged in or run an automation in the past 30 days.

**Formula:** `COUNT(DISTINCT user_id) WHERE last_active >= NOW() - INTERVAL '30 days'`

**Targets:**
- Month 1: 50 MAU
- Month 3: 300 MAU
- Month 6: 1,000 MAU
- Month 12: 10,000 MAU

**Tracking:**
- Event: `user_active` (triggered on login or automation run)
- Dashboard: MAU count, trend chart, growth rate
- Reporting: Weekly MAU report, cohort analysis

**Forecasting:**
- Baseline: 50 MAU (Month 1)
- Growth: 2x per quarter (acquisition + retention)
- Target: 10,000 MAU (Month 12)

---

## REVENUE METRICS

### Monthly Recurring Revenue (MRR)

**Definition:** Sum of all active subscription revenue per month.

**Formula:** `SUM(monthly_price) WHERE subscription_status = 'active'`

**Targets:**
- Month 1: $2,500 MRR
- Month 3: $15,000 MRR
- Month 6: $50,000 MRR
- Month 12: $83,333 MRR ($1M ARR)

**Tracking:**
- Source: Stripe subscriptions (monthly_price, status)
- Dashboard: MRR count, trend chart, growth rate
- Reporting: Weekly MRR report, cohort analysis

**Forecasting:**
- Baseline: $2,500 MRR (Month 1: 50 customers @ $49/month)
- Growth: 2x per quarter (acquisition + expansion)
- Target: $83,333 MRR (Month 12: 5,000 customers @ $49/month average)

---

### Annual Recurring Revenue (ARR)

**Definition:** MRR * 12 (annualized recurring revenue).

**Formula:** `MRR * 12`

**Targets:**
- Month 1: $30,000 ARR
- Month 3: $180,000 ARR
- Month 6: $600,000 ARR
- Month 12: $1,000,000 ARR

**Tracking:**
- Calculated: MRR * 12
- Dashboard: ARR count, trend chart, growth rate
- Reporting: Monthly ARR report, forecasting

**Forecasting:**
- Baseline: $30,000 ARR (Month 1)
- Growth: 2x per quarter (acquisition + expansion)
- Target: $1,000,000 ARR (Month 12)

---

### Paid Conversion Rate

**Definition:** Percentage of free users who convert to paid within 30 days.

**Formula:** `(Paid Conversions / Free Signups) * 100`

**Targets:**
- Month 1: > 5%
- Month 3: > 10%
- Month 6: > 15%
- Month 12: > 20%

**Tracking:**
- Event: `subscription_created` (triggered on paid conversion)
- Dashboard: Conversion funnel (free → paid), conversion rate
- Reporting: Weekly conversion report, cohort analysis

**Forecasting:**
- Baseline: 5% (Month 1)
- Growth: +2% per quarter (better value realization, upgrade prompts)
- Target: 20% (Month 12)

---

### Customer Lifetime Value (LTV)

**Definition:** Average revenue per customer over their lifetime.

**Formula:** `Average Monthly Revenue per Customer * Average Customer Lifespan (months)`

**Targets:**
- Month 1: $300 LTV
- Month 3: $400 LTV
- Month 6: $500 LTV
- Month 12: $600 LTV

**Tracking:**
- Calculated: `(Total Revenue / Total Customers) * Average Lifespan`
- Dashboard: LTV chart, cohort analysis
- Reporting: Monthly LTV report, forecasting

**Forecasting:**
- Baseline: $300 LTV (6 months @ $49/month)
- Growth: +$50 per quarter (better retention, expansion)
- Target: $600 LTV (12 months @ $49/month average)

---

### Customer Acquisition Cost (CAC)

**Definition:** Average cost to acquire one paying customer.

**Formula:** `Total Marketing & Sales Spend / New Paying Customers`

**Targets:**
- Month 1: < $100 CAC
- Month 3: < $75 CAC
- Month 6: < $50 CAC
- Month 12: < $40 CAC

**Tracking:**
- Source: Marketing spend (ads, content, tools) + Sales spend (salaries, tools)
- Dashboard: CAC chart, trend analysis
- Reporting: Monthly CAC report, channel analysis

**Forecasting:**
- Baseline: $100 CAC (Month 1: high-touch sales)
- Improvement: -$10 per quarter (better channels, efficiency)
- Target: $40 CAC (Month 12: product-led growth)

---

### LTV:CAC Ratio

**Definition:** Customer lifetime value divided by customer acquisition cost.

**Formula:** `LTV / CAC`

**Targets:**
- Month 1: > 3:1
- Month 3: > 5:1
- Month 6: > 8:1
- Month 12: > 10:1

**Tracking:**
- Calculated: LTV / CAC
- Dashboard: LTV:CAC ratio, trend chart
- Reporting: Monthly LTV:CAC report, forecasting

**Forecasting:**
- Baseline: 3:1 (Month 1: $300 LTV / $100 CAC)
- Growth: +1:1 per quarter (better LTV, lower CAC)
- Target: 10:1 (Month 12: $600 LTV / $40 CAC)

---

### Churn Rate

**Definition:** Percentage of paying customers who cancel per month.

**Formula:** `(Cancelled Customers / Total Paying Customers) * 100`

**Targets:**
- Month 1: < 10%
- Month 3: < 7%
- Month 6: < 5%
- Month 12: < 3%

**Tracking:**
- Event: `subscription_cancelled` (triggered on cancellation)
- Dashboard: Churn rate chart, cohort analysis
- Reporting: Monthly churn report, cancellation reasons

**Forecasting:**
- Baseline: 10% (Month 1: early adopters, product issues)
- Improvement: -1% per quarter (better retention, value realization)
- Target: 3% (Month 12: mature product, strong retention)

---

### Expansion Revenue

**Definition:** Revenue from existing customers (upgrades, add-ons).

**Formula:** `SUM(upgrade_revenue + addon_revenue)`

**Targets:**
- Month 1: 0% of MRR
- Month 3: 5% of MRR
- Month 6: 10% of MRR
- Month 12: 20% of MRR

**Tracking:**
- Event: `subscription_upgraded` (triggered on upgrade)
- Dashboard: Expansion revenue chart, upgrade rate
- Reporting: Monthly expansion report, forecasting

**Forecasting:**
- Baseline: 0% (Month 1: no upgrades)
- Growth: +5% per quarter (better upgrade prompts, features)
- Target: 20% (Month 12: strong expansion)

---

## PRODUCT METRICS

### Workflows Created per User

**Definition:** Average number of workflows created per user.

**Formula:** `Total Workflows Created / Total Users`

**Targets:**
- Month 1: 1.5 workflows/user
- Month 3: 2.5 workflows/user
- Month 6: 3.5 workflows/user
- Month 12: 5+ workflows/user

**Tracking:**
- Event: `workflow_created` (triggered on workflow creation)
- Dashboard: Workflows per user chart, distribution
- Reporting: Weekly workflows report, cohort analysis

**Forecasting:**
- Baseline: 1.5 workflows/user (Month 1)
- Growth: +0.5 per quarter (better templates, onboarding)
- Target: 5+ workflows/user (Month 12)

---

### Automations Run per User

**Definition:** Average number of automations run per user per month.

**Formula:** `Total Automations Run / Total Users / Months`

**Targets:**
- Month 1: 50 automations/user/month
- Month 3: 100 automations/user/month
- Month 6: 200 automations/user/month
- Month 12: 500+ automations/user/month

**Tracking:**
- Event: `automation_run` (triggered on automation execution)
- Dashboard: Automations per user chart, distribution
- Reporting: Weekly automations report, cohort analysis

**Forecasting:**
- Baseline: 50 automations/user/month (Month 1)
- Growth: 2x per quarter (more workflows, better retention)
- Target: 500+ automations/user/month (Month 12)

---

### Error Rate

**Definition:** Percentage of automations that fail.

**Formula:** `(Failed Automations / Total Automations) * 100`

**Targets:**
- Month 1: < 5%
- Month 3: < 3%
- Month 6: < 1%
- Month 12: < 0.5%

**Tracking:**
- Event: `automation_failed` (triggered on automation failure)
- Dashboard: Error rate chart, error types
- Reporting: Weekly error report, error analysis

**Forecasting:**
- Baseline: 5% (Month 1: integration issues, bugs)
- Improvement: -1% per quarter (better error handling, retry logic)
- Target: 0.5% (Month 12: mature product, reliable integrations)

---

### Net Promoter Score (NPS)

**Definition:** Percentage of promoters minus percentage of detractors.

**Formula:** `% Promoters - % Detractors`

**Targets:**
- Month 1: > 30
- Month 3: > 40
- Month 6: > 50
- Month 12: > 60

**Tracking:**
- Survey: NPS survey (post-activation, monthly)
- Dashboard: NPS chart, trend analysis
- Reporting: Monthly NPS report, feedback analysis

**Forecasting:**
- Baseline: 30 (Month 1: early adopters, product issues)
- Growth: +5 per quarter (better product, support)
- Target: 60 (Month 12: mature product, strong satisfaction)

---

## FORECASTING MODELS

### Revenue Forecast (12 Months)

**Assumptions:**
- Starter plan: $49/month
- Pro plan: $149/month
- Free → Paid conversion: 10% (Month 3), 15% (Month 6), 20% (Month 12)
- Churn rate: 10% (Month 1), 7% (Month 3), 5% (Month 6), 3% (Month 12)
- Expansion revenue: 0% (Month 1), 5% (Month 3), 10% (Month 6), 20% (Month 12)

**Forecast:**

| Month | Signups | Paying Customers | MRR | ARR Run Rate |
|-------|---------|------------------|-----|--------------|
| 1 | 500 | 50 | $2,500 | $30,000 |
| 2 | 750 | 100 | $5,000 | $60,000 |
| 3 | 1,500 | 300 | $15,000 | $180,000 |
| 6 | 3,000 | 600 | $30,000 | $360,000 |
| 9 | 6,000 | 1,200 | $60,000 | $720,000 |
| 12 | 10,000 | 2,000 | $100,000 | $1,200,000 |

**Sensitivity Analysis:**
- **Optimistic:** 2x signups, 1.5x conversion = $2M ARR (Month 12)
- **Realistic:** Baseline forecast = $1M ARR (Month 12)
- **Pessimistic:** 0.5x signups, 0.75x conversion = $500K ARR (Month 12)

---

### User Growth Forecast (12 Months)

**Assumptions:**
- Month 1: 500 signups
- Growth rate: 2x per quarter (acquisition + retention)
- Activation rate: 50% (Month 1), 60% (Month 3), 70% (Month 12)
- Retention: 30% Day 7 (Month 1), 40% (Month 3), 50% (Month 12)

**Forecast:**

| Month | Signups | Activated | MAU | MAO |
|-------|---------|-----------|-----|-----|
| 1 | 500 | 250 | 50 | 50 |
| 3 | 3,000 | 1,800 | 300 | 300 |
| 6 | 10,000 | 6,500 | 1,000 | 1,000 |
| 12 | 50,000 | 35,000 | 10,000 | 10,000 |

**Sensitivity Analysis:**
- **Optimistic:** 2x signups, 1.5x activation = 15,000 MAO (Month 12)
- **Realistic:** Baseline forecast = 10,000 MAO (Month 12)
- **Pessimistic:** 0.5x signups, 0.75x activation = 5,000 MAO (Month 12)

---

## DASHBOARD REQUIREMENTS

### Executive Dashboard

**Metrics:**
- North Star: MAO (trend, growth rate)
- Revenue: MRR, ARR, LTV, CAC, LTV:CAC
- Growth: Signups, activations, paid conversions
- Health: Churn rate, NPS, error rate

**Visualizations:**
- MAO trend chart (30-day, 90-day, 365-day)
- Revenue chart (MRR, ARR, growth rate)
- Funnel chart (signup → activation → paid)
- Cohort retention chart

**Frequency:** Daily updates, weekly reports

---

### Product Dashboard

**Metrics:**
- Activation: Activation rate, time-to-activation, funnel
- Retention: Day 1/7/30 retention, MAU, cohort analysis
- Product: Workflows/user, automations/user, error rate
- Engagement: Feature adoption, template usage, community activity

**Visualizations:**
- Activation funnel (signup → integration → workflow → activation)
- Retention curves (Day 1/7/30, cohort analysis)
- Product usage charts (workflows, automations, errors)
- Engagement charts (feature adoption, template usage)

**Frequency:** Daily updates, weekly reports

---

### Revenue Dashboard

**Metrics:**
- MRR: Current MRR, growth rate, trend
- ARR: Current ARR, growth rate, forecast
- Conversion: Paid conversion rate, upgrade rate, expansion revenue
- Unit Economics: LTV, CAC, LTV:CAC, churn rate

**Visualizations:**
- MRR/ARR trend chart (monthly, quarterly, annual)
- Conversion funnel (free → paid, Starter → Pro)
- Unit economics chart (LTV, CAC, LTV:CAC)
- Churn analysis (rate, reasons, cohort)

**Frequency:** Daily updates, weekly reports

---

## ALERTING & MONITORING

### Critical Alerts

**Activation:**
- Activation rate drops below 40% (7-day average)
- Time-to-activation exceeds 72 hours (median)

**Retention:**
- Day 7 retention drops below 30% (7-day average)
- Churn rate exceeds 10% (monthly)

**Revenue:**
- MRR growth rate drops below 10% (month-over-month)
- CAC exceeds LTV (LTV:CAC < 1:1)

**Product:**
- Error rate exceeds 5% (7-day average)
- MAO drops below previous month (month-over-month)

---

**Next Steps:** See `/docs/RISKS_AND_GUARDRAILS.md` for risk monitoring and `/docs/ROADMAP.md` for implementation timeline.
