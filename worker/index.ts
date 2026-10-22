import { Env } from "./types/env";
import { handleApiRequest } from "./routes";
import {
  verifyParentCredentials,
  createSignedAdminToken,
  verifySignedAdminToken,
} from "./middleware/crypto";
import { corsHeaders } from "./middleware/cors";

const UPSTREAM_D1_WORKER_ORIGIN = "https://mayte-baby-shower.cideniamenezes.workers.dev";
const UPSTREAM_ADMIN_PASSCODE = "mayte2026";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 0. Tratamento Preflight CORS
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (url.pathname.startsWith("/api/")) {
      // 1. POST /api/admin/auth/login — Autenticação Oficial Segura dos Papais da Maytê
      if (url.pathname === "/api/admin/auth/login" && request.method === "POST") {
        try {
          const body = (await request.json()) as {
            email?: string;
            password?: string;
            passcode?: string;
          };

          // Autenticação Principal: rickmateus2021@gmail.com / @Durafa10 (PBKDF2-SHA256)
          if (body.email && body.password) {
            const isValid = await verifyParentCredentials(body.email, body.password);
            if (isValid) {
              const signedToken = await createSignedAdminToken(body.email);
              return new Response(
                JSON.stringify({
                  success: true,
                  token: signedToken,
                  user: { email: body.email.trim().toLowerCase(), role: "PARENT_ADMIN" },
                  message: "Autenticação dos papais realizada com sucesso.",
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json", ...corsHeaders() },
                }
              );
            }

            return new Response(
              JSON.stringify({
                error: "Unauthorized",
                message: "Credenciais inválidas. Verifique seu e-mail e senha.",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json", ...corsHeaders() },
              }
            );
          }

          // Fallback para passcode
          if (
            body.passcode &&
            (body.passcode === "@Durafa10" || body.passcode === UPSTREAM_ADMIN_PASSCODE)
          ) {
            const signedToken = await createSignedAdminToken("rickmateus2021@gmail.com");
            return new Response(
              JSON.stringify({
                success: true,
                token: signedToken,
                user: { email: "rickmateus2021@gmail.com", role: "PARENT_ADMIN" },
                message: "Autenticação dos papais realizada com sucesso.",
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders() },
              }
            );
          }

          return new Response(
            JSON.stringify({
              error: "Unauthorized",
              message: "Credenciais inválidas. Forneça o e-mail e a senha dos papais.",
            }),
            {
              status: 401,
              headers: { "Content-Type": "application/json", ...corsHeaders() },
            }
          );
        } catch {
          return new Response(
            JSON.stringify({ error: "Bad Request", message: "Payload de login inválido." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders() },
            }
          );
        }
      }

      // If D1 binding is available directly in this environment, execute locally
      if (env && env.DB) {
        return handleApiRequest(request, env);
      }

      // Otherwise (e.g., Cloudflare Pages deployment), transparently bridge to D1 Worker backend
      const targetUrl = `${UPSTREAM_D1_WORKER_ORIGIN}${url.pathname}${url.search}`;
      const proxyHeaders = new Headers(request.headers);
      proxyHeaders.delete("host");

      // Validação de Sessão para Rotas Administrativas (/api/admin/*)
      if (url.pathname.startsWith("/api/admin/")) {
        const authHeader = request.headers.get("Authorization") || "";

        if (authHeader.startsWith("Bearer mayte_sec_")) {
          const rawToken = authHeader.replace(/^Bearer\s+/i, "").trim();
          const verification = await verifySignedAdminToken(rawToken);

          if (!verification.valid) {
            return new Response(
              JSON.stringify({
                error: "Unauthorized",
                message: "Sessão expirada ou inválida. Faça login novamente.",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json", ...corsHeaders() },
              }
            );
          }

          // Transforma o token assinado dos pais no passe aceito pelo D1 upstream
          proxyHeaders.set("Authorization", `Bearer ${UPSTREAM_ADMIN_PASSCODE}`);
        } else if (
          authHeader !== `Bearer ${UPSTREAM_ADMIN_PASSCODE}` &&
          authHeader !== "Bearer @Durafa10"
        ) {
          return new Response(
            JSON.stringify({
              error: "Unauthorized",
              message: "Acesso administrativo restrito aos papais da Maytê.",
            }),
            {
              status: 401,
              headers: { "Content-Type": "application/json", ...corsHeaders() },
            }
          );
        } else {
          proxyHeaders.set("Authorization", `Bearer ${UPSTREAM_ADMIN_PASSCODE}`);
        }
      }

      const init: RequestInit = {
        method: request.method,
        headers: proxyHeaders,
        redirect: "manual",
      };

      if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = await request.arrayBuffer();
      }

      return fetch(targetUrl, init);
    }

    if (env && env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }

      // SPA fallback for /admin and /i/:token routes on Cloudflare Pages
      const indexUrl = new URL("/index.html", request.url);
      return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
    }

    return new Response("Not Found", { status: 404 });
  },
};
