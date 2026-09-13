import type { Env } from "../types/env";
import { handleHealthCheck } from "./health";
import { handleInvitationRoutes } from "./invitations";
import { handleAdminRoutes } from "./admin";
import { handleMediaRoutes } from "./media";
import { handleOptions } from "../middleware/cors";

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return handleOptions();
  }

  // 1. Health check
  if (url.pathname === "/api/health" || url.pathname === "/api/health/") {
    return handleHealthCheck(request, env);
  }

  // 2. Public invitation routes (/api/invitations/:token ...)
  if (url.pathname.startsWith("/api/invitations")) {
    return handleInvitationRoutes(request, env, url);
  }

  // 3. Admin routes (/api/admin/*)
  if (url.pathname.startsWith("/api/admin")) {
    return handleAdminRoutes(request, env, url);
  }

  // 4. Media routes (/api/media/*)
  if (url.pathname.startsWith("/api/media")) {
    return handleMediaRoutes(request, env, url);
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