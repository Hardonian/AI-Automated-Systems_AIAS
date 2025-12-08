/**
 * Workflow Executor Component
 * Execute workflows with input and view results
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { workflowExecutor } from "@/lib/workflows/executor";
import { WorkflowExecutionContext, WorkflowExecutionResult } from "@/lib/workflows/dsl";
import { logger } from "@/lib/utils/logger";

interface WorkflowExecutorProps {
  workflowId: string;
  userId: string;
  tenantId?: string;
}

export function WorkflowExecutorComponent({ workflowId, userId, tenantId }: WorkflowExecutorProps) {
  const [input, setInput] = useState("{}");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<WorkflowExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setExecuting(true);
    setError(null);
    setResult(null);

    try {
      let parsedInput: Record<string, unknown>;
      try {
        parsedInput = JSON.parse(input);
      } catch (e) {
        throw new Error("Invalid JSON input");
      }

      const context: WorkflowExecutionContext = {
        workflowId,
        userId,
        tenantId,
        input: parsedInput,
        sync: true,
        priority: 'normal',
      };

      const executionResult = await workflowExecutor.execute(context);
      setResult(executionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      logger.error("Workflow execution failed", err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Execute Workflow</CardTitle>
          <CardDescription>
            Provide input data and execute the workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input (JSON)</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="font-mono text-sm"
              rows={10}
            />
          </div>

          <Button
            onClick={handleExecute}
            disabled={executing}
            className="w-full"
          >
            {executing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute Workflow
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Execution Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Execution Result
            </CardTitle>
            <CardDescription>
              Execution ID: {result.executionId}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <p className="text-sm font-medium">{result.status}</p>
            </div>

            {result.metrics && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <p className="text-sm">{result.metrics.duration}ms</p>
                </div>
                <div>
                  <Label>Steps Executed</Label>
                  <p className="text-sm">{result.metrics.stepsExecuted}</p>
                </div>
                <div>
                  <Label>Steps Succeeded</Label>
                  <p className="text-sm">{result.metrics.stepsSucceeded}</p>
                </div>
                <div>
                  <Label>Steps Failed</Label>
                  <p className="text-sm">{result.metrics.stepsFailed}</p>
                </div>
              </div>
            )}

            {result.output && (
              <div>
                <Label>Output</Label>
                <pre className="mt-2 p-4 bg-muted rounded-md text-sm overflow-auto">
                  {JSON.stringify(result.output, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div>
                <Label className="text-destructive">Error</Label>
                <p className="text-sm text-destructive">{result.error.message}</p>
                {result.error.stepId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Failed at step: {result.error.stepId}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
