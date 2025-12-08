/**
 * Enhanced Rate Limiting
 * Per-user, per-endpoint rate limiting with Redis backing
 */

import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number; // Seconds until retry allowed
}

/**
 * In-memory rate limiter (fallback when Redis unavailable)
 */
class MemoryRateLimiter {
  private store: Map<string, { count: number; reset: number }> = new Map();

  async check(
    key: string,
    windowMs: number,
    maxRequests: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.reset) {
      // New window or expired
      const reset = now + windowMs;
      this.store.set(key, { count: 1, reset });
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: new Date(reset),
      };
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.reset - now) / 1000);
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        reset: new Date(entry.reset),
        retryAfter,
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - entry.count,
      reset: new Date(entry.reset),
    };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}

/**
 * Redis-backed rate limiter (production)
 */
class RedisRateLimiter {
  private redis: any; // ioredis instance

  constructor(redis: any) {
    this.redis = redis;
  }

  async check(
    key: string,
    windowMs: number,
    maxRequests: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowKey = `rate_limit:${key}`;
    const reset = now + windowMs;

    try {
      // Use Redis sliding window log
      const pipeline = this.redis.pipeline();
      pipeline.zremrangebyscore(windowKey, 0, now - windowMs);
      pipeline.zcard(windowKey);
      pipeline.zadd(windowKey, now, `${now}-${Math.random()}`);
      pipeline.expire(windowKey, Math.ceil(windowMs / 1000));
      const results = await pipeline.exec();

      const count = results?.[1]?.[1] as number || 0;

      if (count >= maxRequests) {
        const oldest = await this.redis.zrange(windowKey, 0, 0, 'WITHSCORES');
        const oldestTime = oldest?.[1] ? parseInt(oldest[1]) : now;
        const retryAfter = Math.ceil((oldestTime + windowMs - now) / 1000);

        return {
          allowed: false,
          limit: maxRequests,
          remaining: 0,
          reset: new Date(oldestTime + windowMs),
          retryAfter,
        };
      }

      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - count - 1,
        reset: new Date(reset),
      };
    } catch (error) {
      // Fallback to memory limiter on Redis error
      console.error('Redis rate limiter error:', error);
      const memoryLimiter = new MemoryRateLimiter();
      return memoryLimiter.check(key, windowMs, maxRequests);
    }
  }

  async reset(key: string): Promise<void> {
    await this.redis.del(`rate_limit:${key}`);
  }
}

// Singleton instances
let redisLimiter: RedisRateLimiter | null = null;
const memoryLimiter = new MemoryRateLimiter();

/**
 * Get rate limiter instance
 */
async function getRateLimiter(): Promise<MemoryRateLimiter | RedisRateLimiter> {
  if (redisLimiter) return redisLimiter;

  try {
    const Redis = (await import('ioredis')).default;
    const redis = new Redis(process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL);
    redisLimiter = new RedisRateLimiter(redis);
    return redisLimiter;
  } catch {
    return memoryLimiter;
  }
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const {
    windowMs = 60000, // 1 minute default
    maxRequests = 100,
    keyGenerator = (req) => {
      // Default: IP address + path
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const path = req.nextUrl.pathname;
      return `${ip}:${path}`;
    },
  } = config;

  const key = keyGenerator(request);
  const limiter = await getRateLimiter();

  return limiter.check(key, windowMs, maxRequests);
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.reset.getTime() / 1000).toString(),
    ...(result.retryAfter && {
      'Retry-After': result.retryAfter.toString(),
    }),
  };
}

/**
 * Predefined rate limit configs
 */
export const rateLimitConfigs = {
  strict: {
    windowMs: 60000, // 1 minute
    maxRequests: 10,
  },
  moderate: {
    windowMs: 60000, // 1 minute
    maxRequests: 60,
  },
  lenient: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
  },
  api: {
    windowMs: 60000, // 1 minute
    maxRequests: 1000,
  },
  auth: {
    windowMs: 900000, // 15 minutes
    maxRequests: 5, // Stricter for auth endpoints
  },
};
