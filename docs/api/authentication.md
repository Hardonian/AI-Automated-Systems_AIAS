# API Authentication

All API requests require authentication. This guide explains how to authenticate your requests.

## Getting Your Access Token

### From Web Application

1. Log in to AIAS Platform
2. Go to **Settings** → **API**
3. Click **Generate API Token**
4. Copy the token (it's only shown once)

### From API

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "your-password"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Using Your Token

### Bearer Token (Recommended)

Include the token in the `Authorization` header:

```http
GET /api/v1/workflows
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Example with cURL

```bash
curl -X GET https://aias-platform.com/api/v1/workflows \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example with JavaScript

```javascript
const response = await fetch('https://aias-platform.com/api/v1/workflows', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```

## Token Expiration

Access tokens expire after 1 hour. Refresh tokens are valid for 30 days.

### Refreshing Your Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "YOUR_REFRESH_TOKEN"
}
```

## API Keys (Coming Soon)

For server-to-server integrations, API keys will be available. They don't expire and can be revoked.

---

**Next:** [Endpoints Reference](./endpoints.md)
