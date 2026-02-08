/**
 * Supabase Server Client Stub
 *
 * Supabase has been removed. Exports no-op stubs for server components
 * and API routes that previously imported this module.
 */

function noopChain(): any {
  const chain: any = new Proxy(() => chain, {
    get: (_t, prop) => {
      if (prop === 'then') return undefined;
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
};

const stub: any = {
  from: (..._args: any[]) => noopChain(),
  rpc: (..._args: any[]) => Promise.resolve({ data: null, error: null }),
  auth: noopAuth,
  storage: { from: (..._args: any[]) => noopChain() },
};

export async function createServerSupabaseClient<_T = any>(): Promise<any> {
  return stub;
}

export async function createServerClient<_T = any>(): Promise<any> {
  return stub;
}

export async function createClient<_T = any>(): Promise<any> {
  return stub;
}
