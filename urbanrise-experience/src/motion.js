import { useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useExperienceMotion(living, gallery) {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const galleryChapter = gallery.current;
      const stage = galleryChapter.querySelector('.gallery-stage');
      const wash = living.current.querySelector('.experience-township-light');
      const playback = living.current.querySelector('.experience-playback');

      // The panorama and gallery share a viewport. One timeline hands it over.
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: galleryChapter,
          start: 'top 1px',
          toggleActions: 'play none none reverse',
        },
      })
        .to(wash, { opacity: 1, duration: 0.38, ease: 'sine.inOut' }, 0)
        .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'sine.inOut' }, 0.16)
        .fromTo('.gallery-heading h1 > span', { opacity: 0, y: 18 }, {
          opacity: 1, y: 0, duration: 0.43, stagger: 0.065, ease: 'power3.out',
        }, 0.28)
        .fromTo('.gallery-orbit', { opacity: 0, y: 14 }, {
          opacity: 1, y: 0, duration: 0.44, ease: 'power2.out',
        }, 0.36)
        .fromTo('.gallery-brand, .gallery-caption, .gallery-bar', { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.26, stagger: 0.035, ease: 'sine.out',
        }, 0.46);

      if (playback) entrance.to(playback, { autoAlpha: 0, duration: 0.22, ease: 'sine.out' }, 0);
    });

    return () => media.revert();
  }, { scope: gallery });

  useEffect(() => {
    const hash = location.hash;
    const ids = [living.current.id, gallery.current.id, 'release', 'benchmarks', 'version', 'lineup', 'carbon-calculator', 'vision', 'access', 'footer'];
    const id = hash.slice(1);
    const target = ids.includes(id) ? document.getElementById(id) : null;
    if (!target) return;

    document.fonts.ready.then(() => {
      if (target.isConnected && location.hash === hash) target.scrollIntoView();
    });
  }, [living, gallery]);

  useEffect(() => {
    const orbit = gallery.current.querySelector('.gallery-orbit');
    const photos = orbit.querySelectorAll('img');
    const openingPhotos = [photos[0], photos[1], photos[photos.length - 1]];

    let cancelled = false;
    Promise.allSettled(openingPhotos.map(photo => photo.decode())).then(() => {
      if (!cancelled) orbit.dataset.photosReady = '';
    });
    return () => { cancelled = true; };
  }, [gallery]);
}
