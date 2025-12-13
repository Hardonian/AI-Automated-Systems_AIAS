/**
 * Billing Reconciliation Endpoint
 * Admin-only endpoint to reconcile subscription status
 */

import { NextResponse } from "next/server";

import { createPOSTHandler } from "@/lib/api/route-handler";
import { reconcileUserSubscription, reconcileAllSubscriptions } from "@/lib/billing/reconciliation";
import { ValidationError, AuthorizationError, formatError } from "@/lib/errors";
import { logger } from "@/lib/logging/structured-logger";
import { adminGuard } from "@/lib/middleware/admin-guard";

/**
 * POST /api/billing/reconcile
 * Reconcile subscription status for a user or all users (admin only)
 */
export const POST = createPOSTHandler(
  async (context) => {
    const { request } = context;
    
    // Check admin access
    const adminCheck = await adminGuard(request);
    if (adminCheck) {
      const error = new AuthorizationError("Admin access required");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    const body = await request.json();
    const { userId, reconcileAll } = body as { userId?: string; reconcileAll?: boolean };

    if (reconcileAll) {
      // Reconcile all subscriptions
      logger.info("Bulk reconciliation requested");
      const result = await reconcileAllSubscriptions();
      
      return NextResponse.json({
        success: result.success,
        processed: result.processed,
        errors: result.errors,
        errorsList: result.errorsList,
      });
    }

    if (!userId) {
      const error = new ValidationError("userId is required when reconcileAll is false");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    // Reconcile single user
    logger.info("Reconciliation requested", { userId });
    const result = await reconcileUserSubscription(userId);

    if (!result.success) {
      const error = new ValidationError(result.error || "Reconciliation failed");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
    });
  },
  {
    requireAuth: true,
    cache: { enabled: false },
  }
);
