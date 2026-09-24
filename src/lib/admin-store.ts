import { supabase } from "@/lib/supabase";
import type { Orden } from "@/lib/orders";
import carro from "@/assets/premio-carro.jpg";
import moto from "@/assets/premio-moto.jpg";
import consola from "@/assets/premio-consola.jpg";
import subaru from "@/assets/premio-subaru.jpg";

// ────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────

export type Nivel =
  | "1° Lugar"
  | "2° Lugar"
  | "3° Lugar"
  | "Premio Mayor"
  | "Segundo Premio"
  | "Tercer Premio"
  | "1° Lugar (A Elección)"
  | "2° Lugar (A Elección)"
  | "3° Lugar (Efectivo)"
  | "Premio Extra";

export const NIVELES: Nivel[] = [
  "1° Lugar",
  "2° Lugar",
  "3° Lugar",
  "Premio Extra",
];

export type Premio = {
  id: string;
  nombre: string;
  nivel: Nivel;
  imagen: string;
  orden: number;
  activo?: boolean;
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
  _meta?: any;
};

export type ModalidadVenta = "escalonado" | "multiplos_3" | "fijo_3x5000";

export type Sorteo = {
  nombre: string;
  rangoMin: string;
  rangoMax: string;
  precioBase: number;
  fecha: string;
  horaSorteo?: string; // e.g. "19:30" (7:30 PM en Costa Rica)
  modalidadVenta?: ModalidadVenta;
  heroTitulo?: string;
  reglaPremios?: string;
  mostrarDinamica?: boolean;
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
  // Horarios de sorteos y cierre previo
  horaSorteoMartesViernes?: string; // Default: "19:30"
  horaSorteoDomingos?: string; // Default: "19:30"
  horasCierrePrevio?: number; // Horas antes para cerrar ventas automáticamente (Default: 2)
  promoTitulo?: string;
  promoSubtitulo?: string;
  promoBotonTexto?: string;
  promoWhatsapp?: string;
  referidosActivo?: boolean;
  referidosDarTokensBono?: boolean;
  referidosPremioSiGana?: string;
  referidosPremioPrimero?: string;
  referidosPremioSegundo?: string;
  referidosPremioTercero?: string;
  referidosPromoLandingActivo?: boolean;
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
  miniSorteoDia?: number;
  miniSorteoTitulo?: string;
  miniSorteoFecha?: string;
  miniSorteoPremio?: string;
  pwaBannerActivo?: boolean;
  // Termómetro Comercial de Disponibilidad
  termometroFaseTitulo?: string;
  termometroMetaTokens?: number;
  termometroPorcentajeManual?: number;
  // SuperToken
  supertokenActivo?: boolean;
  supertokenPrecio?: number;
  supertokenMoneda?: "USD" | "CRC";
  supertokenPremioUsd?: number;
  supertokenPremioPrimeroUsd?: number;
  supertokenPremioSegundoUsd?: number;
  supertokenPremioTerceroUsd?: number;
  // Agente de Inteligencia Artificial
  aiActivo?: boolean;
  aiProveedor?: "gemini" | "openai" | "deepseek" | "claude";
  aiOpenaiKey?: string;
  aiOpenaiModel?: string;
  aiGeminiKey?: string;
  aiGeminiModel?: string;
  aiDeepseekKey?: string;
  aiDeepseekModel?: string;
  aiClaudeKey?: string;
  aiClaudeModel?: string;
  aiNombre?: string;
  aiSaludo?: string;
  aiSystemPrompt?: string;
  // Contenidos Legales Editables
  legalTerminosTexto?: string;
  legalPrivacidadTexto?: string;
  legalReembolsoTexto?: string;
  legalMinutaNotarialTexto?: string;
  // ─── Textos, Badges y Botones Dinámicos de la Web (Página Principal) ───
  // 1. Hero y Encabezado Principal
  heroBadgeEvento?: string;
  heroBadgePopular?: string;
  heroBadgeSuperToken?: string;
  heroBadgeGasolina?: string;
  heroBadgeComercios?: string;
  // Visibilidad de elementos del header/hero
  mostrarBarraNotificacion?: boolean;
  mostrarNavegacion?: boolean;
  mostrarBadgeSorteo?: boolean;
  mostrarBadgePopular?: boolean;
  mostrarBadgeJPS?: boolean;
  mostrarSeccionTermometro?: boolean;
  mostrarSeccionPaquetes?: boolean;
  mostrarCtaHero?: boolean;
  mostrarSeccionAperturaPremios?: boolean;
  modoVistaPremios?: "agrupado" | "individual";
  podio1Ceja?: string;
  podio1Titulo?: string;
  podio1Badge?: string;
  podio2Ceja?: string;
  podio2Titulo?: string;
  podio2Badge?: string;
  mostrarSeccionComoFunciona?: boolean;
  mostrarSeccionSuscripcion?: boolean;
  suscripcionBadge?: string;
  suscripcionTitulo?: string;
  suscripcionTexto?: string;
  suscripcionBotonTexto?: string;
  mostrarSeccionDetallePremios?: boolean;
  mostrarSeccionReferidos?: boolean;
  mostrarSeccionSponsors?: boolean;
  mostrarSeccionMiniSorteos?: boolean;
  mostrarSeccionGanadores?: boolean;
  mostrarSeccionFaqs?: boolean;
  mostrarSalaRemates?: boolean;
  fomoActivo?: boolean;
  aiActivo?: boolean;
  heroSubtitulo?: string;
  heroBotonCta?: string;
  heroBotonSecundario?: string;
  heroMicroPrueba1?: string;
  heroMicroPrueba2?: string;
  // 2. Vitrina Showcase y Badges Flotantes
  vitrinaBadgeKm?: string;
  vitrinaBadgeSuperToken?: string;
  vitrinaBadgeTraspaso?: string;
  vitrinaBotonAmpliar?: string;
  // 3. Sección Cómo Funciona (3 Pasos)
  pasosBadge?: string;
  pasosTitulo?: string;
  pasosSubtitulo?: string;
  pasosPaso1Titulo?: string;
  pasosPaso1Desc?: string;
  pasosPaso2Titulo?: string;
  pasosPaso2Desc?: string;
  pasosPaso3Titulo?: string;
  pasosPaso3Desc?: string;
  pasosBotonCta?: string;
  // 4. Mini-Sorteos Semanales
  miniSorteoTituloPrincipal?: string;
  miniSorteoSubtituloPrincipal?: string;
  miniSorteoViernesBadge?: string;
  miniSorteoViernesTitulo?: string;
  miniSorteoViernesPremio?: string;
  miniSorteoViernesDesc?: string;
  miniSorteoViernesAuditoria?: string;
  miniSorteoDomingosBadge?: string;
  miniSorteoDomingosTitulo?: string;
  miniSorteoDomingosPremio?: string;
  miniSorteoDomingosDesc?: string;
  miniSorteoDomingosAuditoria?: string;
  miniSorteosGarantia1Titulo?: string;
  miniSorteosGarantia1Desc?: string;
  miniSorteosGarantia2Titulo?: string;
  miniSorteosGarantia2Desc?: string;
  miniSorteosGarantia3Titulo?: string;
  miniSorteosGarantia3Desc?: string;
  // 5. Sección Paquetes de Tokens y Botones de Compra
  paquetesBadge?: string;
  paquetesTitulo?: string;
  paquetesSubtitulo?: string;
  paquetesTokensLabel?: string;
  paquetesBotonComprar?: string;
  paqueteTagPopular?: string;
  paqueteTagBest?: string;
  // 6. Control de Secciones de la Landing (Poner / Quitar / Modificar)
  mostrarSeccionAperturaPremios?: boolean;
  mostrarSeccionTermometro?: boolean;
  mostrarSeccionDetallePremios?: boolean;
  mostrarSeccionComoFunciona?: boolean;
  mostrarSeccionReferidos?: boolean;
  mostrarSeccionSponsors?: boolean;
  mostrarSeccionMiniSorteos?: boolean;
  mostrarSeccionGanadores?: boolean;
  mostrarSeccionFaqs?: boolean;
  mostrarSalaRemates?: boolean;
  heroTituloApertura?: string;
  heroSubtituloApertura?: string;
  // 7. Pie de Página (Footer) - Visibilidad de Enlaces
  footerMostrarColumnaPlataforma?: boolean;
  footerMostrarImpactoSocial?: boolean;
  footerMostrarReferidos?: boolean;
  footerMostrarComercios?: boolean;
  footerMostrarComerciosEnlace?: boolean;
  footerMostrarAccesoAdmin?: boolean;
  footerMostrarThemeToggle?: boolean;
  footerMostrarLegal?: boolean;
  footerMostrarWhatsApp?: boolean;
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
  { id: "p1", nombre: "Moto de Alta Cilindrada", nivel: "1° Lugar", imagen: moto, orden: 1, activo: true },
  { id: "p2", nombre: "Mercedes-Benz Clase GLE", nivel: "1° Lugar", imagen: carro, orden: 2, activo: true },
  { id: "p3", nombre: "Subaru Impreza WRX", nivel: "1° Lugar", imagen: subaru, orden: 3, activo: true },
  { id: "p4", nombre: "Premio en Efectivo / PS5", nivel: "3° Lugar", imagen: consola, orden: 4, activo: true },
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
    testimonio: "Compré el paquete de 12 tokens por SINPE Móvil y no lo podía creer cuando me llamaron. ¡100% legal y transparente!",
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
      "La entrega se realiza de forma presencial con firma formal de traspaso legal ante Notario Público. Todos los costos de traspaso, marchamo y derechos corren por cuenta de Aval Community CR e LUXX CR CAR WASH",
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
  activo: false, // Desconectado por defecto
  modo: "ninguno",
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
  fecha: "2026-09-13",
  horaSorteo: "19:30", // 7:30 PM
  heroTitulo: "",
  reglaPremios: "",
  mostrarDinamica: true,
  detalleTitulo: "Vehículos de Alta Gama y Premios Oficiales",
  detalleSubtitulo: "Vehículos certificados, sacados de agencia con garantía y entregados formalmente a tu nombre con marchamo y traspaso incluido.",
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
  razonSocial: "LUXX CR CAR WASH",
  ventasActivas: true, // Tienda y secciones activas por defecto
  horaSorteoMartesViernes: "19:30", // 7:30 PM
  horaSorteoDomingos: "19:30", // 7:30 PM
  horasCierrePrevio: 2, // Cierre de ventas 2 horas antes (5:30 PM)
  promoTitulo: "🔥 GRAN EVENTO PROMOCIONAL 2026 · ¡PRÓXIMAMENTE!",
  promoSubtitulo: "Estamos afinando los últimos detalles de la plataforma. ¡Escríbenos por WhatsApp para ser de los primeros en acceder a la Preventa Exclusiva y asegurar tus números!",
  promoBotonTexto: "📲 ¡NOTIFICARME POR WHATSAPP (PREVENTA EXCLUSIVA)!",
  promoWhatsapp: "50686344772",
  referidosActivo: true,
  referidosDarTokensBono: false, // Por defecto nadie se gana tokens ya, configurable por switch en admin
  referidosPremioSiGana: "₡4,000,000",
  referidosPremioPrimero: "₡4,000,000",
  referidosPremioSegundo: "₡2,000,000",
  referidosPremioTercero: "₡1,000,000",
  referidosPromoLandingActivo: true,
  referidosBonoTokens: 1,
  referidosComisionPct: 10,
  referidosMensajeShare: "¡Participa en el evento más grande de Costa Rica y estrena vehículo de lujo!",
  sinpeActivo: true,
  tilopayActivo: true,
  tilopayMerchantId: "36737",
  tilopayApiKey: "4l0b31649987",
  tilopayApiPassword: "pass",
  tilopaySandbox: false,
  cryptoActivo: false,
  cryptoWalletUsdt: "0x71C...TuWalletUSDT",
  cryptoRed: "TRC20 (Tron)",
  cryptoBinanceId: "123456789",
  paypalActivo: false,
  paypalClientId: "TU_PAYPAL_CLIENT_ID_AQUI",
  paypalEmail: "pagos@avalcommunity.com",
  paypalSandbox: false,
  applePayActivo: false,
  applePayMerchantId: "merchant.com.avalcommunity.cr",
  googlePayActivo: false,
  googlePayMerchantId: "avalcommunity-cr-google-pay",
  fomoActivo: false,
  rankingReferidosActivo: true,
  rankingPremioPrimero: "₡250,000 SINPE",
  rankingPremioSegundo: "₡100,000 SINPE",
  rankingPremioTercero: "₡50,000 SINPE",
  rankingFechaCierre: "Último día del mes · 11:59 PM",
  generadorHistoriasActivo: true,
  miniSorteosActivo: true,
  miniSorteoDia: 5,
  miniSorteoTitulo: "⛽ Viernes de Tanque Lleno + 🎮 Domingos de PlayStation 5 Extra",
  miniSorteoFecha: "Viernes 7:30 PM (Gasolina Delta/Uno) y Domingos 7:30 PM (PlayStation 5)",
  miniSorteoPremio: "₡50,000 en Gasolina Delta/Uno y Consola PlayStation 5",
  pwaBannerActivo: true,
  termometroFaseTitulo: "Progreso de la Edición",
  termometroMetaTokens: 100000,
  termometroPorcentajeManual: 0,
  supertokenActivo: true,
  supertokenPrecio: 1000,
  supertokenMoneda: "CRC",
  supertokenPremioUsd: 4500000,
  supertokenPremioPrimeroUsd: 4500000,
  supertokenPremioSegundoUsd: 250000,
  supertokenPremioTerceroUsd: 1500000,
  // Agente de IA
  aiActivo: true,
  aiProveedor: "gemini",
  aiOpenaiKey: "",
  aiOpenaiModel: "gpt-4o-mini",
  aiGeminiKey: "",
  aiGeminiModel: "gemini-1.5-flash",
  aiDeepseekKey: "",
  aiDeepseekModel: "deepseek-chat",
  aiClaudeKey: "",
  aiClaudeModel: "claude-3-5-haiku-20241022",
  aiNombre: "Aval-IA · Asesor Comercial 24/7",
  aiSaludo: "¡Hola! Pura vida 🇨🇷 Soy Aval-IA, tu asesor comercial en Aval Community CR. ¡Hoy es tu día de suerte! ¿Sabías que el 1er lugar escoge entre una Moto de Alta Cilindrada, un Mercedes-Benz o un Subaru Impreza, y que con el SuperToken optas por un gran bono entregado formalmente sumado a tu premio? 🚗💨 ¿Te gustaría apartar tus números de la suerte ahora mismo o prefieres conocer los métodos de pago?",
  aiSystemPrompt: "Eres Aval-IA, el Vendedor Estrella y Asesor Comercial Oficial de Aval Community CR (avalcommunity.cr). Tu ÚNICO rol es atender al público, asesorar e impulsar de forma proactiva el cierre de ventas de tokens. CONOCIMIENTO DE LA PLATAFORMA: 1) PREMIOS: 1° Lugar entre Moto de Alta Cilindrada ($57,900), Mercedes-Benz o Subaru Impreza (traspaso notarial y marchamo 100% pagos por la empresa, cero costos ocultos); 2° Lugar se lleva el segundo vehículo; 3° Lugar premio entregado formalmente o PlayStation 5; Mini Sorteos semanales (PlayStation 5 o gasolina para participantes activos sin pagar nada extra), y Raspa & Gana Express instantáneo por hasta ₡100,000. 2) 6 FORMAS DE PAGO: SINPE Móvil oficial (8634-4772 a nombre de LUXX CR CAR WASH), Tarjetas de Débito y Crédito Visa/Mastercard vía TiloPay con aprobación instantánea, Apple Pay (1 toque), Google Pay (1 clic), PayPal y Criptomonedas (USDT redes TRC20/BEP20 o Binance Pay). 3) LOTES DE TICKETS: Paquetes de tokens digitales donde los usuarios pueden elegir números de 5 dígitos (00000-99999) o generarlos al azar. 4) SUPERTOKEN: Multiplicador opcional; si el participante gana, ¡recibe bonos millonarios entregados formalmente sumados al vehículo! 5) CÓMO SE JUEGA Y GANADOR: Elige paquete en /checkout, asigna números, paga por tu método favorito. El ganador se define en estricta sincronía con la Lotería Nacional de la Junta de Protección Social (JPS) de Costa Rica. Consulta tus números en /validar. INSTRUCCIONES DE VENTA OBLIGATORIAS: Incita a comprar en cada respuesta motivando a adquirir paquetes en el Checkout (/checkout). PROHIBICIÓN ESTRICTA: Jamás respondas temas sobre código fuente, tecnologías, arquitectura interna ni cómo fue programada la app; eres 100% asesor comercial.",
  legalTerminosTexto: "",
  legalPrivacidadTexto: "",
  legalReembolsoTexto: "",
  legalMinutaNotarialTexto: "",
  // ─── Defaults Textos Dinámicos de la Web ───
  // 1. Hero
  heroBadgeEvento: "Evento Promocional Oficial Costa Rica",
  heroBadgePopular: "",
  heroBadgeSuperToken: "",
  heroBadgeGasolina: "⛽ Viernes de Tanque Lleno (₡50k Gasolina) + 🎮 Domingos de Play 5",
  heroBadgeComercios: "Descuentos en Comercios ↗",
  mostrarBadgeSorteo: true,
  mostrarBadgePopular: false,
  mostrarBadgeJPS: false,
  mostrarBarraNotificacion: false,
  mostrarNavegacion: false,
  mostrarSeccionTermometro: false,
  mostrarSeccionPaquetes: false,
  mostrarCtaHero: false,
  mostrarSeccionAperturaPremios: true,
  modoVistaPremios: "agrupado",
  podio1Ceja: "1° Lugar Oficial · Tu comunidad te respalda",
  podio1Titulo: "Con tu aval: Vos tenés el mando del premio",
  podio1Badge: "Elegí con total libertad entre las 2 opciones",
  podio2Ceja: "2° Lugar Oficial · Tu comunidad te respalda",
  podio2Titulo: "Con tu aval: Vos tenés el mando del premio",
  podio2Badge: "Elegí con total libertad entre las 2 opciones",
  mostrarSeccionComoFunciona: true,
  mostrarSeccionSuscripcion: true,
  suscripcionBadge: "Comunidad Exclusiva · Membresía Oficial AVAL",
  suscripcionTitulo: "SUSCRIBITE",
  suscripcionTexto: "Afiliate a AVAL y formá parte de una comunidad con beneficios. Con tu suscripción obtenés 50% de descuento en LUXX CR CAR WASH, recibís 3 tokens para participar y accedés a una plataforma con dinámicas transparentes y verificables, respaldadas por resultados oficiales.",
  suscripcionBotonTexto: "¡QUIERO MI SUSCRIPCIÓN Y MIS 3 TOKENS! →",
  mostrarSeccionDetallePremios: false,
  mostrarSeccionReferidos: false,
  mostrarSeccionSponsors: false,
  mostrarSeccionMiniSorteos: false,
  mostrarSeccionGanadores: false,
  mostrarSeccionFaqs: true,
  mostrarSalaRemates: false,
  fomoActivo: false,
  aiActivo: false,
  heroSubtitulo: "Plataforma costarricense de eventos promocionales digitales y sorteos de vehículos de alta gama, diseñada para brindar una experiencia 100% digital, transparente y con total respaldo legal.",
  heroBotonCta: "🔥 ¡QUIERO PARTICIPAR AHORA!",
  heroBotonSecundario: "¿Cómo funciona? ↓",
  heroMicroPrueba1: "Pago Seguro SINPE y Tarjeta",
  heroMicroPrueba2: "Entrega Formal ante Notario",
  // 2. Vitrina Showcase
  vitrinaBadgeKm: "0 Kilómetros · Año 2026",
  vitrinaBadgeSuperToken: "",
  vitrinaBadgeTraspaso: "Traspaso y Marchamo Incluidos",
  vitrinaBotonAmpliar: "Clic para ampliar en grande",
  // 3. 3 Pasos
  pasosBadge: "Proceso 100% Digital y Transparente",
  pasosTitulo: "Participa en 3 Simples Pasos",
  pasosSubtitulo: "Sin filas ni boletos físicos. Todo queda registrado digitalmente en tu dispositivo.",
  pasosPaso1Titulo: "Elige tus Tokens",
  pasosPaso1Desc: "Selecciona el paquete digital que prefieras. Puedes asignar tus números al azar o escribir tus números favoritos.",
  pasosPaso2Titulo: "Paga Seguro con SINPE o Tarjeta",
  pasosPaso2Desc: "Paga por SINPE Móvil oficial, tarjeta de débito/crédito, Apple Pay, Google Pay, PayPal o Cripto.",
  pasosPaso3Titulo: "¡Participa con Resultados Oficiales!",
  pasosPaso3Desc: "Tus tokens quedan asignados de inmediato. El sorteo se define con la Junta de Protección Social (JPS).",
  pasosBotonCta: "Comenzar y Elegir mis Tokens →",
  // 4. Mini-Sorteos
  miniSorteoTituloPrincipal: "⛽ Mini-Sorteos Semanales (Sin Costo Extra)",
  miniSorteoSubtituloPrincipal: "Todos los tokens activos participan automáticamente en los sorteos semanales de gasolina y consolas.",
  miniSorteoViernesBadge: "Todos los Viernes · 7:30 PM",
  miniSorteoViernesTitulo: "Viernes de Tanque Lleno",
  miniSorteoViernesPremio: "₡50,000 en Gasolina Delta / Uno",
  miniSorteoViernesDesc: "Llena el tanque de tu vehículo o motocicleta 100% gratis. También entregados formalmente si lo prefieres en efectivo.",
  miniSorteoViernesAuditoria: "Auditado con la emisión oficial de los viernes de la JPS",
  miniSorteoDomingosBadge: "Todos los Domingos · 7:30 PM",
  miniSorteoDomingosTitulo: "Domingos de PlayStation 5 Extra",
  miniSorteoDomingosPremio: "Consola PS5 o ₡350,000 SINPE",
  miniSorteoDomingosDesc: "Estrena una consola PlayStation 5 Slim Digital 0KM sellada de paquete o recibe ₡350,000 en efectivo por SINPE Móvil al instante.",
  miniSorteoDomingosAuditoria: "Auditado directamente con la emisión dominical oficial de la JPS",
  miniSorteosGarantia1Titulo: "100% Automático",
  miniSorteosGarantia1Desc: "Todos los tokens que adquieras entran automáticamente a los sorteos de gasolina de los viernes y PlayStation de los domingos sin pagar nada extra.",
  miniSorteosGarantia2Titulo: "Sigues Jugando por el Carro",
  miniSorteosGarantia2Desc: "Incluso si ganas la gasolina o el PlayStation 5 semanal, tus tokens siguen 100% válidos y activos para los vehículos del sorteo mayor.",
  miniSorteosGarantia3Titulo: "Depósito SINPE Inmediato",
  miniSorteosGarantia3Desc: "Los números ganadores se anuncian en vivo, se notifican directamente por WhatsApp y el premio se transfiere al instante.",
  // 5. Paquetes
  paquetesBadge: "Elige tu Paquete Digital",
  paquetesTitulo: "Elige tu paquete de Tokens",
  paquetesSubtitulo: "Más Tokens, más oportunidades. Puedes generarlos al azar o elegir tus números favoritos.",
  paquetesTokensLabel: "Tokens Digitales Oficiales",
  paquetesBotonComprar: "Adquirir ahora →",
  paqueteTagPopular: "Más popular",
  paqueteTagBest: "EL MEJOR · MÁS VENDIDO",
  // 6. Control de Secciones de la Landing (Poner / Quitar / Modificar)
  mostrarSeccionAperturaPremios: true,
  mostrarSeccionTermometro: true,
  mostrarSeccionDetallePremios: true,
  mostrarSeccionComoFunciona: true,
  mostrarSeccionReferidos: true,
  mostrarSeccionSponsors: true,
  mostrarSeccionMiniSorteos: false, // Fuera por ahora hasta que se entienda la dinámica principal
  mostrarSeccionGanadores: false, // Fuera por ahora hasta que se entienda la dinámica principal
  mostrarSeccionFaqs: true,
  mostrarSalaRemates: false, // Fuera para no confundir a los usuarios sobre la compra de tokens
  heroTituloApertura: "Tres Entregas Espectaculares",
  heroSubtituloApertura: "Con cada paquete adquieres triple oportunidad según las combinaciones oficiales de la JPS.",
  // 7. Pie de Página (Footer) - Visibilidad de Enlaces
  footerMostrarColumnaPlataforma: false,
  footerMostrarImpactoSocial: false,
  footerMostrarReferidos: false,
  footerMostrarComercios: false,
  footerMostrarComerciosEnlace: false,
  footerMostrarAccesoAdmin: false,
  footerMostrarThemeToggle: false,
  footerMostrarLegal: true,
  footerMostrarWhatsApp: true,
};

// ────────────────────────────────────────────────────────────
// Premios
// ────────────────────────────────────────────────────────────

function toSupabaseNivel(nivel: string): "Premio Mayor" | "Segundo Premio" | "Tercer Premio" {
  if (nivel === "1° Lugar" || nivel === "1° Lugar (A Elección)" || nivel === "Premio Mayor") return "Premio Mayor";
  if (nivel === "2° Lugar" || nivel === "2° Lugar (A Elección)" || nivel === "Segundo Premio") return "Segundo Premio";
  return "Tercer Premio";
}

export async function fetchPremios(): Promise<Premio[]> {
  const NIVEL_ORDEN: Record<string, number> = {
    "1° Lugar": 1,
    "Premio Mayor": 1,
    "1° Lugar (A Elección)": 1,
    "2° Lugar": 2,
    "Segundo Premio": 2,
    "2° Lugar (A Elección)": 2,
    "3° Lugar": 3,
    "Tercer Premio": 3,
    "3° Lugar (Efectivo)": 3,
    "Premio Extra": 4,
  };

  let meta: Record<string, { nivel?: Nivel; activo?: boolean }> = {};
  let inactivos: string[] = [];
  if (typeof window !== "undefined") {
    try {
      const rawMeta = localStorage.getItem("aval_premios_meta");
      if (rawMeta) meta = JSON.parse(rawMeta);
      const rawInact = localStorage.getItem("aval_premios_inactivos");
      if (rawInact) inactivos = JSON.parse(rawInact);
    } catch {}
  }

  try {
    // Sincronizar metadatos remotos desde sorteo_config para conocer premios inactivos/apagados en cualquier navegador
    try {
      const { data: sorteoActual } = await supabase
        .from("sorteo_config")
        .select("raspa_config")
        .eq("id", 1)
        .maybeSingle();
      if (sorteoActual?.raspa_config?._meta?._premios_meta) {
        // La base de datos remota es la fuente de verdad prioritaria
        meta = { ...meta, ...sorteoActual.raspa_config._meta._premios_meta };
        Object.entries(sorteoActual.raspa_config._meta._premios_meta).forEach(([pid, val]: [string, any]) => {
          if (val?.activo === false && !inactivos.includes(pid)) {
            inactivos.push(pid);
          } else if (val?.activo === true && inactivos.includes(pid)) {
            inactivos = inactivos.filter((id) => id !== pid);
          }
        });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("aval_premios_meta", JSON.stringify(meta));
            localStorage.setItem("aval_premios_inactivos", JSON.stringify(inactivos));
          } catch {}
        }
      }
    } catch {}

    const { data, error } = await supabase
      .from("premios")
      .select("*");
    if (error || !data || data.length === 0) {
      return PREMIOS_DEFAULT.map((p) => {
        let n = meta[p.id]?.nivel || p.nivel;
        if ((n as string) === "1° Lugar (A Elección)") n = "1° Lugar";
        if ((n as string) === "2° Lugar (A Elección)") n = "2° Lugar";
        if ((n as string) === "3° Lugar (Efectivo)") n = "3° Lugar";
        return {
          ...p,
          nivel: n,
          activo: meta[p.id]?.activo !== undefined ? meta[p.id].activo : !inactivos.includes(p.id),
        };
      });
    }

    // Ordenar de forma determinista
    const ordenados = (data as Premio[]).sort((a, b) => {
      const ordA = NIVEL_ORDEN[a.nivel] ?? a.orden ?? 99;
      const ordB = NIVEL_ORDEN[b.nivel] ?? b.orden ?? 99;
      return ordA - ordB;
    });

    return ordenados.map((p, idx) => {
      const itemMeta = meta[p.id];
      let nivelReal: Nivel = p.nivel as Nivel;
      if (itemMeta?.nivel && typeof itemMeta.nivel === "string") {
        const rawN = itemMeta.nivel;
        if (rawN.includes("1") || rawN.toLowerCase().includes("primer")) nivelReal = "1° Lugar";
        else if (rawN.includes("2") || rawN.toLowerCase().includes("segund")) nivelReal = "2° Lugar";
        else if (rawN.includes("3") || rawN.toLowerCase().includes("tercer")) nivelReal = "3° Lugar";
        else if (rawN.toLowerCase().includes("extra")) nivelReal = "Premio Extra";
        else nivelReal = itemMeta.nivel as Nivel;
      } else if (p.nivel === "Premio Mayor") {
        nivelReal = "1° Lugar";
      } else if (p.nivel === "Segundo Premio") {
        nivelReal = "2° Lugar";
      } else if (p.nivel === "Tercer Premio") {
        nivelReal = "3° Lugar";
      }

      if ((nivelReal as string) === "1° Lugar (A Elección)") nivelReal = "1° Lugar";
      if ((nivelReal as string) === "2° Lugar (A Elección)") nivelReal = "2° Lugar";
      if ((nivelReal as string) === "3° Lugar (Efectivo)") nivelReal = "3° Lugar";

      const estaActivo = itemMeta?.activo !== undefined
        ? itemMeta.activo
        : inactivos.includes(p.id)
        ? false
        : (p as any).activo !== undefined
        ? (p as any).activo
        : true;

      return {
        ...p,
        nivel: nivelReal,
        activo: estaActivo,
        orden: NIVEL_ORDEN[nivelReal] ?? idx + 1,
        imagen: p.imagen || PREMIOS_DEFAULT[idx % PREMIOS_DEFAULT.length]?.imagen || "",
      };
    });
  } catch {
    return PREMIOS_DEFAULT.map((p) => {
      let n = meta[p.id]?.nivel || p.nivel;
      if ((n as string) === "1° Lugar (A Elección)") n = "1° Lugar";
      if ((n as string) === "2° Lugar (A Elección)") n = "2° Lugar";
      if ((n as string) === "3° Lugar (Efectivo)") n = "3° Lugar";
      return {
        ...p,
        nivel: n,
        activo: meta[p.id]?.activo !== undefined ? meta[p.id].activo : !inactivos.includes(p.id),
      };
    });
  }
}

export async function upsertPremios(premios: Premio[]): Promise<void> {
  const NIVEL_ORDEN: Record<string, number> = {
    "1° Lugar": 1,
    "Premio Mayor": 1,
    "1° Lugar (A Elección)": 1,
    "2° Lugar": 2,
    "Segundo Premio": 2,
    "2° Lugar (A Elección)": 2,
    "3° Lugar": 3,
    "Tercer Premio": 3,
    "3° Lugar (Efectivo)": 3,
    "Premio Extra": 4,
  };

  if (typeof window !== "undefined") {
    try {
      const meta: Record<string, { nivel: Nivel; activo: boolean }> = {};
      const inactivos: string[] = [];
      premios.forEach((p) => {
        meta[p.id] = { nivel: p.nivel, activo: p.activo !== false };
        if (p.activo === false) inactivos.push(p.id);
      });
      localStorage.setItem("aval_premios_meta", JSON.stringify(meta));
      localStorage.setItem("aval_premios_inactivos", JSON.stringify(inactivos));
    } catch {}
  }

  const normalizados = premios.map((p, idx) => ({
    id: p.id,
    nombre: p.nombre,
    nivel: toSupabaseNivel(p.nivel),
    imagen: p.imagen || "",
    orden: NIVEL_ORDEN[p.nivel] ?? idx + 1,
  }));

  const { error } = await supabase
    .from("premios")
    .upsert(normalizados, { onConflict: "id" });
  if (error) {
    console.error("Error al guardar premios en Supabase:", error);
    throw new Error(error.message);
  }

  // Sincronizar metadatos de activos/apagados en sorteo_config de Supabase
  try {
    const { data: sorteoActual } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .maybeSingle();
    if (sorteoActual) {
      const raspa = sorteoActual.raspa_config || {};
      const metaActual = raspa._meta || {};
      const metaPremios: Record<string, { nivel: Nivel; activo: boolean }> = {};
      premios.forEach((p) => {
        metaPremios[p.id] = { nivel: p.nivel, activo: p.activo !== false };
      });
      await supabase
        .from("sorteo_config")
        .update({
          raspa_config: {
            ...raspa,
            _meta: {
              ...metaActual,
              _premios_meta: metaPremios,
            },
          },
        })
        .eq("id", 1);
    }
  } catch (syncErr) {
    console.warn("No se pudo sincronizar _premios_meta en sorteo_config:", syncErr);
  }
}

export async function deletePremio(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("aval_premios_meta");
      if (raw) {
        const meta = JSON.parse(raw);
        delete meta[id];
        localStorage.setItem("aval_premios_meta", JSON.stringify(meta));
      }
    } catch {}
  }
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

    const raspaData = (data.raspa_config as any) || {};
    const meta = raspaData._meta || {};

    let modDetectada: ModalidadVenta = "escalonado";
    if (data.modalidad_venta) {
      modDetectada = data.modalidad_venta as ModalidadVenta;
    } else if (meta.modalidadVenta) {
      modDetectada = meta.modalidadVenta as ModalidadVenta;
    } else if (data.nombre && data.nombre.includes("[MOD:multiplos_3]")) {
      modDetectada = "multiplos_3";
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

    const heroTituloFinal =
      (meta.heroTitulo !== undefined && meta.heroTitulo !== null && meta.heroTitulo !== "")
        ? meta.heroTitulo
        : (data.hero_titulo || extra.heroTitulo || SORTEO_DEFAULT.heroTitulo || "");

    const reglaPremiosFinal =
      meta.reglaPremios !== undefined
        ? meta.reglaPremios
        : (data.regla_premios !== undefined && data.regla_premios !== null ? data.regla_premios : (extra.reglaPremios ?? ""));

    const mostrarDinamicaFinal =
      meta.mostrarDinamica !== undefined
        ? meta.mostrarDinamica
        : (extra.mostrarDinamica !== undefined ? extra.mostrarDinamica : true);

    const horaSorteoFinal =
      (meta.horaSorteo !== undefined && meta.horaSorteo !== null && meta.horaSorteo !== "")
        ? meta.horaSorteo
        : (data.hora_sorteo || extra.horaSorteo || SORTEO_DEFAULT.horaSorteo || "19:30");

    return {
      nombre: nombreLimpio || SORTEO_DEFAULT.nombre,
      rangoMin: data.rango_min ?? SORTEO_DEFAULT.rangoMin,
      rangoMax: data.rango_max ?? SORTEO_DEFAULT.rangoMax,
      precioBase: precioBaseFinal,
      fecha: data.fecha ?? "",
      horaSorteo: horaSorteoFinal,
      modalidadVenta: modDetectada,
      heroTitulo: heroTituloFinal,
      reglaPremios: reglaPremiosFinal,
      mostrarDinamica: mostrarDinamicaFinal,
      detalleTitulo: data.detalle_titulo || extra.detalleTitulo || SORTEO_DEFAULT.detalleTitulo,
      detalleSubtitulo: data.detalle_subtitulo || extra.detalleSubtitulo || SORTEO_DEFAULT.detalleSubtitulo,
      detalleImagen: data.detalle_imagen || extra.detalleImagen || SORTEO_DEFAULT.detalleImagen,
      detalleFeatures: (data.detalle_features as FeatureDetalle[]) || extra.detalleFeatures || SORTEO_DEFAULT.detalleFeatures,
      detalleGarantia: data.detalle_garantia || extra.detalleGarantia || SORTEO_DEFAULT.detalleGarantia,
      ganadoresTestimonios: (data.ganadores_testimonios as TestimonioGanador[]) || SORTEO_DEFAULT.ganadoresTestimonios,
      faqs: (data.faqs as FaqItem[]) || SORTEO_DEFAULT.faqs,
      raspaConfig: (data.raspa_config as RaspaConfig) || extra.raspaConfig || SORTEO_DEFAULT.raspaConfig,
    };
  } catch {
    return {
      ...SORTEO_DEFAULT,
      precioBase: extra.precioBase ?? SORTEO_DEFAULT.precioBase,
      horaSorteo: extra.horaSorteo ?? SORTEO_DEFAULT.horaSorteo,
      modalidadVenta: extra.modalidadVenta ?? SORTEO_DEFAULT.modalidadVenta,
      heroTitulo: extra.heroTitulo || SORTEO_DEFAULT.heroTitulo || "",
      reglaPremios: extra.reglaPremios !== undefined ? extra.reglaPremios : (SORTEO_DEFAULT.reglaPremios || ""),
      mostrarDinamica: extra.mostrarDinamica !== undefined ? extra.mostrarDinamica : true,
      detalleTitulo: extra.detalleTitulo ?? SORTEO_DEFAULT.detalleTitulo,
      detalleSubtitulo: extra.detalleSubtitulo ?? SORTEO_DEFAULT.detalleSubtitulo,
      detalleImagen: extra.detalleImagen ?? SORTEO_DEFAULT.detalleImagen,
      detalleFeatures: extra.detalleFeatures ?? SORTEO_DEFAULT.detalleFeatures,
      detalleGarantia: extra.detalleGarantia ?? SORTEO_DEFAULT.detalleGarantia,
      raspaConfig: extra.raspaConfig ?? SORTEO_DEFAULT.raspaConfig,
    };
  }
}

export async function upsertSorteo(s: Sorteo): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("aval_sorteo_config_extra", JSON.stringify({
        precioBase: Number(s.precioBase) || 2500,
        horaSorteo: s.horaSorteo || "19:30",
        raspaConfig: s.raspaConfig,
        modalidadVenta: s.modalidadVenta,
        heroTitulo: s.heroTitulo,
        reglaPremios: s.reglaPremios,
        mostrarDinamica: s.mostrarDinamica !== false,
        detalleTitulo: s.detalleTitulo,
        detalleSubtitulo: s.detalleSubtitulo,
        detalleImagen: s.detalleImagen,
        detalleFeatures: s.detalleFeatures,
        detalleGarantia: s.detalleGarantia,
      }));
    } catch {}
  }

  // Traer _meta previo de Supabase para preservar otros datos guardados
  let metaExistente: any = {};
  try {
    const { data: sorteoActual } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .single();
    if (sorteoActual?.raspa_config?._meta) {
      metaExistente = sorteoActual.raspa_config._meta;
    }
  } catch {}

  const metaCombinado = {
    ...metaExistente,
    ...((s.raspaConfig as any)?._meta || {}),
    _premios_meta: metaExistente._premios_meta || ((s.raspaConfig as any)?._meta?._premios_meta),
    _siteConfig: metaExistente._siteConfig || ((s.raspaConfig as any)?._meta?._siteConfig),
    horaSorteo: s.horaSorteo || "19:30",
    heroTitulo: s.heroTitulo ?? "",
    reglaPremios: s.reglaPremios ?? "",
    mostrarDinamica: s.mostrarDinamica !== false,
    modalidadVenta: s.modalidadVenta || "escalonado",
  };

  const raspaFinal = {
    ...(s.raspaConfig || {}),
    _meta: metaCombinado,
  };

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
    detalle_features: s.detalleFeatures,
    detalle_garantia: s.detalleGarantia,
    ganadores_testimonios: s.ganadoresTestimonios,
    faqs: s.faqs,
    raspa_config: raspaFinal,
  };

  const { error } = await supabase.from("sorteo_config").upsert(upsertData);
  if (error) {
    console.error("Error al guardar sorteo_config en Supabase:", error);
    throw new Error(error.message);
  }
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

    if (!extra || Object.keys(extra).length === 0) {
      try {
        const { data: sorteoRow } = await supabase
          .from("sorteo_config")
          .select("raspa_config")
          .eq("id", 1)
          .single();
        if (sorteoRow?.raspa_config?._meta?._siteConfig) {
          extra = sorteoRow.raspa_config._meta._siteConfig;
        }
      } catch {}
    }

    if (extra && (extra.termometroMetaTokens === 5000 || !extra.termometroMetaTokens || extra.termometroMetaTokens < 10000)) {
      extra.termometroMetaTokens = 100000;
      try {
        localStorage.setItem("aval_site_config_extra", JSON.stringify(extra));
      } catch {}
    }

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
      horaSorteoMartesViernes: extra.horaSorteoMartesViernes || CONFIG_DEFAULT.horaSorteoMartesViernes,
      horaSorteoDomingos: extra.horaSorteoDomingos || CONFIG_DEFAULT.horaSorteoDomingos,
      horasCierrePrevio: extra.horasCierrePrevio !== undefined ? Number(extra.horasCierrePrevio) : CONFIG_DEFAULT.horasCierrePrevio,
      promoTitulo: extra.promoTitulo || CONFIG_DEFAULT.promoTitulo,
      promoSubtitulo: extra.promoSubtitulo || CONFIG_DEFAULT.promoSubtitulo,
      promoBotonTexto: extra.promoBotonTexto || CONFIG_DEFAULT.promoBotonTexto,
      promoWhatsapp: promoWa,
      referidosActivo: extra.referidosActivo ?? CONFIG_DEFAULT.referidosActivo,
      referidosDarTokensBono: extra.referidosDarTokensBono ?? CONFIG_DEFAULT.referidosDarTokensBono,
      referidosPremioSiGana: extra.referidosPremioSiGana || CONFIG_DEFAULT.referidosPremioSiGana,
      referidosPremioPrimero: extra.referidosPremioPrimero || extra.referidosPremioSiGana || CONFIG_DEFAULT.referidosPremioPrimero,
      referidosPremioSegundo: extra.referidosPremioSegundo || CONFIG_DEFAULT.referidosPremioSegundo,
      referidosPremioTercero: extra.referidosPremioTercero || CONFIG_DEFAULT.referidosPremioTercero,
      referidosPromoLandingActivo: extra.referidosPromoLandingActivo ?? CONFIG_DEFAULT.referidosPromoLandingActivo,
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
      miniSorteosActivo: extra.miniSorteosActivo ?? CONFIG_DEFAULT.miniSorteosActivo,
      miniSorteoDia: extra.miniSorteoDia ?? CONFIG_DEFAULT.miniSorteoDia,
      miniSorteoTitulo: extra.miniSorteoTitulo || CONFIG_DEFAULT.miniSorteoTitulo,
      miniSorteoFecha: extra.miniSorteoFecha || CONFIG_DEFAULT.miniSorteoFecha,
      miniSorteoPremio: extra.miniSorteoPremio || CONFIG_DEFAULT.miniSorteoPremio,
      pwaBannerActivo: extra.pwaBannerActivo ?? CONFIG_DEFAULT.pwaBannerActivo,
      termometroFaseTitulo: extra.termometroFaseTitulo || data.termometro_fase_titulo || CONFIG_DEFAULT.termometroFaseTitulo,
      termometroMetaTokens: extra.termometroMetaTokens ?? data.termometro_meta_tokens ?? CONFIG_DEFAULT.termometroMetaTokens,
      termometroPorcentajeManual: extra.termometroPorcentajeManual ?? data.termometro_porcentaje_manual ?? CONFIG_DEFAULT.termometroPorcentajeManual,
      supertokenActivo: extra.supertokenActivo ?? CONFIG_DEFAULT.supertokenActivo,
      supertokenPrecio: extra.supertokenPrecio ?? CONFIG_DEFAULT.supertokenPrecio,
      supertokenMoneda: extra.supertokenMoneda || (Number(extra.supertokenPremioPrimeroUsd ?? CONFIG_DEFAULT.supertokenPremioPrimeroUsd) > 50000 ? "CRC" : "CRC"),
      supertokenPremioUsd: extra.supertokenPremioPrimeroUsd ?? extra.supertokenPremioUsd ?? CONFIG_DEFAULT.supertokenPremioPrimeroUsd,
      supertokenPremioPrimeroUsd: extra.supertokenPremioPrimeroUsd ?? extra.supertokenPremioUsd ?? CONFIG_DEFAULT.supertokenPremioPrimeroUsd,
      supertokenPremioSegundoUsd: extra.supertokenPremioSegundoUsd ?? CONFIG_DEFAULT.supertokenPremioSegundoUsd,
      supertokenPremioTerceroUsd: extra.supertokenPremioTerceroUsd ?? CONFIG_DEFAULT.supertokenPremioTerceroUsd,
      aiActivo: extra.aiActivo ?? CONFIG_DEFAULT.aiActivo,
      aiProveedor: extra.aiProveedor || CONFIG_DEFAULT.aiProveedor,
      aiOpenaiKey: extra.aiOpenaiKey || CONFIG_DEFAULT.aiOpenaiKey,
      aiOpenaiModel: extra.aiOpenaiModel || CONFIG_DEFAULT.aiOpenaiModel,
      aiGeminiKey: extra.aiGeminiKey || CONFIG_DEFAULT.aiGeminiKey,
      aiGeminiModel: extra.aiGeminiModel || CONFIG_DEFAULT.aiGeminiModel,
      aiDeepseekKey: extra.aiDeepseekKey || CONFIG_DEFAULT.aiDeepseekKey,
      aiDeepseekModel: extra.aiDeepseekModel || CONFIG_DEFAULT.aiDeepseekModel,
      aiClaudeKey: extra.aiClaudeKey || CONFIG_DEFAULT.aiClaudeKey,
      aiClaudeModel: extra.aiClaudeModel || CONFIG_DEFAULT.aiClaudeModel,
      aiNombre: extra.aiNombre || CONFIG_DEFAULT.aiNombre,
      aiSaludo: extra.aiSaludo || CONFIG_DEFAULT.aiSaludo,
      aiSystemPrompt: extra.aiSystemPrompt || CONFIG_DEFAULT.aiSystemPrompt,
      legalTerminosTexto: extra.legalTerminosTexto || "",
      legalPrivacidadTexto: extra.legalPrivacidadTexto || "",
      legalReembolsoTexto: extra.legalReembolsoTexto || "",
      legalMinutaNotarialTexto: extra.legalMinutaNotarialTexto || "",
      // Textos dinámicos
      heroBadgeEvento: extra.heroBadgeEvento !== undefined ? extra.heroBadgeEvento : CONFIG_DEFAULT.heroBadgeEvento,
      heroBadgePopular: extra.heroBadgePopular !== undefined ? extra.heroBadgePopular : CONFIG_DEFAULT.heroBadgePopular,
      heroBadgeSuperToken: extra.heroBadgeSuperToken !== undefined ? extra.heroBadgeSuperToken : CONFIG_DEFAULT.heroBadgeSuperToken,
      heroBadgeGasolina: extra.heroBadgeGasolina !== undefined ? extra.heroBadgeGasolina : CONFIG_DEFAULT.heroBadgeGasolina,
      heroBadgeComercios: extra.heroBadgeComercios !== undefined ? extra.heroBadgeComercios : CONFIG_DEFAULT.heroBadgeComercios,
      mostrarBadgeSorteo: extra.mostrarBadgeSorteo !== undefined ? extra.mostrarBadgeSorteo : CONFIG_DEFAULT.mostrarBadgeSorteo,
      mostrarBadgePopular: extra.mostrarBadgePopular !== undefined ? extra.mostrarBadgePopular : CONFIG_DEFAULT.mostrarBadgePopular,
      mostrarBadgeJPS: extra.mostrarBadgeJPS !== undefined ? extra.mostrarBadgeJPS : CONFIG_DEFAULT.mostrarBadgeJPS,
      mostrarBarraNotificacion: extra.mostrarBarraNotificacion !== undefined ? extra.mostrarBarraNotificacion : CONFIG_DEFAULT.mostrarBarraNotificacion,
      mostrarNavegacion: extra.mostrarNavegacion !== undefined ? extra.mostrarNavegacion : CONFIG_DEFAULT.mostrarNavegacion,
      mostrarSeccionTermometro: extra.mostrarSeccionTermometro !== undefined ? extra.mostrarSeccionTermometro : CONFIG_DEFAULT.mostrarSeccionTermometro,
      mostrarSeccionPaquetes: extra.mostrarSeccionPaquetes !== undefined ? extra.mostrarSeccionPaquetes : CONFIG_DEFAULT.mostrarSeccionPaquetes,
      mostrarCtaHero: extra.mostrarCtaHero !== undefined ? extra.mostrarCtaHero : CONFIG_DEFAULT.mostrarCtaHero,
      mostrarSeccionAperturaPremios: extra.mostrarSeccionAperturaPremios !== undefined ? extra.mostrarSeccionAperturaPremios : CONFIG_DEFAULT.mostrarSeccionAperturaPremios,
      modoVistaPremios: extra.modoVistaPremios !== undefined ? extra.modoVistaPremios : CONFIG_DEFAULT.modoVistaPremios,
      podio1Ceja: extra.podio1Ceja !== undefined ? extra.podio1Ceja : CONFIG_DEFAULT.podio1Ceja,
      podio1Titulo: extra.podio1Titulo !== undefined ? extra.podio1Titulo : CONFIG_DEFAULT.podio1Titulo,
      podio1Badge: extra.podio1Badge !== undefined ? extra.podio1Badge : CONFIG_DEFAULT.podio1Badge,
      podio2Ceja: extra.podio2Ceja !== undefined ? extra.podio2Ceja : CONFIG_DEFAULT.podio2Ceja,
      podio2Titulo: extra.podio2Titulo !== undefined ? extra.podio2Titulo : CONFIG_DEFAULT.podio2Titulo,
      podio2Badge: extra.podio2Badge !== undefined ? extra.podio2Badge : CONFIG_DEFAULT.podio2Badge,
      mostrarSeccionComoFunciona: extra.mostrarSeccionComoFunciona !== undefined ? extra.mostrarSeccionComoFunciona : CONFIG_DEFAULT.mostrarSeccionComoFunciona,
      mostrarSeccionSuscripcion: extra.mostrarSeccionSuscripcion !== undefined ? extra.mostrarSeccionSuscripcion : CONFIG_DEFAULT.mostrarSeccionSuscripcion,
      suscripcionBadge: extra.suscripcionBadge !== undefined ? extra.suscripcionBadge : CONFIG_DEFAULT.suscripcionBadge,
      suscripcionTitulo: extra.suscripcionTitulo !== undefined ? extra.suscripcionTitulo : CONFIG_DEFAULT.suscripcionTitulo,
      suscripcionTexto: extra.suscripcionTexto !== undefined ? extra.suscripcionTexto : CONFIG_DEFAULT.suscripcionTexto,
      suscripcionBotonTexto: extra.suscripcionBotonTexto !== undefined ? extra.suscripcionBotonTexto : CONFIG_DEFAULT.suscripcionBotonTexto,
      mostrarSeccionDetallePremios: extra.mostrarSeccionDetallePremios !== undefined ? extra.mostrarSeccionDetallePremios : CONFIG_DEFAULT.mostrarSeccionDetallePremios,
      mostrarSeccionReferidos: extra.mostrarSeccionReferidos !== undefined ? extra.mostrarSeccionReferidos : CONFIG_DEFAULT.mostrarSeccionReferidos,
      mostrarSeccionSponsors: extra.mostrarSeccionSponsors !== undefined ? extra.mostrarSeccionSponsors : CONFIG_DEFAULT.mostrarSeccionSponsors,
      mostrarSeccionMiniSorteos: extra.mostrarSeccionMiniSorteos !== undefined ? extra.mostrarSeccionMiniSorteos : CONFIG_DEFAULT.mostrarSeccionMiniSorteos,
      mostrarSeccionGanadores: extra.mostrarSeccionGanadores !== undefined ? extra.mostrarSeccionGanadores : CONFIG_DEFAULT.mostrarSeccionGanadores,
      mostrarSeccionFaqs: extra.mostrarSeccionFaqs !== undefined ? extra.mostrarSeccionFaqs : CONFIG_DEFAULT.mostrarSeccionFaqs,
      mostrarSalaRemates: extra.mostrarSalaRemates !== undefined ? extra.mostrarSalaRemates : CONFIG_DEFAULT.mostrarSalaRemates,
      heroSubtitulo:
        extra.heroSubtitulo !== undefined &&
        !extra.heroSubtitulo.startsWith("La plataforma de eventos promocionales digitales más transparente")
          ? extra.heroSubtitulo
          : CONFIG_DEFAULT.heroSubtitulo,
      heroBotonCta: extra.heroBotonCta !== undefined ? extra.heroBotonCta : CONFIG_DEFAULT.heroBotonCta,
      heroBotonSecundario: extra.heroBotonSecundario !== undefined ? extra.heroBotonSecundario : CONFIG_DEFAULT.heroBotonSecundario,
      heroMicroPrueba1: extra.heroMicroPrueba1 !== undefined ? extra.heroMicroPrueba1 : CONFIG_DEFAULT.heroMicroPrueba1,
      heroMicroPrueba2: extra.heroMicroPrueba2 !== undefined ? extra.heroMicroPrueba2 : CONFIG_DEFAULT.heroMicroPrueba2,
      vitrinaBadgeKm: extra.vitrinaBadgeKm !== undefined ? extra.vitrinaBadgeKm : CONFIG_DEFAULT.vitrinaBadgeKm,
      vitrinaBadgeSuperToken: extra.vitrinaBadgeSuperToken !== undefined ? extra.vitrinaBadgeSuperToken : CONFIG_DEFAULT.vitrinaBadgeSuperToken,
      vitrinaBadgeTraspaso: extra.vitrinaBadgeTraspaso !== undefined ? extra.vitrinaBadgeTraspaso : CONFIG_DEFAULT.vitrinaBadgeTraspaso,
      vitrinaBotonAmpliar: extra.vitrinaBotonAmpliar !== undefined ? extra.vitrinaBotonAmpliar : CONFIG_DEFAULT.vitrinaBotonAmpliar,
      pasosBadge: extra.pasosBadge !== undefined ? extra.pasosBadge : CONFIG_DEFAULT.pasosBadge,
      pasosTitulo: extra.pasosTitulo !== undefined ? extra.pasosTitulo : CONFIG_DEFAULT.pasosTitulo,
      pasosSubtitulo: extra.pasosSubtitulo !== undefined ? extra.pasosSubtitulo : CONFIG_DEFAULT.pasosSubtitulo,
      pasosPaso1Titulo: extra.pasosPaso1Titulo !== undefined ? extra.pasosPaso1Titulo : CONFIG_DEFAULT.pasosPaso1Titulo,
      pasosPaso1Desc: extra.pasosPaso1Desc !== undefined ? extra.pasosPaso1Desc : CONFIG_DEFAULT.pasosPaso1Desc,
      pasosPaso2Titulo: extra.pasosPaso2Titulo !== undefined ? extra.pasosPaso2Titulo : CONFIG_DEFAULT.pasosPaso2Titulo,
      pasosPaso2Desc: extra.pasosPaso2Desc !== undefined ? extra.pasosPaso2Desc : CONFIG_DEFAULT.pasosPaso2Desc,
      pasosPaso3Titulo: extra.pasosPaso3Titulo !== undefined ? extra.pasosPaso3Titulo : CONFIG_DEFAULT.pasosPaso3Titulo,
      pasosPaso3Desc: extra.pasosPaso3Desc !== undefined ? extra.pasosPaso3Desc : CONFIG_DEFAULT.pasosPaso3Desc,
      pasosBotonCta: extra.pasosBotonCta !== undefined ? extra.pasosBotonCta : CONFIG_DEFAULT.pasosBotonCta,
      miniSorteoTituloPrincipal: extra.miniSorteoTituloPrincipal !== undefined ? extra.miniSorteoTituloPrincipal : CONFIG_DEFAULT.miniSorteoTituloPrincipal,
      miniSorteoSubtituloPrincipal: extra.miniSorteoSubtituloPrincipal !== undefined ? extra.miniSorteoSubtituloPrincipal : CONFIG_DEFAULT.miniSorteoSubtituloPrincipal,
      miniSorteoViernesBadge: extra.miniSorteoViernesBadge !== undefined ? extra.miniSorteoViernesBadge : CONFIG_DEFAULT.miniSorteoViernesBadge,
      miniSorteoViernesTitulo: extra.miniSorteoViernesTitulo !== undefined ? extra.miniSorteoViernesTitulo : CONFIG_DEFAULT.miniSorteoViernesTitulo,
      miniSorteoViernesPremio: extra.miniSorteoViernesPremio !== undefined ? extra.miniSorteoViernesPremio : CONFIG_DEFAULT.miniSorteoViernesPremio,
      miniSorteoViernesDesc: extra.miniSorteoViernesDesc !== undefined ? extra.miniSorteoViernesDesc : CONFIG_DEFAULT.miniSorteoViernesDesc,
      miniSorteoViernesAuditoria: extra.miniSorteoViernesAuditoria !== undefined ? extra.miniSorteoViernesAuditoria : CONFIG_DEFAULT.miniSorteoViernesAuditoria,
      miniSorteoDomingosBadge: extra.miniSorteoDomingosBadge !== undefined ? extra.miniSorteoDomingosBadge : CONFIG_DEFAULT.miniSorteoDomingosBadge,
      miniSorteoDomingosTitulo: extra.miniSorteoDomingosTitulo !== undefined ? extra.miniSorteoDomingosTitulo : CONFIG_DEFAULT.miniSorteoDomingosTitulo,
      miniSorteoDomingosPremio: extra.miniSorteoDomingosPremio !== undefined ? extra.miniSorteoDomingosPremio : CONFIG_DEFAULT.miniSorteoDomingosPremio,
      miniSorteoDomingosDesc: extra.miniSorteoDomingosDesc !== undefined ? extra.miniSorteoDomingosDesc : CONFIG_DEFAULT.miniSorteoDomingosDesc,
      miniSorteoDomingosAuditoria: extra.miniSorteoDomingosAuditoria !== undefined ? extra.miniSorteoDomingosAuditoria : CONFIG_DEFAULT.miniSorteoDomingosAuditoria,
      miniSorteosGarantia1Titulo: extra.miniSorteosGarantia1Titulo !== undefined ? extra.miniSorteosGarantia1Titulo : CONFIG_DEFAULT.miniSorteosGarantia1Titulo,
      miniSorteosGarantia1Desc: extra.miniSorteosGarantia1Desc !== undefined ? extra.miniSorteosGarantia1Desc : CONFIG_DEFAULT.miniSorteosGarantia1Desc,
      miniSorteosGarantia2Titulo: extra.miniSorteosGarantia2Titulo !== undefined ? extra.miniSorteosGarantia2Titulo : CONFIG_DEFAULT.miniSorteosGarantia2Titulo,
      miniSorteosGarantia2Desc: extra.miniSorteosGarantia2Desc !== undefined ? extra.miniSorteosGarantia2Desc : CONFIG_DEFAULT.miniSorteosGarantia2Desc,
      miniSorteosGarantia3Titulo: extra.miniSorteosGarantia3Titulo !== undefined ? extra.miniSorteosGarantia3Titulo : CONFIG_DEFAULT.miniSorteosGarantia3Titulo,
      miniSorteosGarantia3Desc: extra.miniSorteosGarantia3Desc !== undefined ? extra.miniSorteosGarantia3Desc : CONFIG_DEFAULT.miniSorteosGarantia3Desc,
      paquetesBadge: extra.paquetesBadge !== undefined ? extra.paquetesBadge : CONFIG_DEFAULT.paquetesBadge,
      paquetesTitulo: extra.paquetesTitulo !== undefined ? extra.paquetesTitulo : CONFIG_DEFAULT.paquetesTitulo,
      paquetesSubtitulo: extra.paquetesSubtitulo !== undefined ? extra.paquetesSubtitulo : CONFIG_DEFAULT.paquetesSubtitulo,
      paquetesTokensLabel: extra.paquetesTokensLabel !== undefined ? extra.paquetesTokensLabel : CONFIG_DEFAULT.paquetesTokensLabel,
      paquetesBotonComprar: extra.paquetesBotonComprar !== undefined ? extra.paquetesBotonComprar : CONFIG_DEFAULT.paquetesBotonComprar,
      paqueteTagPopular: extra.paqueteTagPopular !== undefined ? extra.paqueteTagPopular : CONFIG_DEFAULT.paqueteTagPopular,
      paqueteTagBest: extra.paqueteTagBest !== undefined ? extra.paqueteTagBest : CONFIG_DEFAULT.paqueteTagBest,
      footerMostrarColumnaPlataforma: extra.footerMostrarColumnaPlataforma !== undefined ? extra.footerMostrarColumnaPlataforma : CONFIG_DEFAULT.footerMostrarColumnaPlataforma,
      footerMostrarImpactoSocial: extra.footerMostrarImpactoSocial !== undefined ? extra.footerMostrarImpactoSocial : CONFIG_DEFAULT.footerMostrarImpactoSocial,
      footerMostrarReferidos: extra.footerMostrarReferidos !== undefined ? extra.footerMostrarReferidos : CONFIG_DEFAULT.footerMostrarReferidos,
      footerMostrarComercios: extra.footerMostrarComercios !== undefined ? extra.footerMostrarComercios : CONFIG_DEFAULT.footerMostrarComercios,
      footerMostrarComerciosEnlace: extra.footerMostrarComerciosEnlace !== undefined ? extra.footerMostrarComerciosEnlace : CONFIG_DEFAULT.footerMostrarComerciosEnlace,
      footerMostrarAccesoAdmin: extra.footerMostrarAccesoAdmin !== undefined ? extra.footerMostrarAccesoAdmin : CONFIG_DEFAULT.footerMostrarAccesoAdmin,
      footerMostrarThemeToggle: extra.footerMostrarThemeToggle !== undefined ? extra.footerMostrarThemeToggle : CONFIG_DEFAULT.footerMostrarThemeToggle,
      footerMostrarLegal: extra.footerMostrarLegal !== undefined ? extra.footerMostrarLegal : CONFIG_DEFAULT.footerMostrarLegal,
      footerMostrarWhatsApp: extra.footerMostrarWhatsApp !== undefined ? extra.footerMostrarWhatsApp : CONFIG_DEFAULT.footerMostrarWhatsApp,
    };
  } catch {
    return CONFIG_DEFAULT;
  }
}

export async function upsertConfig(c: Config): Promise<void> {
  // Guardar en localStorage para disponibilidad inmediata y textos promocionales
  try {
    localStorage.setItem("aval_site_config_extra", JSON.stringify({
      ...c,
      horaSorteoMartesViernes: c.horaSorteoMartesViernes || "19:30",
      horaSorteoDomingos: c.horaSorteoDomingos || "19:30",
      horasCierrePrevio: c.horasCierrePrevio !== undefined ? Number(c.horasCierrePrevio) : 2,
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

  // Guardar extras de config en raspa_config._meta._siteConfig para SSR y sincronización entre dispositivos
  try {
    const { data: sorteoActual } = await supabase
      .from("sorteo_config")
      .select("raspa_config")
      .eq("id", 1)
      .single();
    const currentRaspa = (sorteoActual?.raspa_config as any) || {};
    const updatedRaspa = {
      ...currentRaspa,
      _meta: {
        ...(currentRaspa._meta || {}),
        _siteConfig: {
          ...(currentRaspa._meta?._siteConfig || {}),
          ...c,
        },
      },
    };
    await supabase.from("sorteo_config").update({ raspa_config: updatedRaspa }).eq("id", 1);
  } catch (err) {
    console.warn("No se pudo guardar _siteConfig en Supabase:", err);
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
