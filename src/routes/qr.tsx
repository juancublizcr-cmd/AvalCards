import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrFlyerSection } from "@/components/admin/QrFlyerSection";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "Afiche & Código QR Oficial | Aval Community CR" },
      {
        name: "description",
        content:
          "Descarga e imprime el código QR oficial de Aval Community CR en alta resolución.",
      },
    ],
  }),
  component: QrPage,
});

function QrPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="size-6 text-primary" />
            <span className="font-display text-2xl tracking-widest">
              AVAL <span className="text-primary">COMMUNITY CR</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="text-xs">
                Ir al Panel Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <QrFlyerSection />
      </main>
    </div>
  );
}
