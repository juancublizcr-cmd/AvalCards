import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Printer,
  Download,
  Scale,
  ShieldCheck,
  FileText,
  Sparkles,
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  Edit3,
  Lock,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type Config, type Sorteo, upsertConfig } from "@/lib/admin-store";
import {
  getDefaultMinutaNotarial,
  getDefaultTerminos,
  getDefaultPrivacidad,
  getDefaultReembolso,
} from "@/lib/legal-defaults";

type LegalTab = "notarial" | "terminos" | "privacidad" | "reembolso";

export function ReglamentoNotarialSection({
  config,
  setConfig,
  sorteo,
}: {
  config: Config;
  setConfig?: React.Dispatch<React.SetStateAction<Config>>;
  sorteo: Sorteo;
}) {
  const [tabActiva, setTabActiva] = useState<LegalTab>("notarial");
  const [vistaModo, setVistaModo] = useState<"editor" | "preview">("editor");
  const [copiado, setCopiado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Estados editables para cada documento legal
  const [textoNotarial, setTextoNotarial] = useState("");
  const [textoTerminos, setTextoTerminos] = useState("");
  const [textoPrivacidad, setTextoPrivacidad] = useState("");
  const [textoReembolso, setTextoReembolso] = useState("");

  const razonSocial = config.razonSocial || "Importadora Luxury Scents LTDA.";
  const fechaSorteo = sorteo.fecha || "27 de septiembre de 2026";
  const premioNombre = sorteo.titulo || "Moto de Alta Cilindrada (o Vehículo a Elección)";
  const telSinpe = config.telefonoSinpe || "8634-4772";

  // Inicializar o sincronizar con config
  useEffect(() => {
    setTextoNotarial(
      config.legalMinutaNotarialTexto ||
        getDefaultMinutaNotarial(razonSocial, premioNombre, fechaSorteo),
    );
    setTextoTerminos(
      config.legalTerminosTexto || getDefaultTerminos(razonSocial, telSinpe),
    );
    setTextoPrivacidad(
      config.legalPrivacidadTexto || getDefaultPrivacidad(razonSocial),
    );
    setTextoReembolso(
      config.legalReembolsoTexto || getDefaultReembolso(razonSocial, telSinpe),
    );
  }, [config.legalMinutaNotarialTexto, config.legalTerminosTexto, config.legalPrivacidadTexto, config.legalReembolsoTexto, razonSocial, premioNombre, fechaSorteo, telSinpe]);

  const textoActual =
    tabActiva === "notarial"
      ? textoNotarial
      : tabActiva === "terminos"
      ? textoTerminos
      : tabActiva === "privacidad"
      ? textoPrivacidad
      : textoReembolso;

  const setTextoActual = (nuevo: string) => {
    if (tabActiva === "notarial") setTextoNotarial(nuevo);
    else if (tabActiva === "terminos") setTextoTerminos(nuevo);
    else if (tabActiva === "privacidad") setTextoPrivacidad(nuevo);
    else setTextoReembolso(nuevo);
  };

  const infoTab = {
    notarial: {
      titulo: "Minuta Notarial Protocolizable",
      icono: FileText,
      badge: "PAPEL DE SEGURIDAD · NOTARIO PÚBLICO",
      ruta: null,
      descripcion:
        "Minuta modelo lista para asentar en el tomo matriz de tu Notario Público y emitir testimonio con timbres de ley ante el Registro Nacional.",
    },
    terminos: {
      titulo: "Términos, Condiciones y Reglamento Oficial",
      icono: Scale,
      badge: "PÁGINA PÚBLICA OFICIAL",
      ruta: "/terminos",
      descripcion:
        "Reglamento público que consultan los participantes en la web sobre marco legal, deslinde JPS, métodos de pago y adjudicación.",
    },
    privacidad: {
      titulo: "Políticas de Privacidad y Protección de Datos",
      icono: Lock,
      badge: "LEY N° 8968 · PRODHAB",
      ruta: "/privacidad",
      descripcion:
        "Cláusulas sobre confidencialidad, uso estricto de números celulares y protección de datos bancarios de los compradores.",
    },
    reembolso: {
      titulo: "Política de Reembolsos y Devoluciones",
      icono: RefreshCcw,
      badge: "GARANTÍA COMERCIAL",
      ruta: "/reembolso",
      descripcion:
        "Condiciones claras para reversión de pagos duplicados, plazos de reintegro por SINPE/tarjeta y excepciones.",
    },
  }[tabActiva];

  // Acciones
  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const nuevoConfig: Config = {
        ...config,
        legalMinutaNotarialTexto: textoNotarial,
        legalTerminosTexto: textoTerminos,
        legalPrivacidadTexto: textoPrivacidad,
        legalReembolsoTexto: textoReembolso,
      };

      await upsertConfig(nuevoConfig);
      if (setConfig) {
        setConfig(nuevoConfig);
      }

      toast.success("¡Documento legal guardado con éxito!", {
        description:
          "Los cambios ya están sincronizados y publicados en la plataforma.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Error al guardar documento legal", {
        description: err.message || "Verifica la conexión a la base de datos.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const restablecerOriginal = () => {
    if (tabActiva === "notarial") {
      setTextoNotarial(getDefaultMinutaNotarial(razonSocial, premioNombre, fechaSorteo));
    } else if (tabActiva === "terminos") {
      setTextoTerminos(getDefaultTerminos(razonSocial, telSinpe));
    } else if (tabActiva === "privacidad") {
      setTextoPrivacidad(getDefaultPrivacidad(razonSocial));
    } else {
      setTextoReembolso(getDefaultReembolso(razonSocial, telSinpe));
    }
    toast.info("Texto restablecido a la versión oficial predeterminada", {
      description: "Recuerda presionar 'Guardar Cambios' para aplicar.",
    });
  };

  const copiarTexto = () => {
    void navigator.clipboard.writeText(textoActual);
    setCopiado(true);
    toast.success("¡Texto copiado al portapapeles!", {
      description: "Puedes pegarlo en Word, WhatsApp o enviarlo por correo.",
    });
    setTimeout(() => setCopiado(false), 3000);
  };

  const imprimirTexto = () => {
    window.print();
  };

  const palabras = textoActual.trim() ? textoActual.trim().split(/\s+/).length : 0;
  const caracteres = textoActual.length;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Scale className="size-3.5" /> MARCO LEGAL Y REGLAMENTOS OFICIALES
          </div>
          <h2 className="text-2xl font-black text-foreground mt-2 flex items-center gap-2">
            📜 Protocolo Notarial y Documentos Legales
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Edita, personaliza y mantén al día los reglamentos oficiales, políticas de privacidad, términos comerciales y la minuta notarial de tu evento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={guardarCambios}
            disabled={guardando}
            className="gap-2 font-black shadow-lg"
          >
            <Save className="size-4" />
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copiarTexto}
            className="gap-2 border-primary/40 text-primary hover:bg-primary/10 font-bold"
          >
            {copiado ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            {copiado ? "¡Copiado!" : "Copiar Texto"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={imprimirTexto}
            className="gap-2 border-border"
          >
            <Printer className="size-4" /> Imprimir
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-border"
          >
            <a href="/ESTRUCTURA_LEGAL_Y_COMERCIAL_CR.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="size-4" /> PDF Estructura
            </a>
          </Button>
        </div>
      </div>

      {/* 4 Pestañas de Documentos Legales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-secondary/40 border border-border">
        <button
          type="button"
          onClick={() => setTabActiva("notarial")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
            tabActiva === "notarial"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
        >
          <FileText className="size-4 text-amber-400 shrink-0" />
          <span className="truncate">Minuta Notarial</span>
        </button>

        <button
          type="button"
          onClick={() => setTabActiva("terminos")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
            tabActiva === "terminos"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
        >
          <Scale className="size-4 text-primary shrink-0" />
          <span className="truncate">Términos y Reglamento</span>
        </button>

        <button
          type="button"
          onClick={() => setTabActiva("privacidad")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
            tabActiva === "privacidad"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
        >
          <Lock className="size-4 text-sky-400 shrink-0" />
          <span className="truncate">Privacidad de Datos</span>
        </button>

        <button
          type="button"
          onClick={() => setTabActiva("reembolso")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
            tabActiva === "reembolso"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
        >
          <RefreshCcw className="size-4 text-emerald-400 shrink-0" />
          <span className="truncate">Reembolsos</span>
        </button>
      </div>

      {/* Tarjeta de Información del Documento Seleccionado */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase">
              {infoTab.badge}
            </span>
            {infoTab.ruta && (
              <span className="text-xs font-mono text-muted-foreground">
                Publicado en: <strong className="text-foreground">{infoTab.ruta}</strong>
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <infoTab.icono className="size-4 text-primary" /> {infoTab.titulo}
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {infoTab.descripcion}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {infoTab.ruta && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 border-border text-xs font-semibold hover:text-primary"
            >
              <a href={infoTab.ruta} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" /> Ver en vivo
              </a>
            </Button>
          )}

          {/* Selector Editor vs Vista Previa */}
          <div className="flex rounded-xl bg-secondary/70 p-1 border border-border text-xs">
            <button
              type="button"
              onClick={() => setVistaModo("editor")}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                vistaModo === "editor"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="size-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setVistaModo("preview")}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                vistaModo === "preview"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="size-3.5" /> Vista Previa
            </button>
          </div>
        </div>
      </div>

      {/* Editor / Vista Previa Principal */}
      <div className="rounded-2xl border-2 border-border bg-zinc-950 p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-amber-400 font-bold">
            <infoTab.icono className="size-4" /> {infoTab.titulo.toUpperCase()}
          </div>
          <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
            <span>{palabras} palabras</span>
            <span>·</span>
            <span>{caracteres} caracteres</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Listo para editar
            </span>
          </div>
        </div>

        {vistaModo === "editor" ? (
          <div className="space-y-3">
            <textarea
              value={textoActual}
              onChange={(e) => setTextoActual(e.target.value)}
              rows={20}
              placeholder="Escribe o modifica las cláusulas del documento aquí..."
              className="w-full rounded-xl bg-black/85 border border-zinc-800 p-4 font-mono text-xs sm:text-sm text-zinc-200 leading-relaxed focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 selection:bg-amber-500 selection:text-black resize-y min-h-[480px]"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <span>
                💡 Puedes usar formato tipo Markdown (<code>### Título</code>, <code>**negrita**</code>, <code>- viñetas</code>).
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={restablecerOriginal}
                className="text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 gap-1.5 h-8"
              >
                <RotateCcw className="size-3.5" /> Restablecer texto original oficial
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-black/85 border border-zinc-800 p-6 text-zinc-200 text-sm leading-relaxed max-h-[560px] overflow-y-auto space-y-4">
            {textoActual.split("\n\n").map((parrafo, idx) => {
              const trimmed = parrafo.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={idx} className="text-base font-bold text-amber-400 pt-2 border-b border-zinc-800 pb-1">
                    {trimmed.replace("### ", "")}
                  </h4>
                );
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={idx} className="border-l-2 border-amber-500 pl-3 py-1 italic text-amber-200/90 text-xs bg-amber-950/20 rounded-r-lg">
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
                const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-xs text-zinc-300">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        )}

        {/* Barra de Acciones Inferior */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-850">
          <div className="text-xs text-zinc-400 text-center sm:text-left">
            <span>Sincronización en vivo con la base de datos de Aval Community CR.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copiarTexto}
              className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-bold text-xs"
            >
              {copiado ? "✓ Texto Copiado" : "📋 Copiar Texto"}
            </Button>
            <Button
              type="button"
              variant="hero"
              size="sm"
              onClick={guardarCambios}
              disabled={guardando}
              className="font-bold text-xs shadow-md gap-1.5"
            >
              <Save className="size-3.5" />
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
