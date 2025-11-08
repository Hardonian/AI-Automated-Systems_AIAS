# Repository Cleanup & Optimization Plan

**Date:** 2025-01-XX  
**Branch:** `chore/safe-cleanup-foundation`  
**Status:** Planning Phase

---

## 1. Repository Map

### Structure
- **Monorepo:** pnpm workspaces (`apps/*`, `packages/*`)
- **Primary App:** Next.js 14.2.0 (`/app` directory, App Router)
- **Secondary App:** `/apps/web` (separate Next.js app with Prisma)
- **Packages:** 
  - `/packages/config` - Shared config
  - `/packages/lib` - Shared libraries (AI, auth, database, payments, etc.)
- **Edge Functions:** Supabase functions in `/supabase`
- **Build Tools:** Next.js (primary), Vite (configured but unclear usage)
- **Package Manager:** pnpm 8.15.0
- **Node Version:** 18.17.0 (`.nvmrc` present)

### Entry Points
- **Web:** `app/page.tsx` (Next.js App Router)
- **API Routes:** `app/api/**/*.ts`
- **Middleware:** `middleware.ts` (rate limiting, security headers, tenant isolation)
- **Build:** `next build` (Next.js), `vite build` (if Vite is used)

### Current Tooling Status
✅ **Present:**
- TypeScript strict mode enabled
- ESLint with comprehensive rules (including a11y)
- Prettier configured
- Husky + lint-staged (pre-commit hooks)
- GitHub Actions CI/CD (comprehensive pipeline)
- Lighthouse CI configured
- Security headers (middleware + next.config)
- Bundle analyzer (rollup-plugin-visualizer)
- EditorConfig

❌ **Missing/Needs Improvement:**
- Dead code detection tools (depcheck, ts-prune/knip)
- `.gitattributes` for consistent line endings
- CSP headers have `unsafe-inline` and `unsafe-eval` (security risk)
- Potential duplicate build configs (Next.js + Vite)
- No explicit `sideEffects` field in package.json
- Missing automated a11y checks in CI
- No secret scanning (gitleaks/git-secrets)

---

## 2. Risk Areas

### High Risk
1. **Dual Build Configs:** Both `next.config.ts` and `vite.config.ts` exist. Need to verify if Vite is actually used or if it's dead code.
2. **CSP Security:** `unsafe-inline` and `unsafe-eval` in Content-Security-Policy reduce security posture.
3. **Unused Dependencies:** Large dependency tree without verification of actual usage.
4. **Stale Documentation:** Many markdown files may contain outdated information.

### Medium Risk
1. **Script Consolidation:** 50+ npm scripts - some may be unused or could be consolidated.
2. **Bundle Size:** No baseline metrics captured; optimization opportunities unknown.
3. **A11y Gaps:** While ESLint rules exist, no automated CI checks with axe-core.
4. **Secret Management:** No automated secret scanning in CI.

### Low Risk
1. **Image Optimization:** Next.js image optimization configured but may need tuning.
2. **Code Splitting:** Manual chunks defined in Vite config but not verified for Next.js.
3. **Type Safety:** Some `any` types may exist (ESLint warns but doesn't fail).

---

## 3. Quick Wins

1. ✅ Add `.gitattributes` for consistent line endings
2. ✅ Add `.nvmrc` validation in CI (already exists, verify usage)
3. ✅ Add `sideEffects: false` to package.json for better tree-shaking
4. ✅ Remove unused Vite config if not needed
5. ✅ Add depcheck/knip for dead code detection
6. ✅ Consolidate duplicate scripts
7. ✅ Add automated a11y checks to CI
8. ✅ Add secret scanning to CI
9. ✅ Tighten CSP headers (remove unsafe-* where possible)
10. ✅ Generate baseline bundle stats

---

## 4. Tooling Plan

### Phase 1: Foundation (PR #1)
- **Tools:** TypeScript, ESLint, Prettier (already present, verify configs)
- **Add:** `.gitattributes`, verify `.nvmrc`, add `sideEffects` field
- **CI:** Enhance existing CI with additional checks
- **Artifacts:** Updated configs, CI workflow improvements

### Phase 2: Dead Code (PR #2)
- **Tools:** 
  - `depcheck` - unused dependencies
  - `knip` - unused files/exports (more comprehensive than ts-prune)
- **Artifacts:** `UNUSED_REPORT.md` with findings
- **Action:** Remove only 100% unused code (respect dynamic imports)

### Phase 3: Bundle Optimization (PR #3)
- **Tools:**
  - `@next/bundle-analyzer` - Next.js bundle analysis
  - `rollup-plugin-visualizer` - already present
  - Lighthouse CI - already configured
- **Artifacts:** 
  - Baseline bundle stats (before)
  - Optimized bundle stats (after)
  - Lighthouse reports (before/after JSON)
- **Actions:**
  - Enable code-splitting for dynamic routes
  - Add `sideEffects: false` for tree-shaking
  - Replace heavy libs with lighter alternatives (if safe)
  - Optimize images (Sharp, SVGO)
  - Add preload/prefetch for critical assets

### Phase 4: Accessibility (PR #4)
- **Tools:**
  - `@axe-core/cli` or `jest-axe` in CI
  - `pa11y-ci` - already present
  - `@axe-core/playwright` - already present
- **Artifacts:** A11y audit report, fix matrix
- **Actions:**
  - Add automated axe checks to CI
  - Fix semantic HTML issues
  - Ensure ARIA labels where needed
  - Fix color contrast issues
  - Add skip links, focus order fixes

### Phase 5: SEO (PR #5)
- **Tools:** Manual audit + Next.js metadata API
- **Artifacts:** SEO audit report
- **Actions:**
  - Ensure title/meta/og/twitter tags
  - Add canonicals, robots.txt
  - Add JSON-LD structured data
  - Fix duplicate routes/crawl traps
  - Fix broken internal links

### Phase 6: Security (PR #6)
- **Tools:**
  - `pnpm audit` - already present
  - `gitleaks` or `git-secrets` - add to CI
  - CSP header review
- **Artifacts:** Security audit report, patched dependencies list
- **Actions:**
  - Patch safe dependency upgrades
  - Add secret scanning to CI
  - Tighten CSP headers (remove unsafe-*)
  - Add `.env.example` with documented vars
  - Review and harden security headers

### Phase 7: Mobile (PR #7)
- **Status:** Not applicable (no Expo/React Native detected)
- **Skip:** This is a Next.js web-only application

### Phase 8: Scripts & Docs (PR #8)
- **Tools:** Manual audit
- **Artifacts:** Scripts audit, docs cleanup list
- **Actions:**
  - Remove unused npm scripts
  - Consolidate scripts into `scripts/` folder
  - Remove stale markdown docs
  - Normalize README badges and structure
  - Add "Performance Playbook" section

### Phase 9: Edge Functions (PR #9)
- **Tools:** Manual review
- **Artifacts:** Edge function audit report
- **Actions:**
  - Review Supabase edge functions for cold start optimization
  - Ensure edge-friendly libraries
  - Add rate limiting and input validation (Zod)
  - Document RLS policies (no changes, docs only)

### Phase 10: Final Report (PR #10)
- **Artifacts:** `CLEANUP_REPORT.md` with:
  - PR summary table
  - Before/after metrics
  - Files removed (with reasons)
  - Dependencies pruned
  - Follow-up items
  - Release checklist

---

## 5. PR List & Success Criteria

### PR #1: `chore: safe cleanup foundation (types, lint, ci, scripts)`
**Branch:** `chore/safe-cleanup-foundation`  
**Success Criteria:**
- ✅ All CI checks pass (typecheck, lint, test, build, audit)
- ✅ `.gitattributes` added
- ✅ `sideEffects` field added to package.json
- ✅ CI enhanced with additional validation
- ✅ No regressions in existing functionality

### PR #2: `chore: remove proven-dead code`
**Branch:** `chore/remove-dead-code`  
**Success Criteria:**
- ✅ `UNUSED_REPORT.md` attached with findings
- ✅ Only 100% unused code removed (no dynamic imports broken)
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Bundle size decreased or equal

### PR #3: `perf: reduce bundle size and load time`
**Branch:** `perf/bundle-optimization`  
**Success Criteria:**
- ✅ Bundle analyzer reports attached (before/after)
- ✅ Lighthouse scores maintained or improved
- ✅ Bundle size decreased (gzip/brotli)
- ✅ No functionality regressions
- ✅ Tree-shaking verified

### PR #4: `fix(a11y): automated checks + semantic and contrast improvements`
**Branch:** `fix/a11y-improvements`  
**Success Criteria:**
- ✅ Automated a11y checks added to CI
- ✅ A11y score ≥ 90 (Lighthouse)
- ✅ All axe violations fixed
- ✅ Semantic HTML verified
- ✅ Color contrast WCAG AA compliant

### PR #5: `feat(seo): robust meta + structured data + crawl hygiene`
**Branch:** `feat/seo-improvements`  
**Success Criteria:**
- ✅ SEO score ≥ 80 (Lighthouse)
- ✅ All pages have proper meta tags
- ✅ JSON-LD structured data added
- ✅ Sitemap and robots.txt configured
- ✅ No duplicate routes or crawl traps

### PR #6: `sec: dependency patches, secret scanning, and headers hardening`
**Branch:** `sec/security-hardening`  
**Success Criteria:**
- ✅ All moderate+ CVEs patched
- ✅ Secret scanning added to CI
- ✅ CSP headers tightened (no unsafe-* where possible)
- ✅ `.env.example` updated with all vars
- ✅ Security audit passes

### PR #7: `perf(mobile): Hermes, resource shrinking, and asset slimming`
**Status:** ⏭️ **SKIPPED** - No mobile app detected

### PR #8: `docs: tighten readme and developer guide; remove stale docs`
**Branch:** `docs/cleanup`  
**Success Criteria:**
- ✅ Unused scripts removed
- ✅ Stale markdown docs removed (with justification)
- ✅ README normalized and updated
- ✅ Developer guide improved
- ✅ Performance Playbook section added

### PR #9: `chore(api): tighten edge runtime, validation, and docs`
**Branch:** `chore/edge-optimization`  
**Success Criteria:**
- ✅ Edge functions reviewed for optimization
- ✅ Input validation added (Zod)
- ✅ Rate limiting verified
- ✅ RLS policies documented
- ✅ No functionality changes

### PR #10: `docs: cleanup report and release checklist`
**Branch:** `docs/cleanup-report`  
**Success Criteria:**
- ✅ `CLEANUP_REPORT.md` created with all metrics
- ✅ PR summary table complete
- ✅ Before/after comparisons documented
- ✅ Release checklist provided
- ✅ Follow-up items identified

---

## 6. Execution Order

1. **Create foundation branch** → PR #1
2. **Run dead code analysis** → PR #2
3. **Bundle optimization** → PR #3 (can run in parallel with #4)
4. **A11y improvements** → PR #4 (can run in parallel with #3)
5. **SEO improvements** → PR #5
6. **Security hardening** → PR #6
7. **Docs cleanup** → PR #8
8. **Edge optimization** → PR #9
9. **Final report** → PR #10

**Estimated Timeline:** 5-7 PRs (excluding mobile), ~2-3 days of focused work

---

## 7. Rollback Strategy

Each PR will include:
- Clear description of changes
- Before/after metrics
- Rollback instructions (git revert command)
- Test verification steps

**Critical:** PRs are designed to be merged independently. If any PR causes issues, it can be reverted without affecting others.

---

## 8. Acceptance Criteria (All PRs)

- ✅ All CI checks pass (typecheck, lint, test, build, audit)
- ✅ No regressions in e2e smoke tests (or basic route render)
- ✅ Bundle size decreased or equal
- ✅ Lighthouse scores not lower
- ✅ A11y scores not lower
- ✅ Clear description with "what/why", before/after, rollback notes
- ✅ Safe to merge independently

---

**Next Steps:** Begin with PR #1 (foundation) after plan approval.
