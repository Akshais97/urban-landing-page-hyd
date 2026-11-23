import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import benchmarkImage from '../../assets/background/Benchmarks_Section.png';
import { features } from './abundance-features.js';
import './benchmarks.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  const currentHome = showAbundance ? 'Abundance' : 'a typical apartment';

  useGSAP(() => {
    const media = gsap.matchMedia(section);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: '.benchmark-heading', start: 'top 88%', once: true },
      })
        .from('.benchmark-headline > *', { opacity: 0, y: 14, duration: 0.48, stagger: 0.07, clearProps: 'opacity,transform' })
        .from('.benchmark-surface', { opacity: 0, duration: 0.5, stagger: 0.055, clearProps: 'opacity' }, 0.12);
    });
    return () => media.revert();
  }, { scope: section });

  return (
    <section className="benchmarks" id="benchmarks" ref={section} aria-labelledby="benchmarks-title" data-abundance={showAbundance}>
      <div className="benchmark-scene" aria-hidden="true">
        <img src={benchmarkImage} alt="" width="1817" height="866" loading="lazy" decoding="async" />
      </div>
      <div className="benchmark-wrap">
        <header className="benchmark-heading">
          <div className="benchmark-headline">
            <p className="benchmark-kicker">Benchmarks</p>
            <h2 id="benchmarks-title">Flip the switch.<br /><span>See the upgrade.</span></h2>
          </div>
          <div className="benchmark-control benchmark-surface">
            <button type="button" className="benchmark-toggle" role="switch"
              aria-checked={showAbundance} aria-controls="benchmark-grid" aria-labelledby="benchmark-switch-label"
              onClick={() => setShowAbundance(current => !current)}>
              <span className="benchmark-icon"><Icon path="M4 10.5 12 4l8 6.5v9H4zM10 19.5V14h4v5.5" /></span>
              <span>
                <span id="benchmark-switch-label">Compare with Abundance</span>
                <span className="benchmark-mode">Showing {currentHome}</span>
              </span>
              <span className="benchmark-switch" aria-hidden="true" />
            </button>
          </div>
        </header>
        <ul className="benchmark-grid" id="benchmark-grid" aria-label="Home capabilities" role="list">
          {features.map(({ id, name, icon }) => (
            <li className="benchmark-tile benchmark-surface" key={id}>
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
        <p className="benchmark-caption">Capabilities shown are as designed for Abundance.</p>
        <p className="sr-only" role="status">Showing all six benchmarks for {currentHome}.</p>
      </div>
    </section>
  );
}
