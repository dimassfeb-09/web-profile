ALTER TABLE achievements
  ADD COLUMN IF NOT EXISTS event_organizer  TEXT,
  ADD COLUMN IF NOT EXISTS category         TEXT,
  ADD COLUMN IF NOT EXISTS team_members     TEXT[],
  ADD COLUMN IF NOT EXISTS tech_stack       TEXT[],
  ADD COLUMN IF NOT EXISTS problem_statement TEXT,
  ADD COLUMN IF NOT EXISTS solution_overview TEXT,
  ADD COLUMN IF NOT EXISTS credential_url   TEXT;
