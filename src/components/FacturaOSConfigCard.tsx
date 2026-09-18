import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getFacturaOSConfig, saveFacturaOSConfig, verificarConexionFacturaOS } from "@/lib/facturaos";

export function FacturaOSConfigCard() {
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api/v1/invoices");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const cfg = getFacturaOSConfig();
    setApiUrl(cfg.apiUrl);
    setApiKey(cfg.apiKey);
  }, []);

  const handleProbar = async () => {
    setLoading(true);
    try {
      const res = await verificarConexionFacturaOS(apiUrl, apiKey);
      setStatus("ok");
      setDetails(res.establishment);
      toast.success(`¡Conectado exitosamente con ${res.establishment.name}!`);
    } catch (err: any) {
      setStatus("error");
      toast.error(err.message || "Error al comunicar con FacturaOS Hub");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = () => {
    saveFacturaOSConfig(apiUrl, apiKey);
    toast.success("Credenciales de FacturaOS guardadas en este dispositivo.");
  };

  return (
    <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-50/20 via-card to-secondary/30 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Facturación Electrónica (FacturaOS Hub)
              </CardTitle>
              <CardDescription className="text-xs">
                Vinculación directa con el Ministerio de Hacienda para emisión de Facturas y Tiquetes (v4.4)
              </CardDescription>
            </div>
          </div>

          <div>
            {status === "ok" ? (
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 px-3 py-1 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Conectado con Hacienda
              </Badge>
            ) : status === "error" ? (
              <Badge variant="destructive" className="font-bold gap-1 px-3 py-1 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                Sin Conexión
              </Badge>
            ) : (
              <Badge variant="outline" className="font-semibold gap-1 text-indigo-600 border-indigo-200 bg-indigo-50/50 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                Bóveda FacturaOS
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="facturaos-api-url" className="text-xs font-bold">
              URL del Servidor FacturaOS Hub
            </Label>
            <Input
              id="facturaos-api-url"
              placeholder="http://localhost:3000/api/v1/invoices"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="font-mono text-xs h-10"
            />
            <p className="text-[11px] text-muted-foreground">
              Servicio local o en la nube que firma los XMLs y los transmite a Hacienda.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facturaos-api-key" className="text-xs font-bold">
              Clave API de AvalCar (API Key)
            </Label>
            <div className="relative">
              <Input
                id="facturaos-api-key"
                type={showKey ? "text" : "password"}
                placeholder="fct_live_avalcarcr_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-xs pr-10 h-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                title={showKey ? "Ocultar clave" : "Mostrar clave"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Obtenida en FacturaOS: <code>Configuración &gt; Conexión API</code>
            </p>
          </div>
        </div>

        {details && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
            <p className="font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Empresa Vinculada: {details.name}
            </p>
            <p className="text-muted-foreground text-[11px]">
              Cédula Jurídica: <strong className="font-mono text-foreground">{details.legalId}</strong> | Ambiente ATV:{" "}
              <strong className="uppercase text-foreground">{details.environment}</strong> | Código Actividad:{" "}
              <strong className="font-mono text-foreground">{details.economicActivity}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleProbar}
            disabled={loading}
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-bold gap-1.5 h-9"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            )}
            {loading ? "Verificando..." : "⚡ Probar Conexión con FacturaOS"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleGuardar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9"
          >
            Guardar Credenciales FacturaOS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
