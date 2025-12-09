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
    const workflow = this.workflows.get(context.workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${context.workflowId} not found`);
    }

    const executionId = this.generateExecutionId();
    const graph = this.buildExecutionGraph(workflow, context.input);
    this.executions.set(executionId, graph);

    const startTime = Date.now();
    let currentStepId: string | null = workflow.startStepId;

    try {
      while (currentStepId) {
        const node = graph.nodes.get(currentStepId);
        if (!node) {
          throw new Error(`Step ${currentStepId} not found`);
        }

        // Execute step
        node.status = 'running';
        node.startedAt = new Date();

        try {
          const result = await this.executeStep(node.step, graph.state);
          node.status = 'completed';
          node.result = result;
          node.completedAt = new Date();
          
          // Update state
          graph.state = { ...graph.state, [node.stepId]: result };

          // Determine next step
          currentStepId = this.getNextStepId(node.step, graph, result);
        } catch (error) {
          node.status = 'failed';
          node.error = error instanceof Error ? error : new Error(String(error));
          node.completedAt = new Date();

          // Handle error based on step configuration
          if (node.step.onError === 'retry' && node.step.retry) {
            const retried = await this.retryStep(node, graph.state, node.step.retry);
            if (retried) {
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

      const _duration = Date.now() - startTime;
      const metrics = this.calculateMetrics(graph);

      return {
        executionId,
        workflowId: context.workflowId,
        status: 'completed',
        output: graph.state,
        metrics,
        state: graph.state,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      const _duration = Date.now() - startTime;
      const metrics = this.calculateMetrics(graph);

      return {
        executionId,
        workflowId: context.workflowId,
        status: 'failed',
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
    const nodes = new Map<string, ExecutionNode>();
    const edges = new Map<string, string[]>();

    // Create nodes
    workflow.steps.forEach(step => {
      nodes.set(step.id, {
        stepId: step.id,
        step,
        status: 'pending',
        retries: 0,
      });
    });

    // Build edges (simplified - would need proper graph building)
    workflow.steps.forEach((step, index) => {
      if (index < workflow.steps.length - 1) {
        const nextStep = workflow.steps[index + 1];
        if (nextStep) {
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
      result[target] = this.resolvePath(source as string, state);
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
    
    const sourceA = this.resolvePath(step.config.sourceA, state);
    const sourceB = this.resolvePath(step.config.sourceB, state);
    
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
    
    const url = this.interpolateString(step.config.endpoint, state);
    const body = step.config.body 
      ? this.interpolateObject(step.config.body, state)
      : undefined;

    const response = await fetch(url, {
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

    return response.json();
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
    
    const result = await agentExecutor.executeSync({
      agentId: step.config.agentId,
      userId: 'system', // Would come from context
      input: { ...step.config.input, ...state } as Record<string, unknown>,
      priority: 'normal',
    });

    if (result.status !== 'completed') {
      throw new Error(result.error?.message || 'Agent execution failed');
    }

    return result.output;
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
    let result = true;
    for (const condition of step.config.conditions) {
      const fieldValue = this.resolvePath(condition.field, state);
      const conditionResult = this.evaluateCondition(condition, fieldValue);
      
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
    
    const items = this.resolvePath(step.config.items, state) as unknown[];
    if (!Array.isArray(items)) {
      throw new Error(`Expected array at path ${step.config.items}`);
    }

    const results: unknown[] = [];
    const maxIterations = step.config.maxIterations || items.length;

    for (let i = 0; i < Math.min(items.length, maxIterations); i++) {
      const _itemState = { ...state, item: items[i], index: i };
      
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
  ): Promise<unknown> {
    if (step.type !== 'webhook' || step.config.type !== 'webhook') {
      throw new Error('Invalid step type');
    }
    
    const url = this.interpolateString(step.config.url, state);
    const body = step.config.body
      ? this.interpolateObject(step.config.body, state)
      : undefined;

    const response = await fetch(url, {
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
      const conditionResult = result as boolean;
      const config = step.config as Record<string, unknown>;
      const nextSteps = conditionResult 
        ? (config.then as string[] | undefined)
        : (config.else as string[] | undefined);
      return (nextSteps?.[0] as string | undefined) || null;
    }

    const edges = graph.edges.get(step.id);
    return edges?.[0] || null;
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

    let delay = retryConfig.initialDelay;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      await this.sleep(delay);
      node.retries++;

      try {
        return await this.executeStep(node.step, state);
      } catch (error) {
        if (attempt === retryConfig.maxAttempts) {
          return null;
        }

        if (retryConfig.backoff === 'exponential') {
          delay = Math.min(delay * 2, retryConfig.maxDelay || 60000);
        }
      }
    }

    return null;
  }

  /**
   * Calculate execution metrics
   */
  private calculateMetrics(graph: ExecutionGraph) {
    let stepsExecuted = 0;
    let stepsSucceeded = 0;
    let stepsFailed = 0;
    let retries = 0;

    graph.nodes.forEach(node => {
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
    const parts = path.split('.');
    let current: unknown = state;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
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
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = this.resolvePath(key, state);
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
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.interpolateObject(value as Record<string, unknown>, state);
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
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'notEquals':
        return value !== condition.value;
      case 'greaterThan':
        return typeof value === 'number' && value > condition.value;
      case 'lessThan':
        return typeof value === 'number' && value < condition.value;
      case 'contains':
        return typeof value === 'string' && value.includes(String(condition.value));
      case 'notContains':
        return typeof value === 'string' && !value.includes(String(condition.value));
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
