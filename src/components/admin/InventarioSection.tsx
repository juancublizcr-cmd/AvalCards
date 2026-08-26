import { useEffect, useRef, useState } from "react";
import { Database, Gift, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  eliminarInstantaneo,
  upsertInstantaneo,
  upsertInventario,
  upsertSorteo,
  type Inventario,
  type PremioInstantaneo,
  type Sorteo,
} from "@/lib/admin-store";

export function InventarioSection({
  sorteo,
  setSorteo,
  inventario,
  setInventario,
  instantaneos,
  setInstantaneos,
  vendidos,
  reservados,
}: {
  sorteo: Sorteo;
  setSorteo: (s: Sorteo) => void;
  inventario: Inventario | null;
  setInventario: (i: Inventario | null) => void;
  instantaneos: PremioInstantaneo[];
  setInstantaneos: (l: PremioInstantaneo[]) => void;
  vendidos: number;
  reservados: number;
}) {
  const [borrador, setBorrador] = useState<Sorteo>(sorteo);
  const [progreso, setProgreso] = useState(0);
  const [generando, setGenerando] = useState(false);
  const [numero, setNumero] = useState("");
  const [premio, setPremio] = useState("");
  const [agregandoInstantaneo, setAgregandoInstantaneo] = useState(false);
  const [quitandoInstantaneo, setQuitandoInstantaneo] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const total = Math.max(
    0,
    Number(borrador.rangoMax || 0) - Number(borrador.rangoMin || 0) + 1,
  );

  const generar = () => {
    if (generando) return;
    setGenerando(true);
    setProgreso(0);
    timer.current = window.setInterval(() => {
      setProgreso((p) => {
        const next = p + 4;
        if (next >= 100) {
          if (timer.current) window.clearInterval(timer.current);
          const inv: Inventario = {
            total,
            disponibles: Math.max(0, total - vendidos - reservados),
            fecha: new Date().toISOString(),
          };
          void upsertInventario(inv).then(() => {
            setInventario(inv);
          }).catch((err) => {
            console.error(err);
            toast.error("Error al guardar inventario en la base de datos");
          });
          void upsertSorteo(borrador).then(() => {
            setSorteo(borrador);
          }).catch(console.error);
          setGenerando(false);
          toast.success("Inventario generado", {
            description: `${total.toLocaleString("es-CR")} números creados con estado Disponible.`,
          });
          return 100;
        }
        return next;
      });
    }, 40);
  };

  const purgar = async () => {
    try {
      const inv: Inventario = { total: 0, disponibles: 0, fecha: new Date().toISOString() };
      await upsertInventario(inv);
      setInventario(null);
      setProgreso(0);
      toast.error("Inventario purgado", { description: "Todos los números fueron eliminados." });
    } catch (err) {
      console.error(err);
      toast.error("Error al purgar inventario");
    }
  };

  const agregarInstantaneo = async () => {
    const n = numero.replace(/\D/g, "").padStart(5, "0").slice(-5);
    if (!numero.trim() || !premio.trim()) {
      toast.error("Indica el número y el premio");
      return;
    }
    setAgregandoInstantaneo(true);
    try {
      const nuevo: PremioInstantaneo = { numero: n, premio: premio.trim() };
      await upsertInstantaneo(nuevo);
      setInstantaneos([...instantaneos.filter((p) => p.numero !== n), nuevo]);
      setNumero("");
      setPremio("");
      toast.success(`Sticker ${n} premiado con ${premio.trim()}`);
    } catch (err) {
      console.error(err);
      toast.error("Error al agregar premio instantáneo");
    } finally {
      setAgregandoInstantaneo(false);
    }
  };

  const quitarInstantaneo = async (n: string) => {
    setQuitandoInstantaneo(n);
    try {
      await eliminarInstantaneo(n);
      setInstantaneos(instantaneos.filter((p) => p.numero !== n));
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar premio instantáneo");
    } finally {
      setQuitandoInstantaneo(null);
    }
  };

  const disponibles = inventario ? inventario.disponibles : 0;
  const generado = inventario?.total ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-semibold">Configurador del sorteo</h2>
        <p className="text-sm text-muted-foreground">
          Define el rango de números y el precio base antes de generar el inventario.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Rango mínimo</Label>
            <Input
              value={borrador.rangoMin}
              onChange={(e) => setBorrador({ ...borrador, rangoMin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rango máximo</Label>
            <Input
              value={borrador.rangoMax}
              onChange={(e) => setBorrador({ ...borrador, rangoMax: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Precio base por sticker (₡)</Label>
            <Input
              type="number"
              value={borrador.precioBase}
              onChange={(e) => setBorrador({ ...borrador, precioBase: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Total de números</Label>
            <div className="flex h-9 items-center rounded-md border border-border bg-secondary px-3 text-sm font-semibold">
              {total.toLocaleString("es-CR")}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={generar} disabled={generando}>
            <Database /> {generando ? "Generando..." : "Generar Inventario de Stickers"}
          </Button>
          <Button variant="destructive" onClick={() => { void purgar(); }} disabled={generando}>
            <Trash2 /> Purgar inventario
          </Button>
        </div>

        {generando || progreso > 0 ? (
          <div className="mt-4">
            <Progress value={progreso} />
            <p className="mt-2 text-sm text-muted-foreground">
              {progreso}% · {Math.round((total * progreso) / 100).toLocaleString("es-CR")} números
              creados
            </p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Tarjeta label="Disponibles" valor={disponibles} sub={`de ${generado.toLocaleString("es-CR")}`} />
        <Tarjeta label="Reservados" valor={reservados} sub="pendientes de validación" />
        <Tarjeta label="Vendidos" valor={vendidos} sub="compras aprobadas" />
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-semibold">Números premiados instantáneos</h2>
        <p className="text-sm text-muted-foreground">
          Si un cliente recibe uno de estos stickers al azar, verá confeti y el aviso de premio
          instantáneo.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label>Número premiado</Label>
            <Input
              value={numero}
              maxLength={5}
              placeholder="15420"
              className="w-36 font-mono"
              onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="space-y-2">
            <Label>Premio menor</Label>
            <Input
              value={premio}
              placeholder="iPhone 17"
              className="w-56"
              onChange={(e) => setPremio(e.target.value)}
            />
          </div>
          <Button onClick={() => { void agregarInstantaneo(); }} disabled={agregandoInstantaneo}>
            {agregandoInstantaneo ? <Loader2 className="animate-spin" /> : <Plus />}{" "}
            Asignar Números Premiados Instantáneos
          </Button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {instantaneos.map((p) => (
            <div
              key={p.numero}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
            >
              <Gift className="size-4 text-primary" />
              <span className="font-mono font-bold">{p.numero}</span>
              <span className="flex-1 text-sm text-muted-foreground">{p.premio}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { void quitarInstantaneo(p.numero); }}
                disabled={quitandoInstantaneo === p.numero}
              >
                {quitandoInstantaneo === p.numero ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 />
                )}
              </Button>
            </div>
          ))}
          {instantaneos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin premios instantáneos configurados.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Tarjeta({ label, valor, sub }: { label: string; valor: number; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-bold">{valor.toLocaleString("es-CR")}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}