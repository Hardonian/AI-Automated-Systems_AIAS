# API Error Codes

Complete reference for all API error codes and how to handle them.

## HTTP Status Codes

| Status | Meaning | Description |
|--------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Error Response Format

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

## Error Codes

### Authentication Errors

#### `UNAUTHORIZED`
**Status:** 401

Invalid or missing authentication token.

**Solution:**
- Check your access token is valid
- Ensure token is included in `Authorization` header
- Refresh your token if expired

#### `TOKEN_EXPIRED`
**Status:** 401

Access token has expired.

**Solution:**
- Refresh your token using `/api/auth/refresh`
- Get a new token by logging in again

### Validation Errors

#### `VALIDATION_ERROR`
**Status:** 400

Request data is invalid.

**Response:**
```json
{
  "error": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": "Name is required",
    "steps": "At least one step is required"
  }
}
```

**Solution:**
- Check the `details` object for specific field errors
- Fix validation errors and retry

### Resource Errors

#### `NOT_FOUND`
**Status:** 404

Requested resource doesn't exist.

**Solution:**
- Verify the resource ID is correct
- Check if resource was deleted
- Ensure you have access to the resource

#### `FORBIDDEN`
**Status:** 403

You don't have permission to access this resource.

**Solution:**
- Check your plan includes this feature
- Verify you own the resource
- Contact support if you believe this is an error

### Rate Limiting

#### `RATE_LIMIT_EXCEEDED`
**Status:** 429

You've exceeded your rate limit.

**Response:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600
}
```

**Solution:**
- Wait for the reset time (check `X-RateLimit-Reset` header)
- Upgrade your plan for higher limits
- Implement request caching

### Integration Errors

#### `INTEGRATION_NOT_CONNECTED`
**Status:** 400

Required integration is not connected.

**Solution:**
- Connect the integration in Settings → Integrations
- Verify integration status is "connected"
- Reconnect if integration was disconnected

#### `INTEGRATION_ERROR`
**Status:** 500

External integration API error.

**Solution:**
- Check integration status
- Verify integration credentials are valid
- Retry after a short delay
- Contact support if issue persists

### Workflow Errors

#### `WORKFLOW_NOT_FOUND`
**Status:** 404

Workflow doesn't exist or you don't have access.

**Solution:**
- Verify workflow ID is correct
- Check workflow wasn't deleted
- Ensure you own the workflow

#### `WORKFLOW_DISABLED`
**Status:** 400

Workflow is disabled and cannot be executed.

**Solution:**
- Enable the workflow in Settings
- Check workflow status

#### `WORKFLOW_EXECUTION_FAILED`
**Status:** 500

Workflow execution failed.

**Response:**
```json
{
  "error": "Workflow execution failed",
  "code": "WORKFLOW_EXECUTION_FAILED",
  "details": {
    "stepId": "step-1",
    "error": "Integration not connected"
  }
}
```

**Solution:**
- Check execution logs for details
- Fix the error (e.g., connect integration)
- Retry workflow execution

### Usage Errors

#### `USAGE_LIMIT_EXCEEDED`
**Status:** 429

Monthly automation limit reached.

**Response:**
```json
{
  "error": "Monthly automation limit reached",
  "code": "USAGE_LIMIT_EXCEEDED",
  "details": {
    "plan": "starter",
    "limit": 10000,
    "used": 10000,
    "remaining": 0
  }
}
```

**Solution:**
- Upgrade your plan for higher limits
- Wait until next month (limits reset monthly)
- Archive unused workflows to reduce usage

## Error Handling Best Practices

### 1. Always Check Status Code

```javascript
const response = await fetch(url);
if (!response.ok) {
  const error = await response.json();
  // Handle error
}
```

### 2. Implement Retry Logic

```javascript
async function requestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      // Retry on server errors (5xx) or rate limits
      if (i < maxRetries - 1) {
        await delay(Math.pow(2, i) * 1000); // Exponential backoff
        continue;
      }
      
      throw new Error(`Server error: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
}
```

### 3. Handle Specific Error Codes

```javascript
const error = await response.json();

switch (error.code) {
  case 'UNAUTHORIZED':
    // Refresh token or re-authenticate
    break;
  case 'RATE_LIMIT_EXCEEDED':
    // Wait and retry
    break;
  case 'INTEGRATION_NOT_CONNECTED':
    // Prompt user to connect integration
    break;
  default:
    // Show generic error
}
```

---

**Next:** [Examples](./examples.md)
