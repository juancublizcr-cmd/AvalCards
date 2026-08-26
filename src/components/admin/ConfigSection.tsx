import { useState } from "react";
import {
  Coins,
  CreditCard,
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
                  placeholder="50686092162"
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
            <Label>Teléfono SINPE Móvil</Label>
            <Input
              value={borrador.telefonoSinpe}
              onChange={(e) => setBorrador({ ...borrador, telefonoSinpe: e.target.value })}
              placeholder="8609-2162"
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

      {/* 4. CONFIGURACIÓN CRIPTOMONEDAS */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base text-amber-500">
              <Coins className="size-5" /> 3. Criptomonedas (USDT / Binance Pay)
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