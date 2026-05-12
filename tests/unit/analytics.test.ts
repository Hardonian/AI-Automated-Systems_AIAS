import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('analytics track', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('uses noopAdapter when provider is not vercel', async () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_PROVIDER', 'none');

    const vercelMock = { track: vi.fn() };
    vi.doMock('@vercel/analytics', () => vercelMock);

    const analytics = await import('../../lib/analytics');

    analytics.track('test_event');

    await new Promise(resolve => setTimeout(resolve, 0)); // wait for dynamic import microtasks

    expect(vercelMock.track).not.toHaveBeenCalled();
  });

  it('uses vercelAdapter when provider is vercel', async () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_PROVIDER', 'vercel');

    const vercelMock = { track: vi.fn() };
    vi.doMock('@vercel/analytics', () => vercelMock);

    const analytics = await import('../../lib/analytics');

    analytics.track('test_event', { foo: 'bar' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(vercelMock.track).toHaveBeenCalledWith('test_event', { foo: 'bar' });
  });

  it('handles tracking failure gracefully when import fails', async () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_PROVIDER', 'vercel');

    // Create an unresolvable mock to simulate an import error in the .catch block of the dynamic import
    vi.doMock('@vercel/analytics', () => Promise.reject(new Error('Import failed')));

    const analytics = await import('../../lib/analytics');

    // The track method should catch the error and return undefined without throwing
    expect(() => {
      analytics.track('error_event');
    }).not.toThrow();

    await new Promise(resolve => setTimeout(resolve, 0));
  });
});
