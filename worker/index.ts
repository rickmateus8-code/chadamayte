import { Env } from "./types/env";
import { handleApiRequest } from "./routes";

const UPSTREAM_D1_WORKER_ORIGIN = "https://mayte-baby-shower.cideniamenezes.workers.dev";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      // If D1 binding is available directly in this environment, execute locally
      if (env && env.DB) {
        return handleApiRequest(request, env);
      }

      // Otherwise (e.g., Cloudflare Pages project without direct D1/R2 token scope),
      // transparently bridge to the dedicated D1 + R2 Worker backend
      const targetUrl = `${UPSTREAM_D1_WORKER_ORIGIN}${url.pathname}${url.search}`;
      const proxyHeaders = new Headers(request.headers);
      proxyHeaders.delete("host");

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
