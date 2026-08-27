import { useEffect, useState } from "react";
import { Check, Download, Eye, Loader2, MessageCircle, Share2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generarImagenHistoria, type StoryData } from "@/lib/story-canvas";

export function StoryShareModal({
  abierto,
  alCerrar,
  datos,
}: {
  abierto: boolean;
  alCerrar: () => void;
  datos: StoryData | null;
}) {
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);
  const [descargado, setDescargado] = useState(false);

  useEffect(() => {
    if (!abierto || !datos) {
      setImagenUrl(null);
      return;
    }

    let montado = true;
    const generar = async () => {
      setGenerando(true);
      try {
        const url = await generarImagenHistoria(datos);
        if (montado) setImagenUrl(url);
      } catch (err) {
        console.error(err);
        toast.error("Error al generar imagen de historia");
      } finally {
        if (montado) setGenerando(false);
      }
    };

    void generar();

    return () => {
      montado = false;
    };
  }, [abierto, datos]);

  if (!abierto || !datos) return null;

  const descargar = () => {
    if (!imagenUrl) return;
    const link = document.createElement("a");
    link.download = `Historia-AvalMotors-${datos.nombre.replace(/\s+/g, "_")}.png`;
    link.href = imagenUrl;
    link.click();
    setDescargado(true);
    toast.success("¡Imagen de Historia Descargada!", {
      description: "Súbela a tu Estado de WhatsApp o Historia de Instagram para invitar a tus amigos.",
    });
  };

  const compartirNativo = async () => {
    if (!imagenUrl) return;
    try {
      const blob = await (await fetch(imagenUrl)).blob();
      const file = new File([blob], "mi-historia-avalmotors.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "¡Estoy participando por el Carro 0KM en Aval Motors CR!",
          text: `¡Mae, entra con mi enlace para recibir +1 Token Extra de Regalo en tu compra! https://www.avalcomunity.com/?ref=${datos.telefono.replace(/\D/g, "")}`,
        });
      } else {
        descargar();
      }
    } catch {
      descargar();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-primary/40 bg-zinc-950 p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-foreground">
                Tu Imagen para Estado de WhatsApp / Instagram
              </h3>
              <p className="text-xs text-muted-foreground">
                Resolución vertical 9:16 lista para publicar y ganar referidos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Vista Previa de la Imagen */}
        <div className="relative flex min-h-[380px] max-h-[500px] items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-zinc-900/90 p-2">
          {generando || !imagenUrl ? (
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <span>Generando diseño HD con tus números oficiales...</span>
            </div>
          ) : (
            <img
              src={imagenUrl}
              alt="Vista previa historia"
              className="max-h-[460px] w-auto rounded-xl object-contain shadow-2xl ring-1 ring-primary/40"
            />
          )}
        </div>

        {/* Botones de Acción */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="hero"
            size="lg"
            onClick={descargar}
            disabled={generando || !imagenUrl}
            className="gap-2 font-bold shadow-lg"
          >
            {descargado ? <Check className="size-5" /> : <Download className="size-5" />}
            {descargado ? "¡Descargada!" : "Descargar Imagen HD"}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => { void compartirNativo(); }}
            disabled={generando || !imagenUrl}
            className="gap-2 font-bold border-primary/40 text-foreground hover:bg-primary/10"
          >
            <Share2 className="size-5 text-primary" /> Compartir en Estados
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          💡 <strong>Tip Pro:</strong> Al publicar esta imagen en tu Estado de WhatsApp, tus contactos verán tu enlace y cada compra te sumará bonos y comisiones.
        </p>
      </div>
    </div>
  );
}
