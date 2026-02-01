/**
 * Content Security Policy (CSP) with Nonce Support
 *
 * Provides CSP header generation with nonce-based script/style injection
 * for improved XSS protection while allowing necessary inline content.
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure nonce
 * @returns A base64-encoded nonce string (16 bytes = 24 base64 characters)
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * CSP Directives Configuration
 */
export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'media-src'?: string[];
  'object-src'?: string[];
  'frame-src'?: string[];
  'frame-ancestors'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'manifest-src'?: string[];
  'worker-src'?: string[];
  'upgrade-insecure-requests'?: boolean;
  'block-all-mixed-content'?: boolean;
}

/**
 * Default CSP directives for production
 * Uses nonce-based approach for scripts and styles
 */
export const defaultCSPDirectives: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    // Nonce will be added dynamically
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
  ],
  'style-src': [
    "'self'",
    // Nonce will be added dynamically
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'blob:',
    'data:',
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
    'https://*.vercel.app',
    'https://*.supabase.co',
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'https://*.google-analytics.com',
    'https://api.openai.com',
    'https://api.anthropic.com',
    'wss://*.supabase.co',
  ],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'self'", 'https://*.stripe.com'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'manifest-src': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
  'upgrade-insecure-requests': true,
};

/**
 * Build CSP header string from directives and nonce
 */
export function buildCSPHeader(
  directives: CSPDirectives = defaultCSPDirectives,
  nonce?: string
): string {
  const parts: string[] = [];

  for (const [directive, value] of Object.entries(directives)) {
    if (typeof value === 'boolean') {
      if (value) {
        parts.push(directive);
      }
      continue;
    }

    if (Array.isArray(value)) {
      let directiveValue = value.join(' ');

      // Add nonce to script-src and style-src if provided
      if (nonce && (directive === 'script-src' || directive === 'style-src')) {
        directiveValue += ` 'nonce-${nonce}'`;
      }

      parts.push(`${directive} ${directiveValue}`);
    }
  }

  return parts.join('; ');
}

/**
 * Middleware to add CSP headers with nonce
 * Adds CSP header and nonce to request for use in rendering
 */
export function withCSP(
  request: NextRequest,
  response: NextResponse,
  directives: CSPDirectives = defaultCSPDirectives
): { response: NextResponse; nonce: string } {
  const nonce = generateNonce();
  const cspHeader = buildCSPHeader(directives, nonce);

  // Add CSP header
  response.headers.set('Content-Security-Policy', cspHeader);

  // Add nonce to response headers for client-side use
  response.headers.set('X-CSP-Nonce', nonce);

  return { response, nonce };
}

/**
 * Generate HTML attributes for script/style tags with nonce
 */
export function getNonceAttributes(nonce: string): {
  script: string;
  style: string;
} {
  return {
    script: `nonce="${nonce}"`,
    style: `nonce="${nonce}"`,
  };
}

/**
 * Strict CSP directives for high-security pages (admin, auth)
 */
export const strictCSPDirectives: CSPDirectives = {
  ...defaultCSPDirectives,
  'script-src': ["'self'"], // No external scripts
  'style-src': ["'self'"], // No external styles
  'connect-src': ["'self'"], // No external API calls
  'img-src': ["'self'", 'data:'], // No external images
  'frame-src': ["'none'"], // No iframes
};

/**
 * Report-only CSP directives for testing
 * Violations are reported but not enforced
 */
export function buildReportOnlyCSP(
  directives: CSPDirectives = defaultCSPDirectives,
  reportUri?: string
): string {
  const csp = buildCSPHeader(directives);
  return reportUri ? `${csp}; report-uri ${reportUri}` : csp;
}
