import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Flame,
  HelpCircle,
  Lock,
  Scale,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos, Condiciones y Reglamento | Aval Motors CR" },
      {
        name: "description",
        content:
          "Bases, reglamento oficial y condiciones de participación del evento promocional de Aval Motors CR.",
      },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="size-6 text-primary" />
            <span className="font-display text-2xl tracking-widest">
              AVAL <span className="text-primary">MOTORS CR</span>
            </span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="size-4" /> Volver al Inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 space-y-10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-widest text-primary font-semibold">
            <Scale className="size-3.5" /> Marco Legal y Operativo
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl tracking-wide uppercase">
            Términos, Condiciones y Reglamento Oficial
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: Agosto 2026 · Evento Promocional 100% Transparente
          </p>
        </div>

        {/* 1. Transparencia */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <ShieldCheck className="size-5" />
            </div>
            <h2 className="text-xl font-bold">1. Evento Promocional 100% Transparente</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El presente evento promocional se realiza de forma totalmente transparente, utilizando como referencia exclusiva los <strong>resultados oficiales de la Lotería Nacional de Costa Rica</strong>, garantizando un proceso claro, auditable e inviolable para todos los participantes.
          </p>
        </section>

        {/* 2. Instrucciones de Pago SINPE Móvil */}
        <section className="rounded-2xl border-2 border-primary/50 bg-secondary/50 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <CreditCard className="size-5" />
            </div>
            <h2 className="text-xl font-bold">2. Instrucciones de Pago y SINPE Móvil</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 rounded-xl bg-card p-4 border border-border">
            <div>
              <span className="text-xs text-muted-foreground">Teléfono SINPE Móvil:</span>
              <p className="font-mono text-xl font-bold text-primary">8634-4772</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Titular Oficial de la Cuenta:</span>
              <p className="font-semibold text-foreground">Importadora Luxury Scents LTDA.</p>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 space-y-1 text-xs">
            <p className="font-bold text-destructive flex items-center gap-1.5">
              <AlertTriangle className="size-4" /> REGLA ESTRICTA DE MOTIVO EN SINPE:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En el motivo o detalle de la transferencia SINPE escribe <strong>únicamente tu nombre y apellidos</strong>. Por disposiciones bancarias, <strong>NO</strong> escribas palabras como <em>"rifa"</em>, <em>"sorteo"</em>, <em>"premio"</em> o similares.
            </p>
          </div>
        </section>

        {/* 3. Confirmación y Reserva */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <Lock className="size-5" />
            </div>
            <h2 className="text-xl font-bold">3. Reserva de Acciones y Validación</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Una vez realizado el pago, debes adjuntar la captura del comprobante en el sistema para que nuestro equipo lo valide y tu participación quede formalmente confirmada.
          </p>
          <div className="rounded-xl bg-secondary/70 p-4 text-xs text-muted-foreground leading-relaxed border border-border">
            <strong className="text-foreground">⏳ Plazo de Reserva Máximo:</strong> La acción permanecerá reservada por un <strong>máximo de 24 horas</strong>. Si dentro de ese plazo el depósito no ha sido validado con el comprobante correspondiente, la acción será liberada de forma automática y quedará disponible para que otra persona la adquiera.
          </div>
        </section>

        {/* 4. Determinación de Ganadores */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Trophy className="size-5" />
            </div>
            <h2 className="text-xl font-bold">4. ¿Cómo se determinarán los Ganadores?</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Los números ganadores se calcularán de acuerdo con las siguientes combinaciones matemáticas directas basadas en el sorteo oficial:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-primary/40 bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-base">🥇 Primer Premio</span>
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/30">
                  Número (2 dígitos) + Serie (3 dígitos)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Se toma el primer número con la serie oficial del 1° premio de la Lotería Nacional.<br />
                <strong className="text-foreground font-mono">Ejemplo:</strong> Número 01 + Serie 451 = <strong className="text-primary font-mono font-bold">01451</strong>
              </p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-base">🥈 Segundo Premio</span>
                <span className="text-xs font-mono bg-secondary text-muted-foreground px-2 py-0.5 rounded border border-border">
                  Número (2 dígitos) + Serie (3 dígitos)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Se toma el segundo número con la serie oficial del 2° premio de la Lotería Nacional.<br />
                <strong className="text-foreground font-mono">Ejemplo:</strong> Número 81 + Serie 160 = <strong className="text-foreground font-mono font-bold">81160</strong>
              </p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-base">🥉 Tercer Premio</span>
                <span className="text-xs font-mono bg-secondary text-muted-foreground px-2 py-0.5 rounded border border-border">
                  Número (2 dígitos) + Serie (3 dígitos)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Se toma el tercer número con la serie oficial del 3° premio de la Lotería Nacional.<br />
                <strong className="text-foreground font-mono">Ejemplo:</strong> Número 60 + Serie 562 = <strong className="text-foreground font-mono font-bold">60562</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 5. Fechas y Reprogramación */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Calendar className="size-5" />
            </div>
            <h2 className="text-xl font-bold">5. Fecha del Evento y Condiciones de Cierre</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              📅 El evento promocional está programado oficialmente para el <strong>27 de septiembre de 2026</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                Si para dicha fecha no se ha colocado el <strong>100% de las acciones disponibles</strong>, el evento será reprogramado periódicamente hasta alcanzar la totalidad del inventario.
              </li>
              <li>
                Si el <strong>100% de las acciones se completa antes del 27 de septiembre de 2026</strong>, el evento se adelantará y se realizará el domingo más cercano posterior a la finalización de las ventas, informando oportunamente la fecha definitiva por nuestros canales oficiales.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aval Motors CR · Importadora Luxury Scents LTDA. · Todos los derechos reservados.
      </footer>
    </div>
  );
}
