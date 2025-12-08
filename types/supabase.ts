// Supabase Database Types
// This file provides type definitions for Supabase database operations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Table definition - Insert must not be 'never' for Supabase's type system
// Using a union type that includes both object and array forms
type TableDef = {
  Row: { [key: string]: unknown }
  Insert: { [key: string]: unknown } | { [key: string]: unknown }[]
  Update: { [key: string]: unknown }
}

// Database interface - using index signature to allow any table name
// The key is that this structure allows Supabase's .from() to work
// with any string literal table name
export interface Database {
  public: {
    Tables: {
      [tableName: string]: TableDef
    }
    Views: {
      [viewName: string]: {
        Row: { [key: string]: unknown }
      }
    }
    Functions: {
      [functionName: string]: {
        Args: { [key: string]: unknown }
        Returns: unknown
      }
    }
    Enums: {
      [enumName: string]: string
    }
  }
}
