-- ============================================================================
-- CONSOLIDATED MIGRATION: AIAS Reality Mode Hardening
-- ============================================================================
-- This migration consolidates all schema changes needed for:
-- - Webhook endpoints and artifacts
-- - Enhanced RLS policies
-- - Observability improvements
-- - Billing and usage tracking
--
-- SAFE TO RUN: Uses IF NOT EXISTS and DROP IF EXISTS for idempotency
-- RLS ENABLED: All tables have Row Level Security enabled
-- ============================================================================

-- ============================================================================
-- 1. HELPER FUNCTIONS
-- ============================================================================

-- Updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Webhook secret generator (idempotent)
CREATE OR REPLACE FUNCTION generate_webhook_secret()
RETURNS TEXT AS $$
DECLARE
  random_bytes BYTEA;
  encoded TEXT;
BEGIN
  random_bytes := gen_random_bytes(32);
  encoded := replace(replace(encode(random_bytes, 'base64'), '+', '-'), '/', '_');
  encoded := rtrim(encoded, '=');
  RETURN encoded;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. BACKWARD COMPATIBILITY VIEW
-- ============================================================================

-- Create user_tenants view for backward compatibility
CREATE OR REPLACE VIEW user_tenants AS
SELECT 
  tenant_id,
  user_id,
  role,
  status,
  joined_at as created_at
FROM tenant_members
WHERE status = 'active';

GRANT SELECT ON user_tenants TO authenticated;
GRANT SELECT ON user_tenants TO anon;

-- ============================================================================
-- 3. CORE TABLES (Agents and Workflows)
-- ============================================================================

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
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
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE
);

-- Agent Executions Table
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB DEFAULT NULL,
  error JSONB DEFAULT NULL,
  metrics JSONB DEFAULT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NULL,
  metadata JSONB DEFAULT NULL
);

-- Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
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
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE
);

-- Workflow Executions Table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
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

-- ============================================================================
-- 4. BILLING AND USAGE TABLES
-- ============================================================================

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT NULL
);

-- Billing Events Table
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. OBSERVABILITY TABLES
-- ============================================================================

-- Telemetry Events Table
CREATE TABLE IF NOT EXISTS telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  properties JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT NULL
);

-- Workflow Execution Logs Table
CREATE TABLE IF NOT EXISTS workflow_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
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
CREATE TABLE IF NOT EXISTS agent_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
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
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  error JSONB NOT NULL,
  context JSONB DEFAULT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium',
  resolved BOOLEAN NOT NULL DEFAULT false
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metric VARCHAR(100) NOT NULL,
  value DECIMAL(12, 4) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  tags JSONB DEFAULT NULL
);

-- ============================================================================
-- 6. WEBHOOK ENDPOINTS AND ARTIFACTS
-- ============================================================================

-- Webhook Endpoints Table
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  system_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  secret VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(200),
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Artifacts Table
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  system_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  artifact_type VARCHAR(50) NOT NULL DEFAULT 'json',
  content JSONB,
  content_text TEXT,
  content_bytes BYTEA,
  metadata JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. INDEXES
-- ============================================================================

-- Agents indexes
CREATE INDEX IF NOT EXISTS idx_agents_tenant_id ON agents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agents_enabled ON agents(enabled);
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);

-- Agent executions indexes
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_tenant_id ON agent_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_started_at ON agent_executions(started_at);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_tenant_id ON workflows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflows_enabled ON workflows(enabled);
CREATE INDEX IF NOT EXISTS idx_workflows_category ON workflows(category);

-- Workflow executions indexes
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_tenant_id ON workflow_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON workflow_executions(started_at);

-- Billing indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_usage_metrics_user_id ON usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_tenant_id ON usage_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_metric_type ON usage_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_timestamp ON usage_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_event_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_timestamp ON billing_events(timestamp);

-- Observability indexes
CREATE INDEX IF NOT EXISTS idx_telemetry_events_type ON telemetry_events(type);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_id ON telemetry_events(user_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_tenant_id ON telemetry_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_timestamp ON telemetry_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_execution_id ON workflow_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_workflow_id ON workflow_execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_user_id ON workflow_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_status ON workflow_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_started_at ON workflow_execution_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_step_id ON workflow_execution_logs(step_id);

CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_execution_id ON agent_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_agent_id ON agent_execution_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_user_id ON agent_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_status ON agent_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_agent_execution_logs_started_at ON agent_execution_logs(started_at);

CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric ON performance_metrics(metric);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Webhook endpoints indexes
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_tenant_id ON webhook_endpoints(tenant_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_system_id ON webhook_endpoints(system_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_secret ON webhook_endpoints(secret);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_enabled ON webhook_endpoints(enabled);

-- Artifacts indexes
CREATE INDEX IF NOT EXISTS idx_artifacts_run_id ON artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_id ON artifacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_system_id ON artifacts(system_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts(created_at);

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can create agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can update agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can delete agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can view their agent executions" ON agent_executions;
DROP POLICY IF EXISTS "Users can create agent executions" ON agent_executions;
DROP POLICY IF EXISTS "Users can view workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can create workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can update workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can delete workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can view their workflow executions" ON workflow_executions;
DROP POLICY IF EXISTS "Users can create workflow executions" ON workflow_executions;
DROP POLICY IF EXISTS "Users can view their subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can create subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view their usage metrics" ON usage_metrics;
DROP POLICY IF EXISTS "Users can create usage metrics" ON usage_metrics;
DROP POLICY IF EXISTS "Users can view their billing events" ON billing_events;
DROP POLICY IF EXISTS "Users can view their telemetry events" ON telemetry_events;
DROP POLICY IF EXISTS "Users can create telemetry events" ON telemetry_events;
DROP POLICY IF EXISTS "Users can view their workflow execution logs" ON workflow_execution_logs;
DROP POLICY IF EXISTS "Users can view their agent execution logs" ON agent_execution_logs;
DROP POLICY IF EXISTS "Users can view their error logs" ON error_logs;
DROP POLICY IF EXISTS "Users can create error logs" ON error_logs;
DROP POLICY IF EXISTS "Performance metrics are readable by all authenticated users" ON performance_metrics;
DROP POLICY IF EXISTS "Users can view webhook endpoints in their tenant" ON webhook_endpoints;
DROP POLICY IF EXISTS "Users can create webhook endpoints in their tenant" ON webhook_endpoints;
DROP POLICY IF EXISTS "Users can update webhook endpoints in their tenant" ON webhook_endpoints;
DROP POLICY IF EXISTS "Users can delete webhook endpoints in their tenant" ON webhook_endpoints;
DROP POLICY IF EXISTS "Users can view artifacts in their tenant" ON artifacts;
DROP POLICY IF EXISTS "System can create artifacts" ON artifacts;

-- Agents RLS Policies
CREATE POLICY "Users can view agents in their tenant"
  ON agents FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create agents in their tenant"
  ON agents FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update agents in their tenant"
  ON agents FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete agents in their tenant"
  ON agents FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Agent Executions RLS Policies
CREATE POLICY "Users can view their agent executions"
  ON agent_executions FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create agent executions"
  ON agent_executions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Workflows RLS Policies
CREATE POLICY "Users can view workflows in their tenant"
  ON workflows FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create workflows in their tenant"
  ON workflows FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update workflows in their tenant"
  ON workflows FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete workflows in their tenant"
  ON workflows FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Workflow Executions RLS Policies
CREATE POLICY "Users can view their workflow executions"
  ON workflow_executions FOR SELECT
  USING (
    user_id = auth.uid() OR user_id IS NULL OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create workflow executions"
  ON workflow_executions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Subscriptions RLS Policies
CREATE POLICY "Users can view their subscriptions"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their subscriptions"
  ON subscriptions FOR UPDATE
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active' AND role = 'admin'
  ));

-- Usage Metrics RLS Policies
CREATE POLICY "Users can view their usage metrics"
  ON usage_metrics FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create usage metrics"
  ON usage_metrics FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Billing Events RLS Policies
CREATE POLICY "Users can view their billing events"
  ON billing_events FOR SELECT
  USING (user_id = auth.uid());

-- Telemetry Events RLS Policies
CREATE POLICY "Users can view their telemetry events"
  ON telemetry_events FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create telemetry events"
  ON telemetry_events FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Workflow Execution Logs RLS Policies
CREATE POLICY "Users can view their workflow execution logs"
  ON workflow_execution_logs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "System can create workflow execution logs"
  ON workflow_execution_logs FOR INSERT
  WITH CHECK (true);

-- Agent Execution Logs RLS Policies
CREATE POLICY "Users can view their agent execution logs"
  ON agent_execution_logs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "System can create agent execution logs"
  ON agent_execution_logs FOR INSERT
  WITH CHECK (true);

-- Error Logs RLS Policies
CREATE POLICY "Users can view their error logs"
  ON error_logs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL OR tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create error logs"
  ON error_logs FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Performance Metrics RLS Policies
CREATE POLICY "Performance metrics are readable by all authenticated users"
  ON performance_metrics FOR SELECT
  USING (auth.role() = 'authenticated');

-- Webhook Endpoints RLS Policies
CREATE POLICY "Users can view webhook endpoints in their tenant"
  ON webhook_endpoints FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create webhook endpoints in their tenant"
  ON webhook_endpoints FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update webhook endpoints in their tenant"
  ON webhook_endpoints FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete webhook endpoints in their tenant"
  ON webhook_endpoints FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Artifacts RLS Policies
CREATE POLICY "Users can view artifacts in their tenant"
  ON artifacts FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "System can create artifacts"
  ON artifacts FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 10. TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_webhook_endpoints_updated_at ON webhook_endpoints;

-- Create triggers
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_endpoints_updated_at
  BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables, indexes, RLS policies, and triggers are now in place.
-- This migration is idempotent and safe to run multiple times.
-- ============================================================================
