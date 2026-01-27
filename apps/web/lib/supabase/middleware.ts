/**
 * Supabase client for Next.js Middleware (Edge runtime)
 *
 * Why this exists:
 * - Next.js middleware runs on the Edge runtime (no `next/headers`, no Node APIs)
 * - Supabase auth in middleware must read cookies from `NextRequest` and write cookies
 *   to the specific `NextResponse` instance returned by middleware.
 *
 * This helper is intentionally minimal and safe:
 * - If required env vars are missing, it returns `supabase: null` (callers must fail-closed on protected routes)
 * - It creates the response instance up-front so cookie writes are correctly applied.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/supabase";

type MiddlewareSupabaseClient = ReturnType<typeof createServerClient<Database>>;

export function createMiddlewareSupabaseClient(
  request: NextRequest
): { supabase: MiddlewareSupabaseClient | null; response: NextResponse; missingEnv: boolean } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Always create a response instance first (cookie writes must target the returned instance)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    return { supabase: null, response, missingEnv: true };
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // NextResponse cookies typing differs slightly from Supabase's cookie options shape.
          // Runtime behavior is correct; we cast to keep this Edge-safe and non-brittle.
          response.cookies.set(name, value, options as any);
        });
      },
    },
  });

  return { supabase, response, missingEnv: false };
}

