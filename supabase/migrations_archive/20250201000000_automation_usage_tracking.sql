-- Migration: Automation Usage Tracking
-- Purpose: Track automation usage per user per month for rate limiting
-- Created: 2025-02-01

-- Automation usage tracking table
CREATE TABLE IF NOT EXISTS public.automation_usage (
  id text PRIMARY KEY, -- Format: usage:{user_id}:{YYYY-MM}
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  month text NOT NULL, -- Format: YYYY-MM
  limit integer NOT NULL DEFAULT 100,
  used integer NOT NULL DEFAULT 0,
  remaining integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_automation_usage_user_month ON public.automation_usage(user_id, month);
CREATE INDEX IF NOT EXISTS idx_automation_usage_month ON public.automation_usage(month);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_automation_usage_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_automation_usage_updated_at
  BEFORE UPDATE ON public.automation_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_usage_updated_at();

-- RLS Policies
ALTER TABLE public.automation_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own usage"
  ON public.automation_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert/update usage (via service role)
CREATE POLICY "Service role can manage usage"
  ON public.automation_usage
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to get current month usage
CREATE OR REPLACE FUNCTION get_user_automation_usage(p_user_id uuid)
RETURNS TABLE (
  plan text,
  month text,
  limit integer,
  used integer,
  remaining integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_month text;
BEGIN
  v_month := to_char(CURRENT_DATE, 'YYYY-MM');
  
  RETURN QUERY
  SELECT 
    au.plan,
    au.month,
    au.limit,
    au.used,
    au.remaining
  FROM public.automation_usage au
  WHERE au.user_id = p_user_id
    AND au.month = v_month
  LIMIT 1;
  
  -- If no record exists, return default
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      'free'::text,
      v_month,
      100::integer,
      0::integer,
      100::integer;
  END IF;
END;
$$;
