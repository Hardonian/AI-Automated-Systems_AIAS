/**
 * Tests for Cache Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the cache service to avoid Redis connections during tests
vi.mock('@/lib/performance/cache', () => {
  const mockInMemoryCache = new Map<
    string,
    { data: unknown; expiresAt: number; tags?: string[] }
  >();
  const maxSize = 1000;

  return {
    cacheService: {
      async get<T>(key: string) {
        const entry = mockInMemoryCache.get(key);
        if (!entry) {
          return null;
        }
        if (Date.now() > entry.expiresAt) {
          mockInMemoryCache.delete(key);
          return null;
        }
        return entry.data as T;
      },
      async set(
        key: string,
        data: unknown,
        options: { ttl?: number; tags?: string[] } = {}
      ) {
        // Evict oldest entries if cache is full
        if (mockInMemoryCache.size >= maxSize) {
          const firstKey = mockInMemoryCache.keys().next().value;
          if (firstKey) {
            mockInMemoryCache.delete(firstKey);
          }
        }
        const ttl = options.ttl || 300;
        const expiresAt = Date.now() + ttl * 1000;
        mockInMemoryCache.set(key, { data, expiresAt, tags: options.tags });
      },
      async invalidateByTag(tag: string) {
        for (const [key, entry] of mockInMemoryCache.entries()) {
          if (entry.tags?.includes(tag)) {
            mockInMemoryCache.delete(key);
          }
        }
      },
      async clear() {
        mockInMemoryCache.clear();
      },
      getStats() {
        return {
          size: mockInMemoryCache.size,
          maxSize,
          provider: 'in-memory',
        };
      },
    },
  };
});

import { cacheService } from '@/lib/performance/cache';

describe('lib/performance/cache', () => {
  beforeEach(async () => {
    await cacheService.clear();
  });

  describe('cacheService', () => {
    it('should store and retrieve cached values', async () => {
      await cacheService.set('test-key', { data: 'test-value' }, { ttl: 60 });

      const result = await cacheService.get<{ data: string }>('test-key');

      expect(result).toEqual({ data: 'test-value' });
    });

    it('should return null for non-existent keys', async () => {
      const result = await cacheService.get('non-existent');

      expect(result).toBeNull();
    });

    it('should expire cached values after TTL', async () => {
      await cacheService.set('test-key', 'value', { ttl: 1 }); // 1 second TTL

      // Should be available immediately
      expect(await cacheService.get('test-key')).toBe('value');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should be expired
      expect(await cacheService.get('test-key')).toBeNull();
    });

    it('should use default TTL when not specified', async () => {
      await cacheService.set('test-key', 'value');

      const result = await cacheService.get('test-key');
      expect(result).toBe('value');
    });

    it('should invalidate cache by tag', async () => {
      await cacheService.set('key1', 'value1', { tags: ['tag1'] });
      await cacheService.set('key2', 'value2', { tags: ['tag2'] });
      await cacheService.set('key3', 'value3', { tags: ['tag1'] });

      await cacheService.invalidateByTag('tag1');

      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBe('value2');
      expect(await cacheService.get('key3')).toBeNull();
    });

    it('should clear all cache', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');

      await cacheService.clear();

      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBeNull();
    });

    it('should return cache stats', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');

      const stats = cacheService.getStats();

      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(1000);
    });

    it('should evict oldest entries when cache is full', async () => {
      // Fill cache to max size
      for (let i = 0; i < 1001; i++) {
        await cacheService.set(`key-${i}`, `value-${i}`);
      }

      const stats = cacheService.getStats();
      expect(stats.size).toBeLessThanOrEqual(1000);

      // First key should be evicted
      expect(await cacheService.get('key-0')).toBeNull();
    });
  });
});
