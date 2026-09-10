import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Baby,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  Hammer,
  HeartHandshake,
  Home,
  Info,
  Lock,
  MapPin,
  MessageSquare,
  Percent,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Tag,
  Upload,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/Footer";
import {
  fetchCasosSociales,
  crearCasoSocial,
  type CasoSocial,
  type CategoriaCaso,
} from "@/lib/impacto-social-store";

export const Route = createFileRoute("/impacto-social")({
  head: () => ({
    meta: [
      { title: "Impacto y Bien Social | Aval Community CR" },
      {
        name: "description",
        content:
          "Conoce el compromiso solidario de Aval Community CR: destinamos un porcentaje de cada emisión a causas sociales transparentes, adultos mayores, salud infantil y familias vulnerables en Costa Rica.",
      },
    ],
  }),
  component: ImpactoSocialPage,
});

function ImpactoSocialPage() {
  const [casos, setCasos] = useState<CasoSocial[]>([]);
  const [cargando, setCargando] = useState(true);

  // Formulario de Postulación de Casos Sociales
  const [enviandoCaso, setEnviandoCaso] = useState(false);
  const [casoExitoso, setCasoExitoso] = useState(false);
  const [formCaso, setFormCaso] = useState({
    postulanteNombre: "",
    postulanteTelefono: "",
    postulanteRelacion: "",
    beneficiarioNombre: "",
    beneficiarioEdad: "",
    provincia: "San José",
    canton: "",
    categoria: "adulto_mayor" as CategoriaCaso,
    titulo: "",
    descripcion: "",
    presupuestoEstimado: "",
    urgencia: "alta" as "alta" | "media" | "normal",
  });

  useEffect(() => {
    async function cargar() {
      try {
        const c = await fetchCasosSociales();
        setCasos(c);
      } catch {
        toast.error("Error al cargar casos solidarios");
      } finally {
        setCargando(false);
      }
    }
    void cargar();
  }, []);

  const handleEnviarCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCaso.postulanteNombre.trim() || !formCaso.postulanteTelefono.trim()) {
      toast.error("Por favor completa los datos de contacto del postulante");
      return;
    }
    if (!formCaso.beneficiarioNombre.trim() || !formCaso.titulo.trim() || !formCaso.descripcion.trim()) {
      toast.error("Por favor completa la información del beneficiario y la descripción de la causa");
      return;
    }

    setEnviandoCaso(true);
    try {
      await crearCasoSocial(formCaso);
      setCasoExitoso(true);
      toast.success("¡Caso social postulado con éxito!", {
        description: "Nuestro equipo evaluará la causa con absoluta discreción.",
      });
    } catch {
      toast.error("Error al postular el caso");
    } finally {
      setEnviandoCaso(false);
    }
  };

  const getCategoriaIcon = (cat: CategoriaCaso) => {
    switch (cat) {
      case "adulto_mayor":
        return <Home className="size-4 text-amber-400" />;
      case "salud_cirugia":
        return <Stethoscope className="size-4 text-rose-400" />;
      case "vivienda":
        return <Hammer className="size-4 text-blue-400" />;
      case "madre_riesgo":
        return <Baby className="size-4 text-emerald-400" />;
      default:
        return <HeartHandshake className="size-4 text-purple-400" />;
    }
  };

  const getCategoriaNombre = (cat: CategoriaCaso) => {
    switch (cat) {
      case "adulto_mayor":
        return "Adulto Mayor / Hogar";
      case "salud_cirugia":
        return "Salud / Cirugía / Terapia";
      case "vivienda":
        return "Vivienda & Techo Digno";
      case "madre_riesgo":
        return "Madres en Riesgo";
      default:
        return "Causa Comunitaria";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              ❤️
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-foreground flex items-center gap-1">
                AVAL <span className="text-emerald-400">SOLIDARIO</span>
              </span>
              <span className="text-[10px] text-muted-foreground block -mt-1 font-semibold tracking-wider uppercase">
                Bien Social & Compromiso Comunitario
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/sponsors"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Store className="size-3.5" /> Ver Comercios Aliados ↗
            </Link>
            <Button
              size="sm"
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
            >
              <a href="#postular">
                <Plus className="size-3.5 mr-1" /> Postular un Caso
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-emerald-950/25 via-background to-background py-14 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-20 size-80 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider">
              <HeartHandshake className="size-3.5" /> Compromiso Social 100% Transparente
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
              Cada Token Adquirido Construye un{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Impacto Real en Costa Rica
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              En <strong>Aval Community CR</strong> creemos que el éxito debe compartirse. Destinamos una parte de
              cada sorteo a causas sociales auditables: arreglos de techos para adultos mayores, apoyo a niños con
              requerimientos médicos especiales y sustento a comedores y hogares vulnerables.
            </p>

            {/* 3 Pilares */}
            <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto pt-6 text-left">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> 100% Auditado
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Entregas con facturación, fotografías y testimonios reales compartidos con la comunidad.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <Users className="size-4" /> Postulación Abierta
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cualquier participante puede postular a una familia, vecino o centro que realmente lo necesite.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <Lock className="size-4" /> Privacidad & Dignidad
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trato respetuoso y confidencial de todos los datos personales de las familias postuladas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EJEMPLOS DE CAUSAS Y CASOS EN EVALUACIÓN */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Causas Recientes en Evaluación y Apoyo
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Casos comunitarios postulados por la comunidad de Aval Community en diferentes provincias del país.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
              Total Casos: {casos.length}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {casos.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-border bg-gradient-to-b from-card to-zinc-950 p-6 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                    {getCategoriaIcon(c.categoria)}
                    {getCategoriaNombre(c.categoria)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      c.estado === "ayuda_entregada"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : c.estado === "seleccionado"
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    {c.estado.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">{c.titulo}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-emerald-400" /> {c.provincia} {c.canton ? `(${c.canton})` : ""}
                    </span>
                    <span>·</span>
                    <span>Beneficiario: <strong>{c.beneficiarioNombre}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {c.descripcion}
                </p>

                {c.presupuestoEstimado && (
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
                    <span>Meta de Apoyo Estimada:</span>
                    <strong className="font-black text-emerald-400">{c.presupuestoEstimado}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN FORMULARIO DE POSTULACIÓN */}
        <section id="postular" className="border-t border-border/80 bg-zinc-950 py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-zinc-900 to-zinc-900 p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400 uppercase">
                  <Lock className="size-3.5" /> Postulación Confidencial
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  Postula a una Familia o Causa que Ocupe Apoyo
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Cuéntanos la historia. Nuestro comité evaluará la situación para canalizar la ayuda material
                  o económica directamente al beneficiario.
                </p>
              </div>

              {casoExitoso ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-3">
                  <CheckCircle2 className="size-12 mx-auto text-emerald-400 animate-bounce" />
                  <h3 className="font-black text-xl text-foreground">¡Caso Registrado Exitosamente!</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Gracias por postular esta causa. Nos comunicaremos al número de teléfono brindado para verificar
                    detalles y cotizaciones correspondientes.
                  </p>
                  <Button
                    onClick={() => {
                      setCasoExitoso(false);
                      setFormCaso({
                        postulanteNombre: "",
                        postulanteTelefono: "",
                        postulanteRelacion: "",
                        beneficiarioNombre: "",
                        beneficiarioEdad: "",
                        provincia: "San José",
                        canton: "",
                        categoria: "adulto_mayor",
                        titulo: "",
                        descripcion: "",
                        presupuestoEstimado: "",
                        urgencia: "alta",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Postular otro caso
                  </Button>
                </div>
              ) : (
                <form onSubmit={(e) => void handleEnviarCaso(e)} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Tu Nombre Completo (Postulante) *</Label>
                      <Input
                        placeholder="Ej: María Eugenia Solano"
                        value={formCaso.postulanteNombre}
                        onChange={(e) => setFormCaso({ ...formCaso, postulanteNombre: e.target.value })}
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Tu Teléfono / WhatsApp *</Label>
                      <Input
                        placeholder="Ej: 8834-1122"
                        value={formCaso.postulanteTelefono}
                        onChange={(e) => setFormCaso({ ...formCaso, postulanteTelefono: e.target.value })}
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Nombre del Beneficiario / Causa *</Label>
                      <Input
                        placeholder="Ej: Doña Carmen (84 años)"
                        value={formCaso.beneficiarioNombre}
                        onChange={(e) => setFormCaso({ ...formCaso, beneficiarioNombre: e.target.value })}
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Categoría de la Causa</Label>
                      <select
                        value={formCaso.categoria}
                        onChange={(e) => setFormCaso({ ...formCaso, categoria: e.target.value as CategoriaCaso })}
                        className="w-full h-10 rounded-md border border-input bg-card px-3 text-xs text-foreground"
                      >
                        <option value="adulto_mayor">👵 Adulto Mayor / Techo / Asilo</option>
                        <option value="salud_cirugia">🩺 Salud / Prótesis / Terapia</option>
                        <option value="vivienda">🏠 Reparación de Vivienda Vulnerable</option>
                        <option value="madre_riesgo">👶 Madre Jefa de Hogar en Riesgo</option>
                        <option value="otro">🤝 Otra Causa Comunitaria</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Provincia</Label>
                      <select
                        value={formCaso.provincia}
                        onChange={(e) => setFormCaso({ ...formCaso, provincia: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-card px-3 text-xs text-foreground"
                      >
                        <option value="San José">San José</option>
                        <option value="Alajuela">Alajuela</option>
                        <option value="Cartago">Cartago</option>
                        <option value="Heredia">Heredia</option>
                        <option value="Guanacaste">Guanacaste</option>
                        <option value="Puntarenas">Puntarenas</option>
                        <option value="Limón">Limón</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Cantón / Comunidad</Label>
                      <Input
                        placeholder="Ej: San Ramón / Puriscal"
                        value={formCaso.canton}
                        onChange={(e) => setFormCaso({ ...formCaso, canton: e.target.value })}
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Título Resumido del Caso *</Label>
                    <Input
                      placeholder="Ej: Reparación urgente de techo con goteras para adulta mayor"
                      value={formCaso.titulo}
                      onChange={(e) => setFormCaso({ ...formCaso, titulo: e.target.value })}
                      required
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Descripción Detallada de la Necesidad *</Label>
                    <Textarea
                      placeholder="Explica detalladamente la situación actual, qué materiales o apoyo se requieren y por qué es urgente..."
                      rows={3}
                      value={formCaso.descripcion}
                      onChange={(e) => setFormCaso({ ...formCaso, descripcion: e.target.value })}
                      required
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Presupuesto o Materiales Estimados (Opcional)</Label>
                    <Input
                      placeholder="Ej: ₡350,000 / 12 láminas de zinc y bajantes"
                      value={formCaso.presupuestoEstimado}
                      onChange={(e) => setFormCaso({ ...formCaso, presupuestoEstimado: e.target.value })}
                      className="bg-card"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={enviandoCaso}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm h-11 shadow-lg"
                  >
                    {enviandoCaso ? "Enviando Caso..." : "Enviar Postulación de Caso"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
