import type { Orden } from "@/lib/orders";
import type { Cliente } from "@/lib/admin-store";

/**
 * Exporta el listado completo de órdenes a formato Excel (CSV compatible con Excel Windows/Mac)
 */
export function exportarOrdenesExcel(ordenes: Orden[]): void {
  if (ordenes.length === 0) return;

  const encabezados = [
    "ID_Orden",
    "Fecha",
    "Hora",
    "Titular",
    "Telefono",
    "Email",
    "Estado",
    "Metodo_Pago",
    "SuperToken",
    "Monto_SuperToken_CRC",
    "Monto_Total_CRC",
    "Cantidad_Tokens",
    "Numeros_Asignados",
    "ID_Transaccion",
  ];

  const filas = ordenes.map((o) => {
    const d = new Date(o.fecha);
    const fechaStr = d.toLocaleDateString("es-CR");
    const horaStr = d.toLocaleTimeString("es-CR");
    const numsStr = (o.numeros || []).join(" - ");

    return [
      `"${o.id}"`,
      `"${fechaStr}"`,
      `"${horaStr}"`,
      `"${(o.nombre || "").replace(/"/g, '""')}"`,
      `"${o.telefono || ""}"`,
      `"${(o.email || "").replace(/"/g, '""')}"`,
      `"${(o.estado || "pendiente").toUpperCase()}"`,
      `"${(o.metodo_pago || "sinpe").toUpperCase()}"`,
      o.supertoken ? '"SI (+$6,000 USD)"' : '"NO"',
      o.monto_supertoken || 0,
      o.precio || 0,
      o.cantidad || 0,
      `"${numsStr}"`,
      `"${o.transaccion_id || ""}"`,
    ];
  });

  const csvContent = "\uFEFF" + [encabezados.join(";"), ...filas.map((f) => f.join(";"))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Reporte-Ventas-AvalMotors-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta el listado de clientes a formato Excel (CSV)
 */
export function exportarClientesExcel(clientes: Cliente[]): void {
  if (clientes.length === 0) return;

  const encabezados = [
    "Nombre_Completo",
    "Telefono",
    "Email",
    "Total_Compras",
    "Total_Tokens",
    "SuperTokens_Adquiridos",
    "Total_Invertido_CRC",
    "Ultima_Fecha_Compra",
  ];

  const filas = clientes.map((c) => {
    const d = new Date(c.ultimaFecha);
    return [
      `"${(c.nombre || "").replace(/"/g, '""')}"`,
      `"${c.telefono || ""}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      c.compras || 0,
      c.stickers || 0,
      c.supertokenCount || 0,
      c.invertido || 0,
      `"${d.toLocaleDateString("es-CR")}"`,
    ];
  });

  const csvContent = "\uFEFF" + [encabezados.join(";"), ...filas.map((f) => f.join(";"))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Reporte-Clientes-AvalMotors-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
