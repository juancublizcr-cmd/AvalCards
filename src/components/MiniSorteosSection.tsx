import { useEffect, useState } from "react";
import { CheckCircle2, Flame, Fuel, Gift, Sparkles, Timer, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Config } from "@/lib/admin-store";
import { calcularProximoMiniSorteo, formatearHora12 } from "@/lib/fecha-utils";

export function MiniSorteosSection({ config }: { config: Config }) {
  const [tiempoRestante, setTiempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [proximoNombre, setProximoNombre] = useState("⛽ Viernes de Tanque Lleno");

  const horaViernes = config.horaSorteoMartesViernes || "19:30";
  const horaDomingos = config.horaSorteoDomingos || "19:30";

  useEffect(() => {
    if (config.miniSorteosActivo === false) return;

    const calcular = () => {
      const res = calcularProximoMiniSorteo(horaViernes, horaDomingos);
      setProximoNombre(res.nombre);
      setTiempoRestante({
        dias: res.tiempo.d,
        horas: res.tiempo.h,
        minutos: res.tiempo.m,
        segundos: res.tiempo.s,
      });
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [config.miniSorteosActivo, horaViernes, horaDomingos]);

  if (config.miniSorteosActivo === false) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/25 via-zinc-950 to-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-primary/10 blur-3xl" />

      {/* Header Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/15 px-3.5 py-1 text-xs font-black tracking-wide text-amber-400">
            <Gift className="size-3.5" /> 2 MINI-SORTEOS SEMANALES CON TU MISMO TOKEN
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-2.5 flex flex-wrap items-center gap-2">
            <span>⛽ Viernes de Tanque Lleno</span>
            <span className="text-amber-500">+</span>
            <span>🎮 Domingos de PlayStation 5 Extra</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            ¡No tienes que esperar meses para ganar! Con tus mismos Tokens adquiridos para el sorteo principal, participas <strong>todos los viernes por combustible gratis</strong> y <strong>todos los domingos por consolas de última generación</strong>.
          </p>
        </div>

        {/* Reloj de Próximo Sorteo */}
        <div className="flex flex-col gap-1 rounded-2xl border border-amber-500/40 bg-zinc-900/90 p-4 shadow-lg shrink-0">
          <div className="flex items-center gap-2">
            <Timer className="size-4 text-amber-400 animate-pulse" />
            <span className="text-[11px] uppercase font-bold text-amber-400">Próximo Sorteo en Vivo:</span>
          </div>
          <div className="text-xs font-bold text-foreground truncate max-w-[260px]">
            {proximoNombre}
          </div>
          <div className="font-mono text-lg font-black text-amber-400 tracking-wider">
            {tiempoRestante.dias}d {tiempoRestante.horas}h {tiempoRestante.minutos}m {tiempoRestante.segundos}s
          </div>
        </div>
      </div>

      {/* Dos Tarjetas Grandes de Mini-Sorteos Semanales */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Tarjeta 1: VIERNES DE TANQUE LLENO (GASOLINA) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 shadow-md hover:border-amber-500/70 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 text-3xl font-bold shadow-inner">
              ⛽
            </div>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-[11px] font-black uppercase text-amber-300">
              Todos los Viernes · {formatearHora12(horaViernes)}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">Mini-Sorteo #1</span>
            <h3 className="text-xl font-black text-foreground mt-0.5">Viernes de Tanque Lleno</h3>
            <p className="text-2xl font-black text-amber-400 mt-2">
              ₡50,000 en Gasolina Delta / Uno
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Llena el tanque de tu vehículo o motocicleta 100% gratis. También entregados formalmente si lo prefieres en efectivo.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] text-zinc-400">
            <Sparkles className="size-3.5 text-amber-400 shrink-0" />
            <span>Auditado con la emisión oficial de los viernes de la JPS</span>
          </div>
        </div>

        {/* Tarjeta 2: DOMINGOS DE PLAYSTATION 5 EXTRA */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-sky-500/40 bg-gradient-to-br from-sky-500/10 via-card to-card p-6 shadow-md hover:border-sky-500/70 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 text-3xl font-bold shadow-inner">
              🎮
            </div>
            <span className="rounded-full bg-sky-500/20 border border-sky-500/40 px-3 py-1 text-[11px] font-black uppercase text-sky-300">
              Todos los Domingos · {formatearHora12(horaDomingos)}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400">Mini-Sorteo #2</span>
            <h3 className="text-xl font-black text-foreground mt-0.5">Domingos de PlayStation 5 Extra</h3>
            <p className="text-2xl font-black text-sky-400 mt-2">
              Consola PS5 o ₡350,000 SINPE
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Estrena una consola PlayStation 5 Slim Digital 0KM sellada de paquete o recibe ₡350,000 en efectivo por SINPE Móvil al instante.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] text-zinc-400">
            <Sparkles className="size-3.5 text-sky-400 shrink-0" />
            <span>Auditado directamente con la emisión dominical oficial de la JPS</span>
          </div>
        </div>
      </div>

      {/* 3 Garantías y Reglas Transparentes */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <span className="text-base">🎟️</span> 100% Automático
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Todos los tokens que adquieras entran automáticamente a los sorteos de <strong>gasolina de los viernes</strong> y <strong>PlayStation de los domingos</strong> sin pagar nada extra.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" /> Sigues Jugando por el Carro
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Incluso si ganas la gasolina o el PlayStation 5 semanal, <strong>tus tokens siguen 100% válidos y activos</strong> para los vehículos del sorteo mayor.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <span className="text-base">📱</span> Depósito SINPE Inmediato
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Los números ganadores se anuncian en vivo, se notifican directamente por WhatsApp y el premio se transfiere al instante.
          </p>
        </div>
      </div>

      {/* Barra de Llamado a la Acción */}
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Flame className="size-6 text-amber-400 shrink-0 hidden sm:block animate-bounce" />
          <span className="text-xs sm:text-sm text-foreground font-semibold">
            ¡Asegura tus tokens hoy y participa en la rifa de <strong>Gasolina este Viernes</strong> y de <strong>PlayStation 5 este Domingo</strong>!
          </span>
        </div>
        <Button
          variant="hero"
          size="sm"
          onClick={() => {
            const el = document.getElementById("tickets-seleccion") || document.getElementById("paquetes-compra");
            if (el) {
              const rect = el.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const targetY = rect.top + scrollTop - 85;
              window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
            }
          }}
          className="shadow-[var(--shadow-fire)] font-black text-xs sm:text-sm px-6 py-2.5 shrink-0 cursor-pointer"
        >
          Participar por Ambos Sorteos →
        </Button>
      </div>
    </section>
  );
}
