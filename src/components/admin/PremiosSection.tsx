import { useRef, useState, useEffect } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  Gamepad2,
  Gift,
  HelpCircle,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Ticket,
  Trash2,
  Trophy,
  UserCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deletePremio,
  FAQS_DEFAULT,
  FEATURES_DEFAULT,
  GANADORES_TESTIMONIOS_DEFAULT,
  NIVELES,
  RASPA_DEFAULT,
  subirImagenPremio,
  upsertPremios,
  upsertSorteo,
  type FaqItem,
  type FeatureDetalle,
  type ModalidadVenta,
  type Nivel,
  type Premio,
  type PremioRaspa,
  type RaspaConfig,
  type Sorteo,
  type TestimonioGanador,
} from "@/lib/admin-store";

export function PremiosSection({
  premios,
  setPremios,
  sorteo,
  setSorteo,
}: {
  premios: Premio[];
  setPremios: (p: Premio[]) => void;
  sorteo: Sorteo;
  setSorteo: (s: Sorteo) => void;
}) {
  const [borrador, setBorrador] = useState<Sorteo>({
    ...sorteo,
    modalidadVenta: sorteo.modalidadVenta || "escalonado",
    detalleTitulo: sorteo.detalleTitulo || "Toyota Prado 2026: Lujo, Potencia y Confort",
    detalleSubtitulo: sorteo.detalleSubtitulo || "Un vehículo 0 kilómetros, sacado de agencia con garantía total de fábrica y entregado formalmente a tu nombre.",
    detalleImagen: sorteo.detalleImagen || "",
    detalleFeatures: sorteo.detalleFeatures && sorteo.detalleFeatures.length > 0 ? sorteo.detalleFeatures : FEATURES_DEFAULT,
    detalleGarantia: sorteo.detalleGarantia || "Si resultas favorecido, nos encargamos de todo el trámite de traspaso notarial, placas, marchamo del año y entrega con tanque lleno.",
    ganadoresTestimonios: sorteo.ganadoresTestimonios && sorteo.ganadoresTestimonios.length > 0 ? sorteo.ganadoresTestimonios : GANADORES_TESTIMONIOS_DEFAULT,
    faqs: sorteo.faqs && sorteo.faqs.length > 0 ? sorteo.faqs : FAQS_DEFAULT,
    raspaConfig: sorteo.raspaConfig || RASPA_DEFAULT,
  });

  useEffect(() => {
    setBorrador((prev) => ({
      ...prev,
      ...sorteo,
      modalidadVenta: sorteo.modalidadVenta || prev.modalidadVenta || "escalonado",
    }));
  }, [sorteo]);
  const [guardandoSorteo, setGuardandoSorteo] = useState(false);
  const [guardandoRaspa, setGuardandoRaspa] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState<string | null>(null);
  const [subiendoImagenDetalle, setSubiendoImagenDetalle] = useState(false);
  const [subiendoImagenGanador, setSubiendoImagenGanador] = useState<number | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const inputsGanadores = useRef<Record<number, HTMLInputElement | null>>({});
  const inputDetalle = useRef<HTMLInputElement | null>(null);

  const [guardandoPremios, setGuardandoPremios] = useState(false);
  const [guardandoGanadores, setGuardandoGanadores] = useState(false);
  const [guardandoFaqs, setGuardandoFaqs] = useState(false);

  const NIVEL_ORDEN: Record<Nivel, number> = {
    "Premio Mayor": 1,
    "Segundo Premio": 2,
    "Tercer Premio": 3,
  };

  const actualizar = async (id: string, cambios: Partial<Premio>) => {
    const next = premios.map((p) => (p.id === id ? { ...p, ...cambios } : p));
    setPremios(next);
    try {
      await upsertPremios(next);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar premio");
    }
  };

  const cambiarNivel = async (id: string, nuevoNivel: Nivel) => {
    const actual = premios.find((p) => p.id === id);
    if (!actual) return;

    const nivelAnterior = actual.nivel;

    // Si ya tiene ese nivel, no hacer nada
    if (nivelAnterior === nuevoNivel) return;

    // 1. Intercambiar nivel con el premio que ya lo tenía (para que no queden duplicados)
    const premiosConNivel = premios.map((p) => {
      if (p.id === id) {
        return { ...p, nivel: nuevoNivel };
      }
      if (p.nivel === nuevoNivel) {
        return { ...p, nivel: nivelAnterior };
      }
      return p;
    });

    // 2. Reordenar automáticamente: Premio Mayor (1°), Segundo Premio (2°), Tercer Premio (3°)
    const reordenados = [...premiosConNivel]
      .map((p) => ({
        ...p,
        orden: NIVEL_ORDEN[p.nivel] ?? 99,
      }))
      .sort((a, b) => (NIVEL_ORDEN[a.nivel] ?? 99) - (NIVEL_ORDEN[b.nivel] ?? 99));

    setPremios(reordenados);

    try {
      await upsertPremios(reordenados);
      toast.success(`¡Posición actualizada automáticamente!`, {
        description: `${reordenados[0]?.nombre || "El premio"} ahora está de 1° como Premio Mayor.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar reordenamiento de premios");
    }
  };

  const guardarTodosLosPremios = async () => {
    setGuardandoPremios(true);
    try {
      const reordenados = [...premios]
        .map((p) => ({
          ...p,
          orden: NIVEL_ORDEN[p.nivel] ?? 99,
        }))
        .sort((a, b) => (NIVEL_ORDEN[a.nivel] ?? 99) - (NIVEL_ORDEN[b.nivel] ?? 99));

      setPremios(reordenados);
      await upsertPremios(reordenados);
      toast.success("¡Cambios guardados perfectamente!", {
        description: "Los vehículos, posiciones y fotos quedaron 100% actualizados en la web.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar premios en la base de datos");
    } finally {
      setGuardandoPremios(false);
    }
  };

  const eliminar = async (id: string) => {
    try {
      await deletePremio(id);
      const next = premios.filter((p) => p.id !== id);
      setPremios(next);
      toast.success("Premio eliminado de la landing page");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar premio");
    }
  };

  const agregar = async () => {
    if (premios.length >= 3) return;
    const usados = premios.map((p) => p.nivel);
    const nivel = NIVELES.find((n) => !usados.includes(n)) ?? "Tercer Premio";
    const next: Premio[] = [
      ...premios,
      {
        id: `p${Date.now()}`,
        nombre: "Nuevo premio",
        nivel,
        imagen: "",
        orden: premios.length + 1,
      },
    ];
    setPremios(next);
    try {
      await upsertPremios(next);
      toast.success("Nueva entrega agregada. Recuerda subirle una foto y guardar cambios.");
    } catch (err) {
      console.error(err);
      toast.error("Error al agregar premio");
    }
  };

  const subirImagen = async (id: string, file?: File) => {
    if (!file) return;
    setSubiendoImagen(id);
    try {
      const url = await subirImagenPremio(id, file);
      await actualizar(id, { imagen: url });
      toast.success("¡Foto subida y guardada perfectamente!", {
        description: "La nueva foto ya está activa en la página principal.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al subir imagen");
    } finally {
      setSubiendoImagen(null);
    }
  };

  const subirFotoDetalle = async (file?: File) => {
    if (!file) return;
    setSubiendoImagenDetalle(true);
    try {
      const url = await subirImagenPremio("detalle_entrega", file);
      const nuevo = { ...borrador, detalleImagen: url };
      setBorrador(nuevo);
      await upsertSorteo(nuevo);
      setSorteo(nuevo);
      toast.success("¡Foto de la Ficha Técnica actualizada y guardada!");
    } catch (err) {
      console.error(err);
      toast.error("Error al subir foto de ficha técnica");
    } finally {
      setSubiendoImagenDetalle(false);
    }
  };

  const subirFotoGanador = async (index: number, file?: File) => {
    if (!file) return;
    setSubiendoImagenGanador(index);
    try {
      const url = await subirImagenPremio(`ganador_${index}`, file);
      const lista = [...(borrador.ganadoresTestimonios || GANADORES_TESTIMONIOS_DEFAULT)];
      lista[index] = { ...lista[index], foto: url };
      const nuevo = { ...borrador, ganadoresTestimonios: lista };
      setBorrador(nuevo);
      await upsertSorteo(nuevo);
      setSorteo(nuevo);
      toast.success("¡Foto del ganador subida y guardada!");
    } catch (err) {
      console.error(err);
      toast.error("Error al subir foto de ganador");
    } finally {
      setSubiendoImagenGanador(null);
    }
  };

  const actualizarGanador = (index: number, campo: keyof TestimonioGanador, valor: string) => {
    const lista = [...(borrador.ganadoresTestimonios || GANADORES_TESTIMONIOS_DEFAULT)];
    lista[index] = { ...lista[index], [campo]: valor };
    setBorrador({ ...borrador, ganadoresTestimonios: lista });
  };

  const agregarGanador = () => {
    const lista = [...(borrador.ganadoresTestimonios || GANADORES_TESTIMONIOS_DEFAULT)];
    lista.push({
      id: `g_${Date.now()}`,
      premio: "Vehículo 0KM",
      ganador: "Nombre del Ganador",
      ciudad: "Ciudad, Provincia",
      sticker: "12345",
      sorteo: "Edición Especial",
      foto: "",
      testimonio: "¡Excelente experiencia y entrega 100% formal!",
    });
    setBorrador({ ...borrador, ganadoresTestimonios: lista });
  };

  const eliminarGanador = (index: number) => {
    const lista = [...(borrador.ganadoresTestimonios || GANADORES_TESTIMONIOS_DEFAULT)].filter((_, i) => i !== index);
    setBorrador({ ...borrador, ganadoresTestimonios: lista });
  };

  const guardarGanadores = async () => {
    setGuardandoGanadores(true);
    try {
      await upsertSorteo(borrador);
      setSorteo(borrador);
      toast.success("¡Ganadores y testimonios guardados perfectamente!");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar testimonios");
    } finally {
      setGuardandoGanadores(false);
    }
  };

  const actualizarFaq = (index: number, campo: keyof FaqItem, valor: string) => {
    const lista = [...(borrador.faqs || FAQS_DEFAULT)];
    lista[index] = { ...lista[index], [campo]: valor };
    setBorrador({ ...borrador, faqs: lista });
  };

  const agregarFaq = () => {
    const lista = [...(borrador.faqs || FAQS_DEFAULT)];
    lista.push({
      pregunta: "¿Nueva pregunta frecuente?",
      respuesta: "Respuesta clara y detallada para orientar a los clientes.",
    });
    setBorrador({ ...borrador, faqs: lista });
  };

  const eliminarFaq = (index: number) => {
    const lista = [...(borrador.faqs || FAQS_DEFAULT)].filter((_, i) => i !== index);
    setBorrador({ ...borrador, faqs: lista });
  };

  const guardarFaqs = async () => {
    setGuardandoFaqs(true);
    try {
      await upsertSorteo(borrador);
      setSorteo(borrador);
      toast.success("¡Preguntas frecuentes guardadas perfectamente!");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar preguntas frecuentes");
    } finally {
      setGuardandoFaqs(false);
    }
  };

  const actualizarFeature = (index: number, campo: keyof FeatureDetalle, valor: string) => {
    const feats = [...(borrador.detalleFeatures || FEATURES_DEFAULT)];
    feats[index] = { ...feats[index], [campo]: valor };
    setBorrador({ ...borrador, detalleFeatures: feats });
  };

  const guardarSorteo = async () => {
    setGuardandoSorteo(true);
    try {
      await upsertSorteo(borrador);
      setSorteo(borrador);
      toast.success("¡Configuración y Ficha Técnica guardadas perfectamente!", {
        description: "El contador, textos y ficha técnica se sincronizaron con éxito.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar evento");
    } finally {
      setGuardandoSorteo(false);
    }
  };

  const raspaActual = borrador.raspaConfig || RASPA_DEFAULT;

  const actualizarRaspa = <K extends keyof RaspaConfig>(campo: K, valor: RaspaConfig[K]) => {
    const nuevoRaspa = { ...raspaActual, [campo]: valor };
    setBorrador({ ...borrador, raspaConfig: nuevoRaspa });
  };

  const actualizarPremioRaspa = <K extends keyof PremioRaspa>(index: number, campo: K, valor: PremioRaspa[K]) => {
    const lista = [...(raspaActual.premios || [])];
    lista[index] = { ...lista[index], [campo]: valor };
    actualizarRaspa("premios", lista);
  };

  const agregarPremioRaspa = () => {
    const lista = [...(raspaActual.premios || [])];
    lista.push({
      id: `r_${Date.now()}`,
      nombre: "₡10,000 en SINPE Móvil",
      icono: "💵",
      probabilidad: 10,
      esGanador: true,
    });
    actualizarRaspa("premios", lista);
  };

  const eliminarPremioRaspa = (index: number) => {
    const lista = [...(raspaActual.premios || [])].filter((_, i) => i !== index);
    actualizarRaspa("premios", lista);
  };

  const guardarRaspaConfig = async () => {
    setGuardandoRaspa(true);
    try {
      await upsertSorteo(borrador);
      setSorteo(borrador);
      toast.success("¡Configuración de Raspa y Gana guardada perfectamente!", {
        description: `Estado: ${raspaActual.activo ? "ACTIVADO en toda la plataforma" : "DESACTIVADO (Oculto al público)"}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar Raspa y Gana");
    } finally {
      setGuardandoRaspa(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. FECHA Y CONFIGURACIÓN DEL EVENTO */}
      <section className="rounded-xl border-2 border-primary/40 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-primary border-b border-border pb-3">
          <Calendar className="size-5" /> Fecha Oficial y Parámetros del Evento
        </div>
        <p className="text-xs text-muted-foreground">
          La fecha que coloques aquí controla directamente el <strong>contador de días, horas y minutos</strong> de la página principal.
        </p>

        <div className="grid gap-4 md:grid-cols-3 pt-2">
          <div className="space-y-2">
            <Label>Nombre del Evento Promocional</Label>
            <Input
              value={borrador.nombre}
              onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })}
              placeholder="Evento Promocional Aval Community CR"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-primary">📅 Fecha de Cierre del Evento</Label>
            <Input
              type="date"
              value={borrador.fecha}
              onChange={(e) => setBorrador({ ...borrador, fecha: e.target.value })}
              className="border-primary/60 font-bold"
            />
            <span className="text-[11px] text-muted-foreground block">
              Actual: <strong>{borrador.fecha || "2026-09-27"}</strong>
            </span>
          </div>
          <div className="space-y-2">
            <Label>Precio base por Token (₡)</Label>
            <Input
              type="number"
              value={borrador.precioBase}
              onChange={(e) => setBorrador({ ...borrador, precioBase: Number(e.target.value) })}
              placeholder="1000"
            />
          </div>
        </div>

        {/* SELECTOR DE MODALIDAD DE VENTA DE TOKENS */}
        <div className="pt-3 border-t border-border space-y-3">
          <Label className="text-sm font-bold flex items-center gap-2">
            <Ticket className="size-4 text-primary" /> Modalidad de Venta y Paquetes de Tokens en la Web:
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Opción 1: Paquetes Estándar Escalonados */}
            <div
              onClick={() => setBorrador({ ...borrador, modalidadVenta: "escalonado" })}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all relative ${
                (borrador.modalidadVenta || "escalonado") === "escalonado"
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(234,88,12,0.2)]"
                  : "border-border bg-secondary/30 hover:border-border/80"
              }`}
            >
              {(borrador.modalidadVenta || "escalonado") === "escalonado" && (
                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-black">
                  <CheckCircle2 className="size-3.5 stroke-[3]" />
                </span>
              )}
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>📦</span> Paquetes Estándar (Multi-Paquete)
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Muestra los 4 paquetes escalonados según el precio base por token: <strong>4 Tokens</strong>, <strong>8 Tokens</strong>, <strong>12 Tokens</strong> y <strong>24 Tokens</strong>.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-mono font-bold text-primary">
                <span className="px-2 py-0.5 rounded-md bg-secondary border">4 = ₡{((borrador.precioBase || 2500) * 4).toLocaleString("es-CR")}</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary border">8 = ₡{((borrador.precioBase || 2500) * 8).toLocaleString("es-CR")}</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary border">12 = ₡{((borrador.precioBase || 2500) * 12).toLocaleString("es-CR")}</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary border">24 = ₡{((borrador.precioBase || 2500) * 24).toLocaleString("es-CR")}</span>
              </div>
            </div>

            {/* Opción 2: Paquete Especial 3 Tokens por Precio Base */}
            <div
              onClick={() => setBorrador({ ...borrador, modalidadVenta: "fijo_3x5000" })}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all relative ${
                borrador.modalidadVenta === "fijo_3x5000"
                  ? "border-amber-500 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : "border-border bg-secondary/30 hover:border-border/80"
              }`}
            >
              {borrador.modalidadVenta === "fijo_3x5000" && (
                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-amber-500 text-black">
                  <CheckCircle2 className="size-3.5 stroke-[3]" />
                </span>
              )}
              <div className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <span>🔥</span> Paquete Promocional Único (3 Tokens por ₡{(borrador.precioBase || 2500).toLocaleString("es-CR")})
              </div>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Muestra el paquete promocional único de <strong>3 Tokens Digitales por ₡{(borrador.precioBase || 2500).toLocaleString("es-CR")} CRC</strong>. Mantiene activos los SuperTokens y Referidos.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-mono font-bold text-amber-400">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40">
                  🎟️ 3 Tokens = ₡{(borrador.precioBase || 2500).toLocaleString("es-CR")} CRC
                </span>
                <span className="px-2 py-0.5 rounded-md bg-secondary/80 border text-muted-foreground text-[10px]">
                  +SuperToken & Referidos activos
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="hero"
          size="lg"
          className="mt-2 shadow-[var(--shadow-fire)]"
          onClick={() => { void guardarSorteo(); }}
          disabled={guardandoSorteo}
        >
          {guardandoSorteo ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}{" "}
          Guardar Fecha y Configuración
        </Button>
      </section>

      {/* 2. PREMIOS Y ENTREGAS DE LA LANDING PAGE */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Trophy className="size-5 text-amber-500" /> Vehículos y Entregas Destacadas
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hasta 3 entregas. La cuadrícula pública se adapta automáticamente con las fotos que subas.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { void agregar(); }} disabled={premios.length >= 3}>
            <Plus className="size-4" /> Agregar Entrega
          </Button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {premios.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-secondary/30 p-4 relative">
              {p.nivel === "Premio Mayor" && (
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                    👑 1° Lugar · Premio Mayor
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80">Principal</span>
                </div>
              )}
              {p.nivel === "Segundo Premio" && (
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/15 border border-slate-500/40 px-2.5 py-0.5 text-xs font-bold text-slate-300">
                    🥈 2° Lugar · Segundo Premio
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Posición #2</span>
                </div>
              )}
              {p.nivel === "Tercer Premio" && (
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/40 px-2.5 py-0.5 text-xs font-bold text-orange-400">
                    🥉 3° Lugar · Tercer Premio
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Posición #3</span>
                </div>
              )}

              {p.imagen ? (
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="mb-3 h-40 w-full rounded-lg object-cover border"
                />
              ) : (
                <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  Sin imagen
                </div>
              )}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Nombre del Vehículo / Entrega</Label>
                  <Input
                    value={p.nombre}
                    onChange={(e) => { void actualizar(p.id, { nombre: e.target.value }); }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Posición / Nivel</Label>
                  <Select
                    value={p.nivel}
                    onValueChange={(v) => { void cambiarNivel(p.id, v as Nivel); }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NIVELES.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <input
                  ref={(el) => {
                    inputs.current[p.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => { void subirImagen(p.id, e.target.files?.[0]); }}
                />
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => inputs.current[p.id]?.click()}
                    disabled={subiendoImagen === p.id}
                  >
                    {subiendoImagen === p.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ImagePlus className="size-4" />
                    )}{" "}
                    Cambiar foto
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => { void eliminar(p.id); }}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de Guardar Cambios de Premios y Vehículos */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            Las fotos se guardan automáticamente al subirlas. Usa este botón para confirmar todos los nombres y niveles.
          </div>
          <Button
            variant="hero"
            size="lg"
            className="shadow-[var(--shadow-fire)]"
            onClick={() => { void guardarTodosLosPremios(); }}
            disabled={guardandoPremios}
          >
            {guardandoPremios ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}{" "}
            Guardar Cambios de Premios y Vehículos
          </Button>
        </div>
      </section>

      {/* 3. FICHA TÉCNICA & GRAN ENTREGA DETALLADA */}
      <section className="rounded-xl border-2 border-primary/40 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <FileText className="size-5" /> Ficha Técnica & Gran Entrega Detallada
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Controla el título, descripción, foto destacada y las 4 características clave que aparecen en la sección detallada de la página de inicio.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* Textos Principales y Foto */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Título de la Gran Entrega</Label>
              <Input
                value={borrador.detalleTitulo || ""}
                onChange={(e) => setBorrador({ ...borrador, detalleTitulo: e.target.value })}
                placeholder="Toyota Prado 2026: Lujo, Potencia y Confort"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Descripción General</Label>
              <Input
                value={borrador.detalleSubtitulo || ""}
                onChange={(e) => setBorrador({ ...borrador, detalleSubtitulo: e.target.value })}
                placeholder="Un vehículo 0 kilómetros, sacado de agencia con garantía total..."
              />
            </div>

            {/* Foto de la Ficha Técnica */}
            <div className="space-y-2 pt-2">
              <Label>Foto de la Ficha Técnica / Interior</Label>
              <div className="rounded-xl border border-border bg-secondary/20 p-3 space-y-3">
                {borrador.detalleImagen ? (
                  <img
                    src={borrador.detalleImagen}
                    alt="Foto Ficha Técnica"
                    className="h-44 w-full rounded-lg object-cover border"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center rounded-lg bg-secondary/50 text-xs text-muted-foreground text-center p-4">
                    (Usa la foto del Premio Mayor por defecto o sube una imagen personalizada para esta sección)
                  </div>
                )}
                <input
                  ref={inputDetalle}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => { void subirFotoDetalle(e.target.files?.[0]); }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => inputDetalle.current?.click()}
                  disabled={subiendoImagenDetalle}
                >
                  {subiendoImagenDetalle ? <Loader2 className="animate-spin size-4" /> : <ImagePlus className="size-4" />}
                  {borrador.detalleImagen ? "Cambiar foto de Ficha Técnica" : "Subir foto personalizada para Ficha Técnica"}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="flex items-center gap-1.5 text-primary font-bold">
                <Award className="size-4" /> Texto de Garantía Aval Community
              </Label>
              <Input
                value={borrador.detalleGarantia || ""}
                onChange={(e) => setBorrador({ ...borrador, detalleGarantia: e.target.value })}
                placeholder="Si resultas favorecido, nos encargamos de todo el trámite..."
              />
            </div>
          </div>

          {/* Las 4 Características Clave */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              4 Características Clave del Vehículo
            </Label>
            {(borrador.detalleFeatures || FEATURES_DEFAULT).map((f, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-secondary/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Característica #{idx + 1}</span>
                </div>
                <Input
                  value={f.titulo}
                  onChange={(e) => actualizarFeature(idx, "titulo", e.target.value)}
                  placeholder="Título (ej: Motor Turbo Diésel 2.8L)"
                  className="font-semibold text-xs"
                />
                <Input
                  value={f.desc}
                  onChange={(e) => actualizarFeature(idx, "desc", e.target.value)}
                  placeholder="Descripción (ej: Potencia brutal y máxima eficiencia...)"
                  className="text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="hero"
            size="lg"
            className="shadow-[var(--shadow-fire)]"
            onClick={() => { void guardarSorteo(); }}
            disabled={guardandoSorteo}
          >
            {guardandoSorteo ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}{" "}
            Guardar Ficha Técnica y Configuración
          </Button>
        </div>
      </section>

      {/* 4. GANADORES CERTIFICADOS Y TESTIMONIOS */}
      <section className="rounded-xl border-2 border-primary/40 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <Trophy className="size-5 text-amber-500" /> Ganadores Certificados y Testimonios
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edita las tarjetas de testimonios reales de ganadores anteriores que aparecen en la landing page.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={agregarGanador}>
            <Plus className="size-4" /> Agregar Ganador
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(borrador.ganadoresTestimonios || GANADORES_TESTIMONIOS_DEFAULT).map((g, idx) => (
            <div key={g.id || idx} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <UserCheck className="size-3.5" /> Ganador #{idx + 1}
                </span>
                <Button variant="destructive" size="sm" className="h-7 px-2" onClick={() => eliminarGanador(idx)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Foto del ganador */}
              <div className="space-y-1.5">
                <Label className="text-xs">Foto de la Entrega / Ganador</Label>
                <div className="flex items-center gap-3">
                  {g.foto ? (
                    <img src={g.foto} alt={g.ganador} className="size-16 rounded-lg object-cover border shrink-0" />
                  ) : (
                    <div className="size-16 rounded-lg bg-secondary/80 flex items-center justify-center text-[10px] text-muted-foreground border shrink-0">
                      Sin foto
                    </div>
                  )}
                  <input
                    ref={(el) => {
                      inputsGanadores.current[idx] = el;
                    }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => { void subirFotoGanador(idx, e.target.files?.[0]); }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs gap-1.5"
                    onClick={() => inputsGanadores.current[idx]?.click()}
                    disabled={subiendoImagenGanador === idx}
                  >
                    {subiendoImagenGanador === idx ? <Loader2 className="animate-spin size-3.5" /> : <ImagePlus className="size-3.5" />}
                    {g.foto ? "Cambiar foto" : "Subir foto"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nombre del Ganador</Label>
                  <Input
                    value={g.ganador}
                    onChange={(e) => actualizarGanador(idx, "ganador", e.target.value)}
                    placeholder="Esteban Morales V."
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ciudad / Ubicación</Label>
                  <Input
                    value={g.ciudad}
                    onChange={(e) => actualizarGanador(idx, "ciudad", e.target.value)}
                    placeholder="San José, Escazú"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Premio Entregado</Label>
                  <Input
                    value={g.premio}
                    onChange={(e) => actualizarGanador(idx, "premio", e.target.value)}
                    placeholder="Toyota Hilux 4x4"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Edición / Sorteo y Ticket</Label>
                  <div className="flex gap-1.5">
                    <Input
                      value={g.sorteo}
                      onChange={(e) => actualizarGanador(idx, "sorteo", e.target.value)}
                      placeholder="Edición #14"
                      className="text-xs"
                    />
                    <Input
                      value={g.sticker}
                      onChange={(e) => actualizarGanador(idx, "sticker", e.target.value)}
                      placeholder="41982"
                      className="text-xs w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Testimonio / Frase</Label>
                <Textarea
                  value={g.testimonio}
                  onChange={(e) => actualizarGanador(idx, "testimonio", e.target.value)}
                  placeholder="Compré el paquete y no lo podía creer..."
                  className="text-xs min-h-16"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="hero"
            size="lg"
            className="shadow-[var(--shadow-fire)]"
            onClick={() => { void guardarGanadores(); }}
            disabled={guardandoGanadores}
          >
            {guardandoGanadores ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}{" "}
            Guardar Ganadores y Testimonios
          </Button>
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES (FAQS) */}
      <section className="rounded-xl border-2 border-primary/40 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <HelpCircle className="size-5" /> Preguntas Frecuentes (FAQs)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gestiona todas las preguntas y respuestas del acordeón de dudas en la página principal.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={agregarFaq}>
            <Plus className="size-4" /> Agregar Pregunta
          </Button>
        </div>

        <div className="space-y-4">
          {(borrador.faqs || FAQS_DEFAULT).map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-primary">Pregunta #{idx + 1}</Label>
                <Button variant="destructive" size="sm" className="h-7 px-2" onClick={() => eliminarFaq(idx)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Input
                value={faq.pregunta}
                onChange={(e) => actualizarFaq(idx, "pregunta", e.target.value)}
                placeholder="¿Cómo participo en el evento promocional?"
                className="font-semibold text-sm"
              />
              <Textarea
                value={faq.respuesta}
                onChange={(e) => actualizarFaq(idx, "respuesta", e.target.value)}
                placeholder="Respuesta detallada..."
                className="text-xs min-h-20"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="hero"
            size="lg"
            className="shadow-[var(--shadow-fire)]"
            onClick={() => { void guardarFaqs(); }}
            disabled={guardandoFaqs}
          >
            {guardandoFaqs ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}{" "}
            Guardar Preguntas Frecuentes
          </Button>
        </div>
      </section>

      {/* 6. RASPA Y GANA DIGITAL EXPRESS */}
      <section className="rounded-xl border-2 border-amber-500/50 bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-amber-500">
              <Gift className="size-5" /> Raspa y Gana Digital Express (Juego Instantáneo)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Juego táctil independiente de raspar con el dedo o mouse para ganar premios en SINPE Móvil al instante.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-1.5">
              <Label htmlFor="switch-raspa" className="text-xs font-bold cursor-pointer">
                {raspaActual.activo ? "🟢 ACTIVADO" : "🔴 DESACTIVADO"}
              </Label>
              <Switch
                id="switch-raspa"
                checked={raspaActual.activo}
                onCheckedChange={(v) => actualizarRaspa("activo", v)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={agregarPremioRaspa} className="gap-1.5 border-amber-500/40 text-amber-400 hover:bg-amber-500/10">
              <Plus className="size-4" /> Agregar Premio
            </Button>
          </div>
        </div>

        {/* Configuración General del Raspa */}
        <div className="grid gap-4 sm:grid-cols-3 bg-secondary/30 p-4 rounded-xl border border-border">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Precio por Tarjeta (CRC)</Label>
            <Input
              type="number"
              value={raspaActual.precio}
              onChange={(e) => actualizarRaspa("precio", Number(e.target.value))}
              placeholder="1000"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Título del Juego</Label>
            <Input
              value={raspaActual.titulo}
              onChange={(e) => actualizarRaspa("titulo", e.target.value)}
              placeholder="Raspa y Gana Express"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Subtítulo / Instrucción</Label>
            <Input
              value={raspaActual.subtitulo}
              onChange={(e) => actualizarRaspa("subtitulo", e.target.value)}
              placeholder="¡Gana dinero en SINPE Móvil al instante!"
            />
          </div>
        </div>

        {/* Lista de Premios Configurables */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Premios y Probabilidades ({raspaActual.premios?.length || 0})
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Probabilidad total ponderada
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(raspaActual.premios || []).map((p, idx) => (
              <div
                key={p.id || idx}
                className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl">{p.icono}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.esGanador ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {p.esGanador ? "PREMIO GANADOR" : "CASI GANA / NINGUNO"}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => eliminarPremioRaspa(idx)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Nombre del Premio / Mensaje</Label>
                  <Input
                    value={p.nombre}
                    onChange={(e) => actualizarPremioRaspa(idx, "nombre", e.target.value)}
                    placeholder="₡50,000 en SINPE Móvil"
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Icono / Emoji</Label>
                    <Input
                      value={p.icono}
                      onChange={(e) => actualizarPremioRaspa(idx, "icono", e.target.value)}
                      placeholder="💵, 👑, 🎟️, 🎮"
                      className="text-xs text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Peso / Probabilidad (%)</Label>
                    <Input
                      type="number"
                      value={p.probabilidad}
                      onChange={(e) => actualizarPremioRaspa(idx, "probabilidad", Number(e.target.value))}
                      placeholder="10"
                      className="text-xs font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="hero"
            size="lg"
            className="shadow-[var(--shadow-fire)]"
            onClick={() => { void guardarRaspaConfig(); }}
            disabled={guardandoRaspa}
          >
            {guardandoRaspa ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}{" "}
            Guardar Configuración de Raspa y Gana
          </Button>
        </div>
      </section>
    </div>
  );
}