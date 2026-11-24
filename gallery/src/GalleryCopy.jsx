import { useContext, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, PresenceContext } from 'framer-motion';
import gsap from 'gsap';

const easeIn = [0.22, 1, 0.36, 1];
const easeOut = [0.64, 0, 0.78, 0];
const word = {
  enter: {},
  visible: { transition: { staggerChildren: 0.025, delayChildren: 0.09 } },
  leave: { transition: { staggerChildren: 0.012 } },
};
const letter = {
  enter: direction => ({ y: `${direction * 110}%`, opacity: 0, rotate: direction * 5 }),
  visible: { y: '0%', opacity: 1, rotate: 0, transition: { duration: 0.8, ease: easeIn } },
  leave: direction => ({ y: `${direction * -105}%`, opacity: 0, rotate: direction * -3, transition: { duration: 0.3, ease: easeOut } }),
};
const caption = {
  enter: direction => ({ y: direction * 26, opacity: 0 }),
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, delay: 0.12, ease: easeIn } },
  leave: direction => ({ y: direction * -22, opacity: 0, transition: { duration: 0.26, ease: easeOut } }),
};

function playShine(element) {
  gsap.fromTo(element, { opacity: 1, '--gallery-foil-position': '87%' }, {
    '--gallery-foil-position': '0%',
    delay: 0.005,
    duration: 1.35,
    ease: 'power1.out',
    immediateRender: false,
  });
}

function GalleryWord({ abundance, direction }) {
  const shine = useRef(null);
  const leaving = useRef(false);
  const startsVisible = useContext(PresenceContext)?.initial === false;
  const { contextSafe } = useGSAP((_, safe) => {
    // AnimatePresence skips the entrance callback for the opening word.
    if (!startsVisible) return;

    let cancelled = false;
    document.fonts.ready.then(safe(() => {
      if (!cancelled && !leaving.current) playShine(shine.current);
    }));

    return () => { cancelled = true; };
  });
  const characters = [...abundance];

  const finishEntry = contextSafe(variant => {
    if (variant !== 'visible' || leaving.current) return;
    playShine(shine.current);
  });

  const handleAnimationStart = contextSafe(variant => {
    leaving.current = variant === 'leave';
    if (!leaving.current) return;
    gsap.killTweensOf(shine.current);
    gsap.to(shine.current, { opacity: 0, duration: 0.1, ease: 'power2.out' });
  });

  return (
    <motion.span className="gallery-word" custom={direction} variants={word}
      initial="enter" animate="visible" exit="leave"
      onAnimationStart={handleAnimationStart} onAnimationComplete={finishEntry}>
      {characters.map((character, index) => (
        <motion.span className="gallery-letter" key={index} custom={direction} variants={letter}>
          <span className="gallery-gold-text">{character}</span>
        </motion.span>
      ))}
      <span ref={shine} className="gallery-word-shine" aria-hidden="true">
        {characters.map((character, index) => <span key={index}>{character}</span>)}
      </span>
    </motion.span>
  );
}

export default function GalleryCopy({ photo, direction, reducedMotion }) {
  return <>
    <div className="gallery-heading">
      <h1 id="gallery-title" aria-label={`An Abundance of ${reducedMotion ? 'Life' : photo.abundance}`}>
        <span className="gallery-prefix" aria-hidden="true">An Abundance of</span>
        <span className="gallery-word-mask" aria-hidden="true">
          {reducedMotion ? <span className="gallery-word gallery-gold-text">Life</span> : (
            <AnimatePresence initial={false} custom={direction}>
              <GalleryWord key={photo.file} abundance={photo.abundance} direction={direction} />
            </AnimatePresence>
          )}
        </span>
      </h1>
    </div>
    <div className="gallery-caption" aria-hidden="true">
      <span className="gallery-caption-rule" />
      <div className="gallery-caption-mask">
        <AnimatePresence initial={false} custom={direction}>
          <motion.p key={photo.file} custom={direction} variants={caption} initial="enter" animate="visible" exit="leave">
            {photo.name}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
    <p className="sr-only" role="status" aria-atomic="true">An Abundance of {photo.abundance}. {photo.name}.</p>
  </>;
}
