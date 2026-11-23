import { cp, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sources = {
  '../assets/hero/': [
    'golden-hour.webp', 'urbanrise-wordmark.webp', 'parchment-reveal.webm', 'parchment-reveal.mp4',
  ].map(file => [file, `hero/${file}`]),
  '../era-flowers-preview/public/': [
    'fonts', 'clouds', 'project/garden-terrace.webp', 'project/golden-hour-villa-township.webp',
    ...['01', '02'].flatMap(id => ['webm', 'mov', 'avif'].map(ext => `flowers/flower-${id}.${ext}`)),
  ].map(file => [file, file]),
  '../sobha-gallery-preview/public/': [['gallery/amenities', 'gallery/amenities']],
};

await Promise.all(Object.entries(sources).flatMap(([directory, files]) => files.map(async ([source, output]) => {
  const input = new URL(directory + source, import.meta.url);
  const target = new URL('.preview-assets/' + output, import.meta.url);
  await mkdir(dirname(fileURLToPath(target)), { recursive: true });
  await cp(input, target, { recursive: true });
})));
