import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceso Administrativo | Aval Motors CR" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Login,
});

const AUTH_KEY = "aval_admin_session";

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(user: { id: string; email: string; nombre: string }) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  sessionStorage.removeItem(AUTH_KEY);
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@avalmotors.cr");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    // Si ya hay sesión activa, redirigir a /admin
    if (getAdminSession()) {
      void navigate({ to: "/admin" });
    } else {
      setVerificando(false);
    }
  }, [navigate]);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa tu correo y contraseña");
      return;
    }

    setCargando(true);
    try {
      // 1. Intentar con RPC en base de datos
      const { data, error } = await supabase.rpc("login_admin", {
        p_email: email.trim(),
        p_password: password.trim(),
      });

      if (!error && data?.success) {
        setAdminSession(data.user);
        toast.success("¡Bienvenido al panel administrativo!");
        void navigate({ to: "/admin" });
        return;
      }

      // 2. Si falla RPC, intentar fallback con Supabase Auth directo
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (!authError && authData.session) {
        setAdminSession({
          id: authData.user.id,
          email: authData.user.email ?? email,
          nombre: "Administrador",
        });
        toast.success("¡Bienvenido al panel administrativo!");
        void navigate({ to: "/admin" });
        return;
      }

      toast.error("Credenciales inválidas", {
        description: "Verifica tu correo y contraseña.",
      });
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Flame className="size-8 text-primary" />
            <span className="font-display text-3xl tracking-wide">
              Aval <span className="text-primary">Motors CR</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold">Consola Administrativa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con tus credenciales de administrador
          </p>
        </div>

        <form onSubmit={(e) => { void iniciarSesion(e); }} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@avalmotors.cr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={cargando}>
            {cargando ? <Loader2 className="animate-spin" /> : <KeyRound />} Iniciar Sesión
          </Button>
        </form>

        <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
          Credenciales iniciales: <strong>admin@avalmotors.cr</strong>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
