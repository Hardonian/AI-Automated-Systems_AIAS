#!/usr/bin/env python3
"""Check which intended tables exist

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

intended_tables = [
    'agents', 'agent_executions', 'workflows', 'workflow_executions',
    'subscriptions', 'usage_metrics', 'billing_events',
    'telemetry_events', 'workflow_execution_logs', 'agent_execution_logs',
    'error_logs', 'performance_metrics',
    'webhook_endpoints', 'artifacts'
]

print("Checking intended tables:\n")
for table in intended_tables:
    cur.execute(f"""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = '{table}'
        );
    """)
    exists = cur.fetchone()[0]
    if exists:
        cur.execute(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = '{table}'
            ORDER BY ordinal_position;
        """)
        cols = [row[0] for row in cur.fetchall()]
        has_tenant_id = 'tenant_id' in cols
        print(f"✓ {table}: EXISTS (columns: {len(cols)}, has tenant_id: {has_tenant_id})")
        if not has_tenant_id:
            print(f"    Missing tenant_id column")
    else:
        print(f"✗ {table}: DOES NOT EXIST")

cur.close()
conn.close()
