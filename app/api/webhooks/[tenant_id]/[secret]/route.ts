/**
 * External Webhook Endpoint
 * Receives webhooks from external systems and triggers workflow execution
 * 
 * Path: /api/webhooks/[tenant_id]/[secret]
 * Method: POST
 * 
 * This endpoint:
 * 1. Verifies webhook secret
 * 2. Validates tenant_id
 * 3. Finds associated system/workflow
 * 4. Creates run record
 * 5. Executes workflow asynchronously
 * 6. Returns 202 Accepted immediately
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

import { env } from "@/lib/env";
import { SystemError, ValidationError, formatError } from "@/lib/errors";
import { assertCanExecuteRun } from "@/lib/entitlements/server-gates";
import { logger } from "@/lib/logging/structured-logger";
import { workflowExecutorWithLogs } from "@/lib/workflows/executor-with-logs";

export const runtime = "nodejs"; // Required for crypto operations

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

interface WebhookPayload {
  [key: string]: unknown;
}

/**
 * Verify webhook secret matches stored secret
 */
async function verifyWebhookSecret(
  tenantId: string,
  secret: string
): Promise<{ valid: boolean; endpoint?: { id: string; system_id: string } }> {
  const { data: endpoint, error } = await supabase
    .from("webhook_endpoints")
    .select("id, system_id, secret, enabled")
    .eq("tenant_id", tenantId)
    .eq("secret", secret)
    .eq("enabled", true)
    .single();

  if (error || !endpoint) {
    return { valid: false };
  }

  // Constant-time comparison to prevent timing attacks
  const storedSecret = endpoint.secret;
  const providedSecret = secret;
  
  if (storedSecret.length !== providedSecret.length) {
    return { valid: false };
  }

  let isValid = true;
  for (let i = 0; i < storedSecret.length; i++) {
    isValid = isValid && storedSecret[i] === providedSecret[i];
  }

  if (!isValid) {
    return { valid: false };
  }

  return {
    valid: true,
    endpoint: {
      id: endpoint.id,
      system_id: endpoint.system_id,
    },
  };
}

/**
 * Store webhook payload immutably
 */
async function storeWebhookPayload(
  tenantId: string,
  systemId: string,
  payload: WebhookPayload
): Promise<string> {
  const { data, error } = await supabase
    .from("workflow_executions")
    .insert({
      workflow_id: systemId,
      tenant_id: tenantId,
      user_id: null, // System-triggered, no user
      status: "pending",
      input: payload,
      metadata: {
        trigger_type: "webhook",
        received_at: new Date().toISOString(),
      },
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new SystemError(
      `Failed to store webhook payload: ${error?.message || "Unknown error"}`
    );
  }

  return data.id;
}

/**
 * Execute workflow asynchronously
 */
async function executeWorkflowAsync(
  runId: string,
  systemId: string,
  tenantId: string,
  input: WebhookPayload
): Promise<void> {
  try {
    // Update run status to running
    await supabase
      .from("workflow_executions")
      .update({ status: "running", started_at: new Date().toISOString() })
      .eq("id", runId);

    // Get workflow definition
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", systemId)
      .eq("tenant_id", tenantId)
      .eq("enabled", true)
      .single();

    if (workflowError || !workflow) {
      throw new SystemError(`Workflow not found or disabled: ${workflowError?.message}`);
    }

    // Execute workflow with artifacts and logs
    const result = await workflowExecutorWithLogs.execute(
      {
        workflowId: systemId,
        userId: "system", // System-triggered
        tenantId,
        input,
        priority: "normal",
        sync: false,
      },
      runId // Pass runId for artifact and log creation
    );

    // Update run with result (executor-with-artifacts already created artifact and logs)
    await supabase
      .from("workflow_executions")
      .update({
        status: result.status === "completed" ? "completed" : "failed",
        output: result.output || null,
        error: result.error || null,
        metrics: result.metrics || null,
        state: result.state || null,
        completed_at: result.completedAt || new Date().toISOString(),
        metadata: {
          ...(await supabase.from("workflow_executions").select("metadata").eq("id", runId).single()).data?.metadata,
          artifact_id: result.artifactId,
        },
      })
      .eq("id", runId);

    logger.info("Webhook-triggered workflow completed", {
      runId,
      systemId,
      tenantId,
      status: result.status,
    });
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Update run with error
    await supabase
      .from("workflow_executions")
      .update({
        status: "failed",
        error: {
          message: errorObj.message,
          code: "EXECUTION_ERROR",
        },
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    logger.error("Webhook-triggered workflow failed", errorObj, {
      runId,
      systemId,
      tenantId,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tenant_id: string; secret: string } }
): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const { tenant_id: tenantId, secret } = params;

    // Validate tenant_id format (UUID)
    if (!tenantId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const error = new ValidationError("Invalid tenant_id format");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    // Verify webhook secret
    const verification = await verifyWebhookSecret(tenantId, secret);
    if (!verification.valid || !verification.endpoint) {
      // Don't reveal whether tenant_id or secret is wrong (security)
      const error = new ValidationError("Invalid webhook endpoint");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: 404 } // 404 to not reveal existence
      );
    }

    // Parse payload
    let payload: WebhookPayload;
    try {
      payload = await request.json();
    } catch {
      const error = new ValidationError("Invalid JSON payload");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    // Check entitlement: can tenant execute a run?
    try {
      await assertCanExecuteRun(tenantId);
    } catch (entitlementError) {
      const error = entitlementError instanceof SystemError 
        ? entitlementError 
        : new SystemError("Run limit exceeded");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: 403 } // Forbidden
      );
    }

    // Store payload and create run
    const runId = await storeWebhookPayload(
      tenantId,
      verification.endpoint.system_id,
      payload
    );

    // Execute workflow asynchronously (fire and forget)
    // In production, this should use a queue system
    executeWorkflowAsync(runId, verification.endpoint.system_id, tenantId, payload).catch(
      (error) => {
        logger.error("Failed to execute webhook workflow", error instanceof Error ? error : new Error(String(error)), {
          runId,
          tenantId,
        });
      }
    );

    // Return 202 Accepted immediately
    return NextResponse.json(
      {
        received: true,
        run_id: runId,
        message: "Webhook received and queued for execution",
      },
      { status: 202 }
    );
  } catch (error) {
    const systemError = new SystemError(
      "Webhook processing error",
      error instanceof Error ? error : new Error(String(error))
    );
    
    logger.error("Webhook endpoint error", systemError, {
      tenantId: params.tenant_id,
    });

    const formatted = formatError(systemError);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}
