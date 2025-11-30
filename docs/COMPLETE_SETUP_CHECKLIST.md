# Complete Setup Checklist — AIAS Platform Revenue System

**Founder:** Scott Hardie  
**Date:** 2025-01-31  
**Status:** Ready for Launch

---

## ✅ Completed (Automated)

### 1. Pricing System
- [x] Pricing page updated with exact copy from `pricing_models.yaml`
- [x] Annual pricing display (20% discount) integrated
- [x] Analytics tracking component added
- [x] Feature flag system implemented

### 2. Analytics & Tracking
- [x] Experiment tracking system created (`lib/experiments/tracking.ts`)
- [x] Feature flag system implemented (`lib/experiments/feature-flags.ts`)
- [x] Analytics component for pricing page
- [x] API endpoint for variant assignment

### 3. Stripe Integration
- [x] Annual billing support added to checkout API
- [x] Metadata tracking for billing period

### 4. Investor Materials
- [x] Investor deck created (`docs/investor-deck.md`)
- [x] Team information populated (Scott Hardie)
- [x] Q&A bank ready

### 5. Marketing Assets
- [x] One-pager created (`docs/marketing/one-pager.md`)
- [x] Email templates created (`docs/marketing/email-templates.md`)
- [x] Founder information populated

---

## 🔧 Manual Setup Required

### Step 1: Stripe Configuration (15 minutes)

**Action Items:**
1. [ ] Log into Stripe Dashboard
2. [ ] Create annual price IDs:
   - Starter annual: $490/year CAD
   - Pro annual: $1,490/year CAD
   - (Optional: USD, EUR versions)
3. [ ] Add price IDs to `.env.local`:
   ```bash
   STRIPE_STARTER_ANNUAL_PRICE_ID_CAD=price_xxxxx
   STRIPE_PRO_ANNUAL_PRICE_ID_CAD=price_xxxxx
   ```
4. [ ] Test annual checkout flow
5. [ ] Verify webhook handles annual subscriptions

**Reference:** `docs/stripe-setup-guide.md`

---

### Step 2: Database Setup (10 minutes)

**Action Items:**
1. [ ] Run migration: `supabase/migrations/20250131000000_analytics_events.sql`
   ```bash
   # Via Supabase CLI
   supabase db push
   
   # Or via Supabase Dashboard → SQL Editor
   # Copy/paste SQL from migration file
   ```
2. [ ] Verify table created: `analytics_events`
3. [ ] Verify indexes created
4. [ ] Test event insertion:
   ```sql
   INSERT INTO analytics_events (event_name, properties, variant, experiment_id)
   VALUES ('TestEvent', '{}', 'control', 'test');
   ```

**Reference:** Migration file includes all SQL needed

---

### Step 3: Analytics Tool Setup (20 minutes)

**Choose one:**
- [ ] **Option A: Mixpanel** (recommended for experiments)
  - Sign up at mixpanel.com
  - Create project: "AIAS Platform"
  - Get API key
  - Add to `.env.local`: `MIXPANEL_TOKEN=xxx`
  - Update `lib/experiments/tracking.ts` to send to Mixpanel

- [ ] **Option B: PostHog** (open source, self-hosted option)
  - Sign up at posthog.com
  - Create project
  - Get API key
  - Add to `.env.local`: `POSTHOG_API_KEY=xxx`
  - Update tracking to send to PostHog

- [ ] **Option C: Amplitude** (enterprise option)
  - Sign up at amplitude.com
  - Create project
  - Get API key
  - Add to `.env.local`: `AMPLITUDE_API_KEY=xxx`

**Action Items:**
1. [ ] Sign up for analytics tool
2. [ ] Get API key
3. [ ] Add to environment variables
4. [ ] Update `lib/experiments/tracking.ts` to send events
5. [ ] Test event tracking on pricing page

---

### Step 4: Enable Phase 1 Experiments (5 minutes)

**Action Items:**
1. [ ] Run script: `pnpm tsx scripts/enable-phase1-experiments.ts`
   ```bash
   pnpm tsx scripts/enable-phase1-experiments.ts
   ```
2. [ ] Verify experiments enabled:
   - `exp_value_metric` ✅
   - `exp_annual_discount` ✅ (already enabled)
   - `exp_feature_gating` ✅
3. [ ] Check feature flags: Visit `/api/experiments/variant?experimentId=exp_value_metric`

**Reference:** `scripts/enable-phase1-experiments.ts`

---

### Step 5: Update Pricing Page for Annual Billing (30 minutes)

**Action Items:**
1. [ ] Add billing period toggle to pricing page
2. [ ] Update checkout flow to use annual price IDs when selected
3. [ ] Test annual checkout end-to-end
4. [ ] Verify analytics tracks billing period

**Code Example:**
```typescript
// Add to pricing page
const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");

// Update checkout handler
const handleCheckout = async (plan: Plan) => {
  const priceId = billingPeriod === "year" 
    ? plan.annualPriceId 
    : plan.monthlyPriceId;
  // ... rest of checkout logic
};
```

---

### Step 6: Create Analytics Dashboard (1-2 hours)

**Option A: Metabase (Recommended)**
1. [ ] Install Metabase (Docker or cloud)
2. [ ] Connect to Supabase database
3. [ ] Create dashboards using SQL from `docs/analytics-dashboard-template.md`
4. [ ] Set up alerts for guardrail metrics

**Option B: Custom React Dashboard**
1. [ ] Create dashboard page: `app/admin/experiments/page.tsx`
2. [ ] Use SQL queries from `docs/analytics-dashboard-template.md`
3. [ ] Visualize with charts (recharts, chart.js)
4. [ ] Add filters for date range, experiment, variant

**Option C: Retool**
1. [ ] Sign up at retool.com
2. [ ] Connect to Supabase
3. [ ] Build dashboards using queries from template

---

### Step 7: Investor Deck Customization (1 hour)

**Action Items:**
1. [ ] Convert `docs/investor-deck.md` to slides (PowerPoint/Google Slides)
2. [ ] Add Scott's photo and LinkedIn profile
3. [ ] Add Hardonian Industries logo/branding
4. [ ] Customize traction metrics (when available)
5. [ ] Practice pitch with Q&A bank
6. [ ] Schedule 5 intro calls

**Reference:** `docs/investor-deck.md`, `investor_narrative.yaml`

---

### Step 8: Marketing Assets Customization (30 minutes)

**Action Items:**
1. [ ] Update one-pager with actual metrics (when available)
2. [ ] Customize email templates with Scott's contact info
3. [ ] Add company logo to assets
4. [ ] Create PDF versions of one-pager
5. [ ] Set up email signature with founder info

**Reference:** `docs/marketing/one-pager.md`, `docs/marketing/email-templates.md`

---

## 📊 Monitoring & Optimization

### Week 1 Checklist
- [ ] Monitor analytics dashboard daily
- [ ] Check guardrail metrics (churn, NPS, support load)
- [ ] Review experiment results
- [ ] Fix any tracking issues

### Week 2-4 Checklist
- [ ] Analyze Phase 1 experiment results
- [ ] Decide on winning variants
- [ ] Prepare Phase 2 experiments
- [ ] Optimize pricing page based on learnings

### Month 2-3 Checklist
- [ ] Enable Phase 2 experiments (price point, free tier)
- [ ] Monitor conversion rates
- [ ] Optimize onboarding flow
- [ ] Prepare for Series A

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] Stripe configured (annual prices)
- [ ] Database migrations run
- [ ] Analytics tool connected
- [ ] Phase 1 experiments enabled
- [ ] Pricing page tested
- [ ] Checkout flow tested

### Launch Day
- [ ] Enable experiments
- [ ] Monitor analytics dashboard
- [ ] Check for errors in logs
- [ ] Verify events are tracking
- [ ] Test checkout flow

### Post-Launch (Week 1)
- [ ] Daily monitoring of metrics
- [ ] Weekly experiment review
- [ ] Fix any issues
- [ ] Optimize based on data

---

## 📞 Support & Resources

**Founder Contact:**
- Scott Hardie
- Email: inquiries@aiautomatedsystems.ca
- LinkedIn: [scottrmhardie](https://www.linkedin.com/in/scottrmhardie)
- GitHub: [shardie-github](https://github.com/shardie-github)

**Documentation:**
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `docs/stripe-setup-guide.md` - Stripe configuration
- `docs/analytics-dashboard-template.md` - Dashboard setup
- `product_revenue_storyboard.md` - Master blueprint

**Key Files:**
- `pricing_models.yaml` - Pricing strategy
- `investor_narrative.yaml` - Investor narrative & Q&A
- `experiments.yaml` - Experiment definitions
- `pitch_assets.yaml` - Pitch materials

---

## ✅ Status

**Completed:** All automated setup ✅  
**Remaining:** Manual configuration (Steps 1-8)  
**Estimated Time:** 4-6 hours total

**Next Action:** Start with Step 1 (Stripe Configuration)

---

**Last Updated:** 2025-01-31
