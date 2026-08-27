import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, Fuel, Gift, ShoppingCart, Sparkles, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Config } from "@/lib/admin-store";

export function MiniSorteosSection({ config }: { config: Config }) {
  const [tiempoRestante, setTiempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    if (config.miniSorteosActivo === false) return;

    const calcular = () => {
      const ahora = new Date();
      // Calcular el próximo viernes a las 19:00 (7 PM)
      const proximoViernes = new Date(ahora);
      const diaSemana = ahora.getDay(); // 0: dom, 5: vie
      const diasHastaViernes = (5 - diaSemana + 7) % 7 || (ahora.getHours() >= 19 ? 7 : 0);
      proximoViernes.setDate(ahora.getDate() + diasHastaViernes);
      proximoViernes.setHours(19, 0, 0, 0);

      const diff = proximoViernes.getTime() - ahora.getTime();
      if (diff <= 0) {
        setTiempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      const segundos = Math.floor((diff / 1000) % 60);

      setTiempoRestante({ dias, horas, minutos, segundos });
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [config.miniSorteosActivo]);

  if (config.miniSorteosActivo === false) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-zinc-950 to-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
            <Fuel className="size-3.5" /> MINI-SORTEOS SEMANALES DE CALENTAMIENTO
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2 flex items-center gap-2">
            ⛽ {config.miniSorteoTitulo || "Viernes de Tanque Lleno (₡50,000 en Combustible)"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            ¡No tienes que esperar meses! Todos los viernes se rifan premios semanales entre todos los participantes activos.
          </p>
        </div>

        {/* Reloj Cuenta Regresiva */}
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-zinc-900/90 px-4 py-2.5 shadow-md">
          <Timer className="size-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Próximo Sorteo en:</div>
            <div className="font-mono text-sm font-black text-amber-400">
              {tiempoRestante.dias}d {tiempoRestante.horas}h {tiempoRestante.minutos}m {tiempoRestante.segundos}s
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Beneficios */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-xl font-bold">
            ⛽
          </div>
          <div className="font-bold text-sm text-foreground">Premio Semanal</div>
          <p className="text-xs text-muted-foreground">
            {config.miniSorteoPremio || "Tarjeta de ₡50,000 en Gasolina Delta / Uno"} o equivalente en SINPE Móvil inmediato.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-xl font-bold">
            🎟️
          </div>
          <div className="font-bold text-sm text-foreground">100% Automático</div>
          <p className="text-xs text-muted-foreground">
            Todos los tokens que compres para los sorteos oficiales entran automáticamente a las rifas de todos los viernes sin pagar nada extra.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 text-xl font-bold">
            📱
          </div>
          <div className="font-bold text-sm text-foreground">Notificación Directa</div>
          <p className="text-xs text-muted-foreground">
            Los números ganadores se publican aquí y se avisa directamente por WhatsApp con comprobante de depósito SINPE.
          </p>
        </div>
      </div>

      {/* Regla Clara */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span className="text-xs text-foreground font-medium">
            Tus tokens <strong>siguen participando para todos los premios principales del sorteo</strong> incluso si ganas la rifa de este viernes.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const el = document.getElementById("paquetes-compra");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold shrink-0"
        >
          Asegurar mis Tokens
        </Button>
      </div>
    </section>
  );
}
