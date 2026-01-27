/**
 * Multi-Agent System Schema
 * Formal schema for agent definitions, capabilities, and execution
 */

import { z } from 'zod';

/**
 * Agent Planning Style
 */
export const agentPlanningStyleSchema = z.enum([
  'sequential',      // Step-by-step execution
  'parallel',        // Execute multiple steps simultaneously
  'hierarchical',    // Tree-based planning
  'reactive',        // Event-driven responses
  'hybrid',          // Combination of styles
]);

export type AgentPlanningStyle = z.infer<typeof agentPlanningStyleSchema>;

/**
 * Tool Interface Schema
 */
export const toolInterfaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['api', 'database', 'workflow', 'ai', 'transformation', 'validation']),
  parameters: z.record(z.object({
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    required: z.boolean().default(false),
    description: z.string().optional(),
    default: z.unknown().optional(),
    validation: z.record(z.unknown()).optional(),
  })),
  returns: z.object({
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    schema: z.record(z.unknown()).optional(),
  }),
  timeout: z.number().int().min(1000).max(300000).default(30000),
  retry: z.object({
    maxAttempts: z.number().int().min(0).max(10).default(3),
    backoff: z.enum(['linear', 'exponential']).default('exponential'),
    initialDelay: z.number().int().min(100).default(1000),
  }).optional(),
});

export type ToolInterface = z.infer<typeof toolInterfaceSchema>;

/**
 * Agent Capabilities
 */
export const agentCapabilitiesSchema = z.object({
  canRead: z.boolean().default(true),
  canWrite: z.boolean().default(false),
  canExecute: z.boolean().default(false),
  canModifyWorkflows: z.boolean().default(false),
  canAccessExternalAPIs: z.boolean().default(false),
  canAccessDatabase: z.boolean().default(false),
  canInvokeOtherAgents: z.boolean().default(false),
  maxConcurrentOperations: z.number().int().min(1).max(100).default(5),
});

export type AgentCapabilities = z.infer<typeof agentCapabilitiesSchema>;

/**
 * Agent Memory Boundaries
 */
export const agentMemorySchema = z.object({
  type: z.enum(['episodic', 'semantic', 'working', 'long-term']),
  maxSize: z.number().int().min(0).max(1000000), // tokens or bytes
  ttl: z.number().int().min(0), // seconds, 0 = infinite
  persistence: z.enum(['none', 'session', 'persistent']).default('session'),
});

export type AgentMemory = z.infer<typeof agentMemorySchema>;

/**
 * Safety Constraints
 */
export const safetyConstraintsSchema = z.object({
  maxExecutionTime: z.number().int().min(1000).max(3600000).default(60000),
  maxTokenUsage: z.number().int().min(0).max(1000000).optional(),
  maxCost: z.number().min(0).max(1000).optional(), // USD
  allowedDomains: z.array(z.string()).optional(),
  blockedDomains: z.array(z.string()).optional(),
  requireHumanApproval: z.array(z.string()).optional(), // For specific operations
  rateLimit: z.object({
    requests: z.number().int().min(1),
    windowMs: z.number().int().min(1000),
  }).optional(),
});

export type SafetyConstraints = z.infer<typeof safetyConstraintsSchema>;

/**
 * Agent Output Types
 */
export const agentOutputTypeSchema = z.enum([
  'text',
  'json',
  'structured',
  'workflow',
  'report',
  'analysis',
  'recommendation',
]);

export type AgentOutputType = z.infer<typeof agentOutputTypeSchema>;

/**
 * Agent Validation Schema
 */
export const agentValidationSchema = z.object({
  input: z.record(z.unknown()).optional(),
  output: z.record(z.unknown()).optional(),
  intermediate: z.array(z.record(z.unknown())).optional(),
});

export type AgentValidation = z.infer<typeof agentValidationSchema>;

/**
 * Agent Retry/Fallback Logic
 */
export const agentRetrySchema = z.object({
  enabled: z.boolean().default(true),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  backoff: z.enum(['linear', 'exponential', 'fixed']).default('exponential'),
  initialDelay: z.number().int().min(100).default(1000),
  maxDelay: z.number().int().min(1000).default(60000),
  fallbackAgent: z.string().uuid().optional(),
  fallbackStrategy: z.enum(['fail', 'partial', 'alternative']).default('fail'),
});

export type AgentRetry = z.infer<typeof agentRetrySchema>;

/**
 * Complete Agent Definition Schema
 */
export const agentDefinitionSchema = z.object({
  // Core Identity
  id: z.string().uuid(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  
  // Metadata
  tags: z.array(z.string().max(50)).max(20).optional(),
  category: z.enum(['automation', 'analysis', 'generation', 'consulting', 'custom']),
  author: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  
  // Capabilities
  capabilities: agentCapabilitiesSchema,
  planningStyle: agentPlanningStyleSchema.default('sequential'),
  
  // Tools & Interfaces
  tools: z.array(toolInterfaceSchema).max(50),
  
  // Execution Configuration
  execution: z.object({
    mode: z.enum(['sync', 'async', 'streaming']).default('async'),
    timeout: z.number().int().min(1000).max(3600000).default(60000),
    retry: agentRetrySchema,
  }),
  
  // Memory & State
  memory: z.array(agentMemorySchema).max(10).optional(),
  
  // Safety & Constraints
  safety: safetyConstraintsSchema,
  
  // Validation
  validation: agentValidationSchema.optional(),
  
  // Output Configuration
  outputType: agentOutputTypeSchema,
  outputSchema: z.record(z.unknown()).optional(),
  
  // Status
  enabled: z.boolean().default(true),
  deprecated: z.boolean().default(false),
});

export type AgentDefinition = z.infer<typeof agentDefinitionSchema>;

/**
 * Agent Execution Context
 */
export const agentExecutionContextSchema = z.object({
  agentId: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  input: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  parentExecutionId: z.string().uuid().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

export type AgentExecutionContext = z.infer<typeof agentExecutionContextSchema>;

/**
 * Agent Execution Result
 */
export const agentExecutionResultSchema = z.object({
  executionId: z.string().uuid(),
  agentId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
  output: z.unknown().optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.record(z.unknown()).optional(),
  }).optional(),
  metrics: z.object({
    duration: z.number().int(), // milliseconds
    tokenUsage: z.number().int().optional(),
    cost: z.number().optional(),
    stepsExecuted: z.number().int(),
  }).optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type AgentExecutionResult = z.infer<typeof agentExecutionResultSchema>;

/**
 * Agent Contract (Deterministic Output Guarantee)
 */
export const agentContractSchema = z.object({
  agentId: z.string().uuid(),
  inputSchema: z.record(z.unknown()),
  outputSchema: z.record(z.unknown()),
  guarantees: z.array(z.enum([
    'deterministic',
    'idempotent',
    'atomic',
    'transactional',
    'auditable',
  ])),
  sideEffects: z.array(z.string()).optional(),
  dependencies: z.array(z.string().uuid()).optional(), // Other agents or workflows
});

export type AgentContract = z.infer<typeof agentContractSchema>;
