ALTER TABLE achievements ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

CREATE TABLE IF NOT EXISTS achievement_slug_history (
  id SERIAL PRIMARY KEY,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  old_slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Note: The slug column will be populated via a Node.js script to handle duplicates properly.
-- After backfilling, the following queries will be run:
-- ALTER TABLE achievements ALTER COLUMN slug SET NOT NULL;
-- ALTER TABLE achievements ADD CONSTRAINT achievements_slug_unique UNIQUE (slug);
-- CREATE INDEX idx_achievements_slug ON achievements(slug);
