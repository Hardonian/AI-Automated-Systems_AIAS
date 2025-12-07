-- Migration: Observability Tables
-- Creates tables for telemetry events, execution logs, and performance metrics

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

-- Workflow Execution Logs Table (detailed logs)
CREATE TABLE IF NOT EXISTS workflow_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  duration INTEGER,
  steps_executed INTEGER NOT NULL DEFAULT 0,
  steps_succeeded INTEGER NOT NULL DEFAULT 0,
  steps_failed INTEGER NOT NULL DEFAULT 0,
  error JSONB DEFAULT NULL,
  input JSONB DEFAULT NULL,
  output JSONB DEFAULT NULL
);

-- Agent Execution Logs Table (detailed logs)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_telemetry_events_type ON telemetry_events(type);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_id ON telemetry_events(user_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_tenant_id ON telemetry_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_timestamp ON telemetry_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_execution_id ON workflow_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_workflow_id ON workflow_execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_user_id ON workflow_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_status ON workflow_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_started_at ON workflow_execution_logs(started_at);

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

-- RLS Policies
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Telemetry Events RLS Policies
CREATE POLICY "Users can view their telemetry events"
  ON telemetry_events FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create telemetry events"
  ON telemetry_events FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Workflow Execution Logs RLS Policies
CREATE POLICY "Users can view their workflow execution logs"
  ON workflow_execution_logs FOR SELECT
  USING (user_id = auth.uid());

-- Agent Execution Logs RLS Policies
CREATE POLICY "Users can view their agent execution logs"
  ON agent_execution_logs FOR SELECT
  USING (user_id = auth.uid());

-- Error Logs RLS Policies
CREATE POLICY "Users can view their error logs"
  ON error_logs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create error logs"
  ON error_logs FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Performance Metrics RLS Policies (admin only or public read)
CREATE POLICY "Performance metrics are readable by all authenticated users"
  ON performance_metrics FOR SELECT
  USING (auth.role() = 'authenticated');
