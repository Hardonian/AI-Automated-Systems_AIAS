/**
 * Sentry Edge Configuration
 * Initialize Sentry for edge runtime error tracking
 * Optional: Only initializes if @sentry/nextjs is installed and DSN is configured
 */

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require("@sentry/nextjs");
  
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      beforeSend(event: unknown) {
        // Filter out sensitive data
        if (event && typeof event === 'object' && 'request' in event) {
          const req = (event as { request?: { cookies?: unknown; headers?: Record<string, unknown> } }).request;
          if (req) {
            delete req.cookies;
            if (req.headers) {
              delete req.headers["authorization"];
              delete req.headers["cookie"];
            }
          }
        }
        return event;
      },
    });
  }
} catch {
  // @sentry/nextjs not installed, skip initialization
}
