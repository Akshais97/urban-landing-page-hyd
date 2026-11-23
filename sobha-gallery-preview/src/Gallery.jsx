import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryCopy from './GalleryCopy.jsx';
import { photos, imageUrl, imageSet } from './gallery-photos.js';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = photos.length - 1;
const radians = Math.PI / 180;
const slot = 2 * Math.PI / photos.length;

const tiltAt = gsap.utils.interpolate([-10, -3, 8, 5, -7]);

function Arrow({ direction }) {
  return <span aria-hidden="true">{direction === 'left' ? '←' : '→'}</span>;
}

export default function Gallery({ imageOnlyControls = false }) {
  const section = useRef(null);
  const scenery = useRef(null);
  const tiles = useRef([]);
  const scroll = useRef(null);
  const activeRef = useRef(0);
  const targetRef = useRef(0);
  const travel = useRef(null);
  const dialog = useRef(null);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(0);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: section });

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
        const center = height * 0.025;

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
          setDirection(nearest > activeRef.current ? 1 : -1);
          activeRef.current = nearest;
          if (!travel.current?.isActive()) targetRef.current = nearest;
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
          scrub: 0.65,
          snap: { snapTo: 1 / steps, duration: { min: 0.3, max: 0.65 }, delay: 0.16, ease: 'power3.inOut', directional: false },
        },
      });
      scroll.current = animation.scrollTrigger;

      return () => {
        observer.disconnect();
        travel.current?.kill();
        scroll.current = null;
      };
    });
    return () => media.revert();
  }, { scope: section });

  const navigate = contextSafe(direction => {
    const trigger = scroll.current;
    if (!trigger) return;
    const index = gsap.utils.clamp(0, steps, targetRef.current + direction);
    targetRef.current = index;
    travel.current?.kill();
    trigger.getTween(true)?.kill();
    const position = { y: trigger.scroll() };
    travel.current = gsap.to(position, {
      y: trigger.start + (trigger.end - trigger.start) * index / steps,
      duration: 0.85,
      ease: 'power3.inOut',
      onUpdate: () => { trigger.scroll(position.y); ScrollTrigger.update(); },
    });
  });

  function interruptTravel() {
    travel.current?.kill();
    targetRef.current = activeRef.current;
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
    <section ref={section} className="gallery" aria-labelledby="gallery-title" onWheel={interruptTravel} onTouchStart={interruptTravel}>
      <div className="gallery-stage">
        <a className="gallery-brand" href="../../index.html" aria-label="Back to Urbanrise">Urbanrise</a>

        <div ref={scenery} className="gallery-orbit" aria-hidden="true">
          {photos.map((photo, index) => (
            <div className="gallery-tile" key={photo.file} ref={element => { tiles.current[index] = element; }}>
              <img src={imageUrl(photo)} srcSet={imageSet(photo)} sizes="(max-width: 679px) 82vw, 64vw" alt="" width="1600" height="900" draggable="false" decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'} />
            </div>
          ))}
        </div>

        <GalleryCopy photo={photos[active]} direction={direction} reducedMotion={reducedMotion} />

        <div className={imageOnlyControls ? 'gallery-bar gallery-bar--image-only' : 'gallery-bar'} onKeyDown={onControlKey}>
          {!imageOnlyControls && (
            <>
              <div className="gallery-counter" aria-hidden="true">
                {String(active + 1).padStart(2, '0')} <span>/</span> {String(photos.length).padStart(2, '0')}
              </div>
              <p className="gallery-hint">Scroll to explore</p>
            </>
          )}
          <div className="gallery-actions">
            {!imageOnlyControls && (
              <motion.button type="button" className="gallery-arrow" aria-label="Previous photo" aria-disabled={active === 0}
                onClick={() => navigate(-1)} whileTap={{ scale: 0.94 }}><Arrow direction="left" /></motion.button>
            )}
            <button type="button" className="gallery-view" onClick={() => showPhoto(active)}>View image</button>
            {!imageOnlyControls && (
              <motion.button type="button" className="gallery-arrow" aria-label="Next photo" aria-disabled={active === steps}
                onClick={() => navigate(1)} whileTap={{ scale: 0.94 }}><Arrow direction="right" /></motion.button>
            )}
          </div>
        </div>

        <ul className="gallery-grid">
          {photos.map((photo, index) => (
            <li key={photo.file}>
              <button type="button" onClick={() => showPhoto(index)}>
                <span className="gallery-grid-heading">An Abundance of <em className="gallery-gold-text">{photo.abundance}</em></span>
                <img src={imageUrl(photo)} srcSet={imageSet(photo)} sizes="(max-width: 679px) 100vw, 50vw" alt={photo.alt} width="1600" height="900" loading="lazy" />
                <span className="gallery-grid-name">{photo.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialog} className="gallery-dialog" aria-label={`${photos[opened].name} — An Abundance of ${photos[opened].abundance}`} onClick={event => {
        if (event.target === event.currentTarget) dialog.current.close();
      }}>
        <figure>
          <img src={imageUrl(photos[opened])} alt={photos[opened].alt} />
          <figcaption>
            <span>An Abundance of <em className="gallery-gold-text">{photos[opened].abundance}</em></span>
            {photos[opened].name}
          </figcaption>
          <button type="button" className="gallery-arrow gallery-close" aria-label="Close image" onClick={() => dialog.current.close()}>×</button>
        </figure>
      </dialog>
    </section>
  );
}
