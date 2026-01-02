# SUPABASE BACKEND VALIDATION & MIGRATION CONSOLIDATION

**Purpose:** Validate and consolidate Supabase backend schema to match intended state from migrations.

---

## QUICK START

1. **Run introspection** → `INTROSPECTION.sql` → Save output to `REALITY.md`
2. **Review gaps** → `GAPS_REPORT.md` → Compare with your `REALITY.md`
3. **Apply patch** → `PATCH.sql` → Fixes all identified gaps (idempotent)
4. **Verify** → `VERIFY.sql` → Confirms patch worked
5. **Rollback** (if needed) → `ROLLBACK.sql` → Limited safety rollback

---

## FILES GENERATED

### 1. `INTROSPECTION.sql`
**Purpose:** Capture actual database state  
**Usage:** Run against your Supabase database, save output to `REALITY.md`  
**Output:** Comprehensive SQL queries that reveal:
- Tables, columns, constraints, indexes
- RLS policies and grants
- Functions, triggers, views
- Realtime configuration
- Storage buckets (if used)

### 2. `GAPS_REPORT.md`
**Purpose:** Evidence-based gap analysis  
**Content:**
- Expected vs actual comparison
- Critical gaps (must fix)
- High/medium priority gaps
- Verification queries for each gap

### 3. `PATCH.sql` ⭐
**Purpose:** Idempotent SQL patch to fix all gaps  
**Safety:** 
- ✅ Safe to run multiple times
- ✅ No data loss (additive only)
- ✅ No destructive operations
- ✅ Handles missing foundational tables

**What it fixes:**
- Creates missing tables (`tenants`, `tenant_members`, core tables)
- Adds missing columns (with `IF NOT EXISTS` checks)
- Creates missing indexes
- Enables RLS on all tables
- Creates/updates RLS policies (uses `tenant_members` not `user_tenants`)
- Creates missing functions and triggers
- Configures grants (least-privilege)
- Optionally configures realtime

### 4. `VERIFY.sql`
**Purpose:** Prove patch worked  
**Usage:** Run after `PATCH.sql`  
**Output:** Pass/fail status for each check:
- Tables exist
- Columns exist
- Indexes exist
- RLS enabled
- Policies exist
- Triggers exist
- Functions callable
- Grants correct

### 5. `ROLLBACK.sql`
**Purpose:** Limited safety rollback  
**Safety:** 
- ✅ Safe: Drops policies, triggers, views
- ⚠️ Limited: Does NOT drop tables/columns (would lose data)
- ⚠️ Does NOT restore previous state

**What it removes:**
- RLS policies (non-destructive)
- Triggers (non-destructive)
- Views (non-destructive)
- Grants (non-destructive)
- Realtime publication membership

**What it does NOT remove:**
- Tables (would lose data)
- Columns (would lose data)
- Indexes (would impact performance)

---

## DETAILED WORKFLOW

### Step 1: Capture Reality

```bash
# Connect to your Supabase database
psql $DATABASE_URL

# Run introspection queries
\i INTROSPECTION.sql

# Save output to REALITY.md
\o REALITY.md
\i INTROSPECTION.sql
\o
```

**Or use Supabase CLI:**
```bash
supabase db execute --file INTROSPECTION.sql > REALITY.md
```

### Step 2: Analyze Gaps

1. Open `GAPS_REPORT.md`
2. Compare with your `REALITY.md` output
3. Identify which gaps exist in your database
4. Note any gaps that are intentional (e.g., realtime not enabled)

### Step 3: Apply Patch

```bash
# Review PATCH.sql first (it's safe, but always review)
# Then apply:
psql $DATABASE_URL -f PATCH.sql

# Or with Supabase CLI:
supabase db execute --file PATCH.sql
```

**Expected output:**
- `BEGIN` → Transaction starts
- Multiple `CREATE TABLE IF NOT EXISTS` → Tables created/verified
- Multiple `CREATE INDEX IF NOT EXISTS` → Indexes created/verified
- Multiple `CREATE POLICY` → Policies created/updated
- `COMMIT` → Transaction completes

**If errors occur:**
- Check error message
- Most likely: Missing `auth.users` table (Supabase auth not initialized)
- Or: Missing extensions (usually auto-enabled in Supabase)

### Step 4: Verify

```bash
psql $DATABASE_URL -f VERIFY.sql
```

**Expected:** All checks show `PASS` status

**If checks fail:**
- Review error messages
- Check if foundational tables exist (`tenants`, `tenant_members`)
- Re-run `PATCH.sql` (idempotent, safe)

### Step 5: Rollback (if needed)

```bash
# Only if you need to remove policies/triggers
psql $DATABASE_URL -f ROLLBACK.sql
```

**Note:** This does NOT restore previous state. It only removes objects added by `PATCH.sql`.

---

## KEY DESIGN DECISIONS

### 1. Idempotency
All operations use `IF NOT EXISTS` or `CREATE OR REPLACE`:
- Safe to run multiple times
- No errors if objects already exist
- Can be used in CI/CD pipelines

### 2. Tenant Isolation
- All tables reference `tenant_id`
- RLS policies enforce tenant boundaries via `tenant_members` table
- Policies use `tenant_members` (not `user_tenants` view) for correctness

### 3. Least-Privilege Grants
- `public` role: No access by default
- `authenticated`: Access via RLS policies
- `anon`: Minimal access (only `user_tenants` view)
- `service_role`: Full access (bypasses RLS)

### 4. Realtime (Optional)
- Only configured if `supabase_realtime` publication exists
- Tables added: `agents`, `workflows`, `workflow_executions`, `agent_executions`
- Replica identity NOT set by default (can be enabled if needed)

### 5. Foundational Tables
- `tenants`: Core tenant table
- `tenant_members`: User-tenant membership (used by RLS)
- `user_tenants`: Backward compatibility view

---

## TROUBLESHOOTING

### Error: "relation auth.users does not exist"
**Cause:** Supabase auth schema not initialized  
**Fix:** Ensure Supabase auth is set up. This is usually automatic in Supabase projects.

### Error: "relation tenants does not exist"
**Cause:** Foundational tables missing  
**Fix:** `PATCH.sql` creates these, but if foreign keys reference them, run in order:
1. Create `tenants` table
2. Create `tenant_members` table
3. Create other tables

### Error: "policy already exists"
**Cause:** Policy name conflict  
**Fix:** `PATCH.sql` drops policies before creating them. If error persists, manually drop conflicting policy.

### Error: "permission denied"
**Cause:** Insufficient privileges  
**Fix:** Run as `postgres` superuser or `service_role`. In Supabase, use service role key.

### RLS Policies Not Working
**Check:**
1. RLS enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
2. Policies exist: `SELECT * FROM pg_policies WHERE schemaname = 'public';`
3. User authenticated: `SELECT auth.uid();` (should return UUID)
4. User in tenant: `SELECT * FROM tenant_members WHERE user_id = auth.uid();`

---

## MIGRATION STRATEGY

### For New Databases
1. Run `PATCH.sql` → Creates everything from scratch
2. Run `VERIFY.sql` → Confirms setup

### For Existing Databases
1. Run `INTROSPECTION.sql` → Capture current state
2. Compare with `GAPS_REPORT.md` → Identify gaps
3. Run `PATCH.sql` → Fix gaps (idempotent)
4. Run `VERIFY.sql` → Confirm fixes

### For Production
1. **Test in staging first**
2. Backup database before applying patch
3. Run `PATCH.sql` during maintenance window
4. Run `VERIFY.sql` immediately after
5. Monitor application for RLS issues
6. Have `ROLLBACK.sql` ready (limited safety)

---

## INTENDED SCHEMA SUMMARY

### Core Tables (14 tables)
- `tenants`, `tenant_members` (foundational)
- `agents`, `agent_executions` (AI agents)
- `workflows`, `workflow_executions` (workflows)
- `subscriptions`, `usage_metrics`, `billing_events` (billing)
- `telemetry_events`, `workflow_execution_logs`, `agent_execution_logs`, `error_logs`, `performance_metrics` (observability)
- `webhook_endpoints`, `artifacts` (webhooks)

### Security
- RLS enabled on all tables
- Policies enforce tenant isolation
- Least-privilege grants

### Performance
- Indexes on foreign keys
- Indexes on frequently queried columns
- Indexes on tenant_id for multi-tenant queries

### Functions
- `update_updated_at_column()` - Auto-update timestamps
- `generate_webhook_secret()` - Generate secure secrets

---

## NEXT STEPS

After validation:
1. ✅ Schema matches intended state
2. ✅ RLS policies enforce tenant isolation
3. ✅ Indexes optimize queries
4. ✅ Functions and triggers work correctly

**Then:**
- Test application with real users
- Monitor RLS policy performance
- Adjust indexes based on query patterns
- Configure realtime if needed
- Set up monitoring/alerting

---

## SUPPORT

If you encounter issues:
1. Check `GAPS_REPORT.md` for expected vs actual
2. Run `VERIFY.sql` to identify specific failures
3. Review error messages from `PATCH.sql`
4. Check Supabase logs for RLS policy violations

---

**Generated:** $(date)  
**Version:** 1.0  
**Status:** Production-ready, idempotent, safe
