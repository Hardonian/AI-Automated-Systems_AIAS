# Migration Runbook

**Last Updated:** 2025-01-27

This document provides step-by-step instructions for running database migrations safely in production.

## Overview

The platform uses two migration systems:
1. **Prisma Migrations** - For Prisma-managed schema changes
2. **Supabase Migrations** - For RLS policies, functions, and Supabase-specific tables

## Pre-Migration Checklist

### 1. Backup Database
```bash
# Create backup before migration
pnpm db:backup
# Or manually via Supabase dashboard
```

### 2. Review Migration Files
```bash
# Review Prisma migrations
ls -la apps/web/prisma/migrations/

# Review Supabase migrations
ls -la supabase/migrations/
```

### 3. Test in Staging
- Always test migrations in staging first
- Verify data integrity after migration
- Check application functionality

### 4. Schedule Maintenance Window
- Notify users if downtime expected
- Schedule during low-traffic period
- Have rollback plan ready

## Migration Process

### Prisma Migrations

#### Development
```bash
# 1. Create migration
cd apps/web
pnpm prisma migrate dev --name migration_name

# 2. Review generated SQL
cat prisma/migrations/XXXXX_migration_name/migration.sql

# 3. Test migration
pnpm db:push  # For quick testing
```

#### Production
```bash
# 1. Generate Prisma Client (if schema changed)
cd apps/web
pnpm prisma generate

# 2. Run migrations
pnpm db:migrate
# Or: pnpm prisma migrate deploy

# 3. Verify migration
pnpm db:studio  # Check data integrity
```

### Supabase Migrations

#### Development
```bash
# 1. Create migration
supabase migration new migration_name

# 2. Edit migration file
# File: supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql

# 3. Test locally
supabase db reset  # Reset local DB
supabase db push   # Apply migrations
```

#### Production
```bash
# Option 1: Via Supabase CLI
supabase db push --linked

# Option 2: Via Supabase Dashboard
# 1. Go to Database → Migrations
# 2. Upload migration file
# 3. Review and apply

# Option 3: Via API (automated)
# Use migration guardian script
pnpm migrate:guardian
```

## Migration Types

### Schema Changes (Prisma)

**Adding a Column:**
```sql
-- Migration file
ALTER TABLE "users" ADD COLUMN "new_field" TEXT;
```

**Adding an Index:**
```sql
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
```

**Adding a Foreign Key:**
```sql
ALTER TABLE "projects" 
ADD CONSTRAINT "projects_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
```

### RLS Policies (Supabase)

**Adding RLS Policy:**
```sql
CREATE POLICY "Users can view their projects"
ON projects FOR SELECT
USING (user_id = auth.uid());
```

**Updating RLS Policy:**
```sql
DROP POLICY IF EXISTS "old_policy_name" ON table_name;
CREATE POLICY "new_policy_name" ON table_name FOR SELECT
USING (condition);
```

## Rollback Procedures

### Prisma Rollback

```bash
# 1. Identify migration to rollback to
pnpm prisma migrate status

# 2. Create rollback migration
# Manually create migration that reverses changes

# 3. Apply rollback
pnpm prisma migrate deploy
```

### Supabase Rollback

```bash
# 1. Create rollback migration
supabase migration new rollback_migration_name

# 2. Add SQL to reverse changes
# Example: DROP COLUMN, DROP POLICY, etc.

# 3. Apply rollback
supabase db push --linked
```

## Data Migration

### Safe Data Migration Pattern

```sql
-- 1. Add new column (nullable)
ALTER TABLE "users" ADD COLUMN "new_field" TEXT;

-- 2. Backfill data (in batches)
UPDATE "users" 
SET "new_field" = computed_value 
WHERE "new_field" IS NULL 
LIMIT 1000;
-- Repeat until all rows updated

-- 3. Make column required (if needed)
ALTER TABLE "users" ALTER COLUMN "new_field" SET NOT NULL;
```

### Large Data Migrations

For large tables (>1M rows):
1. Use batch processing
2. Run during low-traffic hours
3. Monitor performance
4. Consider using background jobs

## Verification Steps

### After Migration

1. **Check Migration Status**
```bash
pnpm prisma migrate status
supabase db remote commit --dry-run
```

2. **Verify Data Integrity**
```bash
pnpm tsx scripts/db-sanity-check-production.ts
```

3. **Test Application**
- Test critical user flows
- Verify API endpoints
- Check error handling

4. **Monitor Performance**
- Check query performance
- Monitor error rates
- Review logs

## Common Issues

### Migration Fails

**Symptoms:** Migration fails with error

**Solution:**
1. Check error message
2. Review migration SQL
3. Fix issue in migration file
4. Re-run migration

### Data Loss Risk

**Symptoms:** Migration might delete data

**Solution:**
1. **STOP** - Don't proceed
2. Review migration SQL carefully
3. Create backup
4. Test in staging first
5. Consider data migration script

### RLS Policy Issues

**Symptoms:** Users can't access data after migration

**Solution:**
1. Check RLS policies
2. Verify policy conditions
3. Test with different user roles
4. Update policies if needed

## Best Practices

### 1. Always Backup First
- Create database backup before migration
- Keep backups for 30 days

### 2. Test in Staging
- Never test migrations in production
- Use staging environment identical to production

### 3. Review SQL Carefully
- Read generated SQL before applying
- Understand what changes will be made
- Check for data loss risks

### 4. Use Transactions
- Wrap migrations in transactions when possible
- Allows rollback on failure

### 5. Monitor After Migration
- Watch error rates
- Monitor query performance
- Check user reports

### 6. Document Changes
- Document what migration does
- Note any manual steps required
- Update runbook if needed

## Emergency Procedures

### If Migration Breaks Production

1. **Assess Impact**
   - How many users affected?
   - What functionality broken?
   - Can users still access critical features?

2. **Rollback Decision**
   - If data loss risk: Rollback immediately
   - If minor issue: Fix forward
   - If unsure: Rollback and investigate

3. **Execute Rollback**
   ```bash
   # Restore from backup if needed
   # Or apply rollback migration
   ```

4. **Communicate**
   - Notify team
   - Update status page
   - Inform users if needed

5. **Post-Mortem**
   - Document what went wrong
   - Identify root cause
   - Update procedures

## Migration Scripts

### Automated Migration (Recommended)

```bash
# Run all pending migrations safely
pnpm migrate:guardian

# This script:
# 1. Checks migration status
# 2. Creates backup
# 3. Runs migrations
# 4. Verifies integrity
# 5. Reports results
```

### Manual Migration

```bash
# Step-by-step manual process
pnpm db:migrate
pnpm tsx scripts/db-sanity-check-production.ts
# Verify application works
```

## Resources

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Database Backup Guide](./database-backup-procedures.md)

## Support

If you encounter issues:
1. Check this runbook
2. Review migration files
3. Check logs
4. Contact DevOps team
