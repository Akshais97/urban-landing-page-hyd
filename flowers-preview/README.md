# LifeScape flower sequence

This standalone preview adapts the first flower-bearing section of ERA Residence. It moves from the concept to the terrace and ends at “Life opens outdoors.” Desktop scroll moves the two panels horizontally. Mobile and reduced motion use a vertical layout.

Build the preview and serve it from the Urbanrise repository root:

```powershell
npm --prefix era-flowers-preview ci
npm --prefix era-flowers-preview run build
python -m http.server 4173 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:4173/era-flowers-preview/dist/). Serving from the repository root lets the preview’s links open the existing landing page and its home lineup.

`src/FlowerSequence.jsx` contains the section. GSAP controls scroll and parallax. Framer Motion handles the text and image reveals.

`public/flowers/` contains all seven source flower videos in WebM and MOV, plus their AVIF posters. The preview uses clips 01 and 02. The source videos came from `assets.era-residence.com/flowers/bougainvillea-flowers_NN.*`.
