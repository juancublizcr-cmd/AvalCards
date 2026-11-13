import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Flame,
  Globe,
  Image as ImageIcon,
  Layers,
  Link2,
  Maximize2,
  Printer,
  QrCode,
  RefreshCw,
  Share2,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generarFlyerCompletoCanvas,
  descargarFlyerCompleto,
  descargarSoloQrPng,
  type QrFlyerOptions,
} from "@/lib/qr-flyer";

export function QrFlyerSection() {
  const [destino, setDestino] = useState<string>("home");
  const [urlPersonalizada, setUrlPersonalizada] = useState<string>("https://avalcommunity.com");
  const [subtitulo, setSubtitulo] = useState<string>("AVAL COMMUNITY CR");
  const [titulo, setTitulo] = useState<string>("Escaneá el QR");
  const [descripcion, setDescripcion] = useState<string>(
    "Apuntá la cámara del teléfono al código para ingresar a nuestra plataforma y ver los sorteos oficiales."
  );
  const [footerTexto, setFooterTexto] = useState<string>("www.avalcommunity.com");
  const [formato, setFormato] = useState<"afiche" | "historia">("afiche");
  const [telefonoReferido, setTelefonoReferido] = useState<string>("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generando, setGenerando] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  // Calcular URL final según el destino elegido
  const obtenerUrlFinal = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://avalcommunity.com";
    const refParam = telefonoReferido ? `?ref=${telefonoReferido.replace(/\D/g, "")}` : "";

    switch (destino) {
      case "home":
        return `${origin}/${refParam}`;
      case "checkout":
        return `${origin}/checkout${refParam}`;
      case "validar":
        return `${origin}/validar`;
      case "sponsors":
        return `${origin}/sponsors`;
      case "personalizada":
        return urlPersonalizada.trim() || origin;
      default:
        return origin;
    }
  };

  const urlFinal = obtenerUrlFinal();

  // Opciones para el generador
  const opciones: QrFlyerOptions = {
    url: urlFinal,
    subtitulo,
    titulo,
    descripcion,
    footerTexto,
    logoUrl: "/isotipo.png",
    formato,
    colorAcento: "#f97316",
  };

  // Re-generar preview cuando cambien las opciones
  useEffect(() => {
    let activo = true;
    const renderPreview = async () => {
      setGenerando(true);
      try {
        const canvas = await generarFlyerCompletoCanvas(opciones);
        if (activo) {
          setPreviewUrl(canvas.toDataURL("image/png"));
        }
      } catch (err) {
        console.error("Error al generar vista previa:", err);
      } finally {
        if (activo) setGenerando(false);
      }
    };

    const timer = setTimeout(() => {
      void renderPreview();
    }, 250);

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [urlFinal, subtitulo, titulo, descripcion, footerTexto, formato]);

  // Acciones
  const handleDescargarFlyer = async () => {
    try {
      toast.info("Generando imagen en alta definición...");
      await descargarFlyerCompleto(
        opciones,
        `Flyer-QR-Aval-${formato === "historia" ? "Historia" : "Afiche"}.png`
      );
      toast.success("¡Imagen HD descargada!", {
        description: "Lista para enviar por WhatsApp o compartir en redes sociales.",
      });
    } catch {
      toast.error("Error al descargar el flyer");
    }
  };

  const handleDescargarSoloQr = async () => {
    try {
      toast.info("Generando código QR con logo...");
      await descargarSoloQrPng(urlFinal, "/isotipo.png", 1200, "Codigo-QR-Oficial-Aval.png");
      toast.success("¡Código QR oficial descargado (1200x1200px)!", {
        description: "Ideal para imprentas, rotulación, banners o stickers de vinil.",
      });
    } catch {
      toast.error("Error al exportar QR");
    }
  };

  const handleCopiarEnlace = () => {
    void navigator.clipboard.writeText(urlFinal);
    setCopiado(true);
    toast.success("Enlace copiado al portapapeles", { description: urlFinal });
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleImprimir = () => {
    if (!previewUrl) return;
    const ventana = window.open("", "_blank");
    if (!ventana) {
      toast.error("El navegador bloqueó la ventana emergente de impresión.");
      return;
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Imprimir Flyer QR - Aval Community CR</title>
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #ffffff;
            }
            img {
              max-width: 100%;
              max-height: 94vh;
              object-fit: contain;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            }
          </style>
        </head>
        <body>
          <img src="${previewUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    ventana.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <QrCode className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Generador de Afiches & Códigos QR Oficiales
              </h2>
              <p className="text-xs text-muted-foreground">
                Crea imágenes promocionales en alta definición listas para imprimir, plotear o compartir en redes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDescargarSoloQr}
            className="text-xs gap-1.5 h-9"
          >
            <QrCode className="size-3.5 text-muted-foreground" />
            <span>Descargar solo QR (1200px)</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImprimir}
            className="text-xs gap-1.5 h-9"
          >
            <Printer className="size-3.5 text-muted-foreground" />
            <span>Imprimir</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDescargarFlyer}
            className="text-xs gap-1.5 h-9 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold shadow-md"
          >
            <Download className="size-3.5" />
            <span>Descargar Imagen HD</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL IZQUIERDO: CONFIGURACIÓN Y PERSONALIZACIÓN */}
        <div className="lg:col-span-6 space-y-5">
          {/* Tarjeta 1: Enlace Destino */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Link2 className="size-4 text-orange-500" />
              <h3 className="font-bold text-sm text-foreground">1. Destino del Código QR</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">¿A dónde enviará el código al escanearlo?</Label>
                <Select value={destino} onValueChange={setDestino}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Seleccionar página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Portada Oficial (avalcommunity.com)</SelectItem>
                    <SelectItem value="checkout">Página Directa de Compra (/checkout)</SelectItem>
                    <SelectItem value="validar">Consulta y Validación de Tokens (/validar)</SelectItem>
                    <SelectItem value="sponsors">Comercios y Beneficios Aliados (/sponsors)</SelectItem>
                    <SelectItem value="personalizada">Enlace Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {destino === "personalizada" ? (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">URL de destino personalizada</Label>
                  <Input
                    type="url"
                    value={urlPersonalizada}
                    onChange={(e) => setUrlPersonalizada(e.target.value)}
                    placeholder="https://avalcommunity.com/..."
                    className="font-mono text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Asignar Referido / Promotor (Opcional)
                  </Label>
                  <Input
                    type="text"
                    value={telefonoReferido}
                    onChange={(e) => setTelefonoReferido(e.target.value)}
                    placeholder="Ej: 88887777 (asigna ventas al promotor)"
                    className="text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground block">
                    Si agregas un teléfono, las compras hechas desde este QR premiarán automáticamente a ese promotor.
                  </span>
                </div>
              )}

              {/* Visor de URL generada */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-secondary/50 border border-border text-xs">
                <div className="min-w-0 flex items-center gap-2">
                  <Globe className="size-3.5 text-orange-500 shrink-0" />
                  <span className="font-mono text-[11px] text-foreground truncate">{urlFinal}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopiarEnlace}
                  className="h-7 px-2 text-[11px] gap-1 shrink-0"
                >
                  {copiado ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copiado ? "Copiado" : "Copiar"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Formato y Textos del Flyer */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Layers className="size-4 text-orange-500" />
              <h3 className="font-bold text-sm text-foreground">2. Textos & Formato del Afiche</h3>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Formato de Imagen</Label>
                  <Select value={formato} onValueChange={(v) => setFormato(v as "afiche" | "historia")}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afiche">Afiche / Impresión (3:4)</SelectItem>
                      <SelectItem value="historia">Historia / Estado (9:16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Subtítulo Superior</Label>
                  <Input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="AVAL COMMUNITY CR"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Título Principal</Label>
                <Input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Escaneá el QR"
                  className="text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Texto Explicativo</Label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Apuntá la cámara..."
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Texto del Botón Inferior</Label>
                <Input
                  type="text"
                  value={footerTexto}
                  onChange={(e) => setFooterTexto(e.target.value)}
                  placeholder="www.avalcommunity.com"
                  className="text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: VISTA PREVIA EN VIVO */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-orange-500" />
              Vista Previa en Vivo (Calidad Estudio)
            </span>
            {generando && (
              <span className="flex items-center gap-1 text-orange-400">
                <RefreshCw className="size-3 animate-spin" /> Actualizando...
              </span>
            )}
          </div>

          {/* Contenedor del Preview */}
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-border shadow-2xl bg-zinc-950 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Vista Previa Flyer QR"
                className="w-full h-auto object-contain select-none"
              />
            ) : (
              <div className="py-32 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <RefreshCw className="size-8 animate-spin text-orange-500" />
                <span className="text-xs">Generando afiche...</span>
              </div>
            )}
          </div>

          {/* Botones de acción rápida debajo del preview */}
          <div className="w-full max-w-sm flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImprimir}
              className="flex-1 text-xs gap-1.5 h-10 border-border"
            >
              <Printer className="size-3.5" />
              <span>Imprimir</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleDescargarFlyer}
              className="flex-1 text-xs gap-1.5 h-10 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md"
            >
              <Download className="size-3.5" />
              <span>Descargar PNG</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
