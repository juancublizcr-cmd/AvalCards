import type { Orden } from "@/lib/orders";
import type { Config } from "@/lib/admin-store";

export interface EnviarEmailParams {
  apiKey?: string;
  from?: string;
  to: string;
  orden: {
    id: string;
    nombre: string;
    telefono: string;
    email: string;
    cantidad: number;
    precio: number;
    numeros: string[];
    estado: "pendiente" | "aprobada" | "rechazada";
    supertoken?: boolean;
    monto_supertoken?: number;
    metodo_pago?: string;
    fecha?: string;
  };
  premioNombre?: string;
  asunto?: string;
  tipo?: "compra_nueva" | "aprobada" | "prueba";
  appUrl?: string;
}

function formatCRC(val: number | string): string {
  const num = Math.round(Number(val) || 0);
  return "₡" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Genera el HTML de la Tarjeta VIP de Aval para el correo electrónico.
 */
export function generarHtmlTarjetaAval(params: EnviarEmailParams): string {
  const { orden, premioNombre = "Vehículo o Moto de Alta Gama a Elección / Efectivo", tipo = "compra_nueva" } = params;
  const baseUrl = params.appUrl || (typeof window !== "undefined" ? window.location.origin : "https://avalcommunity.cr");
  const linkValidar = `${baseUrl}/validar?telefono=${encodeURIComponent(orden.telefono)}`;
  const linkWhatsApp = `https://wa.me/50688888888?text=${encodeURIComponent(`¡Hola Aval! Tengo una consulta sobre mi orden #${orden.id}`)}`;

  const esAprobada = orden.estado === "aprobada" || tipo === "aprobada";
  const badgeEstado = esAprobada
    ? `<span style="background-color: #064e3b; color: #34d399; border: 1.5px solid #059669; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">PAGO CONFIRMADO - TOKENS OFICIALES VALIDOS</span>`
    : `<span style="background-color: #451a03; color: #fbbf24; border: 1.5px solid #f59e0b; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">ORDEN REGISTRADA - QUEDA EN FIRME CON LA CONFIRMACION DEL SINPE MOVIL</span>`;

  const tokensHtml = (orden.numeros || [])
    .slice(0, 100)
    .map(
      (num) => `
      <div style="display: inline-block; margin: 4px; padding: 6px 12px; background: #18150d; border: 1px solid #d97706; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight: bold; color: #fbbf24; letter-spacing: 1px;">
        #${num}
      </div>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación Oficial - Aval Community CR</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5; -webkit-font-smoothing: antialiased;">
  <!-- Preheader oculto para vista previa limpia en Gmail -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #050505; opacity: 0;">
    Hola ${orden.nombre || "Participante"}, aquí tienes tus tokens asignados de Aval Community para el sorteo oficial.
  </div>
  
  <!-- Contenedor Principal Centrado -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 30px 10px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0b0b0c; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Barra de Acento Dorado Superior -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Encabezado con Logo -->
          <tr>
            <td style="padding: 28px 28px 16px 28px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                      AVAL <span style="color: #f59e0b;">COMMUNITY</span> CR
                    </div>
                    <div style="font-size: 10px; font-weight: 800; color: #a1a1aa; text-transform: uppercase; letter-spacing: 2.5px; margin-top: 4px;">
                      Plataforma Oficial de Sorteos Digitales
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mensaje de Bienvenida -->
          <tr>
            <td style="padding: 0 28px 20px 28px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                ${esAprobada ? "¡Tu Participación está 100% Confirmada!" : "¡Hemos recibido tu orden con éxito!"}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
                Hola <strong style="color: #ffffff;">${orden.nombre || "Participante"}</strong>, ${
                  esAprobada
                    ? "tu pago ha sido validado y tus tokens están listos para la Emisión Oficial de la JPS."
                    : "tus números han sido asignados y registrados en la plataforma. <strong>Tu participación queda en firme con la confirmación de tu SINPE Móvil.</strong>"
                }
              </p>
            </td>
          </tr>

          <!-- ═════════ LA TARJETA VIP DE AVAL ═════════ -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(145deg, #18140c 0%, #0d0d0e 60%, #080809 100%); border: 1.5px solid #d97706; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.15);">
                
                <!-- Encabezado de la Tarjeta -->
                <tr>
                  <td style="padding: 18px 20px; border-bottom: 1px solid rgba(217, 119, 6, 0.25); background: rgba(245, 158, 11, 0.05);">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; font-weight: 900; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px;">
                            CREDENCIAL DIGITAL OFICIAL
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: #ffffff; background: #000000; padding: 3px 8px; border-radius: 6px; border: 1px solid #3f3f46;">
                            #${orden.id}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Cuerpo de la Tarjeta: Datos del Participante -->
                <tr>
                  <td style="padding: 20px;">
                    
                    <div style="margin-bottom: 16px;">
                      ${badgeEstado}
                    </div>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
                      <tr>
                        <td style="color: #71717a; padding: 4px 0; width: 40%;">Titular:</td>
                        <td style="color: #ffffff; font-weight: 700; padding: 4px 0;">${orden.nombre}</td>
                      </tr>
                      <tr>
                        <td style="color: #71717a; padding: 4px 0;">Teléfono Celular:</td>
                        <td style="color: #ffffff; font-weight: 700; padding: 4px 0;">${orden.telefono}</td>
                      </tr>
                      <tr>
                        <td style="color: #71717a; padding: 4px 0;">Paquete:</td>
                        <td style="color: #f59e0b; font-weight: 800; padding: 4px 0;">
                          ${orden.cantidad} Tokens Digitales
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #71717a; padding: 4px 0;">Monto Cancelado:</td>
                        <td style="color: #ffffff; font-weight: 800; font-size: 15px; padding: 4px 0;">
                          ${formatCRC(orden.precio)}
                        </td>
                      </tr>
                      ${
                        orden.supertoken
                          ? `<tr>
                              <td style="color: #71717a; padding: 4px 0;">Opcion SuperToken:</td>
                              <td style="color: #fbbf24; font-weight: 700; padding: 4px 0;">Activo (Bono Extra en Colones)</td>
                            </tr>`
                          : ""
                      }
                      <tr>
                        <td style="color: #71717a; padding: 4px 0;">Premio en Juego:</td>
                        <td style="color: #ffffff; font-weight: 600; padding: 4px 0;">${premioNombre}</td>
                      </tr>
                      <tr>
                        <td style="color: #71717a; padding: 4px 0;">Validacion Oficial:</td>
                        <td style="color: #a1a1aa; padding: 4px 0;">Resultados Oficiales Junta de Proteccion Social (JPS)</td>
                      </tr>
                    </table>

                    <!-- Sección de Tokens Asignados -->
                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px dashed rgba(245, 158, 11, 0.3);">
                      <div style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                        TUS TOKENS ASIGNADOS (${orden.numeros?.length || 0}):
                      </div>
                      <div style="text-align: center;">
                        ${tokensHtml || '<span style="color:#71717a; font-size:12px;">Tokens en proceso de asignacion</span>'}
                      </div>
                    </div>

                  </td>
                </tr>

                <!-- Pie de la Tarjeta -->
                <tr>
                  <td style="padding: 12px 20px; background: rgba(0, 0, 0, 0.5); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                    <span style="font-size: 10px; color: #a1a1aa; letter-spacing: 0.5px;">
                      Respaldo Legal y Notarial - Entrega con Protocolo Formal ante Notario Publico
                    </span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Botón de Acción Principal -->
          <tr>
            <td style="padding: 0 28px 24px 28px; text-align: center;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                    <a href="${linkValidar}" target="_blank" style="font-size: 14px; font-weight: 900; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                      CONSULTAR Y VALIDAR MIS TOKENS
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 12px;">
                <a href="${linkValidar}" target="_blank" style="font-size: 11px; color: #f59e0b; text-decoration: underline;">
                  O ingresa a avalcommunity.com y valida con tu numero celular
                </a>
              </div>
            </td>
          </tr>

          <!-- Pilares de Confianza -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #141416; border-radius: 12px; padding: 14px; font-size: 11px; color: #a1a1aa; line-height: 1.5;">
                <tr>
                  <td>
                    <div style="color: #ffffff; font-weight: 700; margin-bottom: 4px;">
                      Transparencia Garantizada:
                    </div>
                    Todos los números son públicos y se verifican en vivo con la transmisión oficial de la JPS. Para cualquier consulta o asistencia personalizada con tu orden, puedes comunicarte con nuestro equipo oficial.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pie de Página Institucional -->
          <tr>
            <td style="padding: 20px 28px; background-color: #080809; border-top: 1px solid #1f1f23; text-align: center; font-size: 11px; color: #71717a; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; color: #a1a1aa; font-weight: 600;">
                Aval Community CR · San José, Costa Rica
              </p>
              <p style="margin: 0;">
                Este correo electrónico fue generado automáticamente tras tu registro en nuestra plataforma. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

export function generarTextoPlanoAval(params: EnviarEmailParams): string {
  const { orden, premioNombre = "Vehículo o Moto de Alta Gama a Elección / Efectivo" } = params;
  const baseUrl = params.appUrl || (typeof window !== "undefined" ? window.location.origin : "https://avalcommunity.com");
  return `¡Hola ${orden.nombre || "Participante"}!

Hemos registrado tu orden #${orden.id} en Aval Community CR.

DETALLES DE TU PARTICIPACIÓN:
- Titular: ${orden.nombre}
- Teléfono: ${orden.telefono}
- Paquete: ${orden.cantidad} Tokens Digitales
- Monto: ${formatCRC(orden.precio)}
- Premio: ${premioNombre}
- Estado: Tu participación queda en firme con la confirmación de tu SINPE Móvil.

TUS TOKENS ASIGNADOS:
${(orden.numeros || []).map((n) => `#${n}`).join(", ")}

Puedes consultar y validar tus números en cualquier momento en:
${baseUrl}/validar?telefono=${encodeURIComponent(orden.telefono)}

Gracias por formar parte de Aval Community CR.
San José, Costa Rica.`;
}

/**
 * Envía el correo mediante la API de Resend.
 * Intenta primero el endpoint local /api/send-email (para no exponer keys ni fallar por CORS en navegador)
 * y como respaldo directo a api.resend.com si se ejecuta en servidor.
 */
export async function enviarCorreoConfirmacionOrden(params: EnviarEmailParams): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const envKey = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_RESEND_API_KEY) ||
                   (typeof process !== "undefined" && process.env?.RESEND_API_KEY) || "";
    const apiKey = params.apiKey || envKey;
    const from = params.from || "Alex de Aval Community <contacto@avalcommunity.com>";
    const replyTo = "contacto@avalcommunity.com";
    const subject =
      params.asunto ||
      (params.tipo === "aprobada"
        ? `Tus tokens confirmados de Aval Community`
        : `Tus tokens de participacion en Aval Community`);

    const html = generarHtmlTarjetaAval(params);
    const text = generarTextoPlanoAval(params);

    // 1. Intentar endpoint interno /api/send-email
    try {
      const resp = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          from,
          reply_to: replyTo,
          to: params.to,
          subject,
          html,
          text,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        return { ok: true, id: data.id };
      }
    } catch {
      // Si falla la ruta local, intentar directo si hay apiKey disponible
    }

    // 2. Envío directo a Resend
    if (!apiKey) {
      return {
        ok: false,
        error: "No se ha configurado la API Key de Resend en el Panel de Administración.",
      };
    }

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        reply_to: replyTo,
        to: [params.to],
        subject,
        html,
        text,
      }),
    });

    const resendData = await resendResp.json().catch(() => ({}));
    if (!resendResp.ok) {
      return { ok: false, error: resendData.message || "Error al enviar correo con Resend" };
    }

    return { ok: true, id: resendData.id };
  } catch (err: any) {
    console.error("Error en enviarCorreoConfirmacionOrden:", err);
    return { ok: false, error: err.message || "Excepción al enviar correo" };
  }
}
