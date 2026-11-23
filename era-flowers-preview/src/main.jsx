import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import FlowerSequence from './FlowerSequence.jsx';
import ImageBreak from './ImageBreak.jsx';
import './styles.css';

function Preview() {
  const [animationPaused, setAnimationPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const homeUrl = '../../index.html';

  return (
    <MotionConfig reducedMotion="user">
      <header className="preview-header">
        <a className="preview-brand" href={homeUrl} aria-label="Urbanrise home">Urbanrise</a>
        {!reducedMotion && (
          <motion.button
            className="preview-playback"
            type="button"
            onClick={() => setAnimationPaused(value => !value)}
            whileTap={{ scale: 0.96 }}
          >
            <span className={animationPaused ? 'play-icon' : 'pause-icon'} aria-hidden="true" />
            {animationPaused ? 'Play animation' : 'Pause animation'}
          </motion.button>
        )}
      </header>
      <main>
        <FlowerSequence flowersPaused={animationPaused} homesUrl={homeUrl + '#lineup'} />
        <ImageBreak paused={animationPaused} />
      </main>
      <footer className="preview-footer">
        <a href={homeUrl}>Back to Urbanrise <span aria-hidden="true">↗</span></a>
      </footer>
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')).render(<Preview />);
