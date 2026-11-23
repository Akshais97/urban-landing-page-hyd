import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../assets/hero/vendor/liquid-glass.umd.min.js';

// The shared hero film initializes against its original static markup.
Object.assign(window, { gsap, ScrollTrigger });
void import('../../assets/hero/hero.js');

const hero = document.querySelector('.abundance-hero');
const nav = hero.querySelector('.navpill');
const thumb = nav.querySelector('.navthumb');
const menu = hero.querySelector('#ov-menu');
const toggle = hero.querySelector('#menuToggle');
const scene = hero.querySelector('.abundance-scene');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const lenses = new Map();
const movingLenses = new WeakMap();

export class AnchoredGlass extends window.LiquidGlass {
  placeLens() {
    if (!this.host) return super.placeLens();
    const host = this.host.getBoundingClientRect();
    const background = this.background.getBoundingClientRect();
    this.placeLayers(
      Math.round(background.left - host.left + this.margin),
      Math.round(background.top - host.top + this.margin)
    );
  }

  placeLayers(left, top) {
    const { width, height, radius } = this.params;

    this.lensEl.style.left = this.lensEl.style.top = `${-this.margin}px`;
    this.lensInner.style.left = `${left}px`;
    this.lensInner.style.top = `${top}px`;
    Object.assign(this.glassEl.style, {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: `${radius}px`,
      transform: 'none',
    });
  }
}

function paintLens(host) {
  const width = host.offsetWidth;
  const height = host.offsetHeight;
  if (!width || !height) return;

  const radius = Math.min(parseFloat(getComputedStyle(host).borderTopLeftRadius), width / 2, height / 2);
  const options = JSON.parse(host.dataset.lg);
  const geometry = { width, height, radius, depth: options.depth ?? Math.min(22, height / 2 - 1) };
  const existing = lenses.get(host);

  if (existing) {
    if (existing.params.width !== width || existing.params.height !== height) existing.set(geometry);
    existing._syncBg();
    existing.placeLens();
    return;
  }

  const lens = new AnchoredGlass({
    background: scene,
    draggable: false,
    zIndex: 0,
    blur: 1.25,
    tint: 0.06,
    glow: 0.05,
    curvature: 3.2,
    chroma: 0.12,
    edge: 0.85,
    tintColor: getComputedStyle(hero).getPropertyValue('--glass-champagne').trim(),
    ...options,
    ...geometry,
  });
  lens.host = host;
  window.removeEventListener('scroll', lens._onSync, true);
  lens.lensEl.setAttribute('aria-hidden', 'true');
  lens.glassEl.setAttribute('aria-hidden', 'true');
  host.prepend(lens.lensEl, lens.glassEl);
  lens.refresh();
  lenses.set(host, lens);
  host.classList.add('lg-on');
}

hero.addEventListener('transitionrun', ({ target, propertyName }) => {
  const lens = lenses.get(target);
  if (!lens || !['left', 'width', 'transform'].includes(propertyName)) return;
  cancelAnimationFrame(movingLenses.get(target));
  const end = performance.now() + 480;

  function follow(now) {
    if (!target.offsetWidth) return;
    lens.placeLens();
    if (now < end) movingLenses.set(target, requestAnimationFrame(follow));
  }

  movingLenses.set(target, requestAnimationFrame(follow));
});

function moveThumb(link) {
  if (!link || !nav.offsetWidth) return;
  thumb.style.left = `${Math.round(link.getBoundingClientRect().left - nav.getBoundingClientRect().left)}px`;
  thumb.style.width = `${link.offsetWidth}px`;
  paintLens(thumb);
}

function resetThumb() {
  moveThumb(nav.querySelector('[aria-current]'));
}

const resize = new ResizeObserver(entries => entries.forEach(({ target }) => paintLens(target)));
hero.querySelectorAll('.lg').forEach(host => resize.observe(host));
document.fonts.ready.then(resetThumb);
window.addEventListener('resize', resetThumb, { passive: true });
nav.addEventListener('pointerover', event => moveThumb(event.target.closest('a')));
nav.addEventListener('pointerleave', resetThumb);
nav.addEventListener('focusin', event => moveThumb(event.target.closest('a')));
nav.addEventListener('focusout', event => {
  if (!nav.contains(event.relatedTarget)) resetThumb();
});

let closeTimer;
const menuIsOpen = () => toggle.getAttribute('aria-expanded') === 'true';

function setMenu(open, returnFocus = false) {
  clearTimeout(closeTimer);
  if (open) {
    menu.hidden = false;
    paintLens(menu);
    menu.getBoundingClientRect();
  } else if (returnFocus || menu.contains(document.activeElement)) {
    toggle.focus({ preventScroll: true });
  }

  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.inert = !open;
  menu.classList.toggle('is-open', open);
  if (!open) {
    if (reducedMotion.matches) menu.hidden = true;
    else closeTimer = setTimeout(() => { menu.hidden = true; }, 360);
  }
}

toggle.addEventListener('click', () => setMenu(!menuIsOpen()));
document.addEventListener('click', event => {
  if (!menuIsOpen()) return;
  if (event.target.closest('#ov-menu a') || (!menu.contains(event.target) && !toggle.contains(event.target))) {
    setMenu(false);
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuIsOpen()) {
    event.preventDefault();
    setMenu(false, true);
  }
});
