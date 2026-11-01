import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Crown,
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
  const [podioActivo, setPodioActivo] = useState<1 | 2 | 3>(2);

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
        subtitulo: "Touring con ADN de MotoGP · Motor Stradale",
        descripcion: "Vehículo a escoger por el favorecido del 1° Lugar con traspaso notarial y marchamo incluidos.",
        valor: "₡35.500.000",
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
        subtitulo: "Boxer Turbo AWD · Edición Japonesa de Colección",
        descripcion: "Vehículo a escoger por el favorecido del 2° Lugar con traspaso notarial y marchamo incluidos.",
        valor: "₡26.000.000",
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
        valor: "₡28.000.000",
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
        descripcion: "Premio oficial entregado formalmente ante Notario Público sin retenciones ni comisiones.",
        valor: "₡4.000.000",
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

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ─── 1. NAVBAR (EXACTO A TU CAPTURA) ─── */}
      <header className="border-b border-white/10 bg-[#070708]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg font-black tracking-wider text-amber-500">
              AVAL
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 border-l border-white/20">
              COMMUNITY
            </span>
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
      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        
        {/* Encabezado */}
        <div className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="size-3" /> OPORTUNIDAD ACTIVA · COMUNIDAD AVAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight">
            TU PRÓXIMA GRAN OPORTUNIDAD
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
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

        {/* Sección "EN ESTE LUGAR TENÉS 2 OPCIONES PARA ELEGIR" (Con Miniaturas Exactas) */}
        {podioActual.opciones.length > 1 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Crown className="size-3.5" /> EN ESTE LUGAR TENÉS 2 OPCIONES PARA ELEGIR:
              </span>
              <span className="text-zinc-500 text-[10px]">Toca para cambiar la vista</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {podioActual.opciones.map((opc, idx) => {
                const isSelected = opcionElegida === idx;
                return (
                  <button
                    key={opc.id}
                    type="button"
                    onClick={() => setOpcionElegida(idx)}
                    className={`rounded-2xl p-3 text-left transition-all cursor-pointer border flex flex-col justify-between relative overflow-hidden group ${
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

                    {/* Miniatura visual del vehículo */}
                    <div className="h-14 w-full rounded-lg overflow-hidden bg-black/60 my-2 border border-white/5 flex items-center justify-center">
                      <img
                        src={opc.imagen}
                        alt={opc.nombre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div>
                      <div className="font-black text-xs sm:text-sm text-white leading-tight">
                        {opc.nombre}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                        {opc.subtitulo}
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono font-bold text-amber-400 flex items-center justify-between">
                      <span>Valor: {opc.valor}</span>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500">{opc.tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Visor Fotográfico Cinemático */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black group shadow-2xl">
          <div className="aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-[#070708] overflow-hidden">
            <img
              src={opcionActual.imagen}
              alt={opcionActual.nombre}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/80 backdrop-blur-md border border-white/20">
              {opcionActual.origen}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 bg-amber-500/20 backdrop-blur-md border border-amber-500/40">
              {opcionActual.tag}
            </span>
          </div>

          {opcionActual.premioOriginal && (
            <button
              type="button"
              onClick={() => onVerFicha(opcionActual.premioOriginal as Premio)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-white/90 text-zinc-300 hover:text-black border border-white/20 text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg"
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
            {podioActual.tituloNivel} · Entrega con traspaso notarial y marchamo incluidos
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed pt-0.5">
            {opcionActual.descripcion}
          </p>
        </div>

        {/* Progreso de la Dinámica */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-3.5 text-left space-y-2">
          <div className="text-xs font-semibold text-zinc-400">
            Progreso de la dinámica
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">Participaciones de la comunidad</span>
            <span className="font-mono font-black text-amber-400">{pct}% cubierto</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
              style={{ width: `${Math.max(4, pct)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
            <span>Sorteo oficial con la Junta de Protección Social (JPS)</span>
            <span>{sorteo.fecha || "18 Dic 2026"}</span>
          </div>
        </div>

        {/* Selector de Paquetes de Tokens */}
        <div className="text-left space-y-2.5 pt-1">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Elige tu paquete de tokens
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Selecciona cuántos tokens deseas adquirir para respaldar la comunidad y participar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {paquetes.slice(0, 4).map((p) => {
              const isSelected = paqueteSeleccionado.cantidad === p.cantidad;
              return (
                <button
                  key={p.cantidad}
                  type="button"
                  onClick={() => setPaqueteSeleccionado(p)}
                  className={`rounded-2xl p-3.5 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10"
                      : "bg-zinc-950 border-white/10 hover:border-white/20 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="text-2xl font-black text-white leading-none">
                    {p.cantidad}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">Tokens</div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-2.5">
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
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-base shadow-2xl shadow-amber-500/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] gap-2 tracking-wider uppercase mt-1"
          >
            PARTICIPAR AHORA · {formatCRC(paqueteSeleccionado.precio)}
            <ArrowRight className="size-5" />
          </Button>

          <p className="text-center text-[11px] text-zinc-500">
            Acepta SINPE Móvil oficial y Tarjeta. Consulta las condiciones y reglamento de participación.
          </p>
        </div>

        {/* FORMA PARTE DE AVAL */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-left space-y-1.5 mt-4">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
            FORMA PARTE DE AVAL
          </h4>
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
      </main>
    </div>
  );
}
