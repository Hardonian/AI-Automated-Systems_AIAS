import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

/**
 * Supabase Client for Browser/Client Components
 * 
 * CRITICAL: Throws hard error immediately if required env vars are missing.
 * This ensures runtime failures are caught early, not silently ignored.
 * 
 * Build-safe: During build (when SKIP_ENV_VALIDATION=true), returns placeholder
 * to prevent build failures. At runtime, throws hard error if vars are missing.
 * 
 * Uses @supabase/ssr for Next.js 15 compatibility with proper cookie handling.
 */
export function createClient() {
  // Type-safe access: process.env is string | undefined
  const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Build-safe check: Skip validation during build
  // In GitHub Actions, env vars should be available, so only skip if explicitly set
  const isBuildTime = (process.env.SKIP_ENV_VALIDATION === 'true' || 
                       process.env.SKIP_ENV_VALIDATION === '1') &&
                      !process.env.GITHUB_ACTIONS &&
                      !process.env.VERCEL;
  
  // Hard error at runtime if missing (production safety)
  if (!supabaseUrl || !supabaseKey) {
    if (!isBuildTime) {
      // Runtime: Throw hard error immediately - do not fail silently
      throw new Error(
        `Missing required Supabase environment variables. ` +
        `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'set' : 'MISSING'}, ` +
        `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? 'set' : 'MISSING'}`
      );
    }
    // Build-time: Return placeholder to prevent build failures
    // This will fail at runtime if actually used, which is the desired behavior
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }
  
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  );
}

// Backward compatibility: Export a lazy client getter to avoid build-time execution
// Note: For better performance in client components, use createClient() directly
let _supabaseInstance: ReturnType<typeof createClient> | null = null;
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    if (!_supabaseInstance) {
      _supabaseInstance = createClient();
    }
    const value = _supabaseInstance[prop as keyof typeof _supabaseInstance];
    return typeof value === 'function' ? value.bind(_supabaseInstance) : value;
  }
});
