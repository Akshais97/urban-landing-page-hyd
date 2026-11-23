import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './chapter-motion.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ChapterTitle({ id, lines, accent = true }) {
  return (
    <h2 id={id} className="chapter-title">
      {lines.map((line, index) => (
        <span className="chapter-title-mask" key={line}>
          <span className={accent && index > 0 ? 'chapter-title-accent' : undefined} data-chapter-line>{line}</span>
        </span>
      ))}
    </h2>
  );
}

export function useChapterMotion(sectionRef) {
  useGSAP(() => {
    const section = sectionRef.current;
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reveals = [];
      const enter = (trigger, targets, options = {}) => {
        const animation = gsap.from(targets, {
          opacity: 0,
          y: 16,
          ease: 'power3.out',
          duration: 0.78,
          clearProps: 'opacity,transform',
          ...options,
          scrollTrigger: { trigger, start: 'top 92%', end: 'bottom top', once: true, fastScrollEnd: true },
        });
        reveals.push({ trigger, animation });
      };

      const heading = section.querySelector('[data-chapter-heading]');
      enter(heading, heading.querySelectorAll('[data-chapter-line]'), {
        yPercent: 78, y: 0, duration: 1.08, stagger: 0.125, delay: 0.07, ease: 'power4.out',
      });
      enter(heading, heading.querySelectorAll('[data-chapter-intro]'), {
        y: 9,
        stagger: { each: 0.22, from: 'start' },
      });

      for (const group of section.querySelectorAll('[data-chapter-group]')) {
        const items = group.querySelectorAll(':scope > [data-chapter-item]');
        if (group.dataset.chapterGroup === 'stagger') {
          enter(group, items, { y: 11, duration: 0.65, stagger: 0.055 });
        } else {
          items.forEach((item, index) => enter(item, item, {
            // Glass lenses are anchored to the scene, so their surfaces dissolve in place.
            y: item.classList.contains('benchmark-surface') ? 0 : 20,
            delay: (index % 3) * 0.06,
          }));
        }
      }

      for (const surface of section.querySelectorAll('[data-chapter-surface]')) {
        enter(surface, surface, { y: surface.classList.contains('benchmark-surface') ? 0 : 22 });
      }

      const meter = section.querySelector('[data-chapter-meter]');
      if (meter) {
        enter(meter, meter.querySelectorAll('.carbon-bar-fill'), { y: 0, scaleX: 0, stagger: 0.09, duration: 1.1 });
      }

      const handoff = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 12%', scrub: 0.45 },
      });
      const scene = section.querySelector('[data-chapter-scene]');
      const edge = section.querySelector('[data-chapter-edge]');
      if (scene?.dataset.chapterScene === 'dissolve') {
        handoff.fromTo(scene, { opacity: 0.35 }, { opacity: 1 });
      } else if (scene) {
        handoff.fromTo(scene.querySelector('img'), { scale: 1.09, yPercent: 2 }, { scale: 1, yPercent: 0 });
      }
      if (edge) handoff.fromTo(edge, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.8 }, 0);

      function revealFocused(event) {
        for (const { trigger, animation } of reveals) {
          if (trigger.contains(event.target)) animation.progress(1);
        }
      }

      // Quiz steps and calculator details can move the chapters below them.
      let sectionHeight = section.offsetHeight;
      const resize = new ResizeObserver(() => {
        const nextHeight = section.offsetHeight;
        if (nextHeight === sectionHeight) return;
        sectionHeight = nextHeight;
        ScrollTrigger.refresh(true);
      });
      resize.observe(section);
      section.addEventListener('focusin', revealFocused);
      return () => {
        resize.disconnect();
        section.removeEventListener('focusin', revealFocused);
      };
    });

    return () => media.revert();
  }, { scope: sectionRef });
}
