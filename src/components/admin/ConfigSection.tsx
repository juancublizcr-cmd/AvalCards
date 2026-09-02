import { useState } from "react";
import {
  Coins,
  CreditCard,
  Crown,
  Globe,
  Key,
  Loader2,
  Lock,
  Save,
  ShieldAlert,
  Smartphone,
  Sparkles,
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

export function ConfigSection({
  config,
  setConfig,
}: {
  config: Config;
  setConfig: (c: Config) => void;
}) {
  const [borrador, setBorrador] = useState<Config>(config);
  const [guardando, setGuardando] = useState(false);

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
            <Label>Intentos de cambio de stickers</Label>
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
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500 font-black text-sm">⛽</span>
              7.4 Mini-Sorteos Semanales (Gasolina / Supermercado)
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rifas semanales automáticas de calentamiento para mantener la emoción viva cada viernes.
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Título del Mini-Sorteo Semanal</Label>
            <Input
              value={borrador.miniSorteoTitulo || ""}
              onChange={(e) => setBorrador({ ...borrador, miniSorteoTitulo: e.target.value })}
              placeholder="⛽ Viernes de Tanque Lleno (₡50,000 en Combustible)"
            />
          </div>
          <div className="space-y-2">
            <Label>Premio a Entregar</Label>
            <Input
              value={borrador.miniSorteoPremio || ""}
              onChange={(e) => setBorrador({ ...borrador, miniSorteoPremio: e.target.value })}
              placeholder="₡50,000 en Gasolina Delta / Uno"
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