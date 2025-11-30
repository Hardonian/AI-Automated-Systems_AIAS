import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

/**
 * Create Supabase server client for use in Server Components and API routes
 * 
 * Uses async cookies() for Next.js 15 compatibility.
 * Build-safe: won't throw during build if env vars are missing.
 * 
 * NOTE: For full Next.js 15 cookie handling, consider installing @supabase/ssr
 * and using createServerClient from that package instead.
 */
export async function createServerSupabaseClient() {
  // Next.js 15: cookies() must be awaited
  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    // Build-safe: only throw at runtime, not during build
    if (process.env.NODE_ENV === 'production' && !process.env.SKIP_ENV_VALIDATION) {
      throw new Error('Missing Supabase environment variables');
    }
    // During build, return a placeholder client to prevent build failures
    return createClient<Database>(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

// Legacy export for backwards compatibility
export async function createServerClient() {
  return createServerSupabaseClient();
}
