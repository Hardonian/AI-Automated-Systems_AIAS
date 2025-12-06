# API Rate Limits

Rate limits are enforced to ensure fair usage and system stability.

## Plan Limits

| Plan | Requests/Hour | Requests/Day | Monthly Automations |
|------|---------------|--------------|---------------------|
| Free | 100 | 1,000 | 100 |
| Starter | 1,000 | 10,000 | 10,000 |
| Pro | 5,000 | 50,000 | 50,000 |

## Rate Limit Headers

All API responses include rate limit headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Rate Limit Exceeded

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600
}
```

The `retryAfter` field indicates seconds to wait before retrying.

## Best Practices

1. **Cache Responses:** Cache API responses when possible
2. **Batch Requests:** Combine multiple operations when possible
3. **Exponential Backoff:** Implement exponential backoff for retries
4. **Monitor Headers:** Check rate limit headers to avoid hitting limits

## Example: Handling Rate Limits

```javascript
async function makeRequest(url, options = {}) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const data = await response.json();
    const retryAfter = data.retryAfter || 60;
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    
    // Retry request
    return makeRequest(url, options);
  }
  
  return response;
}
```

---

**Next:** [Error Codes](./errors.md)
