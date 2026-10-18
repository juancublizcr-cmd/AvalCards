import { useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Coins,
  CreditCard,
  Dices,
  ExternalLink,
  Flame,
  Gavel,
  Gift,
  HelpCircle,
  Info,
  Layout,
  MessageSquare,
  Radio,
  Save,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Store,
  Timer,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { upsertConfig, upsertSorteo, type Config, type Sorteo } from "@/lib/admin-store";
import { Link } from "@tanstack/react-router";

interface Props {
  config: Config;
  setConfig: (c: Config) => void;
  sorteo?: Sorteo;
  setSorteo?: (s: Sorteo) => void;
  onIrASeccion?: (seccion: string) => void;
}

export function CentroControlSection({ config, setConfig, sorteo, setSorteo, onIrASeccion }: Props) {
  const [borrador, setBorrador] = useState<Config>(config);
  const [sorteoBorrador, setSorteoBorrador] = useState<Sorteo | undefined>(sorteo);
  const [guardando, setGuardando] = useState(false);

  const guardarCambios = async (nuevoConfig: Config, nuevoSorteo?: Sorteo) => {
    setGuardando(true);
    try {
      await upsertConfig(nuevoConfig);
      setConfig(nuevoConfig);
      setBorrador(nuevoConfig);

      if (nuevoSorteo && setSorteo) {
        await upsertSorteo(nuevoSorteo);
        setSorteo(nuevoSorteo);
        setSorteoBorrador(nuevoSorteo);
      }

      toast.success("✅ Cambios guardados correctamente", {
        description: "La configuración pública del sitio se ha actualizado en tiempo real.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la configuración");
    } finally {
      setGuardando(false);
    }
  };

  const toggleSwitch = (clave: keyof Config, valorActual: boolean | undefined, porDefecto = true) => {
    const estado = valorActual !== undefined ? valorActual : porDefecto;
    const nuevoValor = !estado;
    const actualizado = { ...borrador, [clave]: nuevoValor };
    setBorrador(actualizado);
    void guardarCambios(actualizado, sorteoBorrador);
  };

  const toggleRaspa = () => {
    if (!sorteoBorrador) return;
    const activoActual = sorteoBorrador.raspaConfig?.activo ?? true;
    const nuevoSorteo: Sorteo = {
      ...sorteoBorrador,
      raspaConfig: {
        ...(sorteoBorrador.raspaConfig || {
          activo: true,
          titulo: "Raspa y Gana Express",
          subtitulo: "Rasca con el cursor y gana premios al instante",
          probabilidadGanar: 20,
          intentosMaximos: 3,
          premios: [],
        }),
        activo: !activoActual,
      },
    };
    setSorteoBorrador(nuevoSorteo);
    void guardarCambios(borrador, nuevoSorteo);
  };

  const raspaActivo = sorteoBorrador?.raspaConfig?.activo ?? true;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <SlidersHorizontal className="size-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-foreground">
              Centro de Control e Interruptores
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Activa o desactiva cualquier función, sección o pasarela de pago del sitio web en un solo lugar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
            <Link to="/" target="_blank">
              <ExternalLink className="size-3.5" /> Ver Sitio en Vivo
            </Link>
          </Button>
          <Button
            onClick={() => void guardarCambios(borrador, sorteoBorrador)}
            disabled={guardando}
            size="sm"
            className="gap-2 font-bold"
          >
            <Save className="size-4" />
            {guardando ? "Guardando..." : "Guardar Todo"}
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MODO MAESTRO DEL SITIO WEB (INTERRUPTOR PRINCIPAL)                     */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
              <Sparkles className="size-3.5" /> Interruptor Maestro del Sitio
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Estado de la Web:{" "}
              <span className={borrador.ventasActivas ? "text-emerald-400" : "text-amber-400"}>
                {borrador.ventasActivas ? "🟢 Tienda Activa (Ventas Abiertas)" : "🟡 Modo Preventa / Promo"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {borrador.ventasActivas
                ? "La tienda está 100% abierta al público: los clientes pueden seleccionar sus números de 5 dígitos, elegir paquetes de tokens y pagar directamente por SINPE Móvil o Tarjeta."
                : "Modo campaña de prelanzamiento: los paquetes se muestran como preventa y los botones principales abren WhatsApp para apartar números antes de la apertura oficial."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => toggleSwitch("ventasActivas", borrador.ventasActivas, true)}
              className={`cursor-pointer px-5 py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-3 text-sm shadow-md ${
                borrador.ventasActivas
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-zinc-800/80 border-border text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span className={`size-3 rounded-full ${borrador.ventasActivas ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              <div className="text-left">
                <div className="font-black">🟢 Tienda Abierta</div>
                <div className="text-[11px] opacity-80">Venta directa y números</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleSwitch("ventasActivas", borrador.ventasActivas, true)}
              className={`cursor-pointer px-5 py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-3 text-sm shadow-md ${
                !borrador.ventasActivas
                  ? "bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30"
                  : "bg-zinc-800/80 border-border text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span className={`size-3 rounded-full ${!borrador.ventasActivas ? "bg-amber-400 animate-pulse" : "bg-zinc-500"}`} />
              <div className="text-left">
                <div className="font-black">🟡 Modo Preventa</div>
                <div className="text-[11px] opacity-80">Captación vía WhatsApp</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECCIONES DE LA PÁGINA PRINCIPAL (LANDING PAGE)                        */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layout className="size-5 text-primary" /> Secciones de la Página Web Principal
            </h3>
            <p className="text-xs text-muted-foreground">
              Muestra u oculta bloques enteros de la portada sin alterar tus datos guardados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Paquetes de Tokens */}
          <ItemControl
            titulo="Paquetes de Tokens & Carrito"
            desc="Tarjetas de 4, 8, 12 y 24 tokens con botón de selección y compra."
            icono={Dices}
            activo={borrador.mostrarSeccionPaquetes !== false}
            onToggle={() => toggleSwitch("mostrarSeccionPaquetes", borrador.mostrarSeccionPaquetes, true)}
            recomendado="Debe estar activo para vender"
          />

          {/* Termómetro de Progreso */}
          <ItemControl
            titulo="Termómetro & Cuenta Regresiva"
            desc="Reloj hacia el sorteo de la JPS y barra de progreso de ventas de la edición."
            icono={Flame}
            activo={borrador.mostrarSeccionTermometro !== false}
            onToggle={() => toggleSwitch("mostrarSeccionTermometro", borrador.mostrarSeccionTermometro, true)}
          />

          {/* Vitrina de Premios Podio */}
          <ItemControl
            titulo="Vitrina de Premios (Podio 1° y 2°)"
            desc="Fotos en alta resolución de los carros, motos y selector a elección."
            icono={Trophy}
            activo={borrador.mostrarSeccionAperturaPremios !== false}
            onToggle={() => toggleSwitch("mostrarSeccionAperturaPremios", borrador.mostrarSeccionAperturaPremios, true)}
          />

          {/* Botón Principal Hero CTA */}
          <ItemControl
            titulo="Botón Principal Hero (Quiero Participar)"
            desc="Botón grande de acción inmediata en el banner superior."
            icono={Zap}
            activo={borrador.mostrarCtaHero !== false}
            onToggle={() => toggleSwitch("mostrarCtaHero", borrador.mostrarCtaHero, true)}
          />

          {/* Suscripción Comunitaria AVAL */}
          <ItemControl
            titulo="Membresía Comunitaria (Car Wash + Tokens)"
            desc="Bloque SUSCRIBITE con 50% de descuento en LUXX CR y 3 tokens."
            icono={Sparkles}
            activo={borrador.mostrarSeccionSuscripcion !== false}
            onToggle={() => toggleSwitch("mostrarSeccionSuscripcion", borrador.mostrarSeccionSuscripcion, true)}
          />

          {/* Cómo Funciona */}
          <ItemControl
            titulo="Sección '¿Cómo Funciona?'"
            desc="Los 3 pasos visuales para elegir números, pagar y verificar."
            icono={Info}
            activo={borrador.mostrarSeccionComoFunciona !== false}
            onToggle={() => toggleSwitch("mostrarSeccionComoFunciona", borrador.mostrarSeccionComoFunciona, true)}
          />

          {/* Ficha Técnica de Premios */}
          <ItemControl
            titulo="Ficha Técnica & Garantías de Premios"
            desc="Detalles mecánicos de los vehículos, marchamo y notaría incluidos."
            icono={CheckCircle2}
            activo={borrador.mostrarSeccionDetallePremios === true}
            onToggle={() => toggleSwitch("mostrarSeccionDetallePremios", borrador.mostrarSeccionDetallePremios, false)}
          />

          {/* Preguntas Frecuentes FAQs */}
          <ItemControl
            titulo="Preguntas Frecuentes (FAQs)"
            desc="Respuestas a dudas comunes de legalidad, pagos y entrega."
            icono={HelpCircle}
            activo={borrador.mostrarSeccionFaqs !== false}
            onToggle={() => toggleSwitch("mostrarSeccionFaqs", borrador.mostrarSeccionFaqs, true)}
          />

          {/* Barra Superior de Notificación */}
          <ItemControl
            titulo="Barra de Notificación Superior"
            desc="Cintillo dorado con anuncio de preventa o noticias en la cabecera."
            icono={Radio}
            activo={borrador.mostrarBarraNotificacion !== false}
            onToggle={() => toggleSwitch("mostrarBarraNotificacion", borrador.mostrarBarraNotificacion, true)}
          />

          {/* Menú de Navegación Header */}
          <ItemControl
            titulo="Menú de Navegación Superior"
            desc="Enlaces hacia las secciones en la barra de navegación del sitio."
            icono={Layout}
            activo={borrador.mostrarNavegacion !== false}
            onToggle={() => toggleSwitch("mostrarNavegacion", borrador.mostrarNavegacion, true)}
          />

          {/* Badges del Hero */}
          <ItemControl
            titulo="Insignias de Confianza (JPS y Oficial)"
            desc="Etiquetas verificadas de respaldo JPS y evento oficial en Costa Rica."
            icono={CheckCircle2}
            activo={borrador.mostrarBadgeJPS !== false}
            onToggle={() => toggleSwitch("mostrarBadgeJPS", borrador.mostrarBadgeJPS, true)}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DINÁMICAS, JUEGOS Y MÓDULOS ESPECIALES                                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Gift className="size-5 text-amber-500" /> Dinámicas, Juegos y Módulos Especiales
          </h3>
          <p className="text-xs text-muted-foreground">
            Habilita módulos interactivos para multiplicar ventas y fidelizar participantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* SuperToken */}
          <ItemControl
            titulo="SuperToken (Multiplicador de Premio)"
            desc="Permite pagar un extra para optar por bonos millonarios en USD si ganan."
            icono={Coins}
            activo={borrador.supertokenActivo ?? true}
            onToggle={() => toggleSwitch("supertokenActivo", borrador.supertokenActivo, true)}
          />

          {/* Raspa y Gana Express */}
          <ItemControl
            titulo="Raspa y Gana Express"
            desc="Juego instantáneo tipo raspa digital para ganar tokens y premios directos."
            icono={Gift}
            activo={raspaActivo}
            onToggle={toggleRaspa}
          />

          {/* Remates VIP */}
          <ItemControl
            titulo="Sala de Remates & Subastas VIP"
            desc="Módulo de subastas de lotes de tokens con temporizador y puja en vivo."
            icono={Gavel}
            activo={borrador.mostrarSalaRemates ?? false}
            onToggle={() => toggleSwitch("mostrarSalaRemates", borrador.mostrarSalaRemates, false)}
          />

          {/* Referidos y Afiliados */}
          <ItemControl
            titulo="Sistema de Referidos y Afiliados"
            desc="Permite a los usuarios compartir su enlace y ganar comisiones o tokens."
            icono={Share2}
            activo={borrador.referidosActivo ?? true}
            onToggle={() => toggleSwitch("referidosActivo", borrador.referidosActivo, true)}
          />

          {/* Mini Sorteos Semanales */}
          <ItemControl
            titulo="Mini Sorteos Semanales (Gasolina / PS5)"
            desc="Premios de combustible y PlayStation los viernes y domingos."
            icono={Flame}
            activo={borrador.miniSorteosActivo ?? false}
            onToggle={() => toggleSwitch("miniSorteosActivo", borrador.miniSorteosActivo, false)}
          />

          {/* Muro de Ganadores */}
          <ItemControl
            titulo="Muro de Ganadores y Testimonios"
            desc="Fotografías y comentarios de ganadores de ediciones anteriores."
            icono={Trophy}
            activo={borrador.mostrarSeccionGanadores ?? false}
            onToggle={() => toggleSwitch("mostrarSeccionGanadores", borrador.mostrarSeccionGanadores, false)}
          />

          {/* Sponsors y Comercios Aliados */}
          <ItemControl
            titulo="Red de Sponsors y Comercios"
            desc="Muestra logotipos y convenios comerciales que ofrecen descuentos."
            icono={Store}
            activo={borrador.mostrarSeccionSponsors ?? false}
            onToggle={() => toggleSwitch("mostrarSeccionSponsors", borrador.mostrarSeccionSponsors, false)}
          />

          {/* Asesor Comercial IA */}
          <ItemControl
            titulo="Asesor Comercial con IA (Aval-IA)"
            desc="Chatbot flotante inteligente que asesora y cierra ventas las 24 horas."
            icono={Bot}
            activo={borrador.aiActivo ?? true}
            onToggle={() => toggleSwitch("aiActivo", borrador.aiActivo, true)}
          />

          {/* Notificaciones FOMO */}
          <ItemControl
            titulo="Notificaciones de Compras en Vivo (FOMO)"
            desc="Popups flotantes que indican 'Alguien de Escazú compró 12 tokens hace 2m'."
            icono={AlertCircle}
            activo={borrador.fomoActivo ?? false}
            onToggle={() => toggleSwitch("fomoActivo", borrador.fomoActivo, false)}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PASARELAS Y MÉTODOS DE PAGO                                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard className="size-5 text-emerald-500" /> Pasarelas y Métodos de Pago Activos
          </h3>
          <p className="text-xs text-muted-foreground">
            Controla qué formas de pago están disponibles para los usuarios en el checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* SINPE Móvil */}
          <ItemControl
            titulo="SINPE Móvil Oficial"
            desc="Conciliación bancaria al número oficial (8634-4772)."
            icono={Smartphone}
            activo={borrador.sinpeActivo !== false}
            onToggle={() => toggleSwitch("sinpeActivo", borrador.sinpeActivo, true)}
            destacado="Método #1 en Costa Rica"
          />

          {/* Tarjetas TiloPay */}
          <ItemControl
            titulo="Tarjetas Débito / Crédito (TiloPay)"
            desc="Cobros instantáneos en colones y dólares con Visa y Mastercard."
            icono={CreditCard}
            activo={borrador.tilopayActivo !== false}
            onToggle={() => toggleSwitch("tilopayActivo", borrador.tilopayActivo, true)}
          />

          {/* PayPal */}
          <ItemControl
            titulo="PayPal Internacional"
            desc="Pagos internacionales directos con cuenta o tarjetas PayPal."
            icono={CreditCard}
            activo={borrador.paypalActivo === true}
            onToggle={() => toggleSwitch("paypalActivo", borrador.paypalActivo, false)}
          />

          {/* Criptomonedas USDT */}
          <ItemControl
            titulo="Criptomonedas (USDT TRC20 / BEP20)"
            desc="Acepta depósitos de Tether (USDT) en billeteras frías o Binance Pay."
            icono={Coins}
            activo={borrador.cryptoActivo === true}
            onToggle={() => toggleSwitch("cryptoActivo", borrador.cryptoActivo, false)}
          />

          {/* Apple Pay */}
          <ItemControl
            titulo="Apple Pay"
            desc="Pago en un solo toque para usuarios de iPhone, iPad y Mac."
            icono={Smartphone}
            activo={borrador.applePayActivo === true}
            onToggle={() => toggleSwitch("applePayActivo", borrador.applePayActivo, false)}
          />

          {/* Google Pay */}
          <ItemControl
            titulo="Google Pay"
            desc="Pago en un clic para billeteras Google en dispositivos Android."
            icono={Smartphone}
            activo={borrador.googlePayActivo === true}
            onToggle={() => toggleSwitch("googlePayActivo", borrador.googlePayActivo, false)}
          />
        </div>
      </div>
    </div>
  );
}

function ItemControl({
  titulo,
  desc,
  icono: Icono,
  activo,
  onToggle,
  destacado,
  recomendado,
}: {
  titulo: string;
  desc: string;
  icono: any;
  activo: boolean;
  onToggle: () => void;
  destacado?: string;
  recomendado?: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between gap-3 ${
        activo
          ? "border-emerald-500/40 bg-card hover:border-emerald-500/60 shadow-sm"
          : "border-border/60 bg-secondary/20 opacity-75 hover:opacity-100 hover:border-border"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                activo ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
              }`}
            >
              <Icono className="size-4" />
            </span>
            <span className="font-bold text-xs sm:text-sm text-foreground leading-tight line-clamp-1">
              {titulo}
            </span>
          </div>

          <Switch
            checked={activo}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-emerald-500 shrink-0 cursor-pointer"
          />
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {desc}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full ${activo ? "bg-emerald-400" : "bg-zinc-500"}`} />
          <span className={`font-black uppercase tracking-wider ${activo ? "text-emerald-400" : "text-muted-foreground"}`}>
            {activo ? "Activo" : "Desactivado"}
          </span>
        </div>

        {destacado && (
          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {destacado}
          </span>
        )}

        {recomendado && !destacado && (
          <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            {recomendado}
          </span>
        )}
      </div>
    </div>
  );
}
