# Stripe Setup Guide — Annual Billing Configuration

**Purpose:** Configure Stripe for annual billing with 20% discount  
**Date:** 2025-01-31

---

## Step 1: Create Annual Price IDs in Stripe Dashboard

### Starter Plan Annual
1. Go to Stripe Dashboard → Products → Starter plan
2. Click "Add another price"
3. Configure:
   - **Price:** $490.00 CAD (or equivalent in USD/EUR)
   - **Billing period:** Yearly
   - **Currency:** CAD (create separate prices for USD, EUR if needed)
4. Copy the Price ID (starts with `price_`)
5. Save as: `STRIPE_STARTER_ANNUAL_PRICE_ID_CAD`

### Pro Plan Annual
1. Go to Stripe Dashboard → Products → Pro plan
2. Click "Add another price"
3. Configure:
   - **Price:** $1,490.00 CAD (or equivalent in USD/EUR)
   - **Billing period:** Yearly
   - **Currency:** CAD (create separate prices for USD, EUR if needed)
4. Copy the Price ID (starts with `price_`)
5. Save as: `STRIPE_PRO_ANNUAL_PRICE_ID_CAD`

---

## Step 2: Update Environment Variables

Add to `.env.local`:

```bash
# Stripe Annual Price IDs
STRIPE_STARTER_ANNUAL_PRICE_ID_CAD=price_xxxxx
STRIPE_STARTER_ANNUAL_PRICE_ID_USD=price_xxxxx
STRIPE_STARTER_ANNUAL_PRICE_ID_EUR=price_xxxxx

STRIPE_PRO_ANNUAL_PRICE_ID_CAD=price_xxxxx
STRIPE_PRO_ANNUAL_PRICE_ID_USD=price_xxxxx
STRIPE_PRO_ANNUAL_PRICE_ID_EUR=price_xxxxx
```

---

## Step 3: Update Pricing Page Component

The pricing page already supports annual pricing display. To enable annual checkout:

1. Update `app/pricing/page.tsx` to pass `billingPeriod` when user selects annual
2. Use annual price IDs when `billingPeriod === "year"`

Example implementation (add to pricing page):

```typescript
// In pricing page component
const handleCheckout = async (plan: Plan, billingPeriod: "month" | "year") => {
  const priceId = billingPeriod === "year" 
    ? plan.annualPriceId 
    : plan.monthlyPriceId;
  
  // Call checkout API with billingPeriod
  const response = await fetch("/api/stripe/create-checkout-app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      priceId,
      userId: currentUser.id,
      tier: plan.tier,
      billingPeriod,
    }),
  });
};
```

---

## Step 4: Test Annual Billing

1. **Test Checkout Flow:**
   - Select Starter plan
   - Choose "Annual" billing
   - Complete checkout
   - Verify subscription is created with annual billing

2. **Verify Discount:**
   - Check Stripe dashboard → Subscriptions
   - Verify amount: $490/year (20% off $588)
   - Verify billing period: Yearly

3. **Test Metadata:**
   - Check subscription metadata includes `billing_period: "year"`
   - Verify analytics events track `billing_period: "year"`

---

## Step 5: Webhook Configuration

Ensure webhook handler (`app/api/stripe/webhook/route.ts`) handles annual subscriptions:

```typescript
// In webhook handler
if (event.type === "checkout.session.completed") {
  const session = event.data.object;
  const billingPeriod = session.metadata?.billingPeriod || "month";
  
  // Store billing period in subscription record
  await supabase
    .from("subscriptions")
    .update({ billing_period: billingPeriod })
    .eq("stripe_subscription_id", session.subscription);
}
```

---

## Multi-Currency Support

For multi-currency support (CAD, USD, EUR):

1. Create separate price IDs for each currency
2. Store price IDs in environment variables by currency
3. Detect user's currency preference (from browser, user settings, or IP)
4. Use appropriate price ID based on currency

Example:
```typescript
const getPriceId = (plan: string, billingPeriod: string, currency: string) => {
  const key = `STRIPE_${plan.toUpperCase()}_${billingPeriod.toUpperCase()}_PRICE_ID_${currency}`;
  return process.env[key];
};
```

---

## Testing Checklist

- [ ] Annual price IDs created in Stripe
- [ ] Environment variables configured
- [ ] Pricing page displays annual pricing correctly
- [ ] Checkout flow works for annual billing
- [ ] Webhook handles annual subscriptions
- [ ] Analytics tracks billing period
- [ ] Discount calculation correct (20% off)
- [ ] Multi-currency support (if applicable)

---

## Support

If you encounter issues:
1. Check Stripe Dashboard → Logs for errors
2. Verify price IDs are correct in environment variables
3. Test with Stripe test mode first
4. Check webhook logs for subscription events
