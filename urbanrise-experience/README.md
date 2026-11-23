# The Lifescape experience

A Vite preview that opens with the Urbanrise hero, continues through The Living Wave and the amenity gallery, and ends with the Abundance project features.

## Build and open

From the repository root:

```powershell
npm --prefix urbanrise-experience ci
npm --prefix urbanrise-experience run build
```

Open [the preview](http://127.0.0.1:4173/urbanrise-experience/dist/) from the repository's static server. To start that server, run `python -m http.server 4173 --bind 127.0.0.1` from the repository root. The residence and registration links lead to the existing development page.

Scroll from the hero to see The Living Wave cover the hero as it scrolls into view. When the township panorama fills the screen, the gallery appears in the same viewport with a timed dissolve and staggered title reveal. Scroll through the images and select **View image** to open the current photo. With reduced motion enabled, the sections follow the normal document flow and the gallery shows a grid of all ten amenities.

The project imports the existing Living Wave and gallery components, and shares the hero styles, film script, and media from the repository. The build stages the media it uses in `dist/`.
