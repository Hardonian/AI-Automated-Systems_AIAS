/**
 * Type Guard Utilities
 * Comprehensive type narrowing functions for strict TypeScript compliance
 */

/**
 * Type guard to check if a value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if a value is an object (not null, not array, not primitive)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is an array
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is an Error instance
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if a value has a specific property
 */
export function hasProperty<K extends string>(
  value: unknown,
  prop: K
): value is Record<K, unknown> {
  return isObject(value) && prop in value;
}

/**
 * Type guard to check if a value has multiple properties
 */
export function hasProperties<K extends string>(
  value: unknown,
  ...props: K[]
): value is Record<K, unknown> {
  if (!isObject(value)) return false;
  return props.every(prop => prop in value);
}

/**
 * Type guard to check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

/**
 * Type guard to check if a value is a valid email
 */
export function isEmail(value: unknown): value is string {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Type guard to check if a value is a valid URL
 */
export function isUrl(value: unknown): value is string {
  if (!isString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type guard to check if a value is a valid Date or date string
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard to check if a value is a valid date string (ISO format)
 */
export function isDateString(value: unknown): value is string {
  if (!isString(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Type guard to check if a value is a valid UUID
 */
export function isUuid(value: unknown): value is string {
  if (!isString(value)) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Type guard to check if a value is a valid integer
 */
export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * Type guard to check if a value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

/**
 * Type guard to check if a value is a non-negative number
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return isNumber(value) && value >= 0;
}

/**
 * Safely get a property from an object with type narrowing
 */
export function getProperty<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined {
  if (!isDefined(obj) || !isObject(obj)) return undefined;
  return obj[key];
}

/**
 * Safely get a nested property from an object
 */
export function getNestedProperty<T>(
  obj: unknown,
  ...keys: string[]
): T | undefined {
  if (!isObject(obj)) return undefined;
  
  let current: unknown = obj;
  for (const key of keys) {
    if (!isObject(current) || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  
  return current as T;
}

/**
 * Assert that a value is defined, throwing if not
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value must be defined'
): asserts value is T {
  if (!isDefined(value)) {
    throw new Error(message);
  }
}

/**
 * Assert that a value is a string, throwing if not
 */
export function assertString(
  value: unknown,
  message = 'Value must be a string'
): asserts value is string {
  if (!isString(value)) {
    throw new Error(message);
  }
}

/**
 * Assert that a value is a number, throwing if not
 */
export function assertNumber(
  value: unknown,
  message = 'Value must be a number'
): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(message);
  }
}

/**
 * Assert that a value is an object, throwing if not
 */
export function assertObject(
  value: unknown,
  message = 'Value must be an object'
): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(message);
  }
}

/**
 * Coalesce a value to a default if null/undefined
 */
export function coalesce<T>(value: T | null | undefined, defaultValue: T): T {
  return isDefined(value) ? value : defaultValue;
}

/**
 * Coalesce a value to a default if null/undefined/empty string
 */
export function coalesceNonEmpty<T extends string>(
  value: T | null | undefined | '',
  defaultValue: T
): T {
  return (isNonEmptyString(value) ? value : defaultValue) as T;
}
