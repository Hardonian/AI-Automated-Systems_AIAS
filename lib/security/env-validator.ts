/**
 * Environment Variable Validator
 * Centralized validation for all environment variables
 */

import { z } from "zod";
import { logger } from "@/lib/logging/structured-logger";

/**
 * Environment variable schema
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Optional: API keys
  SHOPIFY_API_KEY: z.string().optional(),
  SHOPIFY_API_SECRET: z.string().optional(),
  WAVE_API_KEY: z.string().optional(),
  WAVE_API_SECRET: z.string().optional(),

  // Optional: Email
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),

  // Optional: Analytics
  VERCEL_ANALYTICS_ID: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

/**
 * Validate and return environment variables
 */
export function getEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join(".")).join(", ");
      logger.error("Missing or invalid environment variables", new Error(missingVars));
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

/**
 * Get environment variable with validation
 */
export function getEnvVar(key: keyof Env): string {
  const env = getEnv();
  const value = env[key];
  if (typeof value !== "string") {
    throw new Error(`Environment variable ${key} is not a string`);
  }
  return value;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === "development";
}
