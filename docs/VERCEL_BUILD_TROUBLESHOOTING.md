# Vercel Build Troubleshooting Guide

## Overview
This guide provides step-by-step instructions for diagnosing and fixing Vercel build failures, particularly those related to resource exhaustion (SIGKILL) and environment configuration issues.

## Quick Diagnostics

### 1. Check Build Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. Review the build logs for:
   - Memory errors (SIGKILL)
   - Missing environment variables
   - TypeScript/ESLint errors
   - Prisma generation failures

### 2. Run Environment Diagnostic
The build automatically runs `npm run build:diagnostic` which checks:
- Required environment variables
- Node.js version compatibility
- Database configuration
- Supabase configuration

Check the build logs for the diagnostic report output.

## Common Issues and Solutions

### Issue: SIGKILL (Memory Exhaustion)

**Symptoms:**
- Build fails with "Killed" or "SIGKILL" error
- Build succeeds locally but fails on Vercel
- Build fails during `next build` phase

**Solutions:**

1. **Memory Optimization (Already Applied)**
   - Build script includes `NODE_OPTIONS='--max-old-space-size=4096'`
   - This allocates 4GB of heap memory for Node.js

2. **Clear Build Cache**
   - Vercel Dashboard → Project Settings → General
   - Scroll to "Build & Development Settings"
   - Click "Clear Build Cache"
   - Redeploy

3. **Reduce Build Scope**
   - Check `next.config.mjs` for large static imports
   - Review `outputFileTracingExcludes` to exclude unnecessary files
   - Consider code splitting for large dependencies

### Issue: Missing Environment Variables

**Symptoms:**
- Build fails with "Missing required environment variable"
- Runtime errors about undefined configuration

**Solutions:**

1. **Set Environment Variables in Vercel**
   - Vercel Dashboard → Project Settings → Environment Variables
   - Add all required variables (see `.env.local.example`)
   - Ensure variables are available to "Build" environment
   - Mark sensitive variables as "Secret"

2. **Required Variables Checklist:**
   - `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` or `UPSTASH_POSTGRES_URL`
   - `NODE_ENV` (usually set automatically)

3. **Verify Variable Availability**
   - Check that variables are set for "Production", "Preview", and "Development"
   - Ensure "Build" checkbox is checked for variables needed during build

### Issue: Node.js Version Mismatch

**Symptoms:**
- Build fails with version-related errors
- Incompatible package errors

**Solutions:**

1. **Check Node.js Version**
   - Project uses Node.js 20.x or 22.x (LTS)
   - Set in `package.json` engines field
   - Vercel should auto-detect, but can be overridden in:
     - Vercel Dashboard → Project Settings → General → Node.js Version

2. **Verify .nvmrc**
   - `.nvmrc` file specifies Node.js 22
   - Vercel respects this file

### Issue: Prisma Generation Failure

**Symptoms:**
- Build fails during `prisma generate`
- "Cannot find module '@prisma/client'"

**Solutions:**

1. **Check Prisma Schema**
   - Ensure `apps/web/prisma/schema.prisma` exists
   - Verify schema is valid: `npx prisma validate`

2. **Database URL**
   - Prisma needs `DATABASE_URL` to generate client
   - Even if migrations are skipped, generation requires valid URL format

3. **Skip Prisma (Temporary)**
   - Set `SKIP_PRISMA_GENERATE=true` in Vercel environment variables
   - Only use if Prisma client is pre-generated

### Issue: Build Timeout

**Symptoms:**
- Build exceeds Vercel's timeout limit (usually 45 minutes for Hobby, longer for Pro)

**Solutions:**

1. **Optimize Build Process**
   - Reduce dependencies
   - Use `experimental.optimizePackageImports` in `next.config.mjs`
   - Exclude unnecessary files from build

2. **Check for Infinite Loops**
   - Review build scripts for recursive operations
   - Ensure `prebuild` cleanup doesn't run indefinitely

3. **Upgrade Vercel Plan**
   - Pro plan has longer build timeouts
   - Consider if build genuinely needs more time

## Manual Cache Clearing

### Via Vercel Dashboard
1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "General"
3. Scroll to "Build & Development Settings"
4. Click "Clear Build Cache"
5. Redeploy

### Via Vercel CLI
```bash
vercel --force
```

## Rollback Instructions

If build optimizations cause issues, you can revert:

### Revert Memory Optimization
In `package.json`, change:
```json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```
Back to:
```json
"build": "next build"
```

### Revert Prebuild Cleanup
Remove or comment out:
```json
"prebuild": "rm -rf .next dist out && echo '✓ Cleaned build cache directories'"
```

### Revert Node.js Version
In `package.json`, change:
```json
"engines": {
  "node": "^20.18.0 || ^22.0.0"
}
```
Back to:
```json
"engines": {
  "node": ">=22"
}
```

## Build Output API (Fallback)

If standard Next.js build continues to fail, you can use Vercel's Build Output API:

1. Create `vercel.json` with build output configuration
2. Generate static output manually
3. Deploy as static site

This is a last resort and should only be used if dynamic features aren't required.

## Getting Help

1. **Check Build Logs**: Full error messages are in Vercel deployment logs
2. **Run Diagnostic**: `npm run build:diagnostic` locally
3. **Vercel Support**: Contact Vercel support with deployment URL and error logs
4. **GitHub Issues**: Open an issue with build logs and environment details

## Prevention

To prevent future build issues:

1. **Test Locally First**: Run `npm run build` locally before pushing
2. **Monitor Build Times**: Watch for gradually increasing build times
3. **Regular Dependency Updates**: Keep dependencies up to date
4. **Environment Variable Documentation**: Keep `.env.local.example` updated
5. **Build Optimization**: Regularly review and optimize build configuration
