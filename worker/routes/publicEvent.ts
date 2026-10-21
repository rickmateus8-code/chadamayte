import type { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";

export interface PublicEventInfoPayload {
  event: {
    id: string;
    name: string;
    babyName: string;
    targetDate: string;
    dateFormatted: string;
    timeFormatted: string;
    locationName: string;
    locationAddress: string;
    locationCity: string;
    mapUrl: string;
    pixKey: string;
    pixBeneficiary: string;
    observations: string;
  };
  portalConfig: Record<string, unknown> | null;
  guestbook: Array<{
    id: string;
    author: string;
    message: string;
    submittedAt: string;
  }>;
  publicPhotos: Array<{
    id: string;
    url: string;
    caption: string;
    createdAt: string;
  }>;
}

export async function handlePublicEventRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  if (url.pathname !== "/api/public/event-info" || request.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Not Found" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: "Service Unavailable", message: "Database binding missing." }),
      { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const db = env.DB;

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

  const { results: rsvpNotes } = await db
    .prepare(`
      SELECT id, contact_name, notes, submitted_at
      FROM rsvps
      WHERE notes IS NOT NULL AND trim(notes) != ''
      ORDER BY submitted_at DESC
      LIMIT 24
    `)
    .all<{ id: string; contact_name: string; notes: string; submitted_at: string }>();

  const { results: mediaRows } = await db
    .prepare(`
      SELECT id, original_filename, created_at
      FROM media_uploads
      WHERE status = 'AVAILABLE'
      ORDER BY created_at DESC
      LIMIT 20
    `)
    .all<{ id: string; original_filename: string; created_at: string }>();

  const rawDate = String(eventRow?.event_date ?? "2026-11-22T15:30:00");
  const effectiveTargetDate =
    rawDate.startsWith("2026-10-18") ? "2026-11-22T15:30:00" : rawDate;

  const payload: PublicEventInfoPayload = {
    event: {
      id: eventId,
      name: String(eventRow?.name ?? "Chá de Fraldas"),
      babyName: String(eventRow?.baby_name ?? "Maytê"),
      targetDate: effectiveTargetDate,
      dateFormatted:
        customDetails.dateFormatted || "Domingo, 22 de Novembro de 2026",
      timeFormatted: customDetails.timeFormatted || "A partir das 15h30",
      locationName: String(eventRow?.venue_name ?? "Espaço Jardim das Flores"),
      locationAddress: String(
        eventRow?.venue_address ?? "Av. das Rosas, 1234 — Salão Nobre"
      ),
      locationCity: `${String(eventRow?.venue_city ?? "São Paulo")} — ${String(eventRow?.venue_state ?? "SP")}`,
      mapUrl: String(
        eventRow?.map_url ||
          "https://maps.google.com/?q=Av.+Paulista,+1000,+Sao+Paulo"
      ),
      pixKey: customDetails.pixKey || "chadamayte@familia.com.br",
      pixBeneficiary: customDetails.pixBeneficiary || "Papais da Maytê",
      observations:
        customDetails.observations ||
        "Será um encontro real muito especial! Venham preparados para comemorar, brindar e registrar muitas fotos para o álbum da nossa princesinha.",
    },
    portalConfig,
    guestbook: (rsvpNotes ?? []).map((row) => ({
      id: row.id,
      author: row.contact_name,
      message: row.notes,
      submittedAt: row.submitted_at,
    })),
    publicPhotos: (mediaRows ?? []).map((m) => ({
      id: m.id,
      url: `/api/media/file/${m.id}`,
      caption: m.original_filename.replace(/\.[a-zA-Z0-9]+$/, ""),
      createdAt: m.created_at,
    })),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
