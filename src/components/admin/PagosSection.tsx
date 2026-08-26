import { useMemo, useState } from "react";
import {
  Check,
  Coins,
  CreditCard,
  Crown,
  Download,
  Eye,
  FileSpreadsheet,
  Search,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Orden } from "@/lib/orders";
import { exportarOrdenesExcel } from "@/lib/export-excel";

const POR_PAGINA = 8;

const ESTADO_CLASE: Record<Orden["estado"], string> = {
  pendiente: "bg-accent text-accent-foreground",
  aprobada: "bg-success/15 text-success",
  rechazada: "bg-destructive/10 text-destructive",
};

export function PagosSection({
  ordenes,
  onEstado,
}: {
  ordenes: Orden[];
  onEstado: (id: string, estado: Orden["estado"]) => void;
}) {
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<string>("todos");
  const [filtroMetodo, setFiltroMetodo] = useState<string>("todos");
  const [pagina, setPagina] = useState(1);
  const [detalle, setDetalle] = useState<Orden | null>(null);

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    return ordenes.filter((o) => {
      const metodoActual = o.metodo_pago || "sinpe";
      const cumpleMetodo = filtroMetodo === "todos" || metodoActual === filtroMetodo;
      const cumpleEstado = estado === "todos" || o.estado === estado;
      const cumpleBusqueda =
        t === "" ||
        o.nombre.toLowerCase().includes(t) ||
        o.email.toLowerCase().includes(t) ||
        o.telefono.includes(t) ||
        o.id.toLowerCase().includes(t) ||
        (o.transaccion_id && o.transaccion_id.toLowerCase().includes(t));

      return cumpleMetodo && cumpleEstado && cumpleBusqueda;
    });
  }, [ordenes, q, estado, filtroMetodo]);

  const paginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const actual = Math.min(pagina, paginas);
  const visibles = filtradas.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA);

  const handleExportarExcel = () => {
    if (filtradas.length === 0) {
      toast.error("No hay órdenes para exportar");
      return;
    }
    exportarOrdenesExcel(filtradas);
    toast.success("¡Órdenes y números exportados a Excel!");
  };

  const decidir = (o: Orden, nuevo: Orden["estado"]) => {
    onEstado(o.id, nuevo);
    setDetalle(null);
    if (nuevo === "aprobada") {
      toast.success("Transacción aprobada", {
        description: `Se actualizó la orden ${o.id} en la base de datos.`,
      });
    } else {
      toast.error("Transacción rechazada", {
        description: `La orden ${o.id} fue marcada como rechazada.`,
      });
    }
  };

  const badgeMetodo = (m?: string) => {
    if (m === "tarjeta") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          <CreditCard className="size-3" /> Tarjeta (TiloPay)
        </span>
      );
    }
    if (m === "crypto") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
          <Coins className="size-3" /> Cripto (USDT)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500">
        <Smartphone className="size-3" /> SINPE Móvil
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold text-lg">Registro de Pagos y Transacciones</h2>
          <p className="text-xs text-muted-foreground">
            {filtradas.length} transacción(es) · SINPE Móvil, Tarjetas TiloPay y Cripto USDT
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportarExcel} className="gap-1.5 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">
            <FileSpreadsheet className="size-4 text-emerald-500" /> Exportar a Excel
          </Button>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar cliente, orden, teléfono o TXID"
              className="w-60 pl-9"
            />
          </div>

          <Select
            value={filtroMetodo}
            onValueChange={(v) => {
              setFiltroMetodo(v);
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los Métodos</SelectItem>
              <SelectItem value="sinpe">SINPE Móvil</SelectItem>
              <SelectItem value="tarjeta">Tarjeta TiloPay</SelectItem>
              <SelectItem value="crypto">Cripto USDT</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={estado}
            onValueChange={(v) => {
              setEstado(v);
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="aprobada">Aprobados</SelectItem>
              <SelectItem value="rechazada">Rechazados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Orden</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Método de Pago</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 font-medium">Paquete</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-5 py-4 font-mono text-xs font-bold">
                  <div>{o.id}</div>
                  {o.supertoken && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 mt-1">
                      <Crown className="size-2.5" /> SuperToken $6K
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium">{o.nombre}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </td>
                <td className="px-5 py-4">{badgeMetodo(o.metodo_pago)}</td>
                <td className="px-5 py-4 font-mono">{o.telefono}</td>
                <td className="px-5 py-4">
                  <div>{o.cantidad} stickers</div>
                  <div className="text-xs text-muted-foreground">
                    ₡{o.precio.toLocaleString("es-CR")}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ESTADO_CLASE[o.estado]}`}
                  >
                    {o.estado}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDetalle(o)}>
                      <Eye /> Ver Detalle
                    </Button>
                    {o.estado === "pendiente" ? (
                      <>
                        <Button variant="success" size="sm" onClick={() => decidir(o, "aprobada")}>
                          <Check /> Aprobar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => decidir(o, "rechazada")}
                        >
                          <X /> Rechazar
                        </Button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Sin resultados para los filtros aplicados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
        <span className="text-muted-foreground">
          Página {actual} de {paginas}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={actual <= 1}
            onClick={() => setPagina(actual - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={actual >= paginas}
            onClick={() => setPagina(actual + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Drawer de Detalle de Transacción */}
      <Sheet open={!!detalle} onOpenChange={(v) => !v && setDetalle(null)}>
        <SheetContent side="right" className="admin-light w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Detalle de Transacción · {detalle?.id}</SheetTitle>
            <SheetDescription>Revisión de cobro, comprobante y stickers</SheetDescription>
          </SheetHeader>
          {detalle ? (
            <div className="space-y-4 px-4 pb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Dato label="Cliente" valor={detalle.nombre} />
                <Dato label="Teléfono" valor={detalle.telefono} />
                <Dato label="Correo" valor={detalle.email} />
                <Dato
                  label="Monto"
                  valor={`₡${detalle.precio.toLocaleString("es-CR")} · ${detalle.cantidad} stickers`}
                />
                <Dato
                  label="Método de Pago"
                  valor={
                    detalle.metodo_pago === "tarjeta"
                      ? "Tarjeta Débito/Crédito (TiloPay)"
                      : detalle.metodo_pago === "crypto"
                        ? "Criptomonedas (USDT)"
                        : "SINPE Móvil"
                  }
                />
                <Dato
                  label="ID Transacción / TXID"
                  valor={detalle.transaccion_id || "N/A (SINPE tradicional)"}
                />
              </div>

              {detalle.supertoken && (
                <div className="flex items-center gap-3 rounded-xl border-2 border-amber-500/50 bg-amber-500/15 p-3.5 text-xs text-amber-500 font-medium shadow-sm">
                  <Crown className="size-5 text-amber-500 shrink-0" />
                  <div>
                    <strong className="block text-sm">SuperToken VIP ($6,000 USD Cash) Activo</strong>
                    <span>Esta orden califica para el bono adicional de $6,000 en efectivo (~₡3,100,000) si gana el 1° Lugar.</span>
                  </div>
                </div>
              )}

              {/* Vista según método de pago */}
              {detalle.metodo_pago === "tarjeta" ? (
                <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-center space-y-2">
                  <ShieldCheck className="size-8 text-primary mx-auto" />
                  <div className="font-bold text-sm text-primary">Transacción Aprobada por TiloPay</div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Autorización: {detalle.transaccion_id || "TILO-AUTH-OK"}
                  </p>
                </div>
              ) : detalle.metodo_pago === "crypto" ? (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-2 text-xs">
                  <div className="font-bold text-amber-500 flex items-center gap-1.5">
                    <Coins className="size-4" /> Depósito Blockchain USDT
                  </div>
                  <div className="font-mono text-[11px] break-all bg-card p-2 rounded border">
                    TXID: {detalle.transaccion_id || "Pendiente de confirmación"}
                  </div>
                </div>
              ) : detalle.comprobante_url ? (
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Comprobante SINPE Móvil:</p>
                  <img
                    src={detalle.comprobante_url}
                    alt={`Comprobante de ${detalle.nombre}`}
                    className="w-full rounded-lg border border-border object-contain max-h-96"
                  />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                  Sin imagen adjunta
                </div>
              )}

              <div>
                <p className="mb-2 text-sm font-medium">Stickers Asignados ({detalle.cantidad})</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {detalle.numeros.map((n) => (
                    <span
                      key={n}
                      className="rounded border border-primary/30 bg-secondary px-2 py-1 text-center font-mono text-xs font-bold text-primary"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {detalle.estado === "pendiente" ? (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={() => decidir(detalle, "aprobada")}
                  >
                    <Check /> Aprobar Transacción
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => decidir(detalle, "rechazada")}
                  >
                    <X /> Rechazar
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium text-xs break-all">{valor}</div>
    </div>
  );
}