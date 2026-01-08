-- ============================================================================
-- Runtime UI Config (public, editable without rebuilds)
-- Date: 2026-01-08
--
-- Purpose:
-- - Store a small, public-safe UI configuration payload (JSONB) that can be edited
--   at runtime (no rebuilds) while keeping write access restricted.
--
-- Security model:
-- - RLS enabled with no policies (no direct client reads/writes).
-- - Access is intended via server-side service role only, through app routes that
--   enforce admin authorization.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.runtime_ui_config (
  key TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.runtime_ui_config ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.triggers
    WHERE trigger_name = 'update_runtime_ui_config_updated_at'
  ) THEN
    CREATE TRIGGER update_runtime_ui_config_updated_at
    BEFORE UPDATE ON public.runtime_ui_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

