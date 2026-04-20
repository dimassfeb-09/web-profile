-- ============================================================
-- Migration: Add Full-Text Search vector to blogs table
-- Run this in the Supabase SQL Editor or via migration tooling
-- ============================================================

-- Step 1: Add the tsvector column (nullable initially for safe migration)
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Step 2: Create GIN index for fast FTS lookups
CREATE INDEX IF NOT EXISTS idx_blogs_search_vector
  ON blogs USING GIN (search_vector);

-- Step 3: Create helper function to extract plain text from Tiptap JSON content
-- Tiptap stores content as JSONB. This function recursively extracts text nodes.
CREATE OR REPLACE FUNCTION extract_tiptap_text(content jsonb)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result text := '';
  node   jsonb;
BEGIN
  -- Direct text node
  IF content->>'type' = 'text' THEN
    RETURN coalesce(content->>'text', '');
  END IF;

  -- Recurse into content array
  IF jsonb_typeof(content->'content') = 'array' THEN
    FOR node IN SELECT * FROM jsonb_array_elements(content->'content')
    LOOP
      result := result || ' ' || extract_tiptap_text(node);
    END LOOP;
  END IF;

  RETURN trim(result);
END;
$$;

-- Step 4: Create the trigger function that computes search_vector
CREATE OR REPLACE FUNCTION blogs_search_vector_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  raw_content_text text;
BEGIN
  -- Extract plain text from Tiptap JSONB content
  raw_content_text := extract_tiptap_text(NEW.content);

  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')),   'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(raw_content_text, '')), 'C');

  RETURN NEW;
END;
$$;

-- Step 5: Attach trigger to the blogs table
DROP TRIGGER IF EXISTS blogs_search_vector_trigger ON blogs;

CREATE TRIGGER blogs_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, excerpt, content
  ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION blogs_search_vector_update();

-- Step 6: One-time backfill for all existing rows
UPDATE blogs
SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')),   'A') ||
  setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(extract_tiptap_text(content), '')), 'C');
