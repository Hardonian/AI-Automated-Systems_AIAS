# Production Deployment Guide

**Purpose:** Deploy the app to production  
**Platform:** Vercel (canonical)  
**Time:** ~15 minutes (first time), ~5 minutes (subsequent)

---

## Prerequisites

- ✅ GitHub repository connected to Vercel
- ✅ Supabase project created
- ✅ Environment variables configured
- ✅ GitHub Actions secrets configured

---

## Deployment Architecture

```
GitHub Repository (main branch)
    ↓
GitHub Actions (CI/CD)
    ↓
Vercel Platform
    ↓
Production URL (https://your-app.vercel.app)
```

**Hosting:** Vercel  
**Database:** Supabase (PostgreSQL)  
**CI/CD:** GitHub Actions  
**Deployment Method:** Automatic on push to `main`

---

## Step 1: Configure Vercel Project

### First-Time Setup

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Select repository: `your-org/aias-platform`

2. **Configure Build Settings:**
   - Framework Preset: **Next.js**
   - Build Command: `pnpm run db:generate && pnpm run build` (auto-detected from `vercel.json`)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)

3. **Set Environment Variables:**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set for: **Production**, **Preview**, **Development**

**Required Environment Variables:**
```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_PROJECT_REF
DATABASE_URL
DIRECT_URL

# NextAuth (Required)
NEXTAUTH_SECRET
NEXTAUTH_URL

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# OpenAI (Optional - for AI features)
OPENAI_API_KEY
```

**TODO:** Copy all values from `.env.local` to Vercel Dashboard → Settings → Environment Variables

---

## Step 2: Configure GitHub Actions Secrets

**Required for CI/CD:**

Go to GitHub → Repository → Settings → Secrets and variables → Actions

Add these secrets:

```bash
VERCEL_TOKEN              # Get from Vercel Dashboard → Settings → Tokens
VERCEL_ORG_ID             # Get from Vercel Dashboard → Settings → General
VERCEL_PROJECT_ID         # Get from Vercel Dashboard → Settings → General
SUPABASE_ACCESS_TOKEN     # Get from Supabase Dashboard → Settings → API
SUPABASE_PROJECT_REF      # Get from Supabase Dashboard → Settings → General
```

**TODO:** Get Vercel token from [vercel.com/account/tokens](https://vercel.com/account/tokens)

---

## Step 3: Deploy to Production

### Automatic Deployment (Recommended)

**Deployment happens automatically when you push to `main`:**

```bash
# Make changes
git add .
git commit -m "feat: your changes"
git push origin main

# GitHub Actions will:
# 1. Run lint, typecheck, tests
# 2. Build Next.js app
# 3. Deploy to Vercel production
# 4. Apply database migrations (if any)
```

**Deployment URL:** `https://your-app.vercel.app` (or custom domain)

### Manual Deployment (Via Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Step 4: Apply Database Migrations

### Automatic (Via CI/CD)

Migrations are applied automatically via GitHub Actions workflow:
- **Workflow:** `.github/workflows/apply-supabase-migrations.yml`
- **Trigger:** Push to `main` with migration changes
- **Schedule:** Daily at 2 AM UTC

### Manual (Via Supabase CLI)

```bash
# Link project
pnpm run supa:link

# Apply migrations
pnpm run supa:migrate:apply
```

**TODO:** Ensure `SUPABASE_ACCESS_TOKEN` is set in GitHub Secrets for automatic migrations

---

## Step 5: Verify Deployment

### Health Check

```bash
curl https://your-app.vercel.app/api/healthz
# Should return: {"status":"ok"}
```

### Smoke Tests

```bash
# Run smoke tests against production
HEALTH_URL=https://your-app.vercel.app/api/healthz pnpm smoke
```

### Manual Verification

1. **Visit:** `https://your-app.vercel.app`
2. **Check:** No console errors
3. **Test:** Key features (auth, API routes, etc.)

---

## Preview Deployments

**Every Pull Request gets a preview deployment:**

1. **Create PR:**
   ```bash
   git checkout -b feature/my-feature
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

2. **Preview URL:**
   - Automatically created by GitHub Actions
   - Commented on PR automatically
   - Format: `https://your-app-git-feature-branch.vercel.app`

3. **Preview Environment:**
   - Uses preview environment variables from Vercel
   - Isolated from production
   - Auto-updates on PR push

---

## Rollback

### Via Vercel Dashboard

1. Go to Vercel Dashboard → Deployments
2. Find previous deployment
3. Click "Promote to Production"

### Via Git Revert

```bash
# Revert commit
git revert <commit-hash>
git push origin main

# New deployment automatically created
```

---

## Monitoring

### Vercel Analytics

- **Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Metrics:** Page views, performance, Web Vitals
- **Logs:** Function logs, build logs

### Custom Monitoring

- **Health Endpoint:** `/api/healthz`
- **Performance:** Web Vitals tracking (built-in)
- **Telemetry:** Custom telemetry system (`lib/monitoring/`)

---

## Troubleshooting

### Deployment Fails

1. **Check GitHub Actions logs:**
   - Go to GitHub → Actions → Latest workflow run
   - Check build/test errors

2. **Check Vercel logs:**
   - Go to Vercel Dashboard → Deployments → Failed deployment → Logs

3. **Common Issues:**
   - Missing environment variables → Add to Vercel Dashboard
   - Build errors → Check `pnpm build` locally
   - Type errors → Run `pnpm typecheck` locally

### Environment Variables Not Loading

1. **Verify in Vercel Dashboard:**
   - Settings → Environment Variables
   - Check variable names match exactly
   - Ensure set for correct environment (Production/Preview)

2. **Redeploy:**
   ```bash
   # Trigger redeploy
   git commit --allow-empty -m "chore: trigger redeploy"
   git push origin main
   ```

### Database Connection Issues

1. **Verify Supabase credentials:**
   - Check `DATABASE_URL` format
   - Verify Supabase project is active
   - Check network connectivity

2. **Test connection:**
   ```bash
   # Test locally first
   pnpm dev
   # Check database connection in logs
   ```

---

## Cost

### Vercel

- **Free Tier:** 100GB bandwidth/month, 100GB-hours functions/month
- **Pro Tier:** $20/month (team collaboration, password protection)
- **Current:** Free tier sufficient for MVP

### Supabase

- **Free Tier:** 500MB database, 2GB bandwidth/month
- **Pro Tier:** $25/month (8GB database, 50GB bandwidth)
- **Current:** Free tier sufficient for MVP

---

## Next Steps

- **Custom Domain:** Configure in Vercel Dashboard → Settings → Domains
- **Monitoring:** Set up alerts in Vercel Dashboard
- **Backups:** Configure Supabase backups (Pro tier)
- **CDN:** Already configured via Vercel Edge Network

---

## Quick Reference

| Item | Value |
|------|-------|
| Hosting Platform | Vercel |
| Database | Supabase (PostgreSQL) |
| CI/CD | GitHub Actions |
| Deployment Method | Automatic (push to `main`) |
| Preview Deployments | Automatic (on PR) |
| Build Time | ~3-5 minutes |
| Production URL | `https://your-app.vercel.app` |

---

## Related Documentation

- **[Frontend Hosting Strategy](./frontend-hosting-strategy.md)** - Detailed Vercel setup
- **[CI/CD Overview](./ci-overview.md)** - GitHub Actions workflows
- **[Local Setup](./SETUP_LOCAL.md)** - Local development guide
- **[Environment Variables](./env-and-secrets.md)** - Environment variable management

---

**Deployment Complete! 🚀**
