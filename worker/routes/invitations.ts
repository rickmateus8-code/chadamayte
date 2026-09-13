import type { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";
import { InvitationService } from "../services/invitationService";
import { RsvpService } from "../services/rsvpService";
import type { AttendanceStatus, GuestType } from "../domain";

export async function handleInvitationRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: "Service Unavailable", message: "Database binding missing." }),
      { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // Pattern: /api/invitations/:token or /api/invitations/:token/rsvp
  const match = url.pathname.match(/^\/api\/invitations\/([0-9A-Za-z_-]+)(\/rsvp)?$/);
  if (!match) {
    return new Response(
      JSON.stringify({ error: "Not Found", message: "Rota de convite inválida." }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const token = match[1];
  const isRsvpSubpath = Boolean(match[2]);
  const invitationService = new InvitationService(env.DB);
  const rsvpService = new RsvpService(env.DB);

  // 1. GET /api/invitations/:token
  if (request.method === "GET" && !isRsvpSubpath) {
    const details = await invitationService.getByToken(token);
    if (!details) {
      return new Response(
        JSON.stringify({ error: "Not Found", message: "Convite não encontrado ou inativo." }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    return new Response(JSON.stringify(details), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // 2. POST /api/invitations/:token/rsvp
  if (request.method === "POST" && isRsvpSubpath) {
    const details = await invitationService.getByToken(token);
    if (!details) {
      return new Response(
        JSON.stringify({ error: "Not Found", message: "Convite não encontrado ou inativo." }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    try {
      const body = (await request.json()) as {
        contactName?: string;
        contactWhatsapp?: string;
        notes?: string;
        members?: Array<{
          guestId?: string;
          displayName: string;
          attendanceStatus: AttendanceStatus;
          isAdditionalGuest?: boolean;
          guestType?: GuestType;
        }>;
      };

      if (!body.contactName || !body.members || !Array.isArray(body.members) || body.members.length === 0) {
        return new Response(
          JSON.stringify({
            error: "Bad Request",
            message: "Nome do responsável e lista de presenças são obrigatórios.",
          }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      const result = await rsvpService.processRsvp({
        invitationId: details.invitation.id,
        contactName: body.contactName.trim(),
        contactWhatsapp: body.contactWhatsapp?.trim(),
        notes: body.notes?.trim(),
        members: body.members,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Confirmação de presença registrada com sucesso!",
          ...result,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao processar RSVP.";
      return new Response(
        JSON.stringify({ error: "Unprocessable Entity", message }),
        { status: 422, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}