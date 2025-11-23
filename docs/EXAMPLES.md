# Code Examples

This document provides practical code examples for common patterns and use cases in the AIAS Platform.

## Table of Contents

- [API Route Handlers](#api-route-handlers)
- [Error Handling](#error-handling)
- [Circuit Breaker Usage](#circuit-breaker-usage)
- [Caching](#caching)
- [Rate Limiting](#rate-limiting)
- [Logging](#logging)
- [Database Queries](#database-queries)

## API Route Handlers

### Basic GET Handler

```typescript
import { createGETHandler } from '@/lib/api/route-handler';
import { NextResponse } from 'next/server';

export const GET = createGETHandler(
  async (context) => {
    // Your logic here
    return NextResponse.json({ data: 'example' });
  },
  {
    requireAuth: true,
    cache: {
      enabled: true,
      ttl: 300, // 5 minutes
    },
  }
);
```

### POST Handler with Validation

```typescript
import { createPOSTHandler } from '@/lib/api/route-handler';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const POST = createPOSTHandler(
  async (context) => {
    const body = await context.request.json();
    const validated = requestSchema.parse(body);
    
    // Process validated data
    return NextResponse.json({ success: true });
  },
  {
    requireAuth: true,
    validateBody: requestSchema,
    maxBodySize: 1024 * 1024, // 1MB
  }
);
```

## Error Handling

### Throwing Errors

```typescript
import { ValidationError, NotFoundError, SystemError } from '@/lib/errors';

// Validation error
if (!email) {
  throw new ValidationError('Email is required');
}

// Not found error
const user = await getUser(id);
if (!user) {
  throw new NotFoundError('User', id);
}

// System error
try {
  await externalService.call();
} catch (error) {
  throw new SystemError('External service failed', error);
}
```

### Handling Errors in Routes

```typescript
import { formatError } from '@/lib/errors';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Your logic
  } catch (error) {
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}
```

## Circuit Breaker Usage

### Basic Usage

```typescript
import { withCircuitBreaker } from '@/lib/resilience/circuit-breaker';

const result = await withCircuitBreaker(
  'external-service',
  async () => {
    return await fetch('https://api.example.com/data');
  },
  async () => {
    // Fallback response
    return { data: 'fallback' };
  }
);
```

### With OpenAI Client

```typescript
import { callOpenAI } from '@/lib/external-services/openai-client';

const response = await callOpenAI(
  {
    messages: [
      { role: 'user', content: 'Hello' }
    ],
  },
  process.env.OPENAI_API_KEY!
);
```

## Caching

### Basic Caching

```typescript
import { cacheService } from '@/lib/performance/cache';

// Set cache
await cacheService.set('key', { data: 'value' }, {
  ttl: 300, // 5 minutes
  tags: ['user-data'],
});

// Get cache
const cached = await cacheService.get('key');
```

### Tenant-Aware Caching

```typescript
// Set with tenant
await cacheService.set('key', data, {
  tenantId: 'tenant-123',
  ttl: 600,
});

// Get with tenant
const data = await cacheService.get('key', {
  tenantId: 'tenant-123',
});
```

### Cache Invalidation

```typescript
// Invalidate by tag
await cacheService.invalidateByTag('user-data');

// Clear all cache
await cacheService.clear();
```

## Rate Limiting

### Using Rate Limiter

```typescript
import { rateLimiter } from '@/lib/performance/rate-limiter';

const result = await rateLimiter.checkRateLimit(
  '/api/endpoint',
  'user-id-or-ip',
  {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
  }
);

if (!result.allowed) {
  throw new RateLimitError('Too many requests', result.resetTime);
}
```

## Logging

### Structured Logging

```typescript
import { logger } from '@/lib/logging/structured-logger';

// Info log
logger.info('User logged in', {
  userId: user.id,
  timestamp: new Date().toISOString(),
});

// Error log
logger.error('Operation failed', error, {
  context: 'user-operation',
  userId: user.id,
});

// Warning log
logger.warn('Rate limit approaching', {
  current: 90,
  limit: 100,
});
```

### Error Tracking

```typescript
import { trackError } from '@/lib/monitoring/enhanced-error-tracker';

try {
  // Your code
} catch (error) {
  const errorId = trackError(error, {
    userId: user.id,
    url: request.url,
    method: request.method,
  }, 'high');
  
  // Log error ID for reference
  logger.error('Error tracked', error, { errorId });
}
```

## Database Queries

### Supabase Query with Error Handling

```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { NotFoundError, SystemError } from '@/lib/errors';

const supabase = createClient(env.supabase.url, env.supabase.anonKey);

async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new SystemError('Database query failed', error);
  }

  if (!data) {
    throw new NotFoundError('User', id);
  }

  return data;
}
```

### Multi-Tenant Query

```typescript
async function getTenantData(tenantId: string, userId: string) {
  const { data, error } = await supabase
    .from('tenant_data')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId);

  if (error) {
    throw new SystemError('Database query failed', error);
  }

  return data;
}
```

## Complete Example: API Route

```typescript
import { createGETHandler } from '@/lib/api/route-handler';
import { cacheService } from '@/lib/performance/cache';
import { logger } from '@/lib/logging/structured-logger';
import { NotFoundError, SystemError } from '@/lib/errors';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export const GET = createGETHandler(
  async (context) => {
    const { userId, tenantId } = context;
    
    if (!userId) {
      throw new AuthenticationError('Authentication required');
    }

    // Check cache first
    const cacheKey = `user-data:${userId}`;
    const cached = await cacheService.get(cacheKey, { tenantId });
    
    if (cached) {
      logger.info('Cache hit', { userId, cacheKey });
      return NextResponse.json(cached);
    }

    // Fetch from database
    const supabase = createClient(env.supabase.url, env.supabase.anonKey);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('Database query failed', error, { userId });
      throw new SystemError('Failed to fetch user data', error);
    }

    if (!data) {
      throw new NotFoundError('User', userId);
    }

    // Cache the result
    await cacheService.set(cacheKey, data, {
      ttl: 300,
      tenantId,
      tags: ['user-data'],
    });

    logger.info('User data fetched', { userId });
    return NextResponse.json(data);
  },
  {
    requireAuth: true,
    requireTenant: true,
    cache: {
      enabled: true,
      ttl: 300,
    },
  }
);
```

## Best Practices

1. **Always use error classes** - Don't throw generic Error objects
2. **Cache expensive operations** - Database queries, external API calls
3. **Use circuit breakers** - For external service calls
4. **Log with context** - Include userId, requestId, etc.
5. **Validate input** - Use Zod schemas
6. **Handle errors gracefully** - Provide fallbacks where possible
7. **Use tenant-aware caching** - For multi-tenant applications
8. **Track errors** - Use error tracker for production debugging

For more examples, see the test files in the `tests/` directory.
