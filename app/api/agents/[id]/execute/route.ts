/**
 * API Route: Execute Agent
 * Executes an agent with provided input
 */

import { NextRequest, NextResponse } from 'next/server';
import { agentExecutor } from '@/lib/agents/executor';
import { agentExecutionContextSchema } from '@/lib/agents/schema';
import { createClient } from '@/lib/supabase/server';
import { observabilityService } from '@/lib/observability/telemetry';

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
    observabilityService.logAgentExecution({
      agentId: params.id,
      userId: user.id,
      tenantId: tenantId || undefined,
      status: result.status === 'completed' ? 'completed' : 'failed',
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      duration: result.metrics?.duration,
      tokenUsage: result.metrics?.tokenUsage,
      cost: result.metrics?.cost,
      input: context.input,
      output: result.output,
      error: result.error,
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
        output: result.output || null,
        error: result.error || null,
        metrics: result.metrics || null,
        started_at: result.startedAt,
        completed_at: result.completedAt || null,
      });

    if (dbError) {
      console.error('Error saving execution to database:', dbError);
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error executing agent:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    );
  }
}
