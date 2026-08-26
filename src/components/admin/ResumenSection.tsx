import { AlertTriangle, Download, FileSpreadsheet, TrendingUp, Trophy, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import type { Orden } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { exportarOrdenesExcel } from "@/lib/export-excel";
import { toast } from "sonner";

function Anillo({ porcentaje }: { porcentaje: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="size-32">
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" className="stroke-secondary" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        className="stroke-primary transition-all duration-700"
        strokeDasharray={c}
        strokeDashoffset={c - (c * porcentaje) / 100}
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="66"
        textAnchor="middle"
        className="fill-foreground text-[22px] font-bold"
      >
        {porcentaje}%
      </text>
    </svg>
  );
}

export function ResumenSection({
  ordenes,
  onIrAPagos,
}: {
  ordenes: Orden[];
  onIrAPagos?: () => void;
}) {
  const aprobadas = useMemo(() => ordenes.filter((o) => o.estado === "aprobada"), [ordenes]);
  const pendientes = useMemo(() => ordenes.filter((o) => o.estado === "pendiente"), [ordenes]);
  const ingresos = useMemo(() => aprobadas.reduce((s, o) => s + o.precio, 0), [aprobadas]);
  const montoPendiente = useMemo(() => pendientes.reduce((s, o) => s + o.precio, 0), [pendientes]);
  const stickersPendientes = useMemo(() => pendientes.reduce((s, o) => s + o.cantidad, 0), [pendientes]);
  const ultimo = aprobadas[0] ?? ordenes[0];

  const handleDescargarReporte = () => {
    if (ordenes.length === 0) {
      toast.error("No hay ventas registradas todavía");
      return;
    }
    exportarOrdenesExcel(ordenes);
    toast.success("¡Reporte global de ventas y tokens descargado en Excel!");
  };

  // Ventas de los últimos 7 días calculadas desde datos reales
  const ventasSemana = useMemo(() => {
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const hoy = new Date();
    const mapaDias = new Map<string, number>();

    // Inicializar últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const nombreDia = dias[d.getDay()];
      const clave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      mapaDias.set(clave, 0);
    }

    for (const o of aprobadas) {
      const d = new Date(o.fecha);
      const clave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (mapaDias.has(clave)) {
        mapaDias.set(clave, (mapaDias.get(clave) ?? 0) + o.precio);
      }
    }

    const resultado: { dia: string; ventas: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const nombreDia = dias[d.getDay()];
      const clave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      resultado.push({ dia: nombreDia, ventas: mapaDias.get(clave) ?? 0 });
    }
    return resultado;
  }, [aprobadas]);

  // Paquetes vendidos calculados desde datos reales
  const paquetes = useMemo(() => {
    const conteo = new Map<number, number>();
    for (const o of aprobadas) {
      conteo.set(o.cantidad, (conteo.get(o.cantidad) ?? 0) + 1);
    }
    const paquetesEstándar = [4, 8, 12, 24];
    return paquetesEstándar.map((cant) => ({
      paquete: `${cant}`,
      vendidos: conteo.get(cant) ?? 0,
    }));
  }, [aprobadas]);

  const totalStickersVendidos = useMemo(
    () => aprobadas.reduce((s, o) => s + o.cantidad, 0),
    [aprobadas]
  );

  return (
    <div className="space-y-6">
      {/* Barra Superior con Botón de Exportación Ejecutiva */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="font-bold text-lg text-foreground">Panel de Métricas y Ventas en Vivo</h2>
          <p className="text-xs text-muted-foreground">Monitoreo en tiempo real de compras, ingresos y tokens emitidos.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDescargarReporte}
          className="gap-2 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 font-semibold"
        >
          <FileSpreadsheet className="size-4 text-emerald-500" /> Exportar Reporte Global a Excel
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Ventas Brutas Totales <Wallet className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-3xl font-bold">₡{ingresos.toLocaleString("es-CR")}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="size-3 text-primary" /> {aprobadas.length} orden(es) aprobada(s)
          </div>
          {montoPendiente > 0 ? (
            <div className="mt-1 text-[11px] font-semibold text-amber-500">
              + ₡{montoPendiente.toLocaleString("es-CR")} en revisión ({pendientes.length} pendientes)
            </div>
          ) : null}
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasSemana} margin={{ top: 6, bottom: 6, left: 0, right: 0 }}>
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <Anillo porcentaje={totalStickersVendidos > 0 ? Math.min(100, Math.round((totalStickersVendidos / 100000) * 100)) : 0} />
          <div>
            <div className="text-sm text-muted-foreground">Stickers Vendidos</div>
            <div className="mt-1 text-lg font-semibold">{totalStickersVendidos.toLocaleString("es-CR")}</div>
            <div className="text-xs text-muted-foreground">aprobados en total</div>
            {stickersPendientes > 0 ? (
              <div className="text-[11px] font-semibold text-amber-500 mt-0.5">
                +{stickersPendientes} pendientes
              </div>
            ) : null}
          </div>
        </div>

        <div
          onClick={onIrAPagos}
          className={`rounded-xl border border-destructive/40 bg-destructive/5 p-5 shadow-sm transition-all ${
            onIrAPagos ? "cursor-pointer hover:bg-destructive/10 hover:border-destructive" : ""
          }`}
        >
          <div className="flex items-center justify-between text-sm text-destructive">
            Tickets Pendientes de Revisión <AlertTriangle className="size-4" />
          </div>
          <div className="mt-2 text-4xl font-bold text-destructive">{pendientes.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Comprobantes SINPE esperando validación manual
          </p>
          {onIrAPagos && pendientes.length > 0 ? (
            <div className="mt-2 text-xs font-semibold text-destructive underline">
              Revisar y aprobar pagos →
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Último Ganador / Venta <Trophy className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-bold">{ultimo?.nombre ?? "Sin ventas aún"}</div>
          <div className="mt-1 font-mono text-2xl font-bold text-primary">
            {ultimo?.numeros?.[0] ?? "-----"}
          </div>
          <p className="text-xs text-muted-foreground">{ultimo?.telefono ?? ""}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">Ventas de los Últimos 7 Días</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--card-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">Paquetes de Stickers más Vendidos</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paquetes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="paquete" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} width={40} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="vendidos" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}