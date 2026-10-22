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

  it("authenticates admin via POST /api/admin/auth/login with encrypted credentials", async () => {
    // 1. Login com Email e Senha Criptografada dos Papais
    const reqParents = new Request("http://localhost/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "rickmateus2021@gmail.com", password: "@Durafa10" }),
    });

    const resParents = await handleApiRequest(reqParents, env);
    expect(resParents.status).toBe(200);

    const dataParents = await resParents.json() as { success: boolean; token: string; user?: { email: string } };
    expect(dataParents.success).toBe(true);
    expect(dataParents.token).toContain("mayte_sec_");
    expect(dataParents.user?.email).toBe("rickmateus2021@gmail.com");

    // 2. Rejeição de senha incorreta
    const reqWrong = new Request("http://localhost/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "rickmateus2021@gmail.com", password: "wrong-password" }),
    });
    const resWrong = await handleApiRequest(reqWrong, env);
    expect(resWrong.status).toBe(401);
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

  it("handles public RSVP via POST /api/invitations/public-rsvp and exposes notes in /api/public/event-info", async () => {
    const reqPublicRsvp = new Request("http://localhost/api/invitations/public-rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: "Madrinha Fernanda",
        contactWhatsapp: "(11) 98888-7777",
        notes: "Que a princesa Maytê venha cheia de saúde!",
        attendanceStatus: "CONFIRMED",
        additionalGuests: [{ displayName: "Tio Bruno", guestType: "ADULT" }],
      }),
    });

    const resRsvp = await handleApiRequest(reqPublicRsvp, env);
    expect(resRsvp.status).toBe(200);
    const rsvpData = (await resRsvp.json()) as { success: boolean; rsvp: { guestCount: number } };
    expect(rsvpData.success).toBe(true);
    expect(rsvpData.rsvp.guestCount).toBe(2);

    const reqInfo = new Request("http://localhost/api/public/event-info", { method: "GET" });
    const resInfo = await handleApiRequest(reqInfo, env);
    expect(resInfo.status).toBe(200);
    const infoData = (await resInfo.json()) as {
      event: { babyName: string };
      guestbook: Array<{ author: string; message: string }>;
    };
    expect(infoData.event.babyName).toBe("Maytê");
    expect(infoData.guestbook.some((g) => g.author === "Madrinha Fernanda")).toBe(true);
  });

  it("updates event settings via PATCH /api/admin/event-settings", async () => {
    const headers = {
      Authorization: "Bearer mayte2026",
      "Content-Type": "application/json",
    };

    const reqPatch = new Request("http://localhost/api/admin/event-settings", {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        targetDate: "2026-12-06T16:00:00",
        dateFormatted: "Domingo, 06 de Dezembro de 2026",
        timeFormatted: "A partir das 16h00",
        locationName: "Palácio das Rosas",
        pixKey: "pix@mayte.com.br",
      }),
    });

    const resPatch = await handleApiRequest(reqPatch, env);
    expect(resPatch.status).toBe(200);

    const reqGet = new Request("http://localhost/api/admin/event-settings", {
      method: "GET",
      headers,
    });
    const resGet = await handleApiRequest(reqGet, env);
    expect(resGet.status).toBe(200);
    const cfg = (await resGet.json()) as { locationName: string; pixKey: string };
    expect(cfg.locationName).toBe("Palácio das Rosas");
    expect(cfg.pixKey).toBe("pix@mayte.com.br");
  });
});