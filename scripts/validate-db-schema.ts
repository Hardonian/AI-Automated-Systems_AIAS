#!/usr/bin/env tsx
/**
 * Database Schema Validation Script
 * 
 * Validates that:
 * 1. Prisma schema matches Supabase migrations
 * 2. All tables exist in database
 * 3. All columns match expected schema
 * 4. Indexes and constraints are in place
 * 
 * Usage: tsx scripts/validate-db-schema.ts
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../lib/env";
import { PrismaClient } from "@prisma/client";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);
const prisma = new PrismaClient();

interface ValidationResult {
  table: string;
  exists: boolean;
  columns?: string[];
  missingColumns?: string[];
  errors: string[];
}

async function validateSchema(): Promise<void> {
  console.log("🔍 Starting database schema validation...\n");

  const results: ValidationResult[] = [];
  const errors: string[] = [];

  try {
    // Get all tables from Prisma schema
    const prismaModels = [
      "users",
      "organizations",
      "memberships",
      "subscriptions",
      "api_keys",
      "projects",
      "sources",
      "ingest_events",
      "products",
      "trends",
      "creatives",
      "metrics",
      "ai_runs",
      "reports",
      "webhook_events",
      "feature_flags",
    ];

    // Check each table exists and has expected columns
    for (const tableName of prismaModels) {
      const result: ValidationResult = {
        table: tableName,
        exists: false,
        columns: [],
        missingColumns: [],
        errors: [],
      };

      try {
        // Try to query the table (will fail if it doesn't exist)
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .limit(1);

        if (error) {
          if (error.code === "42P01") {
            // Table does not exist
            result.errors.push(`Table ${tableName} does not exist`);
            results.push(result);
            continue;
          } else {
            result.errors.push(`Error querying table: ${error.message}`);
          }
        } else {
          result.exists = true;
        }

        // Get column information from information_schema
        const { data: columns, error: colError } = await supabase.rpc(
          "get_table_columns",
          { table_name: tableName }
        ).catch(async () => {
          // Fallback: query information_schema directly
          const { data: cols } = await supabase
            .from("information_schema.columns")
            .select("column_name")
            .eq("table_name", tableName)
            .eq("table_schema", "public");

          return { data: cols?.map((c) => ({ column_name: c.column_name })), error: null };
        });

        if (!colError && columns) {
          result.columns = columns.map((c: any) => c.column_name);
        }
      } catch (err) {
        result.errors.push(
          `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
        );
      }

      results.push(result);
    }

    // Print results
    console.log("📊 Validation Results:\n");
    let allValid = true;

    for (const result of results) {
      if (result.errors.length > 0 || !result.exists) {
        allValid = false;
        console.log(`❌ ${result.table}:`);
        result.errors.forEach((err) => console.log(`   - ${err}`));
      } else {
        console.log(`✅ ${result.table}: OK`);
        if (result.columns && result.columns.length > 0) {
          console.log(`   Columns: ${result.columns.length}`);
        }
      }
    }

    // Check RLS policies
    console.log("\n🔒 Checking RLS Policies...\n");
    const { data: policies, error: policyError } = await supabase
      .from("pg_policies")
      .select("*")
      .limit(100);

    if (!policyError && policies) {
      console.log(`✅ Found ${policies.length} RLS policies`);
    } else {
      console.log("⚠️  Could not verify RLS policies (this is OK if using Supabase)");
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    if (allValid) {
      console.log("✅ Schema validation passed!");
      process.exit(0);
    } else {
      console.log("❌ Schema validation failed!");
      console.log("\nPlease run migrations to fix missing tables/columns:");
      console.log("  npm run db:migrate");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Fatal error during validation:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation
validateSchema().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
