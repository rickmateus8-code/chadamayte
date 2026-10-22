import type { Env } from "../types/env";
import { corsHeaders } from "./cors";
import { verifySignedAdminToken } from "./crypto";

export function getAdminPasscode(env: Env): string {
  return env.ADMIN_PASSCODE || "mayte2026";
}

/**
 * Validates whether the incoming request is authorized as an admin.
 * Accepts:
 *  - Header: Authorization: Bearer <signed_token_or_passcode>
 *  - Header: X-Admin-Passcode: <passcode>
 */
export async function isAuthorizedAdmin(request: Request, env: Env): Promise<boolean> {
  const expectedPasscode = getAdminPasscode(env);

  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      const token = parts[1];
      if (token) {
        // 1. Check cryptographically signed HMAC token
        const check = await verifySignedAdminToken(token);
        if (check.valid) {
          return true;
        }

        // 2. Fallback to expected environment passcode
        if (token === expectedPasscode) {
          return true;
        }
      }
    }
  }

  const customHeader = request.headers.get("X-Admin-Passcode");
  if (customHeader) {
    const check = await verifySignedAdminToken(customHeader);
    if (check.valid || customHeader === expectedPasscode) {
      return true;
    }
  }

  return false;
}

export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: "Unauthorized",
      message: "Credencial administrativa inválida ou sessão expirada.",
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
