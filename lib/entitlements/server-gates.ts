/**
 * Server-Side Entitlement Gates
 * Enforces paid tier limits on the server (not just UI)
 * 
 * These functions MUST be called server-side before allowing operations.
 * Client-side checks are for UX only.
 */

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { SystemError } from "@/lib/errors";
import { logger } from "@/lib/logging/structured-logger";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export interface EntitlementLimits {
  maxSystems: number;
  maxWebhooks: number;
  maxRunsPerMonth: number;
  scheduledExecution: boolean;
  aiAugmentation: boolean;
}

export interface PlanLimits {
  free: EntitlementLimits;
  starter: EntitlementLimits;
  pro: EntitlementLimits;
  enterprise: EntitlementLimits;
}

/**
 * Plan limits configuration
 */
export const PLAN_LIMITS: PlanLimits = {
  free: {
    maxSystems: 3,
    maxWebhooks: 5,
    maxRunsPerMonth: 100,
    scheduledExecution: false,
    aiAugmentation: false,
  },
  starter: {
    maxSystems: 20,
    maxWebhooks: 50,
    maxRunsPerMonth: 10000,
    scheduledExecution: true,
    aiAugmentation: false,
  },
  pro: {
    maxSystems: 100,
    maxWebhooks: 500,
    maxRunsPerMonth: 50000,
    scheduledExecution: true,
    aiAugmentation: true,
  },
  enterprise: {
    maxSystems: -1, // Unlimited
    maxWebhooks: -1, // Unlimited
    maxRunsPerMonth: -1, // Unlimited
    scheduledExecution: true,
    aiAugmentation: true,
  },
};

/**
 * Get tenant's current plan
 */
export async function getTenantPlan(tenantId: string): Promise<string> {
  try {
    // Check subscriptions table
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier, status")
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (subscription?.tier) {
      return subscription.tier.toLowerCase();
    }

    // Fallback: check subscription_tiers table (legacy)
    const { data: member } = await supabase
      .from("tenant_members")
      .select("user_id")
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .limit(1)
      .single();

    if (member?.user_id) {
      const { data: userTier } = await supabase
        .from("subscription_tiers")
        .select("tier")
        .eq("user_id", member.user_id)
        .single();

      if (userTier?.tier) {
        return userTier.tier.toLowerCase();
      }
    }

    // Default to free
    return "free";
  } catch (error) {
    logger.warn("Failed to get tenant plan, defaulting to free", {
      tenantId,
      error: error instanceof Error ? error.message : String(error),
    });
    return "free";
  }
}

/**
 * Get tenant's entitlement limits
 */
export async function getTenantLimits(tenantId: string): Promise<EntitlementLimits> {
  const plan = await getTenantPlan(tenantId);
  const limits = PLAN_LIMITS[plan as keyof PlanLimits] || PLAN_LIMITS.free;
  return limits;
}

/**
 * Check if tenant can create a new system
 */
export async function canCreateSystem(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getTenantLimits(tenantId);

  // Unlimited
  if (limits.maxSystems === -1) {
    return { allowed: true };
  }

  // Count existing systems
  const { count, error } = await supabase
    .from("workflows")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("enabled", true);

  if (error) {
    logger.error("Failed to count systems", { tenantId, errorMessage: error.message });
    // Fail closed - don't allow if we can't verify
    return { allowed: false, reason: "Unable to verify system limit" };
  }

  if ((count || 0) >= limits.maxSystems) {
    return {
      allowed: false,
      reason: `System limit reached (${limits.maxSystems}). Upgrade your plan to create more systems.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if tenant can create a new webhook endpoint
 */
export async function canCreateWebhook(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getTenantLimits(tenantId);

  // Unlimited
  if (limits.maxWebhooks === -1) {
    return { allowed: true };
  }

  // Count existing webhooks
  const { count, error } = await supabase
    .from("webhook_endpoints")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("enabled", true);

  if (error) {
    logger.error("Failed to count webhooks", { tenantId, errorMessage: error.message });
    return { allowed: false, reason: "Unable to verify webhook limit" };
  }

  if ((count || 0) >= limits.maxWebhooks) {
    return {
      allowed: false,
      reason: `Webhook limit reached (${limits.maxWebhooks}). Upgrade your plan to create more webhooks.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if tenant can execute a run (monthly limit)
 */
export async function canExecuteRun(tenantId: string): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  const limits = await getTenantLimits(tenantId);

  // Unlimited
  if (limits.maxRunsPerMonth === -1) {
    return { allowed: true, remaining: -1 };
  }

  // Count runs this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { count, error } = await supabase
    .from("workflow_executions")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("started_at", monthStart.toISOString())
    .lte("started_at", monthEnd.toISOString());

  if (error) {
    logger.error("Failed to count runs", { tenantId, errorMessage: error.message });
    return { allowed: false, reason: "Unable to verify run limit" };
  }

  const used = count || 0;
  const remaining = limits.maxRunsPerMonth - used;

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `Monthly run limit reached (${limits.maxRunsPerMonth}). Upgrade your plan or wait until next month.`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Check if tenant can use scheduled execution
 */
export async function canUseScheduledExecution(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getTenantLimits(tenantId);

  if (!limits.scheduledExecution) {
    return {
      allowed: false,
      reason: "Scheduled execution is not available on your plan. Upgrade to Starter or higher.",
    };
  }

  return { allowed: true };
}

/**
 * Check if tenant can use AI augmentation
 */
export async function canUseAIAugmentation(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getTenantLimits(tenantId);

  if (!limits.aiAugmentation) {
    return {
      allowed: false,
      reason: "AI augmentation is not available on your plan. Upgrade to Pro or higher.",
    };
  }

  return { allowed: true };
}

/**
 * Assert that tenant can create a system (throws if not)
 */
export async function assertCanCreateSystem(tenantId: string): Promise<void> {
  const check = await canCreateSystem(tenantId);
  if (!check.allowed) {
    throw new SystemError(check.reason || "Cannot create system");
  }
}

/**
 * Assert that tenant can create a webhook (throws if not)
 */
export async function assertCanCreateWebhook(tenantId: string): Promise<void> {
  const check = await canCreateWebhook(tenantId);
  if (!check.allowed) {
    throw new SystemError(check.reason || "Cannot create webhook");
  }
}

/**
 * Assert that tenant can execute a run (throws if not)
 */
export async function assertCanExecuteRun(tenantId: string): Promise<void> {
  const check = await canExecuteRun(tenantId);
  if (!check.allowed) {
    throw new SystemError(check.reason || "Cannot execute run");
  }
}
