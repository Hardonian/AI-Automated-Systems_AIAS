# AIAS Frontend Reality Map

**Generated:** February 5, 2026  
**Scope:** Full repository frontend audit and improvement plan

---

## 1. Technology Stack

| Layer            | Technology            | Version          | Notes                        |
| ---------------- | --------------------- | ---------------- | ---------------------------- |
| Framework        | Next.js               | 15.5.10          | App Router with TypeScript   |
| Styling          | Tailwind CSS          | 3.4.19           | With @tailwindcss/typography |
| UI Components    | shadcn/ui             | -                | Based on Radix UI primitives |
| Animation        | Framer Motion         | 12.29.2          | React animation library      |
| State Management | React Query           | 5.90.20          | Server state management      |
| Forms            | React Hook Form + Zod | 7.71.1 + 3.25.76 | Form validation              |
| Backend          | Supabase              | 2.93.1           | Auth, database, SSR          |
| Deployment       | Vercel                | -                | Analytics, Speed Insights    |
| Testing          | Playwright + Vitest   | 1.58.0           | E2E and unit tests           |
| Accessibility    | axe-core + pa11y      | 4.11.0 + 4.0.1   | A11y testing                 |

---

## 2. Route Structure (104 Pages)

### Primary Marketing Routes

| Route           | File                        | Data Source             | Rendering | Status    |
| --------------- | --------------------------- | ----------------------- | --------- | --------- |
| `/`             | `app/page.tsx`              | Static + Content loader | SSG       | ✅ Active |
| `/about`        | `app/about/page.tsx`        | Static                  | SSG       | ✅ Active |
| `/services`     | `app/services/page.tsx`     | Static                  | SSG       | ✅ Active |
| `/process`      | `app/process/page.tsx`      | Static                  | SSG       | ✅ Active |
| `/case-studies` | `app/case-studies/page.tsx` | Static + DB             | SSR       | ✅ Active |
| `/contact`      | `app/contact/page.tsx`      | Static                  | SSG       | ✅ Active |
| `/pricing`      | `app/pricing/page.tsx`      | Static                  | SSG       | ✅ Active |

### Platform Routes

| Route          | File                      | Data Source | Rendering | Status    |
| -------------- | ------------------------- | ----------- | --------- | --------- |
| `/dashboard/*` | `app/dashboard/*`         | DB + Auth   | CSR       | ✅ Active |
| `/account/*`   | `app/account/*`           | DB + Auth   | CSR       | ✅ Active |
| `/onboarding`  | `app/onboarding/page.tsx` | DB + Auth   | SSR       | ✅ Active |
| `/billing`     | `app/billing/page.tsx`    | DB + Auth   | SSR       | ✅ Active |
| `/settings`    | `app/settings/page.tsx`   | DB + Auth   | SSR       | ✅ Active |

### Content Routes

| Route         | File                      | Data Source  | Rendering | Status    |
| ------------- | ------------------------- | ------------ | --------- | --------- |
| `/blog/*`     | `app/blog/*`              | Content + DB | SSG/ISR   | ✅ Active |
| `/use-cases`  | `app/use-cases/page.tsx`  | Static       | SSG       | ✅ Active |
| `/resources`  | `app/resources/page.tsx`  | Static       | SSG       | ✅ Active |
| `/demo`       | `app/demo/page.tsx`       | Static       | SSG       | ✅ Active |
| `/playground` | `app/playground/page.tsx` | Static       | SSG       | ✅ Active |

### Administrative Routes

| Route      | File                | Data Source | Rendering | Status           |
| ---------- | ------------------- | ----------- | --------- | ---------------- |
| `/admin/*` | `app/admin/*`       | DB + Auth   | CSR       | ⚠️ Auth Required |
| `/beta`    | `app/beta/page.tsx` | Static      | SSG       | ✅ Active        |

### Deprecated/Archive Routes

| Route         | Status        | Recommendation     |
| ------------- | ------------- | ------------------ |
| `/settler`    | ⚠️ Incomplete | Remove or complete |
| `/showcase`   | ✅ Active     | Keep               |
| `/community`  | ✅ Active     | Keep               |
| `/challenges` | ℹ️ Legacy     | Evaluate           |

---

## 3. Component Architecture

### Design System (components/ui)

The site uses shadcn/ui with custom extensions:

**Core Components:**

- `Button` - 7 variants, sizes, loading states
- `Card` - Header, content, description variants
- `Dialog` / `DropdownMenu` / `Toast` - Radix-based
- `Form` / `Input` / `Label` - Zod validated
- `Accordion` / `Tabs` / `Select` - Interactive

**Custom Components:**

- `SmoothScroll` - Lenis-powered scrolling
- `SpotlightCard` - Hover effects
- `TextReveal` - Scroll animations
- `ConversionButton` - CTA optimization
- `CTASection` - Conversion sections

### Layout Components (components/layout)

- `Header` - Navigation, mobile menu
- `Footer` - Newsletter, links, trust badges
- `EnhancedStickyCTA` - Floating conversion prompt
- `MobileStickyCTA` - Mobile-specific CTA

### Specialized Components

- `ContentDrivenHero` / `ContentDrivenFAQ` - Dynamic content
- `GatedCaseStudy` - Access-controlled case studies
- `TrustBadges` / `Testimonials` - Social proof
- `KeyboardNavEnhancement` - A11y enhancements

---

## 4. Data Sources

### Static Content

- `content/aias.json` - Core content (8.4 KB)
- `content/settler.json` - Product content (4.8 KB)

### Dynamic Content

- Supabase database - User data, case studies access
- Vercel Blob - File storage
- Edge Config - Feature flags

### API Routes (app/api)

- `/api/*` - 15+ endpoints for forms, webhooks, analytics

---

## 5. Design System Tokens

### Colors (CSS Variables in globals.css)

```css
:root {
  --bg: 0 0% 100%;
  --text: 222.2 84% 4.9%;
  --text-muted: 215.4 16.3% 46.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --success: 142 76% 36%;
  --border: 214.3 31.8% 91.4%;
  --card: 0 0% 100%;
}
```

### Typography

- Heading: `var(--font-geist-sans)` + system fallbacks
- Body: Same as heading
- Mono: `var(--font-geist-mono)`

### Spacing Scale

- Base: 4px (0.25rem)
- Standard: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Shadows

- `shadow-sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- `shadow-lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
- `shadow-card`: 0 6px 24px rgba(0, 0, 0, 0.08)

---

## 6. Performance Configuration

### Next.js Optimizations

- `compress: true` - Gzip compression
- `generateEtags: true` - Caching headers
- `typescript.ignoreBuildErrors: false` - Strict checks
- Image optimization: AVIF + WebP, 5 sizes defined

### Bundle Optimization

- `optimizePackageImports`: lucide-react, framer-motion, recharts
- `webpack` config: Code splitting, externals for server-only
- `compiler.removeConsole`: Production console removal

### Font Optimization

- Preloaded Inter font (woff2)
- Preconnect to Google Fonts
- DNS prefetch for CDN domains

---

## 7. Accessibility Features

### Implemented

- ✅ Skip-to-content link
- ✅ Focus visible styles
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation enhancement
- ✅ Reduced motion support
- ✅ Semantic HTML (main, nav, footer, article)
- ✅ Color contrast compliant (slate base)
- ✅ Form labels and validation

### Testing

- `pa11y-ci` - Automated accessibility testing
- `@axe-core/playwright` - Playwright a11y integration
- Lighthouse a11y scores tracked

---

## 8. Known Issues & Technical Debt

### Critical (A)

1. **Route Overload**: 104 pages dilutes focus
2. **Missing Pricing Clarity**: No pricing on homepage
3. **No Clear CTA Hierarchy**: Multiple CTAs competing

### Major (B)

1. **Content Fragmentation**: Content in JSON + hardcoded
2. **Animation Performance**: Heavy framer-motion usage
3. **Bundle Size**: Large JS bundles from dependencies

### Minor (C)

1. **Design Consistency**: Some components inconsistent
2. **Microcopy**: Vague language in places
3. **Empty States**: Some routes lack proper states

---

## 9. Verification Commands

```bash
# Build verification
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Accessibility audit
pnpm a11y

# Visual regression tests
pnpm test:visual

# Performance audit
pnpm lighthouse
```

---

## 10. File Reference Index

### Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind + CSS variables
- `app/globals.css` - Design system tokens
- `components.json` - shadcn/ui configuration

### Core Pages

- `app/page.tsx` - Homepage
- `app/layout.tsx` - Root layout
- `app/error.tsx` - Error boundary
- `app/not-found.tsx` - 404 page

### Key Components

- `components/layout/header.tsx` - Navigation
- `components/layout/footer.tsx` - Footer
- `components/ui/*` - Design system
- `components/home/*` - Homepage sections

### Utilities

- `lib/utils/cn.ts` - Classname merging
- `lib/seo/metadata.ts` - SEO helpers
- `lib/content/loader.ts` - Content loading
- `lib/env.ts` - Environment variables

---

## 11. Visual Design Assessment

### Current State

- **Palette**: Clean slate-based, light mode default
- **Typography**: Geist Sans (modern, clean)
- **Layout**: Container-based, responsive grid
- **Effects**: Subtle shadows, minimal gradients
- **Motion**: Framer Motion animations (can be heavy)

### Issues

1. **"Doom-Dark" Avoided**: Good, light theme is default
2. **Enterprise Feel**: Some sections feel too corporate
3. **Trust Signals**: Present but could be stronger
4. **OSS Identity**: Not clearly communicated

### Recommendations

1. Warm up palette slightly (less clinical)
2. Add more real artifacts and proof
3. Emphasize composable/OSS capabilities
4. Improve CTA visibility and hierarchy

---

## 12. Content Strategy Assessment

### Strengths

- Clear value proposition in hero
- Detailed case studies (gated)
- Process explanation is thorough
- Trust signals in footer

### Gaps

1. **No Live Demo**: Can't try before buying
2. **No CLI/Code Snippets**: Tech audience needs this
3. **No Architecture Diagrams**: Visual proof missing
4. **Pricing Opaque**: Engagement model unclear

### Opportunities

1. Add "Try the CLI" section
2. Show actual code artifacts
3. Add Mermaid diagrams for workflows
4. Clarify engagement tiers upfront

---

_End of Frontend Reality Map_
