/**
 * Shim for @supabase/ssr
 *
 * Supabase has been removed. Provides createBrowserClient/createServerClient stubs.
 */

import { createClient } from './supabase-js';

export function createBrowserClient<_T = any>(..._args: any[]): any {
  return createClient();
}

export function createServerClient<_T = any>(..._args: any[]): any {
  return createClient();
}
