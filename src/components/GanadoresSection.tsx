import { ShieldCheck, Trophy, UserCheck } from "lucide-react";
import carImg from "@/assets/premio-carro.jpg";
import motoImg from "@/assets/premio-moto.jpg";
import { GANADORES_TESTIMONIOS_DEFAULT, type TestimonioGanador } from "@/lib/admin-store";

export function GanadoresSection({ ganadores }: { ganadores?: TestimonioGanador[] }) {
  const lista = ganadores && ganadores.length > 0 ? ganadores : GANADORES_TESTIMONIOS_DEFAULT;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 border-t border-border/40">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-widest text-primary font-medium">
          <Trophy className="size-3.5" /> Ganadores Certificados
        </span>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl tracking-wide">
          Ellos ya cumplieron <span className="text-fire">sus sueños</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Conoce a los ganadores de nuestras ediciones pasadas. Premios entregados con notario público y garantía total.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {lista.map((g, idx) => {
          const fallbackImg = idx === 0 ? carImg : motoImg;
          return (
            <article
              key={g.id || idx}
              className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border bg-[image:var(--gradient-surface)] shadow-[var(--shadow-card)]"
            >
              <div className="sm:w-2/5 shrink-0 relative">
                <img
                  src={g.foto || fallbackImg}
                  alt={g.premio}
                  className="h-48 sm:h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-0.5 font-mono text-[11px] font-bold text-primary backdrop-blur">
                  Ticket: #{g.sticker}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider">
                    {g.sorteo}
                  </div>
                  <h3 className="font-semibold text-lg mt-0.5">{g.premio}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserCheck className="size-3.5 text-success" />
                    <span>{g.ganador} · {g.ciudad}</span>
                  </div>
                  <p className="mt-3 text-xs italic text-muted-foreground leading-relaxed">
                    "{g.testimonio}"
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] text-success">
                  <ShieldCheck className="size-3.5" /> Entrega oficial certificada
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
