-- =============================================================================
-- Migration: 0000_initial.sql
-- Project: Chá de Bebê da Maytê (mayte-baby-shower)
-- Engine: Cloudflare D1 (SQLite)
-- Phase: 2A — Domain + D1 Schema Foundation
-- =============================================================================

PRAGMA foreign_keys = ON;

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  baby_name TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'DIAPER_SHOWER' CHECK(event_type IN ('BABY_SHOWER', 'DIAPER_SHOWER', 'BIRTHDAY', 'OTHER')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  event_date TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_city TEXT NOT NULL,
  venue_state TEXT NOT NULL,
  venue_postal_code TEXT,
  map_url TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- 2. Invitations Table
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  salutation TEXT,
  public_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('DRAFT', 'ACTIVE', 'REVOKED', 'EXPIRED')),
  allow_additional_guests INTEGER NOT NULL DEFAULT 0 CHECK(allow_additional_guests IN (0, 1)),
  max_additional_guests INTEGER NOT NULL DEFAULT 0 CHECK(max_additional_guests >= 0),
  notes_internal TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  revoked_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_token ON invitations(public_token);
CREATE INDEX IF NOT EXISTS idx_invitations_event_id ON invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

-- 3. Guests Table (Nominal guests per invitation)
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  guest_type TEXT NOT NULL DEFAULT 'ADULT' CHECK(guest_type IN ('ADULT', 'CHILD', 'BABY')),
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK(is_primary IN (0, 1)),
  is_named_guest INTEGER NOT NULL DEFAULT 1 CHECK(is_named_guest IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_sort_order ON guests(invitation_id, sort_order);

-- 4. RSVPs Table (One per invitation)
CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'CONFIRMED', 'DECLINED', 'PARTIAL')),
  contact_name TEXT NOT NULL,
  contact_whatsapp TEXT,
  guest_count INTEGER NOT NULL DEFAULT 0 CHECK(guest_count >= 0),
  additional_guest_count INTEGER NOT NULL DEFAULT 0 CHECK(additional_guest_count >= 0),
  notes TEXT,
  submitted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CONSTRAINT uq_rsvps_invitation UNIQUE (invitation_id)
);

CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);

-- 5. RSVP Members Table (Individual attendance decisions)
CREATE TABLE IF NOT EXISTS rsvp_members (
  id TEXT PRIMARY KEY,
  rsvp_id TEXT NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
  guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK(attendance_status IN ('CONFIRMED', 'DECLINED')),
  is_additional_guest INTEGER NOT NULL DEFAULT 0 CHECK(is_additional_guest IN (0, 1)),
  guest_type TEXT NOT NULL DEFAULT 'ADULT' CHECK(guest_type IN ('ADULT', 'CHILD', 'BABY')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_rsvp_members_rsvp_id ON rsvp_members(rsvp_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_members_guest_id ON rsvp_members(guest_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_members_attendance ON rsvp_members(attendance_status);

-- 6. Media Uploads Table (R2 Metadata only)
CREATE TABLE IF NOT EXISTS media_uploads (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  invitation_id TEXT REFERENCES invitations(id) ON DELETE SET NULL,
  r2_key TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK(file_size > 0),
  upload_type TEXT NOT NULL CHECK(upload_type IN ('GUEST_PHOTO', 'EVENT_ASSET', 'LOGO', 'GALLERY')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'AVAILABLE', 'REJECTED', 'DELETED')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_uploads_r2_key ON media_uploads(r2_key);
CREATE INDEX IF NOT EXISTS idx_media_uploads_event ON media_uploads(event_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_invitation ON media_uploads(invitation_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_status ON media_uploads(status);

-- 7. Event Sections Table (Modular layout ordering and toggles)
CREATE TABLE IF NOT EXISTS event_sections (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  config_json TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CONSTRAINT uq_event_sections_key UNIQUE (event_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_event_sections_order ON event_sections(event_id, sort_order);

-- 8. Event Settings Table (Key-value non-relational event configuration)
CREATE TABLE IF NOT EXISTS event_settings (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CONSTRAINT uq_event_settings_key UNIQUE (event_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_event_settings_key ON event_settings(event_id, setting_key);

-- 9. Audit Logs Table (Operational & Security Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('ADMIN', 'GUEST', 'SYSTEM')),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);