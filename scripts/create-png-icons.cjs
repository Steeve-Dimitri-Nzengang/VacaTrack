// Erzeugt minimale einfarbige PNG-Icons für die PWA
// Ausführen: node scripts/create-png-icons.cjs

const fs = require('fs');
const zlib = require('zlib');

function createPNG(size, color) {
    // color: [R, G, B]
    const width = size;
    const height = size;

    // Raw pixel data: filter byte (0) + RGB für jedes Pixel
    const rawData = [];
    for (let y = 0; y < height; y++) {
        rawData.push(0); // filter: None
        for (let x = 0; x < width; x++) {
            rawData.push(color[0], color[1], color[2]);
        }
    }

    const rawBuf = Buffer.from(rawData);
    const compressed = zlib.deflateSync(rawBuf);

    // PNG Signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 2;  // color type: RGB
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const ihdrChunk = makeChunk('IHDR', ihdr);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    const typeBuffer = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBuffer, data]);

    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData), 0);

    return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
        }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Grün: #2E7D32
const color = [0x2E, 0x7D, 0x32];

const png192 = createPNG(192, color);
const png512 = createPNG(512, color);

fs.writeFileSync('public/pwa-192x192.png', png192);
fs.writeFileSync('public/pwa-512x512.png', png512);

console.log('✅ pwa-192x192.png (' + png192.length + ' bytes)');
console.log('✅ pwa-512x512.png (' + png512.length + ' bytes)');
console.log('Icons erstellt in public/');
