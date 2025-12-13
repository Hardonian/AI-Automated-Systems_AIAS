# Critical User Paths

**Last Updated:** 2025-01-27

This document maps the critical user journeys that must never break. Each path includes failure points and required fallbacks.

## Path 1: Landing → Auth → App Console

### Flow
1. **Landing Page** (`/`)
   - **Entry:** User visits homepage
   - **Dependencies:** None (static/SSG)
   - **Failure Points:** None (static content)
   - **Fallback:** N/A

2. **Sign Up** (`/signup`)
   - **Entry:** User clicks "Sign Up"
   - **Dependencies:** 
     - Supabase Auth API
     - Email service (Resend)
   - **Failure Points:**
     - Supabase API down → Show error message, allow retry
     - Email delivery fails → Still create account, show warning
     - Network timeout → Retry with exponential backoff
   - **Fallback:** 
     - Error boundary shows friendly message
     - Retry button available
     - Link to contact support

3. **Email Verification**
   - **Entry:** User receives verification email
   - **Dependencies:** Email service, Supabase Auth
   - **Failure Points:**
     - Email not delivered → Show "Resend email" option
     - Link expired → Show "Request new link" option
   - **Fallback:** Manual verification via support

4. **Sign In** (`/signin`)
   - **Entry:** User clicks "Sign In"
   - **Dependencies:** Supabase Auth API
   - **Failure Points:**
     - Invalid credentials → Show generic error (don't reveal if email exists)
     - Rate limit exceeded → Show "Try again later" with countdown
     - Supabase API down → Show error, allow retry
   - **Fallback:**
     - Error boundary
     - Retry button
     - "Forgot password" link

5. **Dashboard** (`/dashboard`)
   - **Entry:** User successfully authenticated
   - **Dependencies:** 
     - Supabase database (user data, workflows)
     - Auth session valid
   - **Failure Points:**
     - Session expired → Redirect to signin
     - Database query fails → Show empty state with retry
     - Network error → Show offline message
   - **Fallback:**
     - Empty state component
     - Retry button
     - Offline indicator

### Critical Checks
- ✅ Auth session validation in middleware
- ✅ Database query error handling
- ✅ Empty state components
- ⚠️ Session expiry handling needs improvement
- ⚠️ Offline detection not implemented

## Path 2: Pricing → Checkout → Webhook → Entitlement → Success

### Flow
1. **Pricing Page** (`/pricing`)
   - **Entry:** User navigates to pricing
   - **Dependencies:** None (static content)
   - **Failure Points:** None
   - **Fallback:** N/A

2. **Select Plan & Create Checkout**
   - **Entry:** User clicks "Upgrade" button
   - **Dependencies:**
     - Stripe API (create checkout session)
     - User authenticated
     - Valid price ID
   - **Failure Points:**
     - Stripe API down → Show error, allow retry
     - Invalid price ID → Show error, log issue
     - User not authenticated → Redirect to signin
     - Network timeout → Retry with backoff
   - **Fallback:**
     - Error message with retry
     - Link to contact support
     - Log error for monitoring

3. **Stripe Checkout**
   - **Entry:** User redirected to Stripe
   - **Dependencies:** Stripe hosted checkout
   - **Failure Points:**
     - Payment method fails → Stripe handles retry
     - User cancels → Redirected to cancel URL
   - **Fallback:** Stripe handles all payment failures

4. **Webhook Handler** (`PUT /api/stripe/webhook`)
   - **Entry:** Stripe sends webhook after payment
   - **Dependencies:**
     - Stripe webhook secret (signature verification)
     - Supabase database (update subscription)
     - Raw body access (Node.js runtime)
   - **Failure Points:**
     - Signature verification fails → Return 401, Stripe retries
     - Database update fails → Return 500, Stripe retries
     - Duplicate webhook → Should be idempotent (TODO: implement)
     - Missing metadata → Return 400, log error
   - **Fallback:**
     - Stripe retries failed webhooks
     - Manual reconciliation endpoint (TODO: implement)
     - Log all failures for manual review

5. **Success Page** (`/billing/success`)
   - **Entry:** User redirected after payment
   - **Dependencies:**
     - Stripe session verification (optional)
     - Subscription status check
   - **Failure Points:**
     - Session verification fails → Still show success (webhook may be delayed)
     - Subscription not yet updated → Show "Processing" state
     - Network error → Show success with note to check email
   - **Fallback:**
     - Polling for subscription status
     - Link to billing page
     - Email confirmation sent

6. **Entitlement Check**
   - **Entry:** User tries to access premium feature
   - **Dependencies:**
     - Subscription status in database
     - Entitlement service
   - **Failure Points:**
     - Database query fails → Default to free tier
     - Subscription expired → Show upgrade prompt
     - Webhook not yet processed → Show "Processing" state
   - **Fallback:**
     - Graceful degradation (free tier features)
     - Upgrade prompt
     - Manual entitlement check endpoint

### Critical Checks
- ✅ Stripe webhook signature verification
- ✅ Database update on webhook
- ⚠️ Idempotency not implemented (duplicate webhook risk)
- ⚠️ Manual reconciliation not implemented
- ⚠️ Success page doesn't verify subscription status
- ⚠️ Entitlement check doesn't handle webhook delays

## Path 3: Workflow Creation → Execution → Results

### Flow
1. **Workflow List** (`/workflows`)
   - **Entry:** User navigates to workflows
   - **Dependencies:** Supabase database
   - **Failure Points:**
     - Database query fails → Show empty state
     - Network error → Show offline message
   - **Fallback:**
     - Empty state component
     - Retry button
     - Offline indicator

2. **Create Workflow**
   - **Entry:** User clicks "Create Workflow"
   - **Dependencies:**
     - Supabase database (save workflow)
     - User authenticated
   - **Failure Points:**
     - Validation fails → Show field errors
     - Database save fails → Show error, allow retry
     - Network timeout → Retry with backoff
   - **Fallback:**
     - Form validation errors
     - Error message with retry
     - Auto-save draft (TODO: implement)

3. **Execute Workflow** (`POST /api/workflows/[id]/execute`)
   - **Entry:** User clicks "Execute"
   - **Dependencies:**
     - Workflow definition valid
     - External APIs (if workflow uses integrations)
     - AI services (if workflow uses AI)
   - **Failure Points:**
     - Invalid workflow → Return 400
     - External API down → Return 503, allow retry
     - AI service timeout → Return 504, allow retry
     - Execution timeout → Return 504
   - **Fallback:**
     - Error message with details
     - Retry button
     - Partial results if available
     - Log execution for debugging

4. **View Results**
   - **Entry:** Execution completes
   - **Dependencies:** Results stored in database
   - **Failure Points:**
     - Results not found → Show error
     - Database query fails → Show error, allow retry
   - **Fallback:**
     - Error message
     - Retry button
     - Link to execution history

### Critical Checks
- ✅ Workflow validation
- ✅ Error handling in execution
- ⚠️ Timeout handling needs improvement
- ⚠️ Partial results not implemented
- ⚠️ Auto-save draft not implemented

## Path 4: Integration Setup → OAuth → Data Sync

### Flow
1. **Integration Page** (`/integrations`)
   - **Entry:** User navigates to integrations
   - **Dependencies:** Supabase database (list integrations)
   - **Failure Points:**
     - Database query fails → Show empty state
   - **Fallback:** Empty state with retry

2. **OAuth Initiation** (`POST /api/integrations/[provider]/oauth`)
   - **Entry:** User clicks "Connect [Provider]"
   - **Dependencies:**
     - OAuth provider API
     - OAuth credentials configured
   - **Failure Points:**
     - OAuth provider down → Show error
     - Invalid credentials → Log error, show generic message
   - **Fallback:**
     - Error message
     - Retry button
     - Contact support link

3. **OAuth Callback** (`GET /api/integrations/[provider]/callback`)
   - **Entry:** User redirected from OAuth provider
   - **Dependencies:**
     - OAuth provider API (exchange code)
     - Supabase database (store tokens)
   - **Failure Points:**
     - Invalid code → Redirect to integrations with error
     - Token exchange fails → Show error, allow retry
     - Database save fails → Show error, allow retry
   - **Fallback:**
     - Error message on integrations page
     - Retry connection button
     - Manual token entry option (TODO: implement)

4. **Data Sync**
   - **Entry:** Integration connected, sync triggered
   - **Dependencies:**
     - External API (Shopify, Wave, etc.)
     - Supabase database (store synced data)
   - **Failure Points:**
     - External API down → Queue sync, retry later
     - Rate limit exceeded → Queue sync, retry later
     - Invalid data → Log error, skip record
   - **Fallback:**
     - Background job queue
     - Retry mechanism
     - Error logging

### Critical Checks
- ✅ OAuth flow implemented
- ✅ Error handling in callback
- ⚠️ Background sync queue not fully implemented
- ⚠️ Manual token entry not implemented

## Failure Mode Summary

### Must Never Return Hard 500s

All routes must:
1. Catch all errors
2. Return appropriate HTTP status codes
3. Provide helpful error messages
4. Allow retry where appropriate
5. Log errors for monitoring

### Required Fallbacks

1. **Network Failures:**
   - Retry with exponential backoff
   - Show offline indicator
   - Queue requests for later

2. **Database Failures:**
   - Show empty state
   - Allow retry
   - Cache last known state

3. **External API Failures:**
   - Show error message
   - Allow retry
   - Queue for background processing

4. **Auth Failures:**
   - Redirect to signin
   - Preserve return URL
   - Clear invalid session

5. **Payment Failures:**
   - Show error message
   - Allow retry
   - Link to support

## Monitoring & Alerting

### Critical Metrics
- Error rates by endpoint
- Response times
- Webhook success rate
- Checkout completion rate
- Auth success rate

### Alerts
- Webhook failures > 5% in 5 minutes
- Checkout failures > 10% in 5 minutes
- Database errors > 1% in 5 minutes
- External API errors > 5% in 5 minutes
