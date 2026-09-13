import type { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";
import { generateId } from "../domain/token";

export async function handleMediaRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  // 1. POST /api/media/upload
  if (url.pathname === "/api/media/upload" && request.method === "POST") {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const invitationId = (formData.get("invitationId") as string) || null;

      if (!file || typeof file === "string") {
        return new Response(
          JSON.stringify({ error: "Bad Request", message: "Nenhum arquivo enviado." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      const mediaId = generateId("med");
      const ext = file.name.split(".").pop() || "jpg";
      const r2Key = `photos/${Date.now()}_${mediaId}.${ext}`;

      // If R2 binding is available, store the bytes
      if (env.MEDIA) {
        const arrayBuffer = await file.arrayBuffer();
        await env.MEDIA.put(r2Key, arrayBuffer, {
          httpMetadata: {
            contentType: file.type || "image/jpeg",
          },
        });
      }

      // Record metadata in D1 if available
      if (env.DB) {
        await env.DB.prepare(`
          INSERT INTO media_uploads (
            id, event_id, invitation_id, r2_key, original_filename,
            mime_type, file_size, upload_type, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          mediaId,
          "evt_mayte_2026",
          invitationId,
          r2Key,
          file.name,
          file.type || "image/jpeg",
          file.size || 1,
          "GUEST_PHOTO",
          "AVAILABLE",
          new Date().toISOString(),
          new Date().toISOString()
        )
        .run();
      }

      return new Response(
        JSON.stringify({
          success: true,
          id: mediaId,
          key: r2Key,
          message: "Foto recebida com muito carinho pelos papais!",
        }),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Internal Error", message: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Not Found" }),
    { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}