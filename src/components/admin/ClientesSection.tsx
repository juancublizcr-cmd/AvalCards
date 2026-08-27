import { useMemo, useState } from "react";
import { Crown, Download, FileSpreadsheet, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Cliente } from "@/lib/admin-store";
import { exportarClientesExcel } from "@/lib/export-excel";

const POR_PAGINA = 8;

export function ClientesSection({ clientes }: { clientes: Cliente[] }) {
  const [q, setQ] = useState("");
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(t) ||
        c.email.toLowerCase().includes(t) ||
        c.telefono.includes(t),
    );
  }, [clientes, q]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const actual = Math.min(pagina, paginas);
  const visibles = filtrados.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA);

  const handleExportarExcel = () => {
    if (filtrados.length === 0) {
      toast.error("No hay clientes para exportar");
      return;
    }
    exportarClientesExcel(filtrados);
    toast.success("¡Listado de clientes exportado a Excel!");
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold text-lg">Base de datos de clientes</h2>
          <p className="text-sm text-muted-foreground">{filtrados.length} persona(s) registradas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportarExcel} className="gap-1.5 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">
            <FileSpreadsheet className="size-4 text-emerald-500" /> Exportar a Excel
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar por nombre, correo o teléfono"
              className="w-72 pl-9"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 font-medium">Compras</th>
              <th className="px-5 py-3 font-medium">Tokens</th>
              <th className="px-5 py-3 font-medium">SuperToken</th>
              <th className="px-5 py-3 font-medium">Invertido</th>
              <th className="px-5 py-3 font-medium">Última compra</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((c) => (
              <tr key={c.telefono} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="font-medium">{c.nombre}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </td>
                <td className="px-5 py-4 font-mono">{c.telefono}</td>
                <td className="px-5 py-4">{c.compras}</td>
                <td className="px-5 py-4 font-bold text-primary">{c.stickers}</td>
                <td className="px-5 py-4">
                  {c.supertokenCount > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 text-xs font-bold text-amber-500">
                      <Crown className="size-3" /> SuperToken ({c.supertokenCount})
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-5 py-4 font-semibold">₡{c.invertido.toLocaleString("es-CR")}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {new Date(c.ultimaFecha).toLocaleDateString("es-CR")}
                </td>
              </tr>
            ))}
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  No se encontraron clientes.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
        <span className="text-muted-foreground">
          Página {actual} de {paginas}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={actual <= 1}
            onClick={() => setPagina(actual - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={actual >= paginas}
            onClick={() => setPagina(actual + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}