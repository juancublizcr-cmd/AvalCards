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
      <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto overflow-x-hidden border-2 border-amber-500/50 bg-zinc-950/95 p-0 shadow-[0_0_80px_rgba(245,158,11,0.25)] backdrop-blur-2xl text-foreground rounded-3xl">
        {/* Cabecera con Foto Grande e Insignias */}
        <div className="relative w-full h-64 sm:h-72 bg-neutral-900 overflow-hidden">
          <img
            src={imagenFinal}
            alt={premio.nombre}
            className="w-full h-full object-contain object-center brightness-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/50 pointer-events-none" />

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
            <h2 className="text-xl sm:text-3xl font-display uppercase tracking-wide text-white drop-shadow-md break-words">
              {premio.nombre}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="size-4 shrink-0" /> Traspaso notarial y marchamo 100% incluidos
            </div>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="p-5 sm:p-6 space-y-5 text-left overflow-x-hidden">
          {/* Descripción */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Descripción del Premio
            </h3>
            <p className="mt-2 text-sm sm:text-base text-foreground/90 leading-relaxed break-words">
              {descripcionLarga}
            </p>
          </div>

          {/* Ficha técnica rápida */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {especificaciones.map((spec, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-secondary/40 p-3 flex flex-col justify-between overflow-hidden"
              >
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 break-words">
                  {spec.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACCIÓN DIRECTA DE COMPRA Y GARANTÍAS OFICIALES */}
          <div className="pt-2 space-y-3">
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                onOpenChange(false);
                const el = document.getElementById("tickets-seleccion") || document.getElementById("paquetes-compra");
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  window.scrollTo({ top: Math.max(0, rect.top + scrollTop - 85), behavior: "smooth" });
                }
              }}
              className="w-full py-6 text-sm sm:text-base font-black shadow-[var(--shadow-fire)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="size-4 text-black shrink-0" />
              ¡Comprá y Gana! · Elegir Paquete de Tokens →
            </Button>

            {/* Garantías compactas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-secondary/20 rounded-lg p-2 border border-border/40">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span>Asignación 100% digital</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/20 rounded-lg p-2 border border-border/40">
                <CheckCircle2 className="size-3.5 text-amber-400 shrink-0" />
                <span>Resultados con la JPS</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/20 rounded-lg p-2 border border-border/40">
                <CheckCircle2 className="size-3.5 text-sky-400 shrink-0" />
                <span>Traspaso y marchamo 100% pagos</span>
              </div>
            </div>

            {/* Botón WhatsApp secundario por si tienen dudas */}
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full py-4 text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center gap-2"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-3.5 shrink-0" /> ¿Dudas con este vehículo? Consultar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
