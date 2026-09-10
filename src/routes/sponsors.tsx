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
  Maximize2,
  MessageSquare,
  Percent,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Ticket,
  Users,
  Zap,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [imagenGrande, setImagenGrande] = useState<{ url: string; titulo: string; categoria: string } | null>(null);
  const [cuponActivo, setCuponActivo] = useState<ComercioSponsor | null>(null);
  const [telefonoClienteCanje, setTelefonoClienteCanje] = useState("");

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

    const handleUpdate = () => {
      void load();
    };

    window.addEventListener("sponsors_updated", handleUpdate);
    window.addEventListener("categorias_sponsors_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sponsors_updated", handleUpdate);
      window.removeEventListener("categorias_sponsors_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
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

  const getWhatsappUrl = (sponsor: ComercioSponsor, telUsuario?: string) => {
    const cleanTel = sponsor.telefonoWhatsapp.replace(/\D/g, "");
    const cleanUserTel = (telUsuario || "").replace(/\D/g, "").trim();
    const infoTel = cleanUserTel ? ` (Mi teléfono registrado es: ${cleanUserTel})` : "";
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
    const urlValidar = origin
      ? (cleanUserTel ? `${origin}/validar?buscar=${cleanUserTel}` : `${origin}/validar`)
      : "";

    const validadorTexto = urlValidar
      ? `\n\nPuedes comprobar la validez de mis Tokens en el validador oficial de Aval Community CR:\n${urlValidar}`
      : "";

    const msg = `¡Hola ${sponsor.nombreComercio}! Soy miembro de Aval Community CR y deseo aplicar mi beneficio exclusivo: "${sponsor.descuentoTexto}".${infoTel}${validadorTexto}`;
    return `https://wa.me/506${cleanTel}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* NAVBAR ULTRA LIMPIO Y RESPONSIVE */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 gap-2">
          {/* Logo & Marca */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-black font-black text-base sm:text-lg shadow-md shrink-0">
              A
            </div>
            <div className="min-w-0">
              <span className="font-black text-xs sm:text-sm tracking-tight text-foreground block truncate">
                AVAL <span className="text-amber-400">COMMUNITY</span>
              </span>
              <span className="hidden sm:block text-[9px] text-muted-foreground -mt-0.5 font-semibold tracking-wider uppercase truncate">
                Red de Beneficios Exclusivos
              </span>
            </div>
          </Link>

          {/* Acciones de Navegación */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
            >
              <ArrowLeft className="size-3.5 shrink-0" />
              <span>Inicio</span>
            </Link>
            <Button
              size="sm"
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-black font-black text-[11px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-3.5 shadow-sm shrink-0 rounded-lg"
            >
              <a href="#afiliarse">
                <Store className="size-3.5 mr-1 shrink-0" />
                <span className="hidden xs:inline">Afiliar mi Negocio</span>
                <span className="xs:hidden">Afiliar</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO PRINCIPAL */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-amber-950/25 via-background to-background py-8 sm:py-14">
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto max-w-4xl px-3 sm:px-6 text-center space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider">
              <Sparkles className="size-3 sm:size-3.5" /> Comercios Aliados & Beneficios Oficiales
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
              Descuentos Exclusivos para la{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Comunidad Aval
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Con tus Tokens activos de Aval Community obtén <strong>descuentos inmediatos de hasta 50%</strong> en
              los mejores lavacares, talleres, repuesteras, restaurantes y gimnasios de Costa Rica.
            </p>

            {/* Badges de Garantía */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 pt-1 text-[11px] sm:text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-1 rounded-full bg-zinc-900/90 border border-border/80 px-2.5 py-1">
                <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
                <span>Válido con Tokens Activos</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-zinc-900/90 border border-border/80 px-2.5 py-1">
                <Zap className="size-3.5 text-amber-400 shrink-0" />
                <span>Canje Directo con Comercio</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-zinc-900/90 border border-border/80 px-2.5 py-1">
                <Percent className="size-3.5 text-primary shrink-0" />
                <span>Sin Costo Adicional</span>
              </div>
            </div>
          </div>
        </section>

        {/* BUSCADOR Y FILTROS */}
        <section className="mx-auto max-w-7xl px-3 sm:px-6 py-5 sm:py-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar taller, lavacar, restaurante, repuestos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-card rounded-xl border-border"
              />
            </div>

            {/* Filtros de Categorías en Píldoras Horizontales */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none touch-pan-x">
              <button
                type="button"
                onClick={() => setFiltroCategoria("todas")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  filtroCategoria === "todas"
                    ? "bg-amber-500 text-black shadow-md font-black"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      filtroCategoria === cat.id
                        ? "bg-amber-500 text-black shadow-md font-black"
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
              <p className="text-sm font-medium">Cargando comercios aliados...</p>
            </div>
          ) : sponsorsFiltrados.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-8 sm:p-12 text-center space-y-3 bg-card/40">
              <Store className="size-12 mx-auto text-muted-foreground/40" />
              <h3 className="font-bold text-base sm:text-lg text-foreground">No se encontraron comercios en esta búsqueda</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Prueba buscando con otro término o categoría. Si eres dueño de un comercio, ¡afíliate gratis!
              </p>
              <Button asChild size="sm" className="bg-amber-500 text-black font-bold">
                <a href="#afiliarse">Afiliar mi Comercio</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsorsFiltrados.map((s) => (
                <div
                  key={s.id}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-gradient-to-b from-card to-zinc-950 p-4 sm:p-5 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${
                    s.destacado
                      ? "border-amber-500/60 ring-1 ring-amber-500/30"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {/* Glow decorativo */}
                  {s.destacado && (
                    <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-amber-500/15 blur-2xl group-hover:bg-amber-500/25 transition-colors" />
                  )}

                  <div className="space-y-3.5">
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
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
                            className="group/img relative size-12 sm:size-14 rounded-xl sm:rounded-2xl overflow-hidden border border-amber-500/40 bg-muted/40 shrink-0 shadow-md cursor-zoom-in transition-all hover:border-amber-400 hover:scale-105 active:scale-95"
                            title="Haz clic para ver la imagen en grande"
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
                              <ZoomIn className="size-3.5 sm:size-4 text-amber-300 drop-shadow" />
                            </div>
                          </button>
                        ) : (
                          <div className="flex size-12 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-400 text-xl sm:text-2xl font-black shadow-inner shrink-0">
                            {getCatInfo(s.categoria).icono}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block truncate">
                            {getCatInfo(s.categoria).label}
                          </span>
                          <h3 className="font-black text-base sm:text-lg text-foreground group-hover:text-amber-400 transition-colors break-words leading-snug">
                            {s.nombreComercio}
                          </h3>
                        </div>
                      </div>

                      {s.destacado && (
                        <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-amber-400 shrink-0">
                          ⭐ TOP SPONSOR
                        </span>
                      )}
                    </div>

                    {/* Badge Principal del Descuento */}
                    <div className="rounded-xl sm:rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-3 sm:p-3.5 space-y-1">
                      <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Percent className="size-3 shrink-0" /> Beneficio Exclusivo Aval
                      </div>
                      <div className="text-sm sm:text-base font-black text-amber-300 leading-snug break-words">
                        {s.descuentoTexto}
                      </div>
                    </div>

                    {/* Descripción */}
                    {s.descripcion && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {s.descripcion}
                      </p>
                    )}

                    {/* Condiciones */}
                    <div className="rounded-xl bg-zinc-900/90 border border-border/60 p-2.5 text-[10px] sm:text-[11px] text-zinc-300 leading-snug">
                      <span className="text-amber-400 font-bold">Cómo canjear:</span> {s.condiciones}
                    </div>
                  </div>

                  {/* Footer con Ubicación y Botón de Canje */}
                  <div className="pt-3.5 mt-3.5 border-t border-border/70 space-y-2.5">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 min-w-0 font-medium text-zinc-300">
                        <MapPin className="size-3.5 text-amber-500 shrink-0" />
                        <span className="break-words">{s.provincia}</span>
                      </span>
                    </div>

                    {/* Botones de Acción Dinámicos según Modalidad */}
                    {s.modalidadCanje === "cupon" ? (
                      <Button
                        type="button"
                        onClick={() => setCuponActivo(s)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs sm:text-sm h-10 shadow-md flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                      >
                        <Ticket className="size-4 shrink-0" /> Ver Cupón Digital Oficial
                      </Button>
                    ) : s.modalidadCanje === "whatsapp" ? (
                      <Button
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm h-10 shadow-md flex items-center justify-center gap-1.5 rounded-xl"
                      >
                        <a
                          href={getWhatsappUrl(s)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageSquare className="size-4 shrink-0" /> Canjear por WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          onClick={() => setCuponActivo(s)}
                          className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xs h-10 shadow-sm flex items-center justify-center gap-1 rounded-xl cursor-pointer"
                        >
                          <Ticket className="size-3.5 shrink-0" /> Cupón Digital
                        </Button>
                        <Button
                          asChild
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-sm flex items-center justify-center gap-1 rounded-xl"
                        >
                          <a
                            href={getWhatsappUrl(s)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageSquare className="size-3.5 shrink-0" /> WhatsApp
                          </a>
                        </Button>
                      </div>
                    )}
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

      {/* MODAL LIGHTBOX DE IMAGEN EN GRANDE */}
      <Dialog open={!!imagenGrande} onOpenChange={(open) => !open && setImagenGrande(null)}>
        <DialogContent className="max-w-2xl bg-zinc-950/95 border-amber-500/40 p-4 sm:p-6 text-foreground backdrop-blur-2xl shadow-2xl">
          <DialogHeader className="pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                {imagenGrande?.categoria}
              </span>
              <DialogTitle className="text-base sm:text-xl font-black text-foreground">
                {imagenGrande?.titulo}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-2 flex items-center justify-center overflow-hidden rounded-2xl bg-black/80 border border-border/50 max-h-[75vh] p-2">
            {imagenGrande?.url && (
              <img
                src={imagenGrande.url}
                alt={imagenGrande.titulo}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CUPÓN DIGITAL Y CANJE OFICIAL */}
      <Dialog open={!!cuponActivo} onOpenChange={(open) => !open && setCuponActivo(null)}>
        <DialogContent className="max-w-lg bg-zinc-950/95 border-amber-500/50 p-4 sm:p-6 text-foreground backdrop-blur-2xl shadow-2xl rounded-2xl sm:rounded-3xl">
          {cuponActivo && (
            <div className="space-y-4">
              <DialogHeader className="pb-2.5 border-b border-border/70 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-black text-amber-400 uppercase tracking-wider">
                    <ShieldCheck className="size-3 text-emerald-400" /> Beneficio Verificado
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">AVAL-SPONSOR-PASS</span>
                </div>
                <DialogTitle className="text-lg sm:text-xl font-black text-foreground mt-1">
                  Cupón Oficial de Descuento
                </DialogTitle>
              </DialogHeader>

              {/* Tarjeta Visual del Cupón */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-950 p-4 sm:p-5 space-y-3 shadow-inner">
                <div className="flex items-center gap-3">
                  {cuponActivo.logoUrl ? (
                    <div className="size-12 rounded-xl overflow-hidden border border-amber-500/30 bg-muted shrink-0">
                      <img src={cuponActivo.logoUrl} alt={cuponActivo.nombreComercio} className="size-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-xl font-bold shrink-0">
                      {getCatInfo(cuponActivo.categoria).icono}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      {getCatInfo(cuponActivo.categoria).label}
                    </span>
                    <h4 className="font-black text-base text-foreground leading-snug break-words">
                      {cuponActivo.nombreComercio}
                    </h4>
                  </div>
                </div>

                {/* Banner de Descuento */}
                <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-3 text-center space-y-0.5">
                  <div className="text-[10px] font-black uppercase text-amber-400">Promoción Otorgada</div>
                  <div className="text-base sm:text-lg font-black text-amber-300 break-words">
                    {cuponActivo.descuentoTexto}
                  </div>
                </div>

                {/* Ubicación y Condiciones */}
                <div className="text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <MapPin className="size-3.5 text-amber-400 shrink-0" />
                    <span>{cuponActivo.provincia}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900/90 border border-border/70 text-[10px] sm:text-[11px] text-zinc-300 leading-snug">
                    <strong className="text-amber-400">Condición de canje:</strong> {cuponActivo.condiciones}
                  </div>
                </div>
              </div>

              {/* Verificación para el Comercio */}
              <div className="space-y-2 rounded-xl bg-muted/30 border border-border/70 p-3">
                <Label className="text-[11px] font-bold text-foreground">
                  Tu Teléfono o Número de Orden Registrada (Opcional):
                </Label>
                <Input
                  placeholder="Ej: 8888-8888 o ORD-12345"
                  value={telefonoClienteCanje}
                  onChange={(e) => setTelefonoClienteCanje(e.target.value)}
                  className="h-9 text-xs bg-background"
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Se incluirá en el mensaje de WhatsApp para que el comercio valide tu compra en el sistema en 2 segundos.
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2 pt-1">
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm h-11 shadow-lg rounded-xl"
                >
                  <a
                    href={getWhatsappUrl(cuponActivo, telefonoClienteCanje)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageSquare className="size-4 mr-2 shrink-0" />
                    Enviar WhatsApp con Verificación
                  </a>
                </Button>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 text-[11px] h-8 text-muted-foreground hover:text-foreground border-border"
                  >
                    <Link to="/validar">
                      <ShieldCheck className="size-3.5 mr-1 text-emerald-400" />
                      Verificar mis Tokens
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCuponActivo(null)}
                    className="text-[11px] h-8 text-muted-foreground hover:text-foreground"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
