# ⭐ Aurora Prime — Full Stack Autopilot

Aurora Prime is an autonomous full-stack orchestrator responsible for validating, healing, and deploying the entire application stack end-to-end. It operates across **GitHub → Supabase → Vercel → Expo** without requiring any local `.env` files. All secrets originate from GitHub repository secrets.

## 🎯 Mission Objectives

### 1. Environment Verification
- Confirms the repo uses GitHub Secrets for all required environment variables
- Validates that Supabase, Vercel, Expo, and GitHub Actions all reference the same secrets consistently
- Automatically rewrites workflow files if mismatches are found

### 2. Supabase — Migration & Schema Health
- Pulls latest migrations
- Runs dry-run diff against live Supabase Postgres schema
- Creates missing tables, functions, RLS policies (never duplicates existing ones)
- Ensures Prisma (WASM engine only) and database schema are aligned
- Creates fallback migrations for any drift detected
- Verifies tables, columns, indexes, triggers, RLS policies, and Edge Functions
- Confirms Supabase status returns healthy

### 3. Vercel — Frontend Deployment Check
- Validates the correct Vercel project is linked
- Confirms environment variables automatically sync from GitHub
- Detects if deployment is pointing to the wrong branch or project
- Fixes routing or environment mismatches
- Triggers fresh production deployment verification

### 4. Expo — Mobile App Deployment
- Confirms secrets and public URLs match Supabase
- Ensures EAS configuration references GitHub Secrets correctly
- Validates OTA updates are enabled
- Runs simulated build check
- Confirms schema compatibility across mobile → backend

### 5. CI/CD Pipeline Autopilot
- Detects broken GitHub Actions workflows
- Patches missing permissions, triggers, or tokens
- Adds safety checks: schema drift detection, deploy confirmation, rollback guardrails
- Creates automated "Doctor" job that runs Prisma validate, checks Supabase schema, ensures Vercel targets correct project, confirms Expo configs

### 6. Self-Healing Logic
At any sign of:
- Deployment mismatch
- Branch misalignment
- Secret inconsistency
- Missing tables
- Invalid schema
- Edge function failure
- Mobile config drift

Aurora Prime creates a fix, applies it, documents the change, and re-runs the check.

## 🚀 Usage

### Run Aurora Prime Locally

```bash
npm run aurora:prime
```

### Run in CI/CD

Aurora Prime can be integrated into your GitHub Actions workflows:

```yaml
- name: Run Aurora Prime
  run: npm run aurora:prime
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.EXPO_PUBLIC_SUPABASE_URL }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 📋 Required GitHub Secrets

Aurora Prime requires the following secrets to be configured in your GitHub repository:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_PROJECT_REF` - Supabase project reference ID
- `SUPABASE_ACCESS_TOKEN` - Supabase access token for CLI operations
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL for Next.js
- `EXPO_PUBLIC_SUPABASE_URL` - Public Supabase URL for Expo
- `EXPO_TOKEN` - Expo access token
- `GITHUB_TOKEN` - GitHub personal access token (for workflow modifications)

## 📊 Output Format

Every run ends with a comprehensive status report:

```
⭐ AURORA PRIME — FULL SYSTEM STATUS
============================================================

COMPONENT STATUS:
  Supabase:           [Healthy / FIXED / Needs Attention]
  Vercel Deployment:  [Healthy / FIXED / Needs Attention]
  Expo (iOS/Android): [Healthy / FIXED / Needs Attention]
  GitHub Actions:      [Healthy / FIXED / Needs Attention]
  Secrets Alignment:   [Healthy / FIXED / Needs Attention]
  Schema Drift:        [None / Auto-repaired / Needs Manual Review]

🔧 FIXES APPLIED:
  ✓ Applied pending Supabase migrations
  ✓ Created automated Doctor workflow

⚠️  ISSUES DETECTED:
  ❌ [Supabase] Failed to apply migrations: ...
     Fix: Review migration files and apply manually

📋 RECOMMENDED NEXT ACTIONS:
  - Review and fix Supabase migration issues
  - Verify all required secrets are set in GitHub repository secrets
```

A detailed JSON report is also saved to `aurora-prime-report.json` in the project root.

## 🔧 Rules of Operation

1. **Never asks questions** — decides and fixes autonomously
2. **Never generates placeholder code** — produces production-ready patches only
3. **Never duplicates schema objects** — creates only what's missing
4. **Assumes Termux is not used** for this workflow
5. **If something is already configured correctly** → verifies and confirms it
6. **If something is broken** → repairs it
7. **Every run is a full-stack smoke test**

## 🏥 Automated Doctor Workflow

Aurora Prime automatically creates a GitHub Actions workflow (`.github/workflows/aurora-prime-doctor.yml`) that:

- Runs daily at 3 AM UTC
- Can be triggered manually via `workflow_dispatch`
- Runs on pushes to `main` branch
- Executes:
  - Prisma schema validation
  - Supabase schema drift detection
  - Vercel project verification
  - Expo configuration validation
  - Full Aurora Prime validation
- Uploads reports as artifacts

## 🔍 How It Works

1. **Environment Verification**: Checks all required secrets are present and aligned
2. **Supabase Health**: Validates migrations, schema, and database connectivity
3. **Vercel Validation**: Verifies project linking, configuration, and deployments
4. **Expo Validation**: Checks EAS config, OTA updates, and Supabase URL alignment
5. **CI/CD Healing**: Analyzes all GitHub Actions workflows and fixes issues
6. **Report Generation**: Creates comprehensive status report with recommendations

## 🛡️ Safety Features

- **Non-destructive**: Never deletes or modifies user data
- **Idempotent**: Can be run multiple times safely
- **Dry-run first**: Checks before applying changes
- **Rollback ready**: Documents all changes for easy rollback
- **Error handling**: Gracefully handles missing dependencies or permissions

## 📝 Example Output

```bash
$ npm run aurora:prime

⭐ AURORA PRIME — FULL STACK AUTOPILOT
============================================================
🚀 Starting full-system validation at 2025-01-28T12:00:00.000Z

🔍 [1/5] Verifying environment secrets alignment...
✅ All secrets properly configured

🗄️  [2/5] Validating Supabase migration & schema health...
📦 Found 19 migration files
✅ Database schema is up to date
✅ Supabase instance is healthy
✅ Prisma schema is valid

🚀 [3/5] Validating Vercel deployment configuration...
✅ Vercel project is properly linked
✅ Vercel deployment workflow properly configured

📱 [4/5] Validating Expo mobile app configuration...
✅ OTA updates configured
✅ Expo Supabase URL configured
✅ Expo workflow properly configured

🔄 [5/5] Validating and healing CI/CD pipelines...
📋 Found 40 workflow files
✅ All workflows properly configured
✅ Created Aurora Prime Doctor workflow

============================================================
⭐ AURORA PRIME — FULL SYSTEM STATUS
============================================================

COMPONENT STATUS:
  Supabase:           [Healthy]
  Vercel Deployment:  [Healthy]
  Expo (iOS/Android): [Healthy]
  GitHub Actions:      [FIXED]
  Secrets Alignment:   [Healthy]
  Schema Drift:        [None]

🔧 FIXES APPLIED:
  ✓ Created automated Doctor workflow

📋 RECOMMENDED NEXT ACTIONS:
  - All systems operational - no action required

📄 Full report saved to: /workspace/aurora-prime-report.json
============================================================
```

## 🔗 Integration with Existing Workflows

Aurora Prime integrates seamlessly with existing workflows:

- **Supabase Migrations**: Works with `.github/workflows/apply-supabase-migrations.yml`
- **Vercel Deployments**: Validates `.github/workflows/deploy-main.yml`
- **Expo Builds**: Checks `.github/workflows/mobile.yml`
- **CI Pipeline**: Enhances `.github/workflows/ci.yml`

## 🚨 Troubleshooting

### Aurora Prime reports "Needs Attention"

1. Check the detailed report in `aurora-prime-report.json`
2. Review the "ISSUES DETECTED" section
3. Apply recommended fixes
4. Re-run Aurora Prime

### Secrets not found

Ensure all required secrets are configured in GitHub repository settings:
- Settings → Secrets and variables → Actions
- Add all secrets listed in the "Required GitHub Secrets" section

### Supabase authentication fails

- Verify `SUPABASE_ACCESS_TOKEN` is valid
- Check `SUPABASE_PROJECT_REF` matches your project
- Ensure Supabase CLI is installed (Aurora Prime will attempt to install it)

### Vercel validation fails

- Verify `VERCEL_TOKEN` has proper permissions
- Check `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` are correct
- Ensure project is linked: `vercel link`

## 📚 Related Documentation

- [Supabase Migrations Guide](../supabase/README.md)
- [Vercel Deployment Guide](../docs/deployment.md)
- [Expo EAS Configuration](../docs/mobile.md)
- [GitHub Actions Workflows](../.github/workflows/README.md)

---

**Aurora Prime** — Ensuring the entire system works as if a senior engineer manually validated everything, every time.
