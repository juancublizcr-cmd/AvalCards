import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Coins, Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buscarPorToken, type ResultadoBusquedaToken } from "@/lib/orders";

export function ConsultaTokensSection() {
  const [termino, setTermino] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoBusquedaToken | null>(null);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = termino.replace(/\D/g, "");
    if (!clean) return;

    setCargando(true);
    try {
      const res = await buscarPorToken(clean);
      setResultado(res);
    } catch {
      setResultado({
        consultado: true,
        numero: clean.padStart(5, "0"),
        ocupado: false,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <section id="consulta-tokens" className="relative mx-auto max-w-6xl px-5 py-20 border-t border-border/40 overflow-hidden">
      {/* Ancla oculta de retrocompatibilidad */}
      <div id="consulta-stickers" className="sr-only" aria-hidden="true" />

      {/* Resplandor ambiental de fondo acorde a la estética oficial de Aval Community CR */}
      <div className="pointer-events-none absolute -top-24 -left-20 size-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        {/* Columna Izquierda: Identidad de Marca Aval Community CR */}
        <div className="lg:col-span-6 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-widest text-primary font-medium">
            <Search className="size-3.5" /> 04 · Consulta y Verificación Pública
          </span>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase leading-tight text-white">
            CONSULTÁ TU <span className="text-fire">TOKEN OFICIAL</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
            Comprobá en tiempo real si un número de 5 dígitos está libre o ya fue asignado en el registro notarial del sorteo. Máxima transparencia en cada edición.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="size-4 text-emerald-400" /> Registro Notarial Verificado
            </span>
            <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
              <Sparkles className="size-4 text-primary" /> Sistema Anti-Duplicados
            </span>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta con Estilo Nativo de Aval Community CR */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-6 sm:p-8 shadow-[var(--shadow-card)] relative overflow-hidden backdrop-blur-md">
            <label
              htmlFor="token-input"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"
            >
              <Coins className="size-3.5 text-primary" />
              <span>Número de Token Digital (5 dígitos)</span>
            </label>

            <form onSubmit={handleBuscar}>
              <div className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-black/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
                <div className="flex items-center flex-1 px-4 py-3 sm:py-3.5">
                  <span className="font-mono text-2xl font-bold text-primary mr-2 select-none">#</span>
                  <input
                    id="token-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="00000"
                    value={termino}
                    onChange={(e) => setTermino(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    className="w-full bg-transparent font-mono text-2xl font-bold text-white tracking-widest placeholder:text-muted-foreground/40 focus:outline-none"
                  />
                </div>
                <Button
                  variant="hero"
                  type="submit"
                  disabled={cargando || !termino.trim()}
                  className="h-auto px-7 py-3.5 shadow-[var(--shadow-fire)] font-bold text-sm uppercase tracking-wider shrink-0 transition-all active:scale-95 cursor-pointer rounded-none text-primary-foreground"
                >
                  {cargando ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" /> Buscando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Search className="size-4" /> Buscar Token
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Resultado Dinámico */}
            {resultado && (
              <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                {resultado.ocupado ? (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="font-mono text-lg font-black text-amber-400">
                          Token #{resultado.numero}
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                        Asignado Oficialmente
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-amber-500/20 pt-3">
                      <div>
                        <span className="text-muted-foreground text-[10px] uppercase font-mono block">Titular:</span>
                        <strong className="text-white">{resultado.orden?.nombreAnonimo}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[10px] uppercase font-mono block">Estado:</span>
                        <span className="text-emerald-400 font-bold">
                          {resultado.orden?.estado === "aprobada" ? "Validado Oficialmente" : "En Validación"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground leading-snug">
                      🔒 Este número ya se encuentra registrado y certificado en la base de datos oficial de Aval Community CR.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/25 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-emerald-400" />
                        <span className="font-mono text-lg font-black text-emerald-400">
                          Token #{resultado.numero}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                        ¡Disponible!
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-neutral-300 leading-relaxed">
                      ¡Excelente! Este número está disponible y puede ser asignado a tu orden hoy mismo en el gran evento promocional.
                    </p>

                    <Button
                      variant="hero"
                      asChild
                      className="mt-3.5 w-full shadow-[var(--shadow-fire)] font-bold text-xs uppercase tracking-wider"
                    >
                      <a href="#paquetes-compra">
                        Elegir Paquete y Participar
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Acceso a Validador Completo por Teléfono */}
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">¿Deseas consultar todos tus tokens?</span>
              <Button variant="link" size="sm" asChild className="text-primary hover:text-primary/80 font-bold p-0 h-auto">
                <Link to="/validar">
                  Validar por Teléfono →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const ConsultaStickerSection = ConsultaTokensSection;
