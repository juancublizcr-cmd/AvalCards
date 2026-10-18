import { useState, useEffect } from "react";
import {
  Archive,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  Loader2,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  archivarYCrearNuevaEdicion,
  fetchHistorialEdiciones,
  type EdicionArchivada,
  type Sorteo,
} from "@/lib/admin-store";

interface ModalNuevaEdicionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sorteoActual: Sorteo;
  onCompletado: () => void;
  totalOrdenesActuales?: number;
}

export function ModalNuevaEdicion({
  open,
  onOpenChange,
  sorteoActual,
  onCompletado,
  totalOrdenesActuales = 0,
}: ModalNuevaEdicionProps) {
  const [tab, setTab] = useState<"nuevo" | "historial">("nuevo");
  const [nombreNueva, setNombreNueva] = useState("");
  const [fechaNueva, setFechaNueva] = useState("");
  const [horaNueva, setHoraNueva] = useState("19:30");
  const [limpiarOrdenes, setLimpiarOrdenes] = useState(true);
  const [mantenerPremios] = useState(true);
  const [notaArchivo, setNotaArchivo] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [pasoTexto, setPasoTexto] = useState("");
  const [historial, setHistorial] = useState<EdicionArchivada[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  useEffect(() => {
    if (open) {
      // Sugerir fecha 30 días en el futuro
      const hoy = new Date();
      hoy.setDate(hoy.getDate() + 30);
      const isoFecha = hoy.toISOString().split("T")[0];
      setFechaNueva(isoFecha);
      setNombreNueva(
        sorteoActual.nombre
          ? `${sorteoActual.nombre.replace(/\[MOD:[^\]]+\]/g, "").trim()} (Nueva Edición)`
          : "Gran Sorteo Oficial - Edición 1"
      );
      setHoraNueva(sorteoActual.horaSorteo || "19:30");
      setNotaArchivo(
        totalOrdenesActuales > 0
          ? `Cierre de etapa previa (${totalOrdenesActuales} órdenes archivadas) e inicio de nueva edición limpia.`
          : "Inicio de nueva edición oficial."
      );
      void cargarHistorial();
    }
  }, [open, sorteoActual, totalOrdenesActuales]);

  const cargarHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const data = await fetchHistorialEdiciones();
      setHistorial(data);
    } catch {
      // fallback vacio
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleIniciarNuevaEdicion = async () => {
    if (!fechaNueva) {
      toast.error("Debes seleccionar la fecha oficial del nuevo sorteo");
      return;
    }
    if (!nombreNueva.trim()) {
      toast.error("Debes indicar el nombre de la nueva edición");
      return;
    }

    setProcesando(true);
    try {
      setPasoTexto("1/4 Respaldando métricas y archivando edición anterior...");
      await new Promise((r) => setTimeout(r, 400));

      if (limpiarOrdenes) {
        setPasoTexto("2/4 Limpiando órdenes de prueba en Supabase para arrancar en 0...");
      }

      const res = await archivarYCrearNuevaEdicion({
        nombreNuevaEdicion: nombreNueva.trim(),
        nuevaFechaSorteo: fechaNueva,
        nuevaHoraSorteo: horaNueva,
        limpiarOrdenesPrueba: limpiarOrdenes,
        nota: notaArchivo,
      });

      setPasoTexto("3/4 Configurando nueva fecha e inventario de tokens...");
      await new Promise((r) => setTimeout(r, 400));

      setPasoTexto("4/4 ¡Nueva edición iniciada con éxito!");
      await new Promise((r) => setTimeout(r, 300));

      toast.success("¡Nueva Edición Iniciada!", {
        description: limpiarOrdenes
          ? `Se archivó la edición previa, se limpiaron ${res.ordenesBorradas} órdenes de prueba y el sorteo arranca en 0 con los mismos productos.`
          : "Se archivó la edición previa y se actualizó la fecha del nuevo sorteo.",
      });

      onCompletado();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Error al iniciar nueva edición", {
        description: err?.message || "Ocurrió un error al conectar con Supabase.",
      });
    } finally {
      setProcesando(false);
      setPasoTexto("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!procesando) onOpenChange(v); }}>
      <DialogContent className="max-w-2xl w-[95vw] border dark:border-amber-500/40 border-amber-500/50 p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1.5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <RefreshCw className="size-3" /> Ciclo de Vida del Sorteo
            </span>
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTab("nuevo")}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  tab === "nuevo" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Nueva Edición
              </button>
              <button
                type="button"
                onClick={() => { setTab("historial"); void cargarHistorial(); }}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  tab === "historial" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <History className="size-3" /> Historial ({historial.length})
              </button>
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">
            {tab === "nuevo"
              ? "Archivar Sorteo Actual y Comenzar de Cero"
              : "Historial de Ediciones Anteriores"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {tab === "nuevo"
              ? "Guarda el sorteo actual en el historial notarial y arranca una nueva edición limpia con los mismos productos para producción."
              : "Consulta las ediciones archivadas, fecha de realización y total de órdenes registradas."}
          </DialogDescription>
        </DialogHeader>

        {tab === "historial" ? (
          <div className="space-y-4 py-2">
            {cargandoHistorial ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-amber-500" />
              </div>
            ) : historial.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <Archive className="size-8 mx-auto mb-2 opacity-40" />
                <p className="font-bold text-foreground">Aún no hay ediciones archivadas</p>
                <p className="mt-1">
                  Cuando archives el sorteo actual para iniciar uno nuevo, su respaldo quedará guardado aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historial.map((ed, idx) => (
                  <div
                    key={ed.id || idx}
                    className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-500" />
                        {ed.nombre}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                        Archivado: {new Date(ed.fechaArchivado).toLocaleDateString("es-CR")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Fecha Sorteo:</span>
                        <span className="font-bold text-foreground">{ed.fechaSorteo || "N/A"} {ed.horaSorteo || ""}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Órdenes Totales:</span>
                        <span className="font-bold text-foreground">{ed.totalOrdenes}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Tokens Aprobados:</span>
                        <span className="font-bold text-emerald-500">{ed.totalTokensVendidos}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Recaudación:</span>
                        <span className="font-bold text-amber-500">₡{Number(ed.recaudacionEstimada || 0).toLocaleString("es-CR")}</span>
                      </div>
                    </div>

                    {ed.nota && (
                      <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-border/40">
                        "{ed.nota}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Resumen del estado actual a archivar */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-amber-500 flex items-center gap-1.5">
                  <Archive className="size-4" /> Sorteo Actual a Archivar
                </span>
                <span className="text-muted-foreground font-mono">
                  {totalOrdenesActuales} órdenes en base de datos
                </span>
              </div>
              <p className="text-muted-foreground">
                <strong>Nombre:</strong> {sorteoActual.nombre || "Sorteo Oficial"} · <strong>Fecha:</strong> {sorteoActual.fecha || "No definida"}
              </p>
            </div>

            {/* Formulario de la Nueva Edición */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Nombre de la Nueva Edición</Label>
                <Input
                  value={nombreNueva}
                  onChange={(e) => setNombreNueva(e.target.value)}
                  placeholder="Gran Sorteo Oficial - Edición 1"
                  className="font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Calendar className="size-3.5" /> Nueva Fecha Oficial del Sorteo
                  </Label>
                  <Input
                    type="date"
                    value={fechaNueva}
                    onChange={(e) => setFechaNueva(e.target.value)}
                    className="border-primary/60 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                    <Clock className="size-3.5" /> Nueva Hora Oficial
                  </Label>
                  <Input
                    type="time"
                    value={horaNueva}
                    onChange={(e) => setHoraNueva(e.target.value)}
                    className="border-amber-500/60 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Casilla 1: Mantener Productos / Premios */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 flex items-start gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-foreground">
                    Conservar los Mismos Productos y Premios (Recomendado)
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Los vehículos (Toyota Prado, Subaru Impreza, Moto de Alta Cilindrada) y PlayStation 5 se mantienen exactamente iguales con sus fotos, fichas técnicas y niveles. No necesitas volver a crearlos ni subir imágenes.
                  </p>
                </div>
              </div>

              {/* Casilla 2: Limpiar órdenes de prueba para arrancar de 0 */}
              <div className="rounded-xl border border-border bg-secondary/30 p-3.5 flex items-start justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Trash2 className="size-3.5 text-amber-500" />
                    Limpiar órdenes de prueba y arrancar en 0%
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Elimina las {totalOrdenesActuales} órdenes de prueba anteriores de la base de datos tras respaldarlas. Esto pone el termómetro en <strong>0%</strong>, resetea el inventario a <strong>100,000 tokens disponibles</strong> y libera todos los números para compradores reales.
                  </p>
                </div>
                <Switch checked={limpiarOrdenes} onCheckedChange={setLimpiarOrdenes} />
              </div>

              {/* Nota de Archivo */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Nota interna para el historial (Opcional)</Label>
                <Input
                  value={notaArchivo}
                  onChange={(e) => setNotaArchivo(e.target.value)}
                  placeholder="Ej: Fin de pruebas piloto. Apertura oficial al público."
                  className="text-xs"
                />
              </div>
            </div>

            {procesando && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex items-center gap-3">
                <Loader2 className="size-5 animate-spin text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-foreground">{pasoTexto}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={procesando}
            className="w-full sm:w-auto text-xs"
          >
            Cerrar
          </Button>

          {tab === "nuevo" && (
            <Button
              type="button"
              onClick={() => void handleIniciarNuevaEdicion()}
              disabled={procesando || !fechaNueva}
              className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground font-black tracking-wide uppercase hover:opacity-95"
            >
              {procesando ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Procesando...
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" /> Iniciar Nueva Edición desde 0
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
