#!/usr/bin/env tsx
/**
 * Migration Dependency Verification Script
 * Verifies that all required base tables exist before applying migrations
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../lib/env";

const REQUIRED_TABLES = [
  "tenants",
  "profiles",
  "tenant_members",
  "subscription_plans",
];

const OPTIONAL_TABLES = [
  "subscription_tiers",
  "workflows",
  "agents",
  "subscriptions",
];

async function verifyTables() {
  const supabaseUrl = env.supabase.url;
  const supabaseServiceKey = env.supabase.serviceRoleKey;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("🔍 Verifying database tables...\n");

  const missingRequired: string[] = [];
  const missingOptional: string[] = [];

  // Check required tables
  for (const table of REQUIRED_TABLES) {
    const { error } = await supabase.from(table).select("id").limit(1);
    if (error) {
      missingRequired.push(table);
      console.log(`❌ Required table '${table}' is missing`);
    } else {
      console.log(`✅ Required table '${table}' exists`);
    }
  }

  // Check optional tables
  for (const table of OPTIONAL_TABLES) {
    const { error } = await supabase.from(table).select("id").limit(1);
    if (error) {
      missingOptional.push(table);
      console.log(`⚠️  Optional table '${table}' is missing`);
    } else {
      console.log(`✅ Optional table '${table}' exists`);
    }
  }

  console.log("\n" + "=".repeat(50));

  if (missingRequired.length > 0) {
    console.error("\n❌ CRITICAL: Missing required tables:");
    missingRequired.forEach((table) => console.error(`   - ${table}`));
    console.error("\n⚠️  Cannot proceed with migrations until base tables are created.");
    console.error("   Apply the master consolidated schema migration first:");
    console.error("   supabase/migrations_archive/99999999999999_master_consolidated_schema.sql\n");
    process.exit(1);
  }

  if (missingOptional.length > 0) {
    console.warn("\n⚠️  Missing optional tables (may be created by migrations):");
    missingOptional.forEach((table) => console.warn(`   - ${table}`));
  }

  console.log("\n✅ All required tables exist. Safe to apply migrations.\n");
  process.exit(0);
}

verifyTables().catch((error) => {
  console.error("❌ Error verifying tables:", error);
  process.exit(1);
});
