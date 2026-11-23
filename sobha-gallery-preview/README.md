# Urbanrise amenity gallery

A standalone Urbanrise preview of the tilted, scroll driven gallery. Ten amenity images from `Image_Bank.pptx` rotate through the gallery, with coordinated character reveals for “An Abundance of …” above each image and an animated amenity name below it. Scroll, use the previous/next controls, or use the left/right keys while the controls have focus. People who prefer reduced motion get the same amenities and headlines in a static grid. “View image” opens a larger image; Escape closes it.

The selected source slides are 9, 10, 4, 7, 6, 5, 8, 12, 13 and 16, in that order. General villa/family imagery and duplicate courtyard views are excluded. Originals remain in `../assets/image-bank`; responsive WebP versions at 800 and 1600 pixels wide are bundled in `public/gallery/amenities`. The mappings and captions are in `src/gallery-photos.js`.

Build and serve it from the repository root:

```powershell
npm --prefix sobha-gallery-preview ci
npm --prefix sobha-gallery-preview run build
python -m http.server 4173 --bind 127.0.0.1
```

Open [the preview](http://127.0.0.1:4173/sobha-gallery-preview/dist/). The project renders and fonts are bundled locally. Serve from the repository root so the Urbanrise link resolves to the landing page.
