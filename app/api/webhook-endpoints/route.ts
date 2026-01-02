/**
 * Webhook Endpoints API
 * Create and manage tenant-scoped webhook endpoints
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { handleApiError } from "@/lib/api/route-handler";
import { assertCanCreateWebhook } from "@/lib/entitlements/server-gates";
import { env } from "@/lib/env";
import { SystemError, ValidationError, formatError } from "@/lib/errors";
import { logger } from "@/lib/logging/structured-logger";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(env.supabase.url, env.supabase.serviceRoleKey);

const createWebhookSchema = z.object({
  tenant_id: z.string().uuid(),
  system_id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
});

/**
 * POST /api/webhook-endpoints
 * Create a new webhook endpoint
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createWebhookSchema.parse(body);

    // Verify user is member of tenant
    const { data: membership, error: membershipError } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", validated.tenant_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Not a member of this tenant" },
        { status: 403 }
      );
    }

    // Check entitlement: can tenant create webhook?
    try {
      await assertCanCreateWebhook(validated.tenant_id);
    } catch (entitlementError) {
      const error = entitlementError instanceof SystemError
        ? entitlementError
        : new SystemError("Webhook limit exceeded");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: 403 }
      );
    }

    // Verify system exists and belongs to tenant
    const { data: system, error: systemError } = await supabase
      .from("workflows")
      .select("id")
      .eq("id", validated.system_id)
      .eq("tenant_id", validated.tenant_id)
      .single();

    if (systemError || !system) {
      return NextResponse.json(
        { error: "System not found or does not belong to tenant" },
        { status: 404 }
      );
    }

    // Generate webhook secret using database function
    const { data: secretData, error: secretError } = await supabaseAdmin.rpc(
      "generate_webhook_secret"
    );

    if (secretError || !secretData) {
      // Fallback: generate secret client-side if DB function fails
      const crypto = await import("crypto");
      const randomBytes = crypto.randomBytes(32);
      const secret = randomBytes.toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      
      // Use fallback secret
      const { data: endpoint, error: createError } = await supabaseAdmin
        .from("webhook_endpoints")
        .insert({
          tenant_id: validated.tenant_id,
          system_id: validated.system_id,
          secret,
          name: validated.name || `Webhook for ${validated.system_id}`,
          description: validated.description || null,
          created_by: user.id,
          enabled: true,
        })
        .select()
        .single();

      if (createError || !endpoint) {
        throw new SystemError(
          `Failed to create webhook endpoint: ${createError?.message || "Unknown error"}`
        );
      }

      const webhookUrl = `${request.nextUrl.origin}/api/webhooks/${validated.tenant_id}/${secret}`;

      return NextResponse.json({
        id: endpoint.id,
        tenant_id: endpoint.tenant_id,
        system_id: endpoint.system_id,
        webhook_url: webhookUrl,
        secret: secret,
        name: endpoint.name,
        description: endpoint.description,
        enabled: endpoint.enabled,
        created_at: endpoint.created_at,
      });
    }

    const secret = secretData as string;

    // Create webhook endpoint
    const { data: endpoint, error: createError } = await supabaseAdmin
      .from("webhook_endpoints")
      .insert({
        tenant_id: validated.tenant_id,
        system_id: validated.system_id,
        secret,
        name: validated.name || `Webhook for ${validated.system_id}`,
        description: validated.description || null,
        created_by: user.id,
        enabled: true,
      })
      .select()
      .single();

    if (createError || !endpoint) {
      throw new SystemError(
        `Failed to create webhook endpoint: ${createError?.message || "Unknown error"}`
      );
    }

    // Construct webhook URL
    const webhookUrl = `${request.nextUrl.origin}/api/webhooks/${validated.tenant_id}/${secret}`;

    logger.info("Webhook endpoint created", {
      endpointId: endpoint.id,
      tenantId: validated.tenant_id,
      systemId: validated.system_id,
      userId: user.id,
    });

    return NextResponse.json({
      id: endpoint.id,
      tenant_id: endpoint.tenant_id,
      system_id: endpoint.system_id,
      webhook_url: webhookUrl,
      secret: secret, // Return secret only on creation
      name: endpoint.name,
      description: endpoint.description,
      enabled: endpoint.enabled,
      created_at: endpoint.created_at,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = new ValidationError(
        "Invalid request data",
        error.errors.map((issue) => ({
          path: issue.path.map((p) => String(p)),
          message: issue.message,
        }))
      );
      const formatted = formatError(validationError);
      return NextResponse.json(
        { error: formatted.message, details: formatted.details },
        { status: formatted.statusCode }
      );
    }
    return handleApiError(error, "Failed to create webhook endpoint");
  }
}

/**
 * GET /api/webhook-endpoints?tenant_id=...
 * List webhook endpoints for a tenant
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = request.nextUrl.searchParams.get("tenant_id");
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id query parameter required" },
        { status: 400 }
      );
    }

    // Verify user is member of tenant
    const { data: membership, error: membershipError } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", tenantId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Not a member of this tenant" },
        { status: 403 }
      );
    }

    // Get webhook endpoints (don't return secrets)
    const { data: endpoints, error: endpointsError } = await supabase
      .from("webhook_endpoints")
      .select("id, tenant_id, system_id, name, description, enabled, created_at, updated_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (endpointsError) {
      throw new SystemError(`Failed to fetch webhook endpoints: ${endpointsError.message}`);
    }

    // Construct webhook URLs (without secrets - user needs to check secret separately)
    const endpointsWithUrls = (endpoints || []).map((endpoint: {
      id: string;
      tenant_id: string;
      system_id: string;
      name: string | null;
      description: string | null;
      enabled: boolean;
      created_at: string | null;
      updated_at: string | null;
    }) => ({
      ...endpoint,
      webhook_url_pattern: `${request.nextUrl.origin}/api/webhooks/${tenantId}/[secret]`,
      // Note: Secret is not returned for security
    }));

    return NextResponse.json({
      endpoints: endpointsWithUrls,
      count: endpointsWithUrls.length,
    });
  } catch (error) {
    return handleApiError(error, "Failed to list webhook endpoints");
  }
}
