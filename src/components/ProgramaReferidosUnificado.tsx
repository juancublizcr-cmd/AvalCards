import { useState, useEffect, useMemo } from "react";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Copy,
  Crown,
  Flame,
  Gift,
  MessageCircle,
  Share2,
  Sparkles,
  Trophy,
  Users,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Config, ReferenteStat } from "@/lib/admin-store";
import { fetchOrdenes } from "@/lib/orders";

function enmascararTel(tel: string): string {
  const clean = tel.replace(/\D/g, "");
  if (clean.length < 8) return "••••" + clean.slice(-2);
  return `${clean.slice(0, 2)}••-••${clean.slice(-2)}`;
}

function generarRankingDemo(): ReferenteStat[] {
  return [
    { codigo: "88219901", telefono: "88219901", nombre: "Esteban R.", totalCompras: 34, totalVentas: 170000, totalTokensGenerados: 34, tokensBonoGanados: 0, comisionGanada: 0, ultimosReferidos: [] },
    { codigo: "87041122", telefono: "87041122", nombre: "Valeria M.", totalCompras: 27, totalVentas: 135000, totalTokensGenerados: 27, tokensBonoGanados: 0, comisionGanada: 0, ultimosReferidos: [] },
    { codigo: "89903344", telefono: "89903344", nombre: "Alejandro C.", totalCompras: 21, totalVentas: 105000, totalTokensGenerados: 21, tokensBonoGanados: 0, comisionGanada: 0, ultimosReferidos: [] },
    { codigo: "83127788", telefono: "83127788", nombre: "Daniela S.", totalCompras: 16, totalVentas: 80000, totalTokensGenerados: 16, tokensBonoGanados: 0, comisionGanada: 0, ultimosReferidos: [] },
    { codigo: "85542211", telefono: "85542211", nombre: "Mauricio Q.", totalCompras: 12, totalVentas: 60000, totalTokensGenerados: 12, tokensBonoGanados: 0, comisionGanada: 0, ultimosReferidos: [] },
  ];
}

export function ProgramaReferidosUnificado({ config }: { config: Config }) {
  if (config.referidosActivo === false) {
    return null;
  }

  const [tab, setTab] = useState<"dinamica" | "enlace" | "ranking">("dinamica");
  const [telefonoInput, setTelefonoInput] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [ranking, setRanking] = useState<ReferenteStat[]>([]);
  const [cargandoRanking, setCargandoRanking] = useState(false);

  const premioPrimero = config.referidosPremioPrimero || config.referidosPremioSiGana || "₡4,000,000";
  const premioSegundo = config.referidosPremioSegundo || "₡2,000,000";
  const premioTercero = config.referidosPremioTercero || "₡1,000,000";
  const darTokens = Boolean(config.referidosDarTokensBono);
  const cantTokensBono = config.referidosBonoTokens ?? 1;

  // Cargar ranking si la pestaña ranking está habilitada
  useEffect(() => {
    if (config.rankingReferidosActivo === false) return;
    let montado = true;
    setCargandoRanking(true);

    const cargar = async () => {
      try {
        const ordenes = await fetchOrdenes();
        if (!ordenes || ordenes.length === 0) {
          if (montado) setRanking(generarRankingDemo());
          return;
        }

        const conteo = new Map<string, { total: number; ventas: number; nombre?: string }>();
        for (const o of ordenes) {
          if (o.referido_por) {
            const ref = o.referido_por.replace(/\D/g, "");
            if (ref.length >= 8) {
              const actual = conteo.get(ref) || { total: 0, ventas: 0, nombre: "" };
              actual.total += 1;
              actual.ventas += o.precio || 5000;
              conteo.set(ref, actual);
            }
          }
        }

        for (const o of ordenes) {
          const tel = o.telefono.replace(/\D/g, "");
          if (conteo.has(tel)) {
            const item = conteo.get(tel)!;
            if (!item.nombre && o.nombre) item.nombre = o.nombre;
          }
        }

        const lista: ReferenteStat[] = [];
        conteo.forEach((val, tel) => {
          lista.push({
            codigo: tel,
            telefono: tel,
            nombre: val.nombre || `Afiliado ${tel.slice(-4)}`,
            totalCompras: val.total,
            totalVentas: val.ventas,
            totalTokensGenerados: val.total,
            tokensBonoGanados: 0,
            comisionGanada: 0,
            ultimosReferidos: [],
          });
        });

        lista.sort((a, b) => b.totalCompras - a.totalCompras);

        if (montado) {
          if (lista.length >= 3) {
            setRanking(lista.slice(0, 10));
          } else {
            const demo = generarRankingDemo();
            setRanking([...lista, ...demo.slice(lista.length)].slice(0, 10));
          }
        }
      } catch {
        if (montado) setRanking(generarRankingDemo());
      } finally {
        if (montado) setCargandoRanking(false);
      }
    };

    void cargar();
    return () => {
      montado = false;
    };
  }, [config.rankingReferidosActivo]);

  // Generación de URL limpia
  const telLimpio = telefonoInput.replace(/\D/g, "");
  const enlaceGenerado = useMemo(() => {
    if (typeof window === "undefined") return "https://avalcommunity.cr";
    const origin = window.location.origin;
    return telLimpio.length >= 8 ? `${origin}/?ref=${telLimpio}` : `${origin}/?ref=tu-telefono`;
  }, [telLimpio]);

  const mensajeWhatsApp = useMemo(() => {
    const textoBase = config.referidosMensajeShare || "¡Hola! Te comparto la plataforma de eventos promocionales Aval Community CR donde participamos por vehículos de alta gama 0KM y premios en efectivo.";
    return `${textoBase} Adquiere tus tokens con mi enlace de recomendación aquí: ${enlaceGenerado}`;
  }, [config.referidosMensajeShare, enlaceGenerado]);

  const copiarEnlace = async () => {
    if (telLimpio.length < 8) {
      toast.error("Ingresa un número de teléfono válido de 8 dígitos para generar tu enlace.");
      return;
    }
    try {
      await navigator.clipboard.writeText(enlaceGenerado);
      setCopiado(true);
      toast.success("¡Enlace de recomendación copiado!", {
        description: "Pégalo en WhatsApp, tus estados o redes sociales.",
      });
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      toast.error("No se pudo copiar automáticamente. Puedes seleccionarlo manualmente.");
    }
  };

  const compartirWhatsApp = () => {
    if (telLimpio.length < 8) {
      toast.error("Ingresa primero tu número de teléfono para generar tu enlace.");
      return;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="programa-referidos" className="py-16 md:py-20 mx-auto max-w-6xl px-5 scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 bg-gradient-to-b from-card via-secondary/30 to-card p-6 sm:p-10 shadow-2xl">
        {/* Luces de fondo decorativas */}
        <div className="pointer-events-none absolute -top-28 -right-28 size-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 size-96 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 space-y-8">
          {/* Encabezado Principal Unificado */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-black tracking-wide text-amber-500 dark:text-amber-400 shadow-sm">
              <Users className="size-3.5" /> PROGRAMA UNIFICADO DE REFERIDOS Y AMIGOS INVITADOS
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight uppercase font-display">
              ¡Ganá hasta{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent underline decoration-amber-500/50 decoration-wavy">
                {premioPrimero}
              </span>{" "}
              en efectivo si tu invitado gana!
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Toda la dinámica de recomendación en un solo lugar: obtené tu enlace de padrino, compartí con tus amigos en un clic y competí por los premios de la tabla de líderes.
            </p>
          </div>

          {/* Navegación de Pestañas del Módulo Unificado */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-border pb-4">
            <button
              onClick={() => setTab("dinamica")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                tab === "dinamica"
                  ? "bg-amber-500 text-black shadow-md scale-[1.02]"
                  : "bg-card border border-border text-foreground/80 hover:text-foreground hover:border-amber-500/50 hover:bg-secondary/70"
              }`}
            >
              <Trophy className="size-4" />
              <span>1. Dinámica y Premios</span>
            </button>

            <button
              onClick={() => setTab("enlace")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                tab === "enlace"
                  ? "bg-amber-500 text-black shadow-md scale-[1.02]"
                  : "bg-card border border-border text-foreground/80 hover:text-foreground hover:border-amber-500/50 hover:bg-secondary/70"
              }`}
            >
              <Share2 className="size-4" />
              <span>2. Mi Enlace & Compartir</span>
            </button>

            {config.rankingReferidosActivo !== false && (
              <button
                onClick={() => setTab("ranking")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  tab === "ranking"
                    ? "bg-amber-500 text-black shadow-md scale-[1.02]"
                    : "bg-card border border-border text-foreground/80 hover:text-foreground hover:border-amber-500/50 hover:bg-secondary/70"
                }`}
              >
                <Award className="size-4" />
                <span>3. Tabla de Líderes Mensual</span>
              </button>
            )}
          </div>

          {/* VISTA 1: DINÁMICA Y PREMIOS */}
          {tab === "dinamica" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Paso 1 */}
                <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 font-mono font-black text-base border border-amber-500/30">
                        01
                      </span>
                      <Share2 className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-base text-foreground">Generá tu Enlace</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pasa a la pestaña <strong>"Mi Enlace"</strong> e ingresa tu número de teléfono para obtener tu enlace personal de padrino de inmediato.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Sin registros complicados
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-black text-base border border-emerald-500/30">
                        02
                      </span>
                      <MessageCircle className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-base text-foreground">Tu Amigo Compra Tokens</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tu amigo accede por tu enlace y adquiere su paquete favorito. La compra queda automáticamente vinculada a tu número en el escrutinio notarial.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Registro auditado en tiempo real
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/15 via-card to-card p-6 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-colors shadow-md">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-black font-mono font-black text-base shadow-sm">
                        03
                      </span>
                      <Trophy className="size-5 text-amber-500 dark:text-amber-400" />
                    </div>
                    <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                      <span>¡Cobrás en Efectivo!</span>
                      <Sparkles className="size-4 text-amber-500 dark:text-yellow-400 shrink-0" />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Si el token ganador fue comprado con tu recomendación, tú recibes el bono en efectivo transferido de inmediato ante Notario.
                    </p>

                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1.5">
                        <span className="font-bold text-amber-700 dark:text-amber-300">🥇 1° Lugar Mayor:</span>
                        <strong className="text-foreground font-black">{premioPrimero}</strong>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/80 border border-border px-2.5 py-1.5">
                        <span className="font-semibold text-foreground/80">🥈 2° Lugar:</span>
                        <strong className="text-amber-600 dark:text-amber-400 font-bold">{premioSegundo}</strong>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/80 border border-border px-2.5 py-1.5">
                        <span className="font-semibold text-foreground/80">🥉 3° Lugar:</span>
                        <strong className="text-amber-600 dark:text-amber-400 font-bold">{premioTercero}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 font-bold flex items-center justify-between">
                    <span>💵 Dinero líquido a tu cuenta</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Sin sorteo extra</span>
                  </div>
                </div>
              </div>

              {/* Notificación condicional de tokens de cortesía para el amigo */}
              {darTokens && (
                <div className="rounded-2xl border border-emerald-500/40 dark:bg-emerald-950/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-xs sm:text-sm dark:text-emerald-300 text-emerald-800">
                  <Gift className="size-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong>🎁 ¡Beneficio Exclusivo para tu Amigo Invitado!</strong> Cada amigo que adquiera tokens usando tu enlace recibe{" "}
                    <strong>+{cantTokensBono} Token{cantTokensBono > 1 ? "s" : ""} de Cortesía GRATIS</strong> para multiplicar sus oportunidades.
                  </span>
                </div>
              )}

              <div className="text-center pt-2">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => setTab("enlace")}
                  className="px-8 py-6 text-sm font-black shadow-[var(--shadow-fire)] cursor-pointer"
                >
                  <Share2 className="size-4 mr-2" />
                  Ir a Generar Mi Enlace de Recomendación →
                </Button>
              </div>
            </div>
          )}

          {/* VISTA 2: GENERADOR Y COMPARTIR ENLACE */}
          {tab === "enlace" && (
            <div className="max-w-2xl mx-auto space-y-6 bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center justify-center gap-2">
                  <Smartphone className="size-5 text-amber-500 dark:text-amber-400" />
                  Generador de Enlace Personal de Padrino
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ingresá tu número de teléfono / WhatsApp (ej. 88887777). No necesitás registrarte con contraseñas.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-foreground">Tu Número de Teléfono (WhatsApp)</label>
                  <Input
                    type="tel"
                    value={telefonoInput}
                    onChange={(e) => setTelefonoInput(e.target.value)}
                    placeholder="Ej. 8888-7777"
                    className="text-base font-mono bg-background border-input text-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Con este número el sistema acreditará tus bonos si tu recomendado resulta favorecido.
                  </p>
                </div>

                {/* Previsualización del Enlace */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-amber-600 dark:text-amber-400">Tu Enlace Personal Oficial:</label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={enlaceGenerado}
                      className="text-xs font-mono bg-secondary/60 border-amber-500/40 text-amber-700 dark:text-amber-300 select-all"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copiarEnlace}
                      className="shrink-0 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                    >
                      {copiado ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                      <span className="hidden sm:inline ml-1.5">{copiado ? "Copiado" : "Copiar"}</span>
                    </Button>
                  </div>
                </div>

                {/* Previsualización del Mensaje */}
                <div className="rounded-xl border border-border bg-secondary/40 p-3.5 text-left space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Vista previa del mensaje a compartir:</span>
                  <p className="text-xs text-foreground/90 italic leading-relaxed">
                    "{mensajeWhatsApp}"
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    onClick={copiarEnlace}
                    className="flex-1 py-6 text-sm font-black shadow-lg cursor-pointer"
                  >
                    <Copy className="size-4 mr-2" />
                    {copiado ? "¡Enlace Copiado al Portapapeles!" : "Copiar Enlace de Padrino"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={compartirWhatsApp}
                    className="flex-1 py-6 text-sm font-bold border-emerald-500/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 cursor-pointer"
                  >
                    <MessageCircle className="size-4 mr-2 text-emerald-500" />
                    Compartir por WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: TABLA DE LÍDERES MENSUAL */}
          {tab === "ranking" && config.rankingReferidosActivo !== false && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 text-left">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                    <Crown className="size-5 text-amber-500 dark:text-amber-400" />
                    Tabla de Líderes · Concurso Mensual de Amigos Invitados
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quienes más amigos invitan durante el mes reciben premios adicionales en efectivo por SINPE Móvil.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/60 px-3.5 py-2 text-right self-start sm:self-auto">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Cierre del Concurso</div>
                  <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {config.rankingFechaCierre || "Último día del mes · 11:59 PM"}
                  </div>
                </div>
              </div>

              {/* Podio Top 3 */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* 2° Lugar */}
                <div className="order-2 sm:order-1 rounded-2xl border border-border bg-card p-5 text-center space-y-3 shadow-sm">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold shadow-xs">
                    🥈
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{ranking[1]?.nombre || "Valeria M."}</div>
                    <div className="font-mono text-xs text-muted-foreground">{enmascararTel(ranking[1]?.telefono || "87041122")}</div>
                  </div>
                  <div className="rounded-xl bg-secondary/70 py-1.5 px-3 border border-border">
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">{ranking[1]?.totalCompras || 27}</span>
                    <span className="text-[10px] text-muted-foreground block">Amigos Invitados</span>
                  </div>
                  <div className="text-xs font-bold text-foreground/80">
                    Premio: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{config.rankingPremioSegundo || "₡100,000 SINPE"}</strong>
                  </div>
                </div>

                {/* 1° Lugar (Corona) */}
                <div className="order-1 sm:order-2 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/15 via-card to-card p-6 text-center space-y-3 shadow-md">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-[10px] px-2.5 py-0.5 border border-amber-500/40">
                    <Crown className="size-3" /> LÍDER ACTUAL DEL MES
                  </div>
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500 text-black text-3xl font-black shadow-lg">
                    🥇
                  </div>
                  <div>
                    <div className="font-bold text-base text-foreground">{ranking[0]?.nombre || "Esteban R."}</div>
                    <div className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">{enmascararTel(ranking[0]?.telefono || "88219901")}</div>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 py-2 px-3 border border-amber-500/40">
                    <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-base">{ranking[0]?.totalCompras || 34}</span>
                    <span className="text-[10px] text-muted-foreground block font-semibold">Amigos Invitados</span>
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    Premio: <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{config.rankingPremioPrimero || "₡250,000 SINPE"}</strong>
                  </div>
                </div>

                {/* 3° Lugar */}
                <div className="order-3 rounded-2xl border border-border bg-card p-5 text-center space-y-3 shadow-sm">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold shadow-xs">
                    🥉
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{ranking[2]?.nombre || "Alejandro C."}</div>
                    <div className="font-mono text-xs text-muted-foreground">{enmascararTel(ranking[2]?.telefono || "89903344")}</div>
                  </div>
                  <div className="rounded-xl bg-secondary/70 py-1.5 px-3 border border-border">
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">{ranking[2]?.totalCompras || 21}</span>
                    <span className="text-[10px] text-muted-foreground block">Amigos Invitados</span>
                  </div>
                  <div className="text-xs font-bold text-foreground/80">
                    Premio: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{config.rankingPremioTercero || "₡50,000 SINPE"}</strong>
                  </div>
                </div>
              </div>

              {/* Posiciones 4 a 10 */}
              {ranking.length > 3 && (
                <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden text-left shadow-sm">
                  {ranking.slice(3).map((item, idx) => (
                    <div key={item.codigo || idx} className="flex items-center justify-between px-4 py-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-muted-foreground/70 w-5">#{idx + 4}</span>
                        <div>
                          <div className="font-bold text-foreground">{item.nombre}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{enmascararTel(item.telefono || "")}</div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {item.totalCompras} <span className="text-muted-foreground font-normal text-[11px]">invitados</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center pt-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setTab("enlace")}
                  className="border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                >
                  <Share2 className="size-4 mr-2" />
                  Quiero Unirme y Compartir Mi Enlace
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
