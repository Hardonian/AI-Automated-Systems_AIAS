# SUPABASE BACKEND GAPS REPORT

**Generated:** $(date)  
**Purpose:** Evidence-based comparison of intended vs actual database state  
**Methodology:** Introspection queries + migration analysis

---

## EXECUTIVE SUMMARY

This report identifies gaps between the intended schema (from migrations) and the actual database state. All findings are evidence-based from SQL introspection queries.

### Critical Gaps (Must Fix)
- [ ] **Foundational Tables Missing**: `tenants`, `tenant_members` may not exist
- [ ] **RLS Policies**: May reference non-existent `user_tenants` table instead of `tenant_members`
- [ ] **Realtime Configuration**: Tables may not be in `supabase_realtime` publication

### High Priority Gaps
- [ ] **Missing Indexes**: Performance-critical indexes may be missing
- [ ] **Missing Triggers**: `updated_at` triggers may not be set up
- [ ] **Function Security**: Functions may not have proper `search_path` settings

### Medium Priority Gaps
- [ ] **Column Defaults**: Some columns may have incorrect defaults
- [ ] **Foreign Key Constraints**: Some FKs may be missing or incorrect
- [ ] **Grants**: Permissions may be over-permissive

---

## DETAILED FINDINGS

### 1. FOUNDATIONAL TABLES

#### Expected Tables (from migrations):
- `tenants` (id, name, subdomain, plan_id, status, settings, limits, created_at, updated_at)
- `tenant_members` (id, tenant_id, user_id, role, permissions, status, joined_at, created_at, updated_at)

#### Gap Analysis:
**RUN THIS QUERY TO VERIFY:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('tenants', 'tenant_members')
ORDER BY table_name;
```

**Expected Result:** 2 rows (tenants, tenant_members)  
**If Missing:** These tables MUST exist before other migrations can work.

---

### 2. CORE TABLES (Agents & Workflows)

#### Expected Tables:
- `agents` (15 columns including tenant_id, created_by, capabilities JSONB)
- `agent_executions` (11 columns)
- `workflows` (16 columns)
- `workflow_executions` (11 columns)

#### Gap Analysis:
**RUN THIS QUERY TO VERIFY:**
```sql
SELECT table_name, 
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('agents', 'agent_executions', 'workflows', 'workflow_executions')
ORDER BY table_name;
```

**Expected Column Counts:**
- `agents`: 15 columns
- `agent_executions`: 11 columns
- `workflows`: 16 columns
- `workflow_executions`: 11 columns

**Common Gaps:**
- Missing `tenant_id` column (critical for RLS)
- Missing `created_by` column
- Incorrect JSONB column defaults

---

### 3. BILLING TABLES

#### Expected Tables:
- `subscriptions` (13 columns)
- `usage_metrics` (6 columns)
- `billing_events` (5 columns)

#### Gap Analysis:
**RUN THIS QUERY TO VERIFY:**
```sql
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('subscriptions', 'usage_metrics', 'billing_events')
ORDER BY table_name;
```

**Common Gaps:**
- Missing Stripe integration columns (`stripe_subscription_id`, `stripe_customer_id`)
- Missing `tenant_id` for multi-tenant billing

---

### 4. OBSERVABILITY TABLES

#### Expected Tables:
- `telemetry_events` (7 columns)
- `workflow_execution_logs` (12 columns)
- `agent_execution_logs` (10 columns)
- `error_logs` (7 columns)
- `performance_metrics` (5 columns)

#### Gap Analysis:
**RUN THIS QUERY TO VERIFY:**
```sql
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'telemetry_events', 
    'workflow_execution_logs', 
    'agent_execution_logs',
    'error_logs',
    'performance_metrics'
  )
ORDER BY table_name;
```

**Common Gaps:**
- Missing `step_id`, `step_type` columns in `workflow_execution_logs` (from consolidated migration)
- Missing `duration_ms` vs `duration` inconsistency

---

### 5. WEBHOOK TABLES

#### Expected Tables:
- `webhook_endpoints` (8 columns)
- `artifacts` (8 columns)

#### Gap Analysis:
**RUN THIS QUERY TO VERIFY:**
```sql
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('webhook_endpoints', 'artifacts')
ORDER BY table_name;
```

---

### 6. ROW LEVEL SECURITY (RLS)

#### Expected: RLS enabled on ALL tables

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** All tables should have `rls_enabled = true`

#### RLS Policies

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected Policy Counts (minimum):**
- `agents`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- `workflows`: 4 policies
- `agent_executions`: 2 policies (SELECT, INSERT)
- `workflow_executions`: 2 policies
- `subscriptions`: 3 policies
- `usage_metrics`: 2 policies
- `billing_events`: 1 policy (SELECT)
- `telemetry_events`: 2 policies
- `workflow_execution_logs`: 2 policies
- `agent_execution_logs`: 2 policies
- `error_logs`: 2 policies
- `performance_metrics`: 1 policy
- `webhook_endpoints`: 4 policies
- `artifacts`: 2 policies

**Critical Gap:** Policies may reference `user_tenants` view instead of `tenant_members` table directly.

---

### 7. INDEXES

#### Expected Indexes (Performance Critical):

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

**Expected Indexes:**
- `idx_agents_tenant_id`, `idx_agents_enabled`, `idx_agents_category`
- `idx_agent_executions_agent_id`, `idx_agent_executions_user_id`, `idx_agent_executions_tenant_id`, `idx_agent_executions_status`, `idx_agent_executions_started_at`
- `idx_workflows_tenant_id`, `idx_workflows_enabled`, `idx_workflows_category`
- `idx_workflow_executions_workflow_id`, `idx_workflow_executions_user_id`, `idx_workflow_executions_tenant_id`, `idx_workflow_executions_status`, `idx_workflow_executions_started_at`
- `idx_subscriptions_user_id`, `idx_subscriptions_tenant_id`, `idx_subscriptions_status`, `idx_subscriptions_stripe_subscription_id`
- `idx_usage_metrics_user_id`, `idx_usage_metrics_tenant_id`, `idx_usage_metrics_metric_type`, `idx_usage_metrics_timestamp`
- `idx_billing_events_user_id`, `idx_billing_events_event_type`, `idx_billing_events_timestamp`
- `idx_telemetry_events_type`, `idx_telemetry_events_user_id`, `idx_telemetry_events_tenant_id`, `idx_telemetry_events_timestamp`
- `idx_workflow_execution_logs_execution_id`, `idx_workflow_execution_logs_workflow_id`, `idx_workflow_execution_logs_user_id`, `idx_workflow_execution_logs_status`, `idx_workflow_execution_logs_started_at`, `idx_workflow_execution_logs_step_id`
- `idx_agent_execution_logs_execution_id`, `idx_agent_execution_logs_agent_id`, `idx_agent_execution_logs_user_id`, `idx_agent_execution_logs_status`, `idx_agent_execution_logs_started_at`
- `idx_error_logs_user_id`, `idx_error_logs_tenant_id`, `idx_error_logs_severity`, `idx_error_logs_resolved`, `idx_error_logs_timestamp`
- `idx_performance_metrics_metric`, `idx_performance_metrics_timestamp`
- `idx_webhook_endpoints_tenant_id`, `idx_webhook_endpoints_system_id`, `idx_webhook_endpoints_secret`, `idx_webhook_endpoints_enabled`
- `idx_artifacts_run_id`, `idx_artifacts_tenant_id`, `idx_artifacts_system_id`, `idx_artifacts_created_at`

---

### 8. FUNCTIONS

#### Expected Functions:
- `update_updated_at_column()` - Trigger function for updated_at
- `generate_webhook_secret()` - Generates webhook secrets

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT proname, pg_get_functiondef(oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND proname IN ('update_updated_at_column', 'generate_webhook_secret')
ORDER BY proname;
```

**Gap:** Functions may not have `SECURITY DEFINER` with proper `search_path` if needed.

---

### 9. TRIGGERS

#### Expected Triggers:
- `update_agents_updated_at` ON `agents`
- `update_workflows_updated_at` ON `workflows`
- `update_subscriptions_updated_at` ON `subscriptions`
- `update_webhook_endpoints_updated_at` ON `webhook_endpoints`

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT c.relname as table_name, t.tgname as trigger_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;
```

---

### 10. VIEWS

#### Expected Views:
- `user_tenants` - Backward compatibility view mapping to `tenant_members`

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT table_name, view_definition
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name = 'user_tenants';
```

---

### 11. REALTIME CONFIGURATION

#### Expected: Tables in `supabase_realtime` publication

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT pt.tablename
FROM pg_publication p
JOIN pg_publication_tables pt ON p.pubname = pt.pubname
WHERE p.pubname LIKE '%realtime%'
ORDER BY pt.tablename;
```

**Expected Tables (if realtime is needed):**
- `agents`
- `workflows`
- `workflow_executions`
- `agent_executions`

**Gap:** Tables may not be in publication, or replica identity may not be set.

---

### 12. GRANTS (PERMISSIONS)

#### Expected: Least-privilege grants

**RUN THIS QUERY TO VERIFY:**
```sql
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;
```

**Expected:**
- `anon`: Limited SELECT grants (if any)
- `authenticated`: SELECT/INSERT/UPDATE/DELETE based on RLS policies
- `service_role`: Full access (bypasses RLS)

**Gap:** Public schema may have overly permissive grants.

---

## NEXT STEPS

1. **Run INTROSPECTION.sql** against your Supabase database
2. **Save output** to `REALITY.md` for evidence
3. **Compare** findings with this GAPS REPORT
4. **Apply PATCH.sql** to fix identified gaps
5. **Run VERIFY.sql** to confirm fixes

---

## NOTES

- This report is based on migration analysis. Actual gaps may vary.
- Always verify with introspection queries before applying patches.
- Some gaps may be intentional (e.g., realtime not enabled for all tables).
- The consolidated migration (`000000000000_consolidated_reality_mode_hardening.sql`) is the source of truth for intended state.
