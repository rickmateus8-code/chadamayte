import { Env } from "../types/env";
import { corsHeaders } from "../middleware/cors";

export async function handleHealthCheck(_request: Request, env: Env): Promise<Response> {
  const payload = {
    ok: true,
    service: "mayte-baby-shower",
    timestamp: new Date().toISOString(),
    hasDbBinding: Boolean(env.DB),
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
