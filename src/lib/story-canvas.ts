/**
 * Generador de Historias / Estados de WhatsApp e Instagram (1080x1920 - 9:16)
 * Aval Community CR - Diseño Ultra HD Multi-Premio
 */

export type StoryData = {
  nombre: string;
  telefono: string;
  tokens: string[];
  premioMayor?: string | undefined;
  ordenId?: string | undefined;
  supertoken?: boolean | undefined;
  esReferido?: boolean | undefined;
};

export async function generarImagenHistoria(data: StoryData): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener contexto 2D de canvas");

  // 1. Fondo Oscuro de Lujo con Gradientes
  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, "#08080a");
  grad.addColorStop(0.3, "#140e0a");
  grad.addColorStop(0.7, "#0d0a0e");
  grad.addColorStop(1, "#060608");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  // 2. Luces Neón / Glows de Fondo
  const glowTop = ctx.createRadialGradient(540, 260, 40, 540, 260, 460);
  glowTop.addColorStop(0, "rgba(234, 88, 12, 0.28)");
  glowTop.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowTop;
  ctx.fillRect(0, 0, 1080, 700);

  const glowBottom = ctx.createRadialGradient(540, 1550, 40, 540, 1550, 550);
  glowBottom.addColorStop(0, "rgba(245, 158, 11, 0.18)");
  glowBottom.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowBottom;
  ctx.fillRect(0, 1100, 1080, 820);

  ctx.textAlign = "center";

  // 3. Header Branding
  ctx.fillStyle = "#ea580c";
  ctx.font = "900 38px sans-serif";
  ctx.fillText("🔥 AVAL COMMUNITY CR 🔥", 540, 105);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "700 20px sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("PLATAFORMA DIGITAL DE PREMIOS PREMIUM", 540, 145);

  // 4. Titular Principal
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 56px sans-serif";
  ctx.fillText("¡ESTOY PARTICIPANDO", 540, 235);
  ctx.fillStyle = "#f59e0b";
  ctx.font = "900 58px sans-serif";
  ctx.fillText("POR EL PREMIO MAYOR!", 540, 305);

  // ────────────────────────────────────────────────────────────
  // 5. TARJETA 1: PREMIO OFICIAL EN DISPUTA (Y: 360, H: 400)
  // ────────────────────────────────────────────────────────────
  const boxX = 70;
  const boxW = 940;
  const c1Y = 360;
  const c1H = 400;

  ctx.fillStyle = "rgba(20, 20, 25, 0.9)";
  ctx.strokeStyle = "rgba(234, 88, 12, 0.55)";
  ctx.lineWidth = 4;
  roundRect(ctx, boxX, c1Y, boxW, c1H, 36);
  ctx.fill();
  ctx.stroke();

  // Badge del Gran Sorteo
  ctx.fillStyle = "#ea580c";
  roundRect(ctx, 540 - 220, c1Y + 30, 440, 54, 27);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 24px sans-serif";
  ctx.fillText("🏆 GRAN SORTEO OFICIAL", 540, c1Y + 66);

  // Nombre del Premio Dinámico (con auto-escalado de fuente para evitar desbordes)
  const premioNombre = (data.premioMayor || "PREMIOS DEL SORTEO OFICIAL").trim().toUpperCase();
  ctx.fillStyle = "#ffffff";
  const fontSizePremio = premioNombre.length > 25 ? 36 : premioNombre.length > 18 ? 44 : 50;
  ctx.font = `900 ${fontSizePremio}px sans-serif`;
  ctx.fillText(premioNombre, 540, c1Y + 160);

  ctx.fillStyle = "#10b981";
  ctx.font = "800 30px sans-serif";
  ctx.fillText("+ BONOS EN EFECTIVO Y PREMIOS EN CASH 💵", 540, c1Y + 225);

  ctx.fillStyle = "#d4d4d8";
  ctx.font = "500 24px sans-serif";
  ctx.fillText("Entrega formal y legal respaldada ante notario público", 540, c1Y + 280);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "800 26px sans-serif";
  ctx.fillText("⭐ Resultados Oficiales de Lotería Nacional (JPS) ⭐", 540, c1Y + 345);

  // ────────────────────────────────────────────────────────────
  // 6. TARJETA 2: DATOS DEL PARTICIPANTE Y TOKENS (Y: 790, H: 500)
  // ────────────────────────────────────────────────────────────
  const c2Y = 790;
  const c2H = 500;

  ctx.fillStyle = "rgba(18, 18, 22, 0.95)";
  ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
  ctx.lineWidth = 4;
  roundRect(ctx, boxX, c2Y, boxW, c2H, 36);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "700 22px sans-serif";
  ctx.fillText("PARTICIPANTE OFICIAL VERIFICADO", 540, c2Y + 50);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 46px sans-serif";
  const nombreMostrar = data.nombre ? data.nombre.slice(0, 26) : "Participante";
  ctx.fillText(nombreMostrar, 540, c2Y + 110);

  ctx.fillStyle = "#ea580c";
  ctx.font = "800 24px sans-serif";
  ctx.fillText("MIS NÚMEROS / TOKENS DE LA SUERTE:", 540, c2Y + 165);

  // Tokens en Cuadrícula
  const tokensMostrar = (data.tokens && data.tokens.length > 0 ? data.tokens : ["28871", "29088", "94375", "10205"]).slice(0, 6);
  const totalTokens = tokensMostrar.length;
  const cols = totalTokens <= 3 ? totalTokens : Math.ceil(totalTokens / 2);
  const cellW = 240;
  const startX = 540 - (cols * (cellW + 20) - 20) / 2;

  tokensMostrar.forEach((tok, idx) => {
    const row = totalTokens <= 3 ? 0 : Math.floor(idx / cols);
    const col = totalTokens <= 3 ? idx : idx % cols;
    const tx = startX + col * (cellW + 20);
    const ty = c2Y + 200 + row * 92;

    ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
    ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
    ctx.lineWidth = 3;
    roundRect(ctx, tx, ty, cellW, 72, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "900 36px monospace";
    ctx.fillText(`#${tok}`, tx + cellW / 2, ty + 50);
  });

  // Badge SuperToken o Validación
  if (data.supertoken) {
    ctx.fillStyle = "#10b981";
    ctx.font = "800 22px sans-serif";
    ctx.fillText("👑 SUPERTOKEN ACTIVO (ACCESO AL BONO EXTRA EN CASH)", 540, c2Y + c2H - 35);
  } else {
    ctx.fillStyle = "#10b981";
    ctx.font = "800 22px sans-serif";
    ctx.fillText("✓ BOLETO DIGITAL OFICIAL REGISTRADO EN PLATAFORMA", 540, c2Y + c2H - 35);
  }

  // ────────────────────────────────────────────────────────────
  // 7. TARJETA 3: FOOTER DE REFERIDOS Y ENLACE (Y: 1320, H: 470)
  // ────────────────────────────────────────────────────────────
  const c3Y = 1320;
  const c3H = 470;

  ctx.fillStyle = "rgba(234, 88, 12, 0.1)";
  ctx.strokeStyle = "rgba(234, 88, 12, 0.5)";
  ctx.lineWidth = 3;
  roundRect(ctx, boxX, c3Y, boxW, c3H, 36);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f59e0b";
  ctx.font = "900 36px sans-serif";
  ctx.fillText("🎁 ¡ÚNETE CON MI ENLACE Y RECIBE UN REGALO!", 540, c3Y + 65);

  ctx.fillStyle = "#e4e4e7";
  ctx.font = "600 26px sans-serif";
  ctx.fillText("Recibe +1 Token Extra de Regalo en tu compra:", 540, c3Y + 120);

  const telLimpio = data.telefono.replace(/\D/g, "");
  const linkRef = `www.avalcomunity.com/?ref=${telLimpio}`;

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 2;
  roundRect(ctx, 130, c3Y + 160, 820, 80, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 30px monospace";
  ctx.fillText(linkRef, 540, c3Y + 212);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "700 22px sans-serif";
  ctx.fillText("📲 Escríbeme al WhatsApp para pasarte el link directo", 540, c3Y + 295);

  ctx.fillStyle = "#71717a";
  ctx.font = "500 19px sans-serif";
  ctx.fillText("Aval Community CR · Importadora Luxury Scents LTDA", 540, c3Y + 360);

  return canvas.toDataURL("image/png");
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
