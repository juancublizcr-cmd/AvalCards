import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Flame, LogOut, Menu, Search } from "lucide-react";
import { actualizarEstadoOrden, fetchOrdenes, type Orden } from "@/lib/orders";
import {
  fetchClientes,
  fetchConfig,
  fetchInstantaneos,
  fetchInventario,
  fetchPremios,
  fetchSorteo,
  upsertConfig,
  type Cliente,
  type Config,
  type Inventario,
  type PremioInstantaneo,
  type Premio,
  type Sorteo,
  CONFIG_DEFAULT,
  SORTEO_DEFAULT,
  PREMIOS_DEFAULT,
} from "@/lib/admin-store";
import { AdminSidebar, SECCIONES, type AdminSeccion } from "@/components/admin/AdminSidebar";
import { ResumenSection } from "@/components/admin/ResumenSection";
import { PagosSection } from "@/components/admin/PagosSection";
import { PremiosSection } from "@/components/admin/PremiosSection";
import { RaspaSection } from "@/components/admin/RaspaSection";
import { InventarioSection } from "@/components/admin/InventarioSection";
import { EscrutinioSection } from "@/components/admin/EscrutinioSection";
import { ClientesSection } from "@/components/admin/ClientesSection";
import { ReferidosSection } from "@/components/admin/ReferidosSection";
import { ReglamentoNotarialSection } from "@/components/admin/ReglamentoNotarialSection";
import { ConfigSection } from "@/components/admin/ConfigSection";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getAdminSession, clearAdminSession } from "@/routes/login";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard CRM | Aval Community CR" },
      {
        name: "description",
        content:
          "Consola administrativa de Aval Community CR: métricas, pagos SINPE, sorteos, inventario, escrutinio y CRM de clientes.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState<AdminSeccion>("resumen");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [premios, setPremios] = useState<Premio[]>(PREMIOS_DEFAULT);
  const [sorteo, setSorteo] = useState<Sorteo>(SORTEO_DEFAULT);
  const [inventario, setInventario] = useState<Inventario | null>(null);
  const [instantaneos, setInstantaneos] = useState<PremioInstantaneo[]>([]);
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // 1. Validar autenticación
    const sesion = getAdminSession();
    if (!sesion) {
      void navigate({ to: "/login" });
      return;
    }
    setUserEmail(sesion.email ?? "Admin");

    // 2. Cargar datos
    async function cargar() {
      try {
        const [ordenesData, premiosData, sorteoData, inventarioData, instantaneosData, configData] =
          await Promise.all([
            fetchOrdenes(),
            fetchPremios(),
            fetchSorteo(),
            fetchInventario(),
            fetchInstantaneos(),
            fetchConfig(),
          ]);

        setOrdenes(ordenesData);
        setPremios(premiosData);
        setSorteo(sorteoData);
        setInventario(inventarioData);
        setInstantaneos(instantaneosData);
        setConfig(configData);
        setClientes(await fetchClientes(ordenesData));
      } catch (err) {
        console.warn("Carga administrativa completada con fallbacks:", err);
      } finally {
        setCargando(false);
      }
    }
    void cargar();
  }, [navigate]);

  const cerrarSesion = async () => {
    clearAdminSession();
    try {
      await supabase.auth.signOut();
    } catch {}
    toast.success("Sesión cerrada");
    void navigate({ to: "/login" });
  };

  const cambiarEstado = async (id: string, estado: Orden["estado"]) => {
    try {
      await actualizarEstadoOrden(id, estado);
      setOrdenes((prev) => prev.map((o) => (o.id === id ? { ...o, estado } : o)));
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar estado en Supabase");
    }
  };

  const pendientes = ordenes.filter((o) => o.estado === "pendiente");
  const aprobadas = ordenes.filter((o) => o.estado === "aprobada");
  const vendidos = aprobadas.reduce((s, o) => s + o.cantidad, 0);
  const reservados = pendientes.reduce((s, o) => s + o.cantidad, 0);
  const titulo = SECCIONES.find((s) => s.id === seccion)?.label ?? "Resumen";

  return (
    <div className="admin-light min-h-screen bg-background">
      <AdminSidebar
        activa={seccion}
        onChange={setSeccion}
        pendientes={pendientes.length}
        userEmail={userEmail}
        onLogout={cerrarSesion}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden shrink-0 h-9 w-9"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú de navegación"
              >
                <Menu className="size-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">{titulo}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                  {sorteo.nombre || "Aval Community CR"} · consola de administración
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  const nueva = !config.ventasActivas;
                  const actualizado = { ...config, ventasActivas: nueva };
                  setConfig(actualizado);
                  try {
                    await upsertConfig(actualizado);
                    toast.success(nueva ? "🟢 ¡Ventas Públicas Activadas!" : "🟡 ¡Modo Preventa / Promocional Activado!");
                  } catch (err) {
                    console.error(err);
                    toast.error("Error al guardar estado");
                  }
                }}
                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  config.ventasActivas
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25"
                }`}
                title="Haz clic para alternar entre Modo Promocional y Venta Directa"
              >
                <span className={`size-2 rounded-full ${config.ventasActivas ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
                {config.ventasActivas ? "🟢 Venta Abierta" : "🟡 Modo Promo"}
              </button>

              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/validar">
                  <Search className="size-4" /> Validar Stickers
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="h-8 px-2.5 sm:px-3 text-xs sm:text-sm">
                <Link to="/">
                  <Flame className="size-4 text-primary" /> <span className="hidden xs:inline">Ver </span>Sitio Web <ExternalLink className="size-3.5 opacity-70" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { void cerrarSesion(); }} title="Cerrar sesión" className="h-8 w-8 p-0">
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="px-6 py-6">
          {cargando ? (
            <div className="flex h-64 items-center justify-center">
              <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {seccion === "resumen" ? (
                <ResumenSection ordenes={ordenes} onIrAPagos={() => setSeccion("pagos")} />
              ) : null}
              {seccion === "pagos" ? (
                <PagosSection ordenes={ordenes} onEstado={cambiarEstado} />
              ) : null}
              {seccion === "sorteos" ? (
                <PremiosSection
                  premios={premios}
                  setPremios={setPremios}
                  sorteo={sorteo}
                  setSorteo={setSorteo}
                />
              ) : null}
              {seccion === "raspa" ? (
                <RaspaSection
                  sorteo={sorteo}
                  setSorteo={setSorteo}
                />
              ) : null}
              {seccion === "inventario" ? (
                <InventarioSection
                  sorteo={sorteo}
                  setSorteo={setSorteo}
                  inventario={inventario}
                  setInventario={setInventario}
                  instantaneos={instantaneos}
                  setInstantaneos={setInstantaneos}
                  vendidos={vendidos}
                  reservados={reservados}
                />
              ) : null}
              {seccion === "escrutinio" ? <EscrutinioSection /> : null}
              {seccion === "clientes" ? <ClientesSection clientes={clientes} /> : null}
              {seccion === "referidos" ? (
                <ReferidosSection ordenes={ordenes} config={config} setConfig={setConfig} />
              ) : null}
              {seccion === "legal" ? (
                <ReglamentoNotarialSection config={config} sorteo={sorteo} />
              ) : null}
              {seccion === "config" ? <ConfigSection config={config} setConfig={setConfig} /> : null}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
