import { useEffect, useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  RefreshCw,
  Download,
  Trash2,
  LogIn,
  LogOut,
  CreditCard,
  UserCheck,
  Settings,
  SlidersHorizontal,
  Flame,
  FileText,
  Clock,
  User,
  Compass,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  fetchAuditLogs,
  limpiarLogsAuditoria,
  type AuditLog,
  type AuditAccion,
} from "@/lib/audit-logger";
import { getAdminSession } from "@/routes/login";

export function AuditoriaSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroUsuario, setFiltroUsuario] = useState<string>("todos");
  const [confirmandoLimpiar, setConfirmandoLimpiar] = useState(false);
  const [limpiando, setLimpiando] = useState(false);

  // Validación de seguridad de Superadmin
  const sesion = getAdminSession();
  const esSuper = Boolean(
    sesion?.esSuperadmin === true &&
    (sesion?.email?.toLowerCase() === "admin@avalmotors.cr" || !sesion?.email?.includes("avalcommunity.cr"))
  );

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch {
      toast.error("Error al cargar los registros de auditoría");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  // Lista única de usuarios para el filtro
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
  }, [logs, busqueda, filtroTipo, filtroUsuario]);

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
  const totalConfig = useMemo(
    () =>
      logs.filter(
        (l) =>
          l.accion === "EDITAR_CONFIG" ||
          l.accion === "EDITAR_TERMOMETRO" ||
          l.accion === "GUARDAR_SORTEO" ||
          l.accion === "CREAR_USUARIO"
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
      <div className="p-8 sm:p-12 text-center space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 max-w-xl mx-auto my-12">
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

  const renderBadgeAccion = (accion: AuditAccion) => {
    switch (accion) {
      case "LOGIN":
        return (
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 gap-1 font-bold text-[10px]">
            <LogIn className="size-3" /> INICIO DE SESIÓN
          </Badge>
        );
      case "LOGOUT":
        return (
          <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 gap-1 font-bold text-[10px]">
            <LogOut className="size-3" /> SALIDA / LOGOUT
          </Badge>
        );
      case "LOGIN_FALLIDO":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 gap-1 font-bold text-[10px]">
            <XCircle className="size-3" /> ACCESO FALLIDO
          </Badge>
        );
      case "ACCESO_SECCION":
        return (
          <Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 gap-1 font-bold text-[10px]">
            <Compass className="size-3" /> NAVEGÓ A SECCIÓN
          </Badge>
        );
      case "APROBAR_ORDEN":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 font-bold text-[10px]">
            <CheckCircle2 className="size-3" /> PAGO APROBADO
          </Badge>
        );
      case "RECHAZAR_ORDEN":
        return (
          <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 gap-1 font-bold text-[10px]">
            <XCircle className="size-3" /> PAGO RECHAZADO
          </Badge>
        );
      case "EDITAR_TERMOMETRO":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 font-bold text-[10px]">
            <Flame className="size-3" /> TERMÓMETRO
          </Badge>
        );
      case "EDITAR_CONFIG":
      case "GUARDAR_SORTEO":
      case "EDITAR_PREMIO":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 font-bold text-[10px]">
            <Settings className="size-3" /> CONFIGURACIÓN
          </Badge>
        );
      case "CREAR_USUARIO":
      case "EDITAR_USUARIO":
      case "ELIMINAR_USUARIO":
      case "CAMBIO_CLAVE":
        return (
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 gap-1 font-bold text-[10px]">
            <UserCheck className="size-3" /> ROLES / ACCESOS
          </Badge>
        );
      case "ARCHIVAR_EDICION":
        return (
          <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30 gap-1 font-bold text-[10px]">
            <RefreshCw className="size-3" /> NUEVA EDICIÓN
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] gap-1 font-bold">
            <Clock className="size-3" /> ACCIÓN
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Cabecera Principal con Colores Nítidos y Contrastados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <ShieldAlert className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              Auditoría del Sistema & Registro de Actividad
              <Badge className="bg-amber-500 text-black border-amber-400 text-[10px] font-black">
                SUPERADMIN EXCLUSIVO
              </Badge>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Supervisión exhaustiva en tiempo real: entérate de quién ingresó, a qué secciones entró y qué acciones realizó en la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={cargarDatos}
            disabled={cargando}
            className="gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`size-3.5 ${cargando ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportarCSV}
            className="gap-1.5 text-xs font-bold"
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

      {/* Tarjetas KPI de Resumen Adaptadas al Tema Claro y Oscuro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
            <span>Total Acciones</span>
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-black text-foreground">{logs.length}</div>
          <div className="text-[10px] text-muted-foreground">Eventos auditados guardados</div>
        </div>

        <div className="p-4 rounded-2xl border border-sky-500/25 bg-sky-500/5 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase flex items-center justify-between">
            <span>Inicios de Sesión</span>
            <LogIn className="size-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-300">{totalLogins}</div>
          <div className="text-[10px] text-sky-600/70 dark:text-sky-400/70">Accesos autorizados al panel</div>
        </div>

        <div className="p-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center justify-between">
            <span>Navegación / Vistas</span>
            <Compass className="size-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">{totalNavegacion}</div>
          <div className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70">Secciones visitadas</div>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center justify-between">
            <span>Pagos Evaluados</span>
            <CreditCard className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{totalPagos}</div>
          <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Aprobaciones y rechazos</div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda con fondo claro adaptativo */}
      <div className="p-3 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por usuario, correo, sección u orden..."
            className="pl-9 bg-background border-border text-xs sm:text-sm h-10 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro por Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer"
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
            className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:border-primary max-w-[220px] cursor-pointer"
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

      {/* Lista de Registros de Auditoría - Con fondo Card limpio y legible */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        {cargando ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="size-8 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Cargando registros de auditoría...</p>
          </div>
        ) : logsFiltrados.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ShieldCheck className="size-10 mx-auto text-muted-foreground" />
            <h4 className="text-base font-bold text-foreground">No hay registros de auditoría</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {busqueda || filtroTipo !== "todos" || filtroUsuario !== "todos"
                ? "Ningún evento coincide con los filtros seleccionados."
                : "Aún no se han registrado acciones o la base de datos se encuentra limpia."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logsFiltrados.map((log) => {
              const esSubadmin = !log.esSuperadmin || log.usuarioEmail.includes("avalcommunity.cr");

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  {/* Lado izquierdo: Usuario e Icono */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`mt-0.5 size-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      esSubadmin
                        ? "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400"
                        : "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400"
                    }`}>
                      {esSubadmin ? (
                        <User className="size-5" />
                      ) : (
                        <ShieldAlert className="size-5" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {renderBadgeAccion(log.accion)}

                        <span className="font-bold text-sm text-foreground">
                          {log.titulo}
                        </span>

                        {log.seccion && (
                          <span className="text-[10px] font-mono text-muted-foreground uppercase px-2 py-0.5 rounded-md bg-secondary border border-border">
                            SECCIÓN: {log.seccion}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed break-words font-medium">
                        {log.detalles}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                        <span className="font-bold text-foreground">
                          {log.usuarioNombre}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-xs">{log.usuarioEmail}</span>
                        <span>•</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            esSubadmin
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
                              : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {esSubadmin ? "Sub-administrador" : "Super Administrador"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lado derecho: Fecha y Hora */}
                  <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0 space-y-0.5 pl-13 sm:pl-0">
                    <div className="text-xs font-mono font-bold text-foreground">
                      {log.horaFormateada}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {log.fechaFormateada}
                    </div>
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
