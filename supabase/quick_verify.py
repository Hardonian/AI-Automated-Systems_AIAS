#!/usr/bin/env python3
"""Quick verification of migration results

SECURITY: This script must never embed credentials in source control.
Provide the connection string via environment variables.
"""
import os

import psycopg2

DATABASE_URL = (
    os.environ.get("DATABASE_URL")
    or os.environ.get("DATABASE_POOLER_URL")
    or os.environ.get("SUPABASE_DB_URL")
)
if not DATABASE_URL:
    raise SystemExit(
        "Missing DATABASE_URL (or DATABASE_POOLER_URL / SUPABASE_DB_URL). Refusing to run."
    )

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

print("="*80)
print("MIGRATION VERIFICATION")
print("="*80)
print()

# Check 1: Foundational tables
print("1. Foundational Tables:")
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('tenants', 'tenant_members', 'user_tenants') ORDER BY table_name")
tables = cur.fetchall()
for table in tables:
    print(f"   ✓ {table[0]} exists")
if len(tables) < 3:
    print(f"   ✗ Missing {3 - len(tables)} table(s)")

# Check 2: Core tables
print("\n2. Core Tables:")
core_tables = ['agents', 'agent_executions', 'workflows', 'workflow_executions']
cur.execute(f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY(%s)", (core_tables,))
found = [row[0] for row in cur.fetchall()]
for table in core_tables:
    if table in found:
        # Check if has tenant_id
        cur.execute(f"SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = %s AND column_name = 'tenant_id'", (table,))
        has_tenant = cur.fetchone()[0] > 0
        status = "✓" if has_tenant else "⚠"
        print(f"   {status} {table} exists" + ("" if has_tenant else " (missing tenant_id)"))
    else:
        print(f"   ✗ {table} missing")

# Check 3: RLS enabled
print("\n3. RLS Status:")
cur.execute("""
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('agents', 'workflows', 'agent_executions', 'workflow_executions', 'subscriptions', 'usage_metrics')
    ORDER BY tablename
""")
rls_status = cur.fetchall()
for table, enabled in rls_status:
    status = "✓" if enabled else "✗"
    print(f"   {status} {table}: RLS {'enabled' if enabled else 'disabled'}")

# Check 4: Policies exist
print("\n4. RLS Policies:")
cur.execute("""
    SELECT tablename, COUNT(*) as policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('agents', 'workflows', 'agent_executions', 'workflow_executions')
    GROUP BY tablename
    ORDER BY tablename
""")
policies = cur.fetchall()
for table, count in policies:
    print(f"   ✓ {table}: {count} policies")

# Check 5: Functions exist
print("\n5. Functions:")
cur.execute("""
    SELECT proname 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND proname IN ('update_updated_at_column', 'generate_webhook_secret')
    ORDER BY proname
""")
funcs = [row[0] for row in cur.fetchall()]
for func in ['update_updated_at_column', 'generate_webhook_secret']:
    if func in funcs:
        print(f"   ✓ {func} exists")
    else:
        print(f"   ✗ {func} missing")

# Check 6: Indexes
print("\n6. Key Indexes:")
cur.execute("""
    SELECT tablename, COUNT(*) as idx_count
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
    AND tablename IN ('agents', 'workflows', 'agent_executions', 'workflow_executions')
    GROUP BY tablename
    ORDER BY tablename
""")
indexes = cur.fetchall()
for table, count in indexes:
    print(f"   ✓ {table}: {count} indexes")

print("\n" + "="*80)
print("VERIFICATION COMPLETE")
print("="*80)

cur.close()
conn.close()
