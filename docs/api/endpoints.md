# API Endpoints Reference

Complete reference for all API endpoints.

## Workflows

### List Workflows

```http
GET /api/v1/workflows
```

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `paused`, `archived`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "workflows": [
    {
      "id": "uuid",
      "name": "Order Processing",
      "description": "Process Shopify orders",
      "status": "active",
      "enabled": true,
      "created_at": "2025-01-31T00:00:00Z",
      "updated_at": "2025-01-31T00:00:00Z"
    }
  ]
}
```

### Get Workflow

```http
GET /api/v1/workflows/{workflowId}
```

**Response:**
```json
{
  "workflow": {
    "id": "uuid",
    "name": "Order Processing",
    "description": "Process Shopify orders",
    "status": "active",
    "enabled": true,
    "steps": [ ... ],
    "config": { ... },
    "created_at": "2025-01-31T00:00:00Z",
    "updated_at": "2025-01-31T00:00:00Z"
  }
}
```

### Create Workflow

```http
POST /api/v1/workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "description": "Workflow description",
  "steps": [
    {
      "id": "step-1",
      "type": "trigger",
      "config": { ... }
    }
  ],
  "enabled": true
}
```

**Response:**
```json
{
  "workflow": {
    "id": "uuid",
    "name": "My Workflow",
    ...
  }
}
```

### Update Workflow

```http
PATCH /api/v1/workflows/{workflowId}
Content-Type: application/json

{
  "name": "Updated Name",
  "enabled": false
}
```

### Delete Workflow

```http
DELETE /api/v1/workflows/{workflowId}
```

### Execute Workflow

```http
POST /api/workflows/execute
Content-Type: application/json

{
  "workflowId": "uuid",
  "trigger": {
    "type": "manual",
    "config": {}
  }
}
```

**Response:**
```json
{
  "execution": {
    "id": "exec-uuid",
    "workflowId": "uuid",
    "status": "completed",
    "startedAt": "2025-01-31T00:00:00Z",
    "completedAt": "2025-01-31T00:00:01Z",
    "results": { ... }
  }
}
```

## Agents

### List Agents

```http
GET /api/v1/agents
```

**Response:**
```json
{
  "agents": [
    {
      "id": "uuid",
      "name": "Customer Support Agent",
      "type": "chatbot",
      "enabled": true,
      "created_at": "2025-01-31T00:00:00Z"
    }
  ]
}
```

### Create Agent

```http
POST /api/v1/agents
Content-Type: application/json

{
  "name": "My Agent",
  "type": "automation",
  "config": { ... },
  "enabled": true
}
```

## Integrations

### List Integrations

```http
GET /api/integrations
```

**Response:**
```json
{
  "integrations": [
    {
      "id": "uuid",
      "provider": "shopify",
      "status": "connected",
      "connected_at": "2025-01-31T00:00:00Z"
    }
  ]
}
```

### Connect Integration

```http
POST /api/integrations/{provider}
Content-Type: application/json

{
  "code": "oauth-code",
  "shop": "yourstore.myshopify.com" // For Shopify
}
```

### Disconnect Integration

```http
DELETE /api/integrations/{provider}
```

## Analytics

### Get Usage

```http
GET /api/analytics/usage
```

**Response:**
```json
{
  "plan": "starter",
  "month": "2025-01",
  "limit": 10000,
  "used": 500,
  "remaining": 9500
}
```

### Get Workflow Stats

```http
GET /api/analytics/workflows
```

**Response:**
```json
{
  "total": 10,
  "active": 8,
  "completed": 150,
  "failed": 5,
  "successRate": 96.8
}
```

### Get Time Saved

```http
GET /api/analytics/time-saved
```

**Response:**
```json
{
  "hours": 12.5,
  "value": 625.00,
  "hourlyRate": 50,
  "executions": 150
}
```

### Get Execution History

```http
GET /api/analytics/execution-history
```

**Response:**
```json
[
  {
    "date": "2025-01-31",
    "completed": 10,
    "failed": 1
  }
]
```

## Workflow Templates

### List Templates

```http
GET /api/workflows/templates
```

**Query Parameters:**
- `category` (optional): Filter by category
- `integration` (optional): Filter by required integration

**Response:**
```json
{
  "templates": [
    {
      "id": "shopify-order-notification",
      "name": "Shopify Order Notification",
      "description": "Send notification when order is placed",
      "category": "ecommerce",
      "requiredIntegrations": ["shopify", "slack"],
      "estimatedTimeMinutes": 5,
      "difficulty": "easy"
    }
  ]
}
```

### Get Template

```http
GET /api/workflows/templates/{templateId}
```

---

**Next:** [Rate Limits](./rate-limits.md) | [Error Codes](./errors.md)
