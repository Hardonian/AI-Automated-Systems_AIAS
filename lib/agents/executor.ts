/**
 * Agent Execution Layer
 * Handles sequential, parallel, and conditional agent execution
 */

import { AgentDefinition, AgentExecutionContext, AgentExecutionResult } from './schema';

export interface ExecutionState {
  step: number;
  data: Record<string, unknown>;
  errors: Array<{ step: number; error: Error }>;
  metadata: Record<string, unknown>;
}

export interface ExecutionOptions {
  sync?: boolean;
  timeout?: number;
  retry?: boolean;
  onProgress?: (state: ExecutionState) => void;
  onError?: (error: Error, state: ExecutionState) => void;
}

/**
 * Agent Executor Class
 */
export class AgentExecutor {
  private agents: Map<string, AgentDefinition> = new Map();
  private executions: Map<string, ExecutionState> = new Map();

  /**
   * Register an agent
   */
  registerAgent(agent: AgentDefinition): void {
    this.agents.set(agent.id, agent);
  }

  /**
   * Execute agent synchronously
   */
  async executeSync(
    context: AgentExecutionContext,
    options: ExecutionOptions = {}
  ): Promise<AgentExecutionResult> {
    const agent = this.agents.get(context.agentId);
    if (!agent) {
      throw new Error(`Agent ${context.agentId} not found`);
    }

    const executionId = this.generateExecutionId();
    const state: ExecutionState = {
      step: 0,
      data: { ...context.input },
      errors: [],
      metadata: { ...context.metadata },
    };

    this.executions.set(executionId, state);

    try {
      const startTime = Date.now();
      
      // Execute based on planning style
      const output = await this.executeByPlanningStyle(agent, state, options);
      
      const duration = Date.now() - startTime;

      return {
        executionId,
        agentId: context.agentId,
        status: 'completed',
        output,
        metrics: {
          duration,
          stepsExecuted: state.step,
        },
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        executionId,
        agentId: context.agentId,
        status: 'failed',
        error: {
          message: error instanceof Error ? error.message : String(error),
          code: 'EXECUTION_ERROR',
        },
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    } finally {
      this.executions.delete(executionId);
    }
  }

  /**
   * Execute agent asynchronously
   */
  async executeAsync(
    context: AgentExecutionContext,
    options: ExecutionOptions = {}
  ): Promise<{ executionId: string; status: 'pending' | 'running' }> {
    const agent = this.agents.get(context.agentId);
    if (!agent) {
      throw new Error(`Agent ${context.agentId} not found`);
    }

    const executionId = this.generateExecutionId();
    const state: ExecutionState = {
      step: 0,
      data: { ...context.input },
      errors: [],
      metadata: { ...context.metadata },
    };

    this.executions.set(executionId, state);

    // Execute in background
    this.executeSync(context, options).catch(error => {
      options.onError?.(error, state);
    });

    return {
      executionId,
      status: 'pending',
    };
  }

  /**
   * Execute based on planning style
   */
  private async executeByPlanningStyle(
    agent: AgentDefinition,
    state: ExecutionState,
    options: ExecutionOptions
  ): Promise<unknown> {
    switch (agent.planningStyle) {
      case 'sequential':
        return this.executeSequential(agent, state, options);
      case 'parallel':
        return this.executeParallel(agent, state, options);
      case 'hierarchical':
        return this.executeHierarchical(agent, state, options);
      case 'reactive':
        return this.executeReactive(agent, state, options);
      case 'hybrid':
        return this.executeHybrid(agent, state, options);
      default:
        return this.executeSequential(agent, state, options);
    }
  }

  /**
   * Sequential execution
   */
  private async executeSequential(
    agent: AgentDefinition,
    state: ExecutionState,
    options: ExecutionOptions
  ): Promise<unknown> {
    for (const tool of agent.tools) {
      state.step++;
      options.onProgress?.(state);

      try {
        const result = await this.executeTool(tool, state.data);
        state.data = { ...state.data, [tool.id]: result };
      } catch (error) {
        state.errors.push({
          step: state.step,
          error: error instanceof Error ? error : new Error(String(error)),
        });
        
        if (agent.execution.retry.enabled) {
          // Retry logic
          const retried = await this.retryTool(tool, state.data, agent.execution.retry);
          if (retried) {
            state.data = { ...state.data, [tool.id]: retried };
            continue;
          }
        }

        options.onError?.(error instanceof Error ? error : new Error(String(error)), state);
        throw error;
      }
    }

    return state.data;
  }

  /**
   * Parallel execution
   */
  private async executeParallel(
    agent: AgentDefinition,
    state: ExecutionState,
    options: ExecutionOptions
  ): Promise<unknown> {
    const toolPromises = agent.tools.map(async (tool, index) => {
      state.step++;
      options.onProgress?.(state);

      try {
        const result = await this.executeTool(tool, state.data);
        return { toolId: tool.id, result };
      } catch (error) {
        state.errors.push({
          step: index,
          error: error instanceof Error ? error : new Error(String(error)),
        });
        throw error;
      }
    });

    const results = await Promise.allSettled(toolPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        state.data = { ...state.data, [result.value.toolId]: result.value.result };
      }
    });

    return state.data;
  }

  /**
   * Hierarchical execution (simplified - would need tree structure)
   */
  private async executeHierarchical(
    agent: AgentDefinition,
    state: ExecutionState,
    options: ExecutionOptions
  ): Promise<unknown> {
    // Simplified - would need tree structure for full implementation
    return this.executeSequential(agent, state, options);
  }

  /**
   * Reactive execution (event-driven)
   */
  private async executeReactive(
    agent: AgentDefinition,
    state: ExecutionState,
    options: ExecutionOptions
  ): Promise<unknown> {
    // Would need event system for full implementation
    return this.executeSequential(agent, state, options);
  }

  /**
   * Hybrid execution
   */
  private async executeHybrid(
    agent: AgentDefinition,
    state: ExecutionState,
    options: ExecutionOptions
  ): Promise<unknown> {
    // Combination of styles based on agent configuration
    return this.executeSequential(agent, state, options);
  }

  /**
   * Execute a tool
   */
  private async executeTool(
    tool: AgentDefinition['tools'][0],
    input: Record<string, unknown>
  ): Promise<unknown> {
    // This would call the actual tool implementation
    // For now, return mock data
    return { toolId: tool.id, executed: true, input };
  }

  /**
   * Retry tool execution
   */
  private async retryTool(
    tool: AgentDefinition['tools'][0],
    input: Record<string, unknown>,
    retryConfig: AgentDefinition['execution']['retry']
  ): Promise<unknown | null> {
    let delay = retryConfig.initialDelay;
    
    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      await this.sleep(delay);
      
      try {
        return await this.executeTool(tool, input);
      } catch (error) {
        if (attempt === retryConfig.maxAttempts) {
          return null;
        }
        
        // Calculate next delay
        if (retryConfig.backoff === 'exponential') {
          delay = Math.min(delay * 2, retryConfig.maxDelay || 60000);
        } else if (retryConfig.backoff === 'linear') {
          delay = retryConfig.initialDelay;
        }
      }
    }
    
    return null;
  }

  /**
   * Get execution state
   */
  getExecutionState(executionId: string): ExecutionState | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Generate execution ID
   */
  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const agentExecutor = new AgentExecutor();
