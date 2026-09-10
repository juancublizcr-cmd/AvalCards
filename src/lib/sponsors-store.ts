import { supabase } from "./supabase";

export type CategoriaSponsor =
  | "talleres_mecanica"
  | "detailing_lavado"
  | "repuestos_accesorios"
  | "restaurantes_gastronomia"
  | "salud_fitness"
  | "tecnologia_gaming"
  | "servicios_profesionales"
  | "otros";

export const CATEGORIAS_SPONSOR_LABELS: Record<CategoriaSponsor, { label: string; icono: string }> = {
  talleres_mecanica: { label: "Talleres & Mecánica", icono: "🔧" },
  detailing_lavado: { label: "Detailing & Lavado", icono: "✨" },
  repuestos_accesorios: { label: "Repuestos & Accesorios", icono: "🚗" },
  restaurantes_gastronomia: { label: "Restaurantes & Bares", icono: "🍔" },
  salud_fitness: { label: "Salud, Barberías & Fitness", icono: "💪" },
  tecnologia_gaming: { label: "Tecnología & Celulares", icono: "📱" },
  servicios_profesionales: { label: "Servicios & Seguros", icono: "📄" },
  otros: { label: "Otros Comercios", icono: "🏬" },
};

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
    canton: "Santa Ana",
    direccionFisica: "50m Oeste de Forum 1, Santa Ana",
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
    canton: "San Joaquín",
    direccionFisica: "Heredia centro, 200m norte del Mall Oxígeno",
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
    canton: "Alajuela Centro",
    direccionFisica: "Radial Francisco J. Orlich, Alajuela",
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
    canton: "Escazú",
    direccionFisica: "Plaza Maynard, San Rafael de Escazú",
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
    canton: "Cartago",
    direccionFisica: "300m Este de la Basílica de Los Ángeles, Cartago",
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
    canton: "San Pedro",
    direccionFisica: "Mall San Pedro, 2do Piso, Local 45",
    enlaceRedes: "https://instagram.com",
    activo: true,
    destacado: false,
    orden: 6,
  },
];

const LOCAL_SPONSORS_KEY = "aval_sponsors_comercios_v1";
const LOCAL_SOLICITUDES_SPONSORS_KEY = "aval_solicitudes_sponsors_v1";

// ============================================================================
// FUNCIONES CRUD PARA SPONSORS / COMERCIOS
// ============================================================================

export async function fetchSponsors(): Promise<ComercioSponsor[]> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("valor")
      .eq("clave", "directorio_sponsors")
      .maybeSingle();

    if (!error && data?.valor && Array.isArray(data.valor) && data.valor.length > 0) {
      return data.valor as ComercioSponsor[];
    }
  } catch {}

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_SPONSORS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }

  return SPONSORS_DEMO;
}

export async function guardarSponsors(sponsors: ComercioSponsor[]): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_SPONSORS_KEY, JSON.stringify(sponsors));
    } catch {}
  }

  try {
    await supabase.from("site_config").upsert(
      {
        clave: "directorio_sponsors",
        valor: sponsors,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
    return true;
  } catch {
    return false;
  }
}

export async function upsertSponsor(sponsor: ComercioSponsor): Promise<ComercioSponsor[]> {
  const current = await fetchSponsors();
  const idx = current.findIndex((s) => s.id === sponsor.id);
  let updated: ComercioSponsor[];

  if (idx >= 0) {
    updated = [...current];
    updated[idx] = sponsor;
  } else {
    updated = [sponsor, ...current];
  }

  await guardarSponsors(updated);
  return updated;
}

export async function deleteSponsor(id: string): Promise<ComercioSponsor[]> {
  const current = await fetchSponsors();
  const updated = current.filter((s) => s.id !== id);
  await guardarSponsors(updated);
  return updated;
}

// ============================================================================
// FUNCIONES PARA SOLICITUDES DE NUEVOS SPONSORS
// ============================================================================

export async function fetchSolicitudesSponsors(): Promise<SolicitudAfiliacionSponsor[]> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("valor")
      .eq("clave", "solicitudes_afiliacion_sponsors")
      .maybeSingle();

    if (!error && data?.valor && Array.isArray(data.valor)) {
      return data.valor as SolicitudAfiliacionSponsor[];
    }
  } catch {}

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_SOLICITUDES_SPONSORS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
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

  const current = await fetchSolicitudesSponsors();
  const updated = [nueva, ...current];

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
  const current = await fetchSolicitudesSponsors();
  const updated = current.map((s) => (s.id === id ? { ...s, estado, ...(notasAdmin !== undefined ? { notasAdmin } : {}) } : s));

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
