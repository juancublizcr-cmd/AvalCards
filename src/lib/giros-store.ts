// Gestor de Giros / Raspas Disponibles (Modelo Híbrido Aval Motors CR)

export interface GirosInfo {
  giros: number;
  ordenId?: string;
  telefono?: string;
  nombre?: string;
  tipo: "bono_tokens" | "compra_individual" | "demo";
}

const STORAGE_KEY = "aval_giros_express_v1";

export function calcularGirosPorTokens(cantidadTokens: number): number {
  if (cantidadTokens >= 24) return 6;
  if (cantidadTokens >= 12) return 3;
  if (cantidadTokens >= 8) return 2;
  if (cantidadTokens >= 4) return 1;
  return 1;
}

export function obtenerGirosLocales(): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return 0;
    const parsed: GirosInfo = JSON.parse(data);
    return Math.max(0, parsed.giros || 0);
  } catch {
    return 0;
  }
}

export function guardarGiros(info: GirosInfo): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (err) {
    console.error("Error guardando giros:", err);
  }
}

export function consumirUnGiro(): number {
  if (typeof window === "undefined") return 0;
  try {
    const actuales = obtenerGirosLocales();
    const restantes = Math.max(0, actuales - 1);
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed: GirosInfo = data ? JSON.parse(data) : { giros: 0, tipo: "demo" };
    parsed.giros = restantes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return restantes;
  } catch {
    return 0;
  }
}

export function recargarGirosManual(cantidad: number, telefono: string = "", tipo: GirosInfo["tipo"] = "compra_individual"): void {
  const actuales = obtenerGirosLocales();
  guardarGiros({
    giros: actuales + cantidad,
    telefono,
    tipo,
  });
}
