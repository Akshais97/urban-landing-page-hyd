import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import poster from '../../assets/background/video_thumbnail.png';

const sceneLength = 7200;
const scenes = [
  ['hero', 'Where the coast meets the light.', '60% 100%', '190%'],
  ['video', 'Interiors that open to the water.', '100% 55%', '230%'],
  ['intro', 'Rooms that respond to how you live.', '55% 0%', '300%'],
  ['res', 'Every residence, a view.', '0% 60%', '185%'],
  ['video', 'Built to sit lightly on the land.', '0% 45%', '260%'],
];
const duration = scenes.length * sceneLength;
const sceneRoot = `${import.meta.env.BASE_URL}story/`;

export default function AbundanceFilm() {
  const card = useRef(null);
  const elapsed = useRef(0);
  const [scene, setScene] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState('');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    let frame;
    let previous;
    function tick(time) {
      elapsed.current = Math.min(duration, elapsed.current + (previous === undefined ? 0 : time - previous));
      previous = time;
      const index = Math.min(scenes.length - 1, Math.floor(elapsed.current / sceneLength));
      setScene(index);
      const progress = reducedMotion ? 0 : (elapsed.current - index * sceneLength) / sceneLength;
      card.current.style.setProperty('--film-zoom', String(1.02 + progress * 0.08));
      if (elapsed.current < duration) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reducedMotion]);

  useEffect(() => {
    function syncFullscreen() { setFullscreen(document.fullscreenElement === card.current); }
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  function togglePlaying() {
    if (!playing && elapsed.current >= duration) elapsed.current = 0;
    setPlaying(current => !current);
  }

  async function toggleFullscreen() {
    try {
      if (fullscreen) await document.exitFullscreen();
      else await card.current.requestFullscreen();
      setFullscreenMessage('');
    } catch {
      setFullscreenMessage('Full screen is unavailable in this browser.');
    }
  }

  return (
    <section className="followup-section abundance-film-section" id="vision" aria-labelledby="vision-title">
      <div className="followup-wrap followup-split">
        <div className="followup-story">
          <p className="followup-kicker">A higher standard</p>
          <h2 id="vision-title">The home category has evolved.</h2>
          <p className="followup-lead">Abundance brings together architectural beauty, intelligent technology and a deeper connection to nature, reimagining what it means to live well.</p>
          <a className="followup-action" href="#lineup">Explore Residences <span aria-hidden="true">↗</span></a>
        </div>
        <figure className="abundance-story-film" ref={card} aria-label="The Story of Abundance" data-playing={playing}>
          <div className="story-film-scenes" aria-hidden="true">
            <img className="story-film-poster" src={poster} alt="" loading="lazy" decoding="async" data-current={scene === -1} />
            {scene >= 0 && scenes.map(([asset, caption, position, size], index) => (
              <div className="story-film-scene" key={caption} data-current={scene === index} style={{
                backgroundImage: `url('${sceneRoot}${asset}.jpg')`, backgroundPosition: position, backgroundSize: `${size} auto`,
              }} />
            ))}
          </div>
          <button className="story-film-play" type="button" onClick={togglePlaying}
            aria-label={`${playing ? 'Pause' : 'Play'} The Story of Abundance`}>
            {playing ? <span className="story-film-pause-icon" aria-hidden="true" /> : <span className="story-film-play-icon" aria-hidden="true" />}
          </button>
          {document.fullscreenEnabled && (
            <button className="story-film-fullscreen followup-action followup-action--quiet" type="button" onClick={toggleFullscreen}>
              {fullscreen ? 'Exit full screen' : 'Full screen'}
            </button>
          )}
          {scene >= 0 && <figcaption aria-live="polite">{scenes[scene][1]}</figcaption>}
          <p className="story-film-feedback" role="status">{fullscreenMessage}</p>
        </figure>
      </div>
    </section>
  );
}
