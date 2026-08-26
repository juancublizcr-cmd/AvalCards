import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, Lock, Shield, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Políticas de Privacidad | Aval Motors CR" },
      {
        name: "description",
        content:
          "Políticas de privacidad y protección de datos personales de los participantes de Aval Motors CR.",
      },
    ],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
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
            <Shield className="size-3.5" /> Protección de Datos
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl tracking-wide uppercase">
            Políticas de Privacidad
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Responsable del Tratamiento: Importadora Luxury Scents LTDA. (Aval Motors CR)
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 text-sm text-muted-foreground leading-relaxed shadow-sm">
          <h2 className="text-lg font-bold text-foreground">1. Recopilación de Información</h2>
          <p>
            Para procesar tu participación y asignación de stickers digitales en nuestros eventos promocionales, recopilamos únicamente los datos indispensables de contacto: nombre completo, número de teléfono celular, correo electrónico y la captura del comprobante bancario por SINPE Móvil.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">2. Finalidad del Uso de Datos</h2>
          <p>
            La información suministrada se utiliza de forma estricta y exclusiva para:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Validar los depósitos y asignación de números de stickers.</li>
            <li>Permitir la consulta de tus stickers mediante tu número celular en nuestra plataforma.</li>
            <li>Contactarte de inmediato en caso de resultar favorecido con alguno de los premios principales o instantáneos.</li>
            <li>Realizar los trámites legales de traspaso notarial del vehículo a tu nombre.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">3. Confidencialidad y No Divulgación</h2>
          <p>
            Aval Motors CR y <strong>Importadora Luxury Scents LTDA.</strong> garantizan que tus datos personales <strong>nunca</strong> serán vendidos, cedidos, transferidos ni compartidos con empresas externas o terceras partes para fines publicitarios.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Seguridad del Almacenamiento</h2>
          <p>
            Toda la información viaja encriptada mediante protocolo SSL/TLS y se almacena en infraestructuras con seguridad de nivel bancario. Las capturas de comprobantes se resguardan en servidores protegidos accesibles únicamente por el personal administrativo autorizado.
          </p>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aval Motors CR · Importadora Luxury Scents LTDA.
      </footer>
    </div>
  );
}
