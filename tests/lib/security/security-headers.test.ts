/**
 * Tests for Security Headers
 */

import { describe, expect, it } from 'vitest';

import { SecurityHeaders } from '@/src/lib/security-headers';

describe('lib/security-headers', () => {
  it('should generate baseline security headers', () => {
    const headers = new SecurityHeaders().getHeaders();

    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    expect(headers['Strict-Transport-Security']).toContain('max-age=');
    expect(headers['X-Frame-Options']).toBe('SAMEORIGIN');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Permissions-Policy']).toContain('geolocation=()');
    expect(headers['X-DNS-Prefetch-Control']).toBe('off');
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
  });

  it('should inject nonce into the CSP when provided', () => {
    const nonce = 'nonce-value';
    const headers = new SecurityHeaders().getHeaders(nonce);

    expect(headers['Content-Security-Policy']).toContain(`nonce-${nonce}`);
    expect(headers['Content-Security-Policy']).not.toContain("'unsafe-inline'");
  });

  it('should relax CSP in development headers', () => {
    const headers = new SecurityHeaders().getDevelopmentHeaders();

    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'self'");
  });

  it('should validate CSP report payloads', () => {
    const securityHeaders = new SecurityHeaders();

    expect(securityHeaders.validateCSPReport({ 'csp-report': { 'blocked-uri': 'test' } })).toBe(true);
    expect(securityHeaders.validateCSPReport({})).toBe(false);
    expect(securityHeaders.validateCSPReport(null)).toBe(false);
  });
});
