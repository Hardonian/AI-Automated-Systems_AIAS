/**
 * Redis-Backed Rate Limiting Utility
 *
 * Provides distributed rate limiting for API routes using Redis.
 * This is suitable for production deployments with multiple serverless instances.
 * Falls back to in-memory rate limiting if Redis is unavailable.
 */

import { logger } from '../logging/structured-logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

class RedisRateLimiter {
  private redis: any | null = null;
  private localStore: RateLimitStore = {};
  private useRedis: boolean = false;
  private redisKeyPrefix: string = 'ratelimit:';

  constructor() {
    this.initializeRedis();
  }

  /**
   * Initialize Redis connection if available
   */
  private async initializeRedis(): Promise<void> {
    try {
      // Only initialize in Node.js runtime (not Edge)
      if (typeof process !== 'undefined' && process.env.REDIS_URL) {
        const { default: Redis } = await import('ioredis');
        this.redis = new Redis(process.env.REDIS_URL, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            if (times > 3) {
              logger.warn(
                'Redis connection failed, falling back to in-memory rate limiting'
              );
              return null; // Stop retrying
            }
            return Math.min(times * 100, 3000);
          },
        });

        this.redis.on('error', (err: Error) => {
          logger.error('Redis error', err);
          this.useRedis = false;
        });

        this.redis.on('connect', () => {
          logger.info('Redis connected for distributed rate limiting');
          this.useRedis = true;
        });

        // Test connection
        await this.redis.ping();
        this.useRedis = true;
      }
    } catch (error) {
      logger.warn('Failed to initialize Redis for rate limiting', {
        error: error instanceof Error ? error.message : String(error),
      });
      this.useRedis = false;
    }
  }

  /**
   * Check if a request should be rate limited
   * Uses Redis if available, falls back to in-memory store
   */
  async check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const resetTime = now + windowMs;

    if (this.useRedis && this.redis) {
      return this.checkRedis(identifier, maxRequests, windowMs, now, resetTime);
    }

    return this.checkLocal(identifier, maxRequests, windowMs, now, resetTime);
  }

  /**
   * Check rate limit using Redis
   * Uses Redis sorted sets for atomic operations
   */
  private async checkRedis(
    identifier: string,
    maxRequests: number,
    windowMs: number,
    now: number,
    resetTime: number
  ): Promise<RateLimitResult> {
    const key = `${this.redisKeyPrefix}${identifier}`;
    const windowStart = now - windowMs;

    try {
      // Remove old entries outside the current window
      await this.redis.zremrangebyscore(key, 0, windowStart);

      // Count current entries in the window
      const currentCount = await this.redis.zcard(key);

      if (currentCount >= maxRequests) {
        // Get the oldest entry to calculate reset time
        const oldestEntries = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
        const oldestTimestamp =
          oldestEntries.length > 1 ? parseInt(oldestEntries[1]) : now;
        const calculatedResetTime = oldestTimestamp + windowMs;

        return {
          allowed: false,
          remaining: 0,
          resetTime: calculatedResetTime,
        };
      }

      // Add current request timestamp
      await this.redis.zadd(key, now, `${now}-${Math.random()}`);

      // Set expiry on the key to auto-cleanup
      await this.redis.pexpire(key, windowMs);

      return {
        allowed: true,
        remaining: maxRequests - currentCount - 1,
        resetTime,
      };
    } catch (error) {
      logger.error(
        'Redis rate limit check failed, falling back to local',
        error instanceof Error ? error : new Error(String(error)),
        { identifier }
      );

      // Fallback to local store on Redis error
      this.useRedis = false;
      return this.checkLocal(identifier, maxRequests, windowMs, now, resetTime);
    }
  }

  /**
   * Check rate limit using in-memory store
   * Used as fallback when Redis is unavailable
   */
  private checkLocal(
    identifier: string,
    maxRequests: number,
    windowMs: number,
    now: number,
    resetTime: number
  ): RateLimitResult {
    const entry = this.localStore[identifier];

    // If no entry or expired, create new entry
    if (!entry || now > entry.resetTime) {
      this.localStore[identifier] = {
        count: 1,
        resetTime,
      };
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime,
      };
    }

    // If limit exceeded
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for an identifier
   */
  async reset(identifier: string): Promise<void> {
    if (this.useRedis && this.redis) {
      try {
        await this.redis.del(`${this.redisKeyPrefix}${identifier}`);
      } catch (error) {
        logger.error(
          'Failed to reset Redis rate limit',
          error instanceof Error ? error : new Error(String(error)),
          { identifier }
        );
      }
    }

    delete this.localStore[identifier];
  }

  /**
   * Get current count for an identifier
   */
  async getCount(
    identifier: string,
    windowMs: number = 60000
  ): Promise<number> {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (this.useRedis && this.redis) {
      try {
        const key = `${this.redisKeyPrefix}${identifier}`;
        await this.redis.zremrangebyscore(key, 0, windowStart);
        return await this.redis.zcard(key);
      } catch (error) {
        logger.error(
          'Failed to get count from Redis',
          error instanceof Error ? error : new Error(String(error)),
          { identifier }
        );
      }
    }

    const entry = this.localStore[identifier];
    if (!entry || now > entry.resetTime) {
      return 0;
    }
    return entry.count;
  }

  /**
   * Check if Redis is available
   */
  isRedisAvailable(): boolean {
    return this.useRedis;
  }
}

// Singleton instance
export const redisRateLimiter = new RedisRateLimiter();

/**
 * Rate limit middleware using Redis (with in-memory fallback)
 *
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const ip = request.headers.get('x-forwarded-for') || 'unknown';
 *   const limit = await rateLimitDistributed(ip, 10, 60000); // 10 requests per minute
 *
 *   if (!limit.allowed) {
 *     return new Response('Too Many Requests', { status: 429 });
 *   }
 *
 *   // ... your handler
 * }
 * ```
 */
export async function rateLimitDistributed(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  return redisRateLimiter.check(identifier, maxRequests, windowMs);
}

// Re-export getClientIP for convenience
export { getClientIP } from './rate-limit';
