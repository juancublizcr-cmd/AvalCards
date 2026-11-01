import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/routes/login";

export type AuditAccion =
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FALLIDO"
  | "APROBAR_ORDEN"
  | "RECHAZAR_ORDEN"
  | "CREAR_USUARIO"
  | "EDITAR_USUARIO"
  | "ELIMINAR_USUARIO"
  | "CAMBIO_CLAVE"
  | "EDITAR_CONFIG"
  | "EDITAR_TERMOMETRO"
  | "GUARDAR_SORTEO"
  | "ARCHIVAR_EDICION"
  | "EDITAR_PREMIO"
  | "ACCESO_SECCION";

export interface AuditLog {
  id: string;
  timestamp: string; // ISO 8601
  fechaFormateada: string;
  horaFormateada: string;
  usuarioEmail: string;
  usuarioNombre: string;
  esSuperadmin: boolean;
  accion: AuditAccion;
  titulo: string;
  detalles: string;
  seccion?: string;
  ip?: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = "aval_audit_logs_cache";
const MAX_LOGS = 500;

function formatearFecha(date: Date): { fecha: string; hora: string } {
  try {
    const fecha = date.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const hora = date.toLocaleTimeString("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return { fecha, hora };
  } catch {
    return {
      fecha: date.toISOString().split("T")[0],
      hora: date.toTimeString().split(" ")[0],
    };
  }
}

/**
 * Consulta la lista histórica de eventos de auditoría desde Supabase
 */
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const { data, error } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data?.raspa_config?._meta?._audit_logs) {
      const logs = data.raspa_config._meta._audit_logs as AuditLog[];
      if (Array.isArray(logs)) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
          } catch {}
        }
        return logs;
      }
    }
  } catch (err) {
    console.warn("No se pudo leer _audit_logs de Supabase, usando caché local:", err);
  }

  // Respaldo local
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }

  return [];
}

/**
 * Registra una acción de auditoría en tiempo real en Supabase y localmente.
 * Diseñado para ser no-bloqueante (no interrumpe el flujo principal si falla la red).
 */
export async function registrarAuditoria(params: {
  accion: AuditAccion;
  titulo: string;
  detalles: string;
  seccion?: string;
  usuarioOverride?: {
    email: string;
    nombre: string;
    esSuperadmin: boolean;
  };
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const ahora = new Date();
    const { fecha, hora } = formatearFecha(ahora);

    const sesion = getAdminSession();
    const email = params.usuarioOverride?.email || sesion?.email || "anonimo@sistema";
    const nombre = params.usuarioOverride?.nombre || sesion?.nombre || "Usuario Desconocido";
    const esSuperadmin = params.usuarioOverride?.esSuperadmin ?? (sesion?.esSuperadmin ?? false);

    const nuevoLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: ahora.toISOString(),
      fechaFormateada: fecha,
      horaFormateada: hora,
      usuarioEmail: email,
      usuarioNombre: nombre,
      esSuperadmin,
      accion: params.accion,
      titulo: params.titulo,
      detalles: params.detalles,
      seccion: params.seccion,
      metadata: params.metadata,
    };

    // 1. Guardado inmediato en memoria/localStorage para reactividad instantánea
    let listaActual: AuditLog[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) listaActual = JSON.parse(raw);
      } catch {}
    }

    const listaActualizada = [nuevoLog, ...listaActual.filter((l) => l.id !== nuevoLog.id)].slice(0, MAX_LOGS);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listaActualizada));
      } catch {}
    }

    // 2. Persistencia en Supabase en segundo plano
    void (async () => {
      try {
        const { data } = await supabase
          .from("sorteo_config")
          .select("raspa_config")
          .eq("id", 1)
          .maybeSingle();

        const raspaActual = data?.raspa_config || {};
        const metaActual = raspaActual._meta || {};
        const logsRemotos: AuditLog[] = Array.isArray(metaActual._audit_logs) ? metaActual._audit_logs : [];

        const logsFinales = [nuevoLog, ...logsRemotos.filter((l) => l.id !== nuevoLog.id)].slice(0, MAX_LOGS);

        await supabase
          .from("sorteo_config")
          .update({
            raspa_config: {
              ...raspaActual,
              _meta: {
                ...metaActual,
                _audit_logs: logsFinales,
              },
            },
          })
          .eq("id", 1);
      } catch (err) {
        console.warn("Error background guardando log de auditoría en Supabase:", err);
      }
    })();
  } catch (err) {
    console.error("Error al registrar auditoría:", err);
  }
}

/**
 * Permite al Superadmin limpiar los registros antiguos de auditoría si lo desea.
 */
export async function limpiarLogsAuditoria(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const { data } = await supabase
    .from("sorteo_config")
    .select("raspa_config")
    .eq("id", 1)
    .maybeSingle();

  const raspaActual = data?.raspa_config || {};
  const metaActual = raspaActual._meta || {};

  await supabase
    .from("sorteo_config")
    .update({
      raspa_config: {
        ...raspaActual,
        _meta: {
          ...metaActual,
          _audit_logs: [],
        },
      },
    })
    .eq("id", 1);
}
