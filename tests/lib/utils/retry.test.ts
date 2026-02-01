import { describe, it, expect, vi, beforeEach } from 'vitest';

import { retry, CircuitBreaker } from '@/lib/utils/retry';

describe('Retry Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should retry failed operations', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) {
        // Error message must contain 'network' (lowercase), 'timeout', or 'ECONNREFUSED' to be retryable
        throw new Error('network connection failed');
      }
      return 'success';
    };

    const result = await retry(fn, { maxAttempts: 3, initialDelayMs: 10 });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('should fail after max retries', async () => {
    const fn = vi.fn(async () => {
      const error = new Error('Always fails');
      error.message = 'Network timeout';
      throw error;
    });

    await expect(
      retry(fn, { maxAttempts: 2, initialDelayMs: 10 })
    ).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect retry delay', async () => {
    const start = Date.now();
    const fn = vi.fn(async () => {
      const error = new Error('Fail');
      error.message = 'ECONNREFUSED';
      throw error;
    });

    try {
      await retry(fn, { maxAttempts: 2, initialDelayMs: 50 });
    } catch {
      // Expected to fail
    }

    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(40); // Allow small variance
  });

  it('should not retry non-retryable errors', async () => {
    const fn = vi.fn(async () => {
      throw new Error('Non-retryable error');
    });

    await expect(
      retry(fn, { maxAttempts: 3, initialDelayMs: 10 })
    ).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1); // Should not retry
  });
});

describe('Circuit Breaker', () => {
  it('should open after failure threshold', async () => {
    const breaker = new CircuitBreaker(3, 1000);
    const failingFn = async () => {
      throw new Error('Service error');
    };

    // Fail 3 times
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    await expect(breaker.execute(failingFn)).rejects.toThrow();

    // Circuit should be open now
    expect(breaker.getState()).toBe('open');
  });

  it('should reset after timeout', async () => {
    const breaker = new CircuitBreaker(2, 100); // 100ms reset timeout
    const failingFn = async () => {
      throw new Error('Service error');
    };

    // Fail 2 times to open circuit
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    expect(breaker.getState()).toBe('open');

    // Wait for reset timeout
    await new Promise(resolve => setTimeout(resolve, 150));

    // Circuit should transition to half-open on next attempt
    // but will still fail if function fails
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    expect(breaker.getState()).toBe('open'); // Reopens after failure
  });

  it('should close circuit on success', async () => {
    const breaker = new CircuitBreaker(3, 1000);
    let shouldFail = true;

    const fn = async () => {
      if (shouldFail) {
        throw new Error('Service error');
      }
      return 'success';
    };

    // Fail twice
    await expect(breaker.execute(fn)).rejects.toThrow();
    await expect(breaker.execute(fn)).rejects.toThrow();

    // Succeed on third attempt
    shouldFail = false;
    const result = await breaker.execute(fn);

    expect(result).toBe('success');
    expect(breaker.getState()).toBe('closed');
  });

  it('should throw when circuit is open', async () => {
    const breaker = new CircuitBreaker(1, 60000); // Long reset timeout
    const failingFn = async () => {
      throw new Error('Service error');
    };

    // Fail once to open circuit
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    expect(breaker.getState()).toBe('open');

    // Next call should throw circuit breaker error
    await expect(breaker.execute(failingFn)).rejects.toThrow(
      'Circuit breaker is open'
    );
  });

  it('should reset circuit manually', async () => {
    const breaker = new CircuitBreaker(1, 60000);
    const failingFn = async () => {
      throw new Error('Service error');
    };

    // Open circuit
    await expect(breaker.execute(failingFn)).rejects.toThrow();
    expect(breaker.getState()).toBe('open');

    // Reset
    breaker.reset();
    expect(breaker.getState()).toBe('closed');
  });
});
