/**
 * API Validation Tests
 * Test Zod schemas and input validation
 */

import { describe, it, expect } from 'vitest';

import {
  loginSchema,
  signupSchema,
  createWorkflowSchema,
  createAgentSchema,
  chatRequestSchema,
} from '@/lib/api/schemas';

describe('API Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login input', () => {
      const input = {
        email: 'test@example.com',
        password: 'Password123',
        rememberMe: true,
      };
      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const input = {
        email: 'invalid-email',
        password: 'Password123',
      };
      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const input = {
        email: 'test@example.com',
        password: 'short',
      };
      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    it('should validate correct signup input', () => {
      const input = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        acceptTerms: true,
      };
      const result = signupSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true,
      };
      const result = signupSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should require terms acceptance', () => {
      const input = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        acceptTerms: false,
      };
      const result = signupSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('createWorkflowSchema', () => {
    it('should validate workflow with webhook trigger', () => {
      const input = {
        name: 'Test Workflow',
        trigger: {
          type: 'webhook',
          url: 'https://example.com/webhook',
          method: 'POST',
        },
        steps: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'api',
            config: {},
          },
        ],
      };
      const result = createWorkflowSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate workflow with schedule trigger', () => {
      const input = {
        name: 'Test Workflow',
        trigger: {
          type: 'schedule',
          cron: '0 9 * * *',
          timezone: 'UTC',
        },
        steps: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'api',
            config: {},
          },
        ],
      };
      const result = createWorkflowSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject workflow without steps', () => {
      const input = {
        name: 'Test Workflow',
        trigger: {
          type: 'manual',
        },
        steps: [],
      };
      const result = createWorkflowSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('createAgentSchema', () => {
    it('should validate agent creation', () => {
      const input = {
        name: 'Test Agent',
        description: 'A test agent',
        personality: 'professional',
        instructions: 'You are a helpful assistant',
        model: 'gpt-4',
      };
      const result = createAgentSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject short instructions', () => {
      const input = {
        name: 'Test Agent',
        instructions: 'short',
        model: 'gpt-4',
      };
      const result = createAgentSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('chatRequestSchema', () => {
    it('should validate chat request', () => {
      const input = {
        agentId: '123e4567-e89b-12d3-a456-426614174000',
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
      };
      const result = chatRequestSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty messages', () => {
      const input = {
        agentId: '123e4567-e89b-12d3-a456-426614174000',
        messages: [],
      };
      const result = chatRequestSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
