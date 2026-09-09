import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Gavel,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Car,
  FileCheck,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Info,
  Flame,
  UserCheck,
  HelpCircle,
  ExternalLink,
  Pencil,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  fetchRematesLocal,
  saveRematesLocal,
  agregarPujaLocal,
  type Remate,
  type Puja,
} from "@/lib/remates-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/remates")({
  head: () => ({
    meta: [
      { title: "Sala de Remates VIP | Aval Community CR" },
      {
        name: "description",
        content:
          "Subasta y remate exclusivo de vehículos premium adjudicados en sorteos de Aval Community CR. Compraventa transparente con custodia notarial.",
      },
    ],
  }),
  component: RematesPage,
});

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, finished: false });

  useEffect(() => {
    const end = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      if (diff === 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, finished: true });
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
        finished: false,
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function anonimizarNombre(nombre: string) {
  const partes = nombre.trim().split(" ");
  const p0 = partes[0] ?? "";
  const p1 = partes[1] ?? "";
  if (partes.length <= 1) return p0.slice(0, 1) + "***";
  return `${p0.slice(0, 1)}*** ${p1.slice(0, 1)}***`;
}

function RematesPage() {
  const [remates, setRemates] = useState<Remate[]>(() => fetchRematesLocal());
  const [remateSeleccionadoId, setRemateSeleccionadoId] = useState<string>("");
  const [fotoActiva, setFotoActiva] = useState(0);
  const [modalPuja, setModalPuja] = useState(false);
  const [tabActiva, setTabActiva] = useState<"specs" | "notarial" | "faq">("specs");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalNuevo, setModalNuevo] = useState(false);

  // Formulario Editar
  const [editTitulo, setEditTitulo] = useState("");
  const [editSubtitulo, setEditSubtitulo] = useState("");
  const [editPrecioSalida, setEditPrecioSalida] = useState(35000000);
  const [editPrecioReserva, setEditPrecioReserva] = useState(42000000);
  const [editIncremento, setEditIncremento] = useState(250000);
  const [editFechaFin, setEditFechaFin] = useState("");
  const [editGanadorNombre, setEditGanadorNombre] = useState("");
  const [editGanadorToken, setEditGanadorToken] = useState("");
  const [editGanadorDeclaracion, setEditGanadorDeclaracion] = useState("");
  const [editImagenPrincipal, setEditImagenPrincipal] = useState("");
  const [editMotor, setEditMotor] = useState("");

  const abrirModalEdicion = () => {
    if (!remate) return;
    setEditTitulo(remate.titulo);
    setEditSubtitulo(remate.subtitulo);
    setEditPrecioSalida(remate.precioSalida);
    setEditPrecioReserva(remate.precioReserva);
    setEditIncremento(remate.incrementoMinimo);
    setEditFechaFin(new Date(remate.fechaFin).toISOString().slice(0, 16));
    setEditGanadorNombre(remate.ganadorSorteo.nombre);
    setEditGanadorToken(remate.ganadorSorteo.tokenGanador);
    setEditGanadorDeclaracion(remate.ganadorSorteo.declaracion);
    setEditImagenPrincipal(remate.imagenes[0] ?? "");
    setEditMotor(remate.vehiculoInfo.motor);
    setModalEditar(true);
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remate) return;
    const actualizados = remates.map((r) => {
      if (r.id !== remate.id) return r;
      return {
        ...r,
        titulo: editTitulo,
        subtitulo: editSubtitulo,
        precioSalida: Number(editPrecioSalida),
        precioReserva: Number(editPrecioReserva),
        incrementoMinimo: Number(editIncremento),
        fechaFin: new Date(editFechaFin).toISOString(),
        imagenes: [editImagenPrincipal, ...r.imagenes.slice(1)],
        ganadorSorteo: {
          ...r.ganadorSorteo,
          nombre: editGanadorNombre,
          tokenGanador: editGanadorToken,
          declaracion: editGanadorDeclaracion,
        },
        vehiculoInfo: {
          ...r.vehiculoInfo,
          motor: editMotor,
        },
      };
    });
    saveRematesLocal(actualizados);
    setRemates(actualizados);
    setModalEditar(false);
    toast.success("¡Datos del remate actualizados al instante!");
  };

  // Formulario Nuevo
  const [nuevoTitulo, setNuevoTitulo] = useState("Toyota Hilux GR-Sport 2026 0KM");
  const [nuevoSubtitulo, setNuevoSubtitulo] = useState("Adjudicado en Sorteo Oficial · Puesto a Remate VIP");
  const [nuevoPrecioSalida, setNuevoPrecioSalida] = useState(28000000);
  const [nuevoPrecioReserva, setNuevoPrecioReserva] = useState(33000000);
  const [nuevoIncremento, setNuevoIncremento] = useState(250000);
  const [nuevaFechaFin, setNuevaFechaFin] = useState(
    new Date(Date.now() + 3600 * 1000 * 72).toISOString().slice(0, 16)
  );
  const [nuevoGanador, setNuevoGanador] = useState("Carlos Solano M.");
  const [nuevoToken, setNuevoToken] = useState("#91204");
  const [nuevaImagen, setNuevaImagen] = useState("/premio-prado.jpg");

  const handleCrearNuevoRemate = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Remate = {
      id: `remate-${Date.now()}`,
      titulo: nuevoTitulo,
      subtitulo: nuevoSubtitulo,
      descripcion: "Vehículo 100% nuevo adjudicado en sorteo.",
      imagenes: [nuevaImagen],
      precioSalida: Number(nuevoPrecioSalida),
      precioReserva: Number(nuevoPrecioReserva),
      incrementoMinimo: Number(nuevoIncremento),
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date(nuevaFechaFin).toISOString(),
      estado: "activo",
      ganadorSorteo: {
        nombre: nuevoGanador,
        tokenGanador: nuevoToken,
        ciudad: "San José, Costa Rica",
        declaracion:
          "Opté por rematar el vehículo en Aval Community para recibir el dinero en efectivo garantizado.",
      },
      vehiculoInfo: {
        marca: "Toyota",
        modelo: "Hilux GR-Sport",
        ano: 2026,
        kilometraje: "20 km (Agencia)",
        motor: "2.8L Turbo Diesel 224 HP",
        potencia: "224 HP",
        transmision: "Automática 6 Vel.",
        traccion: "4x4",
        combustible: "Diésel",
        color: "Rojo / Negro",
        traspasoIncluido: true,
        marchamoAlDia: true,
        garantiaAgencia: "3 Años",
        inspeccionDekra: true,
      },
      comisionPlataformaPct: 5,
      depositoRequerido: 50000,
      pujas: [],
    };
    const actualizados = [nuevo, ...remates];
    saveRematesLocal(actualizados);
    setRemates(actualizados);
    setRemateSeleccionadoId(nuevo.id);
    setModalNuevo(false);
    toast.success("¡Nuevo remate publicado y en vivo!");
  };

  // Formulario de Puja
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [montoOferta, setMontoOferta] = useState<number>(0);
  const [aceptoTerminos, setAceptoTerminos] = useState(true);

  const remate = remates.find((r) => r.id === remateSeleccionadoId) ?? remates[0];
  const countdown = useCountdown(remate?.fechaFin ?? new Date().toISOString());

  useEffect(() => {
    const primer = remates[0];
    if (primer && !remateSeleccionadoId) {
      setRemateSeleccionadoId(primer.id);
    }
  }, [remates, remateSeleccionadoId]);

  if (!remate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p>Cargando sala de remates...</p>
      </div>
    );
  }

  const pujasAprobadas = remate.pujas.filter((p) => p.estado === "aprobada");
  const mayorPuja = pujasAprobadas.reduce(
    (max, p) => (p.monto > max ? p.monto : max),
    remate.precioSalida
  );
  const siguientePujaMinima =
    pujasAprobadas.length === 0 ? remate.precioSalida : mayorPuja + remate.incrementoMinimo;

  const handleAbrirModalPuja = (montoSugerido?: number) => {
    setMontoOferta(montoSugerido || siguientePujaMinima);
    setModalPuja(true);
  };

  const handleEnviarPuja = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      toast.error("Por favor completa tu nombre y número de teléfono.");
      return;
    }

    if (montoOferta < siguientePujaMinima) {
      toast.error(`La oferta mínima requerida es ₡${siguientePujaMinima.toLocaleString("es-CR")}`);
      return;
    }

    const res = agregarPujaLocal(remate.id, {
      postorNombre: nombre.trim(),
      postorTelefono: telefono.trim(),
      postorCedula: cedula.trim() ? cedula.trim() : undefined,
      monto: Number(montoOferta),
      comentario: "Puja directa en sala pública",
    });

    if (res.exito) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#eab308", "#ffffff"],
      });
      toast.success(res.mensaje);
      setRemates(fetchRematesLocal());
      setModalPuja(false);
    } else {
      toast.error(res.mensaje);
    }
  };

  const abrirWhatsappConcierge = () => {
    const msg = `Hola Aval Community CR, estoy en la Sala de Remates VIP y me interesa obtener información o validar mi oferta para el vehículo: ${remate.titulo} (Oferta líder actual: ₡${mayorPuja.toLocaleString("es-CR")}).`;
    window.open(`https://wa.me/50686344772?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const ConsolaPujas = (
    <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-neutral-900 to-black p-4 sm:p-5 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400">
        <span className="flex items-center gap-1.5">
          <Clock className="size-4 animate-spin text-amber-400" />
          Tiempo Restante
        </span>
        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] sm:text-[10px] text-amber-300">
          ANTI-SNIPER ACTIVO
        </span>
      </div>

      {/* Contador */}
      <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
        <div className="rounded-xl border border-neutral-800 bg-black/60 p-2 sm:p-2.5">
          <span className="font-display text-xl sm:text-3xl font-bold text-white">
            {String(countdown.d).padStart(2, "0")}
          </span>
          <span className="block text-[9px] sm:text-[10px] font-semibold text-neutral-400 uppercase">Días</span>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/60 p-2 sm:p-2.5">
          <span className="font-display text-xl sm:text-3xl font-bold text-white">
            {String(countdown.h).padStart(2, "0")}
          </span>
          <span className="block text-[9px] sm:text-[10px] font-semibold text-neutral-400 uppercase">Horas</span>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/60 p-2 sm:p-2.5">
          <span className="font-display text-xl sm:text-3xl font-bold text-white">
            {String(countdown.m).padStart(2, "0")}
          </span>
          <span className="block text-[9px] sm:text-[10px] font-semibold text-neutral-400 uppercase">Min</span>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/60 p-2 sm:p-2.5 border-amber-500/40">
          <span className="font-display text-xl sm:text-3xl font-bold text-amber-400">
            {String(countdown.s).padStart(2, "0")}
          </span>
          <span className="block text-[9px] sm:text-[10px] font-semibold text-amber-400 uppercase">Seg</span>
        </div>
      </div>

      {/* Tarjeta de Oferta Líder Actual */}
      <div className="mt-3.5 sm:mt-5 rounded-xl border border-neutral-800 bg-neutral-950/80 p-3.5 sm:p-4">
        <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Oferta Más Alta Actual
        </span>
        <div className="mt-1 flex items-baseline justify-between flex-wrap gap-1">
          <span className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-400">
            ₡{mayorPuja.toLocaleString("es-CR")}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-emerald-400">
            {pujasAprobadas.length > 0 ? "Líder en sala" : "Precio base de salida"}
          </span>
        </div>

        <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-neutral-800 pt-2.5 text-[10px] sm:text-xs text-neutral-400">
          <span>Salida: ₡{remate.precioSalida.toLocaleString("es-CR")}</span>
          <span>Mín: +₡{remate.incrementoMinimo.toLocaleString("es-CR")}</span>
        </div>
      </div>

      {/* Botones de Puja Rápida */}
      <div className="mt-3 sm:mt-4 space-y-2">
        <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Incremento Rápido:
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAbrirModalPuja(mayorPuja + 250000)}
            className="border-neutral-700 bg-neutral-900 text-[11px] sm:text-xs font-bold text-white hover:border-amber-500 hover:text-amber-400 h-8 sm:h-9 px-1"
          >
            +₡250k
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAbrirModalPuja(mayorPuja + 500000)}
            className="border-neutral-700 bg-neutral-900 text-[11px] sm:text-xs font-bold text-white hover:border-amber-500 hover:text-amber-400 h-8 sm:h-9 px-1"
          >
            +₡500k
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAbrirModalPuja(mayorPuja + 1000000)}
            className="border-neutral-700 bg-neutral-900 text-[11px] sm:text-xs font-bold text-white hover:border-amber-500 hover:text-amber-400 h-8 sm:h-9 px-1"
          >
            +₡1.0M
          </Button>
        </div>

        <Button
          size="lg"
          onClick={() => handleAbrirModalPuja(siguientePujaMinima)}
          className="w-full mt-2.5 sm:mt-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-sm sm:text-base tracking-wide uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 cursor-pointer h-11 sm:h-12"
        >
          <Gavel className="mr-1.5 sm:mr-2 size-4 sm:size-5" />
          Hacer Oferta Ahora (₡{siguientePujaMinima.toLocaleString("es-CR")})
        </Button>
      </div>

      <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 text-center">
        <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
        <span>Oferta protegida y sujeta a verificación notarial</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 selection:bg-amber-500 selection:text-black">
      {/* Barra Top VIP */}
      <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-black to-amber-950/40 py-1 px-3 text-center text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-amber-400 truncate">
        ✨ SALA DE REMATES & SUBASTAS VIP · AVAL MOTORS COSTA RICA
      </div>

      {/* Header Sticky Mobile-First */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-[#080808]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3 gap-2">
          {/* Logo & Marca */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/isotipo.png" alt="Aval Community CR" className="size-6 sm:size-7 object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-sm sm:text-lg font-bold tracking-wider leading-none text-white whitespace-nowrap">
                AVAL <span className="text-amber-500">REMATES</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest text-neutral-400 uppercase leading-tight">
                Subastas VIP
              </span>
            </div>
          </Link>

          {/* Botones de acción derecha */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs border-neutral-700 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <Link to="/">
                <span className="inline sm:hidden">← Sorteo</span>
                <span className="hidden sm:inline">← Volver al Sorteo</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 sm:h-8 px-2 sm:px-2.5 text-[10px] sm:text-xs border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              title="Panel Administrativo"
            >
              <Link to="/admin">
                <span>⚙️</span>
                <span className="hidden md:inline ml-1">Admin</span>
              </Link>
            </Button>

            <Button
              size="sm"
              onClick={abrirWhatsappConcierge}
              className="h-7 sm:h-8 px-2 sm:px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-bold gap-1 shadow-sm shrink-0"
            >
              <MessageCircle className="size-3.5" />
              <span>VIP</span>
              <span className="hidden md:inline">WhatsApp</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero / Banner Principal */}
      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:py-8 pb-28 lg:pb-12">
        {/* Breadcrumb y Status */}
        <div className="mb-2.5 sm:mb-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] sm:text-xs truncate">
            <Link to="/" className="hover:text-amber-400 shrink-0">Inicio</Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-amber-400 font-semibold truncate">Remate Oficial</span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-bold uppercase text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <span className="size-1.5 sm:size-2 rounded-full bg-amber-400 animate-ping" />
            <span className="size-1.5 sm:size-2 rounded-full bg-amber-400 -ml-2.5 sm:-ml-3.5" />
            En Vivo
          </span>
        </div>

        {/* Barra de Gestión Directa (Admin Toolbar) - Slim y Compacto para Mobile */}
        <div className="mb-3 sm:mb-4 rounded-xl border border-amber-500/30 bg-neutral-900/80 px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-amber-500/20 text-amber-400 font-bold text-xs">⚙️</span>
            <span className="text-[11px] sm:text-xs font-semibold text-amber-300 truncate">Control de Remate</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              onClick={abrirModalEdicion}
              className="h-6 sm:h-7 px-2.5 text-[10px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-sm cursor-pointer"
            >
              <Pencil className="size-2.5 sm:size-3 mr-1" /> Editar
            </Button>
            <Button
              size="sm"
              onClick={() => setModalNuevo(true)}
              className="h-6 sm:h-7 px-2 text-[10px] sm:text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium border border-neutral-700 cursor-pointer"
            >
              <Plus className="size-2.5 sm:size-3 mr-1" /> Nuevo
            </Button>
          </div>
        </div>

        {/* Encabezado del Vehículo */}
        <div className="mb-3 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Lote #01 · 2026 0KM
            </span>
            <span className="text-[10px] text-neutral-400 hidden xs:inline">
              Purdy Motor Costa Rica
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {remate.titulo}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-snug">
            {remate.subtitulo}
          </p>
        </div>

        {/* Grilla Principal: Izquierda Galería + Ficha / Derecha Consola de Pujas */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* COLUMNA IZQUIERDA (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Galería Fotográfica */}
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 shadow-2xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={remate.imagenes[fotoActiva] || remate.imagenes[0]}
                  alt={remate.titulo}
                  className="size-full object-cover transition-all duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="rounded bg-black/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold tracking-wide uppercase text-amber-400 backdrop-blur-md border border-amber-500/30">
                    0 KM · Entrega Inmediata
                  </span>
                  <span className="rounded bg-emerald-950/85 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold tracking-wide uppercase text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                    Traspaso Notarial 100% Pagado
                  </span>
                </div>
              </div>

              {/* Selector de Miniaturas */}
              {remate.imagenes.length > 1 && (
                <div className="flex gap-2 p-2 sm:p-3 overflow-x-auto bg-neutral-950/60 border-t border-neutral-800">
                  {remate.imagenes.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFotoActiva(idx)}
                      className={`relative size-14 sm:size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                        fotoActiva === idx
                          ? "border-amber-500 ring-2 ring-amber-500/40 scale-105"
                          : "border-neutral-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Vista ${idx + 1}`} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* EN MOBILE: La Consola de Pujas aparece inmediatamente bajo la galería fotográfica */}
            <div className="block lg:hidden">
              {ConsolaPujas}
            </div>

            {/* Badges de Confianza y Transparencia */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
                <ShieldCheck className="size-6 text-amber-500 shrink-0" />
                <div className="text-xs">
                  <strong className="block text-white font-semibold">Garantía Purdy Motor</strong>
                  <span className="text-neutral-400">3 años o 100,000 km</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
                <FileCheck className="size-6 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <strong className="block text-white font-semibold">Traspaso Notarial</strong>
                  <span className="text-neutral-400">Escrow notarial incluido</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
                <Award className="size-6 text-blue-500 shrink-0" />
                <div className="text-xs">
                  <strong className="block text-white font-semibold">Inspección DEKRA</strong>
                  <span className="text-neutral-400">Marchamo 2026 al día</span>
                </div>
              </div>
            </div>

            {/* Historia del Ganador del Sorteo Original */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-neutral-900/40 to-neutral-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <UserCheck className="size-4" />
                Procedencia Transparente del Vehículo
              </div>
              <p className="mt-2 text-sm italic text-neutral-300">
                &ldquo;{remate.ganadorSorteo.declaracion}&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-amber-500/20 pt-3 text-xs">
                <div>
                  <span className="text-neutral-400">Ganador del Sorteo: </span>
                  <strong className="text-white">{remate.ganadorSorteo.nombre}</strong>
                  <span className="text-neutral-500"> ({remate.ganadorSorteo.ciudad})</span>
                </div>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-400">
                  Sticker Ganador: {remate.ganadorSorteo.tokenGanador}
                </span>
              </div>
            </div>

            {/* Pestañas de Ficha Técnica, Notarial y FAQ */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex border-b border-neutral-800 pb-3 gap-2 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setTabActiva("specs")}
                  className={`rounded-lg px-3.5 py-2 font-semibold transition-colors cursor-pointer ${
                    tabActiva === "specs"
                      ? "bg-amber-500 text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Ficha Técnica Completa
                </button>
                <button
                  type="button"
                  onClick={() => setTabActiva("notarial")}
                  className={`rounded-lg px-3.5 py-2 font-semibold transition-colors cursor-pointer ${
                    tabActiva === "notarial"
                      ? "bg-amber-500 text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Protocolo Notarial & Escrow
                </button>
                <button
                  type="button"
                  onClick={() => setTabActiva("faq")}
                  className={`rounded-lg px-3.5 py-2 font-semibold transition-colors cursor-pointer ${
                    tabActiva === "faq"
                      ? "bg-amber-500 text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Preguntas Frecuentes
                </button>
              </div>

              <div className="pt-4 text-sm">
                {tabActiva === "specs" && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800/60">
                      <span className="text-neutral-500">Marca y Modelo</span>
                      <p className="font-semibold text-white mt-1">
                        {remate.vehiculoInfo.marca} {remate.vehiculoInfo.modelo}
                      </p>
                    </div>
                    <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800/60">
                      <span className="text-neutral-500">Año / Estado</span>
                      <p className="font-semibold text-white mt-1">{remate.vehiculoInfo.ano} · 0KM</p>
                    </div>
                    <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800/60">
                      <span className="text-neutral-500">Motorización</span>
                      <p className="font-semibold text-white mt-1">{remate.vehiculoInfo.motor}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800/60">
                      <span className="text-neutral-500">Transmisión</span>
                      <p className="font-semibold text-white mt-1">{remate.vehiculoInfo.transmision}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800/60">
                      <span className="text-neutral-500">Tracción</span>
                      <p className="font-semibold text-white mt-1">{remate.vehiculoInfo.traccion}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800/60">
                      <span className="text-neutral-500">Color Exterior</span>
                      <p className="font-semibold text-white mt-1">{remate.vehiculoInfo.color}</p>
                    </div>
                  </div>
                )}

                {tabActiva === "notarial" && (
                  <div className="space-y-3 text-xs text-neutral-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p>
                        <strong>Custodia Notarial Oficial:</strong> Los fondos ofertados por el postor ganador se depositan en una cuenta escrow notarial protegida hasta que la escritura de traspaso sea inscrita debidamente en el Registro Nacional de Costa Rica.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p>
                        <strong>Cero Gastos de Notaría ni Marchamo:</strong> Aval Community CR asume el 100% de los honorarios notariales de traspaso y el marchamo de circulación.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p>
                        <strong>Entrega con Tanque Lleno:</strong> El vehículo se entrega físicamente al adjudicatario en las instalaciones de Aval Motors en San José, con tanque de combustible lleno y llaves en mano.
                      </p>
                    </div>
                  </div>
                )}

                {tabActiva === "faq" && (
                  <div className="space-y-3 text-xs text-neutral-300">
                    <div>
                      <strong className="text-amber-400 block mb-0.5">¿Qué pasa si gano la subasta?</strong>
                      <p className="text-neutral-400">
                        El equipo de Aval Motors y el notario a cargo te contactarán de inmediato por WhatsApp y llamada telefónica para coordinar la firma de traspaso y el pago final pactado.
                      </p>
                    </div>
                    <div>
                      <strong className="text-amber-400 block mb-0.5">¿Cómo se garantiza la seriedad de las ofertas?</strong>
                      <p className="text-neutral-400">
                        Las pujas son supervisadas en vivo por nuestro equipo administrativo. Solicitamos verificación de identidad y comprobante de solvencia antes de adjudicar el bien.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: CONSOLA DE PUJAS EN VIVO (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* EN DESKTOP: Consola de Pujas se muestra en la columna lateral */}
            <div className="hidden lg:block">
              {ConsolaPujas}
            </div>

            {/* Muro de Últimas Ofertas en Tiempo Real */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-amber-500" />
                  <h3 className="font-bold text-white text-sm">Historial de Pujas en Vivo</h3>
                </div>
                <span className="text-[11px] text-neutral-400">
                  {pujasAprobadas.length} ofertas
                </span>
              </div>

              <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {pujasAprobadas.length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-4">
                    Sé el primer postor en abrir la subasta.
                  </p>
                ) : (
                  pujasAprobadas.map((p, idx) => {
                    const isTop = idx === 0;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between rounded-lg p-2.5 text-xs transition-all ${
                          isTop
                            ? "border border-amber-500/40 bg-amber-500/10 font-medium"
                            : "border border-neutral-800/60 bg-black/40 text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              isTop ? "bg-amber-400 animate-pulse" : "bg-neutral-600"
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-white">
                              {anonimizarNombre(p.postorNombre)}
                            </span>
                            <span className="block text-[10px] text-neutral-500">
                              {new Date(p.fecha).toLocaleTimeString("es-CR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-display text-sm font-bold ${
                              isTop ? "text-amber-400" : "text-neutral-200"
                            }`}
                          >
                            ₡{p.monto.toLocaleString("es-CR")}
                          </span>
                          {isTop && (
                            <span className="block text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                              Oferta Líder
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Barra Flotante Sticky Inferior para PWA en Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-500/30 bg-[#0a0a0a]/95 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl lg:hidden flex items-center justify-between gap-2 shadow-[0_-8px_25px_rgba(0,0,0,0.85)]">
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block leading-tight">
            Oferta Líder
          </span>
          <span className="font-display text-base sm:text-lg font-black text-amber-400 leading-tight block truncate">
            ₡{mayorPuja.toLocaleString("es-CR")}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => handleAbrirModalPuja(siguientePujaMinima)}
          className="h-9 sm:h-10 px-3.5 sm:px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 shrink-0"
        >
          <Gavel className="size-3.5 sm:size-4 mr-1 sm:mr-1.5" />
          Ofertar Ahora
        </Button>
      </div>

      {/* Modal para Ingresar Oferta */}
      <Dialog open={modalPuja} onOpenChange={setModalPuja}>
        <DialogContent className="max-w-md bg-neutral-950 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Gavel className="size-5 text-amber-500" />
              Ingresar Puja para el Remate VIP
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              {remate.titulo}. Tu oferta entrará en vivo inmediatamente en el registro oficial.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEnviarPuja} className="space-y-4 pt-2">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Oferta Líder Actual:</span>
                <strong className="text-white font-mono">₡{mayorPuja.toLocaleString("es-CR")}</strong>
              </div>
              <div className="flex justify-between text-amber-400 font-semibold mt-1">
                <span>Monto Mínimo Requerido:</span>
                <strong className="font-mono">₡{siguientePujaMinima.toLocaleString("es-CR")}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="montoOferta" className="text-xs text-neutral-300">
                Tu Monto a Ofertar (en Colones ₡)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-amber-400 text-base">₡</span>
                <Input
                  id="montoOferta"
                  type="number"
                  value={montoOferta}
                  onChange={(e) => setMontoOferta(Number(e.target.value))}
                  min={siguientePujaMinima}
                  step={remate.incrementoMinimo}
                  className="pl-8 bg-neutral-900 border-neutral-700 text-white font-display text-xl font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-xs text-neutral-300">
                Nombre Completo
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Andrés Gamboa Zamora"
                className="bg-neutral-900 border-neutral-700 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="telefono" className="text-xs text-neutral-300">
                  Teléfono WhatsApp
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="8888-8888"
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cedula" className="text-xs text-neutral-300">
                  Cédula (Opcional)
                </Label>
                <Input
                  id="cedula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="1-1234-5678"
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-[11px] text-neutral-400">
              <input
                type="checkbox"
                id="terminos"
                checked={aceptoTerminos}
                onChange={(e) => setAceptoTerminos(e.target.checked)}
                className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-amber-500"
                required
              />
              <label htmlFor="terminos" className="cursor-pointer">
                Comprendo que esta es una oferta formal y que Aval Motors verificará la seriedad de mi puja vía telefónica / WhatsApp.
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalPuja(false)}
                className="text-neutral-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!aceptoTerminos}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:brightness-110"
              >
                Confirmar e Ingresar Puja
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar este Remate */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Pencil className="size-5 text-amber-500" />
              Editar Datos del Remate
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Los cambios que realices aquí se verán reflejados al instante en esta pantalla.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGuardarEdicion} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editTituloDirecto" className="text-xs text-neutral-300">
                  Título del Vehículo
                </Label>
                <Input
                  id="editTituloDirecto"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editSubtituloDirecto" className="text-xs text-neutral-300">
                  Subtítulo Descriptivo
                </Label>
                <Input
                  id="editSubtituloDirecto"
                  value={editSubtitulo}
                  onChange={(e) => setEditSubtitulo(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editPrecioSalidaDirecto" className="text-xs text-neutral-300">
                  Precio de Salida Base (₡)
                </Label>
                <Input
                  id="editPrecioSalidaDirecto"
                  type="number"
                  value={editPrecioSalida}
                  onChange={(e) => setEditPrecioSalida(Number(e.target.value))}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editPrecioReservaDirecto" className="text-xs text-neutral-300">
                  Precio Reserva / Piso (₡)
                </Label>
                <Input
                  id="editPrecioReservaDirecto"
                  type="number"
                  value={editPrecioReserva}
                  onChange={(e) => setEditPrecioReserva(Number(e.target.value))}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editIncrementoDirecto" className="text-xs text-neutral-300">
                  Incremento Mínimo por Puja (₡)
                </Label>
                <Input
                  id="editIncrementoDirecto"
                  type="number"
                  value={editIncremento}
                  onChange={(e) => setEditIncremento(Number(e.target.value))}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editFechaFinDirecto" className="text-xs text-neutral-300">
                  Fecha y Hora de Cierre (Reloj)
                </Label>
                <Input
                  id="editFechaFinDirecto"
                  type="datetime-local"
                  value={editFechaFin}
                  onChange={(e) => setEditFechaFin(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editImagenPrincipalDirecto" className="text-xs text-neutral-300">
                  URL de la Foto Principal (HD)
                </Label>
                <Input
                  id="editImagenPrincipalDirecto"
                  value={editImagenPrincipal}
                  onChange={(e) => setEditImagenPrincipal(e.target.value)}
                  placeholder="https://..."
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editGanadorNombreDirecto" className="text-xs text-neutral-300">
                  Nombre del Ganador que Remata
                </Label>
                <Input
                  id="editGanadorNombreDirecto"
                  value={editGanadorNombre}
                  onChange={(e) => setEditGanadorNombre(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editGanadorTokenDirecto" className="text-xs text-neutral-300">
                  Token / Sticker Ganador
                </Label>
                <Input
                  id="editGanadorTokenDirecto"
                  value={editGanadorToken}
                  onChange={(e) => setEditGanadorToken(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editGanadorDeclaracionDirecto" className="text-xs text-neutral-300">
                  Testimonio / Declaración del Ganador
                </Label>
                <Textarea
                  id="editGanadorDeclaracionDirecto"
                  value={editGanadorDeclaracion}
                  onChange={(e) => setEditGanadorDeclaracion(e.target.value)}
                  rows={2}
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editMotorDirecto" className="text-xs text-neutral-300">
                  Motorización
                </Label>
                <Input
                  id="editMotorDirecto"
                  value={editMotor}
                  onChange={(e) => setEditMotor(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
              <Button type="button" variant="ghost" onClick={() => setModalEditar(false)} className="text-neutral-400">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                Guardar Cambios al Instante
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Publicar Nuevo Remate */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Plus className="size-5 text-amber-500" />
              Publicar Nuevo Vehículo en Remate VIP
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Ingresa los datos para lanzar una nueva subasta oficial en vivo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCrearNuevoRemate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="nuevoTituloDirecto" className="text-xs text-neutral-300">Título del Vehículo</Label>
                <Input
                  id="nuevoTituloDirecto"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="nuevoSubtituloDirecto" className="text-xs text-neutral-300">Subtítulo Descriptivo</Label>
                <Input
                  id="nuevoSubtituloDirecto"
                  value={nuevoSubtitulo}
                  onChange={(e) => setNuevoSubtitulo(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nuevoPrecioSalidaDirecto" className="text-xs text-neutral-300">Precio Salida Base (₡)</Label>
                <Input
                  id="nuevoPrecioSalidaDirecto"
                  type="number"
                  value={nuevoPrecioSalida}
                  onChange={(e) => setNuevoPrecioSalida(Number(e.target.value))}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nuevoPrecioReservaDirecto" className="text-xs text-neutral-300">Precio Reserva / Piso (₡)</Label>
                <Input
                  id="nuevoPrecioReservaDirecto"
                  type="number"
                  value={nuevoPrecioReserva}
                  onChange={(e) => setNuevoPrecioReserva(Number(e.target.value))}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nuevoIncrementoDirecto" className="text-xs text-neutral-300">Incremento Mínimo (₡)</Label>
                <Input
                  id="nuevoIncrementoDirecto"
                  type="number"
                  value={nuevoIncremento}
                  onChange={(e) => setNuevoIncremento(Number(e.target.value))}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nuevaFechaFinDirecto" className="text-xs text-neutral-300">Fecha y Hora Límite</Label>
                <Input
                  id="nuevaFechaFinDirecto"
                  type="datetime-local"
                  value={nuevaFechaFin}
                  onChange={(e) => setNuevaFechaFin(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="nuevaImagenDirecto" className="text-xs text-neutral-300">URL de la Foto Principal</Label>
                <Input
                  id="nuevaImagenDirecto"
                  value={nuevaImagen}
                  onChange={(e) => setNuevaImagen(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nuevoGanadorDirecto" className="text-xs text-neutral-300">Ganador Original</Label>
                <Input
                  id="nuevoGanadorDirecto"
                  value={nuevoGanador}
                  onChange={(e) => setNuevoGanador(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nuevoTokenDirecto" className="text-xs text-neutral-300">Token / Sticker</Label>
                <Input
                  id="nuevoTokenDirecto"
                  value={nuevoToken}
                  onChange={(e) => setNuevoToken(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
              <Button type="button" variant="ghost" onClick={() => setModalNuevo(false)} className="text-neutral-400">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold"
              >
                Publicar Remate Ahora
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
