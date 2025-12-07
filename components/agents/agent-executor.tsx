/**
 * Agent Executor Component
 * Execute agents with input and view results
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { agentExecutor } from "@/lib/agents/executor";
import { AgentExecutionContext, AgentExecutionResult } from "@/lib/agents/schema";
import { logger } from "@/lib/utils/logger";

interface AgentExecutorProps {
  agentId: string;
  userId: string;
  tenantId?: string;
}

export function AgentExecutorComponent({ agentId, userId, tenantId }: AgentExecutorProps) {
  const [input, setInput] = useState("{}");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<AgentExecutionResult | null>(null);
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

      const context: AgentExecutionContext = {
        agentId,
        userId,
        tenantId,
        input: parsedInput,
      };

      const executionResult = await agentExecutor.executeSync(context);
      setResult(executionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      logger.error("Agent execution failed", err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Execute Agent</CardTitle>
          <CardDescription>
            Provide input data and execute the agent
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
                Execute Agent
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
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
