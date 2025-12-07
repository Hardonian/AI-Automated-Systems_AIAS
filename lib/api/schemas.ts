/**
 * Comprehensive Zod Schemas for API Validation
 * All API routes should use these schemas for type-safe validation
 */

import { z } from 'zod';

// ============================================
// Common Schemas
// ============================================

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email().toLowerCase().trim();
export const urlSchema = z.string().url();
export const nonEmptyStringSchema = z.string().min(1).trim();
export const optionalStringSchema = z.string().optional();

// ============================================
// Pagination & Filtering
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).optional(),
});

export const dateRangeSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
}).refine(
  (data) => !data.start || !data.end || new Date(data.start) <= new Date(data.end),
  { message: "Start date must be before end date" }
);

export const sortSchema = z.object({
  field: z.string().min(1),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// Authentication & Authorization
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().optional().default(false),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  ),
  name: z.string().min(2).max(100).trim(),
  company: z.string().max(200).trim().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "Must accept terms"),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  ),
});

// ============================================
// User & Tenant Management
// ============================================

export const userIdSchema = uuidSchema;
export const tenantIdSchema = uuidSchema;

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: emailSchema.optional(),
  avatar: urlSchema.optional(),
  preferences: z.record(z.unknown()).optional(),
});

export const createTenantSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
});

export const updateTenantSchema = z.object({
  name: z.string().min(2).max(200).trim().optional(),
  settings: z.record(z.unknown()).optional(),
});

// ============================================
// Workflows & Automation
// ============================================

export const workflowTriggerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('webhook'),
    url: urlSchema,
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('POST'),
  }),
  z.object({
    type: z.literal('schedule'),
    cron: z.string().regex(/^(\*|([0-9]|[1-5][0-9])|\*\/([0-9]|[1-5][0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|[12][0-9]|3[01])|\*\/([1-9]|[12][0-9]|3[01])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/),
    timezone: z.string().default('UTC'),
  }),
  z.object({
    type: z.literal('event'),
    eventName: z.string().min(1).max(100),
    conditions: z.record(z.unknown()).optional(),
  }),
  z.object({
    type: z.literal('manual'),
  }),
]);

export const workflowStepSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['api', 'database', 'ai', 'notification', 'condition', 'loop']),
  config: z.record(z.unknown()),
  retry: z.object({
    maxAttempts: z.number().int().min(0).max(10).default(3),
    backoff: z.enum(['linear', 'exponential']).default('exponential'),
  }).optional(),
  timeout: z.number().int().min(1000).max(300000).optional(),
});

export const createWorkflowSchema = z.object({
  name: z.string().min(3).max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  trigger: workflowTriggerSchema,
  steps: z.array(workflowStepSchema).min(1).max(50),
  enabled: z.boolean().default(true),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const updateWorkflowSchema = createWorkflowSchema.partial();

export const executeWorkflowSchema = z.object({
  workflowId: uuidSchema,
  input: z.record(z.unknown()).optional(),
  async: z.boolean().default(false),
});

// ============================================
// AI Agents
// ============================================

export const agentPersonalitySchema = z.enum(['professional', 'friendly', 'technical', 'casual', 'formal']);

export const createAgentSchema = z.object({
  name: z.string().min(3).max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  personality: agentPersonalitySchema.default('professional'),
  instructions: z.string().min(10).max(10000).trim(),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet']).default('gpt-4'),
  temperature: z.number().min(0).max(2).default(0.7),
  tools: z.array(z.string()).max(20).optional(),
  enabled: z.boolean().default(true),
});

export const updateAgentSchema = createAgentSchema.partial();

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000).trim(),
  metadata: z.record(z.unknown()).optional(),
});

export const chatRequestSchema = z.object({
  agentId: uuidSchema,
  messages: z.array(chatMessageSchema).min(1).max(100),
  stream: z.boolean().default(false),
  temperature: z.number().min(0).max(2).optional(),
});

// ============================================
// Analytics & Metrics
// ============================================

export const analyticsEventSchema = z.object({
  name: z.string().min(1).max(100),
  properties: z.record(z.unknown()).optional(),
  userId: uuidSchema.optional(),
  sessionId: z.string().uuid().optional(),
  timestamp: z.string().datetime().optional(),
});

export const analyticsQuerySchema = z.object({
  event: z.string().min(1).optional(),
  dateRange: dateRangeSchema.optional(),
  filters: z.record(z.unknown()).optional(),
  groupBy: z.array(z.string()).max(5).optional(),
  ...paginationSchema.shape,
});

// ============================================
// Billing & Subscriptions
// ============================================

export const subscriptionPlanSchema = z.enum(['free', 'pro', 'enterprise']);

export const createCheckoutSessionSchema = z.object({
  plan: subscriptionPlanSchema,
  successUrl: urlSchema,
  cancelUrl: urlSchema,
  coupon: z.string().max(50).optional(),
});

export const updateSubscriptionSchema = z.object({
  plan: subscriptionPlanSchema,
  cancelAtPeriodEnd: z.boolean().optional(),
});

// ============================================
// Content & Blog
// ============================================

export const createBlogPostSchema = z.object({
  title: z.string().min(5).max(200).trim(),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(100).max(50000),
  excerpt: z.string().max(500).trim().optional(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  featuredImage: urlSchema.optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogCommentSchema = z.object({
  postId: uuidSchema,
  content: z.string().min(1).max(2000).trim(),
  parentId: uuidSchema.optional(),
  authorName: z.string().min(2).max(100).trim(),
  authorEmail: emailSchema,
});

// ============================================
// Integrations
// ============================================

export const integrationProviderSchema = z.enum([
  'shopify',
  'stripe',
  'wave',
  'slack',
  'email',
  'webhook',
  'custom',
]);

export const createIntegrationSchema = z.object({
  provider: integrationProviderSchema,
  name: z.string().min(3).max(200).trim(),
  config: z.record(z.unknown()),
  enabled: z.boolean().default(true),
});

export const updateIntegrationSchema = z.object({
  name: z.string().min(3).max(200).trim().optional(),
  config: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
});

// ============================================
// Leads & CRM
// ============================================

export const createLeadSchema = z.object({
  email: emailSchema,
  name: z.string().min(2).max(200).trim(),
  company: z.string().max(200).trim().optional(),
  phone: z.string().max(20).optional(),
  source: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadScoreSchema = z.object({
  leadId: uuidSchema,
  score: z.number().int().min(0).max(100),
  factors: z.array(z.object({
    factor: z.string(),
    value: z.number(),
    weight: z.number(),
  })).optional(),
});

// ============================================
// File Uploads
// ============================================

export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(100),
  size: z.number().int().min(1).max(100 * 1024 * 1024), // 100MB max
  metadata: z.record(z.unknown()).optional(),
});

// ============================================
// Search & Filters
// ============================================

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).trim(),
  type: z.enum(['workflows', 'agents', 'content', 'all']).default('all'),
  ...paginationSchema.shape,
});

// ============================================
// Type Exports
// ============================================

export type PaginationInput = z.infer<typeof paginationSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
