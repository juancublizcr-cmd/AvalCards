import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Database,
  ExternalLink,
  HelpCircle,
  Key,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Server,
  ShieldCheck,
  Smartphone,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { upsertConfig, type Config } from "@/lib/admin-store";

interface SinpeAjustesTabProps {
  config: Config;
  setConfig: (c: Config) => void;
}

export function SinpeAjustesTab({ config, setConfig }: SinpeAjustesTabProps) {
  const [activo, setActivo] = useState(config.sinpeActivo ?? true);
  const [titulo, setTitulo] = useState(config.sinpeTitulo || "SINPE Móvil");
  const [descripcion, setDescripcion] = useState(
    config.sinpeDescripcion || "Paga por SINPE Móvil e ingresa el código generado en el motivo."
  );
  const [numeroSinpe, setNumeroSinpe] = useState(config.telefonoSinpe || "88658279");
  const [imapHost, setImapHost] = useState(config.sinpeImapHost || "imap.gmail.com");
  const [imapPuerto, setImapPuerto] = useState(config.sinpeImapPuerto || 993);
  const [imapSeguridad, setImapSeguridad] = useState<"ssl" | "tls" | "ninguna">(
    config.sinpeImapSeguridad || "ssl"
  );
  const [imapUsuario, setImapUsuario] = useState(config.sinpeImapUsuario || "");
  const [imapPassword, setImapPassword] = useState(config.sinpeImapPassword || "");
  const [debug, setDebug] = useState(config.sinpeDebug ?? true);
  const [banco, setBanco] = useState<"BCR" | "BAC" | "BNCR">(
    config.sinpeBancoMonitoreado || "BCR"
  );

  const [guardando, setGuardando] = useState(false);
  const [probando, setProbando] = useState(false);
  const [testResultado, setTestResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  const handleGuardar = async () => {
    setGuardando(true);
    const nuevo: Config = {
      ...config,
      sinpeActivo: activo,
      sinpeTitulo: titulo,
      sinpeDescripcion: descripcion,
      telefonoSinpe: numeroSinpe,
      sinpeImapHost: imapHost,
      sinpeImapPuerto: Number(imapPuerto) || 993,
      sinpeImapSeguridad: imapSeguridad,
      sinpeImapUsuario: imapUsuario,
      sinpeImapPassword: imapPassword,
      sinpeDebug: debug,
      sinpeBancoMonitoreado: banco,
    };

    try {
      await upsertConfig(nuevo);
      setConfig(nuevo);
      toast.success("Ajustes de SINPE Móvil guardados con éxito", {
        description: "Los cambios se aplican de inmediato en la tienda y en el checker.",
      });
    } catch (err: any) {
      toast.error("Error al guardar ajustes: " + (err.message || "desconocido"));
    } finally {
      setGuardando(false);
    }
  };

  const handleProbarConexion = async () => {
    setProbando(true);
    setTestResultado(null);

    if (!imapHost.trim()) {
      setTestResultado({
        ok: false,
        mensaje: "Debes especificar el host IMAP (ej: imap.gmail.com).",
      });
      setProbando(false);
      return;
    }

    if (!imapUsuario.trim()) {
      setTestResultado({
        ok: false,
        mensaje: "Debes ingresar tu correo de usuario IMAP antes de probar la conexión.",
      });
      setProbando(false);
      return;
    }

    if (!imapPassword.trim()) {
      setTestResultado({
        ok: false,
        mensaje: "Debes ingresar la contraseña de aplicación de tu correo para poder autenticar con el banco.",
      });
      setProbando(false);
      return;
    }

    try {
      const res = await fetch("/api/test-imap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: imapHost.trim(),
          port: Number(imapPuerto) || 993,
          user: imapUsuario.trim(),
          password: imapPassword.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestResultado({
          ok: Boolean(data.ok),
          mensaje:
            data.mensaje ||
            (data.ok
              ? `Autenticación exitosa en ${imapHost}:${imapPuerto}.`
              : "Credenciales rechazadas por el servidor de correo."),
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        setTestResultado({
          ok: false,
          mensaje:
            errData.mensaje ||
            `Error ${res.status}: No se pudo verificar la conexión con el servidor IMAP.`,
        });
      }
    } catch (e: any) {
      setTestResultado({
        ok: false,
        mensaje: `Error al probar conexión: ${e.message || "revisa la red o las credenciales"}.`,
      });
    } finally {
      setProbando(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tarjeta Principal de Ajustes */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Smartphone className="size-5 text-emerald-500" />
            Ajustes · Pasarela SINPE Móvil
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acepta pagos por SINPE Móvil con verificación de código en tiempo real antes de finalizar el pedido.
          </p>
        </div>

        {/* 1. Activar / Desactivar */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
          <div>
            <Label htmlFor="activar-sinpe" className="font-bold text-sm text-foreground block cursor-pointer">
              Activar pasarela SINPE Móvil
            </Label>
            <p className="text-xs text-muted-foreground">
              Habilita el botón de SINPE Móvil en el Checkout para los clientes.
            </p>
          </div>
          <input
            id="activar-sinpe"
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="size-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        {/* 2. Textos Públicos para el Cliente */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Título</Label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="SINPE Móvil"
              className="text-sm font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Descripción</Label>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Paga por SINPE Móvil e ingresa el código generado en el motivo."
              rows={2}
              className="text-xs font-sans resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Número SINPE Móvil (Oficial del Comercio)</Label>
            <Input
              value={numeroSinpe}
              onChange={(e) => setNumeroSinpe(e.target.value)}
              placeholder="88658279"
              className="font-mono text-sm font-bold text-blue-700"
            />
            <p className="text-[11px] text-muted-foreground">
              Número al cual los clientes deben transferir desde su app bancaria.
            </p>
          </div>
        </div>

        {/* 3. Banco Monitoreado */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <Label className="text-xs font-semibold text-foreground">Banco Emisor de Notificaciones</Label>
          <Select value={banco} onValueChange={(v: any) => setBanco(v)}>
            <SelectTrigger className="w-full text-xs font-sans">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BCR">Banco de Costa Rica (BCR) · mensajero@bancobcr.com</SelectItem>
              <SelectItem value="BAC">BAC Credomatic · notificaciones@baccredomatic.cr</SelectItem>
              <SelectItem value="BNCR">Banco Nacional (BNCR) · servicioalcliente@bncr.fi.cr</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. Conexión IMAP (Lector de Correo) */}
        <div className="space-y-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Server className="size-4 text-emerald-500" />
                Configuración del Servidor IMAP (Lector de Correos)
              </h4>
              <p className="text-xs text-muted-foreground">
                Permite al sistema revisar automáticamente los correos bancarios y validar las transferencias.
              </p>
            </div>
            <a
              href="https://support.google.com/mail/answer/185833?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              <span>Instrucciones para configurar IMAP</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs font-semibold text-foreground">Servidor IMAP</Label>
              <Input
                value={imapHost}
                onChange={(e) => setImapHost(e.target.value)}
                placeholder="imap.gmail.com"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Puerto</Label>
              <Input
                type="number"
                value={imapPuerto}
                onChange={(e) => setImapPuerto(Number(e.target.value) || 993)}
                placeholder="993"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Seguridad</Label>
              <Select value={imapSeguridad} onValueChange={(v: any) => setImapSeguridad(v)}>
                <SelectTrigger className="w-full text-xs font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssl">SSL (Recomendado)</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ninguna">Ninguna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Usuario IMAP (Correo)</Label>
              <Input
                value={imapUsuario}
                onChange={(e) => setImapUsuario(e.target.value)}
                placeholder="tu-correo@gmail.com"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Contraseña de Aplicación</Label>
              <Input
                type="password"
                value={imapPassword}
                onChange={(e) => setImapPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* 5. Modo Depuración */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30">
          <div>
            <Label htmlFor="debug-sinpe" className="font-bold text-xs text-foreground block cursor-pointer">
              Modo Depuración
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Activar logs detallados en la consola administrativa.
            </p>
          </div>
          <input
            id="debug-sinpe"
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
            className="size-4 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        {/* Mensaje de Resultado del Test de Conexión */}
        {testResultado && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResultado.ok
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            {testResultado.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <HelpCircle className="size-4 shrink-0" />}
            <span>{testResultado.mensaje}</span>
          </div>
        )}

        {/* 6. Botones de Acción */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleProbarConexion}
            disabled={probando}
            className="gap-1.5 text-xs h-9"
          >
            <Wifi className={`size-3.5 ${probando ? "animate-spin" : ""}`} />
            <span>{probando ? "Probando..." : "Probar Conexión IMAP"}</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleGuardar}
            disabled={guardando}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs h-9 px-5 shadow-sm"
          >
            <Save className="size-3.5" />
            <span>{guardando ? "Guardando..." : "Guardar Ajustes"}</span>
          </Button>
        </div>
      </div>

      {/* Esquema de Base de Datos Opcional (Completamente Oculto por Defecto) */}
      <details className="group rounded-xl border border-border/60 bg-card/60 p-4 text-xs transition-all">
        <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground flex items-center justify-between list-none">
          <span className="flex items-center gap-2">
            <Database className="size-4 text-emerald-500" />
            <span>Estructura SQL de Tablas en Supabase (Opcional para DBAs)</span>
          </span>
          <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
          <p className="text-[11px] text-muted-foreground">
            Estructura DDL para crear las tablas <code className="text-emerald-400">payments</code> y <code className="text-emerald-400">payment_requests</code> con soporte Realtime:
          </p>
          <pre className="p-3 bg-zinc-950 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto border border-border">
{`-- Tablas recomendadas para SINPE Auto en Supabase
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid,
  client_reference text unique not null,
  amount numeric(12, 2) not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid references public.payment_requests(id) on delete set null,
  orden_id text,
  sinpe_reference text not null,
  sender_name text,
  sender_phone text,
  amount numeric(12, 2) not null,
  currency text default 'CRC',
  status text default 'confirmed',
  raw_payload jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists idx_payments_sinpe_ref on public.payments(sinpe_reference);
alter publication supabase_realtime add table public.payments;`}
          </pre>
        </div>
      </details>
    </div>
  );
}
