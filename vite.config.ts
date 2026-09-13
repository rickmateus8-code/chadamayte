import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { createD1Mock } from "./test/helpers/d1Mock";
import { handleApiRequest } from "./worker/routes";

function devApiPlugin(): Plugin {
  let db: Database.Database | null = null;
  let d1: D1Database | null = null;

  return {
    name: "dev-api-middleware",
    configureServer(server) {
      const initDb = () => {
        if (db) return;
        const dbPath = path.resolve(__dirname, ".dev_local.db");
        db = new Database(dbPath);
        db.pragma("foreign_keys = ON");

        const migration = fs.readFileSync(path.resolve(__dirname, "migrations/0000_initial.sql"), "utf-8");
        db.exec(migration);

        const seed = fs.readFileSync(path.resolve(__dirname, "migrations/seed.sql"), "utf-8");
        try {
          db.exec(seed);
        } catch {
          // ignore if already seeded
        }

        d1 = createD1Mock(db);
      };

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        try {
          initDb();
          const devEnv = {
            DB: d1!,
            ADMIN_PASSCODE: "mayte2026",
          };

          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(chunk as Buffer);
          }
          const bodyBuffer = Buffer.concat(buffers);

          const fullUrl = `http://${req.headers.host || "localhost"}${req.url}`;
          const webReq = new Request(fullUrl, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: ["GET", "HEAD"].includes(req.method || "") ? undefined : bodyBuffer,
          });

          const webRes = await handleApiRequest(webReq, devEnv);

          res.statusCode = webRes.status;
          webRes.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });

          const resBuffer = await webRes.arrayBuffer();
          res.end(Buffer.from(resBuffer));
        } catch (err) {
          console.error("Dev API Middleware Error:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Dev Server Error", details: String(err) }));
        }
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === "build" ? cloudflare() : devApiPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
}));