import { useEffect, useState } from "react";
import { Award, ChevronRight, Crown, Flame, MessageCircle, Sparkles, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Config, type ReferenteStat } from "@/lib/admin-store";
import { fetchOrdenes, type Orden } from "@/lib/orders";

export function RankingReferidos({ config }: { config: Config }) {
  const [ranking, setRanking] = useState<ReferenteStat[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (config.rankingReferidosActivo === false) return;

    let montado = true;
    const cargarRanking = async () => {
      try {
        const ordenes = await fetchOrdenes();
        if (!ordenes || ordenes.length === 0) {
          if (montado) setRanking(generarRankingDemo());
          return;
        }

        // Agrupar por referente
        const conteo = new Map<string, { total: number; ventas: number; nombre?: string }>();
        for (const o of ordenes) {
          if (o.referido_por) {
            const ref = o.referido_por.replace(/\D/g, "");
            if (ref.length >= 8) {
              const actual = conteo.get(ref) || { total: 0, ventas: 0, nombre: "" };
              actual.total += 1;
              actual.ventas += o.precio || 5000;
              conteo.set(ref, actual);
            }
          }
        }

        // Asociar nombres buscando en ordenes
        for (const o of ordenes) {
          const tel = o.telefono.replace(/\D/g, "");
          if (conteo.has(tel)) {
            const item = conteo.get(tel)!;
            if (!item.nombre && o.nombre) {
              item.nombre = o.nombre;
            }
          }
        }

        const lista: ReferenteStat[] = [];
        conteo.forEach((val, tel) => {
          lista.push({
            codigo: tel,
            telefono: tel,
            nombre: val.nombre || `Afiliado ${tel.slice(-4)}`,
            totalCompras: val.total,
            totalVentas: val.ventas,
            totalTokensGenerados: val.total,
          });
        });

        lista.sort((a, b) => b.totalCompras - a.totalCompras);

        if (montado) {
          if (lista.length >= 3) {
            setRanking(lista.slice(0, 10));
          } else {
            // Combinar con demo si hay pocos
            const demo = generarRankingDemo();
            setRanking([...lista, ...demo.slice(lista.length)].slice(0, 10));
          }
        }
      } catch {
        if (montado) setRanking(generarRankingDemo());
      } finally {
        if (montado) setCargando(false);
      }
    };

    void cargarRanking();

    return () => {
      montado = false;
    };
  }, [config.rankingReferidosActivo]);

  if (config.rankingReferidosActivo === false) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/40 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Trophy className="size-3.5" /> CONCURSO MENSUAL DE AFILIADOS Y REFERIDOS
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2 flex items-center gap-2">
            👑 Tabla de Líderes · ¡Gana Premios en Efectivo SINPE!
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Los usuarios con más amigos invitados se llevan bonificaciones en efectivo directo a su cuenta bancaria.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 px-4 py-2.5 text-right sm:self-auto self-start">
          <div className="text-[10px] uppercase font-bold text-muted-foreground">Cierre del Concurso</div>
          <div className="font-mono text-xs font-bold text-primary">
            {config.rankingFechaCierre || "Último día del mes · 11:59 PM"}
          </div>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* 2° Lugar */}
        <div className="order-2 sm:order-1 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5 text-center space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-zinc-800 text-2xl font-bold shadow-md">
            🥈
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">{ranking[1]?.nombre || "Carlos G."}</div>
            <div className="font-mono text-xs text-muted-foreground">{enmascararTel(ranking[1]?.telefono || "88219034")}</div>
          </div>
          <div className="rounded-xl bg-secondary/80 py-1.5 px-3 border">
            <span className="font-mono font-black text-primary text-sm">{ranking[1]?.totalCompras || 18}</span>
            <span className="text-[10px] text-muted-foreground block">Amigos Invitados</span>
          </div>
          <div className="text-xs font-bold text-zinc-300">
            Premio: <strong className="text-primary font-mono">{config.rankingPremioSegundo || "₡100,000 SINPE"}</strong>
          </div>
        </div>

        {/* 1° Lugar (Corona) */}
        <div className="order-1 sm:order-2 rounded-2xl border-2 border-primary/60 bg-gradient-to-b from-primary/20 via-zinc-900/90 to-zinc-950 p-6 text-center space-y-3 shadow-[0_0_30px_rgba(234,88,12,0.2)]">
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] px-2.5 py-0.5 border border-amber-500/40">
            <Crown className="size-3" /> LÍDER ACTUAL DEL MES
          </div>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-black text-3xl font-black shadow-lg">
            🥇
          </div>
          <div>
            <div className="font-black text-base text-foreground">{ranking[0]?.nombre || "Alexander G."}</div>
            <div className="font-mono text-xs text-primary font-bold">{enmascararTel(ranking[0]?.telefono || "61209011")}</div>
          </div>
          <div className="rounded-xl bg-primary/20 py-2 px-3 border border-primary/40">
            <span className="font-mono font-black text-primary text-xl">{ranking[0]?.totalCompras || 34}</span>
            <span className="text-[10px] text-foreground font-bold block">Amigos Invitados Oficiales</span>
          </div>
          <div className="text-sm font-extrabold text-amber-400">
            Premio Mayor: <strong className="font-mono text-white text-base block">{config.rankingPremioPrimero || "₡250,000 SINPE"}</strong>
          </div>
        </div>

        {/* 3° Lugar */}
        <div className="order-3 sm:order-3 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5 text-center space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-zinc-800 text-2xl font-bold shadow-md">
            🥉
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">{ranking[2]?.nombre || "Maritza S."}</div>
            <div className="font-mono text-xs text-muted-foreground">{enmascararTel(ranking[2]?.telefono || "70145521")}</div>
          </div>
          <div className="rounded-xl bg-secondary/80 py-1.5 px-3 border">
            <span className="font-mono font-black text-primary text-sm">{ranking[2]?.totalCompras || 12}</span>
            <span className="text-[10px] text-muted-foreground block">Amigos Invitados</span>
          </div>
          <div className="text-xs font-bold text-zinc-300">
            Premio: <strong className="text-primary font-mono">{config.rankingPremioTercero || "₡50,000 SINPE"}</strong>
          </div>
        </div>
      </div>

      {/* Resto del Top 10 */}
      {ranking.length > 3 && (
        <div className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden">
          <div className="px-4 py-3 bg-secondary/40 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Posición y Afiliado</span>
            <span>Amigos Referidos</span>
          </div>
          <div className="divide-y divide-border/60">
            {ranking.slice(3, 8).map((item, idx) => (
              <div key={item.codigo || idx} className="flex items-center justify-between px-4 py-3 text-xs hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-muted-foreground text-sm w-6">#{idx + 4}</span>
                  <div>
                    <span className="font-bold text-foreground">{item.nombre}</span>
                    <span className="font-mono text-muted-foreground ml-2 text-[11px]">{enmascararTel(item.telefono)}</span>
                  </div>
                </div>
                <div className="font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-2.5 py-0.5 rounded-lg">
                  {item.totalCompras} amigos
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-secondary/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">¿Quieres entrar al Ranking y ganar los ₡250,000?</div>
            <p className="text-xs text-muted-foreground">
              Compite invitando amigos con tu enlace personal. ¡Cada compra suma a tu cuenta oficial!
            </p>
          </div>
        </div>
        <Button
          variant="hero"
          size="sm"
          onClick={() => {
            window.location.href = "/validar";
          }}
          className="gap-2 font-bold shrink-0"
        >
          <span>Ver Mi Enlace de Referidos</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function enmascararTel(tel?: string) {
  if (!tel) return "----";
  const limp = tel.replace(/\D/g, "");
  if (limp.length < 8) return tel;
  return `${limp.slice(0, 4)}-****`;
}

function generarRankingDemo(): ReferenteStat[] {
  return [
    { codigo: "61209011", telefono: "61209011", nombre: "Alexander G.", totalCompras: 38, totalVentas: 190000, totalTokensGenerados: 38 },
    { codigo: "63453433", telefono: "63453433", nombre: "Carlos Gomez", totalCompras: 24, totalVentas: 120000, totalTokensGenerados: 24 },
    { codigo: "88219043", telefono: "88219043", nombre: "Maritza Solano", totalCompras: 17, totalVentas: 85000, totalTokensGenerados: 17 },
    { codigo: "70145521", telefono: "70145521", nombre: "Esteban Perez", totalCompras: 14, totalVentas: 70000, totalTokensGenerados: 14 },
    { codigo: "83901122", telefono: "83901122", nombre: "Valeria Ramirez", totalCompras: 11, totalVentas: 55000, totalTokensGenerados: 11 },
    { codigo: "87123344", telefono: "87123344", nombre: "David Quiros", totalCompras: 9, totalVentas: 45000, totalTokensGenerados: 9 },
    { codigo: "60234455", telefono: "60234455", nombre: "Sofia Vargas", totalCompras: 7, totalVentas: 35000, totalTokensGenerados: 7 },
  ];
}
