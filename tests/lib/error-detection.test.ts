/**
 * Tests for Error Detection Utility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { errorDetector, recordError } from '@/lib/utils/error-detection';

describe('lib/utils/error-detection', () => {
  beforeEach(() => {
    // Reset error detector before each test
    errorDetector.reset();
    vi.clearAllMocks();
  });

  describe('recordError', () => {
    it('should record errors', () => {
      const error = new Error('Test error');
      recordError(error, { context: 'test' });
      
      const recentErrors = errorDetector.getRecentErrors(5);
      expect(recentErrors.length).toBeGreaterThan(0);
      expect(recentErrors[0].error.message).toBe('Test error');
    });

    it('should track error context', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      recordError(error, context);
      
      const recentErrors = errorDetector.getRecentErrors(5);
      expect(recentErrors[0].context).toEqual(context);
    });
  });

  describe('errorDetector', () => {
    it('should get recent errors', () => {
      recordError(new Error('Error 1'));
      recordError(new Error('Error 2'));
      
      const recentErrors = errorDetector.getRecentErrors(5);
      expect(recentErrors.length).toBe(2);
    });

    it('should get recent alerts when threshold exceeded', () => {
      // Record enough errors to trigger alert (default threshold is 10)
      for (let i = 0; i < 11; i++) {
        recordError(new Error(`Error ${i}`));
      }
      
      const alerts = errorDetector.getRecentAlerts(1);
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should reset error tracking', () => {
      recordError(new Error('Test error'));
      expect(errorDetector.getRecentErrors(5).length).toBe(1);
      
      errorDetector.reset();
      expect(errorDetector.getRecentErrors(5).length).toBe(0);
    });
  });
});
