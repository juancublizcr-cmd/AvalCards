import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CheckCircle2,
  Coins,
  CreditCard,
  Crown,
  Dices,
  Flame,
  HelpCircle,
  Loader2,
  PartyPopper,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Square,
  Ticket,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RULETA_PREMIOS_DEFAULT,
  type PremioRuleta,
  type RaspaConfig,
} from "@/lib/admin-store";
import {
  consumirUnGiro,
  guardarGiros,
  obtenerGirosLocales,
  recargarGirosManual,
} from "@/lib/giros-store";
import { fetchOrdenesPorTelefono } from "@/lib/orders";

interface RuletaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: RaspaConfig;
  telefonoSoporte?: string;
}

export function RuletaModal({
  open,
  onOpenChange,
  config,
  telefonoSoporte = "86344772",
}: RuletaModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const anguloRef = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  const [estado, setEstado] = useState<"listo" | "girando" | "frenando" | "resultado">("listo");
  const [ticketFolio, setTicketFolio] = useState<string>(
    "RLT-" + Math.floor(10000 + Math.random() * 90000) + "-CR",
  );
  const [verTransparencia, setVerTransparencia] = useState(false);
  const [premioGanado, setPremioGanado] = useState<PremioRuleta | null>(null);
  const [girosDisponibles, setGirosDisponibles] = useState(0);
  const [esModoDemo, setEsModoDemo] = useState(false);

  // Pantalla de validación / compra
  const [mostrarCanje, setMostrarCanje] = useState(false);
  const [mostrarPagoDirecto, setMostrarPagoDirecto] = useState(false);
  const [telefonoCanje, setTelefonoCanje] = useState("");
  const [validandoTelefono, setValidandoTelefono] = useState(false);

  const premios: PremioRuleta[] =
    config?.ruletaPremios && config.ruletaPremios.length > 0
      ? config.ruletaPremios
      : RULETA_PREMIOS_DEFAULT;

  const numSectores = premios.length;
  const anguloSector = (2 * Math.PI) / numSectores;

  // Dibujar la Ruleta en Canvas
  const dibujarRuleta = useCallback(
    (anguloOffset: number = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centroX = width / 2;
      const centroY = height / 2;
      const radio = Math.min(centroX, centroY) - 15;

      ctx.clearRect(0, 0, width, height);

      // Sombra exterior
      ctx.save();
      ctx.shadowColor = "rgba(245, 158, 11, 0.4)";
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(centroX, centroY, radio + 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#18181b";
      ctx.fill();
      ctx.restore();

      // Borde Dorado de Casino
      ctx.beginPath();
      ctx.arc(centroX, centroY, radio + 6, 0, 2 * Math.PI);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#d97706";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centroX, centroY, radio + 1, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#fef08a";
      ctx.stroke();

      // Sectores
      for (let i = 0; i < numSectores; i++) {
        const p = premios[i];
        const inicio = anguloOffset + i * anguloSector;
        const fin = inicio + anguloSector;

        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radio, inicio, fin);
        ctx.closePath();

        ctx.fillStyle = p.color || (i % 2 === 0 ? "#ea580c" : "#18181b");
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#fbbf24";
        ctx.stroke();

        // Texto e Icono
        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(inicio + anguloSector / 2);

        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px sans-serif";
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 4;

        ctx.font = "18px sans-serif";
        ctx.fillText(p.icono || "🎁", radio - 18, 5);

        ctx.font = "bold 11px sans-serif";
        const nombreCorto = p.nombre.length > 15 ? p.nombre.substring(0, 14) + "..." : p.nombre;
        ctx.fillText(nombreCorto, radio - 42, 4);

        ctx.restore();
      }

      // Bombillos de casino
      const numLuces = 24;
      for (let l = 0; l < numLuces; l++) {
        const angLuz = (l * 2 * Math.PI) / numLuces;
        const luzX = centroX + (radio + 6) * Math.cos(angLuz);
        const luzY = centroY + (radio + 6) * Math.sin(angLuz);

        ctx.beginPath();
        ctx.arc(luzX, luzY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = l % 2 === 0 ? "#fef08a" : "#ffffff";
        ctx.shadowColor = "#fef08a";
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      // Centro Dorado
      ctx.beginPath();
      ctx.arc(centroX, centroY, 28, 0, 2 * Math.PI);
      ctx.fillStyle = "#18181b";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#f59e0b";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centroX, centroY, 20, 0, 2 * Math.PI);
      const gradCentro = ctx.createRadialGradient(centroX, centroY, 2, centroX, centroY, 20);
      gradCentro.addColorStop(0, "#fef08a");
      gradCentro.addColorStop(1, "#d97706");
      ctx.fillStyle = gradCentro;
      ctx.fill();

      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🔥", centroX, centroY);
    },
    [premios, numSectores, anguloSector],
  );

  // Inicializar al abrir
  useEffect(() => {
    if (open) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      setEstado("listo");
      setPremioGanado(null);
      setMostrarCanje(false);
      setMostrarPagoDirecto(false);
      const giros = obtenerGirosLocales();
      setGirosDisponibles(giros);
      setTicketFolio("RLT-" + Math.floor(10000 + Math.random() * 90000) + "-CR");

      const t1 = setTimeout(() => dibujarRuleta(anguloRef.current), 50);
      const t2 = setTimeout(() => dibujarRuleta(anguloRef.current), 150);
      const t3 = setTimeout(() => dibujarRuleta(anguloRef.current), 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    }
  }, [open, dibujarRuleta]);

  // Validar teléfono de compra
  const canjearConTelefono = async () => {
    const tel = telefonoCanje.replace(/\D/g, "");
    if (tel.length < 8) {
      toast.error("Ingresa un número de teléfono válido (8 dígitos)");
      return;
    }
    setValidandoTelefono(true);
    try {
      const ordenes = await fetchOrdenesPorTelefono(tel);
      if (ordenes && ordenes.length > 0) {
        // Calcular giros por compras válidas
        let totalGiros = 0;
        ordenes.forEach((o) => {
          const qty = o.cantidad || o.stickers?.length || 4;
          if (qty >= 24) totalGiros += 6;
          else if (qty >= 12) totalGiros += 3;
          else if (qty >= 8) totalGiros += 2;
          else totalGiros += 1;
        });

        guardarGiros({
          giros: totalGiros,
          telefono: tel,
          nombre: ordenes[0].nombre,
          tipo: "bono_tokens",
        });
        setGirosDisponibles(totalGiros);
        setMostrarCanje(false);
        toast.success(`¡Encontramos tu compra! Tienes ${totalGiros} giros disponibles 🎉`);
      } else {
        // Si no tiene orden previa
        toast.info("No encontramos órdenes registradas con este teléfono", {
          description: "Puedes comprar tokens del sorteo o comprar un tiro individual por ₡1,000.",
        });
      }
    } catch {
      toast.error("Error validando teléfono");
    } finally {
      setValidandoTelefono(false);
    }
  };

  // Activar 1 Giro por Compra Rápida
  const activarGiroRapido = () => {
    recargarGirosManual(1, "", "compra_individual");
    setGirosDisponibles(obtenerGirosLocales());
    setMostrarPagoDirecto(false);
    toast.success("¡1 Giro Oficial Habilitado! Presiona GIRAR 🎡");
  };

  // Activar Giro Demo
  const activarDemo = () => {
    setEsModoDemo(true);
    iniciarGiroReal();
  };

  // Iniciar Giro
  const iniciarGiro = () => {
    if (girosDisponibles <= 0 && !esModoDemo) {
      // Si no le quedan giros gratis, salir del resultado y abrir la opción de pago SINPE
      setEstado("listo");
      setPremioGanado(null);
      setMostrarCanje(false);
      setMostrarPagoDirecto(true);
      return;
    }

    if (!esModoDemo) {
      const rest = consumirUnGiro();
      setGirosDisponibles(rest);
    }

    iniciarGiroReal();
  };

  const iniciarGiroReal = () => {
    if (estado !== "listo" && estado !== "resultado") return;

    const nuevoFolio = "RLT-" + Math.floor(10000 + Math.random() * 90000) + "-CR";
    setTicketFolio(nuevoFolio);
    setEstado("girando");
    setPremioGanado(null);

    const velocidadGiro = 0.28; // Rápida constante

    const loopGiro = () => {
      anguloRef.current = (anguloRef.current + velocidadGiro) % (2 * Math.PI);
      dibujarRuleta(anguloRef.current);

      if (typeof navigator !== "undefined" && "vibrate" in navigator && Math.random() < 0.15) {
        navigator.vibrate(3);
      }

      animFrameId.current = requestAnimationFrame(loopGiro);
    };

    animFrameId.current = requestAnimationFrame(loopGiro);
  };

  // Detener Ruleta Inmediato
  const detenerRuleta = () => {
    if (estado !== "girando") return;
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);

    setEstado("frenando");

    // Sector exacto pasando por el puntero
    const anguloPuntero = (3 * Math.PI) / 2;
    const anguloNormalizado = (anguloRef.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

    let diff = anguloPuntero - anguloNormalizado;
    if (diff < 0) diff += 2 * Math.PI;

    const indiceActual = Math.floor(diff / anguloSector) % numSectores;
    const premioElegido = premios[indiceActual];

    const centroSector = indiceActual * anguloSector + anguloSector / 2;
    const anguloFinalSector = (3 * Math.PI) / 2 - centroSector;

    const rotacionInicial = anguloRef.current;
    let delta = anguloFinalSector - (rotacionInicial % (2 * Math.PI));
    if (delta < 0) delta += 2 * Math.PI;

    const rotacionTotal = rotacionInicial + delta;
    const duracion = 350; // Frenado seco instantáneo
    const inicioTiempo = performance.now();

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([20, 30, 40]);
    }

    const animarFrenado = (tiempoActual: number) => {
      const transcurrido = tiempoActual - inicioTiempo;
      const progreso = Math.min(transcurrido / duracion, 1);

      const easeOut = 1 - Math.pow(1 - progreso, 4);
      const anguloFrame = rotacionInicial + (rotacionTotal - rotacionInicial) * easeOut;
      anguloRef.current = anguloFrame;

      dibujarRuleta(anguloFrame);

      if (progreso < 1) {
        animFrameId.current = requestAnimationFrame(animarFrenado);
      } else {
        setEstado("resultado");
        setPremioGanado(premioElegido);

        if (premioElegido.esGanador) {
          try {
            void confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#f59e0b", "#10b981", "#ffffff", "#ec4899"],
            });
          } catch {}
        }
      }
    };

    animFrameId.current = requestAnimationFrame(animarFrenado);
  };

  // Reclamar premio
  const reclamarPremio = () => {
    if (!premioGanado) return;
    const tipoGiro = esModoDemo ? "Modo Demostración" : "Giro Oficial";
    const texto = encodeURIComponent(
      `¡Hola Aval Motors CR! 🎡 Acabo de jugar la Ruleta de la Fortuna (${tipoGiro} · Folio: #${ticketFolio}) y resulté GANADOR de: *${premioGanado.nombre}*. ¿Cómo coordino mi entrega / SINPE?`,
    );
    const tel = telefonoSoporte.replace(/\D/g, "");
    window.open(`https://wa.me/506${tel}?text=${texto}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-amber-500/40 bg-zinc-950 text-foreground p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
              <Sparkles className="size-3.5" /> Ruleta de la Fortuna Express
            </div>
            {girosDisponibles > 0 ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                <Ticket className="size-3.5" /> {girosDisponibles} {girosDisponibles === 1 ? "Giro" : "Giros"} Disponible{girosDisponibles > 1 ? "s" : ""}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
                <ShieldCheck className="size-3.5 text-emerald-400" /> #{ticketFolio}
              </div>
            )}
          </div>
          <DialogTitle className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-2">
            {config?.ruletaTitulo || "Ruleta de la Fortuna"}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-zinc-400">
            {estado === "girando"
              ? "🔥 ¡La ruleta está girando a toda velocidad! Presiona DETENER en el segundo que elijas."
              : config?.ruletaSubtitulo || "¡Tú controlas cuándo girar y cuándo DETENER la ruleta para ganar!"}
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Contenedor de la Ruleta con Puntero */}
          <div className="relative mx-auto flex items-center justify-center size-[300px] sm:size-[340px]">
            <div className="absolute -top-1.5 z-20 flex flex-col items-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              <div className="size-6 bg-gradient-to-b from-yellow-300 to-amber-500 rotate-45 rounded-xs border-2 border-white" />
              <div className="w-1.5 h-3 bg-amber-600 rounded-b-full -mt-1" />
            </div>

            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="size-full rounded-full select-none"
            />
          </div>

          {/* BOTONES INTERACTIVOS: GIRAR / DETENER / RESULTADO */}
          {estado === "resultado" && premioGanado ? (
            <div className="animate-in fade-in-50 zoom-in-95 duration-300 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-center space-y-3">
              {premioGanado.esGanador ? (
                <>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 text-xs font-bold">
                    <Trophy className="size-4" /> ¡PREMIO GANADO EN LA RULETA!
                  </div>
                  <h3 className="font-display text-2xl text-white font-bold">
                    {premioGanado.nombre}
                  </h3>
                  <div className="text-[11px] font-mono text-zinc-400">
                    Comprobante Oficial: <strong className="text-emerald-400">#{ticketFolio}</strong>
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={reclamarPremio}
                    className="w-full gap-2 shadow-[var(--shadow-fire)] font-bold text-base cursor-pointer"
                  >
                    <PartyPopper className="size-5" /> ¡Reclamar por WhatsApp!
                  </Button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 px-3 py-1 text-xs font-bold">
                    <Zap className="size-4" /> {premioGanado.nombre}
                  </div>
                  <p className="text-xs text-zinc-300">
                    Detuviste la ruleta muy cerca del premio mayor. ¡Vuelve a intentarlo!
                  </p>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={iniciarGiro}
                className="w-full gap-2 border-zinc-700 hover:bg-zinc-800 text-xs cursor-pointer font-bold"
              >
                <RotateCcw className="size-3.5" /> Volver a Girar {girosDisponibles > 0 ? `(${girosDisponibles} restantes)` : "(₡1,000)"}
              </Button>
            </div>
          ) : estado === "girando" ? (
            <div className="pt-1">
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={detenerRuleta}
                className="w-full gap-2 font-bold text-base py-6 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 hover:from-red-700 hover:to-red-700 shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-red-300 animate-pulse cursor-pointer"
              >
                <Square className="size-5 fill-white" />
                🛑 ¡DETENER RULETA AHORA!
              </Button>
            </div>
          ) : estado === "frenando" ? (
            <div className="pt-1">
              <Button
                disabled
                size="lg"
                className="w-full gap-2 font-bold text-base py-6 bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                <Loader2 className="size-5 animate-spin text-amber-400" />
                Frenando ruleta en seco...
              </Button>
            </div>
          ) : girosDisponibles > 0 ? (
            <div className="pt-1">
              <Button
                variant="hero"
                size="lg"
                onClick={iniciarGiro}
                className="w-full gap-2 shadow-[var(--shadow-fire)] font-bold text-base py-6 cursor-pointer"
              >
                <Play className="size-5 fill-white" />
                🎡 ¡GIRAR RULETA AHORA ({girosDisponibles} GIRO{girosDisponibles > 1 ? "S" : ""} DISPONIBLE{girosDisponibles > 1 ? "S" : ""})!
              </Button>
            </div>
          ) : (
            /* SI NO TIENE GIROS: PANEL DEL MODELO HÍBRIDO */
            <div className="space-y-3 pt-1">
              {mostrarCanje ? (
                <div className="rounded-2xl border-2 border-amber-500/50 bg-secondary/80 p-4 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Smartphone className="size-4 text-amber-500" /> Canjear Giros de mi Compra de Tokens:
                    </h4>
                    <button
                      type="button"
                      onClick={() => setMostrarCanje(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Volver
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="Ej: 8888-8888"
                      value={telefonoCanje}
                      onChange={(e) => setTelefonoCanje(e.target.value)}
                      className="text-sm font-bold"
                    />
                    <Button
                      variant="hero"
                      onClick={canjearConTelefono}
                      disabled={validandoTelefono}
                      className="shrink-0 font-bold"
                    >
                      {validandoTelefono ? <Loader2 className="animate-spin size-4" /> : "Validar"}
                    </Button>
                  </div>
                </div>
              ) : mostrarPagoDirecto ? (
                <div className="rounded-2xl border-2 border-emerald-500/50 bg-secondary/80 p-4 space-y-3 animate-in fade-in text-center">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                      <CreditCard className="size-4" /> Compra de 1 Giro Express (₡1,000):
                    </h4>
                    <button
                      type="button"
                      onClick={() => setMostrarPagoDirecto(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Volver
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Transfiere <strong>₡1,000</strong> por SINPE Móvil al: <strong className="text-emerald-400">{telefonoSoporte}</strong>
                  </p>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={activarGiroRapido}
                    className="w-full gap-2 font-bold cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" /> ¡Ya realicé mi SINPE, Habilitar mi Giro!
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => setMostrarPagoDirecto(true)}
                    className="w-full gap-2 shadow-[var(--shadow-fire)] font-bold text-sm py-5 cursor-pointer"
                  >
                    <CreditCard className="size-4" /> 💳 Comprar 1 Tiro Rápido (₡1,000 SINPE / Tarjeta)
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setMostrarCanje(true)}
                      className="gap-1.5 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold"
                    >
                      <Ticket className="size-3.5" /> Canjear mis Tokens
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={activarDemo}
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      🎮 Giro Demo de Prueba
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Insignia de Transparencia */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 text-center text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-left">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Control Manual y Azar RNG:</strong> Tú decides el momento exacto en que detienes el giro.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setVerTransparencia(!verTransparencia)}
              className="text-[10px] text-amber-400 hover:underline shrink-0 font-semibold cursor-pointer"
            >
              {verTransparencia ? "Ocultar Detalles" : "¿Cómo es justo?"}
            </button>
          </div>

          {verTransparencia && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-zinc-300 space-y-2 animate-in fade-in">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="size-4" /> Transparencia y Control del Jugador:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
                <li><strong>Control de Parada Manual:</strong> La ruleta no se detiene sola; tú presionas el botón de DETENER cuando lo decidas.</li>
                <li><strong>Inercia y Desaceleración Seca:</strong> Al presionar DETENER, la rueda frena de inmediato en el sector exacto.</li>
                <li><strong>Folio Único Inmutable:</strong> Cada giro queda sellado con su código oficial <code>#{ticketFolio}</code>.</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
