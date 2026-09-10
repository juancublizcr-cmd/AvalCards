import { useEffect, useState } from "react";
import {
  Calculator,
  Crown,
  Dices,
  Loader2,
  MessageCircle,
  PhoneCall,
  Search,
  Sparkles,
  Trophy,
  Users,
  ShieldCheck,
  Printer,
  FileText,
  AlertCircle,
  CheckCircle2,
  Coins,
  Share2,
  Gift,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  buscarGanadores,
  calcularGanadores,
  calcularGanadoresSerieNumero,
  fetchConfig,
  type Config,
  CONFIG_DEFAULT,
  type Ganador,
  type Premio,
  type Sorteo,
} from "@/lib/admin-store";
import type { Orden } from "@/lib/orders";

type ModoEscrutinio = "serie_numero" | "algoritmo_combinado";

interface DetallePremioEscrutinio {
  posicion: 1 | 2 | 3;
  tituloLugar: string;
  tokenGanador: string;
  formulaDetalle: string;
  ganador: Orden | null;
  padrino: {
    nombre: string;
    telefono: string;
    premioEfectivo: string;
  } | null;
  supertokenInfo: {
    tiene: boolean;
    bonoMonto: string;
  };
}

export function EscrutinioSection({
  ordenes = [],
  premios = [],
  config: configProp,
  sorteo,
}: {
  ordenes?: Orden[];
  premios?: Premio[];
  config?: Config;
  sorteo?: Sorteo;
}) {
  const [modo, setModo] = useState<ModoEscrutinio>("serie_numero");

  // Modo Serie y Número
  const [s1, setS1] = useState("");
  const [n1, setN1] = useState("");
  const [s2, setS2] = useState("");
  const [n2, setN2] = useState("");
  const [s3, setS3] = useState("");
  const [n3, setN3] = useState("");

  // Modo Algoritmo Combinado
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  // Resultados calculados
  const [resultadoTokens, setResultadoTokens] = useState<{
    primero: string;
    segundo: string;
    tercero: string;
  } | null>(null);

  const [detallesPremios, setDetallesPremios] = useState<DetallePremioEscrutinio[] | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [config, setConfig] = useState<Config>(configProp || CONFIG_DEFAULT);
  const [verActaModal, setVerActaModal] = useState(false);

  useEffect(() => {
    if (configProp) {
      setConfig(configProp);
    } else {
      void fetchConfig().then((c) => {
        if (c) setConfig(c);
      });
    }
  }, [configProp]);

  // Montos de premios padrinos según config
  const premioPadrino1 = config.referidosPremioPrimero || config.referidosPremioSiGana || "₡4,000,000";
  const premioPadrino2 = config.referidosPremioSegundo || "₡2,000,000";
  const premioPadrino3 = config.referidosPremioTercero || "₡1,000,000";

  // Moneda y bonos de supertokens
  const superMoneda =
    config.supertokenMoneda ||
    ((config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 0) > 50000 ? "CRC" : "USD");
  const superSimbolo = superMoneda === "CRC" ? "₡" : "$";
  const superBono1 = (config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 10000).toLocaleString("es-CR");
  const superBono2 = (config.supertokenPremioSegundoUsd || 6000).toLocaleString("es-CR");
  const superBono3 = (config.supertokenPremioTerceroUsd || 3000).toLocaleString("es-CR");

  const ejecutarEscrutinio = async () => {
    let t1 = "";
    let t2 = "";
    let t3 = "";
    let formula1 = "";
    let formula2 = "";
    let formula3 = "";

    if (modo === "serie_numero") {
      if (!s1 || !n1) {
        toast.error("Ingresa al menos la Serie y Número del 1° Premio de la Lotería Nacional");
        return;
      }
      const r = calcularGanadoresSerieNumero(s1, n1, s2, n2, s3, n3);
      t1 = r.primero;
      t2 = r.segundo || (s2 && n2 ? `${s2.padStart(3, "0")}${n2.padStart(2, "0")}` : "");
      t3 = r.tercero || (s3 && n3 ? `${s3.padStart(3, "0")}${n3.padStart(2, "0")}` : "");
      formula1 = `Serie ${s1.padStart(3, "0")} + Número ${n1.padStart(2, "0")}`;
      formula2 = s2 && n2 ? `Serie ${s2.padStart(3, "0")} + Número ${n2.padStart(2, "0")}` : "No ingresado";
      formula3 = s3 && n3 ? `Serie ${s3.padStart(3, "0")} + Número ${n3.padStart(2, "0")}` : "No ingresado";
    } else {
      if (!p1 || !p2 || !p3) {
        toast.error("Ingresa los tres premios del sorteo oficial para el algoritmo");
        return;
      }
      const r = calcularGanadores(p1, p2, p3);
      t1 = r.primero;
      t2 = r.segundo;
      t3 = `${p3.padStart(2, "0")}${p1.padStart(2, "0")}${p2.slice(-1)}`; // 3era derivación algoritmo
      formula1 = `Algoritmo Directo (${p1} + ${p2} + ${p3.slice(-1)})`;
      formula2 = `Algoritmo Invertido (${p2} + ${p1} + ${p3.slice(-1)})`;
      formula3 = `Algoritmo Alterno (${p3} + ${p1} + ${p2.slice(-1)})`;
    }

    setResultadoTokens({ primero: t1, segundo: t2, tercero: t3 });
    setBuscando(true);

    try {
      // 1. Buscar ganadores en base de datos y memoria
      const stickers = [t1, t2, t3].filter(Boolean);
      let ganadoresDb: Ganador[] = [];
      try {
        ganadoresDb = await buscarGanadores(stickers);
      } catch {
        // Fallback en memoria si la red falla
      }

      // Combinar órdenes de memoria y de DB
      const mapaTokens = new Map<string, Orden>();
      for (const o of ordenes) {
        if (Array.isArray(o.numeros)) {
          for (const num of o.numeros) {
            mapaTokens.set(num, o);
          }
        }
      }
      for (const g of ganadoresDb) {
        mapaTokens.set(g.sticker, g.orden);
      }

      // Mapa para localizar padrinos por teléfono
      const mapaPadrinos = new Map<string, Orden>();
      for (const o of ordenes) {
        const telLimpio = o.telefono.replace(/\D/g, "");
        if (telLimpio && !mapaPadrinos.has(telLimpio)) {
          mapaPadrinos.set(telLimpio, o);
        }
      }

      const resolverDetalle = (
        pos: 1 | 2 | 3,
        titulo: string,
        token: string,
        formula: string,
        montoPadrinoDefault: string,
        bonoSupertokenStr: string
      ): DetallePremioEscrutinio => {
        if (!token) {
          return {
            posicion: pos,
            tituloLugar: titulo,
            tokenGanador: "---",
            formulaDetalle: formula,
            ganador: null,
            padrino: null,
            supertokenInfo: { tiene: false, bonoMonto: "---" },
          };
        }

        const ordenGanadora = mapaTokens.get(token) || null;

        // Padrino
        let infoPadrino = null;
        if (ordenGanadora && ordenGanadora.referido_por) {
          const refTel = ordenGanadora.referido_por.replace(/\D/g, "");
          const padOrden = mapaPadrinos.get(refTel);
          infoPadrino = {
            nombre: padOrden?.nombre || `Padrino (Ref: ${ordenGanadora.referido_por})`,
            telefono: padOrden?.telefono || ordenGanadora.referido_por,
            premioEfectivo: montoPadrinoDefault,
          };
        }

        // Supertoken
        const tieneSupertoken = Boolean(ordenGanadora?.supertoken);

        return {
          posicion: pos,
          tituloLugar: titulo,
          tokenGanador: token,
          formulaDetalle: formula,
          ganador: ordenGanadora,
          padrino: infoPadrino,
          supertokenInfo: {
            tiene: tieneSupertoken,
            bonoMonto: `+${superSimbolo}${bonoSupertokenStr} ${superMoneda}`,
          },
        };
      };

      const d1 = resolverDetalle(1, "🥇 1° Premio Mayor", t1, formula1, premioPadrino1, superBono1);
      const d2 = resolverDetalle(2, "🥈 2° Premio", t2, formula2, premioPadrino2, superBono2);
      const d3 = resolverDetalle(3, "🥉 3° Premio", t3, formula3, premioPadrino3, superBono3);

      setDetallesPremios([d1, d2, d3]);

      const totalGanadoresEncontrados = [d1, d2, d3].filter((d) => d.ganador !== null).length;
      if (totalGanadoresEncontrados > 0) {
        toast.success(`¡Escrutinio completado! Se detectaron ${totalGanadoresEncontrados} premio(s) vendidos.`);
      } else {
        toast.info("Escrutinio completado: Los números calculados no fueron adquiridos (quedaron desiertos en inventario).");
      }
    } catch (err) {
      console.error("Error realizando escrutinio:", err);
      toast.error("Hubo un error al cruzar los datos de escrutinio");
    } finally {
      setBuscando(false);
    }
  };

  // Contactar por WhatsApp al Ganador
  const whatsappGanador = (ganador: Orden, token: string, lugar: string) => {
    const tel = ganador.telefono.replace(/\D/g, "");
    const cel = tel.startsWith("506") ? tel : `506${tel}`;
    const texto = encodeURIComponent(
      `¡Felicidades ${ganador.nombre}! 🎉🚗💨\n\nTe contactamos oficialmente de Aval Community CR para informarte que tu Token #${token} ha resultado GANADOR del ${lugar} con tu Orden #${ganador.id}.\n\n¡Por favor contáctanos de inmediato para coordinar la entrega formal de tu premio y el protocolo notarial!`
    );
    window.open(`https://wa.me/${cel}?text=${texto}`, "_blank");
  };

  // Contactar por WhatsApp al Padrino
  const whatsappPadrino = (
    padrinoNombre: string,
    padrinoTel: string,
    ganadorNombre: string,
    montoPadrino: string,
    lugar: string
  ) => {
    const tel = padrinoTel.replace(/\D/g, "");
    const cel = tel.startsWith("506") ? tel : `506${tel}`;
    const texto = encodeURIComponent(
      `¡Felicidades ${padrinoNombre}! 🎁💰\n\nTe saludamos formalmente de Aval Community CR.\n\nTu amigo recomendado ${ganadorNombre} acaba de resultar ganador del ${lugar} del evento oficial.\n\nPor ser su PADRINO OFICIAL te corresponde el premio de:\n💵 ${montoPadrino} EN EFECTIVO.\n\n¡Por favor escríbenos para coordinar el depósito formal de tus fondos!`
    );
    window.open(`https://wa.me/${cel}?text=${texto}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 1. CABECERA Y MODALIDAD */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-foreground">
              <Trophy className="size-6 text-primary" /> Escrutinio Integral del Sorteo
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cruce oficial en tiempo real de los 3 Premios de la Lotería Nacional: ganadores de premios mayores, supertokens, padrinos premiados y acta notarial.
            </p>
          </div>

          {detallesPremios && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVerActaModal(true)}
              className="gap-2 border-primary/50 text-primary hover:bg-primary/10 font-bold"
            >
              <FileText className="size-4" /> Ver Acta Notarial Oficial
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setModo("serie_numero");
              setResultadoTokens(null);
              setDetallesPremios(null);
            }}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              modo === "serie_numero"
                ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
            }`}
          >
            <div
              className={`flex size-10 items-center justify-center rounded-xl font-bold text-lg shrink-0 ${
                modo === "serie_numero" ? "bg-primary text-black" : "bg-secondary text-foreground"
              }`}
            >
              🇨🇷
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                Serie y Número (Lotería Nacional)
                <span className="rounded-full bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.2">
                  Oficial JPS
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                La Serie de 3 dígitos se junta con el Número de 2 dígitos. Ejemplo: Serie{" "}
                <strong className="text-primary">288</strong> + Número <strong className="text-primary">71</strong> ➔
                Token: <strong className="text-foreground font-mono">28871</strong>.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setModo("algoritmo_combinado");
              setResultadoTokens(null);
              setDetallesPremios(null);
            }}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              modo === "algoritmo_combinado"
                ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
            }`}
          >
            <div
              className={`flex size-10 items-center justify-center rounded-xl font-bold text-lg shrink-0 ${
                modo === "algoritmo_combinado" ? "bg-primary text-black" : "bg-secondary text-foreground"
              }`}
            >
              🧮
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                Algoritmo Combinado (3 Premios)
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Combina los dígitos de los premios 1°, 2° y 3° para generar las fórmulas directa e invertida de la
                tómbola.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. ENTRADA DE DATOS */}
      {modo === "serie_numero" ? (
        <section className="rounded-2xl border border-primary/40 bg-card p-6 shadow-sm space-y-5">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Dices className="size-5" /> Resultados Oficiales por Serie y Número (JPS)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Digita la Serie (3 dígitos) y el Número (2 dígitos) de cada uno de los 3 premios oficiales de la Lotería
              Nacional.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* 1° Lugar */}
            <div className="rounded-2xl border-2 border-primary/60 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1">
                  🥇 1° Premio Mayor
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded">Obligatorio</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground font-semibold">Serie (3 dígitos)</Label>
                  <Input
                    value={s1}
                    maxLength={3}
                    placeholder="288"
                    onChange={(e) => setS1(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-black tracking-widest h-12 bg-background border-primary/40"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground font-semibold">Número (2 dígitos)</Label>
                  <Input
                    value={n1}
                    maxLength={2}
                    placeholder="71"
                    onChange={(e) => setN1(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-black tracking-widest h-12 bg-background border-primary/40"
                  />
                </div>
              </div>
              <div className="text-center rounded-xl bg-background/90 py-2 font-mono text-xs text-muted-foreground border">
                Token resultante:{" "}
                <strong className="text-primary font-black text-sm">
                  {s1 && n1 ? `${s1.padStart(3, "0")}${n1.padStart(2, "0")}` : "---"}
                </strong>
              </div>
            </div>

            {/* 2° Lugar */}
            <div className="rounded-2xl border border-zinc-700 bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                  🥈 2° Premio
                </span>
                <span className="text-[10px] text-muted-foreground">Opcional</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground font-semibold">Serie (3 dígitos)</Label>
                  <Input
                    value={s2}
                    maxLength={3}
                    placeholder="290"
                    onChange={(e) => setS2(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-black tracking-widest h-12 bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground font-semibold">Número (2 dígitos)</Label>
                  <Input
                    value={n2}
                    maxLength={2}
                    placeholder="88"
                    onChange={(e) => setN2(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-black tracking-widest h-12 bg-background"
                  />
                </div>
              </div>
              <div className="text-center rounded-xl bg-background/90 py-2 font-mono text-xs text-muted-foreground border">
                Token resultante:{" "}
                <strong className="text-foreground font-black text-sm">
                  {s2 && n2 ? `${s2.padStart(3, "0")}${n2.padStart(2, "0")}` : "---"}
                </strong>
              </div>
            </div>

            {/* 3° Lugar */}
            <div className="rounded-2xl border border-zinc-700 bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                  🥉 3° Premio
                </span>
                <span className="text-[10px] text-muted-foreground">Opcional</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground font-semibold">Serie (3 dígitos)</Label>
                  <Input
                    value={s3}
                    maxLength={3}
                    placeholder="943"
                    onChange={(e) => setS3(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-black tracking-widest h-12 bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground font-semibold">Número (2 dígitos)</Label>
                  <Input
                    value={n3}
                    maxLength={2}
                    placeholder="75"
                    onChange={(e) => setN3(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-black tracking-widest h-12 bg-background"
                  />
                </div>
              </div>
              <div className="text-center rounded-xl bg-background/90 py-2 font-mono text-xs text-muted-foreground border">
                Token resultante:{" "}
                <strong className="text-foreground font-black text-sm">
                  {s3 && n3 ? `${s3.padStart(3, "0")}${n3.padStart(2, "0")}` : "---"}
                </strong>
              </div>
            </div>
          </div>

          <Button
            size="xl"
            variant="hero"
            className="w-full font-black shadow-lg text-base cursor-pointer"
            onClick={() => {
              void ejecutarEscrutinio();
            }}
            disabled={buscando}
          >
            {buscando ? <Loader2 className="animate-spin size-5 mr-2" /> : <Calculator className="size-5 mr-2" />}
            {buscando ? "Verificando Ganadores, SuperTokens y Padrinos..." : "🎯 Realizar Escrutinio y Buscar Ganadores de Todo"}
          </Button>
        </section>
      ) : (
        <section className="rounded-2xl border border-primary/40 bg-card p-6 shadow-sm space-y-5">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Calculator className="size-5" /> Algoritmo Combinado (3 Premios)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              El algoritmo combina los dígitos de los premios oficiales 1°, 2° y 3°.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <Label className="text-xs uppercase font-bold text-muted-foreground">1° Premio (2 dígitos)</Label>
              <Input
                value={p1}
                placeholder="10"
                maxLength={2}
                onChange={(e) => setP1(e.target.value.replace(/\D/g, ""))}
                className="mt-2 h-12 text-center font-mono text-2xl font-bold bg-background"
              />
            </div>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <Label className="text-xs uppercase font-bold text-muted-foreground">2° Premio (2 dígitos)</Label>
              <Input
                value={p2}
                placeholder="20"
                maxLength={2}
                onChange={(e) => setP2(e.target.value.replace(/\D/g, ""))}
                className="mt-2 h-12 text-center font-mono text-2xl font-bold bg-background"
              />
            </div>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <Label className="text-xs uppercase font-bold text-muted-foreground">3° Premio (se usa última cifra)</Label>
              <Input
                value={p3}
                placeholder="5"
                maxLength={5}
                onChange={(e) => setP3(e.target.value.replace(/\D/g, ""))}
                className="mt-2 h-12 text-center font-mono text-2xl font-bold bg-background"
              />
            </div>
          </div>

          <Button
            size="xl"
            variant="hero"
            className="w-full font-black shadow-lg text-base cursor-pointer"
            onClick={() => {
              void ejecutarEscrutinio();
            }}
            disabled={buscando}
          >
            {buscando ? <Loader2 className="animate-spin size-5 mr-2" /> : <Calculator className="size-5 mr-2" />}
            {buscando ? "Ejecutando..." : "🎯 Realizar Escrutinio y Buscar Ganadores de Todo"}
          </Button>
        </section>
      )}

      {/* 3. DESGLOSE COMPLETO DE LOS 3 PREMIOS (GANADORES, SUPERTOKENS Y PADRINOS) */}
      {detallesPremios && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-amber-400" /> Resultados Oficiales por Premio (1°, 2° y 3° Lugar)
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              Auditoría en vivo contra el registro de boletos
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {detallesPremios.map((d) => {
              const esPrimero = d.posicion === 1;
              const esSegundo = d.posicion === 2;
              const tieneGanador = d.ganador !== null;
              const nombreVehiculo =
                d.posicion === 1
                  ? premios[0]?.nombre || "Moto de Alta Cilindrada"
                  : d.posicion === 2
                  ? premios[1]?.nombre || "Subaru Impreza WRX"
                  : premios[2]?.nombre || "PlayStation 5 / Efectivo";

              const borderColor = esPrimero
                ? "border-amber-500/60 bg-gradient-to-b from-amber-500/10 via-card to-card"
                : esSegundo
                ? "border-slate-400/60 bg-gradient-to-b from-slate-400/10 via-card to-card"
                : "border-amber-700/60 bg-gradient-to-b from-amber-800/10 via-card to-card";

              return (
                <div
                  key={d.posicion}
                  className={`rounded-2xl border-2 p-5 shadow-lg flex flex-col justify-between space-y-4 ${borderColor}`}
                >
                  {/* Encabezado del Premio */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`font-black text-xs px-2.5 py-0.5 ${
                          esPrimero
                            ? "border-amber-500 text-amber-500 bg-amber-500/10"
                            : esSegundo
                            ? "border-slate-400 text-slate-300 bg-slate-400/10"
                            : "border-amber-700 text-amber-600 bg-amber-700/10"
                        }`}
                      >
                        {d.tituloLugar}
                      </Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">{d.formulaDetalle}</span>
                    </div>

                    <div className="text-center py-3 bg-background/80 rounded-xl border border-border">
                      <span className="text-[11px] uppercase font-bold text-muted-foreground block">
                        Token Resultante Oficial
                      </span>
                      <span className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-amber-400">
                        {d.tokenGanador}
                      </span>
                      <span className="text-xs font-semibold text-foreground block mt-1">
                        Premio: {nombreVehiculo}
                      </span>
                    </div>
                  </div>

                  {/* Detalle del Ganador Principal */}
                  <div className="rounded-xl border border-border bg-card p-3.5 space-y-2 text-xs">
                    <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Boleto / Cliente Ganador</span>
                      {tieneGanador ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Boleto Vendido
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          <AlertCircle className="size-3" /> Desierto / No Vendido
                        </span>
                      )}
                    </span>

                    {tieneGanador && d.ganador ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-foreground">{d.ganador.nombre}</strong>
                          <Badge
                            variant={d.ganador.estado === "aprobada" ? "default" : "secondary"}
                            className="text-[10px] capitalize"
                          >
                            Pago {d.ganador.estado}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          <strong>Teléfono:</strong> {d.ganador.telefono}
                        </p>
                        <p className="text-muted-foreground truncate">
                          <strong>Email:</strong> {d.ganador.email || "No registrado"}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Ubicación:</strong> {d.ganador.provincia || "Costa Rica"}
                          {d.ganador.canton ? `, ${d.ganador.canton}` : ""}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          <strong>Orden ID:</strong> {d.ganador.id}
                        </p>

                        <Button
                          size="sm"
                          onClick={() => whatsappGanador(d.ganador!, d.tokenGanador, d.tituloLugar)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 h-8 mt-2 cursor-pointer shadow-sm"
                        >
                          <MessageCircle className="size-3.5" /> WhatsApp al Ganador
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground">El número {d.tokenGanador} no fue adquirido.</p>
                        <p className="text-[11px]">Permanece en reserva oficial del evento según reglamento notarial.</p>
                      </div>
                    )}
                  </div>

                  {/* SuperToken Status */}
                  <div
                    className={`rounded-xl border p-3 text-xs space-y-1 ${
                      d.supertokenInfo.tiene
                        ? "border-amber-500/60 bg-amber-500/10 text-amber-300"
                        : "border-border bg-secondary/30 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <Crown className="size-3.5 text-amber-400" />
                        {d.supertokenInfo.tiene ? "¡SUPERTOKEN ACTIVADO!" : "Sin SuperToken"}
                      </span>
                      {d.supertokenInfo.tiene && (
                        <span className="font-mono text-amber-400 font-black text-sm">
                          {d.supertokenInfo.bonoMonto}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {d.supertokenInfo.tiene
                        ? "La orden ganadora incluye cobertura de SuperToken. Se entrega el bono en efectivo adicional."
                        : "La orden fue adquirida en paquete estándar sin bonificación adicional de SuperToken."}
                    </p>
                  </div>

                  {/* Padrino / Referido (Súper Importante) */}
                  <div
                    className={`rounded-xl border p-3.5 text-xs space-y-2 ${
                      d.padrino
                        ? "border-emerald-500/60 bg-emerald-950/20 text-emerald-300"
                        : "border-border bg-secondary/20 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Users className="size-3.5 text-primary" /> Padrino / Recomendado
                      </span>
                      {d.padrino && (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                          Cobra {d.padrino.premioEfectivo}
                        </span>
                      )}
                    </div>

                    {d.padrino ? (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-foreground">
                          <strong>Padrino:</strong> {d.padrino.nombre}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Teléfono:</strong> {d.padrino.telefono}
                        </p>
                        <p className="text-emerald-400 font-medium">
                          ¡Se gana <strong>{d.padrino.premioEfectivo} en efectivo</strong> entregados formalmente!
                        </p>

                        <Button
                          size="sm"
                          onClick={() =>
                            whatsappPadrino(
                              d.padrino!.nombre,
                              d.padrino!.telefono,
                              d.ganador?.nombre || "su referido",
                              d.padrino!.premioEfectivo,
                              d.tituloLugar
                            )
                          }
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 h-8 mt-2 cursor-pointer shadow-sm"
                        >
                          <MessageCircle className="size-3.5" /> WhatsApp al Padrino ({d.padrino.premioEfectivo})
                        </Button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        {tieneGanador
                          ? "Boleto adquirido por compra directa (sin enlace de padrino asociado)."
                          : "No aplica padrino (el número no fue comercializado)."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. RESUMEN GLOBAL Y BOTÓN PARA IMPRIMIR ACTA */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Certificación y Auditoría Notarial</h4>
                <p className="text-xs text-muted-foreground">
                  El escrutinio queda registrado bajo la fe pública notarial de Aval Community CR y la JPS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="hero"
                size="default"
                onClick={() => setVerActaModal(true)}
                className="gap-2 font-bold shadow-md cursor-pointer"
              >
                <Printer className="size-4" /> Generar e Imprimir Acta Notarial
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 5. MODAL / VISTA IMPRIMIBLE DEL ACTA NOTARIAL */}
      {verActaModal && detallesPremios && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="relative w-full max-w-4xl rounded-2xl bg-card border border-border p-6 sm:p-10 shadow-2xl text-foreground space-y-6 my-8 print:border-none print:shadow-none print:p-0 print:my-0">
            {/* Botones de acción no imprimibles */}
            <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <span className="font-bold text-base">Acta Notarial Oficial de Escrutinio</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="hero"
                  onClick={() => window.print()}
                  className="gap-1.5 font-bold cursor-pointer"
                >
                  <Printer className="size-4" /> Imprimir / Guardar PDF
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setVerActaModal(false)}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Contenido Oficial del Acta */}
            <div className="space-y-6 text-xs sm:text-sm text-foreground leading-relaxed print:text-black">
              {/* Encabezado Protocolario */}
              <div className="text-center space-y-1 border-b-2 border-primary/40 pb-4">
                <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-primary block">
                  República de Costa Rica · Fe Pública Notarial
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">
                  Acta Notarial de Escrutinio y Adjudicación Oficial de Premios
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  {config.razonSocial || "Importadora Luxury Scents LTDA."} · Aval Community CR
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Fecha y Hora de Emisión: {new Date().toLocaleString("es-CR", { dateStyle: "full", timeStyle: "medium" })}
                </p>
              </div>

              {/* Manifiesto Notarial */}
              <p className="text-justify">
                En la ciudad de San José, República de Costa Rica, a las horas del día de hoy, el suscrito Notario
                Público con carné oficial debidamente habilitado, da fe de haber presenciado el cruce y escrutinio
                oficial del evento promocional realizado por <strong>{config.razonSocial || "Importadora Luxury Scents LTDA."}</strong>,
                confrontando los resultados emitidos por la tómbola oficial de la Lotería Nacional de la Junta de
                Protección Social (JPS) contra la base de datos de tokens asignados a los participantes:
              </p>

              {/* Tabla de Premios Escrutados */}
              <div className="overflow-x-auto rounded-xl border border-border print:border-black">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/60 text-muted-foreground font-bold uppercase tracking-wider print:bg-gray-100 print:text-black">
                    <tr>
                      <th className="p-2.5 border-b border-border">Lugar</th>
                      <th className="p-2.5 border-b border-border">Token Oficial</th>
                      <th className="p-2.5 border-b border-border">Premio Oficial</th>
                      <th className="p-2.5 border-b border-border">Ganador Adjudicado</th>
                      <th className="p-2.5 border-b border-border">SuperToken</th>
                      <th className="p-2.5 border-b border-border">Padrino Oficial</th>
                      <th className="p-2.5 border-b border-border">Premio Padrino</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border print:divide-black">
                    {detallesPremios.map((d) => (
                      <tr key={d.posicion} className="hover:bg-secondary/20">
                        <td className="p-2.5 font-bold">{d.tituloLugar}</td>
                        <td className="p-2.5 font-mono font-black text-primary print:text-black">{d.tokenGanador}</td>
                        <td className="p-2.5">
                          {d.posicion === 1
                            ? premios[0]?.nombre || "Moto de Alta Cilindrada"
                            : d.posicion === 2
                            ? premios[1]?.nombre || "Subaru Impreza WRX"
                            : premios[2]?.nombre || "PlayStation 5 / Efectivo"}
                        </td>
                        <td className="p-2.5">
                          {d.ganador ? (
                            <div>
                              <strong className="block text-foreground print:text-black">{d.ganador.nombre}</strong>
                              <span className="text-[11px] text-muted-foreground">Tel: {d.ganador.telefono}</span>
                            </div>
                          ) : (
                            <span className="text-amber-500 font-semibold print:text-black">Desierto / No Vendido</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {d.supertokenInfo.tiene ? (
                            <span className="font-bold text-amber-500 print:text-black">SÍ ({d.supertokenInfo.bonoMonto})</span>
                          ) : (
                            <span className="text-muted-foreground">No aplica</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {d.padrino ? (
                            <div>
                              <strong className="block text-foreground print:text-black">{d.padrino.nombre}</strong>
                              <span className="text-[11px] text-muted-foreground">Tel: {d.padrino.telefono}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Compra Directa</span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-emerald-500 print:text-black">
                          {d.padrino ? d.padrino.premioEfectivo : "₡0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Declaración de Fe Pública */}
              <div className="rounded-xl border border-border p-4 bg-secondary/20 space-y-2 text-xs">
                <p>
                  <strong>CERTIFICACIÓN DE LEGALIDAD:</strong> Se hace constar que los tokens ganadores fueron
                  determinados de manera inalterable y transparente según los números de la Lotería Nacional de Costa
                  Rica. Los ganadores y padrinos acreditados cumplen con los términos y reglamentos vigentes protocolizados
                  ante notaría pública.
                </p>
              </div>

              {/* Firmas Notariales */}
              <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs">
                <div className="space-y-1">
                  <div className="border-t border-border pt-2 font-bold text-foreground print:text-black">
                    Lic. Notario Público
                  </div>
                  <p className="text-[11px] text-muted-foreground">Colegio de Abogados de CR</p>
                </div>

                <div className="space-y-1">
                  <div className="border-t border-border pt-2 font-bold text-foreground print:text-black">
                    Representante Legal
                  </div>
                  <p className="text-[11px] text-muted-foreground">{config.razonSocial || "Aval Community CR"}</p>
                </div>

                <div className="space-y-1">
                  <div className="border-t border-border pt-2 font-bold text-foreground print:text-black">
                    Testigo de Fe Pública
                  </div>
                  <p className="text-[11px] text-muted-foreground">Cédula de Identidad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}