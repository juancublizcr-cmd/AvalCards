import { useState, useEffect } from "react";
import {
  HeartHandshake,
  Building2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  Search,
  Filter,
  AlertTriangle,
  User,
  MapPin,
  Coins,
  Sparkles,
  Send,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  fetchCasosSociales,
  actualizarCasoSocial,
  eliminarCasoSocial,
  fetchPropuestasSponsors,
  actualizarPropuestaSponsor,
  eliminarPropuestaSponsor,
  type CasoSocial,
  type PropuestaSponsor,
  type EstadoCaso,
  type EstadoSponsor,
  type CategoriaCaso,
} from "@/lib/impacto-social-store";

const CATEGORIA_LABELS: Record<CategoriaCaso, { label: string; color: string }> = {
  adulto_mayor: { label: "Adulto Mayor", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  salud_cirugia: { label: "Salud y Cirugía", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  vivienda: { label: "Arreglo de Vivienda", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  madre_riesgo: { label: "Madre en Riesgo", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  otro: { label: "Comunidad / Otro", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
};

const ESTADO_CASO_LABELS: Record<EstadoCaso, { label: string; badge: string }> = {
  pendiente: { label: "Pendiente", badge: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  en_evaluacion: { label: "En Evaluación", badge: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  seleccionado: { label: "Seleccionado para Ayuda", badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  ayuda_entregada: { label: "Ayuda Entregada", badge: "bg-teal-500/15 text-teal-600 border-teal-500/30" },
  archivado: { label: "Archivado", badge: "bg-muted text-muted-foreground border-border" },
};

const ESTADO_SPONSOR_LABELS: Record<EstadoSponsor, { label: string; badge: string }> = {
  nueva: { label: "Nueva Propuesta", badge: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  en_contacto: { label: "En Negociación", badge: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  alianza_activa: { label: "Alianza Aprobada", badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  declinada: { label: "Declinada", badge: "bg-muted text-muted-foreground border-border" },
};

export function ImpactoSocialSection() {
  const [tabActiva, setTabActiva] = useState<"casos" | "sponsors">("casos");
  const [casos, setCasos] = useState<CasoSocial[]>([]);
  const [sponsors, setSponsors] = useState<PropuestaSponsor[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros casos
  const [busquedaCaso, setBusquedaCaso] = useState("");
  const [filtroEstadoCaso, setFiltroEstadoCaso] = useState<string>("todos");
  const [casoSeleccionado, setCasoSeleccionado] = useState<CasoSocial | null>(null);
  const [notasEdicionCaso, setNotasEdicionCaso] = useState("");

  // Filtros sponsors
  const [busquedaSponsor, setBusquedaSponsor] = useState("");
  const [filtroEstadoSponsor, setFiltroEstadoSponsor] = useState<string>("todos");
  const [sponsorSeleccionado, setSponsorSeleccionado] = useState<PropuestaSponsor | null>(null);
  const [notasEdicionSponsor, setNotasEdicionSponsor] = useState("");

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [c, s] = await Promise.all([fetchCasosSociales(), fetchPropuestasSponsors()]);
      setCasos(c);
      setSponsors(s);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando los datos de impacto social");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  // Manejo de Caso Social
  const handleCambiarEstadoCaso = async (id: string, nuevoEstado: EstadoCaso) => {
    await actualizarCasoSocial(id, { estado: nuevoEstado });
    setCasos((prev) => prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
    if (casoSeleccionado?.id === id) {
      setCasoSeleccionado((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
    }
    toast.success(`Estado actualizado a "${ESTADO_CASO_LABELS[nuevoEstado].label}"`);
  };

  const handleGuardarNotasCaso = async () => {
    if (!casoSeleccionado) return;
    await actualizarCasoSocial(casoSeleccionado.id, { notasAdmin: notasEdicionCaso });
    setCasos((prev) =>
      prev.map((c) => (c.id === casoSeleccionado.id ? { ...c, notasAdmin: notasEdicionCaso } : c))
    );
    setCasoSeleccionado((prev) => (prev ? { ...prev, notasAdmin: notasEdicionCaso } : null));
    toast.success("Notas internas guardadas");
  };

  const handleEliminarCaso = async (id: string) => {
    if (!confirm("¿Deseas eliminar este caso confidencial permanentemente?")) return;
    await eliminarCasoSocial(id);
    setCasos((prev) => prev.filter((c) => c.id !== id));
    if (casoSeleccionado?.id === id) setCasoSeleccionado(null);
    toast.success("Caso eliminado del registro");
  };

  // Manejo de Sponsor
  const handleCambiarEstadoSponsor = async (id: string, nuevoEstado: EstadoSponsor) => {
    await actualizarPropuestaSponsor(id, { estado: nuevoEstado });
    setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s)));
    if (sponsorSeleccionado?.id === id) {
      setSponsorSeleccionado((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
    }
    toast.success(`Estado de sponsor actualizado a "${ESTADO_SPONSOR_LABELS[nuevoEstado].label}"`);
  };

  const handleGuardarNotasSponsor = async () => {
    if (!sponsorSeleccionado) return;
    await actualizarPropuestaSponsor(sponsorSeleccionado.id, { notasAdmin: notasEdicionSponsor });
    setSponsors((prev) =>
      prev.map((s) => (s.id === sponsorSeleccionado.id ? { ...s, notasAdmin: notasEdicionSponsor } : s))
    );
    setSponsorSeleccionado((prev) => (prev ? { ...prev, notasAdmin: notasEdicionSponsor } : null));
    toast.success("Notas de propuesta de alianza guardadas");
  };

  const handleEliminarSponsor = async (id: string) => {
    if (!confirm("¿Deseas eliminar esta propuesta de sponsor?")) return;
    await eliminarPropuestaSponsor(id);
    setSponsors((prev) => prev.filter((s) => s.id !== id));
    if (sponsorSeleccionado?.id === id) setSponsorSeleccionado(null);
    toast.success("Propuesta eliminada");
  };

  // Contactar por WhatsApp
  const abrirWhatsApp = (telefono: string, nombre: string, tipo: "caso" | "sponsor") => {
    const limpio = telefono.replace(/\D/g, "");
    const cel = limpio.startsWith("506") ? limpio : `506${limpio}`;
    const mensaje =
      tipo === "caso"
        ? encodeURIComponent(
            `Hola ${nombre}, le saludamos de la Administración de Aval Community CR respecto al caso de bien social que nos presentó. Nos gustaría conocer más detalles.`
          )
        : encodeURIComponent(
            `Hola ${nombre}, le saludamos de la Dirección de Aval Community CR sobre su propuesta de alianza/patrocinio con nuestra comunidad. Nos encantaría coordinar una reunión.`
          );
    window.open(`https://wa.me/${cel}?text=${mensaje}`, "_blank");
  };

  // Filtrado de casos
  const casosFiltrados = casos.filter((c) => {
    const coincideTexto =
      c.titulo.toLowerCase().includes(busquedaCaso.toLowerCase()) ||
      c.beneficiarioNombre.toLowerCase().includes(busquedaCaso.toLowerCase()) ||
      c.postulanteNombre.toLowerCase().includes(busquedaCaso.toLowerCase()) ||
      c.provincia.toLowerCase().includes(busquedaCaso.toLowerCase()) ||
      c.id.toLowerCase().includes(busquedaCaso.toLowerCase());

    const coincideEstado = filtroEstadoCaso === "todos" || c.estado === filtroEstadoCaso;
    return coincideTexto && coincideEstado;
  });

  // Filtrado de sponsors
  const sponsorsFiltrados = sponsors.filter((s) => {
    const coincideTexto =
      s.empresa.toLowerCase().includes(busquedaSponsor.toLowerCase()) ||
      s.representante.toLowerCase().includes(busquedaSponsor.toLowerCase()) ||
      s.propuesta.toLowerCase().includes(busquedaSponsor.toLowerCase()) ||
      s.id.toLowerCase().includes(busquedaSponsor.toLowerCase());

    const coincideEstado = filtroEstadoSponsor === "todos" || s.estado === filtroEstadoSponsor;
    return coincideTexto && coincideEstado;
  });

  // Métricas
  const totalCasos = casos.length;
  const casosEnEvaluacion = casos.filter((c) => c.estado === "en_evaluacion").length;
  const casosSeleccionados = casos.filter((c) => c.estado === "seleccionado" || c.estado === "ayuda_entregada").length;
  const totalSponsors = sponsors.length;
  const sponsorsActivos = sponsors.filter((s) => s.estado === "alianza_activa").length;

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Impacto Social & Alianzas Estratégicas
            </h1>
            <Badge variant="outline" className="border-rose-500/40 text-rose-600 bg-rose-500/10 text-xs">
              <ShieldCheck className="size-3 mr-1" /> 100% Privado
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión confidencial de postulaciones de obras benéficas y convenios con empresas patrocinadoras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void cargarDatos()} className="gap-1.5">
            <RefreshCw className={`size-3.5 ${cargando ? "animate-spin" : ""}`} /> Refrescar
          </Button>
          <a
            href="/impacto-social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Ver Página Pública <Sparkles className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Aviso de Privacidad Estricta */}
      <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-700 dark:text-rose-300">
        <ShieldCheck className="size-5 shrink-0 text-rose-600 mt-0.5" />
        <div>
          <span className="font-semibold block">Protocolo de Privacidad y Dignidad Humana:</span>
          Los casos postulados por la comunidad son visibles <strong>únicamente en este panel de administración</strong>. Ningún nombre, fotografía o situación vulnerable se hace pública en la web sin consentimiento explícito y formal del beneficiario.
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Total Casos Recibidos</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">{totalCasos}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground">Postulaciones comunitarias</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">En Evaluación Activa</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-600">{casosEnEvaluacion}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground">Revisión de viabilidad</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Casos Apoyados / Aprobados</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">{casosSeleccionados}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground">Impacto social directo</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Sponsors & Aliados</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">{totalSponsors}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground">{sponsorsActivos} convenios activos</span>
          </CardContent>
        </Card>
      </div>

      {/* Selector de Pestañas Principales */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => {
            setTabActiva("casos");
            setCasoSeleccionado(null);
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tabActiva === "casos"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <HeartHandshake className="size-4" />
          Casos Sociales Confidenciales
          <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-foreground">
            {casos.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTabActiva("sponsors");
            setSponsorSeleccionado(null);
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tabActiva === "sponsors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-4" />
          Propuestas de Sponsors & Aliados
          <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-foreground">
            {sponsors.length}
          </span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* PESTAÑA 1: CASOS SOCIALES CONFIDENCIALES                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      {tabActiva === "casos" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Listado y Filtros (7 cols en lg) */}
          <div className={`${casoSeleccionado ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
            {/* Barra de Búsqueda y Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por beneficiario, postulante, cantón o ID..."
                  value={busquedaCaso}
                  onChange={(e) => setBusquedaCaso(e.target.value)}
                  className="pl-9 bg-card text-foreground border-border"
                />
              </div>
              <select
                aria-label="Filtrar por estado del caso"
                value={filtroEstadoCaso}
                onChange={(e) => setFiltroEstadoCaso(e.target.value)}
                className="h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_evaluacion">En Evaluación</option>
                <option value="seleccionado">Seleccionado para Ayuda</option>
                <option value="ayuda_entregada">Ayuda Entregada</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>

            {/* Listado de Casos */}
            {casosFiltrados.length === 0 ? (
              <Card className="border-border bg-card p-8 text-center text-muted-foreground">
                <HeartHandshake className="size-10 mx-auto mb-2 opacity-40" />
                <p className="font-medium text-foreground">No hay casos que coincidan con la búsqueda.</p>
                <p className="text-xs">Los casos ingresados desde el formulario público aparecerán aquí.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {casosFiltrados.map((caso) => {
                  const esActivo = casoSeleccionado?.id === caso.id;
                  const cat = CATEGORIA_LABELS[caso.categoria] || CATEGORIA_LABELS.otro;
                  const est = ESTADO_CASO_LABELS[caso.estado];

                  return (
                    <div
                      key={caso.id}
                      onClick={() => {
                        setCasoSeleccionado(caso);
                        setNotasEdicionCaso(caso.notasAdmin || "");
                      }}
                      className={`group relative rounded-xl border p-4 transition-all cursor-pointer bg-card ${
                        esActivo
                          ? "border-primary ring-2 ring-primary/20 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            {caso.id}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${cat.color}`}>
                            {cat.label}
                          </span>
                          {caso.urgencia === "alta" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 border border-rose-500/30">
                              Urgente
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${est.badge}`}>
                          {est.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                        {caso.titulo}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {caso.descripcion}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <User className="size-3 text-primary" /> Beneficiario: {caso.beneficiarioNombre}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground" /> {caso.provincia}{caso.canton ? `, ${caso.canton}` : ""}
                        </span>
                        {caso.presupuestoEstimado && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <Coins className="size-3" /> Est: {caso.presupuestoEstimado}
                          </span>
                        )}
                        <span className="ml-auto text-[11px]">
                          {new Date(caso.fecha).toLocaleDateString("es-CR", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panel Lateral de Detalle del Caso (5 cols en lg) */}
          {casoSeleccionado && (
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-border bg-card shadow-lg sticky top-20">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {casoSeleccionado.id}
                        </span>
                        <Badge variant="outline" className={ESTADO_CASO_LABELS[casoSeleccionado.estado].badge}>
                          {ESTADO_CASO_LABELS[casoSeleccionado.estado].label}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold mt-1 text-foreground">
                        {casoSeleccionado.titulo}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCasoSeleccionado(null)}
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-sm">
                  {/* Beneficiario y Postulante */}
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 border border-border">
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-muted-foreground block">
                        Beneficiario
                      </span>
                      <p className="font-bold text-foreground">{casoSeleccionado.beneficiarioNombre}</p>
                      {casoSeleccionado.beneficiarioEdad && (
                        <p className="text-xs text-muted-foreground">{casoSeleccionado.beneficiarioEdad}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-muted-foreground block">
                        Ubicación
                      </span>
                      <p className="font-medium text-foreground">
                        {casoSeleccionado.provincia}{casoSeleccionado.canton ? `, ${casoSeleccionado.canton}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Datos del Postulante & Contacto */}
                  <div className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase text-muted-foreground block">
                          Postulado por
                        </span>
                        <p className="font-bold text-foreground">
                          {casoSeleccionado.postulanteNombre}{" "}
                          <span className="font-normal text-xs text-muted-foreground">
                            ({casoSeleccionado.postulanteRelacion})
                          </span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          abrirWhatsApp(
                            casoSeleccionado.postulanteTelefono,
                            casoSeleccionado.postulanteNombre,
                            "caso"
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 h-8 text-xs font-semibold"
                      >
                        <MessageCircle className="size-3.5" /> WhatsApp Directo
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="size-3" /> Teléfono: {casoSeleccionado.postulanteTelefono}
                    </p>
                  </div>

                  {/* Descripción Completa */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Descripción de la Situación
                    </span>
                    <div className="rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-foreground whitespace-pre-line border border-border/50">
                      {casoSeleccionado.descripcion}
                    </div>
                  </div>

                  {casoSeleccionado.presupuestoEstimado && (
                    <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs">
                      <span className="font-semibold text-foreground">Presupuesto / Fondos Estimados:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {casoSeleccionado.presupuestoEstimado}
                      </span>
                    </div>
                  )}

                  {/* Selector de Estado */}
                  <div className="space-y-1.5 border-t border-border pt-3">
                    <span className="text-xs font-bold text-foreground block">
                      Actualizar Estado del Caso:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={casoSeleccionado.estado === "en_evaluacion" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoCaso(casoSeleccionado.id, "en_evaluacion")}
                        className="text-xs justify-start h-8"
                      >
                        <Clock className="size-3 mr-1.5" /> En Evaluación
                      </Button>
                      <Button
                        variant={casoSeleccionado.estado === "seleccionado" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoCaso(casoSeleccionado.id, "seleccionado")}
                        className="text-xs justify-start h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                      >
                        <CheckCircle2 className="size-3 mr-1.5" /> Seleccionar
                      </Button>
                      <Button
                        variant={casoSeleccionado.estado === "ayuda_entregada" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoCaso(casoSeleccionado.id, "ayuda_entregada")}
                        className="text-xs justify-start h-8 text-teal-600 hover:text-teal-700 hover:bg-teal-500/10"
                      >
                        <Sparkles className="size-3 mr-1.5" /> Ayuda Entregada
                      </Button>
                      <Button
                        variant={casoSeleccionado.estado === "archivado" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoCaso(casoSeleccionado.id, "archivado")}
                        className="text-xs justify-start h-8 text-muted-foreground"
                      >
                        <Archive className="size-3 mr-1.5" /> Archivar
                      </Button>
                    </div>
                  </div>

                  {/* Notas Administrativas Internas */}
                  <div className="space-y-2 border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        Bitácora y Notas Internas (Privado)
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleGuardarNotasCaso}
                        className="h-7 text-xs px-2.5"
                      >
                        Guardar Nota
                      </Button>
                    </div>
                    <Textarea
                      value={notasEdicionCaso}
                      onChange={(e) => setNotasEdicionCaso(e.target.value)}
                      placeholder="Escribe acuerdos, cotizaciones de ferretería, citas médicas o detalles internos..."
                      className="text-xs bg-background text-foreground border-border min-h-[80px]"
                    />
                  </div>

                  {/* Botón Eliminar Caso */}
                  <div className="border-t border-border pt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarCaso(casoSeleccionado.id)}
                      className="text-xs text-destructive hover:bg-destructive/10 h-7"
                    >
                      <Trash2 className="size-3 mr-1" /> Eliminar Registro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* PESTAÑA 2: PROPUESTAS DE SPONSORS & ALIADOS                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {tabActiva === "sponsors" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Listado de Sponsors (7 cols en lg) */}
          <div className={`${sponsorSeleccionado ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
            {/* Buscador y Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa, contacto o propuesta..."
                  value={busquedaSponsor}
                  onChange={(e) => setBusquedaSponsor(e.target.value)}
                  className="pl-9 bg-card text-foreground border-border"
                />
              </div>
              <select
                aria-label="Filtrar por estado del sponsor"
                value={filtroEstadoSponsor}
                onChange={(e) => setFiltroEstadoSponsor(e.target.value)}
                className="h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="todos">Todos los Estados</option>
                <option value="nueva">Nueva Propuesta</option>
                <option value="en_contacto">En Negociación</option>
                <option value="alianza_activa">Alianza Aprobada</option>
                <option value="declinada">Declinada</option>
              </select>
            </div>

            {/* Listado */}
            {sponsorsFiltrados.length === 0 ? (
              <Card className="border-border bg-card p-8 text-center text-muted-foreground">
                <Building2 className="size-10 mx-auto mb-2 opacity-40" />
                <p className="font-medium text-foreground">No hay propuestas de sponsors registradas.</p>
                <p className="text-xs">Las empresas interesadas pueden postularse desde la página de impacto social.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {sponsorsFiltrados.map((sp) => {
                  const esActivo = sponsorSeleccionado?.id === sp.id;
                  const est = ESTADO_SPONSOR_LABELS[sp.estado];

                  return (
                    <div
                      key={sp.id}
                      onClick={() => {
                        setSponsorSeleccionado(sp);
                        setNotasEdicionSponsor(sp.notasAdmin || "");
                      }}
                      className={`group relative rounded-xl border p-4 transition-all cursor-pointer bg-card ${
                        esActivo
                          ? "border-primary ring-2 ring-primary/20 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            {sp.id}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            {sp.tipoColaboracion.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${est.badge}`}>
                          {est.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <Building2 className="size-4 text-primary" /> {sp.empresa}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {sp.propuesta}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <User className="size-3 text-primary" /> {sp.representante} {sp.cargo ? `(${sp.cargo})` : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" /> {sp.telefono}
                        </span>
                        <span className="ml-auto text-[11px]">
                          {new Date(sp.fecha).toLocaleDateString("es-CR", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panel Lateral de Detalle del Sponsor (5 cols en lg) */}
          {sponsorSeleccionado && (
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-border bg-card shadow-lg sticky top-20">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {sponsorSeleccionado.id}
                        </span>
                        <Badge variant="outline" className={ESTADO_SPONSOR_LABELS[sponsorSeleccionado.estado].badge}>
                          {ESTADO_SPONSOR_LABELS[sponsorSeleccionado.estado].label}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold mt-1 text-foreground flex items-center gap-2">
                        <Building2 className="size-5 text-primary" /> {sponsorSeleccionado.empresa}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSponsorSeleccionado(null)}
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-sm">
                  {/* Representante y Contacto Directo */}
                  <div className="rounded-lg border border-border p-3 space-y-2.5 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase text-muted-foreground block">
                          Representante Corporativo
                        </span>
                        <p className="font-bold text-foreground">{sponsorSeleccionado.representante}</p>
                        {sponsorSeleccionado.cargo && (
                          <p className="text-xs text-muted-foreground">{sponsorSeleccionado.cargo}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          abrirWhatsApp(
                            sponsorSeleccionado.telefono,
                            sponsorSeleccionado.representante,
                            "sponsor"
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 h-8 text-xs font-semibold"
                      >
                        <MessageCircle className="size-3.5" /> WhatsApp
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border/60">
                      <p><strong>Tel:</strong> {sponsorSeleccionado.telefono}</p>
                      <p><strong>Email:</strong> {sponsorSeleccionado.email}</p>
                    </div>
                  </div>

                  {/* Propuesta de Alianza */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Cómo quieren colaborar:
                    </span>
                    <div className="rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-foreground whitespace-pre-line border border-border/50">
                      {sponsorSeleccionado.propuesta}
                    </div>
                  </div>

                  {/* Beneficio ofrecido a la comunidad */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                      Beneficio propuesto para la Comunidad Aval:
                    </span>
                    <div className="rounded-lg bg-primary/5 p-3 text-xs leading-relaxed text-foreground border border-primary/20">
                      {sponsorSeleccionado.beneficioComunidad}
                    </div>
                  </div>

                  {/* Selector de Estado Sponsor */}
                  <div className="space-y-1.5 border-t border-border pt-3">
                    <span className="text-xs font-bold text-foreground block">
                      Estado de la Alianza:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={sponsorSeleccionado.estado === "en_contacto" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoSponsor(sponsorSeleccionado.id, "en_contacto")}
                        className="text-xs justify-start h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10"
                      >
                        <Clock className="size-3 mr-1.5" /> En Contacto
                      </Button>
                      <Button
                        variant={sponsorSeleccionado.estado === "alianza_activa" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoSponsor(sponsorSeleccionado.id, "alianza_activa")}
                        className="text-xs justify-start h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                      >
                        <CheckCircle2 className="size-3 mr-1.5" /> Alianza Activa
                      </Button>
                      <Button
                        variant={sponsorSeleccionado.estado === "declinada" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCambiarEstadoSponsor(sponsorSeleccionado.id, "declinada")}
                        className="text-xs justify-start h-8 text-muted-foreground"
                      >
                        <Archive className="size-3 mr-1.5" /> Declinar
                      </Button>
                    </div>
                  </div>

                  {/* Notas Administrativas Internas */}
                  <div className="space-y-2 border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        Notas de Negociación y Convenio
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleGuardarNotasSponsor}
                        className="h-7 text-xs px-2.5"
                      >
                        Guardar Nota
                      </Button>
                    </div>
                    <Textarea
                      value={notasEdicionSponsor}
                      onChange={(e) => setNotasEdicionSponsor(e.target.value)}
                      placeholder="Registrar acuerdos de patrocinio, porcentajes de descuento, logo del sponsor..."
                      className="text-xs bg-background text-foreground border-border min-h-[80px]"
                    />
                  </div>

                  {/* Botón Eliminar */}
                  <div className="border-t border-border pt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarSponsor(sponsorSeleccionado.id)}
                      className="text-xs text-destructive hover:bg-destructive/10 h-7"
                    >
                      <Trash2 className="size-3 mr-1" /> Eliminar Propuesta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
