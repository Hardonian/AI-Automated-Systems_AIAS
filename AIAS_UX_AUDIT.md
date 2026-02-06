# AIAS UX Audit — Phase 1: Missing Experiences

**Generated:** February 5, 2026  
**Based on:** Frontend Reality Map exploration  
**Severity Classification:** A (Critical/Breaks Trust), B (Friction), C (Polish)

---

## Executive Summary

The AIAS platform has a solid technical foundation with modern Next.js 15 architecture, comprehensive design system, and strong accessibility implementation. However, the frontend fails to clearly communicate the core value proposition to visitors within the critical first seconds. The homepage lacks a clear "What is AIAS?" statement, the CTA hierarchy is fragmented across competing calls, and the crucial "show don't tell" proof layer is missing. Visitors cannot quickly understand what outcomes AIAS delivers, what makes it trustworthy, or how to take the next step.

---

## Severity A: Breaks Trust or Conversion

### A1. Homepage Hero: Unclear Value Proposition

**Issue:** The homepage hero headline "We design workflows that assist teams with complex processes" is vague and doesn't answer the fundamental visitor question: "What is AIAS?"

**Current Implementation:**

- File: `app/page.tsx` lines 50-79
- Headline: "We design workflows that assist teams with complex processes"
- Subtext: "Human-in-the-loop automation aligned with your governance. Knowledge transfer included. Artifacts remain with your organization."

**Problems:**

- Doesn't say WHAT AIAS IS (consultancy? SaaS? Both?)
- Doesn't identify WHO it's for
- Doesn't state concrete OUTCOMES (time saved, risk reduced)
- "Assist teams" is passive and weak
- Jargon ("human-in-the-loop," "governance," "artifacts") assumes prior knowledge

**Expected Behavior:**
A clear statement: "AIAS builds custom AI agents and automation systems that [specific outcome] for [specific audience]."

**References:**

- `app/page.tsx:50-79` - Hero component
- `components/content/ContentDrivenHero.tsx` - Dynamic hero rendering
- `content/aias.json:1-60` - Content source

---

### A2. Missing Primary CTA Above the Fold

**Issue:** The homepage has competing CTAs without a clear primary action. "Book a discovery call" competes with "View example workflows" without clear hierarchy.

**Current Implementation:**

- File: `app/page.tsx:62-75`
- Two buttons of equal visual weight
- No clear "Do this first" guidance

**Problems:**

- Analysis paralysis for visitors
- No distinction between "ready to buy" vs "still exploring"
- CTA text is agency-style ("discovery call") rather than outcome-focused
- "View example workflows" is weak—show don't tell

**References:**

- `app/page.tsx:62-75` - CTA section
- `components/layout/enhanced-sticky-cta.tsx` - Floating CTA

---

### A3. No "Show Don't Tell" Proof Layer

**Issue:** The homepage and key pages lack verifiable proof. Visitors cannot confirm claims with actual artifacts, code, or demonstrations.

**Current State:**

- Testimonials exist but are text-only quotes
- Case studies exist but are gated behind signup
- No CLI output, no architecture diagrams, no demo flows
- No "verify this yourself" section
- No GitHub repo link prominently displayed

**Missing Components:**

- Screenshot/dashboard previews
- Architecture diagrams (Mermaid/SVG)
- CLI command examples with real output
- "Try this yourself" interactive elements
- Code snippets demonstrating value

**References:**

- `app/case-studies/page.tsx` - Gated case studies
- `components/home/testimonials.tsx` - Text testimonials only
- `app/process/page.tsx` - Process description without visual proof

---

### A4. Missing Pricing Transparency

**Issue:** The homepage and services pages lack clear pricing information. Visitors cannot quickly understand engagement costs.

**Current State:**

- `/pricing` exists but is buried in footer
- Services page has "Typical Timeline" but no pricing
- No engagement model summary on homepage
- Pricing described as "Custom" without ranges

**Missing:**

- Clear pricing ranges on homepage ("$50K-$500K for custom builds")
- SaaS pricing visible ($49-$149/month)
- Engagement model summary (Pilot → Scale → Enable)
- "Book consultation" implies hidden costs

**References:**

- `app/pricing/page.tsx` - Pricing page exists but not linked prominently
- `app/services/page.tsx:45` - "timeline: 8-16 weeks" without pricing
- `content/aias.json:179-180` - FAQ mentions "$50K-$500K+" in JSON but not visible

---

### A5. Unclear Navigation Structure

**Issue:** Header navigation has 6 items plus CTA, creating competing paths. Users don't know which to click first.

**Current Header:**

- `/services` - Services
- `/process` - Process
- `/use-cases` - Use Cases
- `/training` - Training
- `/responsible-ai` - Responsible AI
- `/resources` - Resources
- "Book a discovery call" - CTA

**Problems:**

- "Services" and "Process" overlap in visitor mental model
- "Training" and "Responsible AI" are secondary concerns
- No clear path for first-time visitors
- CTA button visually competes with nav items

**References:**

- `components/layout/header.tsx:37-64` - Navigation items

---

### A6. Footer Missing Critical Links

**Issue:** Footer lacks direct links to GitHub repo, pricing clarity, and security information.

**Current Footer Links:**

- Services (6 links)
- Resources (6 links)
- Company (6 links)

**Missing:**

- GitHub repository link (present but subtle)
- Direct pricing link
- Security/privacy links buried in "Trust Center"
- No "What we deliver" summary

**References:**

- `components/layout/footer.tsx:100-158` - Footer sections

---

## Severity B: Friction Issues

### B1. Missing FAQ Section on Homepage

**Issue:** Homepage lacks FAQ section. Visitors have unanswered questions that could be barriers to conversion.

**Current FAQ:**

- Exists as `ContentDrivenFAQ` but requires content loading
- FAQ content exists in `content/aias.json` but may not render
- Critical questions (pricing, timeline, security) not addressed upfront

**Missing from Homepage:**

- "How much does it cost?"
- "How long does it take?"
- "What makes you different?"
- "Is my data secure?"

**References:**

- `app/page.tsx:39,44` - FAQ import and rendering
- `content/aias.json:146-210` - FAQ content exists
- `components/content/ContentDrivenFAQ.tsx` - FAQ component

---

### B2. Case Studies Gated Behind Signup

**Issue:** Valuable proof (case studies) is inaccessible without creating an account, losing potential clients who want to vet before committing.

**Current Implementation:**

- File: `app/case-studies/page.tsx:123-136`
- `showFull` controlled by user plan from Supabase
- Free users see only summaries

**Problems:**

- Gate creates friction before trust established
- Case study summaries lack detail
- "Consultancy Builds" should be public (these ARE the proof)
- Creates "bait and switch" feeling

**References:**

- `app/case-studies/page.tsx` - Gating logic
- `components/case-studies/gated-case-study.tsx` - Gate component

---

### B3. Services Page Overwhelms with Options

**Issue:** Services page lists 8+ services with equal weight, making it difficult for visitors to identify what they need.

**Current State:**

- File: `app/services/page.tsx:33-141`
- 8 service cards, all same size and prominence
- No guidance on "Start here" or "Most popular"
- SaaS vs Consultancy comparison is detailed but late in page

**Problems:**

- Choice paralysis
- Unclear value differentiation between services
- No prioritization

**References:**

- `app/services/page.tsx:220-281` - Service cards grid

---

### B4. Process Page Without Visual Flow

**Issue:** Process page describes phases (Pilot → Scale → Enable) but lacks visual flow diagram.

**Current Implementation:**

- File: `app/process/page.tsx:20-83`
- Three card-based phases listed vertically
- No visual representation of the engagement model
- No timeline or phase transition guidance

**Missing:**

- Mermaid diagram or flowchart
- Visual timeline showing Pilot → Scale → Enable
- Clear "Where to start" guidance

**References:**

- `app/process/page.tsx:108-244` - Process page content

---

### B5. No "How We Work" Section

**Issue:** No clear explanation of the engagement model beyond the process page.

**Current Content:**

- Process page exists but is text-heavy
- No "What happens when you book a call" section
- No timeline from contact to delivery
- No deliverables clarity

**Missing Content:**

- "Here's what happens next" section
- Timeline graphic
- First meeting agenda
- Deliverables examples

---

### B6. Mobile Navigation Experience

**Issue:** Mobile nav works but lacks quick-access CTAs.

**Current Mobile Nav:**

- File: `components/layout/mobile-nav.tsx`
- Hamburger menu with links
- No quick CTA in mobile header
- Back button may be missing in some views

**Problems:**

- Hidden CTA on mobile
- No "Book Now" quick action
- Menu requires extra tap

---

### B7. Content Loading States

**Issue:** Dynamic content loading shows jarring fallback states.

**Current Implementation:**

- File: `app/page.tsx:22-27`
- Try-catch with content loading, falls back to defaults
- Loading state is a blank div (`<div aria-label='Loading FAQ' className='py-16' />`)

**Problems:**

- No skeleton loader
- Instant switch from default to content
- Possible layout shift

**References:**

- `app/page.tsx:14-19` - FAQ loading state
- `components/ui/loading-skeleton.tsx` - Skeleton component exists but not used

---

### B8. Form Validation Feedback

**Issue:** Contact form lacks inline validation feedback.

**Current Contact Form:**

- File: `components/contact-form.tsx`
- Zod validation exists but feedback may be delayed
- No clear success state
- After submit, unclear next steps

**Missing:**

- Real-time field validation
- Inline error messages
- Clear success confirmation
- "What happens next" guidance

---

## Severity C: Polish Issues

### C1. Typography Scale Inconsistency

**Issue:** Some pages use inconsistent font sizing and weights.

**Observed Inconsistencies:**

- Homepage headings vary in size unpredictably
- Card titles different sizes across services/case studies
- Some emphasis text uses `font-medium`, some `font-semibold`

**References:**

- `app/page.tsx` - Homepage typography
- `app/services/page.tsx` - Services typography
- `tailwind.config.ts:121-143` - Typography config exists

---

### C2. Spacing Rhythm Issues

**Issue:** Spacing between sections varies inconsistently.

**Observed Issues:**

- Some sections use `py-20`, others `py-16`, `py-24`
- Container max-widths inconsistent
- Gap values vary without clear pattern

**References:**

- `app/page.tsx:117` - `py-20`
- `app/services/page.tsx:155` - `py-16`
- `app/process/page.tsx:111` - `py-20`

---

### C3. Button Style Inconsistency

**Issue:** Buttons vary in styling across the site.

**Observed Variations:**

- `min-h-[44px]` on some buttons, not others
- Some use `font-semibold`, some `font-medium`
- Padding varies (`px-8 py-4` vs `px-6 py-3`)
- Border radius sometimes `rounded-md`, sometimes default

**References:**

- `app/page.tsx:63-74` - Homepage buttons
- `components/ui/button.tsx` - Button component exists
- `components/ui/conversion-button.tsx` - Conversion button exists

---

### C4. Icon Usage Inconsistency

**Issue:** Icons from Lucide React used inconsistently across the site.

**Observed Issues:**

- Some icons colored, some monochrome
- Sizes vary without pattern
- Icon-only buttons lack proper aria-labels

**References:**

- `app/services/page.tsx` - Service icons
- `app/process/page.tsx` - Phase icons
- `app/use-cases/page.tsx` - Use case icons

---

### C5. Hover State Inconsistency

**Issue:** Interactive elements have inconsistent hover behaviors.

**Observed Issues:**

- Some cards have `hover:border-primary/50`, others don't
- Button hover varies between `hover:bg-primary/90` and `hover:bg-primary`
- Focus states present but not consistent

**References:**

- `app/page.tsx:131` - Card hover
- `components/ui/card.tsx` - Card component

---

### C6. Microcopy Improvements Needed

**Issue:** Some microcopy could be warmer and more action-oriented.

**Examples:**

- "Book a discovery call" → Could be "Let's discuss your project"
- "View example workflows" → Could be "See what we've built"
- "Knowledge transfer included" → Jargon, unclear meaning
- "Artifacts remain with your organization" → Cold, technical

**Recommendations:**

- Warmer language ("We'll help you...", "Your team...")
- Action-oriented ("Get started", "Start your project")
- Outcome-focused ("Save 15+ hours/week")

---

### C7. Empty States Not Implemented

**Issue:** Some routes lack proper empty states.

**Examples:**

- `/blog` may have no posts
- `/community` may have no content
- `/playground` placeholder without guidance

**References:**

- `components/ui/empty-state.tsx` - Component exists
- `components/ui/empty-state-enhanced.tsx` - Enhanced version exists

---

### C8. Loading Animation Heavy

**Issue:** Framer Motion animations may be excessive.

**Current Animations:**

- Header elements animate in sequentially
- Footer elements animate in
- Cards have hover animations
- Page sections may animate

**Problem:**

- Bundle size impact from framer-motion
- May slow down perceived performance
- Some animations may not respect reduced motion

**References:**

- `app/page.tsx:17-20` - Header animation
- `components/layout/footer.tsx:42-46` - Footer animation

---

## Priority Implementation Order

### Immediate (Week 1)

1. **Fix Homepage Hero (A1)** - Clear value prop, outcomes-focused
2. **Add Primary CTA (A2)** - Clear single CTA, secondary actions
3. **Ungate Case Studies (A3)** - Make consultancy builds visible
4. **Add Pricing Summary (A4)** - Ranges visible, not buried

### Short-term (Week 2)

5. **Add FAQ to Homepage (B1)** - Top 4 questions above fold
6. **Add "How We Work" Section (B5)** - Visual engagement model
7. **Fix CTA Hierarchy (A5)** - Streamline navigation
8. **Improve Footer (A6)** - GitHub, pricing, security links

### Medium-term (Week 3-4)

9. **Add Proof Layer** - Screenshots, CLI snippets, diagrams
10. **Fix Services Page** - Prioritization, not overwhelming
11. **Add Visual Process Flow (B4)** - Diagram or timeline
12. **Polish Components** - Consistency pass on buttons, spacing

### Long-term (Month 2+)

13. **Content Refinement** - Warmer microcopy throughout
14. **Animation Optimization** - Reduce framer-motion impact
15. **Form Feedback** - Inline validation improvements
16. **Mobile Experience** - Quick CTAs, better nav

---

## Files Requiring Changes

### Critical Path Files

| File                           | Changes                             | Priority |
| ------------------------------ | ----------------------------------- | -------- |
| `app/page.tsx`                 | Hero rewrite, CTA fix, FAQ addition | A        |
| `components/layout/header.tsx` | Navigation restructuring            | A        |
| `components/layout/footer.tsx` | Link additions, trust signals       | A        |
| `app/case-studies/page.tsx`    | Ungated consultancy builds          | A        |
| `content/aias.json`            | FAQ content, clearer hero           | B        |

### Secondary Files

| File                       | Changes                | Priority |
| -------------------------- | ---------------------- | -------- |
| `app/services/page.tsx`    | Service prioritization | B        |
| `app/process/page.tsx`     | Visual flow diagram    | B        |
| `app/contact/page.tsx`     | Inline validation      | B        |
| `components/ui/button.tsx` | Consistency check      | C        |
| `app/globals.css`          | Spacing variables      | C        |

---

## Testing Requirements

### Visual Regression Tests

```bash
pnpm test:visual
pnpm test:visual:desktop
pnpm test:visual:mobile
```

### Accessibility Tests

```bash
pnpm a11y
pnpm test:e2e --grep @accessibility
```

### Performance Tests

```bash
pnpm lighthouse
# Verify LCP < 2.5s
# Verify CLS < 0.1
# Verify bundle size < 500KB initial
```

---

## Success Metrics

After implementation:

1. **Clear Value Prop** - Visitors can explain "What is AIAS" in 5 seconds
2. **CTA Clarity** - 80% of visitors identify the primary action
3. **Trust Signals** - GitHub link clicked 10%+ on homepage
4. **Proof Access** - Case study pages viewed 50%+ more
5. **Conversion** - Contact form submissions up 20%
6. **Performance** - Lighthouse score 95+
7. **Accessibility** - 0 pa11y errors

---

_End of UX Audit_
