import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Coins,
  Crown,
  Dices,
  Edit3,
  PartyPopper,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { fetchNumerosOcupados, guardarSeleccion } from "@/lib/orders";
import {
  buscarPremioInstantaneo,
  fetchConfig,
  type Config,
  CONFIG_DEFAULT,
  type PremioInstantaneo,
} from "@/lib/admin-store";
import { calcularGirosPorTokens } from "@/lib/giros-store";
import { toast } from "sonner";

export type Paquete = { cantidad: number; precio: number };

function generarNumeroDisponible(excluir: Set<string>): string {
  let intentos = 0;
  while (intentos < 5000) {
    const n = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
    if (!excluir.has(n)) {
      return n;
    }
    intentos++;
  }
  return String(Math.floor(Math.random() * 100000)).padStart(5, "0");
}

function generarLoteNumeros(cantidad: number, ocupados: Set<string>): string[] {
  const result: string[] = [];
  const conjunto = new Set<string>(ocupados);
  for (let i = 0; i < cantidad; i++) {
    const num = generarNumeroDisponible(conjunto);
    conjunto.add(num);
    result.push(num);
  }
  return result;
}

export function StickersModal({
  paquete,
  open,
  onOpenChange,
  premioMayor,
  config: configProp,
}: {
  paquete: Paquete | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  premioMayor?: string;
  config?: Config;
}) {
  const [config, setConfig] = useState<Config>(configProp || CONFIG_DEFAULT);
  const [modo, setModo] = useState<"azar" | "manual">("azar");
  const [numeros, setNumeros] = useState<string[]>([]);
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());
  const [supertoken, setSupertoken] = useState(false);
  const [intentos, setIntentos] = useState(5);
  const [buscando, setBuscando] = useState(false);
  const [instantaneo, setInstantaneo] = useState<PremioInstantaneo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (configProp) {
      setConfig(configProp);
    } else {
      void fetchConfig().then((c) => {
        if (c) setConfig(c);
      });
    }
  }, [configProp]);

  const precioBase = paquete?.precio ?? 0;
  const supertokenPrecioTotal = config.supertokenPrecio ?? 1500;
  const costoSupertoken = paquete
    ? paquete.cantidad === 3
      ? supertokenPrecioTotal
      : Math.round((supertokenPrecioTotal / 3) * paquete.cantidad)
    : 0;
  const extraSupertoken = supertoken && paquete ? costoSupertoken : 0;
  const precioFinal = precioBase + extraSupertoken;
  const premioUsd = config.supertokenPremioUsd ?? 6000;

  const celebrar = async (nums: string[]) => {
    try {
      const validos = nums.filter((n) => n && n.length === 5);
      if (validos.length === 0) return;
      const premio = await buscarPremioInstantaneo(validos);
      setInstantaneo(premio);
      if (premio) {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.4 } });
        window.setTimeout(() => confetti({ particleCount: 120, spread: 120, origin: { y: 0.5 } }), 350);
      }
    } catch {
      // Ignorar fallo de red
    }
  };

  useEffect(() => {
    if (open && paquete) {
      void fetchNumerosOcupados().then((oc) => {
        setOcupados(oc);
        const nums = generarLoteNumeros(paquete.cantidad, oc);
        setNumeros(nums);
        setModo("azar");
        setSupertoken(false);
        setBuscando(false);
        setIntentos(config.intentosMax || 5);
        void celebrar(nums);
      });
    }
  }, [open, paquete]);

  const cambiarTodosAzar = () => {
    if (!paquete || intentos <= 0 || buscando) return;
    setBuscando(true);
    window.setTimeout(() => {
      const nums = generarLoteNumeros(paquete.cantidad, ocupados);
      setNumeros(nums);
      void celebrar(nums);
      setIntentos((i) => i - 1);
      setBuscando(false);
    }, 400);
  };

  // Re-roll para un solo token individual
  const regenerarTokenIndividual = (index: number) => {
    const conjunto = new Set<string>(ocupados);
    numeros.forEach((n, i) => {
      if (i !== index && n && n.length === 5) conjunto.add(n);
    });
    const nuevo = generarNumeroDisponible(conjunto);
    const copia = [...numeros];
    copia[index] = nuevo;
    setNumeros(copia);
    void celebrar(copia);
    toast.success(`Token #${index + 1} actualizado a ${nuevo}`);
  };

  // Completar casillas vacías al azar
  const completarVaciosAlAzar = () => {
    if (!paquete) return;
    const conjunto = new Set<string>(ocupados);
    numeros.forEach((n) => {
      if (n && n.length === 5) conjunto.add(n);
    });

    const copia = [...numeros];
    let rellenados = 0;
    for (let i = 0; i < copia.length; i++) {
      if (!copia[i] || copia[i].length < 5) {
        const num = generarNumeroDisponible(conjunto);
        conjunto.add(num);
        copia[i] = num;
        rellenados++;
      }
    }
    setNumeros(copia);
    void celebrar(copia);
    toast.success(`Se autocompletaron ${rellenados} Token(s) al azar`);
  };

  // Limpiar todas las casillas para escribir desde cero
  const limpiarTodasCasillas = () => {
    if (!paquete) return;
    setNumeros(Array.from({ length: paquete.cantidad }, () => ""));
    setInstantaneo(null);
    toast.info("Casillas listas para escribir tus números favoritos");
  };

  const actualizarNumeroManual = (index: number, valor: string) => {
    const limpio = valor.replace(/\D/g, "").slice(0, 5);
    const copia = [...numeros];
    copia[index] = limpio;
    setNumeros(copia);
    if (limpio.length === 5) {
      if (ocupados.has(limpio)) {
        toast.error(`El número ${limpio} ya está reservado por otro cliente.`);
      }
      void celebrar(copia.filter((n) => n && n.length === 5));
    }
  };

  const confirmarCompra = () => {
    if (!paquete) return;

    const incompletos = numeros.some((n) => !n || n.length !== 5);
    if (incompletos) {
      toast.error("Tokens incompletos", {
        description: "Cada Token debe tener exactamente 5 dígitos. Puedes usar 'Completar vacíos al azar'.",
      });
      return;
    }

    const duplicados = new Set(numeros).size !== numeros.length;
    if (duplicados) {
      toast.error("Tokens repetidos", {
        description: "No puedes asignar el mismo número dos veces en la misma orden.",
      });
      return;
    }

    const colisiones = numeros.filter((n) => ocupados.has(n));
    if (colisiones.length > 0) {
      toast.error("Número(s) no disponible(s)", {
        description: `El número ${colisiones.join(", ")} ya fue comprado por otro participante. Elige otro número.`,
      });
      return;
    }

    guardarSeleccion({
      cantidad: paquete.cantidad,
      precio: precioFinal,
      numeros,
      supertoken,
      monto_supertoken: extraSupertoken,
    });
    onOpenChange(false);
    void navigate({ to: "/checkout" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden border-border bg-card p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-display text-2xl sm:text-3xl tracking-wide flex items-center gap-2">
            <Coins className="size-6 text-primary shrink-0" /> Tus Tokens Digitales
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {paquete
              ? `Paquete de ${paquete.cantidad} Tokens · Precio base: ₡${precioBase.toLocaleString("es-CR")}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {/* Upgrade SuperToken ($ USD Cash) con Switch interactivo */}
        {paquete && config.supertokenActivo !== false && (
          <div
            onClick={() => setSupertoken(!supertoken)}
            className={`cursor-pointer rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 select-none overflow-hidden ${
              supertoken
                ? "border-amber-400 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                : "border-border bg-secondary/40 hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div
                  className={`rounded-lg p-2 shrink-0 transition-colors ${
                    supertoken ? "bg-amber-500 text-black shadow-sm" : "bg-secondary text-muted-foreground border border-border"
                  }`}
                >
                  <Crown className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      Activar SuperToken
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide text-amber-400 border border-amber-500/40 shrink-0">
                      +${premioUsd.toLocaleString()} USD CASH
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    Si ganas el <strong>1° Lugar ({premioMayor || "Vehículo 0KM"})</strong>, ¡te llevas también <strong>${premioUsd.toLocaleString()} en efectivo</strong>!
                  </p>
                </div>
              </div>

              {/* Switch ON/OFF y Precio */}
              <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] sm:text-[11px] font-bold ${supertoken ? "text-amber-400" : "text-muted-foreground"}`}>
                    {supertoken ? "ON" : "OFF"}
                  </span>
                  <Switch
                    checked={supertoken}
                    onCheckedChange={setSupertoken}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-bold ${supertoken ? "text-amber-400 font-mono" : "text-muted-foreground"}`}>
                  {supertoken ? `+₡${extraSupertoken.toLocaleString("es-CR")}` : `+₡${costoSupertoken.toLocaleString("es-CR")}`}
                </span>
              </div>
            </div>

            {/* Desglose de Precios */}
            <div className="mt-3 pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <span className="text-[11px] text-muted-foreground">
                {supertoken
                  ? `₡${precioBase.toLocaleString("es-CR")} (Paquete) + ₡${extraSupertoken.toLocaleString("es-CR")} (SuperToken)`
                  : `Opción extra (+$${premioUsd.toLocaleString()} USD si ganas)`}
              </span>
              <span className="font-bold text-foreground text-xs">
                Total: <strong className={supertoken ? "text-amber-400 text-sm font-mono" : "text-primary text-sm font-mono"}>₡{precioFinal.toLocaleString("es-CR")}</strong>
              </span>
            </div>

            {/* Bono Modelo Híbrido */}
            <div className="mt-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> Bono Exclusivo Incluido:
              </span>
              <span className="font-mono font-bold text-white">
                +{calcularGirosPorTokens(paquete?.cantidad || 4)} Giros GRATIS (Ruleta / Raspa)
              </span>
            </div>
          </div>
        )}

        {/* Selector de Modo */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/70 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setModo("azar")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 transition-all ${
              modo === "azar"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Dices className="size-4" /> Al Azar
          </button>
          <button
            type="button"
            onClick={() => setModo("manual")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 transition-all ${
              modo === "manual"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="size-4" /> Elegir / Personalizar
          </button>
        </div>

        {/* Acciones Rápidas en Modo Personalizar */}
        {modo === "manual" && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground text-[11px]">
              Edita casillas o usa las opciones rápidas:
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={completarVaciosAlAzar}
                className="h-7 text-[11px] gap-1 text-primary border-primary/40"
              >
                <Wand2 className="size-3" /> Completar vacíos al azar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={limpiarTodasCasillas}
                className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3" /> Limpiar
              </Button>
            </div>
          </div>
        )}

        {/* Grilla de Números con Re-roll individual */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto overflow-x-hidden p-1">
          {numeros.map((n, i) => {
            const estaOcupado = n.length === 5 && ocupados.has(n);
            const esDuplicado = n.length === 5 && numeros.filter((num) => num === n).length > 1;

            return (
              <div key={i} className="group relative">
                {supertoken && (
                  <span className="absolute top-1 right-1 z-10 flex items-center gap-0.5 rounded bg-amber-500 px-1 py-0.2 text-[8px] font-black text-black shadow-xs pointer-events-none">
                    <Crown className="size-2.5" /> $6K
                  </span>
                )}

                {/* Botón mini para re-roll individual */}
                <button
                  type="button"
                  title="Cambiar solo este número"
                  onClick={() => regenerarTokenIndividual(i)}
                  className="absolute bottom-1 right-1 z-10 flex size-5 items-center justify-center rounded bg-background/80 text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all opacity-70 group-hover:opacity-100"
                >
                  <Dices className="size-3" />
                </button>

                {modo === "azar" ? (
                  <div
                    className={`rounded-lg border py-2.5 text-center font-mono text-sm sm:text-base font-bold tracking-widest transition-all ${
                      supertoken
                        ? "border-amber-400/80 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                        : instantaneo?.numero === n
                          ? "border-success bg-success/15 text-success"
                          : "border-primary/30 bg-[image:var(--gradient-surface)] text-primary"
                    } ${buscando ? "animate-pulse opacity-50" : "opacity-100"}`}
                  >
                    {n || "—"}
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      value={n}
                      maxLength={5}
                      inputMode="numeric"
                      placeholder="00000"
                      onChange={(e) => actualizarNumeroManual(i, e.target.value)}
                      className={`text-center font-mono text-xs sm:text-sm font-bold tracking-wider pr-6 ${
                        estaOcupado || esDuplicado
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : supertoken
                            ? "border-amber-400/80 text-amber-400 bg-amber-500/5"
                            : n.length === 5
                              ? "border-primary/60 text-primary"
                              : "border-border text-foreground"
                      }`}
                    />
                    {estaOcupado && (
                      <span className="absolute -top-2 left-1 bg-destructive text-destructive-foreground text-[8px] font-bold px-1 rounded">
                        Ocupado
                      </span>
                    )}
                    {esDuplicado && !estaOcupado && (
                      <span className="absolute -top-2 left-1 bg-amber-500 text-black text-[8px] font-bold px-1 rounded">
                        Repetido
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {instantaneo && !buscando ? (
          <div className="flex items-center gap-3 rounded-lg border border-success/50 bg-success/10 px-4 py-3 text-sm animate-in fade-in zoom-in-95">
            <PartyPopper className="size-5 text-success shrink-0" />
            <span className="text-xs sm:text-sm">
              <strong className="text-success">¡Felicidades, ganaste una entrega instantánea!</strong>{" "}
              Token {instantaneo.numero} · {instantaneo.premio}
            </span>
          </div>
        ) : null}

        {modo === "azar" ? (
          <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-xs sm:text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-xs">
              <Sparkles className="size-3.5 text-primary" />
              Intentos restantes: <strong className="text-foreground">{intentos}</strong>
            </span>
            <Button
              variant="outlineFire"
              size="sm"
              onClick={cambiarTodosAzar}
              disabled={intentos === 0 || buscando}
              className="h-8 text-xs gap-1"
            >
              <Dices className="size-3.5" /> {buscando ? "Buscando..." : "Cambiar Todos"}
            </Button>
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Puedes escribir 5 dígitos por casilla o pulsar el ícono 🎲 en cualquier casilla para cambiar solo esa.
          </p>
        )}

        <Button
          variant={supertoken ? "hero" : "default"}
          size="xl"
          className={`w-full whitespace-normal text-center h-auto py-3.5 leading-tight ${
            supertoken ? "shadow-[var(--shadow-fire)] font-bold text-sm sm:text-base" : ""
          }`}
          disabled={!paquete || buscando}
          onClick={confirmarCompra}
        >
          <ShieldCheck className="size-5 shrink-0" />
          <span>
            {supertoken
              ? `Confirmar con SuperToken · ₡${precioFinal.toLocaleString("es-CR")}`
              : `Confirmar y Pagar ₡${precioFinal.toLocaleString("es-CR")}`}
          </span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}