/**
 * Tests for Agent Executor
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AgentExecutor } from '@/lib/agents/executor';
import { agentDefinitionSchema, agentExecutionContextSchema } from '@/lib/agents/schema';

describe('AgentExecutor', () => {
  let executor: AgentExecutor;

  beforeEach(() => {
    executor = new AgentExecutor();
  });

  describe('registerAgent', () => {
    it('should register an agent successfully', () => {
      const agent = {
        id: 'test-agent-1',
        name: 'Test Agent',
        description: 'A test agent',
        version: '1.0.0',
        category: 'automation' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        capabilities: {
          canRead: true,
          canWrite: false,
          canExecute: false,
          canModifyWorkflows: false,
          canAccessExternalAPIs: false,
          canAccessDatabase: false,
          canInvokeOtherAgents: false,
          maxConcurrentOperations: 5,
        },
        planningStyle: 'sequential' as const,
        tools: [],
        execution: {
          mode: 'async' as const,
          timeout: 60000,
          retry: {
            enabled: true,
            maxAttempts: 3,
            backoff: 'exponential' as const,
            initialDelay: 1000,
            maxDelay: 60000,
            fallbackStrategy: 'fail' as const,
          },
        },
        safety: {
          maxExecutionTime: 60000,
        },
        outputType: 'text' as const,
        enabled: true,
        deprecated: false,
      };

      executor.registerAgent(agent);
      expect(executor.getExecutionState('test')).toBeUndefined();
    });
  });

  describe('executeSync', () => {
    it('should execute agent synchronously', async () => {
      const agent = {
        id: 'test-agent-2',
        name: 'Test Agent',
        description: 'A test agent',
        version: '1.0.0',
        category: 'automation' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        capabilities: {
          canRead: true,
          canWrite: false,
          canExecute: false,
          canModifyWorkflows: false,
          canAccessExternalAPIs: false,
          canAccessDatabase: false,
          canInvokeOtherAgents: false,
          maxConcurrentOperations: 5,
        },
        planningStyle: 'sequential' as const,
        tools: [],
        execution: {
          mode: 'sync' as const,
          timeout: 60000,
          retry: {
            enabled: true,
            maxAttempts: 3,
            backoff: 'exponential' as const,
            initialDelay: 1000,
            maxDelay: 60000,
            fallbackStrategy: 'fail' as const,
          },
        },
        safety: {
          maxExecutionTime: 60000,
        },
        outputType: 'text' as const,
        enabled: true,
        deprecated: false,
      };

      executor.registerAgent(agent);

      const context = {
        agentId: 'test-agent-2',
        userId: 'user-1',
        input: { test: 'data' },
        priority: 'normal' as const,
      };

      const result = await executor.executeSync(context);
      expect(result).toBeDefined();
      expect(result.agentId).toBe('test-agent-2');
      expect(['completed', 'failed']).toContain(result.status);
    });

    it('should throw error for non-existent agent', async () => {
      const context = {
        agentId: 'non-existent',
        userId: 'user-1',
        input: {},
        priority: 'normal' as const,
      };

      await expect(executor.executeSync(context)).rejects.toThrow();
    });
  });

  describe('executeAsync', () => {
    it('should execute agent asynchronously', async () => {
      const agent = {
        id: 'test-agent-3',
        name: 'Test Agent',
        description: 'A test agent',
        version: '1.0.0',
        category: 'automation' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        capabilities: {
          canRead: true,
          canWrite: false,
          canExecute: false,
          canModifyWorkflows: false,
          canAccessExternalAPIs: false,
          canAccessDatabase: false,
          canInvokeOtherAgents: false,
          maxConcurrentOperations: 5,
        },
        planningStyle: 'sequential' as const,
        tools: [],
        execution: {
          mode: 'async' as const,
          timeout: 60000,
          retry: {
            enabled: true,
            maxAttempts: 3,
            backoff: 'exponential' as const,
            initialDelay: 1000,
            maxDelay: 60000,
            fallbackStrategy: 'fail' as const,
          },
        },
        safety: {
          maxExecutionTime: 60000,
        },
        outputType: 'text' as const,
        enabled: true,
        deprecated: false,
      };

      executor.registerAgent(agent);

      const context = {
        agentId: 'test-agent-3',
        userId: 'user-1',
        input: {},
        priority: 'normal' as const,
      };

      const result = await executor.executeAsync(context);
      expect(result).toBeDefined();
      expect(result.executionId).toBeDefined();
      expect(['pending', 'running']).toContain(result.status);
    });
  });
});
