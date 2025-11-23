/**
 * Cache Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { cacheService } from '@/lib/performance/cache';

describe('CacheService', () => {
  beforeEach(async () => {
    await cacheService.clear();
  });

  it('should set and get cached value', async () => {
    await cacheService.set('test-key', { data: 'test-value' });
    const result = await cacheService.get('test-key');
    expect(result).toEqual({ data: 'test-value' });
  });

  it('should return null for non-existent key', async () => {
    const result = await cacheService.get('non-existent');
    expect(result).toBeNull();
  });

  it('should expire cached value after TTL', async () => {
    await cacheService.set('test-key', 'value', { ttl: 1 }); // 1 second TTL
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    const result = await cacheService.get('test-key');
    expect(result).toBeNull();
  });

  it('should support tenant-aware caching', async () => {
    await cacheService.set('key', 'value1', { tenantId: 'tenant1' });
    await cacheService.set('key', 'value2', { tenantId: 'tenant2' });
    
    const result1 = await cacheService.get('key', { tenantId: 'tenant1' });
    const result2 = await cacheService.get('key', { tenantId: 'tenant2' });
    
    expect(result1).toBe('value1');
    expect(result2).toBe('value2');
  });

  it('should invalidate by tag', async () => {
    await cacheService.set('key1', 'value1', { tags: ['tag1'] });
    await cacheService.set('key2', 'value2', { tags: ['tag2'] });
    await cacheService.set('key3', 'value3', { tags: ['tag1'] });
    
    await cacheService.invalidateByTag('tag1');
    
    expect(await cacheService.get('key1')).toBeNull();
    expect(await cacheService.get('key2')).toBe('value2');
    expect(await cacheService.get('key3')).toBeNull();
  });

  it('should get cache stats', () => {
    const stats = cacheService.getStats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('maxSize');
    expect(stats).toHaveProperty('provider');
  });
});
