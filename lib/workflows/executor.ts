/**
 * Workflow Execution Engine
 * Node-based execution system with branching, retries, and error handling
 */

import { agentExecutor } from '../agents/executor';

import {
  WorkflowDefinition,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
  WorkflowStep,
} from './dsl';

export interface ExecutionNode {
  stepId: string;
  step: WorkflowStep;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: unknown;
  error?: Error;
  startedAt?: Date;
  completedAt?: Date;
  retries: number;
}

export interface ExecutionGraph {
  nodes: Map<string, ExecutionNode>;
  edges: Map<string, string[]>; // stepId -> next step IDs
  currentStepId: string | null;
  state: Record<string, unknown>;
}

/**
 * Workflow Executor Class
 */
export class WorkflowExecutor {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, ExecutionGraph> = new Map();

  /**
   * Register a workflow
   */
  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Execute workflow
   */
  async execute(
    context: WorkflowExecutionContext
  ): Promise<WorkflowExecutionResult> {
    const workflow: WorkflowDefinition | undefined = this.workflows.get(context.workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${context.workflowId} not found`);
    }

    const executionId: string = this.generateExecutionId();
    const graph: ExecutionGraph = this.buildExecutionGraph(workflow, context.input);
    this.executions.set(executionId, graph);

    const startTime: number = Date.now();
    let currentStepId: string | null = workflow.startStepId;

    try {
      while (currentStepId !== null) {
        const node: ExecutionNode | undefined = graph.nodes.get(currentStepId);
        if (!node) {
          throw new Error(`Step ${currentStepId} not found`);
        }

        // Execute step
        node.status = 'running';
        node.startedAt = new Date();

        try {
          const result: unknown = await this.executeStep(node.step, graph.state);
          node.status = 'completed';
          node.result = result;
          node.completedAt = new Date();
          
          // Update state
          graph.state = { ...graph.state, [node.stepId]: result };

          // Determine next step
          currentStepId = this.getNextStepId(node.step, graph, result);
        } catch (error: unknown) {
          node.status = 'failed';
          node.error = error instanceof Error ? error : new Error(String(error));
          node.completedAt = new Date();

          // Handle error based on step configuration
          if (node.step.onError === 'retry' && node.step.retry) {
          const retried: unknown | null = await this.retryStep(node, graph.state, node.step.retry);
          if (retried !== null && retried !== undefined) {
            node.status = 'completed';
            node.result = retried;
            currentStepId = this.getNextStepId(node.step, graph, retried);
            continue;
          }
          }

          if (node.step.onError === 'skip') {
            currentStepId = this.getNextStepId(node.step, graph, null);
            continue;
          }

          if (node.step.onError === 'fallback' && node.step.fallbackStepId) {
            currentStepId = node.step.fallbackStepId;
            continue;
          }

          // Fail workflow
          throw error;
        }
      }

      const _duration: number = Date.now() - startTime;
      const metrics: {
        stepsExecuted: number;
        stepsSucceeded: number;
        stepsFailed: number;
        retries: number;
        duration: number;
      } = this.calculateMetrics(graph);

      return {
        executionId,
        workflowId: context.workflowId,
        status: 'completed' as const,
        output: graph.state,
        metrics,
        state: graph.state,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const _duration: number = Date.now() - startTime;
      const metrics: {
        stepsExecuted: number;
        stepsSucceeded: number;
        stepsFailed: number;
        retries: number;
        duration: number;
      } = this.calculateMetrics(graph);

      return {
        executionId,
        workflowId: context.workflowId,
        status: 'failed' as const,
        error: {
          message: error instanceof Error ? error.message : String(error),
          code: 'EXECUTION_ERROR',
        },
        metrics,
        state: graph.state,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
      };
    } finally {
      this.executions.delete(executionId);
    }
  }

  /**
   * Build execution graph from workflow definition
   */
  private buildExecutionGraph(
    workflow: WorkflowDefinition,
    initialState: Record<string, unknown>
  ): ExecutionGraph {
    const nodes: Map<string, ExecutionNode> = new Map<string, ExecutionNode>();
    const edges: Map<string, string[]> = new Map<string, string[]>();

    // Create nodes
    workflow.steps.forEach((step: WorkflowStep): void => {
      nodes.set(step.id, {
        stepId: step.id,
        step,
        status: 'pending',
        retries: 0,
      });
    });

    // Build edges (simplified - would need proper graph building)
    workflow.steps.forEach((step: WorkflowStep, index: number): void => {
      if (index < workflow.steps.length - 1) {
        const nextStep: WorkflowStep | undefined = workflow.steps[index + 1];
        if (nextStep !== undefined) {
          edges.set(step.id, [nextStep.id]);
        }
      } else {
        edges.set(step.id, []);
      }
    });

    return {
      nodes,
      edges,
      currentStepId: workflow.startStepId,
      state: { ...workflow.initialState, ...initialState },
    };
  }

  /**
   * Execute a workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<unknown> {
    switch (step.type) {
      case 'transform':
        return this.executeTransform(step, state);
      case 'match':
        return this.executeMatch(step, state);
      case 'reconcile':
        return this.executeReconcile(step, state);
      case 'api':
        return this.executeAPI(step, state);
      case 'database':
        return this.executeDatabase(step, state);
      case 'generate':
        return this.executeGenerate(step, state);
      case 'agent':
        return this.executeAgent(step, state);
      case 'condition':
        return this.executeCondition(step, state);
      case 'loop':
        return this.executeLoop(step, state);
      case 'delay':
        return this.executeDelay(step, state);
      case 'human':
        return this.executeHuman(step, state);
      case 'notification':
        return this.executeNotification(step, state);
      case 'webhook':
        return this.executeWebhook(step, state);
      default:
        throw new Error(`Unknown step type: ${'type' in step ? String(step.type) : 'unknown'}`);
    }
  }

  /**
   * Execute transform step
   */
  private async executeTransform(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'transform' || step.config.type !== 'transform') {
      throw new Error('Invalid step type');
    }
    
    const {mapping} = step.config;
    const result: Record<string, unknown> = {};

    for (const [target, source] of Object.entries(mapping)) {
      const sourceAsString: string = typeof source === 'string' ? source : String(source);
      result[target] = this.resolvePath(sourceAsString, state);
    }

    return result;
  }

  /**
   * Execute match step
   */
  private async executeMatch(
    step: WorkflowStep,
    _state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'match') {throw new Error('Invalid step type');}
    
    // Simplified matching logic
    return { matched: true, matches: [] };
  }

  /**
   * Execute reconcile step
   */
  private async executeReconcile(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'reconcile' || step.config.type !== 'reconcile') {
      throw new Error('Invalid step type');
    }
    
    const sourceA: unknown = this.resolvePath(step.config.sourceA, state);
    const sourceB: unknown = this.resolvePath(step.config.sourceB, state);
    
    // Simplified reconciliation
    return {
      reconciled: true,
      sourceA,
      sourceB,
      strategy: step.config.reconciliationStrategy,
    };
  }

  /**
   * Execute API step
   */
  private async executeAPI(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'api' || step.config.type !== 'api') {
      throw new Error('Invalid step type');
    }
    
    const url: string = this.interpolateString(step.config.endpoint, state);
    const body: Record<string, unknown> | undefined = step.config.body 
      ? this.interpolateObject(step.config.body, state)
      : undefined;

    const response: Response = await fetch(url, {
      method: step.config.method,
      headers: {
        'Content-Type': 'application/json',
        ...step.config.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const jsonResult: unknown = await response.json();
    return jsonResult;
  }

  /**
   * Execute database step
   */
  private async executeDatabase(
    step: WorkflowStep,
    _state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'database' || step.config.type !== 'database') {
      throw new Error('Invalid step type');
    }
    
    // Would integrate with Supabase client
    // For now, return mock data
    return { operation: step.config.operation, table: step.config.table };
  }

  /**
   * Execute generate step
   */
  private async executeGenerate(
    step: WorkflowStep,
    _state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'generate' || step.config.type !== 'generate') {
      throw new Error('Invalid step type');
    }
    
    // Would use template engine
    return { generated: true, format: step.config.format };
  }

  /**
   * Execute agent step
   */
  private async executeAgent(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'agent' || step.config.type !== 'agent') {
      throw new Error('Invalid step type');
    }
    
    const result: {
      status: string;
      error?: { message?: string };
      output?: unknown;
    } = await agentExecutor.executeSync({
      agentId: step.config.agentId,
      userId: 'system', // Would come from context
      input: { ...step.config.input, ...state } as Record<string, unknown>,
      priority: 'normal',
    });

    if (result.status !== 'completed') {
      const errorMessage: string = result.error?.message ?? 'Agent execution failed';
      throw new Error(errorMessage);
    }

    const {output} = result;
    return output;
  }

  /**
   * Execute condition step
   */
  private async executeCondition(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<boolean> {
    if (step.type !== 'condition' || step.config.type !== 'condition') {
      throw new Error('Invalid step type');
    }
    
    // Evaluate conditions
    let result: boolean = true;
    for (const condition of step.config.conditions) {
      const fieldValue: unknown = this.resolvePath(condition.field, state);
      const conditionResult: boolean = this.evaluateCondition(condition, fieldValue);
      
      if (condition.logicalOperator === 'or') {
        result = result || conditionResult;
      } else {
        result = result && conditionResult;
      }
    }

    return result;
  }

  /**
   * Execute loop step
   */
  private async executeLoop(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<unknown[]> {
    if (step.type !== 'loop' || step.config.type !== 'loop') {
      throw new Error('Invalid step type');
    }
    
    const resolvedItems: unknown = this.resolvePath(step.config.items, state);
    if (!Array.isArray(resolvedItems)) {
      throw new Error(`Expected array at path ${step.config.items}`);
    }
    const items: unknown[] = resolvedItems;

    const results: unknown[] = [];
    const maxIterations: number = step.config.maxIterations ?? items.length;
    const iterationLimit: number = Math.min(items.length, maxIterations);

    for (let i: number = 0; i < iterationLimit; i++) {
      const _itemState: Record<string, unknown> = { ...state, item: items[i], index: i };
      
      // Execute steps for each item
      for (const _stepId of step.config.stepIds) {
        // Would execute nested steps
        results.push({ item: items[i], index: i });
      }
    }

    return results;
  }

  /**
   * Execute delay step
   */
  private async executeDelay(
    step: WorkflowStep,
    _state: Record<string, unknown>
  ): Promise<void> {
    if (step.type !== 'delay' || step.config.type !== 'delay') {
      throw new Error('Invalid step type');
    }
    
    await this.sleep(step.config.duration);
  }

  /**
   * Execute human checkpoint
   */
  private async executeHuman(
    step: WorkflowStep,
    _state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'human' || step.config.type !== 'human') {
      throw new Error('Invalid step type');
    }
    
    // Would create a human task and wait for approval
    // For now, return mock approval
    return { approved: true, prompt: step.config.prompt };
  }

  /**
   * Execute notification step
   */
  private async executeNotification(
    step: WorkflowStep,
    _state: Record<string, unknown>
  ): Promise<unknown> {
    if (step.type !== 'notification' || step.config.type !== 'notification') {
      throw new Error('Invalid step type');
    }
    
    // Would send notification via appropriate channel
    return { sent: true, channel: step.config.channel };
  }

  /**
   * Execute webhook step
   */
  private async executeWebhook(
    step: WorkflowStep,
    state: Record<string, unknown>
  ): Promise<{ status: number; sent: boolean }> {
    if (step.type !== 'webhook' || step.config.type !== 'webhook') {
      throw new Error('Invalid step type');
    }
    
    const url: string = this.interpolateString(step.config.url, state);
    const body: Record<string, unknown> | undefined = step.config.body
      ? this.interpolateObject(step.config.body, state)
      : undefined;

    const response: Response = await fetch(url, {
      method: step.config.method,
      headers: step.config.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return { status: response.status, sent: true };
  }

  /**
   * Get next step ID based on current step and result
   */
  private getNextStepId(
    step: WorkflowStep,
    graph: ExecutionGraph,
    result: unknown
  ): string | null {
    if (step.type === 'condition') {
      const conditionResult: boolean = typeof result === 'boolean' ? result : false;
      if (step.config.type === 'condition') {
        const nextSteps: string[] | undefined = conditionResult 
          ? step.config.then
          : step.config.else;
        const firstStep: string | undefined = nextSteps?.[0];
        return (typeof firstStep === 'string' ? firstStep : null);
      }
      return null;
    }

    const edges: string[] | undefined = graph.edges.get(step.id);
    const firstEdge: string | undefined = edges?.[0];
    return (typeof firstEdge === 'string' ? firstEdge : null);
  }

  /**
   * Retry step execution
   */
  private async retryStep(
    node: ExecutionNode,
    state: Record<string, unknown>,
    retryConfig: WorkflowStep['retry']
  ): Promise<unknown | null> {
    if (!retryConfig) {return null;}

    let delay: number = retryConfig.initialDelay;

    for (let attempt: number = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      await this.sleep(delay);
      node.retries++;

      try {
        const retryResult: unknown = await this.executeStep(node.step, state);
        return retryResult;
      } catch (error: unknown) {
        if (attempt === retryConfig.maxAttempts) {
          return null;
        }

        if (retryConfig.backoff === 'exponential') {
          const maxDelayValue: number = retryConfig.maxDelay ?? 60000;
          delay = Math.min(delay * 2, maxDelayValue);
        }
      }
    }

    return null;
  }

  /**
   * Calculate execution metrics
   */
  private calculateMetrics(graph: ExecutionGraph): {
    stepsExecuted: number;
    stepsSucceeded: number;
    stepsFailed: number;
    retries: number;
    duration: number;
  } {
    let stepsExecuted: number = 0;
    let stepsSucceeded: number = 0;
    let stepsFailed: number = 0;
    let retries: number = 0;

    graph.nodes.forEach((node: ExecutionNode): void => {
      if (node.status !== 'pending') {
        stepsExecuted++;
      }
      if (node.status === 'completed') {
        stepsSucceeded++;
      }
      if (node.status === 'failed') {
        stepsFailed++;
      }
      retries += node.retries;
    });

    return {
      stepsExecuted,
      stepsSucceeded,
      stepsFailed,
      retries,
      duration: 0, // Would calculate from timestamps
    };
  }

  /**
   * Resolve path in state object
   */
  private resolvePath(path: string, state: Record<string, unknown>): unknown {
    const parts: string[] = path.split('.');
    let current: unknown = state;

    for (const part of parts) {
      if (current !== null && current !== undefined && typeof current === 'object' && part in current) {
        const currentAsRecord: Record<string, unknown> = current as Record<string, unknown>;
        current = currentAsRecord[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Interpolate string with state variables
   */
  private interpolateString(template: string, state: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_match: string, key: string): string => {
      const value: unknown = this.resolvePath(key, state);
      return value !== undefined ? String(value) : '';
    });
  }

  /**
   * Interpolate object with state variables
   */
  private interpolateObject(
    obj: Record<string, unknown>,
    state: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key] = this.interpolateString(value, state);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const valueAsRecord: Record<string, unknown> = value as Record<string, unknown>;
        result[key] = this.interpolateObject(valueAsRecord, state);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(
    condition: Record<string, unknown> | string,
    value: unknown
  ): boolean {
    // Type guard: if condition is a string, treat it as a simple equality check
    if (typeof condition === 'string') {
      return value === condition;
    }
    
    // Ensure condition has required properties with explicit type guard
    if (typeof condition !== 'object' || condition === null || !('operator' in condition)) {
      return false;
    }
    
    // Type guard for condition object with operator property
    const conditionWithOperator = condition as { operator: string; value: unknown };
    const conditionValue: unknown = conditionWithOperator.value;
    const {operator} = conditionWithOperator;
    
    switch (operator) {
      case 'equals':
        return value === conditionValue;
      case 'notEquals':
        return value !== conditionValue;
      case 'greaterThan': {
        const valueAsNumber: number | undefined = typeof value === 'number' ? value : undefined;
        const conditionValueAsNumber: number | undefined = typeof conditionValue === 'number' ? conditionValue : undefined;
        return valueAsNumber !== undefined && conditionValueAsNumber !== undefined && valueAsNumber > conditionValueAsNumber;
      }
      case 'lessThan': {
        const valueAsNumber: number | undefined = typeof value === 'number' ? value : undefined;
        const conditionValueAsNumber: number | undefined = typeof conditionValue === 'number' ? conditionValue : undefined;
        return valueAsNumber !== undefined && conditionValueAsNumber !== undefined && valueAsNumber < conditionValueAsNumber;
      }
      case 'contains': {
        const valueAsString: string | undefined = typeof value === 'string' ? value : undefined;
        return valueAsString !== undefined && valueAsString.includes(String(conditionValue));
      }
      case 'notContains': {
        const valueAsString: string | undefined = typeof value === 'string' ? value : undefined;
        return valueAsString !== undefined && !valueAsString.includes(String(conditionValue));
      }
      case 'exists':
        return value !== undefined && value !== null;
      case 'notExists':
        return value === undefined || value === null;
      default:
        return false;
    }
  }

  /**
   * Generate execution ID
   */
  private generateExecutionId(): string {
    return `wf_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get execution state
   */
  getExecutionState(executionId: string): ExecutionGraph | undefined {
    return this.executions.get(executionId);
  }
}

// Export singleton instance
export const workflowExecutor = new WorkflowExecutor();
