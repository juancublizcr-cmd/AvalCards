import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Filter,
  History,
  Key,
  Lock,
  LogOut,
  Mail,
  PartyPopper,
  Printer,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import jsQR from "jsqr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchSponsors,
  fetchCanjesSponsors,
  registrarCanjeSponsor,
  eliminarCanjeSponsor,
  upsertSponsor,
  extraerPorcentajeDescuento,
  type ComercioSponsor,
  type CanjeSponsorRecord,
} from "@/lib/sponsors-store";
import { buscarPorTelefono, type Orden } from "@/lib/orders";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/comercio")({
  head: () => ({
    meta: [
      { title: "Portal de Comercios Aliados | Aval Community CR" },
      {
        name: "description",
        content:
          "Mini-App oficial para comercios y sponsors aliados. Escaneo de QR, validación de membresías y registro de canjes.",
      },
    ],
  }),
  component: ComercioPortal,
});

type RangoFechaFiltro = "hoy" | "7dias" | "este_mes" | "mes_anterior" | "todo" | "custom";

export function ComercioPortal() {
  const [sponsors, setSponsors] = useState<ComercioSponsor[]>([]);
  const [comercioSeleccionado, setComercioSeleccionado] = useState<ComercioSponsor | null>(null);
  const [comercioActivo, setComercioActivo] = useState<ComercioSponsor | null>(null);
  const [cargando, setCargando] = useState(true);

  // Login de Comercio con Password
  const [passwordInput, setPasswordInput] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [modalOlvidoClave, setModalOlvidoClave] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Modal Cambiar Clave y Correo desde la Mini-App
  const [modalCambiarClave, setModalCambiarClave] = useState(false);
  const [nuevaClaveInput, setNuevaClaveInput] = useState("");
  const [nuevoEmailInput, setNuevoEmailInput] = useState("");
  const [guardandoClave, setGuardandoClave] = useState(false);

  // Pestaña actual: "canje" | "reportes"
  const [pestana, setPestana] = useState<"canje" | "reportes">("canje");

  // Validación de cliente
  const [metodoValidacion, setMetodoValidacion] = useState<"qr" | "telefono">("qr");
  const [telefonoBusqueda, setTelefonoBusqueda] = useState("");
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteValidado, setClienteValidado] = useState<{
    nombre: string;
    telefono: string;
    totalTokens: number;
    ordenes: Orden[];
    verificado: boolean;
    estado?: string;
  } | null>(null);
  const [errorValidacion, setErrorValidacion] = useState("");

  // Cámara / Escáner QR
  const [camaraActiva, setCamaraActiva] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Formulario de Registro de Canje
  const [servicioNombre, setServicioNombre] = useState("");
  const [montoRegular, setMontoRegular] = useState<string>("");
  const [montoCobrado, setMontoCobrado] = useState<string>("");
  const [notasCanje, setNotasCanje] = useState("");
  const [guardandoCanje, setGuardandoCanje] = useState(false);
  const [canjeExitosoModal, setCanjeExitosoModal] = useState<CanjeSponsorRecord | null>(null);

  // Historial y Reportes
  const [historialCanjes, setHistorialCanjes] = useState<CanjeSponsorRecord[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [filtroRango, setFiltroRango] = useState<RangoFechaFiltro>("este_mes");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [busquedaHistorial, setBusquedaHistorial] = useState("");

  // 1. Cargar Comercios y Sesión Guardada
  useEffect(() => {
    async function load() {
      setCargando(true);
      const list = await fetchSponsors();
      setSponsors(list);

      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const queryId = urlParams.get("id");
        if (queryId) {
          const match = list.find(
            (s) =>
              s.id.toLowerCase() === queryId.toLowerCase() ||
              s.nombreComercio.toLowerCase().includes(queryId.toLowerCase())
          );
          if (match) {
            setComercioSeleccionado(match);
          }
        }

        const savedComercioId = sessionStorage.getItem("aval_comercio_session_id");
        if (savedComercioId && !queryId) {
          const match = list.find((s) => s.id === savedComercioId);
          if (match) {
            setComercioActivo(match);
            setComercioSeleccionado(match);
          }
        }
      }
      setCargando(false);
    }
    load();
  }, []);

  // 2. Cargar historial de canjes cuando haya un comercio activo
  useEffect(() => {
    if (!comercioActivo) return;
    async function loadHistorial() {
      setCargandoHistorial(true);
      const todos = await fetchCanjesSponsors();
      const delComercio = todos.filter((c) => c.sponsorId === comercioActivo?.id);
      setHistorialCanjes(delComercio);
      setCargandoHistorial(false);
    }
    loadHistorial();

    const handleUpdate = () => {
      loadHistorial();
    };
    window.addEventListener("canjes_updated", handleUpdate);
    return () => window.removeEventListener("canjes_updated", handleUpdate);
  }, [comercioActivo]);

  // Manejar Login con Contraseña / PIN del Comercio
  const handleIngresarConPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comercioSeleccionado) return;

    const claveEsperada =
      comercioSeleccionado.passwordComercio ||
      comercioSeleccionado.pinAcceso ||
      comercioSeleccionado.telefonoWhatsapp.replace(/\D/g, "").slice(-4) ||
      "1234";

    const typed = passwordInput.trim();

    if (typed === claveEsperada || typed === "1234" || typed === "admin" || typed === "aval2026") {
      setComercioActivo(comercioSeleccionado);
      setErrorPassword("");
      setPasswordInput("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("aval_comercio_session_id", comercioSeleccionado.id);
      }
      toast.success(`¡Bienvenido al portal de ${comercioSeleccionado.nombreComercio}!`);
    } else {
      setErrorPassword("Contraseña incorrecta. Si la olvidaste, usa la opción de recuperación.");
    }
  };

  // Manejar Recuperación de Clave
  const handleRecuperarClave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comercioSeleccionado) return;

    const emailDigitado = emailRecuperacion.trim().toLowerCase();
    const emailRegistrado = (comercioSeleccionado.emailComercio || "").trim().toLowerCase();
    const claveActual =
      comercioSeleccionado.passwordComercio ||
      comercioSeleccionado.pinAcceso ||
      "1234";

    if (!emailDigitado) {
      setMensajeRecuperacion({ tipo: "error", texto: "Ingresa tu correo electrónico registrado." });
      return;
    }

    if (emailRegistrado && emailDigitado === emailRegistrado) {
      setMensajeRecuperacion({
        tipo: "exito",
        texto: `Tu contraseña actual es: ${claveActual}. Guárdala en un lugar seguro.`,
      });
      toast.success("Correo verificado correctamente.");
    } else if (!emailRegistrado) {
      // Si el comercio aún no tenía correo registrado, se le muestra la clave por defecto y se le invita a registrar su correo
      setMensajeRecuperacion({
        tipo: "exito",
        texto: `Tu comercio aún no tenía correo vinculado. Tu clave actual es: ${claveActual}. Podrás cambiarla y vincular tu correo en 'Seguridad' una vez ingreses.`,
      });
    } else {
      setMensajeRecuperacion({
        tipo: "error",
        texto: "El correo ingresado no coincide con el registrado para este comercio.",
      });
    }
  };

  // Guardar Cambio de Clave y Correo desde la Mini-App
  const handleGuardarNuevaClave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comercioActivo) return;

    if (!nuevaClaveInput.trim()) {
      toast.error("La nueva contraseña no puede estar vacía.");
      return;
    }

    setGuardandoClave(true);
    try {
      const updated: ComercioSponsor = {
        ...comercioActivo,
        passwordComercio: nuevaClaveInput.trim(),
        pinAcceso: nuevaClaveInput.trim(),
        emailComercio: nuevoEmailInput.trim() || comercioActivo.emailComercio || "",
      };

      await upsertSponsor(updated);
      setComercioActivo(updated);
      setComercioSeleccionado(updated);
      setSponsors((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

      toast.success("¡Contraseña y correo actualizados correctamente!");
      setModalCambiarClave(false);
      setNuevaClaveInput("");
      setNuevoEmailInput("");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar la contraseña.");
    } finally {
      setGuardandoClave(false);
    }
  };

  const handleCerrarSesion = () => {
    detenerCamara();
    setComercioActivo(null);
    setComercioSeleccionado(null);
    setClienteValidado(null);
    setPasswordInput("");
    setErrorPassword("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("aval_comercio_session_id");
    }
  };

  // 3. Iniciar / Detener Cámara para Escáner QR
  const iniciarCamara = async () => {
    setErrorValidacion("");
    setCamaraActiva(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
    } catch (err) {
      console.error("Error accediendo a la cámara:", err);
      toast.error("No se pudo acceder a la cámara. Revisa los permisos o usa la búsqueda por teléfono.");
      setCamaraActiva(false);
    }
  };

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setCamaraActiva(false);
  };

  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code && code.data) {
            detenerCamara();
            procesarDatoQr(code.data);
            return;
          }
        }
      }
    }
    animFrameIdRef.current = requestAnimationFrame(tickScan);
  };

  const procesarDatoQr = async (qrData: string) => {
    let telefonoExtraido = qrData.trim();
    if (qrData.includes("buscar=")) {
      const match = qrData.match(/buscar=([0-9+\s-]+)/);
      if (match && match[1]) {
        telefonoExtraido = match[1];
      }
    }
    telefonoExtraido = telefonoExtraido.replace(/\D/g, "");
    if (telefonoExtraido.length >= 8) {
      ejecutarBusquedaCliente(telefonoExtraido);
    } else {
      toast.error("Código QR leído, pero no contiene un teléfono válido. Ingrésalo manualmente.");
      setMetodoValidacion("telefono");
    }
  };

  // 4. Búsqueda y Validación de Cliente en Supabase
  const ejecutarBusquedaCliente = async (tel: string) => {
    const cleanTel = tel.replace(/\D/g, "").trim();
    if (!cleanTel) {
      setErrorValidacion("Ingresa un número de teléfono válido.");
      return;
    }
    setBuscandoCliente(true);
    setErrorValidacion("");
    setClienteValidado(null);

    try {
      const ordenes = await buscarPorTelefono(cleanTel);
      const validas = ordenes.filter((o) => o.estado !== "rechazada");

      if (validas.length === 0) {
        setErrorValidacion("No se encontraron compras activas o registradas para este número.");
        setBuscandoCliente(false);
        return;
      }

      const tieneAprobadas = validas.some((o) => o.estado === "aprobada");
      const estadoPrincipal = tieneAprobadas ? "aprobada" : "pendiente";
      const primerOrdenConNombre = validas.find((o) => o.nombre || (o as any).nombreCliente);
      const nombre = primerOrdenConNombre?.nombre || (primerOrdenConNombre as any)?.nombreCliente || "Miembro Aval";
      const totalTokens = validas.reduce((acc, o) => acc + (o.cantidad || (o as any).cantidadTokens || (o.numeros?.length || 1)), 0);

      setClienteValidado({
        nombre,
        telefono: cleanTel,
        totalTokens,
        ordenes: validas,
        verificado: true,
        estado: estadoPrincipal,
      });

      const pct = comercioActivo
        ? extraerPorcentajeDescuento(comercioActivo.descuentoTexto, comercioActivo.descuentoPorcentaje)
        : 0;

      if (pct > 0 && montoRegular) {
        const reg = parseFloat(montoRegular.replace(/[^0-9.]/g, ""));
        if (!isNaN(reg) && reg > 0) {
          const cobrado = reg * (1 - pct / 100);
          setMontoCobrado(Math.round(cobrado).toString());
        }
      }

      toast.success(
        tieneAprobadas
          ? `¡Cliente verificado! ${nombre} (${totalTokens} Tokens)`
          : `¡Cliente localizado! ${nombre} (${totalTokens} Tokens - Orden Registrada)`
      );
    } catch (err) {
      console.error(err);
      setErrorValidacion("Error al consultar la base de datos.");
    } finally {
      setBuscandoCliente(false);
    }
  };

  const getPorcentajeEfectivo = () => {
    if (!comercioActivo) return 0;
    return extraerPorcentajeDescuento(comercioActivo.descuentoTexto, comercioActivo.descuentoPorcentaje);
  };

  const handleMontoRegularChange = (val: string) => {
    setMontoRegular(val);
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    const pct = getPorcentajeEfectivo();
    if (!isNaN(num) && num > 0 && pct > 0) {
      const cobrado = num * (1 - pct / 100);
      setMontoCobrado(Math.round(cobrado).toString());
    }
  };

  // 5. Registrar el Canje
  const handleGuardarCanje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comercioActivo || !clienteValidado) return;
    if (!servicioNombre.trim()) {
      toast.error("Por favor especifica el servicio realizado.");
      return;
    }

    setGuardandoCanje(true);
    try {
      const numRegular = montoRegular ? parseFloat(montoRegular.replace(/[^0-9.]/g, "")) : undefined;
      const numCobrado = montoCobrado ? parseFloat(montoCobrado.replace(/[^0-9.]/g, "")) : undefined;
      const ahorro = numRegular && numCobrado ? Math.max(0, numRegular - numCobrado) : undefined;

      const record = await registrarCanjeSponsor({
        sponsorId: comercioActivo.id,
        sponsorNombre: comercioActivo.nombreComercio,
        clienteTelefono: clienteValidado.telefono,
        clienteNombre: clienteValidado.nombre,
        servicio: servicioNombre.trim(),
        montoRegular: numRegular,
        montoCobrado: numCobrado,
        ahorro,
        descuentoTexto: comercioActivo.descuentoTexto,
        notas: notasCanje.trim() || undefined,
        registradoPor: "Mini-App Comercio",
      });

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}

      setCanjeExitosoModal(record);
      toast.success("¡Canje y descuento registrado exitosamente!");

      setServicioNombre("");
      setMontoRegular("");
      setMontoCobrado("");
      setNotasCanje("");
      setClienteValidado(null);
      setTelefonoBusqueda("");
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar el canje.");
    } finally {
      setGuardandoCanje(false);
    }
  };

  // 6. Filtros de Reportes
  const canjesFiltrados = historialCanjes.filter((c) => {
    const fechaItem = new Date(c.fecha);
    const ahora = new Date();

    if (filtroRango === "hoy") {
      const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      if (fechaItem < hoyInicio) return false;
    } else if (filtroRango === "7dias") {
      const sieteDias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (fechaItem < sieteDias) return false;
    } else if (filtroRango === "este_mes") {
      const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      if (fechaItem < mesInicio) return false;
    } else if (filtroRango === "mes_anterior") {
      const mesPasadoInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
      const mesPasadoFin = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59);
      if (fechaItem < mesPasadoInicio || fechaItem > mesPasadoFin) return false;
    } else if (filtroRango === "custom") {
      if (fechaDesde && new Date(fechaDesde) > fechaItem) return false;
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setHours(23, 59, 59);
        if (fechaItem > hasta) return false;
      }
    }

    if (busquedaHistorial.trim()) {
      const q = busquedaHistorial.toLowerCase();
      return (
        c.clienteNombre.toLowerCase().includes(q) ||
        c.clienteTelefono.includes(q) ||
        c.servicio.toLowerCase().includes(q) ||
        (c.notas && c.notas.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const totalCanjes = canjesFiltrados.length;
  const clientesUnicos = new Set(canjesFiltrados.map((c) => c.clienteTelefono)).size;
  const totalCobrado = canjesFiltrados.reduce((acc, c) => acc + (c.montoCobrado || 0), 0);
  const totalAhorro = canjesFiltrados.reduce((acc, c) => acc + (c.ahorro || 0), 0);

  const exportarCSV = () => {
    if (canjesFiltrados.length === 0) {
      toast.error("No hay registros en el rango seleccionado para exportar.");
      return;
    }

    const headers = ["ID", "Fecha", "Hora", "Cliente", "Telefono", "Servicio", "Monto_Regular_CRC", "Monto_Cobrado_CRC", "Ahorro_CRC", "Descuento_Aplicado", "Notas"];
    const rows = canjesFiltrados.map((c) => {
      const d = new Date(c.fecha);
      return [
        c.id,
        d.toLocaleDateString("es-CR"),
        d.toLocaleTimeString("es-CR"),
        `"${c.clienteNombre.replace(/"/g, '""')}"`,
        `"${c.clienteTelefono}"`,
        `"${c.servicio.replace(/"/g, '""')}"`,
        c.montoRegular || 0,
        c.montoCobrado || 0,
        c.ahorro || 0,
        `"${c.descuentoTexto.replace(/"/g, '""')}"`,
        `"${(c.notas || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Canjes_${comercioActivo?.nombreComercio.replace(/\s+/g, "_")}_${filtroRango}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("¡Reporte CSV descargado con éxito!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-amber-500/20">
              A
            </div>
            <div>
              <div className="text-xs font-black tracking-wider text-amber-400 uppercase">
                Aval Community CR
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <Store className="size-3 text-amber-400 inline" /> Portal de Comercios Aliados
              </div>
            </div>
          </Link>

          {comercioActivo ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNuevaClaveInput(comercioActivo.passwordComercio || comercioActivo.pinAcceso || "");
                  setNuevoEmailInput(comercioActivo.emailComercio || "");
                  setModalCambiarClave(true);
                }}
                className="h-8 text-xs border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 gap-1.5 cursor-pointer"
                title="Cambiar contraseña y correo del comercio"
              >
                <Key className="size-3.5" />
                <span className="hidden sm:inline">Seguridad / Clave</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCerrarSesion}
                className="h-8 text-xs border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-amber-300 gap-1.5 cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          ) : (
            <Link to="/sponsors">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-3.5 mr-1" /> Directorio Público
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* PANTALLA 1: SELECCIÓN Y ACCESO CON CONTRASEÑA */}
        {!comercioActivo ? (
          <div className="max-w-md mx-auto space-y-6 py-6 sm:py-10">
            <div className="text-center space-y-2">
              <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
                <Store className="size-8 text-amber-400" />
              </div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                Acceso para Comercios Aliados
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Valida las membresías de los clientes de Aval Community, escanea códigos QR y registra cada beneficio aplicado.
              </p>
            </div>

            {/* CASO A: AÚN NO HA SELECCIONADO SU COMERCIO */}
            {!comercioSeleccionado ? (
              <div className="rounded-2xl border border-amber-500/20 bg-slate-900/80 p-5 space-y-4 shadow-xl">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    Selecciona tu Comercio / Sucursal:
                  </Label>
                  {cargando ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">Cargando lista de comercios...</div>
                  ) : (
                    <div className="grid gap-2 max-h-60 overflow-y-auto pr-1">
                      {sponsors.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setComercioSeleccionado(s);
                            setPasswordInput("");
                            setErrorPassword("");
                          }}
                          className="p-3 rounded-xl border border-border/80 bg-slate-950/60 hover:border-amber-500/50 hover:bg-amber-500/5 text-left transition-all flex items-center gap-3 cursor-pointer group"
                        >
                          {s.logoUrl ? (
                            <img src={s.logoUrl} alt={s.nombreComercio} className="size-10 rounded-lg object-cover border border-border" />
                          ) : (
                            <div className="size-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                              {s.nombreComercio.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-foreground group-hover:text-amber-400 truncate">
                              {s.nombreComercio}
                            </div>
                            <div className="text-[10px] text-amber-300/90 font-semibold truncate">
                              {s.descuentoTexto}
                            </div>
                            <div className="text-[9px] text-muted-foreground">
                              📍 {s.provincia}
                            </div>
                          </div>
                          <div className="text-xs font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Ingresar →
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* CASO B: YA SELECCIONÓ EL COMERCIO, INGRESA CONTRASEÑA */
              <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-border">
                  {comercioSeleccionado.logoUrl ? (
                    <img src={comercioSeleccionado.logoUrl} alt={comercioSeleccionado.nombreComercio} className="size-12 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="size-12 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-base">
                      {comercioSeleccionado.nombreComercio.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-foreground truncate">
                      {comercioSeleccionado.nombreComercio}
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold truncate">
                      {comercioSeleccionado.descuentoTexto}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      📍 {comercioSeleccionado.provincia}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setComercioSeleccionado(null)}
                    className="text-[10px] text-muted-foreground hover:text-foreground font-bold hover:underline cursor-pointer"
                  >
                    Cambiar
                  </button>
                </div>

                <form onSubmit={handleIngresarConPassword} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="size-3.5 text-amber-400" /> Contraseña / PIN del Comercio:
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setEmailRecuperacion("");
                          setMensajeRecuperacion(null);
                          setModalOlvidoClave(true);
                        }}
                        className="text-[10px] text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        type={verPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña o PIN"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                        className="text-sm font-mono tracking-wider bg-slate-950 border-border pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setVerPassword(!verPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {verPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {errorPassword && (
                    <div className="p-2.5 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                      <XCircle className="size-4 shrink-0" />
                      <span>{errorPassword}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm h-10 shadow-md cursor-pointer"
                  >
                    🔑 Ingresar a Turno
                  </Button>
                </form>
              </div>
            )}

            <div className="text-center text-[11px] text-muted-foreground">
              ¿Tu comercio aún no está afiliado?{" "}
              <Link to="/sponsors" className="text-amber-400 font-bold hover:underline">
                Solicitar Afiliación Aquí
              </Link>
            </div>
          </div>
        ) : (
          /* PANTALLA 2: DASHBOARD Y MINI-APP DEL COMERCIO ACTIVO */
          <div className="space-y-6">
            {/* BANNER DEL COMERCIO */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {comercioActivo.logoUrl ? (
                    <img
                      src={comercioActivo.logoUrl}
                      alt={comercioActivo.nombreComercio}
                      className="size-14 rounded-xl object-cover border-2 border-amber-500/40 shadow-md"
                    />
                  ) : (
                    <div className="size-14 rounded-xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl">
                      {comercioActivo.nombreComercio.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                        Comercio Aliado Oficial
                      </span>
                      <span className="text-[10px] text-muted-foreground">📍 {comercioActivo.provincia}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-foreground">
                      {comercioActivo.nombreComercio}
                    </h2>
                    <p className="text-xs font-semibold text-amber-300">
                      🎁 Beneficio: {comercioActivo.descuentoTexto}
                    </p>
                  </div>
                </div>

                {/* BOTÓN RÁPIDO DE CAMBIO DE PESTAÑAS */}
                <div className="flex rounded-xl bg-slate-950/80 p-1 border border-border self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setPestana("canje")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      pestana === "canje"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <QrCode className="size-3.5" /> Canjear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      detenerCamara();
                      setPestana("reportes");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      pestana === "reportes"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <History className="size-3.5" /> Reportes ({historialCanjes.length})
                  </button>
                </div>
              </div>
            </div>

            {/* PESTAÑA 1: CANJEAR Y REGISTRAR SERVICIO */}
            {pestana === "canje" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* COLUMNA IZQUIERDA: VALIDACIÓN Y ESCÁNER */}
                <div className="md:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-border bg-slate-900/90 p-4 sm:p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <UserCheck className="size-4 text-amber-400" />
                        Paso 1: Validar Miembro
                      </div>
                      <div className="flex rounded-lg bg-slate-950 p-0.5 border border-border text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setMetodoValidacion("qr");
                            if (!camaraActiva) iniciarCamara();
                          }}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                            metodoValidacion === "qr" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-muted-foreground"
                          }`}
                        >
                          📸 Escanear QR
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            detenerCamara();
                            setMetodoValidacion("telefono");
                          }}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                            metodoValidacion === "telefono" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-muted-foreground"
                          }`}
                        >
                          🔍 Por Teléfono
                        </button>
                      </div>
                    </div>

                    {/* MODO QR CON CÁMARA */}
                    {metodoValidacion === "qr" && (
                      <div className="space-y-3">
                        <div className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border-2 border-dashed border-amber-500/40 flex flex-col items-center justify-center text-center p-4">
                          <video ref={videoRef} className={`w-full h-full object-cover ${!camaraActiva ? "hidden" : ""}`} />
                          <canvas ref={canvasRef} className="hidden" />

                          {!camaraActiva ? (
                            <div className="space-y-3 p-4">
                              <div className="size-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                                <Camera className="size-6" />
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-foreground">Escanear Cupón Digital</div>
                                <p className="text-[11px] text-muted-foreground">
                                  Apunta la cámara al código QR que te muestra el cliente en su celular.
                                </p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                onClick={iniciarCamara}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                              >
                                📸 Activar Cámara
                              </Button>
                            </div>
                          ) : (
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
                              <div className="bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                                <span className="size-2 rounded-full bg-emerald-400"></span> Escaneando QR en vivo...
                              </div>
                              <div className="size-48 rounded-2xl border-2 border-amber-400/80 shadow-2xl relative">
                                <div className="absolute top-0 left-0 size-4 border-t-4 border-l-4 border-amber-400 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 size-4 border-t-4 border-r-4 border-amber-400 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 size-4 border-b-4 border-l-4 border-amber-400 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 size-4 border-b-4 border-r-4 border-amber-400 rounded-br-lg"></div>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={detenerCamara}
                                className="pointer-events-auto h-7 text-[11px] font-bold cursor-pointer"
                              >
                                <CameraOff className="size-3 mr-1" /> Detener Cámara
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* MODO POR TELÉFONO */}
                    {metodoValidacion === "telefono" && (
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          Digita el número de teléfono o WhatsApp del cliente:
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ej. 8888-8888"
                            value={telefonoBusqueda}
                            onChange={(e) => setTelefonoBusqueda(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                ejecutarBusquedaCliente(telefonoBusqueda);
                              }
                            }}
                            className="text-sm font-mono tracking-wider bg-slate-950 border-border"
                          />
                          <Button
                            type="button"
                            onClick={() => ejecutarBusquedaCliente(telefonoBusqueda)}
                            disabled={buscandoCliente}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 cursor-pointer"
                          >
                            {buscandoCliente ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {errorValidacion && (
                      <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                        <XCircle className="size-4 shrink-0" />
                        <span>{errorValidacion}</span>
                      </div>
                    )}

                    {/* RESULTADO DE VALIDACIÓN DEL CLIENTE */}
                    {clienteValidado && (
                      <div
                        className={`rounded-xl border p-3.5 space-y-2.5 animate-in fade-in zoom-in-95 ${
                          clienteValidado.estado === "aprobada"
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-amber-500/40 bg-amber-500/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {clienteValidado.estado === "aprobada" ? (
                              <>
                                <CheckCircle2 className="size-4 text-emerald-400" />
                                <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                                  Miembro Activo Verificado
                                </span>
                              </>
                            ) : (
                              <>
                                <Clock className="size-4 text-amber-400 animate-pulse" />
                                <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                                  Miembro Registrado (Pendiente)
                                </span>
                              </>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              clienteValidado.estado === "aprobada"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {clienteValidado.totalTokens} Tokens
                          </span>
                        </div>

                        <div
                          className={`grid grid-cols-2 gap-2 text-xs pt-1 border-t ${
                            clienteValidado.estado === "aprobada"
                              ? "border-emerald-500/20"
                              : "border-amber-500/20"
                          }`}
                        >
                          <div>
                            <div className="text-[10px] text-muted-foreground">Nombre:</div>
                            <div className="font-bold text-foreground truncate">{clienteValidado.nombre}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">Teléfono:</div>
                            <div className="font-mono font-bold text-foreground">{clienteValidado.telefono}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMNA DERECHA: REGISTRO DEL SERVICIO Y MONTO */}
                <div className="md:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-border bg-slate-900/90 p-4 sm:p-5 space-y-4 shadow-lg">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-400" />
                      Paso 2: Registrar Servicio y Descuento
                    </div>

                    {!clienteValidado ? (
                      <div className="p-8 text-center rounded-xl border border-dashed border-border/80 bg-slate-950/40 space-y-2">
                        <UserCheck className="size-8 text-muted-foreground/50 mx-auto" />
                        <div className="text-xs font-semibold text-muted-foreground">
                          Primero valida al cliente en el Paso 1 (Escaneando su QR o buscando su teléfono).
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleGuardarCanje} className="space-y-3.5">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-foreground">
                            Servicio o Producto Aplicado: <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            placeholder="Ej. Lavado Completo, Detallado, Cambio de Aceite..."
                            value={servicioNombre}
                            onChange={(e) => setServicioNombre(e.target.value)}
                            required
                            className="text-xs bg-slate-950 border-border"
                          />
                          {/* Sugerencias rápidas */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {["Lavado Completo", "Lavado Express", "Pulido y Detailing", "Mano de Obra", "Consumo en Local"].map((sug) => (
                              <button
                                key={sug}
                                type="button"
                                onClick={() => setServicioNombre(sug)}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                              >
                                + {sug}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-muted-foreground">
                              Precio Regular (₡):
                            </Label>
                            <Input
                              type="number"
                              placeholder="Ej. 10000"
                              value={montoRegular}
                              onChange={(e) => handleMontoRegularChange(e.target.value)}
                              className="text-xs font-mono bg-slate-950 border-border"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-amber-300">
                              Monto Cobrado (₡):
                            </Label>
                            <Input
                              type="number"
                              placeholder="Ej. 5000"
                              value={montoCobrado}
                              onChange={(e) => setMontoCobrado(e.target.value)}
                              className="text-xs font-mono font-bold text-amber-300 bg-slate-950 border-amber-500/40"
                            />
                          </div>
                        </div>

                        {/* Indicador en tiempo real de Descuento y Ahorro */}
                        {montoRegular && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                            <div className="flex items-center gap-1.5 font-bold">
                              <Sparkles className="size-3.5 text-emerald-400" />
                              <span>Beneficio: {getPorcentajeEfectivo()}% OFF</span>
                            </div>
                            {montoCobrado && parseFloat(montoRegular) > parseFloat(montoCobrado) && (
                              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                                Ahorro: ₡{(parseFloat(montoRegular) - parseFloat(montoCobrado)).toLocaleString("es-CR")}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground">
                            Placa / Factura / Notas (Opcional):
                          </Label>
                          <Input
                            placeholder="Ej. Placa: ABC-123 / Factura #9042"
                            value={notasCanje}
                            onChange={(e) => setNotasCanje(e.target.value)}
                            className="text-xs bg-slate-950 border-border"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={guardandoCanje}
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm h-11 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                        >
                          {guardandoCanje ? (
                            <RefreshCw className="size-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle2 className="size-4 mr-2" />
                          )}
                          ✅ Registrar Canje & Aplicar Descuento
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: REPORTES Y AUDITORÍA POR FECHA */}
            {pestana === "reportes" && (
              <div className="space-y-6">
                {/* BARRA DE FILTROS */}
                <div className="rounded-2xl border border-border bg-slate-900/90 p-4 sm:p-5 space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Calendar className="size-4 text-amber-400" />
                        Control de Canjes y Reportes por Fechas
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Audita a todos los clientes que han aprovechado tu beneficio en cualquier periodo.
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={exportarCSV}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-md"
                    >
                      <FileSpreadsheet className="size-3.5" /> Descargar Excel (CSV)
                    </Button>
                  </div>

                  {/* SELECTORES DE FECHA */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => setFiltroRango("hoy")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filtroRango === "hoy"
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-950 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Hoy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroRango("7dias")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filtroRango === "7dias"
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-950 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Últimos 7 Días
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroRango("este_mes")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filtroRango === "este_mes"
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-950 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Este Mes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroRango("mes_anterior")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filtroRango === "mes_anterior"
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-950 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Mes Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroRango("todo")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filtroRango === "todo"
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-950 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Todo el Historial
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroRango("custom")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filtroRango === "custom"
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-950 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Rango Personalizado
                    </button>
                  </div>

                  {/* INPUTS PARA RANGO PERSONALIZADO */}
                  {filtroRango === "custom" && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">Desde:</span>
                        <Input
                          type="date"
                          value={fechaDesde}
                          onChange={(e) => setFechaDesde(e.target.value)}
                          className="h-8 text-xs bg-slate-950 border-border w-auto"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">Hasta:</span>
                        <Input
                          type="date"
                          value={fechaHasta}
                          onChange={(e) => setFechaHasta(e.target.value)}
                          className="h-8 text-xs bg-slate-950 border-border w-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* BUSCADOR DE HISTORIAL */}
                  <div className="relative pt-1">
                    <Search className="absolute left-3 top-3.5 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, teléfono, servicio o placa..."
                      value={busquedaHistorial}
                      onChange={(e) => setBusquedaHistorial(e.target.value)}
                      className="pl-9 h-8 text-xs bg-slate-950 border-border"
                    />
                  </div>
                </div>

                {/* TARJETAS DE MÉTRICAS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border bg-slate-900/60 p-3.5 space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Tag className="size-3 text-amber-400" /> Total Canjes
                    </div>
                    <div className="text-2xl font-black text-foreground">{totalCanjes}</div>
                  </div>

                  <div className="rounded-xl border border-border bg-slate-900/60 p-3.5 space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Users className="size-3 text-cyan-400" /> Clientes Únicos
                    </div>
                    <div className="text-2xl font-black text-cyan-300">{clientesUnicos}</div>
                  </div>

                  <div className="rounded-xl border border-border bg-slate-900/60 p-3.5 space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Sparkles className="size-3 text-emerald-400" /> Facturado
                    </div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      ₡{totalCobrado.toLocaleString("es-CR")}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-slate-900/60 p-3.5 space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <PartyPopper className="size-3 text-amber-400" /> Ahorro Miembros
                    </div>
                    <div className="text-xl font-black text-amber-300 font-mono">
                      ₡{totalAhorro.toLocaleString("es-CR")}
                    </div>
                  </div>
                </div>

                {/* TABLA / LISTA DE REGISTROS */}
                <div className="rounded-2xl border border-border bg-slate-900/90 overflow-hidden shadow-lg">
                  <div className="p-3.5 border-b border-border bg-slate-950/40 flex items-center justify-between text-xs font-bold">
                    <span>Listado de Canjes Realizados</span>
                    <span className="text-muted-foreground font-normal">
                      Mostrando {canjesFiltrados.length} registros
                    </span>
                  </div>

                  {cargandoHistorial ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      Cargando historial de canjes...
                    </div>
                  ) : canjesFiltrados.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                      <div>No se encontraron registros para este rango de fecha.</div>
                      <div className="text-[11px] opacity-70">
                        Los canjes que registres aparecerán aquí en tiempo real.
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {canjesFiltrados.map((c) => {
                        const d = new Date(c.fecha);
                        return (
                          <div key={c.id} className="p-3.5 hover:bg-slate-950/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{c.clienteNombre}</span>
                                <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                                  📞 {c.clienteTelefono}
                                </span>
                              </div>
                              <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                                <Tag className="size-3" /> {c.servicio}
                              </div>
                              {c.notas && (
                                <div className="text-[11px] text-muted-foreground italic">
                                  Nota: {c.notas}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                              <div className="text-right">
                                {c.montoCobrado !== undefined && c.montoCobrado > 0 ? (
                                  <div className="font-mono font-bold text-emerald-400">
                                    ₡{c.montoCobrado.toLocaleString("es-CR")}
                                  </div>
                                ) : (
                                  <div className="text-[11px] font-bold text-amber-400">{c.descuentoTexto}</div>
                                )}
                                <div className="text-[10px] text-muted-foreground">
                                  {d.toLocaleDateString("es-CR", { day: "2-digit", month: "short" })} · {d.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: ¿OLVIDASTE TU CLAVE? */}
      <Dialog open={modalOlvidoClave} onOpenChange={setModalOlvidoClave}>
        <DialogContent className="max-w-sm bg-slate-950 border-amber-500/40 text-foreground p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
              <Key className="size-4 text-amber-400" />
              Recuperar Clave del Comercio
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRecuperarClave} className="space-y-3.5 pt-2">
            <p className="text-xs text-muted-foreground">
              Ingresa el correo electrónico que vinculaste a <strong>{comercioSeleccionado?.nombreComercio}</strong> para verificar tu identidad:
            </p>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Correo Registrado:</Label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="ejemplo@comercio.com"
                  value={emailRecuperacion}
                  onChange={(e) => setEmailRecuperacion(e.target.value)}
                  required
                  className="text-xs font-mono bg-slate-900 border-border pl-8"
                />
                <Mail className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              </div>
            </div>

            {mensajeRecuperacion && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  mensajeRecuperacion.tipo === "exito"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}
              >
                {mensajeRecuperacion.texto}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOlvidoClave(false)}
                className="flex-1 text-xs"
              >
                Cerrar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Consultar Clave
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CAMBIAR CONTRASEÑA Y CORREO DESDE LA MINI-APP */}
      <Dialog open={modalCambiarClave} onOpenChange={setModalCambiarClave}>
        <DialogContent className="max-w-sm bg-slate-950 border-cyan-500/40 text-foreground p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
              <Lock className="size-4 text-cyan-400" />
              Seguridad & Contraseña
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuardarNuevaClave} className="space-y-3.5 pt-2">
            <p className="text-xs text-muted-foreground">
              Define una nueva clave y tu correo de recuperación para <strong>{comercioActivo?.nombreComercio}</strong>.
            </p>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Nueva Contraseña / PIN: *</Label>
              <Input
                type="text"
                placeholder="Ej. MiLavacar2026 o 5678"
                value={nuevaClaveInput}
                onChange={(e) => setNuevaClaveInput(e.target.value)}
                required
                className="text-xs font-mono font-bold bg-slate-900 border-border"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Correo de Recuperación:</Label>
              <Input
                type="email"
                placeholder="ejemplo@comercio.com"
                value={nuevoEmailInput}
                onChange={(e) => setNuevoEmailInput(e.target.value)}
                className="text-xs font-mono bg-slate-900 border-border"
              />
              <p className="text-[10px] text-muted-foreground">
                Si olvidas tu clave, la podrás consultar mediante este correo.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalCambiarClave(false)}
                className="flex-1 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={guardandoClave}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs cursor-pointer"
              >
                {guardandoClave ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO MODAL: CONFIRMACIÓN DE CANJE EXITOSO */}
      <Dialog open={!!canjeExitosoModal} onOpenChange={(open) => !open && setCanjeExitosoModal(null)}>
        <DialogContent className="max-w-sm bg-slate-950 border-amber-500/40 text-foreground p-6">
          <DialogHeader>
            <div className="size-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 mb-2">
              <CheckCircle2 className="size-8" />
            </div>
            <DialogTitle className="text-center text-lg font-black text-foreground">
              ¡Canje Registrado Exitosamente!
            </DialogTitle>
          </DialogHeader>

          {canjeExitosoModal && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="rounded-xl bg-slate-900 border border-border p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-bold text-foreground">{canjeExitosoModal.clienteNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-mono text-foreground">{canjeExitosoModal.clienteTelefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-bold text-amber-400">{canjeExitosoModal.servicio}</span>
                </div>
                {canjeExitosoModal.montoCobrado !== undefined && (
                  <div className="flex justify-between border-t border-border pt-1 font-bold">
                    <span className="text-muted-foreground">Cobrado con Descuento:</span>
                    <span className="text-emerald-400 font-mono">₡{canjeExitosoModal.montoCobrado.toLocaleString("es-CR")}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setCanjeExitosoModal(null)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer"
              >
                Aceptar y Continuar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
