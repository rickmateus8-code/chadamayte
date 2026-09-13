import type { Env } from "../types/env";
import { corsHeaders } from "./cors";

export function getAdminPasscode(env: Env): string {
  return env.ADMIN_PASSCODE || "mayte2026";
}

/**
 * Validates whether the incoming request is authorized as an admin.
 * Accepts:
 *  - Header: Authorization: Bearer <passcode_or_token>
 *  - Header: X-Admin-Passcode: <passcode>
 */
export function isAuthorizedAdmin(request: Request, env: Env): boolean {
  const expectedPasscode = getAdminPasscode(env);

  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      if (parts[1] === expectedPasscode) {
        return true;
      }
    }
  }

  const customHeader = request.headers.get("X-Admin-Passcode");
  if (customHeader && customHeader === expectedPasscode) {
    return true;
  }

  return false;
}

export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: "Unauthorized",
      message: "Credencial administrativa inválida ou ausente.",
    }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...corsHeaders(),
      },
    }
  );
}