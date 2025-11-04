// convert-to-webp.js (ES Module för Node 18+)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hantera __dirname i ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bildmapp relativt från js/
const inputDir = path.join(__dirname, '../assets/img');
const outputSizes = [320, 640, 1280];
const outputQuality = 100;

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  
  if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    const inputPath = path.join(inputDir, file);

    outputSizes.forEach(size => {
      const outputPath = path.join(inputDir, `${baseName}-${size}.webp`);
      sharp(inputPath)
        .resize({ width: size })
        .webp({ quality: outputQuality })
        .toFile(outputPath)
        .then(() => console.log(`✅ ${file} → ${path.basename(outputPath)}`))
        .catch(err => console.error(`❌ Fel: ${file}`, err));
    });
  }
});


