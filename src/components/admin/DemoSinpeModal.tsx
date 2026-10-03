import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Mail,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  parsearCorreoBCR,
  generarCorreoSimuladoBCR,
} from "@/lib/sinpe-bcr-parser";
import { registrarPagoPrueba } from "@/lib/sinpe-auto";

interface DemoSinpeModalProps {
  open: boolean;
  onClose: () => void;
  onEjecutadoExitoso: (pagoId: string) => void;
}

export function DemoSinpeModal({ open, onClose, onEjecutadoExitoso }: DemoSinpeModalProps) {
  const [monto, setMonto] = useState("25000");
  const [nombre, setNombre] = useState("Mariana Vargas Chaves");
  const [codigoOrden, setCodigoOrden] = useState(() => `AVAL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [pasoActivo, setPasoActivo] = useState<number | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [verCorreoCrudo, setVerCorreoCrudo] = useState(false);

  if (!open) return null;

  const correoCrudo = generarCorreoSimuladoBCR(parseFloat(monto) || 25000, codigoOrden, nombre);
  const parseado = parsearCorreoBCR(correoCrudo);

  const ejecutarSimulacionCompleta = async () => {
    setProcesando(true);
    setPasoActivo(1);

    try {
      // Paso 1: Simular llegada del correo al buzón
      await new Promise((r) => setTimeout(r, 600));
      setPasoActivo(2);

      // Paso 2: Ejecutar Parser Regex
      await new Promise((r) => setTimeout(r, 700));
      setPasoActivo(3);

      // Paso 3: Insertar en Supabase payments
      await new Promise((r) => setTimeout(r, 600));
      const res = await registrarPagoPrueba({
        amount: parseado.monto,
        sender_name: parseado.clienteOrigen,
        sinpe_reference: parseado.referencia,
        orden_id: parseado.codigoDetectado || codigoOrden,
        status: "confirmed",
      });

      setPasoActivo(4);
      await new Promise((r) => setTimeout(r, 500));

      toast.success("¡Demostración completada con éxito!", {
        description: `Pago de ₡${parseado.monto.toLocaleString("en-US")} procesado por Realtime con referencia #${parseado.referencia}`,
      });

      onEjecutadoExitoso(res.id);
      onClose();
    } catch (err: any) {
      toast.error("Error en la simulación: " + (err.message || "desconocido"));
    } finally {
      setProcesando(false);
      setPasoActivo(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-card p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
              <Sparkles className="size-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                Demostración en Vivo: Checker SINPE Auto
              </h3>
              <p className="text-xs text-muted-foreground">
                Explicación interactiva del flujo de conciliación bancaria automatizada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 1. DIAGRAMA EXPLICATIVO DEL FLUJO */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            ¿Cómo funciona la tecnología? (4 Pasos)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${pasoActivo === 1 ? "border-emerald-500 bg-emerald-500/10 scale-102" : "border-border bg-secondary/40"}`}>
              <div className="flex items-center justify-between">
                <span className="size-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">1</span>
                <Smartphone className="size-3.5 text-muted-foreground" />
              </div>
              <span className="font-bold block text-foreground">Código Único</span>
              <p className="text-[10px] text-muted-foreground leading-tight">
                El checkout asigna un código al cliente para escribir en el <strong>Motivo</strong>.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${pasoActivo === 2 ? "border-emerald-500 bg-emerald-500/10 scale-102" : "border-border bg-secondary/40"}`}>
              <div className="flex items-center justify-between">
                <span className="size-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">2</span>
                <Mail className="size-3.5 text-muted-foreground" />
              </div>
              <span className="font-bold block text-foreground">Correo Banco</span>
              <p className="text-[10px] text-muted-foreground leading-tight">
                El banco (BCR, BAC) emite el email oficial de acreditación al comercio.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${pasoActivo === 3 ? "border-emerald-500 bg-emerald-500/10 scale-102" : "border-border bg-secondary/40"}`}>
              <div className="flex items-center justify-between">
                <span className="size-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">3</span>
                <Code2 className="size-3.5 text-muted-foreground" />
              </div>
              <span className="font-bold block text-foreground">Parser Regex</span>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Se extrae monto, referencia y código sin intervención humana.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${pasoActivo === 4 ? "border-emerald-500 bg-emerald-500/10 scale-102" : "border-border bg-secondary/40"}`}>
              <div className="flex items-center justify-between">
                <span className="size-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">4</span>
                <Zap className="size-3.5 text-muted-foreground" />
              </div>
              <span className="font-bold block text-foreground">Auto-Aprobación</span>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Supabase Realtime notifica en vivo y libera los tokens en 1 segundo.
              </p>
            </div>
          </div>
        </div>

        {/* 2. PARÁMETROS CONFIGURABLES PARA LA PRUEBA */}
        <div className="rounded-xl border border-border bg-secondary/30 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Datos del Pago para Demostración</span>
            <button
              type="button"
              onClick={() => setVerCorreoCrudo(!verCorreoCrudo)}
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              {verCorreoCrudo ? "Ocultar Correo BCR" : "Ver Correo Simulado BCR"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Monto en Colones</label>
              <Input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Nombre Emisor</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Código en Motivo</label>
              <Input
                value={codigoOrden}
                onChange={(e) => setCodigoOrden(e.target.value)}
                className="h-8 font-mono text-xs"
              />
            </div>
          </div>

          {/* Vista previa del correo bancario oficial */}
          {verCorreoCrudo && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">
                Cuerpo del Correo recibido de mensajero@bancobcr.com:
              </span>
              <pre className="p-3 bg-card border border-border text-[11px] font-mono text-foreground rounded-lg whitespace-pre-wrap leading-relaxed">
                {correoCrudo}
              </pre>
            </div>
          )}

          {/* Resultado de la extracción de variables */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs border-t border-border">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Datos Extraídos:</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 font-mono">
              ₡{parseado.monto.toLocaleString("en-US")}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-foreground">
              Ref: #{parseado.referencia}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-primary font-bold">
              Motivo: {parseado.codigoDetectado || codigoOrden}
            </span>
          </div>
        </div>

        {/* 3. BOTÓN DE ACCIÓN PARA DISPARAR LA PRUEBA EN VIVO */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Al presionar el botón se simulará el ciclo completo con sonido y alerta en pantalla.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={procesando}
              className="flex-1 sm:flex-initial text-xs h-9"
            >
              Cerrar
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={ejecutarSimulacionCompleta}
              disabled={procesando}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 gap-2 shadow-md"
            >
              {procesando ? (
                <>
                  <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" />
                  <span>▶️ Ejecutar Demostración en Vivo</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
