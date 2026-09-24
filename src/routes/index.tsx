import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
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
  Store,
  Ticket,
  Timer,
  Users,
  Percent,
  ZoomIn,
  MessageCircle,
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
import { ProgramaReferidosUnificado } from "@/components/ProgramaReferidosUnificado";
import { MiniSorteosSection } from "@/components/MiniSorteosSection";
import { SponsorsLandingSection } from "@/components/SponsorsLandingSection";
import { SuperTokenSection } from "@/components/SuperTokenSection";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { PremioModal } from "@/components/PremioModal";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [premios, setPremios] = useState<Premio[]>(() => {
    const list = loaderData?.premios && loaderData.premios.length > 0
      ? loaderData.premios
      : PREMIOS_DEFAULT;
    if (typeof window !== "undefined") {
      try {
        const rawInact = localStorage.getItem("aval_premios_inactivos");
        const inactivos: string[] = rawInact ? JSON.parse(rawInact) : [];
        if (inactivos.length > 0) {
          return list.map((p) => ({
            ...p,
            activo: inactivos.includes(p.id) ? false : p.activo,
          }));
        }
      } catch {}
    }
    return list;
  });
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
  const [premioModal, setPremioModal] = useState<Premio | null>(null);
  const [premioDetalleIdx, setPremioDetalleIdx] = useState<number>(0);

  const superMoneda = config.supertokenMoneda || (Number(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 0) > 50000 ? "CRC" : "CRC");
  const superSimbolo = superMoneda === "CRC" ? "₡" : "$";
  const superCodigo = superMoneda === "CRC" ? "CRC" : "USD";

  const t = useCuentaRegresiva(fechaSorteo, sorteo.horaSorteo, config.horasCierrePrevio);
  const ventasAbiertas = config.ventasActivas && t.estado === "VENTAS_ABIERTAS";
  const cierrePrevio = t.estado === "CIERRE_PREVIO";
  const sorteoFinalizado = t.estado === "FINALIZADO";
  const enCurso = t.estado === "EN_CURSO";

  const featureIcons = [Gauge, Compass, Star, FileCheck];

  const metodosActivosLista = [
    { id: "sinpe", nombre: "SINPE Móvil", icono: "📱", activo: config.sinpeActivo !== false },
    { id: "tarjeta", nombre: "Tarjeta", icono: "💳", activo: config.tilopayActivo !== false },
    { id: "paypal", nombre: "PayPal", icono: "🅿️", activo: Boolean(config.paypalActivo) },
    { id: "applepay", nombre: "Apple Pay", icono: "🍏", activo: Boolean(config.applePayActivo) },
    { id: "googlepay", nombre: "Google Pay", icono: "🌐", activo: Boolean(config.googlePayActivo) },
    { id: "crypto", nombre: "Cripto USDT", icono: "🪙", activo: Boolean(config.cryptoActivo) },
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
  const premioMayorActual = primerPremioVisible?.nombre || (sorteo as any).titulo || "el Premio Mayor";
  const descPaso3 = `El sorteo se determina con los resultados de la Emisión Oficial de la JPS. Si aciertas tu número, te llevas ${premioMayorActual} (vehículo 0KM, moto, casa, dinero en efectivo o el premio activo).`;

  const textoDinamicaFinal = useMemo(() => {
    if (sorteo.mostrarDinamica === false) return "";

    const activos = premiosVisibles;
    if (activos.length === 0) return "";

    const inactivosNombres = premios
      .filter((p) => p.activo === false)
      .map((p) => p.nombre.toLowerCase().trim())
      .filter(Boolean);

    const reglaCustom = (sorteo.reglaPremios || "").trim();
    const esTextoViejoDefecto = reglaCustom.toLowerCase().includes("escoge entre");
    const mencionaInactivo = inactivosNombres.some((nombreInactivo) =>
      reglaCustom.toLowerCase().includes(nombreInactivo)
    );

    if (reglaCustom && !esTextoViejoDefecto && !mencionaInactivo) {
      return reglaCustom;
    }

    const p1 = activos.filter((p) => p.nivel === "1° Lugar" || p.nivel === "Premio Mayor").map((p) => p.nombre);
    const p2 = activos.filter((p) => p.nivel === "2° Lugar" || p.nivel === "Segundo Premio").map((p) => p.nombre);
    const p3 = activos.filter((p) => p.nivel === "3° Lugar" || p.nivel === "Tercer Premio").map((p) => p.nombre);

    const partes: string[] = [];
    if (p1.length > 0) partes.push(`1° Lugar: ${p1.join(" o ")}`);
    if (p2.length > 0) partes.push(`2° Lugar: ${p2.join(" o ")}`);
    if (p3.length > 0) partes.push(`3° Lugar: ${p3.join(" y ")}`);

    return partes.join(". ") + (partes.length > 0 ? "." : "");
  }, [sorteo.mostrarDinamica, sorteo.reglaPremios, premiosVisibles, premios]);

  const pasos = [
    {
      num: "01",
      titulo: config.pasosPaso1Titulo || "Elige tus Tokens",
      desc: config.pasosPaso1Desc || "Selecciona el paquete digital que prefieras. Puedes asignar tus números al azar o escribir tus números favoritos.",
    },
    {
      num: "02",
      titulo: config.pasosPaso2Titulo || tituloPaso2,
      desc: config.pasosPaso2Desc || descPaso2,
    },
    {
      num: "03",
      titulo: config.pasosPaso3Titulo || "¡Participa con Resultados Oficiales!",
      desc: config.pasosPaso3Desc || descPaso3,
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
          setPremios((prev) => {
            const prevSign = prev.map((p) => `${p.id}:${p.activo !== false}:${p.nombre}:${p.nivel}`).join("|");
            const newSign = premiosData.map((p) => `${p.id}:${p.activo !== false}:${p.nombre}:${p.nivel}`).join("|");
            if (prevSign === newSign) return prev;
            return premiosData;
          });
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
    if (cierrePrevio || enCurso || sorteoFinalizado) {
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
    if (cierrePrevio || enCurso || sorteoFinalizado) {
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
      {config.mostrarBarraNotificacion !== false && (
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
      )}

      {/* Header Sticky */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 gap-2">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Aval Community CR"
              className="h-9 sm:h-10 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          {config.mostrarNavegacion !== false && (
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })} className="hidden md:inline-flex h-8 px-2 sm:px-3 text-xs sm:text-sm text-foreground/80 hover:text-foreground cursor-pointer">
                ¿Cómo funciona?
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.getElementById("detalle-premios")?.scrollIntoView({ behavior: "smooth" })} className="hidden sm:inline-flex h-8 px-2 sm:px-3 text-xs sm:text-sm text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-500/10 font-bold cursor-pointer">
                Premios
              </Button>
              <Button variant="ghost" size="sm" asChild className="hidden lg:inline-flex h-8 px-2 sm:px-3 text-xs sm:text-sm text-foreground/80 hover:text-foreground">
                <Link to="/referidos">Referidos</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex h-8 px-2 sm:px-3 text-xs sm:text-sm text-foreground/80 hover:text-foreground">
                <Link to="/sponsors">Comercios</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="h-8 px-2 sm:px-3 text-xs sm:text-sm text-foreground/80 hover:text-foreground">
                <Link to="/validar">Validar Tokens</Link>
              </Button>
              <ThemeToggle compact />
              <Button
                variant="hero"
                size="sm"
                onClick={irAPaquetes}
                className={`h-8 px-3 sm:px-4 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer ${
                  cierrePrevio ? "bg-amber-600 hover:bg-amber-500 text-black shadow-none"
                  : enCurso ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                  : "shadow-[var(--shadow-fire)]"
                }`}
              >
                {enCurso ? "🎯 Sorteo en Vivo" : cierrePrevio ? "🔒 Sorteo en Breve" : config.ventasActivas ? "Comprar Tokens" : "🔥 Preventa"}
              </Button>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* HERO SECTION DE ALTO IMPACTO */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
          {/* Luces de fondo */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[42rem] rounded-full bg-primary/20 blur-[150px]" />
          <div className="relative mx-auto max-w-6xl px-5 text-center">
            {/* Badges de Foco 100% en Tokens */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {config.mostrarBadgeSorteo !== false && (
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
                      ? (config.heroBadgeEvento || "Evento Promocional Oficial Costa Rica")
                      : "🔥 PREVENTA EXCLUSIVA 2026"}
                  </div>
                )}

                {/* Badge del Paquete Más Popular destacado arriba */}
                {config.mostrarBadgePopular !== false && paquetes.length > 1 && (
                  <button
                    onClick={irAPaquetes}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 px-4 py-1.5 text-xs font-bold dark:text-amber-400 text-amber-800 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Flame className="size-3.5 dark:text-amber-400 text-amber-600" />
                    <span>{config.heroBadgePopular || `Más Elegido: ${(paquetes.find(p => p.popular) || paquetes[1])?.cantidad} Tokens por ₡${formatNumber((paquetes.find(p => p.popular) || paquetes[1])?.precio || 8000)}`}</span>
                  </button>
                )}

                {config.mostrarBadgeJPS !== false && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold dark:text-emerald-400 text-emerald-700">
                    <CheckCircle2 className="size-3.5 dark:text-emerald-400 text-emerald-600" />
                    <span>Emisión Oficial JPS · Triple Oportunidad</span>
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

            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {cierrePrevio
                ? `Las ventas para esta edición han finalizado formalmente 2 horas antes para auditoría. El sorteo oficial inicia a las ${formatearHora12(sorteo.horaSorteo || "19:30")}.`
                : enCurso
                ? "El sorteo oficial se encuentra en transmisión y verificación de números favorecidos. Consulta tus tokens en el validador."
                : (config.heroSubtitulo && !config.heroSubtitulo.includes("transparente de Costa Rica. Auditados")
                    ? config.heroSubtitulo
                    : "Plataforma costarricense de eventos promocionales digitales y sorteos de vehículos de alta gama, diseñada para brindar una experiencia 100% digital, transparente y con total respaldo legal.")}
            </p>

            {/* Logo Aval Community CR */}
            <div className="mt-8 mb-4 flex justify-center">
              <img
                src="/logo-hero.png"
                alt="Aval Community CR"
                className="w-[300px] sm:w-[420px] md:w-[500px] max-w-full h-auto object-contain"
              />
            </div>

            {config.mostrarSeccionAperturaPremios !== false && premiosVisibles.length > 0 && (
              <div className="mt-12 text-left">
                <div className="text-center max-w-2xl mx-auto mb-6">
                  <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                    Más oportunidades de ser favorecido
                  </span>
                  <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
                    {config.heroTituloApertura || (premiosVisibles.length === 1
                      ? "Gran Entrega Destacada"
                      : premiosVisibles.length === 2
                      ? "Dos Entregas Espectaculares"
                      : "Tres Entregas Espectaculares")}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {config.heroSubtituloApertura || "Con cada paquete adquieres triple oportunidad según las combinaciones oficiales de la JPS."}
                  </p>
                </div>

                {/* Banner Dinámico de Dinámica / Regla de Premiación */}
                {sorteo.mostrarDinamica !== false && Boolean(textoDinamicaFinal) && (
                  <div className="mt-4 mb-8 mx-auto max-w-3xl rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/10 p-5 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider dark:text-amber-400 text-amber-700">
                      <Award className="size-4 text-amber-500 dark:text-amber-400" /> Dinámica Oficial de Premiación
                    </div>
                    <p className="mt-2 text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                      {textoDinamicaFinal}
                    </p>
                  </div>
                )}

                {(() => {
                  const renderPremioCard = (p: Premio, idx: number, forzarNivelBadge?: string) => {
                    const nivelStr = (forzarNivelBadge || p.nivel || "").trim();
                    const isEleccion1 = nivelStr.includes("1° Lugar") || nivelStr === "Premio Mayor";
                    const isEleccion2 = nivelStr.includes("2° Lugar") || nivelStr === "Segundo Premio";
                    const isEfectivo3 = nivelStr.includes("3° Lugar") || nivelStr === "Tercer Premio";
                    const isExtra = nivelStr === "Premio Extra";
                    const isMayor = isEleccion1 || (!isEleccion2 && !isEfectivo3 && !isExtra && idx === 0);
                    const isSegundo = isEleccion2 || (!isEleccion1 && !isEfectivo3 && !isExtra && idx === 1);

                    const tagLugar = isMayor
                      ? "1° Lugar"
                      : isSegundo
                      ? "2° Lugar"
                      : isEfectivo3
                      ? "3° Lugar"
                      : isExtra
                      ? "Premio Extra"
                      : "3° Lugar";

                    const nombreLower = (p.nombre || "").toLowerCase();
                    const defaultImg =
                      nombreLower.includes("subaru") || nombreLower.includes("impreza")
                        ? subaruImg
                        : nombreLower.includes("moto") || nombreLower.includes("ducati")
                        ? motoImg
                        : nombreLower.includes("playstation") || nombreLower.includes("consola") || nombreLower.includes("efectivo") || nombreLower.includes("colones")
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
                        ? "bg-sky-500 text-white border border-sky-400 font-bold"
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
                        ? "border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.12)]"
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

                        {/* Foto con Clic para abrir el Popup del Premio */}
                        <div
                          className="relative w-full h-64 sm:h-72 overflow-hidden bg-neutral-900 cursor-pointer group/img"
                          onClick={() => setPremioModal(p)}
                        >
                          <img
                            src={p.imagen || defaultImg}
                            alt={p.nombre}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105 brightness-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-black/30 pointer-events-none" />
                          <div className="absolute bottom-2.5 right-3 bg-black/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 backdrop-blur shadow-md group-hover/img:bg-amber-500 group-hover/img:text-black transition-colors">
                            <Sparkles className="size-3" /> Ver "Comprá y ganá"
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-xl leading-snug group-hover:text-primary transition-colors cursor-pointer" onClick={() => setPremioModal(p)}>
                              {p.nombre}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                              {isEleccion1
                                ? "Vehículo a escoger por el favorecido del 1° Lugar con traspaso notarial y marchamo incluidos."
                                : isEleccion2
                                ? "Vehículo a escoger por el favorecido del 2° Lugar con traspaso notarial y marchamo incluidos."
                                : isEfectivo3
                                ? "Premio oficial entregado formalmente ante Notario Público sin retenciones ni comisiones."
                                : isMayor
                                ? "Vehículo 0 KM con traspaso y marchamo incluidos."
                                : isSegundo
                                ? "Deportiva para dominar la calle y la pista con estilo."
                                : "Consola de última generación o dinero en efectivo con entrega formal."}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-border/60">
                            {config.supertokenActivo !== false && (
                              isMayor || isEleccion1 ? (
                                <p className="text-xs font-semibold text-amber-400 mb-2.5 flex items-center gap-1.5">
                                  <Crown className="size-3.5" /> {`Opción SuperToken: ¡+${superSimbolo}${formatNumber(config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000)} ${superCodigo} Cash extra!`}
                                </p>
                              ) : isSegundo || isEleccion2 ? (
                                <p className="text-xs font-semibold text-sky-400 mb-2.5 flex items-center gap-1.5">
                                  <Crown className="size-3.5" /> {`Opción SuperToken: ¡+${superSimbolo}${formatNumber(config.supertokenPremioSegundoUsd || 250000)} ${superCodigo} Cash extra!`}
                                </p>
                              ) : isEfectivo3 ? (
                                <p className="text-xs font-semibold text-yellow-400 mb-2.5 flex items-center gap-1.5">
                                  <Crown className="size-3.5" /> {`Opción SuperToken: ¡+${superSimbolo}${formatNumber(config.supertokenPremioTerceroUsd || 1500000)} ${superCodigo} Cash extra!`}
                                </p>
                              ) : null
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPremioModal(p)}
                              className="w-full text-xs font-bold border-amber-500/50 hover:bg-amber-500/15 hover:border-amber-500 dark:text-amber-300 text-amber-700 flex items-center justify-center gap-1.5 py-4 rounded-xl cursor-pointer"
                            >
                              <Sparkles className="size-3.5 text-amber-500 dark:text-amber-400" />
                              Ver Ficha & "Comprá y ganá" →
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  };

                  const modoAgrupado = (config.modoVistaPremios ?? "agrupado") === "agrupado";

                  if (!modoAgrupado) {
                    return (
                      <div
                        className={`grid gap-6 ${
                          premiosVisibles.length === 1
                            ? "max-w-md mx-auto"
                            : premiosVisibles.length === 2
                            ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                            : "grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto"
                        }`}
                      >
                        {premiosVisibles.map((p, idx) => renderPremioCard(p, idx))}
                      </div>
                    );
                  }

                  // ─── MODO AGRUPADO POR PODIO (DOBLE ELECCIÓN CARA A CARA) ───
                  const p1List = premiosVisibles.filter(
                    (p) => p.nivel === "1° Lugar" || p.nivel === "Premio Mayor" || (p.nivel as string) === "1° Lugar (A Elección)"
                  );
                  const p2List = premiosVisibles.filter(
                    (p) => p.nivel === "2° Lugar" || p.nivel === "Segundo Premio" || (p.nivel as string) === "2° Lugar (A Elección)"
                  );
                  const p3List = premiosVisibles.filter(
                    (p) => p.nivel === "3° Lugar" || p.nivel === "Tercer Premio" || (p.nivel as string) === "3° Lugar (Efectivo)"
                  );
                  const pExtraList = premiosVisibles.filter(
                    (p) =>
                      p.nivel === "Premio Extra" ||
                      (!p1List.includes(p) && !p2List.includes(p) && !p3List.includes(p))
                  );

                  return (
                    <div className="space-y-10 max-w-6xl mx-auto">
                      {/* BLOQUE 1° LUGAR */}
                      {p1List.length > 0 && (
                        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-card/70 to-card p-5 sm:p-8 shadow-xl space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                            <div className="flex items-center gap-3.5">
                              <div className="relative size-12 shrink-0 flex items-center justify-center rounded-2xl bg-white border-2 border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.4)] p-1.5">
                                <img src="/icons/icon-192.png" alt="Aval" className="size-full object-contain" />
                                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black text-xs font-black shadow-md border-2 border-background">
                                  👑
                                </span>
                              </div>
                              <div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
                                  {p1List.length > 1
                                    ? (config?.podio1Ceja || "1° Lugar Oficial · Tu comunidad te respalda")
                                    : "1° Lugar Oficial"}
                                </span>
                                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                                  {p1List.length > 1
                                    ? (config?.podio1Titulo || "Con tu aval: Vos tenés el mando del premio")
                                    : p1List[0].nombre}
                                </h3>
                              </div>
                            </div>
                            {p1List.length > 1 && (
                              <span className="self-start sm:self-auto rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1 text-xs font-black text-amber-600 dark:text-amber-300">
                                {config?.podio1Badge || "Elegí con total libertad entre las 2 opciones"}
                              </span>
                            )}
                          </div>

                          <div className={`grid gap-6 relative items-stretch ${p1List.length === 1 ? "max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>
                            {p1List.length === 2 && (
                              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-full bg-amber-500 text-black font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.6)] border-2 border-black">
                                O
                              </div>
                            )}
                            {p1List.map((p, idx) => renderPremioCard(p, idx, "1° Lugar (A Elección)"))}
                          </div>
                        </div>
                      )}

                      {/* BLOQUE 2° LUGAR */}
                      {p2List.length > 0 && (
                        <div className="rounded-3xl border-2 border-sky-500/40 bg-gradient-to-b from-sky-500/10 via-card/70 to-card p-5 sm:p-8 shadow-xl space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
                            <div className="flex items-center gap-3.5">
                              <div className="relative size-12 shrink-0 flex items-center justify-center rounded-2xl bg-white border-2 border-sky-400 shadow-[0_0_18px_rgba(14,165,233,0.4)] p-1.5">
                                <img src="/icons/icon-192.png" alt="Aval" className="size-full object-contain" />
                                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 text-black text-xs font-black shadow-md border-2 border-background">
                                  🥈
                                </span>
                              </div>
                              <div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-sky-500 dark:text-sky-400">
                                  {p2List.length > 1
                                    ? (config?.podio2Ceja || "2° Lugar Oficial · Tu comunidad te respalda")
                                    : "2° Lugar Oficial"}
                                </span>
                                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                                  {p2List.length > 1
                                    ? (config?.podio2Titulo || "Con tu aval: Vos tenés el mando del premio")
                                    : p2List[0].nombre}
                                </h3>
                              </div>
                            </div>
                            {p2List.length > 1 && (
                              <span className="self-start sm:self-auto rounded-full bg-sky-500/20 border border-sky-500/40 px-3.5 py-1 text-xs font-black text-sky-600 dark:text-sky-300">
                                {config?.podio2Badge || "Elegí con total libertad entre las 2 opciones"}
                              </span>
                            )}
                          </div>

                          <div className={`grid gap-6 relative items-stretch ${p2List.length === 1 ? "max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>
                            {p2List.length === 2 && (
                              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center rounded-full bg-sky-500 text-white font-black text-sm shadow-[0_0_25px_rgba(14,165,233,0.5)] border-2 border-black">
                                O
                              </div>
                            )}
                            {p2List.map((p, idx) => renderPremioCard(p, idx, "2° Lugar (A Elección)"))}
                          </div>
                        </div>
                      )}

                      {/* BLOQUE 3° LUGAR */}
                      {p3List.length > 0 && (
                        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 via-card/70 to-card p-5 sm:p-8 shadow-xl space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                            <div className="flex items-center gap-3.5">
                              <div className="relative size-12 shrink-0 flex items-center justify-center rounded-2xl bg-white border-2 border-amber-600 shadow-[0_0_18px_rgba(217,119,6,0.4)] p-1.5">
                                <img src="/icons/icon-192.png" alt="Aval" className="size-full object-contain" />
                                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-orange-400 text-white text-xs font-black shadow-md border-2 border-background">
                                  🥉
                                </span>
                              </div>
                              <div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
                                  3° Lugar Oficial · Premio Garantizado
                                </span>
                                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                                  {p3List.length === 1 ? p3List[0].nombre : "Premio en Efectivo / Consola"}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className={`grid gap-6 ${p3List.length === 1 ? "max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"}`}>
                            {p3List.map((p, idx) => renderPremioCard(p, idx, "3° Lugar"))}
                          </div>
                        </div>
                      )}

                      {/* BLOQUE PREMIOS EXTRAS (SI EXISTEN) */}
                      {pExtraList.length > 0 && (
                        <div className="rounded-3xl border-2 border-purple-500/40 bg-gradient-to-b from-purple-500/10 via-card/70 to-card p-5 sm:p-8 shadow-xl space-y-6">
                          <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-purple-500 text-white text-lg font-black shadow-md shrink-0">
                              ⭐
                            </span>
                            <div>
                              <span className="text-[11px] font-black uppercase tracking-wider text-purple-500 dark:text-purple-400">
                                Premios Adicionales Oficiales
                              </span>
                              <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                                Entregas Especiales
                              </h3>
                            </div>
                          </div>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {pExtraList.map((p, idx) => renderPremioCard(p, idx, "Premio Extra"))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Termómetro de Disponibilidad y Cuenta Regresiva Oficial en el Hero */}
            {config.mostrarSeccionTermometro === true && (
              <div className={`mx-auto mt-10 max-w-2xl rounded-2xl border-2 p-5 backdrop-blur text-left ${
                enCurso
                  ? "border-red-500/60 dark:bg-red-950/90 bg-red-50/90 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
                  : cierrePrevio
                  ? "border-amber-500/70 dark:bg-amber-950/80 bg-amber-50/90 shadow-[0_0_35px_rgba(245,158,11,0.25)]"
                  : "dark:border-amber-500/40 border-amber-500/50 dark:bg-zinc-950/90 bg-white/95 shadow-xl dark:shadow-[0_0_35px_rgba(245,158,11,0.15)]"
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
                      enCurso ? "text-red-500 dark:text-red-400" : cierrePrevio ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
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
                  <span className="font-mono text-lg sm:text-xl font-black dark:text-amber-400 text-amber-600 flex items-center gap-1.5" suppressHydrationWarning>
                    <Flame className="size-5 text-amber-500 fill-amber-500" />
                    {`${progreso}% Vendido`}
                  </span>
                </div>

                {/* Barra Brillante */}
                <div className="mt-3.5 h-4 w-full overflow-hidden rounded-full dark:bg-secondary/80 bg-slate-100 p-0.5 border dark:border-amber-500/30 border-slate-300">
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
                  <span className="font-mono font-bold dark:text-amber-400 text-amber-600 text-xs sm:text-sm" suppressHydrationWarning>
                    {enCurso
                      ? "🎯 En transmisión oficial"
                      : cierrePrevio
                      ? `⏳ Sorteo en: ${t.h}h ${t.m}m ${t.s}s`
                      : `⏳ Faltan: ${t.d}d ${t.h}h ${t.m}m ${t.s}s`}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Principal de Conversión */}
            {config.mostrarCtaHero === true && (
              <>
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
                        {config.heroBotonCta || "🔥 ¡QUIERO PARTICIPAR AHORA!"}{" "}
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                      </>
                    ) : (
                      <>
                        {config.promoBotonTexto || "📲 ¡NOTIFICARME POR WHATSAPP (PREVENTA)!"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="xl" asChild className="w-full sm:w-auto text-base px-8 py-7">
                    <a href="#como-funciona">{config.heroBotonSecundario || "¿Cómo funciona? ↓"}</a>
                  </Button>
                </div>

                {/* Micro-prueba social */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-success" /> {config.heroMicroPrueba1 || "Pago Seguro SINPE y Tarjeta"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-success" /> Resultados Oficiales Públicos
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-success" /> {config.heroMicroPrueba2 || "Entrega Formal ante Notario"}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ZONA PRINCIPAL DE COMPRA DE TOKENS (EL FOCO ABSOLUTO DE LA LANDING) */}
        {config.mostrarSeccionPaquetes === true && (
          <section id="paquetes-compra" className="py-16 md:py-24 mx-auto max-w-6xl px-5 scroll-mt-24">
            <div id="tickets-seleccion" className="text-center max-w-3xl mx-auto scroll-mt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="size-3.5" />
              {cierrePrevio || enCurso
                ? "🔒 Emisión en Proceso"
                : config.ventasActivas
                ? (config.paquetesBadge || "Elige tu Paquete Digital")
                : "🔥 Preventa Exclusiva de Tokens"}
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl tracking-tight uppercase">
              {cierrePrevio || enCurso
                ? "Ventas Finalizadas para esta Edición"
                : paquetes.length === 1
                ? "Adquiere tus Tokens Digitales"
                : config.ventasActivas
                ? (config.paquetesTitulo || "Elige tu paquete de Tokens")
                : "Paquetes Oficiales del Evento"}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {cierrePrevio
                ? `Las ventas para este evento han cerrado formalmente 2 horas antes para el escrutinio notarial y preparación del sorteo de las ${formatearHora12(sorteo.horaSorteo || "19:30")}. Puedes consultar tus números en el validador.`
                : enCurso
                ? "El evento promocional se encuentra en proceso de transmisión y verificación de ganadores oficiales."
                : paquetes.length === 1
                ? `Participa con tu paquete especial de ${paquetes[0]?.cantidad || 3} combinaciones oficiales por ₡${formatNumber(paquetes[0]?.precio || 5000)}. Generación automática al azar o escoge tus números preferidos.`
                : config.ventasActivas
                ? (config.paquetesSubtitulo || "Más Tokens, más oportunidades de ganar. Generación al instante o selección manual de números. Respaldado con los resultados oficiales de la JPS.")
                : "La venta directa abrirá muy pronto. ¡Contáctanos por WhatsApp para apartar tus números antes del lanzamiento público!"}
            </p>
          </div>

          <div className={`mt-10 ${paquetes.length === 1 ? "max-w-md mx-auto" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"}`}>
            {paquetes.map((p) => {
              const esUnico = paquetes.length === 1;
              const esPopular = p.popular || (sorteo.modalidadVenta === "multiplos_3" ? p.cantidad === 6 : p.cantidad === 8);
              const tagTexto = p.tag || (sorteo.modalidadVenta === "multiplos_3" && p.cantidad === 6 ? (config.paqueteTagBest || "EL MEJOR · MÁS VENDIDO") : (config.paqueteTagPopular || "Más popular"));

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

                  <div className={`font-display text-5xl sm:text-6xl ${esPopular ? "dark:text-amber-400 text-amber-600" : "text-primary"}`}>
                    {p.cantidad}
                  </div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mt-1">
                    {config.paquetesTokensLabel || "Tokens Digitales Oficiales"}
                  </div>
                  <div className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">
                    {`₡${formatNumber(p.precio)}`}
                  </div>
                  {config.supertokenActivo !== false && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold dark:text-amber-400 text-amber-700">
                      <Crown className="size-3 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span>{`SuperToken: +₡${formatNumber(calcularCostoSuperToken(p.cantidad, config.supertokenPrecio || 1500))}`}</span>
                    </div>
                  )}
                  <div className={`mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold group-hover:translate-x-0.5 transition-transform ${
                    cierrePrevio || enCurso ? "dark:text-amber-400 text-amber-600" : "text-primary"
                  }`}>
                    {cierrePrevio ? "🔒 Ventas cerradas (Consultar) →" : enCurso ? "🎯 Sorteo en curso (Validar) →" : config.ventasActivas ? (config.paquetesBotonComprar || "Adquirir ahora →") : "Apartar por WhatsApp →"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tarjetas de Transparencia y Respaldo Inmediatas */}
          <div className="grid sm:grid-cols-2 gap-4 text-left mt-10 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-emerald-500/30 dark:bg-emerald-500/5 bg-emerald-500/10 p-4 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider dark:text-emerald-400 text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500 dark:text-emerald-400" /> Si llegamos al 100%
              </span>
              <h4 className="font-bold text-sm text-foreground">Cierre Inmediato del Sorteo</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                La edición se cierra y el ganador se define oficialmente con la Emisión Oficial de la JPS más cercana.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 dark:bg-amber-500/5 bg-amber-500/10 p-4 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider dark:text-amber-400 text-amber-700 flex items-center gap-1">
                <ShieldCheck className="size-3 text-amber-500 dark:text-amber-400" /> Garantía de Cumplimiento
              </span>
              <h4 className="font-bold text-sm text-foreground">La Edición Continúa</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Si al vencer el contador aún falta meta para cubrir el vehículo, se traslada la fecha de cierre. Todos los tokens pagados conservan 100% su validez.
              </p>
            </div>
          </div>
        </section>
      )}

        {/* CÓMO FUNCIONA EN 3 PASOS (PROCESO 100% DIGITAL Y TRANSPARENTE) */}
        {config.mostrarSeccionComoFunciona !== false && (
          <section id="como-funciona" className="py-20 bg-secondary/30 border-y border-border">
            <div className="mx-auto max-w-6xl px-5">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                  {config.pasosBadge || "Proceso 100% Digital y Transparente"}
                </span>
                <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
                  {config.pasosTitulo || "Participa en 3 Simples Pasos"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {config.pasosSubtitulo || "Sin filas ni boletos físicos. Todo queda registrado digitalmente en tu dispositivo."}
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

              {config.mostrarSeccionPaquetes === true && (
                <div className="mt-12 text-center">
                  <Button variant="hero" size="xl" onClick={irAPaquetes} className="px-10 py-7 text-base shadow-[var(--shadow-fire)] cursor-pointer">
                    {config.ventasActivas ? (config.pasosBotonCta || "Comenzar y Elegir mis Tokens →") : "🔥 Consultar Preventa por WhatsApp →"}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* GRAN BLOQUE DE IMPACTO: SUSCRIPCIÓN COMUNITARIA (AVAL COMMUNITY CR)       */}
        {/* ========================================================================= */}
        {config.mostrarSeccionSuscripcion !== false && (() => {
          const rawWa = (config.promoWhatsapp || config.telefonoSinpe || "50663842433").replace(/\D/g, "");
          const waNum = rawWa.length === 8 ? `506${rawWa}` : rawWa;
          const waMsg = encodeURIComponent("¡Hola! Quiero afiliarme a la suscripción AVAL para obtener mi 50% de descuento en LUXX CR CAR WASH y recibir mis 3 tokens.");
          const waLink = `https://wa.me/${waNum}?text=${waMsg}`;

          return (
            <section id="suscripcion" className="py-14 sm:py-20 mx-auto max-w-5xl px-5 scroll-mt-24">
              <div className="relative rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-card via-card to-amber-950/20 p-7 sm:p-14 text-center shadow-[0_0_60px_rgba(245,158,11,0.18)] overflow-hidden">
                {/* Resplandores ambientales de fondo */}
                <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 size-96 rounded-full bg-amber-500/15 blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-24 right-10 size-72 rounded-full bg-emerald-500/10 blur-[100px]" />

                <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                  {/* Badge superior */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-black tracking-widest text-amber-500 dark:text-amber-400 uppercase shadow-xs">
                    <Sparkles className="size-4 animate-pulse text-amber-400" />
                    <span>{config.suscripcionBadge || "Comunidad Exclusiva · Membresía Oficial AVAL"}</span>
                  </div>

                  {/* TÍTULO ENORME DE IMPACTO */}
                  <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_25px_rgba(245,158,11,0.4)]">
                    {config.suscripcionTitulo || "SUSCRIBITE"}
                  </h2>

                  {/* Texto exacto del usuario */}
                  <p className="text-base sm:text-lg lg:text-xl text-foreground/90 dark:text-zinc-200 leading-relaxed font-normal max-w-2xl mx-auto">
                    {config.suscripcionTexto || "Afiliate a AVAL y formá parte de una comunidad con beneficios. Con tu suscripción obtenés 50% de descuento en LUXX CR CAR WASH, recibís 3 tokens para participar y accedés a una plataforma con dinámicas transparentes y verificables, respaldadas por resultados oficiales."}
                  </p>

                  {/* 3 Tarjetas de Beneficios Clave (Impacto Visual) */}
                  <div className="pt-4 grid sm:grid-cols-3 gap-4 text-left">
                    {/* Beneficio 1: 50% Descuento */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 space-y-2 hover:border-amber-500/60 transition-all shadow-md">
                      <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Percent className="size-5" />
                      </div>
                      <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Ahorro Inmediato</div>
                      <h4 className="font-black text-lg text-foreground leading-snug">50% de Descuento</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        En todos los servicios de LUXX CR CAR WASH para mantener tu vehículo impecable.
                      </p>
                    </div>

                    {/* Beneficio 2: 3 Tokens */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 space-y-2 hover:border-amber-500/60 transition-all shadow-md">
                      <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Ticket className="size-5" />
                      </div>
                      <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Oportunidad Real</div>
                      <h4 className="font-black text-lg text-foreground leading-snug">3 Tokens Incluidos</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Participación directa en las 3 entregas espectaculares de motos, carros y efectivo.
                      </p>
                    </div>

                    {/* Beneficio 3: 100% Oficial */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 space-y-2 hover:border-amber-500/60 transition-all shadow-md">
                      <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Transparencia Total</div>
                      <h4 className="font-black text-lg text-foreground leading-snug">Resultados Oficiales</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Dinámicas 100% verificables y auditadas con los sorteos oficiales de la JPS.
                      </p>
                    </div>
                  </div>

                  {/* Botón CTA Grande con Glow y pulsación */}
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      asChild
                      size="xl"
                      className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-base sm:text-lg px-10 py-8 rounded-2xl shadow-[0_10px_35px_rgba(245,158,11,0.4)] cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98] border border-amber-300/60"
                    >
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3"
                      >
                        <Sparkles className="size-6 text-black fill-black" />
                        <span>{config.suscripcionBotonTexto || "¡QUIERO MI SUSCRIPCIÓN Y MIS 3 TOKENS! →"}</span>
                      </a>
                    </Button>
                  </div>

                  {/* Micro-garantías debajo del botón */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                      <CheckCircle2 className="size-3.5" /> Activación Inmediata
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <MessageCircle className="size-3.5 text-emerald-400" /> Atención Personalizada por WhatsApp
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Award className="size-3.5 text-amber-400" /> Beneficios Reales en Costa Rica
                    </span>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* SECCIÓN DETALLADA DE PREMIOS (FUERA DEL BLOQUE PRINCIPAL) CON MÁS INFORMACIÓN Y CTAS PROPIOS */}
        {config.mostrarSeccionDetallePremios === true && premiosVisibles.length > 0 && (() => {
          const premioActivo = premiosVisibles[premioDetalleIdx] || premiosVisibles[0];
          const nivelStr = (premioActivo?.nivel || "").trim();
          const isEleccion1 = nivelStr === "1° Lugar" || nivelStr === "1° Lugar (A Elección)";
          const isEleccion2 = nivelStr === "2° Lugar" || nivelStr === "2° Lugar (A Elección)";
          const isEfectivo3 = nivelStr === "3° Lugar" || nivelStr === "3° Lugar (Efectivo)";
          const isExtra = nivelStr === "Premio Extra";
          const isMayor = isEleccion1 || nivelStr === "Premio Mayor" || (premioDetalleIdx === 0 && !isEleccion2 && !isEfectivo3 && !isExtra);
          const isSegundo = isEleccion2 || nivelStr === "Segundo Premio" || (premioDetalleIdx === 1 && !isEleccion1 && !isEfectivo3 && !isExtra);

          const tagLugar = isMayor
            ? "1° Lugar Oficial"
            : isSegundo
            ? "2° Lugar Oficial"
            : isEfectivo3
            ? "3° Lugar Oficial"
            : isExtra
            ? "Premio Extra"
            : "Premio Oficial";

          const nombreLower = (premioActivo?.nombre || "").toLowerCase();
          const esDucati = nombreLower.includes("ducati") || nombreLower.includes("multistrada") || nombreLower.includes("moto");
          const esSubaru = nombreLower.includes("subaru") || nombreLower.includes("impreza") || nombreLower.includes("wrx");
          const esEfectivoReal = isEfectivo3 || nombreLower.includes("efectivo") || nombreLower.includes("colones") || nombreLower.includes("plata");

          const defaultImg =
            esSubaru
              ? subaruImg
              : esDucati
              ? motoImg
              : esEfectivoReal
              ? consolaImg
              : isMayor
              ? carroImg
              : isSegundo
              ? motoImg
              : consolaImg;

          const imagenFinal = premioActivo?.imagen || defaultImg;

          const bonoSupertoken =
            isMayor || isEleccion1
              ? config.supertokenPremioPrimeroUsd || config.supertokenPremioUsd || 4500000
              : isSegundo || isEleccion2
              ? config.supertokenPremioSegundoUsd || 250000
              : config.supertokenPremioTerceroUsd || 1500000;

          const infoDetalle = esDucati
            ? {
                subtitulo: "La máxima expresión de superbike italiana en formato trail touring. Rendimiento brutal con motor Desmosedici Stradale V4 derivado de MotoGP, escape Akrapovič de titanio y acabados exclusivos en fibra de carbono.",
                features: [
                  { icono: Gauge, titulo: "Motor Desmosedici Stradale V4", desc: "1,103 cc con embrague en seco STM-EVO SBK y distribución desmodrómica de competición." },
                  { icono: Flame, titulo: "Potencia Brutal de 180 CV", desc: "Aceleración demoledora, escape Akrapovič homologado de titanio y modos de conducción Race." },
                  { icono: Star, titulo: "Chasis Monocasco & Carbono", desc: "Subchasis de titanio, rines forjados Marchesini y elementos aerodinámicos de competición." },
                  { icono: ShieldCheck, titulo: "0 KM · Marchamo y Notario Pagos", desc: "Sacada de agencia 0KM, traspaso notarial y marchamo 2026 100% cubiertos por la empresa." },
                ],
                garantia: "Si resultas favorecido con el 1° Lugar, nos encargamos de todo el trámite de traspaso notarial, placas metálicas a tu nombre, marchamo 2026 y entrega con tanque lleno.",
                ctaTexto: "🔥 ¡QUIERO PARTICIPAR POR LA DUCATI MULTISTRADA! →",
                waTexto: "¡Hola! Quiero participar por la Ducati Multistrada V4 RS en Aval Community CR. ¿Me dan más información?",
              }
            : esSubaru
            ? {
                subtitulo: "La leyenda indiscutible del Campeonato Mundial de Rally. Tracción total simétrica permanente (Symmetrical AWD), motor Boxer Turbo 2.5L de alto rendimiento y control supremo en asfalto y pista.",
                features: [
                  { icono: Gauge, titulo: "Motor Boxer 2.5L Turbo High-Output", desc: "Potencia turboalimentada con intercooler frontal y el rugido inconfundible Boxer." },
                  { icono: Compass, titulo: "Tracción Symmetrical AWD + DCCD", desc: "Tracción integral permanente con diferencial central controlado electrónicamente por el piloto." },
                  { icono: Star, titulo: "Frenos Brembo & Caja Manual 6V", desc: "Pinzas deportivas Brembo ventiladas de alta respuesta y transmisión manual pura de 6 marchas." },
                  { icono: ShieldCheck, titulo: "100% Legalizado y Marchamo al Día", desc: "Condiciones mecánicas impecables, inspección técnica aprobada y traspaso formal ante Notario." },
                ],
                garantia: "El favorecido del 2° Lugar recibe este vehículo formalmente adjudicado ante Notario Público con todos los derechos al día y listo para rodar.",
                ctaTexto: "🔥 ¡QUIERO PARTICIPAR POR EL SUBARU WRX STI! →",
                waTexto: "¡Hola! Me interesa participar por el Subaru Impreza WRX STI en Aval Community CR. ¿Cómo elijo mis tokens?",
              }
            : esEfectivoReal
            ? {
                subtitulo: "Premio oficial en dinero líquido transferido inmediatamente a tu cuenta bancaria o consola PlayStation 5 Slim Digital 0KM con controles inalámbricos y juegos.",
                features: [
                  { icono: Sparkles, titulo: "₡4,000,000 CRC en Efectivo Líquido", desc: "Transferencia bancaria directa o por SINPE Móvil oficial a tu cuenta sin comisiones ni retenciones." },
                  { icono: Star, titulo: "Libre Disposición Inmediata", desc: "Dinero en mano para invertir, pagar deudas, viajar, emprender tu proyecto o ahorrar." },
                  { icono: Flame, titulo: "Opción Consola PS5 Slim Sellada", desc: "Consola PlayStation 5 Slim 0KM sellada de fábrica con controles DualSense y videojuegos." },
                  { icono: ShieldCheck, titulo: "Acta Notarial y Comprobante Formal", desc: "Entrega legal con comprobante de depósito bancario formal avalado por Notario Público." },
                ],
                garantia: "El 3° Lugar cuenta con entrega formal garantizada. Transferimos el dinero de inmediato con respaldo legal para tu total tranquilidad.",
                ctaTexto: "🔥 ¡QUIERO PARTICIPAR POR LOS ₡4,000,000 CRC! →",
                waTexto: "¡Hola! Quiero participar por el 3° Lugar en Efectivo / PS5 en Aval Community CR. ¿Cuáles números quedan?",
              }
            : {
                subtitulo: sorteo.detalleSubtitulo || "Vehículo o beneficio de alta gama certificado, sacado de agencia con garantía y entregado formalmente a tu nombre con marchamo y traspaso incluido.",
                features: (sorteo.detalleFeatures && sorteo.detalleFeatures.length > 0 ? sorteo.detalleFeatures : FEATURES_DEFAULT).map((f: any, i: number) => ({
                  icono: featureIcons[i % featureIcons.length] || Gauge,
                  titulo: f.titulo,
                  desc: f.desc,
                })),
                garantia: sorteo.detalleGarantia || "Si resultas favorecido, nos encargamos de todo el trámite de traspaso notarial, placas, marchamo del año y entrega con tanque lleno.",
                ctaTexto: `🔥 ¡QUIERO PARTICIPAR POR ${premioActivo.nombre.toUpperCase()}! →`,
                waTexto: `¡Hola! Quiero participar por el premio "${premioActivo.nombre}" en Aval Community CR.`,
              };

          const waUrlPremio = `https://wa.me/${config.promoWhatsapp || "50686344772"}?text=${encodeURIComponent(infoDetalle.waTexto)}`;

          return (
            <section id="detalle-premios" className="py-20 bg-secondary/20 border-t border-border/60">
              <div className="mx-auto max-w-6xl px-5">
                {/* Encabezado de la Sección */}
                <div className="text-center max-w-3xl mx-auto">
                  <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                    Ficha Técnica y Detalles de Cada Entrega
                  </span>
                  <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
                    Conocé en Detalle Cada Premio
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Información técnica exhaustiva, garantía de traspaso notarial, bonos de SuperToken y llamados a la acción exclusivos para cada uno de los premios de esta edición.
                  </p>
                </div>

                {/* Selector de Pestañas (Tabs) de los Premios */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {premiosVisibles.map((p, idx) => {
                    const isSelected = premioDetalleIdx === idx;
                    const pNombreLower = (p.nombre || "").toLowerCase();
                    const iconoEmoji =
                      pNombreLower.includes("ducati") || pNombreLower.includes("moto")
                        ? "🏍️"
                        : pNombreLower.includes("subaru") || pNombreLower.includes("carro")
                        ? "🚗"
                        : "💵";

                    const pNivel =
                      idx === 0 ? "1° Lugar" : idx === 1 ? "2° Lugar" : idx === 2 ? "3° Lugar" : p.nivel;

                    return (
                      <button
                        key={p.id || idx}
                        onClick={() => setPremioDetalleIdx(idx)}
                        className={`px-4 sm:px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-md ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-2 border-amber-400 scale-[1.03] shadow-[0_0_25px_rgba(245,158,11,0.35)]"
                            : "bg-card/80 text-foreground border border-border hover:border-amber-500/50 hover:bg-secondary"
                        }`}
                      >
                        <span className="text-base sm:text-lg">{iconoEmoji}</span>
                        <span className="flex flex-col text-left leading-tight">
                          <span className={`text-[10px] uppercase tracking-wider ${isSelected ? "text-black/80 font-black" : "text-primary"}`}>
                            {pNivel}
                          </span>
                          <span className="font-bold truncate max-w-[150px] sm:max-w-[200px]">
                            {p.nombre}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Contenedor Principal del Premio Seleccionado (2 Columnas) */}
                <div className="mt-12 grid gap-10 lg:grid-cols-12 items-center bg-card/60 rounded-3xl border border-border/80 p-6 sm:p-10 shadow-xl backdrop-blur">
                  {/* Columna Izquierda: Especificaciones Técnicas y CTAs Propios */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-500/15 dark:text-amber-400 text-amber-700 border border-amber-500/40 px-3 py-1 text-xs font-black uppercase">
                        {tagLugar}
                      </span>
                      {config.supertokenActivo !== false && (
                        <span className="rounded-full bg-black/80 text-amber-300 border border-amber-500/60 px-3 py-1 text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm">
                          <Crown className="size-3.5 text-amber-400" />
                          {`+${superSimbolo}${formatNumber(bonoSupertoken)} ${superCodigo} Cash`}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-foreground">
                        {premioActivo.nombre}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {infoDetalle.subtitulo}
                      </p>
                    </div>

                    {/* 4 Tarjetas de Especificaciones Técnicas */}
                    <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                      {infoDetalle.features.map((feat: any, i: number) => {
                        const Icono = feat.icono || Gauge;
                        return (
                          <div
                            key={i}
                            className="rounded-2xl border border-border/80 bg-secondary/50 p-4 flex items-start gap-3.5 hover:border-amber-500/40 transition-colors"
                          >
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
                              <Icono className="size-5 dark:text-amber-400 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-foreground">{feat.titulo}</h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feat.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* SUS PROPIOS LLAMADOS A LA ACCIÓN (CTAs INDEPENDIENTES) */}
                    <div className="pt-4 space-y-3">
                      <div className="flex flex-col xl:flex-row gap-3">
                        <Button
                          variant="hero"
                          size="xl"
                          onClick={() => {
                            setPaquete(paquetes[1] || paquetes[0]);
                            irAPaquetes();
                          }}
                          className="w-full xl:flex-1 py-6 sm:py-7 text-xs sm:text-sm font-black shadow-[var(--shadow-fire)] cursor-pointer"
                        >
                          <Ticket className="size-4 sm:size-5 shrink-0" />
                          <span className="truncate">{infoDetalle.ctaTexto}</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="xl"
                          asChild
                          className="w-full xl:w-auto shrink-0 py-6 sm:py-7 text-xs sm:text-sm border-emerald-500/50 dark:text-emerald-400 text-emerald-700 hover:bg-emerald-500/10"
                        >
                          <a href={waUrlPremio} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="size-4" /> Consultar por WhatsApp
                          </a>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <button
                          onClick={() => setPremioModal(premioActivo)}
                          className="inline-flex items-center gap-1.5 dark:text-amber-400 text-amber-600 hover:text-amber-700 font-semibold cursor-pointer underline underline-offset-4"
                        >
                          <Sparkles className="size-3.5" /> Ver ficha emergente "Comprá y ganá" completa
                        </button>
                        <span className="flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="size-3.5 dark:text-emerald-400 text-emerald-600" /> Traspaso notarial 100% incluido
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha: Foto Showcase en HD y Garantía Aval */}
                  <div className="lg:col-span-5 space-y-4">
                    <div
                      className="overflow-hidden rounded-3xl border-2 border-amber-500/40 shadow-2xl bg-neutral-950 relative h-80 sm:h-96 flex items-center justify-center group cursor-pointer"
                      onClick={() => setPremioModal(premioActivo)}
                    >
                      <img
                        src={imagenFinal}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
                      />
                      <img
                        src={imagenFinal}
                        alt={premioActivo.nombre}
                        className="relative z-0 max-h-80 sm:max-h-92 max-w-full w-auto h-auto object-contain p-3 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1.5 text-xs font-semibold text-zinc-200 border border-white/20 backdrop-blur shadow-md group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <ZoomIn className="size-3.5" /> Tocar para ampliar & "Comprá y ganá"
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-secondary/40 to-transparent p-5 text-left">
                      <h4 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2">
                        <Award className="size-4 sm:size-5 dark:text-amber-400 text-amber-600" /> Garantía Aval Community CR
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {infoDetalle.garantia}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* MODALIDAD VIP: SUPERTOKEN (1°, 2° Y 3° LUGAR EN EFECTIVO) */}
        {config.supertokenActivo !== false && (
          <div className="mx-auto max-w-6xl px-5 py-8">
            <SuperTokenSection config={config} />
          </div>
        )}

        {/* ACCESOS SEPARADOS: REFERIDOS Y COMERCIOS ALIADOS (MODO LIMPIO Y LIGERO) */}
        {(config.mostrarSeccionReferidos === true || config.mostrarSeccionSponsors === true) && (
          <section className="py-12 mx-auto max-w-6xl px-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Tarjeta Enlace: Programa de Referidos */}
              {config.mostrarSeccionReferidos === true && config.referidosActivo !== false && (
                <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-500/5 p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:border-amber-500 transition-all group">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-3.5 py-1 text-xs font-black tracking-wide text-amber-600 dark:text-amber-400">
                      <Users className="size-3.5" /> GANA EN EFECTIVO
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground">
                      Programa de Referidos & Amigos Invitados
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Gana hasta <strong>{config.referidosPremioPrimero || "₡4,000,000"} en efectivo</strong> si tu recomendado resulta favorecido. Obtén tu enlace personal de padrino y participa en la tabla de líderes mensual.
                    </p>
                  </div>
                  <div className="pt-6">
                    <Button asChild variant="outline" className="w-full border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold group-hover:bg-amber-500 group-hover:text-black transition-all cursor-pointer">
                      <Link to="/referidos">
                        Conocer Programa de Referidos →
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Tarjeta Enlace: Comercios Aliados */}
              {config.mostrarSeccionSponsors === true && (
                <div className="rounded-3xl border border-border bg-gradient-to-b from-card via-card to-secondary/30 p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:border-emerald-500/60 transition-all group">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-black tracking-wide text-emerald-600 dark:text-emerald-400">
                      <Percent className="size-3.5" /> BENEFICIOS CON TU TOKEN
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground">
                      Descuentos en Comercios Aliados
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Con tus mismos Tokens obtén <strong>descuentos de hasta 50%</strong> en talleres, autolavados, restaurantes, repuestos y tecnología en todo el país.
                    </p>
                  </div>
                  <div className="pt-6">
                    <Button asChild variant="outline" className="w-full border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all cursor-pointer">
                      <Link to="/sponsors">
                        Ver Catálogo de Comercios Aliados →
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* MINI-SORTEOS SEMANALES (ACTIVABLE DESDE ADMIN) */}
        {config.mostrarSeccionMiniSorteos === true && (
          <MiniSorteosSection config={config} sorteo={sorteo} />
        )}

        {/* GANADORES Y TESTIMONIOS (ACTIVABLE DESDE ADMIN) */}
        {config.mostrarSeccionGanadores === true && (
          <GanadoresSection ganadores={sorteo.ganadoresTestimonios} />
        )}

        {/* BANNER CTA FINAL ENFOCADO 100% EN TOKENS */}
        {config.mostrarSeccionPaquetes === true && (
          <section className="py-16 mx-auto max-w-5xl px-5 text-center">
            <div className="rounded-3xl border-2 border-primary/50 bg-gradient-to-b from-card via-card to-primary/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/15 blur-[100px]" />
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="size-3.5" /> Edición Limitada Oficial
              </span>
              <h3 className="mt-4 font-display text-3xl sm:text-5xl tracking-tight uppercase">
                ¿Listo para estrenar tu vehículo soñado?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Selecciona tu paquete de tokens hoy mismo. Asignación inmediata, resultados 100% auditados por la JPS y entrega legal ante notario público.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={irAPaquetes}
                  className="w-full sm:w-auto px-10 py-7 text-base shadow-[var(--shadow-fire)] font-black cursor-pointer"
                >
                  <Ticket className="size-5" />
                  {config.ventasActivas ? "Elegir mis Tokens Ahora →" : "Consultar Preventa por WhatsApp →"}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* PREGUNTAS FRECUENTES (RESOLUCIÓN DE DUDAS DE COMPRA) */}
        {config.mostrarSeccionFaqs !== false && (
          <FaqSection faqs={sorteo.faqs} config={config} />
        )}
      </main>

      <Footer config={config} />

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

      <PremioModal
        premio={premioModal}
        open={!!premioModal}
        onOpenChange={(v) => { if (!v) setPremioModal(null); }}
        onSelectTokens={(paq) => {
          if (paq) setPaquete(paq);
          setOpen(true);
        }}
        config={config}
        sorteo={sorteo}
        paquetes={paquetes}
      />

      <JuegosExpressModal
        open={openRaspa}
        onOpenChange={setOpenRaspa}
        config={sorteo.raspaConfig}
      />

      {/* MODAL LIGHTBOX / ZOOM DE FOTO EN PANTALLA COMPLETA */}
      <Dialog open={!!fotoZoom} onOpenChange={(v) => { if (!v) setFotoZoom(null); }}>
        <DialogContent className="max-w-5xl w-[95vw] border dark:border-amber-500/40 border-amber-500/50 dark:bg-zinc-950/95 bg-white/95 p-3 sm:p-5 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-foreground">
          <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50 text-left">
            <div>
              {fotoZoom?.nivel && (
                <span className="text-[10px] font-bold uppercase tracking-wider dark:text-amber-400 text-amber-700 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/40">
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
