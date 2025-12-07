# Migration Application Guide

## Overview

This guide explains how to apply all database migrations for the AIAS platform, including the new migrations for agents, workflows, billing, and observability.

## Migration Status

### Validated Migrations

All 40 migration files have been validated and are ready to apply:

**New Migrations (Created in this session):**
- ✅ `20250130000000_agents_and_workflows.sql` - Agents and workflows tables
- ✅ `20250130000001_billing_and_usage.sql` - Billing and subscription tables
- ✅ `20250130000002_observability.sql` - Observability and telemetry tables

**Existing Migrations:**
- 37 other migrations already in the repository

## Application Methods

### Method 1: Supabase CLI (Recommended)

This is the recommended method for applying migrations to a Supabase project.

#### Prerequisites

1. Supabase CLI installed (already available via `pnpm`)
2. Supabase project reference
3. Supabase access token

#### Steps

```bash
# Set environment variables
export SUPABASE_PROJECT_REF="your-project-ref"
export SUPABASE_ACCESS_TOKEN="your-access-token"

# Link to your Supabase project
pnpm exec supabase link --project-ref $SUPABASE_PROJECT_REF --token $SUPABASE_ACCESS_TOKEN

# Apply all migrations
pnpm exec supabase db push
```

#### Verification

After applying, verify the migrations:

```bash
# Check migration status
pnpm exec supabase migration list

# Verify tables were created
pn exec supabase db diff
```

### Method 2: Direct Database Connection

Use this method if you have direct database access.

#### Prerequisites

1. Database connection string
2. PostgreSQL client access

#### Steps

```bash
# Set database URL
export SUPABASE_DB_URL="postgresql://user:password@host:5432/postgres"

# Apply migrations
pnpm run migrate:apply
```

### Method 3: GitHub Actions (Automated)

Migrations can be applied automatically via GitHub Actions when pushing to main branch.

#### Prerequisites

1. GitHub repository secrets configured:
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_ACCESS_TOKEN`

#### Steps

1. Push changes to main branch
2. GitHub Actions will automatically:
   - Run tests
   - Apply migrations
   - Deploy to production

The workflow file is located at:
`.github/workflows/deploy-agents-workflows.yml`

### Method 4: Manual Application

Apply migrations manually using a PostgreSQL client.

#### Steps

1. Connect to your database using `psql` or a GUI tool
2. Apply each migration file in order from:
   ```
   /workspace/supabase/migrations
   ```
3. Execute SQL files in chronological order

## Migration Details

### Agents and Workflows Migration

**File**: `20250130000000_agents_and_workflows.sql`

**Creates:**
- `agents` table - Agent definitions
- `agent_executions` table - Execution logs
- `workflows` table - Workflow definitions
- `workflow_executions` table - Execution logs

**Features:**
- Row Level Security (RLS) policies
- Indexes for performance
- Foreign key constraints
- Updated_at triggers

### Billing and Usage Migration

**File**: `20250130000001_billing_and_usage.sql`

**Creates:**
- `subscriptions` table - User subscriptions
- `usage_metrics` table - Usage tracking
- `billing_events` table - Billing event history

**Features:**
- Stripe integration support
- Usage metering
- Subscription lifecycle management

### Observability Migration

**File**: `20250130000002_observability.sql`

**Creates:**
- `telemetry_events` table - General telemetry
- `workflow_execution_logs` table - Detailed workflow logs
- `agent_execution_logs` table - Detailed agent logs
- `error_logs` table - Error tracking
- `performance_metrics` table - Performance monitoring

**Features:**
- Comprehensive logging
- Error tracking with severity levels
- Performance metrics collection

## Verification Checklist

After applying migrations, verify:

- [ ] All tables created successfully
- [ ] RLS policies applied
- [ ] Indexes created
- [ ] Foreign keys established
- [ ] Triggers working
- [ ] No errors in migration logs

## Troubleshooting

### Common Issues

**Issue**: Migration fails with "relation already exists"
- **Solution**: Migration may have been partially applied. Check which tables exist and skip or modify the migration.

**Issue**: RLS policy creation fails
- **Solution**: Ensure `user_tenants` table exists (from previous migrations).

**Issue**: Foreign key constraint fails
- **Solution**: Ensure referenced tables exist. Check migration order.

**Issue**: Permission denied errors
- **Solution**: Ensure database user has CREATE, ALTER, and GRANT permissions.

### Rollback

If a migration fails:

1. Check the error message
2. Review the migration file
3. Fix any issues
4. Re-run the migration

For production, consider:
- Testing migrations in staging first
- Creating database backups before applying
- Using transactions where possible

## Next Steps

After applying migrations:

1. **Verify API Routes**: Test agent and workflow API endpoints
2. **Test UI Components**: Verify agent and workflow UI components work
3. **Check Observability**: Verify telemetry events are being logged
4. **Monitor Performance**: Check database performance with new tables
5. **Update Documentation**: Document any custom configurations

## Support

If you encounter issues:

1. Check migration logs
2. Review error messages
3. Consult Supabase documentation
4. Contact support: support@aiautomatedsystems.ca

## Related Documentation

- [Database Schema Documentation](/docs/database/schema.md)
- [API Documentation](/docs/api/README.md)
- [Deployment Guide](/docs/deployment/README.md)
