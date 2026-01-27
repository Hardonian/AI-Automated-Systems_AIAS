/**
 * Strict Type Utilities
 * Type-safe utilities to replace 'any' types
 */

/**
 * Type-safe unknown handler
 * Use instead of 'any' when type is truly unknown
 */
export type UnknownRecord = Record<string, unknown>;

/**
 * Type guard for unknown objects
 */
export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard for string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard for number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Type guard for boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Type guard for array
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Safe JSON parse with type guard
 */
export function safeJsonParse<T>(json: string): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(json);
    return { success: true, data: parsed as T };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Type-safe object key access
 */
export function getObjectValue<T>(obj: UnknownRecord, key: string): T | undefined {
  const value = obj[key];
  return value as T | undefined;
}

/**
 * Type-safe object key set
 */
export function setObjectValue<T>(obj: UnknownRecord, key: string, value: T): void {
  obj[key] = value;
}

/**
 * Type-safe array filter
 */
export function filterArray<T>(
  array: unknown[],
  predicate: (item: unknown) => item is T
): T[] {
  return array.filter(predicate);
}

/**
 * Type-safe error handler
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return "Unknown error";
}

/**
 * Type-safe async result wrapper
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Wrap async function in Result type
 */
export async function toResult<T>(
  fn: () => Promise<T>
): Promise<Result<T, string>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Type-safe environment variable getter
 */
export function getEnvVar(key: string): string | undefined {
  if (typeof process === "undefined") {
    return undefined;
  }
  return process.env[key];
}

/**
 * Type-safe environment variable getter with default
 */
export function getEnvVarWithDefault(key: string, defaultValue: string): string {
  return getEnvVar(key) ?? defaultValue;
}

/**
 * Type-safe environment variable getter (required)
 */
export function requireEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}
