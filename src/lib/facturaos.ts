/**
 * Cliente de Facturación Electrónica para AvalCar
 * Conectado a FacturaOS Hub v4.4
 */

export const DEFAULT_FACTURAOS_API_URL = "http://localhost:3000/api/v1/invoices";
export const DEFAULT_AVALCAR_API_KEY = "fct_live_avalcarcr_7c9a1e3f5b2d8a4c6e";
export const AVALCAR_EST_CODE = "avalcar_cr";

export const FACTURAOS_API_URL = DEFAULT_FACTURAOS_API_URL;
export const AVALCAR_API_KEY = DEFAULT_AVALCAR_API_KEY;

export function getFacturaOSConfig() {
  const apiUrl = localStorage.getItem("facturaos_api_url") || DEFAULT_FACTURAOS_API_URL;
  const apiKey = localStorage.getItem("facturaos_api_key") || DEFAULT_AVALCAR_API_KEY;
  return { apiUrl, apiKey };
}

export function saveFacturaOSConfig(apiUrl: string, apiKey: string) {
  localStorage.setItem("facturaos_api_url", apiUrl.trim());
  localStorage.setItem("facturaos_api_key", apiKey.trim());
}

export async function verificarConexionFacturaOS(apiUrl?: string, apiKey?: string) {
  const current = getFacturaOSConfig();
  const rawUrl = (apiUrl || current.apiUrl).trim();
  const token = (apiKey || current.apiKey).trim();

  let baseApi = rawUrl.replace(/\/emit\/?$/, "").replace(/\/invoices\/?$/, "");
  if (!baseApi.endsWith("/api/v1")) {
    baseApi = `${baseApi.replace(/\/$/, "")}/api/v1`;
  }

  const response = await fetch(`${baseApi}/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Error al conectar con FacturaOS (${response.status})`);
  }
  return data;
}

export interface EmitFacturaAvalCarParams {
  docType?: "01" | "04"; // 01: Factura Electrónica, 04: Tiquete Electrónico
  monto: number;
  detalle: string;
  metodo?: string; // efectivo, tarjeta, transferencia, sinpe
  cabys?: string;
  client?: {
    idType: string;
    idNumber: string;
    name: string;
    email?: string;
    phone?: string;
  };
  notes?: string;
}

export interface FacturaOSResponse {
  success: boolean;
  status: string;
  consecutiveNumber: string;
  clave: string;
  issueDate: string;
  total: number;
  tax: number;
  subtotal: number;
  xmlUrl: string;
  haciendaXmlUrl: string;
  pdfUrl: string;
  establishment: {
    code: string;
    name: string;
    legalId: string;
    app: string;
  };
  haciendaResponse?: {
    indEstado?: string;
    mensaje?: string;
  };
}

export async function emitirFacturaAvalCar(params: EmitFacturaAvalCarParams): Promise<FacturaOSResponse> {
  const { docType = "04", monto, detalle, metodo = "efectivo", cabys = "8714100000000", client, notes } = params;

  let paymentMethod = "01"; // Efectivo
  const m = metodo.toLowerCase();
  if (m.includes("tarjeta")) paymentMethod = "02";
  else if (m.includes("sinpe") || m.includes("transf")) paymentMethod = "04";

  const subtotal = Math.round((monto / 1.13) * 100) / 100;

  const payload = {
    docType,
    paymentMethod,
    saleCondition: "01",
    currency: "CRC",
    notes: notes || `Cobro en AvalCar - ${detalle}`,
    client: docType === "01" && client ? client : undefined,
    items: [
      {
        cabys,
        detail: detalle,
        qty: 1,
        unitPrice: subtotal,
        ivaRate: 13,
        unit: "Sp",
      },
    ],
  };

  const { apiUrl, apiKey } = getFacturaOSConfig();
  const emitEndpoint = apiUrl.endsWith("/emit") ? apiUrl : `${apiUrl.replace(/\/$/, "")}/emit`;

  const response = await fetch(emitEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Error al emitir factura en FacturaOS (${response.status})`);
  }

  return await response.json();
}
