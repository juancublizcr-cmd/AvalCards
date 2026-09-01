import { useState } from "react";
import {
  Coins,
  Crown,
  Dices,
  Flame,
  Gift,
  Play,
  RotateCw,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RaspaModal } from "@/components/RaspaModal";
import { RuletaModal } from "@/components/RuletaModal";
import type { RaspaConfig } from "@/lib/admin-store";

interface JuegosExpressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: RaspaConfig;
  telefonoSoporte?: string;
}

export function JuegosExpressModal({
  open,
  onOpenChange,
  config,
  telefonoSoporte = "86344772",
}: JuegosExpressModalProps) {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<"raspa" | "ruleta" | null>(null);

  const modo = config?.modo || "ambos";

  // Si el modo es solo raspa o solo ruleta, abrimos directamente ese juego
  const abrirRaspa = () => {
    setJuegoSeleccionado("raspa");
  };

  const abrirRuleta = () => {
    setJuegoSeleccionado("ruleta");
  };

  const cerrarTodo = (v: boolean) => {
    if (!v) {
      setJuegoSeleccionado(null);
      onOpenChange(false);
    }
  };

  // Si no está en modo "ambos", abrimos el modal específico directamente
  if (modo === "raspa") {
    return (
      <RaspaModal
        open={open}
        onOpenChange={onOpenChange}
        config={config}
        telefonoSoporte={telefonoSoporte}
      />
    );
  }

  if (modo === "ruleta") {
    return (
      <RuletaModal
        open={open}
        onOpenChange={onOpenChange}
        config={config}
        telefonoSoporte={telefonoSoporte}
      />
    );
  }

  return (
    <>
      <Dialog open={open && !juegoSeleccionado} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md border border-amber-500/40 bg-zinc-950 text-foreground p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
              <Sparkles className="size-3.5" /> Juegos Express Aval Community CR
            </div>
            <DialogTitle className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-2">
              ¿Cómo deseas jugar hoy?
            </DialogTitle>
            <p className="text-xs sm:text-sm text-zinc-400">
              Elige tu dinámica favorita para ganar dinero en SINPE Móvil o Tokens oficiales al instante:
            </p>
          </DialogHeader>

          <div className="grid gap-4 pt-3">
            {/* Opción 1: Raspa y Gana */}
            <div
              onClick={abrirRaspa}
              className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 transition-all hover:scale-[1.02] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black text-2xl font-bold group-hover:rotate-12 transition-transform shadow-md">
                  🎁
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400">
                      Raspa y Gana Digital
                    </h3>
                    <span className="text-[10px] font-bold text-amber-400 border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      ₡{(config?.precio || 1000).toLocaleString("es-CR")}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Pasa tu dedo o mouse para descubrir la tarjeta dorada y gana al segundo.
                  </p>
                </div>
              </div>
            </div>

            {/* Opción 2: Ruleta de la Fortuna */}
            <div
              onClick={abrirRuleta}
              className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 transition-all hover:scale-[1.02] hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black text-2xl font-bold group-hover:rotate-45 transition-transform shadow-md">
                  🎡
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-emerald-400">
                      Ruleta de la Fortuna
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ₡{(config?.precio || 1000).toLocaleString("es-CR")}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Gira la rueda de casino y mira cómo frena en premios en efectivo y Tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modales específicos */}
      <RaspaModal
        open={juegoSeleccionado === "raspa"}
        onOpenChange={(v) => {
          if (!v) setJuegoSeleccionado(null);
        }}
        config={config}
        telefonoSoporte={telefonoSoporte}
      />

      <RuletaModal
        open={juegoSeleccionado === "ruleta"}
        onOpenChange={(v) => {
          if (!v) setJuegoSeleccionado(null);
        }}
        config={config}
        telefonoSoporte={telefonoSoporte}
      />
    </>
  );
}
