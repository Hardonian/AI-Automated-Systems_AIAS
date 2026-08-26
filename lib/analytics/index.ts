"use client";

type AnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface AnalyticsAdapter {
  track: (event: string, payload?: AnalyticsPayload) => void;
}

const noopAdapter: AnalyticsAdapter = {
  track: () => undefined,
};

const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";

const vercelAdapter: AnalyticsAdapter = {
  track: (event, payload) => {
    void import("@vercel/analytics")
      .then((mod) => {
        mod.track(event, payload);
      })
      .catch(() => undefined);
  },
};

const adapter: AnalyticsAdapter =
  provider === "vercel" ? vercelAdapter : noopAdapter;

export function track(event: string, payload?: AnalyticsPayload) {
  adapter.track(event, payload);
}
