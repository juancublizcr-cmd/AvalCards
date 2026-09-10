export interface Puja {
  id: string;
  remateId: string;
  postorNombre: string;
  postorTelefono: string;
  postorCedula?: string | undefined;
  monto: number;
  fecha: string;
  estado: "aprobada" | "pendiente" | "rechazada";
  depositoGarantia?: boolean | undefined;
  comentario?: string | undefined;
}

export interface VehiculoSpecs {
  marca: string;
  modelo: string;
  ano: number;
  kilometraje: string;
  motor: string;
  potencia: string;
  transmision: string;
  traccion: string;
  combustible: string;
  color: string;
  traspasoIncluido: boolean;
  marchamoAlDia: boolean;
  garantiaAgencia: string;
  inspeccionDekra: boolean;
}

export interface Remate {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagenes: string[];
  precioSalida: number;
  precioReserva: number;
  incrementoMinimo: number;
  fechaInicio: string;
  fechaFin: string;
  estado: "activo" | "pausado" | "finalizado" | "adjudicado";
  ganadorSorteo: {
    nombre: string;
    tokenGanador: string;
    ciudad: string;
    declaracion: string;
  };
  vehiculoInfo: VehiculoSpecs;
  comisionPlataformaPct: number;
  depositoRequerido: number;
  pujas: Puja[];
}

const STORAGE_KEY = "aval_remates_vip_v4";

export const REMATE_DEFAULT: Remate = {
  id: "remate-001",
  titulo: "Subaru Impreza WRX STI 2024",
  subtitulo: "Adjudicado en el Gran Evento Promocional Aval · Puesto a Remate VIP por el Ganador",
  descripcion:
    "Vehículo 100% libre de todo gravamen, con marchamo cancelado y traspaso notarial completo incluido a cargo de Aval Community CR. El ganador del sorteo original optó por monetizar el premio en nuestra sala de subastas privada.",
  imagenes: [
    "/premio-subaru.jpg",
  ],
  precioSalida: 22000000,
  precioReserva: 26000000,
  incrementoMinimo: 250000,
  fechaInicio: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
  fechaFin: new Date(Date.now() + 3600 * 1000 * 48).toISOString(), // 48 horas restantes
  estado: "activo",
  ganadorSorteo: {
    nombre: "Juan Carlos B.",
    tokenGanador: "#48291",
    ciudad: "Alajuela, Costa Rica",
    declaracion:
      "Gané el vehículo con mi paquete de 8 tokens, pero ya tengo auto familiar. Decidí ponerlo en la Sala de Remates Aval para recibir efectivo directo y permitir que otro miembro de la comunidad se lo lleve a un super precio.",
  },
  vehiculoInfo: {
    marca: "Subaru",
    modelo: "Impreza WRX STI AWD",
    ano: 2024,
    kilometraje: "2,500 km",
    motor: "2.5L Turbo Boxer",
    potencia: "310 HP / 393 Nm Torque",
    transmision: "Manual de 6 velocidades",
    traccion: "Symmetrical All-Wheel Drive (AWD)",
    combustible: "Gasolina Super",
    color: "Azul World Rally Blue",
    traspasoIncluido: true,
    marchamoAlDia: true,
    garantiaAgencia: "Vigente",
    inspeccionDekra: true,
  },
  comisionPlataformaPct: 5,
  depositoRequerido: 50000,
  pujas: [
    {
      id: "bid-1",
      remateId: "remate-001",
      postorNombre: "Roberto M. Quesada",
      postorTelefono: "8841-2099",
      postorCedula: "1-1452-0988",
      monto: 35000000,
      fecha: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
      estado: "aprobada",
      depositoGarantia: true,
      comentario: "Precio base de apertura",
    },
    {
      id: "bid-2",
      remateId: "remate-001",
      postorNombre: "Andrés G. Zamora",
      postorTelefono: "8712-4433",
      postorCedula: "2-0789-0122",
      monto: 36500000,
      fecha: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      estado: "aprobada",
      depositoGarantia: true,
      comentario: "Puja confirmada con depósito",
    },
    {
      id: "bid-3",
      remateId: "remate-001",
      postorNombre: "Esteban V. Solano",
      postorTelefono: "8990-1122",
      postorCedula: "1-1823-0441",
      monto: 38000000,
      fecha: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      estado: "aprobada",
      depositoGarantia: true,
      comentario: "Puja líder actual",
    },
  ],
};

export function fetchRematesLocal(): Remate[] {
  if (typeof window === "undefined") return [REMATE_DEFAULT];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([REMATE_DEFAULT]));
      return [REMATE_DEFAULT];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([REMATE_DEFAULT]));
      return [REMATE_DEFAULT];
    }
    return parsed as Remate[];
  } catch {
    return [REMATE_DEFAULT];
  }
}

export function saveRematesLocal(remates: Remate[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remates));
  } catch (err) {
    console.error("Error al guardar remates:", err);
  }
}

export function agregarPujaLocal(
  remateId: string,
  datos: {
    postorNombre: string;
    postorTelefono: string;
    postorCedula?: string | undefined;
    monto: number;
    comentario?: string | undefined;
  }
): { exito: boolean; mensaje: string; puja?: Puja | undefined } {
  const remates = fetchRematesLocal();
  const index = remates.findIndex((r) => r.id === remateId);
  if (index === -1) {
    return { exito: false, mensaje: "Subasta no encontrada" };
  }

  const remate = remates[index];
  if (!remate || remate.estado !== "activo") {
    return { exito: false, mensaje: "Esta subasta no se encuentra activa en este momento" };
  }

  const pujasAprobadas = remate.pujas.filter((p) => p.estado === "aprobada");
  const pujaMayor = pujasAprobadas.reduce((max, p) => (p.monto > max ? p.monto : max), remate.precioSalida);
  const minRequerido = pujasAprobadas.length === 0 ? remate.precioSalida : pujaMayor + remate.incrementoMinimo;

  if (datos.monto < minRequerido) {
    return {
      exito: false,
      mensaje: `La oferta debe ser de al menos ₡${minRequerido.toLocaleString("es-CR")}`,
    };
  }

  const nuevaPuja: Puja = {
    id: `bid-${Date.now()}`,
    remateId,
    postorNombre: datos.postorNombre,
    postorTelefono: datos.postorTelefono,
    postorCedula: datos.postorCedula,
    monto: datos.monto,
    fecha: new Date().toISOString(),
    estado: "aprobada",
    depositoGarantia: false,
    comentario: datos.comentario,
  };

  remate.pujas.unshift(nuevaPuja);
  remates[index] = remate;
  saveRematesLocal(remates);

  return { exito: true, mensaje: "¡Tu puja ha sido registrada con éxito!", puja: nuevaPuja };
}

export function actualizarEstadoPujaLocal(remateId: string, pujaId: string, estado: Puja["estado"]): void {
  const remates = fetchRematesLocal();
  const rIndex = remates.findIndex((r) => r.id === remateId);
  if (rIndex === -1) return;

  const target = remates[rIndex];
  if (!target) return;
  target.pujas = target.pujas.map((p) => (p.id === pujaId ? { ...p, estado } : p));
  remates[rIndex] = target;
  saveRematesLocal(remates);
}

export function actualizarEstadoRemateLocal(remateId: string, estado: Remate["estado"]): void {
  const remates = fetchRematesLocal();
  const rIndex = remates.findIndex((r) => r.id === remateId);
  if (rIndex === -1) return;

  const target = remates[rIndex];
  if (!target) return;
  target.estado = estado;
  remates[rIndex] = target;
  saveRematesLocal(remates);
}
