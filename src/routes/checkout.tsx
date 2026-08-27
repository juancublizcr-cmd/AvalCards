import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Flame,
  HelpCircle,
  Lock,
  MessageCircle,
  QrCode,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crearOrden, fetchOrdenesPorTelefono, leerSeleccion, limpiarSeleccion, type Seleccion } from "@/lib/orders";
import { fetchConfig, fetchSorteo, type Config, type Sorteo, CONFIG_DEFAULT, SORTEO_DEFAULT } from "@/lib/admin-store";
import { Footer } from "@/components/Footer";
import { calcularGirosPorTokens, guardarGiros } from "@/lib/giros-store";
import { JuegosExpressModal } from "@/components/JuegosExpressModal";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout de Pago | Aval Motors CR" },
      {
        name: "description",
        content:
          "Completa tus datos y paga con SINPE Móvil, Tarjeta de Débito/Crédito (TiloPay) o Criptomonedas (USDT).",
      },
    ],
  }),
  component: Checkout,
});

type MetodoPago = "sinpe" | "tarjeta" | "paypal" | "applepay" | "googlepay" | "crypto";

const TIPO_CAMBIO_USD = 515; // 1 USD = ₡515 CRC

const esquema = z.object({
  nombre: z.string().trim().min(3, "Ingresa tu nombre completo (mínimo 3 caracteres)").max(100),
  telefono: z
    .string()
    .trim()
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length === 8 || (digits.length === 11 && digits.startsWith("506"));
    }, "Formato de celular: 8888-8888 o 88888888"),
  email: z.string().trim().email("Ingresa un correo electrónico válido").max(255),
});

function Checkout() {
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT);
  const [sorteo, setSorteo] = useState<Sorteo>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aval_sorteo_config_extra");
        if (raw) {
          const extra = JSON.parse(raw);
          if (extra.raspaConfig) return { ...SORTEO_DEFAULT, raspaConfig: extra.raspaConfig };
        }
      } catch {}
    }
    return SORTEO_DEFAULT;
  });
  const [metodo, setMetodo] = useState<MetodoPago>("sinpe");
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" });

  // Datos Tarjeta TiloPay
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    titular: "",
    expira: "",
    cvv: "",
  });

  // Datos Crypto
  const [cryptoHash, setCryptoHash] = useState("");

  type Errores = { nombre?: string; telefono?: string; email?: string; archivo?: string; tarjeta?: string };
  const [errores, setErrores] = useState<Errores>({});
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [ordenCreadaId, setOrdenCreadaId] = useState<string>("");
  const [ordenAprobadaDirecta, setOrdenAprobadaDirecta] = useState(false);
  const [copiadoSinpe, setCopiadoSinpe] = useState(false);
  const [copiadoCrypto, setCopiadoCrypto] = useState(false);
  const [copiadoRef, setCopiadoRef] = useState(false);
  const [referidoPor, setReferidoPor] = useState<string>("");
  const [esUsuarioExistente, setEsUsuarioExistente] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [openJuego, setOpenJuego] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSeleccion(leerSeleccion());
    const ref = localStorage.getItem("aval_ref") || "";
    if (ref) setReferidoPor(ref);

    void fetchConfig().then((c) => {
      setConfig(c);
      if (!c.sinpeActivo && c.tilopayActivo) setMetodo("tarjeta");
      else if (!c.sinpeActivo && !c.tilopayActivo && c.cryptoActivo) setMetodo("crypto");
    }).catch(() => {});

    void fetchSorteo().then((s) => {
      if (s) setSorteo(s);
    }).catch(() => {});
  }, []);

  // Detectar si el teléfono ingresado ya tiene órdenes previas (ya compró)
  useEffect(() => {
    const clean = form.telefono.replace(/\D/g, "");
    if (clean.length >= 8) {
      void fetchOrdenesPorTelefono(clean).then((res) => {
        setEsUsuarioExistente(res.length > 0);
      }).catch(() => {});
    } else {
      setEsUsuarioExistente(false);
    }
  }, [form.telefono]);

  const copiarEnlaceReferido = () => {
    const tel = form.telefono.replace(/\D/g, "") || ordenCreadaId || "amigo";
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://avalmotors.cr"}/?ref=${tel}`;
    void navigator.clipboard.writeText(url);
    setCopiadoRef(true);
    toast.success("Enlace de referido copiado", {
      description: "¡Pégalo en tus grupos de WhatsApp o redes para ganar Tokens!",
    });
    setTimeout(() => setCopiadoRef(false), 2500);
  };

  const copiarSinpe = () => {
    const tel = config.telefonoSinpe.replace(/\D/g, "");
    void navigator.clipboard.writeText(tel);
    setCopiadoSinpe(true);
    toast.success("Número SINPE copiado", {
      description: `${config.telefonoSinpe} copiado al portapapeles.`,
    });
    setTimeout(() => setCopiadoSinpe(false), 2500);
  };

  const copiarCrypto = () => {
    void navigator.clipboard.writeText(config.cryptoWalletUsdt);
    setCopiadoCrypto(true);
    toast.success("Dirección de billetera copiada");
    setTimeout(() => setCopiadoCrypto(false), 2500);
  };

  const elegirArchivo = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrores((e) => ({ ...e, archivo: "El comprobante debe ser una imagen" }));
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrores((e) => ({ ...e, archivo: "La imagen no debe superar 5 MB" }));
      return;
    }
    setErrores((e) => ({ ...e, archivo: "" }));
    setArchivo(f);
    setPreview(URL.createObjectURL(f));
  };

  const montoUsdt = seleccion ? (seleccion.precio / TIPO_CAMBIO_USD).toFixed(2) : "0.00";

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = esquema.safeParse(form);
    const nuevos: Errores = {};
    if (!res.success) {
      for (const i of res.error.issues) nuevos[i.path[0] as keyof Errores] = i.message;
    }

    if (metodo === "sinpe" && !archivo) {
      nuevos["archivo"] = "Adjunta la captura de tu SINPE Móvil";
    }

    if (metodo === "tarjeta") {
      const numLimpio = tarjeta.numero.replace(/\s/g, "");
      if (numLimpio.length < 15) nuevos["tarjeta"] = "Ingresa un número de tarjeta válido";
      else if (tarjeta.cvv.length < 3) nuevos["tarjeta"] = "CVV inválido";
      else if (!tarjeta.expira.includes("/")) nuevos["tarjeta"] = "Fecha de expiración (MM/AA)";
    }

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      const primerError = Object.values(nuevos)[0];
      toast.error("Por favor completa los datos requeridos", {
        description: primerError,
      });
      const primerKey = Object.keys(nuevos)[0];
      const el = document.getElementById(primerKey) || document.getElementById(`tarjeta-${primerKey}`) || document.getElementById("archivo-input");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return;
    }

    setEnviando(true);
    const nuevoId = `SG-${Math.floor(1000 + Math.random() * 9000)}`;

    // Si no había selección previa en sessionStorage (ej. acceso directo a /checkout), generar 4 tokens por defecto
    const cantidadTokens = seleccion?.cantidad && seleccion.cantidad > 0 ? seleccion.cantidad : 4;
    const precioFinal = seleccion?.precio && seleccion.precio > 0 ? seleccion.precio : 4000;
    const numerosFinales = seleccion?.numeros && seleccion.numeros.length > 0
      ? seleccion.numeros
      : Array.from({ length: cantidadTokens }, () => String(Math.floor(10000 + Math.random() * 90000)));

    // Si paga con Tarjeta o Crypto, la aprobación es inmediata o registrada con ID
    const esPagoInstantaneo = metodo === "tarjeta";
    const estadoInicial = esPagoInstantaneo ? "aprobada" : "pendiente";
    const transaccionId =
      metodo === "tarjeta"
        ? `TILO-${Date.now()}`
        : metodo === "crypto"
          ? cryptoHash.trim() || `TX-${Date.now()}`
          : "";

    const juegosActivos = Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno";
    const girosBonus = juegosActivos ? calcularGirosPorTokens(cantidadTokens) : 0;

    // Verificar si el usuario ya es existente o intenta auto-referirse
    const telLimpio = form.telefono.replace(/\D/g, "");
    const refLimpio = (referidoPor || "").replace(/\D/g, "");
    const esAutoReferido = Boolean(refLimpio && telLimpio && telLimpio === refLimpio);

    let esUsuarioConCompras = esUsuarioExistente;
    if (!esUsuarioConCompras && telLimpio.length >= 8) {
      try {
        const previas = await fetchOrdenesPorTelefono(telLimpio);
        if (previas.length > 0) esUsuarioConCompras = true;
      } catch {}
    }

    const puedeSerReferido = Boolean(referidoPor) && !esAutoReferido && !esUsuarioConCompras;
    const referidoFinal = puedeSerReferido ? referidoPor : undefined;

    try {
      await crearOrden(
        {
          id: nuevoId,
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          cantidad: cantidadTokens,
          precio: precioFinal,
          numeros: numerosFinales,
          estado: estadoInicial,
          fecha: new Date().toISOString(),
          metodo_pago: metodo,
          transaccion_id: transaccionId,
          supertoken: seleccion?.supertoken ?? false,
          monto_supertoken: seleccion?.monto_supertoken ?? 0,
          referido_por: referidoFinal,
        },
        archivo,
      );

      if (juegosActivos && girosBonus > 0) {
        guardarGiros({
          giros: girosBonus,
          ordenId: nuevoId,
          telefono: form.telefono,
          nombre: form.nombre,
          tipo: "bono_tokens",
        });
      }

      setOrdenCreadaId(nuevoId);
      setOrdenAprobadaDirecta(esPagoInstantaneo);
      limpiarSeleccion();
      setExito(true);

      if (esPagoInstantaneo) {
        toast.success("¡Pago procesado con éxito!", {
          description: juegosActivos
            ? `¡Tu compra incluye ${girosBonus} Giros GRATIS en la Ruleta/Raspa!`
            : "¡Tus tokens han quedado registrados oficialmente!",
        });
      } else {
        toast.success("¡Orden recibida!", {
          description: juegosActivos
            ? `¡Tus tokens quedaron reservados y tienes ${girosBonus} Giros GRATIS listos!`
            : "¡Tus tokens quedaron reservados mientras validamos tu comprobante!",
        });
      }
    } catch (err) {
      toast.error("Error al procesar el pago", {
        description: "No se pudo registrar tu orden. Verifica tu conexión e intenta de nuevo.",
      });
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const compartirWhatsApp = () => {
    const telLimpio = form.telefono.replace(/\D/g, "") || ordenCreadaId || "";
    const urlReferido = `${typeof window !== "undefined" ? window.location.origin : "https://avalmotors.cr"}/?ref=${telLimpio}`;
    const texto = encodeURIComponent(
      `¡Mae, estoy participando por el Mercedes Benz 2026 en Aval Motors CR! 🚗💨\n\nEntra con mi enlace exclusivo y recibe +1 Token Extra GRATIS en tu compra:\n${urlReferido}`
    );
    window.open(`https://api.whatsapp.com/send?text=${texto}`, "_blank");
  };

  const abrirSoporteWhatsApp = () => {
    const texto = encodeURIComponent(
      `Hola Aval Motors CR, tengo una consulta sobre mi pago por ${metodo === "sinpe" ? "SINPE" : metodo === "tarjeta" ? "Tarjeta TiloPay" : "Cripto USDT"}.`,
    );
    const tel = config.telefonoSinpe.replace(/\D/g, "");
    window.open(`https://wa.me/506${tel}?text=${texto}`, "_blank");
  };

  if (exito) {
    return (
      <main className="min-h-screen bg-background px-5 py-16 text-foreground flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/20 text-success">
            <CheckCircle2 className="size-10" />
          </div>
          <span className="mt-4 inline-block font-mono text-xs text-muted-foreground font-bold">
            ORDEN #{ordenCreadaId}
          </span>
          <h1 className="font-display text-4xl tracking-wide">
            {ordenAprobadaDirecta ? "¡Pago Confirmado al Instante!" : "¡Comprobante Recibido!"}
          </h1>

          {seleccion?.supertoken && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/15 px-4 py-1 text-xs font-bold text-amber-500 shadow-sm">
              <Crown className="size-4" /> SuperToken Activo · Califica para 1° Lugar + $6,000 USD Cash
            </div>
          )}

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {ordenAprobadaDirecta ? (
              <span>
                Tu pago con tarjeta se confirmó automáticamente. Tus Tokens ya están 100% validados para el evento oficial.
              </span>
            ) : (
              <span>
                Tus {seleccion?.cantidad ?? 0} Tokens quedaron{" "}
                <strong className="text-foreground">reservados</strong> mientras validamos tu comprobante.
              </span>
            )}
          </p>

          {seleccion && (
            <div className="mt-6 grid grid-cols-4 gap-2">
              {seleccion.numeros.map((n, i) => (
                <span
                  key={`${n}-${i}`}
                  className={`rounded-md border py-1.5 font-mono text-xs font-bold ${
                    seleccion.supertoken
                      ? "border-amber-400/60 bg-amber-500/15 text-amber-400"
                      : "border-primary/30 bg-secondary/50 text-primary"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          )}

          {/* BONO DE GIROS GRATIS MODELO HÍBRIDO (Solo si los juegos están activos en Admin) */}
          {Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno" && (
            <div className="mt-6 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 p-4 text-center space-y-2 shadow-md">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-400">
                <Sparkles className="size-3.5" /> ¡BONO DE JUEGO EXPRESS DESBLOQUEADO!
              </div>
              <h3 className="font-display text-xl text-white font-bold">
                Tu compra incluye {calcularGirosPorTokens(seleccion?.cantidad ?? 4)} Giros GRATIS
              </h3>
              <p className="text-xs text-zinc-300">
                ¡Puedes ganar hasta ₡100,000 en SINPE Móvil o más tokens al instante!
              </p>
              <Button
                variant="hero"
                size="lg"
                className="w-full gap-2 font-bold shadow-[var(--shadow-fire)] cursor-pointer text-sm py-5"
                onClick={() => setOpenJuego(true)}
              >
                🎡 ¡JUGAR MIS {calcularGirosPorTokens(seleccion?.cantidad ?? 4)} GIROS GRATIS AHORA!
              </Button>
            </div>
          )}

          {/* PROGRAMA DE REFERIDOS - GANA TOKENS GRATIS */}
          <div className="mt-6 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-background to-emerald-950/30 p-5 text-left space-y-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-base shrink-0">
                🎁
              </span>
              <div>
                <h4 className="font-bold text-sm text-white">¡Gana Tokens GRATIS con tu enlace!</h4>
                <p className="text-[11px] text-emerald-400/90 leading-tight">
                  Tus amigos reciben <strong>+1 Token Extra</strong> y tú ganas <strong>1 Token de Regalo</strong> por cada compra.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-black/70 border border-emerald-500/30 p-2 text-xs font-mono">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : "https://avalmotors.cr"}/?ref=${form.telefono.replace(/\D/g, "") || ordenCreadaId}`}
                className="bg-transparent text-zinc-300 w-full outline-none truncate text-[11px]"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={copiarEnlaceReferido}
                className="shrink-0 h-7 px-2.5 text-xs text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20"
              >
                {copiadoRef ? "¡Copiado!" : "Copiar"}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={compartirWhatsApp}
              className="w-full gap-2 bg-emerald-500 text-black font-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] py-4 text-xs sm:text-sm cursor-pointer"
            >
              <MessageCircle className="size-4 fill-black text-black" /> ¡Compartir mi Enlace en WhatsApp!
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 text-emerald-500 hover:text-emerald-400"
              onClick={compartirWhatsApp}
            >
              <Share2 className="size-4" /> Compartir en WhatsApp
            </Button>
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={() => void navigate({ to: "/validar" })}
            >
              Ver mis Tokens y Comprobante
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => void navigate({ to: "/" })}
            >
              Volver al inicio
            </Button>
          </div>
        </div>

        <JuegosExpressModal
          open={openJuego}
          onOpenChange={setOpenJuego}
          config={sorteo.raspaConfig}
          telefonoSoporte={config.telefonoSinpe}
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="size-5 text-primary" />
            <span className="font-display text-xl tracking-widest">
              AVAL <span className="text-primary">MOTORS CR</span>
            </span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-4xl tracking-wide">Finaliza tu compra</h1>
          {seleccion?.supertoken && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-500">
              <Crown className="size-3.5" /> SuperToken (+$6,000 USD)
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {seleccion
            ? `Paquete de ${seleccion.cantidad} Tokens ${seleccion.supertoken ? "(con SuperToken)" : ""} · ₡${seleccion.precio.toLocaleString("es-CR")} (aprox. $${montoUsdt} USD)`
            : "No hay un paquete seleccionado. Vuelve al inicio y elige uno."}
        </p>

        <form onSubmit={(e) => { void enviar(e); }} className="mt-8 space-y-8" noValidate>
          {referidoPor && !esUsuarioExistente && form.telefono.replace(/\D/g, "") !== (referidoPor || "").replace(/\D/g, "") && (
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 via-green-500/15 to-emerald-500/20 p-4 flex items-center gap-3 text-xs sm:text-sm text-emerald-400 font-semibold shadow-md">
              <Sparkles className="size-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block text-sm">🎁 ¡Enlace de Amigo Aplicado! (Ref: {referidoPor})</span>
                <span>Por acceder con invitación exclusiva en tu primera compra, recibirás <strong>+1 Token Extra GRATIS</strong> de regalo.</span>
              </div>
            </div>
          )}

          {esUsuarioExistente && (
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 flex items-center gap-3 text-xs sm:text-sm text-primary shadow-xs">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <div>
                <span className="font-bold text-white block text-sm">✓ Participante Registrado Activo ({form.telefono})</span>
                <span>Ya formas parte de la plataforma y tienes tu propio enlace de referidos. ¡Esta compra se acumula a tu cuenta oficial!</span>
              </div>
            </div>
          )}

          {/* 1. INFORMACIÓN DE CONTACTO */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
              Información del Participante
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="nombre">Nombre completo (como en tu cédula)</Label>
                <Input
                  id="nombre"
                  maxLength={100}
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ana Rodríguez Mora"
                  className="mt-1.5"
                />
                {errores["nombre"] && <p className="mt-1 text-xs text-destructive">{errores["nombre"]}</p>}
              </div>
              <div>
                <Label htmlFor="telefono">Número de teléfono (celular)</Label>
                <Input
                  id="telefono"
                  inputMode="tel"
                  maxLength={9}
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="8888-8888"
                  className="mt-1.5"
                />
                {errores["telefono"] && (
                  <p className="mt-1 text-xs text-destructive">{errores["telefono"]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ana@correo.cr"
                  className="mt-1.5"
                />
                {errores["email"] && <p className="mt-1 text-xs text-destructive">{errores["email"]}</p>}
              </div>
            </div>
          </section>

          {/* 2. SELECTOR DE MÉTODO DE PAGO */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">2</span>
              Selecciona tu Método de Pago
            </h2>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {config.sinpeActivo && (
                <button
                  type="button"
                  onClick={() => setMetodo("sinpe")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${
                    metodo === "sinpe"
                      ? "border-primary bg-primary/10 shadow-sm text-primary ring-1 ring-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Smartphone className="size-6 text-emerald-400" />
                  <div className="font-bold text-sm">SINPE Móvil</div>
                  <span className="text-[10px] text-muted-foreground">Costa Rica</span>
                </button>
              )}

              {config.tilopayActivo && (
                <button
                  type="button"
                  onClick={() => setMetodo("tarjeta")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${
                    metodo === "tarjeta"
                      ? "border-primary bg-primary/10 shadow-sm text-primary ring-1 ring-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <CreditCard className="size-6 text-primary" />
                  <div className="font-bold text-sm">Tarjetas (TiloPay)</div>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Zap className="size-3" /> Aprobación Inmediata
                  </span>
                </button>
              )}

              {(config.paypalActivo ?? true) && (
                <button
                  type="button"
                  onClick={() => setMetodo("paypal")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${
                    metodo === "paypal"
                      ? "border-sky-400 bg-sky-500/10 shadow-sm text-sky-400 ring-1 ring-sky-400"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-sky-400/40"
                  }`}
                >
                  <span className="text-2xl">🅿️</span>
                  <div className="font-bold text-sm">PayPal</div>
                  <span className="text-[10px] text-sky-400">Internacional / USD</span>
                </button>
              )}

              {(config.applePayActivo ?? true) && (
                <button
                  type="button"
                  onClick={() => setMetodo("applepay")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${
                    metodo === "applepay"
                      ? "border-zinc-300 bg-zinc-800 shadow-sm text-white ring-1 ring-zinc-300"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-zinc-400/40"
                  }`}
                >
                  <span className="text-2xl">🍏</span>
                  <div className="font-bold text-sm">Apple Pay</div>
                  <span className="text-[10px] text-zinc-300">Touch ID / Face ID</span>
                </button>
              )}

              {(config.googlePayActivo ?? true) && (
                <button
                  type="button"
                  onClick={() => setMetodo("googlepay")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${
                    metodo === "googlepay"
                      ? "border-amber-400 bg-amber-500/10 shadow-sm text-amber-400 ring-1 ring-amber-400"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-amber-400/40"
                  }`}
                >
                  <span className="text-2xl">🌐</span>
                  <div className="font-bold text-sm">Google Pay</div>
                  <span className="text-[10px] text-amber-400">1 Clic Express</span>
                </button>
              )}

              {config.cryptoActivo && (
                <button
                  type="button"
                  onClick={() => setMetodo("crypto")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${
                    metodo === "crypto"
                      ? "border-amber-400 bg-amber-500/10 shadow-sm text-amber-400 ring-1 ring-amber-400"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-amber-400/40"
                  }`}
                >
                  <Coins className="size-6 text-amber-400" />
                  <div className="font-bold text-sm">Cripto (USDT)</div>
                  <span className="text-[10px] text-muted-foreground">{config.cryptoRed} / Binance</span>
                </button>
              )}
            </div>

            {/* A. BLOQUE SINPE MÓVIL */}
            {metodo === "sinpe" && (
              <div className="mt-4 rounded-xl border-2 border-primary/50 bg-secondary/50 p-5 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary flex items-center gap-2">
                    <Smartphone className="size-4" /> Transferencia SINPE Móvil
                  </span>
                  <button
                    type="button"
                    onClick={abrirSoporteWhatsApp}
                    className="text-xs text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1"
                  >
                    <MessageCircle className="size-3.5" /> Ayuda WhatsApp
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Transfiere a nombre de <strong className="text-foreground">{config.razonSocial}</strong>:
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/40 bg-card p-4">
                  <div>
                    <div className="text-[11px] text-muted-foreground">Número de teléfono SINPE</div>
                    <div className="font-mono text-2xl font-bold text-primary">{config.telefonoSinpe}</div>
                  </div>
                  <Button
                    type="button"
                    variant={copiadoSinpe ? "success" : "outline"}
                    size="sm"
                    onClick={copiarSinpe}
                    className="gap-2"
                  >
                    {copiadoSinpe ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copiadoSinpe ? "¡Copiado!" : "Copiar"}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="archivo-input" className="text-xs">Adjuntar captura del comprobante SINPE</Label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
                    onDragLeave={() => setArrastrando(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setArrastrando(false);
                      const f = e.dataTransfer.files[0];
                      if (f) elegirArchivo(f);
                    }}
                    onClick={() => inputFile.current?.click()}
                    className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      arrastrando
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-secondary/40"
                    }`}
                  >
                    <Upload className="size-8 text-muted-foreground" />
                    <p className="mt-2 text-xs font-medium">
                      {archivo ? (
                        <span className="text-primary font-bold">{archivo.name}</span>
                      ) : (
                        "Arrastra aquí tu comprobante o haz clic para seleccionarlo"
                      )}
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1">Formatos JPG, PNG o WebP (máx. 5MB)</span>
                  </div>
                  <input
                    ref={inputFile}
                    id="archivo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) elegirArchivo(f);
                    }}
                  />
                  {errores["archivo"] && <p className="mt-1 text-xs text-destructive">{errores["archivo"]}</p>}
                </div>
              </div>
            )}

            {/* B. BLOQUE TARJETA TILOPAY */}
            {metodo === "tarjeta" && (
              <div className="mt-4 rounded-xl border-2 border-primary/50 bg-secondary/40 p-5 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary flex items-center gap-2">
                    <ShieldCheck className="size-4" /> Pasarela Segura TiloPay · Encriptación 256-bit
                  </span>
                  <span className="rounded-full bg-emerald-500/15 text-emerald-500 font-bold px-2 py-0.5 text-[10px]">
                    Validación Inmediata
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="tarjeta-num">Número de Tarjeta (Visa / Mastercard / AMEX)</Label>
                    <Input
                      id="tarjeta-num"
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={tarjeta.numero}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setTarjeta({ ...tarjeta, numero: v });
                      }}
                      className="mt-1 font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tarjeta-exp">Vencimiento (MM/AA)</Label>
                    <Input
                      id="tarjeta-exp"
                      placeholder="12/28"
                      maxLength={5}
                      value={tarjeta.expira}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                        setTarjeta({ ...tarjeta, expira: v });
                      }}
                      className="mt-1 font-mono text-center"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tarjeta-cvv">Código de Seguridad (CVV)</Label>
                    <Input
                      id="tarjeta-cvv"
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={tarjeta.cvv}
                      onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, "") })}
                      className="mt-1 font-mono text-center"
                    />
                  </div>
                </div>

                {errores["tarjeta"] && <p className="text-xs text-destructive">{errores["tarjeta"]}</p>}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Lock className="size-3.5 text-primary" /> Tu información bancaria viaja protegida con tokenización de TiloPay.
                </div>
              </div>
            )}

            {/* C. BLOQUE PAYPAL */}
            {metodo === "paypal" && (
              <div className="mt-4 rounded-xl border-2 border-sky-500/50 bg-sky-950/20 p-5 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-sky-400 flex items-center gap-2">
                    <span className="text-base">🅿️</span> PayPal Checkout Internacional
                  </span>
                  <span className="rounded-full bg-sky-500/15 text-sky-300 font-bold px-2 py-0.5 text-[10px]">
                    Protección al Comprador
                  </span>
                </div>

                <div className="rounded-xl border border-sky-500/30 bg-card p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Monto a Facturar en PayPal:</span>
                    <span className="font-mono font-bold text-sky-400 text-sm">
                      ${((seleccion?.precio ?? 4000) / TIPO_CAMBIO_USD).toFixed(2)} USD (₡{(seleccion?.precio ?? 4000).toLocaleString("es-CR")})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cuenta Comercial: <strong>{config.paypalEmail || "pagos@avalmotors.cr"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5 text-sky-400" /> Transacción encriptada con tecnología oficial de PayPal Inc. Aprobación y asignación de tokens inmediata.
                </div>
              </div>
            )}

            {/* D. BLOQUE APPLE PAY */}
            {metodo === "applepay" && (
              <div className="mt-4 rounded-xl border-2 border-zinc-500/50 bg-zinc-900/50 p-5 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    <span className="text-base">🍏</span> Apple Pay Express Checkout
                  </span>
                  <span className="rounded-full bg-zinc-800 text-zinc-200 font-bold px-2 py-0.5 text-[10px] border border-zinc-700">
                    Touch ID / Face ID
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-700 bg-card p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Monto Total Oficial:</span>
                    <span className="font-mono font-bold text-white text-base">
                      ₡{(seleccion?.precio ?? 4000).toLocaleString("es-CR")} CRC
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Merchant ID: <strong className="font-mono text-zinc-300">{config.applePayMerchantId || "merchant.cr.avalmotors"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-emerald-400" /> Los datos de tu tarjeta nunca se comparten con la tienda y viajan protegidos por el Secure Enclave de Apple.
                </div>
              </div>
            )}

            {/* E. BLOQUE GOOGLE PAY */}
            {metodo === "googlepay" && (
              <div className="mt-4 rounded-xl border-2 border-amber-500/50 bg-amber-950/20 p-5 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <span className="text-base">🌐</span> Google Pay 1-Tap Checkout
                  </span>
                  <span className="rounded-full bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 text-[10px]">
                    Cuenta Google
                  </span>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-card p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Monto Total Oficial:</span>
                    <span className="font-mono font-bold text-amber-400 text-base">
                      ₡{(seleccion?.precio ?? 4000).toLocaleString("es-CR")} CRC
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Google Merchant: <strong className="font-mono text-zinc-300">{config.googlePayMerchantId || "avalmotors-cr-google-pay"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5 text-amber-400" /> Paga al instante usando las tarjetas asociadas a tu cuenta de Google con validación inmediata de tokens.
                </div>
              </div>
            )}

            {/* F. BLOQUE CRIPTOMONEDAS */}
            {metodo === "crypto" && (
              <div className="mt-4 rounded-xl border-2 border-amber-500/50 bg-secondary/40 p-5 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-500 flex items-center gap-2">
                    <Coins className="size-4" /> Pago en USDT ({config.cryptoRed})
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    Monto: <strong className="text-primary">{montoUsdt} USDT</strong>
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Dirección Billetera ({config.cryptoRed}):</span>
                    <Button
                      type="button"
                      variant={copiadoCrypto ? "success" : "outline"}
                      size="sm"
                      onClick={copiarCrypto}
                      className="h-7 text-[11px] gap-1"
                    >
                      {copiadoCrypto ? <Check className="size-3" /> : <Copy className="size-3" />}
                      {copiadoCrypto ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                  <div className="font-mono text-xs font-bold text-primary break-all bg-secondary/60 p-2.5 rounded-lg border">
                    {config.cryptoWalletUsdt}
                  </div>
                  {config.cryptoBinanceId && (
                    <div className="text-xs text-muted-foreground pt-1">
                      O transfiere por <strong>Binance Pay ID</strong>: <span className="font-mono font-bold text-foreground">{config.cryptoBinanceId}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="crypto-hash">Hash / ID de la Transacción (TXID)</Label>
                  <Input
                    id="crypto-hash"
                    placeholder="0x... o hash de la transferencia"
                    value={cryptoHash}
                    onChange={(e) => setCryptoHash(e.target.value)}
                    className="mt-1 font-mono text-xs"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Pega el Hash para verificar automáticamente el depósito en la blockchain.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* BOTÓN PRINCIPAL DE ACCIÓN */}
          <Button
            type="submit"
            variant={metodo === "tarjeta" || metodo === "paypal" || metodo === "applepay" || metodo === "googlepay" ? "hero" : "success"}
            size="xl"
            className="w-full py-7 text-base shadow-[var(--shadow-fire)]"
            disabled={enviando}
          >
            {enviando ? (
              "Procesando orden y asignando tokens..."
            ) : metodo === "tarjeta" ? (
              `💳 Pagar ₡${(seleccion?.precio ?? 4000).toLocaleString("es-CR")} con Tarjeta (TiloPay)`
            ) : metodo === "paypal" ? (
              `🅿️ Pagar $${((seleccion?.precio ?? 4000) / TIPO_CAMBIO_USD).toFixed(2)} USD con PayPal`
            ) : metodo === "applepay" ? (
              ` Pagar ₡${(seleccion?.precio ?? 4000).toLocaleString("es-CR")} con Apple Pay`
            ) : metodo === "googlepay" ? (
              `🌐 Pagar ₡${(seleccion?.precio ?? 4000).toLocaleString("es-CR")} con Google Pay`
            ) : metodo === "crypto" ? (
              `🪙 Confirmar Depósito de ${montoUsdt} USDT`
            ) : (
              "📱 Enviar Comprobante SINPE a Validación"
            )}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}