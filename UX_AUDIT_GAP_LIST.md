# PHASE 1: UX Audit - Ranked Gap List

**Generated:** February 5, 2026  
**Auditor:** MiniMax (M2.1) - Frontend Principal Engineer + UX/Conversion Optimizer

---

## RANK A: Breaks Trust or Conversion

### A1. Hero Clarity Issue (app/page.tsx:50-79)

**File:** `app/page.tsx:50-79`  
**Issue:** Hero headline is vague: "We design workflows that assist teams with complex processes"  
**Impact:** Visitors don't immediately understand what AIAS is or who it's for  
**Fix:** Rewrite hero to be outcome-focused with clear target audience

```typescript
// Current:
<h1 className='mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl lg:text-6xl'>
  We design workflows that assist teams with complex processes
</h1>

// Recommended:
<h1 className='mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl lg:text-6xl'>
  We build AI automation systems that save teams 10+ hours/week
</h1>
```

---

### A2. Missing Primary CTA Above Fold (app/page.tsx:62-75)

**File:** `app/page.tsx:62-75`  
**Issue:** Two CTAs ("Book a discovery call" and "View example workflows") compete without clear hierarchy  
**Impact:** Decision paralysis, lower conversion  
**Fix:** Single primary CTA, secondary below scroll

---

### A3. No Pricing/Engagement Model on Homepage (app/page.tsx)

**File:** `app/page.tsx`  
**Issue:** No indication of cost or engagement options visible without scrolling  
**Impact:** Can't evaluate fit, high bounce rate  
**Fix:** Add engagement model summary or pricing link prominently

---

### A4. No Real Proof Artifacts (app/page.tsx)

**File:** `app/page.tsx`  
**Issue:** No screenshots, demos, CLI outputs, or architecture diagrams showing actual work  
**Impact:** "Trust but verify" fails, looks like brochureware  
**Fix:** Add proof section with real artifacts from repo

---

### A5. CTA Mismatch - Footer vs Header (components/layout/footer.tsx, components/layout/header.tsx)

**File:** `components/layout/footer.tsx:89-97`, `components/layout/header.tsx`  
**Issue:** Footer has newsletter signup instead of primary CTA; header has generic nav  
**Impact:** Footer is wasted conversion real estate  
**Fix:** Replace newsletter with clear "Book Consultation" CTA

---

## RANK B: Friction Issues

### B1. Long Scroll Without Engagement (app/page.tsx:117-143)

**File:** `app/page.tsx:117-143`  
**Issue:** Deliverables section is 6 cards without clear differentiation or outcomes  
**Impact:** Scroll fatigue, features over benefits  
**Fix:** Restructure as outcomes > proof > how

---

### B2. Case Studies Gated Behind Login (app/case-studies/page.tsx:273-278)

**File:** `app/case-studies/page.tsx:273-278`  
**Issue:** Case studies require login to view full content  
**Impact:** Can't build trust before signup  
**Fix:** Show first result/benefit ungated, gate details

---

### B3. Mobile CTA Visibility (app/page.tsx)

**File:** `app/page.tsx`  
**Issue:** Sticky CTA exists but may not be visible enough on mobile  
**Impact:** Mobile users miss primary action  
**Fix:** Test sticky CTA visibility, ensure minimum touch target 44px

---

### B4. Form Feedback Missing (components/contact-form.tsx)

**File:** `components/contact-form.tsx`  
**Issue:** Contact form may lack inline validation feedback  
**Impact:** Frustrated users abandon form  
**Fix:** Add real-time validation, success states, error messages

---

### B5. Process Page Overload (app/process/page.tsx)

**File:** `app/process/page.tsx:20-83`  
**Issue:** Three phases (Pilot, Scale, Enable) with many details on one page  
**Impact:** Cognitive overload, hard to scan  
**Fix:** Add tabbed or accordion interface for phases

---

## RANK C: Polish Issues

### C1. Typography Rhythm (app/globals.css)

**File:** `app/globals.css:121-124`  
**Issue:** Font settings exist but line-height and tracking could be optimized  
**Impact:** Text feels cramped or loose  
**Fix:** Refine typography scale for better readability

---

### C2. Inconsistent Icon Sizing (multiple files)

**File:** `app/services/page.tsx:226-229`  
**Issue:** Icons in service cards vary in size (h-12 w-12 vs inline)  
**Impact:** Visual inconsistency  
**Fix:** Standardize icon container size (h-12 w-12) across all cards

---

### C3. Button State Inconsistency (components/ui/button.tsx)

**File:** `components/ui/button.tsx`  
**Issue:** Hover/focus states may differ between variants  
**Impact:** Unexpected interactions  
**Fix:** Ensure consistent state transitions across all variants

---

### C4. Empty State Design (components/ui/empty-state.tsx)

**File:** `components/ui/empty-state.tsx`  
**Issue:** Empty states may lack proper guidance  
**Impact:** Users stuck on empty pages  
**Fix:** Add actionable empty states with clear next steps

---

### C5. Loading Skeleton Quality (components/ui/loading-skeleton.tsx)

**File:** `components/ui/loading-skeleton.tsx`  
**Issue:** Skeleton loading may not match actual content shape  
**Impact:** Layout shift, jarring transitions  
**Fix:** Ensure skeleton matches content dimensions exactly

---

## Summary by Priority

### Priority A (Must Fix - Week 1)

1. Hero headline rewrite for clarity
2. Single primary CTA above fold
3. Add pricing/engagement model visibility
4. Add real proof artifacts
5. Fix footer CTA

### Priority B (Should Fix - Week 2)

1. Restructure deliverables as outcomes
2. Partial ungated case studies
3. Mobile CTA optimization
4. Form validation feedback
5. Process page accordion

### Priority C (Nice to Have - Week 3)

1. Typography refinement
2. Icon size standardization
3. Button state consistency
4. Empty state improvements
5. Loading skeleton polish

---

## Testing Checklist

- [ ] Lighthouse audit (performance, accessibility, SEO)
- [ ] Mobile viewport test (320px minimum)
- [ ] Keyboard navigation test (Tab, Enter, Escape)
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Form validation test (valid/invalid inputs)
- [ ] CTA click test (visible, actionable, distinct)
- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Reduced motion test (prefers-reduced-motion)

---

_End of UX Audit - Ranked Gap List_
