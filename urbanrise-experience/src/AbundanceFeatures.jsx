import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { features } from './abundance-features.js';
import './release.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const compactTabs = '(max-width: 760px)';
const allowMotion = '(prefers-reduced-motion: no-preference)';
const tabId = feature => `release-tab-${feature.id}`;
const panelId = feature => `release-panel-${feature.id}`;

function matchingFeatures(query) {
  const search = query.trim().toLowerCase();
  return features.filter(({ name, summary }) => `${name} ${summary}`.toLowerCase().includes(search));
}

function Icon({ path }) {
  return <svg className="release-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>;
}

function FeaturePanelContent({ feature }) {
  const content = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia(content);
    media.add(allowMotion, () => {
      gsap.timeline({
        defaults: { ease: 'power3.out', clearProps: 'opacity,transform' },
        scrollTrigger: { trigger: content.current, start: 'top 92%', once: true },
      })
        .from('.release-panel-top', { opacity: 0, y: 8, duration: 0.32 }, 0)
        .from('.release-title-reveal', { opacity: 0, y: 24, duration: 0.48 }, 0.04)
        .from('.release-description, .release-how, .release-steps li', {
          opacity: 0, y: 12, duration: 0.4, stagger: 0.045,
        }, 0.12);
    });
    return () => media.revert();
  }, { scope: content });

  return (
    <div className="release-panel-content" ref={content}>
      <div className="release-panel-top">
        <span className="release-feature-icon"><Icon path={feature.icon} /></span>
        <span>{feature.name}</span>
      </div>
      <h3><span className="release-title-reveal">{feature.title}</span></h3>
      <p className="release-description">{feature.description}</p>
      <h4 className="release-how">How it works at Abundance</h4>
      <ol className="release-steps">
        {feature.steps.map(([title, description]) => (
          <li key={title}><strong>{title}</strong><p>{description}</p></li>
        ))}
      </ol>
    </div>
  );
}

export default function AbundanceFeatures() {
  const section = useRef(null);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('water');
  const [compact, setCompact] = useState(() => matchMedia(compactTabs).matches);
  const visible = matchingFeatures(query);

  useGSAP(() => {
    const media = gsap.matchMedia(section);
    media.add(allowMotion, () => {
      gsap.timeline({
        defaults: { ease: 'power3.out', clearProps: 'opacity,transform' },
        scrollTrigger: {
          trigger: section.current.querySelector('.release-heading'),
          start: 'bottom 88%',
          once: true,
        },
      })
        .from('.release-heading > *', { opacity: 0, y: 14, duration: 0.54, stagger: 0.075 }, 0)
        .from('.release-window', { opacity: 0, y: 28, duration: 0.72 }, 0.09)
        .from('.release-toolbar > *, .release-search, .release-tab', {
          opacity: 0, y: 9, duration: 0.44, stagger: 0.035,
        }, 0.22);
    });
    return () => media.revert();
  }, { scope: section });

  useEffect(() => {
    const media = matchMedia(compactTabs);
    const sync = () => setCompact(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  function updateQuery(value) {
    setQuery(value);
    const matches = matchingFeatures(value);
    if (matches.length && !matches.some(feature => feature.id === activeId)) {
      setActiveId(matches[0].id);
    }
  }

  function moveTab(event, position) {
    let next;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (position + 1) % visible.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (position - 1 + visible.length) % visible.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = visible.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const feature = visible[next];
    setActiveId(feature.id);
    document.getElementById(tabId(feature)).focus();
  }

  return (
    <section className="release" id="release" aria-labelledby="release-title" ref={section}>
      <div className="release-scene" aria-hidden="true" />
      <div className="release-wrap">
        <header className="release-heading">
          <h2 id="release-title">What makes Abundance different</h2>
          <p>Explore the design and sustainability features that shape everyday life at Abundance.</p>
        </header>
        <div className="release-window">
          <div className="release-toolbar">
            <span className="release-app-icon"><Icon path="M4 10.5 12 4l8 6.5v9H4zM10 19.5V14h4v5.5" /></span>
            <div><strong>Abundance</strong><span>Project features</span></div>
          </div>
          <div className="release-layout">
            <div className="release-sidebar">
              <label className="release-search">
                <Icon path="M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0ZM16 16l5 5" />
                <span className="sr-only">Search Abundance features</span>
                <input type="search" value={query} placeholder="Search features" autoComplete="off"
                  aria-controls="release-feature-list" onChange={event => updateQuery(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Escape' && query) {
                      event.preventDefault();
                      updateQuery('');
                    }
                  }} />
              </label>
              <div className="release-tabs" role="tablist" id="release-feature-list"
                aria-label="Abundance features" aria-orientation={compact ? 'horizontal' : 'vertical'}>
                {visible.map((feature, index) => (
                  <button className="release-tab" type="button" role="tab" key={feature.id}
                    id={tabId(feature)} aria-controls={panelId(feature)}
                    aria-selected={activeId === feature.id} tabIndex={activeId === feature.id ? 0 : -1}
                    onClick={() => setActiveId(feature.id)} onKeyDown={event => moveTab(event, index)}>
                    <span className="release-tab-icon"><Icon path={feature.icon} /></span>
                    <span className="release-tab-copy"><strong>{feature.name}</strong><small>{feature.summary}</small></span>
                    <span className="release-tab-chevron"><Icon path="m9 5 7 7-7 7" /></span>
                  </button>
                ))}
              </div>
              <p className="release-empty" role="status">{visible.length === 0 && 'No matching features. Try energy, water or nature.'}</p>
            </div>
            <div className="release-panels" hidden={!visible.length}>
              {visible.map(feature => (
                <div className="release-panel" role="tabpanel" key={feature.id} id={panelId(feature)}
                  aria-labelledby={tabId(feature)} tabIndex={0} hidden={activeId !== feature.id}>
                  {activeId === feature.id && <FeaturePanelContent feature={feature} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
