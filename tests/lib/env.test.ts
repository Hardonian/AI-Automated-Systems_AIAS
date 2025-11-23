import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { env, validateEnv } from '@/lib/env';

describe('Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('env object', () => {
    it('should have supabase configuration structure', () => {
      expect(env).toHaveProperty('supabase');
      expect(env.supabase).toHaveProperty('url');
      expect(env.supabase).toHaveProperty('anonKey');
      expect(env.supabase).toHaveProperty('serviceRoleKey');
    });

    it('should have database configuration', () => {
      expect(env).toHaveProperty('database');
      expect(env.database).toHaveProperty('url');
    });

    it('should have app configuration', () => {
      expect(env).toHaveProperty('app');
      expect(env.app).toHaveProperty('env');
      expect(env.app).toHaveProperty('siteUrl');
    });
  });

  describe('validateEnv', () => {
    it('should return valid when required vars are set', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      process.env.DATABASE_URL = 'postgresql://test';

      const result = validateEnv();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors when required vars are missing', () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_ANON_KEY;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      delete process.env.DATABASE_URL;

      const result = validateEnv();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
