import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Supabase Client for Browser/Client Components
 * 
 * Build-safe: won't throw during build if env vars are missing.
 * 
 * NOTE: For full Next.js 15 compatibility, consider installing @supabase/ssr
 * and using createBrowserClient from that package instead.
 */

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    // Build-safe: only throw at runtime, not during build
    if (typeof window !== 'undefined' || (process.env.NODE_ENV === 'production' && !process.env.SKIP_ENV_VALIDATION)) {
      throw new Error('Missing Supabase environment variables');
    }
    // During build, return a placeholder client to prevent build failures
    // This will fail at runtime if actually used
    return createSupabaseClient<Database>(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key',
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
    );
  }
  
  return createSupabaseClient<Database>(
    supabaseUrl,
    supabaseKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
}
