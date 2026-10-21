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
      const caption = (formData.get("caption") as string) || "";

      if (!file || typeof file === "string") {
        return new Response(
          JSON.stringify({ error: "Bad Request", message: "Nenhum arquivo enviado." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }

      const mediaId = generateId("med");
      const ext = file.name.split(".").pop() || "jpg";
      const r2Key = `photos/${Date.now()}_${mediaId}.${ext}`;
      const displayCaption = caption.trim()
        ? `${caption.trim()}.${ext}`
        : file.name;

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
          displayCaption,
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
          url: `/api/media/file/${mediaId}`,
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

  // 2. GET /api/media/file/:id (Serve photo bytes from R2)
  const fileMatch = url.pathname.match(/^\/api\/media\/file\/([a-zA-Z0-9_-]+)$/);
  if (fileMatch && request.method === "GET") {
    const mediaId = fileMatch[1];
    if (!env.DB || !env.MEDIA) {
      return new Response("Media service unavailable", { status: 503 });
    }

    const row = await env.DB.prepare(
      "SELECT r2_key, mime_type FROM media_uploads WHERE id = ? AND status = 'AVAILABLE' LIMIT 1"
    )
      .bind(mediaId)
      .first<{ r2_key: string; mime_type: string }>();

    if (!row) {
      return new Response("Not Found", { status: 404 });
    }

    const obj = await env.MEDIA.get(row.r2_key);
    if (!obj) {
      return new Response("Object Not Found in R2", { status: 404 });
    }

    return new Response(obj.body, {
      status: 200,
      headers: {
        "Content-Type": row.mime_type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...corsHeaders(),
      },
    });
  }

  return new Response(
    JSON.stringify({ error: "Not Found" }),
    { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}
