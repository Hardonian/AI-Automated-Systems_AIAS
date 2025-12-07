# Quick Migration Guide

## Overview

Migrations can be applied automatically using GitHub Actions workflows that have access to your Supabase credentials stored as GitHub secrets.

## Quick Migration (Recommended)

### Option 1: GitHub Actions UI

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Select **Apply Migrations** workflow
4. Click **Run workflow**
5. Type `apply` in the confirmation field
6. Click **Run workflow**

The workflow will:
- Use your GitHub secrets (`SUPABASE_PROJECT_REF` and `SUPABASE_ACCESS_TOKEN`)
- Link to your Supabase project
- Apply all pending migrations
- Verify the migration status

### Option 2: GitHub CLI

If you have GitHub CLI installed:

```bash
gh workflow run apply-migrations.yml -f confirm=apply
```

Or use the npm script:

```bash
pnpm run migrate
```

### Option 3: Direct Script (if credentials available locally)

If you have credentials set as environment variables:

```bash
pnpm run migrate:auto
```

## Current Unmigrated Migrations

The following migrations are ready to be applied:

1. `20250130000000_agents_and_workflows.sql`
2. `20250130000001_billing_and_usage.sql`
3. `20250130000002_observability.sql`

## Verification

After migration, verify:

- [ ] All tables created successfully
- [ ] RLS policies applied
- [ ] Indexes created
- [ ] No errors in migration logs

## Troubleshooting

### Workflow Fails

- Check GitHub Actions logs for specific errors
- Verify secrets are configured correctly
- Ensure Supabase project is accessible

### Migrations Already Applied

- The workflow will skip already-applied migrations
- Check Supabase dashboard for current schema state

## Related Documentation

- [Migration Guide](/docs/deployment/migration-guide.md)
- [Migration Archive Summary](/docs/completion/migration-archive-summary.md)
