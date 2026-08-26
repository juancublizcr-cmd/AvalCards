import { useState } from "react";
import {
  Calculator,
  Download,
  FileText,
  Gift,
  HelpCircle,
  Loader2,
  Palette,
  Play,
  Plus,
  Printer,
  RotateCcw,
  RotateCw,
  Save,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RASPA_DEFAULT,
  RULETA_PREMIOS_DEFAULT,
  upsertSorteo,
  type JuegoModo,
  type PremioRaspa,
  type PremioRuleta,
  type RaspaConfig,
  type Sorteo,
} from "@/lib/admin-store";

export const FRASES_CASI_GANA_SUGERIDAS = [
  { nombre: "¡Uff, por un pelo! Estuviste a punto", icono: "⚡", peso: 20, cat: "🔥 Suspenso" },
  { nombre: "¡Le pegaste al poste! La próxima es la tuya", icono: "🎯", peso: 20, cat: "🔥 Suspenso" },
  { nombre: "¡Caliente, caliente! El premio está cerca", icono: "🔥", peso: 20, cat: "🔥 Suspenso" },
  { nombre: "¡Dos de tres iguales! Casi te lo llevas", icono: "⚡", peso: 20, cat: "🔥 Suspenso" },
  { nombre: "¡Sigue jugando, la suerte te está rondando!", icono: "🍀", peso: 15, cat: "🍀 Motivación" },
  { nombre: "¡Tu momento está por llegar! Intenta otra vez", icono: "✨", peso: 15, cat: "🍀 Motivación" },
  { nombre: "¡Calentando motores! No te rindas", icono: "🪙", peso: 15, cat: "🍀 Motivación" },
  { nombre: "¡La próxima viene con premio!", icono: "⚡", peso: 15, cat: "🍀 Motivación" },
  { nombre: "¡Upa! Casi se canta bingo, ¡dale otra!", icono: "💥", peso: 15, cat: "🇨🇷 Buena Vibra" },
  { nombre: "¡A la vuelta de la esquina! Prueba de nuevo", icono: "🚀", peso: 15, cat: "🇨🇷 Buena Vibra" },
];

export function RaspaSection({
  sorteo,
  setSorteo,
}: {
  sorteo: Sorteo;
  setSorteo: (s: Sorteo) => void;
}) {
  const [borrador, setBorrador] = useState<Sorteo>(sorteo);
  const [tabActiva, setTabActiva] = useState<"raspa" | "ruleta">("raspa");
  const [guardando, setGuardando] = useState(false);
  const [guiaAbierta, setGuiaAbierta] = useState(false);
  const [mostrarSelectorFrases, setMostrarSelectorFrases] = useState(false);

  const raspa = borrador.raspaConfig || RASPA_DEFAULT;
  const modoActivo: JuegoModo = raspa.modo || "ambos";

  // Pesos
  const totalPesosRaspa = (raspa.premios || []).reduce(
    (s, p) => s + (Number(p.probabilidad) || 0),
    0,
  );
  const totalPesosRuleta = (raspa.ruletaPremios || RULETA_PREMIOS_DEFAULT).reduce(
    (s, p) => s + (Number(p.probabilidad) || 0),
    0,
  );

  const actualizarRaspa = <K extends keyof RaspaConfig>(campo: K, valor: RaspaConfig[K]) => {
    const nuevo = { ...raspa, [campo]: valor };
    const nuevoSorteo = { ...borrador, raspaConfig: nuevo };
    setBorrador(nuevoSorteo);
  };

  // Raspa
  const actualizarPremioRaspa = <K extends keyof PremioRaspa>(
    index: number,
    campo: K,
    valor: PremioRaspa[K],
  ) => {
    const lista = [...(raspa.premios || [])];
    lista[index] = { ...lista[index], [campo]: valor };
    actualizarRaspa("premios", lista);
  };

  const agregarPremioRaspa = () => {
    const lista = [...(raspa.premios || [])];
    lista.push({
      id: `r_${Date.now()}`,
      nombre: "₡10,000 en SINPE Móvil",
      icono: "💵",
      probabilidad: 10,
      esGanador: true,
    });
    actualizarRaspa("premios", lista);
  };

  const agregarFraseSugerida = (frase: (typeof FRASES_CASI_GANA_SUGERIDAS)[0]) => {
    const lista = [...(raspa.premios || [])];
    lista.push({
      id: `r_${Date.now()}`,
      nombre: frase.nombre,
      icono: frase.icono,
      probabilidad: frase.peso,
      esGanador: false,
    });
    actualizarRaspa("premios", lista);
    toast.success(`Frase agregada: "${frase.nombre}"`);
    setMostrarSelectorFrases(false);
  };

  const eliminarPremioRaspa = (index: number) => {
    const lista = [...(raspa.premios || [])].filter((_, i) => i !== index);
    actualizarRaspa("premios", lista);
  };

  // Ruleta
  const ruletaLista = raspa.ruletaPremios || RULETA_PREMIOS_DEFAULT;
  const actualizarPremioRuleta = <K extends keyof PremioRuleta>(
    index: number,
    campo: K,
    valor: PremioRuleta[K],
  ) => {
    const lista = [...ruletaLista];
    lista[index] = { ...lista[index], [campo]: valor };
    actualizarRaspa("ruletaPremios", lista);
  };

  const agregarPremioRuleta = () => {
    const lista = [...ruletaLista];
    lista.push({
      id: `w_${Date.now()}`,
      nombre: "₡10,000 SINPE",
      icono: "💵",
      color: "#ea580c",
      probabilidad: 10,
      esGanador: true,
    });
    actualizarRaspa("ruletaPremios", lista);
  };

  const eliminarPremioRuleta = (index: number) => {
    const lista = [...ruletaLista].filter((_, i) => i !== index);
    actualizarRaspa("ruletaPremios", lista);
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      await upsertSorteo(borrador);
      setSorteo(borrador);
      toast.success("¡Configuración de Juegos Express guardada con éxito!", {
        description: `Modo: ${raspa.activo ? modoActivo.toUpperCase() : "DESACTIVADO"}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar configuración en Supabase");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta Principal de Control Maestro */}
      <section className="rounded-2xl border-2 border-amber-500/50 bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 font-display text-2xl text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-black text-base font-bold">
                🎁
              </span>
              Control Maestro: Juegos Digitales Express (Raspa y Ruleta)
            </div>
            <p className="text-xs text-muted-foreground">
              Configura los juegos instantáneos para ganar premios en efectivo por SINPE Móvil o Tokens oficiales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setGuiaAbierta(true)}
              className="gap-2 border-2 border-emerald-500 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 font-bold shadow-sm"
            >
              <FileText className="size-5 text-emerald-500" />
              📄 Guía de Probabilidades (PDF)
            </Button>

            <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-500/40 bg-secondary/60 px-4 py-2 shadow-xs">
              <div className="text-right">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Estado General
                </span>
                <span
                  className={`text-xs font-black ${raspa.activo ? "text-emerald-500" : "text-destructive"}`}
                >
                  {raspa.activo ? "🟢 ACTIVADO" : "🔴 DESACTIVADO"}
                </span>
              </div>
              <Switch
                checked={raspa.activo}
                onCheckedChange={(v) => actualizarRaspa("activo", v)}
              />
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={guardar}
              disabled={guardando}
              className="shadow-[var(--shadow-fire)] font-bold gap-2"
            >
              {guardando ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
              Guardar Cambios
            </Button>
          </div>
        </div>

        {/* SELECTOR DE MODO DE JUEGO EXPRESS */}
        <div className="bg-secondary/40 p-5 rounded-2xl border border-border space-y-3">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Selector de Dinámica Activa en la Web
          </Label>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => actualizarRaspa("modo", "ambos")}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                modoActivo === "ambos"
                  ? "border-amber-500 bg-amber-500/15 shadow-md"
                  : "border-border bg-card hover:border-amber-400/50"
              }`}
            >
              <span className="text-3xl">✨</span>
              <div>
                <span className="block font-display text-base font-bold text-foreground">
                  Ambos Juegos Activos
                </span>
                <span className="text-[11px] text-muted-foreground">
                  El cliente elige en la portada si jugar Raspa o Ruleta.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => actualizarRaspa("modo", "raspa")}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                modoActivo === "raspa"
                  ? "border-amber-500 bg-amber-500/15 shadow-md"
                  : "border-border bg-card hover:border-amber-400/50"
              }`}
            >
              <span className="text-3xl">🎁</span>
              <div>
                <span className="block font-display text-base font-bold text-foreground">
                  Solo Raspa y Gana
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Abre directamente la tarjeta para raspar con el dedo/mouse.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => actualizarRaspa("modo", "ruleta")}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                modoActivo === "ruleta"
                  ? "border-emerald-500 bg-emerald-500/15 shadow-md"
                  : "border-border bg-card hover:border-emerald-400/50"
              }`}
            >
              <span className="text-3xl">🎡</span>
              <div>
                <span className="block font-display text-base font-bold text-foreground">
                  Solo Ruleta de la Fortuna
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Abre directamente la rueda de casino giratoria.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* PESTAÑAS DE CONFIGURACIÓN RASPA VS RULETA */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setTabActiva("raspa")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              tabActiva === "raspa"
                ? "bg-amber-500 text-black shadow-md"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gift className="size-4" /> 1. Configurar Raspa y Gana
          </button>

          <button
            type="button"
            onClick={() => setTabActiva("ruleta")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              tabActiva === "ruleta"
                ? "bg-emerald-500 text-black shadow-md"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <RotateCw className="size-4" /> 2. Configurar Ruleta de la Fortuna
          </button>
        </div>

        {/* TAB 1: RASPA Y GANA */}
        {tabActiva === "raspa" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Formulario Raspa */}
            <div className="grid gap-4 sm:grid-cols-3 bg-secondary/30 p-5 rounded-xl border border-border">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Precio por Tarjeta (Colones CRC)</Label>
                <Input
                  type="number"
                  value={raspa.precio}
                  onChange={(e) => actualizarRaspa("precio", Number(e.target.value))}
                  placeholder="1000"
                  className="font-mono font-bold"
                />
                <span className="text-[10px] text-muted-foreground">Costo por cada raspadita.</span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título de la Raspadita</Label>
                <Input
                  value={raspa.titulo}
                  onChange={(e) => actualizarRaspa("titulo", e.target.value)}
                  placeholder="Raspa y Gana Express"
                  className="font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Subtítulo / Instrucción</Label>
                <Input
                  value={raspa.subtitulo}
                  onChange={(e) => actualizarRaspa("subtitulo", e.target.value)}
                  placeholder="¡Gana dinero en SINPE al instante!"
                />
              </div>
            </div>

            {/* Gestor Premios Raspa */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" /> Premios de la Raspadita ({raspa.premios?.length || 0})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Suma total de pesos: <strong className="text-amber-500 font-mono">{totalPesosRaspa}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarSelectorFrases(!mostrarSelectorFrases)}
                    className="gap-1.5 border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 font-bold"
                  >
                    <Zap className="size-4" /> ⚡ Insertar Frase Sugerida de "Casi Gana"
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={agregarPremioRaspa}
                    className="gap-1.5 border-amber-500/40 text-amber-500 hover:bg-amber-500/10 font-semibold"
                  >
                    <Plus className="size-4" /> + Agregar Premio
                  </Button>
                </div>
              </div>

              {mostrarSelectorFrases && (
                <div className="rounded-2xl border-2 border-yellow-500/50 bg-secondary/80 p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        💡 10 Frases Psicológicas Listas para Agregar (Efecto "Por Poquito"):
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Haz clic en cualquiera para añadirla con su emoji y peso:
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setMostrarSelectorFrases(false)}>
                      Cerrar
                    </Button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {FRASES_CASI_GANA_SUGERIDAS.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => agregarFraseSugerida(f)}
                        className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border bg-card hover:border-amber-400 hover:bg-amber-500/10 text-left transition-all group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl group-hover:scale-125 transition-transform">{f.icono}</span>
                          <div>
                            <span className="block text-xs font-bold text-foreground group-hover:text-amber-500">
                              {f.nombre}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{f.cat} · Sugerido: {f.peso} pts</span>
                          </div>
                        </div>
                        <Plus className="size-4 text-muted-foreground group-hover:text-amber-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(raspa.premios || []).map((p, idx) => {
                  const pesoNum = Number(p.probabilidad) || 0;
                  const pctReal = totalPesosRaspa > 0 ? ((pesoNum / totalPesosRaspa) * 100).toFixed(1) : "0.0";

                  return (
                    <div
                      key={p.id || idx}
                      className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3 relative shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-3xl">{p.icono}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => actualizarPremioRaspa(idx, "esGanador", !p.esGanador)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                              p.esGanador
                                ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-zinc-700/50 text-zinc-400 border border-zinc-600 hover:bg-zinc-700"
                            }`}
                          >
                            {p.esGanador ? "🏆 PREMIO GANADOR" : "⚡ CASI GANA (NO PAGA)"}
                          </button>
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
                          <Label className="text-xs">Emoji</Label>
                          <Input
                            value={p.icono}
                            onChange={(e) => actualizarPremioRaspa(idx, "icono", e.target.value)}
                            className="text-xs text-center font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">Peso / Prob.</Label>
                            <span className="text-[10px] font-mono font-bold text-amber-500">{pctReal}%</span>
                          </div>
                          <Input
                            type="number"
                            value={p.probabilidad}
                            onChange={(e) => actualizarPremioRaspa(idx, "probabilidad", Number(e.target.value))}
                            className="text-xs font-mono text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RULETA DE LA FORTUNA */}
        {tabActiva === "ruleta" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Formulario Ruleta */}
            <div className="grid gap-4 sm:grid-cols-2 bg-secondary/30 p-5 rounded-xl border border-border">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Título de la Ruleta</Label>
                <Input
                  value={raspa.ruletaTitulo || "Ruleta de la Fortuna Express"}
                  onChange={(e) => actualizarRaspa("ruletaTitulo", e.target.value)}
                  placeholder="Ruleta de la Fortuna Express"
                  className="font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Subtítulo / Instrucción</Label>
                <Input
                  value={raspa.ruletaSubtitulo || "¡Gira la ruleta y gana premios en SINPE al instante!"}
                  onChange={(e) => actualizarRaspa("ruletaSubtitulo", e.target.value)}
                  placeholder="¡Gira la ruleta y gana premios en SINPE al instante!"
                />
              </div>
            </div>

            {/* Gestor Sectores Ruleta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <RotateCw className="size-4 text-emerald-500" /> Sectores de la Ruleta ({ruletaLista.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Suma total de pesos: <strong className="text-emerald-500 font-mono">{totalPesosRuleta}</strong>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={agregarPremioRuleta}
                  className="gap-1.5 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 font-semibold"
                >
                  <Plus className="size-4" /> + Agregar Sector a la Ruleta
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ruletaLista.map((p, idx) => {
                  const pesoNum = Number(p.probabilidad) || 0;
                  const pctReal = totalPesosRuleta > 0 ? ((pesoNum / totalPesosRuleta) * 100).toFixed(1) : "0.0";

                  return (
                    <div
                      key={p.id || idx}
                      className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3 relative shadow-xs"
                      style={{ borderTop: `4px solid ${p.color || "#ea580c"}` }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xl">{p.icono}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => actualizarPremioRuleta(idx, "esGanador", !p.esGanador)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                              p.esGanador
                                ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                                : "bg-zinc-700/50 text-zinc-400 border border-zinc-600"
                            }`}
                          >
                            {p.esGanador ? "🏆 GANA" : "⚡ NO PAGA"}
                          </button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-6 px-1.5 text-xs"
                            onClick={() => eliminarPremioRuleta(idx)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px]">Texto del Sector</Label>
                        <Input
                          value={p.nombre}
                          onChange={(e) => actualizarPremioRuleta(idx, "nombre", e.target.value)}
                          placeholder="₡50,000 SINPE"
                          className="text-xs font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px]">Emoji</Label>
                          <Input
                            value={p.icono}
                            onChange={(e) => actualizarPremioRuleta(idx, "icono", e.target.value)}
                            className="text-xs text-center font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Color</Label>
                          <input
                            type="color"
                            value={p.color || "#ea580c"}
                            onChange={(e) => actualizarPremioRuleta(idx, "color", e.target.value)}
                            className="w-full h-8 rounded border border-border cursor-pointer bg-transparent"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px]">Peso</Label>
                            <span className="text-[9px] font-mono font-bold text-emerald-500">{pctReal}%</span>
                          </div>
                          <Input
                            type="number"
                            value={p.probabilidad}
                            onChange={(e) => actualizarPremioRuleta(idx, "probabilidad", Number(e.target.value))}
                            className="text-xs font-mono text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="hero"
            size="lg"
            onClick={guardar}
            disabled={guardando}
            className="shadow-[var(--shadow-fire)] font-bold gap-2"
          >
            {guardando ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
            Guardar Configuración de Juegos Express
          </Button>
        </div>
      </section>

      {/* Modal con la Guía Oficial y Descarga en PDF */}
      <Dialog open={guiaAbierta} onOpenChange={setGuiaAbierta}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-border bg-card p-6">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 w-fit">
              <FileText className="size-3.5" /> Guía Técnica de Operación y Rentabilidad
            </div>
            <DialogTitle className="font-display text-2xl tracking-wide mt-2">
              Control de Probabilidades, Psicología y Frases del Raspa y Ruleta
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm text-foreground pt-2 leading-relaxed">
            <div className="rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 p-5 space-y-3">
              <h4 className="font-bold text-base text-amber-500 flex items-center gap-2">
                🧠 La Psicología del "Efecto Por Poquito" (Near-Miss Effect):
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed">
                Tener varias frases diferentes es <strong>mucho más emocionante y entretenido</strong>, porque hace que el juego se sienta vivo, dinámico y nunca repetitivo. Cuando el cliente lee un mensaje motivador y divertido, su cerebro siente que la victoria está cerca y le dan ganas de raspar o girar la siguiente.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Button
                variant="hero"
                className="flex-1 gap-2"
                onClick={() => window.open("/GUIA_PROBABILIDADES_RASPA_Y_GANA.html", "_blank")}
              >
                <Printer className="size-4" /> Abrir / Imprimir Guía Oficial en PDF
              </Button>
              <Button variant="outline" onClick={() => setGuiaAbierta(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
