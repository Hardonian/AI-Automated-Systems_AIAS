# Data Model Documentation

**Last Updated:** 2025-01-27

## Overview

This document describes the database schema, relationships, constraints, and Row-Level Security (RLS) policies for the AIAS Platform.

## Database Schema (Prisma)

The primary schema is defined in `apps/web/prisma/schema.prisma`. See that file for the complete schema definition.

### Core Entities

#### User
- Primary identifier: `id` (CUID)
- Authentication: Linked to Supabase Auth via `supabaseId`
- Relationships:
  - Many memberships (to organizations)
  - Many API keys
  - Many AI runs
  - Many reports
  - Many projects

#### Organization
- Primary identifier: `id` (CUID)
- Unique constraint: `slug`
- Relationships:
  - Many memberships (users)
  - Many subscriptions
  - Many projects
  - Many sources (ETL)
  - Many webhook events
  - Many feature flags

#### Membership
- Links User to Organization with Role
- Unique constraint: `(userId, orgId)`
- Roles: ADMIN, EDITOR, VIEWER

#### Subscription
- Primary identifier: `id` (CUID)
- Status: ACTIVE, CANCELED, INCOMPLETE, INCOMPLETE_EXPIRED, PAST_DUE, TRIALING, UNPAID
- Plan: FREE, BASIC, PRO, ENTERPRISE
- Stripe integration:
  - `stripeCustomerId` (unique)
  - `stripeSubscriptionId` (unique)
  - `stripePriceId`
- Period tracking:
  - `currentPeriodStart`
  - `currentPeriodEnd`
  - `cancelAtPeriodEnd`

#### Project
- Belongs to User and Organization
- Status: ACTIVE, ARCHIVED, COMPLETED

#### Source
- Data source configuration for ETL pipelines
- Types: SHOPIFY_JSON, GOOGLE_TRENDS_CSV, TIKTOK_BUSINESS_JSON, ALIEXPRESS_CSV, GENERIC_CSV, GENERIC_JSON
- Belongs to Organization

## Supabase Tables (Not in Prisma)

### subscription_tiers
- Used for gamification/XP multipliers
- Columns:
  - `user_id` (UUID, references profiles.id)
  - `tier` (starter, pro, enterprise)
  - `xp_multiplier` (numeric)
  - `expires_at` (timestamp)

### profiles
- Supabase Auth user profiles
- Linked to Prisma User via `supabaseId`

### idempotency_keys
- Prevents duplicate webhook processing
- Columns:
  - `idempotency_key` (text, unique)
  - `resource_type` (text)
  - `resource_id` (text)
  - `request_hash` (text)
  - `response_data` (jsonb)
  - `status` (completed, failed)
  - `expires_at` (timestamp)
  - `completed_at` (timestamp)

### financial_ledger
- CFO Mode: All financial movements
- Columns:
  - `transaction_id` (text)
  - `idempotency_key` (text)
  - `account_id` (text)
  - `account_type` (tenant, user, system)
  - `amount_cents` (integer)
  - `currency` (text)
  - `transaction_type` (payment, refund, subscription, etc.)
  - `source_type` (text)
  - `source_id` (text)
  - `description` (text)
  - `metadata` (jsonb)
  - `status` (completed, failed)

## Data Integrity Constraints

### Unique Constraints
1. **User.email** - Must be unique
2. **User.supabaseId** - Must be unique (if set)
3. **Organization.slug** - Must be unique
4. **Membership(userId, orgId)** - User can only have one membership per org
5. **Subscription.stripeCustomerId** - Must be unique
6. **Subscription.stripeSubscriptionId** - Must be unique
7. **ApiKey.key** - Must be unique

### Foreign Key Constraints
- All foreign keys have `onDelete: Cascade` to prevent orphaned records
- Membership → User (CASCADE)
- Membership → Organization (CASCADE)
- Subscription → Organization (CASCADE)
- Project → User (CASCADE)
- Project → Organization (CASCADE)
- Source → Organization (CASCADE)
- WebhookEvent → Organization (CASCADE)
- FeatureFlag → Organization (CASCADE)

### Required Fields (Non-Null)
- User: `id`, `email`, `createdAt`, `updatedAt`
- Organization: `id`, `name`, `slug`, `createdAt`, `updatedAt`
- Membership: `id`, `role`, `userId`, `orgId`
- Subscription: `id`, `status`, `plan`, `orgId`, `createdAt`, `updatedAt`

## Row-Level Security (RLS)

RLS policies are defined in Supabase migrations (`supabase/migrations/`). The platform uses a multi-tenant architecture where:

1. **Tenant Isolation**: Data is isolated by `orgId` (Organization ID)
2. **User Access**: Users can only access data from organizations they belong to (via Membership)
3. **Role-Based Access**: Roles (ADMIN, EDITOR, VIEWER) control what actions users can perform

### RLS Policy Patterns

**Example: Projects Table**
```sql
-- Users can only see projects from their organizations
CREATE POLICY "Users can view projects from their organizations"
ON projects FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM memberships WHERE user_id = auth.uid()
  )
);
```

**Example: Subscriptions Table**
```sql
-- Only organization admins can view subscriptions
CREATE POLICY "Admins can view subscriptions"
ON subscriptions FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM memberships 
    WHERE user_id = auth.uid() AND role = 'ADMIN'
  )
);
```

## Data Invariants

### Must Always Be True

1. **No Orphaned Memberships**
   - Every membership must reference an existing user and organization
   - Check: `scripts/db-sanity-check.ts`

2. **Unique Customer Mapping**
   - Each Stripe customer ID should map to exactly one organization
   - Check: `scripts/db-sanity-check.ts`

3. **Subscription Status Consistency**
   - Active subscriptions must have `currentPeriodEnd` in the future
   - Check: `scripts/db-sanity-check.ts`

4. **No Orphaned Projects**
   - Every project must reference an existing user and organization
   - Check: `scripts/db-sanity-check.ts`

5. **Required Fields Not Null**
   - All required fields (email, etc.) must be populated
   - Check: `scripts/db-sanity-check.ts`

## Data Validation

### Application-Level Validation
- Zod schemas for all API inputs
- Prisma schema validation on writes
- Custom validation in route handlers

### Database-Level Validation
- Foreign key constraints
- Unique constraints
- Check constraints (where applicable)
- RLS policies enforce access control

## Migration Strategy

1. **Prisma Migrations**: For schema changes in Prisma-managed tables
2. **Supabase Migrations**: For RLS policies, functions, and Supabase-specific tables
3. **Migration Order**: Prisma migrations first, then Supabase migrations

## Backup & Recovery

- Regular backups via Supabase dashboard
- Point-in-time recovery available
- Migration rollback scripts in `supabase/migrations/`

## Monitoring

- Database query performance: Supabase dashboard
- RLS policy violations: Check Supabase logs
- Data integrity: Run `scripts/db-sanity-check.ts` regularly

## Security Considerations

1. **Service Role Key**: Never exposed to client, only used server-side
2. **Anon Key**: Used client-side with RLS policies enforcing access
3. **RLS Policies**: Always verify user has access before returning data
4. **Tenant Isolation**: All queries must filter by `orgId` or use RLS

## Running Sanity Checks

```bash
# Run database sanity checks
pnpm tsx scripts/db-sanity-check.ts
```

This will check:
- No orphaned records
- Unique constraints
- Data consistency
- Required fields
