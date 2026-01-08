#!/usr/bin/env python3
"""Quick database state check

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

# Check existing tables
cur.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
""")
tables = cur.fetchall()
print("Existing tables:")
for table in tables:
    print(f"  - {table[0]}")

# Check if tenants table exists and its structure
cur.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tenants'
    ORDER BY ordinal_position;
""")
tenant_cols = cur.fetchall()
if tenant_cols:
    print("\ntenants table columns:")
    for col in tenant_cols:
        print(f"  - {col[0]} ({col[1]})")
else:
    print("\ntenants table: DOES NOT EXIST")

cur.close()
conn.close()
