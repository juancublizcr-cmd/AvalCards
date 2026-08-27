import type { Orden } from "@/lib/orders";

/**
 * Genera y descarga una imagen PNG de alta resolución con el Tiquete Digital Oficial de Aval Motors CR
 */
export async function descargarTiqueteImagen(orden: Orden, premioMayor = "1° Lugar"): Promise<void> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Dimensiones HD (1200 x 1600 para tarjeta vertical de lujo)
  const width = 1080;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  // 1. Fondo Gradiente Oscuro de Lujo
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#18181b");
  bgGrad.addColorStop(0.5, "#09090b");
  bgGrad.addColorStop(1, "#000000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Marco Exterior Dorado/Naranja
  ctx.strokeStyle = orden.supertoken ? "#f59e0b" : "#ea580c";
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // 3. Encabezado / Logo
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px 'Bebas Neue', sans-serif, Arial";
  ctx.textAlign = "center";
  ctx.fillText("AVAL MOTORS CR", width / 2, 130);

  ctx.fillStyle = "#f97316";
  ctx.font = "bold 24px sans-serif, Arial";
  ctx.letterSpacing = "3px";
  ctx.fillText("COMPROBANTE DIGITAL OFICIAL DE PARTICIPACIÓN", width / 2, 175);

  ctx.strokeStyle = "#3f3f46";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 210);
  ctx.lineTo(width - 100, 210);
  ctx.stroke();

  // 4. Badge SuperToken si aplica
  let currentY = 270;
  if (orden.supertoken) {
    const badgeGrad = ctx.createLinearGradient(120, currentY - 35, width - 120, currentY + 35);
    badgeGrad.addColorStop(0, "#d97706");
    badgeGrad.addColorStop(0.5, "#f59e0b");
    badgeGrad.addColorStop(1, "#d97706");
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(100, currentY - 40, width - 200, 70, 20);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.font = "bold 26px sans-serif, Arial";
    ctx.textAlign = "center";
    ctx.fillText("👑 SUPERTOKEN ACTIVO · CALIFICA PARA +$6,000 USD CASH", width / 2, currentY + 4);
    currentY += 85;
  }

  // 5. Caja de Datos del Participante
  const boxY = currentY;
  const boxHeight = 270;
  ctx.fillStyle = "#18181b";
  ctx.beginPath();
  ctx.roundRect(90, boxY, width - 180, boxHeight, 24);
  ctx.fill();
  ctx.strokeStyle = "#3f3f46";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 20px sans-serif, Arial";

  // Columna 1
  ctx.fillText("TITULAR:", 130, boxY + 55);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif, Arial";
  ctx.fillText(orden.nombre.toUpperCase(), 130, boxY + 90);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 20px sans-serif, Arial";
  ctx.fillText("TELÉFONO REGISTRADO:", 130, boxY + 160);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px monospace, sans-serif";
  ctx.fillText(orden.telefono, 130, boxY + 195);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 20px sans-serif, Arial";
  ctx.fillText("MÉTODO DE PAGO:", 130, boxY + 235);
  ctx.fillStyle = "#f97316";
  ctx.font = "bold 22px sans-serif, Arial";
  ctx.fillText((orden.metodo_pago || "SINPE Móvil").toUpperCase(), 320, boxY + 235);

  // Columna 2
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 20px sans-serif, Arial";
  ctx.fillText("ORDEN N°:", 620, boxY + 55);
  ctx.fillStyle = "#f97316";
  ctx.font = "bold 28px monospace, sans-serif";
  ctx.fillText(orden.id, 620, boxY + 90);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 20px sans-serif, Arial";
  ctx.fillText("ESTADO:", 620, boxY + 160);
  ctx.fillStyle = orden.estado === "aprobada" ? "#22c55e" : "#eab308";
  ctx.font = "bold 24px sans-serif, Arial";
  ctx.fillText(orden.estado === "aprobada" ? "✓ APROBADA / OFICIAL" : "⏳ EN REVISIÓN", 620, boxY + 195);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "bold 20px sans-serif, Arial";
  ctx.fillText("TOTAL PAGADO:", 620, boxY + 235);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px monospace, sans-serif";
  ctx.fillText(`₡${orden.precio.toLocaleString("es-CR")}`, 780, boxY + 235);

  // 6. Tokens Asignados
  const tokensY = boxY + boxHeight + 40;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif, Arial";
  ctx.fillText(`TUS TOKENS DIGITALES (${orden.cantidad})`, width / 2, tokensY);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "18px sans-serif, Arial";
  ctx.fillText(`Participando por: ${premioMayor} 0KM`, width / 2, tokensY + 30);

  // Grilla de números
  const nums = orden.numeros || [];
  const cols = nums.length <= 8 ? 4 : nums.length <= 16 ? 4 : 6;
  const cardWidth = Math.min(180, (width - 180 - (cols - 1) * 16) / cols);
  const cardHeight = 65;
  const startGridY = tokensY + 60;

  const totalGridWidth = cols * cardWidth + (cols - 1) * 16;
  const startGridX = (width - totalGridWidth) / 2;

  nums.forEach((num, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startGridX + col * (cardWidth + 16);
    const y = startGridGridPos(startGridY, row, cardHeight);

    ctx.fillStyle = orden.supertoken ? "rgba(245, 158, 11, 0.15)" : "rgba(249, 115, 22, 0.12)";
    ctx.beginPath();
    ctx.roundRect(x, y, cardWidth, cardHeight, 12);
    ctx.fill();

    ctx.strokeStyle = orden.supertoken ? "#f59e0b" : "#ea580c";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = orden.supertoken ? "#fde047" : "#ffedd5";
    ctx.font = "bold 30px monospace, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(num, x + cardWidth / 2, y + 44);
  });

  // 7. Pie de Certificado & Garantía Legal
  const footerY = height - 160;
  ctx.strokeStyle = "#3f3f46";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, footerY - 25);
  ctx.lineTo(width - 100, footerY - 25);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 20px sans-serif, Arial";
  ctx.fillText("🛡️ EVENTO 100% AUDITADO Y CERTIFICADO ANTE NOTARIO PÚBLICO", width / 2, footerY + 10);

  ctx.fillStyle = "#71717a";
  ctx.font = "16px sans-serif, Arial";
  ctx.fillText("Operado por Importadora Luxury Scents LTDA · Costa Rica", width / 2, footerY + 40);
  ctx.fillText("Valida este tiquete en cualquier momento en: https://avalmotors.cr/validar", width / 2, footerY + 70);

  // Convertir canvas a Blob y forzar descarga
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Tiquete-AvalMotors-${orden.id}.png`;
      link.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

function startGridGridPos(baseY: number, row: number, height: number): number {
  return baseY + row * (height + 12);
}
