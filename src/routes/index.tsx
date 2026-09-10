import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Compass,
  Coins,
  Crown,
  FileCheck,
  Flame,
  Fuel,
  Gauge,
  Gift,
  Key,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StickersModal, type Paquete } from "@/components/StickersModal";
import { JuegosExpressModal } from "@/components/JuegosExpressModal";
import { GanadoresSection } from "@/components/GanadoresSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { FlyerPromocional } from "@/components/FlyerPromocional";
import { FomoNotifications } from "@/components/FomoNotifications";
import { RankingReferidos } from "@/components/RankingReferidos";
import { ReferidosLandingSection } from "@/components/ReferidosLandingSection";
import { MiniSorteosSection } from "@/components/MiniSorteosSection";
import { SuperTokenSection } from "@/components/SuperTokenSection";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import carroImg from "@/assets/premio-carro.jpg";
import motoImg from "@/assets/premio-moto.jpg";
import consolaImg from "@/assets/premio-consola.jpg";
import subaruImg from "@/assets/premio-subaru.jpg";
import { fetchOrdenes, type Orden } from "@/lib/orders";
import {
  fetchPremios,
  fetchInventario,
  fetchSorteo,
  fetchConfig,
  type Premio,
  type Config,
  type Sorteo,
  PREMIOS_DEFAULT,
  SORTEO_DEFAULT,
  CONFIG_DEFAULT,
  FEATURES_DEFAULT,
} from "@/lib/admin-store";
import {
  fechaSorteoATimestamp,
  formatearFechaLarga,
  formatearHora12,
  obtenerEstadoSorteo,
  type EstadoSorteo,
} from "@/lib/fecha-utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const [premios, inventario, sorteo, config, ordenes] = await Promise.all([
        fetchPremios(),
        fetchInventario(),
        fetchSorteo(),
        fetchConfig(),
        fetchOrdenes().catch(() => []),
      ]);
      return { premios, inventario, sorteo, config, ordenes };
    } catch {
      return {
        premios: PREMIOS_DEFAULT,
        inventario: { total: 0, disponibles: 0, fecha: "" },
        sorteo: SORTEO_DEFAULT,
        config: CONFIG_DEFAULT,
        ordenes: [],
      };
    }
  },
  head: () => ({
    meta: [
      { title: "Aval Community CR | Eventos Promocionales Oficiales" },
      {
        name: "description",
        content:
          "Adquiere tus Tokens digitales oficiales y participa por vehículos de alta gama y premios en efectivo desde solo ₡4,000. 100% auditado con la Emisión Oficial de la JPS.",
      },
      { property: "og:title", content: "Aval Community CR | Eventos Promocionales Oficiales" },
      {
        property: "og:description",
        content: "La plataforma de eventos promocionales y tokens digitales más transparente de Costa Rica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

const PAQUETES_DEFAULT: Paquete[] = [
  { cantidad: 4, precio: 4000 },
  { cantidad: 8, precio: 8000 },
  { cantidad: 12, precio: 12000 },
  { cantidad: 24, precio: 24000 },
];

function useCuentaRegresiva(fechaObjetivo: string, horaObjetivo?: string, horasCierrePrevio?: number) {
  const [t, setT] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
    estado: EstadoSorteo;
    terminado: boolean;
  }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
    estado: "VENTAS_ABIERTAS",
    terminado: false,
  });

  useEffect(() => {
    const tick = () => {
      const res = obtenerEstadoSorteo(fechaObjetivo, horaObjetivo, horasCierrePrevio);
      const diff = Math.max(0, res.msParaSorteo);
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
        estado: res.estado,
        terminado: res.msParaSorteo <= 0,
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [fechaObjetivo, horaObjetivo, horasCierrePrevio]);

  return t;
}

// formatearFechaLarga viene de @/lib/fecha-utils (importado arriba)
// No se define aquí para evitar duplicación y posibles inconsistencias.


function formatNumber(val: number | string): string {
  const num = Math.round(Number(val) || 0);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function calcularPaquetes(sorteoActual: Sorteo): Paquete[] {
  const mod = sorteoActual.modalidadVenta || "escalonado";

  if (mod === "fijo_3x5000") {
    const precio = Number(sorteoActual.precioBase) >= 2000 ? Number(sorteoActual.precioBase) : 4000;
    return [{ cantidad: 3, precio }];
  }

  if (mod === "multiplos_3") {
    // Si el admin puso un monto >= 2500, se usa ese como base para cada 3 tokens; sino el estándar ₡4.000
    const baseTrio = Number(sorteoActual.precioBase) >= 2500 ? Number(sorteoActual.precioBase) : 4000;
    return [
      { cantidad: 3, precio: baseTrio, popular: false },
      { cantidad: 6, precio: baseTrio * 2, popular: true, tag: "EL MEJOR · MÁS VENDIDO" },
      { cantidad: 9, precio: baseTrio * 3, popular: false },
      { cantidad: 12, precio: baseTrio * 4, popular: false },
      { cantidad: 15, precio: baseTrio * 5, popular: false },
      { cantidad: 18, precio: baseTrio * 6, popular: false },
      { cantidad: 21, precio: baseTrio * 7, popular: false },
      { cantidad: 24, precio: baseTrio * 8, popular: false },
    ];
  }

  // "escalonado" clásico (₡1 000 por token estándar)
  const baseToken = Number(sorteoActual.precioBase) > 0 && Number(sorteoActual.precioBase) <= 2500
    ? Number(sorteoActual.precioBase)
    : 1000;

  return [
    { cantidad: 4, precio: baseToken * 4, popular: false },
    { cantidad: 8, precio: baseToken * 8, popular: true, tag: "MÁS POPULAR" },
    { cantidad: 12, precio: baseToken * 12, popular: false },
    { cantidad: 24, precio: baseToken * 24, popular: false },
  ];
}

function calcularCostoSuperToken(cantidad: number, precioBaseSuperToken: number = 1500): number {
  const grupos = Math.max(1, Math.round(cantidad / 3));
  return grupos * precioBaseSuperToken;
}

function calcularProgresoTermometro(
  cfg: Config,
  ordenes?: Orden[],
  inventario?: { total: number; disponibles: number } | null
): number {
  if (typeof cfg.termometroPorcentajeManual === "number" && cfg.termometroPorcentajeManual > 0) {
    return cfg.termometroPorcentajeManual;
  }
  const meta = (cfg.termometroMetaTokens && cfg.termometroMetaTokens !== 5000 && cfg.termometroMetaTokens >= 10000)
    ? cfg.termometroMetaTokens
    : 100000;

  // 1. Prioridad: Conteo real de tokens de órdenes aprobadas en Supabase
  if (ordenes && ordenes.length > 0) {
    const tokensAprobados = ordenes
      .filter((o) => o.estado === "aprobada")
      .reduce((sum, o) => sum + (Number(o.cantidad) || 0), 0);
    if (tokensAprobados > 0) {
      const raw = (tokensAprobados / meta) * 100;
      const formatted = raw < 10 ? Math.round(raw * 10) / 10 : Math.round(raw);
      return Math.min(98, Math.max(0.5, formatted));
    }
  }

  // 2. Respaldo: Inventario general
  if (inventario && inventario.total > 0) {
    const vendidos = inventario.total - inventario.disponibles;
    if (vendidos > 0) {
      const raw = (vendidos / meta) * 100;
      const formatted = raw < 10 ? Math.round(raw * 10) / 10 : Math.round(raw);
      return Math.min(98, Math.max(0.5, formatted));
    }
  }

  return 2.0;
}

function IndexPage() {
  const loaderData = Route.useLoaderData();
  const [paquete, setPaquete] = useState<Paquete | null>(null);
  const [open, setOpen] = useState(false);
  const [premios, setPremios] = useState<Premio[]>(loaderData?.premios || PREMIOS_DEFAULT);
  const [sorteo, setSorteo] = useState<Sorteo>(loaderData?.sorteo || SORTEO_DEFAULT);
  const [config, setConfig] = useState<Config>(loaderData?.config || CONFIG_DEFAULT);
  const [fechaSorteo, setFechaSorteo] = useState(loaderData?.sorteo?.fecha || "2026-09-13");
  const [paquetes, setPaquetes] = useState<Paquete[]>(() => {
    const sorteoActual = loaderData?.sorteo || SORTEO_DEFAULT;
    return calcularPaquetes(sorteoActual);
  });
  const [progreso, setProgreso] = useState(() => {
    const cfg = loaderData?.config || CONFIG_DEFAULT;
    return calcularProgresoTermometro(cfg, loaderData?.ordenes, loaderData?.inventario);
  });
  const [openRaspa, setOpenRaspa] = useState(false);
  const [fotoZoom, setFotoZoom] = useState<{ url: string; titulo: string; nivel?: string } | null>(null);

  const superMoneda = config.supertokenMoneda || (Number(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 0) > 50000 ? "CRC" : "CRC");
  const superSimbolo = superMoneda === "CRC" ? "₡" : "$";
  const superCodigo = superMoneda === "CRC" ? "CRC" : "USD";

  const t = useCuentaRegresiva(fechaSorteo, sorteo.horaSorteo, config.horasCierrePrevio);
  const ventasAbiertas = config.ventasActivas && t.estado === "VENTAS_ABIERTAS";
  const cierrePrevio = t.estado === "CIERRE_PREVIO";
  const enCurso = t.estado === "EN_CURSO" || t.estado === "FINALIZADO";

  const featureIcons = [Gauge, Compass, Star, FileCheck];

  const metodosActivosLista = [
    { id: "sinpe", nombre: "SINPE Móvil", icono: "📱", activo: config.sinpeActivo ?? true },
    { id: "tarjeta", nombre: "Tarjeta", icono: "💳", activo: config.tilopayActivo ?? true },
    { id: "paypal", nombre: "PayPal", icono: "🅿️", activo: config.paypalActivo ?? true },
    { id: "applepay", nombre: "Apple Pay", icono: "🍏", activo: config.applePayActivo ?? true },
    { id: "googlepay", nombre: "Google Pay", icono: "🌐", activo: config.googlePayActivo ?? true },
    { id: "crypto", nombre: "Cripto USDT", icono: "🪙", activo: config.cryptoActivo ?? true },
  ].filter((m) => m.activo);

  const nombresMetodos = metodosActivosLista.map((m) => m.nombre);
  const tituloPaso2 =
    nombresMetodos.length === 0
      ? "Paga de Forma Segura"
      : nombresMetodos.length <= 2
      ? `Paga con ${nombresMetodos.join(" o ")}`
      : `Paga con ${nombresMetodos.slice(0, 3).join(", ")}${nombresMetodos.length > 3 ? " y más" : ""}`;

  const descPaso2 =
    nombresMetodos.length === 0
      ? "Transfiere a nuestra cuenta oficial o paga con tarjeta para validación inmediata."
      : `Aceptamos ${nombresMetodos.join(", ")} con validación inmediata y máxima seguridad.`;

  const premiosVisibles = premios.filter((p) => p.activo !== false);
  const primerPremioVisible = premiosVisibles[0] || premios[0];
  const premioMayorActual = primerPremioVisible?.nombre || sorteo.titulo || "el Premio Mayor";
  const descPaso3 = `El sorteo se determina con los resultados de la Emisión Oficial de la JPS. Si aciertas tu número, te llevas ${premioMayorActual} (vehículo 0KM, moto, casa, dinero en efectivo o el premio activo).`;

  const pasos = [
    {
      num: "01",
      titulo: "Elige tus Tokens",
      desc: "Selecciona el paquete digital que prefieras. Puedes asignar tus números al azar o escribir tus números favoritos.",
    },
    {
      num: "02",
      titulo: tituloPaso2,
      desc: descPaso2,
    },
    {
      num: "03",
      titulo: "¡Participa con Resultados Oficiales!",
      desc: descPaso3,
    },
  ];

  useEffect(() => {
    async function cargar() {
      try {
        const [premiosData, inventarioData, sorteoData, configData, ordenesData] = await Promise.all([
          fetchPremios(),
          fetchInventario(),
          fetchSorteo(),
          fetchConfig(),
          fetchOrdenes().catch(() => []),
        ]);

        const cfgActual = configData || config;
        if (premiosData && premiosData.length > 0) {
          setPremios(premiosData);
        }
        if (configData) {
          setConfig(configData);
        }
        if (sorteoData) {
          setSorteo(sorteoData);
          if (sorteoData.fecha) setFechaSorteo(sorteoData.fecha);
          setPaquetes(calcularPaquetes(sorteoData));
        }

        setProgreso(calcularProgresoTermometro(cfgActual, ordenesData, inventarioData));
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }
    void cargar();
  }, []);

  const abrirWhatsAppPreventa = (textoExtra = "") => {
    const rawTel = (config.promoWhatsapp || config.telefonoSinpe || "50686344772").replace(/\D/g, "");
    const tel = (rawTel.includes("8609") || !rawTel)
      ? "50686344772"
      : (rawTel.startsWith("506") ? rawTel : `506${rawTel}`);
    const baseMsg = `Hola Aval Community CR, me interesa información sobre el próximo gran evento y la preventa exclusiva de tokens. ${textoExtra}`;
    const url = `https://wa.me/${tel}?text=${encodeURIComponent(baseMsg)}`;
    window.open(url, "_blank");
  };

  const abrir = (p: Paquete) => {
    if (cierrePrevio || enCurso) {
      window.location.href = "/validar";
      return;
    }
    if (!config.ventasActivas) {
      abrirWhatsAppPreventa(`Me interesa apartar el paquete de ${p.cantidad} Tokens (₡${formatNumber(p.precio)}).`);
      return;
    }
    setPaquete(p);
    setOpen(true);
  };

  const irAPaquetes = () => {
    if (cierrePrevio || enCurso) {
      window.location.href = "/validar";
      return;
    }
    if (!config.ventasActivas) {
      abrirWhatsAppPreventa();
      return;
    }
    const el = document.getElementById("tickets-seleccion") || document.getElementById("paquetes-compra");
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 85;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    } else {
      abrir(paquetes[2] || paquetes[0] || { cantidad: 12, precio: 12000 });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Barra de Notificación Superior */}
      <div className={`py-2 text-center text-xs font-semibold text-primary-foreground tracking-wider uppercase ${
        cierrePrevio
          ? "bg-amber-600 animate-pulse text-black font-black"
          : enCurso
          ? "bg-red-600 font-black text-white"
          : "bg-[image:var(--gradient-fire)]"
      }`}>
        {enCurso
          ? "🎯 ¡SORTEO OFICIAL EN PROCESO! · TRANSMISIÓN Y AUDITORÍA EN CURSO"
          : cierrePrevio
          ? `🔒 VENTAS CERRADAS · PREPARANDO SORTEO OFICIAL DE LAS ${formatearHora12(sorteo.horaSorteo || "19:30")}`
          : config.ventasActivas
          ? "🔥 Edición Especial 2026 · Más del 85% de Tokens colocados · ¡Quedan pocos cupos!"
          : config.promoTitulo || "🔥 GRAN EVENTO PROMOCIONAL 2026 · ¡PRÓXIMAMENTE!"}
      </div>

      {/* Header Sticky */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <img src="/isotipo.png" alt="Aval Community CR" className="size-6 sm:size-7 object-contain shrink-0" />
            <span className="font-display text-lg sm:text-2xl tracking-widest whitespace-nowrap">
              AVAL <span className="text-primary">COMMUNITY CR</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenRaspa(true)}
                className="hidden md:inline-flex h-8 px-3 text-xs border-amber-500/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-bold gap-1.5"
              >
                {sorteo.raspaConfig?.modo === "ruleta" ? (
                  <>
                    <span className="text-sm">🎡</span> Ruleta de la Fortuna
                  </>
                ) : sorteo.raspaConfig?.modo === "ambos" ? (
                  <>
                    <Sparkles className="size-3.5 text-amber-400" /> Raspa y Ruleta
                  </>
                ) : (
                  <>
                    <Gift className="size-3.5 text-amber-400" /> Raspa y Gana
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden md:inline-flex h-8 px-2 sm:px-3 text-xs sm:text-sm text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 font-semibold"
            >
              <Link to="/remates">
                <span className="mr-1">🏷️</span> Remates VIP
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm text-neutral-300 hover:text-white"
            >
              <Link to="/validar">Validar Tokens</Link>
            </Button>
            <Button
              variant="hero"
              size="sm"
              onClick={irAPaquetes}
              className={`h-8 px-3 sm:px-4 text-xs sm:text-sm font-bold whitespace-nowrap ${
                cierrePrevio
                  ? "bg-amber-600 hover:bg-amber-500 text-black shadow-none"
                  : enCurso
                  ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                  : "shadow-[var(--shadow-fire)]"
              }`}
            >
              {enCurso
                ? "🎯 Sorteo en Vivo"
                : cierrePrevio
                ? "🔒 Sorteo en Breve"
                : config.ventasActivas
                ? "Participar"
                : "🔥 Preventa"}
            </Button>
          </div>
        </div>
      </header>

      {/* Botón Flotante Móvil de Juegos Express */}
      {Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno" && (
        <button
          type="button"
          onClick={() => setOpenRaspa(true)}
          className="md:hidden fixed bottom-22 right-4 z-30 flex items-center gap-2 rounded-full border-2 border-amber-400 bg-zinc-950/95 px-3.5 py-2 text-xs font-black text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] backdrop-blur active:scale-95 transition-transform"
        >
          <span className="text-base">
            {sorteo.raspaConfig?.modo === "ruleta" ? "🎡" : sorteo.raspaConfig?.modo === "ambos" ? "✨" : "🎁"}
          </span>
          <span>
            {sorteo.raspaConfig?.modo === "ruleta"
              ? "Ruleta Express"
              : sorteo.raspaConfig?.modo === "ambos"
                ? "Raspa y Ruleta"
                : "Raspa y Gana"}
          </span>
        </button>
      )}

      <main>
        {/* HERO SECTION DE ALTO IMPACTO */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
          {/* Luces de fondo */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[42rem] rounded-full bg-primary/20 blur-[150px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 size-[25rem] rounded-full bg-amber-500/10 blur-[120px]" />

          <div className="relative mx-auto max-w-6xl px-5 text-center">
            {/* Badges de Conversión en el Hero */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                enCurso
                  ? "border-red-500/50 bg-red-500/15 text-red-400 animate-pulse"
                  : cierrePrevio
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-400 font-bold"
                  : "border-primary/50 bg-primary/10 text-primary"
              }`}>
                <Sparkles className="size-3.5" />{" "}
                {enCurso
                  ? "🎯 SORTEO OFICIAL EN CURSO"
                  : cierrePrevio
                  ? "🔒 VENTAS CERRADAS · PREPARANDO EMISIÓN"
                  : config.ventasActivas
                  ? "Evento Promocional Oficial Costa Rica"
                  : "🔥 PREVENTA EXCLUSIVA 2026"}
              </div>

              {/* Badge del Paquete Más Popular destacado arriba (₡8 000) */}
              {paquetes.length > 1 && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 shadow-md">
                  <Flame className="size-3.5 text-amber-400" />
                  <span>{`Más Popular: ${(paquetes.find(p => p.popular) || paquetes[1])?.cantidad} Tokens por ₡${formatNumber((paquetes.find(p => p.popular) || paquetes[1])?.precio || 8000)}`}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-500">
                <Crown className="size-3.5 text-amber-400" />
                <span>{`SuperToken: Hasta +${superSimbolo}${formatNumber(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000)} ${superCodigo} Cash Extra`}</span>
              </div>

              {/* Badge Mini-Sorteos Semanales Gasolina + Play */}
              {config.miniSorteosActivo !== false && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/60 bg-emerald-500/15 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-md">
                  <Fuel className="size-3.5 text-emerald-400" />
                  <span>⛽ Viernes de Tanque Lleno (₡50k Gasolina) + 🎮 Domingos de Play 5</span>
                </div>
              )}
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase">
              {sorteo.heroTitulo ? (
                sorteo.heroTitulo
              ) : (
                <>
                  ¿Te imaginas estrenar tu <span className="text-fire">{primerPremioVisible?.nombre || "Moto Alta Cilindrada"}</span>{` desde solo ₡${formatNumber(paquetes[0]?.precio || 4000)}?`}
                </>
              )}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {cierrePrevio
                ? `Las ventas para esta edición han finalizado formalmente 2 horas antes para auditoría. El sorteo oficial inicia a las ${formatearHora12(sorteo.horaSorteo || "19:30")}.`
                : enCurso
                ? "El sorteo oficial se encuentra en transmisión y verificación de números favorecidos. Consulta tus tokens en el validador."
                : config.ventasActivas
                ? "La plataforma de eventos promocionales digitales más transparente de Costa Rica. Auditados directamente con los resultados oficiales."
                : config.promoSubtitulo || "Estamos afinando los últimos detalles. ¡Escríbenos por WhatsApp para ser de los primeros en acceder a la Preventa Exclusiva y asegurar tus números!"}
            </p>

            {/* Imagen Principal Showcase con Badges Flotantes y Clic para Ampliar */}
            <div
              className="relative mx-auto mt-12 max-w-5xl group cursor-zoom-in"
              onClick={() =>
                setFotoZoom({
                  url: primerPremioVisible?.imagen || carroImg,
                  titulo: primerPremioVisible?.nombre || "Gran Entrega 2026",
                  nivel: "1° Lugar · Premio Mayor",
                })
              }
            >
              <div className="overflow-hidden rounded-3xl border-2 border-primary/40 bg-neutral-950 p-2 sm:p-4 shadow-[var(--shadow-card)] transition-all duration-500 group-hover:scale-[1.01] group-hover:border-primary/70 relative min-h-[340px] sm:min-h-[480px] flex items-center justify-center">
                {/* Fondo difuminado para rellenar los bordes con los tonos reales de la foto */}
                <img
                  src={primerPremioVisible?.imagen || carroImg}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-125 pointer-events-none"
                />
                {/* Vehículo completo que se amolda al 100% sin recortarse */}
                <img
                  src={primerPremioVisible?.imagen || carroImg}
                  alt={primerPremioVisible?.nombre || "Gran Entrega 2026"}
                  className="relative z-0 max-h-[460px] sm:max-h-[520px] max-w-full w-auto h-auto object-contain mx-auto rounded-2xl brightness-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
                />

                {/* Botón flotante para indicar que se puede ampliar */}
                <div className="absolute bottom-4 left-6 hidden sm:flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 border border-white/20 backdrop-blur shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <ZoomIn className="size-3.5 text-amber-400" /> Clic para ampliar en grande
                </div>
              </div>

              {/* Badges Flotantes de Lujo */}
              <div className="absolute -top-4 left-6 hidden sm:flex items-center gap-2 rounded-xl border border-primary/40 bg-card/90 px-4 py-2 text-xs font-bold text-foreground backdrop-blur shadow-lg pointer-events-none">
                <Key className="size-4 text-primary" /> 0 Kilómetros · Año 2026
              </div>

              <div className="absolute -top-4 right-6 hidden sm:flex items-center gap-2 rounded-xl border border-amber-500/50 bg-card/90 px-4 py-2 text-xs font-bold text-amber-400 backdrop-blur shadow-lg pointer-events-none">
                <Crown className="size-4 text-amber-500" />
                <span>{`Bono +${superSimbolo}${formatNumber(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000)} ${superCodigo} con SuperToken`}</span>
              </div>

              <div className="absolute -bottom-4 right-6 hidden sm:flex items-center gap-2 rounded-xl border border-success/40 bg-card/90 px-4 py-2 text-xs font-bold text-success backdrop-blur shadow-lg pointer-events-none">
                <ShieldCheck className="size-4 text-success" /> Traspaso y Marchamo Incluidos
              </div>
            </div>

            {/* Termómetro de Disponibilidad y Cuenta Regresiva Oficial en el Hero */}
            <div className={`mx-auto mt-10 max-w-2xl rounded-2xl border-2 p-5 backdrop-blur text-left ${
              enCurso
                ? "border-red-500/60 bg-red-950/90 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
                : cierrePrevio
                ? "border-amber-500/70 bg-amber-950/80 shadow-[0_0_35px_rgba(245,158,11,0.25)]"
                : "border-amber-500/40 bg-zinc-950/90 shadow-[0_0_35px_rgba(245,158,11,0.15)]"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      enCurso ? "bg-red-400" : cierrePrevio ? "bg-amber-400" : "bg-emerald-400"
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      enCurso ? "bg-red-500" : cierrePrevio ? "bg-amber-500" : "bg-emerald-500"
                    }`}></span>
                  </span>
                  <span className={`font-black uppercase tracking-wider text-xs ${
                    enCurso ? "text-red-400" : cierrePrevio ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {enCurso
                      ? "🎯 Sorteo Oficial en Curso"
                      : cierrePrevio
                      ? "🔒 Ventas Cerradas (Conteo Final)"
                      : config.ventasActivas
                      ? "Ventas Abiertas en Vivo"
                      : "Preventa Exclusiva"}
                  </span>
                </div>
                <span className="font-mono text-lg sm:text-xl font-black text-amber-400 flex items-center gap-1.5" suppressHydrationWarning>
                  <Flame className="size-5 text-amber-500 fill-amber-500" />
                  {`${progreso}% Vendido`}
                </span>
              </div>

              {/* Barra Brillante */}
              <div className="mt-3.5 h-4 w-full overflow-hidden rounded-full bg-secondary/80 p-0.5 border border-amber-500/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-primary transition-all duration-700 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(progreso, 2))}%` }}
                />
              </div>

              {/* Fecha y Contador en vivo */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5" suppressHydrationWarning>
                  <Calendar className="size-3.5 text-primary" />
                  Sorteo Oficial: <strong className="text-foreground">{formatearFechaLarga(fechaSorteo)} · {formatearHora12(sorteo.horaSorteo || "19:30")}</strong>
                </span>
                <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm" suppressHydrationWarning>
                  {enCurso
                    ? "🎯 En transmisión oficial"
                    : cierrePrevio
                    ? `⏳ Sorteo en: ${t.h}h ${t.m}m ${t.s}s`
                    : `⏳ Faltan: ${t.d}d ${t.h}h ${t.m}m ${t.s}s`}
                </span>
              </div>
            </div>

            {/* CTA Principal de Conversión */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={irAPaquetes}
                className={`w-full sm:w-auto text-base px-8 py-7 group cursor-pointer ${
                  cierrePrevio
                    ? "bg-amber-500 hover:bg-amber-400 text-black font-black shadow-lg"
                    : enCurso
                    ? "bg-red-600 hover:bg-red-500 text-white font-black animate-pulse"
                    : "shadow-[var(--shadow-fire)]"
                }`}
              >
                {enCurso ? (
                  <>🎯 ¡SORTEO EN TRANSMISIÓN OFICIAL! (VALIDAR TOKENS) →</>
                ) : cierrePrevio ? (
                  <>🔒 VENTAS CERRADAS · CONSULTAR MIS TOKENS →</>
                ) : config.ventasActivas ? (
                  <>
                    🔥 ¡QUIERO PARTICIPAR AHORA!{" "}
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </>
                ) : (
                  <>
                    {config.promoBotonTexto || "📲 ¡NOTIFICARME POR WHATSAPP (PREVENTA)!"}
                  </>
                )}
              </Button>
              <Button variant="outline" size="xl" asChild className="w-full sm:w-auto text-base px-8 py-7">
                <a href="#como-funciona">¿Cómo funciona? ↓</a>
              </Button>
            </div>

            {/* Micro-prueba social */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" /> Pago Seguro SINPE y Tarjeta
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" /> Resultados Oficiales Públicos
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" /> Entrega Formal ante Notario
              </div>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA EN 3 PASOS (PROCESO 100% DIGITAL Y TRANSPARENTE) */}
        <section id="como-funciona" className="py-20 bg-secondary/30 border-y border-border">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Proceso 100% Digital y Transparente
              </span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
                Participa en 3 Simples Pasos
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sin filas ni boletos físicos. Todo queda registrado digitalmente en tu dispositivo.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {pasos.map((paso, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="font-display text-6xl text-primary/30">{paso.num}</div>
                    <h3 className="mt-4 font-bold text-xl">{paso.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{paso.desc}</p>
                    {idx === 1 && metodosActivosLista.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {metodosActivosLista.map((m) => (
                          <span
                            key={m.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-xs"
                          >
                            <span>{m.icono}</span>
                            <span>{m.nombre}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="hero" size="xl" onClick={irAPaquetes} className="px-10 py-7 text-base shadow-[var(--shadow-fire)] cursor-pointer">
                {config.ventasActivas ? "Comenzar y Elegir mis Tokens →" : "🔥 Consultar Preventa por WhatsApp →"}
              </Button>
            </div>
          </div>
        </section>

        {/* LAS ENTREGAS DE LA EDICIÓN (CUADRÍCULA DINÁMICA AUTO-ADAPTABLE) */}
        {premiosVisibles.length > 0 && (
          <section className="bg-secondary/40 py-20 border-y border-border">
            <div className="mx-auto max-w-7xl px-5">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Más oportunidades de ser favorecido
                </span>
                <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
                  {premiosVisibles.length === 1
                    ? "Gran Entrega Destacada"
                    : premiosVisibles.length === 2
                    ? "Dos Entregas Espectaculares"
                    : premiosVisibles.length === 3
                    ? "Tres Entregas Espectaculares"
                    : premiosVisibles.length === 4
                    ? "Cuatro Entregas de Lujo"
                    : `${premiosVisibles.length} Entregas Espectaculares`}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {premiosVisibles.length === 1
                    ? "Con cada paquete de Tokens participas directamente por la Gran Entrega según las combinaciones oficiales."
                    : premiosVisibles.length === 2
                    ? "Con cada paquete adquieres doble oportunidad según las combinaciones oficiales."
                    : premiosVisibles.length === 3
                    ? "Con cada paquete adquieres triple oportunidad según las combinaciones oficiales."
                    : `Con cada paquete adquieres múltiples oportunidades (${premiosVisibles.length} entregas) según las combinaciones oficiales.`}
                </p>
              </div>

              {/* Banner Dinámico de Dinámica / Regla de Premiación */}
              {sorteo.reglaPremios && (
                <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/10 p-5 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                    <Award className="size-4 text-amber-400" /> Dinámica Oficial de Premiación
                  </div>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                    {sorteo.reglaPremios}
                  </p>
                </div>
              )}

              <div
                className={`mt-12 grid gap-6 ${
                  premiosVisibles.length === 1
                    ? "max-w-md mx-auto"
                    : premiosVisibles.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                    : premiosVisibles.length === 3
                    ? "grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
                }`}
              >
                {premiosVisibles.map((p, idx) => {
                  const nivelStr = (p.nivel || "").trim();
                  const isEleccion1 = nivelStr === "1° Lugar (A Elección)";
                  const isEleccion2 = nivelStr === "2° Lugar (A Elección)";
                  const isEfectivo3 = nivelStr === "3° Lugar (Efectivo)";
                  const isExtra = nivelStr === "Premio Extra";
                  const isMayor = isEleccion1 || nivelStr === "Premio Mayor" || (idx === 0 && !isEleccion2 && !isEfectivo3 && !isExtra);
                  const isSegundo = isEleccion2 || nivelStr === "Segundo Premio" || (idx === 1 && !isEleccion1 && !isEfectivo3 && !isExtra);

                  const tagLugar = isEleccion1
                    ? "1° Lugar · A Elección"
                    : isEleccion2
                    ? "2° Lugar · Restante"
                    : isEfectivo3
                    ? "3° Lugar · Efectivo"
                    : isExtra
                    ? "Premio Extra"
                    : isMayor
                    ? "1° Lugar"
                    : isSegundo
                    ? "2° Lugar"
                    : "3° Lugar";

                  const nombreLower = (p.nombre || "").toLowerCase();
                  const defaultImg =
                    nombreLower.includes("subaru") || nombreLower.includes("impreza")
                      ? subaruImg
                      : nombreLower.includes("moto")
                      ? motoImg
                      : nombreLower.includes("playstation") || nombreLower.includes("consola") || nombreLower.includes("efectivo")
                      ? consolaImg
                      : isMayor
                      ? carroImg
                      : isSegundo
                      ? motoImg
                      : consolaImg;

                  const tagBadgeClass =
                    isMayor || isEleccion1
                      ? "bg-amber-500 text-black border border-amber-400 font-bold"
                      : isEleccion2
                      ? "bg-blue-600 text-white border border-blue-400 font-bold"
                      : isSegundo
                      ? "bg-black/80 text-slate-200 border border-slate-500/60 font-bold"
                      : isEfectivo3
                      ? "bg-emerald-600 text-white border border-emerald-400 font-bold"
                      : isExtra
                      ? "bg-purple-600 text-white border border-purple-400 font-bold"
                      : "bg-black/80 text-zinc-300 border border-white/20 font-bold";

                  const cardBorderClass =
                    isMayor || isEleccion1
                      ? "border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.12)]"
                      : isEleccion2
                      ? "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      : isEfectivo3
                      ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "border-border";

                  return (
                    <div
                      key={p.id || idx}
                      className={`group rounded-2xl border bg-card overflow-hidden shadow-[var(--shadow-card)] relative flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:shadow-xl ${cardBorderClass}`}
                    >
                      {/* Badges Flotantes de Posición y SuperToken */}
                      <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                        {config.supertokenActivo !== false && (
                          isMayor || isEleccion1 ? (
                            <span className="rounded-full bg-black/80 text-amber-400 border border-amber-500/60 px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur flex items-center gap-1 shadow-md">
                              <Crown className="size-3 text-amber-400" /> {`+${superSimbolo}${formatNumber(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000)} ${superCodigo}`}
                            </span>
                          ) : isSegundo || isEleccion2 ? (
                            <span className="rounded-full bg-black/80 text-sky-400 border border-sky-500/60 px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur flex items-center gap-1 shadow-md">
                              <Crown className="size-3 text-sky-400" /> {`+${superSimbolo}${formatNumber(config.supertokenPremioSegundoUsd || 250000)} ${superCodigo}`}
                            </span>
                          ) : isEfectivo3 ? (
                            <span className="rounded-full bg-black/80 text-yellow-400 border border-yellow-500/60 px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur flex items-center gap-1 shadow-md">
                              <Crown className="size-3 text-yellow-400" /> {`+${superSimbolo}${formatNumber(config.supertokenPremioTerceroUsd || 1500000)} ${superCodigo}`}
                            </span>
                          ) : null
                        )}
                        <span
                          className={`rounded-full px-3 py-0.5 text-[11px] uppercase backdrop-blur shadow-md ${tagBadgeClass}`}
                        >
                          {tagLugar}
                        </span>
                      </div>

                      {/* Foto que llena de forma atractiva la parte superior de la tarjeta con Clic para Ampliar */}
                      <div
                        className="relative w-full h-64 sm:h-72 overflow-hidden bg-neutral-900 cursor-zoom-in group/img"
                        onClick={() =>
                          setFotoZoom({
                            url: p.imagen || defaultImg,
                            titulo: p.nombre,
                            nivel: tagLugar,
                          })
                        }
                      >
                        <img
                          src={p.imagen || defaultImg}
                          alt={p.nombre}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105 brightness-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-black/30 pointer-events-none" />
                        <div className="absolute bottom-2.5 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1 backdrop-blur shadow-md">
                          <ZoomIn className="size-3 text-amber-400" /> Clic para ampliar
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xl leading-snug group-hover:text-primary transition-colors">
                            {p.nombre}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {isEleccion1
                              ? "Vehículo a escoger por el favorecido del 1° Lugar con traspaso notarial y marchamo incluidos."
                              : isEleccion2
                              ? "Vehículo adjudicado al 2° Lugar (el restante no seleccionado) 100% legal y listo para rodar."
                              : isEfectivo3
                              ? "Premio oficial en efectivo entregado formalmente o consola de última generación."
                              : isMayor
                              ? "Vehículo 0 KM con traspaso y marchamo incluidos."
                              : isSegundo
                              ? "Deportiva para dominar la calle y la pista con estilo."
                              : "Consola de última generación con controles y juegos incluidos."}
                          </p>
                        </div>
                        {config.supertokenActivo !== false && (
                          isMayor || isEleccion1 ? (
                            <p className="text-xs font-semibold text-amber-400 mt-3 pt-2.5 border-t border-amber-500/20 flex items-center gap-1.5">
                              <Crown className="size-3.5" /> {`Opción SuperToken: ¡+${superSimbolo}${formatNumber(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000)} ${superCodigo} Cash extra!`}
                            </p>
                          ) : isSegundo || isEleccion2 ? (
                            <p className="text-xs font-semibold text-sky-400 mt-3 pt-2.5 border-t border-sky-500/20 flex items-center gap-1.5">
                              <Crown className="size-3.5" /> {`Opción SuperToken: ¡+${superSimbolo}${formatNumber(config.supertokenPremioSegundoUsd || 250000)} ${superCodigo} Cash extra!`}
                            </p>
                          ) : isEfectivo3 ? (
                            <p className="text-xs font-semibold text-yellow-400 mt-3 pt-2.5 border-t border-yellow-500/20 flex items-center gap-1.5">
                              <Crown className="size-3.5" /> {`Opción SuperToken: ¡+${superSimbolo}${formatNumber(config.supertokenPremioTerceroUsd || 1500000)} ${superCodigo} Cash extra!`}
                            </p>
                          ) : null
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FICHA TÉCNICA DEL CARRO / PREMIO DETALLADO */}
        <section className="py-20 mx-auto max-w-6xl px-5 border-t border-border/40">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Gran Entrega Detallada
              </span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl leading-tight uppercase">
                {sorteo.detalleTitulo || (primerPremioVisible?.nombre ? `${primerPremioVisible.nombre}: Entrega Oficial y Garantizada` : "Vehículos de Alta Gama y Premios Oficiales")}
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {sorteo.detalleSubtitulo || "Vehículos certificados, sacados de agencia con garantía y entregados formalmente a tu nombre con marchamo y traspaso incluido."}
              </p>

              <div className="mt-8 space-y-4">
                {(sorteo.detalleFeatures && sorteo.detalleFeatures.length > 0 ? sorteo.detalleFeatures : FEATURES_DEFAULT).map((c: { titulo: string; desc: string }, i: number) => {
                  const Icono = featureIcons[i % featureIcons.length] || Gauge;
                  return (
                    <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-secondary/40 p-4">
                      <div className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
                        <Icono className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{c.titulo}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="overflow-hidden rounded-2xl border border-border shadow-lg bg-neutral-950 relative h-80 flex items-center justify-center group cursor-zoom-in"
                onClick={() =>
                  setFotoZoom({
                    url: sorteo.detalleImagen || premios[0]?.imagen || carroImg,
                    titulo: sorteo.detalleTitulo || "Entrega Detallada",
                    nivel: "Ficha Técnica",
                  })
                }
              >
                <img
                  src={sorteo.detalleImagen || premios[0]?.imagen || carroImg}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                />
                <img
                  src={sorteo.detalleImagen || premios[0]?.imagen || carroImg}
                  alt={sorteo.detalleTitulo || "Entrega Detallada"}
                  className="relative z-0 max-h-76 max-w-full w-auto h-auto object-contain p-2 drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-zinc-300 border border-white/15 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="size-3 text-amber-400" /> Clic para ampliar
                </div>
              </div>
              <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 to-transparent p-6">
                <h4 className="font-bold text-base text-primary flex items-center gap-2">
                  <Award className="size-5" /> Garantía Aval Community CR
                </h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {sorteo.detalleGarantia || "Si resultas favorecido, nos encargamos de todo el trámite de traspaso notarial, placas, marchamo del año y entrega con tanque lleno."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MODALIDAD VIP: SUPERTOKEN (1°, 2° Y 3° LUGAR EN EFECTIVO) */}
        {config.supertokenActivo !== false && (
          <div className="mx-auto max-w-6xl px-5 py-8">
            <SuperTokenSection config={config} />
          </div>
        )}

        {/* ZONA DE COMPRA Y CUENTA REGRESIVA */}
        <section className="py-20 mx-auto max-w-6xl px-5">
          {/* Contador y Progreso */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-card)] text-center mb-16 space-y-6">
            {/* Header del contador y estado */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    enCurso ? "bg-red-400" : cierrePrevio ? "bg-amber-400" : "bg-emerald-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    enCurso ? "bg-red-500" : cierrePrevio ? "bg-amber-500" : "bg-emerald-500"
                  }`}></span>
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  enCurso ? "text-red-400" : cierrePrevio ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {enCurso
                    ? "🎯 Sorteo Oficial en Curso"
                    : cierrePrevio
                    ? "🔒 Ventas Cerradas (Conteo Final)"
                    : config.ventasActivas
                    ? "Ventas Abiertas"
                    : "Preventa Exclusiva"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5 text-primary" />
                <span suppressHydrationWarning>
                  Sorteo Oficial: <strong className="text-foreground" suppressHydrationWarning>{formatearFechaLarga(fechaSorteo)} · {formatearHora12(sorteo.horaSorteo || "19:30")}</strong>
                </span>
              </div>
            </div>

            {/* Cuenta Regresiva */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                {enCurso ? "Sorteo Oficial en proceso de transmisión" : "Tiempo restante para el Sorteo Oficial"}
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                {[
                  { label: "Días", val: t.d },
                  { label: "Horas", val: t.h },
                  { label: "Min", val: t.m },
                  { label: "Seg", val: t.s },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border/80 bg-secondary/50 p-2.5 sm:p-3.5 text-center shadow-inner"
                  >
                    <div className="font-mono text-2xl sm:text-4xl font-black text-primary tracking-tight" suppressHydrationWarning>
                      {String(item.val).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barra de Progreso del Evento */}
            <div className="space-y-2.5 max-w-xl mx-auto pt-2">
              <div className="flex items-end justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-muted-foreground">
                  <Flame className="size-4 text-amber-500 fill-amber-500" />
                  {config.termometroFaseTitulo || "Progreso de la Edición"}
                </span>
                <span className="font-mono text-base sm:text-lg font-black text-foreground" suppressHydrationWarning>
                  {`${progreso}% Vendido`}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/80 p-0.5 border border-border/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-primary transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(100, Math.max(progreso, 2))}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                ⚡ Asignación oficial en tiempo real · 100% verificado en Supabase
              </p>
            </div>

            {/* Tarjetas de Transparencia y Reglas (Estándar Competencia) */}
            <div className="grid sm:grid-cols-2 gap-3.5 text-left pt-4 border-t border-border/60">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-400" /> Si llegamos al 100%
                </span>
                <h4 className="font-bold text-sm text-foreground">Cierre Inmediato del Sorteo</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  La edición se cierra y el ganador se define oficialmente con la Emisión Oficial de la JPS más cercana.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-amber-400" /> Garantía de Cumplimiento
                </span>
                <h4 className="font-bold text-sm text-foreground">La Edición Continúa</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Si al vencer el contador aún falta meta para cubrir el vehículo, se traslada la fecha de cierre. Todos los tokens pagados conservan 100% su validez.
                </p>
              </div>
            </div>
          </div>

          <div id="paquetes-compra" className="scroll-mt-28" />
          <div id="tickets-seleccion" className="text-center max-w-2xl mx-auto scroll-mt-28">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              {cierrePrevio || enCurso
                ? "🔒 Emisión en Proceso"
                : config.ventasActivas
                ? "Elige tu Paquete Digital"
                : "🔥 Preventa Exclusiva de Tokens"}
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
              {cierrePrevio || enCurso
                ? "Ventas Finalizadas para esta Edición"
                : paquetes.length === 1
                ? "Adquiere tus Tokens Digitales"
                : config.ventasActivas
                ? "Elige tu paquete de Tokens"
                : "Paquetes Oficiales del Evento"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {cierrePrevio
                ? `Las ventas para este evento han cerrado formalmente 2 horas antes para el escrutinio notarial y preparación del sorteo de las ${formatearHora12(sorteo.horaSorteo || "19:30")}. Puedes consultar tus números en el validador.`
                : enCurso
                ? "El evento promocional se encuentra en proceso de transmisión y verificación de ganadores oficiales."
                : paquetes.length === 1
                ? `Participa con tu paquete especial de ${paquetes[0]?.cantidad || 3} combinaciones oficiales por ₡${formatNumber(paquetes[0]?.precio || 5000)}. Puedes generarlos al azar o elegir tus números favoritos.`
                : config.ventasActivas
                ? "Más Tokens, más oportunidades. Puedes generarlos al azar o elegir tus números favoritos."
                : "La venta directa abrirá muy pronto. ¡Contáctanos por WhatsApp para apartar tus números antes del lanzamiento público!"}
            </p>
          </div>

          <div className={`mt-12 ${paquetes.length === 1 ? "max-w-md mx-auto" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"}`}>
            {paquetes.map((p) => {
              const esUnico = paquetes.length === 1;
              const esPopular = p.popular || (sorteo.modalidadVenta === "multiplos_3" ? p.cantidad === 6 : p.cantidad === 8);
              const tagTexto = p.tag || (sorteo.modalidadVenta === "multiplos_3" && p.cantidad === 6 ? "EL MEJOR · MÁS VENDIDO" : "Más popular");

              return (
                <button
                  key={p.cantidad}
                  onClick={() => abrir(p)}
                  className={`w-full group relative cursor-pointer rounded-2xl border bg-[image:var(--gradient-surface)] p-6 sm:p-7 text-left transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--shadow-fire)] ${
                    esUnico
                      ? "border-amber-500/60 bg-gradient-to-b from-amber-500/15 via-card to-card shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                      : esPopular
                      ? "border-amber-500/80 bg-gradient-to-b from-amber-500/15 via-card to-card shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30"
                      : "border-border"
                  }`}
                >
                  {esUnico ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-3.5 py-1 text-xs font-black text-black shadow-md">
                      {`🔥 Paquete Especial Único ${p.cantidad}x₡${formatNumber(p.precio)}`}
                    </span>
                  ) : esPopular ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[11px] font-black text-black shadow-md flex items-center gap-1">
                      <Flame className="size-3 fill-black text-black" /> {tagTexto}
                    </span>
                  ) : null}

                  <div className={`font-display text-5xl sm:text-6xl ${esPopular ? "text-amber-400" : "text-primary"}`}>
                    {p.cantidad}
                  </div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mt-1">
                    Tokens Digitales Oficiales
                  </div>
                  <div className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">
                    {`₡${formatNumber(p.precio)}`}
                  </div>
                  {config.supertokenActivo !== false && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                      <Crown className="size-3 text-amber-400 shrink-0" />
                      <span>{`SuperToken: +₡${formatNumber(calcularCostoSuperToken(p.cantidad, config.supertokenPrecio || 1500))}`}</span>
                    </div>
                  )}
                  <div className={`mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold group-hover:translate-x-0.5 transition-transform ${
                    cierrePrevio || enCurso ? "text-amber-400" : "text-primary"
                  }`}>
                    {cierrePrevio ? "🔒 Ventas cerradas (Consultar) →" : enCurso ? "🎯 Sorteo en curso (Validar) →" : config.ventasActivas ? "Adquirir ahora →" : "Apartar por WhatsApp →"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* BANNER INTERACTIVO JUEGOS EXPRESS (SOLO SI ESTÁ ACTIVO EN ADMIN, POR DEFECTO APAGADO) */}
        {Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno" && (
          <div className="mx-auto max-w-5xl px-5 py-6">
            <div
              onClick={() => setOpenRaspa(true)}
              className="cursor-pointer group relative overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all hover:scale-[1.01] hover:border-amber-400"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-amber-500/15 blur-[80px]" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg font-bold text-3xl group-hover:rotate-12 group-hover:scale-110 transition-transform">
                    {sorteo.raspaConfig?.modo === "ruleta" ? "🎡" : sorteo.raspaConfig?.modo === "ambos" ? "✨" : "🎁"}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-amber-300 border border-amber-500/40">
                      <Sparkles className="size-3.5 text-amber-400" /> ¡JUEGO INSTANTÁNEO EXPRESS!
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl text-white font-bold tracking-wide mt-1">
                      {sorteo.raspaConfig?.modo === "ruleta"
                        ? (sorteo.raspaConfig?.ruletaTitulo || "Ruleta de la Fortuna Express")
                        : (sorteo.raspaConfig?.titulo || "Raspa y Gana Digital")} · ¡Gana en SINPE al Instante!
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                      {sorteo.raspaConfig?.modo === "ruleta"
                        ? (sorteo.raspaConfig?.ruletaSubtitulo || "Gira la ruleta de casino y gana hasta ₡100,000 en SINPE Móvil o Tokens oficiales.")
                        : (sorteo.raspaConfig?.subtitulo || "Pasa tu dedo o mouse sobre la tarjeta dorada o gira la ruleta y descubre tu premio.")}
                    </p>
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenRaspa(true);
                  }}
                  className="w-full md:w-auto shadow-[var(--shadow-fire)] font-bold text-sm px-6 py-6 shrink-0 gap-2 border border-amber-400/40 cursor-pointer"
                >
                  <Sparkles className="size-4" /> {`¡JUGAR AHORA (₡${formatNumber(sorteo.raspaConfig?.precio || 1000)})!`}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MINI-SORTEOS SEMANALES */}
        {config.miniSorteosActivo && (
          <div className="mx-auto max-w-6xl px-5 py-8">
            <MiniSorteosSection config={config} />
          </div>
        )}

        {/* GANADORES ANTERIORES Y TESTIMONIOS */}
        <GanadoresSection ganadores={sorteo.ganadoresTestimonios} />

        {/* PROGRAMA DE REFERIDOS Y PADRINOS */}
        {config.referidosActivo !== false && config.referidosPromoLandingActivo !== false && (
          <div className="mx-auto max-w-6xl px-5 py-8">
            <ReferidosLandingSection config={config} />
          </div>
        )}

        {/* RANKING Y CONCURSO DE REFERIDOS */}
        {config.rankingReferidosActivo && (
          <div id="ranking-referidos" className="mx-auto max-w-6xl px-5 py-4">
            <RankingReferidos config={config} />
          </div>
        )}

        {/* PREGUNTAS FRECUENTES */}
        <FaqSection faqs={sorteo.faqs} />
      </main>

      <Footer />

      {/* NOTIFICACIONES FOMO Y BANNER PWA */}
      <FomoNotifications config={config} />
      <PwaInstallPrompt config={config} />

      <StickersModal
        paquete={paquete}
        open={open}
        onOpenChange={setOpen}
        premioMayor={premios[0]?.nombre}
        config={config}
      />

      <JuegosExpressModal
        open={openRaspa}
        onOpenChange={setOpenRaspa}
        config={sorteo.raspaConfig}
      />

      {/* MODAL LIGHTBOX / ZOOM DE FOTO EN PANTALLA COMPLETA */}
      <Dialog open={!!fotoZoom} onOpenChange={(v) => { if (!v) setFotoZoom(null); }}>
        <DialogContent className="max-w-5xl w-[95vw] border border-amber-500/40 bg-zinc-950/95 p-3 sm:p-5 shadow-[0_0_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-foreground">
          <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50 text-left">
            <div>
              {fotoZoom?.nivel && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  {fotoZoom.nivel}
                </span>
              )}
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                {fotoZoom?.titulo}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="relative mt-2 flex items-center justify-center min-h-[50vh] max-h-[75vh] w-full overflow-hidden rounded-xl bg-black/80 p-2">
            <img
              src={fotoZoom?.url}
              alt={fotoZoom?.titulo}
              className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span className="text-amber-500/90 font-medium flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-400" /> Aval Community CR · Entrega Oficial Certificada
            </span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Presiona ESC o haz clic afuera para cerrar
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
