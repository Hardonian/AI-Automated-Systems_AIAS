import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://aiautomatedsystems.ca'),
  NEXT_PUBLIC_APP_ENV: z.enum(['local', 'preview', 'production']).default('production'),
  NEXT_PUBLIC_GOOGLE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_YANDEX_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_YAHOO_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: z.enum(['none', 'vercel']).default('none'),
});

const serverEnvSchema = z.object({
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  VERCEL: z.string().optional(),
});

const runtimeEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_GOOGLE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  NEXT_PUBLIC_YANDEX_VERIFICATION: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  NEXT_PUBLIC_YAHOO_VERIFICATION: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL: process.env.VERCEL,
};

const parsedPublic = publicEnvSchema.safeParse(runtimeEnv);
const parsedServer = serverEnvSchema.safeParse(runtimeEnv);

export const env = {
  app: {
    siteUrl: parsedPublic.success
      ? parsedPublic.data.NEXT_PUBLIC_SITE_URL
      : 'https://aiautomatedsystems.ca',
  },
  monitoring: {
    logLevel: 'info' as const,
  },
};

export const getOptionalEnv = (key: string): string | undefined => process.env[key];

export type EnvMode = 'local' | 'preview' | 'production';

const modeRequirements: Record<EnvMode, { public: string[]; server: string[] }> = {
  local: {
    public: [],
    server: [],
  },
  preview: {
    public: [],
    server: [],
  },
  production: {
    public: [],
    server: [],
  },
};

export function validateEnvMode(mode: EnvMode): {
  valid: boolean;
  missing: string[];
  invalid: string[];
} {
  const requirements = modeRequirements[mode];
  const missing = [...requirements.public, ...requirements.server].filter(
    (key) => !process.env[key],
  );

  const invalid: string[] = [];
  if (!parsedPublic.success) {
    invalid.push(...parsedPublic.error.issues.map((issue) => issue.path.join('.')));
  }
  if (!parsedServer.success) {
    invalid.push(...parsedServer.error.issues.map((issue) => issue.path.join('.')));
  }

  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}

export const envSchemas = {
  publicEnvSchema,
  serverEnvSchema,
};
