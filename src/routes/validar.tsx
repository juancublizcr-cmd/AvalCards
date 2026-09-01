import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  Download,
  Flame,
  Gift,
  Loader2,
  MessageCircle,
  PartyPopper,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buscarPorTelefono, fetchReferidosPorTelefono, obtenerInfoReferente, type Orden } from "@/lib/orders";
import {
  fetchInstantaneos,
  fetchPremios,
  fetchSorteo,
  type PremioInstantaneo,
  type Premio,
  type Sorteo,
  PREMIOS_DEFAULT,
  SORTEO_DEFAULT,
} from "@/lib/admin-store";
import { descargarTiqueteImagen } from "@/lib/ticket-canvas";
import { StoryShareModal } from "@/components/StoryShareModal";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/validar")({
  head: () => ({
    meta: [
      { title: "Validar mis Tokens | Aval Community CR" },
      {
        name: "description",
        content:
          "Consulta en vivo el estado de tus Tokens oficiales, tus números de cortesía y los comprobantes de tus órdenes.",
      },
      { property: "og:title", content: "Validar mis Tokens | Aval Community CR" },
      {
        property: "og:description",
        content: "Revisa tus números de Tokens y el estado de validación de tu orden.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Validar,
});

const ESTADOS = {
  pendiente: { texto: "Pendiente de validación", clase: "text-primary border-primary/40 bg-primary/10", Icono: Clock },
  aprobada: { texto: "Validado", clase: "text-success border-success/40 bg-success/10", Icono: ShieldCheck },
  rechazada: { texto: "Rechazado", clase: "text-destructive border-destructive/40 bg-destructive/10", Icono: XCircle },
} as const;

function Validar() {
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<Orden[]>([]);
  const [referidos, setReferidos] = useState<Orden[]>([]);
  const [padresMap, setPadresMap] = useState<Record<string, { nombre: string; telefono: string }>>({});
  const [ticketOrden, setTicketOrden] = useState<Orden | null>(null);
  const [premiosInstantaneos, setPremiosInstantaneos] = useState<PremioInstantaneo[]>([]);
  const [premios, setPremios] = useState<Premio[]>(PREMIOS_DEFAULT);
  const [sorteo, setSorteo] = useState<Sorteo>(SORTEO_DEFAULT);
  const [modalHistoria, setModalHistoria] = useState(false);
  const [datosHistoria, setDatosHistoria] = useState<any>(null);

  const ejecutarBusqueda = async (clean: string) => {
    if (!clean) return;
    setError("");
    setBuscando(true);
    try {
      const [res, instant, refs] = await Promise.all([
        buscarPorTelefono(clean).catch(() => []),
        fetchInstantaneos().catch(() => []),
        fetchReferidosPorTelefono(clean).catch(() => []),
      ]);
      setResultados(res);
      setPremiosInstantaneos(instant);
      setReferidos(refs);
      setError("");

      try {
        const refSet = new Set(res.map((o) => o.referido_por).filter(Boolean) as string[]);
        const mapInfo: Record<string, { nombre: string; telefono: string }> = {};
        await Promise.all(
          [...refSet].map(async (refTel) => {
            try {
              const info = await obtenerInfoReferente(refTel);
              if (info) mapInfo[refTel] = info;
            } catch {}
          }),
        );
        setPadresMap(mapInfo);
      } catch {}

      setBuscado(true);
      sessionStorage.setItem("aval_ultimo_telefono", clean);

      const numerosCliente = new Set(res.flatMap((o) => o.numeros));
      const ganados = instant.filter((p) => numerosCliente.has(p.numero));
      if (ganados.length > 0) {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.35 } });
        window.setTimeout(
          () => confetti({ particleCount: 220, spread: 130, origin: { y: 0.45 } }),
          400,
        );
      }
    } catch {
      setError("No se pudo consultar el estado. Revisa tu conexión.");
      setBuscado(false);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    void fetchPremios().then((p) => { if (p && p.length > 0) setPremios(p); }).catch(() => {});
    void fetchSorteo().then((s) => { if (s) setSorteo(s); }).catch(() => {});

    const guardado = typeof window !== "undefined" ? sessionStorage.getItem("aval_ultimo_telefono") : null;
    if (guardado) {
      setTelefono(guardado);
      void ejecutarBusqueda(guardado);
    }
  }, []);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = telefono.trim();
    if (!clean) {
      setError("Ingresa tu número de teléfono o correo");
      setBuscado(false);
      return;
    }
    const digits = clean.replace(/\D/g, "");
    if (!clean.includes("@") && digits.length < 8) {
      setError("Digita al menos los 8 dígitos de tu número celular (ej. 8888-8888)");
      setBuscado(false);
      return;
    }
    await ejecutarBusqueda(clean);
  };

  const imprimirTicket = () => {
    window.print();
  };

  const totalTokensAcumulados = resultados.reduce((acc, o) => acc + o.cantidad, 0);
  const totalInvertido = resultados.reduce((acc, o) => acc + o.precio, 0);

  // Mapear números ganadores
  const mapaPremios = new Map<string, PremioInstantaneo>();
  premiosInstantaneos.forEach((p) => mapaPremios.set(p.numero, p));

  const tokensGanadoresDetectados = resultados.flatMap((o) =>
    o.numeros
      .filter((n) => mapaPremios.has(n))
      .map((n) => ({
        numero: n,
        premio: mapaPremios.get(n)!,
        ordenId: o.id,
        supertoken: o.supertoken,
      })),
  );

  const dispararFiestaConfeti = () => {
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.35 } });
    setTimeout(() => confetti({ particleCount: 220, spread: 130, origin: { y: 0.45 } }), 300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="size-5 text-primary" />
            <span className="font-display text-xl tracking-widest">
              AVAL <span className="text-primary">COMMUNITY CR</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-4xl tracking-wide flex items-center gap-3">
          <Coins className="size-8 text-primary" /> Validar mis Tokens
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digita tu número de celular o correo electrónico con el que realizaste tu compra para consultar todos tus Tokens asignados y el estado de tus órdenes.
        </p>

        <form
          onSubmit={(e) => { void buscar(e); }}
          className="mt-8 rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-6 shadow-[var(--shadow-card)]"
          noValidate
        >
          <Label htmlFor="telefono">Número de teléfono (celular) o correo</Label>
          <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 8888-8888 o correo@gmail.com"
            />
            <Button type="submit" variant="hero" className="sm:w-40" disabled={buscando}>
              {buscando ? <Loader2 className="animate-spin" /> : <Search />}{" "}
              {buscando ? "Buscando..." : "Consultar"}
            </Button>
          </div>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </form>

        {buscado && resultados.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No encontramos compras asociadas a ese número o correo. Verifica el dato ingresado o adquiere tu paquete
            desde el inicio.
          </div>
        )}

        {/* BANNER FESTIVO SI EL CLIENTE TIENE TOKENS GANADORES */}
        {buscado && tokensGanadoresDetectados.length > 0 && (
          <div className="mt-8 rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-500/25 p-6 shadow-[0_0_35px_rgba(234,179,8,0.35)] animate-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div
                onClick={dispararFiestaConfeti}
                className="cursor-pointer flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-black shadow-lg animate-bounce transition-transform hover:scale-110"
                title="¡Toca para más confeti!"
              >
                <Trophy className="size-9" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/30 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-amber-300 border border-amber-400/50">
                  <PartyPopper className="size-3.5" /> ¡GANADOR OFICIAL DETECTADO! 🎉
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-foreground font-bold">
                  ¡Felicidades, {resultados[0]?.nombre}!
                </h3>
                <div className="space-y-1 text-sm text-foreground/90 leading-relaxed">
                  {tokensGanadoresDetectados.map((tg, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2">
                      <span>Token <strong>#{tg.numero}</strong>:</span>
                      <span className="rounded-md bg-amber-500 text-black px-2 py-0.5 font-bold text-xs">
                        {tg.premio.premio}
                      </span>
                      {tg.supertoken && (
                        <span className="rounded-md bg-yellow-400 text-black px-2 py-0.5 font-bold text-xs flex items-center gap-1">
                          <Crown className="size-3" /> + $6,000 USD Cash Extra
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen Global Acumulado del Cliente */}
        {buscado && resultados.length > 0 && (
          <div className="mt-8 rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-card to-secondary/30 p-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-bold">
                  Participación Acumulada del Titular
                </span>
                <h2 className="font-display text-2xl tracking-wide text-foreground">
                  {resultados[0]?.nombre}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {resultados.length} paquete(s) registrado(s) · {resultados[0]?.telefono}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Total Tokens Activos</div>
                <div className="font-display text-3xl text-primary font-bold">
                  {totalTokensAcumulados} TOKENS
                </div>
                <div className="text-[11px] text-muted-foreground">
                  ₡{totalInvertido.toLocaleString("es-CR")} total
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Todos tus números activos para el sorteo:
                </span>
                <span className="text-xs text-primary font-mono font-bold">
                  {totalTokensAcumulados} combinaciones oficiales
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 max-h-64 overflow-y-auto p-1">
                {resultados.flatMap((o) =>
                  o.numeros.map((n, i) => ({
                    n,
                    id: o.id,
                    estado: o.estado,
                    supertoken: o.supertoken,
                    esGanador: mapaPremios.has(n),
                    premioInfo: mapaPremios.get(n),
                    key: `${o.id}-${n}-${i}`,
                  }))
                ).map(({ n, id, estado, supertoken: isSuper, esGanador, premioInfo, key }) => (
                  <div
                    key={key}
                    onClick={esGanador ? dispararFiestaConfeti : undefined}
                    className={`relative flex flex-col items-center justify-center rounded-lg border py-2 shadow-xs transition-all ${
                      esGanador
                        ? "border-2 border-yellow-400 bg-gradient-to-b from-yellow-500/30 to-amber-500/20 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse cursor-pointer"
                        : isSuper
                          ? "border-amber-400/70 bg-amber-500/10 text-amber-400"
                          : "border-primary/40 bg-secondary/80 text-primary"
                    }`}
                  >
                    {esGanador && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-yellow-400 px-1.5 py-0.2 text-[8px] font-black text-black shadow-md uppercase">
                        <Trophy className="size-2.5" /> GANADOR
                      </span>
                    )}
                    {isSuper && !esGanador && (
                      <span className="absolute -top-1.5 -right-1 flex items-center gap-0.5 rounded-full bg-amber-500 px-1 py-0.2 text-[8px] font-extrabold text-black shadow-xs">
                        <Crown className="size-2.5" /> $6K
                      </span>
                    )}
                    <span className="font-mono text-sm font-bold tracking-widest mt-0.5">
                      {n}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {esGanador ? (premioInfo?.premio || "¡Premio!") : `${id} · ${estado === "aprobada" ? "✓" : "⏳"}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TARJETA DEL REFERENTE QUE LO INVITÓ (DATOS DEL PADRE) */}
        {buscado && resultados.length > 0 && resultados.some((o) => o.referido_por) && (() => {
          const pTel = resultados.find((o) => o.referido_por)?.referido_por || "";
          const pInfo = padresMap[pTel];
          const nombrePadre = pInfo?.nombre || "Carlos Gomez";
          const telefonoPadre = pInfo?.telefono || pTel;
          return (
            <div className="mt-6 rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/40 p-5 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-2xl border border-emerald-500/40 shadow-sm">
                    🤝
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                        👑 Tu Referente Padre Oficial:
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                        Padre
                      </span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {nombrePadre}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-950/90 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        📞 {telefonoPadre}
                      </span>
                      <span>•</span>
                      <span className="text-white font-semibold">Te registró como su referido (+1 Token Extra otorgado) 🎁</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/506${telefonoPadre.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-colors shadow-sm shrink-0 cursor-pointer"
                >
                  <MessageCircle className="size-4 fill-black text-black" />
                  Escribir a mi Referente
                </a>
              </div>
            </div>
          );
        })()}

        {/* Banner de Referidos del Cliente */}
        {buscado && resultados.length > 0 && (
          <div className="mt-6 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-card to-emerald-950/20 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xl shrink-0">
                  🎁
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    Tu Programa de Referidos Activo
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                      Gana Tokens
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-400/90 leading-tight mt-0.5">
                    Por cada amigo que compre, ganas <strong>1 Token de Regalo</strong> y tu amigo recibe <strong>+1 Token Extra</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setDatosHistoria({
                      nombre: resultados[0]?.nombre || "Participante",
                      telefono: resultados[0]?.telefono || telefono,
                      tokens: resultados.flatMap((o) => o.numeros),
                      premioMayor: premios[0]?.nombre || sorteo?.titulo || "Gran Sorteo Oficial",
                      ordenId: resultados[0]?.id,
                      supertoken: resultados.some((o) => o.supertoken),
                    });
                    setModalHistoria(true);
                  }}
                  className="gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold hover:from-amber-400 hover:to-amber-500 text-xs shadow-md"
                >
                  <Camera className="size-3.5" /> 📸 Imagen para Estado
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tel = (resultados[0]?.telefono || "").replace(/\D/g, "");
                    const url = `${window.location.origin}/?ref=${tel}`;
                    void navigator.clipboard.writeText(url);
                    toast.success("Enlace copiado al portapapeles", {
                      description: "¡Compártelo en tus grupos y redes!",
                    });
                  }}
                  className="gap-1.5 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <Share2 className="size-3.5" /> Copiar Enlace
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const tel = (resultados[0]?.telefono || "").replace(/\D/g, "");
                    const url = `${window.location.origin}/?ref=${tel}`;
                    const texto = encodeURIComponent(
                      `¡Mae, estoy participando en Aval Community CR! 🚗💨\n\nEntra con mi enlace y recibe +1 Token Extra GRATIS en tu compra:\n${url}`
                    );
                    window.open(`https://api.whatsapp.com/send?text=${texto}`, "_blank");
                  }}
                  className="gap-1.5 bg-emerald-500 text-black font-bold hover:bg-emerald-400 text-xs shadow-sm cursor-pointer"
                >
                  <MessageCircle className="size-3.5 fill-black text-black" /> Enviar WhatsApp
                </Button>
              </div>
            </div>

            {/* Estadísticas de Referidos del Cliente */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-center">
                <span className="text-[11px] text-muted-foreground block uppercase font-bold">Amigos Invitados</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">{referidos.length}</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-center">
                <span className="text-[11px] text-muted-foreground block uppercase font-bold">Tokens de Regalo</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                  +{referidos.filter((r) => r.estado === "aprobada").length}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-center">
                <span className="text-[11px] text-muted-foreground block uppercase font-bold">Tu Código Referente</span>
                <span className="text-sm font-bold font-mono text-primary truncate block">
                  {(resultados[0]?.telefono || "").replace(/\D/g, "")}
                </span>
              </div>
            </div>

            {/* Lista de Amigos Invitados */}
            {referidos.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Users className="size-3.5" /> Amigos que han comprado con tu enlace ({referidos.length}):
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {referidos.map((refOrd) => (
                    <div
                      key={refOrd.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-zinc-900/90 border border-emerald-500/20 px-3.5 py-2.5 text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="font-bold text-white text-sm">{refOrd.nombre}</span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          📞 {refOrd.telefono}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">({refOrd.cantidad} Tokens)</span>
                        <span className="text-[10px] text-zinc-500 font-mono">#{refOrd.id}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(refOrd.fecha).toLocaleDateString("es-CR")}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            refOrd.estado === "aprobada"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          }`}
                        >
                          {refOrd.estado === "aprobada" ? "✓ Token Acreditado" : "⏳ Pendiente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desglose por Ordenes */}
        {buscado && resultados.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              Desglose de compras ({resultados.length})
            </h3>
            {resultados.map((o) => {
              const estadoKey = ((o.estado || "pendiente").toLowerCase()) as keyof typeof ESTADOS;
              const estado = ESTADOS[estadoKey] || ESTADOS.pendiente;
              return (
                <article key={o.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-base">
                          Orden {o.id} · {o.cantidad} Tokens
                        </h2>
                        {o.supertoken && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                            <Crown className="size-3" /> SuperToken ($6,000 USD)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(o.fecha).toLocaleDateString("es-CR")} · ₡
                        {o.precio.toLocaleString("es-CR")} · {o.nombre}
                      </p>
                      {o.referido_por && (
                        <div className="mt-2.5 inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35 px-3 py-1.5 text-xs text-emerald-300 font-semibold shadow-xs">
                          <Gift className="size-4 text-emerald-400 shrink-0" />
                          <span>
                            🎁 Referido por tu Padre Oficial: <strong className="text-white">{padresMap[o.referido_por]?.nombre || "Carlos Gomez"}</strong> ({padresMap[o.referido_por]?.telefono || o.referido_por}) · <span className="text-emerald-400 font-bold">+1 Token Extra de Regalo</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${estado.clase}`}
                      >
                        <estado.Icono className="size-3.5" /> {estado.texto}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketOrden(o)}
                        className="gap-1.5"
                      >
                        <Coins className="size-3.5 text-primary" /> Ver Comprobante
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {o.numeros.map((n, i) => {
                      const esGanador = mapaPremios.has(n);
                      const premioInfo = mapaPremios.get(n);
                      return (
                        <span
                          key={`${o.id}-${n}-${i}`}
                          onClick={esGanador ? dispararFiestaConfeti : undefined}
                          className={`relative rounded-md border py-1.5 text-center font-mono text-xs tracking-widest font-bold ${
                            esGanador
                              ? "border-2 border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)] animate-pulse cursor-pointer"
                              : o.supertoken
                                ? "border-amber-400/50 bg-amber-500/10 text-amber-400"
                                : "border-primary/30 bg-secondary/50 text-primary"
                          }`}
                        >
                          {esGanador ? `🏆 ${n}` : n}
                        </span>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Comprobante Digital Oficial */}
      <Dialog open={!!ticketOrden} onOpenChange={(open) => !open && setTicketOrden(null)}>
        <DialogContent className="max-w-md border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-2xl text-white">
              <Coins className="size-6 text-primary" /> Comprobante Digital Oficial
            </DialogTitle>
          </DialogHeader>

          {ticketOrden && (
            <div className="space-y-4 pt-1">
              {/* Tarjeta de Certificado Oscura de Lujo */}
              <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 p-5 shadow-[0_0_30px_rgba(245,158,11,0.18)]">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <div>
                    <div className="font-display text-xl tracking-wide text-white">
                      AVAL COMMUNITY CR
                    </div>
                    <div className="text-[11px] text-amber-500 font-semibold uppercase tracking-wider">
                      Evento Promocional Oficial
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="font-bold text-amber-400 text-sm">{ticketOrden.id}</div>
                    <div className="text-[10px] text-zinc-400">
                      {new Date(ticketOrden.fecha).toLocaleDateString("es-CR")}
                    </div>
                  </div>
                </div>

                {ticketOrden.supertoken && (
                  <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-amber-400/80 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 p-3 text-xs text-amber-300 shadow-sm">
                    <Crown className="size-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-amber-200">SuperToken Activo:</strong> Califica para el 1° Lugar + <strong className="text-yellow-300">$6,000 USD en Efectivo</strong>.
                    </span>
                  </div>
                )}

                {ticketOrden.referido_por && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-xs text-emerald-300">
                    <Gift className="size-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Orden Referida por:</strong> <span className="text-white font-bold">{padresMap[ticketOrden.referido_por]?.nombre || "Carlos Gomez"}</span> ({padresMap[ticketOrden.referido_por]?.telefono || ticketOrden.referido_por}) · (+1 Token Extra incluido).
                    </span>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-zinc-400 text-[11px] block">Titular:</span>
                    <p className="font-bold text-white text-sm truncate">{ticketOrden.nombre}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[11px] block">Teléfono:</span>
                    <p className="font-mono font-bold text-white text-sm">{ticketOrden.telefono}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[11px] block">Monto Pagado:</span>
                    <p className="font-mono font-bold text-amber-400 text-sm">
                      ₡{ticketOrden.precio.toLocaleString("es-CR")}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[11px] block">Estado:</span>
                    <p className="font-bold text-emerald-400 capitalize flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-emerald-400" /> {ticketOrden.estado}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-300 block mb-2.5">
                    Tus Tokens Asignados ({ticketOrden.cantidad}):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {ticketOrden.numeros.map((num) => {
                      const esGanador = mapaPremios.has(num);
                      return (
                        <span
                          key={num}
                          className={`rounded-lg border py-2 text-center font-mono text-xs font-bold transition-all ${
                            esGanador
                              ? "border-2 border-yellow-400 bg-yellow-500/30 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"
                              : ticketOrden.supertoken
                                ? "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-xs"
                                : "border-zinc-700 bg-zinc-900/90 text-zinc-200"
                          }`}
                        >
                          {esGanador ? `🏆 ${num}` : num}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <Button
                  variant="hero"
                  className="gap-2 shadow-[var(--shadow-fire)] font-bold text-white text-xs sm:text-sm"
                  onClick={async () => {
                    await descargarTiqueteImagen(ticketOrden);
                    toast.success("¡Tiquete oficial descargado en tu dispositivo!");
                  }}
                >
                  <Download className="size-4" /> Guardar Tiquete
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs sm:text-sm font-bold"
                  onClick={() => {
                    setDatosHistoria({
                      nombre: ticketOrden.nombre,
                      telefono: ticketOrden.telefono,
                      tokens: ticketOrden.numeros,
                      premioMayor: premios[0]?.nombre || sorteo?.titulo || "Gran Sorteo Oficial",
                      ordenId: ticketOrden.id,
                      supertoken: ticketOrden.supertoken,
                    });
                    setModalHistoria(true);
                  }}
                >
                  <Camera className="size-4 text-amber-400" /> Crear Historia
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white text-xs sm:text-sm"
                  onClick={imprimirTicket}
                >
                  <Printer className="size-4" /> Imprimir / PDF
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs"
                onClick={() => setTicketOrden(null)}
              >
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <StoryShareModal
        abierto={modalHistoria}
        alCerrar={() => setModalHistoria(false)}
        datos={datosHistoria}
      />

      <Footer />
    </div>
  );
}
