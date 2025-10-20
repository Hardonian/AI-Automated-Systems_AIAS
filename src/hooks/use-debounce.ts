import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for throttling values
 * @param value - Value to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastRan, setLastRan] = useState<number>(Date.now());

  useEffect(() => {
    if (Date.now() - lastRan >= limit) {
      setThrottledValue(value);
      setLastRan(Date.now());
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        setLastRan(Date.now());
      }, limit - (Date.now() - lastRan));

      return () => clearTimeout(timer);
    }
  }, [value, limit, lastRan]);

  return throttledValue;
}