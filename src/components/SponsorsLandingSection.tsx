import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MapPin,
  MessageSquare,
  Percent,
  Sparkles,
  Store,
  Tag,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORIAS_SPONSOR_LABELS,
  fetchSponsors,
  type ComercioSponsor,
} from "@/lib/sponsors-store";

export function SponsorsLandingSection() {
  const [sponsors, setSponsors] = useState<ComercioSponsor[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSponsors();
        setSponsors(data.filter((s) => s.activo));
      } catch {}
    }
    void load();
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-10 shadow-2xl space-y-8">
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-primary/10 blur-3xl" />

      {/* Header de la Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-black tracking-wide text-amber-400">
            <Percent className="size-3.5" /> BENEFICIOS EXCLUSIVOS CON TU TOKEN
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground mt-2">
            Descuentos Oficiales en Comercios Aliados
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Con tus mismos Tokens adquiridos, obtén <strong>descuentos de hasta 30% y beneficios inmediatos</strong> en
            los mejores talleres mecánicos, autolavados, restaurantes, repuesteras y gimnasios de Costa Rica.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xs sm:text-sm h-11 px-5 shadow-lg shrink-0"
        >
          <Link to="/sponsors">
            <Store className="size-4 mr-1.5" /> Ver Catálogo Completo ({sponsors.length}) ↗
          </Link>
        </Button>
      </div>

      {/* Grid de Sponsors Destacados (Top 3-6) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.slice(0, 6).map((s) => (
          <div
            key={s.id}
            className={`group rounded-2xl border bg-card/80 p-5 space-y-3.5 shadow-md transition-all hover:border-amber-500/60 hover:-translate-y-1 flex flex-col justify-between ${
              s.destacado ? "border-amber-500/50 ring-1 ring-amber-500/20" : "border-border"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground">
                  {CATEGORIAS_SPONSOR_LABELS[s.categoria]?.icono || "🏬"}{" "}
                  {CATEGORIAS_SPONSOR_LABELS[s.categoria]?.label || s.categoria}
                </span>

                {s.destacado && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400">
                    ⭐ TOP
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-black text-base text-foreground group-hover:text-amber-400 transition-colors line-clamp-1">
                  {s.nombreComercio}
                </h3>
                <div className="mt-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-black text-amber-300">
                  {s.descuentoTexto}
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {s.descripcion}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3 text-primary" /> {s.provincia}
              </span>
              <a
                href={`https://wa.me/506${s.telefonoWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `¡Hola! Vi su descuento en Aval Community CR (${s.descuentoTexto}) y deseo aplicarlo.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <MessageSquare className="size-3.5" /> Canjear ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner de la Sección */}
      <div className="rounded-2xl border border-border/80 bg-zinc-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏬</span>
          <div>
            <span className="font-bold text-sm text-foreground block">
              ¿Tienes un negocio o emprendimiento en Costa Rica?
            </span>
            <span className="text-xs text-muted-foreground">
              Afíliate como Sponsor Oficial y promociona tus descuentos ante miles de clientes activos.
            </span>
          </div>
        </div>

        <Button asChild size="sm" variant="outline" className="text-amber-400 border-amber-500/40 hover:bg-amber-500/10 text-xs shrink-0">
          <Link to="/sponsors">
            Afiliar mi Comercio Gratis →
          </Link>
        </Button>
      </div>
    </section>
  );
}
