import { useQuery } from "@tanstack/react-query";

import { coerceRuntimeUiConfig, DEFAULT_RUNTIME_UI_CONFIG, type RuntimeUiConfig } from "./runtime-ui-config";

type UiConfigResponse =
  | {
      config: RuntimeUiConfig;
      source: "edge-config" | "file" | "default";
      timestamp: string;
    }
  | { error: string };

async function fetchRuntimeUiConfig(): Promise<RuntimeUiConfig> {
  const res = await fetch("/api/ui-config", {
    method: "GET",
    credentials: "same-origin",
  });

  if (!res.ok) {
    return DEFAULT_RUNTIME_UI_CONFIG;
  }

  const data = (await res.json()) as UiConfigResponse;
  if (!("config" in data)) {
    return DEFAULT_RUNTIME_UI_CONFIG;
  }
  return coerceRuntimeUiConfig(data.config);
}

export function useRuntimeUiConfig() {
  return useQuery({
    queryKey: ["runtime-ui-config"],
    queryFn: fetchRuntimeUiConfig,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: DEFAULT_RUNTIME_UI_CONFIG,
  });
}

