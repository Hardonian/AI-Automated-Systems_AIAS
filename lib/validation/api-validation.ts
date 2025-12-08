/**
 * API Input Validation Utilities
 * Standardized Zod schemas and validation helpers for API routes
 */

import { z } from 'zod';
import { NextRequest } from 'next/server';
import { isString, isObject } from '@/lib/utils/type-guards';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  id: z.string().min(1, 'ID is required'),
  uuid: z.string().uuid('Invalid UUID format'),
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  nonEmptyString: z.string().min(1, 'String cannot be empty'),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  nonNegativeInteger: z.number().int().nonnegative('Must be a non-negative integer'),
  dateString: z.string().datetime('Invalid date format'),
  pagination: z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(20),
  }),
  sort: z.object({
    field: z.string().min(1),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  }),
};

/**
 * Parse and validate request body
 */
export async function parseRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError }> {
  try {
    const text = await request.text();
    if (!text) {
      return {
        success: false,
        error: new z.ZodError([
          {
            code: 'custom',
            message: 'Request body is required',
            path: [],
          },
        ]),
      };
    }

    const json = JSON.parse(text);
    const result = schema.safeParse(json);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: `Failed to parse request body: ${message}`,
          path: [],
        },
      ]),
    };
  }
}

/**
 * Parse and validate query parameters
 */
export function parseQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, unknown> = {};

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  const result = schema.safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Parse and validate route parameters
 */
export function parseRouteParams<T>(
  params: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  if (!isObject(params)) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Route parameters must be an object',
          path: [],
        },
      ]),
    };
  }

  const result = schema.safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Format Zod error for API response
 */
export function formatZodError(error: z.ZodError): {
  message: string;
  details: Array<{ path: string[]; message: string }>;
} {
  return {
    message: 'Validation failed',
    details: error.errors.map(err => ({
      path: err.path.map(String),
      message: err.message,
    })),
  };
}

/**
 * Validate request with multiple validators
 */
export async function validateRequest<TBody, TQuery, TParams>(options: {
  request: NextRequest;
  body?: z.ZodSchema<TBody>;
  query?: z.ZodSchema<TQuery>;
  params?: unknown;
  paramsSchema?: z.ZodSchema<TParams>;
}): Promise<{
  success: true;
  body?: TBody;
  query?: TQuery;
  params?: TParams;
} | {
  success: false;
  error: z.ZodError;
  source: 'body' | 'query' | 'params';
}> {
  // Validate body
  if (options.body) {
    const bodyResult = await parseRequestBody(options.request, options.body);
    if (!bodyResult.success) {
      return { success: false, error: bodyResult.error, source: 'body' };
    }
  }

  // Validate query
  if (options.query) {
    const queryResult = parseQueryParams(options.request, options.query);
    if (!queryResult.success) {
      return { success: false, error: queryResult.error, source: 'query' };
    }
  }

  // Validate params
  if (options.paramsSchema && options.params) {
    const paramsResult = parseRouteParams(options.params, options.paramsSchema);
    if (!paramsResult.success) {
      return { success: false, error: paramsResult.error, source: 'params' };
    }
  }

  // All validations passed, return parsed data
  const result: {
    success: true;
    body?: TBody;
    query?: TQuery;
    params?: TParams;
  } = { success: true };

  if (options.body) {
    const bodyResult = await parseRequestBody(options.request, options.body);
    if (bodyResult.success) {
      result.body = bodyResult.data;
    }
  }

  if (options.query) {
    const queryResult = parseQueryParams(options.request, options.query);
    if (queryResult.success) {
      result.query = queryResult.data;
    }
  }

  if (options.paramsSchema && options.params) {
    const paramsResult = parseRouteParams(options.params, options.paramsSchema);
    if (paramsResult.success) {
      result.params = paramsResult.data;
    }
  }

  return result;
}
