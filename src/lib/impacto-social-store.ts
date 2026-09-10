import { supabase } from "./supabase";

export type CategoriaCaso =
  | "adulto_mayor"
  | "salud_cirugia"
  | "vivienda"
  | "madre_riesgo"
  | "otro";

export type EstadoCaso =
  | "pendiente"
  | "en_evaluacion"
  | "seleccionado"
  | "ayuda_entregada"
  | "archivado";

export type CasoSocial = {
  id: string;
  fecha: string;
  postulanteNombre: string;
  postulanteTelefono: string;
  postulanteRelacion: string;
  beneficiarioNombre: string;
  beneficiarioEdad?: string;
  provincia: string;
  canton?: string;
  categoria: CategoriaCaso;
  titulo: string;
  descripcion: string;
  presupuestoEstimado?: string;
  urgencia: "alta" | "media" | "normal";
  fotos?: string[];
  estado: EstadoCaso;
  notasAdmin?: string;
};

export type TipoColaboracionSponsor =
  | "materiales"
  | "servicios"
  | "donacion_fondos"
  | "patrocinio_premios"
  | "descuentos_comunidad"
  | "otro";

export type EstadoSponsor =
  | "nueva"
  | "en_contacto"
  | "alianza_activa"
  | "declinada";

export type PropuestaSponsor = {
  id: string;
  fecha: string;
  empresa: string;
  representante: string;
  cargo?: string;
  telefono: string;
  email: string;
  tipoColaboracion: TipoColaboracionSponsor;
  propuesta: string;
  beneficioComunidad: string;
  estado: EstadoSponsor;
  notasAdmin?: string;
};

const CASOS_DEMO: CasoSocial[] = [
  {
    id: "CS-8901",
    fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
    postulanteNombre: "María Eugenia Solano",
    postulanteTelefono: "8834-1122",
    postulanteRelacion: "Hija",
    beneficiarioNombre: "Doña Carmen (84 años)",
    beneficiarioEdad: "84 años",
    provincia: "Alajuela",
    canton: "San Ramón",
    categoria: "adulto_mayor",
    titulo: "Arreglo urgente de techo con goteras severas y piso antideslizante",
    descripcion:
      "Mi mamá vive sola en una casita de madera donde el techo de zinc está totalmente picado por el invierno y el piso del baño es de cemento liso muy resbaloso. Ya tuvo una caída leve hace dos semanas. Ocupamos ayuda con 12 láminas de zinc, bajantes y material antideslizante.",
    presupuestoEstimado: "₡380,000",
    urgencia: "alta",
    estado: "en_evaluacion",
    notasAdmin: "Caso prioritario. Cotizando materiales en ferretería de San Ramón.",
  },
  {
    id: "CS-8902",
    fecha: new Date(Date.now() - 86400000 * 5).toISOString(),
    postulanteNombre: "Esteban Quiros Castro",
    postulanteTelefono: "6109-8877",
    postulanteRelacion: "Líder Comunitario",
    beneficiarioNombre: "Kendall (9 años) y su madre Andrea",
    beneficiarioEdad: "9 años",
    provincia: "Puntarenas",
    canton: "Barranca",
    categoria: "salud_cirugia",
    titulo: "Apoyo con prótesis y terapia para niño con secuelas ortopédicas",
    descripcion:
      "Kendall necesita una plantilla ortopédica y férula especializada que la CCSS tarda 8 meses en entregar, y su madre está desempleada cuidándolo a tiempo completo. Con la férula podrá asistir a la escuela sin dolores intensos.",
    presupuestoEstimado: "₡260,000",
    urgencia: "alta",
    estado: "seleccionado",
    notasAdmin: "Aprobado por el comité. Coordinando cita en clínica ortopédica privada.",
  },
  {
    id: "CS-8903",
    fecha: new Date(Date.now() - 86400000 * 12).toISOString(),
    postulanteNombre: "Sonia Vargas Monge",
    postulanteTelefono: "7099-2311",
    postulanteRelacion: "Vecina",
    beneficiarioNombre: "Yuliana y sus 3 niños",
    beneficiarioEdad: "28 años",
    provincia: "San José",
    canton: "Desamparados",
    categoria: "madre_riesgo",
    titulo: "Madre soltera de 3 niños en condición de vulnerabilidad extrema",
    descripcion:
      "Perdió su empleo hace 2 meses y está a punto de ser desalojada por atraso de alquiler. Ocupa un respiro económico con víveres y materiales escolares para que sus 3 hijos no dejen la escuela.",
    presupuestoEstimado: "₡300,000",
    urgencia: "media",
    estado: "ayuda_entregada",
    notasAdmin: "Se entregó compra completa de supermercado por 2 meses y útiles escolares.",
  },
];

const SPONSORS_DEMO: PropuestaSponsor[] = [
  {
    id: "SP-501",
    fecha: new Date(Date.now() - 86400000 * 3).toISOString(),
    empresa: "Materiales y Ferretería El Roble S.A.",
    representante: "Ing. Jorge Méndez",
    cargo: "Gerente Comercial",
    telefono: "8312-5544",
    email: "ventas@ferreteriaelroble.cr",
    tipoColaboracion: "materiales",
    propuesta:
      "Podemos donar láminas de zinc, sacos de cemento, varilla y pintura para proyectos de reconstrucción de casas de adultos mayores seleccionados por Aval Community.",
    beneficioComunidad:
      "Aporte en especie de hasta ₡600,000 mensuales en materiales de construcción + 15% de descuento directo a participantes de Aval que presenten su tiquete.",
    estado: "en_contacto",
    notasAdmin: "Reunión agendada para firmar convenio de entrega de materiales.",
  },
  {
    id: "SP-502",
    fecha: new Date(Date.now() - 86400000 * 8).toISOString(),
    empresa: "Clínica Dental Sonrisas Pura Vida",
    representante: "Dra. Natalia Mora",
    cargo: "Directora Médica",
    telefono: "7044-8899",
    email: "contacto@sonrisaspuravida.com",
    tipoColaboracion: "servicios",
    propuesta:
      "Ofrecemos 5 prótesis dentales y limpiezas gratuitas mensuales para adultos mayores de escasos recursos postulados en la plataforma Aval Solidario.",
    beneficioComunidad:
      "Salud bucal y prótesis completas gratuitas para los abuelitos + 25% de descuento en tratamientos dentales para toda la comunidad.",
    estado: "alianza_activa",
    notasAdmin: "Convenio firmado. Primeros 3 adultos mayores atendidos en sede San Pedro.",
  },
];

const STORAGE_CASOS_KEY = "aval_casos_sociales_v1";
const STORAGE_SPONSORS_KEY = "aval_propuestas_sponsors_v1";

// biome-ignore lint/suspicious/noExplicitAny: generic DB row
function mapCasoSocialFromDb(row: any): CasoSocial {
  return {
    id: row.id,
    fecha: row.fecha || new Date().toISOString(),
    postulanteNombre: row.postulante_nombre || row.postulanteNombre || "",
    postulanteTelefono: row.postulante_telefono || row.postulanteTelefono || "",
    postulanteRelacion: row.postulante_relacion || row.postulanteRelacion || "",
    beneficiarioNombre: row.beneficiario_nombre || row.beneficiarioNombre || "",
    beneficiarioEdad: row.beneficiario_edad || row.beneficiarioEdad || "",
    provincia: row.provincia || "San José",
    canton: row.canton || "",
    categoria: (row.categoria || "otro") as CategoriaCaso,
    titulo: row.titulo || "",
    descripcion: row.descripcion || "",
    presupuestoEstimado: row.presupuesto_estimado || row.presupuestoEstimado || "",
    urgencia: (row.urgencia || "normal") as CasoSocial["urgencia"],
    fotos: row.fotos || [],
    estado: (row.estado || "pendiente") as EstadoCaso,
    notasAdmin: row.notas_admin || row.notasAdmin || "",
  };
}

function mapCasoSocialToDb(c: CasoSocial) {
  return {
    id: c.id,
    fecha: c.fecha,
    postulante_nombre: c.postulanteNombre,
    postulante_telefono: c.postulanteTelefono,
    postulante_relacion: c.postulanteRelacion,
    beneficiario_nombre: c.beneficiarioNombre,
    beneficiario_edad: c.beneficiarioEdad || "",
    provincia: c.provincia,
    canton: c.canton || "",
    categoria: c.categoria,
    titulo: c.titulo,
    descripcion: c.descripcion,
    presupuesto_estimado: c.presupuestoEstimado || "",
    urgencia: c.urgencia || "normal",
    fotos: c.fotos || [],
    estado: c.estado,
    notas_admin: c.notasAdmin || "",
  };
}

// ────────────────────────────────────────────────────────────
// CASOS SOCIALES (TABLA DB: casos_sociales)
// ────────────────────────────────────────────────────────────

export async function fetchCasosSociales(): Promise<CasoSocial[]> {
  // 1. Intentar consulta a tabla Supabase 'casos_sociales'
  try {
    const { data, error } = await supabase
      .from("casos_sociales")
      .select("*")
      .order("fecha", { ascending: false });

    if (!error && data && data.length > 0) {
      const items = data.map(mapCasoSocialFromDb);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_CASOS_KEY, JSON.stringify(items));
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
      .eq("clave", "casos_sociales_directorio")
      .maybeSingle();

    if (!error && data?.valor && Array.isArray(data.valor) && data.valor.length > 0) {
      return data.valor.map(mapCasoSocialFromDb);
    }
  } catch {}

  // 3. Fallback LocalStorage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_CASOS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CasoSocial[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(mapCasoSocialFromDb);
      }
    } catch {}
  }

  // 4. Inicializar demo
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_CASOS_KEY, JSON.stringify(CASOS_DEMO));
    } catch {}
  }
  return CASOS_DEMO;
}

export async function crearCasoSocial(
  data: Omit<CasoSocial, "id" | "fecha" | "estado">
): Promise<CasoSocial> {
  const nuevoId = `CS-${Math.floor(1000 + Math.random() * 9000)}`;
  const nuevoCaso: CasoSocial = {
    ...data,
    id: nuevoId,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };

  // 1. Intentar guardar en Supabase (tabla casos_sociales)
  try {
    await supabase.from("casos_sociales").insert([mapCasoSocialToDb(nuevoCaso)]);
  } catch {}

  // 2. Guardar en LocalStorage y site_config
  try {
    const actuales = await fetchCasosSociales();
    const actualizados = [nuevoCaso, ...actuales.filter((c) => c.id !== nuevoId)];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_CASOS_KEY, JSON.stringify(actualizados));
    }
    await supabase.from("site_config").upsert(
      {
        clave: "casos_sociales_directorio",
        valor: actualizados,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
  } catch {}

  return nuevoCaso;
}

export async function actualizarCasoSocial(
  id: string,
  updates: Partial<CasoSocial>
): Promise<void> {
  // 1. Actualizar en tabla DB
  try {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.estado !== undefined) dbUpdates.estado = updates.estado;
    if (updates.notasAdmin !== undefined) dbUpdates.notas_admin = updates.notasAdmin;
    if (updates.titulo !== undefined) dbUpdates.titulo = updates.titulo;
    if (updates.descripcion !== undefined) dbUpdates.descripcion = updates.descripcion;
    if (updates.presupuestoEstimado !== undefined) dbUpdates.presupuesto_estimado = updates.presupuestoEstimado;
    if (updates.urgencia !== undefined) dbUpdates.urgencia = updates.urgencia;

    await supabase.from("casos_sociales").update(dbUpdates).eq("id", id);
  } catch {}

  // 2. Sincronizar memoria y site_config
  try {
    const actuales = await fetchCasosSociales();
    const actualizados = actuales.map((c) => (c.id === id ? { ...c, ...updates } : c));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_CASOS_KEY, JSON.stringify(actualizados));
    }
    await supabase.from("site_config").upsert(
      {
        clave: "casos_sociales_directorio",
        valor: actualizados,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
  } catch {}
}

export async function eliminarCasoSocial(id: string): Promise<void> {
  // 1. Eliminar en tabla DB
  try {
    await supabase.from("casos_sociales").delete().eq("id", id);
  } catch {}

  // 2. Sincronizar memoria y site_config
  try {
    const actuales = await fetchCasosSociales();
    const actualizados = actuales.filter((c) => c.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_CASOS_KEY, JSON.stringify(actualizados));
    }
    await supabase.from("site_config").upsert(
      {
        clave: "casos_sociales_directorio",
        valor: actualizados,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
  } catch {}
}

// ────────────────────────────────────────────────────────────
// SPONSORS Y ALIANZAS
// ────────────────────────────────────────────────────────────

export async function fetchPropuestasSponsors(): Promise<PropuestaSponsor[]> {
  try {
    const { data, error } = await supabase
      .from("propuestas_sponsors")
      .select("*")
      .order("fecha", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as PropuestaSponsor[];
    }
  } catch {}

  try {
    const raw = localStorage.getItem(STORAGE_SPONSORS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PropuestaSponsor[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  try {
    localStorage.setItem(STORAGE_SPONSORS_KEY, JSON.stringify(SPONSORS_DEMO));
  } catch {}
  return SPONSORS_DEMO;
}

export async function crearPropuestaSponsor(
  data: Omit<PropuestaSponsor, "id" | "fecha" | "estado">
): Promise<PropuestaSponsor> {
  const nuevoId = `SP-${Math.floor(100 + Math.random() * 900)}`;
  const nuevaPropuesta: PropuestaSponsor = {
    ...data,
    id: nuevoId,
    fecha: new Date().toISOString(),
    estado: "nueva",
  };

  try {
    await supabase.from("propuestas_sponsors").insert([nuevaPropuesta]);
  } catch {}

  try {
    const actuales = await fetchPropuestasSponsors();
    const actualizados = [nuevaPropuesta, ...actuales];
    localStorage.setItem(STORAGE_SPONSORS_KEY, JSON.stringify(actualizados));
  } catch {}

  return nuevaPropuesta;
}

export async function actualizarPropuestaSponsor(
  id: string,
  updates: Partial<PropuestaSponsor>
): Promise<void> {
  try {
    await supabase.from("propuestas_sponsors").update(updates).eq("id", id);
  } catch {}

  try {
    const actuales = await fetchPropuestasSponsors();
    const actualizados = actuales.map((s) => (s.id === id ? { ...s, ...updates } : s));
    localStorage.setItem(STORAGE_SPONSORS_KEY, JSON.stringify(actualizados));
  } catch {}
}

export async function eliminarPropuestaSponsor(id: string): Promise<void> {
  try {
    await supabase.from("propuestas_sponsors").delete().eq("id", id);
  } catch {}

  try {
    const actuales = await fetchPropuestasSponsors();
    const actualizados = actuales.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_SPONSORS_KEY, JSON.stringify(actualizados));
  } catch {}
}
