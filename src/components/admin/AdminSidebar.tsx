import {
  BarChart3,
  CreditCard,
  Dices,
  ExternalLink,
  Flame,
  Gift,
  LogOut,
  Scale,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

export type AdminSeccion =
  | "resumen"
  | "pagos"
  | "sorteos"
  | "raspa"
  | "inventario"
  | "escrutinio"
  | "clientes"
  | "referidos"
  | "legal"
  | "config";

export const SECCIONES: { id: AdminSeccion; label: string; icono: LucideIcon }[] = [
  { id: "resumen", label: "Resumen", icono: BarChart3 },
  { id: "pagos", label: "Pagos y Transacciones", icono: CreditCard },
  { id: "sorteos", label: "Fecha del Evento y Premios", icono: Trophy },
  { id: "raspa", label: "Raspa y Gana Express", icono: Gift },
  { id: "inventario", label: "Generador e Inventario", icono: Dices },
  { id: "escrutinio", label: "Escrutinio del Sorteo", icono: Target },
  { id: "clientes", label: "Clientes (CRM)", icono: Users },
  { id: "referidos", label: "Referidos y Afiliados", icono: Share2 },
  { id: "legal", label: "Protocolo Notarial & Legal", icono: Scale },
  { id: "config", label: "Configuración y Pasarelas", icono: Settings },
];

export function AdminSidebarContent({
  activa,
  onChange,
  pendientes,
  userEmail,
  onLogout,
  onItemClick,
}: {
  activa: AdminSeccion;
  onChange: (s: AdminSeccion) => void;
  pendientes: number;
  userEmail?: string | null;
  onLogout?: () => void;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="border-b border-border px-5 py-5">
        <Link to="/" className="flex items-center gap-2" onClick={onItemClick}>
          <Flame className="size-5 text-primary" />
          <span className="font-display text-2xl tracking-wide">
            Aval <span className="text-primary">Community CR</span>
          </span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Consola administrativa</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Gestión Interna
        </div>
        {SECCIONES.map((s) => {
          const activo = s.id === activa;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.id);
                onItemClick?.();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                activo
                  ? "bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-fire)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <s.icono className="size-4 shrink-0" />
              <span className="flex-1">{s.label}</span>
              {s.id === "pagos" && pendientes > 0 ? (
                <span className="rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold text-destructive-foreground">
                  {pendientes}
                </span>
              ) : null}
            </button>
          );
        })}

        <div className="pt-5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Acceso a Páginas Públicas
          </div>
          <div className="space-y-1">
            <Link
              to="/"
              onClick={onItemClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Flame className="size-4 shrink-0 text-primary" />
              <span className="flex-1">Página Principal</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </Link>
            <Link
              to="/validar"
              onClick={onItemClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Search className="size-4 shrink-0 text-primary" />
              <span className="flex-1">Validar Stickers</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </Link>
            <Link
              to="/checkout"
              onClick={onItemClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ShoppingCart className="size-4 shrink-0 text-primary" />
              <span className="flex-1">Página de Checkout</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <div className="truncate">
          <span className="block font-medium text-foreground">{userEmail || "Admin"}</span>
          <span className="text-[11px]">Administrador</span>
        </div>
        {onLogout && (
          <button
            onClick={() => {
              onLogout();
              onItemClick?.();
            }}
            className="rounded p-1.5 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminSidebar({
  activa,
  onChange,
  pendientes,
  userEmail,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: {
  activa: AdminSeccion;
  onChange: (s: AdminSeccion) => void;
  pendientes: number;
  userEmail?: string | null;
  onLogout?: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <AdminSidebarContent
          activa={activa}
          onChange={onChange}
          pendientes={pendientes}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col bg-card border-r border-border">
          <SheetTitle className="sr-only">Menú de Navegación Admin</SheetTitle>
          <SheetDescription className="sr-only">Navega entre las secciones del panel administrativo</SheetDescription>
          <AdminSidebarContent
            activa={activa}
            onChange={onChange}
            pendientes={pendientes}
            userEmail={userEmail}
            onLogout={onLogout}
            onItemClick={() => setMobileOpen?.(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}