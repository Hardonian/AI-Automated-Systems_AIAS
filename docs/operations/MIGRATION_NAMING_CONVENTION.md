# Migration Naming Convention

## Standard Format

All Supabase migration files should follow this naming convention:

```
YYYYMMDDHHMMSS_description.sql
```

**Format:** `{timestamp}_{description}.sql`

### Components

1. **Timestamp:** `YYYYMMDDHHMMSS` (14 digits)
   - Year: 4 digits
   - Month: 2 digits (01-12)
   - Day: 2 digits (01-31)
   - Hour: 2 digits (00-23)
   - Minute: 2 digits (00-59)
   - Second: 2 digits (00-59)

2. **Description:** Lowercase with underscores
   - Use descriptive names
   - Separate words with underscores
   - Keep it concise but clear

### Examples

✅ **Good:**
- `20250127120000_add_user_profiles.sql`
- `20250127120001_create_orders_table.sql`
- `20250127120002_add_rls_policies.sql`

❌ **Bad:**
- `000000000800_upsert_functions.sql` (non-standard timestamp)
- `20241220_ai_embeddings.sql` (missing time component)
- `2025-11-05_agent.sql` (wrong format, dashes instead of digits)

## Current Migration Status

### Standard Migrations ✅

These migrations follow the correct naming convention:

- `20250120000000_privacy_security_automation.sql`
- `20250120000001_next_dimension_platform.sql`
- `20250120000002_enterprise_security_compliance.sql`
- `20250120000003_tenant_members_table.sql`
- `20250121000000_guardian_trust_ledger.sql`
- `20250122000000_rls_realtime_storage.sql`
- `20250123000000_performance_metrics.sql`
- `20250124000000_orchestrator_tables.sql`
- `20250127000000_metrics_aggregation_function.sql`
- `20250128000000_pmf_analytics.sql`
- `20250129000000_consolidated_rls_policies_and_functions.sql`
- `20251016031237_2c3a6b96-0ccf-47a0-9164-f44e2cd071c9.sql`
- `20251018001511_f2ca0ecc-4c0f-4794-9e8d-2febcf63b984.sql`
- `20251019014758_55565c7e-0301-44c3-b4f2-ebd9baa7c362.sql`

### Non-Standard Migrations ⚠️

These migrations don't follow the standard convention but are already applied:

- `000000000800_upsert_functions.sql` - Legacy migration (keep as-is)
- `20241220_ai_embeddings.sql` - Missing time component (keep as-is)
- `2025-11-05_agent.sql` - Wrong format (keep as-is)
- `2025-11-05_gamify.sql` - Wrong format (keep as-is)
- `2025-11-05_gamify_extended.sql` - Wrong format (keep as-is)
- `2025-11-05_telemetry.sql` - Wrong format (keep as-is)
- `2025-11-05_trust_audit.sql` - Wrong format (keep as-is)

**Note:** These migrations are already applied to production databases. **Do not rename them** as this would break migration tracking. Only new migrations should follow the standard convention.

## Creating New Migrations

### Using Supabase CLI

```bash
supabase migration new your_migration_name
```

This will create a file like: `20250127120000_your_migration_name.sql`

### Manual Creation

1. Generate timestamp:
   ```bash
   date +"%Y%m%d%H%M%S"
   # Output: 20250127120000
   ```

2. Create file:
   ```bash
   touch supabase/migrations/20250127120000_your_migration_name.sql
   ```

3. Write migration SQL:
   ```sql
   -- Your migration description
   CREATE TABLE IF NOT EXISTS your_table (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

## Migration Best Practices

### 1. Always Use `IF NOT EXISTS`

```sql
-- ✅ Good
CREATE TABLE IF NOT EXISTS users (...);

-- ❌ Bad
CREATE TABLE users (...);
```

### 2. Use Transactions

```sql
BEGIN;

-- Your migration SQL here

COMMIT;
```

### 3. Include Rollback Instructions

```sql
-- Migration: Add user_profiles table
-- Rollback: DROP TABLE IF EXISTS user_profiles;
CREATE TABLE IF NOT EXISTS user_profiles (...);
```

### 4. Test Migrations

```bash
# Test locally first
supabase db reset

# Then apply to remote
supabase db push
```

### 5. Document Complex Migrations

```sql
-- Migration: Consolidate RLS policies
-- 
-- This migration:
-- 1. Creates new unified RLS policies
-- 2. Drops old individual policies
-- 3. Updates function permissions
--
-- Rollback: See migration 20250128000000_pmf_analytics.sql
```

## Migration Ordering

Migrations are applied in alphabetical order. The timestamp ensures:
- Chronological ordering
- No conflicts between developers
- Clear history of changes

## Troubleshooting

### Migration Already Applied

If a migration fails because it's already applied:

1. Check migration status:
   ```bash
   supabase migration list
   ```

2. If migration is partially applied, fix manually:
   ```sql
   -- Run the missing parts manually
   ```

3. Mark migration as applied:
   ```bash
   supabase migration repair --status applied <migration-name>
   ```

### Conflicting Migrations

If two developers create migrations with the same timestamp:

1. One developer should regenerate timestamp
2. Update the migration file name
3. Ensure no conflicts in SQL

### Renaming Applied Migrations

**⚠️ NEVER rename migrations that are already applied to production!**

This will break migration tracking. If you must rename:
1. Create a new migration with the correct name
2. Keep the old migration file (commented out or empty)
3. Document the change

## Future Improvements

Consider:
- Automated migration naming validation in CI/CD
- Migration template generator
- Pre-commit hook to validate naming
- Migration dependency tracking

---

**Last Updated:** 2025-01-27  
**Maintained By:** Platform Team
