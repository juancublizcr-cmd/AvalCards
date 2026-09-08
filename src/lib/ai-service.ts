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
  "¡Pura vida! Mi función es exclusivamente comercial: asesorarte en la compra de tus tokens y en tu participación por el vehículo 0KM y grandes premios en Aval Community CR. 🚗💨\n\n¿Te gustaría ver las opciones de compra disponibles o cómo pagar fácilmente por SINPE Móvil o Tarjeta?";

// Respuestas inteligentes offline/fallback con conocimiento 100% completo de la plataforma
export function obtenerRespuestaFallback(consulta: string, config: Config): string {
  const q = consulta.toLowerCase();
  const telSinpe = config.telefonoSinpe || "8634-4772";
  const razonSocial = config.razonSocial || "Importadora Luxury Scents LTDA.";
  const promoWa = config.promoWhatsapp || "50686344772";

  if (esConsultaTecnicaInterna(q)) {
    return RESPUESTA_SOLO_VENTAS;
  }

  // 1. FORMAS DE PAGO / OTRAS FORMAS / MÉTODOS DE PAGO / TARJETAS / PAYPAL / APPLE PAY / GOOGLE PAY / CRIPTO
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
      `¡Tienes **6 formas de pago rápidas y 100% seguras** para no quedarte sin tus números!\n\n` +
      `1. 📱 **SINPE Móvil Oficial (Costa Rica)**: Transfiere directo al **${telSinpe}** a nombre de **${razonSocial}**. Adjuntas tu comprobante en el Checkout y tus números quedan reservados.\n` +
      `2. 💳 **Tarjetas de Débito y Crédito (Visa / Mastercard vía TiloPay)**: ¡Aprobación Inmediata! Tus tokens se validan automáticamente al segundo sin esperar revisión manual.\n` +
      `3. 🍏 **Apple Pay**: Pago en 1 solo toque desde tu iPhone, Apple Watch o Mac con Face ID / Touch ID.\n` +
      `4. 🌐 **Google Pay**: Pago express y ultra seguro con 1 clic desde tu dispositivo Android o navegador Chrome.\n` +
      `5. 🅿️ **PayPal**: Aceptamos pagos internacionales con tu saldo PayPal o tarjetas internacionales en dólares (USD).\n` +
      `6. 🪙 **Criptomonedas (USDT)**: Puedes pagar en USDT (red TRC20 / BEP20) o directamente por Binance Pay ID.\n\n` +
      `🔥 **¿Cuál de estos métodos te queda más cómodo para apartar tus números de la suerte hoy en el [Checkout de Compra](/checkout)?**`;
  }

  // 2. PAQUETES / LOTES DE TOKENS / TICKETS / PRECIOS / CUÁNTO CUESTA
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
      `Puedes elegir el paquete que mejor se adapte a tu presupuesto para competir por la **Toyota Prado 2026 0KM**:\n\n` +
      `• 🎟️ **Paquete Básico (4 Tokens) · ₡4,000**: 4 oportunidades para asegurar tus números favoritos.\n` +
      `• 🔥 **Paquete Popular (8 Tokens) · ₡8,000**: ¡El favorito de la comunidad! Multiplica tus probabilidades x8 por solo ₡8 mil.\n` +
      `• ⚡ **Paquete Pro (12 Tokens) · ₡12,000**: Mayor probabilidad de ganar el sorteo mayor y más giros de regalo para premios express.\n` +
      `• 👑 **Paquete VIP Ganador (24 Tokens) · ₡24,000**: ¡Máxima probabilidad! 24 combinaciones para asegurar tu premio soñado.\n\n` +
      `*(En cada paquete puedes teclear tus propios números de 5 dígitos favoritos del 00000 al 99999 o dejar que el sistema te genere combinaciones de la suerte al azar)*.\n\n` +
      `🔥 **¿Te gustaría apartar el Paquete Popular de 8 tokens o prefieres el de 12 para tener aún más oportunidades? [Elegir mi Paquete en Checkout](/checkout)**`;
  }

  // 3. SUPERTOKEN
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
    return `👑 **¿Qué es el SuperToken y por qué todos lo activan?**\n\n` +
      `El **SuperToken** es un multiplicador de premio opcional y exclusivo que puedes activar en tu orden al momento de pagar por tan solo **₡1,500 adicionales**.\n\n` +
      `🔥 **El Gran Beneficio:**\n` +
      `Si tu número resulta favorecido con el 1° Lugar (Premio Mayor), ¡no solo te llevas la espectacular **Toyota Prado 2026 0KM** con marchamo y traspaso pagos, sino que además te entregamos **¡$6,000 USD en efectivo CASH extra!** 💵🎉\n\n` +
      `Por solo ₡1,500 aseguras ese premio extra en dólares. ¡Es una locura de beneficio!\n\n` +
      `¿Te gustaría activar tu SuperToken hoy al apartar tus números? [Apartar Tokens con SuperToken en Checkout](/checkout)`;
  }

  // 4. QUÉ RIFAN / QUÉ SE GANA / PREMIOS
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
    q.includes("ps5") ||
    q.includes("gasolina") ||
    q.includes("tanque");

  if (esPreguntaPremios) {
    return `🚗 **Premios Oficiales de Aval Community CR:**\n\n` +
      `¡Nuestra edición actual está cargada de premios de ensueño!\n\n` +
      `1. 🏆 **Premio Mayor (1° Lugar)**: Espectacular **Toyota Prado 2026 0KM**, motor turbo diésel 2.8L, 4x4 real, full extras, asientos de cuero y pantalla táctil. *(¡Con Traspaso Notarial y Marchamo 100% PAGOS, sacada de agencia sin sorpresas ni gastos ocultos!)*.\n` +
      `2. 🏍️ **Segundo Premio (2° Lugar)**: Motocicleta de alta cilindrada 0KM (Yamaha MT) lista para estrenar.\n` +
      `3. 🎮 / 💵 **Tercer Premio (3° Lugar)**: Consola PlayStation 5 de última generación o ₡1,000,000 en efectivo por SINPE Móvil.\n` +
      `4. ⛽ **Mini Sorteos Semanales**: Como el tradicional *Viernes de Tanque Lleno* (₡50,000 en combustible Delta / Uno).\n` +
      `5. 🎰 **Juegos Express Instantáneos**: Con tu compra desbloqueas giros gratis en el Raspa & Gana Express o la Ruleta de la Suerte para premios instantáneos de hasta ₡100,000 por SINPE.\n\n` +
      `¿Te imaginas andar estrenando esa Prado 2026? Vamos a apartar tus números de la suerte hoy: [Ir al Checkout de Compra](/checkout)`;
  }

  // 5. CÓMO SE JUEGA / CÓMO PARTICIPAR / CÓMO SE DETERMINA EL GANADOR / JPS
  const esPreguntaComoJugar =
    q.includes("como se juega") ||
    q.includes("cómo se juega") ||
    q.includes("como funciona") ||
    q.includes("cómo funciona") ||
    q.includes("como participar") ||
    q.includes("cómo participar") ||
    q.includes("como se gana") ||
    q.includes("cómo se gana") ||
    q.includes("instrucciones") ||
    q.includes("pasos") ||
    q.includes("numeros") ||
    q.includes("números") ||
    q.includes("ganador") ||
    q.includes("dinamica") ||
    q.includes("dinámica");

  if (esPreguntaComoJugar) {
    return `🎯 **¿Cómo se juega y cómo participas en 4 sencillos pasos?**\n\n` +
      `1. **Elige tu Paquete**: Entra a [Elegir Paquete en Checkout](/checkout) y selecciona cuántos tokens deseas (4, 8, 12 o 24 tokens).\n` +
      `2. **Escoge tus Números**: Puedes teclear tus números de 5 dígitos favoritos (00000 al 99999) o dejar que el sistema te genere combinaciones de la suerte al azar.\n` +
      `3. **Activa el SuperToken (Opcional)**: Por ₡1,500 extra, compites por $6,000 USD en efectivo adicionales si ganas el 1° lugar.\n` +
      `4. **Realiza tu Pago**: Paga por SINPE Móvil, Tarjeta (TiloPay con validación instantánea), PayPal, Apple Pay, Google Pay o Cripto.\n\n` +
      `⚖️ **¿Cómo se define el ganador?**\n` +
      `Se define en estricta sincronía y transparencia con el resultado público oficial de la **Lotería Nacional de la Junta de Protección Social (JPS)** de Costa Rica. Consulta tus números en cualquier momento en [Validar Tokens](/validar) solo con tu celular.\n\n` +
      `🔥 **¿Arrancamos hoy con tus números de la suerte? [Apartar mis Tokens Ahora](/checkout)**`;
  }

  // 6. SOLO SINPE MÓVIL
  if (q.includes("sinpe") || q.includes("transfer")) {
    return `📱 **Pago por SINPE Móvil Oficial (Rápido y Seguro):**\n\n` +
      `1. Transfiere al número oficial: **${telSinpe}** a nombre de **${razonSocial}**.\n` +
      `2. En el detalle del pase coloca tu nombre y teléfono celular.\n` +
      `3. Entra a [Apartar Tokens en Checkout](/checkout), adjunta la captura de tu comprobante y tus números quedan asignados.\n\n` +
      `💡 *¿Prefieres pagar con Tarjeta (aprobación automática), Apple Pay o PayPal? También las tenemos disponibles en el Checkout.* ¿Arrancamos con tus números de la suerte?`;
  }

  // 7. CONSULTA Y VALIDACIÓN
  if (q.includes("validar") || q.includes("token") || q.includes("número") || q.includes("numero") || q.includes("comprobante") || q.includes("consultar")) {
    return `🎟️ **Consulta y Validación de Tokens:**\n\nPuedes consultar tus números y el estado de tu orden en cualquier momento en [Validar Tokens](/validar) ingresando tu número de teléfono registrado.\n\n💡 **Tip Ganador**: Cada token adicional multiplica tus probabilidades de llevarte la Toyota Prado 2026 0KM. ¿Deseas asegurar más números hoy en el [Checkout de Compra](/checkout)?`;
  }

  // 8. LEGALIDAD Y GARANTÍAS
  if (q.includes("legal") || q.includes("estafa") || q.includes("segur") || q.includes("loteria") || q.includes("lotería") || q.includes("notario") || q.includes("ley")) {
    return `⚖️ **100% Legal, Auditado y Transparente en Costa Rica:**\n\n• Actividad formal bajo la **Ley N° 7472** (Protección al Consumidor) organizada por **${razonSocial}**.\n• El ganador se define directamente con el sorteo oficial de la **Lotería Nacional (JPS)**, garantizando imparcialidad absoluta.\n• La entrega del vehículo 0KM se realiza con traspaso formal ante Notario Público y marchamo 100% pagos.\n\n🚗 **¡Tu oportunidad de estrenar está aquí!** ¿Cuántos números de la suerte te apartamos hoy en el [Checkout](/checkout)?`;
  }

  // 9. PROGRAMA DE AMIGOS / REFERIDOS
  if (q.includes("referid") || q.includes("amigo") || q.includes("compa") || q.includes("enlace") || q.includes("link")) {
    return `🎁 **Gana Tokens y Premios con el Programa de Amigos:**\n\n¡Es facilísimo! Comparte tu enlace con tus compas y por cada compra que hagan, tú ganas comisiones en efectivo SINPE o tokens de regalo, y ellos reciben **+1 Token Extra GRATIS**.\n\n¿Quieres apartar tus primeros tokens hoy para empezar a compartir tu enlace? [Ir al Checkout](/checkout)`;
  }

  // 10. ATENCIÓN HUMANA
  if (q.includes("humano") || q.includes("persona") || q.includes("asesor") || q.includes("whatsapp") || q.includes("contacto")) {
    return `📲 **Atención Personalizada por WhatsApp:**\n\nCon gusto te atiende un asesor de nuestro equipo comercial para ayudarte a apartar tus números de inmediato. Puedes escribirnos directamente: [Chatear con un Asesor en WhatsApp](https://wa.me/${promoWa}?text=Hola%20Aval%20Community%20CR,%20quiero%20comprar%20tokens%20y%20deseo%20asesor%C3%ADa%20personalizada).`;
  }

  // 11. RESPUESTA GENERAL RESUMIDA / CLOSER
  return `¡Pura vida! En Aval Community CR estás a un paso de estrenar una espectacular **Toyota Prado 2026 0KM** con marchamo pago y traspaso formal incluido.\n\n` +
    `🎟️ **Lotes de Tickets**: Desde 4 Tokens por ₡4,000 hasta Paquete VIP de 24 Tokens (₡24,000).\n` +
    `👑 **SuperToken Opcional**: Por ₡1,500 extra optas por $6,000 USD en efectivo adicionales si ganas el 1° lugar.\n` +
    `💳 **6 Formas de Pago**: SINPE Móvil al **${telSinpe}**, Tarjetas Débito/Crédito TiloPay (aprobación inmediata), Apple Pay, Google Pay, PayPal y Cripto USDT.\n` +
    `⚖️ **Sorteo Transparente**: Se define con el resultado oficial de la **Lotería Nacional (JPS)**.\n\n` +
    `¿Te gustaría que te ayude a apartar tus números ahora mismo en el [Checkout de Compra](/checkout)?`;
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

[BASE DE CONOCIMIENTO TOTAL DE AVAL COMMUNITY CR]:
1. ¿QUÉ SE RIFA? (PREMIOS):
- 🏆 1° LUGAR (PREMIO MAYOR): Toyota Prado 2026 0KM, motor turbo diésel 2.8L, 4x4 real, full extras, asientos de cuero, techo panorámico. Sacada de agencia con Traspaso Notarial y Marchamo 100% PAGOS por la empresa (cero gastos ocultos para el ganador).
- 🏍️ 2° LUGAR (SEGUNDO PREMIO): Motocicleta de alta cilindrada 0KM (Yamaha MT).
- 🎮/💵 3° LUGAR (TERCER PREMIO): Consola PlayStation 5 o ₡1,000,000 en efectivo por SINPE Móvil.
- ⛽ MINI SORTEOS SEMANALES: "Viernes de Tanque Lleno" con ₡50,000 en combustible (estaciones Delta / Uno).
- 🎰 ENTREGAS INSTANTÁNEAS: Con cada compra de tokens el usuario recibe giros gratis en el Raspa & Gana Express o la Ruleta de la Suerte para premios instantáneos de hasta ₡100,000 por SINPE.

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
- Traspaso legal formal bajo la Ley N° 7472 (Protección al Consumidor) con Notario Público.

6. PROGRAMA DE REFERIDOS:
- Enlace único para invitar amigos: el amigo recibe +1 Token Extra GRATIS y quien refiere gana tokens de regalo y comisiones por SINPE Móvil.

[ROL OBLIGATORIO: CLOSER / IMPULSADOR DE VENTAS]:
- Tu meta es CERRAR VENTAS en cada interacción.
- Sé cordial, entusiasta y con amabilidad tica ('pura vida').
- Utiliza cierres de alternativa ("¿prefieres arrancar con el paquete de 8 tokens o el de 12?").
- Siempre añade un llamado a la acción (CTA) hacia el [Checkout de Compra](/checkout) o el pago por SINPE Móvil al ${telSinpe}.
- Si el cliente requiere atención humana personalizada o asistencia guiada, indícale escribir a WhatsApp (${promoWa}).
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
