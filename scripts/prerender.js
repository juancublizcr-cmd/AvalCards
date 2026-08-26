import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const CLIENT_DIR = path.join(ROOT_DIR, "dist", "client");
const SERVER_FILE = path.join(ROOT_DIR, "dist", "server", "server.js");

async function prerender() {
  try {
    console.log("=== PRE-RENDERIZANDO HTML PARA VERCEL Y HOSTINGS ===");
    if (!fs.existsSync(SERVER_FILE)) {
      console.error("No se encontró server.js en dist/server");
      process.exit(1);
    }

    const serverModule = await import(`file://${SERVER_FILE}`);
    const handler = serverModule.default;

    const routes = [
      { path: "/", file: "index.html" },
      { path: "/checkout", file: "checkout.html" },
      { path: "/validar", file: "validar.html" },
      { path: "/admin", file: "admin.html" },
      { path: "/login", file: "login.html" },
      { path: "/terminos", file: "terminos.html" },
      { path: "/privacidad", file: "privacidad.html" },
      { path: "/reembolso", file: "reembolso.html" },
    ];

    if (!fs.existsSync(CLIENT_DIR)) {
      fs.mkdirSync(CLIENT_DIR, { recursive: true });
    }

    for (const r of routes) {
      const res = await handler.fetch(new Request(`http://localhost${r.path}`));
      const html = await res.text();
      const targetPath = path.join(CLIENT_DIR, r.file);
      fs.writeFileSync(targetPath, html, "utf-8");
      console.log(`✓ Generado: ${r.file} (${html.length} bytes)`);
    }

    // Fallback 404
    const res404 = await handler.fetch(new Request("http://localhost/404"));
    const html404 = await res404.text();
    fs.writeFileSync(path.join(CLIENT_DIR, "404.html"), html404, "utf-8");
    console.log("✓ Generado: 404.html");

    console.log("=== PRE-RENDER COMPLETADO EXITOSAMENTE ===");
  } catch (err) {
    console.error("Error durante el pre-render:", err);
    process.exit(1);
  }
}

void prerender();
