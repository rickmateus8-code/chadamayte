import { Env } from "../types/env";
import { handleHealthCheck } from "./health";
import { handleOptions } from "../middleware/cors";

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return handleOptions();
  }

  if (url.pathname === "/api/health" || url.pathname === "/api/health/") {
    return handleHealthCheck(request, env);
  }

  return new Response(
    JSON.stringify({
      error: "Not Found",
      path: url.pathname,
    }),
    {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );
}
