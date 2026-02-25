/**
 * Generiert PWA-Icons als PNG.
 * Ausführen: node scripts/generate-icons.mjs
 */
import { writeFileSync } from 'fs';

// Einfaches 1x1-Pixel-PNG als Platzhalter (grün #2E7D32)
// Für Production: ersetze mit echten Icons via https://realfavicongenerator.net

const sizes = [192, 512];

// Minimales PNG generieren (einfarbig grün mit Text)
// Da wir kein canvas in Node haben, erstellen wir eine HTML-Seite die die PNGs generiert
const html = `<!DOCTYPE html>
<html>
<body>
<script>
const sizes = [192, 512];
sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Hintergrund
    ctx.fillStyle = '#2E7D32';
    const r = size * 0.16;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.fill();

    // Flugzeug-Emoji
    ctx.font = \`\${size * 0.45}px Arial\`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText('✈️', size / 2, size * 0.4);

    // VT Text
    ctx.font = \`bold \${size * 0.18}px Arial\`;
    ctx.fillText('VacaTrack', size / 2, size * 0.78);

    // Download
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = \`pwa-\${size}x\${size}.png\`;
    a.textContent = \`Download \${size}x\${size}\`;
    a.click();
});
document.body.innerHTML = '<h1>Icons generiert! Lege sie in /public/</h1>';
<\/script>
</body>
</html>`;

writeFileSync('generate-icons.html', html);
console.log('Öffne generate-icons.html im Browser um die PNGs zu generieren.');
console.log('Oder nutze https://realfavicongenerator.net für professionelle Icons.');
