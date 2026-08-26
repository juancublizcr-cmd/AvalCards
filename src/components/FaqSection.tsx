import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS_DEFAULT, type FaqItem } from "@/lib/admin-store";

export function FaqSection({ faqs }: { faqs?: FaqItem[] }) {
  const [abierto, setAbierto] = useState<number | null>(0);
  const lista = faqs && faqs.length > 0 ? faqs : FAQS_DEFAULT;

  return (
    <section className="mx-auto max-w-4xl px-5 py-20 border-t border-border/40">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-widest text-primary font-medium">
          <HelpCircle className="size-3.5" /> Preguntas Frecuentes
        </span>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl tracking-wide">
          ¿Tienes dudas? <span className="text-fire">Te explicamos</span>
        </h2>
        <p className="mx-auto mt-2 text-sm text-muted-foreground">
          Todo lo que necesitas saber sobre cómo participar, validar y ser favorecido con Aval Motors CR.
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
                className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold hover:text-primary transition-colors"
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
    </section>
  );
}
