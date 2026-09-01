import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Coins,
  Crown,
  FileCheck,
  Flame,
  Gauge,
  Gift,
  Key,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickersModal, type Paquete } from "@/components/StickersModal";
import { JuegosExpressModal } from "@/components/JuegosExpressModal";
import { GanadoresSection } from "@/components/GanadoresSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { FlyerPromocional } from "@/components/FlyerPromocional";
import { FomoNotifications } from "@/components/FomoNotifications";
import { RankingReferidos } from "@/components/RankingReferidos";
import { MiniSorteosSection } from "@/components/MiniSorteosSection";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import pradoImg from "@/assets/premio-prado.jpg";
import motoImg from "@/assets/premio-moto.jpg";
import consolaImg from "@/assets/premio-consola.jpg";
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

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const [premios, inventario, sorteo, config] = await Promise.all([
        fetchPremios(),
        fetchInventario(),
        fetchSorteo(),
        fetchConfig(),
      ]);
      return { premios, inventario, sorteo, config };
    } catch {
      return {
        premios: PREMIOS_DEFAULT,
        inventario: { total: 0, disponibles: 0, fecha: "" },
        sorteo: SORTEO_DEFAULT,
        config: CONFIG_DEFAULT,
      };
    }
  },
  head: () => ({
    meta: [
      { title: "Aval Community CR | ¡Estrena tu Toyota Prado 0KM!" },
      {
        name: "description",
        content:
          "Adquiere tus Tokens digitales y participa por una Toyota Prado 2026 0KM, moto de alta cilindrada o PS5 desde solo ₡1,000 por SINPE Móvil o Tarjeta. Evento promocional transparente.",
      },
      { property: "og:title", content: "Aval Community CR | ¡Estrena tu Toyota Prado 0KM!" },
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

function useCuentaRegresiva(fechaObjetivo: string) {
  const [t, setT] = useState({ d: 7, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const objetivo = fechaObjetivo
      ? new Date(fechaObjetivo).getTime()
      : new Date("2026-09-27T23:59:59").getTime();

    const tick = () => {
      const diff = Math.max(0, objetivo - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [fechaObjetivo]);
  return t;
}

function IndexPage() {
  const loaderData = Route.useLoaderData();
  const [paquete, setPaquete] = useState<Paquete | null>(null);
  const [open, setOpen] = useState(false);
  const [premios, setPremios] = useState<Premio[]>(loaderData?.premios || PREMIOS_DEFAULT);
  const [sorteo, setSorteo] = useState<Sorteo>(loaderData?.sorteo || SORTEO_DEFAULT);
  const [config, setConfig] = useState<Config>(loaderData?.config || CONFIG_DEFAULT);
  const [fechaSorteo, setFechaSorteo] = useState(loaderData?.sorteo?.fecha || "2026-09-27");
  const [paquetes, setPaquetes] = useState<Paquete[]>(() => {
    const sorteoActual = loaderData?.sorteo || SORTEO_DEFAULT;
    if (sorteoActual.modalidadVenta === "fijo_3x5000") {
      return [{ cantidad: 3, precio: 5000 }];
    }
    const base = sorteoActual.precioBase || 1000;
    return [
      { cantidad: 4, precio: base * 4 },
      { cantidad: 8, precio: base * 8 },
      { cantidad: 12, precio: base * 12 },
      { cantidad: 24, precio: base * 24 },
    ];
  });
  const [progreso, setProgreso] = useState(() => {
    if (loaderData?.inventario && loaderData.inventario.total > 0) {
      const vendidos = loaderData.inventario.total - loaderData.inventario.disponibles;
      return Math.round((vendidos / loaderData.inventario.total) * 100);
    }
    return 87;
  });
  const [openRaspa, setOpenRaspa] = useState(false);

  const t = useCuentaRegresiva(fechaSorteo);

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

  const premioMayorActual = premios[0]?.nombre || sorteo.titulo || "el Premio Mayor";
  const descPaso3 = `El sorteo se determina con los resultados oficiales de la Lotería Nacional (JPS). Si aciertas tu número, te llevas ${premioMayorActual} (vehículo 0KM, moto, casa, dinero en efectivo o el premio activo).`;

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
        const [premiosData, inventarioData, sorteoData, configData] = await Promise.all([
          fetchPremios(),
          fetchInventario(),
          fetchSorteo(),
          fetchConfig(),
        ]);

        if (premiosData && premiosData.length > 0) {
          setPremios(premiosData);
        }
        if (configData) {
          setConfig(configData);
        }
        if (sorteoData) {
          setSorteo(sorteoData);
          if (sorteoData.fecha) setFechaSorteo(sorteoData.fecha);
          if (sorteoData.modalidadVenta === "fijo_3x5000") {
            setPaquetes([
              { cantidad: 3, precio: 5000 },
            ]);
          } else {
            const base = sorteoData.precioBase || 1000;
            setPaquetes([
              { cantidad: 4, precio: base * 4 },
              { cantidad: 8, precio: base * 8 },
              { cantidad: 12, precio: base * 12 },
              { cantidad: 24, precio: base * 24 },
            ]);
          }
        }

        if (inventarioData && inventarioData.total > 0) {
          const vendidos = inventarioData.total - inventarioData.disponibles;
          setProgreso(Math.round((vendidos / inventarioData.total) * 100));
        }
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
    if (!config.ventasActivas) {
      abrirWhatsAppPreventa(`Me interesa apartar el paquete de ${p.cantidad} Tokens (₡${p.precio.toLocaleString("es-CR")}).`);
      return;
    }
    setPaquete(p);
    setOpen(true);
  };

  const irAPaquetes = () => {
    if (!config.ventasActivas) {
      abrirWhatsAppPreventa();
      return;
    }
    const el = document.getElementById("paquetes-compra");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      abrir(paquetes[2] || paquetes[0] || { cantidad: 12, precio: 12000 });
    }
  };

  // MODO PROMOCIONAL / PRÓXIMAMENTE: Oculta toda la tienda y muestra SOLO el Flyer Promocional
  if (!config.ventasActivas) {
    return (
      <FlyerPromocional
        premioMayor={premios[0]}
        config={config}
        sorteo={sorteo}
        tiempo={t}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Barra de Notificación Superior */}
      <div className="bg-[image:var(--gradient-fire)] py-2 text-center text-xs font-semibold text-primary-foreground tracking-wider uppercase">
        {config.ventasActivas
          ? "🔥 Edición Especial 2026 · Más del 85% de Tokens colocados · ¡Quedan pocos cupos!"
          : config.promoTitulo || "🔥 GRAN EVENTO PROMOCIONAL 2026 · ¡PRÓXIMAMENTE!"}
      </div>

      {/* Header Sticky */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 gap-2">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Flame className="size-5 sm:size-6 text-primary shrink-0" />
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
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            >
              <Link to="/validar">Validar Tokens</Link>
            </Button>
            <Button
              variant="hero"
              size="sm"
              onClick={irAPaquetes}
              className="h-8 px-3 sm:px-4 text-xs sm:text-sm shadow-[var(--shadow-fire)] font-bold whitespace-nowrap"
            >
              {config.ventasActivas ? "Participar" : "🔥 Preventa"}
            </Button>
          </div>
        </div>
      </header>

      {/* Botón Flotante Móvil de Juegos Express */}
      {Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno" && (
        <button
          type="button"
          onClick={() => setOpenRaspa(true)}
          className="md:hidden fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full border-2 border-amber-400 bg-zinc-950/95 px-4 py-2.5 text-xs font-black text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] backdrop-blur active:scale-95 transition-transform"
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
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="size-3.5" />{" "}
                {config.ventasActivas ? "Evento Promocional Oficial Costa Rica" : "🔥 PREVENTA EXCLUSIVA 2026"}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-500">
                <Crown className="size-3.5" /> SuperToken: +$6,000 USD Cash si ganas ({premios[0]?.nombre || "1° Lugar"})
              </div>
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase">
              ¿Te imaginas estrenar un <span className="text-fire">{premios[0]?.nombre || "Toyota Prado 0KM"}</span> por solo ₡1,000?
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {config.ventasActivas
                ? "La plataforma de eventos promocionales digitales más transparente de Costa Rica. Auditados directamente con los resultados oficiales."
                : config.promoSubtitulo || "Estamos afinando los últimos detalles. ¡Escríbenos por WhatsApp para ser de los primeros en acceder a la Preventa Exclusiva y asegurar tus números!"}
            </p>

            {/* Imagen Principal Showcase con Badges Flotantes */}
            <div className="relative mx-auto mt-12 max-w-5xl group">
              <div className="overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-b from-card to-background p-2 shadow-[var(--shadow-card)] transition-transform duration-500 group-hover:scale-[1.01]">
                <img
                  src={premios[0]?.imagen || pradoImg}
                  alt={premios[0]?.nombre || "Gran Entrega 2026"}
                  className="w-full rounded-2xl object-cover max-h-[520px] brightness-105"
                />
              </div>

              {/* Badges Flotantes de Lujo */}
              <div className="absolute -top-4 left-6 hidden sm:flex items-center gap-2 rounded-xl border border-primary/40 bg-card/90 px-4 py-2 text-xs font-bold text-foreground backdrop-blur shadow-lg">
                <Key className="size-4 text-primary" /> 0 Kilómetros · Año 2026
              </div>

              <div className="absolute -top-4 right-6 hidden sm:flex items-center gap-2 rounded-xl border border-amber-500/50 bg-card/90 px-4 py-2 text-xs font-bold text-amber-400 backdrop-blur shadow-lg">
                <Crown className="size-4 text-amber-500" /> Bono $6,000 USD con SuperToken
              </div>

              <div className="absolute -bottom-4 right-6 hidden sm:flex items-center gap-2 rounded-xl border border-success/40 bg-card/90 px-4 py-2 text-xs font-bold text-success backdrop-blur shadow-lg">
                <ShieldCheck className="size-4 text-success" /> Traspaso y Marchamo Incluidos
              </div>
            </div>

            {/* CTA Principal de Conversión */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={irAPaquetes}
                className="w-full sm:w-auto text-base px-8 py-7 shadow-[var(--shadow-fire)] group cursor-pointer"
              >
                {config.ventasActivas ? (
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

        {/* BANNER INTERACTIVO JUEGOS EXPRESS (RASPA / RULETA) */}
        {Boolean(sorteo?.raspaConfig?.activo) && sorteo?.raspaConfig?.modo !== "ninguno" && (
          <section className="relative z-10 -mt-8 pb-10">
            <div className="mx-auto max-w-5xl px-5">
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
                    <Sparkles className="size-4" /> ¡JUGAR AHORA (₡{(sorteo.raspaConfig?.precio || 1000).toLocaleString("es-CR")})!
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LAS 3 ENTREGAS DE LA EDICIÓN */}
        <section className="bg-secondary/40 py-20 border-y border-border">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Más oportunidades de ser favorecido
              </span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
                Tres Entregas Espectaculares
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Con cada paquete adquieres triple oportunidad según las combinaciones oficiales.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {premios.map((p, idx) => {
                const isMayor = p.nivel === "Premio Mayor" || idx === 0;
                const isSegundo = p.nivel === "Segundo Premio" || idx === 1;
                const tagLugar = isMayor ? "1° Lugar" : isSegundo ? "2° Lugar" : "3° Lugar";
                const defaultImg = isMayor ? pradoImg : isSegundo ? motoImg : consolaImg;

                return (
                  <div
                    key={p.id || idx}
                    className={`rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)] relative overflow-hidden flex flex-col justify-between ${
                      isMayor ? "border-primary/50" : "border-border"
                    }`}
                  >
                    <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                      {isMayor && (
                        <span className="rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Crown className="size-3" /> +$6,000 USD
                        </span>
                      )}
                      <span
                        className={`rounded-full px-3 py-0.5 text-[11px] font-bold uppercase ${
                          isMayor
                            ? "bg-primary/20 text-primary border border-primary/40"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        {tagLugar}
                      </span>
                    </div>

                    <img
                      src={p.imagen || defaultImg}
                      alt={p.nombre}
                      className="rounded-xl h-48 w-full object-cover"
                    />

                    <div className="mt-4">
                      <h3 className="font-bold text-xl">{p.nombre}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isMayor
                          ? "Vehículo 0 KM con traspaso y marchamo incluidos."
                          : isSegundo
                          ? "Deportiva para dominar la calle y la pista con estilo."
                          : "Consola de última generación con controles y juegos incluidos."}
                      </p>
                      {isMayor && (
                        <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
                          <Crown className="size-3.5" /> Opción SuperToken: ¡$6,000 USD Cash extra!
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ZONA DE COMPRA Y CUENTA REGRESIVA */}
        <section id="paquetes-compra" className="py-20 mx-auto max-w-6xl px-5 scroll-mt-20">
          {/* Contador y Progreso */}
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Timer className="size-4 text-primary" /> El evento cierra en
            </div>
            <div className="mt-4 flex justify-center gap-3">
              {[
                { v: t.d, l: "Días" },
                { v: t.h, l: "Horas" },
                { v: t.m, l: "Min" },
                { v: t.s, l: "Seg" },
              ].map((u) => (
                <div
                  key={u.l}
                  className="w-20 rounded-xl border border-border bg-secondary/50 py-3"
                >
                  <div className="font-display text-3xl text-primary">
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {u.l}
                  </div>
                </div>
              ))}
            </div>

            {progreso > 0 && (
              <div className="mt-8 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso de colocación</span>
                  <span className="font-semibold text-primary">{progreso}% de Tokens asignados</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-fire)] transition-all duration-700"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              {paquetes.length === 1
                ? "🔥 Paquete Oficial del Evento"
                : config.ventasActivas
                ? "Elige tu Paquete Digital"
                : "🔥 Preventa Exclusiva de Tokens"}
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide uppercase">
              {paquetes.length === 1
                ? "Adquiere tus Tokens Digitales"
                : config.ventasActivas
                ? "Elige tu paquete de Tokens"
                : "Paquetes Oficiales del Evento"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {paquetes.length === 1
                ? "Participa con tu paquete especial de 3 combinaciones oficiales por ₡5,000. Puedes generarlos al azar o elegir tus números favoritos."
                : config.ventasActivas
                ? "Más Tokens, más oportunidades. Puedes generarlos al azar o elegir tus números favoritos."
                : "La venta directa abrirá muy pronto. ¡Contáctanos por WhatsApp para apartar tus números antes del lanzamiento público!"}
            </p>
          </div>

          <div className={`mt-12 ${paquetes.length === 1 ? "max-w-md mx-auto" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"}`}>
            {paquetes.map((p) => {
              const es3x5000 = p.cantidad === 3 && p.precio === 5000;
              const esPopular = p.cantidad === 12 && p.precio === 12000;

              return (
                <button
                  key={p.cantidad}
                  onClick={() => abrir(p)}
                  className={`w-full group relative cursor-pointer rounded-2xl border bg-[image:var(--gradient-surface)] p-7 text-left transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--shadow-fire)] ${
                    es3x5000 ? "border-amber-500/60 bg-gradient-to-b from-amber-500/15 via-card to-card shadow-[0_0_40px_rgba(245,158,11,0.2)]" : "border-border"
                  }`}
                >
                  {es3x5000 ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-3.5 py-1 text-xs font-black text-black shadow-md">
                      🔥 Paquete Especial Único 3x₡5,000
                    </span>
                  ) : esPopular ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-[image:var(--gradient-fire)] px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                      Más popular
                    </span>
                  ) : null}

                  <div className="font-display text-5xl sm:text-6xl text-primary">{p.cantidad}</div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mt-1">
                    Tokens Digitales Oficiales
                  </div>
                  <div className="mt-4 text-3xl font-bold text-foreground">₡{p.precio.toLocaleString("es-CR")}</div>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                    {config.ventasActivas ? "Adquirir ahora →" : "Apartar por WhatsApp →"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* CÓMO FUNCIONA EN 3 PASOS */}
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

        {/* FICHA TÉCNICA DEL CARRO */}
        <section className="py-20 mx-auto max-w-6xl px-5">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Gran Entrega Detallada
              </span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl leading-tight uppercase">
                {sorteo.detalleTitulo || "Toyota Prado 2026: Lujo, Potencia y Confort"}
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {sorteo.detalleSubtitulo || "Un vehículo 0 kilómetros, sacado de agencia con garantía total de fábrica y entregado formalmente a tu nombre."}
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
              <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
                <img
                  src={sorteo.detalleImagen || premios[0]?.imagen || pradoImg}
                  alt={sorteo.detalleTitulo || "Entrega Detallada"}
                  className="w-full h-80 object-cover"
                />
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

        {/* MINI-SORTEOS SEMANALES */}
        {config.miniSorteosActivo && (
          <div className="mx-auto max-w-6xl px-5 py-8">
            <MiniSorteosSection config={config} />
          </div>
        )}

        {/* GANADORES ANTERIORES Y TESTIMONIOS */}
        <GanadoresSection ganadores={sorteo.ganadoresTestimonios} />

        {/* RANKING Y CONCURSO DE REFERIDOS */}
        {config.rankingReferidosActivo && (
          <div className="mx-auto max-w-6xl px-5 py-8">
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
      />

      <JuegosExpressModal
        open={openRaspa}
        onOpenChange={setOpenRaspa}
        config={sorteo.raspaConfig}
      />
    </div>
  );
}
