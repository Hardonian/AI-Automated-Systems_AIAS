# Consolidated Workflows Archive

This directory contains workflows that were consolidated into unified workflows as part of the operational process consolidation effort.

## Migration Workflows → `migrations-unified.yml`

The following migration workflows were consolidated:

- `apply-migrations.yml` - Simple manual migration workflow
- `apply-supabase-migrations.yml` - Comprehensive Supabase migration workflow
- `prisma-migrations.yml` - Prisma-specific migrations
- `migration-guardian.yml` - Migration guardian health checks
- `supabase-delta-apply-self-healing.yml` - Delta migration self-healing
- `regenerate-supabase-types.yml` - Type regeneration after migrations

**New unified workflow:** `.github/workflows/migrations-unified.yml`

Features:
- Single workflow handles both Supabase and Prisma migrations
- Staging testing for PRs
- Migration guardian health checks
- Automatic type regeneration
- Unified notifications

## Deployment Workflows → `deploy-unified.yml`

The following deployment workflows were consolidated:

- `deploy.yml` - General deployment workflow
- `deploy-main.yml` - DEPRECATED main deployment workflow
- `frontend-deploy.yml` - Frontend CI/CD
- `canary-deploy.yml` - Canary deployment
- `deploy-doctor.yml` - Deployment diagnostics
- `deploy-agents-workflows.yml` - Agents & workflows deployment
- `deploy-content-strategy.yml` - Content strategy deployment

**New unified workflow:** `.github/workflows/deploy-unified.yml`

Features:
- Single workflow handles all deployment types
- Pre-deployment checks (deploy doctor)
- Frontend, agents, content, and canary deployments
- Post-deployment verification
- Unified notifications

## CI/Build Check Workflows → `ci-unified.yml`

The following CI/build check workflows were consolidated:

- `ci.yml` - Basic CI pipeline
- `ci-consolidated.yml` - Consolidated CI/CD pipeline
- `vercel-build-check.yml` - Vercel build validation
- `vercel-validation.yml` - Vercel config validation
- `vercel-pr-status.yml` - Vercel PR status updates
- `vercel-guard.yml` - Vercel guard validation
- `quality-gates.yml` - Quality gates
- `code-hygiene.yml` - Code hygiene checks

**New unified workflow:** `.github/workflows/ci-unified.yml`

Features:
- Single workflow handles all CI checks
- Code quality (lint, typecheck, format)
- Security scans
- Tests (unit + E2E)
- Build validation
- Vercel build checks
- Quality gates
- Code hygiene (scheduled/weekly)
- Vercel PR status updates

## Alerting/Notification Systems → `notifications-unified.yml`

All Slack/webhook notifications were consolidated into a single notification workflow that:
- Monitors unified workflows (CI, Deployment, Migrations)
- Sends status notifications automatically
- Supports custom notifications via workflow_dispatch
- Centralizes all alerting logic

**New unified workflow:** `.github/workflows/notifications-unified.yml`

## Migration Notes

1. **Secrets**: All existing secrets remain compatible. No changes needed.
2. **Triggers**: Workflows trigger on the same events as before.
3. **Environments**: Environment protection rules remain the same.
4. **Artifacts**: Build artifacts and reports are preserved.

## Rollback

If needed, workflows can be restored from this archive directory. However, the unified workflows provide better:
- Maintainability
- Consistency
- Reduced duplication
- Better error handling
- Centralized notifications

## Date Archived

2025-01-XX (Workflow consolidation)
