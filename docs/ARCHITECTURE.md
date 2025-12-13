# AIAS Platform Architecture

**Last Updated:** 2025-01-27  
**Version:** 1.1.0

## Overview

AIAS Platform is a multi-tenant SaaS application built with Next.js 15 (App Router), TypeScript, Supabase (PostgreSQL), and Stripe for billing. The platform provides workflow automation, custom AI agents, analytics, and integrations.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│              Next.js App Router + React 19                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Edge Layer (Vercel Edge)                    │
│         Middleware: Security, Rate Limiting, Auth            │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              API Layer (Next.js API Routes)                  │
│    Route Handlers: Validation, Auth, Business Logic         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌────▼──────┐
│   Supabase   │ │   Stripe   │ │  Resend   │
│  PostgreSQL  │ │  Payments   │ │   Email   │
│     Auth     │ │  Webhooks   │ │           │
│     RLS      │ │             │ │           │
└──────────────┘ └─────────────┘ └───────────┘
```

## Entry Points

### Frontend Routes (App Router)

**Public Routes:**
- `/` - Landing page
- `/signin` - User authentication
- `/signup` - User registration
- `/pricing` - Pricing page
- `/features` - Feature showcase
- `/about` - About page
- `/contact` - Contact form
- `/blog` - Blog listing
- `/blog/[slug]` - Blog post detail

**Protected Routes (Require Auth):**
- `/dashboard` - Main dashboard
- `/dashboard/analytics` - Analytics dashboard
- `/dashboard/revenue` - Revenue dashboard
- `/workflows` - Workflow management
- `/workflows/[id]` - Workflow detail/editor
- `/settings` - User settings
- `/billing` - Billing management
- `/billing/success` - Checkout success page
- `/integrations` - Integration management
- `/onboarding/*` - Onboarding flow

**Admin Routes (Require Admin Auth):**
- `/admin/*` - Admin dashboard and tools
- `/admin/metrics` - Business metrics
- `/admin/compliance` - Compliance dashboard
- `/admin/financial/*` - Financial reports

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login (Edge runtime)
- `POST /api/auth/signup` - User registration
- `GET /api/auth/admin/check` - Admin check

**Billing & Stripe:**
- `POST /api/stripe/create-checkout` - Create checkout session (deprecated, redirects)
- `POST /api/stripe/create-checkout-app` - Create checkout session (active)
- `PUT /api/stripe/webhook` - Stripe webhook handler (Node runtime)
- `GET /api/billing/subscription-status` - Get subscription status
- `POST /api/billing/upgrade` - Upgrade subscription
- `POST /api/billing/downgrade` - Downgrade subscription

**Workflows:**
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/[id]` - Get workflow
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow
- `POST /api/workflows/[id]/execute` - Execute workflow
- `GET /api/workflows/templates` - List templates
- `GET /api/workflows/templates/[id]` - Get template

**Agents:**
- `GET /api/agents` - List AI agents
- `POST /api/agents` - Create agent
- `POST /api/agents/[id]/execute` - Execute agent
- `POST /api/agent/suggest` - Get agent suggestions

**Analytics:**
- `GET /api/analytics/usage` - Usage analytics
- `GET /api/analytics/workflows` - Workflow analytics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/funnel` - Funnel analytics
- `GET /api/analytics/execution-history` - Execution history

**Integrations:**
- `GET /api/integrations/shopify` - Shopify integration
- `GET /api/integrations/wave` - Wave Accounting integration
- `POST /api/integrations/[provider]/oauth` - OAuth initiation
- `GET /api/integrations/[provider]/callback` - OAuth callback

**Health & Status:**
- `GET /api/health` - Basic health check
- `GET /api/health/enhanced` - Enhanced health check
- `GET /api/healthz` - Kubernetes-style health check
- `GET /api/status` - Status endpoint

**Telemetry:**
- `POST /api/telemetry/ingest` - Ingest telemetry data
- `GET /api/telemetry` - Get telemetry data

**Admin:**
- `GET /api/admin/metrics` - Admin metrics
- `GET /api/admin/metrics/kpis` - KPI metrics
- `GET /api/admin/metrics/business` - Business metrics
- `GET /api/admin/metrics/unit-economics` - Unit economics
- `GET /api/admin/compliance` - Compliance data

## Database Schema (Prisma)

### Core Models

**User:**
- `id` (String, CUID)
- `email` (String, unique)
- `name` (String, optional)
- `avatar` (String, optional)
- `supabaseId` (String, optional, unique)
- Relations: memberships, apiKeys, aiRuns, reports, projects

**Organization:**
- `id` (String, CUID)
- `name` (String)
- `slug` (String, unique)
- Relations: memberships, subscriptions, projects, sources, webhookEvents, featureFlags

**Membership:**
- Links User to Organization with Role (ADMIN, EDITOR, VIEWER)
- Unique constraint on (userId, orgId)

**Subscription:**
- `id` (String, CUID)
- `status` (SubscriptionStatus enum)
- `plan` (Plan enum: FREE, BASIC, PRO, ENTERPRISE)
- `stripeCustomerId` (String, optional, unique)
- `stripeSubscriptionId` (String, optional, unique)
- `stripePriceId` (String, optional)
- `currentPeriodStart` (DateTime, optional)
- `currentPeriodEnd` (DateTime, optional)
- `cancelAtPeriodEnd` (Boolean, default false)
- Belongs to Organization

**Project:**
- `id` (String, CUID)
- `name` (String)
- `status` (ProjectStatus: ACTIVE, ARCHIVED, COMPLETED)
- Belongs to User and Organization

**Source:**
- Data source configuration for ETL pipelines
- Types: SHOPIFY_JSON, GOOGLE_TRENDS_CSV, TIKTOK_BUSINESS_JSON, etc.
- Belongs to Organization

**Workflow:**
- Stored in Supabase (not Prisma schema)
- Managed via API routes

### Subscription Status States

- `ACTIVE` - Active subscription
- `CANCELED` - Canceled subscription
- `INCOMPLETE` - Payment incomplete
- `INCOMPLETE_EXPIRED` - Payment incomplete and expired
- `PAST_DUE` - Payment past due
- `TRIALING` - In trial period
- `UNPAID` - Unpaid

## External Dependencies

### Supabase
- **Purpose:** PostgreSQL database, authentication, storage, RLS
- **Configuration:** 
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Usage:** Database queries, user auth, file storage

### Stripe
- **Purpose:** Payment processing, subscription management
- **Configuration:**
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- **Usage:** Checkout sessions, webhook events, subscription management

### Resend
- **Purpose:** Email delivery
- **Configuration:** `RESEND_API_KEY`
- **Usage:** Transactional emails, email cadence

### OpenAI (Optional)
- **Purpose:** AI features
- **Configuration:** `OPENAI_API_KEY`
- **Usage:** AI agents, content generation

## Background Jobs

### Supabase Edge Functions

Located in `/supabase/functions/`:

- `agents-api` - Agent execution API
- `analytics-api` - Analytics processing
- `automation-api` - Automation workflows
- `billing-api` - Billing operations
- `booking-api` - Booking management
- `chat-api` - Chat functionality
- `create-daily-challenge` - Daily challenge creation
- `daily-cleanup` - Daily cleanup tasks
- `email-cadence-scheduler` - Email cadence scheduling
- `ingest-events` - Event ingestion
- `ingest-telemetry` - Telemetry ingestion
- `integrations-api` - Integration management
- `lead-gen-api` - Lead generation
- `marketplace-api` - Marketplace operations
- `privacy-api` - Privacy operations
- `process-nurturing-steps` - Lead nurturing
- `rescue-email` - Email rescue
- `search-ai` - AI search
- `streak-reminder-cron` - Streak reminders
- `tenants-api` - Tenant management
- `webhook-ingest` - Webhook ingestion
- `welcome-email` - Welcome email
- `workflows-api` - Workflow operations

### Cron Jobs (Vercel Cron)

- `/api/cron/trial-emails` - Trial email cadence

## Webhook Handlers

### Stripe Webhook (`/api/stripe/webhook`)
- **Method:** PUT (Stripe sends POST, but we use PUT to distinguish)
- **Runtime:** Node.js (required for raw body signature verification)
- **Events Handled:**
  - `checkout.session.completed` - Updates subscription_tiers table
  - `customer.subscription.updated` - Updates subscription status
  - `customer.subscription.deleted` - Handles cancellations
- **Verification:** Uses raw body + signature header
- **Idempotency:** Not yet implemented (TODO)

## Security Architecture

### Multi-Layer Security

1. **Edge Middleware** (`middleware.ts`)
   - Security headers (CSP, X-Frame-Options, etc.)
   - Rate limiting (200 req/min for pages)
   - Suspicious activity detection
   - Admin guard checks

2. **API Route Handlers** (`lib/api/route-handler.ts`)
   - Input validation (Zod schemas)
   - Authentication checks
   - Tenant isolation
   - Request size limits
   - Timeout handling (30s default)

3. **Database Layer (RLS)**
   - Row-Level Security policies (Supabase)
   - Tenant isolation at DB level
   - Service role key never exposed to client

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. JWT token stored in HTTP-only cookie
3. Middleware validates token
4. API routes extract user ID from token
5. Tenant context derived from user's organization memberships

## Deployment Architecture

### Vercel Deployment

- **Framework:** Next.js 15
- **Runtime:** 
  - Edge runtime for middleware and some API routes
  - Node.js runtime for Stripe webhook (raw body requirement)
- **Build Process:**
  1. Pre-build checks
  2. Prisma Client generation
  3. Workspace packages build
  4. Next.js build
- **Environment Variables:** Managed in Vercel dashboard

### Database Migrations

- **Tool:** Prisma Migrate
- **Location:** `apps/web/prisma/`
- **Process:** 
  - `pnpm db:migrate` - Deploy migrations
  - `pnpm db:push` - Push schema changes (dev only)

## Monitoring & Observability

### Telemetry
- Custom telemetry system (`lib/monitoring/enhanced-telemetry.ts`)
- Performance tracking
- Error tracking
- User activity tracking

### Logging
- Structured logging (`lib/logging/structured-logger.ts`)
- Environment-aware (dev vs production)
- Error tracking with Sentry integration

### Health Checks
- `/api/health` - Basic health
- `/api/health/enhanced` - Enhanced health with dependency checks
- `/api/healthz` - Kubernetes-style readiness/liveness

## Critical Paths

See [CRITICAL_PATHS.md](./CRITICAL_PATHS.md) for detailed user journey flows.

## Data Flow Examples

### Checkout Flow
1. User clicks "Upgrade" on pricing page
2. Frontend calls `POST /api/stripe/create-checkout-app`
3. Server creates Stripe checkout session
4. User redirected to Stripe Checkout
5. User completes payment
6. Stripe sends webhook to `PUT /api/stripe/webhook`
7. Webhook handler verifies signature
8. Updates `subscription_tiers` table in Supabase
9. User redirected to `/billing/success`

### Workflow Execution Flow
1. User creates/edits workflow in UI
2. Frontend calls `POST /api/workflows` or `PUT /api/workflows/[id]`
3. Server validates and stores workflow
4. User clicks "Execute"
5. Frontend calls `POST /api/workflows/[id]/execute`
6. Server executes workflow steps
7. Results returned to frontend
8. Telemetry tracked

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase, Prisma
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth (JWT)
- **Payments:** Stripe
- **Email:** Resend
- **UI Components:** Radix UI
- **Validation:** Zod
- **Testing:** Vitest, Playwright
- **Deployment:** Vercel

## Key Design Decisions

1. **Multi-tenant via Organizations:** Users belong to organizations, not direct tenant isolation
2. **Stripe Webhook uses PUT:** Distinguishes from other POST endpoints
3. **Edge Runtime for Auth:** Faster response times for login/signup
4. **Node Runtime for Webhooks:** Required for raw body signature verification
5. **Prisma + Supabase:** Prisma for type safety, Supabase for RLS and auth
6. **Unified Route Handler:** Consistent error handling and validation across all API routes
