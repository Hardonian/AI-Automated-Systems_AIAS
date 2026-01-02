-- ============================================================================
-- SUPABASE BACKEND VERIFICATION QUERIES
-- ============================================================================
-- Run these queries after applying PATCH.sql to verify everything is correct
-- All queries should return expected results (no errors, correct counts)
-- ============================================================================

-- ============================================================================
-- 1. FOUNDATIONAL TABLES VERIFICATION
-- ============================================================================

-- Verify tenants table exists
SELECT 
  'tenants table exists' as check_name,
  CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END as status,
  COUNT(*) as found_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'tenants';

-- Verify tenant_members table exists
SELECT 
  'tenant_members table exists' as check_name,
  CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END as status,
  COUNT(*) as found_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'tenant_members';

-- Verify user_tenants view exists
SELECT 
  'user_tenants view exists' as check_name,
  CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END as status,
  COUNT(*) as found_count
FROM information_schema.views 
WHERE table_schema = 'public' AND table_name = 'user_tenants';

-- ============================================================================
-- 2. CORE TABLES VERIFICATION
-- ============================================================================

-- Verify all core tables exist
SELECT 
  'Core tables exist' as check_name,
  CASE 
    WHEN COUNT(*) = 4 THEN 'PASS' 
    ELSE 'FAIL - Expected 4 tables, found ' || COUNT(*)::text 
  END as status,
  string_agg(table_name, ', ') as tables_found
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('agents', 'agent_executions', 'workflows', 'workflow_executions');

-- Verify agents table has required columns
SELECT 
  'agents table columns' as check_name,
  CASE 
    WHEN COUNT(*) >= 15 THEN 'PASS' 
    ELSE 'FAIL - Expected at least 15 columns, found ' || COUNT(*)::text 
  END as status,
  COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'agents';

-- Verify tenant_id columns exist in core tables
SELECT 
  'tenant_id columns exist' as check_name,
  CASE 
    WHEN COUNT(*) = 4 THEN 'PASS' 
    ELSE 'FAIL - Expected tenant_id in 4 tables, found in ' || COUNT(*)::text 
  END as status,
  string_agg(table_name, ', ') as tables_with_tenant_id
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'tenant_id'
  AND table_name IN ('agents', 'agent_executions', 'workflows', 'workflow_executions');

-- ============================================================================
-- 3. BILLING TABLES VERIFICATION
-- ============================================================================

SELECT 
  'Billing tables exist' as check_name,
  CASE 
    WHEN COUNT(*) = 3 THEN 'PASS' 
    ELSE 'FAIL - Expected 3 tables, found ' || COUNT(*)::text 
  END as status,
  string_agg(table_name, ', ') as tables_found
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('subscriptions', 'usage_metrics', 'billing_events');

-- ============================================================================
-- 4. OBSERVABILITY TABLES VERIFICATION
-- ============================================================================

SELECT 
  'Observability tables exist' as check_name,
  CASE 
    WHEN COUNT(*) = 5 THEN 'PASS' 
    ELSE 'FAIL - Expected 5 tables, found ' || COUNT(*)::text 
  END as status,
  string_agg(table_name, ', ') as tables_found
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'telemetry_events', 
    'workflow_execution_logs', 
    'agent_execution_logs',
    'error_logs',
    'performance_metrics'
  );

-- ============================================================================
-- 5. WEBHOOK TABLES VERIFICATION
-- ============================================================================

SELECT 
  'Webhook tables exist' as check_name,
  CASE 
    WHEN COUNT(*) = 2 THEN 'PASS' 
    ELSE 'FAIL - Expected 2 tables, found ' || COUNT(*)::text 
  END as status,
  string_agg(table_name, ', ') as tables_found
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('webhook_endpoints', 'artifacts');

-- ============================================================================
-- 6. FUNCTIONS VERIFICATION
-- ============================================================================

SELECT 
  'Helper functions exist' as check_name,
  CASE 
    WHEN COUNT(*) = 2 THEN 'PASS' 
    ELSE 'FAIL - Expected 2 functions, found ' || COUNT(*)::text 
  END as status,
  string_agg(proname, ', ') as functions_found
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND proname IN ('update_updated_at_column', 'generate_webhook_secret');

-- ============================================================================
-- 7. INDEXES VERIFICATION
-- ============================================================================

-- Count indexes per table (should have at least the critical ones)
SELECT 
  tablename,
  COUNT(*) as index_count,
  CASE 
    WHEN tablename = 'agents' AND COUNT(*) >= 3 THEN 'PASS'
    WHEN tablename = 'agent_executions' AND COUNT(*) >= 5 THEN 'PASS'
    WHEN tablename = 'workflows' AND COUNT(*) >= 3 THEN 'PASS'
    WHEN tablename = 'workflow_executions' AND COUNT(*) >= 5 THEN 'PASS'
    WHEN tablename IN ('subscriptions', 'usage_metrics', 'billing_events') AND COUNT(*) >= 2 THEN 'PASS'
    WHEN tablename IN ('telemetry_events', 'error_logs', 'performance_metrics') AND COUNT(*) >= 2 THEN 'PASS'
    WHEN tablename IN ('workflow_execution_logs', 'agent_execution_logs') AND COUNT(*) >= 5 THEN 'PASS'
    WHEN tablename IN ('webhook_endpoints', 'artifacts') AND COUNT(*) >= 3 THEN 'PASS'
    ELSE 'CHECK'
  END as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- 8. RLS VERIFICATION
-- ============================================================================

-- Verify RLS is enabled on all tables
SELECT 
  'RLS enabled on all tables' as check_name,
  CASE 
    WHEN COUNT(*) = COUNT(*) FILTER (WHERE rowsecurity = true) THEN 'PASS'
    ELSE 'FAIL - ' || COUNT(*) FILTER (WHERE rowsecurity = false)::text || ' tables without RLS'
  END as status,
  COUNT(*) FILTER (WHERE rowsecurity = true) as rls_enabled_count,
  COUNT(*) FILTER (WHERE rowsecurity = false) as rls_disabled_count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%';

-- Verify RLS policies exist
SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN tablename = 'agents' AND COUNT(*) >= 4 THEN 'PASS'
    WHEN tablename = 'workflows' AND COUNT(*) >= 4 THEN 'PASS'
    WHEN tablename IN ('agent_executions', 'workflow_executions') AND COUNT(*) >= 2 THEN 'PASS'
    WHEN tablename = 'subscriptions' AND COUNT(*) >= 3 THEN 'PASS'
    WHEN tablename IN ('usage_metrics', 'billing_events') AND COUNT(*) >= 2 THEN 'PASS'
    WHEN tablename IN ('telemetry_events', 'error_logs') AND COUNT(*) >= 2 THEN 'PASS'
    WHEN tablename IN ('workflow_execution_logs', 'agent_execution_logs') AND COUNT(*) >= 2 THEN 'PASS'
    WHEN tablename = 'performance_metrics' AND COUNT(*) >= 1 THEN 'PASS'
    WHEN tablename = 'webhook_endpoints' AND COUNT(*) >= 4 THEN 'PASS'
    WHEN tablename = 'artifacts' AND COUNT(*) >= 2 THEN 'PASS'
    ELSE 'CHECK'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- 9. TRIGGERS VERIFICATION
-- ============================================================================

SELECT 
  'Triggers exist' as check_name,
  CASE 
    WHEN COUNT(*) >= 5 THEN 'PASS' 
    ELSE 'FAIL - Expected at least 5 triggers, found ' || COUNT(*)::text 
  END as status,
  string_agg(c.relname || '.' || t.tgname, ', ') as triggers_found
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND NOT t.tgisinternal
  AND t.tgname LIKE '%updated_at%';

-- ============================================================================
-- 10. GRANTS VERIFICATION
-- ============================================================================

-- Verify authenticated role has access
SELECT 
  'Authenticated role grants' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN 'PASS' 
    ELSE 'FAIL - No grants found for authenticated role'
  END as status,
  COUNT(*) as grant_count
FROM information_schema.role_table_grants
WHERE grantee = 'authenticated'
  AND table_schema = 'public';

-- Verify anon role has limited access
SELECT 
  'Anon role grants' as check_name,
  CASE 
    WHEN COUNT(*) <= 1 THEN 'PASS' 
    ELSE 'WARN - Anon role has ' || COUNT(*)::text || ' grants (should be minimal)'
  END as status,
  COUNT(*) as grant_count
FROM information_schema.role_table_grants
WHERE grantee = 'anon'
  AND table_schema = 'public';

-- ============================================================================
-- 11. REALTIME VERIFICATION (OPTIONAL)
-- ============================================================================

-- Check if realtime publication exists and has tables
SELECT 
  'Realtime publication' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN 'PASS - Realtime configured'
    ELSE 'INFO - Realtime not configured (optional)'
  END as status,
  COUNT(*) as table_count,
  string_agg(pt.tablename, ', ') as tables_in_publication
FROM pg_publication p
JOIN pg_publication_tables pt ON p.pubname = pt.pubname
WHERE p.pubname LIKE '%realtime%'
  AND pt.schemaname = 'public';

-- ============================================================================
-- 12. FOREIGN KEY CONSTRAINTS VERIFICATION
-- ============================================================================

-- Verify foreign keys to tenants table
SELECT 
  'Foreign keys to tenants' as check_name,
  CASE 
    WHEN COUNT(*) >= 10 THEN 'PASS' 
    ELSE 'WARN - Expected at least 10 FKs to tenants, found ' || COUNT(*)::text 
  END as status,
  COUNT(*) as fk_count,
  string_agg(tc.table_name || '.' || kc.column_name, ', ') as foreign_keys
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kc ON tc.constraint_name = kc.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'tenants';

-- ============================================================================
-- 13. SMOKE TEST (INSERT/SELECT)
-- ============================================================================

-- Note: This test requires an authenticated user context
-- Run this in a session with auth.uid() set

-- Test 1: Verify we can query user_tenants view
SELECT 
  'user_tenants view queryable' as check_name,
  CASE 
    WHEN COUNT(*) >= 0 THEN 'PASS' 
    ELSE 'FAIL'
  END as status
FROM public.user_tenants;

-- Test 2: Verify functions are callable
SELECT 
  'generate_webhook_secret callable' as check_name,
  CASE 
    WHEN public.generate_webhook_secret() IS NOT NULL THEN 'PASS' 
    ELSE 'FAIL'
  END as status;

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Overall status summary
SELECT 
  'VERIFICATION COMPLETE' as summary,
  'Review all checks above. All should show PASS status.' as instructions,
  'If any checks fail, review PATCH.sql and reapply.' as next_steps;

-- ============================================================================
-- END OF VERIFICATION
-- ============================================================================
