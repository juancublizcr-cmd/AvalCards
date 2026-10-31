import { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  Trash2,
  Edit,
  Save,
  Lock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GRUPOS_SECCIONES,
  SECCIONES,
  type AdminSeccion,
} from "@/components/admin/AdminSidebar";
import {
  fetchAdminRolesConfig,
  saveAdminRolesConfig,
  hashPassword,
  generarSalt,
  TODAS_LAS_SECCIONES,
  type AdminRolesConfig,
  type SubadminUser,
} from "@/lib/admin-roles";

export function UsuariosPermisosSection() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [config, setConfig] = useState<AdminRolesConfig>({
    superadminEmail: "admin@avalmotors.cr",
    subadmins: [],
  });

  // Estado para cambio de clave del Superadmin
  const [nuevaClaveSuper, setNuevaClaveSuper] = useState("");
  const [confirmarClaveSuper, setConfirmarClaveSuper] = useState("");
  const [mostrarClaveSuper, setMostrarClaveSuper] = useState(false);
  const [guardandoClaveSuper, setGuardandoClaveSuper] = useState(false);

  // Estado para modal / formulario de Sub-administrador
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState<string | null>(null);
  const [formNombre, setFormNombre] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formMostrarPass, setFormMostrarPass] = useState(false);
  const [formActivo, setFormActivo] = useState(true);
  const [formPermisos, setFormPermisos] = useState<AdminSeccion[]>([
    "pagos",
    "inventario",
    "clientes",
  ]);

  useEffect(() => {
    void cargarConfig();
  }, []);

  const cargarConfig = async () => {
    setLoading(true);
    try {
      const cfg = await fetchAdminRolesConfig();
      setConfig(cfg);
    } catch {
      toast.error("Error al cargar la configuración de roles");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarClaveSuperadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaClaveSuper.trim()) {
      toast.error("Ingresa una nueva contraseña para el Super Administrador");
      return;
    }
    if (nuevaClaveSuper.trim().length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (nuevaClaveSuper !== confirmarClaveSuper) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setGuardandoClaveSuper(true);
    try {
      const salt = generarSalt();
      const hash = await hashPassword(nuevaClaveSuper, salt);
      const nuevaConfig: AdminRolesConfig = {
        ...config,
        superadminPasswordHash: hash,
        superadminSalt: salt,
      };

      await saveAdminRolesConfig(nuevaConfig);
      setConfig(nuevaConfig);
      setNuevaClaveSuper("");
      setConfirmarClaveSuper("");
      toast.success("¡Contraseña de Super Administrador actualizada con éxito!");
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar contraseña");
    } finally {
      setGuardandoClaveSuper(false);
    }
  };

  const abrirCrearUsuario = () => {
    setUsuarioEditandoId(null);
    setFormNombre("");
    setFormEmail("");
    setFormPassword("");
    setFormActivo(true);
    setFormPermisos(["pagos", "inventario", "clientes"]); // 3 principales por defecto
    setModoEdicion(true);
  };

  const abrirEditarUsuario = (user: SubadminUser) => {
    setUsuarioEditandoId(user.id);
    setFormNombre(user.nombre);
    setFormEmail(user.email);
    setFormPassword(""); // Se deja vacío para no sobreescribir salvo que escriba una nueva
    setFormActivo(user.activo);
    setFormPermisos(user.permisos || []);
    setModoEdicion(true);
  };

  const togglePermiso = (seccionId: AdminSeccion) => {
    setFormPermisos((prev) =>
      prev.includes(seccionId)
        ? prev.filter((id) => id !== seccionId)
        : [...prev, seccionId],
    );
  };

  const seleccionarTresPrincipales = () => {
    setFormPermisos(["pagos", "inventario", "clientes"]);
    toast.info("Asignados los 3 enlaces: Pagos, Inventario y Clientes");
  };

  const seleccionarTodos = () => {
    setFormPermisos([...TODAS_LAS_SECCIONES]);
  };

  const deseleccionarTodos = () => {
    setFormPermisos([]);
  };

  const handleGuardarSubadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      toast.error("Ingresa el nombre del usuario");
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    // Si es nuevo usuario, la contraseña es obligatoria
    if (!usuarioEditandoId && (!formPassword.trim() || formPassword.trim().length < 6)) {
      toast.error("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    if (formPermisos.length === 0) {
      toast.error("Debes asignarle al menos 1 enlace del sidebar a este usuario");
      return;
    }

    setGuardando(true);
    try {
      let subadminsActualizados = [...config.subadmins];

      if (usuarioEditandoId) {
        // Editando existente
        const idx = subadminsActualizados.findIndex((u) => u.id === usuarioEditandoId);
        if (idx !== -1) {
          const userActual = subadminsActualizados[idx];
          let salt = userActual.salt;
          let passwordHash = userActual.passwordHash;

          if (formPassword.trim()) {
            salt = generarSalt();
            passwordHash = await hashPassword(formPassword, salt);
          }

          subadminsActualizados[idx] = {
            ...userActual,
            nombre: formNombre.trim(),
            email: formEmail.trim().toLowerCase(),
            activo: formActivo,
            permisos: formPermisos,
            salt,
            passwordHash,
          };
        }
      } else {
        // Creando nuevo
        const emailExiste = subadminsActualizados.some(
          (u) => u.email.toLowerCase() === formEmail.trim().toLowerCase(),
        );
        if (emailExiste) {
          toast.error("Ya existe un usuario con este correo electrónico");
          setGuardando(false);
          return;
        }

        const salt = generarSalt();
        const passwordHash = await hashPassword(formPassword, salt);
        const nuevo: SubadminUser = {
          id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          nombre: formNombre.trim(),
          email: formEmail.trim().toLowerCase(),
          passwordHash,
          salt,
          permisos: formPermisos,
          activo: formActivo,
          creadoEn: new Date().toISOString(),
        };

        subadminsActualizados.push(nuevo);
      }

      const nuevaCfg: AdminRolesConfig = {
        ...config,
        subadmins: subadminsActualizados,
      };

      await saveAdminRolesConfig(nuevaCfg);
      setConfig(nuevaCfg);
      setModoEdicion(false);
      toast.success(
        usuarioEditandoId
          ? "¡Permisos del usuario actualizados con éxito!"
          : "¡Nuevo usuario creado con permisos configurados!",
      );
    } catch (err: any) {
      toast.error(err.message || "Error al guardar usuario");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarSubadmin = async (userId: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el acceso para "${nombre}"?`)) {
      return;
    }

    try {
      const nuevaLista = config.subadmins.filter((u) => u.id !== userId);
      const nuevaCfg = { ...config, subadmins: nuevaLista };
      await saveAdminRolesConfig(nuevaCfg);
      setConfig(nuevaCfg);
      toast.success(`Acceso de "${nombre}" eliminado.`);
    } catch {
      toast.error("Error al eliminar usuario.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Cabecera */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
          <ShieldCheck className="size-3.5" /> Control de Acceso y Roles
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios y Permisos del Sidebar</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define quién puede entrar a tu plataforma y restringe con casillas exactamente cuáles enlaces del menú lateral puede ver y operar cada persona.
        </p>
      </div>

      {/* 1. CUENTA SUPERADMINISTRADOR */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <Lock className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  Cuenta Super Administrador
                  <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-black uppercase">
                    Control Total (16 Módulos)
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Usuario maestro con acceso ilimitado a todas las configuraciones y módulos del sistema.
                </CardDescription>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold px-3 py-1 rounded-lg bg-secondary text-foreground border border-border">
              {config.superadminEmail}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGuardarClaveSuperadmin} className="space-y-4 pt-2 border-t border-border/40">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-primary" /> Cambiar Contraseña del Super Administrador
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    type={mostrarClaveSuper ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={nuevaClaveSuper}
                    onChange={(e) => setNuevaClaveSuper(e.target.value)}
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarClaveSuper(!mostrarClaveSuper)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {mostrarClaveSuper ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Confirmar Contraseña</Label>
                <Input
                  type={mostrarClaveSuper ? "text" : "password"}
                  placeholder="Repite la nueva contraseña"
                  value={confirmarClaveSuper}
                  onChange={(e) => setConfirmarClaveSuper(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={guardandoClaveSuper || !nuevaClaveSuper}
                className="gap-1.5 font-bold"
              >
                <Save className="size-3.5" />
                {guardandoClaveSuper ? "Guardando..." : "Actualizar Contraseña de Superadmin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. SUB-ADMINISTRADORES CON ENLACES RESTRINGIDOS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Sub-Administradores y Operadores</h3>
            <p className="text-xs text-muted-foreground">
              Usuarios adicionales con permisos personalizados sobre los enlaces del Sidebar.
            </p>
          </div>
          {!modoEdicion && (
            <Button
              type="button"
              variant="hero"
              size="sm"
              onClick={abrirCrearUsuario}
              className="gap-1.5 font-bold shadow-md cursor-pointer"
            >
              <UserPlus className="size-4" /> + Crear Nuevo Usuario
            </Button>
          )}
        </div>

        {/* Formulario / Editor de Usuario */}
        {modoEdicion && (
          <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">
                    {usuarioEditandoId ? "Editar Permisos y Clave de Usuario" : "Crear Nuevo Usuario con Enlaces Restringidos"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Elige con un clic los módulos exactos a los que este usuario tendrá acceso en el menú lateral.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModoEdicion(false)}
                  className="size-8 p-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGuardarSubadmin} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Nombre Completo</Label>
                    <Input
                      placeholder="Ej: Allan Ramírez - Caja"
                      value={formNombre}
                      onChange={(e) => setFormNombre(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Correo de Acceso (Login)</Label>
                    <Input
                      type="email"
                      placeholder="Ej: operador@avalmotors.cr"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      {usuarioEditandoId ? "Nueva Contraseña (Opcional)" : "Contraseña de Ingreso"}
                    </Label>
                    <div className="relative">
                      <Input
                        type={formMostrarPass ? "text" : "password"}
                        placeholder={usuarioEditandoId ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setFormMostrarPass(!formMostrarPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {formMostrarPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-y border-border/50 py-3">
                  <div>
                    <Label className="text-xs font-bold">Estado del Usuario</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Si desactivas este switch, el usuario no podrá iniciar sesión en la plataforma.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{formActivo ? "Activo" : "Desactivado"}</span>
                    <Switch checked={formActivo} onCheckedChange={setFormActivo} />
                  </div>
                </div>

                {/* MATRIZ DE PERMISOS POR LINKS DEL SIDEBAR */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <Label className="text-xs font-bold flex items-center gap-1.5 text-primary">
                        <SlidersHorizontal className="size-3.5" /> Enlaces Permitidos en el Sidebar ({formPermisos.length} seleccionados)
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Los enlaces desmarcados desaparecerán por completo de su pantalla y no podrá acceder a ellos.
                      </p>
                    </div>

                    {/* Botones de acción rápida */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={seleccionarTresPrincipales}
                        className="text-[11px] font-bold border border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        ⭐ Solo 3 Links (Pagos, Clientes, Inventario)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={seleccionarTodos}
                        className="text-[11px]"
                      >
                        Marcar Todos
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={deseleccionarTodos}
                        className="text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        Desmarcar Todos
                      </Button>
                    </div>
                  </div>

                  {/* Grupos de secciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {GRUPOS_SECCIONES.filter((g) => g.items.some((i) => i.id !== "usuarios")).map((grupo, gIdx) => (
                      <div key={gIdx} className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          {grupo.titulo}
                        </div>
                        <div className="space-y-1.5">
                          {grupo.items.filter((item) => item.id !== "usuarios").map((item) => {
                            const permitido = formPermisos.includes(item.id);
                            const Icono = item.icono;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => togglePermiso(item.id)}
                                className={`flex w-full items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                  permitido
                                    ? "bg-primary/15 border-primary/40 text-foreground shadow-xs"
                                    : "bg-card/50 border-border/60 text-muted-foreground hover:bg-card hover:text-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icono className={`size-4 ${permitido ? "text-primary" : "text-muted-foreground"}`} />
                                  <span className="text-xs font-semibold">{item.label}</span>
                                </div>
                                <div
                                  className={`size-4 rounded flex items-center justify-center border transition-all ${
                                    permitido
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "border-muted-foreground/40 bg-background"
                                  }`}
                                >
                                  {permitido && <Check className="size-3 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setModoEdicion(false)}
                    disabled={guardando}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={guardando}
                    className="gap-2 font-bold shadow-md"
                  >
                    <Save className="size-4" />
                    {guardando ? "Guardando..." : usuarioEditandoId ? "Guardar Cambios" : "Crear Usuario"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* LISTADO DE USUARIOS CREADOS */}
        {config.subadmins.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/40">
            <Users className="size-8 mx-auto text-muted-foreground/60 mb-2" />
            <h4 className="text-sm font-bold text-foreground">No hay sub-administradores creados</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
              Crea usuarios para tus colaboradores u operadores asignándoles únicamente los 3 enlaces que necesitan operar.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={abrirCrearUsuario}
              className="gap-1.5 font-bold"
            >
              <UserPlus className="size-3.5" /> Crear Primer Usuario
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {config.subadmins.map((user) => {
              const permisosNombres = user.permisos.map((pId) => {
                const s = SECCIONES.find((sec) => sec.id === pId);
                return s?.label || pId;
              });

              return (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-border/80 transition-all shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{user.nombre}</span>
                      {user.activo ? (
                        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] font-bold">
                          Desactivado
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {user.email}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-primary mr-1">
                        {user.permisos.length} enlaces visibles:
                      </span>
                      {permisosNombres.map((pNom, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-medium text-secondary-foreground border border-border"
                        >
                          {pNom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => abrirEditarUsuario(user)}
                      className="gap-1 text-xs font-semibold cursor-pointer"
                    >
                      <Edit className="size-3.5" /> Editar Enlaces
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarSubadmin(user.id, user.nombre)}
                      className="text-destructive hover:bg-destructive/10 text-xs cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
