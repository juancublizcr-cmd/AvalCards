import { useState } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  Flame,
  Crown,
  Fuel,
  Store,
  Key,
  ShieldCheck,
  CheckCircle2,
  Save,
  RotateCcw,
  ExternalLink,
  Layers,
  ArrowRight,
  ZoomIn,
  Package,
  HelpCircle,
  Award,
  Eye,
  EyeOff,
  LayoutGrid,
  Globe,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { upsertConfig, CONFIG_DEFAULT, type Config } from "@/lib/admin-store";

export function DisenoWebSection({
  config,
  setConfig,
}: {
  config: Config;
  setConfig: (c: Config) => void;
}) {
  const [borrador, setBorrador] = useState<Config>(config);
  const [guardando, setGuardando] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<
    "hero" | "paquetes" | "pasos" | "footer" | "opcionales"
  >("hero");

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await upsertConfig(borrador);
      setConfig(borrador);
      toast.success("¡Textos, badges y botones guardados exitosamente!", {
        description: "Los cambios ya son visibles en tiempo real en la página principal.",
      });
    } catch (err) {
      console.error("Error al guardar textos de la web:", err);
      toast.error("Error al guardar los cambios en la base de datos.");
    } finally {
      setGuardando(false);
    }
  };

  const handleRestaurarValores = () => {
    if (confirm("¿Deseas restaurar todos los textos y badges a sus valores predeterminados de fábrica?")) {
      const restaurado: Config = {
        ...borrador,
        mostrarBarraNotificacion: CONFIG_DEFAULT.mostrarBarraNotificacion,
        barraNotificacionTexto: CONFIG_DEFAULT.barraNotificacionTexto,
        mostrarNavegacion: CONFIG_DEFAULT.mostrarNavegacion,
        mostrarBadgeSorteo: CONFIG_DEFAULT.mostrarBadgeSorteo,
        mostrarBadgePopular: CONFIG_DEFAULT.mostrarBadgePopular,
        mostrarBadgeJPS: CONFIG_DEFAULT.mostrarBadgeJPS,
        mostrarSeccionTermometro: CONFIG_DEFAULT.mostrarSeccionTermometro,
        mostrarCtaHero: CONFIG_DEFAULT.mostrarCtaHero,
        heroBadgeEvento: CONFIG_DEFAULT.heroBadgeEvento,
        heroBadgePopular: CONFIG_DEFAULT.heroBadgePopular,
        heroBadgeSuperToken: CONFIG_DEFAULT.heroBadgeSuperToken,
        heroBadgeGasolina: CONFIG_DEFAULT.heroBadgeGasolina,
        heroBadgeComercios: CONFIG_DEFAULT.heroBadgeComercios,
        heroSubtitulo: CONFIG_DEFAULT.heroSubtitulo,
        heroBotonCta: CONFIG_DEFAULT.heroBotonCta,
        heroBotonSecundario: CONFIG_DEFAULT.heroBotonSecundario,
        heroMicroPrueba1: CONFIG_DEFAULT.heroMicroPrueba1,
        heroMicroPrueba2: CONFIG_DEFAULT.heroMicroPrueba2,
        vitrinaBadgeKm: CONFIG_DEFAULT.vitrinaBadgeKm,
        vitrinaBadgeSuperToken: CONFIG_DEFAULT.vitrinaBadgeSuperToken,
        vitrinaBadgeTraspaso: CONFIG_DEFAULT.vitrinaBadgeTraspaso,
        vitrinaBotonAmpliar: CONFIG_DEFAULT.vitrinaBotonAmpliar,
        pasosBadge: CONFIG_DEFAULT.pasosBadge,
        pasosTitulo: CONFIG_DEFAULT.pasosTitulo,
        pasosSubtitulo: CONFIG_DEFAULT.pasosSubtitulo,
        pasosPaso1Titulo: CONFIG_DEFAULT.pasosPaso1Titulo,
        pasosPaso1Desc: CONFIG_DEFAULT.pasosPaso1Desc,
        pasosPaso2Titulo: CONFIG_DEFAULT.pasosPaso2Titulo,
        pasosPaso2Desc: CONFIG_DEFAULT.pasosPaso2Desc,
        pasosPaso3Titulo: CONFIG_DEFAULT.pasosPaso3Titulo,
        pasosPaso3Desc: CONFIG_DEFAULT.pasosPaso3Desc,
        pasosBotonCta: CONFIG_DEFAULT.pasosBotonCta,
        miniSorteoTituloPrincipal: CONFIG_DEFAULT.miniSorteoTituloPrincipal,
        miniSorteoSubtituloPrincipal: CONFIG_DEFAULT.miniSorteoSubtituloPrincipal,
        miniSorteoViernesBadge: CONFIG_DEFAULT.miniSorteoViernesBadge,
        miniSorteoViernesTitulo: CONFIG_DEFAULT.miniSorteoViernesTitulo,
        miniSorteoViernesPremio: CONFIG_DEFAULT.miniSorteoViernesPremio,
        miniSorteoViernesDesc: CONFIG_DEFAULT.miniSorteoViernesDesc,
        miniSorteoViernesAuditoria: CONFIG_DEFAULT.miniSorteoViernesAuditoria,
        miniSorteoDomingosBadge: CONFIG_DEFAULT.miniSorteoDomingosBadge,
        miniSorteoDomingosTitulo: CONFIG_DEFAULT.miniSorteoDomingosTitulo,
        miniSorteoDomingosPremio: CONFIG_DEFAULT.miniSorteoDomingosPremio,
        miniSorteoDomingosDesc: CONFIG_DEFAULT.miniSorteoDomingosDesc,
        miniSorteoDomingosAuditoria: CONFIG_DEFAULT.miniSorteoDomingosAuditoria,
        miniSorteosGarantia1Titulo: CONFIG_DEFAULT.miniSorteosGarantia1Titulo,
        miniSorteosGarantia1Desc: CONFIG_DEFAULT.miniSorteosGarantia1Desc,
        miniSorteosGarantia2Titulo: CONFIG_DEFAULT.miniSorteosGarantia2Titulo,
        miniSorteosGarantia2Desc: CONFIG_DEFAULT.miniSorteosGarantia2Desc,
        miniSorteosGarantia3Titulo: CONFIG_DEFAULT.miniSorteosGarantia3Titulo,
        miniSorteosGarantia3Desc: CONFIG_DEFAULT.miniSorteosGarantia3Desc,
        paquetesBadge: CONFIG_DEFAULT.paquetesBadge,
        paquetesTitulo: CONFIG_DEFAULT.paquetesTitulo,
        paquetesSubtitulo: CONFIG_DEFAULT.paquetesSubtitulo,
        paquetesTokensLabel: CONFIG_DEFAULT.paquetesTokensLabel,
        paquetesBotonComprar: CONFIG_DEFAULT.paquetesBotonComprar,
        paqueteTagPopular: CONFIG_DEFAULT.paqueteTagPopular,
        paqueteTagBest: CONFIG_DEFAULT.paqueteTagBest,
        mostrarTarjetasGarantia: CONFIG_DEFAULT.mostrarTarjetasGarantia,
        garantia1Badge: CONFIG_DEFAULT.garantia1Badge,
        garantia1Titulo: CONFIG_DEFAULT.garantia1Titulo,
        garantia1Desc: CONFIG_DEFAULT.garantia1Desc,
        garantia2Badge: CONFIG_DEFAULT.garantia2Badge,
        garantia2Titulo: CONFIG_DEFAULT.garantia2Titulo,
        garantia2Desc: CONFIG_DEFAULT.garantia2Desc,
        mostrarSeccionAperturaPremios: CONFIG_DEFAULT.mostrarSeccionAperturaPremios,
        mostrarSeccionTermometro: CONFIG_DEFAULT.mostrarSeccionTermometro,
        mostrarSeccionDetallePremios: CONFIG_DEFAULT.mostrarSeccionDetallePremios,
        mostrarSeccionComoFunciona: CONFIG_DEFAULT.mostrarSeccionComoFunciona,
        mostrarSeccionReferidos: CONFIG_DEFAULT.mostrarSeccionReferidos,
        mostrarSeccionSponsors: CONFIG_DEFAULT.mostrarSeccionSponsors,
        mostrarSeccionMiniSorteos: CONFIG_DEFAULT.mostrarSeccionMiniSorteos,
        mostrarSeccionGanadores: CONFIG_DEFAULT.mostrarSeccionGanadores,
        mostrarSeccionFaqs: CONFIG_DEFAULT.mostrarSeccionFaqs,
        mostrarTarjetaDudas: CONFIG_DEFAULT.mostrarTarjetaDudas,
        mostrarSalaRemates: CONFIG_DEFAULT.mostrarSalaRemates,
        heroTituloApertura: CONFIG_DEFAULT.heroTituloApertura,
        heroSubtituloApertura: CONFIG_DEFAULT.heroSubtituloApertura,
        footerMostrarColumnaPlataforma: CONFIG_DEFAULT.footerMostrarColumnaPlataforma,
        footerMostrarImpactoSocial: CONFIG_DEFAULT.footerMostrarImpactoSocial,
        footerMostrarReferidos: CONFIG_DEFAULT.footerMostrarReferidos,
        footerMostrarComercios: CONFIG_DEFAULT.footerMostrarComercios,
        footerMostrarComerciosEnlace: CONFIG_DEFAULT.footerMostrarComerciosEnlace,
        footerMostrarAccesoAdmin: CONFIG_DEFAULT.footerMostrarAccesoAdmin,
        footerMostrarThemeToggle: CONFIG_DEFAULT.footerMostrarThemeToggle,
        footerMostrarLegal: CONFIG_DEFAULT.footerMostrarLegal,
        footerMostrarWhatsApp: CONFIG_DEFAULT.footerMostrarWhatsApp,
        footerInstagram: CONFIG_DEFAULT.footerInstagram,
        footerFacebook: CONFIG_DEFAULT.footerFacebook,
        footerTiktok: CONFIG_DEFAULT.footerTiktok,
        footerYoutube: CONFIG_DEFAULT.footerYoutube,
      };
      setBorrador(restaurado);
      toast.info("Valores restablecidos en el borrador. Recuerda hacer clic en 'Guardar Cambios'.");
    }
  };

  const pestanas = [
    { id: "hero", label: "Apertura & Hero", icono: Sparkles },
    { id: "paquetes", label: "Paquetes & Transparencia", icono: Package },
    { id: "pasos", label: "3 Pasos (¿Cómo Funciona?)", icono: HelpCircle },
    { id: "footer", label: "Pie de Página (Footer)", icono: Globe },
    { id: "opcionales", label: "Mini-Sorteos (Opcional)", icono: Fuel },
  ] as const;

  return (
    <div className="max-w-5xl space-y-6 pb-16">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <SlidersHorizontal className="size-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Textos y Botones de la Web</h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Personaliza en tiempo real cada banner, badge flotante, subtítulo y botón de llamada a la acción (CTA) de la página principal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRestaurarValores}
            className="text-xs text-muted-foreground hover:text-foreground"
            title="Restablecer textos sugeridos de fábrica"
          >
            <RotateCcw className="size-3.5 mr-1.5" /> Restaurar Defaults
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="text-xs"
          >
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5 mr-1.5" /> Ver en Vivo ↗
            </a>
          </Button>

          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={handleGuardar}
            disabled={guardando}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md text-xs px-4 py-2 cursor-pointer"
          >
            {guardando ? (
              <span className="flex items-center gap-1.5">
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="size-3.5" /> Guardar Cambios
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Banner Informativo hacia Centro de Control */}
      <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-primary flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 shrink-0 text-primary" />
          <span>
            <strong>¿Buscas activar o apagar secciones completas de la web?</strong> Ahora todos los interruptores se gestionan de forma unificada desde la pestaña <strong>Centro de Control</strong> en el menú lateral.
          </span>
        </div>
      </div>

      {/* Selector de Sección (Tabs ordenados) */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {pestanas.map((p) => {
          const Icon = p.icono;
          const activa = seccionActiva === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSeccionActiva(p.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activa
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>



      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. SECCIÓN HERO Y BADGES SUPERIORES */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "hero" && (
        <div className="space-y-6">
          {/* Títulos y Subtítulos de la Apertura de 3 Premios */}
          <div className="rounded-2xl border border-amber-500/40 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="size-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-foreground">Apertura: Encabezado de los 3 Premios</h3>
                <p className="text-xs text-muted-foreground">
                  Modifica los textos que encabezan las 3 tarjetas de la apertura en el Hero.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Título de la Apertura</Label>
                <Input
                  value={borrador.heroTituloApertura ?? ""}
                  placeholder="Tres Entregas Espectaculares"
                  onChange={(e) => setBorrador({ ...borrador, heroTituloApertura: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Ej: Tres Entregas Espectaculares</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Subtítulo Descriptivo</Label>
                <Input
                  value={borrador.heroSubtituloApertura ?? ""}
                  placeholder="Con cada paquete adquieres triple oportunidad según las combinaciones oficiales de la JPS."
                  onChange={(e) => setBorrador({ ...borrador, heroSubtituloApertura: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Explicación de la triple oportunidad.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold">Badges Superiores del Hero</h3>
                  <p className="text-xs text-muted-foreground">
                    Píldoras destacadas que aparecen sobre el titular principal.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border">
                💡 Activa o apaga estos badges en <strong>Centro de Control</strong>
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2 pb-2 border-b border-border/50">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-amber-500">
                  <Megaphone className="size-3.5" /> Barra de Notificación Superior (Cintillo Dorado)
                </Label>
                <Input
                  value={borrador.barraNotificacionTexto ?? ""}
                  placeholder="🔥 Edición Especial 2026 · Ventas Abiertas Oficiales"
                  onChange={(e) => setBorrador({ ...borrador, barraNotificacionTexto: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Texto del cintillo superior cuando las ventas están activas. Puedes ocultar o mostrar esta barra completa en <strong>Centro de Control</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="size-3.5" /> Badge 1: Evento Promocional Oficial
                </Label>
                <Input
                  value={borrador.heroBadgeEvento ?? ""}
                  placeholder="Evento Promocional Oficial Costa Rica"
                  onChange={(e) => setBorrador({ ...borrador, heroBadgeEvento: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Texto del primer badge con chispa luminosa.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-amber-500">
                  <Flame className="size-3.5" /> Badge 2: Paquete Más Popular
                </Label>
                <Input
                  value={borrador.heroBadgePopular ?? ""}
                  placeholder="Dejar vacío para cálculo automático (ej. Más Popular: 6 Tokens por ₡8 000)"
                  onChange={(e) => setBorrador({ ...borrador, heroBadgePopular: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Si lo dejas vacío, calculará el precio automáticamente según tus paquetes.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Layers className="size-5 text-primary" />
              <div>
                <h3 className="text-base font-bold">Quiénes Somos, Subtítulo y Botones (CTA)</h3>
                <p className="text-xs text-muted-foreground">
                  Textos persuasivos principales y botones donde hacen clic tus clientes en la cabecera.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">Mostrar Titular y Párrafo Explicativo en la Cabecera</div>
                  <p className="text-[11px] text-muted-foreground">
                    Controla si se muestra el titular principal ("ESTRENA TU VEHÍCULO 0KM...") y el texto descriptivo en la landing page.
                  </p>
                </div>
                <Switch
                  checked={borrador.mostrarHeroTitular === true}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarHeroTitular: v })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-amber-400">
                  Quiénes Somos / Presentación Oficial de la Empresa
                </Label>
                <Textarea
                  rows={3}
                  value={borrador.heroSubtitulo ?? ""}
                  placeholder="Plataforma costarricense de eventos promocionales digitales y sorteos de vehículos de alta gama, diseñada para brindar una experiencia 100% digital, transparente y con total respaldo legal."
                  onChange={(e) => setBorrador({ ...borrador, heroSubtitulo: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Párrafo explicativo debajo del título principal. Transmite confianza, propósito y legalidad institucional.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <ArrowRight className="size-3.5" /> Botón CTA Principal (Comprar / Participar)
                  </Label>
                  <Input
                    value={borrador.heroBotonCta ?? ""}
                    placeholder="🔥 ¡QUIERO PARTICIPAR AHORA!"
                    onChange={(e) => setBorrador({ ...borrador, heroBotonCta: e.target.value })}
                    className="font-bold border-amber-500/50"
                  />
                  <p className="text-[11px] text-muted-foreground">Texto del botón llamativo de compra en el Hero.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold flex items-center gap-1.5">
                    Botón Secundario (Explicación)
                  </Label>
                  <Input
                    value={borrador.heroBotonSecundario ?? ""}
                    placeholder="¿Cómo funciona? ↓"
                    onChange={(e) => setBorrador({ ...borrador, heroBotonSecundario: e.target.value })}
                  />
                  <p className="text-[11px] text-muted-foreground">Texto del botón que baja hacia los 3 pasos.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" /> Micro-Prueba de Confianza 1
                  </Label>
                  <Input
                    value={borrador.heroMicroPrueba1 ?? ""}
                    placeholder="Pago Seguro SINPE y Tarjeta"
                    onChange={(e) => setBorrador({ ...borrador, heroMicroPrueba1: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" /> Micro-Prueba de Confianza 2
                  </Label>
                  <Input
                    value={borrador.heroMicroPrueba2 ?? ""}
                    placeholder="Entrega Formal ante Notario"
                    onChange={(e) => setBorrador({ ...borrador, heroMicroPrueba2: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. SECCIÓN CÓMO FUNCIONA (3 PASOS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "pasos" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <HelpCircle className="size-5 text-primary" />
            <div>
              <h3 className="text-base font-bold">Sección "¿Cómo Funciona?" (3 Pasos de Participación)</h3>
              <p className="text-xs text-muted-foreground">
                Configura los títulos, subtítulos, textos de cada tarjeta y el botón de acción de esta sección explicativa.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-primary">Badge Superior de la Sección</Label>
              <Input
                value={borrador.pasosBadge ?? ""}
                placeholder="Proceso 100% Digital y Transparente"
                onChange={(e) => setBorrador({ ...borrador, pasosBadge: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold">Título Principal</Label>
              <Input
                value={borrador.pasosTitulo ?? ""}
                placeholder="Participa en 3 Simples Pasos"
                onChange={(e) => setBorrador({ ...borrador, pasosTitulo: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <Label className="text-xs font-bold">Subtítulo Explicativo</Label>
              <Input
                value={borrador.pasosSubtitulo ?? ""}
                placeholder="Sin filas ni boletos físicos. Todo queda registrado digitalmente en tu dispositivo."
                onChange={(e) => setBorrador({ ...borrador, pasosSubtitulo: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 grid gap-4 md:grid-cols-3">
            {/* Paso 1 */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="font-mono text-xl font-black text-primary">Paso 01</div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título</Label>
                <Input
                  value={borrador.pasosPaso1Titulo ?? ""}
                  placeholder="Elige tus Tokens"
                  onChange={(e) => setBorrador({ ...borrador, pasosPaso1Titulo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Descripción</Label>
                <Textarea
                  rows={3}
                  value={borrador.pasosPaso1Desc ?? ""}
                  placeholder="Selecciona el paquete digital que prefieras..."
                  onChange={(e) => setBorrador({ ...borrador, pasosPaso1Desc: e.target.value })}
                />
              </div>
            </div>

            {/* Paso 2 */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="font-mono text-xl font-black text-primary">Paso 02</div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título</Label>
                <Input
                  value={borrador.pasosPaso2Titulo ?? ""}
                  placeholder="Paga Seguro con SINPE o Tarjeta"
                  onChange={(e) => setBorrador({ ...borrador, pasosPaso2Titulo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Descripción</Label>
                <Textarea
                  rows={3}
                  value={borrador.pasosPaso2Desc ?? ""}
                  placeholder="Paga por SINPE Móvil oficial, tarjeta, etc..."
                  onChange={(e) => setBorrador({ ...borrador, pasosPaso2Desc: e.target.value })}
                />
              </div>
            </div>

            {/* Paso 3 */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="font-mono text-xl font-black text-primary">Paso 03</div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título</Label>
                <Input
                  value={borrador.pasosPaso3Titulo ?? ""}
                  placeholder="¡Participa con Resultados Oficiales!"
                  onChange={(e) => setBorrador({ ...borrador, pasosPaso3Titulo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Descripción</Label>
                <Textarea
                  rows={3}
                  value={borrador.pasosPaso3Desc ?? ""}
                  placeholder="Tus tokens quedan asignados de inmediato..."
                  onChange={(e) => setBorrador({ ...borrador, pasosPaso3Desc: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="space-y-1.5 max-w-md">
              <Label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ArrowRight className="size-3.5" /> Botón CTA de Conversión (Bajo los 3 Pasos)
              </Label>
              <Input
                value={borrador.pasosBotonCta ?? ""}
                placeholder="Comenzar y Elegir mis Tokens →"
                onChange={(e) => setBorrador({ ...borrador, pasosBotonCta: e.target.value })}
                className="font-bold border-amber-500/50"
              />
              <p className="text-[11px] text-muted-foreground">
                Botón que dirige a la persona a seleccionar su paquete de tokens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MÓDULOS OPCIONALES: MINI-SORTEOS SEMANALES */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "opcionales" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Fuel className="size-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Mini-Sorteos Semanales (Viernes de Gasolina & Domingos de PS5)</h3>
              <p className="text-xs text-muted-foreground">
                Configura los títulos, montos, descripciones y sellos de auditoría de los sorteos secundarios.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Título de la Sección</Label>
              <Input
                value={borrador.miniSorteoTituloPrincipal ?? ""}
                placeholder="⛽ Mini-Sorteos Semanales (Sin Costo Extra)"
                onChange={(e) => setBorrador({ ...borrador, miniSorteoTituloPrincipal: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Subtítulo Descriptivo</Label>
              <Input
                value={borrador.miniSorteoSubtituloPrincipal ?? ""}
                placeholder="Todos los tokens activos participan automáticamente en los sorteos semanales de gasolina y consolas."
                onChange={(e) => setBorrador({ ...borrador, miniSorteoSubtituloPrincipal: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 pt-2">
            {/* Tarjeta 1: Viernes de Gasolina */}
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                  ⛽ Tarjeta 1: Viernes de Gasolina
                </span>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Mini-Sorteo #1
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Badge de Horario / Frecuencia</Label>
                <Input
                  value={borrador.miniSorteoViernesBadge ?? ""}
                  placeholder="Todos los Viernes · 7:30 PM"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoViernesBadge: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título del Mini-Sorteo</Label>
                <Input
                  value={borrador.miniSorteoViernesTitulo ?? ""}
                  placeholder="Viernes de Tanque Lleno"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoViernesTitulo: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-amber-400">Premio / Monto en Grande</Label>
                <Input
                  value={borrador.miniSorteoViernesPremio ?? ""}
                  placeholder="₡50,000 en Gasolina Delta / Uno"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoViernesPremio: e.target.value })}
                  className="font-bold border-amber-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Descripción del Beneficio</Label>
                <Textarea
                  rows={2}
                  value={borrador.miniSorteoViernesDesc ?? ""}
                  placeholder="Llena el tanque de tu vehículo o motocicleta 100% gratis..."
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoViernesDesc: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Sello de Auditoría</Label>
                <Input
                  value={borrador.miniSorteoViernesAuditoria ?? ""}
                  placeholder="Auditado con la emisión oficial de los viernes de la JPS"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoViernesAuditoria: e.target.value })}
                />
              </div>
            </div>

            {/* Tarjeta 2: Domingos de PlayStation 5 */}
            <div className="rounded-2xl border-2 border-sky-500/40 bg-gradient-to-br from-sky-500/10 via-card to-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
                  🎮 Tarjeta 2: Domingos de PS5
                </span>
                <span className="text-[11px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30">
                  Mini-Sorteo #2
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Badge de Horario / Frecuencia</Label>
                <Input
                  value={borrador.miniSorteoDomingosBadge ?? ""}
                  placeholder="Todos los Domingos · 7:30 PM"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoDomingosBadge: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título del Mini-Sorteo</Label>
                <Input
                  value={borrador.miniSorteoDomingosTitulo ?? ""}
                  placeholder="Domingos de PlayStation 5 Extra"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoDomingosTitulo: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-sky-400">Premio / Consola en Grande</Label>
                <Input
                  value={borrador.miniSorteoDomingosPremio ?? ""}
                  placeholder="Consola PS5 o ₡350,000 SINPE"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoDomingosPremio: e.target.value })}
                  className="font-bold border-sky-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Descripción del Beneficio</Label>
                <Textarea
                  rows={2}
                  value={borrador.miniSorteoDomingosDesc ?? ""}
                  placeholder="Estrena una consola PlayStation 5 Slim Digital 0KM sellada..."
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoDomingosDesc: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Sello de Auditoría</Label>
                <Input
                  value={borrador.miniSorteoDomingosAuditoria ?? ""}
                  placeholder="Auditado directamente con la emisión dominical oficial de la JPS"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteoDomingosAuditoria: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 3 Garantías bajo los Mini-Sorteos */}
          <div className="border-t border-border pt-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3 Puntos de Garantía y Transparencia
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 rounded-xl border border-border p-3 bg-secondary/20">
                <Label className="text-xs font-bold">Garantía 1: Título</Label>
                <Input
                  value={borrador.miniSorteosGarantia1Titulo ?? ""}
                  placeholder="100% Automático"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteosGarantia1Titulo: e.target.value })}
                />
                <Label className="text-[11px] text-muted-foreground">Descripción</Label>
                <Textarea
                  rows={2}
                  value={borrador.miniSorteosGarantia1Desc ?? ""}
                  placeholder="Todos los tokens entran automáticamente..."
                  onChange={(e) => setBorrador({ ...borrador, miniSorteosGarantia1Desc: e.target.value })}
                />
              </div>

              <div className="space-y-2 rounded-xl border border-emerald-500/30 p-3 bg-emerald-950/15">
                <Label className="text-xs font-bold text-emerald-400">Garantía 2: Título</Label>
                <Input
                  value={borrador.miniSorteosGarantia2Titulo ?? ""}
                  placeholder="Sigues Jugando por el Carro"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteosGarantia2Titulo: e.target.value })}
                />
                <Label className="text-[11px] text-muted-foreground">Descripción</Label>
                <Textarea
                  rows={2}
                  value={borrador.miniSorteosGarantia2Desc ?? ""}
                  placeholder="Incluso si ganas la gasolina, sigues activo..."
                  onChange={(e) => setBorrador({ ...borrador, miniSorteosGarantia2Desc: e.target.value })}
                />
              </div>

              <div className="space-y-2 rounded-xl border border-border p-3 bg-secondary/20">
                <Label className="text-xs font-bold">Garantía 3: Título</Label>
                <Input
                  value={borrador.miniSorteosGarantia3Titulo ?? ""}
                  placeholder="Depósito SINPE Inmediato"
                  onChange={(e) => setBorrador({ ...borrador, miniSorteosGarantia3Titulo: e.target.value })}
                />
                <Label className="text-[11px] text-muted-foreground">Descripción</Label>
                <Textarea
                  rows={2}
                  value={borrador.miniSorteosGarantia3Desc ?? ""}
                  placeholder="Los números ganadores se notifican por WhatsApp..."
                  onChange={(e) => setBorrador({ ...borrador, miniSorteosGarantia3Desc: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. SECCIÓN PAQUETES Y COMPRA DE TOKENS */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "paquetes" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Package className="size-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold">Sección de Paquetes de Tokens y Botones de Compra</h3>
              <p className="text-xs text-muted-foreground">
                Configura los títulos, subtítulos, etiquetas y el llamado a la acción que aparece en las tarjetas de compra.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-primary">Badge Superior de Paquetes</Label>
              <Input
                value={borrador.paquetesBadge ?? ""}
                placeholder="Elige tu Paquete Digital"
                onChange={(e) => setBorrador({ ...borrador, paquetesBadge: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold">Título Principal de la Sección</Label>
              <Input
                value={borrador.paquetesTitulo ?? ""}
                placeholder="Elige tu paquete de Tokens"
                onChange={(e) => setBorrador({ ...borrador, paquetesTitulo: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <Label className="text-xs font-bold">Subtítulo Explicativo</Label>
              <Input
                value={borrador.paquetesSubtitulo ?? ""}
                placeholder="Más Tokens, más oportunidades. Puedes generarlos al azar o elegir tus números favoritos."
                onChange={(e) => setBorrador({ ...borrador, paquetesSubtitulo: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Etiqueta de Tipo de Producto</Label>
              <Input
                value={borrador.paquetesTokensLabel ?? ""}
                placeholder="Tokens Digitales Oficiales"
                onChange={(e) => setBorrador({ ...borrador, paquetesTokensLabel: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">
                Texto que aparece justo debajo del número de tokens (ej. 6 Tokens Digitales Oficiales).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-primary flex items-center gap-1.5">
                <ArrowRight className="size-3.5" /> Texto del Botón de Compra
              </Label>
              <Input
                value={borrador.paquetesBotonComprar ?? ""}
                placeholder="Adquirir ahora →"
                onChange={(e) => setBorrador({ ...borrador, paquetesBotonComprar: e.target.value })}
                className="font-bold"
              />
              <p className="text-[11px] text-muted-foreground">
                Texto en la parte inferior de cada tarjeta para abrir el modal de selección.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                <Flame className="size-3.5" /> Etiqueta "Más Popular"
              </Label>
              <Input
                value={borrador.paqueteTagPopular ?? ""}
                placeholder="Más popular"
                onChange={(e) => setBorrador({ ...borrador, paqueteTagPopular: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Award className="size-3.5" /> Etiqueta "El Mejor / Más Vendido"
              </Label>
              <Input
                value={borrador.paqueteTagBest ?? ""}
                placeholder="EL MEJOR · MÁS VENDIDO"
                onChange={(e) => setBorrador({ ...borrador, paqueteTagBest: e.target.value })}
              />
            </div>
          </div>

          {/* Tarjetas de Transparencia y Respaldo (Bajo los Paquetes) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" /> Tarjetas de Transparencia y Garantía (Bajo los Paquetes)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Las 2 tarjetas informativas ubicadas directamente debajo de los paquetes de tokens.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {borrador.mostrarTarjetasGarantia !== false ? "Visibles" : "Ocultas"}
                </span>
                <Switch
                  checked={borrador.mostrarTarjetasGarantia !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarTarjetasGarantia: v })}
                />
              </div>
            </div>

            {borrador.mostrarTarjetasGarantia !== false && (
              <div className="space-y-6">
                {/* Meta Mínima de Porcentaje */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="size-4" /> Meta Mínima de Ventas para Sorteo Oficial (%)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Si la venta de tokens es menor a este porcentaje al llegar la fecha oficial, el sorteo sigue abierto y se traslada la fecha.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={10}
                      max={100}
                      value={borrador.porcentajeMinimoSorteo ?? 80}
                      onChange={(e) => setBorrador({ ...borrador, porcentajeMinimoSorteo: Number(e.target.value) || 80 })}
                      className="w-24 font-bold text-center border-amber-500/40"
                    />
                    <span className="font-bold text-sm text-foreground">%</span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Tarjeta 1: Verde (Cierre Inmediato) */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" /> Tarjeta 1 (Verde - Cierre Inmediato)
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Badge Superior</Label>
                      <Input
                        value={borrador.garantia1Badge ?? ""}
                        placeholder={`Si llegamos al ${borrador.porcentajeMinimoSorteo || 80}%`}
                        onChange={(e) => setBorrador({ ...borrador, garantia1Badge: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Título</Label>
                      <Input
                        value={borrador.garantia1Titulo ?? ""}
                        placeholder="Cierre Inmediato del Sorteo"
                        onChange={(e) => setBorrador({ ...borrador, garantia1Titulo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Descripción</Label>
                      <Textarea
                        rows={3}
                        value={borrador.garantia1Desc ?? ""}
                        placeholder={`Al alcanzar el ${borrador.porcentajeMinimoSorteo || 80}% de la meta o más, la edición se cierra y los ganadores se definen oficialmente con la Emisión Oficial de la JPS más cercana.`}
                        onChange={(e) => setBorrador({ ...borrador, garantia1Desc: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Tarjeta 2: Ámbar (Garantía de Cumplimiento) */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <ShieldCheck className="size-4" /> Tarjeta 2 (Ámbar - Garantía de Cumplimiento)
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Badge Superior</Label>
                      <Input
                        value={borrador.garantia2Badge ?? ""}
                        placeholder="Garantía de Cumplimiento"
                        onChange={(e) => setBorrador({ ...borrador, garantia2Badge: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Título</Label>
                      <Input
                        value={borrador.garantia2Titulo ?? ""}
                        placeholder="La Edición Continúa"
                        onChange={(e) => setBorrador({ ...borrador, garantia2Titulo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Descripción</Label>
                      <Textarea
                        rows={3}
                        value={borrador.garantia2Desc ?? ""}
                        placeholder={`Si al vencer el contador aún no se alcanza el ${borrador.porcentajeMinimoSorteo || 80}% mínimo, la edición continúa abierta acumulando ventas y se traslada la fecha de cierre. Todos los tokens pagados conservan 100% su validez.`}
                        onChange={(e) => setBorrador({ ...borrador, garantia2Desc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Popup Oficial: Garantía de Cumplimiento */}
                <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-400" /> Popup Automático de Garantía de Cumplimiento
                      </h5>
                      <p className="text-[11px] text-muted-foreground">
                        Ventana modal que informa a los usuarios cuando la fecha de sorteo se traslada por meta pendiente.
                      </p>
                    </div>
                    <Switch
                      checked={borrador.garantiaModalActivo !== false}
                      onCheckedChange={(v) => setBorrador({ ...borrador, garantiaModalActivo: v })}
                    />
                  </div>
                  {borrador.garantiaModalActivo !== false && (
                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Título del Popup</Label>
                        <Input
                          value={borrador.garantiaModalTitulo ?? ""}
                          placeholder="La Edición Continúa Activa"
                          onChange={(e) => setBorrador({ ...borrador, garantiaModalTitulo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs font-semibold">Mensaje Explicativo</Label>
                        <Textarea
                          rows={3}
                          value={borrador.garantiaModalTexto ?? ""}
                          placeholder="Según nuestra normativa notarial de transparencia, si al vencer la fecha programada la colocación de tokens es menor al porcentaje mínimo requerido para garantizar la entrega de todos los premios, la edición continúa 100% activa hasta alcanzar la meta. Todos los tokens adquiridos conservan su total validez y respaldo legal."
                          onChange={(e) => setBorrador({ ...borrador, garantiaModalTexto: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Pestaña: Pie de Página (Footer) */}
      {seccionActiva === "footer" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Globe className="size-5 text-amber-500" /> Control y Visibilidad del Pie de Página (Footer)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Activa o desactiva en cualquier momento cada enlace o módulo del pie de página público de tu plataforma.
            </p>
          </div>

          {/* Grupo 1: Columna "Plataforma" */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Layers className="size-4" /> Columna "Plataforma"
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Muestra u oculta por completo la columna central "Plataforma" (Adquirir Tokens, Validar Tokens, Checkout y Programas).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.footerMostrarColumnaPlataforma === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                  {borrador.footerMostrarColumnaPlataforma === true ? "Columna Activa" : "Columna Desactivada (Oculta)"}
                </span>
                <Switch
                  checked={borrador.footerMostrarColumnaPlataforma === true}
                  onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarColumnaPlataforma: v })}
                />
              </div>
            </div>

            {borrador.footerMostrarColumnaPlataforma === true && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-muted-foreground font-semibold">
                  Enlaces adicionales dentro de la columna Plataforma:
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Impacto Social */}
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          ❤️ Impacto y Bien Social
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Enlace a la página de causas benéficas y transparencia social (/impacto-social).
                        </p>
                      </div>
                      <Switch
                        checked={borrador.footerMostrarImpactoSocial === true}
                        onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarImpactoSocial: v })}
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold">
                      {borrador.footerMostrarImpactoSocial === true ? (
                        <span className="text-emerald-400">🟢 Visible en Footer</span>
                      ) : (
                        <span className="text-zinc-500">⚪ Desactivado</span>
                      )}
                    </div>
                  </div>

                  {/* Programa de Referidos */}
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          🎁 Programa de Referidos
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Enlace al portal de padrinos, comisiones y tokens de bono (/referidos).
                        </p>
                      </div>
                      <Switch
                        checked={borrador.footerMostrarReferidos === true}
                        onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarReferidos: v })}
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold">
                      {borrador.footerMostrarReferidos === true ? (
                        <span className="text-emerald-400">🟢 Visible en Footer</span>
                      ) : (
                        <span className="text-zinc-500">⚪ Desactivado</span>
                      )}
                    </div>
                  </div>

                  {/* Comercios & Descuentos */}
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          🤝 Comercios & Descuentos
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Enlace a la vitrina de comercios aliados y beneficios (/sponsors).
                        </p>
                      </div>
                      <Switch
                        checked={borrador.footerMostrarComercios === true}
                        onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarComercios: v })}
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold">
                      {borrador.footerMostrarComercios === true ? (
                        <span className="text-emerald-400">🟢 Visible en Footer</span>
                      ) : (
                        <span className="text-zinc-500">⚪ Desactivado</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grupo 2: Barra Inferior (Sub-footer) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <ShieldCheck className="size-4" /> Enlaces de la Barra Inferior (Sub-Footer)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controla los botones discretos que aparecen al lado del selector de tema claro/oscuro.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Selector de Tema Claro / Oscuro */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground">
                      Modo Claro / Oscuro (Icono Sol)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Permite a los usuarios cambiar el tema de la web entre oscuro y claro en la barra inferior.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.footerMostrarThemeToggle === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarThemeToggle: v })}
                  />
                </div>
                <div className="text-[10px] font-mono font-bold">
                  {borrador.footerMostrarThemeToggle === true ? (
                    <span className="text-emerald-400">🟢 Visible en Barra Inferior</span>
                  ) : (
                    <span className="text-zinc-500">⚪ Desactivado (Oculto)</span>
                  )}
                </div>
              </div>

              {/* Acceso Comercios */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground">
                      Enlace "Comercios" en barra inferior
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Acceso rápido al portal de comercios (/comercio) al final de la página.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.footerMostrarComerciosEnlace === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarComerciosEnlace: v })}
                  />
                </div>
                <div className="text-[10px] font-mono font-bold">
                  {borrador.footerMostrarComerciosEnlace === true ? (
                    <span className="text-emerald-400">🟢 Visible en Barra Inferior</span>
                  ) : (
                    <span className="text-zinc-500">⚪ Desactivado (Oculto)</span>
                  )}
                </div>
              </div>

              {/* Acceso Consola Admin */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground">
                      Enlace "Acceso" (Consola Admin) en barra inferior
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Oculta el acceso directo a /admin para mayor discreción visual. Siempre puedes entrar escribiendo /admin en la barra de tu navegador.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.footerMostrarAccesoAdmin === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarAccesoAdmin: v })}
                  />
                </div>
                <div className="text-[10px] font-mono font-bold">
                  {borrador.footerMostrarAccesoAdmin === true ? (
                    <span className="text-emerald-400">🟢 Visible en Barra Inferior</span>
                  ) : (
                    <span className="text-zinc-500">⚪ Desactivado (Oculto - Solo entras por URL /admin)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grupo 3: Legal y Soporte */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="size-4" /> Enlaces Legales y Soporte WhatsApp
              </h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary/20 p-4 flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-foreground">
                    Enlaces Legales (Reglamento, Privacidad, Reembolsos)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Garantizan el respaldo legal y transparencia de la plataforma ante los clientes.
                  </p>
                </div>
                <Switch
                  checked={borrador.footerMostrarLegal !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarLegal: v })}
                />
              </div>

              <div className="rounded-xl border border-border bg-secondary/20 p-4 flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-foreground">
                    Botón de Atención Directa WhatsApp
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Permite a los usuarios contactar a soporte vía WhatsApp con un solo clic.
                  </p>
                </div>
                <Switch
                  checked={borrador.footerMostrarWhatsApp !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, footerMostrarWhatsApp: v })}
                />
              </div>
            </div>

            {/* Número de WhatsApp Oficial para Soporte y FAQs */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <Label className="text-xs font-bold text-foreground">
                  Número Oficial de WhatsApp (Soporte & Sección "¿Tenés Dudas?")
                </Label>
                <span className="text-[11px] text-emerald-500 font-mono font-bold">
                  Vista previa: {borrador.promoWhatsapp ? `+506 ${borrador.promoWhatsapp.replace(/\D/g, "").slice(-8).replace(/(\d{4})(\d{4})/, "$1-$2")}` : "+506 8634-4772"}
                </span>
              </div>
              <Input
                value={borrador.promoWhatsapp || ""}
                onChange={(e) => setBorrador({ ...borrador, promoWhatsapp: e.target.value })}
                placeholder="50686344772 o 8634-4772"
                className="bg-background/80 font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Controla el número de teléfono del botón <strong className="text-foreground">"Chatear por WhatsApp"</strong> en la tarjeta <strong className="text-foreground">"¿Tenés Dudas?"</strong>, el pie de página y la atención en vivo.
              </p>
            </div>

            {/* Redes Sociales Oficiales */}
            <div className="rounded-2xl border-2 border-primary/20 bg-secondary/15 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    📱 Enlaces de Redes Sociales (Pie de Página)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Los íconos solo aparecerán en el footer si la casilla tiene un enlace ingresado.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Instagram */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="text-pink-500 font-bold">📸</span> Instagram
                  </Label>
                  <Input
                    value={borrador.footerInstagram || ""}
                    onChange={(e) => setBorrador({ ...borrador, footerInstagram: e.target.value })}
                    placeholder="https://www.instagram.com/tu_cuenta/"
                    className="bg-background/80 text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Ej: https://www.instagram.com/avalcommunity26/
                  </p>
                </div>

                {/* Facebook */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">📘</span> Facebook
                  </Label>
                  <Input
                    value={borrador.footerFacebook || ""}
                    onChange={(e) => setBorrador({ ...borrador, footerFacebook: e.target.value })}
                    placeholder="https://www.facebook.com/tu_pagina"
                    className="bg-background/80 text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Pega el enlace de la página o perfil de Facebook.
                  </p>
                </div>

                {/* TikTok */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="text-foreground font-bold">🎵</span> TikTok
                  </Label>
                  <Input
                    value={borrador.footerTiktok || ""}
                    onChange={(e) => setBorrador({ ...borrador, footerTiktok: e.target.value })}
                    placeholder="https://www.tiktok.com/@tu_cuenta"
                    className="bg-background/80 text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Dejar vacío si aún no está activo.
                  </p>
                </div>

                {/* YouTube */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="text-red-500 font-bold">▶️</span> YouTube
                  </Label>
                  <Input
                    value={borrador.footerYoutube || ""}
                    onChange={(e) => setBorrador({ ...borrador, footerYoutube: e.target.value })}
                    placeholder="https://www.youtube.com/@tu_canal"
                    className="bg-background/80 text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Dejar vacío si aún no está activo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante inferior para guardar cómodamente */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-primary/40 bg-card/95 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-muted-foreground">
            Recuerda guardar para aplicar los cambios en la tienda pública
          </span>
        </div>

        <Button
          type="button"
          variant="hero"
          size="sm"
          onClick={handleGuardar}
          disabled={guardando}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md text-xs px-6 py-2.5 cursor-pointer"
        >
          {guardando ? (
            <span className="flex items-center gap-1.5">
              <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Guardando...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Save className="size-3.5" /> Guardar Todos los Cambios
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
