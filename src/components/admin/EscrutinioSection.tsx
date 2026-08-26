import { useState } from "react";
import { Calculator, Crown, Loader2, PhoneCall, Search, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buscarGanadores, calcularGanadores, type Ganador } from "@/lib/admin-store";

export function EscrutinioSection() {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [resultado, setResultado] = useState<{ primero: string; segundo: string } | null>(null);
  const [ganadores, setGanadores] = useState<Ganador[] | null>(null);
  const [buscando, setBuscando] = useState(false);

  const ejecutar = () => {
    if (!p1 || !p2 || !p3) {
      toast.error("Ingresa los tres premios del sorteo oficial");
      return;
    }
    const r = calcularGanadores(p1, p2, p3);
    setResultado(r);
    setGanadores(null);
  };

  const buscar = async () => {
    if (!resultado) return;
    setBuscando(true);
    try {
      const g = await buscarGanadores([resultado.primero, resultado.segundo]);
      setGanadores(g);
    } catch (err) {
      console.error(err);
      toast.error("Error al consultar ganadores en la base de datos");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-semibold">Resultados del Sorteo Oficial</h2>
        <p className="text-sm text-muted-foreground">
          El algoritmo combina los bloques del 1° y 2° premio con la última cifra del 3°.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Entrada
            label="1° Premio (2 dígitos)"
            valor={p1}
            onChange={setP1}
            placeholder="10"
            max={2}
          />
          <Entrada
            label="2° Premio (2 dígitos)"
            valor={p2}
            onChange={setP2}
            placeholder="20"
            max={2}
          />
          <Entrada
            label="3° Premio (se usa la última cifra)"
            valor={p3}
            onChange={setP3}
            placeholder="5"
            max={5}
          />
        </div>
        <Button size="xl" className="mt-5 w-full" onClick={ejecutar}>
          <Calculator /> Ejecutar Algoritmo de Sorteo
        </Button>
      </section>

      {resultado ? (
        <section className="grid gap-4 md:grid-cols-2">
          <Resultado
            titulo="Ganador Principal (Fórmula Directa)"
            detalle="1° + 2° + última cifra del 3°"
            sticker={resultado.primero}
          />
          <Resultado
            titulo="Segundo Ganador (Fórmula Invertida)"
            detalle="2° + 1° + última cifra del 3°"
            sticker={resultado.segundo}
          />
        </section>
      ) : null}

      {resultado ? (
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold">Clientes Ganadores Detectados en Base de Datos</h3>
            <Button variant="outline" onClick={() => { void buscar(); }} disabled={buscando}>
              {buscando ? <Loader2 className="size-4 animate-spin" /> : <Search />}{" "}
              {buscando ? "Buscando..." : "Buscar Ganadores"}
            </Button>
          </div>
          {ganadores === null ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Ejecuta la búsqueda para cruzar los stickers ganadores con las compras registradas en Supabase.
            </p>
          ) : ganadores.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Ningún cliente tiene asignados esos stickers.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">ID Orden</th>
                  <th className="px-5 py-3 font-medium">Sticker</th>
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Premio / SuperToken</th>
                  <th className="px-5 py-3 font-medium">Teléfono</th>
                  <th className="px-5 py-3 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {ganadores.map((g) => {
                  const esPrimero = g.sticker === resultado.primero;
                  return (
                    <tr key={`${g.orden.id}-${g.sticker}`} className="border-t border-border">
                      <td className="px-5 py-4 font-mono text-xs">{g.orden.id}</td>
                      <td className="px-5 py-4 font-mono font-bold text-primary">{g.sticker}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold">{g.orden.nombre}</div>
                        <div className="text-xs text-muted-foreground">{g.orden.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold">
                          {esPrimero ? "🏆 1° Lugar (Toyota Prado)" : "🥈 2° Lugar (Moto Deportiva)"}
                        </div>
                        {esPrimero && g.orden.supertoken && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 text-[11px] font-bold text-amber-500 mt-1">
                            <Crown className="size-3" /> +$6,000 USD Cash Adicional
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono">{g.orden.telefono}</td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            toast.success("Notificación enviada", {
                              description: `Se contactó a ${g.orden.nombre} al ${g.orden.telefono}.`,
                            })
                          }
                        >
                          <PhoneCall /> Llamar/Notificar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      ) : null}
    </div>
  );
}

function Entrada({
  label,
  valor,
  onChange,
  placeholder,
  max,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder: string;
  max: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-5 transition-colors focus-within:border-primary">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Input
        value={valor}
        placeholder={placeholder}
        maxLength={max}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="mt-3 h-16 border-0 bg-transparent text-center font-mono text-4xl font-bold tracking-widest shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

function Resultado({
  titulo,
  detalle,
  sticker,
}: {
  titulo: string;
  detalle: string;
  sticker: string;
}) {
  return (
    <div className="rounded-xl border border-primary/40 bg-accent p-6 text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <Trophy className="size-4 text-primary" /> {titulo}
      </div>
      <div className="mt-3 font-mono text-6xl font-bold tracking-widest text-primary">
        {sticker}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{detalle}</p>
    </div>
  );
}