import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);
const horizontalEase = CustomEase.create('gardenScroll', '0.25,0,0.75,1');
const revealEase = [0.25, 1, 0.5, 1];
const mediaRoot = import.meta.env.BASE_URL;

function Flower({ id, placement, paused }) {
  const videoRef = useRef(null);
  const base = mediaRoot + 'flowers/flower-' + id;

  useEffect(() => {
    const video = videoRef.current;
    if (paused) {
      video.pause();
      return;
    }

    let onScreen = false;
    const syncPlayback = () => {
      if (onScreen && !document.hidden) {
        video.play().catch(() => {
          // Leave the local poster in place if playback is unavailable.
        });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting && entry.intersectionRatio > 0;
      syncPlayback();
    }, { threshold: [0, 0.01] });

    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [paused]);

  return (
    <div className={'garden-flower garden-flower--' + placement} aria-hidden="true">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        disablePictureInPicture
        tabIndex={-1}
        preload="none"
        poster={base + '.avif'}
      >
        <source src={base + '.webm'} type="video/webm" />
        <source src={base + '.mov'} type={'video/mp4; codecs="hvc1"'} />
      </video>
    </div>
  );
}

function Reveal({ as: Container = 'span', children, delay = 0, amount = 0.3, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const visible = useInView(ref, { once: true, amount });

  return (
    <Container className={'garden-reveal ' + className} ref={ref}>
      <motion.span
        className="garden-reveal__inner"
        initial={reduced ? false : { y: '110%' }}
        animate={{ y: reduced || visible ? '0%' : '110%' }}
        transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : delay, ease: revealEase }}
      >
        {children}
      </motion.span>
    </Container>
  );
}

export default function FlowerSequence({ flowersPaused, homesUrl }) {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const terraceRef = useRef(null);
  const horizontalTrigger = useRef(null);
  const reduced = useReducedMotion();
  const terraceVisible = useInView(terraceRef, { once: true, amount: 0.18 });
  const pause = flowersPaused || reduced;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      const intro = section.querySelector('[data-garden-intro]');
      gsap.fromTo('[data-garden-copy]', { scale: 0.75, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: intro, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
      gsap.fromTo('.garden-flower--intro', { yPercent: -10 }, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.garden-flower--intro', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      });
    });

    media.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const measure = () => {
        section.style.height = Math.max(viewport.offsetHeight, track.offsetWidth) + 'px';
      };
      measure();
      ScrollTrigger.addEventListener('refreshInit', measure);
      const horizontal = gsap.to(track, {
        x: () => -Math.max(0, track.offsetWidth - viewport.clientWidth),
        ease: horizontalEase,
        scrollTrigger: {
          trigger: section,
          start: '2.5% top',
          end: '97.5% bottom',
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });
      horizontalTrigger.current = horizontal.scrollTrigger;

      const scroll = { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.25 };
      gsap.fromTo('[data-garden-title-line]', { xPercent: -5 }, {
        xPercent: 5,
        ease: 'none',
        scrollTrigger: scroll,
      });
      gsap.fromTo('.garden-flower--terrace', { xPercent: 0 }, {
        xPercent: -25, ease: 'none', scrollTrigger: scroll,
      });

      return () => {
        horizontalTrigger.current = null;
        ScrollTrigger.removeEventListener('refreshInit', measure);
        section.style.removeProperty('height');
      };
    });
    return () => media.revert();
  }, { scope: sectionRef });

  function revealFocusedLink(event) {
    const trigger = horizontalTrigger.current;
    const link = event.target;
    if (!trigger || !link.matches('a:focus-visible')) return;

    const viewport = viewportRef.current.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    if (rect.left >= viewport.left && rect.right <= viewport.right && rect.top >= 0 && rect.bottom <= innerHeight) return;

    const track = trackRef.current.getBoundingClientRect();
    const target = gsap.utils.clamp(0, 1, (rect.left - track.left + rect.width / 2 - viewport.width / 2) / (track.width - viewport.width));
    // Convert the horizontal position back to its place on the eased scroll timeline.
    let low = 0;
    let high = 1;
    for (let step = 0; step < 14; step += 1) {
      const middle = (low + high) / 2;
      if (horizontalEase(middle) < target) low = middle;
      else high = middle;
    }
    trigger.scroll(trigger.start + (trigger.end - trigger.start) * (low + high) / 2);
    ScrollTrigger.update();
  }

  return (
    <section className="garden-story" ref={sectionRef} data-flower-sequence aria-label="LifeScape" onFocusCapture={revealFocusedLink}>
      <div className="garden-story__viewport" ref={viewportRef}>
        <div className="garden-story__track" ref={trackRef} data-garden-track>
          <article className="garden-panel garden-intro" data-garden-intro>
            <Flower id="01" placement="intro" paused={pause} />
            <div className="garden-intro__copy" data-garden-copy>
              <div className="garden-intro__lead">
                <Reveal as="h2" className="garden-kicker">The concept</Reveal>
                <Reveal as="p" className="garden-intro__statement" delay={0.10}>
                  A home that makes room for nature.
                </Reveal>
              </div>
              <Reveal as="p" className="garden-intro__description" delay={0.20}>
                LifeScape brings landscaped terraces, planted walkways and open spaces into everyday life.
              </Reveal>
            </div>
            <span className="garden-intro__scroll" aria-hidden="true"><i /> Scroll to explore</span>
          </article>

          <article className="garden-panel garden-terrace">
            <Flower id="02" placement="terrace" paused={pause} />
            <span className="garden-terrace__brand garden-kicker">Urbanrise</span>
            <h2 className="garden-terrace__title">
              <span data-garden-title-line>
                <Reveal amount={0.2}>LifeScape</Reveal>
              </span>
            </h2>
            <figure className="garden-terrace__image" ref={terraceRef}>
              <motion.img
                src={mediaRoot + 'project/garden-terrace.webp'}
                alt="Planted terraces at LifeScape"
                width="1050"
                height="1500"
                initial={reduced ? false : { clipPath: 'inset(0% 0% 0% 100%)' }}
                animate={{ clipPath: reduced || terraceVisible ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)' }}
                transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 0.3, ease: revealEase }}
              />
            </figure>
            <div className="garden-terrace__caption">
              <Reveal as="h3">Life opens outdoors</Reveal>
              <Reveal as="p" delay={0.1}>
                Gardens rise from the ground to the terraces, creating places to slow down and spend time outside.
              </Reveal>
            </div>
            <motion.a
              className="garden-terrace__link"
              href={homesUrl}
              whileHover={reduced ? undefined : { scale: 1.055 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            >
              <span>Explore the homes</span><span aria-hidden="true">↗</span>
            </motion.a>
          </article>
        </div>
      </div>
    </section>
  );
}
