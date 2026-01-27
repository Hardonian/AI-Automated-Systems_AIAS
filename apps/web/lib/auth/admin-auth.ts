/**
 * Admin Authentication & Authorization
 * 
 * Provides utilities for checking admin access and protecting admin routes.
 */

import { NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { serverLogger } from "@/lib/utils/logger";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) {return false;}

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Never evaluate admin status for a different user in a user-scoped context.
    if (!user || user.id !== userId) {
      return false;
    }

    const { data, error } = await supabase
      .from("profiles" as any)
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data) {return false;}

    // Check if user has admin role
    const profileData = data as { role?: string } | null;
    return profileData?.role === "admin" || profileData?.role === "super_admin";
  } catch (error) {
    serverLogger.error("Error checking admin status", error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

/**
 * Get current admin user from session
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {return null;}

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {return null;}

    const role = String((profile as any)?.role ?? "");
    const adminStatus = role === "admin" || role === "super_admin" || role === "financial_admin";
    if (!adminStatus) {return null;}

    return {
      id: user.id,
      email: user.email || "",
      role,
      isAdmin: true,
    };
  } catch (error) {
    serverLogger.error("Error getting admin user", error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Require admin access middleware
 */
export async function requireAdmin(
  _request: NextRequest
): Promise<{ authorized: boolean; user?: AdminUser; response?: NextResponse }> {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: adminUser,
  };
}

/**
 * Check admin access in server components
 */
export async function checkAdminAccess(): Promise<{
  isAdmin: boolean;
  user: AdminUser | null;
  redirect?: string;
}> {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    return {
      isAdmin: false,
      user: null,
      redirect: "/signin?redirect=/admin",
    };
  }

  return {
    isAdmin: true,
    user: adminUser,
  };
}

/**
 * Admin role levels
 */
export enum AdminRole {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  FINANCIAL_ADMIN = "financial_admin",
}

/**
 * Check if user has specific admin role
 */
export async function hasAdminRole(
  userId: string,
  requiredRole: AdminRole
): Promise<boolean> {
  const user = await getAdminUser();
  if (!user || user.id !== userId) {return false;}

  const roleHierarchy: Record<AdminRole, number> = {
    [AdminRole.ADMIN]: 1,
    [AdminRole.FINANCIAL_ADMIN]: 2,
    [AdminRole.SUPER_ADMIN]: 3,
  };

  const userRoleLevel = roleHierarchy[user.role as AdminRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Require specific admin role
 */
export async function requireAdminRole(
  request: NextRequest,
  requiredRole: AdminRole
): Promise<{ authorized: boolean; user?: AdminUser; response?: NextResponse }> {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized || !adminCheck.user) {
    return adminCheck;
  }

  const hasRole = await hasAdminRole(adminCheck.user.id, requiredRole);
  if (!hasRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Unauthorized: ${requiredRole} role required` },
        { status: 403 }
      ),
    };
  }

  return adminCheck;
}
