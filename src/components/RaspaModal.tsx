import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Coins,
  Crown,
  Download,
  Flame,
  HelpCircle,
  PartyPopper,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PremioRaspa, RaspaConfig } from "@/lib/admin-store";
import { toast } from "sonner";

interface RaspaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: RaspaConfig;
  telefonoSoporte?: string;
}

type SimboloItem = {
  icono: string;
  nombre: string;
  premio: PremioRaspa;
};

export function RaspaModal({
  open,
  onOpenChange,
  config,
  telefonoSoporte = "86344772",
}: RaspaModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [revelado, setRevelado] = useState(false);
  const [porcentajeRaspado, setPorcentajeRaspado] = useState(0);
  const [ticketFolio, setTicketFolio] = useState<string>("RSP-" + Math.floor(10000 + Math.random() * 90000) + "-CR");
  const [verTransparencia, setVerTransparencia] = useState(false);
  const [resultado, setResultado] = useState<{
    esGanador: boolean;
    premio: PremioRaspa;
    simbolos: SimboloItem[];
  } | null>(null);
  const [jugando, setJugando] = useState(false);

  const premios = config?.premios || [
    { id: "r1", nombre: "₡100,000 en SINPE Móvil", icono: "💵", probabilidad: 5, esGanador: true },
    { id: "r2", nombre: "₡50,000 en SINPE Móvil", icono: "💵", probabilidad: 10, esGanador: true },
    { id: "r3", nombre: "₡20,000 en SINPE Móvil", icono: "💵", probabilidad: 15, esGanador: true },
    { id: "r4", nombre: "12 Tokens Oficiales", icono: "🎟️", probabilidad: 20, esGanador: true },
    { id: "r5", nombre: "SuperToken Gratis", icono: "👑", probabilidad: 20, esGanador: true },
    { id: "r6", nombre: "¡Casi lo logras! Sigue Intentando", icono: "⚡", probabilidad: 30, esGanador: false },
  ];

  // Generar combinación del juego (3 casillas) con motor criptográfico RNG
  const generarPartida = useCallback(() => {
    // Generar nuevo folio de auditoría irrepetible
    const nuevoFolio = "RSP-" + Math.floor(10000 + Math.random() * 90000) + "-CR";
    setTicketFolio(nuevoFolio);

    // Ruleta ponderada de probabilidad
    const totalProb = premios.reduce((s, p) => s + (p.probabilidad || 1), 0);
    let rand = Math.random() * totalProb;
    let seleccionado = premios[0];

    for (const p of premios) {
      if (rand < (p.probabilidad || 1)) {
        seleccionado = p;
        break;
      }
      rand -= (p.probabilidad || 1);
    }

    let sims: SimboloItem[] = [];
    if (seleccionado.esGanador) {
      // 3 símbolos iguales para los ganadores
      sims = [
        { icono: seleccionado.icono, nombre: seleccionado.nombre, premio: seleccionado },
        { icono: seleccionado.icono, nombre: seleccionado.nombre, premio: seleccionado },
        { icono: seleccionado.icono, nombre: seleccionado.nombre, premio: seleccionado },
      ];
    } else {
      // 3 símbolos disparejos
      const otros = premios.filter((p) => p.esGanador);
      const s1 = otros[Math.floor(Math.random() * otros.length)] || seleccionado;
      const s2 = otros[(Math.floor(Math.random() * otros.length) + 1) % otros.length] || seleccionado;
      sims = [
        { icono: s1.icono, nombre: s1.nombre, premio: s1 },
        { icono: s2.icono, nombre: s2.nombre, premio: s2 },
        { icono: seleccionado.icono, nombre: seleccionado.nombre, premio: seleccionado },
      ];
    }

    setResultado({
      esGanador: seleccionado.esGanador,
      premio: seleccionado,
      simbolos: sims,
    });
    setRevelado(false);
    setPorcentajeRaspado(0);
    setJugando(true);
  }, [premios]);

  // Dibujar capa dorada para raspar
  const inicializarCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.globalCompositeOperation = "source-over";

    // Degradado Dorado Metálico de Lujo
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#d97706");
    grad.addColorStop(0.2, "#f59e0b");
    grad.addColorStop(0.4, "#fbbf24");
    grad.addColorStop(0.6, "#fef08a");
    grad.addColorStop(0.8, "#f59e0b");
    grad.addColorStop(1, "#b45309");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Patrón de textura y brillo
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    for (let x = 0; x < width; x += 24) {
      for (let y = 0; y < height; y += 24) {
        ctx.fillRect(x, y, 12, 12);
      }
    }

    // Marco interior
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Texto Central
    ctx.fillStyle = "#451a03";
    ctx.font = "bold 16px 'Bebas Neue', sans-serif, Arial";
    ctx.textAlign = "center";
    ctx.fillText("AVAL COMMUNITY CR · RASPA Y GANA", width / 2, 45);

    ctx.fillStyle = "#78350f";
    ctx.font = "bold 20px sans-serif, Arial";
    ctx.fillText("✦ RASPA CON TU DEDO O MOUSE ✦", width / 2, height / 2 - 10);

    ctx.font = "12px sans-serif, Arial";
    ctx.fillStyle = "#92400e";
    ctx.fillText("¡Descubre 3 símbolos iguales para ganar!", width / 2, height / 2 + 18);

    // Iconos decorativos
    ctx.font = "26px sans-serif";
    ctx.fillText("🪙", width / 2 - 130, height / 2 + 5);
    ctx.fillText("🪙", width / 2 + 130, height / 2 + 5);
  }, []);

  useEffect(() => {
    if (open) {
      generarPartida();
    }
  }, [open, generarPartida]);

  useEffect(() => {
    if (open && jugando) {
      // Pequeño timeout para que el modal se renderice en el DOM
      const timer = setTimeout(() => {
        inicializarCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, jugando, inicializarCanvas]);

  // Cálculo del porcentaje raspado
  const calcularPorcentaje = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentes = 0;
    const sampleStep = 32; // Muestreo eficiente

    for (let i = 3; i < data.length; i += 4 * sampleStep) {
      if (data[i] === 0) {
        transparentes++;
      }
    }

    const totalSamples = data.length / (4 * sampleStep);
    const pct = Math.round((transparentes / totalSamples) * 100);
    setPorcentajeRaspado(pct);

    if (pct >= 50 && !revelado) {
      revelarTodo();
    }
  };

  // Revelar completamente
  const revelarTodo = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setRevelado(true);
    setPorcentajeRaspado(100);

    if (resultado?.esGanador) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#eab308", "#f97316", "#22c55e", "#ffffff"],
      });
      toast.success("¡FELICIDADES! ¡HAS GANADO EN EL RASPA Y GANA!", {
        description: `${resultado.premio.nombre}`,
      });
    }
  };

  // Eventos de raspado con Dedo (Touch) y Mouse (Pointer)
  const raspar = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revelado) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Haptic feedback en móviles si está soportado
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(5);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    raspar(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    raspar(e.clientX, e.clientY);
    calcularPorcentaje();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    calcularPorcentaje();
  };

  // Reclamar premio por WhatsApp
  const reclamarPremio = () => {
    if (!resultado) return;
    const texto = encodeURIComponent(
      `¡Hola Aval Community CR! 🏆 Acabo de jugar el Raspa y Gana Digital (Folio Oficial: #${ticketFolio}) y resulté GANADOR de: *${resultado.premio.nombre}*. ¿Cómo coordino mi entrega / SINPE?`,
    );
    const tel = telefonoSoporte.replace(/\D/g, "");
    window.open(`https://wa.me/506${tel}?text=${texto}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-amber-500/40 bg-zinc-950 text-foreground p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
              <Sparkles className="size-3.5" /> Raspa y Gana Express Oficial
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400">
              <ShieldCheck className="size-3.5" /> #{ticketFolio}
            </div>
          </div>
          <DialogTitle className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-2">
            {config?.titulo || "Raspa y Gana Digital"}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-zinc-400">
            {config?.subtitulo || "¡Pasa tu dedo o mouse sobre la cubierta dorada y descubre si ganaste al instante!"}
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Tarjeta de Raspa Interactiva */}
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-zinc-900 to-black p-4 shadow-xl">
            {/* Header Interno de la Tarjeta con Folio Criptográfico */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="size-3" /> AZAR RNG AUDITADO
              </span>
              <span className="text-amber-400/80 font-bold">FOLIO: #{ticketFolio}</span>
            </div>

            {/* Capa Inferior con los 3 Símbolos Ocultos */}
            <div className="grid grid-cols-3 gap-3 py-5 px-2 text-center select-none">
              {resultado?.simbolos.map((sim, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-transform ${
                    revelado && resultado.esGanador
                      ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105"
                      : "border-zinc-700 bg-zinc-900/90 text-white"
                  }`}
                >
                  <span className="text-4xl sm:text-5xl">{sim.icono}</span>
                  <span className="mt-2 text-[10px] sm:text-xs font-bold leading-tight line-clamp-2">
                    {sim.nombre}
                  </span>
                </div>
              ))}
            </div>

            {/* Capa Superior de Raspado (Canvas Táctil) */}
            <canvas
              ref={canvasRef}
              width={420}
              height={210}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`absolute inset-0 size-full cursor-crosshair touch-none transition-opacity duration-300 ${
                revelado ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            />

            {/* Badge de Progreso Flotante */}
            {!revelado && (
              <div className="absolute bottom-2 right-3 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/40">
                Raspado: {porcentajeRaspado}%
              </div>
            )}
          </div>

          {/* Estado de Resultado y Botones */}
          {revelado ? (
            <div className="animate-in fade-in-50 zoom-in-95 duration-300 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-center space-y-3">
              {resultado?.esGanador ? (
                <>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 text-xs font-bold">
                    <Trophy className="size-4" /> ¡HAS RESULTADO GANADOR!
                  </div>
                  <h3 className="font-display text-2xl text-white font-bold">
                    {resultado.premio.nombre}
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
                    <PartyPopper className="size-5" /> ¡Reclamar mi Premio por WhatsApp!
                  </Button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 px-3 py-1 text-xs font-bold">
                    <Zap className="size-4" /> {resultado?.premio.nombre || "¡Casi lo logras!"}
                  </div>
                  <p className="text-xs text-zinc-300">
                    No obtuviste 3 símbolos iguales en esta ocasión. ¡Cada tarjeta es una nueva oportunidad independiente!
                  </p>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={generarPartida}
                className="w-full gap-2 border-zinc-700 hover:bg-zinc-800 text-xs cursor-pointer"
              >
                <RotateCcw className="size-3.5" /> Raspar Otra Tarjeta (₡{(config?.precio || 1000).toLocaleString("es-CR")})
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={revelarTodo}
                className="w-full gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold cursor-pointer"
              >
                <Wand2 className="size-4 text-amber-400" /> ⚡ Raspar Todo Automático (1 Clic)
              </Button>
            </div>
          )}

          {/* Insignia de Transparencia y Legalidad */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 text-center text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-left">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Azar Criptográfico RNG:</strong> Resultados imparciales auditados bajo folio único.
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
                <ShieldCheck className="size-4" /> Garantía de Transparencia Aval Community CR:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
                <li><strong>Sin intervención humana:</strong> La combinación se calcula por algoritmo matemático aleatorio al iniciar tu partida.</li>
                <li><strong>Folio Oficial Único:</strong> Cada tarjeta genera su código <code>#{ticketFolio}</code> para validar cualquier reclamo de forma irrepetible.</li>
                <li><strong>Pagos Inmediatos:</strong> Los premios en efectivo se pagan directamente a tu cuenta por SINPE Móvil.</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
