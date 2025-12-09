"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionResults } from "@/components/workflows/ExecutionResults";
import { logger } from "@/lib/logging/structured-logger";
import { track } from "@/lib/telemetry/track";
export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflow");
  interface ExecutionResult {
    id: string;
    workflowId: string;
    status: "pending" | "running" | "completed" | "failed";
    startedAt: string;
    completedAt?: string;
    error?: string;
    results?: Record<string, unknown>;
  }
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    if (workflowId && !executed) {
      executeWorkflow();
    }
  }, [workflowId]);

  async function executeWorkflow() {
    if (!workflowId) {return;}

    setLoading(true);
    setExecuted(true);

    try {
      const response = await fetch("/api/workflows/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify({
          workflowId,
          trigger: {
            type: "manual",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute workflow");
      }

      const data = await response.json();
      setExecution(data.execution);

      // Track workflow execution completion
      const userId = localStorage.getItem("user_id") || "anonymous";
      await track(userId, {
        type: "workflow_executed",
        path: "/onboarding/results",
        meta: {
          workflow_id: workflowId,
          execution_id: data.execution.id,
          status: data.execution.status,
          timestamp: new Date().toISOString(),
        },
        app: "web",
      });
    } catch (error) {
      logger.error("Failed to execute workflow", error instanceof Error ? error : new Error(String(error)), {
        component: "ResultsPage",
        workflowId,
        action: "executeWorkflow"
      });
      setExecution({
        id: "error",
        workflowId,
        status: "failed",
        error: error instanceof Error ? error.message : "Failed to execute workflow",
        startedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  function handleComplete() {
    router.push("/onboarding/complete");
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Test Your Workflow</h1>
        <p className="text-muted-foreground">
          Let's run your workflow to make sure everything works correctly
        </p>
      </div>

      <ExecutionResults execution={execution} loading={loading} />

      {execution && execution.status === "completed" && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Workflow Test Successful!
            </CardTitle>
            <CardDescription>
              Your workflow executed successfully. You're all set!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" onClick={handleComplete}>
              Complete Onboarding
            </Button>
          </CardContent>
        </Card>
      )}

      {execution && execution.status === "failed" && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle>Workflow Test Had Issues</CardTitle>
            <CardDescription>
              Your workflow was created but the test run encountered some issues. You can still proceed and fix it later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" variant="outline" onClick={handleComplete}>
              Continue Anyway
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
