import { useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Coins,
  Copy,
  DollarSign,
  Gift,
  MessageCircle,
  Percent,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Config, Orden, ReferenteStat } from "@/lib/admin-store";
import { calcularReferidosStats, upsertConfig } from "@/lib/admin-store";

export function ReferidosSection({
  ordenes,
  config,
  setConfig,
}: {
  ordenes: Orden[];
  config: Config;
  setConfig: (c: Config) => void;
}) {
  const [q, setQ] = useState("");
  const [referenteSeleccionado, setReferenteSeleccionado] = useState<ReferenteStat | null>(null);
  const [guardandoConfig, setGuardandoConfig] = useState(false);

  const stats = useMemo(() => {
    return calcularReferidosStats(
      ordenes,
      config.referidosComisionPct ?? 10,
      config.referidosBonoTokens ?? 1,
    );
  }, [ordenes, config.referidosComisionPct, config.referidosBonoTokens]);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return stats.ranking;
    return stats.ranking.filter(
      (r) =>
        r.codigo.toLowerCase().includes(t) ||
        (r.nombre && r.nombre.toLowerCase().includes(t)) ||
        (r.email && r.email.toLowerCase().includes(t))
    );
  }, [stats.ranking, q]);

  const handleGuardarConfig = async (nuevosValores: Partial<Config>) => {
    setGuardandoConfig(true);
    try {
      const nuevaConfig = { ...config, ...nuevosValores };
      await upsertConfig(nuevaConfig);
      setConfig(nuevaConfig);
      toast.success("Configuración de referidos guardada");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar configuración");
    } finally {
      setGuardandoConfig(false);
    }
  };

  const abrirWhatsAppReferente = (r: ReferenteStat) => {
    const tel = (r.telefono || r.codigo).replace(/\D/g, "");
    if (!tel || tel.length < 8) {
      toast.error("No hay un número de teléfono válido para este referente");
      return;
    }
    const telFinal = tel.startsWith("506") ? tel : `506${tel}`;
    const texto = encodeURIComponent(
      `¡Hola ${r.nombre || "campeón"}! Te contactamos de Aval Community CR. Queremos agradecerte por tus ${r.totalCompras} compras referidas (₡${r.totalVentas.toLocaleString("es-CR")}). Has acumulado ${r.tokensBonoGanados} Tokens de bono y una comisión estimada de ₡${r.comisionGanada.toLocaleString("es-CR")}. ¡Sigue compartiendo!`
    );
    window.open(`https://wa.me/${telFinal}?text=${texto}`, "_blank");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold">Programa de Referidos y Afiliados</h2>
        <p className="text-sm text-muted-foreground">
          Monitorea el crecimiento viral, las compras traídas por clientes y las comisiones de promotores.
        </p>
      </div>

      {/* 1. TARJETAS KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Recaudado por Referidos</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <div className="font-display text-3xl font-bold text-emerald-500">
            ₡{stats.totalVentasReferidas.toLocaleString("es-CR")}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {stats.totalOrdenesReferidas} orden(es) pagadas mediante invitaciones
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Tokens Bonificados</span>
            <Gift className="size-4 text-primary" />
          </div>
          <div className="font-display text-3xl font-bold text-primary">
            {stats.totalTokensBonoEmitidos} TOKENS
          </div>
          <p className="text-[11px] text-muted-foreground">
            Costo en efectivo para el negocio: <strong>₡0 CRC</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Referentes Activos</span>
            <Users className="size-4 text-amber-500" />
          </div>
          <div className="font-display text-3xl font-bold text-foreground">
            {stats.ranking.length}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Clientes y promotores compartiendo activamente
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Comisiones Estimadas ({config.referidosComisionPct ?? 10}%)</span>
            <Coins className="size-4 text-purple-500" />
          </div>
          <div className="font-display text-3xl font-bold text-purple-500">
            ₡{stats.totalComisionesEstimadas.toLocaleString("es-CR")}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Para liquidar a promotores o creadores
          </p>
        </div>
      </div>

      {/* 2. TABLA DE TOP REFERENTES */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Award className="size-5 text-amber-500" /> Ranking de Referentes y Afiliados
            </h3>
            <p className="text-xs text-muted-foreground">
              Clientes que más amigos han invitado a comprar tokens
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por código, nombre o teléfono"
                className="w-64 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Referente / Afiliado</th>
                <th className="px-5 py-3 text-center">Compras Traídas</th>
                <th className="px-5 py-3">Total Generado</th>
                <th className="px-5 py-3 text-center">Tokens Bono</th>
                <th className="px-5 py-3">Comisión ({config.referidosComisionPct ?? 10}%)</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((r, index) => (
                <tr key={r.codigo} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3.5 font-bold font-mono text-xs text-muted-foreground">
                    {index === 0 ? "🥇 1" : index === 1 ? "🥈 2" : index === 2 ? "🥉 3" : `${index + 1}`}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{r.nombre}</div>
                    <div className="text-xs text-muted-foreground font-mono">Código / Ref: {r.codigo}</div>
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-foreground">
                    {r.totalCompras}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-500">
                    ₡{r.totalVentas.toLocaleString("es-CR")}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/40 px-2 py-0.5 text-xs font-bold text-primary">
                      🎁 +{r.tokensBonoGanados}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-purple-400">
                    ₡{r.comisionGanada.toLocaleString("es-CR")}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReferenteSeleccionado(r)}
                      className="h-8 text-xs gap-1"
                    >
                      Ver Órdenes <ChevronRight className="size-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirWhatsAppReferente(r)}
                      className="h-8 text-xs gap-1 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
                    >
                      <MessageCircle className="size-3.5" /> WhatsApp
                    </Button>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No se han registrado compras con código de referido aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. CONFIGURACIÓN DEL PROGRAMA */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Share2 className="size-5 text-emerald-500" /> Parámetros del Programa de Referidos
            </h3>
            <p className="text-xs text-muted-foreground">
              Define los incentivos automáticos para compradores e invitados
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{config.referidosActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={config.referidosActivo ?? true}
              onCheckedChange={(v) => handleGuardarConfig({ referidosActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Tokens de Regalo para el Amigo Invitado (+Extra)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={config.referidosBonoTokens ?? 1}
              onChange={(e) => handleGuardarConfig({ referidosBonoTokens: Number(e.target.value) })}
            />
            <p className="text-[11px] text-muted-foreground">
              Cantidad de tokens gratis adicionales que recibe el nuevo comprador al pagar con un enlace de referido.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">% Comisión Estimada para Afiliados / Promotores</Label>
            <Input
              type="number"
              min={0}
              max={30}
              value={config.referidosComisionPct ?? 10}
              onChange={(e) => handleGuardarConfig({ referidosComisionPct: Number(e.target.value) })}
            />
            <p className="text-[11px] text-muted-foreground">
              Porcentaje sugerido de comisión en efectivo si decides liquidar a influencers por SINPE Móvil.
            </p>
          </div>
        </div>
      </section>

      {/* Modal de Detalle de Órdenes del Referente */}
      <Dialog open={!!referenteSeleccionado} onOpenChange={(open) => !open && setReferenteSeleccionado(null)}>
        <DialogContent className="max-w-lg border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <Users className="size-5 text-primary" />
              Compras Traídas por {referenteSeleccionado?.nombre}
            </DialogTitle>
          </DialogHeader>

          {referenteSeleccionado && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground">Código / Ref:</span>
                  <p className="font-mono font-bold text-foreground">{referenteSeleccionado.codigo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Ventas:</span>
                  <p className="font-bold text-emerald-500 font-mono">₡{referenteSeleccionado.totalVentas.toLocaleString("es-CR")}</p>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {referenteSeleccionado.ultimosReferidos.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-background text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground">{ref.nombre}</span>
                      <p className="text-muted-foreground font-mono text-[11px]">
                        Orden {ref.id} · {new Date(ref.fecha).toLocaleDateString("es-CR")}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      ₡{ref.monto.toLocaleString("es-CR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
