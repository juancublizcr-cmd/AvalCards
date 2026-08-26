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
import { crearOrden, leerSeleccion, limpiarSeleccion, type Seleccion } from "@/lib/orders";
import { fetchConfig, type Config, CONFIG_DEFAULT } from "@/lib/admin-store";
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

type MetodoPago = "sinpe" | "tarjeta" | "crypto";

const TIPO_CAMBIO_USD = 515; // 1 USD = ₡515 CRC

const esquema = z.object({
  nombre: z.string().trim().min(3, "Ingresa tu nombre completo").max(100),
  telefono: z
    .string()
    .trim()
    .regex(/^[0-9]{4}-?[0-9]{4}$/, "Formato válido: 8888-8888"),
  email: z.string().trim().email("Correo electrónico inválido").max(255),
});

function Checkout() {
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT);
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
  const [arrastrando, setArrastrando] = useState(false);
  const [openJuego, setOpenJuego] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSeleccion(leerSeleccion());
    void fetchConfig().then((c) => {
      setConfig(c);
      if (!c.sinpeActivo && c.tilopayActivo) setMetodo("tarjeta");
      else if (!c.sinpeActivo && !c.tilopayActivo && c.cryptoActivo) setMetodo("crypto");
    }).catch(() => {});
  }, []);

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
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    const nuevoId = `SG-${Math.floor(1000 + Math.random() * 9000)}`;

    // Si paga con Tarjeta o Crypto, la aprobación es inmediata o registrada con ID
    const esPagoInstantaneo = metodo === "tarjeta";
    const estadoInicial = esPagoInstantaneo ? "aprobada" : "pendiente";
    const transaccionId =
      metodo === "tarjeta"
        ? `TILO-${Date.now()}`
        : metodo === "crypto"
          ? cryptoHash.trim() || `TX-${Date.now()}`
          : "";

    try {
      await crearOrden(
        {
          id: nuevoId,
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          cantidad: seleccion?.cantidad ?? 0,
          precio: seleccion?.precio ?? 0,
          numeros: seleccion?.numeros ?? [],
          estado: estadoInicial,
          fecha: new Date().toISOString(),
          metodo_pago: metodo,
          transaccion_id: transaccionId,
          supertoken: seleccion?.supertoken ?? false,
          monto_supertoken: seleccion?.monto_supertoken ?? 0,
        },
        archivo,
      );

      const girosBonus = calcularGirosPorTokens(seleccion?.cantidad ?? 4);
      guardarGiros({
        giros: girosBonus,
        ordenId: nuevoId,
        telefono: form.telefono,
        nombre: form.nombre,
        tipo: "bono_tokens",
      });

      setOrdenCreadaId(nuevoId);
      setOrdenAprobadaDirecta(esPagoInstantaneo);
      limpiarSeleccion();
      setExito(true);

      if (esPagoInstantaneo) {
        toast.success("¡Pago procesado con éxito!", {
          description: `¡Tu compra incluye ${girosBonus} Giros GRATIS en la Ruleta/Raspa!`,
        });
      } else {
        toast.success("¡Orden recibida!", {
          description: `¡Tus stickers quedaron reservados y tienes ${girosBonus} Giros GRATIS listos!`,
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
    const texto = encodeURIComponent(
      `¡Ya estoy participando en el evento promocional de Aval Motors CR! Mis números de Tokens son: ${seleccion?.numeros?.join(", ") ?? ""}. Adquiere los tuyos aquí: https://avalmotors.cr`,
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
              <Crown className="size-4" /> SuperToken VIP Activo · Califica para 1° Lugar + $6,000 USD Cash
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

          {/* BONO DE GIROS GRATIS MODELO HÍBRIDO */}
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
              <Crown className="size-3.5" /> SuperToken VIP (+$6,000 USD)
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {seleccion
            ? `Paquete de ${seleccion.cantidad} Tokens ${seleccion.supertoken ? "(con SuperToken VIP)" : ""} · ₡${seleccion.precio.toLocaleString("es-CR")} (aprox. $${montoUsdt} USD)`
            : "No hay un paquete seleccionado. Vuelve al inicio y elige uno."}
        </p>

        <form onSubmit={(e) => { void enviar(e); }} className="mt-8 space-y-8" noValidate>
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

            <div className="grid gap-3 sm:grid-cols-3">
              {config.sinpeActivo && (
                <button
                  type="button"
                  onClick={() => setMetodo("sinpe")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    metodo === "sinpe"
                      ? "border-primary bg-primary/10 shadow-sm text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Smartphone className="size-6" />
                  <div className="font-bold text-sm">SINPE Móvil</div>
                  <span className="text-[10px] text-muted-foreground">Pago local Costa Rica</span>
                </button>
              )}

              {config.tilopayActivo && (
                <button
                  type="button"
                  onClick={() => setMetodo("tarjeta")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    metodo === "tarjeta"
                      ? "border-primary bg-primary/10 shadow-sm text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <CreditCard className="size-6" />
                  <div className="font-bold text-sm">Tarjeta (TiloPay)</div>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Zap className="size-3" /> Aprobación 100% Inmediata
                  </span>
                </button>
              )}

              {config.cryptoActivo && (
                <button
                  type="button"
                  onClick={() => setMetodo("crypto")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    metodo === "crypto"
                      ? "border-primary bg-primary/10 shadow-sm text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Coins className="size-6" />
                  <div className="font-bold text-sm">Cripto (USDT)</div>
                  <span className="text-[10px] text-muted-foreground">{config.cryptoRed} / Binance Pay</span>
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
                    {copiadoSinpe ? "¡Copiado!" : "Copiar Número"}
                  </Button>
                </div>

                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs space-y-1">
                  <span className="font-bold text-destructive">⚠️ MOTIVO O DETALLE DEL SINPE:</span>
                  <p className="text-muted-foreground">
                    Escribe <strong>únicamente tu nombre y apellidos</strong>. No pongas "rifa" ni "sorteo".
                  </p>
                </div>

                <div className="pt-2">
                  <Label>Adjunta la captura del comprobante</Label>
                  <button
                    type="button"
                    onClick={() => inputFile.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setArrastrando(true);
                    }}
                    onDragLeave={() => setArrastrando(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setArrastrando(false);
                      elegirArchivo(e.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`mt-2 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors hover:border-primary ${
                      arrastrando ? "border-primary bg-secondary/80" : "border-primary/40 bg-secondary/40"
                    }`}
                  >
                    {preview ? (
                      <img src={preview} alt="Comprobante" className="max-h-48 rounded-lg object-contain" />
                    ) : (
                      <>
                        <Upload className="size-7 text-primary" />
                        <span className="text-xs font-medium">Arrastra aquí la captura o haz clic para subirla</span>
                        <span className="text-[10px] text-muted-foreground">PNG o JPG · máx. 5 MB</span>
                      </>
                    )}
                  </button>
                  {archivo && <p className="mt-1 text-center text-xs text-muted-foreground">{archivo.name}</p>}
                  {errores["archivo"] && <p className="mt-1 text-xs text-destructive">{errores["archivo"]}</p>}
                  <input
                    ref={inputFile}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
                  />
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

            {/* C. BLOQUE CRIPTOMONEDAS */}
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
            variant={metodo === "tarjeta" ? "hero" : "success"}
            size="xl"
            className="w-full py-7 text-base shadow-[var(--shadow-fire)]"
            disabled={enviando}
          >
            {enviando ? (
              "Procesando pago..."
            ) : metodo === "tarjeta" ? (
              `💳 Pagar ₡${seleccion?.precio.toLocaleString("es-CR") ?? 0} con Tarjeta (TiloPay)`
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