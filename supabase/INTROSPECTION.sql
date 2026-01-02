-- ============================================================================
-- SUPABASE BACKEND INTROSPECTION QUERIES
-- ============================================================================
-- Run these queries against your Supabase database to capture actual state
-- Save output to REALITY.md for evidence-based gap analysis
-- ============================================================================

-- ============================================================================
-- 1. SCHEMAS AND EXTENSIONS
-- ============================================================================

-- Check schemas
SELECT 
  schema_name,
  schema_owner
FROM information_schema.schemata
WHERE schema_name IN ('public', 'auth', 'storage', 'extensions')
ORDER BY schema_name;

-- Check extensions
SELECT 
  extname as extension_name,
  extversion as version
FROM pg_extension
ORDER BY extname;

-- ============================================================================
-- 2. TABLES AND COLUMNS
-- ============================================================================

-- All tables in public schema
SELECT 
  t.table_name,
  t.table_type,
  obj_description(c.oid, 'pg_class') as comment
FROM information_schema.tables t
LEFT JOIN pg_class c ON c.relname = t.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;

-- Columns for each table (detailed)
SELECT 
  t.table_name,
  c.column_name,
  c.data_type,
  c.character_maximum_length,
  c.is_nullable,
  c.column_default,
  c.udt_name,
  pgd.description as column_comment
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name AND c.table_schema = t.table_schema
LEFT JOIN pg_catalog.pg_statio_all_tables st ON st.schemaname = t.table_schema AND st.relname = t.table_name
LEFT JOIN pg_catalog.pg_description pgd ON pgd.objoid = st.relid AND pgd.objsubid = c.ordinal_position
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- ============================================================================
-- 3. CONSTRAINTS (PRIMARY KEYS, FOREIGN KEYS, UNIQUE, CHECK)
-- ============================================================================

-- Primary keys
SELECT 
  tc.table_name,
  kc.column_name,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kc 
  ON tc.constraint_name = kc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'PRIMARY KEY'
ORDER BY tc.table_name, kc.ordinal_position;

-- Foreign keys
SELECT 
  tc.table_name,
  kc.column_name,
  tc.constraint_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kc 
  ON tc.constraint_name = kc.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc 
  ON rc.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kc.ordinal_position;

-- Unique constraints
SELECT 
  tc.table_name,
  kc.column_name,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kc 
  ON tc.constraint_name = kc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_name, kc.ordinal_position;

-- Check constraints
SELECT 
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name;

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================================
-- 5. ENUMS AND TYPES
-- ============================================================================

-- Enums
SELECT 
  t.typname as enum_name,
  e.enumlabel as enum_value,
  e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY t.typname, e.enumsortorder;

-- Composite types
SELECT 
  t.typname as type_name,
  a.attname as attribute_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as attribute_type
FROM pg_type t
JOIN pg_attribute a ON a.attrelid = t.typrelid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND t.typtype = 'c'
ORDER BY t.typname, a.attnum;

-- ============================================================================
-- 6. VIEWS
-- ============================================================================

SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================================================
-- 7. FUNCTIONS
-- ============================================================================

SELECT 
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type,
  p.provolatile as volatility,
  p.prosecdef as security_definer,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

SELECT 
  t.tgname as trigger_name,
  c.relname as table_name,
  p.proname as function_name,
  pg_get_triggerdef(t.oid) as trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- RLS enabled status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- RLS Policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- 10. GRANTS (PERMISSIONS)
-- ============================================================================

-- Table grants
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
ORDER BY table_name, grantee, privilege_type;

-- Function grants
SELECT 
  grantee,
  routine_schema,
  routine_name,
  privilege_type,
  is_grantable
FROM information_schema.role_routine_grants
WHERE routine_schema = 'public'
ORDER BY routine_name, grantee, privilege_type;

-- ============================================================================
-- 11. REALTIME PUBLICATION
-- ============================================================================

-- Check if supabase_realtime publication exists
SELECT 
  pubname,
  puballtables,
  pubinsert,
  pubupdate,
  pubdelete,
  pubtruncate
FROM pg_publication
WHERE pubname LIKE '%realtime%';

-- Tables in realtime publication
SELECT 
  p.pubname,
  pt.schemaname,
  pt.tablename
FROM pg_publication p
JOIN pg_publication_tables pt ON p.pubname = pt.pubname
WHERE p.pubname LIKE '%realtime%'
ORDER BY pt.tablename;

-- Replica identity (for UPDATE/DELETE payloads)
SELECT 
  schemaname,
  tablename,
  relreplident as replica_identity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 12. STORAGE (IF USED)
-- ============================================================================

-- Storage buckets
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at,
  updated_at
FROM storage.buckets
ORDER BY name;

-- Storage policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- ============================================================================
-- 13. SEQUENCES
-- ============================================================================

SELECT 
  sequence_schema,
  sequence_name,
  data_type,
  numeric_precision,
  numeric_precision_radix,
  numeric_scale,
  start_value,
  minimum_value,
  maximum_value,
  increment,
  cycle_option
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- ============================================================================
-- END OF INTROSPECTION QUERIES
-- ============================================================================
-- Save all output to REALITY.md for comparison with intended schema
-- ============================================================================
