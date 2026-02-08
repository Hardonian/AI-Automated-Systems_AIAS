/**
 * Supabase Client Stub
 *
 * Supabase has been removed. This module exports no-op stubs so that
 * existing imports compile without changes. All operations return empty
 * results. Auth calls resolve to "not authenticated".
 */

function noopChain(): any {
  const chain: any = new Proxy(() => chain, {
    get: (_t, prop) => {
      if (prop === 'then') return undefined; // not a thenable
      if (prop === 'data') return null;
      if (prop === 'error') return null;
      if (prop === 'count') return 0;
      return (..._args: any[]) => chain;
    },
    apply: () => chain,
  });
  return chain;
}

const noopAuth = {
  getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  signOut: () => Promise.resolve({ error: null }),
  onAuthStateChange: (_cb: any) => ({
    data: { subscription: { unsubscribe: () => {} } },
  }),
};

const stub: any = {
  from: () => noopChain(),
  rpc: () => Promise.resolve({ data: null, error: null }),
  auth: noopAuth,
  storage: { from: () => noopChain() },
  channel: () => noopChain(),
  removeChannel: () => {},
};

export function createClient() {
  return stub;
}

export const supabase = stub;
