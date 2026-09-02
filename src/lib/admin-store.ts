import { supabase } from "@/lib/supabase";
import type { Orden } from "@/lib/orders";
import prado from "@/assets/premio-prado.jpg";
import moto from "@/assets/premio-moto.jpg";
import consola from "@/assets/premio-consola.jpg";

// ────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────

export type Nivel = "Premio Mayor" | "Segundo Premio" | "Tercer Premio";

export const NIVELES: Nivel[] = ["Premio Mayor", "Segundo Premio", "Tercer Premio"];

export type Premio = {
  id: string;
  nombre: string;
  nivel: Nivel;
  imagen: string;
  orden: number;
};

export type FeatureDetalle = {
  titulo: string;
  desc: string;
};

export type TestimonioGanador = {
  id: string;
  premio: string;
  ganador: string;
  ciudad: string;
  sticker: string;
  sorteo: string;
  foto: string;
  testimonio: string;
};

export type FaqItem = {
  pregunta: string;
  respuesta: string;
};

export type PremioRaspa = {
  id: string;
  nombre: string;
  icono: string;
  probabilidad: number;
  esGanador: boolean;
};

export type JuegoModo = "raspa" | "ruleta" | "ambos" | "ninguno";

export type PremioRuleta = {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  probabilidad: number;
  esGanador: boolean;
};

export type RaspaConfig = {
  activo: boolean;
  modo?: JuegoModo;
  precio: number;
  titulo: string;
  subtitulo: string;
  premios: PremioRaspa[];
  ruletaTitulo?: string;
  ruletaSubtitulo?: string;
  ruletaPremios?: PremioRuleta[];
};

export type ModalidadVenta = "escalonado" | "fijo_3x5000";

export type Sorteo = {
  nombre: string;
  rangoMin: string;
  rangoMax: string;
  precioBase: number;
  fecha: string;
  modalidadVenta?: ModalidadVenta;
  detalleTitulo?: string;
  detalleSubtitulo?: string;
  detalleImagen?: string;
  detalleFeatures?: FeatureDetalle[];
  detalleGarantia?: string;
  ganadoresTestimonios?: TestimonioGanador[];
  faqs?: FaqItem[];
  raspaConfig?: RaspaConfig;
};

export type Inventario = { total: number; disponibles: number; fecha: string };

export type PremioInstantaneo = { numero: string; premio: string };

export type Config = {
  intentosMax: number;
  telefonoSinpe: string;
  razonSocial: string;
  ventasActivas: boolean;
  promoTitulo?: string;
  promoSubtitulo?: string;
  promoBotonTexto?: string;
  promoWhatsapp?: string;
  referidosActivo?: boolean;
  referidosBonoTokens?: number;
  referidosComisionPct?: number;
  referidosMensajeShare?: string;
  // Pasarelas de Pago
  sinpeActivo?: boolean;
  tilopayActivo?: boolean;
  tilopayMerchantId?: string;
  tilopayApiKey?: string;
  tilopayApiPassword?: string;
  tilopaySandbox?: boolean;
  cryptoActivo?: boolean;
  cryptoWalletUsdt?: string;
  cryptoRed?: string;
  cryptoBinanceId?: string;
  // PayPal
  paypalActivo?: boolean;
  paypalClientId?: string;
  paypalEmail?: string;
  paypalSandbox?: boolean;
  // Apple Pay
  applePayActivo?: boolean;
  applePayMerchantId?: string;
  // Google Pay
  googlePayActivo?: boolean;
  googlePayMerchantId?: string;
  // 5 Herramientas Virales de Crecimiento
  fomoActivo?: boolean;
  rankingReferidosActivo?: boolean;
  rankingPremioPrimero?: string;
  rankingPremioSegundo?: string;
  rankingPremioTercero?: string;
  rankingFechaCierre?: string;
  generadorHistoriasActivo?: boolean;
  miniSorteosActivo?: boolean;
  miniSorteoTitulo?: string;
  miniSorteoFecha?: string;
  miniSorteoPremio?: string;
  pwaBannerActivo?: boolean;
  // SuperToken
  supertokenActivo?: boolean;
  supertokenPrecio?: number;
  supertokenPremioUsd?: number;
};

export type ReferenteStat = {
  codigo: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  totalVentas: number;
  totalCompras: number;
  totalTokensGenerados: number;
  tokensBonoGanados: number;
  comisionGanada: number;
  ultimosReferidos: { nombre: string; fecha: string; monto: number; id: string }[];
};

export type Ganador = { sticker: string; orden: Orden };

export type Cliente = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  compras: number;
  stickers: number;
  supertokenCount: number;
  invertido: number;
  ultimaFecha: string;
};

// ────────────────────────────────────────────────────────────
// Defaults (para cuando la DB esté recién creada o vacía)
// ────────────────────────────────────────────────────────────

export const PREMIOS_DEFAULT: Premio[] = [
  { id: "p1", nombre: "Toyota Prado", nivel: "Premio Mayor", imagen: prado, orden: 1 },
  { id: "p2", nombre: "Moto alta cilindrada", nivel: "Segundo Premio", imagen: moto, orden: 2 },
  { id: "p3", nombre: "PlayStation 5", nivel: "Tercer Premio", imagen: consola, orden: 3 },
];

export const FEATURES_DEFAULT: FeatureDetalle[] = [
  { titulo: "Motor Turbo Diésel 2.8L", desc: "Potencia brutal y máxima eficiencia en carretera." },
  { titulo: "Tracción 4x4 Real", desc: "Capacidad todoterreno para cualquier rincón del país." },
  { titulo: "Versión Full Extras", desc: "Asientos en cuero, techo panorámico y pantallas táctiles." },
  { titulo: "100% Legal y Traspaso Incluido", desc: "Cero gastos ocultos: marchamo y notario pagos." },
];

export const GANADORES_TESTIMONIOS_DEFAULT: TestimonioGanador[] = [
  {
    id: "g1",
    premio: "Toyota Hilux 4x4",
    ganador: "Esteban Morales V.",
    ciudad: "San José, Escazú",
    sticker: "41982",
    sorteo: "Edición #14 - Agosto",
    foto: "",
    testimonio: "Compré el paquete de 12 stickers por SINPE Móvil y no lo podía creer cuando me llamaron. ¡100% legal y transparente!",
  },
  {
    id: "g2",
    premio: "Yamaha MT-09",
    ganador: "Valeria Campos R.",
    ciudad: "Alajuela, San Ramón",
    sticker: "80214",
    sorteo: "Edición #13 - Julio",
    foto: "",
    testimonio: "Todo el proceso fue rápido, validaron mi depósito en menos de 10 minutos y la entrega fue formal con traspaso incluido.",
  },
];

export const FAQS_DEFAULT: FaqItem[] = [
  {
    pregunta: "¿Cómo participo en el evento promocional?",
    respuesta:
      "Elige el paquete de Tokens digitales de tu preferencia (4, 8, 12 o 24 Tokens). Puedes dejar que el sistema asigne tus números de cortesía al azar o escribir tus números favoritos de 5 dígitos. Luego completas tus datos y pagas por SINPE Móvil o Tarjeta.",
  },
  {
    pregunta: "¿Cómo se determinan los favorecidos?",
    respuesta:
      "El evento se rige formalmente por combinaciones matemáticas transparentes basadas en los resultados oficiales públicos en la fecha establecida, garantizando total claridad e imparcialidad para todos los participantes.",
  },
  {
    pregunta: "¿Qué hago después de realizar el pago?",
    respuesta:
      "Si pagas con Tarjeta de Débito/Crédito, tu orden se valida al instante de forma automática. Si pagas por SINPE Móvil, nuestro equipo valida la transferencia en pocos minutos. Puedes consultar el estado de tus Tokens en la sección 'Validar mis Tokens'.",
  },
  {
    pregunta: "¿Qué son las Entregas Instantáneas?",
    respuesta:
      "Al adquirir tus Tokens, si uno de tus números coincide con una combinación favorecida pre-establecida en el evento, ¡obtienes ese reconocimiento menor al instante de forma automática!",
  },
  {
    pregunta: "¿Cómo se realiza la entrega del vehículo o beneficio principal?",
    respuesta:
      "La entrega se realiza de forma presencial con firma formal de traspaso legal ante Notario Público. Todos los costos de traspaso, marchamo y derechos corren por cuenta de Aval Community CR e Importadora Luxury Scents LTDA.",
  },
];

export const RULETA_PREMIOS_DEFAULT: PremioRuleta[] = [
  { id: "w1", nombre: "₡100,000 SINPE", icono: "💵", color: "#f59e0b", probabilidad: 2, esGanador: true },
  { id: "w2", nombre: "¡Casi! Otra Vuelta", icono: "⚡", color: "#3f3f46", probabilidad: 30, esGanador: false },
  { id: "w3", nombre: "₡50,000 SINPE", icono: "💵", color: "#10b981", probabilidad: 5, esGanador: true },
  { id: "w4", nombre: "SuperToken Gratis", icono: "👑", color: "#8b5cf6", probabilidad: 10, esGanador: true },
  { id: "w5", nombre: "12 Tokens Gratis", icono: "🎟️", color: "#ec4899", probabilidad: 15, esGanador: true },
  { id: "w6", nombre: "¡Por un pelo!", icono: "🎯", color: "#27272a", probabilidad: 25, esGanador: false },
  { id: "w7", nombre: "₡20,000 SINPE", icono: "💵", color: "#06b6d4", probabilidad: 8, esGanador: true },
  { id: "w8", nombre: "Sigue Jugando", icono: "🍀", color: "#52525b", probabilidad: 25, esGanador: false },
];

export const RASPA_DEFAULT: RaspaConfig = {
  activo: true,
  modo: "ambos",
  precio: 1000,
  titulo: "Raspa y Gana Express",
  subtitulo: "¡Gana dinero en SINPE Móvil y premios al instante con tu dedo o mouse!",
  premios: [
    { id: "r1", nombre: "₡100,000 en SINPE Móvil", icono: "💵", probabilidad: 5, esGanador: true },
    { id: "r2", nombre: "₡50,000 en SINPE Móvil", icono: "💵", probabilidad: 10, esGanador: true },
    { id: "r3", nombre: "₡20,000 en SINPE Móvil", icono: "💵", probabilidad: 15, esGanador: true },
    { id: "r4", nombre: "12 Tokens Oficiales", icono: "🎟️", probabilidad: 20, esGanador: true },
    { id: "r5", nombre: "SuperToken Gratis", icono: "👑", probabilidad: 20, esGanador: true },
    { id: "r6", nombre: "¡Casi lo logras! Sigue Intentando", icono: "⚡", probabilidad: 30, esGanador: false },
  ],
  ruletaTitulo: "Ruleta de la Fortuna Express",
  ruletaSubtitulo: "¡Gira la ruleta y gana premios en SINPE Móvil al instante!",
  ruletaPremios: RULETA_PREMIOS_DEFAULT,
};

export const SORTEO_DEFAULT: Sorteo = {
  nombre: "Evento Promocional Aval Community CR",
  rangoMin: "00000",
  rangoMax: "99999",
  precioBase: 2500,
  fecha: "2026-09-27",
  detalleTitulo: "Toyota Prado 2026: Lujo, Potencia y Confort",
  detalleSubtitulo: "Un vehículo 0 kilómetros, sacado de agencia con garantía total de fábrica y entregado formalmente a tu nombre.",
  detalleImagen: "",
  detalleFeatures: FEATURES_DEFAULT,
  detalleGarantia: "Si resultas favorecido, nos encargamos de todo el trámite de traspaso notarial, placas, marchamo del año y entrega con tanque lleno.",
  ganadoresTestimonios: GANADORES_TESTIMONIOS_DEFAULT,
  faqs: FAQS_DEFAULT,
  raspaConfig: RASPA_DEFAULT,
};

export const CONFIG_DEFAULT: Config = {
  intentosMax: 5,
  telefonoSinpe: "8634-4772",
  razonSocial: "Importadora Luxury Scents LTDA.",
  ventasActivas: false, // Inicia en modo promocional para que el admin lo active cuando guste
  promoTitulo: "🔥 GRAN EVENTO PROMOCIONAL 2026 · ¡PRÓXIMAMENTE!",
  promoSubtitulo: "Estamos afinando los últimos detalles de la plataforma. ¡Escríbenos por WhatsApp para ser de los primeros en acceder a la Preventa Exclusiva y asegurar tus números!",
  promoBotonTexto: "📲 ¡NOTIFICARME POR WHATSAPP (PREVENTA EXCLUSIVA)!",
  promoWhatsapp: "50686344772",
  referidosActivo: true,
  referidosBonoTokens: 1,
  referidosComisionPct: 10,
  referidosMensajeShare: "¡Mae, estoy participando por el vehículo 0KM en Aval Community CR! Entra con mi enlace para recibir +1 Token Extra de Regalo en tu compra: ",
  sinpeActivo: true,
  tilopayActivo: true,
  tilopayMerchantId: "",
  tilopayApiKey: "",
  tilopayApiPassword: "",
  tilopaySandbox: true,
  cryptoActivo: true,
  cryptoWalletUsdt: "TY9v6eZzK8jL3p4q1r2s5t6u7v8w9x0y1z",
  cryptoRed: "TRC20",
  cryptoBinanceId: "",
  paypalActivo: true,
  paypalClientId: "",
  paypalEmail: "pagos@avalcommunity.cr",
  paypalSandbox: true,
  applePayActivo: true,
  applePayMerchantId: "merchant.cr.avalcommunity",
  googlePayActivo: true,
  googlePayMerchantId: "avalcommunity-cr-google-pay",
  fomoActivo: true,
  rankingReferidosActivo: true,
  rankingPremioPrimero: "₡250,000 SINPE",
  rankingPremioSegundo: "₡100,000 SINPE",
  rankingPremioTercero: "₡50,000 SINPE",
  rankingFechaCierre: "Último día del mes · 11:59 PM",
  generadorHistoriasActivo: true,
  miniSorteosActivo: true,
  miniSorteoTitulo: "⛽ Viernes de Tanque Lleno (₡50,000 en Combustible)",
  miniSorteoFecha: "Viernes 7:00 PM",
  miniSorteoPremio: "₡50,000 en Gasolina Delta / Uno",
  pwaBannerActivo: true,
  supertokenActivo: true,
  supertokenPrecio: 1500,
  supertokenPremioUsd: 6000,
};

// ────────────────────────────────────────────────────────────
// Premios
// ────────────────────────────────────────────────────────────

export async function fetchPremios(): Promise<Premio[]> {
  try {
    const { data, error } = await supabase
      .from("premios")
      .select("*")
      .order("orden", { ascending: true });
    if (error || !data || data.length === 0) {
      return PREMIOS_DEFAULT;
    }
    // Si algún premio en DB no tiene URL de imagen aún, asignar asset default
    return data.map((p, idx) => ({
      ...p,
      imagen: p.imagen || PREMIOS_DEFAULT[idx % PREMIOS_DEFAULT.length]?.imagen || "",
    })) as Premio[];
  } catch {
    return PREMIOS_DEFAULT;
  }
}

export async function upsertPremios(premios: Premio[]): Promise<void> {
  const { error } = await supabase
    .from("premios")
    .upsert(premios, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function deletePremio(id: string): Promise<void> {
  const { error } = await supabase.from("premios").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Sube imagen al bucket `premios` y devuelve la URL pública.
 */
export async function subirImagenPremio(id: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${id}_${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("premios")
    .upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from("premios").getPublicUrl(path);
  return data.publicUrl;
}

// ────────────────────────────────────────────────────────────
// Sorteo config
// ────────────────────────────────────────────────────────────

export async function fetchSorteo(): Promise<Sorteo> {
  let extra: any = {};
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("aval_sorteo_config_extra");
      if (raw) extra = JSON.parse(raw);
    } catch {}
  }

  try {
    const { data, error } = await supabase
      .from("sorteo_config")
      .select("*")
      .eq("id", 1)
      .single();
    if (error || !data) {
      return {
        ...SORTEO_DEFAULT,
        precioBase: extra.precioBase ?? SORTEO_DEFAULT.precioBase,
        modalidadVenta: extra.modalidadVenta ?? SORTEO_DEFAULT.modalidadVenta,
        raspaConfig: extra.raspaConfig ?? SORTEO_DEFAULT.raspaConfig,
      };
    }

    let modDetectada: ModalidadVenta = "escalonado";
    if (data.modalidad_venta) {
      modDetectada = data.modalidad_venta as ModalidadVenta;
    } else if (data.nombre && data.nombre.includes("[MOD:fijo_3x5000]")) {
      modDetectada = "fijo_3x5000";
    } else if (data.nombre && data.nombre.includes("[MOD:escalonado]")) {
      modDetectada = "escalonado";
    } else if (extra.modalidadVenta) {
      modDetectada = extra.modalidadVenta;
    }

    const nombreLimpio = (data.nombre ?? SORTEO_DEFAULT.nombre).replace(/\[MOD:[^\]]+\]/g, "").trim();
    const precioBaseFinal = (data.precio_base !== null && data.precio_base !== undefined)
      ? Number(data.precio_base)
      : (extra.precioBase !== undefined ? Number(extra.precioBase) : SORTEO_DEFAULT.precioBase);

    return {
      nombre: nombreLimpio || SORTEO_DEFAULT.nombre,
      rangoMin: data.rango_min ?? SORTEO_DEFAULT.rangoMin,
      rangoMax: data.rango_max ?? SORTEO_DEFAULT.rangoMax,
      precioBase: precioBaseFinal,
      fecha: data.fecha ?? "",
      modalidadVenta: modDetectada,
      detalleTitulo: data.detalle_titulo ?? SORTEO_DEFAULT.detalleTitulo,
      detalleSubtitulo: data.detalle_subtitulo ?? SORTEO_DEFAULT.detalleSubtitulo,
      detalleImagen: data.detalle_imagen ?? SORTEO_DEFAULT.detalleImagen,
      detalleFeatures: (data.detalle_features as FeatureDetalle[]) ?? SORTEO_DEFAULT.detalleFeatures,
      detalleGarantia: data.detalle_garantia ?? SORTEO_DEFAULT.detalleGarantia,
      ganadoresTestimonios: (data.ganadores_testimonios as TestimonioGanador[]) ?? SORTEO_DEFAULT.ganadoresTestimonios,
      faqs: (data.faqs as FaqItem[]) ?? SORTEO_DEFAULT.faqs,
      raspaConfig: extra.raspaConfig ?? (data.raspa_config as RaspaConfig) ?? SORTEO_DEFAULT.raspaConfig,
    };
  } catch {
    return {
      ...SORTEO_DEFAULT,
      precioBase: extra.precioBase ?? SORTEO_DEFAULT.precioBase,
      modalidadVenta: extra.modalidadVenta ?? SORTEO_DEFAULT.modalidadVenta,
      raspaConfig: extra.raspaConfig ?? SORTEO_DEFAULT.raspaConfig,
    };
  }
}

export async function upsertSorteo(s: Sorteo): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("aval_sorteo_config_extra", JSON.stringify({
        precioBase: Number(s.precioBase) || 2500,
        raspaConfig: s.raspaConfig,
        modalidadVenta: s.modalidadVenta,
      }));
    } catch {}
  }

  const nombreLimpio = (s.nombre || SORTEO_DEFAULT.nombre).replace(/\[MOD:[^\]]+\]/g, "").trim();
  const nombreConTag = `${nombreLimpio} [MOD:${s.modalidadVenta || "escalonado"}]`;

  const upsertData: Record<string, any> = {
    id: 1,
    nombre: nombreConTag,
    rango_min: s.rangoMin,
    rango_max: s.rangoMax,
    precio_base: Number(s.precioBase) || 2500,
    fecha: s.fecha,
    detalle_titulo: s.detalleTitulo,
    detalle_subtitulo: s.detalleSubtitulo,
    detalle_imagen: s.detalleImagen,
    detalleFeatures: s.detalleFeatures,
    detalle_garantia: s.detalleGarantia,
    ganadores_testimonios: s.ganadoresTestimonios,
    faqs: s.faqs,
    raspa_config: s.raspaConfig,
    modalidad_venta: s.modalidadVenta,
  };

  let { error } = await supabase.from("sorteo_config").upsert(upsertData);
  if (error && (error.message?.includes("raspa_config") || error.message?.includes("modalidad_venta") || error.code === "PGRST204" || error.code === "42703")) {
    delete upsertData.raspa_config;
    delete upsertData.modalidad_venta;
    const retry = await supabase.from("sorteo_config").upsert(upsertData);
    error = retry.error;
  }
  if (error) throw new Error(error.message);
}

// ────────────────────────────────────────────────────────────
// Premios instantáneos
// ────────────────────────────────────────────────────────────

export async function fetchInstantaneos(): Promise<PremioInstantaneo[]> {
  try {
    const { data, error } = await supabase
      .from("premios_instantaneos")
      .select("*");
    if (error || !data) return [];
    return data as PremioInstantaneo[];
  } catch {
    return [];
  }
}

export async function upsertInstantaneo(p: PremioInstantaneo): Promise<void> {
  const { error } = await supabase
    .from("premios_instantaneos")
    .upsert(p, { onConflict: "numero" });
  if (error) throw new Error(error.message);
}

export async function eliminarInstantaneo(numero: string): Promise<void> {
  const { error } = await supabase
    .from("premios_instantaneos")
    .delete()
    .eq("numero", numero);
  if (error) throw new Error(error.message);
}

export async function buscarPremioInstantaneo(
  numeros: string[],
): Promise<PremioInstantaneo | null> {
  if (numeros.length === 0) return null;
  try {
    const { data, error } = await supabase
      .from("premios_instantaneos")
      .select("*")
      .in("numero", numeros)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as PremioInstantaneo;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────
// Site config
// ────────────────────────────────────────────────────────────

export async function fetchConfig(): Promise<Config> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", 1)
      .single();
    if (error || !data) return CONFIG_DEFAULT;
    let extra: any = {};
    try {
      const raw = localStorage.getItem("aval_site_config_extra");
      if (raw) extra = JSON.parse(raw);
    } catch {}

    const telSinpe = (data.telefono_sinpe && !data.telefono_sinpe.includes("8609"))
      ? data.telefono_sinpe
      : CONFIG_DEFAULT.telefonoSinpe;

    const promoWa = (extra.promoWhatsapp && !extra.promoWhatsapp.includes("8609"))
      ? extra.promoWhatsapp
      : (data.promo_whatsapp && !data.promo_whatsapp.includes("8609"))
      ? data.promo_whatsapp
      : CONFIG_DEFAULT.promoWhatsapp;

    return {
      intentosMax: data.intentos_max ?? CONFIG_DEFAULT.intentosMax,
      telefonoSinpe: telSinpe,
      razonSocial: data.razon_social ?? CONFIG_DEFAULT.razonSocial,
      ventasActivas: data.ventas_activas ?? CONFIG_DEFAULT.ventasActivas,
      promoTitulo: extra.promoTitulo || CONFIG_DEFAULT.promoTitulo,
      promoSubtitulo: extra.promoSubtitulo || CONFIG_DEFAULT.promoSubtitulo,
      promoBotonTexto: extra.promoBotonTexto || CONFIG_DEFAULT.promoBotonTexto,
      promoWhatsapp: promoWa,
      referidosActivo: extra.referidosActivo ?? CONFIG_DEFAULT.referidosActivo,
      referidosBonoTokens: extra.referidosBonoTokens ?? CONFIG_DEFAULT.referidosBonoTokens,
      referidosComisionPct: extra.referidosComisionPct ?? CONFIG_DEFAULT.referidosComisionPct,
      referidosMensajeShare: extra.referidosMensajeShare || CONFIG_DEFAULT.referidosMensajeShare,
      sinpeActivo: data.sinpe_activo ?? CONFIG_DEFAULT.sinpeActivo,
      tilopayActivo: data.tilopay_activo ?? CONFIG_DEFAULT.tilopayActivo,
      tilopayMerchantId: data.tilopay_merchant_id ?? CONFIG_DEFAULT.tilopayMerchantId,
      tilopayApiKey: data.tilopay_api_key ?? CONFIG_DEFAULT.tilopayApiKey,
      tilopayApiPassword: data.tilopay_api_password ?? CONFIG_DEFAULT.tilopayApiPassword,
      tilopaySandbox: data.tilopay_sandbox ?? CONFIG_DEFAULT.tilopaySandbox,
      cryptoActivo: data.crypto_activo ?? CONFIG_DEFAULT.cryptoActivo,
      cryptoWalletUsdt: data.crypto_wallet_usdt ?? CONFIG_DEFAULT.cryptoWalletUsdt,
      cryptoRed: data.crypto_red ?? CONFIG_DEFAULT.cryptoRed,
      cryptoBinanceId: data.crypto_binance_id ?? CONFIG_DEFAULT.cryptoBinanceId,
      paypalActivo: extra.paypalActivo ?? data.paypal_activo ?? CONFIG_DEFAULT.paypalActivo,
      paypalClientId: extra.paypalClientId ?? data.paypal_client_id ?? CONFIG_DEFAULT.paypalClientId,
      paypalEmail: extra.paypalEmail ?? data.paypal_email ?? CONFIG_DEFAULT.paypalEmail,
      paypalSandbox: extra.paypalSandbox ?? data.paypal_sandbox ?? CONFIG_DEFAULT.paypalSandbox,
      applePayActivo: extra.applePayActivo ?? data.apple_pay_activo ?? CONFIG_DEFAULT.applePayActivo,
      applePayMerchantId: extra.applePayMerchantId ?? data.apple_pay_merchant_id ?? CONFIG_DEFAULT.applePayMerchantId,
      googlePayActivo: extra.googlePayActivo ?? data.google_pay_activo ?? CONFIG_DEFAULT.googlePayActivo,
      googlePayMerchantId: extra.googlePayMerchantId ?? data.google_pay_merchant_id ?? CONFIG_DEFAULT.googlePayMerchantId,
      fomoActivo: extra.fomoActivo ?? CONFIG_DEFAULT.fomoActivo,
      rankingReferidosActivo: extra.rankingReferidosActivo ?? CONFIG_DEFAULT.rankingReferidosActivo,
      rankingPremioPrimero: extra.rankingPremioPrimero || CONFIG_DEFAULT.rankingPremioPrimero,
      rankingPremioSegundo: extra.rankingPremioSegundo || CONFIG_DEFAULT.rankingPremioSegundo,
      rankingPremioTercero: extra.rankingPremioTercero || CONFIG_DEFAULT.rankingPremioTercero,
      rankingFechaCierre: extra.rankingFechaCierre || CONFIG_DEFAULT.rankingFechaCierre,
      generadorHistoriasActivo: extra.generadorHistoriasActivo ?? CONFIG_DEFAULT.generadorHistoriasActivo,
      miniSorteosActivo: extra.miniSorteosActivo ?? CONFIG_DEFAULT.miniSorteosActivo,
      miniSorteoTitulo: extra.miniSorteoTitulo || CONFIG_DEFAULT.miniSorteoTitulo,
      miniSorteoFecha: extra.miniSorteoFecha || CONFIG_DEFAULT.miniSorteoFecha,
      miniSorteoPremio: extra.miniSorteoPremio || CONFIG_DEFAULT.miniSorteoPremio,
      pwaBannerActivo: extra.pwaBannerActivo ?? CONFIG_DEFAULT.pwaBannerActivo,
      supertokenActivo: extra.supertokenActivo ?? CONFIG_DEFAULT.supertokenActivo,
      supertokenPrecio: extra.supertokenPrecio ?? CONFIG_DEFAULT.supertokenPrecio,
      supertokenPremioUsd: extra.supertokenPremioUsd ?? CONFIG_DEFAULT.supertokenPremioUsd,
    };
  } catch {
    return CONFIG_DEFAULT;
  }
}

export async function upsertConfig(c: Config): Promise<void> {
  // Guardar en localStorage para disponibilidad inmediata y textos promocionales
  try {
    localStorage.setItem("aval_site_config_extra", JSON.stringify({
      promoTitulo: c.promoTitulo,
      promoSubtitulo: c.promoSubtitulo,
      promoBotonTexto: c.promoBotonTexto,
      promoWhatsapp: c.promoWhatsapp,
      referidosActivo: c.referidosActivo,
      referidosBonoTokens: c.referidosBonoTokens,
      referidosComisionPct: c.referidosComisionPct,
      referidosMensajeShare: c.referidosMensajeShare,
      paypalActivo: c.paypalActivo,
      paypalClientId: c.paypalClientId,
      paypalEmail: c.paypalEmail,
      paypalSandbox: c.paypalSandbox,
      applePayActivo: c.applePayActivo,
      applePayMerchantId: c.applePayMerchantId,
      googlePayActivo: c.googlePayActivo,
      googlePayMerchantId: c.googlePayMerchantId,
      fomoActivo: c.fomoActivo,
      rankingReferidosActivo: c.rankingReferidosActivo,
      rankingPremioPrimero: c.rankingPremioPrimero,
      rankingPremioSegundo: c.rankingPremioSegundo,
      rankingPremioTercero: c.rankingPremioTercero,
      rankingFechaCierre: c.rankingFechaCierre,
      generadorHistoriasActivo: c.generadorHistoriasActivo,
      miniSorteosActivo: c.miniSorteosActivo,
      miniSorteoTitulo: c.miniSorteoTitulo,
      miniSorteoFecha: c.miniSorteoFecha,
      miniSorteoPremio: c.miniSorteoPremio,
      pwaBannerActivo: c.pwaBannerActivo,
      supertokenActivo: c.supertokenActivo,
      supertokenPrecio: c.supertokenPrecio,
      supertokenPremioUsd: c.supertokenPremioUsd,
    }));
  } catch {}

  const payload: Record<string, any> = {
    id: 1,
    intentos_max: c.intentosMax,
    telefono_sinpe: c.telefonoSinpe,
    razon_social: c.razonSocial,
    ventas_activas: c.ventasActivas,
    sinpe_activo: c.sinpeActivo,
    tilopay_activo: c.tilopayActivo,
    tilopay_merchant_id: c.tilopayMerchantId,
    tilopay_api_key: c.tilopayApiKey,
    tilopay_api_password: c.tilopayApiPassword,
    tilopay_sandbox: c.tilopaySandbox,
    crypto_activo: c.cryptoActivo,
    crypto_wallet_usdt: c.cryptoWalletUsdt,
    crypto_red: c.cryptoRed,
    crypto_binance_id: c.cryptoBinanceId,
  };

  let { error } = await supabase.from("site_config").upsert(payload);
  if (error) {
    console.error("Supabase upsertConfig error:", error);
  }
}

// ────────────────────────────────────────────────────────────
// Inventario
// ────────────────────────────────────────────────────────────

export async function fetchInventario(): Promise<Inventario | null> {
  try {
    const { data, error } = await supabase
      .from("inventario")
      .select("*")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return {
      total: data.total,
      disponibles: data.disponibles,
      fecha: data.fecha,
    };
  } catch {
    return null;
  }
}

export async function upsertInventario(inv: Inventario): Promise<void> {
  const { error } = await supabase.from("inventario").upsert({
    id: 1,
    total: inv.total,
    disponibles: inv.disponibles,
    fecha: inv.fecha,
  });
  if (error) throw new Error(error.message);
}

// ────────────────────────────────────────────────────────────
// Escrutinio: ganadores
const tresCifras = (v: string) => v.replace(/\D/g, "").slice(-3).padStart(3, "0");
const dosCifras = (v: string) => v.replace(/\D/g, "").slice(-2).padStart(2, "0");

export function calcularGanadores(p1: string, p2: string, p3: string) {
  const a = dosCifras(p1);
  const b = dosCifras(p2);
  const c = dosCifras(p3).slice(-1);
  return { primero: `${a}${b}${c}`, segundo: `${b}${a}${c}` };
}

export function calcularGanadoresSerieNumero(
  s1: string,
  n1: string,
  s2?: string,
  n2?: string,
  s3?: string,
  n3?: string,
) {
  const primero = s1 && n1 ? `${tresCifras(s1)}${dosCifras(n1)}` : "";
  const segundo = s2 && n2 ? `${tresCifras(s2)}${dosCifras(n2)}` : "";
  const tercero = s3 && n3 ? `${tresCifras(s3)}${dosCifras(n3)}` : "";
  return { primero, segundo, tercero };
}

export async function buscarGanadores(stickers: string[]): Promise<Ganador[]> {
  if (stickers.length === 0) return [];
  const { data, error } = await supabase
    .from("ordenes")
    .select("*")
    .overlaps("numeros", stickers);
  if (error) throw new Error(error.message);

  const resultado: Ganador[] = [];
  for (const orden of (data ?? []) as Orden[]) {
    for (const s of stickers) {
      if (orden.numeros.includes(s)) {
        resultado.push({ sticker: s, orden });
      }
    }
  }
  return resultado;
}

// ────────────────────────────────────────────────────────────
// CRM: clientes derivados de órdenes
// ────────────────────────────────────────────────────────────

export async function fetchClientes(ordenes: Orden[]): Promise<Cliente[]> {
  const mapa = new Map<string, Cliente>();
  for (const o of ordenes) {
    const key = o.telefono;
    const prev = mapa.get(key);
    if (prev) {
      prev.compras += 1;
      prev.stickers += o.cantidad;
      if (o.supertoken) prev.supertokenCount += 1;
      if (o.estado === "aprobada") prev.invertido += o.precio;
      if (o.fecha > prev.ultimaFecha) prev.ultimaFecha = o.fecha;
    } else {
      mapa.set(key, {
        id: o.id,
        nombre: o.nombre,
        telefono: o.telefono,
        email: o.email,
        compras: 1,
        stickers: o.cantidad,
        supertokenCount: o.supertoken ? 1 : 0,
        invertido: o.estado === "aprobada" ? o.precio : 0,
        ultimaFecha: o.fecha,
      });
    }
  }
  return [...mapa.values()];
}

// ────────────────────────────────────────────────────────────
// Referidos & Afiliados Stats
// ────────────────────────────────────────────────────────────

export function calcularReferidosStats(
  ordenes: Orden[],
  comisionPct: number = 10,
  bonoTokensPorCompra: number = 1,
): {
  totalVentasReferidas: number;
  totalOrdenesReferidas: number;
  totalTokensReferidos: number;
  totalTokensBonoEmitidos: number;
  totalComisionesEstimadas: number;
  ranking: ReferenteStat[];
} {
  const mapa = new Map<string, ReferenteStat>();

  // Mapa auxiliar para nombres de clientes por teléfono
  const nombresMap = new Map<string, { nombre: string; email: string }>();
  for (const o of ordenes) {
    const rawTel = o.telefono.replace(/\D/g, "");
    if (rawTel && o.nombre) {
      nombresMap.set(rawTel, { nombre: o.nombre, email: o.email });
      if (rawTel.length === 8) nombresMap.set(`506${rawTel}`, { nombre: o.nombre, email: o.email });
    }
  }

  let totalVentasReferidas = 0;
  let totalOrdenesReferidas = 0;
  let totalTokensReferidos = 0;
  let totalTokensBonoEmitidos = 0;
  let totalComisionesEstimadas = 0;

  for (const o of ordenes) {
    if (!o.referido_por) continue;
    const refCode = o.referido_por.trim().replace(/\D/g, "") || o.referido_por.trim();
    if (!refCode) continue;

    const esAprobada = o.estado === "aprobada";
    const monto = esAprobada ? o.precio : 0;
    const tokens = esAprobada ? o.cantidad : 0;
    const bono = esAprobada ? bonoTokensPorCompra : 0;
    const comision = esAprobada ? Math.round((monto * comisionPct) / 100) : 0;

    if (esAprobada) {
      totalVentasReferidas += monto;
      totalOrdenesReferidas += 1;
      totalTokensReferidos += tokens;
      totalTokensBonoEmitidos += bono;
      totalComisionesEstimadas += comision;
    }

    const info = nombresMap.get(refCode);
    const prev = mapa.get(refCode);

    if (prev) {
      if (esAprobada) {
        prev.totalVentas += monto;
        prev.totalCompras += 1;
        prev.totalTokensGenerados += tokens;
        prev.tokensBonoGanados += bono;
        prev.comisionGanada += comision;
      }
      prev.ultimosReferidos.push({
        id: o.id,
        nombre: o.nombre,
        fecha: o.fecha,
        monto: o.precio,
      });
    } else {
      mapa.set(refCode, {
        codigo: refCode,
        nombre: info?.nombre || (refCode.length >= 8 ? `Cliente (${refCode})` : `Afiliado ${refCode}`),
        telefono: refCode.length >= 8 ? refCode : undefined,
        email: info?.email,
        totalVentas: monto,
        totalCompras: esAprobada ? 1 : 0,
        totalTokensGenerados: tokens,
        tokensBonoGanados: bono,
        comisionGanada: comision,
        ultimosReferidos: [
          {
            id: o.id,
            nombre: o.nombre,
            fecha: o.fecha,
            monto: o.precio,
          },
        ],
      });
    }
  }

  const ranking = [...mapa.values()].sort((a, b) => b.totalVentas - a.totalVentas);

  return {
    totalVentasReferidas,
    totalOrdenesReferidas,
    totalTokensReferidos,
    totalTokensBonoEmitidos,
    totalComisionesEstimadas,
    ranking,
  };
}
