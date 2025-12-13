/**
 * Server-Side Guard Helpers
 * Safe wrappers for external dependencies that never throw hard 500s
 */

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { SystemError, NetworkError } from "@/lib/errors";
import { logger } from "@/lib/logging/structured-logger";

/**
 * Require environment variable with safe fallback
 * Returns the value or throws a SystemError (which will be caught by route handler)
 */
export function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    const error = new SystemError(
      `Missing required environment variable: ${key}`,
      undefined,
      { key, defaultValue: defaultValue || null }
    );
    logger.error(`Missing env var: ${key}`, error);
    throw error;
  }
  
  return value;
}

/**
 * Safe Stripe client initialization
 * Returns Stripe instance or throws SystemError (caught by route handler)
 */
export function safeStripe(): Stripe {
  const secretKey = env.stripe.secretKey;
  
  if (!secretKey) {
    const error = new SystemError(
      "Stripe secret key not configured",
      undefined,
      { envKey: "STRIPE_SECRET_KEY" }
    );
    logger.error("Stripe not configured", error);
    throw error;
  }
  
  try {
    return new Stripe(secretKey, {
      apiVersion: "2023-10-16",
      maxNetworkRetries: 3,
      timeout: 10000, // 10 second timeout
    });
  } catch (err) {
    const error = new SystemError(
      "Failed to initialize Stripe client",
      err instanceof Error ? err : new Error(String(err)),
      { secretKeyPrefix: secretKey.substring(0, 7) }
    );
    logger.error("Stripe initialization failed", error);
    throw error;
  }
}

/**
 * Safe Supabase client initialization
 * Returns Supabase client or throws SystemError (caught by route handler)
 */
export function safeSupabase(useServiceRole: boolean = false) {
  const url = env.supabase.url;
  const key = useServiceRole 
    ? env.supabase.serviceRoleKey 
    : env.supabase.anonKey;
  
  if (!url || !key) {
    const error = new SystemError(
      "Supabase not configured",
      undefined,
      { 
        url: url ? "set" : "missing",
        key: key ? "set" : "missing",
        useServiceRole 
      }
    );
    logger.error("Supabase not configured", error);
    throw error;
  }
  
  try {
    return createClient(url, key, {
      auth: {
        persistSession: false, // Server-side, no session persistence
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    const error = new SystemError(
      "Failed to initialize Supabase client",
      err instanceof Error ? err : new Error(String(err)),
      { url, useServiceRole }
    );
    logger.error("Supabase initialization failed", error);
    throw error;
  }
}

/**
 * Safe fetch with timeout and retry
 * Returns Response or throws NetworkError (caught by route handler)
 */
export async function safeFetch(
  url: string,
  options: RequestInit & { 
    timeout?: number;
    retries?: number;
  } = {}
): Promise<Response> {
  const { timeout = 10000, retries = 2, ...fetchOptions } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok && attempt < retries) {
        // Retry on 5xx errors
        if (response.status >= 500) {
          logger.warn(`Fetch failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, {
            url,
            status: response.status,
            attempt: attempt + 1,
          });
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }
      
      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Don't retry on abort (timeout)
      if (lastError.name === "AbortError") {
        throw new NetworkError(
          `Request timeout after ${timeout}ms`,
          false, // Not retryable
          { url, timeout }
        );
      }
      
      // Retry on network errors
      if (attempt < retries) {
        logger.warn(`Fetch error (attempt ${attempt + 1}/${retries + 1}), retrying...`, {
          url,
          error: lastError.message,
          attempt: attempt + 1,
        });
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
    }
  }
  
  throw new NetworkError(
    `Failed to fetch after ${retries + 1} attempts: ${lastError?.message || "Unknown error"}`,
    true, // Retryable
    { url, retries: retries + 1 }
  );
}

/**
 * Safe database query wrapper
 * Executes query and handles errors gracefully
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await queryFn();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error("Database query failed", error);
    
    if (fallback !== undefined) {
      logger.warn("Using fallback value for database query", {
        error: error.message,
      });
      return fallback;
    }
    
    throw new SystemError(
      "Database query failed",
      error,
      { fallbackUsed: false }
    );
  }
}

/**
 * Safe external API call wrapper
 * Handles timeouts, retries, and errors gracefully
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    timeout?: number;
    retries?: number;
    fallback?: T;
    errorMessage?: string;
  } = {}
): Promise<T> {
  const {
    timeout = 10000,
    retries = 2,
    fallback,
    errorMessage = "External API call failed",
  } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await Promise.race([
        apiCall(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ]);
      
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      if (attempt < retries) {
        logger.warn(`API call failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, {
          error: lastError.message,
          attempt: attempt + 1,
        });
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
    }
  }
  
  if (fallback !== undefined) {
    logger.warn("Using fallback value for API call", {
      error: lastError?.message,
    });
    return fallback;
  }
  
  throw new NetworkError(
    `${errorMessage}: ${lastError?.message || "Unknown error"}`,
    true,
    { retries: retries + 1 }
  );
}
