# Archived Migrations

This directory contains migrations that have been applied to the database or are redundant.

## Archive Date
2025-01-30

## Archive Reason
These migrations have been consolidated into the master schema or have already been applied to production databases. They are kept here for historical reference and rollback purposes.

## Unmigrated Migrations

The following migrations remain in `/supabase/migrations/` and need to be applied:

1. `20250130000000_agents_and_workflows.sql` - Agents and workflows tables
2. `20250130000001_billing_and_usage.sql` - Billing and subscription tables  
3. `20250130000002_observability.sql` - Observability and telemetry tables

## Restoring Archived Migrations

If you need to restore archived migrations:

```bash
# Restore a specific migration
mv supabase/migrations_archive/[migration_name].sql supabase/migrations/

# Restore all archived migrations
mv supabase/migrations_archive/*.sql supabase/migrations/
```

## Master Consolidated Schema

The `99999999999999_master_consolidated_schema.sql` file contains a consolidated version of all historical migrations and can be used to bootstrap a fresh database.

## Notes

- Archived migrations are kept for historical reference
- Do not delete archived migrations without careful consideration
- New migrations should be added to `/supabase/migrations/` not the archive
