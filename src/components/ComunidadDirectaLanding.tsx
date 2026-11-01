import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Crown,
  Flame,
  Sparkles,
  Ticket,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Premio } from "@/lib/premios-types";
import type { Paquete } from "@/components/StickersModal";
import type { Sorteo, Config } from "@/lib/admin-store";
import carroImg from "@/assets/premio-carro.jpg";
import motoImg from "@/assets/premio-moto.jpg";
import multistradaImg from "@/assets/premio-multistrada.jpg";
import subaruImg from "@/assets/premio-subaru.jpg";
import efectivoImg from "@/assets/premio-efectivo.jpg";

interface Props {
  premios: Premio[];
  paquetes: Paquete[];
  sorteo: Sorteo;
  config: Config;
  progreso: {
    porcentajeReal: number;
    tokensVendidos: number;
    totalMetaTokens: number;
  };
  cuentaRegresiva: {
    d: number;
    h: number;
    m: number;
    s: number;
    terminado: boolean;
  };
  onSeleccionarPaquete: (paquete: Paquete) => void;
  onVerFicha: (premio: Premio) => void;
  onCambiarAClasico?: () => void;
}

const formatCRC = (val: number) => "₡" + Number(val || 0).toLocaleString("es-CR");

export function ComunidadDirectaLanding({
  premios,
  paquetes,
  sorteo,
  config,
  progreso,
  cuentaRegresiva,
  onSeleccionarPaquete,
  onVerFicha,
  onCambiarAClasico,
}: Props) {
  // Podio seleccionado: 1 (Motos), 2 (Autos), 3 (Efectivo)
  const [podioActivo, setPodioActivo] = useState<1 | 2 | 3>(1);

  // En cada podio, cuál de las 2 opciones está seleccionada (0 o 1)
  const [opcionElegida, setOpcionElegida] = useState<number>(0);

  // Paquete de tokens seleccionado (por defecto 6 tokens ₡8.000)
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<Paquete>(() => {
    return paquetes.find((p) => p.cantidad === 6) || paquetes[1] || paquetes[0] || { cantidad: 6, precio: 8000 };
  });

  // Mapear los premios dinámicos desde la base de datos con fotos de alta fidelidad
  const podioData = useMemo(() => {
    const p1List = premios.filter(
      (p) => p.nivel?.includes("1°") || p.nivel === "Premio Mayor" || (p.nivel as string) === "1° Lugar (A Elección)"
    );
    const p2List = premios.filter(
      (p) => p.nivel?.includes("2°") || p.nivel === "Segundo Premio" || (p.nivel as string) === "2° Lugar (A Elección)"
    );
    const p3List = premios.filter(
      (p) => p.nivel?.includes("3°") || p.nivel === "Tercer Premio" || (p.nivel as string) === "3° Lugar (Efectivo)"
    );

    const findByKw = (list: Premio[], kw: string) =>
      list.find((p) => (p.nombre || "").toLowerCase().includes(kw.toLowerCase()));

    // 1.er Lugar: Multistrada vs Panigale
    const pMulti = findByKw(p1List, "multistrada") || p1List[0];
    const pPani = findByKw(p1List, "panigale") || (p1List[1] !== pMulti ? p1List[1] : undefined);

    const limpiarImg = (img?: string, fallback = "") => {
      if (!img || img.includes("consola")) return fallback;
      return img;
    };

    const opciones1 = [
      {
        id: pMulti?.id || "ducati-multistrada",
        premioOriginal: pMulti,
        nombre: pMulti?.nombre || "Ducati Multistrada V4 RS",
        nombreCorto: "Ducati Multistrada",
        subtitulo: "Touring con ADN de MotoGP · Motor Stradale",
        descripcion: "Vehículo a escoger por el favorecido con traspaso notarial y marchamo incluidos.",
        valor: "₡35.500.000",
        imagen: limpiarImg(pMulti?.imagen, multistradaImg),
        origen: "ducati.com",
        tag: "Maxi-Trail RS",
      },
      {
        id: pPani?.id || "ducati-panigale",
        premioOriginal: pPani,
        nombre: pPani?.nombre || "Ducati Panigale V4 S 2025",
        nombreCorto: "Ducati Panigale",
        subtitulo: "Superbike Desmosedici Stradale · 215.5 HP",
        descripcion: "Vehículo a escoger por el favorecido con traspaso notarial y marchamo incluidos.",
        valor: "₡34.000.000",
        imagen: limpiarImg(pPani?.imagen, motoImg),
        origen: "ducati.com",
        tag: "Deportiva Pura",
      },
    ];

    // 2.º Lugar: Subaru WRX STI vs Mercedes GLE
    const pSubaru = findByKw(p2List, "subaru") || findByKw(p2List, "impreza") || p2List[0];
    const pMercedes = findByKw(p2List, "mercedes") || findByKw(p2List, "gle") || (p2List[1] !== pSubaru ? p2List[1] : undefined);

    const opciones2 = [
      {
        id: pSubaru?.id || "subaru-wrx",
        premioOriginal: pSubaru,
        nombre: pSubaru?.nombre || "Subaru IMPREZA* 2017 wrx STI",
        nombreCorto: "Subaru WRX STI",
        subtitulo: "Boxer Turbo AWD · Edición Japonesa de Colección",
        descripcion: "Vehículo a escoger por el favorecido con traspaso notarial y marchamo incluidos.",
        valor: "₡26.000.000",
        imagen: limpiarImg(pSubaru?.imagen, subaruImg),
        origen: "subaru.cr",
        tag: "AWD Turbo",
      },
      {
        id: pMercedes?.id || "mercedes-gle",
        premioOriginal: pMercedes,
        nombre: pMercedes?.nombre || "Mercedes-Benz Clase GLE 2016",
        nombreCorto: "Mercedes GLE 2016",
        subtitulo: "SUV Premium Full Extras · Elegancia y Confort",
        descripcion: "Vehículo a escoger por el favorecido con traspaso notarial y marchamo incluidos.",
        valor: "₡28.000.000",
        imagen: limpiarImg(pMercedes?.imagen, carroImg),
        origen: "mercedes-benz.com",
        tag: "SUV de Lujo",
      },
    ];

    // 3.er Lugar: ₡4,000,000 en Efectivo (¡Fajos de billetes, CERO Nintendo!)
    const pEfectivo = p3List[0];

    const opciones3 = [
      {
        id: pEfectivo?.id || "efectivo-4m",
        premioOriginal: pEfectivo,
        nombre: pEfectivo?.nombre || "₡4,000,000 en Efectivo",
        nombreCorto: "₡4,000,000 Efectivo",
        subtitulo: "Transferencia Bancaria Inmediata Libre de Impuestos",
        descripcion: "Premio oficial entregado formalmente ante Notario Público sin retenciones ni comisiones.",
        valor: "₡4.000.000",
        imagen: limpiarImg(pEfectivo?.imagen, efectivoImg),
        origen: "avalcommunity.cr",
        tag: "Efectivo Directo",
      },
    ];

    return {
      1: {
        tituloNivel: "1.er Lugar · Motos de Ensueño",
        badge: "🥇 1.ER LUGAR",
        resumen: "2 Motos Ducati",
        opciones: opciones1,
      },
      2: {
        tituloNivel: "2.º Lugar · Autos de Alta Gama",
        badge: "🥈 2.º LUGAR",
        resumen: "Subaru vs GLE",
        opciones: opciones2,
      },
      3: {
        tituloNivel: "3.er Lugar · Efectivo Garantizado",
        badge: "🥉 3.ER LUGAR",
        resumen: "₡4M Efectivo",
        opciones: opciones3,
      },
    };
  }, [premios]);

  const podioActual = podioData[podioActivo];
  const opcionActual = podioActual.opciones[opcionElegida] || podioActual.opciones[0];
  const pct = Math.min(100, Math.max(0, Math.round(progreso.porcentajeReal || 0)));

  return (
    <div className="h-screen w-full bg-[#070708] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col justify-between overflow-hidden">
      {/* ─── 1. NAVBAR COMPACTO (48px) ─── */}
      <header className="border-b border-white/10 bg-[#070708]/95 backdrop-blur-md shrink-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg font-black tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors">
              AVAL
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 border-l border-white/20">
              COMMUNITY
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
            <Link to="/" className="text-white font-bold hover:text-amber-400 transition-colors">
              Inicio
            </Link>
            <Link to="/validar" className="hover:text-white transition-colors flex items-center gap-1">
              <Ticket className="size-3.5 text-amber-400" />
              Validar
            </Link>
            {onCambiarAClasico && (
              <button
                type="button"
                onClick={onCambiarAClasico}
                className="hover:text-amber-400 transition-colors hidden sm:inline text-zinc-400 cursor-pointer"
              >
                Modo Detallado
              </button>
            )}
            <Link to="/admin" className="hover:text-amber-400 transition-colors hidden sm:inline">
              Consola
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── 2. CONTENIDO PRINCIPAL: 1 PANTALLA TOTAL (0 SCROLL) ─── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-2 sm:py-3 flex flex-col justify-center overflow-hidden">
        
        {/* Layout en 2 columnas en Desktop / 1 columna compacta en Móvil */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center">
          
          {/* ═══ COLUMNA IZQUIERDA: FOTO + SELECTORES DE PODIO Y OPCIÓN (col-span-7) ═══ */}
          <div className="md:col-span-7 flex flex-col gap-2">
            
            {/* Pestañas de Podio (1.er Lugar, 2.º Lugar, 3.er Lugar) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/10">
              {[1, 2, 3].map((lvl) => {
                const isActive = podioActivo === lvl;
                const d = podioData[lvl as 1 | 2 | 3];
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setPodioActivo(lvl as 1 | 2 | 3);
                      setOpcionElegida(0);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isActive
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{d.badge}</span>
                    <span className="hidden sm:inline text-[10px] font-medium opacity-90">({d.resumen})</span>
                  </button>
                );
              })}
            </div>

            {/* Selector de Doble Opción (Opción A vs Opción B) — Compacto y Táctil */}
            {podioActual.opciones.length > 1 ? (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-amber-500/30">
                <span className="text-[10px] font-black uppercase text-amber-400 px-2 shrink-0 flex items-center gap-1">
                  <Crown className="size-3" /> A Elección:
                </span>
                <div className="grid grid-cols-2 gap-1 flex-1">
                  {podioActual.opciones.map((opc, idx) => {
                    const isSelected = opcionElegida === idx;
                    return (
                      <button
                        key={opc.id}
                        type="button"
                        onClick={() => setOpcionElegida(idx)}
                        className={`py-1 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center justify-between gap-1 truncate ${
                          isSelected
                            ? "bg-zinc-800 text-amber-400 border border-amber-500/50 shadow-sm"
                            : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span className="truncate">
                          <strong className="text-white mr-1">{idx === 0 ? "A:" : "B:"}</strong>
                          {opc.nombreCorto}
                        </span>
                        {isSelected && <CheckCircle2 className="size-3 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-1 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center justify-between">
                <span>💰 Premio Garantizado ante Notario</span>
                <span className="font-mono">₡4,000,000 Directo</span>
              </div>
            )}

            {/* Visor Fotográfico Cinemático (Ajustado a la pantalla) */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl group">
              <div className="h-44 sm:h-60 md:h-72 w-full flex items-center justify-center bg-[#070708] overflow-hidden">
                <img
                  src={opcionActual.imagen}
                  alt={opcionActual.nombre}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Badges sobre la foto */}
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-300 bg-black/80 backdrop-blur-md border border-white/20">
                  {opcionActual.origen}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-400 bg-amber-500/20 backdrop-blur-md border border-amber-500/40">
                  {opcionActual.tag}
                </span>
              </div>

              {opcionActual.premioOriginal && (
                <button
                  type="button"
                  onClick={() => onVerFicha(opcionActual.premioOriginal as Premio)}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-white/90 text-zinc-300 hover:text-black border border-white/20 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                >
                  <Sparkles className="size-3 text-amber-400" /> Ver Ficha
                </button>
              )}
            </div>
          </div>

          {/* ═══ COLUMNA DERECHA: TEXTOS + PAQUETES + BOTÓN DORADO (col-span-5) ═══ */}
          <div className="md:col-span-5 flex flex-col justify-between gap-2.5 text-left">
            
            {/* Encabezado y Título del Premio Activo */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="size-2.5" /> OPORTUNIDAD ACTIVA · COMUNIDAD AVAL
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase leading-tight mt-1 truncate">
                {opcionActual.nombre}
              </h1>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                {opcionActual.descripcion} Traspaso notarial y marchamo al día.
              </p>
            </div>

            {/* Progreso de la Dinámica (Ultra Compacto) */}
            <div className="rounded-xl border border-white/10 bg-zinc-950 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium text-[11px]">Meta de la comunidad</span>
                <span className="font-mono font-black text-amber-400 text-xs">{pct}% cubierto</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                  style={{ width: `${Math.max(4, pct)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                <span>Auditoría con emisión oficial JPS</span>
                <span>{sorteo.fecha || "18 Dic 2026"}</span>
              </div>
            </div>

            {/* Selector de Paquete de Tokens (Grid 4 columnas) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-zinc-300 tracking-wider">
                  Elige tus Tokens
                </span>
                <span className="text-[10px] text-zinc-500">Números oficiales</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {paquetes.slice(0, 4).map((p) => {
                  const isSelected = paqueteSeleccionado.cantidad === p.cantidad;
                  return (
                    <button
                      key={p.cantidad}
                      type="button"
                      onClick={() => setPaqueteSeleccionado(p)}
                      className={`rounded-xl p-2 text-center transition-all cursor-pointer border flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10"
                          : "bg-zinc-950 border-white/10 hover:border-white/20 hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="text-lg font-black text-white leading-none">
                        {p.cantidad}
                      </div>
                      <div className="text-[9px] text-zinc-400 font-medium mt-0.5">Tokens</div>
                      <div className="text-[11px] font-black text-amber-400 font-mono mt-1">
                        {formatCRC(p.precio)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón Dorado Gigante de Acción Rápida */}
            <div className="space-y-1 pt-1">
              <Button
                type="button"
                size="lg"
                onClick={() => onSeleccionarPaquete(paqueteSeleccionado)}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] gap-2 tracking-wider uppercase"
              >
                PARTICIPAR AHORA · {formatCRC(paqueteSeleccionado.precio)}
                <ArrowRight className="size-4" />
              </Button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-400" /> SINPE Móvil y Tarjeta
                </span>
                <span>•</span>
                <span>Traspaso ante Notario</span>
              </div>
            </div>

            {/* Forma Parte de Aval (Cápsula de Comunidad) */}
            <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-2 text-[10px] text-zinc-400 flex items-center justify-between">
              <span className="font-bold text-amber-400">FORMA PARTE DE AVAL</span>
              <span className="text-zinc-500 text-[9px]">Comercios Aliados · Experiencias</span>
            </div>

          </div>
        </div>
      </main>

      {/* ─── 3. FOOTER DISCRETO DE 1 LÍNEA (28px) ─── */}
      <footer className="border-t border-white/10 bg-black/90 py-1.5 px-4 text-center text-[10px] text-zinc-500 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span>© {new Date().getFullYear()} AVAL Community CR</span>
          <div className="flex items-center gap-3 text-zinc-400 text-[10px]">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            {onCambiarAClasico && (
              <button
                type="button"
                onClick={onCambiarAClasico}
                className="hover:text-amber-400 underline decoration-dotted text-zinc-400 cursor-pointer"
              >
                Edición Clásica
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
