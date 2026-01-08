import { z } from "zod";

export const RuntimeUiConfigSchema = z
  .object({
    version: z.literal(1),
    tokens: z
      .object({
        radiusRem: z.number().min(0).max(4),
        cardShadow: z.string().min(0).max(256),
        density: z.enum(["comfortable", "compact"]),
      })
      .partial(),
    flags: z
      .object({
        stickyCtaEnabled: z.boolean(),
      })
      .partial(),
    notices: z
      .object({
        topBanner: z
          .object({
            enabled: z.boolean(),
            tone: z.enum(["info", "success", "warning", "danger"]),
            message: z.string().max(240),
            cta: z
              .object({
                label: z.string().max(48),
                href: z.string().max(512),
              })
              .partial()
              .optional(),
          })
          .partial(),
      })
      .partial(),
    copy: z
      .object({
        stickyCta: z
          .object({
            heading: z.string().max(80),
            items: z.array(z.string().max(80)).max(5),
            primaryCta: z
              .object({
                label: z.string().max(48),
                href: z.string().max(512),
              })
              .partial(),
            dismissible: z.boolean(),
            showCountdown: z.boolean(),
            showAfterScrollPx: z.number().int().min(0).max(5000),
          })
          .partial(),
      })
      .partial(),
  })
  // Allow unknown keys so config can be extended safely without breaking older clients.
  .passthrough();

export type RuntimeUiConfig = z.infer<typeof RuntimeUiConfigSchema>;

export const DEFAULT_RUNTIME_UI_CONFIG: RuntimeUiConfig = {
  version: 1,
  tokens: {
    radiusRem: 0.5,
    cardShadow: "0 6px 24px rgba(0,0,0,0.08)",
    density: "comfortable",
  },
  flags: {
    stickyCtaEnabled: true,
  },
  notices: {
    topBanner: {
      enabled: false,
      tone: "info",
      message: "",
      cta: {
        label: "Learn more",
        href: "/demo",
      },
    },
  },
  copy: {
    stickyCta: {
      heading: "Ready to Transform Your Business?",
      items: ["Schedule a free strategy call", "See our builds"],
      primaryCta: { label: "Schedule Call", href: "/demo" },
      dismissible: true,
      showCountdown: true,
      showAfterScrollPx: 400,
    },
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T extends Record<string, any>>(base: T, patch: Record<string, any>): T {
  const out: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      continue;
    }
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key], value);
      continue;
    }
    out[key] = value;
  }
  return out as T;
}

export function coerceRuntimeUiConfig(input: unknown): RuntimeUiConfig {
  const parsed = RuntimeUiConfigSchema.safeParse(input);
  if (!parsed.success) {
    return DEFAULT_RUNTIME_UI_CONFIG;
  }
  // Merge over defaults so missing keys always have safe values.
  return deepMerge(DEFAULT_RUNTIME_UI_CONFIG, parsed.data as any);
}

