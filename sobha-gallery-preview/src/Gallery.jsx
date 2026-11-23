import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const photos = [
  { file: 'garden', name: 'Garden terraces', alt: 'Planted balconies and a lit walk beside The Living Wave' },
  { file: 'arrival', name: 'The arrival', alt: 'Landscaped entrance to The Living Wave at blue hour' },
  { file: 'interior', name: 'Living room', alt: 'Light filled living room with floor to ceiling windows' },
  { file: 'terrace', name: 'Indoor and outdoor living', alt: 'A lounge opening onto a planted terrace at sunset' },
  { file: 'residences', name: 'The residences', alt: 'Illuminated residential tower surrounded by gardens' },
  { file: 'showroom', name: 'Spaces to gather', alt: 'Visitors walking through an indoor garden and lounge' },
  { file: 'living', name: 'Open interiors', alt: 'Warm living space with wide windows and planted terraces' },
  { file: 'evening', name: 'The Living Wave at dusk', alt: 'The Living Wave residences against a pink evening sky' },
  { file: 'skyline', name: 'Above the city', alt: 'Planted apartment terraces overlooking the city at dusk' },
];

const imageUrl = photo => import.meta.env.BASE_URL + 'gallery/' + photo.file + '.webp';
const steps = photos.length - 1;
const radians = Math.PI / 180;
const slot = 2 * Math.PI / photos.length;

const tiltAt = gsap.utils.interpolate([-18, -5, 12, 7, -10]);
const centerAt = gsap.utils.interpolate([0.62, 0.55, 0.52, 0.46, 0.34]);
const compactCenterAt = gsap.utils.interpolate([0.55, 0.52, 0.50, 0.48, 0.45]);

function Arrow({ direction }) {
  return <span aria-hidden="true">{direction === 'left' ? '←' : '→'}</span>;
}

export default function Gallery() {
  const section = useRef(null);
  const scenery = useRef(null);
  const tiles = useRef([]);
  const scroll = useRef(null);
  const activeRef = useRef(0);
  const dialog = useRef(null);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const stage = scenery.current;
      const cursor = { progress: 0 };
      let width;
      let height;
      let perspective;
      let compact;

      function draw() {
        const p = cursor.progress;
        const tilt = tiltAt(p) * (compact ? 0.67 : 1);
        const turn = tilt * radians;
        const phase = p * steps * slot;
        const span = width * (compact ? 0.72 : 0.70);
        const center = height * ((compact ? compactCenterAt(p) : centerAt(p)) - 0.5);

        tiles.current.forEach((tile, index) => {
          const angle = phase - index * slot;
          const side = Math.sin(angle);
          const depth = (Math.cos(angle) + 1) / 2;
          const x = side * span;
          const z = gsap.utils.interpolate(-0.60 * perspective, 0.15 * perspective, depth);
          const scale = 0.26 + 0.74 * depth ** 2;
          const yaw = side * 29;
          const horizontal = x * Math.cos(turn);
          const vertical = center + x * Math.sin(turn) - (1 - depth) * height * 0.13;
          tile.style.transform = `translate3d(${horizontal}px, ${vertical}px, ${z}px) translate(-50%, -50%) rotateZ(${tilt}deg) rotateY(${yaw}deg) scale(${scale})`;
          tile.style.opacity = 0.19 + 0.81 * depth ** 1.5;
          tile.style.zIndex = Math.round(depth * 1000);
        });

        const nearest = Math.round(p * steps);
        if (nearest !== activeRef.current) {
          activeRef.current = nearest;
          setActive(nearest);
        }
      }

      function resize() {
        width = stage.clientWidth;
        height = stage.clientHeight;
        if (!width || !height) return;
        compact = width < 680;
        perspective = Math.max(320, Math.min(width, height) * 1.02);
        stage.style.perspective = perspective + 'px';
        draw();
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(stage);
      const animation = gsap.to(cursor, {
        progress: 1,
        ease: 'none',
        onUpdate: draw,
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.33,
        },
      });
      scroll.current = animation.scrollTrigger;

      return () => {
        observer.disconnect();
        scroll.current = null;
      };
    });
    return () => media.revert();
  }, { scope: section });

  function navigate(direction) {
    const trigger = scroll.current;
    if (!trigger) return;
    const index = gsap.utils.clamp(0, steps, Math.round(trigger.progress * steps) + direction);
    trigger.scroll(trigger.start + (trigger.end - trigger.start) * index / steps);
    ScrollTrigger.update();
  }

  function onControlKey(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    navigate(event.key === 'ArrowLeft' ? -1 : 1);
  }

  function showPhoto(index) {
    setOpened(index);
    dialog.current.showModal();
  }

  return (
    <section ref={section} className="gallery" aria-labelledby="gallery-title">
      <div className="gallery-stage">
        <a className="gallery-brand" href="../../index.html" aria-label="Back to Urbanrise">Urbanrise</a>

        <div ref={scenery} className="gallery-orbit" aria-hidden="true">
          {photos.map((photo, index) => (
            <div className="gallery-tile" key={photo.file} ref={element => { tiles.current[index] = element; }}>
              <img src={imageUrl(photo)} alt="" width="960" height="600" draggable="false" />
            </div>
          ))}
        </div>

        <div className="gallery-heading">
          <p className="gallery-project">The Living Wave</p>
          <h1 id="gallery-title">Gallery</h1>
        </div>

        <div className="gallery-bar" onKeyDown={onControlKey}>
          <div className="gallery-counter" aria-hidden="true">
            {String(active + 1).padStart(2, '0')} <span>/</span> {String(photos.length).padStart(2, '0')}
          </div>
          <div className="gallery-caption" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={active}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.16 }}>
                {photos[active].name}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="gallery-actions">
            <motion.button type="button" className="gallery-arrow" aria-label="Previous photo" aria-disabled={active === 0}
              onClick={() => navigate(-1)} whileTap={{ scale: 0.94 }}><Arrow direction="left" /></motion.button>
            <button type="button" className="gallery-view" onClick={() => showPhoto(active)}>View image</button>
            <motion.button type="button" className="gallery-arrow" aria-label="Next photo" aria-disabled={active === steps}
              onClick={() => navigate(1)} whileTap={{ scale: 0.94 }}><Arrow direction="right" /></motion.button>
          </div>
        </div>

        <ul className="gallery-grid">
          {photos.map((photo, index) => (
            <li key={photo.file}>
              <button type="button" onClick={() => showPhoto(index)}>
                <img src={imageUrl(photo)} alt={photo.alt} width="960" height="600" loading="lazy" />
                <span>{photo.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialog} className="gallery-dialog" aria-label="Gallery image" onClick={event => {
        if (event.target === event.currentTarget) dialog.current.close();
      }}>
        <figure>
          <img src={imageUrl(photos[opened])} alt={photos[opened].alt} />
          <figcaption>{photos[opened].name}</figcaption>
          <button type="button" className="gallery-arrow gallery-close" aria-label="Close image" onClick={() => dialog.current.close()}>×</button>
        </figure>
      </dialog>
    </section>
  );
}
