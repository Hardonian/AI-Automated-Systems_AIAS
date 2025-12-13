/**
 * Billing Reconciliation Utility
 * Reconciles subscription status between Stripe and database
 * Used when webhooks are missed or database is out of sync
 */

import Stripe from "stripe";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { safeStripe, safeSupabase } from "@/lib/utils/server-guards";

/**
 * Reconcile subscription status for a user
 * Fetches latest status from Stripe and updates database
 */
export async function reconcileUserSubscription(
  userId: string
): Promise<{ success: boolean; subscription?: any; error?: string }> {
  try {
    const stripe = safeStripe();
    const supabase = safeSupabase(true);

    // Get user's Stripe customer ID from database
    const { data: user } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!user?.stripe_customer_id) {
      return { success: false, error: "User has no Stripe customer ID" };
    }

    // Get active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: "all",
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      // No active subscriptions in Stripe, mark as canceled in DB
      await supabase
        .from("subscriptions")
        .update({ status: "CANCELED" })
        .eq("stripeCustomerId", user.stripe_customer_id);

      return { success: true, subscription: null };
    }

    // Use the most recent subscription
    const latestSubscription = subscriptions.data[0];

    // Update database with latest status
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (!org) {
      return { success: false, error: "User has no organization" };
    }

    const subscriptionData = {
      org_id: org.id,
      status: latestSubscription.status.toUpperCase().replace("-", "_") as any,
      stripeCustomerId: latestSubscription.customer as string,
      stripeSubscriptionId: latestSubscription.id,
      stripePriceId: latestSubscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(latestSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(latestSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: latestSubscription.cancel_at_period_end,
    };

    const { data: updated, error } = await supabase
      .from("subscriptions")
      .upsert(subscriptionData, {
        onConflict: "stripeSubscriptionId",
      })
      .select()
      .single();

    if (error) {
      logger.error("Failed to reconcile subscription", error);
      return { success: false, error: error.message };
    }

    // Also update subscription_tiers if needed
    const metadata = latestSubscription.metadata;
    if (metadata?.userId && metadata?.tier) {
      const XP_MULTIPLIERS: Record<string, number> = {
        starter: 1.25,
        pro: 1.5,
        enterprise: 2.0,
      };

      await supabase.from("subscription_tiers").upsert({
        user_id: metadata.userId,
        tier: metadata.tier,
        xp_multiplier: XP_MULTIPLIERS[metadata.tier] || 1.0,
        expires_at: new Date(latestSubscription.current_period_end * 1000).toISOString(),
      });
    }

    return { success: true, subscription: updated };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Reconciliation failed", err);
    return { success: false, error: err.message };
  }
}

/**
 * Reconcile all subscriptions (admin only)
 * Useful for bulk reconciliation after webhook outages
 */
export async function reconcileAllSubscriptions(): Promise<{
  success: boolean;
  processed: number;
  errors: number;
  errorsList: Array<{ userId: string; error: string }>;
}> {
  const errorsList: Array<{ userId: string; error: string }> = [];
  let processed = 0;
  let errors = 0;

  try {
    const supabase = safeSupabase(true);

    // Get all users with Stripe customer IDs
    const { data: users } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .not("stripe_customer_id", "is", null);

    if (!users || users.length === 0) {
      return { success: true, processed: 0, errors: 0, errorsList: [] };
    }

    for (const user of users) {
      try {
        const result = await reconcileUserSubscription(user.id);
        if (result.success) {
          processed++;
        } else {
          errors++;
          errorsList.push({ userId: user.id, error: result.error || "Unknown error" });
        }
      } catch (error) {
        errors++;
        errorsList.push({
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { success: true, processed, errors, errorsList };
  } catch (error) {
    logger.error("Bulk reconciliation failed", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      processed,
      errors,
      errorsList: [
        ...errorsList,
        { userId: "bulk", error: error instanceof Error ? error.message : String(error) },
      ],
    };
  }
}
