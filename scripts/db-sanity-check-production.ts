#!/usr/bin/env tsx
/**
 * Production Database Sanity Check
 * Safe to run in production - read-only checks
 */

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  severity: "critical" | "warning" | "info";
  details?: Record<string, unknown>;
}

/**
 * Run production-safe sanity checks
 */
async function runProductionSanityChecks(): Promise<{
  allPassed: boolean;
  criticalIssues: number;
  warnings: number;
  results: CheckResult[];
}> {
  const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);
  const results: CheckResult[] = [];

  // Check 1: Subscription status consistency (CRITICAL)
  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, status, currentPeriodEnd")
      .eq("status", "ACTIVE");

    if (error) throw error;

    const now = new Date();
    const expiredActive = subscriptions?.filter(
      (sub) =>
        sub.currentPeriodEnd &&
        new Date(sub.currentPeriodEnd) < now
    ) || [];

    results.push({
      name: "Active Subscriptions Not Expired",
      passed: expiredActive.length === 0,
      message:
        expiredActive.length === 0
          ? "All active subscriptions are within their period"
          : `Found ${expiredActive.length} active subscriptions past period end`,
      severity: expiredActive.length > 0 ? "critical" : "info",
      details: { count: expiredActive.length },
    });
  } catch (error) {
    results.push({
      name: "Active Subscriptions Not Expired",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
      severity: "critical",
    });
  }

  // Check 2: Unique customer mapping (CRITICAL)
  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("stripeCustomerId, org_id")
      .not("stripeCustomerId", "is", null);

    if (error) throw error;

    const customerMap = new Map<string, string[]>();
    subscriptions?.forEach((sub) => {
      if (sub.stripeCustomerId) {
        const existing = customerMap.get(sub.stripeCustomerId) || [];
        existing.push(sub.org_id);
        customerMap.set(sub.stripeCustomerId, existing);
      }
    });

    const duplicates = Array.from(customerMap.entries()).filter(
      ([, orgIds]) => orgIds.length > 1
    );

    results.push({
      name: "Unique Stripe Customer Mapping",
      passed: duplicates.length === 0,
      message:
        duplicates.length === 0
          ? "All Stripe customers map to unique organizations"
          : `Found ${duplicates.length} Stripe customers mapped to multiple organizations`,
      severity: duplicates.length > 0 ? "critical" : "info",
      details: { duplicates: duplicates.length },
    });
  } catch (error) {
    results.push({
      name: "Unique Stripe Customer Mapping",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
      severity: "critical",
    });
  }

  // Check 3: Required fields not null (WARNING)
  try {
    const { data: nullEmails, error } = await supabase
      .from("users")
      .select("id")
      .is("email", null)
      .limit(10);

    if (error) throw error;

    results.push({
      name: "Required Fields Not Null",
      passed: (nullEmails?.length || 0) === 0,
      message:
        (nullEmails?.length || 0) === 0
          ? "All required fields are populated"
          : `Found ${nullEmails?.length || 0} users with null email`,
      severity: (nullEmails?.length || 0) > 0 ? "warning" : "info",
      details: { nullEmails: nullEmails?.length || 0 },
    });
  } catch (error) {
    results.push({
      name: "Required Fields Not Null",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
      severity: "warning",
    });
  }

  // Check 4: Database connectivity (INFO)
  try {
    const { error } = await supabase.from("users").select("count").limit(1);
    if (error) throw error;

    results.push({
      name: "Database Connectivity",
      passed: true,
      message: "Database is accessible",
      severity: "info",
    });
  } catch (error) {
    results.push({
      name: "Database Connectivity",
      passed: false,
      message: `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
      severity: "critical",
    });
  }

  const criticalIssues = results.filter((r) => r.severity === "critical" && !r.passed).length;
  const warnings = results.filter((r) => r.severity === "warning" && !r.passed).length;
  const allPassed = results.every((r) => r.passed);

  return { allPassed, criticalIssues, warnings, results };
}

/**
 * CLI entry point
 */
if (require.main === module) {
  runProductionSanityChecks()
    .then(({ allPassed, criticalIssues, warnings, results }) => {
      console.log("\n=== Production Database Sanity Check ===\n");

      results.forEach((result) => {
        const icon = result.passed ? "✅" : result.severity === "critical" ? "❌" : "⚠️";
        const severityLabel = result.severity.toUpperCase();
        console.log(`${icon} [${severityLabel}] ${result.name}: ${result.message}`);
        if (result.details) {
          console.log(`   Details:`, result.details);
        }
      });

      console.log(`\nSummary:`);
      console.log(`  Critical Issues: ${criticalIssues}`);
      console.log(`  Warnings: ${warnings}`);
      console.log(`  Status: ${allPassed ? "✅ All checks passed" : "❌ Some checks failed"}\n`);

      // Exit with error code if critical issues found
      process.exit(criticalIssues > 0 ? 1 : 0);
    })
    .catch((error) => {
      logger.error("Production sanity check failed", error instanceof Error ? error : new Error(String(error)));
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { runProductionSanityChecks };
