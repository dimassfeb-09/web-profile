-- MCP API keys for the /mcp endpoint.
-- Run once in the Supabase SQL editor (this repo has no migration runner).
--
-- The raw key is NEVER stored: only its SHA-256 hash. SHA-256 (not bcrypt/argon2) is
-- correct here because the key carries 256 bits of entropy, so there is nothing to
-- brute-force offline. A slow KDF would only add latency to every MCP request.

CREATE TABLE IF NOT EXISTS mcp_api_keys (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  -- First 12 chars of the key ("wp_live_a1b2"). Safe to display in a UI; identifies
  -- the key in logs and lets auth narrow to one row before the constant-time compare.
  prefix       TEXT        NOT NULL UNIQUE,
  token_hash   TEXT        NOT NULL,
  scope        TEXT        NOT NULL DEFAULT 'read_write' CHECK (scope IN ('read', 'read_write')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  revoked_at   TIMESTAMPTZ
);

-- UNIQUE on prefix already provides the index auth needs for its lookup, so no
-- extra index is required.
COMMENT ON TABLE  mcp_api_keys            IS 'Hashed API keys for the MCP CRUD endpoint at /mcp';
COMMENT ON COLUMN mcp_api_keys.token_hash IS 'sha256 hex of the raw key. The raw key is shown once and never persisted.';
COMMENT ON COLUMN mcp_api_keys.prefix     IS 'Non-secret 12-char key prefix used for lookup and display';