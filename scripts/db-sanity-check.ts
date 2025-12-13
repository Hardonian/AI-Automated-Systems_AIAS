/**
 * Database Sanity Check Script
 * Validates data integrity and invariants
 */

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";

interface SanityCheckResult {
  name: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Run all sanity checks
 */
export async function runSanityChecks(): Promise<{
  allPassed: boolean;
  results: SanityCheckResult[];
}> {
  const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);
  const results: SanityCheckResult[] = [];

  // Check 1: No orphaned memberships
  try {
    const { data: orphanedMemberships, error } = await supabase
      .from("memberships")
      .select("id, user_id, org_id")
      .then(async (result) => {
        if (result.error) throw result.error;
        
        // Check if users exist
        const userIds = [...new Set(result.data.map((m) => m.user_id))];
        const { data: users } = await supabase
          .from("users")
          .select("id")
          .in("id", userIds);

        const existingUserIds = new Set(users?.map((u) => u.id) || []);
        const orphaned = result.data.filter(
          (m) => !existingUserIds.has(m.user_id)
        );

        return { data: orphaned, error: null };
      });

    if (error) throw error;

    results.push({
      name: "Orphaned Memberships",
      passed: orphanedMemberships.length === 0,
      message:
        orphanedMemberships.length === 0
          ? "No orphaned memberships found"
          : `Found ${orphanedMemberships.length} orphaned memberships`,
      details: { count: orphanedMemberships.length },
    });
  } catch (error) {
    results.push({
      name: "Orphaned Memberships",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  // Check 2: Unique customer mapping (one Stripe customer per user)
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
      name: "Unique Customer Mapping",
      passed: duplicates.length === 0,
      message:
        duplicates.length === 0
          ? "All Stripe customers map to unique organizations"
          : `Found ${duplicates.length} Stripe customers mapped to multiple organizations`,
      details: { duplicates: duplicates.length },
    });
  } catch (error) {
    results.push({
      name: "Unique Customer Mapping",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  // Check 3: Subscription status consistency
  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, status, stripeSubscriptionId, currentPeriodEnd");

    if (error) throw error;

    const now = new Date();
    const expiredActive = subscriptions?.filter(
      (sub) =>
        sub.status === "ACTIVE" &&
        sub.currentPeriodEnd &&
        new Date(sub.currentPeriodEnd) < now
    ) || [];

    results.push({
      name: "Subscription Status Consistency",
      passed: expiredActive.length === 0,
      message:
        expiredActive.length === 0
          ? "All active subscriptions are within their period"
          : `Found ${expiredActive.length} active subscriptions past their period end`,
      details: { count: expiredActive.length },
    });
  } catch (error) {
    results.push({
      name: "Subscription Status Consistency",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  // Check 4: No orphaned projects
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, user_id, org_id")
      .then(async (result) => {
        if (result.error) throw result.error;

        // Check if users exist
        const userIds = [...new Set(result.data.map((p) => p.user_id))];
        const { data: users } = await supabase
          .from("users")
          .select("id")
          .in("id", userIds);

        const existingUserIds = new Set(users?.map((u) => u.id) || []);
        const orphaned = result.data.filter(
          (p) => !existingUserIds.has(p.user_id)
        );

        return { data: orphaned, error: null };
      });

    if (error) throw error;

    results.push({
      name: "Orphaned Projects",
      passed: projects.length === 0,
      message:
        projects.length === 0
          ? "No orphaned projects found"
          : `Found ${projects.length} orphaned projects`,
      details: { count: projects.length },
    });
  } catch (error) {
    results.push({
      name: "Orphaned Projects",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  // Check 5: Required fields are not null
  try {
    const { data: nullEmails, error: emailError } = await supabase
      .from("users")
      .select("id")
      .is("email", null);

    if (emailError) throw emailError;

    results.push({
      name: "Required Fields Not Null",
      passed: (nullEmails?.length || 0) === 0,
      message:
        (nullEmails?.length || 0) === 0
          ? "All required fields are populated"
          : `Found ${nullEmails?.length || 0} users with null email`,
      details: { nullEmails: nullEmails?.length || 0 },
    });
  } catch (error) {
    results.push({
      name: "Required Fields Not Null",
      passed: false,
      message: `Check failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  const allPassed = results.every((r) => r.passed);

  return { allPassed, results };
}

/**
 * CLI entry point
 */
if (require.main === module) {
  runSanityChecks()
    .then(({ allPassed, results }) => {
      console.log("\n=== Database Sanity Check Results ===\n");
      
      results.forEach((result) => {
        const icon = result.passed ? "✅" : "❌";
        console.log(`${icon} ${result.name}: ${result.message}`);
        if (result.details) {
          console.log(`   Details:`, result.details);
        }
      });

      console.log(`\n${allPassed ? "✅ All checks passed" : "❌ Some checks failed"}\n`);
      process.exit(allPassed ? 0 : 1);
    })
    .catch((error) => {
      logger.error("Sanity check failed", error instanceof Error ? error : new Error(String(error)));
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
