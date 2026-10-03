import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type Payment = {
  id: string;
  payment_request_id?: string | null;
  orden_id?: string | null;
  sinpe_reference: string;
  sender_name?: string | null;
  sender_phone?: string | null;
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "revision" | "unassigned";
  raw_payload?: any;
  created_at: string;
};

/**
 * Obtiene los pagos registrados desde la tabla `payments`.
 * Si la tabla aún no existe o hay error de red, devuelve una lista vacía de forma segura.
 */
export async function fetchPayments(): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.warn("fetchPayments aviso:", error.message);
      return [];
    }

    return (data || []).map((p: any) => {
      let ref = p.sinpe_reference || p.reference || "";
      // Si no hay referencia SINPE y es un UUID antiguo, mostramos una clave corta y limpia
      if (!ref && p.id) {
        ref = p.id.length > 10 ? p.id.slice(0, 8).toUpperCase() : p.id;
      }

      return {
        ...p,
        sinpe_reference: String(ref).trim(),
        sender_name: p.sender_name || p.client_name || p.nombre || "Emisor SINPE",
        sender_phone: p.sender_phone || "",
        amount: Number(p.amount) || 0,
        currency: p.currency || "CRC",
        status: p.status || "confirmed",
        created_at: p.created_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.warn("fetchPayments exception:", err);
    return [];
  }
}

/**
 * Asocia un pago a una orden específica y actualiza el estado.
 */
export async function asociarPagoAOrden(
  paymentId: string,
  ordenId: string,
  nuevoEstado: Payment["status"] = "confirmed"
): Promise<void> {
  const { error } = await supabase
    .from("payments")
    .update({
      orden_id: ordenId,
      status: nuevoEstado,
    })
    .eq("id", paymentId);

  if (error) {
    console.warn("asociarPagoAOrden aviso:", error.message);
  }
}

/**
 * Registra un pago de prueba para verificar el flujo en vivo.
 */
export async function registrarPagoPrueba(pago: Partial<Payment>): Promise<Payment> {
  const ref = pago.sinpe_reference || Math.floor(100000 + Math.random() * 900000).toString();
  const nombre = pago.sender_name || "Carlos Mora González";
  const nuevoPago: Record<string, any> = {
    amount: pago.amount || 25000,
    currency: "CRC",
    status: pago.status || "confirmed",
    sinpe_reference: ref,
    sender_name: nombre,
    client_name: nombre,
    sender_phone: pago.sender_phone || "8888-7777",
    orden_id: pago.orden_id || null,
  };

  let { data, error } = await supabase
    .from("payments")
    .insert([nuevoPago])
    .select()
    .single();

  if (error) {
    // Si la tabla payments no tiene aún las columnas nuevas, insertar con esquema base
    if (error.code === "PGRST204" || error.code === "42703" || error.message?.includes("column")) {
      delete nuevoPago.sinpe_reference;
      delete nuevoPago.sender_name;
      delete nuevoPago.sender_phone;
      delete nuevoPago.orden_id;
      delete nuevoPago.currency;
      delete nuevoPago.status;
      nuevoPago.payment_type = "sinpe";
      const retry = await supabase.from("payments").insert([nuevoPago]).select().single();
      if (retry.error) throw new Error(retry.error.message);
      data = { ...retry.data, sinpe_reference: ref, sender_name: nombre, status: "confirmed" };
    } else {
      throw new Error(error.message);
    }
  }

  return {
    ...data,
    sinpe_reference: String(data.sinpe_reference || ref),
    sender_name: data.sender_name || nombre,
    amount: Number(data.amount) || pago.amount || 25000,
    status: data.status || "confirmed",
  } as Payment;
}

/**
 * Suscribe a eventos en tiempo real de la tabla `payments`.
 */
export function suscribirPagosRealtime(
  onInsert: (nuevoPago: Payment) => void,
  onUpdate: (pagoActualizado: Payment) => void,
  onStatusChange?: (status: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel("payments-realtime-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "payments" },
      (payload) => {
        const item = payload.new as any;
        let ref = item.sinpe_reference || item.reference || "";
        if (!ref && item.id) {
          ref = item.id.length > 10 ? item.id.slice(0, 8).toUpperCase() : item.id;
        }

        onInsert({
          ...item,
          sinpe_reference: String(ref).trim(),
          sender_name: item.sender_name || item.client_name || item.nombre || "Emisor SINPE",
          sender_phone: item.sender_phone || "",
          amount: Number(item.amount) || 0,
          currency: item.currency || "CRC",
          status: item.status || "confirmed",
          created_at: item.created_at || new Date().toISOString(),
        });
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "payments" },
      (payload) => {
        const item = payload.new as any;
        let ref = item.sinpe_reference || item.reference || "";
        if (!ref && item.id) {
          ref = item.id.length > 10 ? item.id.slice(0, 8).toUpperCase() : item.id;
        }

        onUpdate({
          ...item,
          sinpe_reference: String(ref).trim(),
          sender_name: item.sender_name || item.client_name || item.nombre || "Emisor SINPE",
          sender_phone: item.sender_phone || "",
          amount: Number(item.amount) || 0,
          currency: item.currency || "CRC",
          status: item.status || "confirmed",
          created_at: item.created_at || new Date().toISOString(),
        });
      }
    )
    .subscribe((status) => {
      onStatusChange?.(status);
    });

  return channel;
}
