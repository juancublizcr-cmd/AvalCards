/**
 * fecha-utils.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Utilidades centrales para manejo de fechas en Aval Community CR.
 *
 * PROBLEMA RAÍZ que este módulo resuelve:
 *   new Date("2026-09-13")          → UTC 00:00:00
 *                                   → en Costa Rica (UTC-6) = 12 de septiembre 18:00
 *   new Date("2026-09-13T19:30:00") → LOCAL 19:30:00
 *                                   → en Costa Rica = 13 de septiembre 19:30 ✓
 *
 * REGLA: Nunca usar `new Date(fechaStr)` con strings solo de fecha (YYYY-MM-DD).
 *        Siempre usar las funciones de este módulo.
 * ──────────────────────────────────────────────────────────────────────────────
 */

const MESES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export const FECHA_SORTEO_DEFAULT = "2026-09-13";
export const HORA_SORTEO_DEFAULT = "19:30"; // 7:30 PM en Costa Rica
export const HORAS_CIERRE_PREVIO_DEFAULT = 2; // Cierre 2 horas antes (5:30 PM)

export type EstadoSorteo =
  | "VENTAS_ABIERTAS" // Más de 2 horas antes de la hora del sorteo
  | "CIERRE_PREVIO"   // Dentro de las 2 horas antes del sorteo (ventas bloqueadas)
  | "EN_CURSO"        // Durante la hora del sorteo (19:30 hasta fin de jornada)
  | "FINALIZADO";     // Sorteo concluido

/**
 * Extrae solo la parte YYYY-MM-DD de cualquier string de fecha.
 */
export function extraerFechaLocal(fechaStr: string): string {
  if (!fechaStr) return FECHA_SORTEO_DEFAULT;
  return fechaStr.split("T")[0].slice(0, 10);
}

/**
 * Extrae o normaliza la hora en formato "HH:mm".
 */
export function normalizarHora(horaStr?: string): string {
  if (!horaStr || !horaStr.includes(":")) return HORA_SORTEO_DEFAULT;
  const [hh, mm] = horaStr.split(":");
  const h = String(Number(hh) || 0).padStart(2, "0");
  const m = String(Number(mm) || 0).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Convierte una fecha y hora de sorteo al timestamp exacto
 * en hora LOCAL del dispositivo (evitando desfases UTC).
 *
 * @param fechaStr - Fecha en formato "YYYY-MM-DD" o ISO
 * @param horaStr - Hora en formato "HH:mm" (default "19:30")
 * @returns timestamp en ms
 */
export function fechaSorteoATimestamp(fechaStr: string, horaStr = HORA_SORTEO_DEFAULT): number {
  const cleanFecha = extraerFechaLocal(fechaStr || FECHA_SORTEO_DEFAULT);
  const cleanHora = normalizarHora(horaStr);
  return new Date(`${cleanFecha}T${cleanHora}:00`).getTime();
}

/**
 * Formatea una hora militar (ej: "19:30") a formato 12 horas con AM/PM (ej: "7:30 PM").
 */
export function formatearHora12(horaStr?: string): string {
  const norm = normalizarHora(horaStr);
  const [h, m] = norm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Determina el estado actual del sorteo basándose en la fecha, hora y horas de cierre previo.
 */
export function obtenerEstadoSorteo(
  fechaStr: string,
  horaStr = HORA_SORTEO_DEFAULT,
  horasCierrePrevio = HORAS_CIERRE_PREVIO_DEFAULT
): {
  estado: EstadoSorteo;
  timestampSorteo: number;
  timestampCierreVentas: number;
  msParaCierre: number;
  msParaSorteo: number;
} {
  const timestampSorteo = fechaSorteoATimestamp(fechaStr, horaStr);
  const msCierre = (horasCierrePrevio || 2) * 60 * 60 * 1000;
  const timestampCierreVentas = timestampSorteo - msCierre;
  const ahora = Date.now();

  const msParaCierre = timestampCierreVentas - ahora;
  const msParaSorteo = timestampSorteo - ahora;

  let estado: EstadoSorteo = "VENTAS_ABIERTAS";

  if (msParaSorteo <= -6 * 60 * 60 * 1000) {
    // Más de 6 horas después de la hora del sorteo
    estado = "FINALIZADO";
  } else if (msParaSorteo <= 0) {
    // Llegó la hora del sorteo (19:30) y está en curso
    estado = "EN_CURSO";
  } else if (msParaCierre <= 0) {
    // Faltan 2 horas o menos para el sorteo (Ventas Cerradas)
    estado = "CIERRE_PREVIO";
  } else {
    estado = "VENTAS_ABIERTAS";
  }

  // Override de simulación para pruebas del Administrador
  if (typeof window !== "undefined") {
    try {
      const sim = localStorage.getItem("aval_simulador_sorteo_estado") as EstadoSorteo | null;
      if (sim && (sim === "VENTAS_ABIERTAS" || sim === "CIERRE_PREVIO" || sim === "EN_CURSO" || sim === "FINALIZADO")) {
        let simMsSorteo = msParaSorteo;
        if (sim === "CIERRE_PREVIO") {
          simMsSorteo = 1 * 60 * 60 * 1000 + 15 * 60 * 1000 + 42 * 1000; // 1h 15m 42s
        } else if (sim === "EN_CURSO") {
          simMsSorteo = 0;
        } else if (sim === "FINALIZADO") {
          simMsSorteo = -7 * 60 * 60 * 1000;
        }
        return {
          estado: sim,
          timestampSorteo,
          timestampCierreVentas,
          msParaCierre: sim === "CIERRE_PREVIO" ? -1000 : msParaCierre,
          msParaSorteo: simMsSorteo,
        };
      }
    } catch {}
  }

  return {
    estado,
    timestampSorteo,
    timestampCierreVentas,
    msParaCierre,
    msParaSorteo,
  };
}

/**
 * Convierte una fecha de sorteo a formato largo en español.
 * Ejemplo: "2026-09-13" → "13 de septiembre de 2026"
 */
export function formatearFechaLarga(fechaStr: string): string {
  try {
    const clean = extraerFechaLocal(fechaStr || FECHA_SORTEO_DEFAULT);
    const parts = clean.split("-").map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const mesNombre = MESES_ES[parts[1] - 1] ?? "septiembre";
      return `${parts[2]} de ${mesNombre} de ${parts[0]}`;
    }
  } catch {
    // fallthrough
  }
  return "13 de septiembre de 2026";
}

/**
 * Convierte una fecha de sorteo a formato corto en español.
 * Ejemplo: "2026-09-13" → "13 sep 2026"
 */
export function formatearFechaCorta(fechaStr: string): string {
  try {
    const clean = extraerFechaLocal(fechaStr || FECHA_SORTEO_DEFAULT);
    const parts = clean.split("-").map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const mesCorto = MESES_ES[parts[1] - 1]?.slice(0, 3) ?? "sep";
      return `${parts[2]} ${mesCorto} ${parts[0]}`;
    }
  } catch {
    // fallthrough
  }
  return "13 sep 2026";
}

/**
 * Calcula los componentes del countdown a partir de una fecha y hora objetivo.
 */
export function calcularCountdown(fechaStr: string, horaStr = HORA_SORTEO_DEFAULT) {
  const objetivo = fechaSorteoATimestamp(fechaStr, horaStr);
  const diff = Math.max(0, objetivo - Date.now());
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1_000) % 60),
    terminado: diff === 0,
  };
}

/**
 * Calcula el próximo mini-sorteo según día y hora configurada.
 */
export function calcularProximoMiniSorteo(horaViernes = "19:30", horaDomingos = "19:30") {
  const ahora = new Date();
  const [hV, mV] = normalizarHora(horaViernes).split(":").map(Number);
  const [hD, mD] = normalizarHora(horaDomingos).split(":").map(Number);

  // Próximo Viernes
  const proxViernes = new Date(ahora);
  const diasHastaViernes =
    (5 - ahora.getDay() + 7) % 7 ||
    (ahora.getDay() === 5 && (ahora.getHours() > hV || (ahora.getHours() === hV && ahora.getMinutes() >= mV)) ? 7 : 0);
  proxViernes.setDate(ahora.getDate() + diasHastaViernes);
  proxViernes.setHours(hV, mV, 0, 0);

  // Próximo Domingo
  const proxDomingo = new Date(ahora);
  const diasHastaDomingo =
    (0 - ahora.getDay() + 7) % 7 ||
    (ahora.getDay() === 0 && (ahora.getHours() > hD || (ahora.getHours() === hD && ahora.getMinutes() >= mD)) ? 7 : 0);
  proxDomingo.setDate(ahora.getDate() + diasHastaDomingo);
  proxDomingo.setHours(hD, mD, 0, 0);

  let targetDate = proxViernes;
  let targetNom = "⛽ Viernes de Tanque Lleno (₡50,000 en Gasolina)";
  let tipo: "gasolina" | "playstation" = "gasolina";

  if (proxDomingo.getTime() < proxViernes.getTime()) {
    targetDate = proxDomingo;
    targetNom = "🎮 Domingos de PlayStation 5 Extra";
    tipo = "playstation";
  }

  const diff = Math.max(0, targetDate.getTime() - ahora.getTime());
  return {
    targetDate,
    nombre: targetNom,
    tipo,
    tiempo: {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff / 3_600_000) % 24),
      m: Math.floor((diff / 60_000) % 60),
      s: Math.floor((diff / 1_000) % 60),
      terminado: diff === 0,
    },
  };
}
