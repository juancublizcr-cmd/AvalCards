import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, DollarSign, Flame, HelpCircle, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reembolso")({
  head: () => ({
    meta: [
      { title: "Política de Reembolsos y Devoluciones | Aval Motors CR" },
      {
        name: "description",
        content:
          "Políticas de reembolso, reversión de pagos y cancelaciones de Aval Motors CR e Importadora Luxury Scents LTDA.",
      },
    ],
  }),
  component: ReembolsoPage,
});

function ReembolsoPage() {
  const abrirWhatsApp = () => {
    const texto = encodeURIComponent(
      "Hola Aval Motors CR, solicito información sobre una reversión / reembolso de pago.",
    );
    window.open(`https://wa.me/50686092162?text=${texto}`, "_blank");
  };

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

      <main className="mx-auto max-w-4xl px-5 py-12 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-widest text-primary font-semibold">
            <RefreshCcw className="size-3.5" /> Garantía de Reembolsos
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl tracking-wide uppercase">
            Política de Reembolsos y Devoluciones
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Responsable: Importadora Luxury Scents LTDA. · Compromiso de transparencia y protección al consumidor
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" /> 1. Casos en que Aplica Reembolso
            </h2>
            <p className="mt-2">
              En <strong>Aval Motors CR</strong> (Importadora Luxury Scents LTDA.) procesamos devoluciones y reembolsos de dinero en los siguientes escenarios:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
              <li>
                <strong>Pagos Duplicados o Excedentes:</strong> Si realizaste una doble transferencia por SINPE Móvil o tu tarjeta fue procesada más de una vez por error involuntario.
              </li>
              <li>
                <strong>Órdenes Rechazadas con Depósito Confirmado:</strong> Si tu orden fue rechazada por inconsistencia de datos o agotamiento de stock pero el dinero ingresó a nuestra cuenta bancaria.
              </li>
              <li>
                <strong>Cancelación Definitiva del Evento:</strong> En el caso fortuito o de fuerza mayor en que el evento promocional sea cancelado de manera definitiva sin reprogramación, se reintegrará el 100% del monto aportado a cada participante.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="size-5 text-primary" /> 2. Plazos y Métodos de Devolución
            </h2>
            <p className="mt-2 text-xs">
              Una vez verificada la solicitud por nuestro equipo administrativo:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
              <li>
                <strong>SINPE Móvil:</strong> Las devoluciones se realizan en un plazo máximo de <strong>24 a 48 horas hábiles</strong> al mismo número telefónico desde el cual se originó el depósito.
              </li>
              <li>
                <strong>Tarjeta de Débito/Crédito (TiloPay):</strong> La reversión se solicita de inmediato a la pasarela; el reflejo en el estado de cuenta depende de la entidad bancaria emisora (habitualmente de 3 a 7 días hábiles).
              </li>
              <li>
                <strong>Criptomonedas (USDT):</strong> La devolución se procesa a la misma dirección de billetera remitente (menos el fee de red de la blockchain).
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <DollarSign className="size-5 text-primary" /> 3. Excepciones (Casos No Reembolsables)
            </h2>
            <p className="mt-2 text-xs">
              Debido a la naturaleza de las rifas digitales y la reserva exclusiva de números de la suerte:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
              <li>
                No se realizarán reembolsos una vez que la orden ha sido validada y los números de stickers han quedado formalmente asignados al participante, salvo los casos estipulados en el punto 1.
              </li>
              <li>
                No aplican reembolsos una vez ejecutado el sorteo oficial de la fecha programada.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" /> 4. ¿Cómo Solicitar tu Reembolso?
            </h2>
            <p className="mt-2 text-xs">
              Para tramitar tu solicitud, por favor contáctanos con tu número de orden y comprobante:
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={abrirWhatsApp} className="text-emerald-500 hover:text-emerald-400">
                Contactar por WhatsApp: 8609-2162
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aval Motors CR · Importadora Luxury Scents LTDA.
      </footer>
    </div>
  );
}
