/**
 * Workflow DSL Schema
 * Domain-specific language for describing automation workflows
 */

import { z } from 'zod';

/**
 * Workflow Step Types
 */
export const workflowStepTypeSchema = z.enum([
  'transform',      // Data transformation
  'match',          // Pattern matching
  'reconcile',      // Reconciliation logic
  'api',            // API call
  'database',       // Database operation
  'generate',       // Document/content generation
  'agent',          // Agent invocation
  'condition',      // Conditional branching
  'loop',           // Loop/iteration
  'delay',          // Wait/delay
  'human',          // Human-in-the-loop checkpoint
  'notification',   // Send notification
  'webhook',        // Trigger webhook
]);

export type WorkflowStepType = z.infer<typeof workflowStepTypeSchema>;

/**
 * Condition Operator
 */
export const conditionOperatorSchema = z.enum([
  'equals',
  'notEquals',
  'greaterThan',
  'lessThan',
  'contains',
  'notContains',
  'exists',
  'notExists',
  'regex',
]);

export type ConditionOperator = z.infer<typeof conditionOperatorSchema>;

/**
 * Workflow Condition
 */
export const workflowConditionSchema = z.object({
  field: z.string(),
  operator: conditionOperatorSchema,
  value: z.unknown(),
  logicalOperator: z.enum(['and', 'or']).optional(),
});

export type WorkflowCondition = z.infer<typeof workflowConditionSchema>;

/**
 * Retry Configuration
 */
export const workflowRetrySchema = z.object({
  enabled: z.boolean().default(true),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  backoff: z.enum(['linear', 'exponential', 'fixed']).default('exponential'),
  initialDelay: z.number().int().min(100).default(1000),
  maxDelay: z.number().int().min(1000).default(60000),
});

export type WorkflowRetry = z.infer<typeof workflowRetrySchema>;

/**
 * Circuit Breaker Configuration
 */
export const circuitBreakerSchema = z.object({
  enabled: z.boolean().default(false),
  failureThreshold: z.number().int().min(1).default(5),
  successThreshold: z.number().int().min(1).default(2),
  timeout: z.number().int().min(1000).default(60000),
  halfOpenMaxCalls: z.number().int().min(1).default(3),
});

export type CircuitBreaker = z.infer<typeof circuitBreakerSchema>;

/**
 * Workflow Step Configuration
 */
export const workflowStepConfigSchema = z.discriminatedUnion('type', [
  // Transform step
  z.object({
    type: z.literal('transform'),
    mapping: z.record(z.string()), // field mappings
    functions: z.array(z.string()).optional(), // transformation functions
  }),
  // Match step
  z.object({
    type: z.literal('match'),
    pattern: z.string(),
    fields: z.array(z.string()),
    threshold: z.number().min(0).max(1).optional(),
  }),
  // Reconcile step
  z.object({
    type: z.literal('reconcile'),
    sourceA: z.string(),
    sourceB: z.string(),
    matchingRules: z.array(workflowConditionSchema),
    reconciliationStrategy: z.enum(['merge', 'preferA', 'preferB', 'manual']),
  }),
  // API step
  z.object({
    type: z.literal('api'),
    endpoint: z.string().url(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    headers: z.record(z.string()).optional(),
    body: z.record(z.unknown()).optional(),
    auth: z.object({
      type: z.enum(['bearer', 'basic', 'apiKey', 'oauth']),
      config: z.record(z.string()),
    }).optional(),
  }),
  // Database step
  z.object({
    type: z.literal('database'),
    operation: z.enum(['select', 'insert', 'update', 'delete', 'upsert']),
    table: z.string(),
    query: z.record(z.unknown()).optional(),
    data: z.record(z.unknown()).optional(),
  }),
  // Generate step
  z.object({
    type: z.literal('generate'),
    template: z.string(),
    format: z.enum(['html', 'pdf', 'markdown', 'json', 'csv']),
    variables: z.record(z.unknown()).optional(),
  }),
  // Agent step
  z.object({
    type: z.literal('agent'),
    agentId: z.string().uuid(),
    input: z.record(z.unknown()),
    waitForCompletion: z.boolean().default(true),
  }),
  // Condition step
  z.object({
    type: z.literal('condition'),
    conditions: z.array(workflowConditionSchema),
    then: z.array(z.string().uuid()), // Next step IDs
    else: z.array(z.string().uuid()).optional(),
  }),
  // Loop step
  z.object({
    type: z.literal('loop'),
    items: z.string(), // Path to array in data
    stepIds: z.array(z.string().uuid()), // Steps to execute for each item
    maxIterations: z.number().int().min(1).max(10000).optional(),
  }),
  // Delay step
  z.object({
    type: z.literal('delay'),
    duration: z.number().int().min(0), // milliseconds
  }),
  // Human checkpoint
  z.object({
    type: z.literal('human'),
    prompt: z.string(),
    required: z.boolean().default(true),
    timeout: z.number().int().min(0).optional(), // milliseconds, 0 = no timeout
    assignTo: z.string().uuid().optional(), // User ID
  }),
  // Notification step
  z.object({
    type: z.literal('notification'),
    channel: z.enum(['email', 'slack', 'sms', 'in-app']),
    template: z.string(),
    recipients: z.array(z.string()),
  }),
  // Webhook step
  z.object({
    type: z.literal('webhook'),
    url: z.string().url(),
    method: z.enum(['POST', 'PUT']).default('POST'),
    headers: z.record(z.string()).optional(),
    body: z.record(z.unknown()).optional(),
  }),
]);

export type WorkflowStepConfig = z.infer<typeof workflowStepConfigSchema>;

/**
 * Workflow Step
 */
export const workflowStepSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: workflowStepTypeSchema,
  config: workflowStepConfigSchema,
  retry: workflowRetrySchema.optional(),
  timeout: z.number().int().min(1000).max(3600000).optional(),
  onError: z.enum(['fail', 'skip', 'retry', 'fallback']).default('fail'),
  fallbackStepId: z.string().uuid().optional(),
  circuitBreaker: circuitBreakerSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type WorkflowStep = z.infer<typeof workflowStepSchema>;

/**
 * Workflow Trigger
 */
export const workflowTriggerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('manual'),
  }),
  z.object({
    type: z.literal('schedule'),
    cron: z.string(),
    timezone: z.string().default('UTC'),
  }),
  z.object({
    type: z.literal('webhook'),
    path: z.string(),
    method: z.enum(['GET', 'POST', 'PUT']).default('POST'),
  }),
  z.object({
    type: z.literal('event'),
    eventName: z.string(),
    conditions: z.array(workflowConditionSchema).optional(),
  }),
  z.object({
    type: z.literal('api'),
    endpoint: z.string(),
  }),
]);

export type WorkflowTrigger = z.infer<typeof workflowTriggerSchema>;

/**
 * Complete Workflow Definition
 */
export const workflowDefinitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  
  // Execution Configuration
  trigger: workflowTriggerSchema,
  steps: z.array(workflowStepSchema).min(1).max(100),
  startStepId: z.string().uuid(), // First step to execute
  
  // State Management
  stateSchema: z.record(z.unknown()).optional(), // Expected state structure
  initialState: z.record(z.unknown()).optional(),
  
  // Error Handling
  globalRetry: workflowRetrySchema.optional(),
  errorHandler: z.object({
    strategy: z.enum(['fail', 'continue', 'rollback']).default('fail'),
    notification: z.boolean().default(true),
  }).optional(),
  
  // Metadata
  tags: z.array(z.string().max(50)).max(20).optional(),
  category: z.enum(['automation', 'reconciliation', 'consulting', 'custom']),
  author: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  
  // Status
  enabled: z.boolean().default(true),
  deprecated: z.boolean().default(false),
  
  // Introspection
  introspectable: z.boolean().default(true), // Can be debugged/audited
  auditLog: z.boolean().default(true), // Log all executions
});

export type WorkflowDefinition = z.infer<typeof workflowDefinitionSchema>;

/**
 * Workflow Execution Context
 */
export const workflowExecutionContextSchema = z.object({
  workflowId: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  input: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  sync: z.boolean().default(false),
});

export type WorkflowExecutionContext = z.infer<typeof workflowExecutionContextSchema>;

/**
 * Workflow Execution Result
 */
export const workflowExecutionResultSchema = z.object({
  executionId: z.string().uuid(),
  workflowId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled', 'paused']),
  output: z.record(z.unknown()).optional(),
  error: z.object({
    stepId: z.string().uuid().optional(),
    message: z.string(),
    code: z.string().optional(),
    details: z.record(z.unknown()).optional(),
  }).optional(),
  metrics: z.object({
    duration: z.number().int(),
    stepsExecuted: z.number().int(),
    stepsSucceeded: z.number().int(),
    stepsFailed: z.number().int(),
    retries: z.number().int(),
  }).optional(),
  state: z.record(z.unknown()).optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type WorkflowExecutionResult = z.infer<typeof workflowExecutionResultSchema>;
