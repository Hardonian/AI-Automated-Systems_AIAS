// Supabase Database Types
// This file provides type definitions for Supabase database operations
// 
// NOTE: For production, regenerate types using:
//   pnpm tsx scripts/regenerate-supabase-types.ts
//   Or: supabase gen types typescript --project-id <PROJECT_REF> > types/supabase.ts
//
// This is a workaround type definition that allows Supabase operations to work
// without strict schema types. For full type safety, regenerate from your schema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Generic table definition - using 'any' for Insert/Update to allow flexible operations
// This is a workaround until proper types are regenerated from the schema
type TableDef = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
}

// Database interface - permissive structure that works with Supabase's type system
// The key is that Supabase uses conditional types that return 'never' if a table
// doesn't exist. By defining all possible tables, we avoid the 'never' type.
export type Database = {
  public: {
    Tables: {
      [tableName: string]: TableDef
    }
    Views: {
      [viewName: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [functionName: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [enumName: string]: string
    }
  }
}
