/**
 * API Route Handler Utilities
 * Secure, performant API route handlers with built-in security
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateInput, checkRequestSize, maskSensitiveData } from '../security/api-security';
import { tenantIsolation } from '../security/tenant-isolation';
// Lazy import cacheService to support Edge runtime
// Cache is only available in Node.js runtime, not Edge
// In Edge runtime, caching is disabled
function getCacheService() {
  // Cache service uses ioredis which requires Node.js runtime
  // Return null to disable caching in Edge runtime
  return null;
}
import { z } from 'zod';
import { SystemError, ValidationError, AuthenticationError, AuthorizationError, formatError } from '@/lib/errors';
import { isDefined, isError, isObject } from '@/lib/utils/type-guards';
import { logger } from '@/lib/logging/structured-logger';

export interface RouteHandlerOptions {
  requireAuth?: boolean;
  requireTenant?: boolean;
  requiredPermission?: string;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  maxBodySize?: number;
  validateBody?: z.ZodSchema<unknown>;
  cache?: {
    enabled: boolean;
    ttl?: number;
    tags?: string[];
  };
  cacheable?: boolean; // Legacy alias for cache.enabled
  cacheTTL?: number; // Legacy alias for cache.ttl
}

export interface RouteContext {
  request: NextRequest;
  userId: string | null;
  tenantId: string | null;
  tenantContext?: Record<string, unknown>;
}

/**
 * Create secure API route handler
 */
export function createRouteHandler(
  handler: (context: RouteContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  // Convert legacy cacheable/cacheTTL to cache object
  const normalizedOptions: RouteHandlerOptions = { ...options };
  if (options.cacheable !== undefined && !options.cache) {
    normalizedOptions.cache = {
      enabled: options.cacheable,
      ttl: options.cacheTTL,
    };
  }
  
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    
    // Cache request body to avoid consuming it multiple times
    let cachedBody: string | null = null;
    let cachedBodyJson: unknown | null = null;
    
    const getBodyText = async (): Promise<string> => {
      if (cachedBody === null) {
        cachedBody = await request.text();
      }
      return cachedBody;
    };
    
    const getBodyJson = async (): Promise<unknown> => {
      if (cachedBodyJson === null) {
        const bodyText = await getBodyText();
        cachedBodyJson = JSON.parse(bodyText);
      }
      return cachedBodyJson;
    };
    
    try {
      // Check request size
      if (normalizedOptions.maxBodySize) {
        const body = await getBodyText();
        if (!checkRequestSize(body, normalizedOptions.maxBodySize)) {
          const error = new ValidationError('Request too large', undefined, { maxSize: normalizedOptions.maxBodySize });
          const formatted = formatError(error);
          return NextResponse.json(
            { error: formatted.message },
            { status: formatted.statusCode }
          );
        }
      }
      
      // Get user ID from request
      let userId: string | null = null;
      if (normalizedOptions.requireAuth || normalizedOptions.requireTenant) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          // Extract user ID from token (simplified - should verify JWT)
          userId = request.headers.get('x-user-id') || null;
        }
        
        if (normalizedOptions.requireAuth && !userId) {
          const error = new AuthenticationError('Authentication required');
          const formatted = formatError(error);
          return NextResponse.json(
            { error: formatted.message },
            { status: formatted.statusCode }
          );
        }
      }
      
      // Get tenant ID
      let tenantId: string | null = null;
      if (normalizedOptions.requireTenant) {
        tenantId = request.headers.get('x-tenant-id') || null;
        
        if (!tenantId) {
          const error = new ValidationError('Tenant ID required');
          const formatted = formatError(error);
          return NextResponse.json(
            { error: formatted.message },
            { status: formatted.statusCode }
          );
        }
        
        // Validate tenant access
        if (userId) {
          const access = await tenantIsolation.validateAccess(
            tenantId,
            userId,
            normalizedOptions.requiredPermission
          );
          
          if (!access.allowed) {
            const error = new AuthorizationError('Insufficient permissions');
            const formatted = formatError(error);
            return NextResponse.json(
              { error: formatted.message },
              { status: formatted.statusCode }
            );
          }
        }
      }
      
      // Validate request body
      if (normalizedOptions.validateBody) {
        try {
          const body = await getBodyJson();
          const validation = validateInput(normalizedOptions.validateBody, body);
          
          if (!validation.success) {
            const errorDetails = isObject(validation.error) && 'issues' in validation.error && Array.isArray(validation.error.issues)
              ? validation.error.issues.map((issue: unknown) => {
                  if (isObject(issue) && 'path' in issue && 'message' in issue) {
                    return { 
                      path: Array.isArray(issue.path) ? issue.path : [String(issue.path)], 
                      message: String(issue.message) 
                    };
                  }
                  return { path: [], message: String(issue) };
                })
              : [];
            const error = new ValidationError(
              'Invalid request body',
              errorDetails
            );
            const formatted = formatError(error);
            return NextResponse.json(
              { error: formatted.message, details: formatted.details },
              { status: formatted.statusCode }
            );
          }
        } catch (error) {
          const validationError = new ValidationError(
            'Invalid JSON body',
            undefined,
            { originalError: error instanceof Error ? error.message : String(error) }
          );
          const formatted = formatError(validationError);
          return NextResponse.json(
            { error: formatted.message },
            { status: formatted.statusCode }
          );
        }
      }
      
      // Check cache
      if (normalizedOptions.cache?.enabled) {
        const bodyText = await getBodyText();
        const cacheKey = `api:${request.nextUrl.pathname}:${bodyText}`;
        const cache = getCacheService();
        if (cache && isObject(cache) && typeof cache.get === 'function') {
          const cached = await cache.get(cacheKey, {
            ttl: normalizedOptions.cache.ttl,
            tenantId: tenantId || undefined,
            tags: normalizedOptions.cache.tags,
          });
          
          if (isDefined(cached)) {
            const response = NextResponse.json(cached);
            response.headers.set('X-Cache', 'HIT');
            response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
            return response;
          }
        }
      }
      
      // Create context
      const context: RouteContext = {
        request,
        userId,
        tenantId,
      };
      
      // Execute handler
      const response = await handler(context);
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
      
      // Cache response if enabled
      if (normalizedOptions.cache?.enabled && response.status === 200) {
        try {
          const body = await response.clone().json();
          const bodyText = await getBodyText();
          const cacheKey = `api:${request.nextUrl.pathname}:${bodyText}`;
          const cache = getCacheService();
          if (cache && isObject(cache) && typeof cache.set === 'function') {
            await cache.set(cacheKey, body, {
              ttl: normalizedOptions.cache.ttl,
              tenantId: tenantId || undefined,
              tags: normalizedOptions.cache.tags,
            });
          }
          response.headers.set('X-Cache', 'MISS');
        } catch {
          // Not JSON response, skip caching
        }
      }
      
      return response;
    } catch (error: unknown) {
      const errorDuration = Date.now() - startTime;
      logger.error('Route handler error', isError(error) ? error : new Error(String(error)), {
        path: request.nextUrl.pathname,
        method: request.method,
        duration: errorDuration,
        maskedError: maskSensitiveData(String(error)),
      });
      
      // Track error performance
      try {
        const { telemetry } = await import('@/lib/monitoring/enhanced-telemetry');
        telemetry.trackPerformance({
          name: 'route_handler_error',
          value: errorDuration,
          unit: 'ms',
          tags: {
            path: request.nextUrl.pathname,
            method: request.method,
          },
        });
      } catch {
        // Telemetry import failed, continue without tracking
      }
      
      const systemError = new SystemError(
        'Internal server error',
        isError(error) ? error : new Error(String(error))
      );
      const formatted = formatError(systemError);
      
      return NextResponse.json(
        {
          error: formatted.message,
          message: process.env.NODE_ENV === 'development' 
            ? (isError(error) ? error.message : String(error))
            : 'An error occurred processing your request',
        },
        { 
          status: formatted.statusCode,
          headers: {
            'X-Response-Time': `${errorDuration}ms`,
          },
        }
      );
    }
  };
}

/**
 * Create GET route handler
 */
export function createGETHandler(
  handler: (context: RouteContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  return createRouteHandler(handler, {
    ...options,
    cache: options.cache ?? { enabled: true, ttl: 300 },
  });
}

/**
 * Create POST route handler
 */
export function createPOSTHandler(
  handler: (context: RouteContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  return createRouteHandler(handler, {
    ...options,
    cache: { enabled: false }, // Don't cache POST requests
  });
}

/**
 * Handle API errors consistently
 * Helper function for error handling in API routes
 */
export function handleApiError(error: unknown, message: string): NextResponse {
  const systemError = new SystemError(
    message,
    isError(error) ? error : new Error(String(error))
  );
  const formatted = formatError(systemError);
  return NextResponse.json(
    { error: formatted.message },
    { status: formatted.statusCode }
  );
}
