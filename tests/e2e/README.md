# Visual Regression Testing

This directory contains comprehensive visual regression tests using Playwright.

## Quick Start

```bash
# Run all visual tests across viewports
pnpm test:visual

# Run specific viewport tests
pnpm test:visual:desktop
pnpm test:visual:tablet
pnpm test:visual:mobile

# Update baselines after intentional UI changes
pnpm test:visual:update

# Run UI consistency audit
pnpm test:audit
```

## Test Structure

### Files

- `visual-suite.spec.ts` - Main visual regression tests for critical routes
- `ui-consistency-audit.spec.ts` - Comprehensive UI audit (console errors, hydration, responsive issues)
- `utils/visual-helpers.ts` - Shared utilities for stable, deterministic screenshots
- `visual-regression.spec.ts` - Legacy tests (deprecated, kept for compatibility)

### Viewport Coverage

- **Desktop**: 1920x1080
- **Tablet**: 768x1024 (iPad)
- **Mobile**: 375x667 (iPhone SE)

### Routes Covered

1. **Homepage** (`/`)
2. **Legal** (`/privacy`, `/terms`)
3. **Content** (`/blog`)
4. **Workflow Sandbox** (`/#workflow-sandbox`)
5. **Error States** (404 page)
6. **Components** (header, footer)

## Deterministic Testing

Our visual tests are designed to be stable and deterministic:

### What's Frozen

- **Time**: All tests use a frozen date (2024-06-15T12:00:00.000Z)
- **Timezone**: America/Toronto (consistent across runs)
- **Locale**: en-US
- **Animations**: Disabled via CSS and JS injection
- **Math.random**: Seeded for reproducibility
- **Fonts**: System fonts or pre-loaded local fonts

### What's Masked

- Timestamps and dates
- User avatars (Gravatar, random images)
- Analytics counters
- Version numbers
- Dynamic IDs

## Adding New Visual Tests

```typescript
import { test, expect } from '@playwright/test';
import { setupVisualTest, waitForPageStability } from './utils/visual-helpers';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test('my new page - desktop', async ({ page }, testInfo) => {
  await setupVisualTest(page, testInfo);
  await page.goto(`${baseURL}/my-route`);
  await waitForPageStability(page);

  await expect(page).toHaveScreenshot('my-page-desktop.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

## CI Integration

Visual tests run automatically on:

- Pull requests to `main` and `develop`
- Pushes to `main` and `develop`

### Workflow

1. Build the application
2. Start production server
3. Run visual tests across viewports
4. Upload results as artifacts
5. Comment on PR if tests fail

### Updating Baselines in CI

⚠️ **Baselines should be updated locally and committed, not in CI.**

For emergency baseline updates, use the manual workflow:

1. Go to Actions → Update Visual Regression Baselines
2. Select branch and provide reason
3. Run workflow

## Debugging Failed Tests

### Local

```bash
# Open UI mode for debugging
pnpm test:e2e --ui

# Run specific test with tracing
pnpm test:e2e --grep "homepage" --trace on

# Update single snapshot
pnpm test:e2e --grep "homepage" --update-snapshots
```

### CI Artifacts

When visual tests fail in CI:

1. Download `visual-test-results` artifact
2. Open `playwright-report/index.html`
3. Compare expected vs actual vs diff
4. Fix the issue or update baselines

## Common Issues

### Flaky Screenshots

If screenshots are inconsistent:

1. Check if animations are fully disabled
2. Ensure fonts are loaded (use `waitForPageStability`)
3. Add masking for dynamic content
4. Increase threshold slightly (0.2 = 20% allowed)

### Hydration Mismatches

If tests fail due to hydration:

1. Check for `suppressHydrationWarning` on time elements
2. Ensure server/client render the same initial state
3. Use `useEffect` for client-only logic

### Font Differences

For consistent fonts:

1. Use `next/font` for local fonts
2. Preload critical fonts in layout
3. Wait for fonts in test setup

## Configuration

See `playwright.config.ts` for:

- Viewport definitions
- Screenshot thresholds
- Project configurations
- Reporter settings

## Best Practices

1. **Test at component level** for isolated UI components
2. **Test at page level** for full page screenshots
3. **Use fullPage: true** to capture entire scrollable area
4. **Mask dynamic content** that changes between runs
5. **Wait for stability** before taking screenshots
6. **Run in CI** on every PR to catch regressions early
