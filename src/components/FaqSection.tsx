import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQS_DEFAULT, type FaqItem, type Config } from "@/lib/admin-store";

export function FaqSection({ faqs, config }: { faqs?: FaqItem[]; config?: Config }) {
  const [abierto, setAbierto] = useState<number | null>(0);
  const lista = faqs && faqs.length > 0 ? faqs : FAQS_DEFAULT;

  const rawTel = config?.promoWhatsapp || "50686344772";
  const whatsappNum = rawTel.replace(/\D/g, "") || "50686344772";
  const displayTel = "+506 8634-4772";
  const mensajeWhatsapp = "¡Hola! Tengo dudas sobre cómo participar en el evento promocional de Aval Community CR. ¿Me pueden ayudar?";

  return (
    <section id="faqs" className="mx-auto max-w-4xl px-5 py-20 border-t border-border/40 scroll-mt-24">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-widest text-primary font-medium">
          <HelpCircle className="size-3.5" /> Preguntas Frecuentes
        </span>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl tracking-wide uppercase">
          Preguntas Frecuentes
        </h2>
        <p className="mx-auto mt-2 text-sm text-muted-foreground max-w-xl">
          Todo lo que necesitas saber sobre cómo participar, validar tus tokens y la entrega oficial de vehículos y premios.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {lista.map((faq, idx) => {
          const estaAbierto = abierto === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card/60 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setAbierto(estaAbierto ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
              >
                <span>{faq.pregunta}</span>
                <ChevronDown
                  className={`size-4 text-primary shrink-0 transition-transform duration-300 ${
                    estaAbierto ? "rotate-180" : ""
                  }`}
                />
              </button>
              {estaAbierto && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200">
                  {faq.respuesta}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cierre: ¿Tenés dudas? + WhatsApp directo a +506 8634-4772 */}
      <div className="mt-14 rounded-3xl border-2 border-emerald-500/40 dark:from-emerald-950/40 from-emerald-50/70 via-card to-card bg-gradient-to-b p-6 sm:p-10 text-center shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 size-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Atención Inmediata por WhatsApp · Costa Rica
          </div>

          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-display uppercase">
            ¿Tenés dudas?
          </h3>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Escribinos directamente a nuestro WhatsApp oficial y te asesoramos en tiempo real con la compra de tus tokens, pagos SINPE Móvil o cualquier consulta sobre el evento.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="xl"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base px-8 py-7 shadow-lg shadow-emerald-900/30 gap-2.5 cursor-pointer transition-all hover:scale-[1.02] rounded-2xl"
            >
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(mensajeWhatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-5 text-white" />
                <span>Chatear por WhatsApp ({displayTel})</span>
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="size-3.5" /> En línea ahora
            </span>
            <span>·</span>
            <span>Línea oficial: <strong className="text-foreground">{displayTel}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
