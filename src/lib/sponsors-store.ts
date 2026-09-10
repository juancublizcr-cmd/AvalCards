import { supabase } from "./supabase";

export type CategoriaSponsor = string;

export type CategoriaItem = {
  id: string;
  label: string;
  icono: string;
};

export const CATEGORIAS_SPONSOR_DEFAULT: CategoriaItem[] = [
  { id: "talleres_mecanica", label: "Talleres & Mecánica", icono: "🔧" },
  { id: "detailing_lavado", label: "Detailing & Lavado", icono: "✨" },
  { id: "repuestos_accesorios", label: "Repuestos & Accesorios", icono: "🚗" },
  { id: "restaurantes_gastronomia", label: "Restaurantes & Bares", icono: "🍔" },
  { id: "salud_fitness", label: "Salud, Barberías & Fitness", icono: "💪" },
  { id: "tecnologia_gaming", label: "Tecnología & Celulares", icono: "📱" },
  { id: "servicios_profesionales", label: "Servicios & Seguros", icono: "📄" },
  { id: "otros", label: "Otros Comercios", icono: "🏬" },
];

export const CATEGORIAS_SPONSOR_LABELS: Record<string, { label: string; icono: string }> = {
  talleres_mecanica: { label: "Talleres & Mecánica", icono: "🔧" },
  detailing_lavado: { label: "Detailing & Lavado", icono: "✨" },
  repuestos_accesorios: { label: "Repuestos & Accesorios", icono: "🚗" },
  restaurantes_gastronomia: { label: "Restaurantes & Bares", icono: "🍔" },
  salud_fitness: { label: "Salud, Barberías & Fitness", icono: "💪" },
  tecnologia_gaming: { label: "Tecnología & Celulares", icono: "📱" },
  servicios_profesionales: { label: "Servicios & Seguros", icono: "📄" },
  otros: { label: "Otros Comercios", icono: "🏬" },
};

export type ModalidadCanjeSponsor = "whatsapp" | "cupon" | "ambos";

export type ComercioSponsor = {
  id: string;
  nombreComercio: string;
  categoria: CategoriaSponsor;
  descuentoTexto: string; // Ej: "15% de Descuento", "2x1 en Alineamiento", "₡10,000 de Cashback"
  descuentoPorcentaje?: number; // Para ordenar / destacar
  descripcion: string;
  condiciones: string; // Ej: "Presentando tu comprobante de compra o token activo"
  logoUrl?: string;
  telefonoWhatsapp: string;
  provincia: string;
  canton?: string;
  direccionFisica?: string;
  enlaceRedes?: string;
  modalidadCanje?: ModalidadCanjeSponsor; // "whatsapp" | "cupon" | "ambos"
  pinAcceso?: string; // PIN / Contraseña de acceso a la Mini-App (ej. "1234")
  passwordComercio?: string; // Contraseña personalizada
  emailComercio?: string; // Correo para recuperación de clave
  activo: boolean;
  destacado: boolean;
  orden: number;
};

export type SolicitudAfiliacionSponsor = {
  id: string;
  fecha: string;
  nombreEmpresa: string;
  nombreContacto: string;
  cargo?: string;
  telefono: string;
  email: string;
  categoria: CategoriaSponsor;
  propuestaDescuento: string;
  beneficioComunidad: string;
  provincia: string;
  estado: "pendiente" | "contactado" | "aprobado" | "rechazado";
  notasAdmin?: string;
};

export const SPONSORS_DEMO: ComercioSponsor[] = [
  {
    id: "SP-001",
    nombreComercio: "AutoFix Taller Multimarca & Diagnóstico",
    categoria: "talleres_mecanica",
    descuentoTexto: "20% en Mano de Obra + Diagnóstico Computarizado Gratis",
    descuentoPorcentaje: 20,
    descripcion: "Especialistas en mecánica preventiva, frenos, cambio de fluidos, suspensión y scanner automotriz de alta gama.",
    condiciones: "Válido mostrando tus Tokens activos de Aval Community o número de orden.",
    logoUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80",
    telefonoWhatsapp: "8899-1122",
    provincia: "San José",
    canton: "",
    direccionFisica: "",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: true,
    orden: 1,
  },
  {
    id: "SP-002",
    nombreComercio: "HydroShine Detailing & Ceramic Coat",
    categoria: "detailing_lavado",
    descuentoTexto: "30% de Descuento en Pulido y Tratamiento Cerámico",
    descuentoPorcentaje: 30,
    descripcion: "Lavado al detalle, restauración de pintura, protección cerámica 9H, lavado de tapicería y descontaminado de vidrios.",
    condiciones: "Aplica en paquetes de detailing completo y lavado premium.",
    logoUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&auto=format&fit=crop&q=80",
    telefonoWhatsapp: "7011-3344",
    provincia: "Heredia",
    canton: "",
    direccionFisica: "",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: true,
    orden: 2,
  },
  {
    id: "SP-003",
    nombreComercio: "Repuestos & Accesorios 4x4 CR",
    categoria: "repuestos_accesorios",
    descuentoTexto: "15% de Descuento en Halógenos LED y Accesorios Off-Road",
    descuentoPorcentaje: 15,
    descripcion: "Importadores directos de suspensiones, barras LED, bumpers, winches y accesorios para pickups y 4x4.",
    condiciones: "No acumulable con otras promociones. Presentar compra activa.",
    logoUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80",
    telefonoWhatsapp: "6200-5566",
    provincia: "Alajuela",
    canton: "",
    direccionFisica: "",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: false,
    orden: 3,
  },
  {
    id: "SP-004",
    nombreComercio: "SmokeHouse BBQ & Grill",
    categoria: "restaurantes_gastronomia",
    descuentoTexto: "15% en Todo el Menú de Cortes y Hamburguesas",
    descuentoPorcentaje: 15,
    descripcion: "Auténtico BBQ ahumado a la leña, costillas St. Louis, brisket texano, alitas crujientes y cervezas artesanales.",
    condiciones: "Válido de martes a domingo para consumo en restaurante.",
    logoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
    telefonoWhatsapp: "8333-7788",
    provincia: "San José",
    canton: "",
    direccionFisica: "",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: true,
    orden: 4,
  },
  {
    id: "SP-005",
    nombreComercio: "Titanium Gym & Performance",
    categoria: "salud_fitness",
    descuentoTexto: "Matrícula 100% GRATIS + 20% en Mensualidades",
    descuentoPorcentaje: 20,
    descripcion: "Centro de acondicionamiento físico, pesas, cross-training, área funcional y asesoría nutricional personalizada.",
    condiciones: "Para miembros con al menos 1 Token oficial activo de Aval Community.",
    logoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80",
    telefonoWhatsapp: "8500-9900",
    provincia: "Cartago",
    canton: "",
    direccionFisica: "",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: false,
    orden: 5,
  },
  {
    id: "SP-006",
    nombreComercio: "iSmart Cell & Accesorios Tech",
    categoria: "tecnologia_gaming",
    descuentoTexto: "25% en Cobertores y Vidrios Templados + 10% en Parlantes",
    descuentoPorcentaje: 25,
    descripcion: "Venta y reparación de smartphones, laptops, consolas de videojuegos, audio Bluetooth y accesorios premium.",
    condiciones: "Presentar código o comprobante en sucursal física o pedido online.",
    logoUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&auto=format&fit=crop&q=80",
    telefonoWhatsapp: "6044-2211",
    provincia: "San José",
    canton: "",
    direccionFisica: "",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: false,
    orden: 6,
  },
];

const LOCAL_SPONSORS_KEY = "aval_sponsors_comercios_v1";
const LOCAL_SOLICITUDES_SPONSORS_KEY = "aval_solicitudes_sponsors_v1";

// Helper de mapeo de base de datos a tipo TypeScript
// biome-ignore lint/suspicious/noExplicitAny: generic DB row
function mapSponsorFromDb(row: any): ComercioSponsor {
  return {
    id: row.id,
    nombreComercio: row.nombre_comercio || row.nombreComercio || "",
    categoria: (row.categoria || "otros") as CategoriaSponsor,
    descuentoTexto: row.descuento_texto || row.descuentoTexto || "",
    descuentoPorcentaje: row.descuento_porcentaje ?? row.descuentoPorcentaje ?? 15,
    descripcion: row.descripcion || "",
    condiciones: row.condiciones || "",
    logoUrl: row.logo_url || row.logoUrl || "",
    telefonoWhatsapp: row.telefono_whatsapp || row.telefonoWhatsapp || "",
    provincia: row.provincia || "San José",
    canton: "",
    direccionFisica: "",
    enlaceRedes: row.enlace_redes || row.enlaceRedes || "",
    modalidadCanje: (row.modalidad_canje || row.modalidadCanje || "ambos") as ModalidadCanjeSponsor,
    pinAcceso: row.pin_acceso || row.pinAcceso || row.password_comercio || row.passwordComercio || "",
    passwordComercio: row.password_comercio || row.passwordComercio || row.pin_acceso || row.pinAcceso || "",
    emailComercio: row.email_comercio || row.emailComercio || "",
    activo: row.activo ?? true,
    destacado: row.destacado ?? false,
    orden: row.orden ?? 1,
  };
}

function mapSponsorToDb(s: ComercioSponsor) {
  return {
    id: s.id,
    nombre_comercio: s.nombreComercio,
    categoria: s.categoria,
    descuento_texto: s.descuentoTexto,
    descuento_porcentaje: s.descuentoPorcentaje || 15,
    descripcion: s.descripcion,
    condiciones: s.condiciones,
    logo_url: s.logoUrl || "",
    telefono_whatsapp: s.telefonoWhatsapp,
    provincia: s.provincia,
    canton: s.canton || "",
    direccion_fisica: s.direccionFisica || "",
    enlace_redes: s.enlaceRedes || "",
    modalidad_canje: s.modalidadCanje || "ambos",
    pin_acceso: s.passwordComercio || s.pinAcceso || "",
    password_comercio: s.passwordComercio || s.pinAcceso || "",
    email_comercio: s.emailComercio || "",
    activo: s.activo,
    destacado: s.destacado,
    orden: s.orden || 1,
  };
}

// biome-ignore lint/suspicious/noExplicitAny: generic DB row
function mapSolicitudFromDb(row: any): SolicitudAfiliacionSponsor {
  return {
    id: row.id,
    fecha: row.fecha || new Date().toISOString(),
    nombreEmpresa: row.nombre_empresa || row.nombreEmpresa || "",
    nombreContacto: row.nombre_contacto || row.nombreContacto || "",
    cargo: row.cargo || "",
    telefono: row.telefono || "",
    email: row.email || "",
    categoria: (row.categoria || "otros") as CategoriaSponsor,
    propuestaDescuento: row.propuesta_descuento || row.propuestaDescuento || "",
    beneficioComunidad: row.beneficio_comunidad || row.beneficioComunidad || "",
    provincia: row.provincia || "San José",
    estado: (row.estado || "pendiente") as SolicitudAfiliacionSponsor["estado"],
    notasAdmin: row.notas_admin || row.notasAdmin || "",
  };
}

function mapSolicitudToDb(sol: SolicitudAfiliacionSponsor) {
  return {
    id: sol.id,
    fecha: sol.fecha,
    nombre_empresa: sol.nombreEmpresa,
    nombre_contacto: sol.nombreContacto,
    cargo: sol.cargo || "",
    telefono: sol.telefono,
    email: sol.email,
    categoria: sol.categoria,
    propuesta_descuento: sol.propuestaDescuento,
    beneficio_comunidad: sol.beneficioComunidad,
    provincia: sol.provincia,
    estado: sol.estado,
    notas_admin: sol.notasAdmin || "",
  };
}

// ============================================================================
// FUNCIONES CRUD PARA SPONSORS / COMERCIOS (TABLA DB: sponsors & sorteo_config)
// ============================================================================

export async function fetchSponsors(): Promise<ComercioSponsor[]> {
  // 1. Intentar consulta a sorteo_config._meta._directorioSponsors (persistencia garantizada en Supabase)
  try {
    const { data: sorteoRow, error: sorteoErr } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    if (!sorteoErr && sorteoRow?.raspa_config?._meta?._directorioSponsors) {
      const metaSponsors = sorteoRow.raspa_config._meta._directorioSponsors;
      if (Array.isArray(metaSponsors)) {
        const items = metaSponsors.map(mapSponsorFromDb);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_SPONSORS_KEY, JSON.stringify(items));
          } catch {}
        }
        return items;
      }
    }
  } catch {}

  // 2. Intentar consulta directa a la tabla Supabase 'sponsors'
  try {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("orden", { ascending: true });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const items = data.map(mapSponsorFromDb);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_SPONSORS_KEY, JSON.stringify(items));
        } catch {}
      }
      return items;
    }
  } catch {}

  // 3. Fallback a localStorage
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_SPONSORS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(mapSponsorFromDb);
      }
    } catch {}
  }

  // 4. Semilla por defecto
  return SPONSORS_DEMO;
}

export async function guardarSponsors(sponsors: ComercioSponsor[]): Promise<boolean> {
  // 1. Guardar en localStorage inmediatamente y notificar a la app
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_SPONSORS_KEY, JSON.stringify(sponsors));
      window.dispatchEvent(new CustomEvent("sponsors_updated", { detail: sponsors }));
    } catch {}
  }

  // 2. Persistir en sorteo_config._meta._directorioSponsors (sin requerir tablas nuevas)
  try {
    const { data: sorteoRow } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    const currentRaspa = (sorteoRow?.raspa_config && typeof sorteoRow.raspa_config === "object")
      ? sorteoRow.raspa_config
      : {};
    const meta = (currentRaspa._meta && typeof currentRaspa._meta === "object")
      ? { ...currentRaspa._meta }
      : {};
    meta._directorioSponsors = sponsors;
    currentRaspa._meta = meta;

    await supabase
      .from("sorteo_config")
      .update({ raspa_config: currentRaspa })
      .eq("id", 1);
  } catch {}

  // 3. Sincronizar en tabla sponsors dedicada si existe
  try {
    const dbPayload = sponsors.map(mapSponsorToDb);
    if (dbPayload.length > 0) {
      await supabase.from("sponsors").upsert(dbPayload, { onConflict: "id" });
    }
  } catch {}

  return true;
}

export async function upsertSponsor(sponsor: ComercioSponsor): Promise<ComercioSponsor[]> {
  let current: ComercioSponsor[] = [];
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_SPONSORS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) current = parsed.map(mapSponsorFromDb);
      }
    } catch {}
  }

  if (current.length === 0) {
    current = await fetchSponsors();
  }

  const idx = current.findIndex((s) => s.id === sponsor.id);
  let updated: ComercioSponsor[];

  if (idx >= 0) {
    updated = [...current];
    updated[idx] = sponsor;
  } else {
    updated = [sponsor, ...current];
  }

  // Guardar en tabla individual en DB
  try {
    await supabase.from("sponsors").upsert(mapSponsorToDb(sponsor), { onConflict: "id" });
  } catch {}

  await guardarSponsors(updated);
  return updated;
}

export async function deleteSponsor(id: string): Promise<ComercioSponsor[]> {
  // Eliminar en tabla de DB
  try {
    await supabase.from("sponsors").delete().eq("id", id);
  } catch {}

  let current: ComercioSponsor[] = [];
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_SPONSORS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) current = parsed.map(mapSponsorFromDb);
      }
    } catch {}
  }

  if (current.length === 0) {
    current = await fetchSponsors();
  }

  const updated = current.filter((s) => s.id !== id);
  await guardarSponsors(updated);
  return updated;
}

// ============================================================================
// FUNCIONES PARA SOLICITUDES DE NUEVOS SPONSORS (TABLA DB: solicitudes_sponsors)
// ============================================================================

export async function fetchSolicitudesSponsors(): Promise<SolicitudAfiliacionSponsor[]> {
  // 1. Intentar consulta directa a la tabla Supabase 'solicitudes_sponsors'
  try {
    const { data, error } = await supabase
      .from("solicitudes_sponsors")
      .select("*")
      .order("fecha", { ascending: false });

    if (!error && data && Array.isArray(data)) {
      const items = data.map(mapSolicitudFromDb);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_SOLICITUDES_SPONSORS_KEY, JSON.stringify(items));
        } catch {}
      }
      return items;
    }
  } catch {}

  // 2. Fallback a site_config
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("valor")
      .eq("clave", "solicitudes_afiliacion_sponsors")
      .maybeSingle();

    if (!error && data?.valor && Array.isArray(data.valor)) {
      return data.valor.map(mapSolicitudFromDb);
    }
  } catch {}

  // 3. Fallback a localStorage
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_SOLICITUDES_SPONSORS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed.map(mapSolicitudFromDb);
      }
    } catch {}
  }

  return [];
}

export async function enviarSolicitudSponsor(
  solicitud: Omit<SolicitudAfiliacionSponsor, "id" | "fecha" | "estado">
): Promise<SolicitudAfiliacionSponsor> {
  const nueva: SolicitudAfiliacionSponsor = {
    ...solicitud,
    id: `SOL-${Date.now().toString().slice(-5)}`,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };

  // 1. Insertar en tabla de DB
  try {
    await supabase.from("solicitudes_sponsors").insert([mapSolicitudToDb(nueva)]);
  } catch {}

  // 2. Guardar en memoria local y site_config
  const current = await fetchSolicitudesSponsors();
  const updated = [nueva, ...current.filter((s) => s.id !== nueva.id)];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_SOLICITUDES_SPONSORS_KEY, JSON.stringify(updated));
    } catch {}
  }

  try {
    await supabase.from("site_config").upsert(
      {
        clave: "solicitudes_afiliacion_sponsors",
        valor: updated,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
  } catch {}

  return nueva;
}

export async function actualizarEstadoSolicitudSponsor(
  id: string,
  estado: SolicitudAfiliacionSponsor["estado"],
  notasAdmin?: string
): Promise<SolicitudAfiliacionSponsor[]> {
  // 1. Actualizar en tabla DB
  try {
    const updatePayload: Record<string, unknown> = { estado };
    if (notasAdmin !== undefined) updatePayload.notas_admin = notasAdmin;
    await supabase.from("solicitudes_sponsors").update(updatePayload).eq("id", id);
  } catch {}

  const current = await fetchSolicitudesSponsors();
  const updated = current.map((s) =>
    s.id === id ? { ...s, estado, ...(notasAdmin !== undefined ? { notasAdmin } : {}) } : s
  );

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_SOLICITUDES_SPONSORS_KEY, JSON.stringify(updated));
    } catch {}
  }

  try {
    await supabase.from("site_config").upsert(
      {
        clave: "solicitudes_afiliacion_sponsors",
        valor: updated,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
  } catch {}

  return updated;
}

// ============================================================================
// GESTIÓN DE CATEGORÍAS PERSONALIZADAS EN DB & LOCALSTORAGE
// ============================================================================

const LOCAL_CATEGORIAS_KEY = "aval_categorias_sponsors_v1";

export async function fetchCategoriasSponsors(): Promise<CategoriaItem[]> {
  // 1. Intentar desde Supabase sorteo_config._meta._categoriasSponsors
  try {
    const { data: sorteoRow, error } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    if (!error && sorteoRow?.raspa_config?._meta?._categoriasSponsors) {
      const metaCats = sorteoRow.raspa_config._meta._categoriasSponsors;
      if (Array.isArray(metaCats) && metaCats.length > 0) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_CATEGORIAS_KEY, JSON.stringify(metaCats));
          } catch {}
        }
        return metaCats as CategoriaItem[];
      }
    }
  } catch {}

  // 2. Fallback localStorage
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_CATEGORIAS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }

  return CATEGORIAS_SPONSOR_DEFAULT;
}

export async function guardarCategoriasSponsors(
  categorias: CategoriaItem[]
): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_CATEGORIAS_KEY, JSON.stringify(categorias));
      window.dispatchEvent(new CustomEvent("categorias_sponsors_updated", { detail: categorias }));
    } catch {}
  }

  try {
    const { data: sorteoRow } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    const currentRaspa = (sorteoRow?.raspa_config && typeof sorteoRow.raspa_config === "object")
      ? sorteoRow.raspa_config
      : {};
    const meta = (currentRaspa._meta && typeof currentRaspa._meta === "object")
      ? { ...currentRaspa._meta }
      : {};
    meta._categoriasSponsors = categorias;
    currentRaspa._meta = meta;

    await supabase
      .from("sorteo_config")
      .update({ raspa_config: currentRaspa })
      .eq("id", 1);
    return true;
  } catch {
    return false;
  }
}

export async function crearCategoriaSponsor(
  label: string,
  icono: string
): Promise<CategoriaItem[]> {
  const current = await fetchCategoriasSponsors();
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || `cat_${Date.now()}`;

  // Verificar si ya existe
  if (current.some((c) => c.id === slug || c.label.toLowerCase() === label.toLowerCase())) {
    return current;
  }

  const nueva: CategoriaItem = {
    id: slug,
    label: label.trim(),
    icono: icono.trim() || "🏬",
  };

  const updated = [...current, nueva];
  await guardarCategoriasSponsors(updated);
  return updated;
}

export async function eliminarCategoriaSponsor(
  id: string
): Promise<CategoriaItem[]> {
  const current = await fetchCategoriasSponsors();
  const updated = current.filter((c) => c.id !== id);
  await guardarCategoriasSponsors(updated);
  return updated;
}

// ============================================================================
// CANJES Y REPORTES DE COMERCIOS ALIADOS (MINI-APP / SPONSOR PORTAL)
// ============================================================================

export type CanjeSponsorRecord = {
  id: string;
  sponsorId: string;
  sponsorNombre: string;
  clienteTelefono: string;
  clienteNombre: string;
  servicio: string;
  montoRegular?: number;
  montoCobrado?: number;
  ahorro?: number;
  descuentoTexto: string;
  fecha: string; // ISO String
  notas?: string;
  registradoPor?: string;
};

export const LOCAL_CANJES_KEY = "aval_sponsors_canjes_records";

export async function fetchCanjesSponsors(): Promise<CanjeSponsorRecord[]> {
  // 1. Intentar desde Supabase sorteo_config._meta._canjesSponsors
  try {
    const { data: sorteoRow } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    if (sorteoRow?.raspa_config && typeof sorteoRow.raspa_config === "object") {
      const meta = (sorteoRow.raspa_config as any)._meta;
      if (meta?._canjesSponsors && Array.isArray(meta._canjesSponsors)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_CANJES_KEY, JSON.stringify(meta._canjesSponsors));
        }
        return meta._canjesSponsors;
      }
    }
  } catch (err) {
    console.warn("fetchCanjesSponsors error:", err);
  }

  // 2. Fallback a LocalStorage
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_CANJES_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
  }

  return [];
}

export async function registrarCanjeSponsor(
  record: Omit<CanjeSponsorRecord, "id" | "fecha">
): Promise<CanjeSponsorRecord> {
  const newCanje: CanjeSponsorRecord = {
    ...record,
    id: `CANJE-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    fecha: new Date().toISOString(),
  };

  const current = await fetchCanjesSponsors();
  const updated = [newCanje, ...current];

  // 1. LocalStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_CANJES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("canjes_updated", { detail: updated }));
    } catch {}
  }

  // 2. Persistir en sorteo_config._meta._canjesSponsors
  try {
    const { data: sorteoRow } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    const currentRaspa = (sorteoRow?.raspa_config && typeof sorteoRow.raspa_config === "object")
      ? sorteoRow.raspa_config
      : {};
    const meta = (currentRaspa._meta && typeof currentRaspa._meta === "object")
      ? { ...currentRaspa._meta }
      : {};
    meta._canjesSponsors = updated;
    currentRaspa._meta = meta;

    await supabase
      .from("sorteo_config")
      .update({ raspa_config: currentRaspa })
      .eq("id", 1);
  } catch (err) {
    console.error("Error guardando canje en Supabase:", err);
  }

  return newCanje;
}

export async function eliminarCanjeSponsor(id: string): Promise<boolean> {
  const current = await fetchCanjesSponsors();
  const updated = current.filter((c) => c.id !== id);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_CANJES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("canjes_updated", { detail: updated }));
    } catch {}
  }

  try {
    const { data: sorteoRow } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();

    const currentRaspa = (sorteoRow?.raspa_config && typeof sorteoRow.raspa_config === "object")
      ? sorteoRow.raspa_config
      : {};
    const meta = (currentRaspa._meta && typeof currentRaspa._meta === "object")
      ? { ...currentRaspa._meta }
      : {};
    meta._canjesSponsors = updated;
    currentRaspa._meta = meta;

    await supabase
      .from("sorteo_config")
      .update({ raspa_config: currentRaspa })
      .eq("id", 1);
  } catch {}

  return true;
}




