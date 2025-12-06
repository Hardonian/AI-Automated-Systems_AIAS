# API Examples

Practical examples for common API operations.

## Authentication

### Get Access Token

```bash
curl -X POST https://aias-platform.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "your-password"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refresh-token-here",
  "expires_in": 3600
}
```

## Workflows

### List All Workflows

```bash
curl -X GET https://aias-platform.com/api/v1/workflows \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Workflow from Template

```bash
curl -X POST https://aias-platform.com/api/v1/workflows \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shopify Order Notification",
    "template_id": "shopify-order-notification",
    "config": {
      "shop": "yourstore.myshopify.com",
      "channel": "#orders"
    },
    "enabled": true
  }'
```

### Execute Workflow

```bash
curl -X POST https://aias-platform.com/api/workflows/execute \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "workflow-uuid",
    "trigger": {
      "type": "manual"
    }
  }'
```

## Integrations

### Connect Shopify

```bash
# Step 1: Get OAuth URL
curl -X GET "https://aias-platform.com/api/integrations/shopify/oauth?shop=yourstore.myshopify.com" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Step 2: User authorizes in browser, gets code
# Step 3: Exchange code for token
curl -X POST https://aias-platform.com/api/integrations/shopify \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "oauth-code-from-shopify",
    "shop": "yourstore.myshopify.com"
  }'
```

### List Integrations

```bash
curl -X GET https://aias-platform.com/api/integrations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Analytics

### Get Usage Stats

```bash
curl -X GET https://aias-platform.com/api/analytics/usage \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Workflow Performance

```bash
curl -X GET https://aias-platform.com/api/analytics/workflows \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## JavaScript Examples

### Using Fetch API

```javascript
const API_BASE = 'https://aias-platform.com/api';
const ACCESS_TOKEN = 'your-access-token';

// List workflows
async function listWorkflows() {
  const response = await fetch(`${API_BASE}/v1/workflows`, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch workflows');
  }
  
  const data = await response.json();
  return data.workflows;
}

// Create workflow
async function createWorkflow(workflowData) {
  const response = await fetch(`${API_BASE}/v1/workflows`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create workflow');
  }
  
  return await response.json();
}

// Execute workflow
async function executeWorkflow(workflowId) {
  const response = await fetch(`${API_BASE}/workflows/execute`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflowId,
      trigger: { type: 'manual' },
    }),
  });
  
  return await response.json();
}
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aias-platform.com/api',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
  },
});

// List workflows
const workflows = await api.get('/v1/workflows');

// Create workflow
const newWorkflow = await api.post('/v1/workflows', {
  name: 'My Workflow',
  steps: [ ... ],
});

// Execute workflow
const execution = await api.post('/workflows/execute', {
  workflowId: 'uuid',
  trigger: { type: 'manual' },
});
```

## Python Examples

```python
import requests

API_BASE = 'https://aias-platform.com/api'
ACCESS_TOKEN = 'your-access-token'

headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'Content-Type': 'application/json',
}

# List workflows
response = requests.get(f'{API_BASE}/v1/workflows', headers=headers)
workflows = response.json()['workflows']

# Create workflow
workflow_data = {
    'name': 'My Workflow',
    'steps': [ ... ],
}
response = requests.post(
    f'{API_BASE}/v1/workflows',
    headers=headers,
    json=workflow_data
)
workflow = response.json()['workflow']

# Execute workflow
execution_data = {
    'workflowId': 'uuid',
    'trigger': {'type': 'manual'},
}
response = requests.post(
    f'{API_BASE}/workflows/execute',
    headers=headers,
    json=execution_data
)
execution = response.json()['execution']
```

## Error Handling

```javascript
async function safeApiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      // Handle specific errors
      switch (error.code) {
        case 'UNAUTHORIZED':
          // Refresh token or re-authenticate
          throw new Error('Please log in again');
        case 'RATE_LIMIT_EXCEEDED':
          // Wait and retry
          await delay(error.retryAfter * 1000);
          return safeApiCall(url, options);
        case 'INTEGRATION_NOT_CONNECTED':
          throw new Error('Please connect the required integration');
        default:
          throw new Error(error.error || 'API request failed');
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

---

**See Also:**
- [API Overview](./overview.md)
- [Authentication](./authentication.md)
- [Endpoints Reference](./endpoints.md)
- [Rate Limits](./rate-limits.md)
- [Error Codes](./errors.md)
