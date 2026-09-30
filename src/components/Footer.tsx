import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Flame, Lock, MessageCircle, ShieldCheck, Youtube } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchConfig, CONFIG_DEFAULT, type Config } from "@/lib/admin-store";

// ── Íconos SVG para redes que no están en lucide ──────────────────────────
export function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function IconTiktok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
}

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

  // Redes sociales — solo las que tienen URL
  const redes = [
    { url: config.footerInstagram, Icon: IconInstagram, label: "Instagram", color: "hover:text-pink-500" },
    { url: config.footerFacebook, Icon: IconFacebook, label: "Facebook", color: "hover:text-blue-500" },
    { url: config.footerTiktok, Icon: IconTiktok, label: "TikTok", color: "hover:text-white" },
    { url: config.footerYoutube, Icon: Youtube, label: "YouTube", color: "hover:text-red-500" },
  ].filter((r) => !!r.url);

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

          {/* Redes Sociales */}
          {redes.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              {redes.map(({ url, Icon, label, color }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className={`text-muted-foreground transition-colors duration-200 ${color}`}
                >
                  <Icon className="size-5" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          )}
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
