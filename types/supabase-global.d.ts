// Global type augmentation for Supabase
// This makes Supabase's type system more permissive for dynamic table usage

import type { Database } from './supabase'

declare module '@supabase/supabase-js' {
  interface SupabaseClient<DatabaseType = Database> {
    from<T extends string>(
      table: T
    ): {
      insert<V = any>(
        values: V | V[],
        options?: { count?: 'exact' | 'planned' | 'estimated' }
      ): any
      update<V = any>(
        values: Partial<V>,
        options?: { count?: 'exact' | 'planned' | 'estimated' }
      ): any
      upsert<V = any>(
        values: V | V[],
        options?: { onConflict?: string; ignoreDuplicates?: boolean }
      ): any
      select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }): any
      delete(): any
    }
  }
}

declare module '@supabase/ssr' {
  interface SupabaseClient<DatabaseType = Database> {
    from<T extends string>(
      table: T
    ): {
      insert<V = any>(
        values: V | V[],
        options?: { count?: 'exact' | 'planned' | 'estimated' }
      ): any
      update<V = any>(
        values: Partial<V>,
        options?: { count?: 'exact' | 'planned' | 'estimated' }
      ): any
      upsert<V = any>(
        values: V | V[],
        options?: { onConflict?: string; ignoreDuplicates?: boolean }
      ): any
      select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }): any
      delete(): any
    }
  }
}
