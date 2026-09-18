import {
  Award,
  Calendar,
  CheckCircle2,
  Crown,
  Flame,
  Fuel,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Ticket,
  X,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Premio, Config, Sorteo, Paquete } from "@/lib/admin-store";
import carroImg from "@/assets/premio-carro.jpg";
import motoImg from "@/assets/premio-moto.jpg";
import consolaImg from "@/assets/premio-consola.jpg";
import subaruImg from "@/assets/premio-subaru.jpg";

interface PremioModalProps {
  premio: Premio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTokens: (paquete?: Paquete) => void;
  config: Config;
  sorteo: Sorteo;
  paquetes?: Paquete[];
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function PremioModal({
  premio,
  open,
  onOpenChange,
  onSelectTokens,
  config,
  sorteo,
  paquetes = [],
}: PremioModalProps) {
  if (!premio) return null;

  const nivelStr = (premio.nivel || "").trim();
  const isEleccion1 = nivelStr === "1° Lugar" || nivelStr === "1° Lugar (A Elección)";
  const isEleccion2 = nivelStr === "2° Lugar" || nivelStr === "2° Lugar (A Elección)";
  const isEfectivo3 = nivelStr === "3° Lugar" || nivelStr === "3° Lugar (Efectivo)";
  const isExtra = nivelStr === "Premio Extra";
  const isMayor = isEleccion1 || nivelStr === "Premio Mayor";
  const isSegundo = isEleccion2 || nivelStr === "Segundo Premio";

  const tagLugar = isMayor
    ? "1° Lugar Oficial"
    : isSegundo
    ? "2° Lugar Oficial"
    : isEfectivo3
    ? "3° Lugar Oficial"
    : isExtra
    ? "Premio Extra"
    : "Premio Oficial";

  const nombreLower = (premio.nombre || "").toLowerCase();
  const defaultImg =
    nombreLower.includes("subaru") || nombreLower.includes("impreza")
      ? subaruImg
      : nombreLower.includes("moto") || nombreLower.includes("ducati")
      ? motoImg
      : nombreLower.includes("playstation") || nombreLower.includes("consola") || nombreLower.includes("efectivo") || nombreLower.includes("colones")
      ? consolaImg
      : isMayor
      ? carroImg
      : isSegundo
      ? motoImg
      : consolaImg;

  const imagenFinal = premio.imagen || defaultImg;

  const superMoneda = config.supertokenMoneda || "CRC";
  const superSimbolo = superMoneda === "CRC" ? "₡" : "$";
  const superCodigo = superMoneda === "CRC" ? "CRC" : "USD";

  const bonoSupertoken =
    isMayor || isEleccion1
      ? config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000
      : isSegundo || isEleccion2
      ? config.supertokenPremioSegundoUsd || 250000
      : config.supertokenPremioTerceroUsd || 1500000;

  // Detalles enriquecidos según el tipo de premio
  const esDucati = nombreLower.includes("ducati") || nombreLower.includes("multistrada") || nombreLower.includes("moto");
  const esSubaru = nombreLower.includes("subaru") || nombreLower.includes("impreza") || nombreLower.includes("wrx");
  const esEfectivo = isEfectivo3 || nombreLower.includes("efectivo") || nombreLower.includes("colones") || nombreLower.includes("plata");

  const descripcionLarga = esDucati
    ? "Modelo superdeportivo de alta gama que combina el rendimiento brutal de una superbike con la ergonomía y versatilidad de una trail touring. Equipada con el motor Desmosedici Stradale V4 de 1,103 cc derivado directamente de MotoGP, escape Akrapovič en titanio y acabados exclusivos en fibra de carbono."
    : esSubaru
    ? "Leyenda viva de la deportividad y el campeonato mundial de rally. Tracción integral permanente Symmetrical All-Wheel Drive (AWD), motor Boxer Turbo 2.5L con caja manual de 6 velocidades, diferencial central ajustable (DCCD) y frenos Brembo de alto rendimiento."
    : esEfectivo
    ? "Premio oficial líquido en colones costarricenses entregado formalmente mediante transferencia bancaria directa o SINPE Móvil oficial, o consola PlayStation 5 Slim con controles y juegos. Dinero libre de gravámenes para utilizar en lo que tú decidas."
    : "Vehículo o premio oficial certificado sacado de agencia con garantía total de fábrica y entrega formal ante Notario Público con marchamo y traspaso 100% cubiertos.";

  const especificaciones = esDucati
    ? [
        { label: "Motor", val: "Desmosedici Stradale V4 1,103 cc" },
        { label: "Potencia", val: "180 Caballos de Fuerza (CV)" },
        { label: "Escape", val: "Akrapovič titanio y carbono" },
        { label: "Garantía", val: "0 KM · Traspaso y Marchamo Pagos" },
      ]
    : esSubaru
    ? [
        { label: "Motor", val: "Boxer 2.5L Turbo High-Output" },
        { label: "Tracción", val: "Symmetrical All-Wheel Drive (AWD)" },
        { label: "Transmisión", val: "Manual de 6 Velocidades con DCCD" },
        { label: "Legal", val: "Listo para rodar · Traspaso notarial" },
      ]
    : [
        { label: "Modalidad", val: "Efectivo líquido o Consola PS5" },
        { label: "Monto Oficial", val: "₡4,000,000 CRC / ₡350,000 CRC" },
        { label: "Entrega", val: "Transferencia bancaria inmediata" },
        { label: "Legalidad", val: "Respaldo notarial y contrato formal" },
      ];

  const waMensaje = encodeURIComponent(
    `¡Hola! Me interesa participar por el premio "${premio.nombre}" (${tagLugar}) en Aval Community CR. ¿Cómo puedo asegurar mis tokens?`
  );
  const waUrl = `https://wa.me/${config.promoWhatsapp || "50686344772"}?text=${waMensaje}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto border-2 border-amber-500/50 bg-zinc-950/95 p-0 shadow-[0_0_80px_rgba(245,158,11,0.25)] backdrop-blur-2xl text-foreground rounded-3xl">
        {/* Cabecera con Foto Grande e Insignias */}
        <div className="relative w-full h-64 sm:h-72 bg-neutral-900 overflow-hidden">
          <img
            src={imagenFinal}
            alt={premio.nombre}
            className="w-full h-full object-cover object-center brightness-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/60 pointer-events-none" />

          {/* Badges Flotantes en la Imagen */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
            <span className="rounded-full bg-amber-500 text-black border border-amber-400 px-3.5 py-1 text-xs font-black uppercase shadow-lg flex items-center gap-1.5">
              <Award className="size-4" /> {tagLugar}
            </span>

            {config.supertokenActivo !== false && (
              <span className="rounded-full bg-black/80 text-amber-400 border border-amber-500/60 px-3 py-1 text-xs font-bold uppercase backdrop-blur shadow-lg flex items-center gap-1.5">
                <Crown className="size-3.5 text-amber-400" />
                {`+${superSimbolo}${formatNumber(bonoSupertoken)} ${superCodigo} Cash`}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-left">
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-white drop-shadow-md">
              {premio.nombre}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="size-4" /> Traspaso notarial y marchamo 100% incluidos
            </div>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 space-y-6 text-left">
          {/* Descripción */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Descripción del Premio
            </h3>
            <p className="mt-2 text-sm sm:text-base text-foreground/90 leading-relaxed">
              {descripcionLarga}
            </p>
          </div>

          {/* Ficha técnica rápida */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {especificaciones.map((spec, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-secondary/40 p-3 flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                  {spec.val}
                </span>
              </div>
            ))}
          </div>

          {/* BLOQUE DESTACADO: "COMPRÁ Y GANÁ" */}
          <div className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-zinc-900 to-amber-950/20 p-5 shadow-inner space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-display text-lg uppercase tracking-wide">
              <Sparkles className="size-5 text-amber-400 fill-amber-400" />
              <span>Comprá y Ganá</span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              Al adquirir tu paquete de Tokens digitales oficiales participas directamente por este premio y todas las entregas de la edición:
            </p>

            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Asignación 100% Digital:</strong> Tus números quedan registrados de inmediato en tu dispositivo y validados en Supabase.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Resultados Transparentes JPS:</strong> El ganador se define con la emisión oficial pública de la Junta de Protección Social.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Cero Gastos Ocultos:</strong> Traspaso notarial, placas, marchamo 2026 y entrega garantizada con tanque lleno por Aval Community CR.
                </span>
              </li>
              {config.supertokenActivo !== false && (
                <li className="flex items-start gap-2 text-amber-300 font-semibold">
                  <Crown className="size-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Bono SuperToken: ¡Suma hasta +{superSimbolo}{formatNumber(bonoSupertoken)} {superCodigo} en efectivo directo si tu token resulta favorecido!
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Resumen de Paquetes Disponibles */}
          {paquetes.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2 flex items-center justify-between">
                <span>Paquetes de Tokens Disponibles:</span>
                <span className="text-amber-400 font-semibold">Desde solo ₡4 000</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paquetes.slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenChange(false);
                      onSelectTokens(p);
                    }}
                    className="p-2.5 rounded-xl border border-border hover:border-amber-500/70 bg-card hover:bg-amber-500/10 transition-all text-center cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-foreground group-hover:text-amber-400">
                      {p.cantidad} Tokens
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      ₡{formatNumber(p.precio)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA DE TOKENS (SIN SALIR DEL BLOQUE PRINCIPAL) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                onOpenChange(false);
                onSelectTokens();
              }}
              className="flex-1 py-6 text-base font-bold shadow-[var(--shadow-fire)] cursor-pointer"
            >
              <Ticket className="size-5" />
              🔥 ¡COMPRAR TOKENS Y PARTICIPAR! →
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="py-6 text-xs sm:text-sm border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
