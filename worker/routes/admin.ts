import type { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";
import { isAuthorizedAdmin, unauthorizedResponse, getAdminPasscode } from "../middleware/auth";
import { InvitationService } from "../services/invitationService";
import { RsvpService } from "../services/rsvpService";
import { EventRepository } from "../repositories/eventRepository";

export async function handleAdminRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  // 1. POST /api/admin/auth/login
  if (url.pathname === "/api/admin/auth/login" && request.method === "POST") {
    try {
      const body = (await request.json()) as { passcode?: string };
      const expected = getAdminPasscode(env);

      if (body.passcode && body.passcode === expected) {
        return new Response(
          JSON.stringify({
            success: true,
            token: expected,
            message: "Autenticação realizada com sucesso.",
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Senha incorreta." }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "Bad Request", message: "Payload inválido." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
  }

  // All other /api/admin/* routes require authorization
  if (!isAuthorizedAdmin(request, env)) {
    return unauthorizedResponse();
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: "Service Unavailable", message: "Database binding missing." }),
      { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const db = env.DB;

  // 2. GET /api/admin/overview
  if (url.pathname === "/api/admin/overview" && request.method === "GET") {
    const totalInvitationsRow = await db
      .prepare("SELECT count(*) as count FROM invitations")
      .first<{ count: number }>();

    const totalGuestsRow = await db
      .prepare("SELECT count(*) as count FROM guests")
      .first<{ count: number }>();

    const rsvpCountsRow = await db
      .prepare(`
        SELECT
          SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'DECLINED' THEN 1 ELSE 0 END) as declined,
          SUM(CASE WHEN status = 'PARTIAL' THEN 1 ELSE 0 END) as partial,
          SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending
        FROM rsvps
      `)
      .first<{ confirmed: number | null; declined: number | null; partial: number | null; pending: number | null }>();

    const memberStatsRow = await db
      .prepare(`
        SELECT
          SUM(CASE WHEN attendance_status = 'CONFIRMED' AND guest_type = 'ADULT' THEN 1 ELSE 0 END) as confirmed_adults,
          SUM(CASE WHEN attendance_status = 'CONFIRMED' AND guest_type IN ('CHILD', 'BABY') THEN 1 ELSE 0 END) as confirmed_children,
          SUM(CASE WHEN attendance_status = 'CONFIRMED' THEN 1 ELSE 0 END) as total_confirmed_people
        FROM rsvp_members
      `)
      .first<{ confirmed_adults: number | null; confirmed_children: number | null; total_confirmed_people: number | null }>();

    const totalPhotosRow = await db
      .prepare("SELECT count(*) as count FROM media_uploads WHERE status = 'AVAILABLE'")
      .first<{ count: number }>();

    return new Response(
      JSON.stringify({
        totalInvitations: totalInvitationsRow?.count ?? 0,
        totalNominalGuests: totalGuestsRow?.count ?? 0,
        confirmedInvitations: (rsvpCountsRow?.confirmed ?? 0) + (rsvpCountsRow?.partial ?? 0),
        declinedInvitations: rsvpCountsRow?.declined ?? 0,
        pendingInvitations:
          (totalInvitationsRow?.count ?? 0) -
          ((rsvpCountsRow?.confirmed ?? 0) +
            (rsvpCountsRow?.declined ?? 0) +
            (rsvpCountsRow?.partial ?? 0)),
        confirmedAdults: memberStatsRow?.confirmed_adults ?? 0,
        confirmedChildren: memberStatsRow?.confirmed_children ?? 0,
        totalConfirmedPeople: memberStatsRow?.total_confirmed_people ?? 0,
        totalPhotos: totalPhotosRow?.count ?? 0,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // 3. GET /api/admin/invitations
  if (url.pathname === "/api/admin/invitations" && request.method === "GET") {
    const { results: invitations } = await db
      .prepare(`
        SELECT 
          i.*,
          r.status as rsvp_status,
          r.contact_name as rsvp_contact_name,
          r.guest_count as rsvp_guest_count,
          r.submitted_at as rsvp_submitted_at
        FROM invitations i
        LEFT JOIN rsvps r ON r.invitation_id = i.id
        ORDER BY i.created_at DESC
      `)
      .all();

    const { results: allGuests } = await db
      .prepare("SELECT * FROM guests ORDER BY sort_order ASC")
      .all();

    const guestsByInvitation = new Map<string, unknown[]>();
    for (const g of allGuests ?? []) {
      const invId = (g as { invitation_id: string }).invitation_id;
      if (!guestsByInvitation.has(invId)) {
        guestsByInvitation.set(invId, []);
      }
      guestsByInvitation.get(invId)!.push(g);
    }

    const payload = (invitations ?? []).map((inv: Record<string, unknown>) => ({
      ...inv,
      guests: guestsByInvitation.get((inv as { id: string }).id) ?? [],
    }));

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // 4. POST /api/admin/invitations (Create new invitation)
  if (url.pathname === "/api/admin/invitations" && request.method === "POST") {
    try {
      const body = (await request.json()) as {
        eventId?: string;
        displayName: string;
        salutation?: string;
        guestNames?: string[];
        allowAdditionalGuests?: boolean;
        maxAdditionalGuests?: number;
      };

      if (!body.displayName || !body.displayName.trim()) {
        return new Response(
          JSON.stringify({ error: "Bad Request", message: "Nome de exibição é obrigatório." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      let eventId = body.eventId;
      if (!eventId) {
        const firstEvent = await new EventRepository(db).findBySlug("chadamayte");
        eventId = firstEvent?.id ?? "evt_default";
      }

      const invitationService = new InvitationService(db);
      const result = await invitationService.createInvitationWithGuests(
        eventId,
        body.displayName.trim(),
        body.salutation?.trim(),
        body.guestNames ?? [],
        Boolean(body.allowAdditionalGuests),
        body.maxAdditionalGuests ?? 0
      );

      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Internal Error", message: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
  }

  // 4b. PATCH /api/admin/invitations/:id/status (Drag-and-Drop Kanban Status Change)
  const statusMatch = url.pathname.match(/^\/api\/admin\/invitations\/([a-zA-Z0-9_-]+)\/status$/);
  if (statusMatch && request.method === "PATCH") {
    try {
      const invitationId = statusMatch[1] ?? "";
      const body = (await request.json()) as {
        targetStatus: "PENDING" | "CONFIRMED" | "DECLINED";
      };

      if (body.targetStatus === "PENDING") {
        await db.prepare("DELETE FROM rsvps WHERE invitation_id = ?").bind(invitationId).run();
        return new Response(
          JSON.stringify({ success: true, message: "Convite movido para Pendentes." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      const invRow = await db
        .prepare("SELECT id, display_name FROM invitations WHERE id = ? LIMIT 1")
        .bind(invitationId)
        .first<{ id: string; display_name: string }>();

      if (!invRow) {
        return new Response(
          JSON.stringify({ error: "Not Found", message: "Convite não encontrado." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      const { results: guests } = await db
        .prepare("SELECT id, name, guest_type FROM guests WHERE invitation_id = ? ORDER BY sort_order ASC")
        .bind(invitationId)
        .all<{ id: string; name: string; guest_type: "ADULT" | "CHILD" | "BABY" }>();

      const rsvpService = new RsvpService(db);
      const attendanceStatus = body.targetStatus === "DECLINED" ? "DECLINED" : "CONFIRMED";

      const members =
        guests && guests.length > 0
          ? guests.map((g) => ({
              guestId: g.id,
              displayName: g.name,
              attendanceStatus: attendanceStatus as "CONFIRMED" | "DECLINED",
              isAdditionalGuest: false,
              guestType: g.guest_type || ("ADULT" as const),
            }))
          : [
              {
                displayName: invRow.display_name,
                attendanceStatus: attendanceStatus as "CONFIRMED" | "DECLINED",
                isAdditionalGuest: false,
                guestType: "ADULT" as const,
              },
            ];

      await rsvpService.processRsvp({
        invitationId,
        contactName: invRow.display_name,
        members,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: `Status de "${invRow.display_name}" atualizado para ${body.targetStatus}!`,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Internal Error", message: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
  }

  // 5. DELETE /api/admin/invitations/:id
  const deleteMatch = url.pathname.match(/^\/api\/admin\/invitations\/([a-zA-Z0-9_-]+)$/);
  if (deleteMatch && request.method === "DELETE") {
    const invitationId = deleteMatch[1];
    await db.prepare("DELETE FROM invitations WHERE id = ?").bind(invitationId).run();

    return new Response(JSON.stringify({ success: true, message: "Convite removido com sucesso." }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // 6. GET /api/admin/rsvps
  if (url.pathname === "/api/admin/rsvps" && request.method === "GET") {
    const { results: rsvps } = await db
      .prepare(`
        SELECT 
          r.*,
          i.display_name as invitation_name,
          i.public_token
        FROM rsvps r
        JOIN invitations i ON i.id = r.invitation_id
        ORDER BY r.submitted_at DESC
      `)
      .all();

    const { results: members } = await db
      .prepare("SELECT * FROM rsvp_members ORDER BY created_at ASC")
      .all();

    const membersByRsvp = new Map<string, unknown[]>();
    for (const m of members ?? []) {
      const rId = (m as { rsvp_id: string }).rsvp_id;
      if (!membersByRsvp.has(rId)) {
        membersByRsvp.set(rId, []);
      }
      membersByRsvp.get(rId)!.push(m);
    }

    const payload = (rsvps ?? []).map((r: Record<string, unknown>) => ({
      ...r,
      members: membersByRsvp.get((r as { id: string }).id) ?? [],
    }));

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // 7. GET /api/admin/media
  if (url.pathname === "/api/admin/media" && request.method === "GET") {
    const { results: media } = await db
      .prepare("SELECT * FROM media_uploads WHERE status = 'AVAILABLE' ORDER BY created_at DESC")
      .all();

    return new Response(JSON.stringify(media ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // 7b. DELETE /api/admin/media/:id
  const deleteMediaMatch = url.pathname.match(/^\/api\/admin\/media\/([a-zA-Z0-9_-]+)$/);
  if (deleteMediaMatch && request.method === "DELETE") {
    const mediaId = deleteMediaMatch[1];
    await db
      .prepare("UPDATE media_uploads SET status = 'DELETED' WHERE id = ?")
      .bind(mediaId)
      .run();

    return new Response(JSON.stringify({ success: true, message: "Foto removida da galeria." }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // 8. GET /api/admin/event-settings
  if (url.pathname === "/api/admin/event-settings" && request.method === "GET") {
    const eventRow = await db
      .prepare("SELECT * FROM events WHERE slug = 'chadamayte' LIMIT 1")
      .first<Record<string, unknown>>();

    const eventId = String(eventRow?.id ?? "evt_mayte_2026");

    const customSettingRow = await db
      .prepare(
        "SELECT value_json FROM event_settings WHERE event_id = ? AND setting_key = 'custom_details' LIMIT 1"
      )
      .bind(eventId)
      .first<{ value_json: string }>();

    let customDetails: Record<string, string> = {};
    if (customSettingRow?.value_json) {
      try {
        customDetails = JSON.parse(customSettingRow.value_json);
      } catch {
        customDetails = {};
      }
    }

    const portalConfigRow = await db
      .prepare(
        "SELECT value_json FROM event_settings WHERE event_id = ? AND setting_key = 'portal_config' LIMIT 1"
      )
      .bind(eventId)
      .first<{ value_json: string }>();

    let portalConfig: Record<string, unknown> | null = null;
    if (portalConfigRow?.value_json) {
      try {
        portalConfig = JSON.parse(portalConfigRow.value_json);
      } catch {
        portalConfig = null;
      }
    }

    const rawDate = String(eventRow?.event_date ?? "2026-11-22T15:30:00");
    const effectiveTargetDate =
      rawDate.startsWith("2026-10-18") ? "2026-11-22T15:30:00" : rawDate;

    return new Response(
      JSON.stringify({
        targetDate: effectiveTargetDate,
        dateFormatted: customDetails.dateFormatted || "Domingo, 22 de Novembro de 2026",
        timeFormatted: customDetails.timeFormatted || "A partir das 15h30",
        locationName: String(eventRow?.venue_name ?? "Espaço Jardim das Flores"),
        locationAddress: String(eventRow?.venue_address ?? "Av. das Rosas, 1234 — Salão Nobre"),
        locationCity: String(eventRow?.venue_city ?? "São Paulo"),
        locationState: String(eventRow?.venue_state ?? "SP"),
        mapUrl: String(eventRow?.map_url || "https://maps.google.com/?q=Av.+Paulista,+1000,+Sao+Paulo"),
        pixKey: customDetails.pixKey || "chadamayte@familia.com.br",
        pixBeneficiary: customDetails.pixBeneficiary || "Papais da Maytê",
        observations:
          customDetails.observations ||
          "Será um encontro real muito especial! Venham preparados para comemorar, brindar e registrar muitas fotos para o álbum da nossa princesinha.",
        portalConfig,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // 9. PATCH /api/admin/event-settings
  if (url.pathname === "/api/admin/event-settings" && request.method === "PATCH") {
    try {
      const body = (await request.json()) as {
        targetDate?: string;
        dateFormatted?: string;
        timeFormatted?: string;
        locationName?: string;
        locationAddress?: string;
        locationCity?: string;
        locationState?: string;
        mapUrl?: string;
        pixKey?: string;
        pixBeneficiary?: string;
        observations?: string;
        portalConfig?: Record<string, unknown>;
      };

      const eventRow = await db
        .prepare("SELECT id FROM events WHERE slug = 'chadamayte' LIMIT 1")
        .first<{ id: string }>();
      const eventId = eventRow?.id ?? "evt_mayte_2026";

      await db
        .prepare(`
          UPDATE events
          SET
            event_date = COALESCE(?, event_date),
            venue_name = COALESCE(?, venue_name),
            venue_address = COALESCE(?, venue_address),
            venue_city = COALESCE(?, venue_city),
            venue_state = COALESCE(?, venue_state),
            map_url = COALESCE(?, map_url),
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?
        `)
        .bind(
          body.targetDate ?? null,
          body.locationName ?? null,
          body.locationAddress ?? null,
          body.locationCity ?? null,
          body.locationState ?? null,
          body.mapUrl ?? null,
          eventId
        )
        .run();

      if (
        body.dateFormatted !== undefined ||
        body.timeFormatted !== undefined ||
        body.pixKey !== undefined ||
        body.pixBeneficiary !== undefined ||
        body.observations !== undefined
      ) {
        const customJson = JSON.stringify({
          dateFormatted: body.dateFormatted ?? "Domingo, 22 de Novembro de 2026",
          timeFormatted: body.timeFormatted ?? "A partir das 15h30",
          pixKey: body.pixKey ?? "chadamayte@familia.com.br",
          pixBeneficiary: body.pixBeneficiary ?? "Papais da Maytê",
          observations:
            body.observations ??
            "Será um encontro real muito especial! Venham preparados para comemorar, brindar e registrar muitas fotos para o álbum da nossa princesinha.",
        });

        await db
          .prepare(`
            INSERT INTO event_settings (id, event_id, setting_key, value_json, updated_at)
            VALUES ('set_custom_details', ?, 'custom_details', ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            ON CONFLICT(event_id, setting_key) DO UPDATE SET
              value_json = excluded.value_json,
              updated_at = excluded.updated_at
          `)
          .bind(eventId, customJson)
          .run();
      }

      if (body.portalConfig) {
        const portalJson = JSON.stringify(body.portalConfig);
        await db
          .prepare(`
            INSERT INTO event_settings (id, event_id, setting_key, value_json, updated_at)
            VALUES ('set_portal_config', ?, 'portal_config', ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            ON CONFLICT(event_id, setting_key) DO UPDATE SET
              value_json = excluded.value_json,
              updated_at = excluded.updated_at
          `)
          .bind(eventId, portalJson)
          .run();
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Configurações reais do portal salvas com sucesso!",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Internal Error", message: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Not Found", message: "Rota administrativa inexistente." }),
    { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}
