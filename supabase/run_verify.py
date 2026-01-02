#!/usr/bin/env python3
"""Run verification queries and display results"""
import psycopg2
import sys

DATABASE_URL = "postgresql://postgres.pegqwxcukwqzbjuinwmf:BPBWVQFqUzGA6W3V@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Read VERIFY.sql and execute queries
with open('VERIFY.sql', 'r') as f:
    content = f.read()

# Split by semicolons and execute SELECT queries
queries = [q.strip() for q in content.split(';') if q.strip() and not q.strip().startswith('--') and 'SELECT' in q.upper()]

print("="*80)
print("VERIFICATION RESULTS")
print("="*80)
print()

for query in queries:
    try:
        cur.execute(query)
        rows = cur.fetchall()
        if rows:
            colnames = [desc[0] for desc in cur.description]
            print(f"Query: {query[:60]}...")
            print(f"Columns: {', '.join(colnames)}")
            for row in rows:
                print(f"  {dict(zip(colnames, row))}")
            print()
    except Exception as e:
        print(f"Query failed: {e}")
        print(f"Query: {query[:100]}")
        print()

cur.close()
conn.close()
