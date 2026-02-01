/**
 * Shared CORS utility for Supabase Edge Functions
 * Provides secure, production-ready CORS handling
 */

// Production CORS - restrict to specific origins
export const ALLOWED_ORIGINS = [
  'https://aias-consultancy.com',
  'https://www.aias-consultancy.com',
  'https://app.aias-consultancy.com',
  // Add staging/preview domains as needed
  ...(Deno.env.get('STAGING_URL') ? [Deno.env.get('STAGING_URL')!] : []),
];

/**
 * Get CORS headers based on request origin
 * Never returns wildcard (*) in production
 */
export function getCorsHeaders(
  requestOrigin: string | null
): Record<string, string> {
  // Only allow specific origins, never wildcard in production
  const allowedOrigin =
    requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
      ? requestOrigin
      : ALLOWED_ORIGINS[0]; // Default to primary domain

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-tenant-id',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

/**
 * Get security headers to add to all responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Combine CORS and security headers for a complete header set
 */
export function getResponseHeaders(
  requestOrigin: string | null,
  contentType: string = 'application/json'
): Record<string, string> {
  return {
    ...getCorsHeaders(requestOrigin),
    ...getSecurityHeaders(),
    'Content-Type': contentType,
  };
}
