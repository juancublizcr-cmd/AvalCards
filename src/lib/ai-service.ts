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
    return `💳 **Método Oficial SINPE Móvil:**\n\n1. Transfiere al número oficial: **${telSinpe}** a nombre de **${razonSocial}**.\n2. En el detalle del pase coloca tu nombre y número de teléfono.\n3. Ve a la pantalla de [Checkout](/checkout), sube la captura de tu comprobante y ¡listo! Tus tokens quedarán apartados de inmediato.`;
  }

  if (q.includes("validar") || q.includes("token") || q.includes("número") || q.includes("numero") || q.includes("comprobante")) {
    return `🎟️ **Consulta y Validación de Tokens:**\n\nPuedes verificar el estado de tus compras y tus números asignados en cualquier momento ingresando a la sección de [Validar Tokens](/validar). Solo debes ingresar tu número de teléfono registrado.`;
  }

  if (q.includes("legal") || q.includes("estafa") || q.includes("segur") || q.includes("notario") || q.includes("loteria") || q.includes("lotería")) {
    return `⚖️ **Garantía y Legalidad en Costa Rica:**\n\n• La actividad se rige formalmente bajo la **Ley N° 7472** (Protección al Consumidor) organizada por **${razonSocial}**.\n• Los sorteos se auditan estrictamente con los números oficiales de la **Lotería Nacional de Costa Rica** (JPS).\n• Los premios mayores se entregan en persona ante **Notario Público**, con todos los gastos de traspaso, marchamo y derechos 100% cubiertos.`;
  }

  if (q.includes("raspa") || q.includes("ruleta") || q.includes("juego") || q.includes("express")) {
    return `🎡 **Juegos Express (Raspa y Ruleta):**\n\n¡Puedes ganar dinero en SINPE Móvil y tokens al instante!\n• En la pantalla principal toca el botón **"Raspa y Gana"** o **"Ruleta de la Fortuna"** para participar.\n• Si resultas premiado, el sistema te acredita el beneficio de inmediato.`;
  }

  if (q.includes("referid") || q.includes("amigo") || q.includes("compa") || q.includes("enlace") || q.includes("link")) {
    return `🎁 **Programa de Referidos ("Invita a un Compa"):**\n\nComparte tu enlace exclusivo con tus amigos. Cada vez que ellos compren tokens con tu enlace, tú ganas **comisiones en efectivo SINPE** o tokens de regalo, y tu amigo recibe **+1 Token Extra GRATIS** en su compra.`;
  }

  if (q.includes("humano") || q.includes("persona") || q.includes("asesor") || q.includes("whatsapp") || q.includes("contacto")) {
    return `📲 **Atención Humana por WhatsApp:**\n\nCon gusto te atiende un asesor de nuestro equipo comercial y de soporte. Puedes escribirnos directamente a nuestro WhatsApp oficial: [Haz clic aquí para chatear](https://wa.me/${promoWa}?text=Hola%20Aval%20Community%20CR,%20necesito%20ayuda%20con%20mi%20orden).`;
  }

  return `¡Pura vida! En Aval Community CR puedes adquirir tus tokens promocionales para estrenar premios premium como vehículos 0KM.\n\nPuedes consultarme sobre:\n• **Cómo pagar por SINPE Móvil**\n• **Cómo validar tus números de tokens**\n• **Reglas del sorteo y legalidad**\n\nO si prefieres, escríbenos directamente a nuestro WhatsApp de soporte: [Chatear en WhatsApp](https://wa.me/${promoWa}).`;
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

  const promptBase = config.aiSystemPrompt || "Eres el Asistente Oficial de Aval Community CR.";
  const systemPrompt = `${promptBase}\n\n[REGLAS ESTRICTAS DE SEGURIDAD Y ROL COMERCIAL]:
Eres única y exclusivamente un VENDEDOR E IMPULSADOR DE VENTAS de Aval Community CR para el público general.
Tienes TERMINANTEMENTE PROHIBIDO responder dudas sobre cómo está hecha, programada o desarrollada esta app web, qué tecnologías usa, bases de datos, código fuente, servidores o APIs.
Si te preguntan algo técnico o sobre la programación de la app, responde cordial y brevemente:
"¡Pura vida! Mi labor es exclusivamente comercial: asesorarte para que consigas tus tokens oficiales y participes por el vehículo 0KM y grandes premios. ¿Te gustaría conocer las opciones de compra de hoy?"
Tu objetivo primordial es orientar en compras de tokens, pagos por SINPE Móvil o pasarelas oficiales, explicar las reglas del sorteo oficial y motivar al cliente a participar.`;

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
