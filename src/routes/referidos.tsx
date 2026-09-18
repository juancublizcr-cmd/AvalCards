import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Users, Gift, Ticket, Share2, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProgramaReferidosUnificado } from "@/components/ProgramaReferidosUnificado";
import { fetchConfig, CONFIG_DEFAULT, type Config } from "@/lib/admin-store";

export const Route = createFileRoute("/referidos")({
  head: () => ({
    meta: [
      { title: "Programa Oficial de Referidos y Amigos Invitados | Aval Community CR" },
      {
        name: "description",
        content:
          "Recomienda Aval Community CR a tus amigos: obtén tu enlace oficial de padrino, gana bonos millonarios en efectivo si tu invitado gana y compite por premios mensuales.",
      },
    ],
  }),
  component: ReferidosPage,
});

function ReferidosPage() {
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT);

  useEffect(() => {
    async function load() {
      try {
        const conf = await fetchConfig();
        setConfig(conf);
      } catch {
        setConfig(CONFIG_DEFAULT);
      }
    }
    void load();

    const handleUpdate = () => {
      void load();
    };

    window.addEventListener("config_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("config_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* NAVBAR ULTRA LIMPIO */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <img src="/isotipo.png" alt="Aval Community CR" className="size-6 sm:size-7 object-contain shrink-0" />
            <span className="font-display text-lg sm:text-2xl tracking-widest whitespace-nowrap">
              AVAL <span className="text-primary">COMMUNITY CR</span>
            </span>
          </Link>

          {/* Acciones de Navegación */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
            >
              <ArrowLeft className="size-3.5 shrink-0" />
              <span>Volver al Inicio</span>
            </Link>
            <Link
              to="/sponsors"
              className="hidden sm:inline-flex text-xs font-bold text-muted-foreground hover:text-amber-500 transition-colors px-2 py-1"
            >
              Comercios Aliados
            </Link>
            <ThemeToggle compact />
            <Button
              size="sm"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-sm shrink-0 rounded-xl"
            >
              <Link to="/">
                <Ticket className="size-3.5 mr-1.5 shrink-0" />
                Comprar Tokens
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO PRINCIPAL DEDICADO */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-amber-500/10 via-background to-background py-10 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider shadow-sm">
              <Sparkles className="size-3.5" /> PROGRAMA OFICIAL DE RECOMENDACIÓN & EMBAJADORES
            </div>

            <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-foreground leading-[0.95]">
              Invita a tus Amigos y <span className="text-fire">Gana en Efectivo</span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Sin registros complicados: genera tu enlace de padrino con tu número de WhatsApp, compártelo con un toque y recibe premios en efectivo depositados formalmente ante Notario si tu recomendado resulta favorecido.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> 100% Sin Comisiones
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Award className="size-3.5" /> Tabla de Líderes Mensual
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-primary">
                <Share2 className="size-3.5" /> Enlace Instantáneo
              </span>
            </div>
          </div>
        </section>

        {/* CONTENEDOR DEL MÓDULO UNIFICADO DE REFERIDOS */}
        <div className="py-8">
          <ProgramaReferidosUnificado config={config} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
