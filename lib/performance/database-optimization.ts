/**
 * Database Query Optimization
 * Utilities for optimizing database queries and preventing N+1 problems
 */

import { logger } from '@/lib/utils/logger';

/**
 * Batch database queries to prevent N+1 problems
 */
export async function batchQueries<T, R>(
  items: T[],
  batchSize: number,
  queryFn: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    try {
      const batchResults = await queryFn(batch);
      results.push(...batchResults);
    } catch (error) {
      logger.error('Batch query failed', error instanceof Error ? error : new Error(String(error)), {
        batchIndex: i,
        batchSize: batch.length,
      });
      throw error;
    }
  }
  
  return results;
}

/**
 * Cache query results with TTL
 */
interface CachedQuery<T> {
  data: T;
  expiresAt: number;
}

const queryCache = new Map<string, CachedQuery<unknown>>();

export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 60000 // Default 1 minute
): Promise<T> {
  const cached = queryCache.get(key);
  const now = Date.now();
  
  if (cached && now < cached.expiresAt) {
    return cached.data as T;
  }
  
  const data = await queryFn();
  queryCache.set(key, {
    data,
    expiresAt: now + ttl,
  });
  
  return data;
}

/**
 * Clear query cache
 */
export function clearQueryCache(pattern?: string): void {
  if (pattern) {
    for (const key of queryCache.keys()) {
      if (key.includes(pattern)) {
        queryCache.delete(key);
      }
    }
  } else {
    queryCache.clear();
  }
}

/**
 * Clean up expired cache entries
 */
export function cleanupQueryCache(): void {
  const now = Date.now();
  for (const [key, cached] of queryCache.entries()) {
    if (now >= cached.expiresAt) {
      queryCache.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupQueryCache, 5 * 60 * 1000);
}

/**
 * Optimize Supabase query with select only needed fields
 */
export function optimizeSelect(fields: string[]): string {
  return fields.join(', ');
}

/**
 * Add pagination to queries
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

export function getPaginationRange(options: PaginationOptions): { from: number; to: number } {
  const { page, limit } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}
