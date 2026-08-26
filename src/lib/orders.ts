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
};

export type Seleccion = {
  cantidad: number;
  precio: number;
  numeros: string[];
  supertoken?: boolean;
  monto_supertoken?: number;
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
    return (data ?? []) as Orden[];
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

  const { error } = await supabase
    .from("ordenes")
    .insert({ ...orden, comprobante_url });
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
      if (!error && data) return data as Orden[];
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
    return (data ?? []) as Orden[];
  } catch {
    return [];
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