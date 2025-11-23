# Rate Limiting Redis Migration Guide

## Current State

The middleware (`middleware.ts`) currently uses an in-memory `Map` for rate limiting:

```typescript
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
```

## Problem

In-memory rate limiting is **not production-ready** for serverless environments because:
1. Rate limits reset on cold starts
2. Multiple instances don't share state
3. Memory can grow unbounded
4. No persistence across deployments

## Solution: Redis-Based Rate Limiting

### Option 1: Vercel KV (Recommended for Vercel Deployments)

Vercel KV is a Redis-compatible key-value store that works seamlessly with Vercel Edge Functions.

**Setup:**
1. Create a Vercel KV database in your Vercel dashboard
2. Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to environment variables
3. Update middleware to use Vercel KV

**Implementation:**
```typescript
import { kv } from '@vercel/kv';

async function checkRateLimit(
  pathname: string,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const config = rateLimitConfig[pathname as keyof typeof rateLimitConfig] || rateLimitConfig.default;
  const key = `rate_limit:${pathname}:${identifier}`;
  const now = Date.now();
  
  try {
    // Get current count
    const current = await kv.get<{ count: number; resetTime: number }>(key);
    
    if (!current || current.resetTime < now) {
      // New window
      const resetTime = now + config.windowMs;
      await kv.setex(key, Math.ceil(config.windowMs / 1000), {
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
    const newCount = current.count + 1;
    if (newCount > config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }
    
    await kv.setex(key, Math.ceil((current.resetTime - now) / 1000), {
      count: newCount,
      resetTime: current.resetTime,
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - newCount,
      resetTime: current.resetTime,
    };
  } catch (error) {
    // Fail open if Redis is unavailable
    console.error('Rate limit check failed:', error);
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
    };
  }
}
```

### Option 2: Redis (ioredis) for Self-Hosted

If you're self-hosting or using a different platform:

**Setup:**
1. Set up Redis instance (AWS ElastiCache, Redis Cloud, etc.)
2. Add `REDIS_URL` to environment variables
3. Update middleware to use ioredis

**Implementation:**
```typescript
import Redis from 'ioredis';

const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : null;

async function checkRateLimit(
  pathname: string,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const config = rateLimitConfig[pathname as keyof typeof rateLimitConfig] || rateLimitConfig.default;
  const key = `rate_limit:${pathname}:${identifier}`;
  const now = Date.now();
  
  if (!redis) {
    // Fallback to in-memory if Redis unavailable
    return checkRateLimitInMemory(pathname, identifier);
  }
  
  try {
    // Use Redis INCR with TTL
    const count = await redis.incr(key);
    
    if (count === 1) {
      // First request in window, set TTL
      await redis.expire(key, Math.ceil(config.windowMs / 1000));
    }
    
    const ttl = await redis.ttl(key);
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
    // Fail open if Redis is unavailable
    console.error('Rate limit check failed:', error);
    return checkRateLimitInMemory(pathname, identifier);
  }
}
```

## Migration Steps

1. **Choose your solution** (Vercel KV or Redis)
2. **Set up infrastructure** (create KV database or Redis instance)
3. **Add environment variables** to `.env.example` and deployment
4. **Update middleware.ts** with new implementation
5. **Test thoroughly** in staging environment
6. **Monitor** rate limiting metrics after deployment

## Fallback Strategy

Always implement a fallback to in-memory rate limiting if Redis/KV is unavailable. This ensures the application continues to function even if the rate limiting service is down.

## Monitoring

After migration, monitor:
- Rate limit hit rates
- Redis/KV connection errors
- Response times for rate limit checks
- Memory usage (should decrease)

## Environment Variables

Add to `.env.example`:

```bash
# Vercel KV (Option 1)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# OR Redis (Option 2)
REDIS_URL=redis://localhost:6379
```

## Testing

Test rate limiting:
1. Make requests up to the limit
2. Verify 429 responses when exceeded
3. Verify reset after window expires
4. Test fallback when Redis/KV unavailable

## Estimated Effort

- **Setup:** 1-2 hours
- **Implementation:** 2-3 hours
- **Testing:** 1-2 hours
- **Total:** 4-7 hours

## Priority

**HIGH** - This is a production readiness issue and should be addressed before scaling.
