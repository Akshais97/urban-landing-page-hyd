import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './image-break.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const cloudLayers = [
  { id: '33', width: 2146, height: 1200 },
  { id: '47', width: 1842, height: 960 },
  { id: '02', width: 1546, height: 960 },
];
const cloudTiles = [0, 1, 2, 3, 4, 5];

export default function ImageBreak({ image, paused }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: '200px 0px' });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: '60% bottom',
          end: () => {
            const viewportHeight = document.documentElement.clientHeight;
            const imageBottom = Math.max(viewportHeight * 0.88, Math.min(section.offsetHeight, viewportHeight));
            return `clamp(bottom ${imageBottom}px)`;
          },
          scrub: 0.45,
        },
      })
        .to('.image-break__morning-light', { opacity: 0, ease: 'none' }, 0)
        .to('.image-break__cloud-bank', { opacity: 0.8, ease: 'sine.inOut' }, 0);

      // Text above the image can reflow when the preview fonts finish loading.
      document.fonts.ready.then(() => transition.scrollTrigger?.refresh());
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <div className="image-break" ref={sectionRef}>
      <div className="image-break__frame">
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
        <div className="image-break__morning-light" aria-hidden="true">
          <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="image-break__clouds" aria-hidden="true" data-drifting={inView && !paused}>
        <div className="image-break__cloud-bank">
          {cloudLayers.map(({ id, width, height }) => (
            <div className="image-break__layer" key={id}>
              <div className="image-break__track">
                {cloudTiles.map(tile => (
                  <img
                    key={tile}
                    src={import.meta.env.BASE_URL + 'clouds/clouds_' + id + '.avif'}
                    alt=""
                    width={width}
                    height={height}
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
