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
    "secciones" | "hero" | "vitrina" | "pasos" | "minisorteos" | "paquetes" | "footer"
  >("secciones");

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
        mostrarSeccionAperturaPremios: CONFIG_DEFAULT.mostrarSeccionAperturaPremios,
        mostrarSeccionTermometro: CONFIG_DEFAULT.mostrarSeccionTermometro,
        mostrarSeccionDetallePremios: CONFIG_DEFAULT.mostrarSeccionDetallePremios,
        mostrarSeccionComoFunciona: CONFIG_DEFAULT.mostrarSeccionComoFunciona,
        mostrarSeccionReferidos: CONFIG_DEFAULT.mostrarSeccionReferidos,
        mostrarSeccionSponsors: CONFIG_DEFAULT.mostrarSeccionSponsors,
        mostrarSeccionMiniSorteos: CONFIG_DEFAULT.mostrarSeccionMiniSorteos,
        mostrarSeccionGanadores: CONFIG_DEFAULT.mostrarSeccionGanadores,
        mostrarSeccionFaqs: CONFIG_DEFAULT.mostrarSeccionFaqs,
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
      };
      setBorrador(restaurado);
      toast.info("Valores restablecidos en el borrador. Recuerda hacer clic en 'Guardar Cambios'.");
    }
  };

  const pestanas = [
    { id: "secciones", label: "Control de Secciones (On / Off)", icono: SlidersHorizontal },
    { id: "hero", label: "Apertura & Hero", icono: Sparkles },
    { id: "vitrina", label: "Vitrina de Premio", icono: Award },
    { id: "pasos", label: "3 Pasos (¿Cómo Funciona?)", icono: HelpCircle },
    { id: "minisorteos", label: "Mini-Sorteos Semanales", icono: Fuel },
    { id: "paquetes", label: "Paquetes & Compra", icono: Package },
    { id: "footer", label: "Pie de Página (Footer)", icono: Globe },
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
      {/* 0. SECCIÓN CONTROL DE SECCIONES DE LA LANDING (ON / OFF)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "secciones" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <SlidersHorizontal className="size-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold">Activar, Quitar y Modificar Secciones de la Landing</h3>
                <p className="text-xs text-muted-foreground">
                  Controla con un solo interruptor qué bloques se muestran a tus visitantes en la página principal.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-1">
              {/* 1. Apertura: 3 Premios Destacados */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">1. Apertura: 3 Premios Destacados</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionAperturaPremios !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionAperturaPremios !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Muestra las tarjetas interactivas de los 3 premios principales en la cabecera, con popup modal "Comprá y ganá".
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionAperturaPremios !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionAperturaPremios: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Títulos y Quiénes Somos editables en la pestaña "Apertura & Hero".</span>
                </div>
              </div>

              {/* 2. Barra de Meta y Conteo Regresivo */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">2. Termómetro de Meta y Conteo</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionTermometro !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionTermometro !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Barra luminosa con el porcentaje vendido en vivo y reloj regresivo sincronizado con la fecha oficial del sorteo.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionTermometro !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionTermometro: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Barra en tiempo real en la cabecera bajo los premios.</span>
                </div>
              </div>

              {/* 3. Paquetes de Tokens (Foco Central) */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">3. Zona de Paquetes de Tokens</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionPaquetes === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionPaquetes === true ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Zona de compra de tokens. Al estar apagada, la sección completa desaparece de la landing page para periodos de prelanzamiento o suspenso.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionPaquetes === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionPaquetes: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Edita precios y etiquetas en la pestaña "Paquetes & Compra".</span>
                </div>
              </div>

              {/* 4. Sección ¿Cómo Funciona? (3 Pasos) */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">4. Sección ¿Cómo Funciona? (3 Pasos)</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionComoFunciona !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionComoFunciona !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Explicación rápida del proceso 100% digital, métodos de pago aceptados y validación ante la JPS.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionComoFunciona !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionComoFunciona: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Textos de cada paso configurables en la pestaña "3 Pasos".</span>
                </div>
              </div>

              {/* 5. Detalle Extendido de Premios (Fuera del Bloque) */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">5. Detalle Extendido de Premios</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionDetallePremios !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionDetallePremios !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Bloque completo fuera del hero con selector de pestañas (Ducati, Subaru, Efectivo/PS5) y botones de compra propios.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionDetallePremios !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionDetallePremios: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Permite inspeccionar la ficha técnica sin salir de la página.</span>
                </div>
              </div>

              {/* 6. Multiplicador VIP SuperToken */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">6. Modalidad SuperToken (Bono Cash)</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.supertokenActivo !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.supertokenActivo !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Muestra la opción opcional del multiplicador VIP en efectivo para el 1°, 2° y 3° lugar sumado a sus vehículos.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.supertokenActivo !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, supertokenActivo: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Ajuste de bonos en la sección de Configuración General.</span>
                </div>
              </div>

              {/* 7. Programa de Referidos Unificado */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">7. Programa de Referidos Unificado</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionReferidos !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionReferidos !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Módulo todo-en-uno que reúne dinámica de padrinos, generador de enlace en vivo y tabla de líderes mensual.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionReferidos !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionReferidos: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Modifica los montos de premios por referido en la sección "Referidos".</span>
                </div>
              </div>

              {/* 8. Descuentos en Comercios Afiliados */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">8. Comercios Afiliados & Descuentos</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionSponsors !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionSponsors !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Vitrina de beneficios exclusivos y descuentos de hasta 50% en comercios aliados para los participantes.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionSponsors !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionSponsors: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Administra comercios y cupones en la sección "Comercios / Sponsors".</span>
                </div>
              </div>

              {/* 9. Mini-Sorteos Semanales (Gasolina / Play 5) */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">9. Mini-Sorteos Semanales</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionMiniSorteos === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionMiniSorteos === true ? "Activo" : "Oculto (Recomendado inicio)"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Dinámica de gasolina y PlayStation semanal. Se mantiene apagado por ahora para no competir con el mensaje de tokens.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionMiniSorteos === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionMiniSorteos: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Actívalo cuando tus clientes ya dominen la dinámica principal.</span>
                </div>
              </div>

              {/* 10. Sección de Ganadores y Testimonios */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">10. Ganadores y Testimonios</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionGanadores === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionGanadores === true ? "Activo" : "Oculto (Recomendado inicio)"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Galería de ganadores y testimonios. Oculto para la primera edición hasta tener las primeras entregas oficiales.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionGanadores === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionGanadores: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Se alimenta de testimonios cargados en el panel de Premios.</span>
                </div>
              </div>

              {/* 11. Preguntas Frecuentes (FAQs) */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">11. Preguntas Frecuentes (FAQs)</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSeccionFaqs !== false ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400"}`}>
                        {borrador.mostrarSeccionFaqs !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Acordeón inferior que aclara dudas sobre legalidad notarial, SINPE Móvil y cierre con WhatsApp directo (+506 8634-4772).
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSeccionFaqs !== false}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionFaqs: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 Resuelve objeciones y genera confianza antes del cierre.</span>
                </div>
              </div>

              {/* 12. Sala de Remates VIP */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">12. Sala de Remates & Subastas VIP</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${borrador.mostrarSalaRemates === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"}`}>
                        {borrador.mostrarSalaRemates === true ? "Activo (Público)" : "Desactivada (Recomendado)"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Desactivada para no confundir a los participantes. Al estar apagada, se retira de la navegación pública y la ruta redirige a la compra de tokens.
                    </p>
                  </div>
                  <Switch
                    checked={borrador.mostrarSalaRemates === true}
                    onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSalaRemates: v })}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <span>💡 El foco absoluto se mantiene en que el cliente comprenda cómo adquirir tokens.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="size-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold">Badges Superiores del Hero</h3>
                <p className="text-xs text-muted-foreground">
                  Estas son las píldoras destacadas que aparecen en la parte superior antes del título principal.
                </p>
              </div>
            </div>

            {/* Switches de visibilidad de badges */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Visibilidad de Elementos</p>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <span className="size-2 rounded-full bg-orange-400 inline-block" />
                  Barra de Notificación Superior
                </Label>
                <Switch
                  checked={borrador.mostrarBarraNotificacion !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarBarraNotificacion: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <span className="size-2 rounded-full bg-blue-400 inline-block" />
                  Menú de Navegación (links + botón Comprar)
                </Label>
                <Switch
                  checked={borrador.mostrarNavegacion !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarNavegacion: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <span className="size-2 rounded-full bg-red-400 animate-pulse inline-block" />
                  Badge Sorteo / Estado Oficial
                </Label>
                <Switch
                  checked={borrador.mostrarBadgeSorteo !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarBadgeSorteo: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <Flame className="size-3.5 text-amber-400" />
                  Badge Paquete Más Popular
                </Label>
                <Switch
                  checked={borrador.mostrarBadgePopular !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarBadgePopular: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  Badge Emisión Oficial JPS
                </Label>
                <Switch
                  checked={borrador.mostrarBadgeJPS !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarBadgeJPS: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <span className="size-2 rounded-full bg-amber-400 inline-block" />
                  Termómetro de Meta y Cuenta Regresiva
                </Label>
                <Switch
                  checked={borrador.mostrarSeccionTermometro !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarSeccionTermometro: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2 cursor-pointer">
                  <span className="size-2 rounded-full bg-primary inline-block" />
                  Botones de Compra (CTA) y Garantías del Hero
                </Label>
                <Switch
                  checked={borrador.mostrarCtaHero !== false}
                  onCheckedChange={(v) => setBorrador({ ...borrador, mostrarCtaHero: v })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                <p className="text-[11px] text-muted-foreground">Si lo dejas vacío, calculará el precio automáticamente.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                  <Crown className="size-3.5" /> Badge 3: Multiplicador SuperToken
                </Label>
                <Input
                  value={borrador.heroBadgeSuperToken ?? ""}
                  placeholder="Dejar vacío para cálculo automático con premio configurado"
                  onChange={(e) => setBorrador({ ...borrador, heroBadgeSuperToken: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Ej: SuperToken: Hasta +₡4 000 000 CRC Cash Extra.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-emerald-400">
                  <Fuel className="size-3.5" /> Badge 4: Gasolina y PlayStation Semanal
                </Label>
                <Input
                  value={borrador.heroBadgeGasolina ?? ""}
                  placeholder="⛽ Viernes de Tanque Lleno (₡50k Gasolina) + 🎮 Domingos de Play 5"
                  onChange={(e) => setBorrador({ ...borrador, heroBadgeGasolina: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Texto del banner promocional de los sorteos semanales.</p>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
                  <Store className="size-3.5" /> Badge 5: Comercios Aliados & Descuentos
                </Label>
                <Input
                  value={borrador.heroBadgeComercios ?? ""}
                  placeholder="Descuentos en Comercios ↗"
                  onChange={(e) => setBorrador({ ...borrador, heroBadgeComercios: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Texto del botón que enlaza a /sponsors.</p>
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
      {/* 2. VITRINA SHOWCASE Y BADGES FLOTANTES */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "vitrina" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Award className="size-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold">Badges Flotantes de la Vitrina del Premio</h3>
              <p className="text-xs text-muted-foreground">
                Etiquetas flotantes de alta gama que decoran la foto principal del vehículo en el Hero.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-primary">
                <Key className="size-3.5" /> Badge Superior Izquierdo (Año y Kilometraje)
              </Label>
              <Input
                value={borrador.vitrinaBadgeKm ?? ""}
                placeholder="0 Kilómetros · Año 2026"
                onChange={(e) => setBorrador({ ...borrador, vitrinaBadgeKm: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">Aparece en la esquina superior izquierda con ícono de llave.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                <Crown className="size-3.5" /> Badge Superior Derecho (Bono SuperToken)
              </Label>
              <Input
                value={borrador.vitrinaBadgeSuperToken ?? ""}
                placeholder="Dejar vacío para cálculo automático (Bono +₡4 000 000 CRC con SuperToken)"
                onChange={(e) => setBorrador({ ...borrador, vitrinaBadgeSuperToken: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">Aparece en la esquina superior derecha con corona dorada.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="size-3.5" /> Badge Inferior Derecho (Garantía Legal)
              </Label>
              <Input
                value={borrador.vitrinaBadgeTraspaso ?? ""}
                placeholder="Traspaso y Marchamo Incluidos"
                onChange={(e) => setBorrador({ ...borrador, vitrinaBadgeTraspaso: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">Aparece en la esquina inferior derecha con escudo verde.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-zinc-300">
                <ZoomIn className="size-3.5 text-amber-400" /> Botón Flotante para Ampliar Foto
              </Label>
              <Input
                value={borrador.vitrinaBotonAmpliar ?? ""}
                placeholder="Clic para ampliar en grande"
                onChange={(e) => setBorrador({ ...borrador, vitrinaBotonAmpliar: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">Indica que al hacer clic se abre el lightbox en pantalla completa.</p>
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
      {/* 4. MINI-SORTEOS SEMANALES (VIERNES & DOMINGOS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {seccionActiva === "minisorteos" && (
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
