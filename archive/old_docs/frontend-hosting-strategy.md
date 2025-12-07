# Frontend Hosting Strategy

**Last Updated:** 2025-01-XX  
**Hosting Platform:** Vercel  
**Status:** ✅ Confirmed and Configured

---

## Executive Summary

**Canonical Hosting:** Vercel  
**Deployment Method:** GitHub Actions → Vercel CLI  
**Preview Deployments:** Enabled for Pull Requests  
**Production Deployments:** Automatic on `main` branch  

---

## Why Vercel?

### Advantages

1. **Next.js Native:** Built by the Next.js team, optimized for Next.js apps
2. **Zero Configuration:** Automatic builds, deployments, and previews
3. **Edge Network:** Global CDN with edge functions
4. **Serverless Functions:** Built-in support for API routes
5. **Preview Deployments:** Automatic preview URLs for every PR
6. **CI/CD Integration:** Works seamlessly with GitHub Actions
7. **Free Tier:** Generous free tier for MVP/demo
8. **Developer Experience:** Excellent dashboard, logs, analytics

### Cost Analysis

**Free Tier (Hobby):**
- Unlimited personal projects
- 100GB bandwidth/month
- 100GB-hours serverless function execution
- Automatic SSL certificates
- Preview deployments
- **Cost: $0/month**

**Pro Tier ($20/month):**
- Team collaboration
- Password protection for previews
- Advanced analytics
- More bandwidth (1TB)
- **Cost: $20/month per team**

**Enterprise Tier:**
- Custom pricing
- Dedicated support
- SLA guarantees
- **Cost: Custom**

**Recommendation:** Free tier is sufficient for MVP/demo. Upgrade to Pro when team collaboration is needed.

---

## Deployment Architecture

### Current Setup

```
┌─────────────────────────────────────────┐
│         GitHub Repository               │
│  (Source of Truth)                      │
└──────────────┬──────────────────────────┘
               │
               │ Push / PR
               ▼
┌─────────────────────────────────────────┐
│      GitHub Actions (CI/CD)             │
│  ┌────────────────────────────────────┐  │
│  │ 1. Checkout code                  │  │
│  │ 2. Setup Node.js + pnpm           │  │
│  │ 3. Install dependencies           │  │
│  │ 4. Lint + Typecheck + Test        │  │
│  │ 5. Build Next.js                  │  │
│  │ 6. Deploy to Vercel               │  │
│  └────────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               │ Vercel CLI
               ▼
┌─────────────────────────────────────────┐
│           Vercel Platform               │
│  ┌────────────────────────────────────┐  │
│  │ • Preview (PRs)                    │  │
│  │ • Production (main branch)          │  │
│  │ • Edge Network (CDN)               │  │
│  │ • Serverless Functions             │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Deployment Workflows

### Primary Workflow: `frontend-deploy.yml`

**Triggers:**
- Pull Requests (any branch)
- Push to `main` branch
- Manual (`workflow_dispatch`)

**Jobs:**

1. **`build-and-test`**
   - Lint, typecheck, test
   - Build Next.js application
   - Upload build artifacts

2. **`deploy`**
   - Download build artifacts
   - Pull Vercel environment
   - Build for Vercel
   - Deploy (preview or production)
   - Comment preview URL on PR

**Status:** ✅ Active and working

### Redundant Workflows (To Remove)

1. **`deploy-main.yml`**
   - Similar to `frontend-deploy.yml` but also runs migrations
   - **Action:** Consolidate migration step into `frontend-deploy.yml` or keep separate

2. **`auto-deploy-vercel.yml`**
   - Duplicate functionality
   - Uses different Vercel action (`amondnet/vercel-action`)
   - **Action:** Remove (use `frontend-deploy.yml` instead)

3. **`preview-pr.yml`**
   - Currently disabled (only runs on `workflow_dispatch`)
   - **Action:** Enable for PRs or remove

**Recommendation:** Keep `frontend-deploy.yml` as primary, remove duplicates.

---

## Preview Deployments

### Current State

**Status:** ⚠️ Partially Enabled

**Workflow:** `frontend-deploy.yml`
- ✅ Deploys previews for PRs
- ✅ Comments preview URL on PR
- ✅ Uses Vercel preview environment

**Workflow:** `preview-pr.yml`
- ⚠️ Disabled (only manual trigger)
- Includes Lighthouse and accessibility checks
- **Recommendation:** Enable for PRs or consolidate into `frontend-deploy.yml`

### Preview URL Format

```
https://{project-name}-{hash}.vercel.app
```

**Example:**
```
https://aias-platform-git-feature-branch-username.vercel.app
```

### Preview Features

- ✅ Automatic deployment on PR open/update
- ✅ Isolated environment (separate from production)
- ✅ Environment variables from Vercel dashboard
- ✅ Preview-specific config (e.g., `NEXT_PUBLIC_VERCEL_ENV=preview`)
- ⚠️ Password protection (Pro tier only)

---

## Production Deployments

### Current State

**Status:** ✅ Enabled

**Trigger:** Push to `main` branch

**Workflow:** `frontend-deploy.yml`
- Builds and tests before deployment
- Deploys to Vercel production environment
- Uses production environment variables

### Production URL

**Custom Domain:** Configured in Vercel dashboard
- Example: `https://aias-platform.com`

**Vercel Domain:** Automatic
- Example: `https://aias-platform.vercel.app`

---

## Environment Variables

### Vercel Environment Variables

**Setup:** Vercel Dashboard → Settings → Environment Variables

**Categories:**
1. **Production:** Used in production deployments
2. **Preview:** Used in preview deployments
3. **Development:** Used in local development (via Vercel CLI)

**Current Variables (from `.env.example`):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- And 50+ more...

**CI Integration:**
- Variables pulled via `vercel pull` in CI
- No hardcoded values in workflows
- Secrets stored in GitHub Secrets (for CI) and Vercel (for deployments)

---

## Build Configuration

### Next.js Config

**File:** `next.config.ts`

**Key Settings:**
- React Strict Mode: Enabled
- Image Optimization: AVIF/WebP formats
- Security Headers: Comprehensive CSP, HSTS, etc.
- Bundle Optimization: Code splitting, tree shaking
- Compression: Enabled

### Build Process

1. **Install Dependencies:** `pnpm install --frozen-lockfile`
2. **Lint:** `pnpm lint`
3. **Typecheck:** `pnpm typecheck`
4. **Test:** `pnpm test -- --run`
5. **Build:** `pnpm build`
6. **Deploy:** `vercel deploy --prebuilt`

**Build Time:** ~3-5 minutes (typical)

---

## Performance Optimization

### Current Optimizations

1. **Code Splitting:** Automatic via Next.js
2. **Image Optimization:** Next.js Image component
3. **Bundle Analysis:** Available via `pnpm build:analyze`
4. **CDN:** Vercel Edge Network (global)
5. **Caching:** Automatic static asset caching

### Monitoring

**Vercel Analytics:**
- Page views
- Performance metrics
- Web Vitals (LCP, FID, CLS)

**Custom Monitoring:**
- Web Vitals tracking (`components/performance/WebVitalsTracker.tsx`)
- Performance beacons (`components/performance-beacon.tsx`)
- Custom telemetry (`lib/monitoring/telemetry-provider.tsx`)

---

## Rollback Strategy

### Vercel Rollback

**Method 1: Vercel Dashboard**
1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

**Method 2: Vercel CLI**
```bash
vercel rollback [deployment-url]
```

**Method 3: Git Revert**
1. Revert commit in Git
2. Push to `main`
3. New deployment automatically created

**Recommendation:** Document rollback procedure in ops docs.

---

## Security

### Current Security Measures

1. **HTTPS:** Automatic SSL certificates
2. **Security Headers:** Comprehensive headers in `next.config.ts` and `middleware.ts`
3. **Environment Variables:** Secure storage in Vercel
4. **Preview Protection:** Can enable password protection (Pro tier)
5. **Access Control:** Vercel Access Controls for team members

### Recommendations

1. **Enable Preview Protection:** Password protect preview deployments (Pro tier)
2. **Review Access Controls:** Ensure only authorized team members can deploy
3. **Monitor Deployments:** Set up alerts for failed deployments
4. **Backup Strategy:** Ensure database backups are independent of Vercel

---

## Cost Optimization

### Current Costs

**Free Tier:**
- Hosting: $0/month
- Bandwidth: 100GB/month (free)
- Functions: 100GB-hours/month (free)

### When to Upgrade

**Pro Tier ($20/month):**
- Team collaboration needed
- Password protection for previews
- Advanced analytics required
- More bandwidth needed (>100GB/month)

**Enterprise Tier:**
- High traffic (>1TB bandwidth/month)
- SLA requirements
- Dedicated support needed

### Cost Monitoring

**Vercel Dashboard:**
- Bandwidth usage
- Function execution time
- Storage usage

**Recommendation:** Monitor usage monthly, upgrade when approaching limits.

---

## Alternative Hosting Options

### If Vercel Becomes Unviable

**Option 1: Netlify**
- Similar to Vercel
- Good Next.js support
- Free tier available
- **Migration:** Straightforward (similar setup)

**Option 2: Self-Hosted (Docker)**
- Full control
- Requires DevOps expertise
- Higher operational overhead
- **Migration:** Requires infrastructure setup

**Option 3: Cloud Providers (AWS, GCP, Azure)**
- More control, more complexity
- Higher costs for small scale
- **Migration:** Requires significant setup

**Recommendation:** Stay on Vercel unless costs exceed $100/month or specific requirements aren't met.

---

## CI/CD Best Practices

### Current Practices

✅ **Good:**
- Build artifacts uploaded/downloaded
- Tests run before deployment
- Environment variables pulled from Vercel
- Preview URLs commented on PRs

⚠️ **Areas for Improvement:**
- Consolidate redundant workflows
- Add deployment status checks
- Add post-deployment smoke tests
- Add rollback automation

### Recommended Workflow

```yaml
1. PR Opened → Preview Deploy
2. PR Updated → Preview Deploy (update)
3. PR Merged → Production Deploy
4. Production Deploy → Smoke Tests → Notify
```

---

## Conclusion

**Hosting Platform:** Vercel ✅  
**Status:** Configured and Working  
**Cost:** Free tier suitable for MVP  
**Scaling:** Pro tier ($20/month) when team collaboration needed  

**Next Steps:**
1. Consolidate redundant workflows
2. Enable preview deployments for all PRs
3. Add post-deployment smoke tests
4. Document rollback procedures
