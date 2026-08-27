import { useEffect, useState } from "react";
import { Coins, Flame, Sparkles, X } from "lucide-react";
import { type Config } from "@/lib/admin-store";
import { fetchOrdenes, type Orden } from "@/lib/orders";

type FomoEvent = {
  id: string;
  tipo: "compra" | "premio";
  titulo: string;
  detalle: string;
  tiempo: string;
  icono: "flame" | "coins" | "sparkles";
};

const EVENTOS_FALLBACK: FomoEvent[] = [
  {
    id: "f1",
    tipo: "compra",
    titulo: "🔥 ¡Nueva Compra Registrada!",
    detalle: "Carlos M. de San José adquirió 4 Tokens (₡5,000)",
    tiempo: "Hace 2 minutos",
    icono: "flame",
  },
  {
    id: "f2",
    tipo: "premio",
    titulo: "🎉 ¡Premio Instantáneo Raspado!",
    detalle: "Andrea R. de Alajuela ganó ₡5,000 en SINPE Móvil",
    tiempo: "Hace 6 minutos",
    icono: "coins",
  },
  {
    id: "f3",
    tipo: "compra",
    titulo: "🎉 ¡Participando por el Gran Premio Mayor!",
    detalle: "Esteban V. de Heredia adquirió 8 Tokens + 2 Giros Gratis",
    tiempo: "Hace 9 minutos",
    icono: "sparkles",
  },
  {
    id: "f4",
    tipo: "premio",
    titulo: "🎡 ¡Premio en Ruleta Express!",
    detalle: "Maritza S. de Cartago ganó +2 Tokens Extras para el Sorteo",
    tiempo: "Hace 14 minutos",
    icono: "coins",
  },
  {
    id: "f5",
    tipo: "compra",
    titulo: "🎁 ¡Referido con Bono de Regalo!",
    detalle: "David Q. de Puntarenas activó +1 Token Extra de su Referente",
    tiempo: "Hace 18 minutos",
    icono: "flame",
  },
];

export function FomoNotifications({ config }: { config: Config }) {
  const [eventos, setEventos] = useState<FomoEvent[]>(EVENTOS_FALLBACK);
  const [eventoActual, setEventoActual] = useState<FomoEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [descartado, setDescartado] = useState(false);

  useEffect(() => {
    if (config.fomoActivo === false || descartado) return;

    let montado = true;
    const cargarOrdenesReales = async () => {
      try {
        const ordenes = await fetchOrdenes();
        if (ordenes && ordenes.length > 0 && montado) {
          const reales: FomoEvent[] = ordenes.slice(0, 8).map((o: Orden, idx: number) => {
            const nombreCorto = o.nombre ? `${o.nombre.split(" ")[0]} ${o.nombre.split(" ")[1]?.charAt(0) || ""}.` : "Participante";
            return {
              id: o.id || `real-${idx}`,
              tipo: "compra",
              titulo: "🔥 ¡Nueva Compra Oficial!",
              detalle: `${nombreCorto} adquirió ${o.cantidad} Tokens (₡${(o.precio || 5000).toLocaleString("es-CR")})`,
              tiempo: `Hace ${Math.floor(Math.random() * 15) + 2} minutos`,
              icono: "flame",
            };
          });
          setEventos([...reales, ...EVENTOS_FALLBACK]);
        }
      } catch {}
    };

    void cargarOrdenesReales();

    return () => {
      montado = false;
    };
  }, [config.fomoActivo, descartado]);

  useEffect(() => {
    if (config.fomoActivo === false || descartado || eventos.length === 0) {
      setVisible(false);
      return;
    }

    let indice = 0;
    // Mostrar el primer evento después de 4 segundos
    const primerTimer = setTimeout(() => {
      setEventoActual(eventos[0]);
      setVisible(true);
    }, 4000);

    // Ocultar después de 6 segundos y rotar cada 28 segundos
    const intervalo = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        indice = (indice + 1) % eventos.length;
        setEventoActual(eventos[indice]);
        setVisible(true);
      }, 1000);
    }, 24000);

    return () => {
      clearTimeout(primerTimer);
      clearInterval(intervalo);
    };
  }, [config.fomoActivo, descartado, eventos]);

  if (config.fomoActivo === false || descartado || !visible || !eventoActual) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      aria-label="Notificaciones de actividad en vivo"
      className="fixed bottom-4 left-4 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-foreground">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          {eventoActual.icono === "flame" ? (
            <Flame className="size-5 text-amber-500 animate-bounce" />
          ) : eventoActual.icono === "coins" ? (
            <Coins className="size-5 text-emerald-400" />
          ) : (
            <Sparkles className="size-5 text-sky-400" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-primary flex items-center gap-1">
              {eventoActual.titulo}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{eventoActual.tiempo}</span>
          </div>
          <p className="text-xs text-foreground/90 font-medium line-clamp-2 mt-0.5">
            {eventoActual.detalle}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verificado en Plataforma Oficial</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setDescartado(true);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Cerrar notificación"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}