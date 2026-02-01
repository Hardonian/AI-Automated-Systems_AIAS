import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import {
  sanitizeInput,
  sanitizeHTML,
  detectSQLInjection,
  detectXSS,
  validateRequestBody,
} from '@/lib/security/api-security';

describe('API Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove null bytes and control characters', () => {
      const input = 'Hello \x00World\x01\x02';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('\x00');
      expect(sanitized).toContain('Hello');
      expect(sanitized).toContain('World');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should preserve safe HTML (does not remove tags)', () => {
      const input = 'Hello <strong>World</strong>';
      const sanitized = sanitizeInput(input);
      // sanitizeInput only removes control chars, not HTML tags
      expect(sanitized).toBe('Hello <strong>World</strong>');
    });
  });

  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const html = 'Hello <script>alert("xss")</script> World';
      const sanitized = sanitizeHTML(html);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('Hello');
      expect(sanitized).toContain('World');
    });

    it('should remove dangerous HTML', () => {
      const html = '<div onclick="alert(1)">Click me</div>';
      const sanitized = sanitizeHTML(html);
      expect(sanitized).not.toContain('onclick');
    });

    it('should preserve safe HTML elements', () => {
      const html = '<p>Safe content</p>';
      const sanitized = sanitizeHTML(html);
      expect(sanitized).toContain('Safe content');
    });
  });

  describe('detectSQLInjection', () => {
    it('should detect SQL injection attempts', () => {
      expect(detectSQLInjection("'; DROP TABLE users; --")).toBe(true);
      expect(detectSQLInjection("1' OR '1'='1")).toBe(true);
      expect(detectSQLInjection('SELECT * FROM users')).toBe(true);
    });

    it('should not flag safe input', () => {
      expect(detectSQLInjection('Hello World')).toBe(false);
      expect(detectSQLInjection('user@example.com')).toBe(false);
    });
  });

  describe('detectXSS', () => {
    it('should detect XSS attempts', () => {
      expect(detectXSS('<script>alert("xss")</script>')).toBe(true);
      // Avoid triggering eslint `no-script-url` while still testing detection
      const jsUrl = ['java', 'script:alert(1)'].join('');
      expect(detectXSS(jsUrl)).toBe(true);
      expect(detectXSS('<img src=x onerror=alert(1)>')).toBe(true);
    });

    it('should not flag safe input', () => {
      expect(detectXSS('Hello World')).toBe(false);
      expect(detectXSS('<p>Safe HTML</p>')).toBe(false);
    });
  });

  describe('validateRequestBody', () => {
    it('should validate correct data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const data = { name: 'Test', age: 25 };
      const result = validateRequestBody(schema, data);

      // validateRequestBody returns the data directly on success
      expect(result).toEqual(data);
    });

    it('should reject invalid data', () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const data = { email: 'invalid-email' };

      // validateRequestBody throws on invalid data
      expect(() => validateRequestBody(schema, data)).toThrow(
        'Invalid request body'
      );
    });
  });
});
