/**
 * API Route: Execute Agent
 * Executes an agent with provided input
 */

import { NextRequest, NextResponse } from 'next/server';

import { agentExecutor } from '@/lib/agents/executor';
import { agentExecutionContextSchema } from '@/lib/agents/schema';
import { logger } from '@/lib/logging/structured-logger';
import { observabilityService } from '@/lib/observability/telemetry';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { input, tenantId, sync } = body;

    const context = agentExecutionContextSchema.parse({
      agentId: params.id,
      userId: user.id,
      tenantId: tenantId || null,
      input: input || {},
      priority: body.priority || 'normal',
    });

    // Log execution start
    observabilityService.logAgentExecution({
      agentId: params.id,
      userId: user.id,
      tenantId: tenantId || undefined,
      status: 'started',
      startedAt: new Date().toISOString(),
    });

    let result;
    if (sync !== false) {
      result = await agentExecutor.executeSync(context);
    } else {
      result = await agentExecutor.executeAsync(context);
    }

    // Log execution completion
    const isCompleted = result.status === 'completed';
    const isFailed = result.status === 'failed';
    const logStatus = isCompleted ? 'completed' as const : isFailed ? 'failed' as const : 'started' as const;
    observabilityService.logAgentExecution({
      agentId: params.id,
      userId: user.id,
      tenantId: tenantId || undefined,
      status: logStatus,
      startedAt: 'startedAt' in result && result.startedAt ? result.startedAt : new Date().toISOString(),
      completedAt: 'completedAt' in result && result.completedAt ? result.completedAt : undefined,
      duration: 'metrics' in result ? result.metrics?.duration : undefined,
      tokenUsage: 'metrics' in result ? result.metrics?.tokenUsage : undefined,
      cost: 'metrics' in result ? result.metrics?.cost : undefined,
      input: context.input,
      output: 'output' in result ? (result.output as Record<string, unknown> | undefined) : undefined,
      error: 'error' in result ? (result.error && typeof result.error === 'object' ? result.error as { message: string; code?: string } : { message: String(result.error) }) : undefined,
    });

    // Save to database
    const { error: dbError } = await supabase
      .from('agent_executions')
      .insert({
        agent_id: params.id,
        user_id: user.id,
        tenant_id: tenantId || null,
        status: result.status,
        input: context.input,
        output: 'output' in result ? result.output || null : null,
        error: 'error' in result ? result.error || null : null,
        metrics: 'metrics' in result ? result.metrics || null : null,
        started_at: 'startedAt' in result ? result.startedAt : null,
        completed_at: 'completedAt' in result ? result.completedAt : null,
      } as Record<string, unknown>);

    if (dbError) {
      logger.error('Error saving execution to database', new Error(dbError.message), {
        component: 'AgentExecuteAPI',
        action: 'POST',
        agentId: params.id,
        userId: user.id,
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    logger.error('Error executing agent', error instanceof Error ? error : new Error(String(error)), {
      component: 'AgentExecuteAPI',
      action: 'POST',
      agentId: params.id,
    });
    return NextResponse.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    );
  }
}
