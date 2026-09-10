import { ArrowRight, CheckCircle2, ChevronRight, Coins, Gift, MessageCircle, Share2, Sparkles, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Config } from "@/lib/admin-store";

export function ReferidosLandingSection({ config }: { config: Config }) {
  if (config.referidosActivo === false || config.referidosPromoLandingActivo === false) {
    return null;
  }

  const premioPrimero = config.referidosPremioPrimero || config.referidosPremioSiGana || "₡4,000,000";
  const premioSegundo = config.referidosPremioSegundo || "₡2,000,000";
  const premioTercero = config.referidosPremioTercero || "₡1,000,000";
  const darTokens = Boolean(config.referidosDarTokensBono);
  const cantTokensBono = config.referidosBonoTokens ?? 1;

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-10 shadow-2xl">
      {/* Luces de fondo */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative z-10 space-y-8">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-black tracking-wide text-amber-400 shadow-sm">
            <Users className="size-3.5" /> PROGRAMA OFICIAL DE PADRINOS Y REFERIDOS
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            ¡Ganá hasta{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent underline decoration-amber-500/50 decoration-wavy">
              {premioPrimero}
            </span>{" "}
            en efectivo si tu referido resulta ganador!
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Recomendá el evento a tus amigos y familiares con tu enlace personal. Si la persona que compró con tu recomendación gana cualquiera de los 3 premios oficiales, ¡vos cobrás efectivo entregado formalmente!
          </p>
        </div>

        {/* 3 Pasos del Programa */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Paso 1 */}
          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition-all hover:border-amber-500/50 hover:bg-zinc-900 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-mono font-black text-base border border-amber-500/30">
                  01
                </span>
                <Share2 className="size-5 text-muted-foreground group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="font-bold text-base text-white">Obtené tu Enlace Único</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ingresá tu número de teléfono en la sección <strong>Validar Tokens</strong> o al finalizar tu compra para generar automáticamente tu link oficial de padrino.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-[11px] text-amber-400 font-semibold gap-1">
              <CheckCircle2 className="size-3.5" /> 100% automático y sin costo
            </div>
          </div>

          {/* Paso 2 */}
          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-900 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-base border border-emerald-500/30">
                  02
                </span>
                <MessageCircle className="size-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-bold text-base text-white">Compartí con Amigos</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enviá tu enlace por WhatsApp, estados o redes sociales. Cada amigo que adquiera sus tokens quedará registrado bajo tu cuenta oficial.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-[11px] text-emerald-400 font-semibold gap-1">
              <CheckCircle2 className="size-3.5" /> Seguimiento en tiempo real
            </div>
          </div>

          {/* Paso 3 (Los 3 Grandes Premios) */}
          <div className="group relative rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-900 p-5 sm:p-6 transition-all hover:border-amber-400 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-black font-mono font-black text-base shadow-sm">
                  03
                </span>
                <Trophy className="size-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                <span>¡Cobrá hasta {premioPrimero}!</span>
                <Sparkles className="size-4 text-yellow-400 shrink-0" />
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Tenés 3 oportunidades de ganar si el token premiado fue comprado con tu enlace:
              </p>

              {/* Desglose de los 3 Premios */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1.5 text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    🥇 1° Premio Mayor:
                  </span>
                  <strong className="text-white font-black text-sm">{premioPrimero}</strong>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-zinc-800/90 border border-zinc-700/60 px-2.5 py-1.5 text-xs">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    🥈 2° Premio:
                  </span>
                  <strong className="text-amber-400 font-bold">{premioSegundo}</strong>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-zinc-800/90 border border-zinc-700/60 px-2.5 py-1.5 text-xs">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    🥉 3° Premio:
                  </span>
                  <strong className="text-amber-400 font-bold">{premioTercero}</strong>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="size-3.5" /> Entregados formalmente
              </span>
              <span className="text-zinc-400 text-[10px] font-normal">Sin sorteos extras</span>
            </div>
          </div>
        </div>

        {/* Notificación condicional si se activan tokens de cortesía */}
        {darTokens && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 flex items-center gap-3 text-xs sm:text-sm text-emerald-300">
            <Gift className="size-5 text-emerald-400 shrink-0" />
            <span>
              <strong>🎁 ¡Bono Especial de Cortesía Activo!</strong> Por tiempo limitado, cada amigo que compre usando tu enlace recibe{" "}
              <strong>+{cantTokensBono} Token{cantTokensBono > 1 ? "s" : ""} Extra GRATIS</strong> para tener más oportunidades de ganar.
            </span>
          </div>
        )}

        {/* Barra de Acciones y Vínculo con Concurso Mensual */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-black/50 p-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Trophy className="size-4 text-amber-400" />
              <span>¿Querés premios mensuales adicionales?</span>
            </div>
            <p className="text-xs text-zinc-400">
              Quienes más amigos inviten compiten por los premios de la{" "}
              <strong className="text-zinc-200">Tabla de Líderes</strong> ({config.rankingPremioPrimero || "₡250,000 SINPE"} al 1° lugar).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Button
              variant="hero"
              size="default"
              onClick={() => {
                window.location.href = "/validar";
              }}
              className="gap-2 font-black shadow-lg"
            >
              <span>Obtener Mi Enlace de Referido</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
