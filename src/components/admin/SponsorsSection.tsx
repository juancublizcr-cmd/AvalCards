import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  MessageSquare,
  Percent,
  Plus,
  Power,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CATEGORIAS_SPONSOR_DEFAULT,
  CATEGORIAS_SPONSOR_LABELS,
  fetchSponsors,
  fetchSolicitudesSponsors,
  fetchCategoriasSponsors,
  crearCategoriaSponsor,
  eliminarCategoriaSponsor,
  upsertSponsor,
  deleteSponsor,
  actualizarEstadoSolicitudSponsor,
  type ComercioSponsor,
  type SolicitudAfiliacionSponsor,
  type CategoriaSponsor,
  type CategoriaItem,
} from "@/lib/sponsors-store";

export function SponsorsSection() {
  const [tab, setTab] = useState<"comercios" | "solicitudes">("comercios");
  const [sponsors, setSponsors] = useState<ComercioSponsor[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudAfiliacionSponsor[]>([]);
  const [categorias, setCategorias] = useState<CategoriaItem[]>(CATEGORIAS_SPONSOR_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [imagenGrande, setImagenGrande] = useState<{ url: string; titulo: string; categoria: string } | null>(null);

  // Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sponsorEditando, setSponsorEditando] = useState<ComercioSponsor | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Modal Gestión de Categorías
  const [modalCategoriasAbierto, setModalCategoriasAbierto] = useState(false);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  const [nuevaCatIcono, setNuevaCatIcono] = useState("🏷️");
  const [guardandoCat, setGuardandoCat] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [sps, sols, cats] = await Promise.all([
        fetchSponsors(),
        fetchSolicitudesSponsors(),
        fetchCategoriasSponsors(),
      ]);
      setSponsors(sps);
      setSolicitudes(sols);
      setCategorias(cats);
    } catch {
      toast.error("Error al cargar datos de sponsors");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const getCatInfo = (catId: string) => {
    const found = categorias.find((c) => c.id === catId);
    if (found) return found;
    if (CATEGORIAS_SPONSOR_LABELS[catId]) {
      return { id: catId, label: CATEGORIAS_SPONSOR_LABELS[catId].label, icono: CATEGORIAS_SPONSOR_LABELS[catId].icono };
    }
    return { id: catId, label: catId, icono: "🏬" };
  };

  const handleCrearCategoria = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nuevaCatNombre.trim()) {
      toast.error("Ingresa el nombre de la categoría");
      return;
    }

    setGuardandoCat(true);
    try {
      const updatedCats = await crearCategoriaSponsor(nuevaCatNombre, nuevaCatIcono || "🏷️");
      setCategorias(updatedCats);
      const nuevaSlug = updatedCats[updatedCats.length - 1]?.id;

      // Si estábamos editando un sponsor, asignarle la nueva categoría
      if (sponsorEditando && nuevaSlug) {
        setSponsorEditando({ ...sponsorEditando, categoria: nuevaSlug });
      }

      toast.success(`Categoría "${nuevaCatNombre}" creada y guardada en la base de datos`);
      setNuevaCatNombre("");
      setNuevaCatIcono("🏷️");
      setModalCategoriasAbierto(false);
    } catch {
      toast.error("Error al crear la categoría");
    } finally {
      setGuardandoCat(false);
    }
  };

  const handleEliminarCategoria = async (catId: string, nombre: string) => {
    if (CATEGORIAS_SPONSOR_DEFAULT.some((c) => c.id === catId)) {
      toast.error("Esta es una categoría estándar del sistema");
      return;
    }
    if (!confirm(`¿Deseas eliminar la categoría "${nombre}"?`)) return;

    try {
      const updatedCats = await eliminarCategoriaSponsor(catId);
      setCategorias(updatedCats);
      toast.success("Categoría eliminada de la base de datos");
    } catch {
      toast.error("Error al eliminar la categoría");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && sponsorEditando) {
        setSponsorEditando({ ...sponsorEditando, logoUrl: base64 });
        toast.success("Imagen adjuntada y convertida a Base64");
      }
    };
    reader.onerror = () => {
      toast.error("Error al leer el archivo de imagen");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (sponsorEditando) {
      setSponsorEditando({ ...sponsorEditando, logoUrl: "" });
      toast.info("Imagen removida");
    }
  };

  const abrirNuevoSponsor = () => {
    setSponsorEditando({
      id: `SP-${Date.now().toString().slice(-4)}`,
      nombreComercio: "",
      categoria: "talleres_mecanica",
      descuentoTexto: "",
      descuentoPorcentaje: 15,
      descripcion: "",
      condiciones: "Válido mostrando tus Tokens activos o comprobante de compra.",
      logoUrl: "",
      telefonoWhatsapp: "",
      provincia: "San José",
      canton: "",
      direccionFisica: "",
      enlaceRedes: "",
      activo: true,
      destacado: false,
      orden: sponsors.length + 1,
    });
    setModalAbierto(true);
  };

  const abrirEditarSponsor = (s: ComercioSponsor) => {
    setSponsorEditando({ ...s });
    setModalAbierto(true);
  };

  const guardarSponsorModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorEditando) return;
    if (!sponsorEditando.nombreComercio.trim()) {
      toast.error("El nombre del comercio es requerido");
      return;
    }
    if (!sponsorEditando.descuentoTexto.trim()) {
      toast.error("El texto del descuento o promoción es requerido");
      return;
    }

    setGuardando(true);
    try {
      const toSave = { ...sponsorEditando, canton: "" };
      const updated = await upsertSponsor(toSave);
      setSponsors(updated);
      toast.success("Comercio aliado guardado exitosamente");
      setModalAbierto(false);
      setSponsorEditando(null);
    } catch {
      toast.error("Error al guardar sponsor");
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (s: ComercioSponsor) => {
    const updatedS = { ...s, activo: !s.activo };
    const res = await upsertSponsor(updatedS);
    setSponsors(res);
    toast.success(
      updatedS.activo
        ? `Comercio "${s.nombreComercio}" activado`
        : `Comercio "${s.nombreComercio}" pausado`
    );
  };

  const toggleDestacado = async (s: ComercioSponsor) => {
    const updatedS = { ...s, destacado: !s.destacado };
    const res = await upsertSponsor(updatedS);
    setSponsors(res);
    toast.success(
      updatedS.destacado
        ? `"${s.nombreComercio}" marcado como Destacado ⭐`
        : `"${s.nombreComercio}" desmarcado de Destacados`
    );
  };

  const eliminarSponsorConfirm = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar al comercio "${nombre}" del catálogo de sponsors?`)) return;
    try {
      const res = await deleteSponsor(id);
      setSponsors(res);
      toast.success("Comercio eliminado del catálogo");
    } catch {
      toast.error("Error al eliminar sponsor");
    }
  };

  const cambiarEstadoSolicitud = async (
    id: string,
    estado: SolicitudAfiliacionSponsor["estado"]
  ) => {
    const res = await actualizarEstadoSolicitudSponsor(id, estado);
    setSolicitudes(res);
    toast.success(`Solicitud actualizada a: ${estado.toUpperCase()}`);
  };

  // Convertir solicitud aprobada en un comercio oficial
  const convertirSolicitudEnSponsor = (sol: SolicitudAfiliacionSponsor) => {
    setSponsorEditando({
      id: `SP-${Date.now().toString().slice(-4)}`,
      nombreComercio: sol.nombreEmpresa,
      categoria: sol.categoria,
      descuentoTexto: sol.propuestaDescuento,
      descuentoPorcentaje: 15,
      descripcion: sol.beneficioComunidad || "Comercio aliado oficial de Aval Community CR.",
      condiciones: "Válido mostrando tus Tokens activos o comprobante de compra.",
      logoUrl: "",
      telefonoWhatsapp: sol.telefono,
      provincia: sol.provincia || "San José",
      canton: "",
      direccionFisica: "",
      enlaceRedes: "",
      activo: true,
      destacado: false,
      orden: sponsors.length + 1,
    });
    setModalAbierto(true);
    void cambiarEstadoSolicitud(sol.id, "aprobado");
  };

  const sponsorsFiltrados = sponsors.filter((s) => {
    const matchCat =
      filtroCategoria === "todas" || s.categoria === filtroCategoria;
    const matchBusqueda =
      s.nombreComercio.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descuentoTexto.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.provincia.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBusqueda;
  });

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <Store className="size-6" />
            </span>
            <h2 className="text-2xl font-black text-foreground">
              Directorio de Sponsors & Comercios Aliados
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Espacio comercial exclusivo donde los comercios ofrecen descuentos y beneficios a los miembros de la comunidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void cargarDatos()}>
            <RefreshCw className="size-4 mr-1" /> Recargar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalCategoriasAbierto(true)}
            className="border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <Tag className="size-4 mr-1" /> Gestionar Categorías ({categorias.length})
          </Button>
          <Button variant="default" size="sm" onClick={abrirNuevoSponsor} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
            <Plus className="size-4 mr-1" /> Agregar Comercio
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href="/sponsors" target="_blank" rel="noreferrer" className="flex items-center gap-1">
              <ExternalLink className="size-4" /> Ver Directorio Público ↗
            </a>
          </Button>
        </div>
      </div>

      {/* Selector de Pestañas: Catálogo vs Solicitudes */}
      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("comercios")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            tab === "comercios"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Store className="size-4" /> Comercios Aliados Activos ({sponsors.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("solicitudes")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer relative ${
            tab === "solicitudes"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-4" /> Solicitudes de Afiliación ({solicitudes.length})
          {solicitudes.filter((s) => s.estado === "pendiente").length > 0 && (
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* PESTAÑA 1: CATÁLOGO DE COMERCIOS ALIADOS */}
      {tab === "comercios" && (
        <div className="space-y-4">
          {/* Filtros y Buscador */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, descuento o provincia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground shrink-0"
            >
              <option value="todas">Todas las Categorías ({categorias.length})</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icono} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid de Tarjetas de Comercios */}
          {cargando ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Cargando catálogo de sponsors...
            </div>
          ) : sponsorsFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card">
              <Store className="size-10 mx-auto text-muted-foreground/50" />
              <h3 className="font-bold text-foreground text-base">No hay comercios con ese filtro</h3>
              <p className="text-xs text-muted-foreground">Prueba cambiando la búsqueda o agrega un nuevo sponsor.</p>
              <Button onClick={abrirNuevoSponsor} size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                <Plus className="size-4 mr-1" /> Agregar Comercio
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sponsorsFiltrados.map((s) => (
                <div
                  key={s.id}
                  className={`relative rounded-2xl border bg-card p-5 space-y-3.5 shadow-sm transition-all hover:shadow-md ${
                    s.destacado ? "border-amber-500/50 ring-2 ring-amber-500/20" : "border-border/80"
                  } ${!s.activo ? "opacity-60 bg-muted/30" : ""}`}
                >
                  {/* Top: Categoría & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {getCatInfo(s.categoria).icono} {getCatInfo(s.categoria).label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {s.destacado && (
                        <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          ⭐ DESTACADO
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          s.activo
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {s.activo ? "Activo" : "Pausado"}
                      </span>
                    </div>
                  </div>

                  {/* Nombre, Descuento y Logo */}
                  <div className="flex items-start gap-3">
                    {s.logoUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          setImagenGrande({
                            url: s.logoUrl || "",
                            titulo: s.nombreComercio,
                            categoria: getCatInfo(s.categoria).label,
                          })
                        }
                        className="group/img relative size-12 rounded-xl overflow-hidden border border-amber-500/40 bg-muted/50 shrink-0 shadow-sm cursor-zoom-in transition-all hover:border-amber-400 hover:scale-105 active:scale-95"
                        title="Haz clic para ver la foto en grande"
                      >
                        <img
                          src={s.logoUrl}
                          alt={s.nombreComercio}
                          className="size-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="size-3.5 text-amber-300 drop-shadow" />
                        </div>
                      </button>
                    ) : (
                      <div className="size-12 rounded-xl border border-amber-500/25 bg-amber-500/10 flex items-center justify-center text-xl shrink-0">
                        {getCatInfo(s.categoria).icono}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-base text-foreground break-words leading-snug">
                        {s.nombreComercio}
                      </h3>
                      <div className="mt-1 inline-flex items-center rounded-xl bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-black text-amber-700 dark:text-amber-300">
                        {s.descuentoTexto}
                      </div>
                    </div>
                  </div>

                  {/* Descripción y Condiciones */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {s.descripcion}
                  </p>
                  <div className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-500/10 rounded-xl p-2.5 border border-amber-500/20 leading-snug">
                    <span className="font-bold text-amber-700 dark:text-amber-400">Condición:</span> {s.condiciones}
                  </div>

                  {/* Info de Contacto & Ubicación */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/70">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <MapPin className="size-3.5 text-primary shrink-0" /> {s.provincia}
                    </span>
                    <a
                      href={`https://wa.me/506${s.telefonoWhatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <MessageSquare className="size-3.5" /> {s.telefonoWhatsapp}
                    </a>
                  </div>

                  {/* Acciones del Administrador */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-border/70">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActivo(s)}
                        title={s.activo ? "Pausar comercio" : "Activar comercio"}
                        className="h-8 px-2.5 text-xs hover:bg-muted"
                      >
                        <Power className={`size-3.5 ${s.activo ? "text-emerald-500" : "text-muted-foreground"}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleDestacado(s)}
                        title="Marcar como Destacado"
                        className="h-8 px-2.5 text-xs hover:bg-muted"
                      >
                        <Flame className={`size-3.5 ${s.destacado ? "text-amber-500 fill-amber-500/20" : "text-muted-foreground"}`} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirEditarSponsor(s)}
                        className="h-8 px-3 text-xs font-semibold"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => eliminarSponsorConfirm(s.id, s.nombreComercio)}
                        className="h-8 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: SOLICITUDES DE AFILIACIÓN DE NUEVOS NEGOCIOS */}
      {tab === "solicitudes" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              Empresas y comercios que han completado el formulario público en <code>/sponsors</code> para ofrecer descuentos a la comunidad.
            </span>
          </div>

          {solicitudes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm bg-card">
              No hay solicitudes de afiliación registradas todavía.
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((sol) => (
                <div
                  key={sol.id}
                  className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-foreground">{sol.nombreEmpresa}</span>
                        <span className="rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {CATEGORIAS_SPONSOR_LABELS[sol.categoria]?.label || sol.categoria}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Contacto: <strong className="text-foreground">{sol.nombreContacto}</strong> ({sol.cargo || "Representante"}) · {sol.provincia}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase border ${
                          sol.estado === "aprobado"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            : sol.estado === "contactado"
                            ? "bg-sky-500/15 border-sky-500/30 text-sky-600 dark:text-sky-400"
                            : sol.estado === "rechazado"
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {sol.estado}
                      </span>
                    </div>
                  </div>

                  {/* Propuesta de Descuento */}
                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/20">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">🎁 Descuento / Beneficio Ofrecido:</span>
                      <p className="text-foreground font-medium">{sol.propuestaDescuento}</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-3.5 border border-primary/15">
                      <span className="font-bold text-primary block mb-1">🤝 Beneficio Adicional para la Comunidad:</span>
                      <p className="text-foreground font-medium">{sol.beneficioComunidad || "Sin detalles adicionales"}</p>
                    </div>
                  </div>

                  {/* Footer & Acciones */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/70">
                    <div className="flex items-center gap-3 text-xs">
                      <a
                        href={`https://wa.me/506${sol.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `¡Hola ${sol.nombreContacto}! Te saludamos de Aval Community CR sobre tu propuesta de Sponsor para ${sol.nombreEmpresa}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="size-3.5" /> WhatsApp: {sol.telefono}
                      </a>
                      <span className="text-muted-foreground">· Email: <strong className="text-foreground">{sol.email}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void cambiarEstadoSolicitud(sol.id, "contactado")}
                        className="text-xs h-8"
                      >
                        Marcar Contactado
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => convertirSolicitudEnSponsor(sol)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 shadow-sm"
                      >
                        <CheckCircle2 className="size-3.5 mr-1" /> Aprobar y Crear Comercio
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DIÁLOGO CREAR / EDITAR COMERCIO SPONSOR */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="size-5 text-amber-400" />
              {sponsorEditando?.id.startsWith("SP-") ? "Editar Comercio Aliado" : "Nuevo Comercio Aliado"}
            </DialogTitle>
          </DialogHeader>

          {sponsorEditando && (
            <form onSubmit={(e) => void guardarSponsorModal(e)} className="space-y-4 pt-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Nombre del Comercio / Empresa *</Label>
                  <Input
                    value={sponsorEditando.nombreComercio}
                    onChange={(e) => setSponsorEditando({ ...sponsorEditando, nombreComercio: e.target.value })}
                    placeholder="Ej: Taller AutoFix CR / Restaurante El Fogón"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Categoría del Negocio</Label>
                    <button
                      type="button"
                      onClick={() => setModalCategoriasAbierto(true)}
                      className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="size-3" /> Nueva Categoría
                    </button>
                  </div>
                  <select
                    value={sponsorEditando.categoria}
                    onChange={(e) => {
                      if (e.target.value === "__NUEVA__") {
                        setModalCategoriasAbierto(true);
                      } else {
                        setSponsorEditando({
                          ...sponsorEditando,
                          categoria: e.target.value as CategoriaSponsor,
                        });
                      }
                    }}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground cursor-pointer"
                  >
                    {categorias.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.icono} {item.label}
                      </option>
                    ))}
                    <option value="__NUEVA__">➕ Crear otra categoría...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Provincia / Ubicación</Label>
                  <Input
                    value={sponsorEditando.provincia}
                    onChange={(e) => setSponsorEditando({ ...sponsorEditando, provincia: e.target.value })}
                    placeholder="Ej: San José, Santa Ana / Heredia"
                  />
                </div>
              </div>

              {/* Descuento y Condiciones */}
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-amber-800 dark:text-amber-300">Texto del Descuento o Promoción *</Label>
                  <Input
                    value={sponsorEditando.descuentoTexto}
                    onChange={(e) => setSponsorEditando({ ...sponsorEditando, descuentoTexto: e.target.value })}
                    placeholder="Ej: 20% de Descuento en Mano de Obra / 2x1 en Lavados"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">Condiciones para la Comunidad</Label>
                  <Input
                    value={sponsorEditando.condiciones}
                    onChange={(e) => setSponsorEditando({ ...sponsorEditando, condiciones: e.target.value })}
                    placeholder="Ej: Presentando tus Tokens activos de Aval Community"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Descripción del Comercio</Label>
                <Textarea
                  value={sponsorEditando.descripcion}
                  onChange={(e) => setSponsorEditando({ ...sponsorEditando, descripcion: e.target.value })}
                  placeholder="Breve detalle de los servicios o productos que ofrecen..."
                  rows={2}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">WhatsApp de Contacto / Canje</Label>
                  <Input
                    value={sponsorEditando.telefonoWhatsapp}
                    onChange={(e) => setSponsorEditando({ ...sponsorEditando, telefonoWhatsapp: e.target.value })}
                    placeholder="Ej: 8899-1122"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Dirección Exacta o Señas (Opcional)</Label>
                  <Input
                    value={sponsorEditando.direccionFisica || ""}
                    onChange={(e) => setSponsorEditando({ ...sponsorEditando, direccionFisica: e.target.value })}
                    placeholder="Ej: 200m Norte del Mall Oxígeno / Frente a la plaza"
                  />
                </div>
              </div>

              {/* SECCIÓN: ADJUNTAR LOGO / IMAGEN (BASE64 O URL) */}
              <div className="space-y-2 rounded-2xl border border-border/80 bg-muted/30 p-3.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="size-4 text-amber-500" /> Logo o Imagen del Comercio (Opcional)
                  </Label>
                  {sponsorEditando.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 className="size-3" /> Quitar imagen
                    </button>
                  )}
                </div>

                {/* Vista Previa Si Ya Hay Imagen */}
                {sponsorEditando.logoUrl ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                    <div className="size-16 rounded-lg overflow-hidden border border-border/60 bg-muted/50 flex items-center justify-center shrink-0">
                      <img
                        src={sponsorEditando.logoUrl}
                        alt="Logo del comercio"
                        className="size-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {sponsorEditando.logoUrl.startsWith("data:") ? "✓ Archivo Base64 Adjunto" : "✓ URL Externa"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate font-mono">
                        {sponsorEditando.logoUrl.slice(0, 45)}...
                      </p>
                      <label className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer">
                        <Upload className="size-3" /> Cambiar por otra foto
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp, image/svg+xml"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Botón Drag / Click para Subir Archivo local a Base64 */}
                    <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer text-center">
                      <Upload className="size-6 text-amber-500" />
                      <span className="text-xs font-bold text-foreground">
                        Haz clic aquí para seleccionar una imagen de tu dispositivo
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        PNG, JPG, WEBP o SVG (se convertirá automáticamente a formato Base64)
                      </span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {/* O bien escribir una URL */}
                    <div className="pt-1">
                      <div className="text-[10px] text-muted-foreground mb-1">O ingresa un enlace web si prefieres:</div>
                      <Input
                        value={sponsorEditando.logoUrl || ""}
                        onChange={(e) => setSponsorEditando({ ...sponsorEditando, logoUrl: e.target.value })}
                        placeholder="https://..."
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/40">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">⭐ Destacar en la Portada de Sponsors</div>
                  <div className="text-[11px] text-muted-foreground">Aparecerá en los primeros lugares con distintivo dorado.</div>
                </div>
                <Switch
                  checked={sponsorEditando.destacado}
                  onCheckedChange={(v) => setSponsorEditando({ ...sponsorEditando, destacado: v })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                  {guardando ? "Guardando..." : "Guardar Comercio"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO GESTIONAR Y CREAR CATEGORÍAS */}
      <Dialog open={modalCategoriasAbierto} onOpenChange={setModalCategoriasAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="size-5 text-amber-500" />
              Gestor de Categorías de Comercios
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Formulario para Crear Nueva Categoría */}
            <form onSubmit={(e) => void handleCrearCategoria(e)} className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Plus className="size-4" /> Agregar Nueva Categoría
              </div>
              <div className="flex gap-2">
                <Input
                  value={nuevaCatIcono}
                  onChange={(e) => setNuevaCatIcono(e.target.value)}
                  placeholder="Emoji (🔧)"
                  className="w-16 text-center text-base"
                  maxLength={4}
                  title="Emoji para la categoría"
                />
                <Input
                  value={nuevaCatNombre}
                  onChange={(e) => setNuevaCatNombre(e.target.value)}
                  placeholder="Ej: Hoteles & Turismo / Barberías"
                  className="flex-1 text-xs"
                  required
                />
                <Button
                  type="submit"
                  disabled={guardandoCat}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0"
                >
                  {guardandoCat ? "..." : "Guardar"}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Se guardará automáticamente en la base de datos y estará disponible en todos los filtros y formularios públicos.
              </p>
            </form>

            {/* Listado de Categorías Existentes */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Categorías Registradas ({categorias.length})
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {categorias.map((cat) => {
                  const esEstandar = CATEGORIAS_SPONSOR_DEFAULT.some((c) => c.id === cat.id);
                  const totalEnCat = sponsors.filter((s) => s.categoria === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icono}</span>
                        <div>
                          <span className="font-semibold text-xs text-foreground block">{cat.label}</span>
                          <span className="text-[10px] text-muted-foreground">{totalEnCat} comercio{totalEnCat !== 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {esEstandar ? (
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                            Sistema
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => void handleEliminarCategoria(cat.id, cat.label)}
                            className="h-7 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 text-xs"
                            title="Eliminar categoría personalizada"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalCategoriasAbierto(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL LIGHTBOX DE IMAGEN EN GRANDE */}
      <Dialog open={!!imagenGrande} onOpenChange={(open) => !open && setImagenGrande(null)}>
        <DialogContent className="max-w-2xl bg-card border-border p-4 sm:p-6 text-foreground backdrop-blur-2xl shadow-2xl">
          <DialogHeader className="pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {imagenGrande?.categoria}
              </span>
              <DialogTitle className="text-base sm:text-xl font-black text-foreground">
                {imagenGrande?.titulo}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-2 flex items-center justify-center overflow-hidden rounded-2xl bg-muted/40 border border-border max-h-[75vh] p-2">
            {imagenGrande?.url && (
              <img
                src={imagenGrande.url}
                alt={imagenGrande.titulo}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
