-- =============================================================================
-- Seed: seed.sql (Local Development Seed Only)
-- Project: Chá de Bebê da Maytê (mayte-baby-shower)
-- =============================================================================

INSERT OR IGNORE INTO events (
  id,
  slug,
  name,
  baby_name,
  event_type,
  status,
  event_date,
  timezone,
  venue_name,
  venue_address,
  venue_city,
  venue_state,
  venue_postal_code,
  map_url
) VALUES (
  'evt_mayte_2026',
  'chadamayte',
  'Chá de Fraldas da Maytê',
  'Maytê',
  'DIAPER_SHOWER',
  'PUBLISHED',
  '2026-10-18T15:30:00Z',
  'America/Sao_Paulo',
  'Espaço Jardim das Flores',
  'Av. das Rosas, 1234 — Salão Nobre',
  'São Paulo',
  'SP',
  '01000-000',
  ''
);

INSERT OR IGNORE INTO event_sections (id, event_id, section_key, enabled, sort_order, config_json) VALUES
  ('sec_hero', 'evt_mayte_2026', 'hero', 1, 10, '{"scrollHint": "Deslize para ver o convite"}'),
  ('sec_welcome', 'evt_mayte_2026', 'welcome', 1, 20, '{"badge": "❤️ Queridos amigos e familiares ❤️"}'),
  ('sec_details', 'evt_mayte_2026', 'event_details', 1, 30, '{"showMapButton": true}'),
  ('sec_countdown', 'evt_mayte_2026', 'countdown', 1, 40, '{"unit": "seconds"}'),
  ('sec_rsvp', 'evt_mayte_2026', 'rsvp', 1, 50, '{"requireWhatsapp": true}'),
  ('sec_memories', 'evt_mayte_2026', 'memories', 1, 60, '{"allowUpload": true}'),
  ('sec_gifts', 'evt_mayte_2026', 'gifts', 1, 70, '{"showPix": true}'),
  ('sec_closing', 'evt_mayte_2026', 'closing', 1, 80, '{"signature": "Família da Maytê"}');

INSERT OR IGNORE INTO event_settings (id, event_id, setting_key, value_json) VALUES
  ('set_theme', 'evt_mayte_2026', 'theme', '{"primary": "#e28299", "accent": "#d4af37", "style": "floral_royal"}'),
  ('set_rsvp_deadline', 'evt_mayte_2026', 'rsvp_deadline', '{"deadlineDate": "2026-10-05T23:59:59Z"}');