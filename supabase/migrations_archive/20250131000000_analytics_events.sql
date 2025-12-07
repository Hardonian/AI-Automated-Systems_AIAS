-- Analytics Events Table for Experiment Tracking
-- Created: 2025-01-31
-- Purpose: Store experiment events for pricing and offer tests

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  user_id UUID,
  session_id TEXT,
  variant TEXT,
  experiment_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_experiment_id ON analytics_events(experiment_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_variant ON analytics_events(variant);

-- Composite index for experiment analysis
CREATE INDEX IF NOT EXISTS idx_analytics_events_experiment_variant ON analytics_events(experiment_id, variant, timestamp);

-- Experiment Metrics View (for dashboard queries)
CREATE OR REPLACE VIEW experiment_metrics AS
SELECT 
  experiment_id,
  variant,
  event_name,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as event_count,
  DATE_TRUNC('day', timestamp) as date,
  AVG((properties->>'price')::numeric) as avg_price,
  AVG((properties->>'days_since_signup')::numeric) as avg_days_since_signup
FROM analytics_events
WHERE experiment_id IS NOT NULL
GROUP BY experiment_id, variant, event_name, DATE_TRUNC('day', timestamp);

-- RLS Policies (if using Row Level Security)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own events
CREATE POLICY "Users can view own events" ON analytics_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can insert events
CREATE POLICY "Service role can insert events" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service role can view all events (for analytics)
CREATE POLICY "Service role can view all events" ON analytics_events
  FOR SELECT
  USING (true);

COMMENT ON TABLE analytics_events IS 'Stores experiment tracking events for pricing and offer tests';
COMMENT ON COLUMN analytics_events.event_name IS 'Event name (e.g., PricingPageViewed, PlanSelected)';
COMMENT ON COLUMN analytics_events.properties IS 'Event properties as JSONB';
COMMENT ON COLUMN analytics_events.variant IS 'Experiment variant assignment';
COMMENT ON COLUMN analytics_events.experiment_id IS 'Experiment ID (e.g., exp_price_starter)';
