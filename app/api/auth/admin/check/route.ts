/**
 * Admin Access Check API
 * 
 * Checks if current user has admin access.
 */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/admin/check
 * Check admin access
 */
export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { isAdmin: false, hasFinancialAccess: false },
        { status: 403 }
      );
    }

    const hasFinancialAccess = await hasAdminRole(adminUser.id, AdminRole.FINANCIAL_ADMIN);

    const response = NextResponse.json({
      isAdmin: true,
      hasFinancialAccess,
      email: adminUser.email,
      role: adminUser.role,
    });

    addSecurityHeaders(response);
    return response;
  } catch (error) {
    logger.error("Error checking admin access:", error instanceof Error ? error : new Error(String(error)), { component: "route", action: "unknown" });
    return NextResponse.json(
      { isAdmin: false, hasFinancialAccess: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
