import { ArrowRight, CheckCircle2, Coins, Crown, DollarSign, Flame, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Config } from "@/lib/admin-store";

function formatNumber(n: number) {
  return n.toLocaleString("es-CR");
}

export function SuperTokenSection({ config }: { config: Config }) {
  if (config.supertokenActivo === false) return null;

  const precio = config.supertokenPrecio ?? 1000;
  const bono1 = config.supertokenPremioPrimeroUsd ?? config.supertokenPremioUsd ?? 4500000;
  const bono2 = config.supertokenPremioSegundoUsd ?? 250000;
  const bono3 = config.supertokenPremioTerceroUsd ?? 1500000;

  const moneda = config.supertokenMoneda || (bono1 > 50000 ? "CRC" : "CRC");
  const simbolo = moneda === "CRC" ? "₡" : "$";
  const codigo = moneda === "CRC" ? "CRC" : "USD";
  const nombreMoneda = moneda === "CRC" ? "colones" : "dólares";

  const irATickets = () => {
    const el = document.getElementById("tickets-seleccion") || document.getElementById("paquetes-compra");
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 85;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-950/30 via-zinc-950 to-zinc-950 p-6 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-8">
      {/* Resplandores de Fondo */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-yellow-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 px-4 py-1.5 text-xs font-black tracking-widest uppercase text-amber-300 shadow-md">
          <Crown className="size-4 text-amber-400 animate-pulse" />
          <span>MODALIDAD VIP · BONOS CASH EN {moneda === "CRC" ? "COLONES" : "DÓLARES"}</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl tracking-wide uppercase text-foreground leading-tight">
          Multiplica tus Premios con el <span className="text-fire">SuperToken Oficial</span>
        </h2>

        <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
          ¿Quieres salir estrenando vehículo y con la bolsa llena de {nombreMoneda}? Por solo{" "}
          <strong className="text-amber-400 font-bold">desde ₡{formatNumber(precio)} adicionales</strong> según el paquete que elijas (₡{formatNumber(precio)} en 3 tokens, ₡{formatNumber(precio * 2)} en 6 tokens, +₡{formatNumber(precio)} por cada 3 tokens), conviertes todos tus números en <strong className="text-foreground">SuperTokens</strong> y activas bonos en efectivo directo en {nombreMoneda} para los <strong className="text-amber-300">3 primeros lugares</strong>.
        </p>
      </div>

      {/* Las 3 Tarjetas de Bonos Extra */}
      <div className="relative z-10 grid gap-5 md:grid-cols-3">
        {/* 1er Lugar */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/20 via-card to-card p-6 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-0.5 text-[10px] font-black uppercase text-black shadow-md">
            👑 Bono Estrella
          </div>

          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-3xl shadow-inner">
              🥇
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">1° Lugar · Vehículo Mayor</span>
              <h3 className="text-lg font-black text-foreground mt-0.5">Bono en Efectivo Cash</h3>
              <div className="font-mono text-3xl sm:text-4xl font-black text-amber-400 mt-2 tracking-tight">
                +{simbolo}{formatNumber(bono1)} <span className="text-base font-sans font-bold text-amber-300">{codigo}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                Entregado formalmente el día de la entrega notarial del vehículo 0KM. ¡Te vas manejando y platudo!
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-500/30 flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium">
            <CheckCircle2 className="size-3.5 text-amber-400 shrink-0" />
            <span>Sumado a tu vehículo elegido 0KM</span>
          </div>
        </div>

        {/* 2do Lugar */}
        <div className="relative overflow-hidden rounded-2xl border border-border/90 bg-gradient-to-b from-sky-500/10 via-card to-card p-6 shadow-md flex flex-col justify-between hover:border-sky-500/50 hover:scale-[1.02] transition-all">
          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 text-3xl shadow-inner">
              🥈
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-400">2° Lugar · Segundo Premio</span>
              <h3 className="text-lg font-black text-foreground mt-0.5">Bono en Efectivo Cash</h3>
              <div className="font-mono text-3xl sm:text-4xl font-black text-sky-400 mt-2 tracking-tight">
                +{simbolo}{formatNumber(bono2)} <span className="text-base font-sans font-bold text-sky-300">{codigo}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                Bono directo entregado formalmente al ganador del segundo lugar junto con el segundo vehículo o premio oficial.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] text-sky-300/90 font-medium">
            <CheckCircle2 className="size-3.5 text-sky-400 shrink-0" />
            <span>Sumado al 2do vehículo / premio</span>
          </div>
        </div>

        {/* 3er Lugar */}
        <div className="relative overflow-hidden rounded-2xl border border-border/90 bg-gradient-to-b from-yellow-600/10 via-card to-card p-6 shadow-md flex flex-col justify-between hover:border-yellow-500/50 hover:scale-[1.02] transition-all">
          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-600/20 border border-yellow-600/40 text-yellow-400 text-3xl shadow-inner">
              🥉
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-yellow-400">3° Lugar · Tercer Premio</span>
              <h3 className="text-lg font-black text-foreground mt-0.5">Bono en Efectivo Cash</h3>
              <div className="font-mono text-3xl sm:text-4xl font-black text-yellow-400 mt-2 tracking-tight">
                +{simbolo}{formatNumber(bono3)} <span className="text-base font-sans font-bold text-yellow-300">{codigo}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                Bono entregado formalmente que se agrega al tercer premio oficial de la edición para multiplicar tus ganancias.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] text-yellow-300/90 font-medium">
            <CheckCircle2 className="size-3.5 text-yellow-400 shrink-0" />
            <span>Sumado al 3er premio de la edición</span>
          </div>
        </div>
      </div>

      {/* Banner de Activación y Botón */}
      <div className="relative z-10 rounded-2xl border border-amber-500/40 bg-zinc-900/90 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Zap className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              ¿Cómo se activa? ¡En 1 solo clic al comprar tus Tokens!
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Al seleccionar cualquiera de tus paquetes, enciende el switch dorado de{" "}
              <strong className="text-amber-400">
                SuperToken (+₡{formatNumber(precio)} cada 3 tokens: ₡{formatNumber(precio)}, ₡{formatNumber(precio * 2)}, ₡{formatNumber(precio * 3)}...)
              </strong>{" "}
              antes de confirmar tu orden.
            </p>
          </div>
        </div>

        <Button
          variant="hero"
          size="lg"
          onClick={irATickets}
          className="w-full sm:w-auto shadow-[var(--shadow-fire)] font-black text-xs sm:text-sm px-6 py-6 shrink-0 gap-2 cursor-pointer"
        >
          <Crown className="size-4 text-black" />
          <span>Activar SuperToken y Elegir Tokens →</span>
        </Button>
      </div>
    </section>
  );
}
