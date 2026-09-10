import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  Send,
  Home,
  Stethoscope,
  Baby,
  Hammer,
  Gift,
  HelpCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer } from "@/components/Footer";
import {
  crearCasoSocial,
  crearPropuestaSponsor,
  type CategoriaCaso,
  type TipoColaboracionSponsor,
} from "@/lib/impacto-social-store";

export const Route = createFileRoute("/impacto-social")({
  component: ImpactoSocialPage,
});

function ImpactoSocialPage() {
  const [tabActiva, setTabActiva] = useState<"casos" | "sponsors">("casos");

  // Formulario de Casos Sociales
  const [enviandoCaso, setEnviandoCaso] = useState(false);
  const [casoExitoso, setCasoExitoso] = useState(false);
  const [formCaso, setFormCaso] = useState({
    postulanteNombre: "",
    postulanteTelefono: "",
    postulanteRelacion: "Familiar",
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

  // Formulario de Sponsors
  const [enviandoSponsor, setEnviandoSponsor] = useState(false);
  const [sponsorExitoso, setSponsorExitoso] = useState(false);
  const [formSponsor, setFormSponsor] = useState({
    empresa: "",
    representante: "",
    cargo: "",
    telefono: "",
    email: "",
    tipoColaboracion: "materiales" as TipoColaboracionSponsor,
    propuesta: "",
    beneficioComunidad: "",
  });

  const handleEnviarCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCaso.postulanteNombre.trim() || !formCaso.postulanteTelefono.trim()) {
      toast.error("Por favor ingresa tu nombre y teléfono para poder contactarte.");
      return;
    }
    if (!formCaso.beneficiarioNombre.trim()) {
      toast.error("Por favor indica a quién va dirigida la ayuda.");
      return;
    }
    if (!formCaso.descripcion.trim() || formCaso.descripcion.length < 20) {
      toast.error("Por favor describe la situación con al menos 20 caracteres.");
      return;
    }

    setEnviandoCaso(true);
    try {
      await crearCasoSocial({
        ...formCaso,
        titulo: formCaso.titulo.trim() || `Ayuda solidaria para ${formCaso.beneficiarioNombre}`,
      });
      setCasoExitoso(true);
      toast.success("¡Caso social postulado con éxito!", {
        description: "Toda la información se guardó bajo estricta confidencialidad.",
      });
    } catch {
      toast.error("No se pudo enviar el caso. Por favor intenta de nuevo.");
    } finally {
      setEnviandoCaso(false);
    }
  };

  const handleEnviarSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSponsor.empresa.trim() || !formSponsor.representante.trim()) {
      toast.error("Por favor completa el nombre de la empresa y del representante.");
      return;
    }
    if (!formSponsor.telefono.trim() && !formSponsor.email.trim()) {
      toast.error("Ingresa al menos un medio de contacto (teléfono o correo).");
      return;
    }
    if (!formSponsor.propuesta.trim()) {
      toast.error("Por favor detalla en qué consiste tu propuesta de patrocinio.");
      return;
    }

    setEnviandoSponsor(true);
    try {
      await crearPropuestaSponsor(formSponsor);
      setSponsorExitoso(true);
      toast.success("¡Propuesta de sponsor enviada con éxito!", {
        description: "Nuestro equipo directivo analizará los beneficios y te contactará.",
      });
    } catch {
      toast.error("Error al enviar propuesta de sponsor");
    } finally {
      setEnviandoSponsor(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-display text-lg tracking-wider font-bold block leading-none">
                AVAL COMMUNITY
              </span>
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block">
                Impacto Social CR
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
            >
              ← Volver al Sorteo
            </a>
            <Button
              variant="hero"
              size="sm"
              onClick={() => {
                window.location.href = "/";
              }}
              className="text-xs font-bold gap-1.5 shadow-md"
            >
              Participar en el Sorteo
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        {/* HERO BANNER INSPIRADOR */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-zinc-950 via-zinc-900 to-background py-16 sm:py-24 text-center">
          {/* Glow effects */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 right-10 size-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 shadow-xs">
              <HeartHandshake className="size-4" /> AVAL SOLIDARIO · IMPACTO REAL EN COSTA RICA
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              Detrás de cada sorteo,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                transformamos vidas
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed">
              En <strong>Aval Community CR</strong> creemos que la emoción de ganar debe multiplicarse en obras de bien social. Destinamos recursos directos y alianzas comerciales para tender la mano a personas en situación de vulnerabilidad, en silencio y con absoluta dignidad.
            </p>

            {/* Banner de Garantía de Confidencialidad */}
            <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-left flex items-start gap-3 shadow-md">
              <Lock className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Confidencialidad y Protección de la Dignidad Humana
                </h4>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                  Ningún caso postulado se exhibirá en redes sociales ni se expondrá al público. Los datos sensibles son de uso exclusivo del comité directivo de Aval Community CR para evaluar y coordinar la entrega formal de la ayuda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILARES DE AYUDA SOCIAL */}
        <section className="mx-auto max-w-6xl px-5 -mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2.5 transition-all hover:border-emerald-500/50">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Home className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Adultos Mayores</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reparación de techos con goteras, pisos antideslizantes, camas ortopédicas y condiciones dignas para abuelitos solos.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2.5 transition-all hover:border-emerald-500/50">
              <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
                <Stethoscope className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Salud y Cirugías</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Apoyo con prótesis, exámenes médicos urgentes, medicamentos inaccesibles y terapias para niños y personas sin recursos.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2.5 transition-all hover:border-emerald-500/50">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <Baby className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Madres en Riesgo</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sustento alimentario, útiles escolares y apoyo emergente para madres jefas de hogar en riesgo inminente de desalojo o abandono.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2.5 transition-all hover:border-emerald-500/50">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                <Hammer className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Obras Comunitarias</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Alianzas con ferreterías y empresas solidarias para intervenir instalaciones comunitarias y hogares en riesgo estructural.
              </p>
            </div>
          </div>
        </section>

        {/* SELECTOR DE PESTAÑAS (CASOS SOCIALES VS SPONSORS) */}
        <section className="mx-auto max-w-4xl px-5 mt-14 space-y-8">
          <div className="flex rounded-2xl border border-border bg-secondary/50 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setTabActiva("casos")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tabActiva === "casos"
                  ? "bg-background text-foreground shadow-md border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HeartHandshake className={`size-4 ${tabActiva === "casos" ? "text-emerald-500" : ""}`} />
              <span>1. Postular Caso Solidario (Privado)</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva("sponsors")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tabActiva === "sponsors"
                  ? "bg-background text-foreground shadow-md border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className={`size-4 ${tabActiva === "sponsors" ? "text-amber-500" : ""}`} />
              <span>2. Empresas y Sponsors (Alianzas)</span>
            </button>
          </div>

          {/* CONTENIDO PESTAÑA 1: CASOS SOCIALES */}
          {tabActiva === "casos" && (
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg space-y-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-bold border border-emerald-500/30">
                  <Lock className="size-3.5" /> Formulario de Postulación Confidencial
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2">
                  Cuéntanos el caso que necesita ayuda
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Cualquier miembro de la comunidad puede presentar una causa. La administración evalúa periódicamente los casos recibidos para seleccionar a los beneficiarios y asignar los fondos o materiales.
                </p>
              </div>

              {casoExitoso ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-4">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500 text-black text-2xl shadow-lg">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-foreground">¡Caso recibido bajo estricta reserva!</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Hemos registrado la información en nuestro sistema administrativo privado. El comité directivo de Aval Community CR revisará la viabilidad y nos comunicaremos al teléfono proporcionado si el caso resulta seleccionado.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCasoExitoso(false);
                      setFormCaso({
                        postulanteNombre: "",
                        postulanteTelefono: "",
                        postulanteRelacion: "Familiar",
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
                    className="mt-2"
                  >
                    Postular otro caso
                  </Button>
                </div>
              ) : (
                <form onSubmit={(e) => { void handleEnviarCaso(e); }} className="space-y-6">
                  {/* Datos del Postulante */}
                  <div className="space-y-4">
                    <div className="border-b border-border pb-2">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Users className="size-4 text-emerald-500" /> Tus Datos de Contacto (Quien Postula)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Para poder llamarte o escribirte por WhatsApp para coordinar la verificación.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="post-nombre" className="text-xs">Tu Nombre Completo *</Label>
                        <Input
                          id="post-nombre"
                          required
                          value={formCaso.postulanteNombre}
                          onChange={(e) => setFormCaso({ ...formCaso, postulanteNombre: e.target.value })}
                          placeholder="Ej: María Eugenia Solano"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="post-tel" className="text-xs">Teléfono WhatsApp *</Label>
                        <Input
                          id="post-tel"
                          required
                          value={formCaso.postulanteTelefono}
                          onChange={(e) => setFormCaso({ ...formCaso, postulanteTelefono: e.target.value })}
                          placeholder="Ej: 8834-1122"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="post-rel" className="text-xs">Tu Relación con el Caso</Label>
                        <Select
                          value={formCaso.postulanteRelacion}
                          onValueChange={(val) => setFormCaso({ ...formCaso, postulanteRelacion: val })}
                        >
                          <SelectTrigger id="post-rel">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Familiar">Familiar Directo</SelectItem>
                            <SelectItem value="Vecino(a)">Vecino(a) de la comunidad</SelectItem>
                            <SelectItem value="Líder Comunitario">Líder Comunitario / Iglesia</SelectItem>
                            <SelectItem value="Amigo(a)">Amigo(a) cercano</SelectItem>
                            <SelectItem value="Mismo Afectado">Soy el mismo afectado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Datos del Beneficiario y Caso */}
                  <div className="space-y-4 pt-2">
                    <div className="border-b border-border pb-2">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Heart className="size-4 text-rose-500" /> Información de la Persona o Familia Afectada
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Indícanos a quién beneficiaría la ayuda directamente.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="ben-nombre" className="text-xs">Nombre o Apodo del Beneficiario *</Label>
                        <Input
                          id="ben-nombre"
                          required
                          value={formCaso.beneficiarioNombre}
                          onChange={(e) => setFormCaso({ ...formCaso, beneficiarioNombre: e.target.value })}
                          placeholder="Ej: Doña Carmen / Familia Morales"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ben-edad" className="text-xs">Edad Aprox.</Label>
                        <Input
                          id="ben-edad"
                          value={formCaso.beneficiarioEdad}
                          onChange={(e) => setFormCaso({ ...formCaso, beneficiarioEdad: e.target.value })}
                          placeholder="Ej: 84 años / 3 niños"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="ben-prov" className="text-xs">Provincia *</Label>
                        <Select
                          value={formCaso.provincia}
                          onValueChange={(val) => setFormCaso({ ...formCaso, provincia: val })}
                        >
                          <SelectTrigger id="ben-prov">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="San José">San José</SelectItem>
                            <SelectItem value="Alajuela">Alajuela</SelectItem>
                            <SelectItem value="Cartago">Cartago</SelectItem>
                            <SelectItem value="Heredia">Heredia</SelectItem>
                            <SelectItem value="Guanacaste">Guanacaste</SelectItem>
                            <SelectItem value="Puntarenas">Puntarenas</SelectItem>
                            <SelectItem value="Limón">Limón</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ben-canton" className="text-xs">Cantón o Localidad</Label>
                        <Input
                          id="ben-canton"
                          value={formCaso.canton}
                          onChange={(e) => setFormCaso({ ...formCaso, canton: e.target.value })}
                          placeholder="Ej: San Ramón / Pérez Zeledón"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ben-cat" className="text-xs">Tipo de Causa *</Label>
                        <Select
                          value={formCaso.categoria}
                          onValueChange={(val) => setFormCaso({ ...formCaso, categoria: val as CategoriaCaso })}
                        >
                          <SelectTrigger id="ben-cat">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adulto_mayor">👵 Adulto Mayor / Abuelito</SelectItem>
                            <SelectItem value="salud_cirugia">🏥 Salud / Cirugía / Prótesis</SelectItem>
                            <SelectItem value="vivienda">🛠️ Arreglo de Casa / Techo</SelectItem>
                            <SelectItem value="madre_riesgo">👩‍👧 Madre Jefa de Hogar</SelectItem>
                            <SelectItem value="otro">🤝 Otra Causa Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ben-desc" className="text-xs">
                        Descripción Detallada de la Situación y Necesidades *
                      </Label>
                      <Textarea
                        id="ben-desc"
                        required
                        rows={4}
                        value={formCaso.descripcion}
                        onChange={(e) => setFormCaso({ ...formCaso, descripcion: e.target.value })}
                        placeholder="Describe con claridad la situación: qué ocurre, por qué es urgente, qué materiales o apoyo económico se necesita..."
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="ben-presup" className="text-xs">Presupuesto Estimado (Aprox. en ₡)</Label>
                        <Input
                          id="ben-presup"
                          value={formCaso.presupuestoEstimado}
                          onChange={(e) => setFormCaso({ ...formCaso, presupuestoEstimado: e.target.value })}
                          placeholder="Ej: ₡350,000 en materiales o cotización médica"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Si no lo tienes exacto, un estimado ayuda a valorar la viabilidad.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="ben-urg" className="text-xs">Nivel de Urgencia</Label>
                        <Select
                          value={formCaso.urgencia}
                          onValueChange={(val) => setFormCaso({ ...formCaso, urgencia: val as "alta" | "media" | "normal" })}
                        >
                          <SelectTrigger id="ben-urg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alta">🔴 Alta (Riesgo inminente / cirugía pronta)</SelectItem>
                            <SelectItem value="media">🟡 Media (Requiere solución este mes)</SelectItem>
                            <SelectItem value="normal">🟢 Normal (Mejora de calidad de vida)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      <span>Tus datos y los del beneficiario nunca serán compartidos con terceros.</span>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      disabled={enviandoCaso}
                      className="w-full sm:w-auto font-bold gap-2 shadow-lg"
                    >
                      <Send className="size-4" />
                      {enviandoCaso ? "Enviando Caso..." : "Enviar Caso a Evaluación"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* CONTENIDO PESTAÑA 2: PORTAL DE SPONSORS */}
          {tabActiva === "sponsors" && (
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg space-y-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-500 px-3 py-1 text-xs font-bold border border-amber-500/30">
                  <Building2 className="size-3.5" /> Portal de Alianzas Corporativas y Patrocinios
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2">
                  Suma tu empresa al impacto de Aval Community CR
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Ferreterías, clínicas de salud, comercios mayoristas, marcas de repuestos o automotrices: colaboren en nuestras causas benéficas o patrocinen eventos y conecten con miles de costarricenses en nuestra plataforma oficial.
                </p>
              </div>

              {/* Tarjetas de Beneficios para Sponsors */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-1">
                  <Sparkles className="size-4 text-amber-500" />
                  <h4 className="font-bold text-xs text-foreground">Visibilidad Masiva</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Exposición de tu marca en transmisiones oficiales, boletos y redes de Aval Community.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-1">
                  <Gift className="size-4 text-emerald-500" />
                  <h4 className="font-bold text-xs text-foreground">Retorno Comunitario</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Ofrece descuentos exclusivos a los jugadores y conviértelos en clientes frecuentes.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-1">
                  <HeartHandshake className="size-4 text-primary" />
                  <h4 className="font-bold text-xs text-foreground">Impacto Certificado</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Certificación de Empresa Socialmente Responsable con donaciones directas auditables.
                  </p>
                </div>
              </div>

              {sponsorExitoso ? (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-8 text-center space-y-4">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500 text-black text-2xl shadow-lg font-bold">
                    🤝
                  </div>
                  <h3 className="text-xl font-bold text-foreground">¡Propuesta comercial recibida!</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Nuestro departamento comercial y de alianzas estratégicas revisará la propuesta de tu empresa. Te contactaremos formalmente al teléfono o correo indicado para coordinar los detalles.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSponsorExitoso(false);
                      setFormSponsor({
                        empresa: "",
                        representante: "",
                        cargo: "",
                        telefono: "",
                        email: "",
                        tipoColaboracion: "materiales",
                        propuesta: "",
                        beneficioComunidad: "",
                      });
                    }}
                    className="mt-2"
                  >
                    Enviar otra propuesta
                  </Button>
                </div>
              ) : (
                <form onSubmit={(e) => { void handleEnviarSponsor(e); }} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="sp-empresa" className="text-xs">Nombre de la Empresa o Marca *</Label>
                      <Input
                        id="sp-empresa"
                        required
                        value={formSponsor.empresa}
                        onChange={(e) => setFormSponsor({ ...formSponsor, empresa: e.target.value })}
                        placeholder="Ej: Ferretería El Roble S.A. / Clínica San José"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sp-tipo" className="text-xs">Tipo de Colaboración *</Label>
                      <Select
                        value={formSponsor.tipoColaboracion}
                        onValueChange={(val) => setFormSponsor({ ...formSponsor, tipoColaboracion: val as TipoColaboracionSponsor })}
                      >
                        <SelectTrigger id="sp-tipo">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="materiales">🧱 Donación de Materiales de Construcción</SelectItem>
                          <SelectItem value="servicios">🩺 Servicios Médicos / Profesionales</SelectItem>
                          <SelectItem value="patrocinio_premios">🎁 Patrocinio de Premios / Mini-Sorteos</SelectItem>
                          <SelectItem value="descuentos_comunidad">🏷️ Descuentos para Jugadores Aval</SelectItem>
                          <SelectItem value="donacion_fondos">💵 Aporte Económico Benéfico</SelectItem>
                          <SelectItem value="otro">🤝 Alianza Estratégica Mixta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="sp-rep" className="text-xs">Representante Comercial *</Label>
                      <Input
                        id="sp-rep"
                        required
                        value={formSponsor.representante}
                        onChange={(e) => setFormSponsor({ ...formSponsor, representante: e.target.value })}
                        placeholder="Ej: Ing. Jorge Méndez"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sp-cargo" className="text-xs">Cargo en la Empresa</Label>
                      <Input
                        id="sp-cargo"
                        value={formSponsor.cargo}
                        onChange={(e) => setFormSponsor({ ...formSponsor, cargo: e.target.value })}
                        placeholder="Ej: Gerente Comercial / Propietario"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sp-tel" className="text-xs">Teléfono WhatsApp *</Label>
                      <Input
                        id="sp-tel"
                        required
                        value={formSponsor.telefono}
                        onChange={(e) => setFormSponsor({ ...formSponsor, telefono: e.target.value })}
                        placeholder="Ej: 8312-5544"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sp-email" className="text-xs">Correo Electrónico Corporativo</Label>
                    <Input
                      id="sp-email"
                      type="email"
                      value={formSponsor.email}
                      onChange={(e) => setFormSponsor({ ...formSponsor, email: e.target.value })}
                      placeholder="Ej: contacto@tuempresa.cr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sp-prop" className="text-xs">
                      ¿Cómo les gustaría colaborar y qué pueden aportar? *
                    </Label>
                    <Textarea
                      id="sp-prop"
                      required
                      rows={3}
                      value={formSponsor.propuesta}
                      onChange={(e) => setFormSponsor({ ...formSponsor, propuesta: e.target.value })}
                      placeholder="Describe qué tipo de materiales, servicios, patrocinios o montos estarían dispuestos a aportar para las causas sociales o sorteos..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sp-ben" className="text-xs">
                      ¿Qué beneficio exclusivo pueden ofrecer a los usuarios de Aval Community CR?
                    </Label>
                    <Textarea
                      id="sp-ben"
                      rows={2}
                      value={formSponsor.beneficioComunidad}
                      onChange={(e) => setFormSponsor({ ...formSponsor, beneficioComunidad: e.target.value })}
                      placeholder="Ej: 15% de descuento directo en todas nuestras sucursales para quienes presenten un comprobante oficial de Aval..."
                    />
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="size-4 text-amber-500" />
                      <span>Coordinación directa y formal con la administración general.</span>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      disabled={enviandoSponsor}
                      className="w-full sm:w-auto font-bold gap-2 shadow-lg"
                    >
                      <Send className="size-4" />
                      {enviandoSponsor ? "Enviando Propuesta..." : "Enviar Propuesta de Alianza"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
