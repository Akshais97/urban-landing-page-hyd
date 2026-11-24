import { useRef, useState } from 'react';
import desktopScene from '../../assets/background/central-boulevard.webp';
import compactDesktopScene from '../../assets/background/central-boulevard-1440.webp';
import mobileScene from '../../assets/background/central-boulevard-mobile.webp';
import compactMobileScene from '../../assets/background/central-boulevard-mobile-540.webp';
import { features } from './abundance-features.js';
import { ChapterTitle, useChapterMotion } from './ChapterMotion.jsx';
import SectionScenery from './SectionScenery.jsx';
import './benchmarks.css';

const comparisons = {
  energy: ['Consumes energy', 'Generates energy on site'],
  water: ['Depends on supply', 'Conserves water and harvests rain'],
  air: ['Unmeasured', 'Purified and measured'],
  mobility: ['No dedicated EV charging', 'EV charging at every private space'],
  nature: ['Downstairs, if at all', 'Built into the architecture'],
  community: ['Ends at the door', 'Multiple clubhouses'],
};

function Icon({ path, className }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>;
}

export default function Benchmarks() {
  const section = useRef(null);
  const [showAbundance, setShowAbundance] = useState(false);
  const currentHome = showAbundance ? 'Abundance' : 'a typical home';

  useChapterMotion(section);

  return (
    <section className="benchmarks" id="benchmarks" ref={section} aria-labelledby="benchmarks-title" data-abundance={showAbundance} data-motion-chapter>
      <SectionScenery className="benchmark-scene" desktop={desktopScene} mobile={mobileScene}
        compactDesktop={compactDesktopScene} compactMobile={compactMobileScene} />
      <div className="chapter-edge" data-chapter-edge aria-hidden="true" />
      <div className="benchmark-wrap">
        <header className="benchmark-heading">
          <div className="benchmark-headline" data-chapter-heading>
            <p className="benchmark-kicker" data-chapter-intro>Benchmarks</p>
            <ChapterTitle id="benchmarks-title" lines={['Compare everyday homes.', 'See the LifeScape difference.']} />
          </div>
          <div className="benchmark-control benchmark-surface" data-chapter-surface>
            <button type="button" className="benchmark-toggle" role="switch"
              aria-checked={showAbundance} aria-controls="benchmark-grid" aria-labelledby="benchmark-switch-label"
              onClick={() => setShowAbundance(current => !current)}>
              <span className="benchmark-icon"><Icon path="M4 10.5 12 4l8 6.5v9H4zM10 19.5V14h4v5.5" /></span>
              <span>
                <span id="benchmark-switch-label">Compare with Abundance</span>
                <span className="benchmark-mode" key={currentHome}>Showing {currentHome}</span>
              </span>
              <span className="benchmark-switch" aria-hidden="true" />
            </button>
          </div>
        </header>
        <ul className="benchmark-grid" id="benchmark-grid" aria-label="Home capabilities" role="list" data-chapter-group="flow">
          {features.map(({ id, name, icon }, index) => (
            <li className="benchmark-tile benchmark-surface" key={id} data-chapter-item style={{ '--benchmark-delay': `${index * 26}ms` }}>
              <h3>
                <span className="benchmark-icon"><Icon path={icon} /></span>
                <span>{name}</span>
                <Icon className="benchmark-check" path="m5 12 4 4L19 6" />
              </h3>
              <p className="benchmark-value">
                <span aria-hidden={showAbundance}>{comparisons[id][0]}</span>
                <span aria-hidden={!showAbundance}>{comparisons[id][1]}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="benchmark-caption" data-chapter-surface>Capabilities shown are as designed for Abundance.</p>
        <p className="sr-only" role="status">Showing all six benchmarks for {currentHome}.</p>
      </div>
    </section>
  );
}
