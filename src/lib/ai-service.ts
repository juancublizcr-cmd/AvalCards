import type { Config } from "./admin-store";

export type AiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Detección de consultas técnicas o sobre el desarrollo interno de la app
export function esConsultaTecnicaInterna(q: string): boolean {
  const query = q.toLowerCase();
  const terminosTecnicos = [
    "código", "codigo", "programad", "programaste", "programó", "programo",
    "lenguaje", "react", "github", "tecnolog", "backend", "frontend",
    "supabase", "base de datos", "sql", "prompt", "cómo está hecha", "como esta hecha",
    "cómo fue hecha", "como fue hecha", "cómo funciona el código", "como funciona el codigo",
    "arquitectura", "stack", "framework", "node", "vite", "javascript", "typescript",
    "servidor", "api key", "apikey", "credenciales", "quién te creó", "quien te creo"
  ];
  return terminosTecnicos.some((t) => query.includes(t));
}

export const RESPUESTA_SOLO_VENTAS =
  "¡Pura vida! Mi función es exclusivamente comercial: asesorarte en la compra de tus tokens y en tu participación por la Toyota Prado 2026 0KM y grandes premios en Aval Community CR. 🚗💨\n\n¡Mira! ¿Sabías que con tus tokens te ganas gasolina todos los viernes con el **Viernes de Tanque Lleno (₡50,000 en combustible)** y que con el **SuperToken** te llevas **$6,000 USD cash extra**?\n\n¿Te gustaría ver las opciones de compra disponibles o cómo pagar fácilmente por SINPE Móvil o Tarjeta en el [Checkout de Compra](/checkout)?";

// Respuestas inteligentes offline/fallback con conocimiento 100% completo de la plataforma
export function obtenerRespuestaFallback(consulta: string, config: Config): string {
  const q = consulta.toLowerCase();
  const telSinpe = config.telefonoSinpe || "8634-4772";
  const razonSocial = config.razonSocial || "Importadora Luxury Scents LTDA.";
  const promoWa = config.promoWhatsapp || "50686344772";

  if (esConsultaTecnicaInterna(q)) {
    return RESPUESTA_SOLO_VENTAS;
  }

  // 1. MINI-SORTEOS: VIERNES DE TANQUE LLENO (GASOLINA)
  const esPreguntaTanqueLleno =
    q.includes("tanque") ||
    q.includes("gasolina") ||
    q.includes("combustible") ||
    q.includes("viernes") ||
    q.includes("calentamiento") ||
    q.includes("mini sorteo") ||
    q.includes("mini-sorteo") ||
    q.includes("semanal");

  if (esPreguntaTanqueLleno) {
    return `⛽ **¡Viernes de Tanque Lleno (₡50,000 en Combustible)!**\n\n` +
      `¡No tienes que esperar meses para empezar a ganar! Todos los viernes rifamos premios semanales entre todos los participantes activos:\n\n` +
      `• ⛽ **Premio Semanal**: ₡50,000 en Gasolina Delta / Uno o su equivalente en SINPE Móvil inmediato.\n` +
      `• 🎟️ **100% Automático**: ¡Todos los tokens que compres para los sorteos oficiales entran automáticamente a las rifas de todos los viernes sin pagar nada extra!\n` +
      `• 📲 **Notificación Directa**: Los números ganadores se publican en la web y se avisa directamente por WhatsApp con comprobante de depósito SINPE.\n` +
      `• 🚗 **¡Y lo mejor de todo!** Tus tokens siguen participando intactos para la **Toyota Prado 2026 0KM** y todos los premios principales incluso si ganas este viernes.\n\n` +
      `🔥 *¿Y sabes de los **SuperTokens**? Por solo ₡1,500 extra, si te pegas la Prado, ¡te llevas **$6,000 USD en efectivo CASH** de una vez!*\n\n` +
      `¿Apartamos tus números de la suerte para que entres a jugar este mismo viernes? [Asegurar mis Tokens en Checkout](/checkout)`;
  }

  // 2. FORMAS DE PAGO / OTRAS FORMAS / MÉTODOS DE PAGO / TARJETAS / PAYPAL / APPLE PAY / GOOGLE PAY / CRIPTO
  const esPreguntaFormasPago =
    (q.includes("otra") && (q.includes("pago") || q.includes("forma") || q.includes("metodo") || q.includes("método"))) ||
    q.includes("formas de pago") ||
    q.includes("metodos de pago") ||
    q.includes("métodos de pago") ||
    q.includes("opciones de pago") ||
    q.includes("cómo pagar") ||
    q.includes("como pagar") ||
    q.includes("tarjeta") ||
    q.includes("credito") ||
    q.includes("crédito") ||
    q.includes("debito") ||
    q.includes("débito") ||
    q.includes("tilopay") ||
    q.includes("paypal") ||
    q.includes("apple") ||
    q.includes("google pay") ||
    q.includes("googlepay") ||
    q.includes("crypto") ||
    q.includes("cripto") ||
    q.includes("usdt") ||
    q.includes("binance");

  if (esPreguntaFormasPago) {
    return `💳 **Métodos de Pago Oficiales en Aval Community CR:**\n\n` +
      `¡Tienes **6 formas de pago rápidas y 100% seguras** para que no te quedes sin tus números!\n\n` +
      `1. 📱 **SINPE Móvil Oficial (Costa Rica)**: Transfiere directo al **${telSinpe}** a nombre de **${razonSocial}**. Adjuntas tu comprobante en el Checkout y tus números quedan reservados.\n` +
      `2. 💳 **Tarjetas de Débito y Crédito (Visa / Mastercard vía TiloPay)**: ¡Aprobación Inmediata! Tus tokens se validan automáticamente al segundo sin esperar revisión manual.\n` +
      `3. 🍏 **Apple Pay**: Pago en 1 solo toque desde tu iPhone, Apple Watch o Mac con Face ID / Touch ID.\n` +
      `4. 🌐 **Google Pay**: Pago express y ultra seguro con 1 clic desde tu dispositivo Android o navegador Chrome.\n` +
      `5. 🅿️ **PayPal**: Aceptamos pagos internacionales con tu saldo PayPal o tarjetas internacionales en dólares (USD).\n` +
      `6. 🪙 **Criptomonedas (USDT)**: Puedes pagar en USDT (red TRC20 / BEP20) o directamente por Binance Pay ID.\n\n` +
      `🔥 *¡Mira! Al comprar tus tokens te ganas gasolina todos los viernes con el **Viernes de Tanque Lleno (₡50,000)** y además puedes activar el **SuperToken** para ganar **$6,000 USD cash extra**.*\n\n` +
      `¿Cuál método te queda más cómodo para apartar tus números de la suerte hoy en el [Checkout de Compra](/checkout)?`;
  }

  // 3. PAQUETES / LOTES DE TOKENS / TICKETS / PRECIOS / CUÁNTO CUESTA
  const esPreguntaPaquetes =
    q.includes("paquete") ||
    q.includes("lote") ||
    q.includes("ticket") ||
    q.includes("boleto") ||
    q.includes("cuanto cuesta") ||
    q.includes("cuánto cuesta") ||
    q.includes("cuanto vale") ||
    q.includes("cuánto vale") ||
    q.includes("precio") ||
    q.includes("costo") ||
    q.includes("inversión") ||
    q.includes("inversion") ||
    q.includes("cuantos tokens") ||
    q.includes("cuántos tokens");

  if (esPreguntaPaquetes) {
    return `🎟️ **Lotes y Paquetes de Tokens Disponibles:**\n\n` +
      `Elige tu paquete digital para competir por la **Toyota Prado 2026 0KM**:\n\n` +
      `• 🎟️ **Paquete Básico (4 Tokens) · ₡4,000**: 4 oportunidades para asegurar tus números favoritos.\n` +
      `• 🔥 **Paquete Popular (8 Tokens) · ₡8,000**: ¡El favorito de la comunidad! Multiplica tus oportunidades x8 por solo ₡8 mil.\n` +
      `• ⚡ **Paquete Pro (12 Tokens) · ₡12,000**: Mayor probabilidad de ganar el sorteo mayor y más giros de regalo para premios express.\n` +
      `• 👑 **Paquete VIP Ganador (24 Tokens) · ₡24,000**: ¡Máxima probabilidad! 24 combinaciones para asegurar tu premio soñado.\n\n` +
      `*(En cada paquete puedes escribir tus propios números de 5 dígitos favoritos del 00000 al 99999 o generarlos al azar).*\n\n` +
      `🔥 *¡Mira! Todos los paquetes entran automáticamente a los **Viernes de Tanque Lleno** (₡50,000 de gasolina semanal). ¿Y ya sabes de los **SuperTokens**? Por solo ₡1,500 sumas **$6,000 USD en efectivo extra** si ganas el 1° lugar.*\n\n` +
      `¿Te gustaría apartar el Paquete Popular de 8 tokens o prefieres el de 12 para tener aún más oportunidades? [Elegir mi Paquete en Checkout](/checkout)`;
  }

  // 4. SUPERTOKEN
  const esPreguntaSuperToken =
    q.includes("supertoken") ||
    q.includes("super token") ||
    q.includes("super-token") ||
    q.includes("dolares") ||
    q.includes("dólares") ||
    q.includes("6000") ||
    q.includes("6,000") ||
    q.includes("cash");

  if (esPreguntaSuperToken) {
    return `👑 **¿Sabes de los SuperTokens? ¡Es el beneficio estrella de Aval Community CR!**\n\n` +
      `El **SuperToken** es un multiplicador de premio opcional y exclusivo que puedes activar en tu orden al momento de pagar por tan solo **₡1,500 adicionales**.\n\n` +
      `🔥 **El Gran Beneficio:**\n` +
      `Si tu número resulta favorecido con el 1° Lugar (Premio Mayor), ¡no solo te llevas la espectacular **Toyota Prado 2026 0KM** con marchamo y traspaso pagos, sino que además te entregamos **¡$6,000 USD en efectivo CASH extra!** 💵🎉\n\n` +
      `¡Por solo ₡1,500 te aseguras salir en nave del año y con la bolsa llena de dólares! Además, tus números participan todos los viernes por ₡50,000 en gasolina con el **Viernes de Tanque Lleno**.\n\n` +
      `¿Te gustaría activar tu SuperToken hoy al apartar tus números? [Apartar Tokens con SuperToken en Checkout](/checkout)`;
  }

  // 5. QUÉ RIFAN / QUÉ SE GANA / PREMIOS
  const esPreguntaPremios =
    q.includes("rifan") ||
    q.includes("rifa") ||
    q.includes("premio") ||
    q.includes("que se gana") ||
    q.includes("qué se gana") ||
    q.includes("prado") ||
    q.includes("carro") ||
    q.includes("auto") ||
    q.includes("vehiculo") ||
    q.includes("vehículo") ||
    q.includes("moto") ||
    q.includes("yamaha") ||
    q.includes("playstation") ||
    q.includes("ps5");

  if (esPreguntaPremios) {
    return `🚗 **Premios Oficiales de Aval Community CR:**\n\n` +
      `¡Nuestra edición actual está cargada de premios de ensueño!\n\n` +
      `1. 🏆 **Premio Mayor (1° Lugar)**: Espectacular **Toyota Prado 2026 0KM**, motor turbo diésel 2.8L, 4x4 real, full extras, asientos de cuero y pantalla táctil. *(¡Con Traspaso Notarial y Marchamo 100% PAGOS por la empresa, sacada de agencia sin costos ocultos!)*.\n` +
      `2. 🏍️ **Segundo Premio (2° Lugar)**: Motocicleta de alta cilindrada 0KM (Yamaha MT) lista para estrenar.\n` +
      `3. 🎮 / 💵 **Tercer Premio (3° Lugar)**: Consola PlayStation 5 de última generación o ₡1,000,000 en efectivo por SINPE Móvil.\n` +
      `4. ⛽ **Viernes de Tanque Lleno**: ₡50,000 en combustible todos los viernes entre todos los participantes activos.\n` +
      `5. 🎰 **Entregas Instantáneas**: Giros gratis en el Raspa & Gana Express o Ruleta de la Suerte para premios instantáneos de hasta ₡100,000 por SINPE.\n\n` +
      `🔥 *¿Y sabes de los **SuperTokens**? Por solo ₡1,500 extra sumas **$6,000 USD cash de una vez** al ganar la Prado.*\n\n` +
      `¿Te imaginas andar estrenando esa Prado 2026? Vamos a apartar tus números de la suerte hoy: [Ir al Checkout de Compra](/checkout)`;
  }

  // 6. QUÉ HAGO DESPUÉS DE PAGAR
  const esPreguntaDespuesPago =
    (q.includes("despues") || q.includes("después")) && (q.includes("pago") || q.includes("pagar"));

  if (esPreguntaDespuesPago) {
    return `✅ **¿Qué hago después de realizar el pago?**\n\n` +
      `• **Si pagas con Tarjeta de Débito/Crédito**: Tu orden se valida al instante de forma 100% automática. ¡Tus tokens quedan listos en el sistema en segundos!\n` +
      `• **Si pagas por SINPE Móvil**: Nuestro equipo valida tu transferencia y comprobante en pocos minutos.\n` +
      `• **Consulta en cualquier momento**: Puedes revisar el estado de tus tokens ingresando tu celular en [Validar mis Tokens](/validar).\n\n` +
      `🔥 *¡Y listo! Ya quedas participando automáticamente para los **Viernes de Tanque Lleno (₡50,000 en gasolina semanal)** y para la gran **Toyota Prado 2026 0KM**.* ¿Te gustaría apartar tus números hoy en el [Checkout](/checkout)?`;
  }

  // 7. QUÉ SON LAS ENTREGAS INSTANTÁNEAS / RASPA / RULETA
  const esPreguntaInstantaneas =
    q.includes("instantanea") ||
    q.includes("instantánea") ||
    q.includes("raspa") ||
    q.includes("ruleta");

  if (esPreguntaInstantaneas) {
    return `🎰 **¿Qué son las Entregas Instantáneas y Juegos Express?**\n\n` +
      `Al adquirir tus Tokens, si uno de tus números de 5 dígitos coincide con una combinación favorecida pre-establecida en el evento, **¡obtienes ese reconocimiento menor al instante de forma automática!**\n\n` +
      `Además, tu compra desbloquea giros gratis en el **Raspa & Gana Express** y la **Ruleta de la Suerte**, donde puedes ganar hasta **₡100,000 en efectivo por SINPE Móvil de inmediato**.\n\n` +
      `🔥 *Y recuerda: ¡También juegas automáticamente todos los viernes por el **Viernes de Tanque Lleno (₡50,000 en gasolina)**!*\n\n` +
      `¿Arrancamos hoy con tu paquete de tokens? [Ir al Checkout de Compra](/checkout)`;
  }

  // 8. CÓMO SE REALIZA LA ENTREGA DEL VEHÍCULO / NOTARIO
  const esPreguntaEntrega =
    (q.includes("entrega") && (q.includes("vehiculo") || q.includes("vehículo") || q.includes("carro") || q.includes("auto") || q.includes("premio"))) ||
    q.includes("notario") ||
    q.includes("traspaso");

  if (esPreguntaEntrega) {
    return `⚖️ **¿Cómo se realiza la entrega del vehículo o beneficio principal?**\n\n` +
      `La entrega se realiza de forma presencial con **firma formal de traspaso legal ante Notario Público**.\n\n` +
      `• **Cero Gastos Ocultos**: Todos los costos de traspaso, marchamo y derechos corren 100% por cuenta de Aval Community CR e **${razonSocial}** bajo el marco formal de la **Ley N° 7472** (Protección al Consumidor).\n` +
      `• Te llevas tu Toyota Prado 2026 0KM sacada de agencia, lista para rodar sin poner un solo colón de tu bolsa.\n\n` +
      `🔥 *¿Y ya sabes de los **SuperTokens**? Por solo ₡1,500 extra te entregamos además **$6,000 USD en efectivo CASH** el día de la entrega.*\n\n` +
      `¿Cuántos números de la suerte te apartamos hoy en el [Checkout de Compra](/checkout)?`;
  }

  // 9. CÓMO SE DETERMINAN LOS FAVORECIDOS / CÓMO SE JUEGA / CÓMO PARTICIPAR / JPS
  const esPreguntaComoJugar =
    q.includes("como se juega") ||
    q.includes("cómo se juega") ||
    q.includes("como funciona") ||
    q.includes("cómo funciona") ||
    q.includes("como participo") ||
    q.includes("cómo participo") ||
    q.includes("como participar") ||
    q.includes("cómo participar") ||
    q.includes("favorecido") ||
    q.includes("como ganar") ||
    q.includes("cómo ganar") ||
    q.includes("ganador") ||
    q.includes("dinamica") ||
    q.includes("dinámica") ||
    q.includes("jps") ||
    q.includes("lotería") ||
    q.includes("loteria");

  if (esPreguntaComoJugar) {
    return `🎯 **¿Cómo participo en el evento promocional y cómo se gana?**\n\n` +
      `1. **Elige tu Paquete**: Elige el paquete de Tokens digitales de tu preferencia (4, 8, 12 o 24 Tokens) en el [Checkout de Compra](/checkout).\n` +
      `2. **Asigna tus Números**: Puedes dejar que el sistema te asigne tus números de cortesía de la suerte al azar o escribir tus números favoritos de 5 dígitos (00000 al 99999).\n` +
      `3. **Activa el SuperToken (Opcional)**: Por ₡1,500 extra sumas $6,000 USD cash si ganas el 1° lugar.\n` +
      `4. **Completa tus Datos y Paga**: Pagas fácilmente por SINPE Móvil, Tarjeta (TiloPay con validación instantánea), Apple Pay, Google Pay, PayPal o Cripto.\n\n` +
      `⚖️ **¿Cómo se determinan los favorecidos?**\n` +
      `El evento se rige formalmente por combinaciones matemáticas transparentes basadas en los **resultados oficiales públicos de la Lotería Nacional de la Junta de Protección Social (JPS)** de Costa Rica en la fecha establecida, garantizando total claridad e imparcialidad.\n\n` +
      `🔥 *¡Mira! Todos los tokens entran automáticamente a los **Viernes de Tanque Lleno** donde te ganas ₡50,000 en gasolina Delta/Uno todas las semanas.*\n\n` +
      `¿Arrancamos hoy con tus números de la suerte? [Apartar mis Tokens Ahora](/checkout)`;
  }

  // 10. SOLO SINPE MÓVIL
  if (q.includes("sinpe") || q.includes("transfer")) {
    return `📱 **Pago por SINPE Móvil Oficial (Rápido y Seguro):**\n\n` +
      `1. Transfiere al número oficial: **${telSinpe}** a nombre de **${razonSocial}**.\n` +
      `2. En el detalle del pase coloca tu nombre y teléfono celular.\n` +
      `3. Entra a [Apartar Tokens en Checkout](/checkout), adjunta la captura de tu comprobante y tus números quedan asignados.\n\n` +
      `🔥 *¡Ojo! Con cualquier compra entras a los **Viernes de Tanque Lleno (₡50,000 en gasolina semanal)**. ¿Y ya sabes de los **SuperTokens**? Por solo ₡1,500 extra compites por **$6,000 USD cash**.*\n\n` +
      `¿Te aparto 8 tokens de la suerte para arrancar hoy en el [Checkout](/checkout)?`;
  }

  // 11. CONSULTA Y VALIDACIÓN DE TOKENS
  if (q.includes("validar") || q.includes("token") || q.includes("número") || q.includes("numero") || q.includes("comprobante") || q.includes("consultar")) {
    return `🎟️ **Consulta y Validación de Tokens:**\n\nPuedes consultar tus números y el estado de tu orden en cualquier momento en [Validar mis Tokens](/validar) ingresando tu número de teléfono registrado.\n\n💡 **Tip Ganador**: Cada token adicional multiplica tus probabilidades de llevarte la Toyota Prado 2026 0KM y entras directo a los **Viernes de Tanque Lleno (₡50,000 en gasolina)**. ¿Deseas asegurar más números hoy en el [Checkout de Compra](/checkout)?`;
  }

  // 12. LEGALIDAD Y GARANTÍAS
  if (q.includes("legal") || q.includes("estafa") || q.includes("segur") || q.includes("ley")) {
    return `⚖️ **100% Legal, Auditado y Transparente en Costa Rica:**\n\n• Actividad formal bajo la **Ley N° 7472** (Protección al Consumidor) organizada por **${razonSocial}**.\n• El ganador se define directamente con el sorteo oficial de la **Lotería Nacional (JPS)**, garantizando imparcialidad absoluta.\n• La entrega del vehículo 0KM se realiza con traspaso formal ante Notario Público y marchamo 100% pagos.\n\n🔥 *¿Y sabías que mientras esperas el sorteo mayor te ganas gasolina todos los viernes con el **Viernes de Tanque Lleno (₡50,000)**?*\n\n🚗 ¿Cuántos números de la suerte te apartamos hoy en el [Checkout](/checkout)?`;
  }

  // 13. PROGRAMA DE AMIGOS / REFERIDOS
  if (q.includes("referid") || q.includes("amigo") || q.includes("compa") || q.includes("enlace") || q.includes("link")) {
    return `🎁 **Gana Tokens y Premios con el Programa de Amigos:**\n\n¡Es facilísimo! Comparte tu enlace con tus compas y por cada compra que hagan, tú ganas comisiones en efectivo SINPE o tokens de regalo, y ellos reciben **+1 Token Extra GRATIS**.\n\n¿Quieres apartar tus primeros tokens hoy para empezar a compartir tu enlace? [Ir al Checkout](/checkout)`;
  }

  // 14. ATENCIÓN HUMANA
  if (q.includes("humano") || q.includes("persona") || q.includes("asesor") || q.includes("whatsapp") || q.includes("contacto")) {
    return `📲 **Atención Personalizada por WhatsApp:**\n\nCon gusto te atiende un asesor de nuestro equipo comercial para ayudarte a apartar tus números de inmediato. Puedes escribirnos directamente: [Chatear con un Asesor en WhatsApp](https://wa.me/${promoWa}?text=Hola%20Aval%20Community%20CR,%20quiero%20comprar%20tokens%20y%20deseo%20asesor%C3%ADa%20personalizada).`;
  }

  // 15. RESPUESTA GENERAL RESUMIDA / CLOSER
  return `¡Pura vida! En Aval Community CR estás a un paso de estrenar una espectacular **Toyota Prado 2026 0KM** con marchamo pago y traspaso formal incluido.\n\n` +
    `🔥 **¡Mira todo lo que ganas al participar!**\n` +
    `• ⛽ **Viernes de Tanque Lleno**: ¡Te ganas gasolina todos los viernes (₡50,000 en combustible) con cualquier paquete que compres sin pagar nada extra!\n` +
    `• 👑 **¿Sabes de los SuperTokens?**: Por solo ₡1,500 extra, si te pegas la Prado, ¡te llevas **$6,000 USD en efectivo CASH** de una vez!\n` +
    `• 🎟️ **Lotes de Tickets**: Desde 4 Tokens por ₡4,000 hasta Paquete VIP de 24 Tokens (₡24,000).\n` +
    `• 💳 **6 Formas de Pago**: SINPE Móvil al **${telSinpe}**, Tarjetas Débito/Crédito TiloPay (aprobación automática en segundos), Apple Pay, Google Pay, PayPal y Cripto USDT.\n` +
    `• ⚖️ **Sorteo 100% Transparente**: Definido directamente con la **Lotería Nacional (JPS)** ante Notario Público.\n\n` +
    `¿Te gustaría que te ayude a apartar tus números de la suerte ahora mismo en el [Checkout de Compra](/checkout)?`;
}

// ────────────────────────────────────────────────────────────
// Adaptadores de Proveedores
// ────────────────────────────────────────────────────────────

async function llamarOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: AiMessage[]
): Promise<string> {
  const formatted = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages: formatted,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error OpenAI HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No se obtuvo respuesta de OpenAI.";
}

async function llamarGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: AiMessage[]
): Promise<string> {
  const modelName = model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const payload: any = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error Gemini HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || "No se obtuvo respuesta de Gemini.";
}

async function llamarDeepSeek(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: AiMessage[]
): Promise<string> {
  const formatted = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "deepseek-chat",
      messages: formatted,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error DeepSeek HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No se obtuvo respuesta de DeepSeek.";
}

async function llamarClaude(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: AiMessage[]
): Promise<string> {
  const formatted = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: model || "claude-3-5-haiku-20241022",
      system: systemPrompt,
      messages: formatted,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error Claude HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || "No se obtuvo respuesta de Claude.";
}

// ────────────────────────────────────────────────────────────
// Función Principal de Consulta
// ────────────────────────────────────────────────────────────

export async function enviarMensajeIA(
  messages: AiMessage[],
  config: Config
): Promise<string> {
  const proveedor = config.aiProveedor || "gemini";
  const ultimaPregunta = messages[messages.length - 1]?.content || "";

  // Bloqueo inmediato de consultas técnicas antes de llamar a la API
  if (esConsultaTecnicaInterna(ultimaPregunta)) {
    return RESPUESTA_SOLO_VENTAS;
  }

  const telSinpe = config.telefonoSinpe || "8634-4772";
  const razonSocial = config.razonSocial || "Importadora Luxury Scents LTDA.";
  const promoWa = config.promoWhatsapp || "50686344772";

  const promptBase = config.aiSystemPrompt || "Eres Aval-IA, el Vendedor Estrella y Asesor Comercial Oficial de Aval Community CR.";

  const systemPrompt = `${promptBase}

[BASE DE CONOCIMIENTO TOTAL Y REGLAS DE VENTA]:
1. ¿QUÉ SE RIFA? (PREMIOS):
- 🏆 1° LUGAR (PREMIO MAYOR): Toyota Prado 2026 0KM, motor turbo diésel 2.8L, 4x4 real, full extras, asientos de cuero, techo panorámico. Sacada de agencia con Traspaso Notarial y Marchamo 100% PAGOS por la empresa (cero gastos ocultos para el ganador).
- 🏍️ 2° LUGAR (SEGUNDO PREMIO): Motocicleta de alta cilindrada 0KM (Yamaha MT).
- 🎮/💵 3° LUGAR (TERCER PREMIO): Consola PlayStation 5 o ₡1,000,000 en efectivo por SINPE Móvil.
- ⛽ MINI SORTEOS SEMANALES: "Viernes de Tanque Lleno" con ₡50,000 en combustible (estaciones Delta / Uno). Todos los participantes activos entran automáticamente todos los viernes sin pagar nada extra, y siguen jugando para la Prado.
- 🎰 ENTREGAS INSTANTÁNEAS: Si tu número coincide con una combinación favorecida pre-establecida, ¡ganas premios instantáneos de forma automática! Además recibes giros gratis en el Raspa & Gana Express o la Ruleta de la Suerte por hasta ₡100,000 SINPE.

2. MÉTODOS DE PAGO DISPONIBLES (6 FORMAS DE PAGO):
- 📱 SINPE Móvil Oficial: Al ${telSinpe} a nombre de ${razonSocial}. Se sube comprobante en el Checkout y queda reservado.
- 💳 Tarjetas de Débito y Crédito (Visa / Mastercard vía TiloPay): Con Aprobación Inmediata en tiempo real. Los tokens se validan al instante sin esperas.
- 🍏 Apple Pay: Pago express en 1 toque con Face ID o Touch ID desde iPhone, Apple Watch o Mac.
- 🌐 Google Pay: Pago rápido en 1 clic express desde Android o navegador Chrome.
- 🅿️ PayPal: Pagos internacionales con tarjeta o saldo en dólares (USD).
- 🪙 Criptomonedas (USDT): Pagos en USDT (red TRC20 / BEP20) o Binance Pay ID.

3. PAQUETES Y LOTES DE TICKETS (PRECIOS Y CANTIDADES):
- 🎟️ Paquete Básico (4 Tokens) por ₡4,000 (₡1,000 por token).
- 🔥 Paquete Popular (8 Tokens) por ₡8,000 (¡El más vendido y recomendado!).
- ⚡ Paquete Pro (12 Tokens) por ₡12,000 (Alta probabilidad y más giros de regalo).
- 👑 Paquete VIP Ganador (24 Tokens) por ₡24,000 (Máximas oportunidades).
- Cada usuario puede escribir sus propios números de 5 dígitos (00000 al 99999) o pedirlos al azar.

4. ¿QUÉ ES EL SUPERTOKEN?:
- Beneficio opcional exclusivo por solo ₡1,500 extra al pagar en el Checkout.
- Si el comprador gana el 1° Lugar (la Toyota Prado 2026 0KM), ¡RECIBE ADICIONALMENTE $6,000 USD EN EFECTIVO CASH EXTRA!

5. ¿CÓMO SE JUEGA Y CÓMO SE DEFINE EL GANADOR?:
- Se elige el paquete de tokens en el Checkout (/checkout), se asignan los números de 5 dígitos, se añade el SuperToken si se desea, y se paga por cualquiera de los 6 métodos.
- EL GANADOR SE DEFINE de forma 100% transparente y matemática con los resultados oficiales de la Lotería Nacional de la Junta de Protección Social (JPS) de Costa Rica.
- Cada participante puede consultar y verificar sus tokens en tiempo real en /validar ingresando su celular.
- Traspaso legal formal bajo la Ley N° 7472 (Protección al Consumidor) ante Notario Público con Marchamo y Traspaso 100% cubiertos.

6. PROGRAMA DE REFERIDOS:
- Enlace único para invitar amigos: el amigo recibe +1 Token Extra GRATIS y quien refiere gana tokens de regalo y comisiones por SINPE Móvil.

[INSTRUCCIONES CLAVE DE INCITACIÓN DE VENTAS Y CIERRE (CLOSER PROACTIVO)]:
- En cada respuesta DEBES INCITAR A COMPRAR con entusiasmo y calidez costarricense ('pura vida').
- Usa ganchos irresistibles:
  * "¡Mira! Lo mejor es que con cualquiera de tus tokens te ganas gasolina todos los viernes con el Viernes de Tanque Lleno (₡50,000 en combustible) sin pagar nada extra."
  * "¿Y ya sabes de los SuperTokens? Por solo ₡1,500 extra, si te pegas la Prado, ¡te llevas $6,000 USD en efectivo CASH de una vez para que andes platudo!"
  * "¿Sabías que con tu compra te llevas giros gratis en el Raspa Express con premios de hasta ₡100,000 por SINPE?"
- Siempre remata con un llamado a la acción persuasivo hacia el [Checkout de Compra](/checkout) o el SINPE Móvil al ${telSinpe}.
- Si el cliente requiere atención humana personalizada, indícale escribir a WhatsApp (${promoWa}).
- REGLA ESTRICTA DE SEGURIDAD: Jamás respondas temas sobre programación, código, base de datos o arquitectura interna de la app. Si te preguntan algo técnico o cómo fue hecha la app, declina amablemente indicando que eres exclusivamente un asesor comercial de ventas.`;

  try {
    if (proveedor === "openai") {
      if (!config.aiOpenaiKey?.trim()) {
        return obtenerRespuestaFallback(ultimaPregunta, config);
      }
      return await llamarOpenAI(
        config.aiOpenaiKey.trim(),
        config.aiOpenaiModel || "gpt-4o-mini",
        systemPrompt,
        messages
      );
    }

    if (proveedor === "gemini") {
      if (!config.aiGeminiKey?.trim()) {
        return obtenerRespuestaFallback(ultimaPregunta, config);
      }
      return await llamarGemini(
        config.aiGeminiKey.trim(),
        config.aiGeminiModel || "gemini-1.5-flash",
        systemPrompt,
        messages
      );
    }

    if (proveedor === "deepseek") {
      if (!config.aiDeepseekKey?.trim()) {
        return obtenerRespuestaFallback(ultimaPregunta, config);
      }
      return await llamarDeepSeek(
        config.aiDeepseekKey.trim(),
        config.aiDeepseekModel || "deepseek-chat",
        systemPrompt,
        messages
      );
    }

    if (proveedor === "claude") {
      if (!config.aiClaudeKey?.trim()) {
        return obtenerRespuestaFallback(ultimaPregunta, config);
      }
      return await llamarClaude(
        config.aiClaudeKey.trim(),
        config.aiClaudeModel || "claude-3-5-haiku-20241022",
        systemPrompt,
        messages
      );
    }

    return obtenerRespuestaFallback(ultimaPregunta, config);
  } catch (err: any) {
    console.warn("[AI Service Error]", err?.message || err);
    const fallback = obtenerRespuestaFallback(ultimaPregunta, config);
    return `${fallback}\n\n*(Nota: Modo de respuesta asistida offline. Error del proveedor: ${err?.message || "conexión"})*`;
  }
}

// ────────────────────────────────────────────────────────────
// Prueba de Conexión de API Key para el Admin
// ────────────────────────────────────────────────────────────

export async function probarConexionIA(
  proveedor: "openai" | "gemini" | "deepseek" | "claude",
  apiKey: string,
  model: string
): Promise<{ ok: boolean; mensaje: string }> {
  if (!apiKey?.trim()) {
    return { ok: false, mensaje: "Por favor ingresa una API Key antes de probar la conexión." };
  }

  const mensajePrueba: AiMessage[] = [
    { role: "user", content: "Responde solo la palabra 'OK_AVAL' para confirmar conexión." },
  ];
  const testPrompt = "Eres un validador de conexión.";

  try {
    let res = "";
    if (proveedor === "openai") {
      res = await llamarOpenAI(apiKey.trim(), model, testPrompt, mensajePrueba);
    } else if (proveedor === "gemini") {
      res = await llamarGemini(apiKey.trim(), model, testPrompt, mensajePrueba);
    } else if (proveedor === "deepseek") {
      res = await llamarDeepSeek(apiKey.trim(), model, testPrompt, mensajePrueba);
    } else if (proveedor === "claude") {
      res = await llamarClaude(apiKey.trim(), model, testPrompt, mensajePrueba);
    }

    return {
      ok: true,
      mensaje: `✅ Conexión exitosa con ${proveedor.toUpperCase()} (${model}). Respuesta recibida.`,
    };
  } catch (err: any) {
    return {
      ok: false,
      mensaje: `❌ Error al conectar: ${err?.message || "Revisa la API Key y permisos de tu cuenta."}`,
    };
  }
}
