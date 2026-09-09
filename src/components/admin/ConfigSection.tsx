import { useState } from "react";
import {
  Bot,
  Coins,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  Globe,
  Key,
  Loader2,
  Lock,
  MessageSquare,
  Save,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertConfig, type Config } from "@/lib/admin-store";
import { probarConexionIA } from "@/lib/ai-service";

export function ConfigSection({
  config,
  setConfig,
}: {
  config: Config;
  setConfig: (c: Config) => void;
}) {
  const [borrador, setBorrador] = useState<Config>(config);
  const [guardando, setGuardando] = useState(false);
  const [probandoIA, setProbandoIA] = useState(false);
  const [mostrarKeys, setMostrarKeys] = useState<Record<string, boolean>>({});

  const toggleMostrarKey = (k: string) => {
    setMostrarKeys((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const ejecutarPruebaIA = async () => {
    const prov = borrador.aiProveedor || "gemini";
    let key = "";
    let model = "";

    if (prov === "openai") {
      key = borrador.aiOpenaiKey || "";
      model = borrador.aiOpenaiModel || "gpt-4o-mini";
    } else if (prov === "gemini") {
      key = borrador.aiGeminiKey || "";
      model = borrador.aiGeminiModel || "gemini-1.5-flash";
    } else if (prov === "deepseek") {
      key = borrador.aiDeepseekKey || "";
      model = borrador.aiDeepseekModel || "deepseek-chat";
    } else if (prov === "claude") {
      key = borrador.aiClaudeKey || "";
      model = borrador.aiClaudeModel || "claude-3-5-haiku-20241022";
    }

    if (!key.trim()) {
      toast.error(`Por favor ingresa la API Key de ${prov.toUpperCase()} antes de probar.`);
      return;
    }

    setProbandoIA(true);
    const toastId = toast.loading(`Probando conexión con ${prov.toUpperCase()} (${model})...`);
    try {
      const res = await probarConexionIA(prov, key, model);
      if (res.ok) {
        toast.success(res.mensaje, { id: toastId, duration: 5000 });
      } else {
        toast.error(res.mensaje, { id: toastId, duration: 6000 });
      }
    } catch (err: any) {
      toast.error(`Error: ${err?.message || "No se pudo conectar"}`, { id: toastId });
    } finally {
      setProbandoIA(false);
    }
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      await upsertConfig(borrador);
      setConfig(borrador);
      toast.success("Configuración y pasarelas de pago guardadas");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar configuración");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold">Configuración de Plataforma y Pasarelas</h2>
        <p className="text-sm text-muted-foreground">
          Controla los parámetros generales del sorteo y los métodos de cobro activos para tus clientes.
        </p>
      </div>

      {/* 1. CONFIGURACIÓN GENERAL */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 font-bold text-base border-b border-border pb-3">
          <Globe className="size-5 text-primary" /> Parámetros Generales
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Intentos de cambio de Tokens</Label>
            <Input
              type="number"
              min={0}
              max={20}
              value={borrador.intentosMax}
              onChange={(e) => setBorrador({ ...borrador, intentosMax: Number(e.target.value) })}
            />
            <p className="text-[11px] text-muted-foreground">
              Máximo de regeneraciones al azar que puede hacer el usuario antes de pagar.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/30">
            <div>
              <div className="text-sm font-semibold">Estado de la Web al Público</div>
              <p className="text-[11px] text-muted-foreground">
                {borrador.ventasActivas
                  ? "🟢 En Vivo (Venta abierta con paquetes y checkout)"
                  : "🟡 Modo Promocional / Próximamente (Venta oculta con botón de WhatsApp)"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${borrador.ventasActivas ? "text-emerald-500" : "text-amber-500"}`}>
                {borrador.ventasActivas ? "Venta Activa" : "Modo Promo"}
              </span>
              <Switch
                checked={borrador.ventasActivas}
                onCheckedChange={(v) => setBorrador({ ...borrador, ventasActivas: v })}
              />
            </div>
          </div>
        </div>

        {/* TERMÓMETRO COMERCIAL DE LA LANDING (FASES) */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Flame className="size-4" /> Termómetro de Disponibilidad en Landing (Estrategia por Fases)
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Etiqueta del Progreso</Label>
              <Input
                value={borrador.termometroFaseTitulo ?? "Progreso de la Edición"}
                placeholder="Progreso de la Edición"
                onChange={(e) => setBorrador({ ...borrador, termometroFaseTitulo: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground">Texto mostrado junto a la barra de avance.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Meta Total de Tokens</Label>
              <Input
                type="number"
                min={50}
                max={100000}
                value={borrador.termometroMetaTokens ?? 5000}
                onChange={(e) => setBorrador({ ...borrador, termometroMetaTokens: Number(e.target.value) })}
              />
              <p className="text-[10px] text-muted-foreground">Ej. 5 000 tokens. Con 205 tokens reales calcula 4.1% automáticamente.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">% Fijo Manual (Opcional)</Label>
              <Input
                type="number"
                min={0}
                max={99}
                placeholder="Dejar en 0 para cálculo dinámico"
                value={borrador.termometroPorcentajeManual ?? 0}
                onChange={(e) => setBorrador({ ...borrador, termometroPorcentajeManual: Number(e.target.value) })}
              />
              <p className="text-[10px] text-muted-foreground">Fuerza un % fijo. Si lo dejas en 0, calcula dinámicamente con ventas reales.</p>
            </div>
          </div>
        </div>

        {/* DETALLES DEL MODO PROMOCIONAL */}
        {!borrador.ventasActivas && (
          <div className="mt-4 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 p-4 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="size-4" /> Personalización de Pantalla Promocional (Próximamente)
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Título del Anuncio / Preventa</Label>
              <Input
                value={borrador.promoTitulo || ""}
                onChange={(e) => setBorrador({ ...borrador, promoTitulo: e.target.value })}
                placeholder="🔥 GRAN EVENTO PROMOCIONAL 2026 · ¡PRÓXIMAMENTE!"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Mensaje Explicativo</Label>
              <Input
                value={borrador.promoSubtitulo || ""}
                onChange={(e) => setBorrador({ ...borrador, promoSubtitulo: e.target.value })}
                placeholder="Estamos afinando los últimos detalles. ¡Escríbenos por WhatsApp para ser de los primeros en acceder a la Preventa Exclusiva!"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Texto del Botón de Contacto</Label>
                <Input
                  value={borrador.promoBotonTexto || ""}
                  onChange={(e) => setBorrador({ ...borrador, promoBotonTexto: e.target.value })}
                  placeholder="📲 ¡NOTIFICARME POR WHATSAPP (PREVENTA EXCLUSIVA)!"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">WhatsApp para Preventa (sin guiones ni signos)</Label>
                <Input
                  value={borrador.promoWhatsapp || ""}
                  onChange={(e) => setBorrador({ ...borrador, promoWhatsapp: e.target.value })}
                  placeholder="50686344772"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. CONFIGURACIÓN SINPE MÓVIL */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5 font-bold text-base">
            <Smartphone className="size-5 text-emerald-500" /> 1. SINPE Móvil (Costa Rica)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.sinpeActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.sinpeActivo}
              onCheckedChange={(v) => setBorrador({ ...borrador, sinpeActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Número de Teléfono SINPE</Label>
            <Input
              value={borrador.telefonoSinpe || ""}
              onChange={(e) => setBorrador({ ...borrador, telefonoSinpe: e.target.value })}
              placeholder="8634-4772"
            />
          </div>
          <div className="space-y-2">
            <Label>Titular / Razón Social de la Cuenta</Label>
            <Input
              value={borrador.razonSocial}
              onChange={(e) => setBorrador({ ...borrador, razonSocial: e.target.value })}
              placeholder="Importadora Luxury Scents LTDA."
            />
          </div>
        </div>
      </section>

      {/* 3. CONFIGURACIÓN TILOPAY (TARJETAS) */}
      <section className="rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base text-primary">
              <CreditCard className="size-5" /> 2. TiloPay · Tarjetas Débito / Crédito
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acepta Visa, Mastercard, AMEX y Apple Pay con aprobación y validación automática inmediata.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.tilopayActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.tilopayActivo}
              onCheckedChange={(v) => setBorrador({ ...borrador, tilopayActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Merchant ID de TiloPay</Label>
            <Input
              value={borrador.tilopayMerchantId}
              onChange={(e) => setBorrador({ ...borrador, tilopayMerchantId: e.target.value })}
              placeholder="ej: 12345"
            />
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              value={borrador.tilopayApiKey}
              onChange={(e) => setBorrador({ ...borrador, tilopayApiKey: e.target.value })}
              placeholder="pk_live_..."
            />
          </div>
          <div className="space-y-2">
            <Label>API Password / Secret</Label>
            <Input
              type="password"
              value={borrador.tilopayApiPassword}
              onChange={(e) => setBorrador({ ...borrador, tilopayApiPassword: e.target.value })}
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/30">
          <div>
            <div className="text-sm font-semibold">Modo Sandbox (Pruebas)</div>
            <p className="text-[11px] text-muted-foreground">
              {borrador.tilopaySandbox
                ? "Simula transacciones sin cobro real a tarjetas (ideal para desarrollo)."
                : "PRODUCCIÓN: Los cobros a tarjetas se procesan con dinero real."}
            </p>
          </div>
          <Switch
            checked={borrador.tilopaySandbox}
            onCheckedChange={(v) => setBorrador({ ...borrador, tilopaySandbox: v })}
          />
        </div>
      </section>

      {/* 3. CONFIGURACIÓN PAYPAL */}
      <section className="rounded-2xl border border-sky-500/40 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base text-sky-400">
              <span className="flex size-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 font-black text-sm">🅿️</span>
              3. PayPal · Pagos Internacionales (USD / CRC)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permite a compradores de cualquier país pagar con saldo PayPal, tarjetas internacionales o transferencias.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.paypalActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.paypalActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, paypalActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email de Negocio / Cuenta Comercial PayPal</Label>
            <Input
              value={borrador.paypalEmail || ""}
              onChange={(e) => setBorrador({ ...borrador, paypalEmail: e.target.value })}
              placeholder="pagos@avalcommunity.cr"
            />
          </div>
          <div className="space-y-2">
            <Label>Client ID de PayPal REST API</Label>
            <Input
              value={borrador.paypalClientId || ""}
              onChange={(e) => setBorrador({ ...borrador, paypalClientId: e.target.value })}
              placeholder="AX..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/30">
          <div>
            <div className="text-sm font-semibold">Modo Sandbox de PayPal</div>
            <p className="text-[11px] text-muted-foreground">
              {borrador.paypalSandbox ?? true
                ? "Simulación de pagos de prueba mediante cuentas de prueba Sandbox."
                : "PRODUCCIÓN: Recibe pagos reales en tu cuenta de PayPal Business."}
            </p>
          </div>
          <Switch
            checked={borrador.paypalSandbox ?? true}
            onCheckedChange={(v) => setBorrador({ ...borrador, paypalSandbox: v })}
          />
        </div>
      </section>

      {/* 4. CONFIGURACIÓN APPLE PAY */}
      <section className="rounded-2xl border border-zinc-700 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base text-zinc-100">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-800 text-white font-black text-sm">🍏</span>
              4. Apple Pay · Pagos en 1 Clic (iOS / Mac)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pago express ultra-rápido y seguro mediante Face ID y Touch ID para dispositivos Apple.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.applePayActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.applePayActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, applePayActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Apple Merchant Identifier</Label>
            <Input
              value={borrador.applePayMerchantId || ""}
              onChange={(e) => setBorrador({ ...borrador, applePayMerchantId: e.target.value })}
              placeholder="merchant.cr.avalcommunity"
            />
          </div>
          <div className="space-y-2">
            <Label>Estado del Dominio Web</Label>
            <div className="rounded-md border border-border bg-zinc-900/90 px-3 py-2 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              avalcommunity.cr (Verificado SSL)
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONFIGURACIÓN GOOGLE PAY */}
      <section className="rounded-2xl border border-amber-500/30 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base text-amber-400">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-black text-sm">🌐</span>
              5. Google Pay · Pago Express Android & Chrome
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permite pagar en 1 toque usando las tarjetas guardadas en la cuenta Google de los clientes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.googlePayActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.googlePayActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, googlePayActivo: v })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Google Merchant ID</Label>
          <Input
            value={borrador.googlePayMerchantId || ""}
            onChange={(e) => setBorrador({ ...borrador, googlePayMerchantId: e.target.value })}
            placeholder="avalcommunity-cr-google-pay"
          />
        </div>
      </section>

      {/* 6. CONFIGURACIÓN CRIPTOMONEDAS */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base text-amber-500">
              <Coins className="size-5" /> 6. Criptomonedas (USDT / Binance Pay)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recibe pagos globales en dólares digitales USDT sin riesgo de contracargo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.cryptoActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.cryptoActivo}
              onCheckedChange={(v) => setBorrador({ ...borrador, cryptoActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-2">
            <Label>Dirección de Billetera USDT</Label>
            <Input
              className="font-mono text-xs"
              value={borrador.cryptoWalletUsdt}
              onChange={(e) => setBorrador({ ...borrador, cryptoWalletUsdt: e.target.value })}
              placeholder="TY9v6eZzK8jL3p4q1r2s5t6u7v8w9x0y1z"
            />
          </div>
          <div className="space-y-2">
            <Label>Red Blockchain</Label>
            <Select
              value={borrador.cryptoRed}
              onValueChange={(v) => setBorrador({ ...borrador, cryptoRed: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRC20">TRC-20 (Tron - Recomendada)</SelectItem>
                <SelectItem value="BEP20">BEP-20 (Binance Smart Chain)</SelectItem>
                <SelectItem value="Polygon">Polygon (MATIC)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Binance Pay ID (Opcional)</Label>
          <Input
            value={borrador.cryptoBinanceId}
            onChange={(e) => setBorrador({ ...borrador, cryptoBinanceId: e.target.value })}
            placeholder="ej: 384729104"
          />
          <p className="text-[11px] text-muted-foreground">
            Permite a clientes con cuenta en Binance transferir al instante por Binance Pay sin fees de red.
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. HERRAMIENTAS DE CRECIMIENTO VIRAL Y RETENCIÓN */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-lg font-black text-foreground flex items-center gap-2">
          <Sparkles className="size-5 text-amber-400" /> Herramientas de Viralidad, FOMO y Retención
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Activa o desactiva módulos independientes según tu campaña o estrategia comercial.
        </p>
      </div>

      {/* 7.1 NOTIFICACIONES FLOTANTES FOMO */}
      <section className="rounded-2xl border border-amber-500/40 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-black text-base text-amber-500">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500 font-black text-sm">🔥</span>
              7.1 Notificaciones Flotantes en Vivo (Prueba Social & FOMO)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Muestra alertas discretas en la esquina de la pantalla con compras recientes y ganadores de raspa/ruleta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.fomoActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.fomoActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, fomoActivo: v })}
            />
          </div>
        </div>
      </section>

      {/* 7.2 TABLA DE LÍDERES Y CONCURSO DE REFERIDOS */}
      <section className="rounded-2xl border border-primary/40 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-black text-base text-primary">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-black text-sm">👑</span>
              7.2 Concurso y Ranking Mensual de Referidos (Afiliados)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Despliega la tabla de posiciones pública con los Top 10 usuarios que más amigos han invitado y premios en efectivo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.rankingReferidosActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.rankingReferidosActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, rankingReferidosActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Premio 1° Lugar</Label>
            <Input
              value={borrador.rankingPremioPrimero || ""}
              onChange={(e) => setBorrador({ ...borrador, rankingPremioPrimero: e.target.value })}
              placeholder="₡250,000 SINPE"
            />
          </div>
          <div className="space-y-2">
            <Label>Premio 2° Lugar</Label>
            <Input
              value={borrador.rankingPremioSegundo || ""}
              onChange={(e) => setBorrador({ ...borrador, rankingPremioSegundo: e.target.value })}
              placeholder="₡100,000 SINPE"
            />
          </div>
          <div className="space-y-2">
            <Label>Premio 3° Lugar</Label>
            <Input
              value={borrador.rankingPremioTercero || ""}
              onChange={(e) => setBorrador({ ...borrador, rankingPremioTercero: e.target.value })}
              placeholder="₡50,000 SINPE"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Texto de Fecha / Cierre del Concurso</Label>
          <Input
            value={borrador.rankingFechaCierre || ""}
            onChange={(e) => setBorrador({ ...borrador, rankingFechaCierre: e.target.value })}
            placeholder="Último día del mes · 11:59 PM"
          />
        </div>
      </section>

      {/* 7.3 GENERADOR DE HISTORIAS PARA WHATSAPP */}
      <section className="rounded-2xl border border-emerald-500/40 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-black text-base text-emerald-500">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500 font-black text-sm">📸</span>
              7.3 Generador de Historias para WhatsApp & Instagram (9:16)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Habilita el botón en Checkout y Consulta de Tokens para descargar en 1 clic una imagen vertical HD con sus números y su link QR.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.generadorHistoriasActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.generadorHistoriasActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, generadorHistoriasActivo: v })}
            />
          </div>
        </div>
      </section>

      {/* 7.4 MINI-SORTEOS SEMANALES */}
      <section className="rounded-2xl border border-amber-500/40 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-black text-base text-amber-500">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500 font-black text-sm">🎮</span>
              7.4 Mini-Sorteos Semanales (Domingos de PlayStation / Efectivo)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sorteos automáticos con el mismo Token de los clientes para mantener las compras activas todas las semanas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.miniSorteosActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.miniSorteosActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, miniSorteosActivo: v })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Día del Sorteo Semanal</Label>
            <select
              value={borrador.miniSorteoDia ?? 0}
              onChange={(e) => setBorrador({ ...borrador, miniSorteoDia: Number(e.target.value) })}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
            >
              <option value={0}>Todos los Domingos (7:00 PM)</option>
              <option value={5}>Todos los Viernes (7:00 PM)</option>
              <option value={6}>Todos los Sábados (7:00 PM)</option>
              <option value={2}>Todos los Martes (7:00 PM)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Título del Mini-Sorteo Semanal</Label>
            <Input
              value={borrador.miniSorteoTitulo || ""}
              onChange={(e) => setBorrador({ ...borrador, miniSorteoTitulo: e.target.value })}
              placeholder="🎮 Domingos de PlayStation 5 Extra (Con tu mismo Token)"
            />
          </div>
          <div className="space-y-2">
            <Label>Premio a Entregar</Label>
            <Input
              value={borrador.miniSorteoPremio || ""}
              onChange={(e) => setBorrador({ ...borrador, miniSorteoPremio: e.target.value })}
              placeholder="PlayStation 5 o ₡350,000 en Efectivo por SINPE"
            />
          </div>
        </div>
      </section>

      {/* 7.5 BANNER DE INSTALACIÓN PWA */}
      <section className="rounded-2xl border border-sky-500/40 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-black text-base text-sky-500">
              <span className="flex size-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-500 font-black text-sm">📲</span>
              7.5 Banner de Instalación Rápida de la App (PWA)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Muestra el aviso flotante para instalar Aval Community CR en la pantalla de inicio de celulares Android y iPhone.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.pwaBannerActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.pwaBannerActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, pwaBannerActivo: v })}
            />
          </div>
        </div>
      </section>

      {/* 8. CONFIGURACIÓN DE SUPERTOKENS */}
      <section className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-card to-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-black text-base text-amber-400">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-black text-sm">👑</span>
              8. Configuración de SuperTokens (Opción Extra y Premio Cash)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Controla el precio adicional que pagan los clientes al activar SuperToken y el monto en efectivo USD extra que ganan con el 1° Lugar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.supertokenActivo ? "Activo" : "Inactivo"}</span>
            <Switch
              checked={borrador.supertokenActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, supertokenActivo: v })}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">
              Precio Adicional por SuperToken (₡ CRC)
            </Label>
            <Input
              type="number"
              value={borrador.supertokenPrecio ?? 1500}
              onChange={(e) => setBorrador({ ...borrador, supertokenPrecio: Number(e.target.value) })}
              placeholder="1500"
              className="border-amber-500/40 font-bold font-mono text-primary"
            />
            <span className="text-[11px] text-muted-foreground block">
              Monto en colones que se sumará al total cuando el usuario activa el switch de SuperToken.
            </span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">
              Monto del Premio en Efectivo SuperToken ($ USD Cash)
            </Label>
            <Input
              type="number"
              value={borrador.supertokenPremioUsd ?? 6000}
              onChange={(e) => setBorrador({ ...borrador, supertokenPremioUsd: Number(e.target.value) })}
              placeholder="6000"
              className="border-amber-500/40 font-bold font-mono text-amber-400"
            />
            <span className="text-[11px] text-muted-foreground block">
              Monto en dólares estadounidenses anunciado en toda la web (ej: 6000 para +$6,000 USD).
            </span>
          </div>
        </div>
      </section>

      {/* 11. AGENTE DE INTELIGENCIA ARTIFICIAL (MULTI-PROVEEDOR) */}
      <section className="rounded-2xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-[var(--shadow-card)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-inner">
              <Bot className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">Agente de Inteligencia Artificial (Burbuja Flotante)</h3>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary tracking-wide">
                  MULTI-LLM
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configura las API Keys de OpenAI, Gemini, DeepSeek o Claude para atender a tus clientes 24/7 en la plataforma.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{borrador.aiActivo ? "Burbuja Activa" : "Burbuja Inactiva"}</span>
            <Switch
              checked={borrador.aiActivo ?? true}
              onCheckedChange={(v) => setBorrador({ ...borrador, aiActivo: v })}
            />
          </div>
        </div>

        {/* Proveedor activo y datos generales */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Proveedor Activo de IA</Label>
            <Select
              value={borrador.aiProveedor || "gemini"}
              onValueChange={(v: "gemini" | "openai" | "deepseek" | "claude") =>
                setBorrador({ ...borrador, aiProveedor: v })
              }
            >
              <SelectTrigger className="border-primary/50 font-semibold">
                <SelectValue placeholder="Seleccionar Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">✨ Google Gemini (Recomendado)</SelectItem>
                <SelectItem value="openai">⚡ OpenAI (ChatGPT)</SelectItem>
                <SelectItem value="deepseek">🐋 DeepSeek</SelectItem>
                <SelectItem value="claude">🧠 Anthropic Claude</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-muted-foreground block">
              El motor que procesará las conversaciones de los usuarios.
            </span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Nombre del Asistente</Label>
            <Input
              type="text"
              value={borrador.aiNombre || "Aval-IA · Asistente 24/7"}
              onChange={(e) => setBorrador({ ...borrador, aiNombre: e.target.value })}
              placeholder="Aval-IA · Asistente 24/7"
            />
            <span className="text-[11px] text-muted-foreground block">
              Nombre visible en la cabecera de la burbuja flotante.
            </span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Prueba de Conexión</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => { void ejecutarPruebaIA(); }}
              disabled={probandoIA}
              className="w-full gap-2 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-bold"
            >
              {probandoIA ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Zap className="size-4 text-amber-400" />
              )}
              Probar Conexión Activa
            </Button>
            <span className="text-[11px] text-muted-foreground block">
              Valida la API Key y modelo activo en tiempo real.
            </span>
          </div>
        </div>

        {/* Acordeón / Tarjetas de Credenciales de Proveedores */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* 1. Google Gemini */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              borrador.aiProveedor === "gemini"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/60 bg-card/60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span className="font-bold text-sm">Google Gemini</span>
              </div>
              {borrador.aiProveedor === "gemini" && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ACTIVO
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold text-muted-foreground">Gemini API Key</Label>
                  <button
                    type="button"
                    onClick={() => toggleMostrarKey("gemini")}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    {mostrarKeys["gemini"] ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    {mostrarKeys["gemini"] ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <Input
                  type={mostrarKeys["gemini"] ? "text" : "password"}
                  value={borrador.aiGeminiKey || ""}
                  onChange={(e) => setBorrador({ ...borrador, aiGeminiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground">Modelo</Label>
                <Select
                  value={borrador.aiGeminiModel || "gemini-1.5-flash"}
                  onValueChange={(v) => setBorrador({ ...borrador, aiGeminiModel: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">gemini-1.5-flash (Ultrarrápido & Económico)</SelectItem>
                    <SelectItem value="gemini-2.0-flash">gemini-2.0-flash (Última Generación)</SelectItem>
                    <SelectItem value="gemini-1.5-pro">gemini-1.5-pro (Máxima Capacidad)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. OpenAI */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              borrador.aiProveedor === "openai"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/60 bg-card/60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <span className="font-bold text-sm">OpenAI (ChatGPT)</span>
              </div>
              {borrador.aiProveedor === "openai" && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ACTIVO
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold text-muted-foreground">OpenAI API Key</Label>
                  <button
                    type="button"
                    onClick={() => toggleMostrarKey("openai")}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    {mostrarKeys["openai"] ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    {mostrarKeys["openai"] ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <Input
                  type={mostrarKeys["openai"] ? "text" : "password"}
                  value={borrador.aiOpenaiKey || ""}
                  onChange={(e) => setBorrador({ ...borrador, aiOpenaiKey: e.target.value })}
                  placeholder="sk-proj-..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground">Modelo</Label>
                <Select
                  value={borrador.aiOpenaiModel || "gpt-4o-mini"}
                  onValueChange={(v) => setBorrador({ ...borrador, aiOpenaiModel: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">gpt-4o-mini (Recomendado & Rápido)</SelectItem>
                    <SelectItem value="gpt-4o">gpt-4o (Omni Avanzado)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo (Clásico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 3. DeepSeek */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              borrador.aiProveedor === "deepseek"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/60 bg-card/60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🐋</span>
                <span className="font-bold text-sm">DeepSeek</span>
              </div>
              {borrador.aiProveedor === "deepseek" && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ACTIVO
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold text-muted-foreground">DeepSeek API Key</Label>
                  <button
                    type="button"
                    onClick={() => toggleMostrarKey("deepseek")}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    {mostrarKeys["deepseek"] ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    {mostrarKeys["deepseek"] ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <Input
                  type={mostrarKeys["deepseek"] ? "text" : "password"}
                  value={borrador.aiDeepseekKey || ""}
                  onChange={(e) => setBorrador({ ...borrador, aiDeepseekKey: e.target.value })}
                  placeholder="sk-..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground">Modelo</Label>
                <Select
                  value={borrador.aiDeepseekModel || "deepseek-chat"}
                  onValueChange={(v) => setBorrador({ ...borrador, aiDeepseekModel: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-chat">deepseek-chat (V3 Conversacional)</SelectItem>
                    <SelectItem value="deepseek-reasoner">deepseek-reasoner (R1 Razonamiento)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 4. Anthropic Claude */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              borrador.aiProveedor === "claude"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/60 bg-card/60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🧠</span>
                <span className="font-bold text-sm">Anthropic Claude</span>
              </div>
              {borrador.aiProveedor === "claude" && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ACTIVO
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold text-muted-foreground">Claude API Key</Label>
                  <button
                    type="button"
                    onClick={() => toggleMostrarKey("claude")}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    {mostrarKeys["claude"] ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    {mostrarKeys["claude"] ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <Input
                  type={mostrarKeys["claude"] ? "text" : "password"}
                  value={borrador.aiClaudeKey || ""}
                  onChange={(e) => setBorrador({ ...borrador, aiClaudeKey: e.target.value })}
                  placeholder="sk-ant-..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground">Modelo</Label>
                <Select
                  value={borrador.aiClaudeModel || "claude-3-5-haiku-20241022"}
                  onValueChange={(v) => setBorrador({ ...borrador, aiClaudeModel: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-3-5-haiku-20241022">claude-3-5-haiku (Rápido y Preciso)</SelectItem>
                    <SelectItem value="claude-3-5-sonnet-20241022">claude-3-5-sonnet (Alta Inteligencia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Saludo inicial y Prompt del sistema */}
        <div className="space-y-4 pt-2 border-t border-border/40">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Mensaje de Saludo Inicial (Bienvenida)</Label>
            <Input
              type="text"
              value={borrador.aiSaludo || ""}
              onChange={(e) => setBorrador({ ...borrador, aiSaludo: e.target.value })}
              placeholder="¡Hola! Pura vida 🇨🇷 Soy Aval-IA..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">Prompt del Sistema / Conocimiento Base</Label>
              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                🚀 Modo Cerrador de Ventas Activo
              </span>
            </div>
            <textarea
              rows={5}
              value={borrador.aiSystemPrompt || ""}
              onChange={(e) => setBorrador({ ...borrador, aiSystemPrompt: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-sans text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Instrucciones para la IA..."
            />
            <span className="text-[11px] text-muted-foreground block">
              Configurado con técnicas de cierre comercial (llamados a la acción al Checkout/SINPE) y filtro de seguridad que bloquea automáticamente consultas técnicas internas o sobre cómo fue programada la app.
            </span>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button
          variant="hero"
          size="xl"
          onClick={() => { void guardar(); }}
          disabled={guardando}
          className="shadow-2xl gap-2 font-bold"
        >
          {guardando ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />} Guardar Toda la Configuración
        </Button>
      </div>
    </div>
  );
}