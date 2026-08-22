import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

describe("D1 SQL Schema & Constraints (SQLite)", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    db.pragma("foreign_keys = ON");

    const sqlMigration = fs.readFileSync(
      path.resolve(__dirname, "../migrations/0000_initial.sql"),
      "utf-8"
    );
    db.exec(sqlMigration);
  });

  it("enforces slug uniqueness on events", () => {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEvent.run("evt_1", "chadamayte", "Chá 1", "Maytê", "Local", "End", "SP", "SP", "2026-10-18T15:30:00Z");

    expect(() => {
      insertEvent.run("evt_2", "chadamayte", "Chá 2", "Maytê", "Local", "End", "SP", "SP", "2026-10-18T15:30:00Z");
    }).toThrow(/UNIQUE constraint failed/i);
  });

  it("enforces check constraint on event status and event type", () => {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, event_type, status, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    expect(() => {
      insertEvent.run("evt_bad", "slug_bad", "Name", "Baby", "INVALID_TYPE", "DRAFT", "V", "A", "C", "S", "2026-10-18");
    }).toThrow(/CHECK constraint failed/i);

    expect(() => {
      insertEvent.run("evt_bad2", "slug_bad2", "Name", "Baby", "DIAPER_SHOWER", "INVALID_STATUS", "V", "A", "C", "S", "2026-10-18");
    }).toThrow(/CHECK constraint failed/i);
  });

  it("enforces foreign key cascade from events to invitations and guests", () => {
    db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES ('evt_1', 'chadamayte', 'Chá Maytê', 'Maytê', 'Local', 'End', 'SP', 'SP', '2026-10-18T15:30:00Z')
    `).run();

    db.prepare(`
      INSERT INTO invitations (id, event_id, display_name, public_token)
      VALUES ('inv_1', 'evt_1', 'Família Oliveira', 'tok_abc123456789012345678')
    `).run();

    db.prepare(`
      INSERT INTO guests (id, invitation_id, name, is_primary)
      VALUES ('gst_1', 'inv_1', 'João Oliveira', 1)
    `).run();

    // Verify presence
    expect(db.prepare("SELECT count(*) as count FROM invitations WHERE id = 'inv_1'").get()).toEqual({ count: 1 });
    expect(db.prepare("SELECT count(*) as count FROM guests WHERE id = 'gst_1'").get()).toEqual({ count: 1 });

    // Delete Event
    db.prepare("DELETE FROM events WHERE id = 'evt_1'").run();

    // Verify cascade deletion
    expect(db.prepare("SELECT count(*) as count FROM invitations WHERE id = 'inv_1'").get()).toEqual({ count: 0 });
    expect(db.prepare("SELECT count(*) as count FROM guests WHERE id = 'gst_1'").get()).toEqual({ count: 0 });
  });

  it("enforces public token uniqueness on invitations", () => {
    db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES ('evt_1', 'chadamayte', 'Chá Maytê', 'Maytê', 'Local', 'End', 'SP', 'SP', '2026-10-18T15:30:00Z')
    `).run();

    const insertInv = db.prepare(`
      INSERT INTO invitations (id, event_id, display_name, public_token)
      VALUES (?, 'evt_1', ?, ?)
    `);

    insertInv.run("inv_1", "Família A", "SAME_TOKEN_1234567890123");

    expect(() => {
      insertInv.run("inv_2", "Família B", "SAME_TOKEN_1234567890123");
    }).toThrow(/UNIQUE constraint failed/i);
  });

  it("enforces UNIQUE(invitation_id) on rsvps (one RSVP per invitation)", () => {
    db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES ('evt_1', 'chadamayte', 'Chá Maytê', 'Maytê', 'Local', 'End', 'SP', 'SP', '2026-10-18T15:30:00Z')
    `).run();

    db.prepare(`
      INSERT INTO invitations (id, event_id, display_name, public_token)
      VALUES ('inv_1', 'evt_1', 'Família Silva', 'token_silva_123456789012')
    `).run();

    const insertRsvp = db.prepare(`
      INSERT INTO rsvps (id, invitation_id, status, contact_name)
      VALUES (?, 'inv_1', 'CONFIRMED', 'Maria Silva')
    `);

    insertRsvp.run("rsvp_1");

    expect(() => {
      insertRsvp.run("rsvp_2");
    }).toThrow(/UNIQUE constraint failed/i);
  });

  it("sets guest_id to NULL on rsvp_members when guest is deleted (SET NULL policy)", () => {
    db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES ('evt_1', 'chadamayte', 'Chá Maytê', 'Maytê', 'Local', 'End', 'SP', 'SP', '2026-10-18T15:30:00Z')
    `).run();

    db.prepare(`
      INSERT INTO invitations (id, event_id, display_name, public_token)
      VALUES ('inv_1', 'evt_1', 'Família Santos', 'token_santos_12345678901')
    `).run();

    db.prepare(`
      INSERT INTO guests (id, invitation_id, name)
      VALUES ('gst_1', 'inv_1', 'Pedro Santos')
    `).run();

    db.prepare(`
      INSERT INTO rsvps (id, invitation_id, status, contact_name)
      VALUES ('rsvp_1', 'inv_1', 'CONFIRMED', 'Pedro Santos')
    `).run();

    db.prepare(`
      INSERT INTO rsvp_members (id, rsvp_id, guest_id, display_name, attendance_status)
      VALUES ('rmb_1', 'rsvp_1', 'gst_1', 'Pedro Santos', 'CONFIRMED')
    `).run();

    // Delete the guest
    db.prepare("DELETE FROM guests WHERE id = 'gst_1'").run();

    // Verify member record is preserved with guest_id = null
    const member = db.prepare("SELECT * FROM rsvp_members WHERE id = 'rmb_1'").get() as { guest_id: string | null };
    expect(member).toBeDefined();
    expect(member.guest_id).toBeNull();
  });

  it("enforces UNIQUE(event_id, section_key) on event_sections", () => {
    db.prepare(`
      INSERT INTO events (id, slug, name, baby_name, venue_name, venue_address, venue_city, venue_state, event_date)
      VALUES ('evt_1', 'chadamayte', 'Chá Maytê', 'Maytê', 'Local', 'End', 'SP', 'SP', '2026-10-18T15:30:00Z')
    `).run();

    const insertSection = db.prepare(`
      INSERT INTO event_sections (id, event_id, section_key, sort_order)
      VALUES (?, 'evt_1', 'hero', ?)
    `);

    insertSection.run("sec_1", 10);

    expect(() => {
      insertSection.run("sec_2", 20);
    }).toThrow(/UNIQUE constraint failed/i);
  });
});