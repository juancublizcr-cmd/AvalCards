import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWA() {
  const [promptEvt, setPromptEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No mostrar si ya está instalada como standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem("pwa_dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const instalar = async () => {
    if (!promptEvt) return;
    await promptEvt.prompt();
    const { outcome } = await promptEvt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setPromptEvt(null);
  };

  const descartar = () => {
    sessionStorage.setItem("pwa_dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar aplicación"
      className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-primary/40 bg-card px-4 py-3 shadow-[var(--shadow-fire)] sm:left-auto sm:right-4 sm:translate-x-0"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
        <Download className="size-5 text-primary" />
      </div>
      <div className="flex-1 text-sm">
        <p className="font-semibold">Instala Aval Motors CR</p>
        <p className="text-xs text-muted-foreground">Accede rápido desde tu pantalla de inicio</p>
      </div>
      <button
        onClick={instalar}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Instalar
      </button>
      <button
        onClick={descartar}
        aria-label="Cerrar"
        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
