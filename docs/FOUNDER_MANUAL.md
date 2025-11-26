# Founder Manual — AIAS Platform

**Purpose:** Step-by-step guide for founders (non-technical friendly)  
**Last Updated:** 2025-01-31  
**Status:** Living Document

---

## Section 1: MUST DO NOW (Blockers)

### 1.1 Get App Running Locally

**Why:** You need to see the app working before you can demo it or fix issues.

**Steps:**
1. **Clone repo:**
   ```bash
   git clone https://github.com/your-org/aias-platform.git
   cd aias-platform
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   **If this fails:** See [Troubleshooting](#troubleshooting)

3. **Get Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Create account (free)
   - Create new project
   - Wait 2 minutes for provisioning
   - Go to Settings → API
   - Copy: Project URL, Anon key, Service role key
   - Go to Settings → General
   - Copy: Project Reference

4. **Set up environment:**
   ```bash
   cp .env.example .env.local
   ```
   - Open `.env.local` in text editor
   - Fill in Supabase credentials (from step 3)
   - Save file

5. **Start dev server:**
   ```bash
   pnpm dev
   ```

6. **Open browser:**
   - Go to `http://localhost:3000`
   - You should see the homepage

**✅ Success Criteria:** Homepage loads without errors

**📚 More Details:** See [Local Setup Guide](./SETUP_LOCAL.md)

---

### 1.2 Get First Paying Customer

**Why:** YC wants to see traction. No customers = no traction.

**Steps:**
1. **Deploy to production:**
   - See [Deployment Guide](./DEPLOYMENT.md)
   - Get production URL (e.g., `https://your-app.vercel.app`)

2. **Test signup flow:**
   - Go to production URL
   - Sign up for account
   - Complete onboarding
   - Verify everything works

3. **Get first customer:**
   - Reach out to 10 potential customers (friends, network, LinkedIn)
   - Offer free trial or discount
   - Get at least 1 paying customer ($49/month starter plan)

4. **Document customer:**
   - Add customer count to `yc/YC_INTERVIEW_CHEATSHEET.md`
   - Get testimonial (if possible)
   - Document use case

**✅ Success Criteria:** At least 1 paying customer, documented in cheatsheet

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 1

---

### 1.3 Start Tracking Metrics

**Why:** YC asks "What are your numbers?" You need real data.

**Steps:**
1. **Check metrics dashboard:**
   - Go to `http://localhost:3000/admin/metrics` (or production URL)
   - See what metrics are tracked

2. **Get real numbers:**
   - If you have users: Run queries to get actual metrics
   - If no users: Launch MVP and start tracking

3. **Document metrics:**
   - Open `yc/YC_INTERVIEW_CHEATSHEET.md`
   - Add section: "Current Metrics"
   - Fill in: MRR, DAU, activation rate, retention (or "0" if no users)

**✅ Success Criteria:** Metrics documented in cheatsheet (even if zeros)

**📚 More Details:** See `yc/YC_METRICS_CHECKLIST.md`

---

### 1.4 Create Team Page

**Why:** YC asks "Who are the founders?" You need to show this.

**Steps:**
1. **Create team page:**
   - File: `app/about/page.tsx` (or create `/team` page)
   - Add founder names, photos, LinkedIn profiles
   - Add brief bios (why you're building this)

2. **Update YC docs:**
   - Open `yc/YC_TEAM_NOTES.md`
   - Add actual founder information
   - Update `yc/YC_INTERVIEW_CHEATSHEET.md` with team story

**✅ Success Criteria:** Team page exists, founder bios documented

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 9

---

## Section 2: DO THIS SOON (NEXT)

### 2.1 Create Comparison Table

**Why:** YC asks "What makes you different?" You need a clear answer.

**Steps:**
1. **Create comparison page:**
   - File: `app/compare/page.tsx`
   - Compare: AIAS vs. Zapier vs. Make
   - Highlight: Canadian-first, affordable pricing, visual builder

2. **Add to cheatsheet:**
   - Open `yc/YC_INTERVIEW_CHEATSHEET.md`
   - Add "What's Different" section
   - Practice 30-second answer

**✅ Success Criteria:** Comparison page exists, answer practiced

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 2

---

### 2.2 Track Marketing Spend

**Why:** YC asks "What's your CAC?" You need to know customer acquisition cost.

**Steps:**
1. **Track marketing channels:**
   - Google Ads: Track spend in Google Ads dashboard
   - Facebook Ads: Track spend in Facebook Ads Manager
   - Content marketing: Track time/costs (tools, freelancers)

2. **Calculate CAC:**
   - CAC = Marketing Spend / New Customers
   - Calculate by channel (Google Ads CAC, Facebook Ads CAC, etc.)

3. **Document:**
   - Add to `yc/YC_INTERVIEW_CHEATSHEET.md`
   - Update `yc/YC_METRICS_CHECKLIST.md`

**✅ Success Criteria:** CAC calculated and documented

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 5

---

### 2.3 Test Distribution Channels

**Why:** YC asks "How do you get users?" You need to know what works.

**Steps:**
1. **Test channels:**
   - Shopify App Store: Submit app (if applicable)
   - SEO: Create 5-10 landing pages, track organic traffic
   - Referrals: Enable referral system, track referrals
   - Paid ads: Run small test campaigns

2. **Track results:**
   - Signups by channel (use UTM parameters)
   - Conversion rates (signup → paying)
   - CAC by channel

3. **Document:**
   - Update `yc/YC_DISTRIBUTION_PLAN.md` with results
   - Add to `yc/YC_INTERVIEW_CHEATSHEET.md`

**✅ Success Criteria:** At least 2 channels tested, results documented

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 7

---

### 2.4 Create Financial Model

**Why:** YC asks "What's your runway? How much do you need?"

**Steps:**
1. **Create financial projections:**
   - Revenue: Based on signup growth (e.g., 10 customers/month → $490 MRR)
   - Costs: Infrastructure ($50/month), AI APIs ($100/month), salaries (if any)
   - Runway: How many months until you run out of money?

2. **Create fundraising plan:**
   - How much: $500K? $1M?
   - When: 6 months? 12 months?
   - Why: Hire team, scale marketing, etc.

3. **Document:**
   - Create `yc/FINANCIAL_PROJECTIONS.md`
   - Create `yc/FUNDRAISING_PLAN.md`
   - Add to `yc/YC_INTERVIEW_CHEATSHEET.md`

**✅ Success Criteria:** Financial model and fundraising plan documented

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 11

---

## Section 3: NICE TO HAVE LATER

### 3.1 Create Case Studies

**Why:** Shows customer success (if you have customers).

**Steps:**
1. **If you have customers:**
   - Interview customers (get their stories)
   - Create case studies: `app/case-studies/page.tsx`
   - Add testimonials to landing page

2. **If no customers:**
   - Create demo videos (show product in action)
   - Use persona stories (Sarah, Mike, Jessica)

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 3

---

### 3.2 Create Changelog

**Why:** Shows execution velocity.

**Steps:**
1. **Create changelog:**
   - File: `CHANGELOG.md`
   - Document recent features shipped
   - Show shipping velocity (features per week/month)

2. **Keep it updated:**
   - Add entry for each release
   - Include user impact

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` Gap 10

---

### 3.3 Build SEO Landing Pages

**Why:** Drives organic traffic.

**Steps:**
1. **Create landing pages:**
   - File: `app/seo/[keyword]/page.tsx`
   - Keywords: "Shopify automation Canada", "Canadian business automation", etc.
   - Track organic traffic and conversions

2. **Optimize:**
   - Add meta tags, structured data
   - Create quality content
   - Build backlinks

**📚 More Details:** See `yc/YC_GAP_ANALYSIS.md` (500 Global Lens)

---

## Section 4: Quick Reference

### Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check code quality
pnpm typecheck        # Check TypeScript types
pnpm test             # Run tests

# Database
pnpm regenerate-types # Regenerate Supabase types
pnpm db:validate-schema # Validate database schema

# Deployment
# See docs/DEPLOYMENT.md for deployment commands
```

### Key Files

| File | Purpose |
|------|---------|
| `docs/SETUP_LOCAL.md` | Local setup guide |
| `docs/DEPLOYMENT.md` | Production deployment |
| `yc/YC_GAP_ANALYSIS.md` | Gap analysis and TODOs |
| `yc/YC_INTERVIEW_CHEATSHEET.md` | YC interview prep |
| `yc/YC_METRICS_CHECKLIST.md` | Metrics to track |
| `.env.local` | Environment variables (local) |
| `.env.example` | Environment variables template |

### Key URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Local dev server |
| `https://your-app.vercel.app` | Production URL |
| `https://supabase.com` | Supabase dashboard |
| `https://vercel.com` | Vercel dashboard |
| `http://localhost:3000/admin/metrics` | Metrics dashboard (local) |

### Common Tasks

**Add new feature:**
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test locally: `pnpm dev`
4. Commit: `git commit -m "feat: add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create PR on GitHub

**Deploy to production:**
- Push to `main` branch → Automatic deployment via GitHub Actions
- See [Deployment Guide](./DEPLOYMENT.md) for details

**Update metrics:**
1. Go to metrics dashboard: `http://localhost:3000/admin/metrics`
2. Get real numbers (if users exist)
3. Update `yc/YC_INTERVIEW_CHEATSHEET.md`

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Dependencies Installation Fails

```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Environment Variables Not Loading

1. Check `.env.local` exists (not `.env`)
2. Restart dev server
3. Verify variable names match exactly (case-sensitive)

### Database Connection Fails

1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is active
3. Verify `DATABASE_URL` format is correct

---

## Getting Help

- **Setup Issues:** See [Local Setup Guide](./SETUP_LOCAL.md)
- **Deployment Issues:** See [Deployment Guide](./DEPLOYMENT.md)
- **YC Prep:** See `yc/YC_INTERVIEW_CHEATSHEET.md`
- **Gaps/TODOs:** See `yc/YC_GAP_ANALYSIS.md`

---

**Last Updated:** 2025-01-31  
**Next Review:** Weekly (or when gaps are closed)
