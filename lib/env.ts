/**
 * Centralized Environment Variable Management
 *
 * This module provides a single source of truth for all environment variables.
 * Static consultancy site — no database required.
 *
 * Environment variables are automatically available from:
 * - Vercel: Set in Vercel Dashboard -> Settings -> Environment Variables
 * - GitHub Actions: Set in Repository -> Settings -> Secrets and variables -> Actions
 * - Local: Set in .env.local (not committed to git)
 */

/**
 * Runtime environment detection
 */
function getRuntimeEnv(): 'vercel' | 'github' | 'local' | 'unknown' {
  if (typeof process !== 'undefined') {
    if (process.env.VERCEL) {
      return 'vercel';
    }
    if (process.env.GITHUB_ACTIONS) {
      return 'github';
    }
    if (process.env.NODE_ENV === 'development') {
      return 'local';
    }
  }
  return 'unknown';
}

/**
 * Get environment variable with validation
 * Works in both Node.js and Edge runtime environments
 * Build-safe: During `next build` (or when SKIP_ENV_VALIDATION=true), returns placeholders instead of throwing
 */
function getEnvVar(
  key: string,
  required: boolean = true,
  defaultValue?: string
): string {
  const skipEnvValidation =
    typeof process !== 'undefined' &&
    (process.env.SKIP_ENV_VALIDATION === 'true' ||
      process.env.SKIP_ENV_VALIDATION === '1');

  const isNextBuild =
    typeof process !== 'undefined' &&
    process.env.NEXT_PHASE === 'phase-production-build';

  let value: string | undefined;

  if (typeof process !== 'undefined') {
    try {
      value = process.env[key];
    } catch {
      // Edge runtime may not have full process.env access
    }
  }

  if (!value && defaultValue !== undefined) {
    value = defaultValue;
  }

  const shouldUsePlaceholder =
    (isNextBuild || skipEnvValidation) && required && !value;

  if (shouldUsePlaceholder) {
    if (key.includes('URL') || key.includes('url')) {
      return 'https://placeholder.example.com';
    }
    if (
      key.includes('KEY') ||
      key.includes('SECRET') ||
      key.includes('PASSWORD')
    ) {
      return 'placeholder-key-32-chars-long-exactly';
    }
    return `placeholder-${key}`;
  }

  if (required && !value) {
    const runtime = getRuntimeEnv();
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Runtime: ${runtime}\n` +
        `Please set this variable in:\n` +
        `- Vercel: Dashboard -> Settings -> Environment Variables\n` +
        `- GitHub Actions: Repository -> Settings -> Secrets\n` +
        `- Local: .env.local file`
    );
  }

  return value || '';
}

/**
 * Environment variable configuration
 * All variables are loaded dynamically at runtime
 */
export const env = {
  // Supabase stubs (removed — these exist only so existing SaaS routes compile)
  supabase: {
    url: '' as string,
    anonKey: '' as string,
    serviceRoleKey: '' as string,
    jwtSecret: '' as string,
  },

  // Database stubs (removed)
  database: {
    url: '' as string,
    directUrl: '' as string,
  },

  // Application Configuration
  app: {
    env: getEnvVar('NEXT_PUBLIC_APP_ENV', false, 'production'),
    siteUrl:
      getEnvVar('NEXT_PUBLIC_SITE_URL', false) ||
      getEnvVar('NEXT_PUBLIC_APP_URL', false) ||
      getEnvVar('NEXTAUTH_URL', false) ||
      '',
    nextAuthUrl: getEnvVar('NEXTAUTH_URL', false),
    nextAuthSecret: getEnvVar('NEXTAUTH_SECRET', false),
    logLevel: getEnvVar('LOG_LEVEL', false, 'info'),
  },

  // Stripe Configuration (optional)
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY', false),
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', false),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', false),
  },

  // Vercel Configuration (for CI/CD)
  vercel: {
    token: getEnvVar('VERCEL_TOKEN', false),
  },

  // Email Configuration
  email: {
    fromEmail: getEnvVar(
      'EMAIL_FROM',
      false,
      'inquiries@aiautomatedsystems.ca'
    ),
    fromName: getEnvVar('EMAIL_FROM_NAME', false, 'AI Automated Systems'),
    replyTo: getEnvVar(
      'EMAIL_REPLY_TO',
      false,
      'inquiries@aiautomatedsystems.ca'
    ),
    supportEmail: getEnvVar(
      'SUPPORT_EMAIL',
      false,
      'support@aiautomatedsystems.ca'
    ),
    inquiriesEmail: getEnvVar(
      'INQUIRIES_EMAIL',
      false,
      'inquiries@aiautomatedsystems.ca'
    ),
  },

  // Resend Configuration
  resend: {
    apiKey: getEnvVar('RESEND_API_KEY', false),
  },

  // SendGrid stub (removed)
  sendgrid: {
    apiKey: '',
  },

  // SMTP stub (removed)
  smtp: {
    host: '',
    port: 587,
    user: '',
    password: '',
    secure: false,
  },

  // Storage stub (removed)
  storage: {
    uploadBucket: 'public',
    signingSecret: '',
  },

  // Contact form
  contact: {
    toEmail: getEnvVar(
      'CONTACT_TO_EMAIL',
      false,
      'inquiries@aiautomatedsystems.ca'
    ),
    testMode: getEnvVar('CONTACT_TEST_MODE', false, '') === '1',
  },

  // Turnstile (optional bot protection)
  turnstile: {
    secretKey: getEnvVar('TURNSTILE_SECRET_KEY', false),
  },

  // Feature Flags
  features: {
    analytics:
      getEnvVar('NEXT_PUBLIC_FEATURE_ANALYTICS', false, 'true') === 'true',
  },

  // Runtime information
  runtime: {
    env: getRuntimeEnv(),
    isProduction: getEnvVar('NODE_ENV', false, 'development') === 'production',
    isDevelopment:
      getEnvVar('NODE_ENV', false, 'development') === 'development',
  },
} as const;

/**
 * Validate required environment variables at startup
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  // No required env vars for static site — Resend API key is optional (falls back to test mode)
  return { valid: errors.length === 0, errors };
}

/**
 * Get environment variable safely (returns undefined if not set)
 */
export function getOptionalEnv(key: string): string | undefined {
  try {
    return getEnvVar(key, false);
  } catch {
    return undefined;
  }
}

export const getStripeSecretKey = () => env.stripe.secretKey;
export const getStripeWebhookSecret = () => env.stripe.webhookSecret;
