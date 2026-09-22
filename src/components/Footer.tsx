import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Flame, Lock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchConfig, CONFIG_DEFAULT, type Config } from "@/lib/admin-store";

export function Footer({ config: configProp }: { config?: Config } = {}) {
  const [config, setConfig] = useState<Config>(configProp || CONFIG_DEFAULT);

  useEffect(() => {
    if (configProp) {
      setConfig(configProp);
    } else {
      void fetchConfig().then(setConfig);
    }
  }, [configProp]);

  const rawTel = config.promoWhatsapp || config.telefonoSinpe || "50686344772";
  const cleanDigits = rawTel.replace(/\D/g, "") || "50686344772";
  const whatsappNum = cleanDigits.length === 8 ? `506${cleanDigits}` : cleanDigits;
  const localDigits = whatsappNum.startsWith("506") && whatsappNum.length === 11 ? whatsappNum.slice(3) : (whatsappNum.length === 8 ? whatsappNum : (whatsappNum.startsWith("506") ? whatsappNum.slice(3) : whatsappNum));
  const telFormateado = localDigits.length === 8 ? `${localDigits.slice(0, 4)}-${localDigits.slice(4)}` : localDigits;

  const abrirWhatsApp = (asunto: string) => {
    const texto = encodeURIComponent(`Hola Aval Community CR, tengo una consulta sobre: ${asunto}`);
    window.open(`https://wa.me/${whatsappNum}?text=${texto}`, "_blank");
  };

  const mostrarColumnaPlataforma = config.footerMostrarColumnaPlataforma === true;

  return (
    <footer className="border-t border-border/60 bg-card/40 pt-12 pb-8 text-foreground">
      <div className={`mx-auto max-w-6xl px-5 ${mostrarColumnaPlataforma ? "grid gap-8 md:grid-cols-4" : "flex flex-col md:flex-row md:items-start justify-between gap-8"}`}>
        {/* Col 1: Marca e info */}
        <div className={`${mostrarColumnaPlataforma ? "md:col-span-2" : "max-w-md"} space-y-3`}>
          <Link to="/" className="inline-flex items-center">
            <img src="/logo.png" alt="Aval Community CR" style={{ mixBlendMode: "screen" }} className="h-8 sm:h-9 w-auto object-contain" />
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Eventos promocionales 100% transparentes auditados con los resultados de la Emisión Oficial de la JPS en Costa Rica.
          </p>
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-semibold">
              Razón Social Operativa:
            </span>
            <p className="text-xs font-medium text-foreground">
              LUXX CR CAR WASH
            </p>
          </div>
        </div>

        {/* Col 2: Enlaces Rápidos (Plataforma) */}
        {mostrarColumnaPlataforma && (
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
              {config.footerMostrarImpactoSocial === true && (
                <li>
                  <Link to="/impacto-social" className="dark:text-emerald-400 text-emerald-700 font-semibold hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                    ❤️ Impacto y Bien Social
                  </Link>
                </li>
              )}
              {config.footerMostrarReferidos === true && (
                <li>
                  <Link to="/referidos" className="dark:text-amber-400 text-amber-700 font-semibold hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                    🎁 Programa de Referidos
                  </Link>
                </li>
              )}
              {config.footerMostrarComercios === true && (
                <li>
                  <Link to="/sponsors" className="dark:text-amber-400 text-amber-700 font-semibold hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                    🤝 Comercios & Descuentos
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Col 3: Legal y Soporte */}
        <div className={`space-y-2.5 text-xs ${!mostrarColumnaPlataforma ? "sm:min-w-[220px]" : ""}`}>
          <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
            Legal y Soporte
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            {config.footerMostrarLegal !== false && (
              <>
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
              </>
            )}
            {config.footerMostrarWhatsApp !== false && (
              <li>
                <button
                  type="button"
                  onClick={() => abrirWhatsApp("Soporte General")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-500 font-medium cursor-pointer"
                >
                  <MessageCircle className="size-3.5" /> WhatsApp: {telFormateado}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p suppressHydrationWarning>© 2026 Aval Community CR · LUXX CR CAR WASH · Todos los derechos reservados.</p>
        <div className="flex items-center gap-3 text-[11px]">
          {config.footerMostrarLegal !== false && (
            <>
              <Link to="/terminos" className="hover:text-foreground transition-colors">Reglamento</Link>
              <Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/reembolso" className="hover:text-foreground transition-colors">Reembolsos</Link>
            </>
          )}
          {config.footerMostrarThemeToggle === true && (
            <>
              {config.footerMostrarLegal !== false && <span className="opacity-25">·</span>}
              <ThemeToggle compact />
            </>
          )}
          {config.footerMostrarComerciosEnlace === true && (
            <>
              <span className="opacity-25">·</span>
              <Link
                to="/comercio"
                title="Portal para Comercios y Validación"
                className="opacity-35 hover:opacity-100 hover:text-amber-400 transition-all"
              >
                Comercios
              </Link>
            </>
          )}
          {config.footerMostrarAccesoAdmin === true && (
            <>
              <span className="opacity-25">·</span>
              <Link
                to="/admin"
                title="Consola de Administración"
                className="opacity-35 hover:opacity-100 hover:text-primary transition-all"
              >
                Acceso
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
