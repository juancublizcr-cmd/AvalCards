import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zdyygdivjhftirykvjjk.supabase.co";
const supabaseKey = "sb_publishable_V6TPJryhSdRjDPsW8f07OA_b11osYAw";
const supabase = createClient(supabaseUrl, supabaseKey);

const FECHA_CORRECTA = "2026-12-13";

async function main() {
  console.log("Consultando sorteo_config actual...");

  // Leer sorteo_config
  const { data: rows, error: readErr } = await supabase.from("sorteo_config").select("*");
  if (readErr) { console.error("Error leyendo sorteo_config:", readErr.message); process.exit(1); }
  console.log("Filas encontradas:", rows.length);

  for (const row of rows) {
    console.log("ID:", row.id, "| fecha actual:", row.fecha || "(sin campo fecha)");
    console.log("raspa_config fecha:", row.raspa_config?.fecha || "(no hay)");
    console.log("---");
  }

  // Actualizar todas las filas: campo directo "fecha" si existe, y dentro de raspa_config
  for (const row of rows) {
    const raspaConfig = row.raspa_config || {};
    const meta = raspaConfig._meta || {};
    const siteConfig = meta._siteConfig || {};

    const nuevoRaspaConfig = {
      ...raspaConfig,
      fecha: FECHA_CORRECTA,
      _meta: {
        ...meta,
        _siteConfig: {
          ...siteConfig,
        },
      },
    };

    const updatePayload = {
      fecha: FECHA_CORRECTA,
      raspa_config: nuevoRaspaConfig,
    };

    const { error: updateErr } = await supabase
      .from("sorteo_config")
      .update(updatePayload)
      .eq("id", row.id);

    if (updateErr) {
      console.error("Error actualizando fila", row.id, ":", updateErr.message);
    } else {
      console.log("OK: fila", row.id, "actualizada a fecha", FECHA_CORRECTA);
    }
  }

  // Verificar resultado
  const { data: check } = await supabase.from("sorteo_config").select("id, fecha, raspa_config");
  for (const r of check || []) {
    console.log("Verificacion -> ID:", r.id, "| fecha:", r.fecha, "| raspa_config.fecha:", r.raspa_config?.fecha);
  }

  console.log("Hecho. Sorteo ahora es el 13 de diciembre de 2026.");
}

void main();
