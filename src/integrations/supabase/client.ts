import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './types';

/**
 * Supabase Client Configuration
 * 
 * All values are loaded dynamically from environment variables.
 * No hardcoded credentials are used.
 * 
 * Environment variables are sourced from:
 * - Vercel: Dashboard → Settings → Environment Variables
 * - Supabase: Dashboard → Settings → API
 * - GitHub Actions: Repository → Settings → Secrets
 * - Local: .env.local file
 */

// Get environment variables dynamically.
// Support both Vite (import.meta.env) and Next.js (process.env) patterns.
// IMPORTANT: This must be build-safe (Next.js will import modules during `next build`).
function getOptionalEnvVar(key: string, viteKey?: string): string | undefined {
  // Try Vite environment variables first (for Vite-based builds)
  // Using eval to avoid TypeScript parsing issues with import.meta
  try {
    // eslint-disable-next-line no-eval
    const hasImportMeta = typeof eval !== 'undefined' && typeof eval('typeof import') !== 'undefined';
    if (hasImportMeta) {
      // eslint-disable-next-line no-eval
      const importMeta = eval('import.meta');
      if (importMeta && importMeta.env) {
        const viteValue = importMeta.env[viteKey || key] || importMeta.env[`VITE_${key}`];
        if (viteValue) {return viteValue;}
      }
    }
  } catch {
    // import.meta may not be available
  }
  
  // Try Next.js environment variables
  if (typeof process !== 'undefined' && process.env) {
    const nextValue = process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
    if (nextValue) {return nextValue;}
  }
  
  return undefined;
}

const SUPABASE_URL = getOptionalEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL');
const SUPABASE_PUBLISHABLE_KEY = getOptionalEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase: SupabaseClient<Database> | null =
  SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
    ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          storage: typeof window !== 'undefined' ? localStorage : undefined,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;