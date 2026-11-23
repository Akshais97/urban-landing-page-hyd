import { AnchoredGlass } from './hero.js';

const controls = '.preview-playback, .garden-terrace__link, .gallery-brand, .gallery-view, .gallery-close, .gallery-grid-name, .benchmark-surface';
const images = '.garden-terrace__image img, .image-break__frame img, .gallery-tile img, .gallery-dialog img, .gallery-grid img';

class ControlGlass extends AnchoredGlass {
  _cloneBackground() {
    // Only the scenery under the lens is copied. The live controls stay interactive.
    this.photo = document.createElement('img');
    this.photo.alt = '';
    this.photo.style.cssText = 'position:absolute;max-width:none;opacity:1;pointer-events:none';
    this.lensInner.replaceChildren(this.photo);
  }

  _syncBg() {
    if (!this.host) return super._syncBg();

    const host = this.host.getBoundingClientRect();
    const scene = this.background.getBoundingClientRect();
    const style = getComputedStyle(this.background);
    const width = this.params.width + 2 * this.margin;
    const height = this.params.height + 2 * this.margin;
    const left = host.left - this.margin;
    const top = host.top - this.margin;
    const paper = style.getPropertyValue('--color-champagne-paper').trim();

    Object.assign(this.lensInner.style, {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: style.backgroundColor === 'rgba(0, 0, 0, 0)' ? paper : style.backgroundColor,
      backgroundImage: style.backgroundImage,
      backgroundSize: `${scene.width}px ${scene.height}px`,
      backgroundPosition: `${scene.left - left}px ${scene.top - top}px`,
      backgroundRepeat: 'no-repeat'
    });

    const nearby = [...this.background.querySelectorAll(images)].find(image => {
      if (image.closest('.lqg-lens') || !image.complete || !image.naturalWidth) return false;
      const bounds = image.getBoundingClientRect();
      return bounds.right > left && bounds.left < left + width &&
        bounds.bottom > top && bounds.top < top + height;
    });
    this.photo.hidden = !nearby;
    if (!nearby) return;

    if (this.photo.getAttribute('src') !== nearby.currentSrc) this.photo.src = nearby.currentSrc;
    const picture = nearby.getBoundingClientRect();
    const photoStyle = getComputedStyle(nearby);
    Object.assign(this.photo.style, {
      left: `${picture.left - left}px`,
      top: `${picture.top - top}px`,
      width: `${picture.width}px`,
      height: `${picture.height}px`,
      objectFit: photoStyle.objectFit,
      objectPosition: photoStyle.objectPosition
    });
  }

  placeLens() {
    if (!this.host) return super.placeLens();
    this.placeLayers(0, 0);
  }
}

export function observeControlGlass(root) {
  if (matchMedia('(forced-colors: active)').matches) return;

  const lenses = new Map();
  const targets = root.querySelectorAll(controls);

  function detach(host) {
    lenses.get(host)?.destroy();
    lenses.delete(host);
    host.classList.remove('experience-glass', 'experience-glass--anchor');
  }

  function paint(host) {
    const width = host.offsetWidth;
    const height = host.offsetHeight;
    if (!width || !height) return;

    const style = getComputedStyle(host);
    const radius = Math.min(parseFloat(style.borderTopLeftRadius), width / 2, height / 2);
    const geometry = { width, height, radius, depth: Math.min(15, height / 2 - 1) };
    const mounted = lenses.get(host);
    if (mounted) {
      if (mounted.params.width !== width || mounted.params.height !== height || mounted.params.radius !== radius) {
        mounted.set(geometry);
      }
      mounted._syncBg();
      mounted.placeLens();
      return;
    }

    const benchmarkScene = host.closest('.benchmarks')?.querySelector('.benchmark-scene');
    const background = benchmarkScene ?? host.closest('.gallery-dialog, .gallery-stage, .garden-terrace, .experience-living');
    const Glass = benchmarkScene ? AnchoredGlass : ControlGlass;
    const lens = new Glass({
      ...geometry,
      background,
      draggable: false,
      zIndex: -2,
      scale: 21,
      blur: 1.15,
      tint: 0.08,
      tintColor: '#e8d9b6',
      glow: 0.07,
      curvature: 3.2,
      chroma: host.classList.contains('preview-playback') ? 0 : 0.09,
      edge: 0.9
    });
    lens.host = host;
    lens.lensEl.setAttribute('aria-hidden', 'true');
    lens.glassEl.setAttribute('aria-hidden', 'true');
    host.classList.toggle('experience-glass--anchor', style.position === 'static');
    host.classList.add('experience-glass');
    host.prepend(lens.lensEl, lens.glassEl);
    lens._syncBg();
    lens.placeLens();
    lenses.set(host, lens);
  }

  const resize = new ResizeObserver(entries => entries.forEach(({ target }) => paint(target)));
  const visible = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) {
        paint(target);
        resize.observe(target);
      } else {
        resize.unobserve(target);
        detach(target);
      }
    }
  });
  targets.forEach(target => visible.observe(target));

  return () => {
    visible.disconnect();
    resize.disconnect();
    lenses.forEach((_lens, host) => detach(host));
  };
}
