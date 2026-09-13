import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { createD1Mock } from "./helpers/d1Mock";
import { handleApiRequest } from "../worker/routes";
import { EventRepository } from "../worker/repositories/eventRepository";
import { InvitationService } from "../worker/services/invitationService";
import type { Env } from "../worker/types/env";

describe("Worker HTTP API Routes", () => {
  let sqlite: Database.Database;
  let env: Env;
  let invitationService: InvitationService;
  let eventRepo: EventRepository;

  beforeEach(async () => {
    sqlite = new Database(":memory:");
    sqlite.pragma("foreign_keys = ON");

    const migration = fs.readFileSync(
      path.resolve(__dirname, "../migrations/0000_initial.sql"),
      "utf-8"
    );
    sqlite.exec(migration);

    const seed = fs.readFileSync(
      path.resolve(__dirname, "../migrations/seed.sql"),
      "utf-8"
    );
    sqlite.exec(seed);

    const d1 = createD1Mock(sqlite);
    env = {
      DB: d1,
      ADMIN_PASSCODE: "mayte2026",
    };

    invitationService = new InvitationService(d1);
    eventRepo = new EventRepository(d1);
  });

  it("handles /api/health with database available", async () => {
    const req = new Request("http://localhost/api/health", { method: "GET" });
    const res = await handleApiRequest(req, env);
    expect(res.status).toBe(200);

    const data = await res.json() as { ok: boolean; database: string };
    expect(data.ok).toBe(true);
    expect(data.database).toBe("available");
  });

  it("handles /api/invitations/:token successfully", async () => {
    const { invitation } = await invitationService.createInvitationWithGuests(
      "evt_mayte_2026",
      "Família Silva",
      "Querida Família",
      ["Carlos", "Ana"],
      true,
      1
    );

    const req = new Request(`http://localhost/api/invitations/${invitation.publicToken}`, {
      method: "GET",
    });
    const res = await handleApiRequest(req, env);
    expect(res.status).toBe(200);

    const data = await res.json() as { invitation: { displayName: string }; guests: unknown[] };
    expect(data.invitation.displayName).toBe("Família Silva");
    expect(data.guests.length).toBe(2);
  });

  it("returns 404 for nonexistent invitation token", async () => {
    const req = new Request("http://localhost/api/invitations/nonexistent_token_12345", {
      method: "GET",
    });
    const res = await handleApiRequest(req, env);
    expect(res.status).toBe(404);
  });

  it("processes RSVP submission via POST /api/invitations/:token/rsvp", async () => {
    const { invitation, guests } = await invitationService.createInvitationWithGuests(
      "evt_mayte_2026",
      "Casal Oliveira",
      "Caros amigos",
      ["Mariana", "Pedro"]
    );

    const req = new Request(`http://localhost/api/invitations/${invitation.publicToken}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: "Mariana Oliveira",
        contactWhatsapp: "(11) 99999-8888",
        notes: "Estaremos lá com certeza!",
        members: [
          {
            guestId: guests[0].id,
            displayName: "Mariana",
            attendanceStatus: "CONFIRMED",
          },
          {
            guestId: guests[1].id,
            displayName: "Pedro",
            attendanceStatus: "CONFIRMED",
          },
        ],
      }),
    });

    const res = await handleApiRequest(req, env);
    expect(res.status).toBe(200);

    const data = await res.json() as { success: boolean; rsvp: { status: string; guestCount: number } };
    expect(data.success).toBe(true);
    expect(data.rsvp.status).toBe("CONFIRMED");
    expect(data.rsvp.guestCount).toBe(2);
  });

  it("rejects unauthorized access to /api/admin/*", async () => {
    const req = new Request("http://localhost/api/admin/overview", { method: "GET" });
    const res = await handleApiRequest(req, env);
    expect(res.status).toBe(401);
  });

  it("authenticates admin via POST /api/admin/auth/login", async () => {
    const req = new Request("http://localhost/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: "mayte2026" }),
    });

    const res = await handleApiRequest(req, env);
    expect(res.status).toBe(200);

    const data = await res.json() as { success: boolean; token: string };
    expect(data.success).toBe(true);
    expect(data.token).toBe("mayte2026");
  });

  it("fetches admin overview and lists invitations when authorized", async () => {
    const headers = { Authorization: "Bearer mayte2026" };

    // Overview
    const reqOverview = new Request("http://localhost/api/admin/overview", {
      method: "GET",
      headers,
    });
    const resOverview = await handleApiRequest(reqOverview, env);
    expect(resOverview.status).toBe(200);

    // Create Invitation via Admin API
    const reqCreate = new Request("http://localhost/api/admin/invitations", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: "Tia Lúcia",
        salutation: "Querida Tia",
        guestNames: ["Lúcia", "Tio Jorge"],
        allowAdditionalGuests: false,
      }),
    });
    const resCreate = await handleApiRequest(reqCreate, env);
    expect(resCreate.status).toBe(201);

    // List invitations
    const reqList = new Request("http://localhost/api/admin/invitations", {
      method: "GET",
      headers,
    });
    const resList = await handleApiRequest(reqList, env);
    expect(resList.status).toBe(200);
    const list = await resList.json() as Array<{ display_name: string }>;
    expect(list.some((i) => i.display_name === "Tia Lúcia")).toBe(true);
  });
});