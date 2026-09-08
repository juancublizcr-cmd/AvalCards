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
  "¡Pura vida! Mi función es exclusivamente comercial: asesorarte en la compra de tus tokens y en tu participación por el vehículo 0KM y grandes premios en Aval Community CR. 🚗💨\n\n¿Te gustaría ver las opciones de compra disponibles o cómo pagar fácilmente por SINPE Móvil?";

// Respuestas inteligentes offline/fallback si no hay API key o hay error de red/cuota
export function obtenerRespuestaFallback(consulta: string, config: Config): string {
  const q = consulta.toLowerCase();
  const telSinpe = config.telefonoSinpe || "8634-4772";
  const razonSocial = config.razonSocial || "Importadora Luxury Scents LTDA.";
  const promoWa = config.promoWhatsapp || "50686344772";

  if (esConsultaTecnicaInterna(q)) {
    return RESPUESTA_SOLO_VENTAS;
  }

  if (q.includes("sinpe") || q.includes("pago") || q.includes("pagar") || q.includes("transfer")) {
    return `💳 **Método Oficial SINPE Móvil (Rápido y Seguro):**\n\n1. Envía tu pago al número oficial: **${telSinpe}** a nombre de **${razonSocial}**.\n2. En el detalle del pase indica tu nombre y teléfono.\n3. Entra a [Apartar Tokens en Checkout](/checkout), sube tu comprobante y tus números quedan asignados al instante.\n\n🔥 **¡Los cupos son limitados!** ¿Te gustaría apartar 3 tokens para tener triple oportunidad o prefieres el paquete de 5 con bonificación extra?`;
  }

  if (q.includes("validar") || q.includes("token") || q.includes("número") || q.includes("numero") || q.includes("comprobante")) {
    return `🎟️ **Consulta y Validación de Tokens:**\n\nPuedes consultar tus números y el estado de tu orden en cualquier momento en [Validar Tokens](/validar) ingresando tu número de teléfono registrado.\n\n💡 **Tip Ganador**: Cada token adicional multiplica tus probabilidades de llevarte la Toyota Prado 2026 0KM. ¿Deseas asegurar más números hoy en el [Checkout de Compra](/checkout)?`;
  }

  if (q.includes("legal") || q.includes("estafa") || q.includes("segur") || q.includes("loteria") || q.includes("lotería")) {
    return `⚖️ **100% Legal, Auditado y Transparente en Costa Rica:**\n\n• Actividad formal bajo la **Ley N° 7472** (Protección al Consumidor) organizada por **${razonSocial}**.\n• El ganador se define directamente con el sorteo oficial de la **Lotería Nacional (JPS)**, garantizando imparcialidad absoluta.\n• La entrega del vehículo 0KM se realiza con traspaso formal y marchamo 100% pagos.\n\n🚗 **¡Tu oportunidad de estrenar está aquí!** ¿Cuántos números de la suerte te apartamos hoy en el [Checkout](/checkout)?`;
  }

  if (q.includes("referid") || q.includes("amigo") || q.includes("compa") || q.includes("enlace") || q.includes("link")) {
    return `🎁 **Gana Tokens y Premios con el Programa de Amigos:**\n\n¡Es facilísimo! Comparte tu enlace con tus compas y por cada compra que hagan, tú ganas comisiones en efectivo SINPE o tokens de regalo, y ellos reciben **+1 Token Extra GRATIS**.\n\n¿Quieres apartar tus primeros tokens hoy para empezar a compartir tu enlace? [Ir al Checkout](/checkout)`;
  }

  if (q.includes("humano") || q.includes("persona") || q.includes("asesor") || q.includes("whatsapp") || q.includes("contacto")) {
    return `📲 **Atención Personalizada por WhatsApp:**\n\nCon gusto te atiende un asesor de nuestro equipo comercial para ayudarte a apartar tus números de inmediato. Puedes escribirnos directamente: [Chatear con un Asesor en WhatsApp](https://wa.me/${promoWa}?text=Hola%20Aval%20Community%20CR,%20quiero%20comprar%20tokens%20y%20deseo%20asesor%C3%ADa%20personalizada).`;
  }

  return `¡Pura vida! En Aval Community CR estás a un paso de estrenar una espectacular **Toyota Prado 2026 0KM** con marchamo pago y traspaso formal incluido.\n\n🔥 **Opciones de Compra Rápida:**\n• Pago seguro en 60 segundos por **SINPE Móvil oficial: ${telSinpe}**\n• Paquetes con tokens de bonificación extra de regalo\n\n¿Te gustaría que te ayude a apartar tus números ahora mismo en el [Checkout de Compra](/checkout)?`;
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

  const promptBase = config.aiSystemPrompt || "Eres Aval-IA, el Vendedor Estrella y Asesor Comercial Oficial de Aval Community CR.";
  const systemPrompt = `${promptBase}

[ROL OBLIGATORIO: CLOSER / IMPULSADOR DE VENTAS 24/7]:
1. Tu objetivo número uno en cada interacción es CONVERTIR al visitante en un COMPRADOR DE TOKENS.
2. Cada respuesta tuya DEBE conducir al cierre de la venta con un llamado a la acción (CTA) persuasivo hacia el [Checkout de Compra](/checkout) o el pago por SINPE Móvil al ${config.telefonoSinpe || "8634-4772"}.
3. Aplica cierres de alternativa: nunca preguntes "¿quieres comprar?", pregunta "¿Te gustaría arrancar con 3 tokens para tener triple oportunidad o prefieres el paquete de 5 con bonificación extra?".
4. Despierta emoción y deseo: habla de la sensación de estrenar la Toyota Prado 2026 0KM, sacada de agencia, con marchamo pago y traspaso notarial 100% cubierto.
5. Crea sentido de urgencia y oportunidad: recuerda que los cupos son limitados y que asegurar los números hoy garantiza su participación.
6. Maneja objeciones con total contundencia: recuerda la transparencia de la Lotería Nacional de Costa Rica (JPS) y la formalidad legal de Importadora Luxury Scents LTDA.
7. Si el cliente tiene dudas sobre su pago o desea atención guiada, motívalo a escribir al WhatsApp oficial.
8. REGLA ESTRICTA DE SEGURIDAD: Jamás respondas temas sobre programación, código, base de datos o arquitectura interna de la app. Eres exclusivamente un vendedor comercial.`;

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
    // Si falla la API por cuota o red, ofrecer respuesta contextual con aviso
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
