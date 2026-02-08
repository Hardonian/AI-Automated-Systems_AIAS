/**
 * Shim for @supabase/supabase-js
 *
 * Supabase has been removed. This module provides a createClient export
 * that returns a no-op stub so existing files compile and run without Supabase.
 */

export function createClient<_T = any>(..._args: any[]): any {
  const noopChain: any = new Proxy(
    () => {
      return noopChain;
    },
    {
      get: (_t, prop) => {
        if (prop === 'then') return undefined; // not a thenable
        if (prop === 'data') return null;
        if (prop === 'error') return null;
        if (prop === 'count') return 0;
        if (prop === 'auth') return noopAuth;
        if (prop === 'storage') return { from: (..._a: any[]) => noopChain };
        if (prop === 'channel') return (..._a: any[]) => noopChain;
        if (prop === 'removeChannel') return () => {};
        if (prop === 'from') return (..._a: any[]) => noopChain;
        if (prop === 'rpc')
          return (..._a: any[]) => Promise.resolve({ data: null, error: null });
        return (..._a: any[]) => noopChain;
      },
      apply: () => noopChain,
    }
  );

  const noopAuth: any = {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: (..._a: any[]) =>
      Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: (..._a: any[]) =>
      Promise.resolve({ data: { user: null, session: null }, error: null }),
    onAuthStateChange: (_cb: any) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    admin: {
      createUser: (..._a: any[]) =>
        Promise.resolve({ data: { user: null }, error: null }),
      deleteUser: (..._a: any[]) =>
        Promise.resolve({ data: null, error: null }),
      listUsers: (..._a: any[]) =>
        Promise.resolve({ data: { users: [] }, error: null }),
    },
  };

  return noopChain;
}

export type SupabaseClient<_T = any> = any;
