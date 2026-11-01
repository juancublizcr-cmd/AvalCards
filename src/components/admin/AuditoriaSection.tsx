import { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  LogIn,
  LogOut,
  UserCheck,
  CreditCard,
  Flame,
  Settings,
  Compass,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  User,
  Activity,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  obtenerLogsAuditoria,
  limpiarLogsAuditoria,
  type AuditLogEntry,
  type AuditAccion,
} from "@/lib/audit-logger";
import { getAdminSession } from "@/routes/login";

export function AuditoriaSection() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [cargando, setCargando] = useState(true);
  const [limpiando, setLimpiando] = useState(false);
  const [confirmandoLimpiar, setConfirmandoLimpiar] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroUsuario, setFiltroUsuario] = useState<string>("todos");
  const [ocultarNavegacion, setOcultarNavegacion] = useState(false);

  const sesion = getAdminSession();
  const esSuper =
    sesion?.esSuperadmin === true &&
    (sesion.email?.toLowerCase() === "admin@avalmotors.cr" ||
      sesion.email?.toLowerCase().includes("avalmotors.cr"));

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const datos = await obtenerLogsAuditoria();
      setLogs(datos);
    } catch {
      toast.error("Error al cargar la bitácora de auditoría");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (esSuper) {
      void cargarDatos();
    }
  }, [esSuper]);

  // Lista de usuarios únicos detectados en los logs
  const usuariosUnicos = useMemo(() => {
    const map = new Map<string, { email: string; nombre: string; esSuper: boolean }>();
    logs.forEach((l) => {
      if (l.usuarioEmail && !map.has(l.usuarioEmail)) {
        map.set(l.usuarioEmail, {
          email: l.usuarioEmail,
          nombre: l.usuarioNombre || l.usuarioEmail,
          esSuper: l.esSuperadmin,
        });
      }
    });
    return Array.from(map.values());
  }, [logs]);

  // Filtrado de logs
  const logsFiltrados = useMemo(() => {
    return logs.filter((l) => {
      // Filtro navegación rápida
      if (ocultarNavegacion && l.accion === "ACCESO_SECCION") {
        return false;
      }

      // Filtro texto
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const coincide =
          l.titulo.toLowerCase().includes(q) ||
          l.detalles.toLowerCase().includes(q) ||
          l.usuarioNombre.toLowerCase().includes(q) ||
          l.usuarioEmail.toLowerCase().includes(q) ||
          (l.seccion && l.seccion.toLowerCase().includes(q));
        if (!coincide) return false;
      }

      // Filtro usuario
      if (filtroUsuario !== "todos" && l.usuarioEmail !== filtroUsuario) {
        return false;
      }

      // Filtro tipo
      if (filtroTipo === "login") {
        return l.accion === "LOGIN" || l.accion === "LOGOUT" || l.accion === "LOGIN_FALLIDO";
      }
      if (filtroTipo === "navegacion") {
        return l.accion === "ACCESO_SECCION";
      }
      if (filtroTipo === "pagos") {
        return l.accion === "APROBAR_ORDEN" || l.accion === "RECHAZAR_ORDEN";
      }
      if (filtroTipo === "usuarios") {
        return (
          l.accion === "CREAR_USUARIO" ||
          l.accion === "EDITAR_USUARIO" ||
          l.accion === "ELIMINAR_USUARIO" ||
          l.accion === "CAMBIO_CLAVE"
        );
      }
      if (filtroTipo === "config") {
        return (
          l.accion === "EDITAR_CONFIG" ||
          l.accion === "EDITAR_TERMOMETRO" ||
          l.accion === "GUARDAR_SORTEO" ||
          l.accion === "ARCHIVAR_EDICION" ||
          l.accion === "EDITAR_PREMIO"
        );
      }

      return true;
    });
  }, [logs, busqueda, filtroTipo, filtroUsuario, ocultarNavegacion]);

  // Métricas rápidas
  const totalLogins = useMemo(
    () => logs.filter((l) => l.accion === "LOGIN").length,
    [logs]
  );
  const totalNavegacion = useMemo(
    () => logs.filter((l) => l.accion === "ACCESO_SECCION").length,
    [logs]
  );
  const totalPagos = useMemo(
    () => logs.filter((l) => l.accion === "APROBAR_ORDEN" || l.accion === "RECHAZAR_ORDEN").length,
    [logs]
  );
  const totalModificaciones = useMemo(
    () =>
      logs.filter(
        (l) =>
          l.accion === "EDITAR_CONFIG" ||
          l.accion === "EDITAR_TERMOMETRO" ||
          l.accion === "GUARDAR_SORTEO" ||
          l.accion === "CREAR_USUARIO" ||
          l.accion === "EDITAR_USUARIO" ||
          l.accion === "APROBAR_ORDEN" ||
          l.accion === "RECHAZAR_ORDEN"
      ).length,
    [logs]
  );

  const exportarCSV = () => {
    if (logsFiltrados.length === 0) {
      toast.info("No hay registros para exportar");
      return;
    }

    const cabeceras = ["Fecha", "Hora", "Usuario", "Correo", "Rol", "Accion", "Titulo", "Detalles", "Seccion"];
    const filas = logsFiltrados.map((l) => [
      `"${l.fechaFormateada || ""}"`,
      `"${l.horaFormateada || ""}"`,
      `"${(l.usuarioNombre || "").replace(/"/g, '""')}"`,
      `"${l.usuarioEmail || ""}"`,
      `"${l.esSuperadmin ? "Superadmin" : "Subadmin"}"`,
      `"${l.accion}"`,
      `"${(l.titulo || "").replace(/"/g, '""')}"`,
      `"${(l.detalles || "").replace(/"/g, '""')}"`,
      `"${l.seccion || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [cabeceras.join(","), ...filas.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `auditoria_aval_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Informe de auditoría exportado correctamente");
  };

  const ejecutarLimpieza = async () => {
    setLimpiando(true);
    try {
      await limpiarLogsAuditoria();
      setLogs([]);
      setConfirmandoLimpiar(false);
      toast.success("Registro histórico de auditoría vaciado correctamente");
    } catch {
      toast.error("Error al limpiar los registros de auditoría");
    } finally {
      setLimpiando(false);
    }
  };

  if (!esSuper) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4 rounded-2xl border border-destructive/40 bg-destructive/5 max-w-xl mx-auto my-12">
        <div className="size-14 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
          <ShieldAlert className="size-7" />
        </div>
        <h3 className="text-xl font-black text-foreground">Acceso Denegado (Superadmin Exclusivo)</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Esta sección contiene el registro confidencial de auditoría y seguridad. Solo el Super Administrador (<strong className="text-primary">admin@avalmotors.cr</strong>) tiene autorización para visualizar quién ingresó y qué acciones se ejecutaron.
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          Tu cuenta: {sesion?.nombre} ({sesion?.email}) • Rol: Sub-administrador
        </p>
      </div>
    );
  }

  // Renderizador con alto contraste y colores definidos sin importar el tema
  const renderBadgeAccion = (accion: AuditAccion) => {
    switch (accion) {
      case "LOGIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700 shadow-2xs">
            <LogIn className="size-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" /> INICIO DE SESIÓN
          </span>
        );
      case "LOGOUT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-slate-200 text-slate-900 border border-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 shadow-2xs">
            <LogOut className="size-3.5 text-slate-700 dark:text-slate-300 shrink-0" /> SALIDA / LOGOUT
          </span>
        );
      case "LOGIN_FALLIDO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-950 border border-rose-400 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700 shadow-2xs">
            <XCircle className="size-3.5 text-rose-700 dark:text-rose-300 shrink-0" /> ACCESO FALLIDO
          </span>
        );
      case "ACCESO_SECCION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-950 border border-blue-400 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700 shadow-2xs">
            <Compass className="size-3.5 text-blue-700 dark:text-blue-300 shrink-0" /> NAVEGÓ A SECCIÓN
          </span>
        );
      case "APROBAR_ORDEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-green-100 text-green-950 border border-green-500 dark:bg-green-950/80 dark:text-green-200 dark:border-green-700 shadow-2xs">
            <CheckCircle2 className="size-3.5 text-green-700 dark:text-green-300 shrink-0" /> PAGO APROBADO
          </span>
        );
      case "RECHAZAR_ORDEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-red-100 text-red-950 border border-red-500 dark:bg-red-950/80 dark:text-red-200 dark:border-red-700 shadow-2xs">
            <XCircle className="size-3.5 text-red-700 dark:text-red-300 shrink-0" /> PAGO RECHAZADO
          </span>
        );
      case "EDITAR_TERMOMETRO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-950 border border-amber-400 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700 shadow-2xs">
            <Flame className="size-3.5 text-amber-700 dark:text-amber-300 shrink-0" /> TERMÓMETRO
          </span>
        );
      case "EDITAR_CONFIG":
      case "GUARDAR_SORTEO":
      case "EDITAR_PREMIO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-orange-100 text-orange-950 border border-orange-400 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-700 shadow-2xs">
            <Settings className="size-3.5 text-orange-700 dark:text-orange-300 shrink-0" /> CONFIGURACIÓN
          </span>
        );
      case "CREAR_USUARIO":
      case "EDITAR_USUARIO":
      case "ELIMINAR_USUARIO":
      case "CAMBIO_CLAVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-purple-100 text-purple-950 border border-purple-400 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-700 shadow-2xs">
            <UserCheck className="size-3.5 text-purple-700 dark:text-purple-300 shrink-0" /> ROLES / ACCESOS
          </span>
        );
      case "ARCHIVAR_EDICION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-950 border border-amber-400 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700 shadow-2xs">
            <RefreshCw className="size-3.5 text-amber-700 dark:text-amber-300 shrink-0" /> NUEVA EDICIÓN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-zinc-200 text-zinc-900 border border-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-2xs">
            <Clock className="size-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" /> ACCIÓN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="size-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-md">
              <Activity className="size-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                Auditoría del Sistema & Registro en Tiempo Real
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-zinc-950 border border-amber-400 tracking-wider">
                  SUPERADMIN EXCLUSIVO
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Supervisión de cada usuario: qué secciones abrió, qué pagos aprobó o rechazó y qué configuraciones editó.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={cargarDatos}
            disabled={cargando}
            className="gap-1.5 text-xs font-bold border-border shadow-xs hover:bg-muted"
          >
            <RefreshCw className={`size-3.5 ${cargando ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportarCSV}
            className="gap-1.5 text-xs font-bold border-border shadow-xs hover:bg-muted"
          >
            <Download className="size-3.5" />
            Descargar CSV
          </Button>

          {!confirmandoLimpiar ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmandoLimpiar(true)}
              className="gap-1.5 text-xs font-bold"
            >
              <Trash2 className="size-3.5" />
              Limpiar
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 animate-in fade-in">
              <Button
                variant="destructive"
                size="sm"
                onClick={ejecutarLimpieza}
                disabled={limpiando}
                className="text-xs font-bold"
              >
                {limpiando ? "Limpiando..." : "Confirmar Vaciar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmandoLimpiar(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas KPI de Resumen con Alto Contraste */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border-2 border-slate-300 dark:border-zinc-700 bg-card shadow-sm space-y-1">
          <div className="text-[11px] font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span>Total Acciones</span>
            <FileText className="size-4 text-slate-600 dark:text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-foreground">{logs.length}</div>
          <div className="text-[11px] text-muted-foreground font-medium">Eventos auditados</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center justify-between">
            <span>Inicios de Sesión</span>
            <LogIn className="size-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-950 dark:text-emerald-200">{totalLogins}</div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">Accesos autorizados</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/30 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center justify-between">
            <span>Navegación / Vistas</span>
            <Compass className="size-4 text-blue-700 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-950 dark:text-blue-200">{totalNavegacion}</div>
          <div className="text-[11px] text-blue-800 dark:text-blue-400 font-medium">Secciones visitadas</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 shadow-sm space-y-1">
          <div className="text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center justify-between">
            <span>Operaciones Clave</span>
            <Flame className="size-4 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-200">{totalModificaciones}</div>
          <div className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">Pagos y configuraciones</div>
        </div>
      </div>

      {/* Barra de Filtros y Botones de Acceso Rápido */}
      <div className="p-4 rounded-xl border-2 border-border bg-card shadow-sm space-y-3">
        {/* Fila 1: Botones Rápidos de Filtrado */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black uppercase text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="size-3.5" /> Filtrar:
          </span>

          <button
            type="button"
            onClick={() => {
              setFiltroUsuario("todos");
              setFiltroTipo("todos");
              setOcultarNavegacion(false);
              setBusqueda("");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border ${
              filtroUsuario === "todos" && filtroTipo === "todos" && !ocultarNavegacion && !busqueda
                ? "bg-foreground text-background border-foreground shadow-xs"
                : "bg-muted text-foreground border-border hover:bg-muted/80"
            }`}
          >
            Ver Todo ({logs.length})
          </button>

          {/* Botón rápido para filtrar solo el subadmin */}
          <button
            type="button"
            onClick={() => {
              setFiltroUsuario("admin@avalcommunity.cr");
              setFiltroTipo("todos");
              setOcultarNavegacion(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border flex items-center gap-1.5 ${
              filtroUsuario === "admin@avalcommunity.cr"
                ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                : "bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700 hover:bg-blue-200/80"
            }`}
          >
            <User className="size-3.5" />
            Solo Operador (admin@avalcommunity.cr)
          </button>

          {/* Botón rápido para filtrar Superadmin */}
          <button
            type="button"
            onClick={() => {
              setFiltroUsuario("admin@avalmotors.cr");
              setFiltroTipo("todos");
              setOcultarNavegacion(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border flex items-center gap-1.5 ${
              filtroUsuario === "admin@avalmotors.cr"
                ? "bg-amber-500 text-zinc-950 border-amber-600 shadow-xs"
                : "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700 hover:bg-amber-200/80"
            }`}
          >
            <ShieldAlert className="size-3.5" />
            Solo Superadmin
          </button>

          {/* Toggle para ocultar navegación y ver solo acciones críticas */}
          <button
            type="button"
            onClick={() => setOcultarNavegacion(!ocultarNavegacion)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border flex items-center gap-1.5 ${
              ocultarNavegacion
                ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                : "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700 hover:bg-emerald-200/80"
            }`}
          >
            <Flame className="size-3.5" />
            {ocultarNavegacion ? "✓ Ocultando Navegación (Solo Acciones)" : "Ocultar Navegación"}
          </button>
        </div>

        {/* Fila 2: Búsqueda y Selects */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 border-t border-border/60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por usuario, correo, sección o detalle..."
              className="pl-9 bg-background border-border text-xs sm:text-sm h-10 text-foreground font-medium placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro por Tipo */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="h-10 rounded-lg border-2 border-border bg-background px-3 text-xs font-black text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="todos">Todas las Acciones</option>
              <option value="navegacion">Navegación a Secciones</option>
              <option value="login">Inicios & Cierres de Sesión</option>
              <option value="pagos">Pagos (Aprobados / Rechazados)</option>
              <option value="config">Configuración & Termómetro</option>
              <option value="usuarios">Usuarios & Contraseñas</option>
            </select>

            {/* Filtro por Usuario */}
            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="h-10 rounded-lg border-2 border-border bg-background px-3 text-xs font-black text-foreground focus:outline-none focus:border-primary max-w-[240px] cursor-pointer"
            >
              <option value="todos">Todos los Usuarios</option>
              {usuariosUnicos.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.nombre} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Registros con Diseño Ultra-Legible y de Alto Contraste */}
      <div className="space-y-3">
        {cargando ? (
          <div className="py-20 text-center space-y-3 rounded-2xl border-2 border-border bg-card">
            <RefreshCw className="size-8 animate-spin mx-auto text-primary" />
            <p className="text-sm font-bold text-foreground">Cargando registros de auditoría...</p>
          </div>
        ) : logsFiltrados.length === 0 ? (
          <div className="py-20 text-center space-y-3 rounded-2xl border-2 border-dashed border-border bg-card p-6">
            <ShieldCheck className="size-12 mx-auto text-muted-foreground" />
            <h4 className="text-lg font-black text-foreground">No hay registros de auditoría</h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              {busqueda || filtroTipo !== "todos" || filtroUsuario !== "todos" || ocultarNavegacion
                ? "Ningún evento coincide con los filtros aplicados. Haz clic en 'Ver Todo' para restablecer."
                : "Aún no se han registrado eventos en la base de datos."}
            </p>
            {(busqueda || filtroTipo !== "todos" || filtroUsuario !== "todos" || ocultarNavegacion) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBusqueda("");
                  setFiltroTipo("todos");
                  setFiltroUsuario("todos");
                  setOcultarNavegacion(false);
                }}
                className="mt-2 font-black text-xs"
              >
                Restablecer Filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {logsFiltrados.map((log) => {
              const esSubadmin = !log.esSuperadmin || log.usuarioEmail.includes("avalcommunity.cr");

              return (
                <div
                  key={log.id}
                  className={`rounded-xl border-2 p-3.5 sm:p-4 transition-all shadow-xs ${
                    esSubadmin
                      ? "bg-card border-blue-300/80 dark:border-blue-900/60 hover:border-blue-500"
                      : "bg-card border-amber-300/80 dark:border-amber-900/60 hover:border-amber-500"
                  }`}
                >
                  {/* Fila Superior: Datos del Usuario + Fecha & Hora */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/70">
                    {/* Usuario */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-xs ${
                          esSubadmin ? "bg-blue-600" : "bg-amber-600"
                        }`}
                      >
                        {esSubadmin ? <User className="size-4" /> : <ShieldAlert className="size-4" />}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-foreground">
                          {log.usuarioNombre || log.usuarioEmail}
                        </span>

                        <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                          {log.usuarioEmail}
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border tracking-wide shadow-2xs ${
                            esSubadmin
                              ? "bg-blue-100 text-blue-950 border-blue-400 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700"
                              : "bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700"
                          }`}
                        >
                          {esSubadmin ? "Sub-administrador" : "Super Administrador"}
                        </span>
                      </div>
                    </div>

                    {/* Fecha y Hora en Formato Nítido */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-foreground bg-secondary px-2.5 py-1 rounded-md border border-border">
                        <Clock className="size-3 text-muted-foreground" />
                        {log.horaFormateada}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
                        <Calendar className="size-3 text-muted-foreground" />
                        {log.fechaFormateada}
                      </span>
                    </div>
                  </div>

                  {/* Fila Inferior: Qué Hizo + Detalles Claros */}
                  <div className="pt-2.5 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {renderBadgeAccion(log.accion)}

                      <span className="font-black text-sm sm:text-base text-foreground tracking-tight">
                        {log.titulo}
                      </span>

                      {log.seccion && (
                        <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                          SECCIÓN: {log.seccion}
                        </span>
                      )}
                    </div>

                    {log.detalles && log.detalles !== log.titulo && (
                      <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal pl-2 border-l-2 border-border/80">
                        {log.detalles}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
