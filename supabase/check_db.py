#!/usr/bin/env python3
"""Quick database state check"""
import psycopg2

DATABASE_URL = "postgresql://postgres.pegqwxcukwqzbjuinwmf:BPBWVQFqUzGA6W3V@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

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
