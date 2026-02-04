-- Funnel metrics RPC and index for analytics performance

CREATE INDEX IF NOT EXISTS idx_app_events_stage_timestamp
  ON public.app_events (event_type, (meta->>'stage'), created_at DESC);

CREATE OR REPLACE FUNCTION public.get_funnel_metrics(start_ts timestamptz)
RETURNS TABLE (
  signup bigint,
  onboarding_start bigint,
  integration_connect bigint,
  workflow_create bigint,
  workflow_execute bigint,
  activated bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
    SELECT
      COUNT(*) FILTER (WHERE event_type = 'funnel_stage' AND meta->>'stage' = 'signup') AS signup,
      COUNT(*) FILTER (WHERE event_type = 'funnel_stage' AND meta->>'stage' = 'onboarding_start') AS onboarding_start,
      COUNT(*) FILTER (WHERE event_type = 'funnel_stage' AND meta->>'stage' = 'integration_connect') AS integration_connect,
      COUNT(*) FILTER (WHERE event_type = 'funnel_stage' AND meta->>'stage' = 'workflow_create') AS workflow_create,
      COUNT(*) FILTER (WHERE event_type = 'funnel_stage' AND meta->>'stage' = 'workflow_execute') AS workflow_execute,
      COUNT(*) FILTER (WHERE event_type = 'funnel_stage' AND meta->>'stage' = 'activated') AS activated
    FROM public.app_events
    WHERE created_at >= start_ts;
END;
$$;
