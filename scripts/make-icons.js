import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

function generateFlamePng(size) {
  const width = size;
  const height = size;
  
  // Create RGBA image buffer with filter bytes
  const stride = width * 4 + 1; // 1 filter byte per line
  const rawData = Buffer.alloc(stride * height);
  
  // Center and scale
  const cx = width / 2;
  const cy = height / 2;
  const r = width / 2;
  
  // Flame shape logic
  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Normalized coords (-1 to 1)
      const nx = (x - cx) / (width * 0.42);
      const ny = (y - cy) / (height * 0.42);
      
      // Background rounded rect / circle
      const distFromCenter = Math.sqrt(nx * nx + ny * ny);
      
      // Flame math:
      // ny ranges from -1 (top) to 1 (bottom)
      // Flame base around ny = 0.4, top tip at ny = -0.7
      const flameBaseDist = Math.sqrt(nx * nx + (ny - 0.25) * (ny - 0.25));
      const inBase = flameBaseDist < 0.55;
      
      // Flame teardrop shape
      const tipY = -0.7;
      const baseY = 0.5;
      const inFlameH = ny >= tipY && ny <= baseY;
      const taper = (ny - tipY) / (baseY - tipY); // 0 at tip, 1 at base
      const maxW = Math.sin(taper * Math.PI) * 0.55;
      const inFlame = (inFlameH && Math.abs(nx) < maxW) || (flameBaseDist < 0.48);
      
      // Inner flame core
      const inCore = (ny >= -0.2 && ny <= 0.4 && Math.abs(nx) < maxW * 0.45);
      
      if (distFromCenter < 1.1) {
        // Dark background #111113
        if (inFlame) {
          if (inCore) {
            // Bright yellow/orange core #fde047
            rawData[pxOffset + 0] = 253; // R
            rawData[pxOffset + 1] = 224; // G
            rawData[pxOffset + 2] = 71;  // B
            rawData[pxOffset + 3] = 255; // A
          } else {
            // Vivid fire orange #f97316 to #ea580c gradient
            const grad = (ny + 0.7) / 1.2;
            rawData[pxOffset + 0] = 249;
            rawData[pxOffset + 1] = Math.min(255, Math.floor(100 + grad * 80));
            rawData[pxOffset + 2] = 22;
            rawData[pxOffset + 3] = 255;
          }
        } else if (distFromCenter >= 0.95 && distFromCenter <= 1.05) {
          // Orange glowing ring border
          rawData[pxOffset + 0] = 249;
          rawData[pxOffset + 1] = 115;
          rawData[pxOffset + 2] = 22;
          rawData[pxOffset + 3] = 180;
        } else {
          // Dark background #09090b
          rawData[pxOffset + 0] = 15;
          rawData[pxOffset + 1] = 15;
          rawData[pxOffset + 2] = 18;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent outside rounded corners
        rawData[pxOffset + 0] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }
  
  // Build PNG
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  
  const ihdrChunk = createChunk("IHDR", ihdr);
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressedData);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));
  
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function createIco(pngBuffers) {
  // ICO header: 6 bytes
  // Count entries * 16 bytes
  // Followed by PNG images
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(count, 4); // Number of images
  
  let offset = 6 + count * 16;
  const directoryEntries = [];
  
  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data
    
    directoryEntries.push(entry);
    offset += buffer.length;
  }
  
  return Buffer.concat([
    header,
    ...directoryEntries,
    ...pngBuffers.map(p => p.buffer)
  ]);
}

// Generate files
const sizes = [16, 32, 48, 64, 128, 192, 384, 512];
const generated = {};

for (const s of sizes) {
  generated[s] = generateFlamePng(s);
}

// Write public/icons
fs.mkdirSync("public/icons", { recursive: true });
fs.writeFileSync("public/icons/icon-192.png", generated[192]);
fs.writeFileSync("public/icons/icon-384.png", generated[384]);
fs.writeFileSync("public/icons/icon-512.png", generated[512]);
fs.writeFileSync("public/icons/icon-512-maskable.png", generated[512]);

// Create ICO containing 16, 32, 48
const icoBuffer = createIco([
  { size: 16, buffer: generated[16] },
  { size: 32, buffer: generated[32] },
  { size: 48, buffer: generated[48] }
]);

fs.writeFileSync("public/favicon.ico", icoBuffer);
fs.writeFileSync("public/favicon-32x32.png", generated[32]);
fs.writeFileSync("public/favicon-16x16.png", generated[16]);

// Copy to dist/client if exists
if (fs.existsSync("dist/client")) {
  fs.mkdirSync("dist/client/icons", { recursive: true });
  fs.writeFileSync("dist/client/favicon.ico", icoBuffer);
  fs.writeFileSync("dist/client/favicon-32x32.png", generated[32]);
  fs.writeFileSync("dist/client/favicon-16x16.png", generated[16]);
  fs.writeFileSync("dist/client/icons/icon-192.png", generated[192]);
  fs.writeFileSync("dist/client/icons/icon-384.png", generated[384]);
  fs.writeFileSync("dist/client/icons/icon-512.png", generated[512]);
}

console.log("✓ All Aval Community flame favicons generated successfully!");
