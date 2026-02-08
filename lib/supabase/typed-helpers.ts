/**
 * Typed Helpers Stub
 *
 * Supabase has been removed. All typed helpers are no-ops.
 */

export async function typedInsert<T extends Record<string, unknown>>(
  _client: any,
  _table: string,
  _values: T | T[]
) {
  return { data: null, error: null };
}

export async function typedUpdate<T extends Record<string, unknown>>(
  _client: any,
  _table: string,
  _values: Partial<T>
) {
  return { data: null, error: null };
}

export async function typedUpsert<T extends Record<string, unknown>>(
  _client: any,
  _table: string,
  _values: T | T[]
) {
  return { data: null, error: null };
}
