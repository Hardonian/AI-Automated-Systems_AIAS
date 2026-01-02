-- Migration: Webhook Endpoints and Artifacts
-- Creates tables for tenant-scoped webhook endpoints and deterministic artifacts

-- Webhook Endpoints Table
-- Stores tenant-scoped webhook URLs with secrets for external system triggers
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
-- Stores deterministic outputs from system/workflow executions
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  system_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  artifact_type VARCHAR(50) NOT NULL DEFAULT 'json', -- json, text, csv, etc.
  content JSONB, -- For structured data
  content_text TEXT, -- For text content
  content_bytes BYTEA, -- For binary content
  metadata JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_tenant_id ON webhook_endpoints(tenant_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_system_id ON webhook_endpoints(system_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_secret ON webhook_endpoints(secret);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_enabled ON webhook_endpoints(enabled);

CREATE INDEX IF NOT EXISTS idx_artifacts_run_id ON artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_id ON artifacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_system_id ON artifacts(system_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts(created_at);

-- RLS Policies
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

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
  WITH CHECK (true); -- Service role will insert artifacts

-- Updated_at trigger
CREATE TRIGGER update_webhook_endpoints_updated_at
  BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate webhook secret
-- Returns a URL-safe base64-encoded random string
CREATE OR REPLACE FUNCTION generate_webhook_secret()
RETURNS TEXT AS $$
DECLARE
  random_bytes BYTEA;
  encoded TEXT;
BEGIN
  -- Generate 32 random bytes
  random_bytes := gen_random_bytes(32);
  -- Encode as base64 and make URL-safe
  encoded := replace(replace(encode(random_bytes, 'base64'), '+', '-'), '/', '_');
  -- Remove padding
  encoded := rtrim(encoded, '=');
  RETURN encoded;
END;
$$ LANGUAGE plpgsql;
