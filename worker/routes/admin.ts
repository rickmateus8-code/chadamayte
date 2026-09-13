import type { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";
import { isAuthorizedAdmin, unauthorizedResponse, getAdminPasscode } from "../middleware/auth";
import { InvitationService } from "../services/invitationService";
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
        pendingInvitations: (totalInvitationsRow?.count ?? 0) - ((rsvpCountsRow?.confirmed ?? 0) + (rsvpCountsRow?.declined ?? 0) + (rsvpCountsRow?.partial ?? 0)),
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

      // Default to the first event in database if not provided
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
      .prepare("SELECT * FROM media_uploads ORDER BY created_at DESC")
      .all();

    return new Response(JSON.stringify(media ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  return new Response(
    JSON.stringify({ error: "Not Found", message: "Rota administrativa inexistente." }),
    { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}