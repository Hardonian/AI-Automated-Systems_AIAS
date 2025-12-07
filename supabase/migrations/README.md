# Unmigrated Migrations

This directory contains only migrations that have not yet been applied to the database.

## Current Unmigrated Migrations

1. **20250130000000_agents_and_workflows.sql**
   - Creates `agents` and `agent_executions` tables
   - Creates `workflows` and `workflow_executions` tables
   - Includes RLS policies, indexes, and triggers

2. **20250130000001_billing_and_usage.sql**
   - Creates `subscriptions` table
   - Creates `usage_metrics` table
   - Creates `billing_events` table
   - Includes Stripe integration support

3. **20250130000002_observability.sql**
   - Creates `telemetry_events` table
   - Creates `workflow_execution_logs` table
   - Creates `agent_execution_logs` table
   - Creates `error_logs` table
   - Creates `performance_metrics` table

## Archived Migrations

All previously applied migrations have been moved to `/supabase/migrations_archive/` for historical reference.

## Applying Migrations

To apply these migrations, use one of the methods described in:
- `docs/deployment/migration-guide.md`
- `scripts/apply-all-migrations.ts`
