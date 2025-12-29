-- Migration: Fix RLS Policies Tenant Reference
-- Fixes RLS policies that reference non-existent 'user_tenants' table
-- Replaces with correct 'tenant_members' table reference

-- Create a view for backward compatibility (if needed)
-- This allows existing code to work while we transition
CREATE OR REPLACE VIEW user_tenants AS
SELECT 
  tenant_id,
  user_id,
  role,
  status,
  joined_at as created_at
FROM tenant_members
WHERE status = 'active';

-- Grant access to the view
GRANT SELECT ON user_tenants TO authenticated;
GRANT SELECT ON user_tenants TO anon;

-- Drop old policies that reference user_tenants (they'll be recreated below)
DROP POLICY IF EXISTS "Users can view agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can create agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can update agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can delete agents in their tenant" ON agents;
DROP POLICY IF EXISTS "Users can view workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can create workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can update workflows in their tenant" ON workflows;
DROP POLICY IF EXISTS "Users can delete workflows in their tenant" ON workflows;

-- Recreate Agents RLS Policies with correct table reference
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

-- Recreate Workflows RLS Policies with correct table reference
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
