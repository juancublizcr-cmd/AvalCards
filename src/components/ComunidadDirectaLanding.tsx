import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CheckCircle2,
  Crown,
  FileCheck,
  Flame,
  Info,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Ticket,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Premio } from "@/lib/premios-types";
import type { Paquete } from "@/components/StickersModal";
import type { Sorteo, Config } from "@/lib/admin-store";
import carroImg from "@/assets/premio-carro.jpg";
import motoImg from "@/assets/premio-moto.jpg";
import consolaImg from "@/assets/premio-consola.jpg";
import subaruImg from "@/assets/premio-subaru.jpg";

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

  // Mapear los premios reales con fotos locales de alta resolución garantizadas
  const podioData = useMemo(() => {
    return {
      1: {
        tituloNivel: "1.er Lugar · Motos de Ensueño",
        badge: "🥇 1.ER LUGAR A ELECCIÓN",
        opciones: [
          {
            id: "ducati-panigale",
            nombre: "Ducati Panigale V4 S 2025",
            subtitulo: "Superbike Desmosedici Stradale · 215.5 HP",
            descripcion: "La máxima expresión deportiva de Borgo Panigale. Traspaso notarial, marchamo y garantía oficial incluidos.",
            valor: "₡34.000.000",
            imagen: motoImg,
            origen: "ducati.com",
            tag: "Deportiva Pura",
          },
          {
            id: "ducati-multistrada",
            nombre: "Ducati Multistrada V4 RS",
            subtitulo: "Touring con ADN de MotoGP · Motor Stradale",
            descripcion: "El balance perfecto entre deportividad extrema y confort de aventura para toda Costa Rica.",
            valor: "₡35.500.000",
            imagen: motoImg,
            origen: "ducati.com",
            tag: "Maxi-Trail RS",
          },
        ],
      },
      2: {
        tituloNivel: "2.º Lugar · Autos de Alta Gama",
        badge: "🥈 2.º LUGAR A ELECCIÓN",
        opciones: [
          {
            id: "subaru-wrx",
            nombre: "Subaru IMPREZA+ 2017 WRX STI",
            subtitulo: "Boxer Turbo AWD · Edición Japonesa de Colección",
            descripcion: "Tracción integral Symmetrical AWD legendaria, caja manual de 6 velocidades y sonido Boxer inconfundible.",
            valor: "₡26.000.000",
            imagen: subaruImg,
            origen: "subaru.cr",
            tag: "AWD Turbo",
          },
          {
            id: "mercedes-gle",
            nombre: "Mercedes-Benz Clase GLE 2016",
            subtitulo: "SUV Premium Full Extras · Elegancia y Confort",
            descripcion: "Lujo alemán absoluto, interiores en cuero, techo panorámico y suspensión neumática de máxima suavidad.",
            valor: "₡28.000.000",
            imagen: carroImg,
            origen: "mercedes-benz.com",
            tag: "SUV de Lujo",
          },
        ],
      },
      3: {
        tituloNivel: "3.er Lugar · Efectivo Garantizado",
        badge: "🥉 3.ER LUGAR DIRECTO",
        opciones: [
          {
            id: "efectivo-4m",
            nombre: "₡4,000,000 en Efectivo Depositado",
            subtitulo: "Transferencia Bancaria Inmediata Libre de Impuestos",
            descripcion: "Premio en efectivo entregado formalmente ante Notario Público el mismo día del sorteo oficial de la JPS.",
            valor: "₡4.000.000",
            imagen: consolaImg,
            origen: "avalcommunity.cr",
            tag: "Efectivo Directo",
          },
        ],
      },
    };
  }, []);

  const podioActual = podioData[podioActivo];
  const opcionActual = podioActual.opciones[opcionElegida] || podioActual.opciones[0];
  const pct = Math.min(100, Math.max(0, Math.round(progreso.porcentajeReal || 0)));

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* ─── 1. NAVBAR DE ALTO NIVEL (AVAL) ─── */}
      <header className="border-b border-white/10 bg-[#070708]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors">
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

      {/* ─── 2. CONTENIDO PRINCIPAL ESTILO "TU PRÓXIMA GRAN OPORTUNIDAD" ─── */}
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Encabezado Principal */}
        <div className="text-left space-y-2">
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

        {/* ─── SELECTOR DE PODIO (1°, 2°, 3° LUGAR) ─── */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setPodioActivo(1);
              setOpcionElegida(0);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
              podioActivo === 1
                ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]"
                : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <span>🥇 1.er Lugar</span>
            <span className="text-[10px] font-semibold opacity-90">2 Motos Ducati</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPodioActivo(2);
              setOpcionElegida(0);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
              podioActivo === 2
                ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]"
                : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <span>🥈 2.º Lugar</span>
            <span className="text-[10px] font-semibold opacity-90">Subaru vs GLE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPodioActivo(3);
              setOpcionElegida(0);
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
              podioActivo === 3
                ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]"
                : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <span>🥉 3.er Lugar</span>
            <span className="text-[10px] font-semibold opacity-90">₡4M Efectivo</span>
          </button>
        </div>

        {/* ─── SECCIÓN "VOS ESCOGES": LAS 2 OPCIONES CARA A CARA ─── */}
        {podioActual.opciones.length > 1 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Crown className="size-3.5" /> En este lugar tenés 2 opciones para elegir:
              </span>
              <span className="text-zinc-500 text-[10px]">Toca para cambiar la vista</span>
            </div>

            {/* Dos tarjetas táctiles para conmutar las opciones */}
            <div className="grid grid-cols-2 gap-2.5">
              {podioActual.opciones.map((opc, idx) => {
                const isSelected = opcionElegida === idx;
                return (
                  <button
                    key={opc.id}
                    type="button"
                    onClick={() => setOpcionElegida(idx)}
                    className={`rounded-2xl p-3 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? "bg-zinc-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10 scale-[1.01]"
                        : "bg-zinc-950 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Opción {idx === 0 ? "A" : "B"}
                      </span>
                      {isSelected && <CheckCircle2 className="size-4 text-amber-400" />}
                    </div>

                    <div className="mt-2">
                      <div className="font-black text-xs sm:text-sm text-white leading-tight">
                        {opc.nombre}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                        {opc.subtitulo}
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono font-bold text-amber-400/90">
                      Valor: {opc.valor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* ─── VISOR FOTOGRÁFICO DE ALTO IMPACTO (COMO EN TU CAPTURA) ─── */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black group shadow-2xl">
          <div className="aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-[#070708] overflow-hidden">
            <img
              src={opcionActual.imagen}
              alt={opcionActual.nombre}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Sello de origen sobre la foto (como ducati.com en tu captura) */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/80 backdrop-blur-md border border-white/20">
              {opcionActual.origen}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 bg-amber-500/20 backdrop-blur-md border border-amber-500/40">
              {opcionActual.tag}
            </span>
          </div>
        </div>

        {/* Título y Descripción del Premio Activo */}
        <div className="text-left space-y-1 pt-1">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {opcionActual.nombre}
          </h2>
          <p className="text-xs text-amber-400 font-semibold">
            {podioActual.tituloNivel} · Entrega con traspaso notarial y marchamo incluidos
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
            {opcionActual.descripcion}
          </p>
        </div>

        {/* ─── PROGRESO DE LA DINÁMICA (MINIMALISTA) ─── */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-left space-y-2">
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

        {/* ─── ELIGE TU PAQUETE DE TOKENS (COMPRA DIRECTA) ─── */}
        <div className="text-left space-y-3 pt-2">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Elige tu paquete de tokens
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Selecciona cuántos tokens deseas adquirir para respaldar la comunidad y participar.
            </p>
          </div>

          {/* Cards de Paquetes (Grandes y Táctiles como en tu foto) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {paquetes.slice(0, 4).map((p, idx) => {
              const isSelected = paqueteSeleccionado.cantidad === p.cantidad;
              return (
                <button
                  key={p.cantidad}
                  type="button"
                  onClick={() => setPaqueteSeleccionado(p)}
                  className={`rounded-2xl p-4 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10"
                      : "bg-zinc-950 border-white/10 hover:border-white/20 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="text-2xl font-black text-white leading-none">
                    {p.cantidad}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">Tokens</div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-3">
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
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-base shadow-2xl shadow-amber-500/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] gap-2 tracking-wider uppercase mt-2"
          >
            PARTICIPAR AHORA · {formatCRC(paqueteSeleccionado.precio)}
            <ArrowRight className="size-5" />
          </Button>

          <p className="text-center text-[11px] text-zinc-500">
            Acepta SINPE Móvil oficial y Tarjeta. Consulta las condiciones y reglamento de participación.
          </p>
        </div>

        {/* ─── FORMA PARTE DE AVAL (FOOTER DE COMUNIDAD) ─── */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-left space-y-2 mt-6">
          <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">
            FORMA PARTE DE AVAL
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Participa y descubre los beneficios exclusivos de nuestra comunidad.
          </p>
          <div className="text-[11px] text-zinc-500 pt-1">
            Beneficios · Tokens · Traspaso Notarial · Comercios Aliados · Experiencias
          </div>
        </div>

        {/* Enlace para ver la edición extendida con scroll */}
        {onCambiarAClasico && (
          <div className="text-center pt-2 pb-6">
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

      {/* ─── FOOTER MINIMALISTA ─── */}
      <footer className="border-t border-white/10 bg-black py-4 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} AVAL Community CR · Grupo G Tres Internacional</span>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
