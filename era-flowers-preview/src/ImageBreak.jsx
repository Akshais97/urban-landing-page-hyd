import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './image-break.css';

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);

const zoomEase = CustomEase.create('imageBreakZoom', '0.25,0.1,0.25,1');
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
      const trigger = sectionRef.current;

      gsap.fromTo('.image-break__parallax', { yPercent: -15 }, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      });

      gsap.from('.image-break__frame', {
        scale: 1.15,
        ease: zoomEase,
        scrollTrigger: { trigger, start: 'top bottom', end: 'bottom bottom', scrub: 0.25 },
      });
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <div className="image-break" ref={sectionRef}>
      <div className="image-break__parallax">
        <div className="image-break__frame">
          {image && <img src={image.src} alt={image.alt} loading="lazy" />}
        </div>
      </div>
      <div className="image-break__clouds" aria-hidden="true" data-drifting={inView && !paused}>
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
  );
}
