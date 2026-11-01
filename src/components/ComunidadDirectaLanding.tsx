import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  Ticket,
  ArrowRight,
  ShieldCheck,
  ZoomIn,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  onFotoZoom?: (foto: { url: string; titulo: string; nivel?: string }) => void;
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
  onFotoZoom,
  onCambiarAClasico,
}: Props) {
  // Podio seleccionado: 1 (Motos), 2 (Autos), 3 (Efectivo)
  const [podioActivo, setPodioActivo] = useState<1 | 2 | 3>(2);

  // En cada podio, cuál de las 2 opciones está seleccionada (0 o 1)
  const [opcionElegida, setOpcionElegida] = useState<number>(0);

  // Lightbox local para ampliar foto al hacer clic
  const [lightboxFoto, setLightboxFoto] = useState<{ url: string; titulo: string; nivel?: string } | null>(null);

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
        subtitulo: "Touring con ADN de MotoGP · Motor Stradale",
        descripcion: "Vehículo a escoger por el favorecido del 1° Lugar con traspaso notarial y marchamo incluidos.",
        imagen: limpiarImg(pMulti?.imagen, multistradaImg),
        origen: "ducati.com",
        tag: "Maxi-Trail RS",
      },
      {
        id: pPani?.id || "ducati-panigale",
        premioOriginal: pPani,
        nombre: pPani?.nombre || "Ducati Panigale V4 S 2025",
        subtitulo: "Superbike Desmosedici Stradale · 215.5 HP",
        descripcion: "Vehículo a escoger por el favorecido del 1° Lugar con traspaso notarial y marchamo incluidos.",
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
        subtitulo: "Boxer Turbo AWD · Edición Japonesa de Colección",
        descripcion: "Vehículo a escoger por el favorecido del 2° Lugar con traspaso notarial y marchamo incluidos.",
        imagen: limpiarImg(pSubaru?.imagen, subaruImg),
        origen: "subaru.cr",
        tag: "AWD TURBO",
      },
      {
        id: pMercedes?.id || "mercedes-gle",
        premioOriginal: pMercedes,
        nombre: pMercedes?.nombre || "Mercedes-Benz Clase GLE 2016",
        subtitulo: "SUV Premium Full Extras · Elegancia y Confort",
        descripcion: "Vehículo a escoger por el favorecido del 2° Lugar con traspaso notarial y marchamo incluidos.",
        imagen: limpiarImg(pMercedes?.imagen, carroImg),
        origen: "mercedes-benz.com",
        tag: "SUV DE LUJO",
      },
    ];

    // 3.er Lugar: ₡4,000,000 en Efectivo
    const pEfectivo = p3List[0];

    const opciones3 = [
      {
        id: pEfectivo?.id || "efectivo-4m",
        premioOriginal: pEfectivo,
        nombre: pEfectivo?.nombre || "₡4,000,000 en Efectivo",
        subtitulo: "Transferencia Bancaria Inmediata Libre de Impuestos",
        descripcion: "Premio oficial entregado formalmente.",
        imagen: limpiarImg(pEfectivo?.imagen, efectivoImg),
        origen: "avalcommunity.cr",
        tag: "EFECTIVO DIRECTO",
      },
    ];

    return {
      1: {
        tituloNivel: "1.er Lugar · Motos de Ensueño",
        badge: "🥇 1.er Lugar",
        resumen: "2 Motos Ducati",
        opciones: opciones1,
      },
      2: {
        tituloNivel: "2.º Lugar · Autos de Alta Gama",
        badge: "🥈 2.º Lugar",
        resumen: "Subaru vs GLE",
        opciones: opciones2,
      },
      3: {
        tituloNivel: "3.er Lugar · Efectivo Garantizado",
        badge: "🥉 3.er Lugar",
        resumen: "₡4M Efectivo",
        opciones: opciones3,
      },
    };
  }, [premios]);

  const podioActual = podioData[podioActivo];
  const opcionActual = podioActual.opciones[opcionElegida] || podioActual.opciones[0];
  const pct = Math.min(100, Math.max(0, Math.round(progreso.porcentajeReal || 0)));

  const abrirFotoEnGrande = () => {
    const foto = {
      url: opcionActual.imagen,
      titulo: opcionActual.nombre,
      nivel: podioActual.tituloNivel,
    };
    if (onFotoZoom) {
      onFotoZoom(foto);
    } else {
      setLightboxFoto(foto);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ─── 1. NAVBAR (EXACTO A TU CAPTURA) ─── */}
      <header className="border-b border-white/10 bg-[#070708]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/isotipo.png"
              alt="Aval Community CR"
              className="size-7 sm:size-8 object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-amber-500">
                AVAL
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1.5 border-l border-white/20">
                COMMUNITY
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-xs text-zinc-400 font-medium">
            <Link to="/" className="text-white font-bold hover:text-amber-400 transition-colors">
              Inicio
            </Link>
            <Link to="/validar" className="hover:text-white transition-colors flex items-center gap-1">
              <Ticket className="size-3.5 text-amber-400" />
              Validar Tokens
            </Link>
            <Link to="/admin" className="hover:text-amber-400 transition-colors hidden sm:inline">
              Consola
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── 2. CONTENIDO PRINCIPAL CENTRADO (EXACTO A TU CAPTURA) ─── */}
      <main className="max-w-3xl mx-auto px-4 py-3 sm:py-4 space-y-3">
        
        {/* Encabezado */}
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="size-3" /> OPORTUNIDAD ACTIVA · COMUNIDAD AVAL
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-tight">
            TU PRÓXIMA GRAN OPORTUNIDAD
          </h1>
          <p className="text-xs text-zinc-400 leading-snug">
            Descubre los beneficios destacados. En cada lugar, <strong className="text-white">vos escogés cuál de los dos premios te llevás</strong> como miembro oficial de Aval Community.
          </p>
        </div>

        {/* Selector de Podio (1°, 2°, 3° Lugar) */}
        <div className="grid grid-cols-3 gap-2">
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
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                  isActive
                    ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.01]"
                    : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <span>{d.badge}</span>
                <span className="text-[10px] font-semibold opacity-90">{d.resumen}</span>
              </button>
            );
          })}
        </div>

        {/* Sección "EN ESTE LUGAR TENÉS 2 OPCIONES PARA ELEGIR" (Sin foto miniatura para que suba y quede en 1 pantalla) */}
        {podioActual.opciones.length > 1 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Crown className="size-3.5" /> EN ESTE LUGAR TENÉS 2 OPCIONES PARA ELEGIR:
              </span>
              <span className="text-zinc-500 text-[10px]">Toca para cambiar la vista</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {podioActual.opciones.map((opc, idx) => {
                const isSelected = opcionElegida === idx;
                return (
                  <button
                    key={opc.id}
                    type="button"
                    onClick={() => setOpcionElegida(idx)}
                    className={`rounded-2xl p-2.5 text-left transition-all cursor-pointer border flex flex-col justify-between relative overflow-hidden group ${
                      isSelected
                        ? "bg-zinc-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10 scale-[1.01]"
                        : "bg-zinc-950 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        OPCIÓN {idx === 0 ? "A" : "B"}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="size-4 text-amber-400" />
                      ) : (
                        <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Elegir</span>
                      )}
                    </div>

                    <div className="mt-1.5">
                      <div className="font-black text-xs sm:text-sm text-white leading-tight">
                        {opc.nombre}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                        {opc.subtitulo}
                      </div>
                    </div>

                    <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400">{opc.tag}</span>
                      <span className="text-[9px] text-zinc-500">Traspaso y marchamo</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Visor Fotográfico Cinemático - 100% visible sin recorte y clic para ampliar */}
        <div
          onClick={abrirFotoEnGrande}
          className="relative rounded-2xl overflow-hidden border border-white/15 bg-black group shadow-2xl cursor-zoom-in select-none"
        >
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center bg-gradient-to-b from-[#111115] via-[#09090b] to-black overflow-hidden p-1.5 sm:p-2">
            <img
              src={opcionActual.imagen}
              alt={opcionActual.nombre}
              className="size-full object-contain object-center group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
            />
          </div>

          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono text-zinc-300 bg-black/80 backdrop-blur-md border border-white/20">
              {opcionActual.origen}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-500/20 backdrop-blur-md border border-amber-500/40">
              {opcionActual.tag}
            </span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/85 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-zinc-200 border border-white/20 backdrop-blur shadow-md group-hover:bg-amber-500 group-hover:text-black transition-colors pointer-events-none">
            <ZoomIn className="size-3 sm:size-3.5" /> Tocar para ampliar
          </div>

          {opcionActual.premioOriginal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onVerFicha(opcionActual.premioOriginal as Premio);
              }}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/80 hover:bg-white text-zinc-300 hover:text-black border border-white/20 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer shadow-lg z-10"
            >
              <Sparkles className="size-3 text-amber-400" /> Ver Ficha
            </button>
          )}
        </div>

        {/* Título del Vehículo / Premio Activo */}
        <div className="text-left space-y-1 pt-0.5">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {opcionActual.nombre}
          </h2>
          <p className="text-xs text-amber-400 font-semibold">
            {podioActual.tituloNivel}
            {podioActivo !== 3 ? " · Entrega con traspaso notarial y marchamo incluidos" : ""}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed pt-0.5">
            {opcionActual.descripcion}
          </p>
        </div>

        {/* Progreso de la Dinámica */}
        <div className="rounded-xl border border-white/10 bg-zinc-950 p-2.5 text-left space-y-1.5">
          <div className="text-xs font-semibold text-zinc-400">
            Progreso de la dinámica
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">Participaciones de la comunidad</span>
            <span className="font-mono font-black text-amber-400">{pct}% cubierto</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
              style={{ width: `${Math.max(4, pct)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
            <span>Sorteo oficial con la Junta de Protección Social (JPS)</span>
            <span>{sorteo.fecha || "18 Dic 2026"}</span>
          </div>
        </div>

        {/* Selector de Paquetes de Tokens */}
        <div className="text-left space-y-2 pt-0.5">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Elige tu paquete de tokens
            </h3>
            <p className="text-[11px] text-zinc-400">
              Selecciona cuántos tokens deseas adquirir para respaldar la comunidad y participar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {paquetes.slice(0, 4).map((p) => {
              const isSelected = paqueteSeleccionado.cantidad === p.cantidad;
              return (
                <button
                  key={p.cantidad}
                  type="button"
                  onClick={() => setPaqueteSeleccionado(p)}
                  className={`rounded-xl p-2.5 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10"
                      : "bg-zinc-950 border-white/10 hover:border-white/20 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="text-xl font-black text-white leading-none">
                    {p.cantidad}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Tokens</div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-2">
                    {formatCRC(p.precio)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botón Dorado Gigante: PARTICIPAR AHORA */}
          <Button
            type="button"
            size="lg"
            onClick={() => onSeleccionarPaquete(paqueteSeleccionado)}
            className="w-full h-13 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-base shadow-xl shadow-amber-500/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] gap-2 tracking-wider uppercase mt-1"
          >
            PARTICIPAR AHORA · {formatCRC(paqueteSeleccionado.precio)}
            <ArrowRight className="size-5" />
          </Button>

          <p className="text-center text-[10px] text-zinc-500">
            Acepta SINPE Móvil oficial y Tarjeta. Consulta las condiciones y reglamento de participación.
          </p>
        </div>

        {/* FORMA PARTE DE AVAL */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-left space-y-1.5 mt-4">
          <div className="flex items-center gap-2">
            <img src="/isotipo.png" alt="Aval" className="size-4.5 object-contain shrink-0" />
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              FORMA PARTE DE AVAL
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Participa y descubre los beneficios exclusivos de nuestra comunidad.
          </p>
          <div className="text-[11px] text-zinc-500 pt-0.5">
            Beneficios · Tokens · Traspaso Notarial · Comercios Aliados · Experiencias
          </div>
        </div>

        {/* Enlace para volver a la clásica si se desea */}
        {onCambiarAClasico && (
          <div className="text-center pt-1 pb-4">
            <button
              type="button"
              onClick={onCambiarAClasico}
              className="text-xs text-zinc-500 hover:text-amber-400 underline decoration-dotted transition-colors cursor-pointer"
            >
              ¿Deseas ver la edición extendida con galería de fotos, mini-sorteos y preguntas frecuentes? Clic aquí
            </button>
          </div>
        )}

        {/* MODAL LIGHTBOX / ZOOM DE FOTO EN PANTALLA COMPLETA */}
        <Dialog open={!!lightboxFoto} onOpenChange={(v) => { if (!v) setLightboxFoto(null); }}>
          <DialogContent className="max-w-4xl w-[95vw] border border-amber-500/40 bg-zinc-950/95 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl text-foreground">
            <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10 text-left">
              <div>
                {lightboxFoto?.nivel && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    {lightboxFoto.nivel}
                  </span>
                )}
                <DialogTitle className="text-lg sm:text-2xl font-bold text-white mt-1">
                  {lightboxFoto?.titulo}
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="relative mt-2 flex items-center justify-center min-h-[40vh] max-h-[75vh] w-full overflow-hidden rounded-xl bg-black/90 p-2">
              <img
                src={lightboxFoto?.url}
                alt={lightboxFoto?.titulo}
                className="max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
              <span>Vehículo oficial verificado ante Notario Público</span>
              <span className="text-amber-400 font-bold">Aval Community CR</span>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
