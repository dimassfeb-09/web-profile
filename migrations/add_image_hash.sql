-- Add image_hash columns
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS image_hash VARCHAR(16);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_hash VARCHAR(16);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS image_hash VARCHAR(16);
