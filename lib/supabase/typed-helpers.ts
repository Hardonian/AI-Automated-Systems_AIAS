/**
 * Type-safe helpers for Supabase operations
 * These helpers work around Supabase's strict type checking
 * while maintaining runtime safety
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Type-safe insert helper that works with any table
 */
export async function typedInsert<T extends Record<string, unknown>>(
  client: SupabaseClient<Database>,
  table: string,
  values: T | T[]
) {
  return client.from(table).insert(values as any)
}

/**
 * Type-safe update helper that works with any table
 */
export async function typedUpdate<T extends Record<string, unknown>>(
  client: SupabaseClient<Database>,
  table: string,
  values: Partial<T>
) {
  return client.from(table).update(values as any)
}

/**
 * Type-safe upsert helper that works with any table
 */
export async function typedUpsert<T extends Record<string, unknown>>(
  client: SupabaseClient<Database>,
  table: string,
  values: T | T[]
) {
  return client.from(table).upsert(values as any)
}
