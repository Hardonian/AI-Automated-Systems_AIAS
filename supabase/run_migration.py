#!/usr/bin/env python3
"""
Execute SQL migration files against Supabase database
"""
import sys
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DATABASE_URL = "postgresql://postgres.pegqwxcukwqzbjuinwmf:BPBWVQFqUzGA6W3V@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

def execute_sql_file(file_path, capture_output=False):
    """Execute SQL file and optionally capture output"""
    print(f"\n{'='*80}")
    print(f"Executing: {file_path}")
    print(f"{'='*80}\n")
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        with open(file_path, 'r') as f:
            sql_content = f.read()
        
        # For introspection, we need to capture results
        if capture_output:
            results = []
            # Split by semicolons and execute queries that return results
            queries = [q.strip() for q in sql_content.split(';') if q.strip() and not q.strip().startswith('--')]
            
            for query in queries:
                if query.upper().startswith('SELECT'):
                    try:
                        cur.execute(query)
                        rows = cur.fetchall()
                        if rows:
                            # Get column names
                            colnames = [desc[0] for desc in cur.description]
                            results.append({
                                'query': query[:100] + '...' if len(query) > 100 else query,
                                'columns': colnames,
                                'rows': rows[:10]  # Limit to first 10 rows
                            })
                    except Exception as e:
                        print(f"Query error (non-fatal): {e}")
            
            return results
        else:
            # For DDL, execute the whole file
            cur.execute(sql_content)
            print("✓ Execution completed successfully")
            return None
            
    except psycopg2.Error as e:
        print(f"✗ Error: {e}")
        sys.exit(1)
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 run_migration.py <sql_file> [capture_output]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    capture = len(sys.argv) > 2 and sys.argv[2] == "capture"
    
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        sys.exit(1)
    
    execute_sql_file(file_path, capture_output=capture)
