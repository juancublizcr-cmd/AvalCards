import { supabase } from "@/lib/supabase";
import type { AdminSeccion } from "@/components/admin/AdminSidebar";

export const TODAS_LAS_SECCIONES: AdminSeccion[] = [
  "resumen",
  "centroControl",
  "sinpeAuto",
  "pagos",
  "inventario",
  "clientes",
  "sorteos",
  "escrutinio",
  "legal",
  "raspa",
  "remates",
  "referidos",
  "sponsors",
  "social",
  "disenoWeb",
  "config",
];

export interface SubadminUser {
  id: string;
  email: string;
  nombre: string;
  passwordHash: string;
  salt: string;
  permisos: AdminSeccion[];
  activo: boolean;
  creadoEn: string;
}

export interface AdminRolesConfig {
  superadminEmail: string;
  superadminPasswordHash?: string;
  superadminSalt?: string;
  subadmins: SubadminUser[];
}

export interface AdminSessionUser {
  id: string;
  email: string;
  nombre: string;
  esSuperadmin: boolean;
  permisos: AdminSeccion[];
}

const STORAGE_KEY = "aval_admin_roles_config";

export function generarSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder().encode(`${salt}:${password.trim()}`);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function fetchAdminRolesConfig(): Promise<AdminRolesConfig> {
  const defaultConfig: AdminRolesConfig = {
    superadminEmail: "admin@avalmotors.cr",
    subadmins: [],
  };

  try {
    const { data, error } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data?.raspa_config?._meta?._admin_roles) {
      const cfg = data.raspa_config._meta._admin_roles as AdminRolesConfig;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
        } catch {}
      }
      return {
        ...defaultConfig,
        ...cfg,
        subadmins: Array.isArray(cfg.subadmins) ? cfg.subadmins : [],
      };
    }
  } catch (err) {
    console.warn("No se pudo leer admin_roles de Supabase, usando fallback:", err);
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return JSON.parse(local);
    } catch {}
  }

  return defaultConfig;
}

export async function saveAdminRolesConfig(cfg: AdminRolesConfig): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch {}
  }

  // Traer _meta actual de sorteo_config para preservar el resto de propiedades
  let metaActual: Record<string, any> = {};
  let raspaActual: Record<string, any> = {};
  try {
    const { data } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    if (data?.raspa_config) {
      raspaActual = data.raspa_config;
      metaActual = data.raspa_config._meta || {};
    }
  } catch {}

  const metaActualizado = {
    ...metaActual,
    _admin_roles: cfg,
  };

  const { error } = await supabase
    .from("sorteo_config")
    .update({
      raspa_config: {
        ...raspaActual,
        _meta: metaActualizado,
      },
    })
    .eq("id", 1);

  if (error) {
    console.error("Error guardando roles en Supabase:", error);
    throw new Error(error.message);
  }
}

export async function verificarCredenciales(
  email: string,
  passwordIngresada: string,
): Promise<{ success: boolean; user?: AdminSessionUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const pass = passwordIngresada.trim();
  const cfg = await fetchAdminRolesConfig();

  // 1. Verificar si es Superadmin con contraseña personalizada
  if (
    cleanEmail === cfg.superadminEmail.toLowerCase() ||
    cleanEmail === "admin@avalmotors.cr" ||
    cleanEmail === "admin@avalcommunity.cr"
  ) {
    if (cfg.superadminPasswordHash && cfg.superadminSalt) {
      const calcHash = await hashPassword(pass, cfg.superadminSalt);
      if (calcHash === cfg.superadminPasswordHash) {
        return {
          success: true,
          user: {
            id: "superadmin",
            email: cfg.superadminEmail,
            nombre: "Super Administrador",
            esSuperadmin: true,
            permisos: TODAS_LAS_SECCIONES,
          },
        };
      }
    }
  }

  // 2. Verificar si coincide con algún sub-administrador
  const subadmin = cfg.subadmins.find(
    (s) => s.email.trim().toLowerCase() === cleanEmail,
  );

  if (subadmin) {
    if (!subadmin.activo) {
      return {
        success: false,
        error: "Esta cuenta de acceso ha sido desactivada por el Super Administrador.",
      };
    }

    const calcHash = await hashPassword(pass, subadmin.salt);
    if (calcHash === subadmin.passwordHash) {
      return {
        success: true,
        user: {
          id: subadmin.id,
          email: subadmin.email,
          nombre: subadmin.nombre,
          esSuperadmin: false,
          permisos: subadmin.permisos && subadmin.permisos.length > 0 ? subadmin.permisos : ["resumen"],
        },
      };
    }
  }

  return { success: false };
}
