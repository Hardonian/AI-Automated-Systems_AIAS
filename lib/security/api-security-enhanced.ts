/**
 * Enhanced API Security Utilities
 * Comprehensive validation and security checks for API routes
 */

import { z } from "zod";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logging/structured-logger";

/**
 * Enhanced input validation with detailed error messages
 */
export function validateInputEnhanced<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch (error) {
    logger.error("Validation error", error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
    .slice(0, 10000); // Limit length
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Check request origin for CORS
 */
export function isValidOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {return false;}
  return allowedOrigins.some((allowed) => origin === allowed || origin.endsWith(allowed));
}

/**
 * Rate limit check (enhanced)
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  identifier: string;
}

/**
 * Validate request size
 */
export function validateRequestSize(body: string, maxSize: number): boolean {
  const sizeInBytes = new Blob([body]).size;
  return sizeInBytes <= maxSize;
}

/**
 * Extract and validate user ID from request
 */
export async function extractUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  // In production, verify JWT token here
  // For now, extract from header
  const userId = request.headers.get("x-user-id");
  if (userId && validateUUID(userId)) {
    return userId;
  }

  return null;
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email().max(254),
  url: z.string().url(),
  nonEmptyString: z.string().min(1).max(10000),
  positiveInteger: z.number().int().positive(),
  nonNegativeInteger: z.number().int().nonnegative(),
  dateISO: z.string().datetime(),
};
