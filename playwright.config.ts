import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 *
 * Supports:
 * - E2E testing
 * - Visual regression testing (deterministic & stable)
 * - Cross-browser testing
 * - Accessibility testing
 * - UI Consistency Audit
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Test timeout
  timeout: 60 * 1000,
  expect: {
    // Timeout for assertions
    timeout: 10 * 1000,
    // Threshold for visual comparisons (0.2 = 20% pixel difference allowed)
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixels: 150,
      // Disable animations globally for screenshots
      animations: 'disabled',
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixels: 150,
    },
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for visual tests
  workers: process.env.CI ? 2 : undefined,

  // Reporter to use
  reporter: process.env.CI
    ? [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
        ['junit', { outputFile: 'playwright-report/junit.xml' }],
        ['list'],
      ]
    : [['html', { outputFolder: 'playwright-report' }], ['list']],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 15 * 1000,

    // Navigation timeout
    navigationTimeout: 30 * 1000,

    // Consistent locale and timezone for deterministic tests
    locale: 'en-US',
    timezoneId: 'America/Toronto',

    // Disable device scale factor for consistent screenshots
    deviceScaleFactor: 1,

    // Consistent color scheme
    colorScheme: 'light',

    // Reduced motion for accessibility testing
    bypassCSP: false,
  },

  // Configure projects for major browsers and viewports
  projects: [
    // Functional E2E Tests - Chromium
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testIgnore: /.*\.visual\.spec\.ts/,
    },
    // Functional E2E Tests - Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      testIgnore: /.*\.visual\.spec\.ts/,
    },
    // Functional E2E Tests - WebKit
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
      testIgnore: /.*\.visual\.spec\.ts/,
    },
    // Mobile testing - Chrome
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
      testIgnore: /.*\.visual\.spec\.ts/,
    },
    // Mobile testing - Safari
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
      testIgnore: /.*\.visual\.spec\.ts/,
    },

    // VISUAL REGRESSION PROJECTS
    // Desktop viewport - 1920x1080
    {
      name: 'visual-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        // Freeze animations
        launchOptions: {
          args: ['--force-color-profile=srgb'],
        },
      },
      testMatch: /.*\.visual\.spec\.ts/,
      snapshotPathTemplate:
        '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
    },
    // Tablet viewport - 768x1024 (iPad)
    {
      name: 'visual-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        userAgent:
          'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
        launchOptions: {
          args: ['--force-color-profile=srgb'],
        },
      },
      testMatch: /.*\.visual\.spec\.ts/,
      snapshotPathTemplate:
        '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
    },
    // Mobile viewport - 375x667 (iPhone SE)
    {
      name: 'visual-mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
        hasTouch: true,
        isMobile: true,
        launchOptions: {
          args: ['--force-color-profile=srgb'],
        },
      },
      testMatch: /.*\.visual\.spec\.ts/,
      snapshotPathTemplate:
        '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
    },

    // UI CONSISTENCY AUDIT PROJECTS
    // Dark mode tests
    {
      name: 'visual-desktop-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: 'dark',
        launchOptions: {
          args: ['--force-color-profile=srgb'],
        },
      },
      testMatch: /.*\.audit\.spec\.ts/,
      snapshotPathTemplate:
        '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
    },
    // Reduced motion tests
    {
      name: 'visual-reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        launchOptions: {
          args: ['--force-color-profile=srgb'],
        },
      },
      testMatch: /.*\.audit\.spec\.ts/,
      snapshotPathTemplate:
        '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
    },
  ],

  // Run your local dev server before starting the tests
  webServer: process.env.CI
    ? undefined // In CI, server should already be running
    : {
        command: 'pnpm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
        stdout: 'ignore',
        stderr: 'pipe',
      },

  // Output directory for test artifacts
  outputDir: 'test-results/',

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,
});
