# Architecture Documentation

## Overview

AIAS Platform is a modern, enterprise-grade AI automation platform built with Next.js 15, TypeScript 5.9, and Supabase. The platform provides multi-tenant architecture, AI agent capabilities, workflow automation, and comprehensive security features.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                  │
│  Next.js App (React 18) • PWA • Service Worker              │
└───────────────────────┬─────────────────────────────────────┘
                         │ HTTPS
┌───────────────────────▼─────────────────────────────────────┐
│                      Edge Layer                              │
│  Vercel Edge • Middleware (Security, Rate Limit, Tenant)    │
└───────────────────────┬─────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────▼────────┐            ┌─────────▼─────────┐
│   API Routes    │            │  Supabase Edge     │
│  (Next.js API) │            │  Functions         │
│                │            │                    │
│  - Route       │            │  - Chat API        │
│    Handlers    │            │  - Analytics       │
│  - Validation  │            │  - Workflows       │
│  - Auth        │            │  - Billing         │
└────────┬────────┘            └─────────┬──────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                  Supabase Backend                            │
│  PostgreSQL • Auth • Storage • Realtime • RLS               │
│                                                               │
│  - Multi-tenant isolation                                    │
│  - Row-level security policies                                │
│  - Real-time subscriptions                                   │
│  - Edge functions                                             │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│              External Services                                │
│  OpenAI • Stripe • Redis • Monitoring (Sentry/OTEL)           │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### Frontend Layer

**Technology Stack:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5.9
- Tailwind CSS
- Radix UI Components
- Framer Motion

**Key Features:**
- Server Components for optimal performance
- Client Components for interactivity
- Middleware for security and routing
- PWA support with service workers

### API Layer

**Route Handlers:**
- Located in `app/api/`
- 43+ API endpoints
- Unified route handler utilities
- Built-in security, validation, and error handling

**Key Utilities:**
- `createRouteHandler()` - Secure route handler factory
- `createGETHandler()` - GET request handler with caching
- `createPOSTHandler()` - POST request handler
- Input validation with Zod
- Automatic error formatting
- Rate limiting integration

### Backend Layer

**Supabase:**
- PostgreSQL database
- Authentication (JWT-based)
- Row-Level Security (RLS) for multi-tenant isolation
- Real-time subscriptions
- Storage buckets
- Edge Functions (Deno runtime)

**Database Schema:**
- Multi-tenant tables with `tenant_id` columns
- RLS policies for tenant isolation
- Audit logging tables
- Workflow execution tables
- AI agent configuration tables

### Security Architecture

**Multi-Layer Security:**

1. **Edge Security (Middleware)**
   - Rate limiting (Redis/Vercel KV)
   - Tenant isolation validation
   - Security headers (CSP, HSTS, etc.)
   - Request size limits
   - IP-based restrictions

2. **Application Security**
   - Input validation (Zod schemas)
   - Output sanitization
   - SQL injection prevention (parameterized queries)
   - XSS protection
   - CSRF protection

3. **Database Security**
   - Row-Level Security (RLS) policies
   - Tenant isolation at database level
   - Audit logging
   - Encrypted connections

4. **Authentication & Authorization**
   - Supabase Auth (JWT tokens)
   - Role-based access control (RBAC)
   - Permission checks
   - Token refresh handling

## Data Flow

### Request Flow

1. **Client Request** → Browser sends HTTP request
2. **Edge Middleware** → Security checks, rate limiting, tenant validation
3. **API Route Handler** → Request validation, authentication, authorization
4. **Business Logic** → Core application logic
5. **Database Query** → Supabase client with RLS enforcement
6. **Response** → Formatted JSON response with security headers

### Multi-Tenant Isolation

**Tenant Identification:**
- Header: `x-tenant-id`
- Subdomain: `{tenant}.example.com`
- Query parameter: `?tenantId={id}` (API routes only)

**Isolation Layers:**
1. Middleware validates tenant access
2. RLS policies filter data by tenant_id
3. Cache keys prefixed with tenant_id
4. Audit logs include tenant_id

## Caching Strategy

**Multi-Tier Caching:**

1. **Edge Cache (Vercel)**
   - Static assets
   - Public API responses
   - CDN distribution

2. **Application Cache (Redis/Vercel KV)**
   - API response caching
   - User session data
   - Rate limit counters
   - Tag-based invalidation

3. **In-Memory Cache (Fallback)**
   - Development only
   - Not suitable for production
   - Resets on cold starts

## Error Handling

**Error Taxonomy:**
- `ValidationError` (400) - Input validation failures
- `AuthenticationError` (401) - Auth failures
- `AuthorizationError` (403) - Permission denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource conflicts
- `RateLimitError` (429) - Rate limit exceeded
- `SystemError` (500) - Internal errors
- `NetworkError` (503) - External service failures

**Error Flow:**
1. Error thrown with appropriate error class
2. `formatError()` formats for API response
3. Structured logger records error
4. Telemetry tracks error metrics
5. User receives sanitized error message

## Logging & Observability

**Structured Logging:**
- JSON-formatted logs
- Contextual information (userId, requestId, etc.)
- Log levels: debug, info, warn, error, fatal
- Production telemetry integration

**Monitoring:**
- Health check endpoints (`/api/healthz`)
- Performance metrics tracking
- Error tracking (Sentry integration)
- OpenTelemetry support

## Performance Optimizations

**Frontend:**
- Server Components for reduced client bundle
- Code splitting and lazy loading
- Image optimization (Next.js Image)
- Bundle analysis and tree-shaking

**Backend:**
- Database query optimization
- Connection pooling
- Response caching
- Edge runtime for low latency

**Infrastructure:**
- Vercel Edge Network
- CDN for static assets
- Redis for distributed caching
- Database indexes

## Deployment Architecture

**Environments:**
- Development (local)
- Preview (Vercel preview deployments)
- Staging (optional)
- Production

**CI/CD Pipeline:**
- GitHub Actions for testing
- Automated deployments via Vercel
- Database migrations via Supabase CLI
- Environment variable management

## Scalability Considerations

**Horizontal Scaling:**
- Stateless API routes
- Distributed caching (Redis/KV)
- Database connection pooling
- Edge function distribution

**Vertical Scaling:**
- Database query optimization
- Caching strategies
- CDN utilization
- Resource monitoring

## Security Best Practices

1. **Never expose service role keys to client**
2. **Always validate input with Zod schemas**
3. **Use RLS policies for data access**
4. **Implement rate limiting on all API routes**
5. **Sanitize all user input**
6. **Use HTTPS everywhere**
7. **Rotate secrets regularly**
8. **Monitor for security events**
9. **Keep dependencies updated**
10. **Follow principle of least privilege**

## Development Workflow

1. **Local Development**
   - `pnpm dev` - Start dev server
   - `.env.local` - Local environment variables
   - Supabase local development (optional)

2. **Testing**
   - Unit tests (Vitest)
   - Integration tests
   - E2E tests (Playwright)
   - Type checking (TypeScript)

3. **Code Quality**
   - ESLint for linting
   - Prettier for formatting
   - Pre-commit hooks (Husky)
   - Type checking

4. **Deployment**
   - Push to GitHub
   - CI runs tests
   - Vercel deploys preview/production
   - Database migrations run automatically

## Future Architecture Considerations

**Potential Enhancements:**
- Microservices for specific features
- Message queue for async processing
- GraphQL API layer
- Advanced caching strategies
- Multi-region deployment
- Kubernetes for self-hosted deployments

## Glossary

- **RLS**: Row-Level Security - Database-level access control
- **Edge Runtime**: Serverless runtime at the edge
- **Tenant**: A customer organization with isolated data
- **Rate Limiting**: Protection against API abuse
- **CSP**: Content Security Policy - Browser security feature
- **JWT**: JSON Web Token - Authentication token format

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
