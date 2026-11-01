import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CheckCircle2,
  Crown,
  FileCheck,
  Flame,
  Fuel,
  Gift,
  Key,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Ticket,
  Timer,
  Zap,
  ArrowRight,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Premio } from "@/lib/premios-types";
import type { Paquete } from "@/components/StickersModal";
import type { Sorteo, Config } from "@/lib/admin-store";
import { IconInstagram, IconFacebook, IconTiktok } from "@/components/Footer";

const formatCRC = (val: number) => "₡" + Number(val || 0).toLocaleString("es-CR");

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
  // Agrupar premios por nivel de podio
  const p1List = useMemo(
    () =>
      premios.filter(
        (p) =>
          p.activo !== false &&
          (p.nivel === "1° Lugar" ||
            p.nivel === "Premio Mayor" ||
            (p.nivel as string) === "1° Lugar (A Elección)")
      ),
    [premios]
  );

  const p2List = useMemo(
    () =>
      premios.filter(
        (p) =>
          p.activo !== false &&
          (p.nivel === "2° Lugar" ||
            p.nivel === "Segundo Premio" ||
            (p.nivel as string) === "2° Lugar (A Elección)")
      ),
    [premios]
  );

  const p3List = useMemo(
    () =>
      premios.filter(
        (p) =>
          p.activo !== false &&
          (p.nivel === "3° Lugar" ||
            p.nivel === "Tercer Premio" ||
            (p.nivel as string) === "3° Lugar (Efectivo)")
      ),
    [premios]
  );

  // Podio activo (1, 2 o 3)
  const [podioActivo, setPodioActivo] = useState<1 | 2 | 3>(1);

  // Sub-opción dentro del podio seleccionado (ej: Ducati Multistrada vs Panigale)
  const [subOpcionIdx, setSubOpcionIdx] = useState<number>(0);

  // Paquete de tokens seleccionado actualmente por el usuario (por defecto el más popular)
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<Paquete>(() => {
    return paquetes[1] || paquetes[0] || { cantidad: 6, precio: 8000 };
  });

  // Lista de premios según el podio activo
  const listaActual = podioActivo === 1 ? p1List : podioActivo === 2 ? p2List : p3List;
  const premioActivo: Premio | undefined = listaActual[subOpcionIdx] || listaActual[0];

  const handleCambiarPodio = (nivel: 1 | 2 | 3) => {
    setPodioActivo(nivel);
    setSubOpcionIdx(0);
  };

  const pct = Math.min(100, Math.max(0, Math.round(progreso.porcentajeReal || 0)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-foreground flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* ─── 1. NAVBAR MINIMALISTA DE COMUNIDAD ─── */}
      <header className="w-full border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo y Badge de Comunidad */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <img
                src="/icons/icon-192.png"
                alt="Aval Community CR"
                className="size-full object-contain rounded-[10px] bg-black p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                AVAL COMMUNITY <span className="text-amber-400">CR</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">
                Comunidad Oficial · Fondo Mutuo
              </div>
            </div>
          </Link>

          {/* Acciones directas del header */}
          <div className="flex items-center gap-2">
            <Link
              to="/validar"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            >
              <Ticket className="size-3.5 text-amber-400" />
              Validar Tokens
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <ShieldCheck className="size-3.5" />
              Consola
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. CONTENIDO PRINCIPAL EN UN SOLO VIEWPORT (0 SCROLL INNECESARIO) ─── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col justify-center">
        {/* Tarjeta Central Maestra estilo Street Cars con Identidad de Comunidad */}
        <div className="rounded-3xl border-2 border-amber-500/30 bg-zinc-950/90 shadow-2xl shadow-amber-500/10 overflow-hidden backdrop-blur-xl flex flex-col">
          
          {/* Header de la Tarjeta: Mensaje de Comunidad */}
          <div className="p-3.5 sm:p-5 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="size-3" /> Beneficios Exclusivos de Comunidad
              </span>
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-amber-400" />
                Sorteo Oficial JPS: <span className="text-white font-bold">{sorteo.fecha || "18 Dic 2026"}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2 leading-tight">
              Con tu Aval, vos tenés el mando del beneficio
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              No es una simple compra de boletos: tu aporte como miembro respalda el fondo mutuo de la comunidad
              y te otorga participación auditada ante Notario Público con entrega a tu nombre.
            </p>

            {/* Pestañas de Podio (1° Lugar, 2° Lugar, 3° Lugar) */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleCambiarPodio(1)}
                className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border ${
                  podioActivo === 1
                    ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30 scale-[1.02]"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>🥇 1.er Lugar</span>
                <span className="text-[10px] font-medium opacity-80 hidden sm:inline">(Motos V4)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCambiarPodio(2)}
                className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border ${
                  podioActivo === 2
                    ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30 scale-[1.02]"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>🥈 2.º Lugar</span>
                <span className="text-[10px] font-medium opacity-80 hidden sm:inline">(Subaru/GLE)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCambiarPodio(3)}
                className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border ${
                  podioActivo === 3
                    ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30 scale-[1.02]"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>🥉 3.er Lugar</span>
                <span className="text-[10px] font-medium opacity-80 hidden sm:inline">(₡4M Efectivo)</span>
              </button>
            </div>
          </div>

          {/* Cuerpo Central: Imagen del Premio + Sub-opciones */}
          <div className="p-3.5 sm:p-5 space-y-4">
            {/* Si el nivel tiene más de 1 opción (ej: Ducati Panigale o Multistrada, Subaru o Mercedes) */}
            {listaActual.length > 1 && (
              <div className="flex items-center justify-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10 max-w-md mx-auto">
                {listaActual.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setSubOpcionIdx(idx)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                      subOpcionIdx === idx
                        ? "bg-white text-black shadow-sm font-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Opción {idx + 1}: {p.nombre.split(" ")[0]} {p.nombre.split(" ")[1] || ""}
                  </button>
                ))}
              </div>
            )}

            {/* Visor del Premio Seleccionado */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black group aspect-[16/9] sm:aspect-[21/9] max-h-[260px] flex items-center justify-center">
              <img
                src={premioActivo?.imagenUrl || "/placeholder.jpg"}
                alt={premioActivo?.nombre || "Premio de la Comunidad"}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badges sobre la foto */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                <Badge className="bg-amber-500 text-black font-black text-[10px] border-0">
                  {premioActivo?.nivel || `${podioActivo}° Lugar`}
                </Badge>
                {premioActivo?.valorEstimado && (
                  <Badge variant="outline" className="bg-black/70 border-white/20 text-white font-mono text-[10px]">
                    Valor: {formatCRC(premioActivo.valorEstimado)}
                  </Badge>
                )}
              </div>

              {/* Información flotante al pie de la foto */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-3">
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-black text-white drop-shadow-md leading-tight">
                    {premioActivo?.nombre}
                  </h3>
                  <p className="text-[11px] text-zinc-300 line-clamp-1 drop-shadow">
                    {premioActivo?.descripcion || "Adjudicado directamente al miembro favorecido de la comunidad."}
                  </p>
                </div>

                {premioActivo && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onVerFicha(premioActivo)}
                    className="shrink-0 bg-black/70 border-white/30 text-white text-[11px] font-bold hover:bg-white hover:text-black transition-colors gap-1 h-7 px-2.5 cursor-pointer"
                  >
                    <Info className="size-3 text-amber-400" /> Ver Ficha
                  </Button>
                )}
              </div>
            </div>

            {/* Barra de Progreso Minimalista (como la de Street Cars) */}
            <div className="bg-zinc-900/90 rounded-2xl p-3 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Flame className="size-3.5 text-amber-400" />
                  Meta de la Comunidad
                </span>
                <span className="font-mono font-black text-amber-400">{pct}% cubierto</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  style={{ width: `${Math.max(5, pct)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>{progreso.tokensVendidos.toLocaleString("es-CR")} tokens activos</span>
                <span>Objetivo: {progreso.totalMetaTokens.toLocaleString("es-CR")}</span>
              </div>
            </div>

            {/* ─── 3. SELECTOR DE TOKENS A MANO (COMPRA INMEDIATA) ─── */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Ticket className="size-3.5" /> Elige tu Paquete de Tokens
                </span>
                <span className="text-[10px] text-zinc-400">Tokens al azar o elegidos por vos</span>
              </div>

              {/* Grid de Paquetes en 1 clic */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paquetes.slice(0, 4).map((p, idx) => {
                  const isSelected = paqueteSeleccionado.cantidad === p.cantidad;
                  const esPopular = idx === 1; // 6 tokens suele ser el más vendido

                  return (
                    <button
                      key={p.cantidad}
                      type="button"
                      onClick={() => setPaqueteSeleccionado(p)}
                      className={`relative rounded-2xl p-3 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 scale-[1.02]"
                          : "bg-zinc-900/60 border-white/10 hover:border-white/20 hover:bg-zinc-900"
                      }`}
                    >
                      {esPopular && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 text-black shadow-xs">
                          Más Elegido
                        </span>
                      )}

                      <div>
                        <div className="text-lg font-black text-white leading-none">
                          {p.cantidad} <span className="text-xs font-normal text-zinc-400">Tokens</span>
                        </div>
                        <div className="text-sm font-black text-amber-400 font-mono mt-1">
                          {formatCRC(p.precio)}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                        <span>₡{Math.round(p.precio / p.cantidad).toLocaleString("es-CR")}/cu</span>
                        {isSelected ? (
                          <CheckCircle2 className="size-3.5 text-amber-400" />
                        ) : (
                          <span className="size-3.5 rounded-full border border-white/20" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botón Principal de Acción Directa */}
              <Button
                type="button"
                size="lg"
                onClick={() => onSeleccionarPaquete(paqueteSeleccionado)}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] gap-2"
              >
                <Zap className="size-5 fill-black" />
                ADQUIRIR {paqueteSeleccionado.cantidad} TOKENS · {formatCRC(paqueteSeleccionado.precio)}
                <ArrowRight className="size-4" />
              </Button>
              <div className="text-center text-[10px] text-zinc-400">
                Acepta SINPE Móvil oficial, Tarjeta Débito/Crédito y Factura Electrónica Hacienda (v4.4 v2).
              </div>
            </div>
          </div>

          {/* Micro-Sellos de Confianza al pie de la Tarjeta */}
          <div className="p-3 bg-zinc-950 border-t border-white/10 flex flex-wrap items-center justify-around gap-2 text-[10px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-amber-400" /> 100% Auditado JPS
            </span>
            <span className="flex items-center gap-1">
              <FileCheck className="size-3.5 text-emerald-400" /> Traspaso Notarial Incluido
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-blue-400" /> Sin Fila ni Boletos Físicos
            </span>
          </div>
        </div>

        {/* Enlace para alternar a la versión completa con scroll */}
        {onCambiarAClasico && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onCambiarAClasico}
              className="text-xs text-zinc-400 hover:text-amber-400 underline decoration-dotted transition-colors cursor-pointer"
            >
              ¿Preferís ver la edición detallada con galería completa, FAQ y testimonios? Clic aquí
            </button>
          </div>
        )}
      </main>

      {/* ─── 4. FOOTER MINIMALISTA CON REDES SOCIALES ─── */}
      <footer className="w-full border-t border-white/10 bg-black/80 py-4 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-4">
            {config.promoWhatsapp && (
              <a
                href={`https://wa.me/${config.promoWhatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                WhatsApp Oficial
              </a>
            )}
            <Link to="/terminos" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
          </div>

          <div className="text-[11px] text-zinc-400">
            © {new Date().getFullYear()} Aval Community CR · Operado por Grupo G Tres Internacional
          </div>
        </div>
      </footer>
    </div>
  );
}
