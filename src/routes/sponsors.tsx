import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  MessageSquare,
  Percent,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
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
  CATEGORIAS_SPONSOR_DEFAULT,
  CATEGORIAS_SPONSOR_LABELS,
  fetchSponsors,
  fetchCategoriasSponsors,
  enviarSolicitudSponsor,
  type ComercioSponsor,
  type CategoriaSponsor,
  type CategoriaItem,
} from "@/lib/sponsors-store";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Comercios Aliados & Descuentos Exclusivos | Aval Community CR" },
      {
        name: "description",
        content:
          "Descubre todos los descuentos, cupones y beneficios exclusivos en talleres, autolavados, gastronomía y repuestos para los miembros de Aval Community CR.",
      },
    ],
  }),
  component: SponsorsPage,
});

function SponsorsPage() {
  const [sponsors, setSponsors] = useState<ComercioSponsor[]>([]);
  const [categorias, setCategorias] = useState<CategoriaItem[]>(CATEGORIAS_SPONSOR_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState("");

  // Formulario para que nuevos comercios se afilien
  const [enviandoForm, setEnviandoForm] = useState(false);
  const [formExitoso, setFormExitoso] = useState(false);
  const [form, setForm] = useState({
    nombreEmpresa: "",
    nombreContacto: "",
    cargo: "",
    telefono: "",
    email: "",
    categoria: "talleres_mecanica" as CategoriaSponsor,
    propuestaDescuento: "",
    beneficioComunidad: "",
    provincia: "San José",
  });

  useEffect(() => {
    async function load() {
      try {
        const [dataSponsors, dataCats] = await Promise.all([
          fetchSponsors(),
          fetchCategoriasSponsors(),
        ]);
        setSponsors(dataSponsors.filter((s) => s.activo));
        setCategorias(dataCats);
      } catch {
        toast.error("Error al cargar comercios aliados");
      } finally {
        setCargando(false);
      }
    }
    void load();
  }, []);

  const getCatInfo = (catId: string) => {
    const found = categorias.find((c) => c.id === catId);
    if (found) return found;
    if (CATEGORIAS_SPONSOR_LABELS[catId]) {
      return { id: catId, label: CATEGORIAS_SPONSOR_LABELS[catId].label, icono: CATEGORIAS_SPONSOR_LABELS[catId].icono };
    }
    return { id: catId, label: catId, icono: "🏬" };
  };

  const handleEnviarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombreEmpresa.trim() || !form.nombreContacto.trim() || !form.telefono.trim()) {
      toast.error("Por favor completa los campos principales de contacto");
      return;
    }
    if (!form.propuestaDescuento.trim()) {
      toast.error("Por favor indícanos qué descuento o beneficio deseas ofrecer");
      return;
    }

    setEnviandoForm(true);
    try {
      await enviarSolicitudSponsor(form);
      setFormExitoso(true);
      toast.success("¡Solicitud enviada con éxito! Nos comunicaremos pronto.");
    } catch {
      toast.error("Error al enviar la solicitud");
    } finally {
      setEnviandoForm(false);
    }
  };

  const sponsorsFiltrados = sponsors.filter((s) => {
    const matchCat = filtroCategoria === "todas" || s.categoria === filtroCategoria;
    const matchBusqueda =
      s.nombreComercio.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descuentoTexto.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.provincia.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBusqueda;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* NAVBAR SIMPLE */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-primary text-black font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-foreground flex items-center gap-1">
                AVAL <span className="text-amber-400">COMMUNITY</span>
              </span>
              <span className="text-[10px] text-muted-foreground block -mt-1 font-semibold tracking-wider uppercase">
                Red de Beneficios Exclusivos
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Volver al Inicio
            </Link>
            <Button
              size="sm"
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xs shadow-md"
            >
              <a href="#afiliarse">
                <Store className="size-3.5 mr-1" /> Afiliar mi Negocio
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO PRINCIPAL */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-amber-950/20 via-background to-background py-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
              <Sparkles className="size-3.5" /> Comercios Aliados & Beneficios Oficiales
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
              Descuentos y Beneficios Exclusivos para la{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Comunidad Aval
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Por ser parte activa de Aval Community CR y adquirir tus Tokens, tienes acceso directo a
              <strong> descuentos de hasta 30%, promociones especiales y cortesías</strong> en nuestra red de
              talleres mecánicos, autolavados, gastronomía, repuesteras y gimnasios en todo Costa Rica.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-border px-3 py-1">
                <ShieldCheck className="size-4 text-emerald-400" /> Válido con tus Tokens Activos
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-border px-3 py-1">
                <Zap className="size-4 text-amber-400" /> Canje Directo en WhatsApp
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-border px-3 py-1">
                <Percent className="size-4 text-primary" /> Sin Costo Adicional
              </div>
            </div>
          </div>
        </section>

        {/* BUSCADOR Y FILTROS */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-8">
            {/* Buscador */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar taller, restaurante, lavado, repuestos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-card"
              />
            </div>

            {/* Filtros de Categorías en Botones de Píldora */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setFiltroCategoria("todas")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  filtroCategoria === "todas"
                    ? "bg-amber-500 text-black shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas ({sponsors.length})
              </button>
              {categorias.map((cat) => {
                const count = sponsors.filter((s) => s.categoria === cat.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFiltroCategoria(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                      filtroCategoria === cat.id
                        ? "bg-amber-500 text-black shadow-md"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{cat.icono}</span>
                    <span>{cat.label}</span>
                    <span className="opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CATÁLOGO DE TARJETAS DE SPONSORS */}
          {cargando ? (
            <div className="py-20 text-center text-muted-foreground">
              <div className="size-10 mx-auto animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-3" />
              <p className="text-sm">Cargando comercios aliados...</p>
            </div>
          ) : sponsorsFiltrados.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
              <Store className="size-12 mx-auto text-muted-foreground/40" />
              <h3 className="font-bold text-lg text-foreground">No se encontraron comercios en esta búsqueda</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Prueba buscando con otro término o categoría. Si eres dueño de un comercio, ¡puedes ser el primero de tu zona!
              </p>
              <Button asChild size="sm" className="bg-amber-500 text-black font-bold">
                <a href="#afiliarse">Afiliar mi Comercio</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsorsFiltrados.map((s) => (
                <div
                  key={s.id}
                  className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card to-zinc-950 p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${
                    s.destacado
                      ? "border-amber-500/60 ring-1 ring-amber-500/30"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {/* Glow decorativo */}
                  {s.destacado && (
                    <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-amber-500/15 blur-2xl group-hover:bg-amber-500/25 transition-colors" />
                  )}

                  <div className="space-y-4">
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {s.logoUrl ? (
                          <div className="size-14 rounded-2xl overflow-hidden border border-amber-500/30 bg-muted/40 shrink-0 shadow-md">
                            <img
                              src={s.logoUrl}
                              alt={s.nombreComercio}
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 text-2xl font-black shadow-inner shrink-0">
                            {getCatInfo(s.categoria).icono}
                          </div>
                        )}
                        <div>
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            {getCatInfo(s.categoria).label}
                          </span>
                          <h3 className="font-black text-lg text-foreground group-hover:text-amber-400 transition-colors line-clamp-1">
                            {s.nombreComercio}
                          </h3>
                        </div>
                      </div>

                      {s.destacado && (
                        <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black text-amber-400 shrink-0">
                          ⭐ TOP SPONSOR
                        </span>
                      )}
                    </div>

                    {/* Badge Gigante del Descuento */}
                    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-amber-600/5 p-3.5 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Percent className="size-3" /> Beneficio Exclusivo Aval
                      </div>
                      <div className="text-base sm:text-lg font-black text-amber-300">
                        {s.descuentoTexto}
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {s.descripcion}
                    </p>

                    {/* Condiciones */}
                    <div className="rounded-xl bg-zinc-900/80 border border-border/60 p-2.5 text-[11px] text-zinc-300">
                      <span className="text-amber-400 font-bold">Cómo canjear:</span> {s.condiciones}
                    </div>
                  </div>

                  {/* Footer con Ubicación y Botón de WhatsApp */}
                  <div className="pt-4 mt-4 border-t border-border/70 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-primary" /> {s.provincia} {s.canton ? `· ${s.canton}` : ""}
                      </span>
                      {s.direccionFisica && (
                        <span className="text-[10px] text-zinc-400 truncate max-w-[150px]" title={s.direccionFisica}>
                          {s.direccionFisica}
                        </span>
                      )}
                    </div>

                    <Button
                      asChild
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-md"
                    >
                      <a
                        href={`https://wa.me/506${s.telefonoWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `¡Hola! Vi su promoción en Aval Community CR (${s.descuentoTexto}) y deseo aplicarla.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageSquare className="size-4 mr-1.5" /> Canjear Descuento en WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN: AFILIA TU NEGOCIO COMO SPONSOR */}
        <section id="afiliarse" className="relative border-t border-border/80 bg-zinc-950 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-zinc-900 to-zinc-900 p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-400 uppercase">
                  <Building2 className="size-3.5" /> Para Dueños de Negocios y Emprendedores
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-foreground">
                  ¿Tienes un negocio? Conviértete en Sponsor Aliado
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Llega a miles de compradores y participantes activos en Costa Rica. Ofréceles un descuento
                  o cortesía y obtén exposición continua y clientes recurrentes en nuestra plataforma.
                </p>
              </div>

              {formExitoso ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-3">
                  <CheckCircle2 className="size-12 mx-auto text-emerald-400 animate-bounce" />
                  <h3 className="font-black text-xl text-foreground">¡Solicitud Recibida con Éxito!</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Hemos registrado los datos de tu comercio. Nuestro equipo de alianzas se pondrá en contacto
                    contigo por WhatsApp para coordinar el arte, el descuento y activar tu negocio en el catálogo oficial.
                  </p>
                  <Button
                    onClick={() => {
                      setFormExitoso(false);
                      setForm({
                        nombreEmpresa: "",
                        nombreContacto: "",
                        cargo: "",
                        telefono: "",
                        email: "",
                        categoria: "talleres_mecanica",
                        propuestaDescuento: "",
                        beneficioComunidad: "",
                        provincia: "San José",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Enviar otra propuesta
                  </Button>
                </div>
              ) : (
                <form onSubmit={(e) => void handleEnviarSolicitud(e)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Nombre del Negocio / Empresa *</Label>
                      <Input
                        placeholder="Ej: Taller Mecánico San José / Lavado Premium"
                        value={form.nombreEmpresa}
                        onChange={(e) => setForm({ ...form, nombreEmpresa: e.target.value })}
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Categoría del Comercio</Label>
                      <select
                        value={form.categoria}
                        onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaSponsor })}
                        className="w-full h-10 rounded-md border border-input bg-card px-3 text-xs text-foreground"
                      >
                        {categorias.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.icono} {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Nombre del Contacto / Encargado *</Label>
                      <Input
                        placeholder="Ej: Carlos Ramírez"
                        value={form.nombreContacto}
                        onChange={(e) => setForm({ ...form, nombreContacto: e.target.value })}
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">WhatsApp / Teléfono Comercial *</Label>
                      <Input
                        placeholder="Ej: 8899-1122"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Provincia de Ubicación</Label>
                      <select
                        value={form.provincia}
                        onChange={(e) => setForm({ ...form, provincia: e.target.value })}
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
                      <Label className="text-xs font-bold">Correo Electrónico (Opcional)</Label>
                      <Input
                        type="email"
                        placeholder="contacto@empresa.cr"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-amber-400">
                      ¿Qué descuento o beneficio te gustaría ofrecer a la comunidad? *
                    </Label>
                    <Input
                      placeholder="Ej: 20% en cambio de aceite y frenos / 15% en consumo total / 2x1 en lavados"
                      value={form.propuestaDescuento}
                      onChange={(e) => setForm({ ...form, propuestaDescuento: e.target.value })}
                      required
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Detalles o condiciones adicionales (Opcional)
                    </Label>
                    <Textarea
                      placeholder="Cuéntanos más sobre tu negocio o las sucursales donde aplica..."
                      rows={2}
                      value={form.beneficioComunidad}
                      onChange={(e) => setForm({ ...form, beneficioComunidad: e.target.value })}
                      className="bg-card"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={enviandoForm}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-sm h-11 shadow-lg"
                  >
                    {enviandoForm ? "Enviando Solicitud..." : "Postular mi Negocio como Sponsor"}
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
