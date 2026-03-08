-- Plugin Advisor: shared_combos table
-- Apply this migration in Supabase Dashboard > SQL Editor

CREATE TABLE shared_combos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 100),
  description TEXT CHECK (char_length(description) <= 500),
  plugin_ids TEXT[] NOT NULL CHECK (array_length(plugin_ids, 1) BETWEEN 1 AND 10),
  github_username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_shared_combos_created_at ON shared_combos(created_at DESC);
CREATE INDEX idx_shared_combos_user_id ON shared_combos(user_id);

ALTER TABLE shared_combos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON shared_combos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert"
  ON shared_combos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own combos"
  ON shared_combos FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own combos"
  ON shared_combos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
