-- Plugin Reviews Table
CREATE TABLE IF NOT EXISTS plugin_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plugin_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '익명',
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '' CHECK (char_length(comment) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plugin_id, user_id)
);

-- RLS
ALTER TABLE plugin_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "reviews_select" ON plugin_reviews
  FOR SELECT USING (true);

-- Authenticated users can insert their own
CREATE POLICY "reviews_insert" ON plugin_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "reviews_update" ON plugin_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "reviews_delete" ON plugin_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_reviews_plugin_id ON plugin_reviews(plugin_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON plugin_reviews(user_id);
