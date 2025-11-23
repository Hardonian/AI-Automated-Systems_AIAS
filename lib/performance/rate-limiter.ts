/**
 * Distributed Rate Limiting Service
 * Supports Redis (ioredis) and Vercel KV with in-memory fallback
 */

import Redis from 'ioredis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

class RateLimiter {
  private redis: Redis | null = null;
  private inMemoryStore: Map<string, { count: number; resetTime: number }> = new Map();
  private useRedis: boolean = false;
  private useVercelKV: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Try Redis first
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          enableReadyCheck: true,
          lazyConnect: true,
        });

        await this.redis.connect();
        this.useRedis = true;
        console.log('[RateLimiter] Using Redis for distributed rate limiting');
        return;
      } catch (error) {
        console.warn('[RateLimiter] Redis connection failed, falling back to in-memory:', error);
        this.redis = null;
      }
    }

    // Try Vercel KV if available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      this.useVercelKV = true;
      console.log('[RateLimiter] Using Vercel KV for distributed rate limiting');
      return;
    }

    // Fallback to in-memory
    console.warn('[RateLimiter] Using in-memory rate limiting (not suitable for production)');
  }

  /**
   * Check rate limit using Redis
   */
  private async checkRateLimitRedis(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }

    const now = Date.now();
    const windowSeconds = Math.ceil(config.windowMs / 1000);

    try {
      // Use Redis INCR with TTL
      const count = await this.redis.incr(key);
      
      if (count === 1) {
        // First request in window, set TTL
        await this.redis.expire(key, windowSeconds);
      }

      const ttl = await this.redis.ttl(key);
      const resetTime = now + (ttl * 1000);

      if (count > config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime,
        };
      }

      return {
        allowed: true,
        remaining: config.maxRequests - count,
        resetTime,
      };
    } catch (error) {
      console.error('[RateLimiter] Redis error:', error);
      throw error;
    }
  }

  /**
   * Check rate limit using Vercel KV
   */
  private async checkRateLimitVercelKV(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      throw new Error('Vercel KV not configured');
    }

    const now = Date.now();
    const windowSeconds = Math.ceil(config.windowMs / 1000);

    try {
      // Get current count
      const getResponse = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
      });

      let count = 1;
      if (getResponse.ok) {
        const data = await getResponse.json();
        const entry = data.result ? JSON.parse(data.result) : null;
        
        if (entry && entry.resetTime > now) {
          count = entry.count + 1;
        }
      }

      // Set count with TTL
      const resetTime = now + config.windowMs;
      await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: JSON.stringify({ count, resetTime }),
          expiration: windowSeconds,
        }),
      });

      if (count > config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime,
        };
      }

      return {
        allowed: true,
        remaining: config.maxRequests - count,
        resetTime,
      };
    } catch (error) {
      console.error('[RateLimiter] Vercel KV error:', error);
      throw error;
    }
  }

  /**
   * Check rate limit using in-memory store (fallback)
   */
  private checkRateLimitInMemory(
    key: string,
    config: RateLimitConfig
  ): RateLimitResult {
    const now = Date.now();
    const entry = this.inMemoryStore.get(key);

    // Cleanup expired entries
    if (entry && entry.resetTime < now) {
      this.inMemoryStore.delete(key);
    }

    const currentEntry = this.inMemoryStore.get(key);

    if (!currentEntry) {
      // New window
      const resetTime = now + config.windowMs;
      this.inMemoryStore.set(key, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
      };
    }

    // Increment count
    currentEntry.count++;
    this.inMemoryStore.set(key, currentEntry);

    if (currentEntry.count > config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentEntry.resetTime,
      };
    }

    return {
      allowed: true,
      remaining: config.maxRequests - currentEntry.count,
      resetTime: currentEntry.resetTime,
    };
  }

  /**
   * Check rate limit (tries Redis/KV first, falls back to in-memory)
   */
  async checkRateLimit(
    pathname: string,
    identifier: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `rate_limit:${pathname}:${identifier}`;

    // Try Redis first
    if (this.useRedis && this.redis) {
      try {
        return await this.checkRateLimitRedis(key, config);
      } catch (error) {
        console.warn('[RateLimiter] Redis failed, falling back to in-memory:', error);
        // Fall through to in-memory
      }
    }

    // Try Vercel KV
    if (this.useVercelKV) {
      try {
        return await this.checkRateLimitVercelKV(key, config);
      } catch (error) {
        console.warn('[RateLimiter] Vercel KV failed, falling back to in-memory:', error);
        // Fall through to in-memory
      }
    }

    // Fallback to in-memory
    return this.checkRateLimitInMemory(key, config);
  }

  /**
   * Cleanup in-memory store (for testing)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.inMemoryStore.entries()) {
      if (value.resetTime < now) {
        this.inMemoryStore.delete(key);
      }
    }
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.useRedis = false;
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();
