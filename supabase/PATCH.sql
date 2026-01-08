-- ============================================================================
-- SUPABASE BACKEND PATCH (IDEMPOTENT)
-- ============================================================================
-- This patch ensures all intended schema objects exist and are correctly configured.
-- SAFE TO RUN MULTIPLE TIMES - All operations are idempotent.
-- 
-- Prerequisites:
-- - Supabase auth schema exists (auth.users)
-- - Extensions: uuid-ossp, pgcrypto (usually enabled by default in Supabase)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. FOUNDATIONAL TABLES (Must exist before other tables)
-- ============================================================================

-- Tenants table (if not exists)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  domain TEXT,
  plan_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'trial')),
  settings JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant members table (if not exists)
CREATE TABLE IF NOT EXISTS public.tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer', 'billing')),
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'removed')),
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Add missing columns to tenants if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tenants' AND column_name = 'domain'
  ) THEN
    ALTER TABLE public.tenants ADD COLUMN domain TEXT;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Column might already exist, ignore
  NULL;
END $$;

-- Indexes for foundational tables
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_id ON public.tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user_id ON public.tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_role ON public.tenant_members(role);
CREATE INDEX IF NOT EXISTS idx_tenant_members_status ON public.tenant_members(status);

-- ============================================================================
-- 3. HELPER FUNCTIONS
-- ============================================================================

-- Updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Webhook secret generator (idempotent)
CREATE OR REPLACE FUNCTION public.generate_webhook_secret()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_bytes BYTEA;
  encoded TEXT;
BEGIN
  random_bytes := gen_random_bytes(32);
  encoded := replace(replace(encode(random_bytes, 'base64'), '+', '-'), '/', '_');
  encoded := rtrim(encoded, '=');
  RETURN encoded;
END;
$$;

-- ============================================================================
-- 4. BACKWARD COMPATIBILITY VIEW
-- ============================================================================

CREATE OR REPLACE VIEW public.user_tenants AS
SELECT 
  tenant_id,
  user_id,
  role,
  status,
  joined_at as created_at
FROM public.tenant_members
WHERE status = 'active';

GRANT SELECT ON public.user_tenants TO authenticated;
GRANT SELECT ON public.user_tenants TO anon;

-- ============================================================================
-- 5. CORE TABLES (Agents and Workflows)
-- ============================================================================

-- Agents Table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  version VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  planning_style VARCHAR(50) NOT NULL DEFAULT 'sequential',
  capabilities JSONB NOT NULL DEFAULT '{}',
  tools JSONB NOT NULL DEFAULT '[]',
  execution_config JSONB NOT NULL DEFAULT '{}',
  memory_config JSONB DEFAULT NULL,
  safety_constraints JSONB NOT NULL DEFAULT '{}',
  validation_schema JSONB DEFAULT NULL,
  output_type VARCHAR(50) NOT NULL,
  output_schema JSONB DEFAULT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  deprecated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'agents' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.agents ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'agents' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE public.agents ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Agent Executions Table
CREATE TABLE IF NOT EXISTS public.agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB DEFAULT NULL,
  error JSONB DEFAULT NULL,
  metrics JSONB DEFAULT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NULL,
  metadata JSONB DEFAULT NULL
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'agent_executions' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE public.agent_executions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Workflows Table
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  version VARCHAR(20) NOT NULL,
  trigger JSONB NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  start_step_id UUID NOT NULL,
  state_schema JSONB DEFAULT NULL,
  initial_state JSONB DEFAULT NULL,
  global_retry JSONB DEFAULT NULL,
  error_handler JSONB DEFAULT NULL,
  category VARCHAR(50) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  deprecated BOOLEAN NOT NULL DEFAULT false,
  introspectable BOOLEAN NOT NULL DEFAULT true,
  audit_log BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workflows' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.workflows ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workflows' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE public.workflows ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Workflow Executions Table
CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB DEFAULT NULL,
  error JSONB DEFAULT NULL,
  metrics JSONB DEFAULT NULL,
  state JSONB DEFAULT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NULL,
  metadata JSONB DEFAULT NULL
);

-- Add missing columns if they don't exist (workflow_executions might already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workflow_executions' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE public.workflow_executions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Add tenant_id to telemetry_events if it exists but doesn't have tenant_id
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'telemetry_events'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'telemetry_events' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE public.telemetry_events ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================================
-- 6. BILLING AND USAGE TABLES
-- ============================================================================

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'trialing',
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ DEFAULT NULL,
  trial_start TIMESTAMPTZ DEFAULT NULL,
  trial_end TIMESTAMPTZ DEFAULT NULL,
  metadata JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage Metrics Table
CREATE TABLE IF NOT EXISTS public.usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT NULL
);

-- Billing Events Table
CREATE TABLE IF NOT EXISTS public.billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. OBSERVABILITY TABLES
-- ============================================================================

-- Telemetry Events Table
CREATE TABLE IF NOT EXISTS public.telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  properties JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT NULL
);

-- Workflow Execution Logs Table
CREATE TABLE IF NOT EXISTS public.workflow_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  step_id VARCHAR(255),
  step_type VARCHAR(50),
  status VARCHAR(50) NOT NULL,
  input JSONB DEFAULT NULL,
  output JSONB DEFAULT NULL,
  error JSONB DEFAULT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  duration_ms INTEGER,
  metadata JSONB DEFAULT NULL
);

-- Agent Execution Logs Table
CREATE TABLE IF NOT EXISTS public.agent_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES public.agent_executions(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  duration INTEGER,
  token_usage INTEGER DEFAULT NULL,
  cost DECIMAL(10, 4) DEFAULT NULL,
  input JSONB DEFAULT NULL,
  output JSONB DEFAULT NULL,
  error JSONB DEFAULT NULL
);

-- Error Logs Table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  error JSONB NOT NULL,
  context JSONB DEFAULT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium',
  resolved BOOLEAN NOT NULL DEFAULT false
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metric VARCHAR(100) NOT NULL,
  value DECIMAL(12, 4) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  tags JSONB DEFAULT NULL
);

-- ============================================================================
-- 8. WEBHOOK ENDPOINTS AND ARTIFACTS
-- ============================================================================

-- Webhook Endpoints Table
CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  system_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  secret VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(200),
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Artifacts Table
CREATE TABLE IF NOT EXISTS public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  system_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  artifact_type VARCHAR(50) NOT NULL DEFAULT 'json',
  content JSONB,
  content_text TEXT,
  content_bytes BYTEA,
  metadata JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. INDEXES
-- ============================================================================

-- Agents indexes
CREATE INDEX IF NOT EXISTS idx_agents_tenant_id ON public.agents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agents_enabled ON public.agents(enabled);
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents(category);

-- Agent executions indexes
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON public.agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON public.agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_tenant_id ON public.agent_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON public.agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_started_at ON public.agent_executions(started_at);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_tenant_id ON public.workflows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflows_enabled ON public.workflows(enabled);
CREATE INDEX IF NOT EXISTS idx_workflows_category ON public.workflows(category);

-- Workflow executions indexes (only create if columns exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'workflow_executions' AND column_name = 'workflow_id') THEN
    CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'workflow_executions' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON public.workflow_executions(user_id);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'workflow_executions' AND column_name = 'tenant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_workflow_executions_tenant_id ON public.workflow_executions(tenant_id);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'workflow_executions' AND column_name = 'status') THEN
    CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON public.workflow_executions(status);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'workflow_executions' AND column_name = 'started_at') THEN
    CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON public.workflow_executions(started_at);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Billing indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON public.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_usage_metrics_user_id ON public.usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_tenant_id ON public.usage_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_metric_type ON public.usage_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_timestamp ON public.usage_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON public.billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_event_type ON public.billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_timestamp ON public.billing_events(timestamp);

-- Observability indexes (telemetry_events might already exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'telemetry_events') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'telemetry_events' AND column_name = 'type') THEN
      CREATE INDEX IF NOT EXISTS idx_telemetry_events_type ON public.telemetry_events(type);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'telemetry_events' AND column_name = 'user_id') THEN
      CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_id ON public.telemetry_events(user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'telemetry_events' AND column_name = 'tenant_id') THEN
      CREATE INDEX IF NOT EXISTS idx_telemetry_events_tenant_id ON public.telemetry_events(tenant_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'telemetry_events' AND column_name = 'timestamp') THEN
      CREATE INDEX IF NOT EXISTS idx_telemetry_events_timestamp ON public.telemetry_events(timestamp);
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_execution_id ON public.workflow_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_workflow_id ON public.workflow_execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_user_id ON public.workflow_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_status ON public.workflow_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_started_at ON public.workflow_execution_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_step_id ON public.workflow_execution_logs(step_id);

CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_execution_id ON public.agent_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_agent_id ON public.agent_execution_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_user_id ON public.agent_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_status ON public.agent_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_started_at ON public.agent_execution_logs(started_at);

CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON public.error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON public.error_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric ON public.performance_metrics(metric);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON public.performance_metrics(timestamp);

-- Webhook endpoints indexes
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_tenant_id ON public.webhook_endpoints(tenant_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_system_id ON public.webhook_endpoints(system_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_secret ON public.webhook_endpoints(secret);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_enabled ON public.webhook_endpoints(enabled);

-- Artifacts indexes
CREATE INDEX IF NOT EXISTS idx_artifacts_run_id ON public.artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_id ON public.artifacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_system_id ON public.artifacts(system_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON public.artifacts(created_at);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.artifacts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 11. RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Members can view tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view tenant memberships" ON public.tenant_members;
DROP POLICY IF EXISTS "Admins can manage tenant memberships" ON public.tenant_members;
DROP POLICY IF EXISTS "Service role can manage tenant memberships" ON public.tenant_members;

DROP POLICY IF EXISTS "Users can view agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can create agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can update agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can delete agents in their tenant" ON public.agents;
DROP POLICY IF EXISTS "Users can view their agent executions" ON public.agent_executions;
DROP POLICY IF EXISTS "Users can create agent executions" ON public.agent_executions;
DROP POLICY IF EXISTS "Users can view workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can create workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can update workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can delete workflows in their tenant" ON public.workflows;
DROP POLICY IF EXISTS "Users can view their workflow executions" ON public.workflow_executions;
DROP POLICY IF EXISTS "Users can create workflow executions" ON public.workflow_executions;
DROP POLICY IF EXISTS "Users can view their subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can create subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their usage metrics" ON public.usage_metrics;
DROP POLICY IF EXISTS "Users can create usage metrics" ON public.usage_metrics;
DROP POLICY IF EXISTS "Users can view their billing events" ON public.billing_events;
DROP POLICY IF EXISTS "Users can view their telemetry events" ON public.telemetry_events;
DROP POLICY IF EXISTS "Users can create telemetry events" ON public.telemetry_events;
DROP POLICY IF EXISTS "Users can view their workflow execution logs" ON public.workflow_execution_logs;
DROP POLICY IF EXISTS "System can create workflow execution logs" ON public.workflow_execution_logs;
DROP POLICY IF EXISTS "Service role can create workflow execution logs" ON public.workflow_execution_logs;
DROP POLICY IF EXISTS "Users can view their agent execution logs" ON public.agent_execution_logs;
DROP POLICY IF EXISTS "System can create agent execution logs" ON public.agent_execution_logs;
DROP POLICY IF EXISTS "Service role can create agent execution logs" ON public.agent_execution_logs;
DROP POLICY IF EXISTS "Users can view their error logs" ON public.error_logs;
DROP POLICY IF EXISTS "Users can create error logs" ON public.error_logs;
DROP POLICY IF EXISTS "Performance metrics are readable by all authenticated users" ON public.performance_metrics;
DROP POLICY IF EXISTS "Users can view webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can create webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can update webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can delete webhook endpoints in their tenant" ON public.webhook_endpoints;
DROP POLICY IF EXISTS "Users can view artifacts in their tenant" ON public.artifacts;
DROP POLICY IF EXISTS "System can create artifacts" ON public.artifacts;
DROP POLICY IF EXISTS "Service role can create artifacts" ON public.artifacts;

-- ----------------------------------------------------------------------------
-- Tenancy policies (critical)
-- ----------------------------------------------------------------------------
-- Tenants: members can view tenants they belong to.
CREATE POLICY "Members can view tenants"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT tenant_id
      FROM public.tenant_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Tenant memberships:
-- - any user can view their own membership rows
-- - admins can view all membership rows within their tenant
CREATE POLICY "Users can view tenant memberships"
  ON public.tenant_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.tenant_members tm
      WHERE tm.tenant_id = tenant_members.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'active'
        AND tm.role = 'admin'
    )
  );

-- NOTE: Membership creation/removal should be server-controlled.
-- If you later need self-service invites, add tightly-scoped policies for that flow.
CREATE POLICY "Admins can manage tenant memberships"
  ON public.tenant_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tenant_members tm
      WHERE tm.tenant_id = tenant_members.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'active'
        AND tm.role = 'admin'
    )
  );

-- Agents RLS Policies
CREATE POLICY "Users can view agents in their tenant"
  ON public.agents FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create agents in their tenant"
  ON public.agents FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update agents in their tenant"
  ON public.agents FOR UPDATE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete agents in their tenant"
  ON public.agents FOR DELETE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Agent Executions RLS Policies
CREATE POLICY "Users can view their agent executions"
  ON public.agent_executions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    AND (
      tenant_id IS NULL OR tenant_id IN (
        SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

CREATE POLICY "Users can create agent executions"
  ON public.agent_executions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      tenant_id IS NULL OR tenant_id IN (
        SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

-- Workflows RLS Policies
CREATE POLICY "Users can view workflows in their tenant"
  ON public.workflows FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create workflows in their tenant"
  ON public.workflows FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update workflows in their tenant"
  ON public.workflows FOR UPDATE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete workflows in their tenant"
  ON public.workflows FOR DELETE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Workflow Executions RLS Policies
CREATE POLICY "Users can view their workflow executions"
  ON public.workflow_executions FOR SELECT
  TO authenticated
  USING (
    (user_id = auth.uid() AND (
      tenant_id IS NULL OR tenant_id IN (
        SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
      )
    ))
    OR (user_id IS NULL AND tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    ))
  );

CREATE POLICY "Users can create workflow executions"
  ON public.workflow_executions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      tenant_id IS NULL OR tenant_id IN (
        SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

-- Subscriptions RLS Policies
CREATE POLICY "Users can view their subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active' AND role = 'admin'
  ));

-- Usage Metrics RLS Policies
CREATE POLICY "Users can view their usage metrics"
  ON public.usage_metrics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create usage metrics"
  ON public.usage_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Billing Events RLS Policies
CREATE POLICY "Users can view their billing events"
  ON public.billing_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Telemetry Events RLS Policies
CREATE POLICY "Users can view their telemetry events"
  ON public.telemetry_events FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (tenant_id IS NOT NULL AND tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    ))
  );

CREATE POLICY "Users can create telemetry events"
  ON public.telemetry_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Workflow Execution Logs RLS Policies
CREATE POLICY "Users can view their workflow execution logs"
  ON public.workflow_execution_logs FOR SELECT
  TO authenticated
  USING (
    (user_id = auth.uid())
    OR (tenant_id IS NOT NULL AND tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    ))
  );

CREATE POLICY "Service role can create workflow execution logs"
  ON public.workflow_execution_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Agent Execution Logs RLS Policies
CREATE POLICY "Users can view their agent execution logs"
  ON public.agent_execution_logs FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    AND (
      tenant_id IS NULL OR tenant_id IN (
        SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

CREATE POLICY "Service role can create agent execution logs"
  ON public.agent_execution_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Error Logs RLS Policies
CREATE POLICY "Users can view their error logs"
  ON public.error_logs FOR SELECT
  TO authenticated
  USING (
    (user_id = auth.uid())
    OR (tenant_id IS NOT NULL AND tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    ))
  );

CREATE POLICY "Users can create error logs"
  ON public.error_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND (tenant_id IS NULL OR tenant_id IN (
    SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
  )));

-- Performance Metrics RLS Policies
CREATE POLICY "Performance metrics are readable by all authenticated users"
  ON public.performance_metrics FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Webhook Endpoints RLS Policies
CREATE POLICY "Users can view webhook endpoints in their tenant"
  ON public.webhook_endpoints FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id
      FROM public.tenant_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('admin', 'billing')
    )
  );

CREATE POLICY "Users can create webhook endpoints in their tenant"
  ON public.webhook_endpoints FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id
      FROM public.tenant_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('admin', 'billing')
    )
  );

CREATE POLICY "Users can update webhook endpoints in their tenant"
  ON public.webhook_endpoints FOR UPDATE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id
      FROM public.tenant_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('admin', 'billing')
    )
  );

CREATE POLICY "Users can delete webhook endpoints in their tenant"
  ON public.webhook_endpoints FOR DELETE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id
      FROM public.tenant_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('admin', 'billing')
    )
  );

-- Artifacts RLS Policies
CREATE POLICY "Users can view artifacts in their tenant"
  ON public.artifacts FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Service role can create artifacts"
  ON public.artifacts FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- 12. TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
DROP TRIGGER IF EXISTS update_workflows_updated_at ON public.workflows;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_webhook_endpoints_updated_at ON public.webhook_endpoints;
DROP TRIGGER IF EXISTS update_tenant_members_updated_at ON public.tenant_members;

-- Create triggers
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhook_endpoints_updated_at
  BEFORE UPDATE ON public.webhook_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_members_updated_at
  BEFORE UPDATE ON public.tenant_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 13. GRANTS (LEAST-PRIVILEGE)
-- ============================================================================

-- Revoke public access by default
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public;

-- Grant to authenticated role (RLS will enforce access)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.user_tenants TO authenticated;

-- Client-facing tables (scoped grants; RLS still applies)
GRANT SELECT ON public.tenants TO authenticated;
GRANT SELECT ON public.tenant_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_executions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflows TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_executions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT SELECT, INSERT ON public.usage_metrics TO authenticated;
GRANT SELECT ON public.billing_events TO authenticated;
GRANT SELECT, INSERT ON public.telemetry_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhook_endpoints TO authenticated;

-- Intentionally NOT granted to `authenticated` (server-only / sensitive-by-default):
-- - workflow_execution_logs, agent_execution_logs, error_logs, artifacts, performance_metrics
-- - generate_webhook_secret(): should be server/service-only

-- Grant to anon role (limited, RLS will enforce access)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.user_tenants TO anon;

-- Service role has full access (bypasses RLS)
-- Note: service_role permissions are typically managed by Supabase, but we ensure they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
  END IF;
END $$;

-- ============================================================================
-- 14. REALTIME CONFIGURATION (OPTIONAL)
-- ============================================================================

-- Add tables to realtime publication if publication exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Add tables to realtime publication (IF NOT EXISTS not supported, so check first)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agents') 
       AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'agents') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflows')
       AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'workflows') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.workflows;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflow_executions')
       AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'workflow_executions') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_executions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agent_executions')
       AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'agent_executions') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_executions;
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Set replica identity for UPDATE/DELETE payloads (if needed)
-- ALTER TABLE public.agents REPLICA IDENTITY FULL;
-- ALTER TABLE public.workflows REPLICA IDENTITY FULL;
-- Note: Only enable if you need full row data in UPDATE/DELETE events

-- ============================================================================
-- PATCH COMPLETE
-- ============================================================================

COMMIT;

-- ============================================================================
-- NOTES:
-- - All operations are idempotent (safe to run multiple times)
-- - RLS policies use tenant_members table (not user_tenants view) for correctness
-- - Realtime is configured only if supabase_realtime publication exists
-- - Grants follow least-privilege principle
-- - Run VERIFY.sql after this patch to confirm everything is correct
-- ============================================================================
