# Analytics Dashboard Template — AIAS Platform

**Purpose:** Track experiment metrics and business KPIs  
**Based on:** `experiments.yaml` success metrics

---

## Experiment Metrics Dashboard

### Experiment: Price Point Test (Starter Plan)

**Primary Metrics:**
- Signup rate (visitors → signups)
- Trial-to-paid conversion rate
- ARPU (average revenue per user)
- LTV (lifetime value)

**Guardrail Metrics:**
- Activation rate (users who deploy first workflow)
- Support load (tickets per user)
- NPS (Net Promoter Score)
- Churn rate (monthly)

**Success Criteria:**
- Higher price variant should have ≥5% higher ARPU and LTV without reducing signup rate by >20%
- Lower price variant should have ≥20% higher signup rate without reducing ARPU by >10%

**Dashboard Query:**
```sql
SELECT 
  variant,
  COUNT(DISTINCT user_id) as signups,
  COUNT(DISTINCT CASE WHEN subscription_status = 'active' THEN user_id END) as paid_conversions,
  AVG(ARPU) as avg_arpu,
  AVG(LTV) as avg_ltv,
  COUNT(DISTINCT CASE WHEN workflow_deployed = true THEN user_id END) as activated_users,
  AVG(support_tickets) as avg_support_load,
  AVG(nps_score) as avg_nps,
  AVG(churn_rate) as avg_churn_rate
FROM experiment_metrics
WHERE experiment_id = 'exp_price_starter'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY variant;
```

---

### Experiment: Free Tier vs Limited-Time Trial

**Primary Metrics:**
- Signup rate (visitors → signups)
- Free-to-paid conversion rate
- Time to first paid conversion
- ARPU (from converted users)

**Guardrail Metrics:**
- Activation rate (free users who deploy workflow)
- Support load (free users vs paid)
- Churn rate (free users who never convert)

**Success Criteria:**
- Trial variant should have ≥10% higher free-to-paid conversion without reducing signup rate by >15%
- Free tier variant should have ≥30% higher signup rate without reducing conversion by >5%

**Dashboard Query:**
```sql
SELECT 
  variant,
  COUNT(DISTINCT user_id) as signups,
  COUNT(DISTINCT CASE WHEN subscription_status = 'active' THEN user_id END) as paid_conversions,
  AVG(CASE WHEN subscription_status = 'active' THEN days_to_conversion END) as avg_days_to_conversion,
  AVG(ARPU) as avg_arpu,
  COUNT(DISTINCT CASE WHEN workflow_deployed = true THEN user_id END) as activated_users,
  AVG(support_tickets) as avg_support_load,
  AVG(churn_rate) as avg_churn_rate
FROM experiment_metrics
WHERE experiment_id = 'exp_free_tier'
  AND date >= CURRENT_DATE - INTERVAL '60 days'
GROUP BY variant;
```

---

### Experiment: Value Metric Presentation

**Primary Metrics:**
- Pricing page engagement (time on page, scroll depth)
- Signup rate (from pricing page)
- Trial-to-paid conversion
- Feature usage (agents vs automations)

**Guardrail Metrics:**
- Support questions about pricing
- Bounce rate from pricing page

**Success Criteria:**
- Outcome-focused variant should have ≥10% higher engagement and conversion
- Agent-focused variant should align with product usage patterns

**Dashboard Query:**
```sql
SELECT 
  variant,
  AVG(time_on_page) as avg_time_on_page,
  AVG(scroll_depth) as avg_scroll_depth,
  COUNT(DISTINCT CASE WHEN event = 'PlanSelected' THEN user_id END) as plan_selections,
  COUNT(DISTINCT CASE WHEN subscription_status = 'active' THEN user_id END) as conversions,
  AVG(agents_used) as avg_agents_used,
  AVG(automations_executed) as avg_automations_executed,
  COUNT(DISTINCT CASE WHEN event = 'SupportQuestion' AND topic = 'pricing' THEN user_id END) as pricing_questions,
  AVG(bounce_rate) as avg_bounce_rate
FROM experiment_metrics
WHERE experiment_id = 'exp_value_metric'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY variant;
```

---

### Experiment: Annual Discount Test

**Primary Metrics:**
- Annual signup rate (% of signups choosing annual)
- Cash flow (upfront revenue)
- Churn rate (annual vs monthly)
- LTV (annual customers)

**Guardrail Metrics:**
- Refund requests (annual customers)
- Support load

**Success Criteria:**
- 20% discount should drive ≥30% annual signup rate
- 10% discount should preserve ≥15% more revenue while still driving ≥20% annual signup rate

**Dashboard Query:**
```sql
SELECT 
  variant,
  COUNT(DISTINCT CASE WHEN billing_period = 'year' THEN user_id END) as annual_signups,
  COUNT(DISTINCT user_id) as total_signups,
  (COUNT(DISTINCT CASE WHEN billing_period = 'year' THEN user_id END)::float / 
   NULLIF(COUNT(DISTINCT user_id), 0) * 100) as annual_signup_rate,
  SUM(CASE WHEN billing_period = 'year' THEN upfront_revenue ELSE 0 END) as upfront_revenue,
  AVG(CASE WHEN billing_period = 'year' THEN churn_rate END) as annual_churn_rate,
  AVG(CASE WHEN billing_period = 'month' THEN churn_rate END) as monthly_churn_rate,
  AVG(CASE WHEN billing_period = 'year' THEN LTV END) as avg_annual_ltv,
  COUNT(DISTINCT CASE WHEN refund_requested = true THEN user_id END) as refund_requests,
  AVG(support_tickets) as avg_support_load
FROM experiment_metrics
WHERE experiment_id = 'exp_annual_discount'
  AND date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY variant;
```

---

### Experiment: Onboarding Test

**Primary Metrics:**
- Activation rate (users who deploy first workflow)
- Time to activation (days from signup)
- Trial-to-paid conversion
- ARPU (from onboarded users)

**Guardrail Metrics:**
- Support load (onboarding calls)
- Sales capacity (calls per week)
- NPS (from onboarded users)

**Success Criteria:**
- Done-for-you variant should have ≥20% higher activation and ≥15% higher conversion
- Hybrid variant should optimize for Pro conversions without overwhelming sales capacity

**Dashboard Query:**
```sql
SELECT 
  variant,
  COUNT(DISTINCT CASE WHEN workflow_deployed = true THEN user_id END) as activated_users,
  COUNT(DISTINCT user_id) as total_users,
  (COUNT(DISTINCT CASE WHEN workflow_deployed = true THEN user_id END)::float / 
   NULLIF(COUNT(DISTINCT user_id), 0) * 100) as activation_rate,
  AVG(days_to_activation) as avg_days_to_activation,
  COUNT(DISTINCT CASE WHEN subscription_status = 'active' THEN user_id END) as conversions,
  AVG(ARPU) as avg_arpu,
  COUNT(DISTINCT CASE WHEN onboarding_call_scheduled = true THEN user_id END) as onboarding_calls,
  AVG(nps_score) as avg_nps
FROM experiment_metrics
WHERE experiment_id = 'exp_onboarding'
  AND date >= CURRENT_DATE - INTERVAL '60 days'
GROUP BY variant;
```

---

### Experiment: Feature Gating Test

**Primary Metrics:**
- Starter vs Pro signup mix
- Starter-to-Pro upgrade rate
- ARPU (weighted average)
- Feature usage (which features drive upgrades)

**Guardrail Metrics:**
- Starter churn rate
- Support questions about feature limits

**Success Criteria:**
- Restrictive Starter should drive ≥10% Starter-to-Pro upgrades without increasing Starter churn by >5%
- Generous Starter should increase Starter signups by ≥20% without reducing Pro signups by >10%

**Dashboard Query:**
```sql
SELECT 
  variant,
  COUNT(DISTINCT CASE WHEN plan = 'starter' THEN user_id END) as starter_signups,
  COUNT(DISTINCT CASE WHEN plan = 'pro' THEN user_id END) as pro_signups,
  COUNT(DISTINCT CASE WHEN plan = 'starter' AND upgraded_to_pro = true THEN user_id END) as starter_to_pro_upgrades,
  (COUNT(DISTINCT CASE WHEN plan = 'starter' AND upgraded_to_pro = true THEN user_id END)::float / 
   NULLIF(COUNT(DISTINCT CASE WHEN plan = 'starter' THEN user_id END), 0) * 100) as upgrade_rate,
  AVG(ARPU) as weighted_avg_arpu,
  AVG(CASE WHEN plan = 'starter' THEN churn_rate END) as starter_churn_rate,
  COUNT(DISTINCT CASE WHEN support_topic = 'feature_limits' THEN user_id END) as feature_limit_questions
FROM experiment_metrics
WHERE experiment_id = 'exp_feature_gating'
  AND date >= CURRENT_DATE - INTERVAL '60 days'
GROUP BY variant;
```

---

## Business Metrics Dashboard

### Revenue Metrics
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- Revenue Growth (MoM, YoY)

### Customer Metrics
- Total Customers
- New Customers (this month)
- Churned Customers (this month)
- Churn Rate
- Customer Lifetime Value (LTV)

### Conversion Metrics
- Trial-to-Paid Conversion Rate (target: 10%)
- Visitor-to-Trial Conversion Rate
- Visitor-to-Paid Conversion Rate

### Activation Metrics
- Activation Rate (users who deploy first workflow)
- Time to Activation (target: <24 hours)
- Workflows per Active User

### Engagement Metrics
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Average Session Duration
- Workflows Executed per User

---

## Implementation Notes

1. **Data Collection:** Use `ExperimentTracker` from `lib/experiments/tracking.ts` to track events
2. **Storage:** Store events in `analytics_events` table in Supabase
3. **Visualization:** Use tools like Metabase, Retool, or custom React dashboard
4. **Alerts:** Set up alerts for guardrail metrics (churn >10%, NPS <30)
5. **Reporting:** Weekly experiment dashboards, monthly business reviews

---

## Next Steps

1. Set up database tables for experiment metrics
2. Implement event tracking in pricing page and checkout flow
3. Create dashboard visualization (Metabase/Retool/custom)
4. Set up alerts for guardrail metrics
5. Schedule weekly experiment reviews
