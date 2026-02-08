/**
 * Database Helpers Stub
 *
 * Supabase has been removed. All DB helpers return null / empty arrays.
 */

export function getSupabaseClient(): any {
  return null;
}

export async function upsert<T>(
  _table: string,
  _values: Partial<T>,
  _onConflict?: string
): Promise<T | null> {
  return null;
}

export async function findUnique<T>(
  _table: string,
  _where: Record<string, any>
): Promise<T | null> {
  return null;
}

export async function findMany<T>(
  _table: string,
  _where?: Record<string, any>,
  _options?: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
): Promise<T[]> {
  return [];
}

export async function create<T>(
  _table: string,
  _data: Partial<T>
): Promise<T | null> {
  return null;
}

export async function update<T>(
  _table: string,
  _where: Record<string, any>,
  _data: Partial<T>
): Promise<T | null> {
  return null;
}

export async function deleteRecord<T>(
  _table: string,
  _where: Record<string, any>
): Promise<T | null> {
  return null;
}

export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  return callback(null);
}

export async function count(
  _table: string,
  _where?: Record<string, any>
): Promise<number> {
  return 0;
}
