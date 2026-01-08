import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { isEdgeConfigAvailable, getEdgeConfigValue } from "@/lib/config/edge-config";
import { coerceRuntimeUiConfig, DEFAULT_RUNTIME_UI_CONFIG, type RuntimeUiConfig } from "@/lib/runtime-ui/runtime-ui-config";

export type RuntimeUiConfigSource = "edge-config" | "file" | "default";

export async function getPublicRuntimeUiConfig(): Promise<{
  config: RuntimeUiConfig;
  source: RuntimeUiConfigSource;
}> {
  // Preferred: Edge Config (editable without redeploy)
  if (isEdgeConfigAvailable()) {
    const raw = await getEdgeConfigValue<unknown>("ui:public");
    return {
      config: coerceRuntimeUiConfig(raw ?? DEFAULT_RUNTIME_UI_CONFIG),
      source: "edge-config",
    };
  }

  // Local/dev fallback: config file
  const filePath = join(process.cwd(), "config", "ui-config.json");
  if (existsSync(filePath)) {
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as unknown;
    return { config: coerceRuntimeUiConfig(raw), source: "file" };
  }

  return { config: DEFAULT_RUNTIME_UI_CONFIG, source: "default" };
}

