-- Migration: Add created_at column to projects table
-- Purpose: Support sorting by newest/oldest
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
