-- ============================================================================
-- VERIFICATION CHECKLIST
-- Run these queries in Supabase SQL Editor to verify the migration state.
-- ============================================================================

-- 1. Check Table Existence
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'tenants', 'agents', 'workflows', 'users', 'memberships', 'tenant_members');

-- Expected: Should return all 7 tables.

-- 2. Check RLS Status (Must be TRUE for all)
SELECT relname as table_name, relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
AND c.relname IN ('organizations', 'tenants', 'agents', 'workflows', 'users', 'memberships', 'tenant_members');

-- 3. Check Policy Existence
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('organizations', 'tenants', 'agents');

-- 4. Check Index Existence (Duplicate Prevention)
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('tenant_members', 'memberships', 'users');

-- 5. Permission Check (Grants)
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('organizations', 'tenants')
AND table_schema = 'public';
