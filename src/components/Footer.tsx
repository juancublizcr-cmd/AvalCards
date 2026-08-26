import { Link } from "@tanstack/react-router";
import { FileText, Flame, Lock, MessageCircle, Phone, ShieldCheck } from "lucide-react";

export function Footer() {
  const abrirWhatsApp = () => {
    const texto = encodeURIComponent(
      "Hola Aval Motors CR, tengo una consulta sobre el evento promocional.",
    );
    window.open(`https://wa.me/50686092162?text=${texto}`, "_blank");
  };

  return (
    <footer className="border-t border-border/60 bg-card/40 pt-12 pb-8 text-foreground">
      <div className="mx-auto max-w-6xl px-5 grid gap-8 md:grid-cols-4">
        {/* Col 1: Marca e info */}
        <div className="md:col-span-2 space-y-3">
          <Link to="/" className="inline-flex items-center gap-2">
            <Flame className="size-6 text-primary" />
            <span className="font-display text-2xl tracking-widest">
              AVAL <span className="text-primary">MOTORS CR</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Eventos promocionales 100% transparentes auditados con los resultados oficiales de la Lotería Nacional de Costa Rica.
          </p>
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-semibold">
              Razón Social Operativa:
            </span>
            <p className="text-xs font-medium text-foreground">
              Importadora Luxury Scents LTDA.
            </p>
          </div>
        </div>

        {/* Col 2: Enlaces Rápidos */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
            Plataforma
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Adquirir Tokens
              </Link>
            </li>
            <li>
              <Link to="/validar" className="hover:text-primary transition-colors">
                Validar mis Tokens
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-primary transition-colors">
                Checkout de Pago
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal y Soporte */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
            Legal y Soporte
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/terminos" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" /> Términos y Reglamento
              </Link>
            </li>
            <li>
              <Link to="/privacidad" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" /> Políticas de Privacidad
              </Link>
            </li>
            <li>
              <Link to="/reembolso" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" /> Política de Reembolsos
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={abrirWhatsApp}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-500 font-medium"
              >
                <MessageCircle className="size-3.5" /> WhatsApp: 8609-2162
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Aval Motors CR · Importadora Luxury Scents LTDA. · Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <Link to="/terminos" className="hover:text-foreground">Reglamento</Link>
          <Link to="/privacidad" className="hover:text-foreground">Privacidad</Link>
          <Link to="/reembolso" className="hover:text-foreground">Reembolsos</Link>
          <Link to="/admin" className="hover:text-foreground text-[11px] opacity-60">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
