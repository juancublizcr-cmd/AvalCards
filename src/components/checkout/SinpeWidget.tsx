import { useState, useEffect, useRef } from "react";
import { Check, Copy, Loader2, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface SinpeWidgetProps {
  telefono: string;
  monto: number;
  codigo: string;
  onPagoVerificado?: (datos: { referencia: string; monto: number }) => void;
  // Modo demo para presentaciones
  modoDemo?: boolean;
}

export function SinpeWidget({
  telefono,
  monto,
  codigo,
  onPagoVerificado,
  modoDemo = false,
}: SinpeWidgetProps) {
  const [estado, setEstado] = useState<"inicial" | "verificando" | "verificado">("inicial");
  const [segundosRestantes, setSegundosRestantes] = useState(120);
  const [copiado, setCopiado] = useState(false);
  const [pagoDetectado, setPagoDetectado] = useState<{ referencia: string; monto: number } | null>(null);

  const totalSegundos = 120;
  const progreso = ((totalSegundos - segundosRestantes) / totalSegundos) * 100;

  // Formateador con comas exacto al plugin (₡1,000.00)
  const montoFormateado = "₡" + Number(monto || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const copiarCodigo = () => {
    void navigator.clipboard.writeText(codigo);
    setCopiado(true);
    toast.success("Código copiado", {
      description: `Pégalo en el motivo de tu SINPE: ${codigo}`,
    });
    setTimeout(() => setCopiado(false), 2000);
  };

  // Iniciar verificación
  const iniciarVerificacion = () => {
    setEstado("verificando");
    setSegundosRestantes(120);

    if (modoDemo) {
      // En modo demo, simular detección a los 4 segundos
      setTimeout(() => {
        const fakeRef = `${new Date().getFullYear()}${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;
        setPagoDetectado({ referencia: fakeRef, monto });
        setEstado("verificado");
        onPagoVerificado?.({ referencia: fakeRef, monto });
      }, 4000);
    }
  };

  // Timer de cuenta regresiva y polling de Supabase
  useEffect(() => {
    if (estado !== "verificando") return;

    const timer = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEstado("inicial");
          toast.error("Tiempo de espera agotado", {
            description: "Aún no recibimos la notificación. Si ya hiciste el SINPE, puedes adjuntar el comprobante abajo.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Si no es demo, escuchar en Supabase Realtime si entra el pago
    const canal = supabase
      .channel(`sinpe-poll-${codigo}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "payments" },
        (payload: any) => {
          const item = payload.new;
          const refTexto = String(item.sinpe_reference || item.raw_payload || item.orden_id || "").toLowerCase();
          const codigoLimpio = codigo.toLowerCase();

          // Si coincide el código o el monto
          if (refTexto.includes(codigoLimpio) || Number(item.amount) === Number(monto)) {
            const refFinal = item.sinpe_reference || `${item.id}`.slice(0, 12);
            setPagoDetectado({ referencia: refFinal, monto: Number(item.amount) });
            setEstado("verificado");
            onPagoVerificado?.({ referencia: refFinal, monto: Number(item.amount) });
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      void canal.unsubscribe();
    };
  }, [estado, codigo, monto, modoDemo, onPagoVerificado]);

  // Formato mm:ss
  const minutos = String(Math.floor(segundosRestantes / 60)).padStart(2, "0");
  const segundos = String(segundosRestantes % 60).padStart(2, "0");

  // Circunferencia SVG para el reloj circular
  const radio = 34;
  const circunferencia = 2 * Math.PI * radio;
  const dashoffset = circunferencia - (progreso / 100) * circunferencia;

  return (
    <div className="w-full max-w-sm mx-auto bg-white text-zinc-900 rounded-2xl p-5 shadow-xl border border-zinc-200/80 font-sans">
      {/* Cabecera idéntica al plugin */}
      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-zinc-100">
        <div className="size-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Smartphone className="size-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-800 leading-tight">Pago con SINPE Móvil</h4>
          <span className="text-[11px] text-zinc-400">Verificación automática</span>
        </div>
      </div>

      {/* Tarjeta interior blanca con borde */}
      <div className="rounded-xl border border-zinc-200 p-4 space-y-3.5 bg-zinc-50/50">
        {/* PASO 1 */}
        <div className="flex items-start gap-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white font-bold text-[10px] mt-0.5">
            1
          </span>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Transfiere al SINPE Móvil
            </span>
            <span className="text-xl font-black font-sans text-blue-700 tracking-wide block">
              {telefono}
            </span>
          </div>
        </div>

        <div className="border-b border-dashed border-zinc-200" />

        {/* PASO 2 */}
        <div className="flex items-start gap-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white font-bold text-[10px] mt-0.5">
            2
          </span>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Monto Exacto
            </span>
            <span className="text-xl font-black font-sans text-emerald-600 block">
              {montoFormateado}
            </span>
          </div>
        </div>

        <div className="border-b border-dashed border-zinc-200" />

        {/* PASO 3 */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white font-bold text-[10px] mt-0.5">
              3
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Escribe en el Motivo / Detalle
              </span>
            </div>
          </div>

          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-2.5 text-center">
            <code className="font-mono text-base font-black text-blue-800 tracking-wider">
              {codigo}
            </code>
          </div>

          <Button
            type="button"
            onClick={copiarCodigo}
            className="w-full h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm rounded-lg"
          >
            {copiado ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span>{copiado ? "¡Copiado!" : "Copiar"}</span>
          </Button>
        </div>
      </div>

      {/* ESTADOS DE ACCIÓN INFERIOR */}
      <div className="mt-4 pt-1">
        {estado === "inicial" && (
          <Button
            type="button"
            onClick={iniciarVerificacion}
            className="w-full h-11 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-98"
          >
            Ya hice el SINPE Móvil
          </Button>
        )}

        {estado === "verificando" && (
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-2 animate-in fade-in">
            {/* Reloj con anillo circular de progreso */}
            <div className="relative size-20 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radio}
                  className="stroke-zinc-200"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radio}
                  className="stroke-emerald-500 transition-all duration-1000 ease-linear"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-bold text-base text-zinc-800">
                {minutos}:{segundos}
              </span>
            </div>

            <p className="text-xs text-zinc-500 font-medium">
              Verificando notificación del banco...
            </p>
          </div>
        )}

        {estado === "verificado" && pagoDetectado && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-950 space-y-1 animate-in zoom-in-95">
            <div className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
              <Check className="size-4 text-emerald-600 stroke-[3]" />
              <span>¡Pago verificado en el banco!</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              Recibimos <strong>{montoFormateado}</strong> (Ref: <span className="font-mono">{pagoDetectado.referencia}</span>).
            </p>
            <p className="text-[11px] text-emerald-800 font-semibold pt-1">
              ✓ Tu orden está lista para confirmarse de inmediato.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
