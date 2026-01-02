/**
 * Enhanced Workflow Executor with Per-Step Logging
 * Extends executor-with-artifacts to log each step execution
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
import { workflowExecutorWithArtifacts } from "./executor-with-artifacts";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

/**
 * Enhanced executor with per-step logging
 */
export class WorkflowExecutorWithLogs {
  /**
   * Execute workflow and log each step
   */
  async execute(
    context: WorkflowExecutionContext,
    runId?: string
  ): Promise<WorkflowExecutionResult & { artifactId?: string }> {
    const startTime = Date.now();

    try {
      // Get workflow definition
      const { data: workflowData, error: workflowError } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", context.workflowId)
        .single();

      if (workflowError || !workflowData) {
        throw new Error(`Workflow not found: ${workflowError?.message}`);
      }

      const workflowDefinition: WorkflowDefinition = {
        id: workflowData.id,
        name: workflowData.name,
        version: workflowData.version,
        steps: workflowData.steps as WorkflowStep[],
        startStepId: workflowData.start_step_id,
        trigger: workflowData.trigger,
        initialState: workflowData.initial_state || {},
        category: (workflowData.category as "automation" | "reconciliation" | "consulting" | "custom") || "custom",
        enabled: workflowData.enabled ?? true,
        createdAt: workflowData.created_at || new Date().toISOString(),
        updatedAt: workflowData.updated_at || new Date().toISOString(),
        deprecated: workflowData.deprecated ?? false,
        introspectable: workflowData.introspectable ?? true,
        auditLog: workflowData.audit_log ?? true,
      };

      // Log workflow start
      if (runId) {
        await this.logStep({
          executionId: runId,
          workflowId: context.workflowId,
          stepId: "workflow_start",
          stepType: "workflow",
          status: "running",
          input: context.input,
          startedAt: new Date().toISOString(),
        });
      }

      // Execute workflow (this will create artifacts)
      const result = await workflowExecutorWithArtifacts.execute(context, runId);

      // Log each step execution
      if (runId && workflowDefinition.steps) {
        for (const step of workflowDefinition.steps) {
          // Get step result from execution state if available
          const stepResult = result.state?.[step.id];
          
          await this.logStep({
            executionId: runId,
            workflowId: context.workflowId,
            stepId: step.id,
            stepType: step.type,
            status: stepResult ? "completed" : "pending",
            input: stepResult ? undefined : step,
            output: stepResult,
            startedAt: new Date().toISOString(),
            completedAt: stepResult ? new Date().toISOString() : undefined,
          });
        }
      }

      // Log workflow completion
      if (runId) {
        await this.logStep({
          executionId: runId,
          workflowId: context.workflowId,
          stepId: "workflow_complete",
          stepType: "workflow",
          status: result.status === "completed" ? "completed" : "failed",
          output: result.output,
          error: result.error,
          startedAt: new Date(startTime).toISOString(),
          completedAt: result.completedAt || new Date().toISOString(),
          durationMs: Date.now() - startTime,
          metadata: {
            steps_executed: result.metrics?.stepsExecuted || 0,
            steps_succeeded: result.metrics?.stepsSucceeded || 0,
            steps_failed: result.metrics?.stepsFailed || 0,
            retries: result.metrics?.retries || 0,
            artifact_id: result.artifactId,
          },
        });
      }

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Log error
      if (runId) {
        await this.logStep({
          executionId: runId,
          workflowId: context.workflowId,
          stepId: "workflow_error",
          stepType: "error",
          status: "failed",
          error: {
            message: errorObj.message,
            stack: errorObj.stack,
            name: errorObj.name,
          },
          startedAt: new Date(startTime).toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime,
        });
      }

      logger.error("Workflow execution failed", errorObj, {
        workflowId: context.workflowId,
        tenantId: context.tenantId,
        runId,
      });

      throw error;
    }
  }

  /**
   * Log a step execution
   */
  private async logStep(params: {
    executionId: string;
    workflowId: string;
    stepId: string;
    stepType: string;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    input?: unknown;
    output?: unknown;
    error?: unknown;
    startedAt: string;
    completedAt?: string;
    durationMs?: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      // Get tenant_id from execution
      const { data: execution } = await supabase
        .from("workflow_executions")
        .select("tenant_id, user_id")
        .eq("id", params.executionId)
        .single();

      const { error } = await supabase.from("workflow_execution_logs").insert({
        execution_id: params.executionId,
        workflow_id: params.workflowId,
        user_id: execution?.user_id || null,
        tenant_id: execution?.tenant_id || null,
        step_id: params.stepId,
        step_type: params.stepType,
        status: params.status,
        input: params.input || null,
        output: params.output || null,
        error: params.error || null,
        started_at: params.startedAt,
        completed_at: params.completedAt || null,
        duration_ms: params.durationMs || null,
        metadata: params.metadata || null,
      });

      if (error) {
        logger.warn("Failed to log step execution", { error: error.message, stepId: params.stepId });
      }
    } catch (error) {
      logger.warn("Failed to log step execution", { error, stepId: params.stepId });
    }
  }
}

export const workflowExecutorWithLogs = new WorkflowExecutorWithLogs();
