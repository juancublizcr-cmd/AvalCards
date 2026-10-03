/**
 * Parser de correos bancarios de SINPE Móvil (BCR, BAC, BNCR).
 * Basado en la lógica de extracción regex de mensajero@bancobcr.com
 */

export interface BcrEmailParsed {
  esValido: boolean;
  banco: string;
  monto: number;
  referencia: string;
  fechaTransaccion: string;
  clienteOrigen: string;
  codigoDetectado?: string | null;
  rawText?: string;
}

/**
 * Normaliza texto eliminando etiquetas HTML y espacios redundantes
 */
export function normalizarTexto(texto: string): string {
  return texto
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extrae los campos bancarios de una notificación de depósito de BCR (mensajero@bancobcr.com)
 */
export function parsearCorreoBCR(cuerpoCorreo: string): BcrEmailParsed {
  const texto = normalizarTexto(cuerpoCorreo);

  // 1. Validar que sea un depósito oficial acreditado
  const esAcreditacion =
    texto.toLowerCase().includes("se le ha acreditado en su cuenta") ||
    texto.toLowerCase().includes("sinpe movil") ||
    texto.toLowerCase().includes("transferencia recibida");

  if (!esAcreditacion) {
    return {
      esValido: false,
      banco: "BCR",
      monto: 0,
      referencia: "",
      fechaTransaccion: "",
      clienteOrigen: "",
    };
  }

  // 2. Extraer Monto en colones
  let monto = 0;
  const matchMonto1 = texto.match(/Monto\s*:?\s*([0-9,]+\.[0-9]{2})/i);
  const matchMonto2 = texto.match(/([\d.,]+)\s*colones/i);

  if (matchMonto1) {
    monto = parseFloat(matchMonto1[1].replace(/,/g, ""));
  } else if (matchMonto2) {
    monto = parseFloat(matchMonto2[1].replace(/\./g, "").replace(/,/g, "."));
  }

  // 3. Extraer Número de Referencia SINPE
  let referencia = "";
  const matchRef = texto.match(/Referencia\s*:?\s*([0-9]+)/i);
  if (matchRef) {
    referencia = matchRef[1];
  } else {
    referencia = "REF-" + Math.floor(100000 + Math.random() * 900000);
  }

  // 4. Extraer Fecha y Hora
  let fechaTransaccion = new Date().toISOString();
  const matchFecha = texto.match(
    /realizada el\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})\s*a las\s*([0-9]{1,2}:[0-9]{2}\s*[AP]M)/i
  );
  if (matchFecha) {
    fechaTransaccion = `${matchFecha[1]} ${matchFecha[2]}`;
  }

  // 5. Extraer Nombre del Cliente Origen
  let clienteOrigen = "Cliente SINPE";
  const matchCliente = texto.match(/Nombre cliente origen\s*:?\s*([A-Z _]+?)(?:\s+Entidad|$)/i);
  if (matchCliente) {
    clienteOrigen = matchCliente[1].trim();
  }

  // 6. Extraer Código de Pedido en el Motivo / Detalle (ej: AVAL-582910 o pedido-582910)
  let codigoDetectado: string | null = null;
  const matchCodigo = texto.match(/(?:aval|pedido|orden|sg)\s*[-_]?\s*([0-9]{4,8})/i);
  if (matchCodigo) {
    codigoDetectado = `AVAL-${matchCodigo[1]}`;
  }

  return {
    esValido: monto > 0 && Boolean(referencia),
    banco: "BCR",
    monto,
    referencia,
    fechaTransaccion,
    clienteOrigen,
    codigoDetectado,
    rawText: texto,
  };
}

/**
 * Plantilla de correo simulado realista de Banco BCR para propósitos de demostración
 */
export function generarCorreoSimuladoBCR(monto: number, codigoPedido: string, nombreCliente: string): string {
  const ref = Math.floor(100000 + Math.random() * 900000).toString();
  const fecha = new Date().toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });

  return `Estimado(a) Cliente:
Le informamos que se le ha acreditado en su cuenta la siguiente transferencia por SINPE Móvil:
Monto: ${monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
Nombre cliente origen: ${nombreCliente.toUpperCase()} Entidad origen: BAC SAN JOSE
Referencia: ${ref}
realizada el ${fecha} a las ${hora}
Motivo: Pago orden ${codigoPedido}`;
}
