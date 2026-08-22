import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { createD1Mock } from "./helpers/d1Mock";
import { InvitationService } from "../worker/services/invitationService";
import { RsvpService } from "../worker/services/rsvpService";
import { EventRepository } from "../worker/repositories/eventRepository";

describe("Domain Services (Invitation & RSVP)", () => {
  let sqlite: Database.Database;
  let d1: D1Database;
  let invitationService: InvitationService;
  let rsvpService: RsvpService;
  let eventRepo: EventRepository;

  beforeEach(() => {
    sqlite = new Database(":memory:");
    sqlite.pragma("foreign_keys = ON");

    const sqlMigration = fs.readFileSync(
      path.resolve(__dirname, "../migrations/0000_initial.sql"),
      "utf-8"
    );
    sqlite.exec(sqlMigration);

    d1 = createD1Mock(sqlite);
    invitationService = new InvitationService(d1);
    rsvpService = new RsvpService(d1);
    eventRepo = new EventRepository(d1);
  });

  it("creates an invitation with nominal guests and retrieves it by public token", async () => {
    const event = await eventRepo.create({
      slug: "chadamayte",
      name: "Chá da Maytê",
      babyName: "Maytê",
      eventDate: "2026-10-18T15:30:00Z",
      venueName: "Espaço Jardim",
      venueAddress: "Rua A, 100",
      venueCity: "São Paulo",
      venueState: "SP",
    });

    const { invitation, guests } = await invitationService.createInvitationWithGuests(
      event.id,
      "Família Silva",
      "Querida Família Silva",
      ["Carlos Silva", "Ana Silva", "Enzo Silva"],
      true,
      1
    );

    expect(invitation.id).toBeDefined();
    expect(invitation.publicToken).toBeDefined();
    expect(guests.length).toBe(3);
    expect(guests[0].isPrimary).toBe(true);

    const retrieved = await invitationService.getByToken(invitation.publicToken);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.invitation.displayName).toBe("Família Silva");
    expect(retrieved?.guests.length).toBe(3);
    expect(retrieved?.rsvp).toBeNull();
  });

  it("rejects RSVP with additional guests when not permitted by invitation", async () => {
    const event = await eventRepo.create({
      slug: "chadamayte",
      name: "Chá da Maytê",
      babyName: "Maytê",
      eventDate: "2026-10-18T15:30:00Z",
      venueName: "Espaço Jardim",
      venueAddress: "Rua A, 100",
      venueCity: "São Paulo",
      venueState: "SP",
    });

    // Invitation without additional guests allowed
    const { invitation, guests } = await invitationService.createInvitationWithGuests(
      event.id,
      "Lucas Mendes",
      "Caro Lucas",
      ["Lucas Mendes"],
      false, // allowAdditionalGuests = false
      0
    );

    await expect(
      rsvpService.processRsvp({
        invitationId: invitation.id,
        contactName: "Lucas Mendes",
        members: [
          {
            guestId: guests[0].id,
            displayName: "Lucas Mendes",
            attendanceStatus: "CONFIRMED",
          },
          {
            displayName: "Amigo do Lucas",
            attendanceStatus: "CONFIRMED",
            isAdditionalGuest: true,
          },
        ],
      })
    ).rejects.toThrow(/Additional guests are not permitted/i);
  });

  it("rejects RSVP when additional guests exceed allowed max count", async () => {
    const event = await eventRepo.create({
      slug: "chadamayte",
      name: "Chá da Maytê",
      babyName: "Maytê",
      eventDate: "2026-10-18T15:30:00Z",
      venueName: "Espaço Jardim",
      venueAddress: "Rua A, 100",
      venueCity: "São Paulo",
      venueState: "SP",
    });

    // Invitation with max 1 additional guest
    const { invitation, guests } = await invitationService.createInvitationWithGuests(
      event.id,
      "Fernanda Lima",
      "Querida Fernanda",
      ["Fernanda Lima"],
      true,
      1 // max 1
    );

    await expect(
      rsvpService.processRsvp({
        invitationId: invitation.id,
        contactName: "Fernanda Lima",
        members: [
          {
            guestId: guests[0].id,
            displayName: "Fernanda Lima",
            attendanceStatus: "CONFIRMED",
          },
          {
            displayName: "Acompanhante 1",
            attendanceStatus: "CONFIRMED",
            isAdditionalGuest: true,
          },
          {
            displayName: "Acompanhante 2",
            attendanceStatus: "CONFIRMED",
            isAdditionalGuest: true,
          },
        ],
      })
    ).rejects.toThrow(/Maximum additional guests exceeded/i);
  });

  it("successfully processes RSVP with partial attendance and logs audit record", async () => {
    const event = await eventRepo.create({
      slug: "chadamayte",
      name: "Chá da Maytê",
      babyName: "Maytê",
      eventDate: "2026-10-18T15:30:00Z",
      venueName: "Espaço Jardim",
      venueAddress: "Rua A, 100",
      venueCity: "São Paulo",
      venueState: "SP",
    });

    const { invitation, guests } = await invitationService.createInvitationWithGuests(
      event.id,
      "Casal Ramos",
      "Caros amigos",
      ["Rodrigo Ramos", "Carla Ramos"],
      false,
      0
    );

    const result = await rsvpService.processRsvp({
      invitationId: invitation.id,
      contactName: "Rodrigo Ramos",
      contactWhatsapp: "(11) 98765-4321",
      notes: "Mal posso esperar!",
      members: [
        {
          guestId: guests[0].id,
          displayName: "Rodrigo Ramos",
          attendanceStatus: "CONFIRMED",
        },
        {
          guestId: guests[1].id,
          displayName: "Carla Ramos",
          attendanceStatus: "DECLINED",
        },
      ],
    });

    expect(result.rsvp.status).toBe("PARTIAL");
    expect(result.rsvp.guestCount).toBe(1);
    expect(result.members.length).toBe(2);

    // Verify Audit log was created in DB
    const auditRows = sqlite.prepare("SELECT * FROM audit_logs WHERE event_id = ?").all(event.id);
    expect(auditRows.length).toBe(1);
    expect((auditRows[0] as { action: string }).action).toBe("RSVP_SUBMITTED");
  });
});