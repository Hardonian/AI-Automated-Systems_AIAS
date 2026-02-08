/**
 * Supabase Middleware Stub
 *
 * Supabase has been removed. This is a no-op pass-through.
 */

import { NextResponse, type NextRequest } from 'next/server';

export function createMiddlewareSupabaseClient(request: NextRequest) {
  return {
    supabase: null,
    response: NextResponse.next({ request: { headers: request.headers } }),
    missingEnv: true,
  };
}

export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request });
}
