-- moodang.app Phase 1: Anonymous Data Flywheel
-- Run this in Supabase SQL Editor

-- 1. Readings: persist every analysis result
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  reading_type TEXT NOT NULL CHECK (reading_type IN ('saju', 'gwansang')),
  input_data JSONB NOT NULL,
  precomputed_data JSONB,
  ai_result JSONB NOT NULL,
  fortune_grade TEXT,
  destiny_type_hanja TEXT,
  day_master TEXT,
  celebrity_match TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readings_session ON readings(session_id);
CREATE INDEX IF NOT EXISTS idx_readings_created ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_grade ON readings(fortune_grade);

-- 2. Shares: track every share event
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  share_platform TEXT NOT NULL,
  share_url TEXT,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shares_reading ON shares(reading_id);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON shares(share_platform);

-- 3. Share clicks: track inbound traffic from shared links
CREATE TABLE IF NOT EXISTS share_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID NOT NULL REFERENCES shares(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_share ON share_clicks(share_id);

-- 4. Daily aggregates: pre-computed stats
CREATE TABLE IF NOT EXISTS daily_stats (
  date DATE PRIMARY KEY,
  total_readings INTEGER DEFAULT 0,
  saju_count INTEGER DEFAULT 0,
  gwansang_count INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  grade_distribution JSONB,
  top_destiny_types JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RPC function: increment click count atomically
CREATE OR REPLACE FUNCTION increment_click_count(share_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE shares
  SET click_count = click_count + 1
  WHERE id = share_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS: readings are publicly readable (for share links)
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "readings_public_read" ON readings
  FOR SELECT USING (true);

CREATE POLICY "readings_service_insert" ON readings
  FOR INSERT WITH CHECK (true);

-- Shares/clicks: service role only (no RLS needed for server-only writes)
-- But enable RLS and allow service role through
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shares_public_read" ON shares
  FOR SELECT USING (true);

CREATE POLICY "shares_service_insert" ON shares
  FOR INSERT WITH CHECK (true);

CREATE POLICY "clicks_service_insert" ON share_clicks
  FOR INSERT WITH CHECK (true);

-- daily_stats: public read
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stats_public_read" ON daily_stats
  FOR SELECT USING (true);

CREATE POLICY "stats_service_write" ON daily_stats
  FOR ALL WITH CHECK (true);
