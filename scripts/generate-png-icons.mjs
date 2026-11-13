import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function generateCarePathPng(width, height) {
  // RGBA pixels
  const rowBytes = 1 + width * 4; // 1 filter byte per row
  const rawData = Buffer.alloc(rowBytes * height);

  const TEAL = [23, 76, 69, 255];       // #174C45
  const SAGE = [76, 154, 131, 255];     // #4C9A83
  const CREAM = [241, 232, 218, 255];   // #F1E8DA

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;

      // Medical cross dimensions
      const crossThick = width * 0.12;
      const crossLen = width * 0.34;
      const inCrossH = Math.abs(dy) <= crossThick && Math.abs(dx) <= crossLen;
      const inCrossV = Math.abs(dx) <= crossThick && Math.abs(dy) <= crossLen;

      // Center dot
      const inCenterDot = (dx * dx + dy * dy) <= (crossThick * 0.4) ** 2;

      // Border ring
      const r = Math.sqrt(dx * dx + dy * dy);
      const ringRadius = width * 0.44;
      const inRing = Math.abs(r - ringRadius) <= (width * 0.015);

      if (inCenterDot) {
        rawData.set(TEAL, pxOffset);
      } else if (inCrossH || inCrossV) {
        rawData.set(CREAM, pxOffset);
      } else if (inRing) {
        rawData.set(SAGE, pxOffset);
      } else {
        rawData.set(TEAL, pxOffset);
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // Deflate compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve('public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), generateCarePathPng(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), generateCarePathPng(512, 512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), generateCarePathPng(512, 512));

console.log('✅ Generated 192x192 and 512x512 PWA icons successfully in public/icons/');
