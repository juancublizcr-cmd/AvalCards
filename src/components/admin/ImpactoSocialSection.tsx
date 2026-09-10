import { useState, useEffect } from "react";
import {
  HeartHandshake,
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
  ExternalLink,
  Plus,
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
  type CasoSocial,
  type EstadoCaso,
  type CategoriaCaso,
} from "@/lib/impacto-social-store";

const CATEGORIA_LABELS: Record<CategoriaCaso, { label: string; color: string }> = {
  adulto_mayor: { label: "Adulto Mayor", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  salud_cirugia: { label: "Salud y Cirugía", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  vivienda: { label: "Arreglo de Vivienda", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  madre_riesgo: { label: "Madre en Riesgo", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  otro: { label: "Comunidad / Otro", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

const ESTADO_CASO_LABELS: Record<EstadoCaso, { label: string; badge: string }> = {
  pendiente: { label: "Pendiente", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  en_evaluacion: { label: "En Evaluación", badge: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  seleccionado: { label: "Seleccionado para Ayuda", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  ayuda_entregada: { label: "Ayuda Entregada", badge: "bg-teal-500/15 text-teal-400 border-teal-500/30" },
  archivado: { label: "Archivado", badge: "bg-muted text-muted-foreground border-border" },
};

export function ImpactoSocialSection() {
  const [casos, setCasos] = useState<CasoSocial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [casoSeleccionado, setCasoSeleccionado] = useState<CasoSocial | null>(null);
  const [notaBorrador, setNotaBorrador] = useState("");
  const [guardandoNota, setGuardandoNota] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const dataCasos = await fetchCasosSociales();
      setCasos(dataCasos);
    } catch {
      toast.error("Error al cargar causas sociales");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const handleCambiarEstadoCaso = async (id: string, nuevoEstado: EstadoCaso) => {
    try {
      await actualizarCasoSocial(id, { estado: nuevoEstado });
      setCasos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
      if (casoSeleccionado && casoSeleccionado.id === id) {
        setCasoSeleccionado({ ...casoSeleccionado, estado: nuevoEstado });
      }
      toast.success(`Estado actualizado a: ${ESTADO_CASO_LABELS[nuevoEstado].label}`);
    } catch {
      toast.error("No se pudo actualizar el estado del caso");
    }
  };

  const handleGuardarNota = async () => {
    if (!casoSeleccionado) return;
    setGuardandoNota(true);
    try {
      await actualizarCasoSocial(casoSeleccionado.id, { notasAdmin: notaBorrador });
      setCasos((prev) =>
        prev.map((c) => (c.id === casoSeleccionado.id ? { ...c, notasAdmin: notaBorrador } : c))
      );
      setCasoSeleccionado({ ...casoSeleccionado, notasAdmin: notaBorrador });
      toast.success("Nota interna guardada con éxito");
    } catch {
      toast.error("Error al guardar la nota");
    } finally {
      setGuardandoNota(false);
    }
  };

  const handleEliminarCaso = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este caso social permanentemente?")) return;
    try {
      await eliminarCasoSocial(id);
      setCasos((prev) => prev.filter((c) => c.id !== id));
      if (casoSeleccionado?.id === id) setCasoSeleccionado(null);
      toast.success("Caso social eliminado");
    } catch {
      toast.error("No se pudo eliminar el caso");
    }
  };

  const casosFiltrados = casos.filter((c) => {
    const matchBusqueda =
      c.beneficiarioNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.postulanteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.provincia.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === "todos" || c.estado === filtroEstado;
    const matchCat = filtroCategoria === "todas" || c.categoria === filtroCategoria;
    return matchBusqueda && matchEstado && matchCat;
  });

  const conteoPendientes = casos.filter((c) => c.estado === "pendiente").length;
  const conteoSeleccionados = casos.filter((c) => c.estado === "seleccionado").length;
  const conteoEntregados = casos.filter((c) => c.estado === "ayuda_entregada").length;

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <HeartHandshake className="size-6" />
            </span>
            <h2 className="text-2xl font-black text-foreground">
              Bien Social & Causas Comunitarias
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Gestión confidencial y transparente de casos comunitarios postulados por la comunidad para canalización de ayudas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void cargarDatos()}>
            <RefreshCw className="size-4" /> Recargar
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href="/impacto-social" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400">
              <ExternalLink className="size-4" /> Ver Portal Solidario ↗
            </a>
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas de Casos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Casos Postulados</span>
          <div className="text-2xl font-black text-foreground">{casos.length}</div>
        </div>
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-1">
          <span className="text-[11px] font-bold text-yellow-400 uppercase">Casos Pendientes</span>
          <div className="text-2xl font-black text-yellow-400">{conteoPendientes}</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase">Seleccionados para Ayuda</span>
          <div className="text-2xl font-black text-emerald-400">{conteoSeleccionados}</div>
        </div>
        <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-4 space-y-1">
          <span className="text-[11px] font-bold text-teal-400 uppercase">Ayudas Entregadas</span>
          <div className="text-2xl font-black text-teal-400">{conteoEntregados}</div>
        </div>
      </div>

      {/* Filtros de Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por beneficiario, postulante, título o provincia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground shrink-0"
        >
          <option value="todos">Todos los Estados</option>
          {Object.entries(ESTADO_CASO_LABELS).map(([k, item]) => (
            <option key={k} value={k}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground shrink-0"
        >
          <option value="todas">Todas las Categorías</option>
          {Object.entries(CATEGORIA_LABELS).map(([k, item]) => (
            <option key={k} value={k}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Casos */}
      {cargando ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Cargando casos comunitarios...
        </div>
      ) : casosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-2">
          <HeartHandshake className="size-10 mx-auto text-muted-foreground/50" />
          <p className="font-bold text-sm text-foreground">No hay casos sociales que coincidan</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {casosFiltrados.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border ${
                    CATEGORIA_LABELS[c.categoria]?.color || "bg-secondary text-foreground"
                  }`}
                >
                  {CATEGORIA_LABELS[c.categoria]?.label || c.categoria}
                </span>

                <select
                  value={c.estado}
                  onChange={(e) => void handleCambiarEstadoCaso(c.id, e.target.value as EstadoCaso)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-bold text-foreground cursor-pointer"
                >
                  {Object.entries(ESTADO_CASO_LABELS).map(([k, item]) => (
                    <option key={k} value={k}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-black text-base text-foreground">{c.titulo}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-emerald-400" /> {c.provincia} {c.canton ? `(${c.canton})` : ""}
                  </span>
                  <span>·</span>
                  <span>Beneficiario: <strong>{c.beneficiarioNombre}</strong></span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {c.descripcion}
              </p>

              {c.presupuestoEstimado && (
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Presupuesto Estimado:</span>
                  <strong className="font-black text-emerald-400">{c.presupuestoEstimado}</strong>
                </div>
              )}

              {/* Info de contacto del postulante */}
              <div className="rounded-xl bg-secondary/30 p-3 border border-border/60 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Postulado por: {c.postulanteNombre} ({c.postulanteRelacion || "Vecino/Familiar"})
                </span>
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`https://wa.me/506${c.postulanteTelefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `¡Hola ${c.postulanteNombre}! Te saludamos de Aval Community CR sobre el caso social que postulaste (${c.titulo}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <MessageCircle className="size-3.5" /> WhatsApp: {c.postulanteTelefono}
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void handleEliminarCaso(c.id)}
                    className="h-6 px-2 text-destructive hover:bg-destructive/10 text-[11px]"
                  >
                    <Trash2 className="size-3 mr-1" /> Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
