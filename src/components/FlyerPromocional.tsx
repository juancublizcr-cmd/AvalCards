import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Crown,
  Flame,
  Key,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import type { Config, Premio, Sorteo } from "@/lib/admin-store";
import pradoImg from "@/assets/premio-prado.jpg";

function useCuenta7Dias() {
  const [tiempo, setTiempo] = useState({ d: 7, h: 0, m: 0, s: 0 });

  useEffect(() => {
    let target = localStorage.getItem("aval_apertura_7dias");
    if (!target || isNaN(Number(target)) || Number(target) <= Date.now()) {
      const sieteDiasMs = Date.now() + 7 * 24 * 60 * 60 * 1000;
      target = String(sieteDiasMs);
      localStorage.setItem("aval_apertura_7dias", target);
    }

    const objetivo = Number(target);
    const tick = () => {
      const diff = Math.max(0, objetivo - Date.now());
      setTiempo({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return tiempo;
}

export function FlyerPromocional({
  premioMayor,
  config,
}: {
  premioMayor?: Premio;
  config: Config;
  sorteo: Sorteo;
  tiempo?: { d: number; h: number; m: number; s: number };
}) {
  const tiempo7d = useCuenta7Dias();
  const rawTel = (config.promoWhatsapp || config.telefonoSinpe || "50686344772").replace(/\D/g, "");
  const telFinal = (rawTel.includes("8609") || !rawTel)
    ? "50686344772"
    : (rawTel.startsWith("506") ? rawTel : `506${rawTel}`);
  const mensaje = encodeURIComponent(
    `¡Hola Aval Motors CR! Quiero apartar mi lugar en la preventa exclusiva del evento promocional y recibir información de los tokens.`
  );
  const whatsappUrl = `https://wa.me/${telFinal}?text=${mensaje}`;

  const nombreVehiculo = premioMayor?.nombre || "Toyota Prado 2026";
  const imgVehiculo = premioMayor?.imagen || pradoImg;

  return (
    <div className="min-h-screen bg-[#070709] text-foreground flex flex-col justify-between selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
      {/* Luces de Neón Ambiental de Fondo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[36rem] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-[30rem] rounded-full bg-amber-500/10 blur-[130px]" />

      {/* 1. Header Minimalista */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md px-4 py-3.5">
        <div className="mx-auto max-w-5xl flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="size-6 text-primary" />
            <span className="font-display text-xl sm:text-2xl tracking-widest text-white">
              AVAL <span className="text-primary">MOTORS CR</span>
            </span>
          </Link>
        </div>
      </header>

      {/* 2. Flyer Central Showcase */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Badge Flotante Superior */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/15 px-4 py-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Sparkles className="size-4 text-amber-400" />
          <span>🔥 GRAN APERTURA OFICIAL 2026 · ¡PRÓXIMAMENTE!</span>
        </div>

        {/* Título Principal de Alto Impacto */}
        <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tight uppercase text-white max-w-xl">
          ¿Te imaginas estrenar un <span className="text-fire">{nombreVehiculo}</span> por solo ₡1,000?
        </h1>

        <p className="mt-4 max-w-lg text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          {config.promoSubtitulo ||
            "Estamos afinando los últimos detalles de la plataforma de rifas y tokens digitales más transparente de Costa Rica. ¡Únete a la preventa por WhatsApp y sé el primero en asegurar tus números!"}
        </p>

        {/* Flyer Card del Vehículo */}
        <div className="relative mt-7 w-full max-w-lg rounded-3xl border-2 border-primary/40 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-2.5 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={imgVehiculo}
              alt={nombreVehiculo}
              className="w-full h-60 sm:h-72 object-cover brightness-105"
            />
            {/* Badges sobre la foto */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/85 border border-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
              <Key className="size-3.5 text-primary" /> 0KM · Año 2026
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-amber-500 text-black px-3 py-1 text-[11px] font-black uppercase shadow-lg">
              <Crown className="size-3.5" /> +$6,000 USD Bono
            </div>
          </div>
        </div>

        {/* Reloj de Cuenta Regresiva al Lanzamiento */}
        <div className="mt-7 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2.5">
            <Timer className="size-4 text-primary" /> Apertura Oficial en
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { val: tiempo7d.d, lab: "Días" },
              { val: tiempo7d.h, lab: "Horas" },
              { val: tiempo7d.m, lab: "Min" },
              { val: tiempo7d.s, lab: "Seg" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-black/60 py-2">
                <div className="font-display text-2xl sm:text-3xl text-primary font-bold">
                  {String(item.val).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase text-zinc-400 tracking-wider">
                  {item.lab}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN GIGANTE DE WHATSAPP / PREVENTA */}
        <div className="mt-7 w-full max-w-md space-y-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-6 py-4 text-base font-black text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all text-center uppercase tracking-wide cursor-pointer"
          >
            <MessageCircle className="size-5 fill-black text-black shrink-0" />
            <span>{config.promoBotonTexto || "UNIRME A LA PREVENTA POR WHATSAPP"}</span>
          </a>
          <p className="text-[11px] text-zinc-400">
            📲 Atención inmediata · Reserva tus números exclusivos antes del lanzamiento
          </p>
        </div>

        {/* Garantías y Confianza */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" /> SINPE Móvil y Tarjeta
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" /> Resultados Oficiales Públicos
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-400" /> Entrega Formal ante Notario
          </div>
        </div>
      </main>

      {/* 3. Footer Minimalista */}
      <footer className="relative z-10 border-t border-white/10 py-4 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Aval Motors CR · Importadora Luxury Scents LTDA. · Costa Rica</p>
      </footer>
    </div>
  );
}
