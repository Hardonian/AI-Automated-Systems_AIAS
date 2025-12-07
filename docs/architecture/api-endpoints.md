# API Endpoints Documentation

**Last Updated:** 2025-01-XX

## Authentication

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```typescript
{
  email: string;
  password: string;
  name: string;
  company?: string;
  acceptTerms: boolean;
}
```

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}
```

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```typescript
{
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}
```

## Workflows

### GET /api/workflows
List all workflows for the authenticated user.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `enabled`: boolean (optional)

**Response:**
```typescript
{
  workflows: Workflow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### POST /api/workflows
Create a new workflow.

**Request Body:** (See `createWorkflowSchema` in `/lib/api/schemas.ts`)

**Response:**
```typescript
{
  workflow: Workflow;
}
```

### POST /api/workflows/execute
Execute a workflow.

**Request Body:**
```typescript
{
  workflowId: string;
  input?: Record<string, unknown>;
  async?: boolean;
}
```

**Response:**
```typescript
{
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: unknown;
}
```

## AI Agents

### GET /api/agents
List all agents.

**Response:**
```typescript
{
  agents: Agent[];
}
```

### POST /api/agents
Create a new agent.

**Request Body:** (See `createAgentSchema` in `/lib/api/schemas.ts`)

**Response:**
```typescript
{
  agent: Agent;
}
```

### POST /api/agents/chat
Chat with an agent.

**Request Body:** (See `chatRequestSchema` in `/lib/api/schemas.ts`)

**Response:**
```typescript
{
  message: {
    role: 'assistant';
    content: string;
  };
}
```

## Analytics

### GET /api/analytics/usage
Get usage analytics.

**Query Parameters:**
- `start`: ISO datetime string
- `end`: ISO datetime string
- `groupBy`: string[] (optional)

**Response:**
```typescript
{
  metrics: {
    workflows: number;
    executions: number;
    apiCalls: number;
  };
  timeSeries: Array<{
    date: string;
    value: number;
  }>;
}
```

## Billing

### GET /api/billing/subscription-status
Get current subscription status.

**Response:**
```typescript
{
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}
```

### POST /api/billing/upgrade
Upgrade subscription.

**Request Body:**
```typescript
{
  plan: 'pro' | 'enterprise';
  successUrl: string;
  cancelUrl: string;
}
```

**Response:**
```typescript
{
  checkoutUrl: string;
}
```

## Rate Limits

All API endpoints are rate-limited:
- **Strict:** 10 requests/minute (auth endpoints)
- **Moderate:** 60 requests/minute (standard endpoints)
- **Lenient:** 100 requests/minute (read-only endpoints)
- **API:** 1000 requests/minute (high-volume endpoints)

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until retry allowed (if limited)

## Error Responses

All errors follow this format:

```typescript
{
  error: string;
  message?: string;
  details?: unknown;
  statusCode: number;
}
```

Common status codes:
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

---

**Document Owner:** API Team  
**Review Frequency:** Monthly  
**Next Review:** 2025-02-XX
