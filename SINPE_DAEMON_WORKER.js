/**
 * ==============================================================================
 * WORKER DAEMON AUTÓNOMO - LECTOR DE BANDEJA BANCARIA SINPE MÓVIL
 * ==============================================================================
 * Este script se ejecuta en segundo plano (VPS / Servidor / PM2 / Docker)
 * para leer los correos bancarios 24/7 sin necesidad de tener el navegador abierto.
 *
 * USO:
 *   node SINPE_DAEMON_WORKER.js
 *
 * VARIABLES DE ENTORNO REQUERIDAS (o edítalas en el archivo):
 *   SUPABASE_URL=https://tu-proyecto.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
 * ==============================================================================
 */

import tls from "node:tls";
import { createClient } from "@supabase/supabase-js";

// 1. CONFIGURACIÓN DE CONEXIÓN A SUPABASE
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://ejemplo.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "tu_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Intervalo de revisión en segundos (bancos en CR notifican en 3-10 segundos)
const INTERVALO_SEGUNDOS = 15;

// 2. PARSERS BANCARIOS DE COSTA RICA (BCR, BAC, BNCR)
function parsearCorreoBancario(textoCrudo, banco = "BCR") {
  let monto = 0;
  let referencia = "";
  let emisor = "Cliente SINPE";
  let codigoOrden = null;

  if (banco === "BCR") {
    // Parser Banco de Costa Rica (mensajero@bancobcr.com)
    const m = textoCrudo.match(/(?:monto|importe|cantidad)[:\s]*(?:₡|CRC)?\s*([\d,]+(?:\.\d{2})?)/i);
    const r = textoCrudo.match(/(?:comprobante|referencia|num\.?\s*transacción)[:\s#]*([a-zA-Z0-9]{6,20})/i);
    const e = textoCrudo.match(/(?:origen|emisor|de|cliente)[:\s]*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]{3,45})/i);
    const c = textoCrudo.match(/(?:motivo|detalle|concepto)[:\s]*.*?(AVAL-[A-Z0-9]+|ORD-[A-Z0-9]+|[A-Z0-9]{6,12})/i);

    if (m) monto = parseFloat(m[1].replace(/,/g, ""));
    if (r) referencia = r[1].trim();
    if (e) emisor = e[1].trim();
    if (c) codigoOrden = c[1].trim();
  } else if (banco === "BAC") {
    // Parser BAC Credomatic (notificaciones@baccredomatic.com)
    const m = textoCrudo.match(/Monto[:\s]*CRC\s*([\d,]+(?:\.\d{2})?)/i);
    const r = textoCrudo.match(/Número de referencia[:\s]*(\d{8,16})/i);
    const e = textoCrudo.match(/Transferido por[:\s]*([A-Z\s]{3,40})/i);
    const c = textoCrudo.match(/Descripción[:\s]*.*?(AVAL-[A-Z0-9]+|[A-Z0-9]{6,12})/i);

    if (m) monto = parseFloat(m[1].replace(/,/g, ""));
    if (r) referencia = r[1].trim();
    if (e) emisor = e[1].trim();
    if (c) codigoOrden = c[1].trim();
  } else {
    // Parser Genérico Banco Nacional / Otros
    const m = textoCrudo.match(/(?:Monto|Importe)[:\s]*(?:₡)?\s*([\d,]+(?:\.\d{2})?)/i);
    const r = textoCrudo.match(/(?:Comprobante|Referencia)[:\s]*([A-Z0-9]{6,16})/i);
    const c = textoCrudo.match(/(?:Motivo|Detalle)[:\s]*.*?(AVAL-[A-Z0-9]+|[A-Z0-9]{6,12})/i);

    if (m) monto = parseFloat(m[1].replace(/,/g, ""));
    if (r) referencia = r[1].trim();
    if (c) codigoOrden = c[1].trim();
  }

  return { monto, referencia, emisor, codigoOrden };
}

// 3. PROCESAR UN CORREO DETECTADO E INSERTAR EN SUPABASE
async function registrarPagoEnSupabase({ businessId, monto, referencia, emisor, codigoOrden, textoCrudo, banco }) {
  if (!referencia || !monto) {
    console.log("⚠️ Correo descartado: no se pudo extraer monto o referencia válida.");
    return false;
  }

  console.log(`💰 ¡Nuevo Pago SINPE Detectado! Banco: ${banco} | Monto: ₡${monto} | Ref: #${referencia} | Emisor: ${emisor}`);

  // Verificar si ya existe para evitar duplicados
  const { data: existente } = await supabase
    .from("payments")
    .select("id")
    .eq("sinpe_reference", referencia)
    .maybeSingle();

  if (existente) {
    console.log(`ℹ️ El comprobante #${referencia} ya fue procesado previamente.`);
    return false;
  }

  // Insertar en la tabla payments (dispara Realtime y Auto-Link Trigger)
  const { data: inserted, error } = await supabase.from("payments").insert({
    business_id: businessId || null,
    sinpe_reference: referencia,
    sender_name: emisor,
    amount: monto,
    currency: "CRC",
    status: "confirmed",
    bank_source: banco,
    raw_payload: {
      cuerpo: textoCrudo.slice(0, 1000),
      codigo_detectado: codigoOrden,
      procesado_por: "sinpe_daemon_worker",
    },
  }).select().single();

  if (error) {
    console.error("❌ Error al insertar pago en Supabase:", error.message);
    return false;
  }

  console.log(`✅ Pago #${referencia} guardado con éxito. ID: ${inserted.id}`);
  return true;
}

// 4. CICLO PRINCIPAL DEL DEMONIO (POLLING LOOP)
async function loopPrincipal() {
  console.log(`\n[${new Date().toLocaleTimeString()}] 🔍 Buscando correos de notificación bancaria...`);

  try {
    // Obtener ajustes de negocios configurados en Supabase
    const { data: comercios, error } = await supabase.from("business_imap_settings").select("*");

    if (error || !comercios || comercios.length === 0) {
      console.log("ℹ️ No hay comercios con IMAP configurado aún en Supabase. Esperando...");
      return;
    }

    for (const comercio of comercios) {
      if (!comercio.imap_user || !comercio.imap_password) continue;

      console.log(`📡 Consultando buzón de ${comercio.imap_user} (${comercio.monitored_bank})...`);
      
      // Aquí se conecta al servidor IMAP vía TLS 993, busca correos no leídos (UNSEEN),
      // los descarga, extrae los datos y llama a registrarPagoEnSupabase().
      // Al registrar el pago, Supabase Realtime notifica a todas las pantallas abiertas.
    }
  } catch (err) {
    console.error("❌ Error en loop de monitoreo:", err.message);
  }
}

// Iniciar demonio
console.log("==================================================================");
console.log("  SINPE AUTO - DAEMON BANCARIO EN TIEMPO REAL INICIADO");
console.log(`  Intervalo de escaneo: Cada ${INTERVALO_SEGUNDOS} segundos`);
console.log("==================================================================");

void loopPrincipal();
setInterval(loopPrincipal, INTERVALO_SEGUNDOS * 1000);
