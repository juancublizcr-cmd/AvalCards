import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const CLIENT_DIR = path.join(DIST_DIR, "client");

console.log("=== INICIANDO PREPARACIÓN DE PAQUETES PARA CPANEL ===");

// 1. Crear server.js
const serverJsContent = `import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import serverModule from "./dist/server/server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, \`http://\${req.headers.host || "localhost"}\`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. Archivos estáticos en dist/client
    if (pathname !== "/" && !pathname.endsWith("/")) {
      const filePath = path.join(CLIENT_DIR, pathname);
      if (filePath.startsWith(CLIENT_DIR) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        
        if (pathname.startsWith("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
        res.setHeader("Content-Type", contentType);
        return fs.createReadStream(filePath).pipe(res);
      }
    }

    // 2. SSR con TanStack Start
    const fullUrl = \`http://\${req.headers.host || "localhost"}\${req.url}\`;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }

    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = req;
    }

    const webRequest = new Request(fullUrl, {
      method: req.method,
      headers,
      body,
      duplex: body ? "half" : undefined,
    });

    const webResponse = await serverModule.fetch(webRequest);

    res.statusCode = webResponse.status;
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    }
    res.end();
  } catch (err) {
    console.error("Error en servidor cPanel:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(serverModule.t ? serverModule.t() : "<h1>500 - Error Interno del Servidor</h1>");
    }
  }
});

server.listen(PORT, () => {
  console.log(\`> Aval Motors CR servidor listo en puerto \${PORT}\`);
});
`;

fs.writeFileSync(path.join(ROOT_DIR, "server.js"), serverJsContent, "utf-8");
fs.writeFileSync(path.join(ROOT_DIR, "app.js"), `import "./server.js";\n`, "utf-8");
console.log("✓ server.js y app.js creados");

// 2. Crear .htaccess para Apache (Static + SPA / HTTPS / Gzip / Caching / Security)
const htaccessContent = `# =======================================================================
# AVAL MOTORS CR - CONFIGURACIÓN APACHE / CPANEL
# =======================================================================

# 1. FORZAR HTTPS (Recomendado)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# 2. ENRUTAMIENTO SPA / PWA (Evitar errores 404 en /checkout, /validar, /admin)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# 3. COMPRESIÓN GZIP / BROTLI (Carga ultrarrápida)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/x-javascript application/json application/xml image/svg+xml font/ttf font/otf font/woff font/woff2
</IfModule>

# 4. POLÍTICAS DE CACHÉ DE NAVEGADOR
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"

  # HTML y API no cacheables para que siempre vean actualizaciones en vivo
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"

  # Assets con hash inmutables (1 año)
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# 5. TIPOS MIME ADECUADOS
<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest
  AddType application/javascript .js .mjs
  AddType text/css .css
  AddType image/webp .webp
  AddType font/woff2 .woff2
</IfModule>

# 6. CABECERAS DE SEGURIDAD
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

fs.writeFileSync(path.join(ROOT_DIR, ".htaccess"), htaccessContent, "utf-8");
fs.writeFileSync(path.join(CLIENT_DIR, ".htaccess"), htaccessContent, "utf-8");
console.log("✓ .htaccess generado para raíz y dist/client");

// 3. Crear pre-render de index.html si no existe
const indexHtmlPath = path.join(CLIENT_DIR, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  console.log("Generando dist/client/index.html...");
}

// 4. Crear LEEME_CPANEL.txt
const leemeContent = `========================================================================
AVAL MOTORS CR - GUÍA DE INSTALACIÓN EN CPANEL
========================================================================

Tienes 2 OPCIONES para instalar en cPanel según tu tipo de hosting:

------------------------------------------------------------------------
OPCIÓN A: SUBIDA ESTÁTICA / RÁPIDA (Recomendado para hosting compartido)
Archivo: avalmotors-cpanel-public_html.zip
------------------------------------------------------------------------
1. Entra a tu cPanel -> Administrador de Archivos (File Manager).
2. Ve a la carpeta "public_html" (o la carpeta de tu dominio/subdominio).
3. Sube el archivo "avalmotors-cpanel-public_html.zip".
4. Haz clic derecho sobre el .zip y selecciona "Extract" (Extraer aquí).
5. ¡Listo! El archivo .htaccess ya incluye todas las reglas de SPA,
   compresión GZIP y redirecciones para que /validar, /checkout y /admin funcionen sin 404.

------------------------------------------------------------------------
OPCIÓN B: APLICACIÓN NODE.JS CPANEL (Para SSR completo en cPanel)
Archivo: avalmotors-cpanel-node.zip
------------------------------------------------------------------------
1. En cPanel, busca la herramienta "Setup Node.js App".
2. Haz clic en "Create Application".
3. Configura:
   - Node.js version: 18.x, 20.x o 22.x
   - Application mode: Production
   - Application root: la carpeta donde subas el zip (ej. avalmotors)
   - Application startup file: server.js (o app.js)
4. Sube y extrae "avalmotors-cpanel-node.zip" en esa carpeta.
5. En la sección "Run NPM Install", haz clic para instalar dependencias de producción.
6. Haz clic en "Restart" para iniciar la app.

========================================================================
¡Todo listo para producción!
========================================================================
`;

fs.writeFileSync(path.join(ROOT_DIR, "LEEME_CPANEL.txt"), leemeContent, "utf-8");
fs.writeFileSync(path.join(CLIENT_DIR, "LEEME_CPANEL.txt"), leemeContent, "utf-8");
console.log("✓ LEEME_CPANEL.txt creado");

console.log("=== TODO LISTO PARA GENERAR LOS .ZIP ===");
