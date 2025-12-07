# Apply Migrations Now

## Quick Start

To apply the 3 unmigrated migrations using GitHub secrets:

### Option 1: Use Existing Workflow (Recommended)

The workflow file `.github/workflows/apply-migrations.yml` has been created but needs to be committed first.

**Steps:**
1. Commit the workflow file:
   ```bash
   git add .github/workflows/apply-migrations.yml
   git commit -m "Add migration workflow"
   git push
   ```

2. Trigger the workflow:
   ```bash
   gh workflow run apply-migrations.yml -f confirm=apply
   ```

   Or via GitHub UI:
   - Go to: https://github.com/shardie-github/AI-Automated-Systems_AIAS/actions/workflows/apply-migrations.yml
   - Click "Run workflow"
   - Type "apply" in confirmation field
   - Click "Run workflow"

3. After workflow completes, archive migrations:
   ```bash
   pnpm run migrate:archive
   ```

### Option 2: Use Deploy Workflow

If you have a deploy workflow that includes migrations:

```bash
gh workflow run "Main Deploy (DB migrate + Vercel Prod)"
```

### Option 3: Manual Application

If you have Supabase credentials locally:

```bash
export SUPABASE_PROJECT_REF="your-project-ref"
export SUPABASE_ACCESS_TOKEN="your-access-token"
pnpm exec supabase link --project-ref $SUPABASE_PROJECT_REF
pnpm exec supabase db push
pnpm run migrate:archive
```

## Current Unmigrated Migrations

1. `20250130000000_agents_and_workflows.sql`
2. `20250130000001_billing_and_usage.sql`
3. `20250130000002_observability.sql`

## After Application

Once migrations are applied, archive them:

```bash
pnpm run migrate:archive
```

This will move all 3 migrations to `/supabase/migrations_archive/`.

## Verification

After applying, verify tables exist:

```sql
-- Check agents tables
SELECT * FROM agents LIMIT 1;
SELECT * FROM agent_executions LIMIT 1;

-- Check workflows tables
SELECT * FROM workflows LIMIT 1;
SELECT * FROM workflow_executions LIMIT 1;

-- Check billing tables
SELECT * FROM subscriptions LIMIT 1;
SELECT * FROM usage_metrics LIMIT 1;

-- Check observability tables
SELECT * FROM telemetry_events LIMIT 1;
SELECT * FROM workflow_execution_logs LIMIT 1;
```

## Status

- ✅ Migration workflow created
- ✅ Archive script ready
- ⏳ Waiting for workflow to be committed and triggered
- ⏳ Migrations ready to be applied
