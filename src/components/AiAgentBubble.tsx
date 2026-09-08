import { useState, useEffect, useRef } from "react";
import {
  Bot,
  ChevronDown,
  ExternalLink,
  Loader2,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { fetchConfig, type Config, CONFIG_DEFAULT } from "@/lib/admin-store";
import { enviarMensajeIA, type AiMessage } from "@/lib/ai-service";

const CHIPS_PREDETERMINADOS = [
  { label: "💳 Pagar por SINPE", query: "¿Cómo pago mis tokens por SINPE Móvil?" },
  { label: "🎟️ Validar Tokens", query: "¿Dónde consulto mis números de tokens y mi orden?" },
  { label: "⚖️ Legalidad", query: "¿El sorteo es legal en Costa Rica?" },
  { label: "🎁 Ganar Tokens Gratis", query: "¿Cómo funciona el programa de referidos de amigos?" },
];

export function AiAgentBubble() {
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT);
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<AiMessage[]>([]);
  const [inputTexto, setInputTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarBadge, setMostrarBadge] = useState(true);
  const [escuchando, setEscuchando] = useState(false);
  const [reproduciendoIdx, setReproduciendoIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Cargar configuración de la app
  useEffect(() => {
    void fetchConfig().then((c) => {
      setConfig(c);
      if (c.aiSaludo) {
        setMensajes([{ role: "assistant", content: c.aiSaludo }]);
      }
    });
  }, []);

  // Auto-scroll al final de mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes, cargando, abierto]);

  // Si la IA está desactivada por el admin, no renderizar
  if (config.aiActivo === false) {
    return null;
  }

  // 1. Manejo de Micrófono / Reconocimiento de voz (Web Speech API)
  const iniciarDictado = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "El dictado por voz no es compatible con este navegador. Te recomendamos Google Chrome, Edge o Safari."
      );
      return;
    }

    if (escuchando && recognitionRef.current) {
      recognitionRef.current.stop();
      setEscuchando(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "es-CR";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setEscuchando(true);
        toast.info("🎙️ Escuchando... habla ahora", { duration: 3000 });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputTexto(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn("[SpeechRecognition Error]", e);
        setEscuchando(false);
      };

      recognition.onend = () => {
        setEscuchando(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setEscuchando(false);
    }
  };

  // 2. Manejo de Voz de Aval-IA (Text to Speech)
  const reproducirVoz = (texto: string, idx: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Tu navegador no soporta lectura por voz.");
      return;
    }

    if (reproduciendoIdx === idx) {
      window.speechSynthesis.cancel();
      setReproduciendoIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Limpiar markdown del texto para lectura limpia
    const textoLimpio = texto
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~`#]/g, "")
      .replace(/\n/g, " ");

    const utterance = new SpeechSynthesisUtterance(textoLimpio);
    utterance.lang = "es-CR";
    utterance.rate = 1.05;

    const voces = window.speechSynthesis.getVoices();
    const vozEsp = voces.find((v) => v.lang.startsWith("es")) || voces[0];
    if (vozEsp) utterance.voice = vozEsp;

    utterance.onend = () => setReproduciendoIdx(null);
    utterance.onerror = () => setReproduciendoIdx(null);

    setReproduciendoIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const enviar = async (textoAEnviar?: string) => {
    const texto = (textoAEnviar || inputTexto).trim();
    if (!texto || cargando) return;

    if (escuchando && recognitionRef.current) {
      recognitionRef.current.stop();
      setEscuchando(false);
    }

    setInputTexto("");
    const nuevosMensajes: AiMessage[] = [
      ...mensajes,
      { role: "user", content: texto },
    ];
    setMensajes(nuevosMensajes);
    setCargando(true);

    try {
      const respuesta = await enviarMensajeIA(nuevosMensajes, config);
      setMensajes([...nuevosMensajes, { role: "assistant", content: respuesta }]);
    } catch (err: any) {
      setMensajes([
        ...nuevosMensajes,
        {
          role: "assistant",
          content:
            "Disculpa, ocurrió una intermitencia temporal en la conexión. Por favor intenta de nuevo o escríbenos a nuestro WhatsApp oficial.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const reiniciarChat = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setReproduciendoIdx(null);
    setMensajes([
      {
        role: "assistant",
        content:
          config.aiSaludo ||
          "¡Hola! Pura vida 🇨🇷 Soy Aval-IA, tu asistente oficial de Aval Community CR. ¿En qué te puedo asesorar hoy?",
      },
    ]);
  };

  const formatearTexto = (texto: string) => {
    const lineas = texto.split("\n");
    return lineas.map((linea, idx) => {
      const partes = linea.split(/(\[[^\]]+\]\([^)]+\))/g);
      return (
        <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
          {partes.map((parte, pIdx) => {
            const match = parte.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
              const [, linkText, linkUrl] = match;
              const isExternal = linkUrl.startsWith("http");
              return (
                <a
                  key={pIdx}
                  href={linkUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-0.5 font-bold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {linkText}
                  {isExternal && <ExternalLink className="size-3 inline ml-0.5" />}
                </a>
              );
            }
            const boldParts = parte.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((bParte, bIdx) => {
              const bMatch = bParte.match(/\*\*([^*]+)\*\*/);
              if (bMatch) {
                return (
                  <strong key={bIdx} className="font-bold text-foreground">
                    {bMatch[1]}
                  </strong>
                );
              }
              return bParte;
            });
          })}
        </p>
      );
    });
  };

  const proveedorBadge =
    config.aiProveedor === "openai"
      ? "⚡ OpenAI"
      : config.aiProveedor === "deepseek"
      ? "🐋 DeepSeek"
      : config.aiProveedor === "claude"
      ? "🧠 Claude"
      : "✨ Gemini";

  // Mensaje precargado para WhatsApp con contexto
  const mensajeWhatsApp = inputTexto.trim()
    ? encodeURIComponent(`Hola Aval Community CR, estaba en la plataforma con Aval-IA y tengo esta consulta: "${inputTexto.trim()}"`)
    : encodeURIComponent("Hola Aval Community CR, deseo atención directa con un asesor humano sobre mi participación y tokens.");

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* 1. VENTANA DE CHAT EXPANDIDA */}
      {abierto && (
        <div className="mb-3 flex h-[540px] max-h-[82vh] w-[calc(100vw-2rem)] sm:w-[385px] flex-col overflow-hidden rounded-2xl border border-primary/40 bg-card/95 shadow-[var(--shadow-card)] backdrop-blur-xl transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Cabecera */}
          <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/15 via-card to-card px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-background/80 border border-primary/30 p-1 shadow-inner">
                <img
                  src="/isotipo.png"
                  alt="Aval Community CR"
                  className="size-7 object-contain"
                />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    {config.aiNombre || "Aval-IA"}
                  </h4>
                  <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                    {proveedorBadge}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 inline-block" /> En línea · Asesoría Oficial 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reiniciarChat}
                title="Reiniciar chat"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setAbierto(false);
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setReproduciendoIdx(null);
                }}
                title="Cerrar chat"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Lista de Mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs"
          >
            {mensajes.map((msg, index) => {
              const pideHumano =
                msg.role === "assistant" &&
                (msg.content.toLowerCase().includes("whatsapp") ||
                  msg.content.toLowerCase().includes("asesor") ||
                  msg.content.toLowerCase().includes("humano"));

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 w-full ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 text-primary p-0.5 self-end">
                        <img src="/isotipo.png" alt="IA" className="size-5 object-contain" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm relative group ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-medium rounded-br-xs"
                          : "bg-muted/80 text-foreground border border-border/60 rounded-bl-xs"
                      }`}
                    >
                      {formatearTexto(msg.content)}

                      {/* Botón de voz Text-to-Speech para mensajes del asistente */}
                      {msg.role === "assistant" && (
                        <button
                          type="button"
                          onClick={() => reproducirVoz(msg.content, index)}
                          title={reproduciendoIdx === index ? "Detener voz" : "Escuchar respuesta"}
                          className="absolute -bottom-2 -right-2 flex size-5 items-center justify-center rounded-full bg-card border border-border/80 text-muted-foreground hover:text-primary hover:border-primary shadow-xs transition-colors"
                        >
                          {reproduciendoIdx === index ? (
                            <VolumeX className="size-3 text-primary animate-pulse" />
                          ) : (
                            <Volume2 className="size-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border text-foreground self-end">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>

                  {/* Botón interactivo de pase a WhatsApp si la respuesta menciona asesor */}
                  {pideHumano && (
                    <div className="mt-1.5 ml-9">
                      <a
                        href={`https://wa.me/${config.promoWhatsapp || "50686344772"}?text=${encodeURIComponent(
                          "Hola Aval Community CR, estaba consultando en la web con Aval-IA y solicito hablar con un asesor humano."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-[1.02]"
                      >
                        <MessageCircle className="size-3.5" /> Transferir a Asesor en WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Indicador de escritura */}
            {cargando && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 p-0.5">
                  <img src="/isotipo.png" alt="IA" className="size-5 object-contain" />
                </div>
                <div className="rounded-2xl rounded-bl-xs bg-muted/80 px-3 py-2 border border-border/60 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                  <span className="text-[10px] text-muted-foreground ml-1">Aval-IA está escribiendo...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chips de Preguntas Frecuentes */}
          <div className="border-t border-border/40 bg-card/40 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {CHIPS_PREDETERMINADOS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { void enviar(chip.query); }}
                  disabled={cargando}
                  className="shrink-0 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input con Micrófono y Enlace WhatsApp */}
          <div className="border-t border-border/60 bg-card p-2.5">
            {/* Aviso de escucha activa */}
            {escuchando && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-red-500/15 border border-red-500/30 px-2.5 py-1 text-[11px] text-red-400 animate-pulse">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="size-2 rounded-full bg-red-500 animate-ping" />
                  Escuchando tu voz... habla ahora
                </span>
                <button
                  type="button"
                  onClick={iniciarDictado}
                  className="font-bold underline hover:text-red-300"
                >
                  Listo
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void enviar();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                placeholder={escuchando ? "Escuchando tu voz..." : "Escribe o habla por micrófono..."}
                disabled={cargando}
                className="flex-1 rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />

              {/* Botón de Micrófono para hablarle */}
              <button
                type="button"
                onClick={iniciarDictado}
                title={escuchando ? "Detener micrófono" : "Hablar por voz (Micrófono)"}
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  escuchando
                    ? "border-red-500 bg-red-500 text-white animate-pulse"
                    : "border-border bg-secondary hover:border-primary hover:text-primary text-muted-foreground"
                }`}
              >
                {escuchando ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>

              {/* Botón Enviar */}
              <button
                type="submit"
                disabled={!inputTexto.trim() || cargando}
                className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {cargando ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
              <span>¿Prefieres un asesor humano?</span>
              <a
                href={`https://wa.me/${config.promoWhatsapp || "50686344772"}?text=${mensajeWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-500 hover:underline"
              >
                <MessageCircle className="size-3" /> WhatsApp Soporte
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOTÓN DISPARADOR FLOTANTE */}
      <div className="relative flex items-center">
        {!abierto && mostrarBadge && (
          <div className="absolute right-16 hidden sm:flex items-center gap-2 rounded-xl border border-primary/40 bg-card/95 px-3 py-1.5 shadow-[var(--shadow-card)] backdrop-blur-md whitespace-nowrap animate-in fade-in slide-in-from-right-3">
            <span className="text-[11px] font-semibold text-foreground">
              ¿Dudas con tu pago o tokens? <span className="text-primary font-bold">¡Pregúntame!</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarBadge(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setAbierto(!abierto);
            setMostrarBadge(false);
          }}
          className="group relative flex size-13 sm:size-14 items-center justify-center rounded-full border-2 border-primary/60 bg-gradient-to-br from-card via-card to-primary/20 shadow-[var(--shadow-fire)] transition-transform hover:scale-105 active:scale-95"
          aria-label="Abrir asistente virtual"
        >
          {abierto ? (
            <ChevronDown className="size-6 text-foreground transition-transform group-hover:translate-y-0.5" />
          ) : (
            <div className="relative flex items-center justify-center">
              <img
                src="/isotipo.png"
                alt="Asistente IA"
                className="size-8 sm:size-9 object-contain drop-shadow"
              />
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-background animate-ping" />
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
