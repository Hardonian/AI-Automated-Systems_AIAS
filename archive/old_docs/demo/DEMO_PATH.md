# Demo Path — AIAS Platform

**Purpose:** Exact steps to run a "happy path" demo from fresh user to "aha" moment  
**Time:** ~5 minutes  
**Last Updated:** 2025-01-31

---

## Prerequisites

**Before starting demo:**
- ✅ App running locally (`pnpm dev`) OR production URL ready
- ✅ Test account created (or use signup flow)
- ✅ Demo data seeded (if needed)
- ✅ Browser open to app URL

**See:** `demo/DEMO_CHECKLIST.md` for pre-demo checklist.

---

## Demo Flow: Happy Path

### Step 1: Landing Page (30 seconds)

**URL:** `http://localhost:3000` (local) or `https://your-app.vercel.app` (production)

**What to Show:**
- Homepage loads
- Value proposition visible: "Build AI agents and automation workflows that actually work"
- Key features: Visual workflow builder, Canadian integrations, affordable pricing

**What to Say:**
> "AIAS Platform helps Canadian small businesses automate repetitive tasks. Let me show you how Sarah, a Shopify store owner, saves 10 hours per week."

---

### Step 2: Sign Up (1 minute)

**Action:**
1. Click "Sign Up" or "Get Started"
2. Fill in signup form:
   - Email: `demo@example.com` (or use test email)
   - Password: `[secure password]`
   - Name: `Demo User`
3. Click "Create Account"

**What to Show:**
- Signup form loads
- Form validation works
- Account created successfully

**What to Say:**
> "Signup is simple—just email and password. We'll set up your account in seconds."

---

### Step 3: Onboarding (1 minute)

**Action:**
1. Complete onboarding wizard:
   - Step 1: Select use case (e.g., "E-commerce Automation")
   - Step 2: Select integrations (e.g., "Shopify")
   - Step 3: Complete onboarding
2. Click "Get Started" or "Skip" (if you want to go straight to workflow builder)

**What to Show:**
- Onboarding wizard appears
- Steps are clear and easy
- Onboarding completes successfully

**What to Say:**
> "Onboarding takes 2 minutes. We'll help you set up your first workflow."

---

### Step 4: Create First Workflow (2 minutes)

**Action:**
1. Go to workflow builder (or click "Create Workflow")
2. Select template: "Shopify Order Automation" (or create from scratch)
3. Configure workflow:
   - Trigger: "New Shopify Order"
   - Action 1: "Send Confirmation Email"
   - Action 2: "Generate Shipping Label"
   - Action 3: "Update Inventory"
4. Click "Save" or "Activate"

**What to Show:**
- Visual workflow builder loads
- Drag-and-drop interface works
- Workflow created successfully
- Workflow activates

**What to Say:**
> "This is our visual workflow builder. Sarah, a Shopify store owner, uses this to automate order confirmations. She drags, drops, and connects—no coding required. In 30 seconds, she's saved 10 hours per week."

**Aha Moment:** User sees workflow execute successfully (if test order exists) or sees workflow created.

---

### Step 5: View Results (30 seconds)

**Action:**
1. Go to "Workflows" or "Dashboard"
2. View workflow execution (if test data exists)
3. Show metrics: "10 hours saved this week" (if available)

**What to Show:**
- Dashboard loads
- Workflow execution visible (if test data exists)
- Metrics visible (time saved, workflows executed)

**What to Say:**
> "Here's Sarah's dashboard. She's saved 10 hours this week, and her workflows are running automatically. No more manual order processing."

---

## Demo Variations

### Variation 1: Consultant Use Case

**Instead of Shopify automation:**
- Use case: "Proposal Generation"
- Workflow: "New Lead" → "Qualify Lead" → "Generate Proposal" → "Send Proposal"
- **Aha Moment:** Proposal generated automatically

---

### Variation 2: Real Estate Use Case

**Instead of Shopify automation:**
- Use case: "Lead Qualification"
- Workflow: "New Lead" → "Qualify Lead" → "Add to CRM" → "Send Follow-up"
- **Aha Moment:** Lead qualified automatically

---

## Common Issues & Recovery

### Issue: App Not Loading

**Recovery:**
1. Check dev server is running (`pnpm dev`)
2. Check browser console for errors
3. Try production URL if local fails

**Quick Fix:** Restart dev server, clear browser cache

---

### Issue: Signup Fails

**Recovery:**
1. Check Supabase credentials in `.env.local`
2. Check network connection
3. Use test account if signup fails

**Quick Fix:** Use existing test account, skip signup

---

### Issue: Workflow Builder Not Loading

**Recovery:**
1. Check browser console for errors
2. Try different browser (Chrome, Firefox)
3. Use template instead of creating from scratch

**Quick Fix:** Use pre-built template, skip custom workflow

---

## Demo Script

**See:** `demo/DEMO_SCRIPT.md` for founder's script (what to say during demo).

---

## Pre-Demo Checklist

**See:** `demo/DEMO_CHECKLIST.md` for complete pre-demo checklist.

---

## Related Documents

- `demo/DEMO_SCRIPT.md` — Founder's script
- `demo/DEMO_CHECKLIST.md` — Pre-demo checklist
- `docs/SETUP_LOCAL.md` — Local setup guide
- `yc/YC_PRODUCT_OVERVIEW.md` — Product narrative

---

**Last Updated:** 2025-01-31  
**Next Review:** When demo flow changes
