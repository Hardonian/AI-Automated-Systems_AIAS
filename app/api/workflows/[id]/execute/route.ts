/**
 * API Route: Execute Workflow
 * Executes a workflow with provided input
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowExecutor } from '@/lib/workflows/executor';
import { workflowExecutionContextSchema } from '@/lib/workflows/dsl';
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

    const context = workflowExecutionContextSchema.parse({
      workflowId: params.id,
      userId: user.id,
      tenantId: tenantId || null,
      input: input || {},
      priority: body.priority || 'normal',
      sync: sync !== false,
    });

    // Log execution start
    observabilityService.logWorkflowExecution({
      workflowId: params.id,
      userId: user.id,
      tenantId: tenantId || undefined,
      status: 'started',
      startedAt: new Date().toISOString(),
      stepsExecuted: 0,
      stepsSucceeded: 0,
      stepsFailed: 0,
    });

    const result = await workflowExecutor.execute(context);

    // Log execution completion
    observabilityService.logWorkflowExecution({
      workflowId: params.id,
      userId: user.id,
      tenantId: tenantId || undefined,
      status: result.status === 'completed' ? 'completed' : 'failed',
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      duration: result.metrics?.duration,
      stepsExecuted: result.metrics?.stepsExecuted || 0,
      stepsSucceeded: result.metrics?.stepsSucceeded || 0,
      stepsFailed: result.metrics?.stepsFailed || 0,
      input: context.input,
      output: result.output,
      error: result.error,
    });

    // Save to database
    const { error: dbError } = await supabase
      .from('workflow_executions')
      .insert({
        workflow_id: params.id,
        user_id: user.id,
        tenant_id: tenantId || null,
        status: result.status,
        input: context.input,
        output: result.output || null,
        error: result.error || null,
        metrics: result.metrics || null,
        state: result.state || null,
        started_at: result.startedAt,
        completed_at: result.completedAt || null,
      });

    if (dbError) {
      console.error('Error saving execution to database:', dbError);
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}
