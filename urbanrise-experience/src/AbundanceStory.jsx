import amphitheatre from '../../assets/background/lifescape-amphitheatre-1440.webp';
import compactAmphitheatre from '../../assets/background/lifescape-amphitheatre-720.webp';

export default function AbundanceStory() {
  return (
    <section className="followup-section abundance-story-section" id="vision" aria-labelledby="vision-title">
      <div className="followup-wrap followup-split">
        <div className="followup-story">
          <p className="followup-kicker">A higher standard</p>
          <h2 id="vision-title">The home category has evolved.</h2>
          <p className="followup-lead">Abundance brings together architectural beauty, intelligent technology and a deeper connection to nature, reimagining what it means to live well.</p>
          <a className="followup-action" href="#lineup" data-chapter-glass="action">
            Explore Residences <span aria-hidden="true">↗</span>
          </a>
        </div>
        <figure className="abundance-story-image">
          <img src={amphitheatre} srcSet={`${compactAmphitheatre} 720w, ${amphitheatre} 1440w`}
            sizes="(max-width: 800px) 92vw, (max-width: 1440px) 50vw, 710px"
            width="1440" height="804" loading="lazy" decoding="async"
            alt="Landscaped amphitheatre and gathering lawn beside villas at LifeScape." />
          <span className="abundance-story-play" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M9 5.5 19 12 9 18.5Z" /></svg>
          </span>
        </figure>
      </div>
    </section>
  );
}
