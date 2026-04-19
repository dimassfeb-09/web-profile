-- Migration: Add project detail fields to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS slug            VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS tech_stack      TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS screenshots     TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status          VARCHAR(50) DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS date            DATE,
  ADD COLUMN IF NOT EXISTS external_links  JSONB    DEFAULT '{}';

-- Seed slugs for existing projects (adjust ILIKE patterns if titles differ)
UPDATE projects SET slug = 'keuanganku'   WHERE title ILIKE '%keuanganku%' AND slug IS NULL;
UPDATE projects SET slug = 'warung-digital' WHERE title ILIKE '%warung%'   AND slug IS NULL;
UPDATE projects SET slug = 'sima'          WHERE title ILIKE '%sima%'       AND slug IS NULL;
