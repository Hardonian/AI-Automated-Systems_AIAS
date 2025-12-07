# Redis/Vercel KV Setup Guide for Rate Limiting

## Overview

The application now supports distributed rate limiting using either Redis or Vercel KV. This is **required for production** as in-memory rate limiting doesn't work across serverless instances.

## Option 1: Vercel KV (Recommended for Vercel Deployments)

### Setup Steps

1. **Create Vercel KV Database:**
   - Go to Vercel Dashboard → Storage → Create Database
   - Select "KV" (Key-Value)
   - Choose a name for your database

2. **Get Credentials:**
   - After creation, go to Settings → Environment Variables
   - Copy `KV_REST_API_URL` and `KV_REST_API_TOKEN`

3. **Set Environment Variables:**
   ```bash
   KV_REST_API_URL=https://your-store.kv.vercel-storage.com
   KV_REST_API_TOKEN=your-token-here
   ```

4. **Deploy:**
   - Variables are automatically available in Vercel deployments
   - No code changes needed

### Advantages
- ✅ Native Vercel integration
- ✅ No additional infrastructure
- ✅ Automatic scaling
- ✅ Free tier available

---

## Option 2: Redis (Recommended for Self-Hosted)

### Setup Steps

1. **Choose Redis Provider:**
   - **Upstash** (Serverless Redis) - Recommended for serverless
   - **Redis Cloud** - Managed Redis
   - **AWS ElastiCache** - For AWS deployments
   - **Self-hosted** - For on-premise deployments

2. **Get Connection String:**
   - Format: `redis://username:password@host:port` or `rediss://` for SSL
   - Example: `redis://default:password@redis.example.com:6379`

3. **Set Environment Variable:**
   ```bash
   REDIS_URL=redis://default:password@redis.example.com:6379
   ```

4. **For Production (SSL):**
   ```bash
   REDIS_URL=rediss://default:password@redis.example.com:6380
   ```

### Recommended: Upstash (Serverless Redis)

1. **Sign up:** https://upstash.com
2. **Create Redis Database:**
   - Choose region closest to your deployment
   - Select "Regional" for better performance
3. **Copy REST API URL:**
   - Go to Database → Details
   - Copy "REST API" URL
4. **Set Environment Variable:**
   ```bash
   REDIS_URL=https://your-db.upstash.io
   ```

### Advantages
- ✅ Works with any hosting provider
- ✅ More control over configuration
- ✅ Can use existing Redis infrastructure

---

## Verification

### Check Rate Limiting Status

The rate limiter automatically detects which backend to use:

1. **Check Logs:**
   - Look for: `[RateLimiter] Using Redis for distributed rate limiting`
   - Or: `[RateLimiter] Using Vercel KV for distributed rate limiting`
   - Or: `[RateLimiter] Using in-memory rate limiting` (fallback)

2. **Test Rate Limiting:**
   ```bash
   # Make requests to an API endpoint
   curl http://localhost:3000/api/healthz
   
   # Check response headers
   # Should see: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
   ```

3. **Monitor:**
   - Check Redis/KV dashboard for keys
   - Keys format: `rate_limit:/api/path:identifier`
   - Keys auto-expire after window duration

---

## Troubleshooting

### Rate Limiting Not Working

**Issue:** Still using in-memory fallback

**Solutions:**
1. Verify environment variables are set:
   ```bash
   echo $REDIS_URL
   echo $KV_REST_API_URL
   ```
2. Check variable names (case-sensitive)
3. Restart application after setting variables
4. Check logs for connection errors

### Connection Errors

**Issue:** `Redis connection failed`

**Solutions:**
1. Verify Redis URL is correct
2. Check firewall/network access
3. For Upstash, ensure using REST API URL (not Redis URL)
4. Check SSL/TLS settings

### Vercel KV Errors

**Issue:** `Vercel KV error`

**Solutions:**
1. Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
2. Check token has correct permissions
3. Verify KV database exists in Vercel dashboard
4. Check region matches deployment region

---

## Performance Considerations

### Redis Connection Pooling

The rate limiter uses ioredis with:
- Automatic reconnection
- Connection pooling
- Retry strategy

### Rate Limit Key Format

Keys are formatted as: `rate_limit:{pathname}:{identifier}`

Example: `rate_limit:/api/auth:user-123`

This ensures:
- Per-endpoint limits
- Per-user/IP limits
- Automatic expiration

### Memory Usage

- Each rate limit entry: ~100 bytes
- TTL: Automatically expires after window
- No manual cleanup needed

---

## Migration from In-Memory

If you're currently using in-memory rate limiting:

1. **Set up Redis/KV** (follow steps above)
2. **Set environment variables**
3. **Deploy** - No code changes needed
4. **Verify** - Check logs for backend detection
5. **Monitor** - Watch for rate limit hits

The migration is **zero-downtime** - the rate limiter automatically uses Redis/KV when available, falls back to in-memory if not.

---

## Cost Estimates

### Vercel KV
- **Free Tier:** 30,000 reads/day, 30,000 writes/day
- **Pro:** $0.20 per 100K reads, $0.20 per 100K writes
- **Typical Usage:** ~1M requests/month = ~$2-4/month

### Upstash Redis
- **Free Tier:** 10K commands/day
- **Pay-as-you-go:** $0.20 per 100K commands
- **Typical Usage:** ~1M requests/month = ~$2/month

### Self-Hosted Redis
- **Cost:** Infrastructure only
- **Maintenance:** Requires DevOps resources

---

## Security Notes

1. **Never commit credentials** to git
2. **Use environment variables** for all secrets
3. **Rotate tokens** regularly
4. **Use SSL/TLS** for production Redis connections
5. **Restrict access** to Redis/KV from only your application

---

## Support

For issues or questions:
- Check application logs for rate limiter messages
- Verify environment variables are set correctly
- Test Redis/KV connection independently
- Review rate limit configuration in `middleware.ts`
