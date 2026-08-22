import { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";

export async function handleHealthCheck(_request: Request, env: Env): Promise<Response> {
  let databaseStatus: "available" | "unavailable" | "not_bound" = "not_bound";

  if (env.DB) {
    try {
      const result = await env.DB.prepare("SELECT 1 as alive").first<{ alive: number }>();
      databaseStatus = result?.alive === 1 ? "available" : "unavailable";
    } catch (_err) {
      databaseStatus = "unavailable";
    }
  }

  const payload = {
    ok: true,
    service: "mayte-baby-shower",
    timestamp: new Date().toISOString(),
    database: databaseStatus,
    hasMediaBinding: Boolean(env.MEDIA),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}