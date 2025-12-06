# API Overview

AIAS Platform provides a RESTful API for programmatic access to workflows, agents, and automation features.

## Base URL

- **Production:** `https://aias-platform.com/api`
- **Development:** `http://localhost:3000/api`

## Authentication

All API requests require authentication using one of the following methods:

### Method 1: Bearer Token (Recommended)

Include your access token in the `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Method 2: Cookie (Browser)

If making requests from the browser, authentication cookies are automatically included.

## Rate Limits

Rate limits are enforced per plan:

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/hour |
| Starter | 1,000 requests/hour |
| Pro | 5,000 requests/hour |

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Response Format

All responses are JSON. Successful responses return a `200` status code.

### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

## Pagination

List endpoints support pagination:

```http
GET /api/v1/workflows?page=1&limit=20
```

Response includes pagination metadata:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Versioning

API versioning is done via URL path:

- `/api/v1/` - Current stable version
- `/api/v2/` - Future version (when available)

## SDKs

Official SDKs are coming soon. For now, use direct HTTP requests.

---

**Next:** [Authentication Guide](./authentication.md)
