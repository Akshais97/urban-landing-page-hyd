import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import Gallery from './Gallery.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <main>
      <Gallery />
    </main>
  </MotionConfig>
);
