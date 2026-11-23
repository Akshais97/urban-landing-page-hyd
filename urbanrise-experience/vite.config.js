import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const footerSource = new URL('../footer.html', import.meta.url);
const footerMarker = '<!-- CUSTOM_FOOTER -->';

export default defineConfig({
  base: './',
  publicDir: '.preview-assets',
  plugins: [{
    name: 'urbanrise-custom-footer',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        if (!html.includes(footerMarker)) return html;
        const source = await readFile(footerSource, 'utf8');
        const [footer] = source.match(/<footer\b[^>]*class="ur-finale"[^>]*>[\s\S]*?<\/footer>/) ?? [];
        if (!footer) throw new Error('The custom footer is missing from footer.html');
        return html.replace(footerMarker, () => footer
          .replace('<footer class="ur-finale"', '<footer class="ur-finale" id="footer"')
          .replace(/<(\/?)h1\b/g, '<$1h2')
          .replace('src="assets/logo.png"', 'src="%BASE_URL%logo.png"')
          .replace('href="index.html#access"', 'href="#access"')
          .replace('href="index.html#residences"', 'href="#lineup"')
          .replace('href="#ur-closing-top"', 'href="#home"'));
      },
    },
  }],
  resolve: {
    dedupe: ['react', 'react-dom', 'gsap', '@gsap/react', 'framer-motion'],
  },
  server: { fs: { allow: [workspace] } },
});
