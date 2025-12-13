/**
 * Tests for Workflow Executor
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { WorkflowExecutor } from '@/lib/workflows/executor';

describe('WorkflowExecutor', () => {
  let executor: WorkflowExecutor;

  beforeEach(() => {
    executor = new WorkflowExecutor();
  });

  describe('registerWorkflow', () => {
    it('should register a workflow successfully', () => {
      const workflow = {
        id: 'test-workflow-1',
        name: 'Test Workflow',
        description: 'A test workflow',
        version: '1.0.0',
        trigger: { type: 'manual' as const },
        steps: [
          {
            id: 'step-1',
            name: 'Step 1',
            type: 'delay' as const,
            config: {
              type: 'delay' as const,
              duration: 100,
            },
            onError: 'fail' as const,
          },
        ],
        startStepId: 'step-1',
        category: 'automation' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enabled: true,
        deprecated: false,
        introspectable: true,
        auditLog: true,
      };

      executor.registerWorkflow(workflow);
      expect(executor.getExecutionState('test')).toBeUndefined();
    });
  });

  describe('execute', () => {
    it('should execute a workflow successfully', async () => {
      const workflow = {
        id: 'test-workflow-2',
        name: 'Test Workflow',
        description: 'A test workflow',
        version: '1.0.0',
        trigger: { type: 'manual' as const },
        steps: [
          {
            id: 'step-1',
            name: 'Delay Step',
            type: 'delay' as const,
            config: {
              type: 'delay' as const,
              duration: 10,
            },
            onError: 'fail' as const,
          },
        ],
        startStepId: 'step-1',
        category: 'automation' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enabled: true,
        deprecated: false,
        introspectable: true,
        auditLog: true,
      };

      executor.registerWorkflow(workflow);

      const context = {
        workflowId: 'test-workflow-2',
        userId: 'user-1',
        input: { test: 'data' },
        sync: true,
        priority: 'normal' as const,
      };

      const result = await executor.execute(context);
      expect(result).toBeDefined();
      expect(result.workflowId).toBe('test-workflow-2');
      expect(['completed', 'failed']).toContain(result.status);
    });

    it('should throw error for non-existent workflow', async () => {
      const context = {
        workflowId: 'non-existent',
        userId: 'user-1',
        input: {},
        sync: true,
        priority: 'normal' as const,
      };

      await expect(executor.execute(context)).rejects.toThrow();
    });
  });

  describe('step execution', () => {
    it('should execute delay step', async () => {
      const workflow = {
        id: 'test-workflow-delay',
        name: 'Delay Workflow',
        version: '1.0.0',
        trigger: { type: 'manual' as const },
        steps: [
          {
            id: 'delay-1',
            name: 'Delay',
            type: 'delay' as const,
            config: {
              type: 'delay' as const,
              duration: 50,
            },
            onError: 'fail' as const,
          },
        ],
        startStepId: 'delay-1',
        category: 'automation' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enabled: true,
        deprecated: false,
        introspectable: true,
        auditLog: true,
      };

      executor.registerWorkflow(workflow);

      const startTime = Date.now();
      const result = await executor.execute({
        workflowId: 'test-workflow-delay',
        userId: 'user-1',
        input: {},
        priority: 'normal' as const,
        sync: true,
      });
      const duration = Date.now() - startTime;

      expect(result.status).toBe('completed');
      expect(duration).toBeGreaterThanOrEqual(50);
    });
  });
});
