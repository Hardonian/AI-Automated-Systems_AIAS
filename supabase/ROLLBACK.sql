-- ============================================================================
-- SUPABASE BACKEND ROLLBACK (LIMITED SAFETY)
-- ============================================================================
-- WARNING: This rollback is LIMITED and SAFE only for:
-- - Dropping policies (non-destructive)
-- - Dropping triggers (non-destructive)
-- - Dropping indexes (non-destructive, but may impact performance)
-- - Dropping views (non-destructive)
-- 
-- DO NOT USE THIS TO:
-- - Drop tables (would lose data)
-- - Drop columns (would lose data)
-- - Modify data
--
-- This rollback only removes objects added by PATCH.sql, it does NOT
-- restore previous state or remove data.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. DROP TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
DROP TRIGGER IF EXISTS update_workflows_updated_at ON public.workflows;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_webhook_endpoints_updated_at ON public.webhook_endpoints;
DROP TRIGGER IF EXISTS update_tenant_members_updated_at ON public.tenant_members;

-- ============================================================================
-- 2. DROP RLS POLICIES
-- ============================================================================

-- Agents policies
DROP POLICY IF EXISTS "Users can view agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can create agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can update agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can delete agents in their tenant" ON public.agents;

-- Agent executions policies
DROP POLICY IF EXISTS "Users can view their agent executions" ON public.agent_executions;
DROP POLICY IF EXISTS "Users can create agent executions" ON public.agent_executions;

-- Workflows policies
DROP POLICY IF EXISTS "Users can view workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can create workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can update workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can delete workflows in their tenant" ON public.workflows;

-- Workflow executions policies
DROP POLICY IF EXISTS "Users can view their workflow executions" ON public.workflow_executions;
DROP POLICY IF EXISTS "Users can create workflow executions" ON public.workflow_executions;

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view their subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can create subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their subscriptions" ON public.subscriptions;

-- Usage metrics policies
DROP POLICY IF EXISTS "Users can view their usage metrics" ON public.usage_metrics;
DROP POLICY IF EXISTS "Users can create usage metrics" ON public.usage_metrics;

-- Billing events policies
DROP POLICY IF EXISTS "Users can view their billing events" ON public.billing_events;

-- Telemetry events policies
DROP POLICY IF EXISTS "Users can view their telemetry events" ON public.telemetry_events;
DROP POLICY IF EXISTS "Users can create telemetry events" ON public.telemetry_events;

-- Workflow execution logs policies
DROP POLICY IF EXISTS "Users can view their workflow execution logs" ON public.workflow_execution_logs;
DROP POLICY IF EXISTS "System can create workflow execution logs" ON public.workflow_execution_logs;

-- Agent execution logs policies
DROP POLICY IF EXISTS "Users can view their agent execution logs" ON public.agent_execution_logs;
DROP POLICY IF EXISTS "System can create agent execution logs" ON public.agent_execution_logs;

-- Error logs policies
DROP POLICY IF EXISTS "Users can view their error logs" ON public.error_logs;
DROP POLICY IF EXISTS "Users can create error logs" ON public.error_logs;

-- Performance metrics policies
DROP POLICY IF EXISTS "Performance metrics are readable by all authenticated users" ON public.performance_metrics;

-- Webhook endpoints policies
DROP POLICY IF EXISTS "Users can view webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can create webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can update webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can delete webhook endpoints in their tenant" ON public.webhook_endpoints;

-- Artifacts policies
DROP POLICY IF EXISTS "Users can view artifacts in their tenant" ON public.artifacts;
DROP POLICY IF EXISTS "System can create artifacts" ON public.artifacts;

-- ============================================================================
-- 3. DROP VIEWS
-- ============================================================================

DROP VIEW IF EXISTS public.user_tenants;

-- ============================================================================
-- 4. DROP FUNCTIONS (IF NOT USED ELSEWHERE)
-- ============================================================================

-- WARNING: Only drop if you're sure they're not used elsewhere
-- Uncomment if you want to remove these functions:
-- DROP FUNCTION IF EXISTS public.update_updated_at_column();
-- DROP FUNCTION IF EXISTS public.generate_webhook_secret();

-- ============================================================================
-- 5. REMOVE FROM REALTIME PUBLICATION
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.agents;
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.workflows;
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.workflow_executions;
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.agent_executions;
  END IF;
END $$;

-- ============================================================================
-- 6. REVOKE GRANTS
-- ============================================================================

-- Revoke grants from authenticated
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;

-- Revoke grants from anon
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Revoke grants from service_role (if needed)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM service_role;
    REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM service_role;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM service_role;
  END IF;
END $$;

-- ============================================================================
-- 7. DISABLE RLS (OPTIONAL - DANGEROUS)
-- ============================================================================

-- WARNING: Disabling RLS removes security. Only do this if you understand the implications.
-- Uncomment only if you need to disable RLS:

-- ALTER TABLE IF EXISTS public.tenants DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.tenant_members DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.agents DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.agent_executions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.workflows DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.workflow_executions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.subscriptions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.usage_metrics DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.billing_events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.telemetry_events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.workflow_execution_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.agent_execution_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.error_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.performance_metrics DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.webhook_endpoints DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS public.artifacts DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================

COMMIT;

-- ============================================================================
-- IMPORTANT NOTES:
-- ============================================================================
-- 1. This rollback does NOT drop tables or columns (would lose data)
-- 2. This rollback does NOT restore previous RLS policies
-- 3. This rollback does NOT restore previous grants
-- 4. Indexes are NOT dropped (would impact performance)
-- 5. To fully restore, you would need to:
--    - Restore from a database backup, OR
--    - Manually recreate previous state
-- ============================================================================
-- If you need to remove tables/columns, do so manually with extreme caution:
-- 
-- Example (DANGEROUS - only if you're sure):
-- DROP TABLE IF EXISTS public.artifacts CASCADE;
-- DROP TABLE IF EXISTS public.webhook_endpoints CASCADE;
-- ... etc
-- ============================================================================
