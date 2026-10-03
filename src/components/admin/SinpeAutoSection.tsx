import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Eye,
  Filter,
  Layers,
  List,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  Table as TableIcon,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Orden } from "@/lib/orders";
import {
  fetchPayments,
  registrarPagoPrueba,
  asociarPagoAOrden,
  suscribirPagosRealtime,
  type Payment,
} from "@/lib/sinpe-auto";
import { DemoSinpeModal } from "@/components/admin/DemoSinpeModal";
import { SinpeAjustesTab } from "@/components/admin/SinpeAjustesTab";
import { CONFIG_DEFAULT, type Config } from "@/lib/admin-store";

interface SinpeAutoSectionProps {
  ordenes: Orden[];
  onEstadoOrden: (id: string, nuevoEstado: Orden["estado"]) => void;
  config?: Config;
  setConfig?: (c: Config) => void;
}

// Formato bancario estándar en Costa Rica con comas (₡25,000)
function formatCRC(monto: number): string {
  const n = Number(monto) || 0;
  return "₡" + n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function reproducirSonidoExito() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    // Desbloquear si el navegador lo suspendió por la política de autoplay
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const t = ctx.currentTime;

    // Tono 1: Campana brillante (Ding - 987.77 Hz Si5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(987.77, t);
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.3);

    // Tono 2: Armónico de confirmación bancaria (Dong - 1318.51 Hz Mi6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1318.51, t + 0.1);
    gain2.gain.setValueAtTime(0.001, t);
    gain2.gain.setValueAtTime(0.45, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.6);
  } catch (e) {
    console.debug("Web Audio no disponible", e);
  }
}

export function SinpeAutoSection({
  ordenes,
  onEstadoOrden,
  config,
  setConfig,
}: SinpeAutoSectionProps) {
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [estadoConexion, setEstadoConexion] = useState<"conectando" | "en_linea" | "error">("conectando");
  const [pestañaActiva, setPestañaActiva] = useState<"monitoreo" | "ajustes">("monitoreo");
  const [alertaPago, setAlertaPago] = useState<Payment | null>(null);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(true);
  const [modalSimulador, setModalSimulador] = useState(false);
  const [modalDemo, setModalDemo] = useState(false);
  const [simulando, setSimulando] = useState(false);

  // Form simulador
  const [simMonto, setSimMonto] = useState("25000");
  const [simNombre, setSimNombre] = useState("Carlos Mora González");
  const [simReferencia, setSimReferencia] = useState("");

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const dispararConfeti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ffffff"],
      });
    } catch {}
  };

  useEffect(() => {
    let activo = true;

    async function cargarInicial() {
      setCargando(true);
      const datos = await fetchPayments();
      if (activo) {
        setPagos(datos);
        setCargando(false);
      }
    }

    void cargarInicial();

    const canal = suscribirPagosRealtime(
      (nuevoPago) => {
        setPagos((prev) => {
          if (prev.some((p) => p.id === nuevoPago.id)) return prev;
          return [nuevoPago, ...prev];
        });

        setAlertaPago(nuevoPago);
        dispararConfeti();
        if (sonidoHabilitado) {
          reproducirSonidoExito();
        }
        toast.success(`Pago SINPE recibido: ${formatCRC(nuevoPago.amount)}`, {
          description: `Ref: #${nuevoPago.sinpe_reference} · ${nuevoPago.sender_name || "Cliente"}`,
        });
      },
      (pagoActualizado) => {
        setPagos((prev) =>
          prev.map((p) => (p.id === pagoActualizado.id ? pagoActualizado : p))
        );
      },
      (status) => {
        if (status === "SUBSCRIBED") {
          setEstadoConexion("en_linea");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setEstadoConexion("error");
        } else {
          setEstadoConexion("conectando");
        }
      }
    );

    return () => {
      activo = false;
      void canal.unsubscribe();
    };
  }, [sonidoHabilitado]);

  const hoyStr = new Date().toISOString().split("T")[0];

  const { totalHoy, confirmadasCount, pendientesCount, totalGeneral } = useMemo(() => {
    let hoySum = 0;
    let confirmadas = 0;
    let pendientes = 0;
    let total = 0;

    for (const p of pagos) {
      const fechaPago = p.created_at ? p.created_at.split("T")[0] : "";
      const esConfirmado = p.status === "confirmed";

      if (esConfirmado) {
        total += p.amount;
        if (fechaPago === hoyStr) {
          hoySum += p.amount;
        }
        confirmadas++;
      } else {
        pendientes++;
      }
    }

    return {
      totalHoy: hoySum,
      confirmadasCount: confirmadas,
      pendientesCount: pendientes,
      totalGeneral: total,
    };
  }, [pagos, hoyStr]);

  const pagosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return (pagos || []).filter((p) => {
      if (!p) return false;
      const coincideEstado = filtroEstado === "todos" || p.status === filtroEstado;
      const refStr = String(p.sinpe_reference ?? "").toLowerCase();
      const nameStr = String(p.sender_name ?? "").toLowerCase();
      const phoneStr = String(p.sender_phone ?? "").toLowerCase();
      const orderStr = String(p.orden_id ?? "").toLowerCase();

      const coincideTexto =
        !q ||
        refStr.includes(q) ||
        nameStr.includes(q) ||
        phoneStr.includes(q) ||
        orderStr.includes(q);

      return coincideEstado && coincideTexto;
    });
  }, [pagos, busqueda, filtroEstado]);

  const handleAsociarAOrden = async (pago: Payment, orden: Orden) => {
    try {
      await asociarPagoAOrden(pago.id, orden.id, "confirmed");
      if (orden.estado === "pendiente") {
        onEstadoOrden(orden.id, "aprobada");
      }
      setPagos((prev) =>
        prev.map((item) =>
          item.id === pago.id ? { ...item, orden_id: orden.id, status: "confirmed" } : item
        )
      );
      toast.success(`Orden ${orden.id} conciliada con comprobante #${pago.sinpe_reference}`);
      if (alertaPago?.id === pago.id) {
        setAlertaPago(null);
      }
    } catch (err: any) {
      toast.error("Error al conciliar: " + (err.message || "desconocido"));
    }
  };

  const handleEjecutarSimulacion = async () => {
    const monto = parseFloat(simMonto) || 25000;
    const ref = simReferencia.trim() || Math.floor(100000 + Math.random() * 900000).toString();
    setSimulando(true);
    try {
      await registrarPagoPrueba({
        amount: monto,
        sender_name: simNombre,
        sinpe_reference: ref,
        status: "confirmed",
      });
      toast.success("Pago simulado insertado correctamente");
      setModalSimulador(false);
      setSimReferencia("");
    } catch (err: any) {
      toast.error("Error al simular pago: " + (err.message || "revisa la conexión"));
    } finally {
      setSimulando(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ────────────────────────────────────────────────────────────
          BARRA DE CONTROL SUPERIOR (RESPONSIVA PARA TABLET & MOBILE)
      ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 sm:px-4 sm:py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Smartphone className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-foreground">Conciliador SINPE</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  estadoConexion === "en_linea"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    estadoConexion === "en_linea"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-amber-500 animate-ping"
                  }`}
                />
                {estadoConexion === "en_linea" ? "Realtime Activo" : "Conectando..."}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nuevo = !sonidoHabilitado;
              setSonidoHabilitado(nuevo);
              if (nuevo) {
                reproducirSonidoExito();
                toast.success("Sonido de alerta activado", {
                  description: "Prueba sonora reproducida (campana bancaria).",
                });
              } else {
                toast.info("Sonido silenciado");
              }
            }}
            className={`h-7 px-2.5 text-xs gap-1.5 transition-colors cursor-pointer ${
              sonidoHabilitado
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={sonidoHabilitado ? "Silenciar alertas" : "Activar sonido y probar"}
          >
            {sonidoHabilitado ? (
              <Volume2 className="size-3.5 text-emerald-500 animate-pulse" />
            ) : (
              <VolumeX className="size-3.5 text-muted-foreground" />
            )}
            <span className="text-[11px] font-semibold">{sonidoHabilitado ? "Sonido Activo" : "Silenciado"}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setModalDemo(true)}
            className="h-7 px-3 text-[11px] gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-xs cursor-pointer"
          >
            <Sparkles className="size-3" />
            <span>Demostración en Vivo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalSimulador(true)}
            className="h-7 px-2.5 text-[11px] gap-1"
          >
            <Plus className="size-3" />
            <span>Simular</span>
          </Button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          SUB-PESTAÑAS: MONITOREO EN VIVO vs AJUSTES DE PASARELA & IMAP
      ──────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-border pb-2 gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setPestañaActiva("monitoreo")}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            pestañaActiva === "monitoreo"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Smartphone className="size-3.5" />
          <span>Monitoreo & Conciliación</span>
        </button>
        <button
          type="button"
          onClick={() => setPestañaActiva("ajustes")}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            pestañaActiva === "ajustes"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Sliders className="size-3.5" />
          <span>Ajustes de Pasarela & IMAP</span>
        </button>
      </div>

      {pestañaActiva === "ajustes" ? (
        <SinpeAjustesTab
          config={config ?? CONFIG_DEFAULT}
          setConfig={setConfig ?? (() => {})}
        />
      ) : (
        <>
          {/* ────────────────────────────────────────────────────────────
              TARJETAS KPIS: 2 COLUMNAS EN TABLET, 4 EN PANTALLAS GRANDES
              TIPOGRAFÍA: font-sans (INTER) LIMPIO Y SIN MONTAR
          ──────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cobrado Hoy */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cobrado Hoy</span>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <div className="my-1.5 text-2xl font-bold font-sans text-emerald-500 tabular-nums tracking-tight">
            {formatCRC(totalHoy)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {confirmadasCount} pago(s) registrados hoy
          </p>
        </div>

        {/* Transacciones Confirmadas */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Confirmadas</span>
            <span className="size-2 rounded-full bg-blue-500" />
          </div>
          <div className="my-1.5 text-2xl font-bold font-sans text-foreground tabular-nums tracking-tight">
            {confirmadasCount}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Depósitos verificados con éxito
          </p>
        </div>

        {/* Pendientes de Conciliar */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Por Conciliar</span>
            <span className="size-2 rounded-full bg-amber-500" />
          </div>
          <div className="my-1.5 text-2xl font-bold font-sans text-amber-500 tabular-nums tracking-tight">
            {pendientesCount}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Sin orden vinculada todavía
          </p>
        </div>

        {/* Total Acumulado */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Acumulado</span>
            <span className="size-2 rounded-full bg-primary" />
          </div>
          <div className="my-1.5 text-2xl font-bold font-sans text-foreground tabular-nums tracking-tight">
            {formatCRC(totalGeneral)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            En {pagos.length} depósitos registrados
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          SECCIÓN PRINCIPAL: FILTROS + REGISTROS
      ──────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border p-3.5 sm:p-4">
          <div>
            <h3 className="font-semibold text-sm">Registro de Transferencias</h3>
            <p className="text-xs text-muted-foreground">
              {pagosFiltrados.length} depósito(s) listados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar comprobante..."
                className="pl-8 h-8 text-xs font-sans"
              />
            </div>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-32 h-8 text-xs font-sans">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="revision">En Revisión</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setCargando(true);
                const p = await fetchPayments();
                setPagos(p);
                setCargando(false);
                toast.success("Datos actualizados");
              }}
              className="h-8 px-2.5 text-xs gap-1"
              title="Refrescar"
            >
              <RefreshCw className={`size-3 ${cargando ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* CONTENIDO: RESPONSIVO TABLET & DESKTOP */}
        {cargando ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs">Cargando transferencias...</span>
          </div>
        ) : pagosFiltrados.length === 0 ? (
          <div className="py-12 text-center space-y-2 px-4">
            <p className="text-sm font-medium text-foreground">No se encontraron pagos</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Utiliza el botón de Simular Pago o verifica que la tabla en Supabase esté recibiendo datos.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalSimulador(true)}
              className="text-xs gap-1"
            >
              <Plus className="size-3" /> Crear pago de prueba
            </Button>
          </div>
        ) : (
          <div>
            {/* VISTA 1: CARDS RESPONSIVAS PARA PANTALLAS PEQUEÑAS Y TABLET PORTRAIT */}
            <div className="grid grid-cols-1 md:hidden divide-y divide-border">
              {pagosFiltrados.map((pago) => {
                const fecha = new Date(pago.created_at);
                const horaFmt = isNaN(fecha.getTime())
                  ? "Reciente"
                  : fecha.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
                const fechaFmt = isNaN(fecha.getTime())
                  ? ""
                  : fecha.toLocaleDateString("es-CR", { day: "2-digit", month: "short" });

                const refActual = String(pago?.sinpe_reference ?? "").trim().toLowerCase();
                const ordenCoincidente = (ordenes || []).find((o) => {
                  if (!o) return false;
                  if (pago.orden_id && o.id === pago.orden_id) return true;
                  const txId = String(o.transaccion_id ?? "").toLowerCase();
                  if (refActual && txId && (txId.includes(refActual) || refActual.includes(txId))) return true;
                  if (o.estado === "pendiente" && Number(o.precio) === Number(pago.amount)) return true;
                  return false;
                });

                return (
                  <div key={pago.id} className="p-3.5 space-y-2 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground block truncate">
                          {pago.sender_name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Clock className="size-2.5" />
                          <span>{fechaFmt} · {horaFmt}</span>
                          {pago.sender_phone && <span>· {pago.sender_phone}</span>}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold font-sans text-emerald-500 text-sm block">
                          {formatCRC(pago.amount)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-500">
                          <Check className="size-2.5" /> Verificado
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-secondary border border-border text-foreground">
                        #{pago.sinpe_reference}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {pago.orden_id ? (
                          <span className="font-mono font-bold text-[10px] text-primary flex items-center gap-1">
                            <BadgeCheck className="size-3" /> {pago.orden_id}
                          </span>
                        ) : ordenCoincidente ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAsociarAOrden(pago, ordenCoincidente)}
                            className="h-6 text-[10px] px-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                          >
                            Auto-Aprobar {ordenCoincidente.id}
                          </Button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">
                            Sin orden
                          </span>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAlertaPago(pago);
                            dispararConfeti();
                          }}
                          className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3" /> Detalle
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VISTA 2: TABLA CON SCROLL HORIZONTAL PROTEGIDO PARA TABLET / DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 text-[11px] font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-3.5 py-2.5 whitespace-nowrap">Fecha / Hora</th>
                    <th className="px-3.5 py-2.5">Emisor</th>
                    <th className="px-3.5 py-2.5 whitespace-nowrap">Monto</th>
                    <th className="px-3.5 py-2.5 whitespace-nowrap">Comprobante</th>
                    <th className="px-3.5 py-2.5 whitespace-nowrap">Estado</th>
                    <th className="px-3.5 py-2.5 whitespace-nowrap">Orden Aval</th>
                    <th className="px-3.5 py-2.5 text-right whitespace-nowrap">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagosFiltrados.map((pago) => {
                    const fecha = new Date(pago.created_at);
                    const horaFmt = isNaN(fecha.getTime())
                      ? "Reciente"
                      : fecha.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
                    const fechaFmt = isNaN(fecha.getTime())
                      ? ""
                      : fecha.toLocaleDateString("es-CR", { day: "2-digit", month: "short" });

                    const refActual = String(pago?.sinpe_reference ?? "").trim().toLowerCase();
                    const ordenCoincidente = (ordenes || []).find((o) => {
                      if (!o) return false;
                      if (pago.orden_id && o.id === pago.orden_id) return true;
                      const txId = String(o.transaccion_id ?? "").toLowerCase();
                      if (refActual && txId && (txId.includes(refActual) || refActual.includes(txId))) return true;
                      if (o.estado === "pendiente" && Number(o.precio) === Number(pago.amount)) return true;
                      return false;
                    });

                    return (
                      <tr key={pago.id} className="hover:bg-secondary/20 transition-colors">
                        {/* Fecha */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <div className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                            <Clock className="size-2.5 text-muted-foreground" />
                            {horaFmt}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{fechaFmt}</div>
                        </td>

                        {/* Emisor */}
                        <td className="px-3.5 py-2.5">
                          <div className="font-medium text-foreground text-[11px] truncate max-w-[130px]" title={pago.sender_name || ""}>
                            {pago.sender_name}
                          </div>
                          {pago.sender_phone && (
                            <div className="font-mono text-[9px] text-muted-foreground">
                              {pago.sender_phone}
                            </div>
                          )}
                        </td>

                        {/* Monto con font-sans */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap font-sans font-bold text-emerald-500 text-xs tabular-nums">
                          {formatCRC(pago.amount)}
                        </td>

                        {/* Comprobante */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span className="inline-flex items-center font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground">
                            #{pago.sinpe_reference}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {pago.status === "confirmed" ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <Check className="size-2.5" /> Verificado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Clock className="size-2.5" /> Pendiente
                            </span>
                          )}
                        </td>

                        {/* Orden */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {pago.orden_id ? (
                            <span className="font-mono font-bold text-[10px] text-primary flex items-center gap-1">
                              <BadgeCheck className="size-3" /> {pago.orden_id}
                            </span>
                          ) : ordenCoincidente ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAsociarAOrden(pago, ordenCoincidente)}
                              className="h-5 text-[9px] px-1.5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                            >
                              Auto-Aprobar {ordenCoincidente.id}
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">
                              Sin orden
                            </span>
                          )}
                        </td>

                        {/* Acción */}
                        <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAlertaPago(pago);
                              dispararConfeti();
                            }}
                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                          >
                            <ArrowUpRight className="size-3" /> Detalle
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL DE ALERTA CLEAN (PAGO RECIBIDO)
      ──────────────────────────────────────────────────────────── */}
      {alertaPago && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setAlertaPago(null)}
              className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:bg-secondary transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto size-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
              <Check className="size-7 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                Pago Verificado en SINPE Móvil
              </span>
              <div className="text-3xl font-bold font-sans text-emerald-500 tabular-nums">
                {formatCRC(alertaPago.amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Emisor: <strong className="text-foreground">{alertaPago.sender_name}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-secondary/50 border border-border text-left">
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Comprobante</span>
                <span className="font-mono font-bold text-foreground">#{alertaPago.sinpe_reference}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Hora</span>
                <span className="font-medium text-foreground">
                  {new Date(alertaPago.created_at).toLocaleTimeString("es-CR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {(() => {
                const refAlert = String(alertaPago?.sinpe_reference ?? "").trim().toLowerCase();
                const ordenSugerida = (ordenes || []).find((o) => {
                  if (!o || o.estado !== "pendiente") return false;
                  if (Number(o.precio) === Number(alertaPago.amount)) return true;
                  const txId = String(o.transaccion_id ?? "").toLowerCase();
                  if (refAlert && txId && (txId.includes(refAlert) || refAlert.includes(txId))) return true;
                  return false;
                });

                if (ordenSugerida) {
                  return (
                    <Button
                      variant="default"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 h-8"
                      onClick={() => handleAsociarAOrden(alertaPago, ordenSugerida)}
                    >
                      <CheckCircle2 className="size-4" />
                      Auto-Aprobar Orden #{ordenSugerida.id}
                    </Button>
                  );
                }
                return null;
              })()}

              <Button
                variant="outline"
                className="w-full text-xs h-8"
                onClick={() => setAlertaPago(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL SIMULADOR DE PAGO
      ──────────────────────────────────────────────────────────── */}
      {modalSimulador && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-sm">Simular Pago SINPE</h3>
              <button
                onClick={() => setModalSimulador(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium block mb-1">Monto en Colones (₡)</label>
                <Input
                  type="number"
                  value={simMonto}
                  onChange={(e) => setSimMonto(e.target.value)}
                  placeholder="25000"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-medium block mb-1">Nombre del Cliente</label>
                <Input
                  value={simNombre}
                  onChange={(e) => setSimNombre(e.target.value)}
                  placeholder="Carlos Mora González"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-medium block mb-1">Comprobante SINPE</label>
                <Input
                  value={simReferencia}
                  onChange={(e) => setSimReferencia(e.target.value)}
                  placeholder="Ej: 839201"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs h-8"
                onClick={() => setModalSimulador(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="flex-1 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                onClick={handleEjecutarSimulacion}
                disabled={simulando}
              >
                {simulando ? "Enviando..." : "Disparar Pago"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DEMOSTRACIÓN INTERACTIVA */}
      <DemoSinpeModal
        open={modalDemo}
        onClose={() => setModalDemo(false)}
        onEjecutadoExitoso={() => {}}
      />
    </div>
  );
}
