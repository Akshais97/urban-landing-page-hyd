import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import FlowerSequence from '../../era-flowers-preview/src/FlowerSequence.jsx';
import ImageBreak from '../../era-flowers-preview/src/ImageBreak.jsx';
import Gallery from '../../sobha-gallery-preview/src/Gallery.jsx';
import AbundanceFeatures from './AbundanceFeatures.jsx';
import Benchmarks from './Benchmarks.jsx';
import { useExperienceMotion } from './motion.js';
import { observeControlGlass } from './control-glass.js';

const homepage = '../../index.html';
const township = {
  src: import.meta.env.BASE_URL + 'project/golden-hour-villa-township.webp',
  alt: 'Aerial view of a villa township with landscaped gardens and tree-lined roads.',
  width: 1672,
  height: 941,
};

function LivingWave({ section }) {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Start fetching the closing image near The Living Wave's entrance.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const image = new Image();
      image.fetchPriority = 'low';
      image.src = township.src;
      observer.disconnect();
    }, { rootMargin: '240px 0px' });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, [section]);

  return (
    <div className="experience-living" id="living-wave" ref={section}>
      {!reduced && (
        <div className="experience-playback">
          <button className="preview-playback" type="button" onClick={() => setPaused(value => !value)}>
            <span className={paused ? 'play-icon' : 'pause-icon'} aria-hidden="true" />
            {paused ? 'Play animation' : 'Pause animation'}
          </button>
        </div>
      )}
      <FlowerSequence flowersPaused={paused} homesUrl={homepage + '#lineup'} />
      <div className="experience-township">
        <ImageBreak image={township} paused={paused} />
        <div className="experience-township-light" aria-hidden="true" />
      </div>
    </div>
  );
}

function Experience() {
  const living = useRef(null);
  const gallery = useRef(null);
  const reduced = useReducedMotion();
  useExperienceMotion(living, gallery);

  useEffect(() => observeControlGlass(living.current.parentElement), [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <LivingWave section={living} />
      <div className="experience-gallery" id="gallery" ref={gallery}>
        <Gallery imageOnlyControls />
      </div>
      <AbundanceFeatures />
      <Benchmarks />
    </MotionConfig>
  );
}

createRoot(document.getElementById('experience')).render(<Experience />);
