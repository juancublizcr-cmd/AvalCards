import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  Lock,
  MessageCircle,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchConfig, type Config, CONFIG_DEFAULT } from "@/lib/admin-store";

export const Route = createFileRoute("/promo")({
  head: () => ({
    meta: [
      { title: "Algo Grande Se Viene en Costa Rica | Aval Community CR" },
      {
        name: "description",
        content:
          "Prepárate para el lanzamiento más grande y novedoso de Costa Rica. Una experiencia inédita, 100% legal y transparente está por revelarse.",
      },
      { property: "og:title", content: "Algo Grande Se Viene en Costa Rica | Aval Community CR" },
      {
        property: "og:description",
        content:
          "Una experiencia inédita sin precedentes en el país. Sigue nuestras redes oficiales para el gran anuncio.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TeaserPromoPage,
});

// Iconos vectoriales oficiales para redes
function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function TeaserPromoPage() {
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT);

  useEffect(() => {
    void fetchConfig().then((c) => {
      if (c) setConfig(c);
    });
  }, []);

  const telefonoWp = (config.telefonoSinpe || "86344772").replace(/\D/g, "");
  const linkWp = `https://wa.me/506${telefonoWp}?text=${encodeURIComponent(
    "¡Hola! Vi el anuncio en redes sociales y quiero estar en la Lista VIP de WhatsApp para enterarme de primero del gran lanzamiento oficial de Aval Community CR."
  )}`;

  // Enlaces oficiales de redes
  const linkInstagram = "https://instagram.com/avalcommunitycr";
  const linkFacebook = "https://facebook.com/avalcommunitycr";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white flex flex-col justify-between">
      {/* ── BARRA SUPERIOR MINIMALISTA (SIN LINKS DE SALIDA) ── */}
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Flame className="size-6 text-primary animate-pulse" />
            <span className="font-display text-xl sm:text-2xl tracking-widest font-black text-foreground">
              AVAL <span className="text-primary">COMMUNITY CR</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <span className="size-2 rounded-full bg-amber-400 animate-ping" />
            <span>Fase Confidencial</span>
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL: TEASER / EXPECTATIVA TOTAL ── */}
      <main className="relative overflow-hidden flex-1 flex flex-col justify-center py-12 sm:py-20">
        {/* Atmósfera misteriosa con resplandor dorado y fuego */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-primary/15 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 size-80 rounded-full bg-amber-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-2xl px-5 text-center">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary shadow-sm mb-6 animate-pulse">
            <Sparkles className="size-3.5 text-primary" />
            <span>Costa Rica · Algo Inédito Se Está Cocinando</span>
          </div>

          {/* Título de misterio */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[1.05] text-foreground">
            Prepárate Para Lo Que <span className="text-gradient-fire">Se Viene</span>
          </h1>

          {/* Texto de intriga */}
          <p className="mx-auto mt-6 max-w-lg text-base sm:text-xl text-zinc-200 leading-relaxed font-medium">
            Estamos preparando algo verdaderamente grande, novedoso y sin precedentes en el país.
          </p>

          <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Una experiencia 100% legal, auditada y formal que cambiará por completo la manera de ganar y celebrar en Costa Rica.
          </p>

          {/* ── BÓVEDA CONFIDENCIAL / TEASER BOX ── */}
          <div className="mt-10 rounded-3xl border-2 border-primary/40 bg-gradient-to-b from-card/95 via-card/60 to-background/95 p-6 sm:p-8 shadow-[0_0_60px_rgba(249,115,22,0.2)] text-left space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Lock className="size-4" /> Lanzamiento Inminente · Acceso Exclusivo
              </div>
              <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase px-2.5 py-0.5">
                Muy Pronto
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0 mt-0.5">
                  <Zap className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Innovador y Fuera de Serie</h3>
                  <p className="text-xs text-muted-foreground">
                    Olvídate de lo mismo de siempre. Lo que viene está diseñado a una escala nunca antes vista.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">100% Legal & Supervisado</h3>
                  <p className="text-xs text-muted-foreground">
                    Respaldado con protocolo notarial oficial en Costa Rica y transparencia absoluta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Acceso Prioritario el Día 1</h3>
                  <p className="text-xs text-muted-foreground">
                    Quienes estén conectados a nuestras redes recibirán las pistas y el acceso antes que el público general.
                  </p>
                </div>
              </div>
            </div>

            {/* Aviso de comunidad */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xs font-semibold text-zinc-300">
                ¿Querés ser el primero en enterarte en el momento exacto en que soltemos la bomba?
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Seguinos en nuestras redes oficiales o escribinos por WhatsApp para sumarte a la lista prioritaria.
              </p>
            </div>
          </div>

          {/* ── BOTONES DE ACCIÓN EXCLUSIVOS: WHATSAPP, INSTAGRAM, FACEBOOK ── */}
          <div className="mt-8 space-y-3">
            {/* Botón WhatsApp Principal */}
            <a
              href={linkWp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:from-emerald-500 hover:to-emerald-400 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <WhatsAppIcon className="size-6 text-white" />
              <span>Entrar a la Lista VIP en WhatsApp</span>
            </a>

            {/* Fila de Redes Sociales: Instagram y Facebook */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Botón Instagram */}
              <a
                href={linkInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 h-13 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <InstagramIcon className="size-5" />
                <span>Seguir en Instagram</span>
              </a>

              {/* Botón Facebook */}
              <a
                href={linkFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 h-13 rounded-2xl bg-[#1877F2] text-white font-bold text-sm shadow-md hover:bg-[#166fe5] transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FacebookIcon className="size-5" />
                <span>Seguir en Facebook</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
              Aval Community CR · Costa Rica · Muy Pronto
            </span>
          </div>
        </div>
      </main>

      {/* ── PIE DE PÁGINA LIMPIO (SOLO MARCA, SIN NINGÚN LINK INTERNO) ── */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground/80 bg-card/30">
        <div className="mx-auto max-w-2xl px-5 space-y-1">
          <p className="font-semibold text-foreground">
            Aval Community CR © 2026
          </p>
          <p className="text-[11px] text-muted-foreground">
            Página oficial de prelanzamiento y expectativa para redes sociales.
          </p>
        </div>
      </footer>
    </div>
  );
}
