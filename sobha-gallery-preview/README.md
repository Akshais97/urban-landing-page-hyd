# The Living Wave gallery

A standalone Urbanrise preview of the tilted, scroll driven gallery from Sobha’s Handpicked chapter. It uses nine local project photos, a forest green background and controls for stepping through the ring or opening a larger image. People who prefer reduced motion get the same photos in a grid.

Build and serve it from the repository root:

```powershell
npm --prefix sobha-gallery-preview ci
npm --prefix sobha-gallery-preview run build
python -m http.server 4173 --bind 127.0.0.1
```

Open [the preview](http://127.0.0.1:4173/sobha-gallery-preview/dist/). The project renders and fonts are bundled locally. Serve from the repository root so the Urbanrise link resolves to the landing page.
