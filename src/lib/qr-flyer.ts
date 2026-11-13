import QRCode from "qrcode";

export interface QrFlyerOptions {
  url: string;
  subtitulo?: string;
  titulo?: string;
  descripcion?: string;
  footerTexto?: string;
  logoUrl?: string;
  formato?: "historia" | "afiche"; // historia: 1080x1920 (9:16), afiche: 1080x1520 (3:4)
  colorAcento?: string; // default: #f97316 (naranja Aval)
}

/**
 * Dibuja un rectángulo con esquinas redondeadas
 */
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
  ctx.arcTo(x, y + w, x, y, r);
  ctx.closePath();
}

/**
 * Carga una imagen de forma asíncrona
 */
function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
    img.src = src;
  });
}

/**
 * Genera el QR personalizado con esquinas suaves y logo central en un canvas independiente
 */
export async function generarQrCanvas(
  url: string,
  tamano: number = 700,
  logoUrl: string = "/isotipo.png"
): Promise<HTMLCanvasElement> {
  const qrData = QRCode.create(url, { errorCorrectionLevel: "H" });
  const moduleCount = qrData.modules.size;
  const cellSize = tamano / moduleCount;

  const canvas = document.createElement("canvas");
  canvas.width = tamano;
  canvas.height = tamano;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo inicializar canvas 2D");

  // Fondo blanco limpio
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, tamano, tamano);

  // Zona segura para el logo en el centro (círculo)
  const centerRadius = tamano * 0.16; // Radio del círculo del logo
  const centerX = tamano / 2;
  const centerY = tamano / 2;

  // Dibujar cada módulo con estilo redondeado moderno
  ctx.fillStyle = "#0c0d12";

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!qrData.modules.get(row, col)) continue;

      const x = col * cellSize;
      const y = row * cellSize;
      const moduleCenterX = x + cellSize / 2;
      const moduleCenterY = y + cellSize / 2;

      // Detectar si está en los 3 localizadores de las esquinas (Finder Patterns)
      const isTopLeft = row < 7 && col < 7;
      const isTopRight = row < 7 && col >= moduleCount - 7;
      const isBottomLeft = row >= moduleCount - 7 && col < 7;

      // Si está en la zona del logo central, no dibujar el módulo
      const distFromCenter = Math.hypot(moduleCenterX - centerX, moduleCenterY - centerY);
      if (distFromCenter < centerRadius + cellSize * 0.4) {
        continue;
      }

      if (isTopLeft || isTopRight || isBottomLeft) {
        // Los módulos de los localizadores los dibujamos suaves
        roundRect(ctx, x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.25);
        ctx.fill();
      } else {
        // Puntos redondeados estilo high-tech
        const dotRadius = (cellSize - 1.2) / 2;
        ctx.beginPath();
        ctx.arc(moduleCenterX, moduleCenterY, Math.max(1, dotRadius), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Cargar y estampar el logo de Aval en el centro
  try {
    const logoImg = await cargarImagen(logoUrl);

    // Fondo blanco circular para que el logo resalte
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius + 4, 0, Math.PI * 2);
    ctx.fill();

    // Borde fino gris suave
    ctx.strokeStyle = "#e4e4e7";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Recorte circular del logo
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius - 2, 0, Math.PI * 2);
    ctx.clip();

    const logoSize = (centerRadius - 2) * 2;
    ctx.drawImage(
      logoImg,
      centerX - logoSize / 2,
      centerY - logoSize / 2,
      logoSize,
      logoSize
    );
    ctx.restore();
  } catch (err) {
    console.warn("No se pudo superponer el logo central en el QR:", err);
  }

  return canvas;
}

/**
 * Genera el Flyer publicitario completo (1080px de ancho) exactamente al estilo de la referencia
 */
export async function generarFlyerCompletoCanvas(
  options: QrFlyerOptions
): Promise<HTMLCanvasElement> {
  const {
    url,
    subtitulo = "AVAL COMMUNITY CR",
    titulo = "Escaneá el QR",
    descripcion = "Apuntá la cámara del teléfono al código para ingresar a nuestra plataforma y ver los sorteos oficiales.",
    footerTexto = "www.avalcommunity.com",
    logoUrl = "/isotipo.png",
    formato = "afiche",
    colorAcento = "#f97316",
  } = options;

  const width = 1080;
  const height = formato === "historia" ? 1920 : 1580;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo inicializar canvas 2D");

  // 1. Fondo Oscuro Profundo (Carbon / Grafito)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#0c0d12");
  bgGrad.addColorStop(0.35, "#12131a");
  bgGrad.addColorStop(0.75, "#0a0b10");
  bgGrad.addColorStop(1, "#050608");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Resplandor / Glow Cálido detrás del QR (idéntico a la referencia)
  const glowCenterY = formato === "historia" ? 1120 : 960;
  const glow = ctx.createRadialGradient(width / 2, glowCenterY, 80, width / 2, glowCenterY, 520);
  glow.addColorStop(0, "rgba(234, 88, 12, 0.22)");
  glow.addColorStop(0.5, "rgba(245, 158, 11, 0.08)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, glowCenterY - 550, width, 1100);

  // 3. Logo Circular Superior
  const topLogoY = formato === "historia" ? 190 : 140;
  const topLogoRadius = 60;

  try {
    const logoImg = await cargarImagen(logoUrl);

    // Resplandor del logo superior
    const logoGlow = ctx.createRadialGradient(width / 2, topLogoY, 20, width / 2, topLogoY, 100);
    logoGlow.addColorStop(0, "rgba(249, 115, 22, 0.35)");
    logoGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = logoGlow;
    ctx.fillRect(width / 2 - 120, topLogoY - 120, 240, 240);

    // Marco exterior con borde fino
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(width / 2, topLogoY, topLogoRadius + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colorAcento;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Clip circular del logo
    ctx.beginPath();
    ctx.arc(width / 2, topLogoY, topLogoRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      logoImg,
      width / 2 - topLogoRadius,
      topLogoY - topLogoRadius,
      topLogoRadius * 2,
      topLogoRadius * 2
    );
    ctx.restore();
  } catch {
    // Fallback decorativo si no carga imagen
    ctx.save();
    ctx.fillStyle = colorAcento;
    ctx.beginPath();
    ctx.arc(width / 2, topLogoY, topLogoRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("AVAL", width / 2, topLogoY);
    ctx.restore();
  }

  // 4. Subtítulo Superior (Color Acento Naranja / Dorado con espaciado amplio)
  const subY = topLogoY + topLogoRadius + 55;
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = colorAcento;
  ctx.font = "900 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText(subtitulo.toUpperCase(), width / 2, subY);
  ctx.restore();

  // 5. Título Principal Grande: "Escaneá el QR" (Tipografía moderna y audaz)
  const titY = subY + 70;
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 68px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(titulo, width / 2, titY);
  ctx.restore();

  // 6. Descripción explicativa
  const descY = titY + 45;
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  // Dividir texto largo en 2 líneas si es necesario
  const maxDescWidth = 720;
  const palabras = descripcion.split(" ");
  let linea1 = "";
  let linea2 = "";

  for (const palabra of palabras) {
    if (ctx.measureText(linea1 + " " + palabra).width < maxDescWidth && !linea2) {
      linea1 += (linea1 ? " " : "") + palabra;
    } else {
      linea2 += (linea2 ? " " : "") + palabra;
    }
  }

  ctx.fillText(linea1, width / 2, descY);
  if (linea2) {
    ctx.fillText(linea2, width / 2, descY + 34);
  }
  ctx.restore();

  // 7. Tarjeta Blanca Redondeada (Card Contenedora del QR)
  const cardSize = 680;
  const cardX = (width - cardSize) / 2;
  const cardY = descY + (linea2 ? 75 : 55);

  ctx.save();
  // Sombra exterior suave de la tarjeta
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 15;

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 48);
  ctx.fill();
  ctx.restore();

  // 8. Generar y Estampar el Código QR dentro de la Tarjeta Blanca
  const qrPadding = 38;
  const qrInnerSize = cardSize - qrPadding * 2;
  const qrCanvas = await generarQrCanvas(url, qrInnerSize, logoUrl);

  ctx.drawImage(
    qrCanvas,
    cardX + qrPadding,
    cardY + qrPadding,
    qrInnerSize,
    qrInnerSize
  );

  // 9. Pastilla / Badge Inferior con Enlace
  const pillY = cardY + cardSize + 48;
  const pillHeight = 52;
  const pillWidth = 440;
  const pillX = (width - pillWidth) / 2;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 20px monospace";
  ctx.fillText(footerTexto, width / 2, pillY + 33);
  ctx.restore();

  // 10. Pie de Marca Oficial
  const footerY = pillY + 75;
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#6b7280";
  ctx.font = "600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("AVAL COMMUNITY CR · PLATAFORMA DE SORTEOS PREMIUM", width / 2, footerY);
  ctx.restore();

  return canvas;
}

/**
 * Descarga el afiche completo en alta resolución (PNG)
 */
export async function descargarFlyerCompleto(
  options: QrFlyerOptions,
  nombreArchivo: string = "Flyer-QR-AvalCommunity.png"
): Promise<void> {
  const canvas = await generarFlyerCompletoCanvas(options);
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  const link = document.createElement("a");
  link.download = nombreArchivo;
  link.href = dataUrl;
  link.click();
}

/**
 * Descarga únicamente el código QR transparente / recortado para imprenta
 */
export async function descargarSoloQrPng(
  url: string,
  logoUrl: string = "/isotipo.png",
  tamano: number = 1200,
  nombreArchivo: string = "Codigo-QR-Oficial-AvalCommunity.png"
): Promise<void> {
  const canvas = await generarQrCanvas(url, tamano, logoUrl);
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  const link = document.createElement("a");
  link.download = nombreArchivo;
  link.href = dataUrl;
  link.click();
}
