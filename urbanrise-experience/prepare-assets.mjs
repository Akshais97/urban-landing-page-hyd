import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sources = {
  '../assets/': [['logo.png', 'logo.png']],
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

// The original Story player embeds these four stills directly in its stylesheet.
const original = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const storyDirectory = new URL('.preview-assets/story/', import.meta.url);
await mkdir(storyDirectory, { recursive: true });
await Promise.all(['hero', 'video', 'intro', 'res'].map(async name => {
  const pattern = new RegExp(`\\.img-${name}\\s*\\{[^}]*?url\\(["']?data:image/jpeg;base64,([a-z0-9+/=]+)`, 'i');
  const [, encoded] = original.match(pattern) ?? [];
  if (!encoded) throw new Error(`The original Story image ${name} is missing from index.html`);
  await writeFile(new URL(`${name}.jpg`, storyDirectory), Buffer.from(encoded, 'base64'));
}));
