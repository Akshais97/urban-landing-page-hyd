(() => {
  const finale = document.querySelector('.ur-finale');
  const invitation = finale?.querySelector('.ur-finale__invitation');
  const glint = finale?.querySelector('.ur-finale__glint');
  const { gsap, ScrollTrigger } = window;
  if (!invitation || !glint || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', context => {
    const lettering = invitation.querySelector('.ur-finale__lettering');
    const enquiry = invitation.querySelector('.ur-finale__enquiry');
    const awards = [...finale.querySelectorAll('.ur-honours__award')];
    const signatures = finale.querySelectorAll('.ur-honours__heading, .ur-honours__brand');

    gsap.timeline({
      defaults: { ease: 'power3.out', clearProps: 'opacity,transform' },
      scrollTrigger: { trigger: lettering, start: 'top 88%', once: true }
    })
      .from(lettering, { y: 26, opacity: 0, duration: 1.06 })
      .from(enquiry, { y: 12, opacity: 0.45, duration: 0.75 }, 0.24);

    signatures.forEach(item => {
      gsap.from(item, {
        y: 15,
        opacity: 0.2,
        duration: 0.86,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: item, start: 'top 94%', once: true }
      });
    });

    const awardText = awards.flatMap(item => [...item.querySelectorAll('h3 span, p span')]);
    const awardIcons = awards.map(item => item.querySelector('svg'));
    gsap.set(awardText, { yPercent: 110, opacity: 0 });
    gsap.set(awardIcons, { y: 8, opacity: 0 });

    const revealAwards = context.add(null, items => {
      const sequence = gsap.timeline({
        defaults: { ease: 'power3.out', clearProps: 'opacity,transform' }
      });
      items.forEach((item, index) => {
        const start = 0.095 * index;
        sequence
          .to(item.querySelector('svg'), { y: 0, opacity: 1, duration: 0.62 }, start)
          .to(item.querySelector('h3 span'), { yPercent: 0, opacity: 1, duration: 0.88 }, start + 0.09)
          .to(item.querySelector('p span'), { yPercent: 0, opacity: 1, duration: 0.72 }, start + 0.2);
      });
    });

    ScrollTrigger.batch(awards, {
      start: 'top 93%',
      interval: 0.09,
      once: true,
      onEnter: revealAwards
    });
  });

  motion.add({
    animate: '(prefers-reduced-motion: no-preference)',
    pointer: '(min-width: 48rem) and (hover: hover) and (pointer: fine)',
    highContrast: '(prefers-contrast: more), (forced-colors: active)'
  }, ({ conditions }) => {
    if (!conditions.animate) return;

    let visible = false;
    let position;
    let target;
    let followFrame = 0;
    let lastFrame = 0;

    function writePosition() {
      glint.style.setProperty('--ur-finale-x', `${position.x}px`);
      glint.style.setProperty('--ur-finale-y', `${position.y}px`);
    }

    function followPointer(now) {
      // Preserve the same decay across displays with different refresh rates.
      const delta = lastFrame ? now - lastFrame : 16;
      lastFrame = now;
      const advance = 1 - 0.75 ** (delta / 16);
      position.x += (target.x - position.x) * advance;
      position.y += (target.y - position.y) * advance;

      if (Math.hypot(target.x - position.x, target.y - position.y) < 0.25) {
        position = { ...target };
        followFrame = 0;
        lastFrame = 0;
      } else {
        followFrame = requestAnimationFrame(followPointer);
      }

      writePosition();
    }

    function updatePointer(event) {
      if (!visible || event.pointerType === 'touch') return;

      const bounds = glint.getBoundingClientRect();
      target = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };

      if (!position) {
        position = { ...target };
        writePosition();
        return;
      }

      if (!followFrame) followFrame = requestAnimationFrame(followPointer);
    }

    function clearPointer() {
      cancelAnimationFrame(followFrame);
      followFrame = 0;
      lastFrame = 0;
      position = undefined;
      glint.style.removeProperty('--ur-finale-x');
      glint.style.removeProperty('--ur-finale-y');
    }

    function syncVisibility() {
      const bounds = invitation.getBoundingClientRect();
      visible = bounds.top < window.innerHeight && bounds.bottom > 0;
      finale.toggleAttribute('data-ur-gleam-paused', !visible);
      if (!visible) clearPointer();
    }

    ScrollTrigger.create({
      trigger: invitation,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: syncVisibility,
      onRefresh: syncVisibility
    });
    syncVisibility();

    if (conditions.pointer && !conditions.highContrast &&
        CSS.supports('mask-image', 'radial-gradient(#000, transparent)')) {
      finale.setAttribute('data-ur-pointer-ready', '');
      window.addEventListener('pointermove', updatePointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', clearPointer);
    }

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      document.documentElement.removeEventListener('pointerleave', clearPointer);
      clearPointer();
      finale.removeAttribute('data-ur-gleam-paused');
      finale.removeAttribute('data-ur-pointer-ready');
    };
  });
})();
