# Database Pooler Connection Setup

This document explains how the database pooler connection is configured and used in GitHub Actions workflows and Vercel builds.

## Overview

The system uses a **Supabase Pooler connection** for database operations, which provides:
- Better connection management
- Improved performance under load
- Connection pooling for serverless environments

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

### Required Secrets

1. **`DATABASE_POOLER_URL`** (Primary)
   - Format: `postgresql://postgres.{project_ref}:[password]@aws-1-us-east-1.pooler.supabase.com:5432/postgres`
   - Example: `postgresql://postgres.<project_ref>:<password>@aws-1-us-east-1.pooler.supabase.com:5432/postgres`
   - Used for: All database operations including migrations

2. **`DATABASE_POOLER_DIRECT_URL`** (Optional)
   - Direct connection URL (bypasses pooler)
   - Used for: Prisma migrations that require direct connections
   - Falls back to `DATABASE_POOLER_URL` if not set

### Staging Environment Secrets

For staging/testing environments:

- **`STAGING_DATABASE_POOLER_URL`**
- **`STAGING_DATABASE_POOLER_DIRECT_URL`**

## Environment Variable Priority

The system uses the following priority order for database URLs:

1. `DATABASE_POOLER_URL` (highest priority - from GitHub Secrets)
2. `UPSTASH_POSTGRES_URL` (fallback)
3. `DATABASE_URL` (legacy fallback)

For direct URLs:
1. `DATABASE_POOLER_DIRECT_URL`
2. `UPSTASH_POSTGRES_DIRECT_URL`
3. `DIRECT_URL`
4. Falls back to pooler URL if none set

## Security Features

### Secret Masking

All database URLs are automatically masked in GitHub Actions logs using:
```bash
echo "::add-mask::$DATABASE_URL"
echo "::add-mask::$DIRECT_URL"
```

This prevents accidental exposure of credentials in build logs.

### Where Secrets Are Used

1. **GitHub Actions Workflows**
   - `.github/workflows/migrations-unified.yml` - Database migrations
   - `.github/workflows/ci-unified.yml` - CI builds and tests

2. **Vercel Build Scripts**
   - `vercel-build.sh` - Vercel deployment builds
   - `package.json` - `vercel-build` script

3. **Application Code**
   - `lib/env.ts` - Environment variable resolution

## Migration Workflow

Migrations automatically use the pooler connection:

1. **On Push to Main/Master**
   - Migrations run automatically using `DATABASE_POOLER_URL`

2. **On Pull Requests**
   - Staging migrations use `STAGING_DATABASE_POOLER_URL`

3. **Manual Trigger**
   - Can be triggered via GitHub Actions workflow dispatch

## Setup Instructions

### 1. Add GitHub Secrets

```bash
# Add the pooler URL secret
gh secret set DATABASE_POOLER_URL --body "postgresql://postgres.{project_ref}:[password]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Optionally add direct URL
gh secret set DATABASE_POOLER_DIRECT_URL --body "postgresql://postgres.{project_ref}:[password]@db.{project_ref}.supabase.co:5432/postgres?sslmode=require"
```

### 2. Verify Secret Configuration

Check that secrets are set:
```bash
gh secret list
```

### 3. Test Migration Workflow

Trigger a test migration:
```bash
gh workflow run migrations-unified.yml
```

## Troubleshooting

### Migrations Not Running

1. **Check Secret Exists**
   ```bash
   gh secret list | grep DATABASE_POOLER
   ```

2. **Verify Secret Value**
   - Ensure the URL format is correct
   - Check that credentials are valid

3. **Check Workflow Logs**
   - Look for masked `***` values (secrets are masked)
   - Check for connection errors

### Connection Errors

1. **Pooler URL Format**
   - Must use `pooler.supabase.com` domain
   - Port should be `5432`

2. **Direct URL Format**
   - Must use `db.{project_ref}.supabase.co` domain
   - Include `?sslmode=require` parameter

### Fallback Behavior

If `DATABASE_POOLER_URL` is not set, the system will:
1. Try `UPSTASH_POSTGRES_URL`
2. Fall back to `DATABASE_URL`
3. Skip migrations if none are available (non-blocking)

## Best Practices

1. **Never Commit Secrets**
   - Always use GitHub Secrets
   - Never hardcode credentials

2. **Use Environment-Specific Secrets**
   - Production: `DATABASE_POOLER_URL`
   - Staging: `STAGING_DATABASE_POOLER_URL`

3. **Rotate Credentials Regularly**
   - Update secrets periodically
   - Test after rotation

4. **Monitor Migration Logs**
   - Check GitHub Actions logs after each migration
   - Verify successful completion

## Related Documentation

- [Environment Variables](./ENVIRONMENT.md)
- [Migration Setup](./operations/PRISMA_MIGRATIONS_SETUP.md)
- [UpStash Postgres Setup](./UPSTASH_POSTGRES_SETUP.md)
