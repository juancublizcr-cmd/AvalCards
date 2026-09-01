import { useState } from "react";
import { Calculator, Crown, Dices, Loader2, MessageCircle, PhoneCall, Search, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buscarGanadores, calcularGanadores, calcularGanadoresSerieNumero, type Ganador } from "@/lib/admin-store";

type ModoEscrutinio = "serie_numero" | "algoritmo_combinado";

export function EscrutinioSection() {
  const [modo, setModo] = useState<ModoEscrutinio>("serie_numero");

  // Modo Serie y Número
  const [s1, setS1] = useState("");
  const [n1, setN1] = useState("");
  const [s2, setS2] = useState("");
  const [n2, setN2] = useState("");
  const [s3, setS3] = useState("");
  const [n3, setN3] = useState("");

  // Modo Algoritmo Combinado
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  // Resultados
  const [resultado, setResultado] = useState<{ primero: string; segundo: string; tercero?: string } | null>(null);
  const [ganadores, setGanadores] = useState<Ganador[] | null>(null);
  const [buscando, setBuscando] = useState(false);

  const ejecutar = async () => {
    if (modo === "serie_numero") {
      if (!s1 || !n1) {
        toast.error("Ingresa al menos la Serie y Número del 1° Premio de la Lotería Nacional");
        return;
      }
      const r = calcularGanadoresSerieNumero(s1, n1, s2, n2, s3, n3);
      setResultado(r);
      setGanadores(null);
      await buscarResultados([r.primero, r.segundo, r.tercero].filter(Boolean));
    } else {
      if (!p1 || !p2 || !p3) {
        toast.error("Ingresa los tres premios del sorteo oficial");
        return;
      }
      const r = calcularGanadores(p1, p2, p3);
      setResultado(r);
      setGanadores(null);
      await buscarResultados([r.primero, r.segundo]);
    }
  };

  const buscarResultados = async (stickers: string[]) => {
    if (stickers.length === 0) return;
    setBuscando(true);
    try {
      const g = await buscarGanadores(stickers);
      setGanadores(g);
      if (g.length > 0) {
        toast.success(`¡Se encontraron ${g.length} cliente(s) ganador(es)!`, {
          description: "Revisa la lista inferior para contactarlos.",
        });
      } else {
        toast.info("Escrutinio completado: Ningún cliente tiene esos números asignados.", {
          description: "Los números premiados quedaron en inventario disponible.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al consultar ganadores en la base de datos");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. SELECTOR DE MODALIDAD DE ESCRUTINIO */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Trophy className="size-5 text-primary" /> Modalidad de Escrutinio del Sorteo
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona la fórmula oficial para determinar las combinaciones ganadoras según la Lotería Nacional (JPS).
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setModo("serie_numero");
              setResultado(null);
              setGanadores(null);
            }}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
              modo === "serie_numero"
                ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
            }`}
          >
            <div className={`flex size-10 items-center justify-center rounded-xl font-bold text-lg shrink-0 ${modo === "serie_numero" ? "bg-primary text-black" : "bg-secondary text-foreground"}`}>
              🇨🇷
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                Serie y Número (Lotería Nacional)
                <span className="rounded-full bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.2">
                  Oficial JPS
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                La Serie de 3 dígitos se junta con el Número de 2 dígitos. Ejemplo: Serie <strong className="text-primary">288</strong> + Número <strong className="text-primary">71</strong> ➔ Token: <strong className="text-foreground font-mono">28871</strong>.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setModo("algoritmo_combinado");
              setResultado(null);
              setGanadores(null);
            }}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
              modo === "algoritmo_combinado"
                ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
            }`}
          >
            <div className={`flex size-10 items-center justify-center rounded-xl font-bold text-lg shrink-0 ${modo === "algoritmo_combinado" ? "bg-primary text-black" : "bg-secondary text-foreground"}`}>
              🧮
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                Algoritmo Combinado (3 Premios)
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Combina los dígitos de los premios 1°, 2° y la última cifra del 3° premio para generar la fórmula directa e invertida.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. ENTRADA DE DATOS SEGÚN LA MODALIDAD */}
      {modo === "serie_numero" ? (
        <section className="rounded-2xl border border-primary/40 bg-card p-6 shadow-sm space-y-5">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Dices className="size-5" /> Resultados Oficiales por Serie y Número
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Digita la Serie (3 dígitos) y el Número (2 dígitos) tal como salieron en la tómbola oficial.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* 1° Lugar */}
            <div className="rounded-2xl border-2 border-primary/50 bg-secondary/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1">
                  🥇 1° Premio Mayor
                </span>
                <span className="text-[10px] text-muted-foreground">Obligatorio</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Serie (3 dígitos)</Label>
                  <Input
                    value={s1}
                    maxLength={3}
                    placeholder="288"
                    onChange={(e) => setS1(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-bold tracking-widest h-12"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Número (2 dígitos)</Label>
                  <Input
                    value={n1}
                    maxLength={2}
                    placeholder="71"
                    onChange={(e) => setN1(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-bold tracking-widest h-12"
                  />
                </div>
              </div>
              <div className="text-center rounded-xl bg-background/80 py-2 font-mono text-xs text-muted-foreground border">
                Token resultante: <strong className="text-primary font-bold">{s1 && n1 ? `${s1.padStart(3, "0")}${n1.padStart(2, "0")}` : "---"}</strong>
              </div>
            </div>

            {/* 2° Lugar */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  🥈 2° Premio
                </span>
                <span className="text-[10px] text-muted-foreground">Opcional</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Serie (3 dígitos)</Label>
                  <Input
                    value={s2}
                    maxLength={3}
                    placeholder="290"
                    onChange={(e) => setS2(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-bold tracking-widest h-12"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Número (2 dígitos)</Label>
                  <Input
                    value={n2}
                    maxLength={2}
                    placeholder="88"
                    onChange={(e) => setN2(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-bold tracking-widest h-12"
                  />
                </div>
              </div>
              <div className="text-center rounded-xl bg-background/80 py-2 font-mono text-xs text-muted-foreground border">
                Token resultante: <strong className="text-foreground font-bold">{s2 && n2 ? `${s2.padStart(3, "0")}${n2.padStart(2, "0")}` : "---"}</strong>
              </div>
            </div>

            {/* 3° Lugar */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  🥉 3° Premio
                </span>
                <span className="text-[10px] text-muted-foreground">Opcional</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Serie (3 dígitos)</Label>
                  <Input
                    value={s3}
                    maxLength={3}
                    placeholder="943"
                    onChange={(e) => setS3(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-bold tracking-widest h-12"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Número (2 dígitos)</Label>
                  <Input
                    value={n3}
                    maxLength={2}
                    placeholder="75"
                    onChange={(e) => setN3(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl font-bold tracking-widest h-12"
                  />
                </div>
              </div>
              <div className="text-center rounded-xl bg-background/80 py-2 font-mono text-xs text-muted-foreground border">
                Token resultante: <strong className="text-foreground font-bold">{s3 && n3 ? `${s3.padStart(3, "0")}${n3.padStart(2, "0")}` : "---"}</strong>
              </div>
            </div>
          </div>

          <Button size="xl" variant="hero" className="w-full font-bold shadow-lg" onClick={() => { void ejecutar(); }} disabled={buscando}>
            {buscando ? <Loader2 className="animate-spin size-5" /> : <Calculator className="size-5" />}
            {buscando ? "Cruzando con Base de Datos..." : "🎯 Realizar Escrutinio y Buscar Ganadores"}
          </Button>
        </section>
      ) : (
        <section className="rounded-2xl border border-primary/40 bg-card p-6 shadow-sm space-y-5">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Calculator className="size-5" /> Algoritmo Combinado (3 Premios)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              El algoritmo combina los bloques del 1° y 2° premio con la última cifra del 3°.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
              label="3° Premio (se usa última cifra)"
              valor={p3}
              onChange={setP3}
              placeholder="5"
              max={5}
            />
          </div>

          <Button size="xl" variant="hero" className="w-full font-bold shadow-lg" onClick={() => { void ejecutar(); }} disabled={buscando}>
            {buscando ? <Loader2 className="animate-spin size-5" /> : <Calculator className="size-5" />}
            {buscando ? "Cruzando con Base de Datos..." : "🎯 Ejecutar Algoritmo y Buscar Ganadores"}
          </Button>
        </section>
      )}

      {/* 3. TARJETAS DE NÚMEROS GANADORES OFICIALES */}
      {resultado && (
        <section className="grid gap-4 md:grid-cols-3">
          <Resultado
            titulo="🥇 1° Lugar Oficial"
            detalle={modo === "serie_numero" ? `Serie ${s1.padStart(3, "0")} + Número ${n1.padStart(2, "0")}` : "Fórmula Directa (1° + 2° + 3°)"}
            sticker={resultado.primero}
            destacado={true}
          />
          {resultado.segundo && (
            <Resultado
              titulo="🥈 2° Lugar Oficial"
              detalle={modo === "serie_numero" ? `Serie ${s2?.padStart(3, "0")} + Número ${n2?.padStart(2, "0")}` : "Fórmula Invertida (2° + 1° + 3°)"}
              sticker={resultado.segundo}
            />
          )}
          {resultado.tercero && (
            <Resultado
              titulo="🥉 3° Lugar Oficial"
              detalle={`Serie ${s3?.padStart(3, "0")} + Número ${n3?.padStart(2, "0")}`}
              sticker={resultado.tercero}
            />
          )}
        </section>
      )}

      {/* 4. TABLA DE GANADORES DETECTADOS EN SUPABASE */}
      {resultado && (
        <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-secondary/30">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                <Sparkles className="size-4 text-amber-400" /> Clientes Ganadores Detectados en Base de Datos
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cruce en tiempo real con todas las órdenes oficiales registradas en Supabase.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const stickers = [resultado.primero, resultado.segundo, resultado.tercero].filter(Boolean) as string[];
                void buscarResultados(stickers);
              }}
              disabled={buscando}
              className="gap-2"
            >
              {buscando ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              {buscando ? "Verificando..." : "Actualizar Búsqueda"}
            </Button>
          </div>

          {ganadores === null || buscando ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span>Verificando combinaciones en la base de datos...</span>
            </div>
          ) : ganadores.length === 0 ? (
            <div className="px-5 py-12 text-center space-y-2">
              <span className="text-3xl block">🎟️</span>
              <h4 className="font-bold text-base text-foreground">Ningún cliente tiene asignados estos tokens</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Los números ganadores calculados ({[resultado.primero, resultado.segundo, resultado.tercero].filter(Boolean).join(", ")}) no fueron adquiridos o corresponden a tokens libres en el inventario.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/70 text-left text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">ID Orden</th>
                    <th className="px-5 py-3.5 font-bold">Token Ganador</th>
                    <th className="px-5 py-3.5 font-bold">Cliente Ganador</th>
                    <th className="px-5 py-3.5 font-bold">Premio / SuperToken</th>
                    <th className="px-5 py-3.5 font-bold">Teléfono</th>
                    <th className="px-5 py-3.5 text-right font-bold">Contactar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ganadores.map((g) => {
                    const esPrimero = g.sticker === resultado.primero;
                    const esSegundo = g.sticker === resultado.segundo;
                    const nombrePremio = esPrimero ? "🥇 1° Lugar Oficial" : esSegundo ? "🥈 2° Lugar Oficial" : "🥉 3° Lugar Oficial";
                    return (
                      <tr key={`${g.orden.id}-${g.sticker}`} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-xs">{g.orden.id}</td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-base font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                            {g.sticker}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-foreground">{g.orden.nombre}</div>
                          <div className="text-xs text-muted-foreground">{g.orden.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-xs font-bold text-primary">
                            {nombrePremio}
                          </div>
                          {esPrimero && g.orden.supertoken && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/50 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400 mt-1">
                              <Crown className="size-3" /> +$6,000 USD Cash Extra
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-xs text-foreground">
                          {g.orden.telefono}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => {
                              const tel = g.orden.telefono.replace(/\D/g, "");
                              const texto = encodeURIComponent(
                                `¡Felicidades ${g.orden.nombre}! 🎉🚗💨\n\nTe contactamos oficialmente de Aval Community CR para informarte que tu Token #${g.sticker} ha resultado GANADOR del Sorteo Oficial con tu Orden ${g.orden.id}.\n\n¡Por favor contáctanos para coordinar la entrega de tu premio!`
                              );
                              window.open(`https://wa.me/506${tel}?text=${texto}`, "_blank");
                            }}
                            className="gap-1.5 font-bold shadow-xs cursor-pointer"
                          >
                            <MessageCircle className="size-4" /> WhatsApp Ganador
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
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
    <div className="rounded-2xl border border-border bg-secondary/40 p-5 transition-colors focus-within:border-primary">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground font-bold">{label}</Label>
      <Input
        value={valor}
        placeholder={placeholder}
        maxLength={max}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="mt-3 h-14 border-0 bg-transparent text-center font-mono text-3xl font-bold tracking-widest shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

function Resultado({
  titulo,
  detalle,
  sticker,
  destacado,
}: {
  titulo: string;
  detalle: string;
  sticker: string;
  destacado?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 text-center shadow-md transition-all ${
      destacado
        ? "border-amber-400/60 bg-gradient-to-b from-amber-500/15 via-card to-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
        : "border-primary/40 bg-card"
    }`}>
      <div className="flex items-center justify-center gap-2 text-xs uppercase font-extrabold tracking-wider text-primary">
        <Trophy className="size-4 text-amber-400" /> {titulo}
      </div>
      <div className="mt-3 font-mono text-5xl sm:text-6xl font-black tracking-widest text-amber-400 drop-shadow-sm">
        {sticker}
      </div>
      <p className="mt-2 text-xs text-muted-foreground font-medium">{detalle}</p>
    </div>
  );
}