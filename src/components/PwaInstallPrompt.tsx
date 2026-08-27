import { useEffect, useState } from "react";
import { Download, PlusSquare, Share, Smartphone, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Config } from "@/lib/admin-store";

export function PwaInstallPrompt({ config }: { config: Config }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [esIos, setEsIos] = useState(false);
  const [mostrarGuiaIos, setMostrarGuiaIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (config.pwaBannerActivo === false) return;

    // Verificar si ya está instalada o si el usuario la cerró recientemente
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    const descartado = localStorage.getItem("aval_pwa_prompt_dismissed");
    if (descartado && Date.now() - Number(descartado) < 1000 * 60 * 60 * 24 * 3) {
      return; // 3 días de cooldown si se cerró
    }

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setEsIos(isIosDevice);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // En iOS o dispositivos sin prompt nativo, mostrar banner tras 6 segundos
    const timer = setTimeout(() => {
      setVisible(true);
    }, 6000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [config.pwaBannerActivo]);

  if (config.pwaBannerActivo === false || !visible) return null;

  const handleInstalar = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
      }
      setDeferredPrompt(null);
    } else if (esIos) {
      setMostrarGuiaIos(true);
    } else {
      // Fallback para navegadores de escritorio o Android sin prompt
      setMostrarGuiaIos(true);
    }
  };

  const handleCerrar = () => {
    setVisible(false);
    try {
      localStorage.setItem("aval_pwa_prompt_dismissed", String(Date.now()));
    } catch {}
  };

  return (
    <>
      {/* Banner Flotante Inferior */}
      <aside
        aria-live="polite"
        aria-label="Instalar aplicación en tu dispositivo"
        className="fixed bottom-4 right-4 z-40 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-500"
      >
        <div className="flex items-center gap-3.5 rounded-2xl border-2 border-primary/50 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md text-foreground">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-600 text-white font-black text-xl shadow-lg">
            🔥
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 font-black text-sm text-foreground">
              <span>Instalar App en tu Celular</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px] px-2 py-0.2">
                Gratis
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              Accede a tus tokens en 1 toque y recibe alertas de ganadores al instante.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="hero"
              size="sm"
              onClick={handleInstalar}
              className="gap-1.5 font-bold shadow-md h-9 text-xs px-3"
            >
              <Download className="size-3.5" /> Instalar
            </Button>
            <button
              type="button"
              onClick={handleCerrar}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Cerrar aviso de instalación"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Modal Guía para iOS / Safari */}
      {mostrarGuiaIos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-primary/40 bg-zinc-950 p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary text-2xl font-black">
              📲
            </div>

            <h3 className="font-extrabold text-lg text-foreground">
              Cómo Instalar en tu Pantalla de Inicio
            </h3>
            <p className="text-xs text-muted-foreground">
              Sigue estos 2 sencillos pasos en tu navegador Safari o Chrome:
            </p>

            <div className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4 text-left text-xs text-foreground">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs shrink-0">1</span>
                <span>Toca el botón <strong>Compartir</strong> <Share className="inline size-4 text-primary ml-1" /> en la barra del navegador.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs shrink-0">2</span>
                <span>Selecciona <strong>"Agregar a pantalla de inicio"</strong> <PlusSquare className="inline size-4 text-emerald-400 ml-1" />.</span>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={() => setMostrarGuiaIos(false)}
              className="w-full font-bold"
            >
              ¡Entendido!
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
