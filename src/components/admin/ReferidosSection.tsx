import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Coins,
  Copy,
  Crown,
  DollarSign,
  Gift,
  MessageCircle,
  Percent,
  Save,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  Trophy,
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

  // Estados locales editables de Premios del Concurso de Referidos
  const [premioPrimero, setPremioPrimero] = useState(config.rankingPremioPrimero || "₡250,000 SINPE");
  const [premioSegundo, setPremioSegundo] = useState(config.rankingPremioSegundo || "₡100,000 SINPE");
  const [premioTercero, setPremioTercero] = useState(config.rankingPremioTercero || "₡50,000 SINPE");
  const [fechaCierre, setFechaCierre] = useState(config.rankingFechaCierre || "Último día del mes · 11:59 PM");
  const [padrinoPremio1, setPadrinoPremio1] = useState(config.referidosPremioPrimero || config.referidosPremioSiGana || "₡4,000,000");
  const [padrinoPremio2, setPadrinoPremio2] = useState(config.referidosPremioSegundo || "₡2,000,000");
  const [padrinoPremio3, setPadrinoPremio3] = useState(config.referidosPremioTercero || "₡1,000,000");
  const [darTokensBono, setDarTokensBono] = useState(config.referidosDarTokensBono ?? false);
  const [promoLandingActivo, setPromoLandingActivo] = useState(config.referidosPromoLandingActivo ?? true);
  const [bonoTokens, setBonoTokens] = useState<number>(config.referidosBonoTokens ?? 1);
  const [comisionPct, setComisionPct] = useState<number>(config.referidosComisionPct ?? 10);
  const [mensajeShare, setMensajeShare] = useState(
    config.referidosMensajeShare || "¡Participa en el evento más grande de Costa Rica y estrena vehículo de lujo!"
  );
  const [rankingActivo, setRankingActivo] = useState(config.rankingReferidosActivo ?? true);
  const [referidosActivo, setReferidosActivo] = useState(config.referidosActivo ?? true);

  // Sincronizar cuando config cambie desde el store
  useEffect(() => {
    setPremioPrimero(config.rankingPremioPrimero || "₡250,000 SINPE");
    setPremioSegundo(config.rankingPremioSegundo || "₡100,000 SINPE");
    setPremioTercero(config.rankingPremioTercero || "₡50,000 SINPE");
    setFechaCierre(config.rankingFechaCierre || "Último día del mes · 11:59 PM");
    setPadrinoPremio1(config.referidosPremioPrimero || config.referidosPremioSiGana || "₡4,000,000");
    setPadrinoPremio2(config.referidosPremioSegundo || "₡2,000,000");
    setPadrinoPremio3(config.referidosPremioTercero || "₡1,000,000");
    setDarTokensBono(config.referidosDarTokensBono ?? false);
    setPromoLandingActivo(config.referidosPromoLandingActivo ?? true);
    setBonoTokens(config.referidosBonoTokens ?? 1);
    setComisionPct(config.referidosComisionPct ?? 10);
    setMensajeShare(config.referidosMensajeShare || "¡Participa en el evento más grande de Costa Rica y estrena vehículo de lujo!");
    setRankingActivo(config.rankingReferidosActivo ?? true);
    setReferidosActivo(config.referidosActivo ?? true);
  }, [config]);

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

  const handleGuardarPremios = async () => {
    setGuardandoConfig(true);
    try {
      const nuevaConfig: Config = {
        ...config,
        rankingPremioPrimero: premioPrimero,
        rankingPremioSegundo: premioSegundo,
        rankingPremioTercero: premioTercero,
        rankingFechaCierre: fechaCierre,
        referidosPremioSiGana: padrinoPremio1,
        referidosPremioPrimero: padrinoPremio1,
        referidosPremioSegundo: padrinoPremio2,
        referidosPremioTercero: padrinoPremio3,
        referidosDarTokensBono: darTokensBono,
        referidosPromoLandingActivo: promoLandingActivo,
        referidosBonoTokens: Number(bonoTokens) || 1,
        referidosComisionPct: Number(comisionPct) || 10,
        referidosMensajeShare: mensajeShare,
        rankingReferidosActivo: rankingActivo,
        referidosActivo: referidosActivo,
      };
      await upsertConfig(nuevaConfig);
      setConfig(nuevaConfig);
      toast.success("¡Configuración y premios de referidos guardados!", {
        description: "Los cambios ya están sincronizados y son visibles en el portal.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la configuración de referidos");
    } finally {
      setGuardandoConfig(false);
    }
  };

  const aplicarPlantillaPremios = (p1: string, p2: string, p3: string) => {
    setPremioPrimero(p1);
    setPremioSegundo(p2);
    setPremioTercero(p3);
    toast.info("Plantilla de premios aplicada", {
      description: "Recuerda presionar 'Guardar Premios y Parámetros' para aplicar los cambios.",
    });
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
          Monitorea el crecimiento viral, las compras traídas por clientes y configura los premios que se ganan por invitar.
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
            Tokens de regalo otorgados a los participantes
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
            Calculadas para liquidación directa
          </p>
        </div>
      </div>

      {/* 2. PROGRAMA DE PADRINOS Y PREMIO SI TU REFERIDO GANA */}
      <section className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-card to-card p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] px-2.5 py-0.5 border border-amber-500/40">
              <Sparkles className="size-3" /> PREMIO PRINCIPAL DE REFERIDOS (HASTA {padrinoPremio1})
            </div>
            <h3 className="font-bold text-xl text-foreground mt-1 flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" /> Premios al Padrino si su Referido Gana (1°, 2° y 3° Lugar)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Si una persona compra con el enlace de un usuario y gana cualquiera de los 3 premios oficiales, el padrino cobra el premio asignado.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/60 px-3 py-2 rounded-xl border border-border">
            <span className="text-xs font-bold text-foreground">
              {promoLandingActivo ? "Bloque Explicativo en Portada: Activo" : "Bloque Explicativo: Oculto"}
            </span>
            <Switch
              checked={promoLandingActivo}
              onCheckedChange={setPromoLandingActivo}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* 1° Premio */}
          <div className="space-y-2 rounded-xl border-2 border-amber-500/60 bg-amber-500/10 p-4 shadow-sm">
            <Label className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              🥇 1° Premio Mayor
            </Label>
            <Input
              value={padrinoPremio1}
              onChange={(e) => setPadrinoPremio1(e.target.value)}
              placeholder="Ej: ₡4,000,000"
              className="border-amber-500/60 font-mono font-bold text-base text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Si el referido gana el 1° Premio Mayor.
            </p>
          </div>

          {/* 2° Premio */}
          <div className="space-y-2 rounded-xl border border-zinc-700/80 bg-zinc-800/40 p-4 shadow-sm">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              🥈 2° Premio
            </Label>
            <Input
              value={padrinoPremio2}
              onChange={(e) => setPadrinoPremio2(e.target.value)}
              placeholder="Ej: ₡2,000,000"
              className="border-border font-mono font-bold text-base text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Si el referido gana el 2° Premio Oficial.
            </p>
          </div>

          {/* 3° Premio */}
          <div className="space-y-2 rounded-xl border border-zinc-700/80 bg-zinc-800/40 p-4 shadow-sm">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              🥉 3° Premio
            </Label>
            <Input
              value={padrinoPremio3}
              onChange={(e) => setPadrinoPremio3(e.target.value)}
              placeholder="Ej: ₡1,000,000"
              className="border-border font-mono font-bold text-base text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Si el referido gana el 3° Premio Oficial.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>Los cambios en estos montos se aplican de inmediato a toda la plataforma.</span>
          </div>

          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={handleGuardarPremios}
            disabled={guardandoConfig}
            className="font-bold gap-2 shadow-md w-full sm:w-auto"
          >
            <Save className="size-4" />
            {guardandoConfig ? "Guardando..." : "Guardar Montos de Premios"}
          </Button>
        </div>
      </section>

      {/* 3. CONFIGURACIÓN DE PREMIOS DEL CONCURSO DE REFERIDOS (HOME) */}
      <section className="rounded-2xl border-2 border-border bg-card p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] px-2.5 py-0.5 border border-amber-500/40">
              <Trophy className="size-3" /> TABLA DE LÍDERES EN LA PORTADA PÚBLICA
            </div>
            <h3 className="font-bold text-xl text-foreground mt-1 flex items-center gap-2">
              <Crown className="size-5 text-amber-500" /> Premios del Concurso Mensual de Referidos
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aquí configuras exactamente <strong>qué premios en dinero o incentivos</strong> se muestran a los usuarios en la portada web para los que inviten más amigos.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/60 px-3 py-2 rounded-xl border border-border">
            <span className="text-xs font-bold text-foreground">
              {rankingActivo ? "Tabla Visible en Home" : "Tabla Oculta"}
            </span>
            <Switch
              checked={rankingActivo}
              onCheckedChange={setRankingActivo}
            />
          </div>
        </div>

        {/* Plantillas Rápidas */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-semibold">Plantillas sugeridas:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => aplicarPlantillaPremios("₡250,000 SINPE", "₡100,000 SINPE", "₡50,000 SINPE")}
            className="h-7 text-xs border-amber-500/40 hover:bg-amber-500/10 text-amber-400"
          >
            ₡250k / ₡100k / ₡50k
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => aplicarPlantillaPremios("₡500,000 SINPE", "₡250,000 SINPE", "₡100,000 SINPE")}
            className="h-7 text-xs border-amber-500/40 hover:bg-amber-500/10 text-amber-400"
          >
            ₡500k / ₡250k / ₡100k
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => aplicarPlantillaPremios("₡1,000,000 SINPE", "₡500,000 SINPE", "₡250,000 SINPE")}
            className="h-7 text-xs border-amber-500/40 hover:bg-amber-500/10 text-amber-400"
          >
            ₡1M / ₡500k / ₡250k
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => aplicarPlantillaPremios("Moto 0KM o ₡500,000", "PlayStation 5", "₡100,000 en Gasolina")}
            className="h-7 text-xs border-sky-500/40 hover:bg-sky-500/10 text-sky-400"
          >
            Premios en Especie (Moto/PS5/Gasolina)
          </Button>
        </div>

        {/* 3 Inputs de Premios */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* 1° Lugar */}
          <div className="space-y-2 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                🥇 1° Lugar (Líder del Mes)
              </Label>
              <Crown className="size-4 text-amber-500" />
            </div>
            <Input
              value={premioPrimero}
              onChange={(e) => setPremioPrimero(e.target.value)}
              placeholder="Ej: ₡250,000 SINPE"
              className="border-amber-500/60 font-bold text-sm text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Premio principal para quien encabece la tabla de líderes.
            </p>
          </div>

          {/* 2° Lugar */}
          <div className="space-y-2 rounded-2xl bg-card border border-border p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                🥈 2° Lugar
              </Label>
              <span className="text-lg">🥈</span>
            </div>
            <Input
              value={premioSegundo}
              onChange={(e) => setPremioSegundo(e.target.value)}
              placeholder="Ej: ₡100,000 SINPE"
              className="font-bold text-sm text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Premio para el segundo lugar con más compras invitadas.
            </p>
          </div>

          {/* 3° Lugar */}
          <div className="space-y-2 rounded-2xl bg-card border border-border p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                🥉 3° Lugar
              </Label>
              <span className="text-lg">🥉</span>
            </div>
            <Input
              value={premioTercero}
              onChange={(e) => setPremioTercero(e.target.value)}
              placeholder="Ej: ₡50,000 SINPE"
              className="font-bold text-sm text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Premio para el tercer lugar con más compras invitadas.
            </p>
          </div>
        </div>

        {/* Fecha de Cierre y Tokens de Regalo */}
        <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" /> Fecha o Criterio de Cierre del Concurso
            </Label>
            <Input
              value={fechaCierre}
              onChange={(e) => setFechaCierre(e.target.value)}
              placeholder="Ej: Último día del mes · 11:59 PM o 30 de Septiembre"
              className="text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Se muestra en la esquina superior de la tabla pública en el home.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-3.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Gift className="size-3.5 text-emerald-500" /> Otorgar Tokens de Bono al Comprar
              </Label>
              <Switch
                checked={darTokensBono}
                onCheckedChange={setDarTokensBono}
              />
            </div>
            
            {darTokensBono ? (
              <div className="space-y-1.5 pt-1">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={bonoTokens}
                  onChange={(e) => setBonoTokens(Number(e.target.value))}
                  className="border-emerald-500/60 text-emerald-600 dark:text-emerald-400 font-bold bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Cantidad de tokens de cortesía que recibe el amigo al comprar con enlace.
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground border border-border">
                🔒 <strong className="text-foreground">Apagado:</strong> Nadie recibe tokens extra por invitación actualmente. El gancho principal son hasta <strong className="text-foreground">{padrinoPremio1}</strong> si sus amigos ganan + los premios de la tabla de líderes.
              </div>
            )}
          </div>
        </div>

        {/* % Comisión Estimada y Mensaje al Compartir */}
        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Percent className="size-3.5 text-purple-500" /> % Comisión Estimada de Referidos
            </Label>
            <Input
              type="number"
              min={0}
              max={50}
              value={comisionPct}
              onChange={(e) => setComisionPct(Number(e.target.value))}
              className="text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Porcentaje sugerido de comisión en efectivo calculado en la tabla de afiliados para liquidar por SINPE.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Share2 className="size-3.5 text-primary" /> Mensaje Sugerido al Compartir por WhatsApp
            </Label>
            <Input
              value={mensajeShare}
              onChange={(e) => setMensajeShare(e.target.value)}
              placeholder="¡Participa en el evento más grande de Costa Rica y estrena vehículo de lujo!"
              className="text-foreground bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Texto predeterminado que se carga cuando el cliente presiona "Compartir con Amigos".
            </p>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Switch
              checked={referidosActivo}
              onCheckedChange={setReferidosActivo}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {referidosActivo ? "Sistema de enlaces de referidos activo" : "Sistema de enlaces pausado"}
            </span>
          </div>

          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={handleGuardarPremios}
            disabled={guardandoConfig}
            className="font-bold gap-2 shadow-lg"
          >
            <Save className="size-4" />
            {guardandoConfig ? "Guardando..." : "Guardar Premios y Parámetros"}
          </Button>
        </div>
      </section>

      {/* 3. TABLA DE TOP REFERENTES */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Award className="size-5 text-amber-500" /> Ranking Real de Referentes y Afiliados
            </h3>
            <p className="text-xs text-muted-foreground">
              Clientes que más amigos han invitado a comprar tokens en la base de datos
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
                <th className="px-5 py-3">Comisión ({comisionPct}%)</th>
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
