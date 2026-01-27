# Security

The AIAS Platform implements multi-layer security to protect user data and ensure tenant isolation.

## Security Architecture

### Edge Layer (Middleware)

- **Rate Limiting**: Redis-backed rate limiting per tenant
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Request Validation**: Size limits, IP restrictions
- **Tenant Isolation**: Validates tenant access before request processing

### Application Layer

- **Input Validation**: Zod schemas for all API inputs
- **Output Sanitization**: XSS and SQL injection protection
- **Authentication**: Supabase Auth (JWT tokens)
- **Authorization**: Role-based access control (RBAC)
- **Error Handling**: Sanitized error messages (no sensitive data)

### Database Layer

- **Row-Level Security (RLS)**: Tenant isolation at database level
- **Encrypted Connections**: TLS/SSL for all database connections
- **Audit Logging**: Comprehensive audit trails
- **Parameterized Queries**: SQL injection prevention

## Multi-Tenant Isolation

Tenant isolation is enforced at multiple layers:

1. **Middleware**: Validates tenant access
2. **RLS Policies**: Database-level filtering by `tenant_id`
3. **Cache Keys**: Prefixed with `tenant_id`
4. **Audit Logs**: Include `tenant_id` for traceability

### Tenant Identification

Tenants are identified via:
- Header: `x-tenant-id`
- Subdomain: `{tenant}.example.com` (if configured)
- Query parameter: `?tenantId={id}` (API routes only)

## Authentication & Authorization

### Authentication

- **Method**: Supabase Auth (JWT-based)
- **Token Refresh**: Automatic token refresh handling
- **Session Management**: Secure cookie-based sessions

### Authorization

- **Role-Based Access Control (RBAC)**: User roles (admin, user, etc.)
- **Permission Checks**: Feature-level permissions
- **Tenant Access**: Users can only access their tenant's data

## Data Protection

### Encryption

- **In Transit**: TLS/SSL for all connections
- **At Rest**: Database encryption (managed by Supabase)
- **Secrets**: Environment variables (never committed)

### Data Residency

- **Canadian Data Centers**: Data stored in Canada
- **PIPEDA Compliance**: Canadian privacy law compliance
- **GDPR Compliance**: European privacy law compliance

## Input Validation

All user inputs are validated using Zod schemas:

```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});
```

## Output Sanitization

- **XSS Protection**: All user-generated content sanitized
- **SQL Injection Prevention**: Parameterized queries only
- **CSRF Protection**: Token-based CSRF protection

## Rate Limiting

Rate limits are enforced per plan:

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/hour |
| Pro | 5,000 requests/hour |
| Enterprise | Unlimited |

Rate limit headers included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Security Headers

The platform sets these security headers:

- `Content-Security-Policy`: Restricts resource loading
- `Strict-Transport-Security`: Forces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Referrer-Policy`: Controls referrer information

## Audit Logging

All security-relevant events are logged:

- Authentication attempts
- Authorization failures
- API access (with tenant_id)
- Data access patterns
- Configuration changes

## Security Best Practices

1. **Never expose service role keys** to client
2. **Always validate input** with Zod schemas
3. **Use RLS policies** for data access
4. **Implement rate limiting** on all API routes
5. **Sanitize all user input**
6. **Use HTTPS everywhere**
7. **Rotate secrets regularly**
8. **Monitor for security events**
9. **Keep dependencies updated**
10. **Follow principle of least privilege**

## Vulnerability Reporting

**Do not** open public issues for security vulnerabilities.

Report security issues to: **scottrmhardie@gmail.com**

We will:
- Acknowledge receipt within 48 hours
- Work with you to resolve the issue
- Credit you for responsible disclosure (with your permission)

## Compliance

- **PIPEDA**: Canadian privacy law compliance
- **GDPR**: European privacy law compliance
- **SOC 2 Type II**: In progress

## Security Monitoring

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: OpenTelemetry support
- **Health Checks**: `/api/healthz` endpoint
- **Audit Logs**: Comprehensive audit trail

---

For implementation details, see:
- Security utilities: `lib/security/`
- Middleware: `middleware.ts`
- RLS policies: `supabase/migrations/`
