# Security Documentation

**Last Updated:** 2025-01-27

## Overview

This document describes the security measures implemented in the AIAS Platform, including authentication, authorization, data protection, and security headers.

## Security Architecture

### Multi-Layer Security

1. **Edge Layer (Vercel Edge Middleware)**
   - Security headers
   - Rate limiting
   - Suspicious activity detection
   - Admin guard checks

2. **API Layer (Next.js API Routes)**
   - Input validation (Zod schemas)
   - Authentication checks
   - Tenant isolation
   - Request size limits
   - Timeout handling

3. **Database Layer (Supabase RLS)**
   - Row-Level Security policies
   - Tenant isolation at DB level
   - Service role key never exposed to client

## Authentication

### Supabase Auth

- **Provider:** Supabase Auth (JWT-based)
- **Session Management:** HTTP-only cookies
- **Token Expiry:** Configurable (default: 1 hour)
- **Refresh Tokens:** Automatic refresh on expiry

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. JWT token stored in HTTP-only cookie
3. Middleware validates token
4. API routes extract user ID from token
5. Tenant context derived from user's organization memberships

### Protected Routes

Routes are protected via:
- Middleware checks (`middleware.ts`)
- Route handler `requireAuth` option
- Server component auth checks

## Authorization

### Role-Based Access Control (RBAC)

Roles:
- **ADMIN:** Full access to organization
- **EDITOR:** Can create/edit resources
- **VIEWER:** Read-only access

### Tenant Isolation

- Users can only access data from organizations they belong to
- Enforced at multiple layers:
  - Middleware validates tenant access
  - RLS policies filter data by tenant_id
  - Application code validates tenant context

## Security Headers

All responses include the following security headers:

### Standard Headers

- **X-Content-Type-Options:** `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options:** `SAMEORIGIN` - Prevents clickjacking
- **X-XSS-Protection:** `1; mode=block` - XSS protection
- **Referrer-Policy:** `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy:** Restricts browser features (camera, microphone, geolocation)

### HSTS (HTTP Strict Transport Security)

- **Production Only:** Enabled in production
- **Max-Age:** 31536000 seconds (1 year)
- **Include Subdomains:** Yes
- **Preload:** Enabled

### Content Security Policy (CSP)

CSP is configured with the following directives:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
frame-src 'self' https://js.stripe.com;
```

**Note:** `unsafe-inline` and `unsafe-eval` are currently required for Next.js and some third-party libraries. Consider hardening CSP in future iterations.

## Rate Limiting

### Page Routes
- **Limit:** 200 requests per minute per IP
- **Enforcement:** Edge middleware

### API Routes
- **Limit:** Varies by endpoint
- **Login:** 5 attempts per 15 minutes per IP
- **Checkout:** 10 requests per minute per IP
- **Enforcement:** Route handler middleware

### Rate Limit Headers

All rate-limited responses include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)
- `Retry-After`: Seconds until retry allowed

## Input Validation

### Zod Schemas

All API inputs are validated using Zod schemas:
- Request body validation
- Query parameter validation
- Path parameter validation

### Sanitization

- HTML sanitization for user-generated content
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding

## Data Protection

### Encryption

- **In Transit:** TLS 1.2+ (enforced by Vercel)
- **At Rest:** Database encryption (managed by Supabase)

### Secrets Management

- **Environment Variables:** Never committed to git
- **Service Role Keys:** Only used server-side
- **API Keys:** Stored securely, never logged

### PII Protection

- No PII in logs
- Data masking in error messages
- Secure cookie configuration

## Webhook Security

### Stripe Webhooks

- **Signature Verification:** Required for all webhooks
- **Raw Body:** Required for signature verification (Node.js runtime)
- **Idempotency:** Prevents duplicate processing
- **Retry Logic:** Stripe retries failed webhooks

### Webhook Verification Flow

1. Receive webhook with `stripe-signature` header
2. Get raw body (required for verification)
3. Verify signature using webhook secret
4. Check idempotency key (prevent duplicates)
5. Process event
6. Record idempotency key

## CSRF Protection

### Implementation

- CSRF tokens required for state-changing methods (POST, PUT, PATCH, DELETE)
- Tokens validated against header or cookie
- SameSite cookie attribute prevents CSRF

### Cookie Security

- **HttpOnly:** Yes (prevents JavaScript access)
- **Secure:** Yes in production (HTTPS only)
- **SameSite:** `Lax` (CSRF protection)

## Database Security

### Row-Level Security (RLS)

All tables have RLS policies:
- Users can only access their own data
- Organization members can only access org data
- Admins have elevated permissions

### Service Role Key

- **Never exposed to client**
- **Only used server-side**
- **Required for admin operations**

## API Security

### Request Validation

- Request size limits (1MB default)
- Timeout handling (30s default)
- Resource limit checks

### Error Handling

- Generic error messages (don't reveal internals)
- Error logging (server-side only)
- No stack traces in production

## Monitoring & Logging

### Security Events Logged

- Failed authentication attempts
- Rate limit violations
- Suspicious activity
- Webhook verification failures
- Authorization failures

### Log Retention

- **Production:** 90 days
- **Development:** 7 days

## Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Use Zod schemas
3. **Sanitize outputs** - Prevent XSS
4. **Use parameterized queries** - Prevent SQL injection
5. **Check authorization** - Verify user permissions
6. **Log security events** - Monitor for attacks

### For Operations

1. **Regular security audits** - Run `scripts/security-audit.ts`
2. **Monitor logs** - Check for suspicious activity
3. **Update dependencies** - Keep packages up to date
4. **Review RLS policies** - Ensure proper isolation
5. **Test webhooks** - Verify signature verification

## Security Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] RLS policies verified
- [ ] Webhook secrets configured
- [ ] SSL/TLS enabled
- [ ] Error handling tested
- [ ] Input validation tested

### Post-Deployment

- [ ] Security headers verified (use securityheaders.com)
- [ ] Rate limiting working
- [ ] Authentication working
- [ ] Authorization working
- [ ] Webhooks receiving events
- [ ] Logs being collected
- [ ] Monitoring alerts configured

## Security Incident Response

### If Security Breach Detected

1. **Immediate Actions:**
   - Rotate all secrets (API keys, webhook secrets, etc.)
   - Review access logs
   - Check for data exfiltration
   - Notify affected users

2. **Investigation:**
   - Review security logs
   - Identify attack vector
   - Assess impact
   - Document findings

3. **Remediation:**
   - Patch vulnerability
   - Update security measures
   - Monitor for recurrence
   - Update documentation

## Compliance

### PIPEDA (Canadian Privacy Law)

- **Data Residency:** Canadian data centers
- **Data Retention:** As per privacy policy
- **User Rights:** Access, deletion, portability

### SOC 2 (Future)

- Security controls documented
- Access controls implemented
- Monitoring and logging in place

## Security Tools

### Automated Checks

- `scripts/security-audit.ts` - Security audit script
- `scripts/db-sanity-check.ts` - Data integrity checks
- `scripts/security-self-check.ts` - Security self-check

### Manual Reviews

- Code reviews for security issues
- Dependency audits
- Penetration testing (planned)

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do NOT** create a public issue
2. Email: security@aiautomatedsystems.ca
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Stripe Webhook Security](https://stripe.com/docs/webhooks/signatures)
