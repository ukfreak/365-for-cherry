const fs = require('fs');
const zlib = require('zlib');

function createPNG(width, height) {
  // Simple uncompressed or deflate PNG generator
  // Color type 6 (RGBA), bit depth 8
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // crc32
    let c = 0 ^ -1;
    for (let i = 0; i < typeBuf.length; i++) {
      c = (c >>> 8) ^ table[(c ^ typeBuf[i]) & 0xFF];
    }
    for (let i = 0; i < data.length; i++) {
      c = (c >>> 8) ^ table[(c ^ data[i]) & 0xFF];
    }
    crcBuf.writeUInt32BE((c ^ -1) >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // precompute crc32 table
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 400;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    raw[rowOffset] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 4;

      // Romantic background radial gradient
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Heart curve check: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      const hx = (x - cx) / (120 * scale);
      const hy = -(y - cy + 20 * scale) / (120 * scale);
      const heartEquation = Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * Math.pow(hy, 3);

      if (heartEquation <= 0) {
        // Inside heart: Gradient from blush pink to rose
        raw[px] = 243;     // R
        raw[px + 1] = 125; // G
        raw[px + 2] = 152; // B
        raw[px + 3] = 255; // A
      } else if (dist <= 0.95) {
        // Inside circle soft pastel background
        raw[px] = 255;     // R
        raw[px + 1] = 249; // G
        raw[px + 2] = 245; // B
        raw[px + 3] = 255; // A
      } else {
        // Outside circular border
        raw[px] = 248;     // R
        raw[px + 1] = 221; // G
        raw[px + 2] = 230; // B
        raw[px + 3] = dist <= 1 ? 255 : 0;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  return Buffer.concat([header, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

fs.mkdirSync('public/icons', { recursive: true });
fs.writeFileSync('public/icons/icon-192.png', createPNG(192, 192));
fs.writeFileSync('public/icons/icon-512.png', createPNG(512, 512));
console.log('Generated PNG icons successfully.');
