import { supabase } from "@/lib/supabase";

// ────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────

export type Orden = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  cantidad: number;
  precio: number;
  numeros: string[];
  comprobante_url: string | null;
  estado: "pendiente" | "aprobada" | "rechazada";
  fecha: string;
  metodo_pago?: string;
  transaccion_id?: string;
  supertoken?: boolean;
  monto_supertoken?: number;
  referido_por?: string;
};

export type Seleccion = {
  cantidad: number;
  precio: number;
  numeros: string[];
  supertoken?: boolean;
  monto_supertoken?: number;
  referido_por?: string;
};

// ────────────────────────────────────────────────────────────
// Selección temporal (sessionStorage)
// ────────────────────────────────────────────────────────────

const KEY_SELECCION = "sg_seleccion";

export function guardarSeleccion(s: Seleccion) {
  sessionStorage.setItem(KEY_SELECCION, JSON.stringify(s));
}

export function leerSeleccion(): Seleccion | null {
  try {
    const raw = sessionStorage.getItem(KEY_SELECCION);
    return raw ? (JSON.parse(raw) as Seleccion) : null;
  } catch {
    return null;
  }
}

export function limpiarSeleccion() {
  sessionStorage.removeItem(KEY_SELECCION);
}

// ────────────────────────────────────────────────────────────
// Órdenes – Supabase
// ────────────────────────────────────────────────────────────

function normalizarOrden(item: any): Orden {
  let ref = item.referido_por;
  if (!ref && item.transaccion_id) {
    const match = item.transaccion_id.match(/\[REF:([^\]]+)\]/);
    if (match) ref = match[1];
  }
  return {
    ...item,
    referido_por: ref || undefined,
  } as Orden;
}

export async function fetchOrdenes(): Promise<Orden[]> {
  try {
    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
      .order("fecha", { ascending: false });
    if (error) {
      console.warn("fetchOrdenes error:", error.message);
      return [];
    }
    return (data ?? []).map(normalizarOrden);
  } catch (err) {
    console.warn("fetchOrdenes exception:", err);
    return [];
  }
}

/**
 * Sube el comprobante al Storage y crea la orden en la DB.
 */
export async function crearOrden(
  orden: Omit<Orden, "comprobante_url">,
  archivo: File | null,
): Promise<void> {
  let comprobante_url: string | null = null;

  if (archivo) {
    try {
      const ext = archivo.name.split(".").pop() ?? "jpg";
      const path = `${orden.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("comprobantes")
        .upload(path, archivo, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("comprobantes")
          .getPublicUrl(path);
        comprobante_url = urlData?.publicUrl ?? null;
      }
    } catch (e) {
      console.warn("Error subiendo comprobante a Storage:", e);
    }
  }

  const refTag = orden.referido_por ? ` [REF:${orden.referido_por.replace(/\D/g, "")}]` : "";
  const finalTxId = ((orden.transaccion_id || "") + refTag).trim();

  const insertData: Record<string, any> = {
    ...orden,
    transaccion_id: finalTxId,
    comprobante_url,
  };
  let { error } = await supabase.from("ordenes").insert(insertData);

  // Si la tabla en Supabase no tiene la columna referido_por aún, reintentar sin ese campo
  if (error && (error.message?.includes("referido_por") || error.code === "PGRST204" || error.code === "42703")) {
    console.warn("Supabase ordenes no tiene columna referido_por, guardando con transaccion_id fallback:", error.message);
    delete insertData.referido_por;
    const retry = await supabase.from("ordenes").insert(insertData);
    error = retry.error;
  }

  if (error) throw new Error(error.message);
}

export async function actualizarEstadoOrden(
  id: string,
  estado: Orden["estado"],
): Promise<void> {
  const { error } = await supabase
    .from("ordenes")
    .update({ estado })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function buscarPorTelefono(termino: string): Promise<Orden[]> {
  const t = termino.trim();
  if (!t) return [];

  // Si busca por correo
  if (t.includes("@")) {
    try {
      const { data, error } = await supabase
        .from("ordenes")
        .select("*")
        .ilike("email", t)
        .order("fecha", { ascending: false });
      if (!error && data) return data.map(normalizarOrden);
    } catch {
      return [];
    }
  }

  const digits = t.replace(/\D/g, "");
  if (digits.length < 8) return [];

  try {
    const raw8 = digits.slice(-8);
    const formatted = `${raw8.slice(0, 4)}-${raw8.slice(4)}`;
    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
      .or(
        `telefono.eq.${raw8},telefono.eq.${formatted},telefono.ilike.%${raw8}%,telefono.ilike.%${formatted}%`,
      )
      .order("fecha", { ascending: false });

    if (error) {
      console.warn("buscarPorTelefono error:", error.message);
      return [];
    }
    return (data ?? []).map(normalizarOrden);
  } catch {
    return [];
  }
}

export async function fetchReferidosPorTelefono(termino: string): Promise<Orden[]> {
  const digits = termino.replace(/\D/g, "");
  if (digits.length < 8) return [];
  try {
    const raw8 = digits.slice(-8);
    const formatted = `${raw8.slice(0, 4)}-${raw8.slice(4)}`;
    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
      .or(
        `transaccion_id.ilike.%[REF:${raw8}]%,transaccion_id.ilike.%[REF:${formatted}]%,transaccion_id.ilike.%${raw8}%`,
      )
      .order("fecha", { ascending: false });

    if (error || !data) return [];
    return data.map(normalizarOrden);
  } catch {
    return [];
  }
}

export async function obtenerInfoReferente(
  telefonoRef: string,
): Promise<{ nombre: string; telefono: string } | null> {
  const digits = telefonoRef.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const raw8 = digits.slice(-8);
  const formatted = `${raw8.slice(0, 4)}-${raw8.slice(4)}`;
  try {
    const { data, error } = await supabase
      .from("ordenes")
      .select("nombre, telefono")
      .or(
        `telefono.eq.${raw8},telefono.eq.${formatted},telefono.ilike.%${raw8}%,telefono.ilike.%${formatted}%`,
      )
      .limit(1);
    if (!error && data && data.length > 0 && data[0].nombre) {
      return { nombre: data[0].nombre, telefono: data[0].telefono || formatted };
    }
    return { nombre: "Referente Oficial", telefono: formatted };
  } catch {
    return { nombre: "Referente Oficial", telefono: formatted };
  }
}

export const fetchOrdenesPorTelefono = buscarPorTelefono;

/**
 * Retorna todos los números ya asignados o en proceso en Supabase para evitar duplicados.
 */
export async function fetchNumerosOcupados(): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from("ordenes")
      .select("numeros")
      .neq("estado", "rechazada");

    if (error || !data) return new Set();
    const ocupados = new Set<string>();
    for (const item of data) {
      if (Array.isArray(item.numeros)) {
        for (const num of item.numeros) {
          if (typeof num === "string" && num.trim()) {
            ocupados.add(num.trim());
          }
        }
      }
    }
    return ocupados;
  } catch {
    return new Set();
  }
}