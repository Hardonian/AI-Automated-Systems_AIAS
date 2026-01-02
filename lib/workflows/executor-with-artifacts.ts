/**
 * Enhanced Workflow Executor with Artifacts and Logs
 * Extends the base executor to:
 * 1. Create artifacts from deterministic outputs
 * 2. Populate run_logs during execution
 * 3. Persist execution state to database
 */

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import {
  WorkflowDefinition,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
  WorkflowStep,
} from "./dsl";
import { workflowExecutor } from "./executor";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

interface ExecutionLogEntry {
  execution_id: string;
  workflow_id: string;
  step_id: string;
  step_type: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  input?: unknown;
  output?: unknown;
  error?: unknown;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Enhanced executor that creates artifacts and logs
 */
export class WorkflowExecutorWithArtifacts {
  /**
   * Execute workflow and create artifacts + logs
   */
  async execute(
    context: WorkflowExecutionContext,
    runId?: string
  ): Promise<WorkflowExecutionResult & { artifactId?: string }> {
    const startTime = Date.now();

    try {
      // Get workflow definition from database if not in memory
      const { data: workflowData, error: workflowError } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", context.workflowId)
        .single();

      if (workflowError || !workflowData) {
        throw new Error(`Workflow not found: ${workflowError?.message}`);
      }

      // Register workflow in executor if not already registered
      const workflowDefinition: WorkflowDefinition = {
        id: workflowData.id,
        name: workflowData.name,
        version: workflowData.version,
        steps: workflowData.steps as WorkflowStep[],
        startStepId: workflowData.start_step_id,
        trigger: workflowData.trigger,
        initialState: workflowData.initial_state || {},
      };

      workflowExecutor.registerWorkflow(workflowDefinition);

      // Execute workflow
      const result = await workflowExecutor.execute(context);

      // Create artifact from output
      let artifactId: string | undefined;
      if (result.status === "completed" && result.output) {
        artifactId = await this.createArtifact(
          runId || result.executionId,
          context.workflowId,
          context.tenantId || null,
          result.output
        );
      }

      // Populate logs (if runId provided, link to database run)
      if (runId) {
        await this.populateLogs(runId, context.workflowId, result);
      }

      return {
        ...result,
        artifactId,
      };
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      logger.error("Enhanced workflow execution failed", errorObj, {
        workflowId: context.workflowId,
        tenantId: context.tenantId,
      });

      // Populate error logs if runId provided
      if (runId) {
        await this.logError(runId, context.workflowId, errorObj);
      }

      throw error;
    }
  }

  /**
   * Create artifact from execution output
   */
  private async createArtifact(
    runId: string,
    systemId: string,
    tenantId: string | null,
    output: unknown
  ): Promise<string> {
    try {
      // Determine artifact type based on output
      let artifactType = "json";
      let content: unknown = null;
      let contentText: string | null = null;

      if (typeof output === "string") {
        artifactType = "text";
        contentText = output;
      } else if (output && typeof output === "object") {
        artifactType = "json";
        content = output;
      } else {
        artifactType = "text";
        contentText = String(output);
      }

      // Get tenant_id from run if not provided
      let finalTenantId = tenantId;
      if (!finalTenantId) {
        const { data: run } = await supabase
          .from("workflow_executions")
          .select("tenant_id")
          .eq("id", runId)
          .single();
        finalTenantId = run?.tenant_id || null;
      }

      if (!finalTenantId) {
        throw new Error("Cannot create artifact without tenant_id");
      }

      const { data: artifact, error } = await supabase
        .from("artifacts")
        .insert({
          run_id: runId,
          tenant_id: finalTenantId,
          system_id: systemId,
          artifact_type: artifactType,
          content: content as Record<string, unknown> | null,
          content_text: contentText,
          metadata: {
            created_by: "system",
            execution_id: runId,
          },
        })
        .select("id")
        .single();

      if (error || !artifact) {
        throw new Error(`Failed to create artifact: ${error?.message || "Unknown error"}`);
      }

      logger.info("Artifact created", {
        artifactId: artifact.id,
        runId,
        systemId,
        tenantId: finalTenantId,
        artifactType,
      });

      return artifact.id;
    } catch (error) {
      logger.error("Failed to create artifact", error instanceof Error ? error : new Error(String(error)), {
        runId,
        systemId,
        tenantId,
      });
      throw error;
    }
  }

  /**
   * Populate run logs from execution result
   */
  private async populateLogs(
    runId: string,
    workflowId: string,
    result: WorkflowExecutionResult
  ): Promise<void> {
    try {
      // Get execution state from executor (if available)
      // For now, create a summary log entry
      const logEntry: ExecutionLogEntry = {
        execution_id: runId,
        workflow_id: workflowId,
        step_id: "workflow_complete",
        step_type: "workflow",
        status: result.status === "completed" ? "completed" : "failed",
        output: result.output || null,
        error: result.error || null,
        started_at: result.startedAt,
        completed_at: result.completedAt || new Date().toISOString(),
        duration_ms: result.metrics?.duration || 0,
        metadata: {
          steps_executed: result.metrics?.stepsExecuted || 0,
          steps_succeeded: result.metrics?.stepsSucceeded || 0,
          steps_failed: result.metrics?.stepsFailed || 0,
          retries: result.metrics?.retries || 0,
        },
      };

      const { error } = await supabase.from("workflow_execution_logs").insert({
        execution_id: logEntry.execution_id,
        workflow_id: logEntry.workflow_id,
        step_id: logEntry.step_id,
        step_type: logEntry.step_type,
        status: logEntry.status,
        input: logEntry.input || null,
        output: logEntry.output || null,
        error: logEntry.error || null,
        started_at: logEntry.started_at,
        completed_at: logEntry.completed_at,
        duration_ms: logEntry.duration_ms,
        metadata: logEntry.metadata || null,
      });

      if (error) {
        logger.warn("Failed to populate run logs", { error: error.message, runId });
      } else {
        logger.info("Run logs populated", { runId, workflowId });
      }
    } catch (error) {
      logger.warn("Failed to populate run logs", { error, runId });
    }
  }

  /**
   * Log error to run_logs
   */
  private async logError(
    runId: string,
    workflowId: string,
    error: Error
  ): Promise<void> {
    try {
      await supabase.from("workflow_execution_logs").insert({
        execution_id: runId,
        workflow_id: workflowId,
        step_id: "workflow_error",
        step_type: "error",
        status: "failed",
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      });
    } catch (logError) {
      logger.warn("Failed to log error", { error: logError, runId });
    }
  }
}

export const workflowExecutorWithArtifacts = new WorkflowExecutorWithArtifacts();
