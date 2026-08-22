-- Schema Baseline for Chá de Bebê da Maytê (mayte-baby-shower)
-- Cloudflare D1 SQL Schema

-- Future tables to be configured in subsequent phases:
-- 1. settings (CMS & visual customizations)
-- 2. guests (guest list and invitations)
-- 3. rsvp_submissions (responses & plus-ones)
-- 4. media_assets (uploaded photos & media metadata)

CREATE TABLE IF NOT EXISTS system_info (
  id TEXT PRIMARY KEY,
  app_name TEXT NOT NULL,
  version TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO system_info (id, app_name, version)
VALUES ('app', 'mayte-baby-shower', '0.1.0');
