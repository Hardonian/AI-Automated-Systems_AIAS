# ACCESS_MAP

## Navigation Inventory (Header, Footer, Mobile)

### Header (components/layout/header.tsx)
- /services — Services
- /case-studies — Case Studies
- /pricing — Pricing
- /features — Features
- /blog — Blog
- /signup — Start Free Trial

### Footer (components/layout/footer.tsx)
**Product**
- /services — Services
- /portfolio — Portfolio
- /process — Our Process
- /case-studies — Case Studies
- /showcase — Showcase
- /pricing — Platform Pricing
- /features — Features

**Resources**
- /blog — Blog (Daily Articles)
- /rss-news — AI & Tech News Feed
- /help — Help Center
- /demo — Book Demo
- /status — Status

**Company**
- /about — About
- /showcase — Consultancy Showcase
- /why-canadian — Why Canadian
- /privacy — Privacy Policy
- /terms — Terms of Service
- /trust — Trust Center

**Utility**
- /trust — Trust Center
- /privacy — Privacy
- /status — Status
- /help — Help
- mailto:support@aiautomatedsystems.ca — Support

### Mobile Nav (components/layout/mobile-nav.tsx)
- /services — Services
- /settler — Settler
- /edge-ai — Edge AI
- /portfolio — Portfolio
- /showcase — Our Builds
- /case-studies — Case Studies
- /pricing — Platform Pricing
- /features — Features
- /systems-thinking — Systems Thinking
- /blog — Blog
- /about — About
- /demo — Demo
- /signup — Start Free Trial
- /demo — Schedule Call

---

## Route Inventory — Pages (App Router)

| Route | In Nav? | Current logged-out behavior | Data sensitivity | Recommended access | Required change |
| --- | --- | --- | --- | --- | --- |
| / | Header/Footer | 200 | public | PUBLIC | None |
| /about | Footer/Mobile | 200 | public | PUBLIC | None |
| /services | Header/Footer/Mobile | 200 | public | PUBLIC | None |
| /features | Header/Footer/Mobile | 200 | public | PUBLIC | None |
| /pricing | Header/Footer/Mobile | 200 | public | PUBLIC | None |
| /blog | Header/Footer/Mobile | 200 | public | PUBLIC | None |
| /blog/[slug] | No | 200/404 | public | PUBLIC | None |
| /rss-news | Footer | 200 | public | PUBLIC | None |
| /rss-news/[id] | No | 200/404 | public | PUBLIC | None |
| /case-studies | Header/Footer/Mobile | 200 | public | PUBLIC | Add fallback when auth/env missing |
| /portfolio | Footer/Mobile | 200 | public | PUBLIC | None |
| /showcase | Footer/Mobile | 200 | public | PUBLIC | None |
| /process | Footer | 200 | public | PUBLIC | None |
| /demo | Footer/Mobile | 200 | public | PUBLIC | None |
| /help | Footer | 200 | public | PUBLIC | None |
| /status | Footer | 200 | public | PUBLIC | None |
| /trust | Footer | 200 | public | PUBLIC | None |
| /privacy | Footer | 200 | public | PUBLIC | None |
| /terms | Footer | 200 | public | PUBLIC | None |
| /contact | No | 200 | public | PUBLIC | None |
| /affiliate-disclosure | No | 200 | public | PUBLIC | None |
| /integrations | No | 200 | public | PUBLIC | None |
| /templates | No | 200 | public | PUBLIC | None |
| /compare | No | 200 | public | PUBLIC | None |
| /automation-guide | No | 200 | public | PUBLIC | None |
| /systems-thinking | Mobile | 200 | public | PUBLIC | None |
| /why-canadian | Footer | 200 | public | PUBLIC | None |
| /canadian-automation | No | 200 | public | PUBLIC | None |
| /genai-content-engine | No | 200 | public | PUBLIC | None |
| /seo/wave-accounting-integration | No | 200 | public | PUBLIC | None |
| /seo/canadian-business-automation | No | 200 | public | PUBLIC | None |
| /seo/shopify-automation-canada | No | 200 | public | PUBLIC | None |
| /edge-ai | Mobile | 200 | public | PUBLIC | None |
| /edge-ai/services | No | 200 | public | PUBLIC | None |
| /edge-ai/device-analyzer | No | 200 | public | PUBLIC | None |
| /edge-ai/benchmarks | No | 200 | public | PUBLIC | None |
| /edge-ai/readiness-quiz | No | 200 | public | PUBLIC | None |
| /edge-ai/accelerator-studio | No | 200 | public | PUBLIC | None |
| /edge-ai/sdk-export | No | 200 | public | PUBLIC | None |
| /edge-ai/models | No | 200 | public | PUBLIC | None |
| /settler | Mobile | 200 | public | PUBLIC | None |
| /premium | No | 200 | public | PUBLIC | None |
| /referral | No | 200 | public | PUBLIC | None |
| /beta | No | 200 | public | PUBLIC | None |
| /beta/apply | No | 200 | public | PUBLIC | None |
| /mobile | No | 200 | public | PUBLIC | None |
| /signin | No | 200 | public | PUBLIC | None |
| /signup | No | 200 | public | PUBLIC | None |
| /api (page) | No | 200 | public | PUBLIC | None |
| /offline | No | 200 | public | PUBLIC | None |
| /sitemap.xml | No | 200 | public | PUBLIC | None |
| /robots.txt | No | 200 | public | PUBLIC | None |
| /_internal/review | No | 404/200 | internal | AUTH_REQUIRED | Admin gating already in page |
| /dashboard | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /dashboard/analytics | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /dashboard/analytics/funnel | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /dashboard/diagnostics | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /dashboard/revenue | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /billing | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /billing/success | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /settings | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /account/audit-log | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /account/export | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /onboarding | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /onboarding/results | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /onboarding/complete | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /onboarding/create-workflow | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /onboarding/select-template | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /workflows | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /journal | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /community | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /challenges | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /leaderboard | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /play | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /playground | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /playground/ux-events | No | redirect to /signin | private | AUTH_REQUIRED | Ensure middleware protection |
| /admin | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/performance | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/optimization | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/pmf-dashboard | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/case-studies | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/investors | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/lois | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/cost-dashboard | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/content-calendar | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/content-calendar/new | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/kpis | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/growth-experiments | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/insights | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/reliability | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/plg-funnel | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/hypotheses | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/compliance | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/financial/aias | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/financial/planning | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics/activation | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics/customer-health | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics/ltv-cac | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics/business | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics/business (page) | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/metrics (page) | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |
| /admin/content-studio | No | redirect to /signin | private | AUTH_REQUIRED | Admin middleware + page guards |

---

## Route Inventory — API Routes (App Router)

| Route | Current logged-out behavior | Data sensitivity | Recommended access | Required change |
| --- | --- | --- | --- | --- |
| /api/auth/login | 200/401 (POST) | private | PUBLIC (login) | None |
| /api/auth/signup | 200/400 (POST) | private | PUBLIC (signup) | None |
| /api/auth/admin/check | 200/401 | private | AUTH_REQUIRED | None |
| /api/audit/me | 401 | private | AUTH_REQUIRED | Add cookie-based auth + 401 when logged out |
| /api/agents | 200 | mixed | HYBRID (read), AUTH for writes | Existing manual auth |
| /api/agents/[id]/execute | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/admin/* | 403/401 | private | AUTH_REQUIRED | Admin middleware + handlers |
| /api/analytics/* | 200/401 | private | AUTH_REQUIRED | Existing guards |
| /api/billing/* | 200/401 | private | AUTH_REQUIRED | Existing guards |
| /api/blog/comments | 200 | public | PUBLIC | None |
| /api/blog/rss | 200 | public | PUBLIC | None |
| /api/blog/rss-comments | 200 | public | PUBLIC | None |
| /api/cache/analytics | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/circuit-breaker/metrics | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/contact | 200 | public | PUBLIC | None |
| /api/content/* | 401/200 | private | AUTH_REQUIRED | Existing guards |
| /api/cost/* | 401 | private | AUTH_REQUIRED | Existing guards |
| /api/csp-report | 200 | public | PUBLIC | None |
| /api/csrf | 200 | public | PUBLIC | None |
| /api/email/* | 200/401 | private | AUTH_REQUIRED | Existing guards |
| /api/embeds/* | 200 | public | PUBLIC | None |
| /api/entitlements/check | 200/401 | private | AUTH_REQUIRED | Existing guards |
| /api/etl/* | 401 | private | AUTH_REQUIRED | Existing guards |
| /api/example-secure | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/experiments/variant | 200 | public | PUBLIC | None |
| /api/feedback | 200 | public | PUBLIC | None |
| /api/flags/trust | 200 | public | PUBLIC | None |
| /api/health | 200 | public | PUBLIC | None |
| /api/health/enhanced | 200 | public | PUBLIC | None |
| /api/healthz | 200 | public | PUBLIC | None |
| /api/healthz/migrations | 200 | public | PUBLIC | None |
| /api/ingest | 200 | public | PUBLIC | None |
| /api/insights/* | 200/401 | private | AUTH_REQUIRED | Existing guards |
| /api/integrations/[provider]/oauth | 302 | public | PUBLIC | None |
| /api/integrations/[provider]/callback | 302 | public | PUBLIC | None |
| /api/integrations/shopify | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/integrations/wave | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/leads/* | 401 | private | AUTH_REQUIRED | Existing guards |
| /api/metrics | 200 | private | AUTH_REQUIRED (admin) | Existing guard (if enabled) |
| /api/monetization/affiliate/click | 200 | public | PUBLIC | None |
| /api/monitoring/dashboard | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/notifications | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/notifications/[id] | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/notifications/mark-read | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/og | 200 | public | PUBLIC | None |
| /api/openapi | 200 | public | PUBLIC | None |
| /api/settings | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/status | 200 | public | PUBLIC | None |
| /api/status/health | 200 | public | PUBLIC | None |
| /api/stripe/create-checkout | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/stripe/create-checkout-app | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/stripe/webhook | 200 | private | PUBLIC (webhook) | None |
| /api/swagger | 200 | public | PUBLIC | None |
| /api/telemetry | 200 | public | PUBLIC | None |
| /api/telemetry/ingest | 200 | public | PUBLIC | None |
| /api/trial/* | 200/401 | private | AUTH_REQUIRED | Existing guard |
| /api/ui-config | 200 | public | PUBLIC | None |
| /api/upload | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/v1/agents | 200 | public | PUBLIC | None |
| /api/v1/workflows | 200 | public | PUBLIC | None |
| /api/webhook-endpoints | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/webhooks/[tenant_id]/[secret] | 200 | private | PUBLIC (webhook) | None |
| /api/workflows | 200/401 | private | AUTH_REQUIRED for writes | Existing guard |
| /api/workflows/execute | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/workflows/[id]/execute | 401 | private | AUTH_REQUIRED | Existing guard |
| /api/workflows/templates | 200 | public | PUBLIC | None |
| /api/workflows/templates/[id] | 200 | public | PUBLIC | None |
| /api/cron/trial-emails | 200 | private | AUTH_REQUIRED (cron) | Existing guard |

