export function renderErrorPage(err?: unknown): string {
  const errText = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack || ""}` : (err ? String(err) : "");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 48rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
      pre { text-align: left; background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 0.5rem; overflow: auto; font-size: 12px; max-height: 50vh; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="forceCleanReload()">Recargar Página Limpia</button>
        <button class="secondary" onclick="window.location.href='/?_r=' + Date.now()">Ir al Inicio</button>
      </div>
      ${errText ? `<pre>${errText}</pre>` : ""}
    </div>
    <script>
      async function forceCleanReload() {
        try {
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.unregister()));
          }
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          }
        } catch(e) {}
        window.location.href = '/?_clean=' + Date.now();
      }
    </script>
  </body>
</html>`;
}
