import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorTracker } from '@/lib/monitoring/error-tracker';

describe('Error Tracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should capture exceptions', () => {
    const error = new Error('Test error');
    const context = { userId: 'test-user' };

    expect(() => {
      errorTracker.captureException(error, context);
    }).not.toThrow();
  });

  it('should capture messages', () => {
    expect(() => {
      errorTracker.captureMessage('Test message', 'error');
    }).not.toThrow();
  });

  it('should set user context', () => {
    expect(() => {
      errorTracker.setUser('test-user');
    }).not.toThrow();
  });
});
