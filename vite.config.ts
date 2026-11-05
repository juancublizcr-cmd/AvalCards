import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

function imapTestPlugin() {
  return {
    name: "imap-test-middleware",
    configureServer(server: any) {
      server.middlewares.use("/api/test-imap", (req: any, res: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk: any) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const { host, port, user, password } = JSON.parse(body || "{}");
            const { probarConexionImapReal } = await import("./scripts/test-imap-cli.js");
            const resultado = await probarConexionImapReal({ host, port, user, password });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(resultado));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, mensaje: e.message || "Error al conectar con IMAP" }));
          }
        });
      });
    },
  };
}

function resendEmailPlugin() {
  return {
    name: "resend-email-middleware",
    configureServer(server: any) {
      server.middlewares.use("/api/send-email", (req: any, res: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk: any) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const { apiKey, from, reply_to, to, subject, html, text } = JSON.parse(body || "{}");
            const key = apiKey || process.env.RESEND_API_KEY || "";
            if (!key) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: false, error: "Falta la API Key de Resend" }));
              return;
            }

            const resendPayload: Record<string, any> = {
              from: from || "Aval Community CR <contacto@avalcommunity.com>",
              reply_to: reply_to || "contacto@avalcommunity.com",
              to: Array.isArray(to) ? to : [to],
              subject: subject || "Confirmación de Orden - Aval Community CR",
              html: html || "<p>Confirmación Aval Community</p>",
            };
            if (text) resendPayload.text = text;

            const resendResp = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(resendPayload),
            });

            const resendData = await resendResp.json().catch(() => ({}));
            res.statusCode = resendResp.status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(resendData));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: e.message || "Error al enviar correo" }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    imapTestPlugin(),
    resendEmailPlugin(),
    // 1. TanStack Start (incluye router, SSR y file-based routing)
    tanstackStart({
      server: { entry: "server" },
    }),
    // 2. React
    react(),
    // 3. TailwindCSS v4
    tailwindcss(),
    // 4. PWA — Workbox
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png", "icons/*.svg"],
      devOptions: {
        enabled: true,
        type: "module",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes("supabase.co") &&
              url.pathname.startsWith("/rest/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: ({ url }) =>
              url.hostname.includes("supabase.co") &&
              url.pathname.startsWith("/storage/"),
            handler: "CacheFirst",
            options: {
              cacheName: "supabase-storage",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
        navigateFallback: "/",
        navigateFallbackDenylist: [/^\/admin/],
      },
      manifest: {
        name: "Aval Community CR",
        short_name: "AvalCommunity",
        description: "Premios exclusivos y beneficios de alta gama para nuestra comunidad Aval en Costa Rica.",
        theme_color: "#f97316",
        background_color: "#0a0a0a",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "es-CR",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  preview: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
