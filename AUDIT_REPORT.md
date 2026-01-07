# AIAS System Audit & Hardening Report

**Date:** January 7, 2026
**Status:** CRITICAL FINDINGS DETECTED

## 1. Executive Summary

A comprehensive audit of the AIAS Supabase backend and Next.js application layer has identified a **Critical Architecture Drift** ("Split Brain Tenancy"). The application logic (Prisma/Next.js) and the newer backend services (Agents/Workflows/Supabase Functions) are operating on divergent schemas for tenancy and membership.

- **Frontend/Prisma**: Expects `organizations` (CUID IDs) and `memberships`.
- **Backend/Supabase**: Expects `tenants` (UUID IDs) and `tenant_members`.

The consolidated migration provided in this package establishes a baseline where **BOTH** schemas coexist to prevent immediate breakage, but a strategic refactor is required to unify them.

## 2. Repo Inventory & State

- **Framework**: Next.js (App Router)
- **ORM**: Prisma (defining `organizations`, `users` with CUIDs)
- **Backend**: Supabase (Postgres + Edge Functions)
- **Edge Functions**: Extensive usage (`agents-api`, `billing-api`, etc.) relying on `tenants` table.

## 3. Drift Analysis

### CRITICAL: Split Brain Tenancy
| Feature | App Layer (Prisma) | Backend Layer (Supabase SQL) | Risk |
|---------|-------------------|------------------------------|------|
| **Tenant Table** | `organizations` (CUID) | `tenants` (UUID) | **HIGH**: Data silos. An org created in the UI may not exist for Agents. |
| **Member Table** | `memberships` | `tenant_members` | **HIGH**: Permissions mismatch. User added to Org UI may not have access to Agents. |
| **User ID** | CUID (in `users` table) | UUID (`auth.users`) | **MED**: Requires joining via `users.supabaseId`. |

### Missing DDL (Remediated)
- The Prisma schema definitions for `organizations`, `memberships`, `users` were largely missing from the raw Supabase migrations, relying on implicit state or older migrations.
- The `agents` and `workflows` tables (critical for AI features) rely on `tenants`, which was not aligned with the App's `organizations`.

## 4. Security Findings

- **Middleware**: `middleware.ts` correctly enforces session checks and admin guards.
- **RLS**:
  - `tenants` and `agents` tables have RLS enabled.
  - **GAP**: `organizations` table (if it existed) likely lacked RLS in the raw SQL state. The consolidated migration enforces RLS on `organizations`.
- **Edge Functions**:
  - `config.toml` shows `verify_jwt = true` for sensitive functions (`chat-api`), but `false` for `lead-gen-api`. ensure `lead-gen-api` handles auth internally or is intended to be public.

## 5. Action Plan & Artifacts

### A. Consolidated Migration (`supabase/migrations/20260107120000_consolidated_remainder.sql`)
**Strategy**: "Dual-Stack Support"
This migration creates **BOTH** the Prisma-expected tables (`organizations`, `memberships`, `users`) AND the Supabase-expected tables (`tenants`, `tenant_members`) to ensure no runtime errors occurs in either subsystem.
- **Action**: Run this migration immediately to stabilize the schema.
- **Note**: This does NOT sync data between them. You must implement a trigger or application logic to sync creation of Organizations and Tenants until a refactor unifies them.

### B. Verification
Use the provided SQL snippets to verify the state of both systems.

### C. Future Refactor Recommendation
1.  Decide on a single ID format (UUID recommended for Postgres performance).
2.  Migrate Prisma schema to map `Organization` -> `tenants` and `Membership` -> `tenant_members`.
3.  Migrate `Organization.id` to UUID.

## 6. Verification Commands (Run in Supabase Studio or psql)

### Check Tenancy Split
```sql
-- Check count of Prisma Organizations vs Supabase Tenants
SELECT 'Organizations (Prisma)' as system, count(*) FROM public.organizations
UNION ALL
SELECT 'Tenants (Supabase)' as system, count(*) FROM public.tenants;
```

### Check RLS Status
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'tenants', 'agents', 'users');
```

### Verify Policy Coverage
```sql
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('organizations', 'tenants');
```
