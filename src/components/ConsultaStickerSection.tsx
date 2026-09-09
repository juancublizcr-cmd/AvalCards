import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buscarPorSticker, type ResultadoBusquedaSticker } from "@/lib/orders";

export function ConsultaStickerSection() {
  const [termino, setTermino] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoBusquedaSticker | null>(null);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = termino.replace(/\D/g, "");
    if (!clean) return;

    setCargando(true);
    try {
      const res = await buscarPorSticker(clean);
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
    <section id="consulta-stickers" className="relative border-t border-neutral-800/80 bg-[#050505] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Columna Izquierda: Tipografía Idéntica a la Imagen de Referencia */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#e52525]">
                04 / CONSULTA PÚBLICA
              </span>
            </div>

            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.88] text-white">
              BUSCÁ TU <br />
              <span className="text-[#e52525]">STICKER.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed">
              Comprobá si un número está disponible o ya fue asignado.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="size-4 text-emerald-400" /> Registro Notarial Verificado
              </span>
              <span className="inline-flex items-center gap-1.5 text-neutral-300">
                <Ticket className="size-4 text-primary" /> Sistema Anti-Duplicados
              </span>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Búsqueda Idéntica a la Referencia */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-neutral-800 bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl">
              <label htmlFor="sticker-input" className="block text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
                NÚMERO DE STICKER
              </label>

              <form onSubmit={handleBuscar}>
                <div className="flex flex-row overflow-hidden rounded-md border border-neutral-800 bg-black focus-within:border-[#e52525] transition-colors">
                  <div className="flex items-center flex-1 px-4 py-3.5">
                    <span className="font-mono text-2xl font-bold text-[#e52525] mr-2 select-none">#</span>
                    <input
                      id="sticker-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="00000"
                      value={termino}
                      onChange={(e) => setTermino(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="w-full bg-transparent font-mono text-2xl font-bold text-white tracking-widest placeholder:text-neutral-700 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cargando || !termino.trim()}
                    className="px-8 py-3.5 bg-[#e52525] hover:bg-[#c91f1f] text-white font-extrabold text-sm uppercase tracking-wider shrink-0 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {cargando ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> ...
                      </span>
                    ) : (
                      "BUSCAR"
                    )}
                  </button>
                </div>
              </form>

              {/* Resultado de Búsqueda */}
              {resultado && (
                <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  {resultado.ocupado ? (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span className="font-mono text-lg font-black text-amber-400">
                            #{resultado.numero}
                          </span>
                        </div>
                        <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                          Sticker Asignado
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-amber-500/20 pt-3">
                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-mono block">Titular:</span>
                          <strong className="text-white">{resultado.orden?.nombreAnonimo}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-mono block">Estado:</span>
                          <span className="text-emerald-400 font-bold">
                            {resultado.orden?.estado === "aprobada" ? "Validado Oficialmente" : "En Validación"}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-neutral-400 leading-snug">
                        🔒 Este número ya se encuentra registrado y certificado en la base de datos oficial.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-5 text-emerald-400" />
                          <span className="font-mono text-lg font-black text-emerald-400">
                            #{resultado.numero}
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                          ¡Disponible!
                        </span>
                      </div>

                      <p className="mt-2.5 text-xs text-neutral-300 leading-relaxed">
                        Este sticker no ha sido asignado aún en este sorteo. Podés adquirirlo hoy mismo seleccionando un paquete de tokens.
                      </p>

                      <Button
                        asChild
                        className="mt-3.5 w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider shadow-md"
                      >
                        <a href="#paquetes">
                          Elegir Paquete y Participar
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Acceso a Validador Completo por Teléfono */}
              <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
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
      </div>
    </section>
  );
}
