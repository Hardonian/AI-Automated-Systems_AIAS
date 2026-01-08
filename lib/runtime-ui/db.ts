import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { coerceRuntimeUiConfig, type RuntimeUiConfig } from "@/lib/runtime-ui/runtime-ui-config";

type DbRow = {
  key: string;
  config: unknown;
  updated_at?: string;
};

function getServiceClient() {
  const url = env.supabase.url;
  const key = env.supabase.serviceRoleKey;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function isPlaceholderEnv(): boolean {
  const url = env.supabase.url;
  const key = env.supabase.serviceRoleKey;
  return url.includes("placeholder") || key.includes("placeholder");
}

export async function readRuntimeUiConfigFromDb(): Promise<{
  config: RuntimeUiConfig | null;
  updatedAt?: string;
}> {
  try {
    // Avoid noisy network calls in build/test placeholder environments
    if (isPlaceholderEnv()) {
      return { config: null };
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("runtime_ui_config")
      .select("key, config, updated_at")
      .eq("key", "public")
      .maybeSingle();

    if (error) {
      logger.warn("Failed to read runtime_ui_config from DB", {
        component: "runtime-ui",
        error: (error as any)?.message ?? String(error),
      });
      return { config: null };
    }
    if (!data) {
      return { config: null };
    }

    const row = data as unknown as DbRow;
    return { config: coerceRuntimeUiConfig(row.config), updatedAt: row.updated_at };
  } catch (error) {
    logger.warn("Runtime UI config DB read failed", {
      component: "runtime-ui",
      error: error instanceof Error ? error.message : String(error),
    });
    return { config: null };
  }
}

export async function writeRuntimeUiConfigToDb(input: unknown): Promise<{
  ok: boolean;
  updatedAt?: string;
}> {
  try {
    if (isPlaceholderEnv()) {
      return { ok: false };
    }

    const supabase = getServiceClient();
    const config = coerceRuntimeUiConfig(input);
    const { data, error } = await supabase
      .from("runtime_ui_config")
      .upsert({ key: "public", config }, { onConflict: "key" })
      .select("updated_at")
      .single();

    if (error) {
      logger.error("Failed to write runtime_ui_config to DB", error as any, { component: "runtime-ui" });
      return { ok: false };
    }
    return { ok: true, updatedAt: (data as any)?.updated_at };
  } catch (error) {
    logger.error("Runtime UI config DB write failed", error as any, { component: "runtime-ui" });
    return { ok: false };
  }
}

