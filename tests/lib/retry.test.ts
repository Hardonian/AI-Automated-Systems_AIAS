/**
 * Tests for Retry Utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { retry } from '@/lib/utils/retry';

describe('lib/utils/retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('retry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retry(fn, { maxAttempts: 3 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');
      
      const result = await retry(fn, { maxAttempts: 3 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('fail'));
      
      await expect(retry(fn, { maxAttempts: 3 })).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should respect delay between retries', async () => {
      vi.useFakeTimers();
      
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValueOnce('success');
      
      const promise = retry(fn, { maxAttempts: 3, initialDelayMs: 100 });
      
      // Advance timers to trigger retry
      await vi.advanceTimersByTimeAsync(100);
      
      const result = await promise;
      
      vi.useRealTimers();
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should call onRetry callback', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValueOnce('success');
      const onRetry = vi.fn();
      
      const result = await retry(fn, { maxAttempts: 3, onRetry });
      
      expect(result).toBe('success');
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });
  });
});
