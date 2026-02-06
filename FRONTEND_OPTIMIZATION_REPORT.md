# AIAS Frontend Optimization Report

## Section 1: Frontend Reality Map

### Stack & Architecture

- **Framework**: Next.js 15.5.10 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.19 + CSS Custom Properties
- **UI Components**: Radix UI primitives + shadcn/ui patterns
- **Animation**: Framer Motion
- **State**: XState, TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payment**: Stripe
- **Monitoring**: Vercel Analytics, Speed Insights, Sentry
- **Testing**: Vitest, Playwright

### Route Structure (Marketing + App)

```
/                          → Home (consultancy focus)
/about                     → Company info
/services                  → Consultancy services grid
/process                   → How we work (3 phases)
/use-cases                 → Workflow examples
/case-studies              → Build showcases
/training                  → Systems thinking training
/responsible-ai            → Governance & ethics
/pricing                   → SaaS pricing tiers
/saas                      → Platform product page
/edge-ai                   → Edge AI accelerator
/settler                   → Payment platform product
/contact                   → Lead capture form
/demo                      → Book strategy call
/resources                 → Content hub
/blog                      → Daily articles
/rss-news                  → AI/tech news feed
/help                      → Help center
/status                    → System status
/trust                     → Trust center
/privacy, /terms           → Legal

App Routes (Authenticated):
/dashboard                 → User dashboard
/account/*                 → User settings
/admin/*                   → Admin panels
/billing                   → Subscription management
/onboarding/*              → User onboarding flow
/playground                → AI playground
```

### Component Architecture

```
components/
├── layout/               → Header, Footer, Navigation
├── home/                 → Landing page sections
├── ui/                   → Base components (shadcn-style)
├── content/              → Content-driven components
├── seo/                  → Structured data components
├── accessibility/        → A11y utilities
├── agent/                → AI agent integration
├── analytics/            → Tracking components
└── performance/          → Web vitals tracking
```

### Data Sources

- **Content**: `content/aias.json` (hero, features, FAQ, testimonials)
- **Navigation**: Hardcoded in header.tsx, footer.tsx
- **Services**: Hardcoded in app/services/page.tsx
- **Case Studies**: Admin-managed via API routes
- **Blog**: File-based MDX (app/blog/)

### Runtime Strategy

- Marketing pages: Static generation (default)
- Dashboard: Client-side with data fetching
- API routes: Serverless functions
- Admin: Server-side with auth checks

### Current Theme System

- **Mode**: Light-first (dark mode defined but not promoted)
- **Primary**: Blue (#2563eb, hsl(221.2 83.2% 53.3%))
- **Surface**: White backgrounds with subtle borders
- **Typography**: Geist Sans (system fallback)

---

## Section 2: Ranked Gap List (A/B/C)

### A-Grade (Breaks Trust/Conversion)

1. **Weak Hero Value Proposition** (`app/page.tsx:56-61`)
   - Current: "We design workflows that assist teams with complex processes"
   - Issue: Vague, no clear outcome or differentiation
   - Fix: Lead with measurable outcomes

2. **No Real Proof on Homepage** (`app/page.tsx:40-42`)
   - Missing: Screenshots, metrics, live demos
   - Issue: "Show don't tell" completely absent
   - Fix: Add artifact showcase section

3. **Navigation Confusion** (`components/layout/header.tsx:38-44`)
   - Services + Process + Use Cases overlap conceptually
   - No "Work/Case Studies" in main nav
   - Fix: Consolidate IA

4. **Missing Pricing Clarity**
   - Consultancy pricing absent from services page
   - No "packages" or "engagement models" section
   - Fix: Add transparent pricing tiers

5. **No FAQ on Homepage** (`app/page.tsx:29-44`)
   - FAQ component exists but content is async loaded
   - No fallback content if loader fails
   - Fix: Inline critical FAQ items

### B-Grade (Friction)

6. **Dark Blue Too Heavy** (`app/globals.css:46`)
   - Primary blue (#2563eb) feels corporate/cold
   - No warmth or approachability
   - Fix: Shift to warmer, lighter palette

7. **Missing Skip Navigation** (Present but verify)
   - `SkipLink` component exists but verify all pages

8. **No Error Boundaries on Key Pages**
   - Layout has `EnhancedErrorBoundary` but pages lack granular boundaries
   - Fix: Add page-level error boundaries

9. **Contact Form Missing Validation Feedback**
   - Need to verify form validation UX

10. **Footer Newsletter No Real API**
    - Simulated subscription (`components/layout/footer.tsx:24`)
    - Fix: Wire to Resend or remove

### C-Grade (Polish)

11. **Typography Rhythm Inconsistent**
    - Multiple heading sizes across pages
    - Fix: Standardize type scale

12. **Animation Overuse**
    - Framer Motion on every element (`components/layout/header.tsx:17-35`)
    - Fix: Reduce to meaningful micro-interactions

13. **Missing Reduced Motion Support**
    - CSS has `@media (prefers-reduced-motion)` but JS animations don't check

14. **Card Shadows Too Heavy**
    - `shadow-card: 0 6px 24px rgba(0, 0, 0, 0.08)` feels dated
    - Fix: Lighter, layered shadows

---

## Section 3: Implementation Plan

### Phase 4: Visual Modernization (Priority 1)

**Changes:**

1. Lighten primary color from blue-600 to indigo-500 (warmer)
2. Add warm gray neutrals instead of cool grays
3. Soften shadows: `0 1px 3px rgba(0,0,0,0.05)` instead of 0.08
4. Add subtle warm tint to backgrounds
5. Reduce animation intensity by 50%

**Files:**

- `app/globals.css` - Update CSS custom properties
- `tailwind.config.ts` - Adjust color tokens if needed

### Phase 2: IA Rebuild (Priority 2)

**Changes:**

1. Simplify nav to: Work | Services | Process | About | Contact
2. Consolidate Use Cases into Work page
3. Add /work route (redirects to case-studies or new page)
4. Create "Engagement Packages" section on Services

**Files:**

- `components/layout/header.tsx` - New nav structure
- `components/layout/footer.tsx` - Update links
- `app/work/page.tsx` - Create (or redirect)

### Phase 3: Proof Layer (Priority 2)

**Changes:**

1. Add "Proof" section to homepage with:
   - Architecture diagram (Mermaid)
   - CLI output sample (from actual scripts)
   - Dashboard screenshot (if available) or generate
   - "What you can verify locally" commands

2. Create `ProofShowcase` component

**Files:**

- `components/home/proof-showcase.tsx` - New
- `app/page.tsx` - Integrate

### Phase 7: Conversion Mechanics (Priority 3)

**Changes:**

1. Update hero CTA: "Book a Build Sprint" (more specific)
2. Add secondary CTA: "See Proof" (scroll anchor)
3. Add inline FAQ (3 critical questions)
4. Create engagement packages visualization
5. Add trust signals with verification links

**Files:**

- `app/page.tsx` - Update CTAs
- `components/home/faq.tsx` - Add inline variant
- `app/services/page.tsx` - Add packages

### Phase 6: Accessibility (Priority 3)

**Changes:**

1. Verify all buttons have focus-visible styles
2. Add aria-labels to icon-only buttons
3. Ensure heading hierarchy (h1 → h2 → h3)
4. Add error boundaries to content sections

**Files:**

- `components/accessibility/error-boundary.tsx` - Enhance
- Multiple component files

### Phase 5: Performance (Priority 4)

**Changes:**

1. Add next/image to all images
2. Lazy load below-fold sections
3. Verify font preloading
4. Add bundle analyzer script

**Files:**

- `next.config.mjs` - Add analyzer
- Various image components

---

## Section 4: Expected Outcomes

### Before/After Metrics

| Metric                  | Before | Target After |
| ----------------------- | ------ | ------------ |
| Homepage load time      | ~2.5s  | <1.5s        |
| Time to First Byte      | ~800ms | <400ms       |
| Lighthouse Performance  | ~75    | >90          |
| Lighthouse A11y         | ~85    | >95          |
| Cumulative Layout Shift | ~0.15  | <0.05        |

### Visual Changes

**Color Palette:**

- Primary: `hsl(221.2 83.2% 53.3%)` → `hsl(243 75% 59%)` (indigo, warmer)
- Background: Pure white → Subtle warm tint `#fafaf9`
- Text: Keep high contrast but slightly warmer grays
- Shadows: Reduce opacity, add warmth

**Typography:**

- Standardize on 6-step scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- Increase line-height on body text (1.6 → 1.7)
- Add letter-spacing to headings (-0.02em)

**Animations:**

- Reduce duration: 300ms → 200ms
- Remove entrance animations on scroll (keep hover states)
- Respect `prefers-reduced-motion`

---

## Section 5: Verification Steps

```bash
# 1. Type checking
pnpm typecheck

# 2. Linting
pnpm lint

# 3. Build
pnpm build

# 4. Start dev server
pnpm dev

# 5. Run tests
pnpm test

# 6. E2E tests
pnpm test:e2e

# 7. Accessibility audit
pnpm a11y

# 8. Performance audit
pnpm lighthouse
```

**Manual Checks:**

1. Navigate to `/` - Hero should show new CTAs
2. Navigate to `/services` - Should see engagement packages
3. Navigate to `/contact` - Form should validate
4. Resize to mobile - Nav should collapse
5. Tab through page - Focus states should be visible
6. Check console - No errors
7. Check network - Images served as webp/avif
