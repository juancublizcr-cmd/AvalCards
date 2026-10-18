import { useState } from "react";
import {
  AlertCircle,
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  Coins,
  CreditCard,
  Dices,
  ExternalLink,
  Flame,
  Fuel,
  Gavel,
  Gift,
  Globe,
  HelpCircle,
  Info,
  Layout,
  MessageSquare,
  Package,
  Radio,
  RotateCw,
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
        description: "La configuración pública se actualizó en tiempo real.",
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
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
              <SlidersHorizontal className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-foreground">
                Centro de Control e Interruptores
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                El panel único donde activas, quitas o modificas todas las secciones, módulos y pasarelas de la plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
            <Link to="/" target="_blank">
              <ExternalLink className="size-3.5" /> Ver en Vivo ↗
            </Link>
          </Button>
          <Button
            onClick={() => void guardarCambios(borrador, sorteoBorrador)}
            disabled={guardando}
            size="sm"
            className="gap-2 font-bold"
          >
            <Save className="size-4" />
            {guardando ? "Guardando..." : "Guardar Todos los Cambios"}
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
      {/* 2. ACTIVAR, QUITAR Y MODIFICAR SECCIONES DE LA LANDING (BLOQUE COMPLETO)   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="size-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Activar, Quitar y Modificar Secciones de la Landing
              </h2>
              <p className="text-xs text-muted-foreground">
                Controla con un solo interruptor qué bloques se muestran a tus visitantes en la página principal.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 1. Apertura: 3 Premios Destacados */}
          <CardInterruptor
            numero="1"
            titulo="Apertura: 3 Premios Destacados"
            desc="Muestra las tarjetas interactivas de los 3 premios principales en la cabecera, con popup modal 'Comprá y ganá'."
            tip="💡 Títulos y Quiénes Somos editables en la pestaña 'Apertura & Hero' de Textos Web."
            activo={borrador.mostrarSeccionAperturaPremios !== false}
            onToggle={() => toggleSwitch("mostrarSeccionAperturaPremios", borrador.mostrarSeccionAperturaPremios, true)}
          />

          {/* 2. Barra de Meta y Conteo Regresivo */}
          <CardInterruptor
            numero="2"
            titulo="Termómetro de Meta y Conteo"
            desc="Barra luminosa con el porcentaje vendido en vivo y reloj regresivo sincronizado con la fecha oficial del sorteo."
            tip="💡 Barra en tiempo real en la cabecera bajo los premios."
            activo={borrador.mostrarSeccionTermometro !== false}
            onToggle={() => toggleSwitch("mostrarSeccionTermometro", borrador.mostrarSeccionTermometro, true)}
          />

          {/* 3. Paquetes de Tokens (Foco Central) */}
          <CardInterruptor
            numero="3"
            titulo="Zona de Paquetes de Tokens"
            desc="Zona de compra de tokens. Al estar apagada, la sección completa desaparece de la landing page para periodos de prelanzamiento o suspenso."
            tip="💡 Edita precios y etiquetas en la pestaña 'Paquetes & Compra' de Textos Web."
            activo={borrador.mostrarSeccionPaquetes !== false}
            onToggle={() => toggleSwitch("mostrarSeccionPaquetes", borrador.mostrarSeccionPaquetes, true)}
          />

          {/* 4. Sección ¿Cómo Funciona? (3 Pasos) */}
          <CardInterruptor
            numero="4"
            titulo="Sección ¿Cómo Funciona? (3 Pasos)"
            desc="Explicación rápida del proceso 100% digital, métodos de pago aceptados y validación ante la JPS."
            tip="💡 Textos de cada paso configurables en la pestaña '3 Pasos' de Textos Web."
            activo={borrador.mostrarSeccionComoFunciona !== false}
            onToggle={() => toggleSwitch("mostrarSeccionComoFunciona", borrador.mostrarSeccionComoFunciona, true)}
          />

          {/* 5. Gran Bloque de Suscripción AVAL Community (Membresía & Beneficios) */}
          <CardInterruptor
            numero="5"
            titulo="Gran Bloque de Suscripción AVAL Community"
            desc="Llamado a la acción de alto impacto: 'SUSCRIBITE' con 50% de descuento en LUXX CR CAR WASH, 3 tokens de participación y dinámicas transparentes respaldadas por la JPS."
            tip="💡 Ubicado estratégicamente justo después de los 3 simples pasos."
            activo={borrador.mostrarSeccionSuscripcion !== false}
            onToggle={() => toggleSwitch("mostrarSeccionSuscripcion", borrador.mostrarSeccionSuscripcion, true)}
            destacado={true}
          />

          {/* 6. Detalle Extendido de Premios */}
          <CardInterruptor
            numero="6"
            titulo="Detalle Extendido de Premios"
            desc="Bloque completo fuera del hero con selector de pestañas (Ducati, Subaru, Efectivo/PS5) y botones de compra propios."
            tip="💡 Permite inspeccionar la ficha técnica sin salir de la página."
            activo={borrador.mostrarSeccionDetallePremios === true}
            onToggle={() => toggleSwitch("mostrarSeccionDetallePremios", borrador.mostrarSeccionDetallePremios, false)}
          />

          {/* 7. Modalidad SuperToken (Bono Cash) */}
          <CardInterruptor
            numero="7"
            titulo="Modalidad SuperToken (Bono Cash)"
            desc="Muestra la opción opcional del multiplicador VIP en efectivo para el 1°, 2° y 3° lugar sumado a sus vehículos."
            tip="💡 Ajuste de bonos en la sección de Configuración General."
            activo={borrador.supertokenActivo ?? true}
            onToggle={() => toggleSwitch("supertokenActivo", borrador.supertokenActivo, true)}
          />

          {/* 8. Programa de Referidos Unificado */}
          <CardInterruptor
            numero="8"
            titulo="Programa de Referidos Unificado"
            desc="Módulo todo-en-uno que reúne dinámica de padrinos, generador de enlace en vivo y tabla de líderes mensual."
            tip="💡 Modifica los montos de premios por referido en la sección 'Referidos'."
            activo={borrador.referidosActivo ?? true}
            onToggle={() => toggleSwitch("referidosActivo", borrador.referidosActivo, true)}
          />

          {/* 9. Descuentos en Comercios Afiliados */}
          <CardInterruptor
            numero="9"
            titulo="Comercios Afiliados & Descuentos"
            desc="Vitrina de beneficios exclusivos y descuentos de hasta 50% en comercios aliados para los participantes."
            tip="💡 Administra comercios y cupones en la sección 'Comercios / Sponsors'."
            activo={borrador.mostrarSeccionSponsors ?? false}
            onToggle={() => toggleSwitch("mostrarSeccionSponsors", borrador.mostrarSeccionSponsors, false)}
          />

          {/* 10. Mini-Sorteos Semanales (Gasolina / Play 5) */}
          <CardInterruptor
            numero="10"
            titulo="Mini-Sorteos Semanales"
            desc="Dinámica de gasolina y PlayStation semanal. Se mantiene apagado por ahora para no competir con el mensaje de tokens."
            tip="💡 Actívalo cuando tus clientes ya dominen la dinámica principal."
            activo={borrador.miniSorteosActivo ?? false}
            onToggle={() => toggleSwitch("miniSorteosActivo", borrador.miniSorteosActivo, false)}
          />

          {/* 11. Sección de Ganadores y Testimonios */}
          <CardInterruptor
            numero="11"
            titulo="Ganadores y Testimonios"
            desc="Galería de ganadores y testimonios. Oculto para la primera edición hasta tener las primeras entregas oficiales."
            tip="💡 Se alimenta de testimonios cargados en el panel de Premios."
            activo={borrador.mostrarSeccionGanadores ?? false}
            onToggle={() => toggleSwitch("mostrarSeccionGanadores", borrador.mostrarSeccionGanadores, false)}
          />

          {/* 12. Preguntas Frecuentes (FAQs) */}
          <CardInterruptor
            numero="12"
            titulo="Preguntas Frecuentes (FAQs)"
            desc="Acordeón inferior que aclara dudas sobre legalidad notarial, SINPE Móvil y dinámicas de participación."
            tip="💡 Resuelve objeciones y genera confianza antes del cierre."
            activo={borrador.mostrarSeccionFaqs !== false}
            onToggle={() => toggleSwitch("mostrarSeccionFaqs", borrador.mostrarSeccionFaqs, true)}
          />

          {/* 13. Tarjeta ¿Tenés Dudas? (WhatsApp en FAQs) */}
          <CardInterruptor
            numero="13"
            titulo="Tarjeta '¿Tenés Dudas?' (WhatsApp en FAQs)"
            desc="Caja verde con botón 'Chatear por WhatsApp' ubicada al pie del acordeón de preguntas frecuentes."
            tip="💬 Activa o desactiva la tarjeta de contacto directo al pie de las FAQs."
            activo={borrador.mostrarTarjetaDudas === true}
            onToggle={() => toggleSwitch("mostrarTarjetaDudas", borrador.mostrarTarjetaDudas, false)}
          />

          {/* 14. Sala de Remates VIP */}
          <CardInterruptor
            numero="14"
            titulo="Sala de Remates & Subastas VIP"
            desc="Desactivada para no confundir a los participantes. Al estar apagada, se retira de la navegación pública y la ruta redirige a la compra de tokens."
            tip="💡 El foco absoluto se mantiene en que el cliente comprenda cómo adquirir tokens."
            activo={borrador.mostrarSalaRemates === true}
            onToggle={() => toggleSwitch("mostrarSalaRemates", borrador.mostrarSalaRemates, false)}
          />

          {/* 15. Barra de Notificación Superior */}
          <CardInterruptor
            numero="15"
            titulo="Barra de Notificación Superior"
            desc="Cintillo dorado con anuncio de preventa o noticias en la cabecera principal."
            tip="📢 Avisa noticias urgentes o promociones especiales."
            activo={borrador.mostrarBarraNotificacion !== false}
            onToggle={() => toggleSwitch("mostrarBarraNotificacion", borrador.mostrarBarraNotificacion, true)}
          />

          {/* 16. Botón Principal Hero (Quiero Participar) */}
          <CardInterruptor
            numero="16"
            titulo="Botón Principal Hero (CTA)"
            desc="Botón grande de acción inmediata en el banner superior de la página."
            tip="⚡ Dirige inmediatamente a la compra de paquetes de tokens."
            activo={borrador.mostrarCtaHero !== false}
            onToggle={() => toggleSwitch("mostrarCtaHero", borrador.mostrarCtaHero, true)}
          />

          {/* 17. Tarjetas de Transparencia & Respaldo */}
          <CardInterruptor
            numero="17"
            titulo="Tarjetas de Transparencia y Garantía"
            desc="Las 2 tarjetas informativas ('Si llegamos al 100%' y 'Garantía de Cumplimiento') situadas bajo los paquetes de tokens."
            tip="🛡️ Edita sus textos en Diseño Web > Paquetes de Tokens."
            activo={borrador.mostrarTarjetasGarantia !== false}
            onToggle={() => toggleSwitch("mostrarTarjetasGarantia", borrador.mostrarTarjetasGarantia, true)}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DINÁMICAS DIGITALES EXPRESS                                            */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <Gift className="size-5 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Dinámicas Digitales Express</h2>
            <p className="text-xs text-muted-foreground">
              Juegos interactivos de retención y asesoría comercial con Inteligencia Artificial.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Raspa y Gana Express */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">🎁 Raspa y Gana Digital Express</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${raspaActivo ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                    {raspaActivo ? "Activo" : "Oculto"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Juego instantáneo táctil tipo raspa para ganar premios en SINPE Móvil o tokens directos.
                </p>
              </div>
              <Switch checked={raspaActivo} onCheckedChange={toggleRaspa} />
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50 flex items-center justify-between">
              <span>💡 Configurable en detalle en la pestaña "Raspa y Gana Express".</span>
              {onIrASeccion && (
                <button
                  type="button"
                  onClick={() => onIrASeccion("raspa")}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Abrir Raspa →
                </button>
              )}
            </div>
          </div>

          {/* Asesor Comercial IA */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">🤖 Asesor Comercial con IA (Aval-IA)</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.aiActivo ?? true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                    {borrador.aiActivo ?? true ? "Activo" : "Oculto"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Chatbot flotante inteligente que responde preguntas y promueve la compra de tokens 24/7.
                </p>
              </div>
              <Switch checked={borrador.aiActivo ?? true} onCheckedChange={() => toggleSwitch("aiActivo", borrador.aiActivo, true)} />
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
              <span>💡 Impulsa el cierre de ventas guiando a los usuarios al checkout.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PASARELAS Y MÉTODOS DE PAGO                                            */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <CreditCard className="size-5 text-emerald-500" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Pasarelas y Métodos de Pago Activos</h2>
            <p className="text-xs text-muted-foreground">
              Define cuáles formas de pago están disponibles para los usuarios en el checkout.
            </p>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* SINPE Móvil */}
          <div className="rounded-xl border border-emerald-500/40 bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="size-4 text-emerald-400" /> SINPE Móvil Oficial
              </span>
              <Switch checked={borrador.sinpeActivo !== false} onCheckedChange={() => toggleSwitch("sinpeActivo", borrador.sinpeActivo, true)} />
            </div>
            <p className="text-[11px] text-muted-foreground">Conciliación automática con 8634-4772.</p>
          </div>

          {/* Tarjetas TiloPay */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CreditCard className="size-4 text-blue-400" /> Tarjetas (TiloPay)
              </span>
              <Switch checked={borrador.tilopayActivo !== false} onCheckedChange={() => toggleSwitch("tilopayActivo", borrador.tilopayActivo, true)} />
            </div>
            <p className="text-[11px] text-muted-foreground">Visa y Mastercard con cobro directo.</p>
          </div>

          {/* PayPal */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CreditCard className="size-4 text-indigo-400" /> PayPal Internacional
              </span>
              <Switch checked={borrador.paypalActivo === true} onCheckedChange={() => toggleSwitch("paypalActivo", borrador.paypalActivo, false)} />
            </div>
            <p className="text-[11px] text-muted-foreground">Depósitos internacionales seguros.</p>
          </div>

          {/* Criptomonedas USDT */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Coins className="size-4 text-amber-400" /> Criptomonedas (USDT)
              </span>
              <Switch checked={borrador.cryptoActivo === true} onCheckedChange={() => toggleSwitch("cryptoActivo", borrador.cryptoActivo, false)} />
            </div>
            <p className="text-[11px] text-muted-foreground">Red TRC20 / BEP20 y Binance Pay.</p>
          </div>

          {/* Apple Pay */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="size-4 text-zinc-300" /> Apple Pay
              </span>
              <Switch checked={borrador.applePayActivo === true} onCheckedChange={() => toggleSwitch("applePayActivo", borrador.applePayActivo, false)} />
            </div>
            <p className="text-[11px] text-muted-foreground">Cobro rápido para dispositivos iOS.</p>
          </div>

          {/* Google Pay */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="size-4 text-emerald-400" /> Google Pay
              </span>
              <Switch checked={borrador.googlePayActivo === true} onCheckedChange={() => toggleSwitch("googlePayActivo", borrador.googlePayActivo, false)} />
            </div>
            <p className="text-[11px] text-muted-foreground">Cobro en un clic para Android.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardInterruptor({
  numero,
  titulo,
  desc,
  tip,
  activo,
  onToggle,
  destacado,
}: {
  numero: string;
  titulo: string;
  desc: string;
  tip?: string;
  activo: boolean;
  onToggle: () => void;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-colors ${
        destacado
          ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
          : activo
          ? "border-border bg-secondary/20 hover:border-amber-500/40"
          : "border-border/60 bg-secondary/10 opacity-75 hover:opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              {numero}. {titulo}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                activo
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {activo ? "Activo" : "Oculto"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
        <Switch checked={activo} onCheckedChange={onToggle} className="cursor-pointer shrink-0" />
      </div>

      {tip && (
        <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
          <span>{tip}</span>
        </div>
      )}
    </div>
  );
}
