import { AnchoredGlass } from './hero.js';

const controls = '.preview-playback, .garden-terrace__link, .gallery-brand, .gallery-view, .gallery-close, .gallery-grid-name, .benchmark-surface';
const images = '.garden-terrace__image img, .image-break__frame img, .gallery-tile img, .gallery-dialog img, .gallery-grid img';
const chapters = '.release, .home-questionnaire, .residence-configuration, .carbon-calculator, .abundance-story-section, .founding-access';
const chapterGlass = '[data-chapter-glass]';
const smokedSection = '[data-smoked-glass]';
const glassPanel = '[data-chapter-glass="panel"]';

class SceneryGlass extends AnchoredGlass {
  _cloneBackground() {
    super._cloneBackground();
    this.sceneCopy = this.lensInner.firstElementChild;
    this.image = this.background.querySelector(':scope > img');
    this.imageCopy = this.sceneCopy.querySelector(':scope > img');
    this.imageCopy.loading = 'eager';
  }

  _syncBg() {
    super._syncBg();
    this.sceneCopy.style.opacity = this.background.style.opacity;
    this.imageCopy.style.transform = this.image.style.transform;
  }
}

class SmokedSceneryGlass extends SceneryGlass {
  placeLens() {
    if (!this.host) return super.placeLens();
    this.bounds = this.host.getBoundingClientRect();
    this.placeLayers(
      Math.round(this.bgX - this.bounds.left + this.margin),
      Math.round(this.bgY - this.bounds.top + this.margin)
    );
  }
}

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
  const intersecting = new Set();
  const opticalMedia = matchMedia('(min-width: 1600px) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  const supportsRefraction = 'SVGFEDisplacementMapElement' in window;
  let specularFrame;

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
    const panel = host.dataset.chapterGlass === 'panel';
    const smoked = host.closest(smokedSection);
    const depth = smoked ? parseFloat(style.getPropertyValue('--smoked-edge-depth')) : panel ? Math.max(15, radius * .7) : 15;
    const geometry = { width, height, radius, depth: Math.min(depth, height / 2 - 1, width / 2 - 1) };
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
    const chapter = host.matches(chapterGlass) ? host.closest(chapters) : null;
    const chapterScene = chapter?.querySelector(':scope > picture');
    const scenery = benchmarkScene ?? chapterScene;
    const background = scenery ?? chapter
      ?? host.closest('.gallery-dialog, .gallery-stage, .garden-terrace, .experience-living');
    const sceneImage = smoked && chapterScene?.querySelector(':scope > img');
    if (smoked && (!sceneImage?.complete || !sceneImage.naturalWidth)) return;

    const Glass = smoked ? SmokedSceneryGlass : scenery ? SceneryGlass : ControlGlass;
    const lens = new Glass({
      ...geometry,
      background,
      draggable: false,
      zIndex: -2,
      scale: smoked ? parseFloat(style.getPropertyValue('--smoked-refraction')) : panel ? 24 : 21,
      blur: smoked ? 0 : 1.15,
      tint: 0.08,
      tintColor: '#e8d9b6',
      glow: smoked ? 0 : 0.07,
      curvature: 3.2,
      chroma: smoked || host.classList.contains('preview-playback') || (chapter && !scenery) ? 0 : 0.09,
      edge: smoked ? parseFloat(style.getPropertyValue('--smoked-specular')) : 0.9
    });
    // The vendor's single-pass filter provides neutral displacement without splitting RGB.
    if (smoked || (chapter && !scenery)) lens.setDragMode(true);
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
      if (isIntersecting && shouldRefract(target)) {
        intersecting.add(target);
        paint(target);
        resize.observe(target);
      } else {
        intersecting.delete(target);
        resize.unobserve(target);
        detach(target);
      }
    }
  });
  root.querySelectorAll(controls).forEach(target => visible.observe(target));

  const chapterRoots = [...root.querySelectorAll(chapters)];
  const scenes = new Set(chapterRoots.map(chapter => chapter.querySelector(':scope > picture')).filter(Boolean));
  const tracked = new Set();

  function shouldRefract(target) {
    return !target.closest(smokedSection)
      || (supportsRefraction && opticalMedia.matches && target.matches(glassPanel));
  }

  function syncChapterControls() {
    for (const target of tracked) {
      if (root.contains(target) && shouldRefract(target)) continue;
      visible.unobserve(target);
      resize.unobserve(target);
      intersecting.delete(target);
      detach(target);
      tracked.delete(target);
    }
    for (const target of root.querySelectorAll(chapterGlass)) {
      if (tracked.has(target) || !shouldRefract(target)) continue;
      tracked.add(target);
      visible.observe(target);
    }
  }

  function syncLoadedScene({ target }) {
    if (!target.matches(`${smokedSection} > picture > img`)) return;
    const section = target.closest(smokedSection);
    for (const host of intersecting) {
      if (section.contains(host) && !lenses.has(host)) paint(host);
    }
  }

  function moveSpecular({ target, pointerType, clientX, clientY }) {
    if (pointerType !== 'mouse' || !opticalMedia.matches) return;
    const host = target.closest(glassPanel);
    const lens = lenses.get(host);
    if (!lens?.bounds) return;
    cancelAnimationFrame(specularFrame);
    specularFrame = requestAnimationFrame(() => {
      if (lenses.get(host) !== lens) return;
      lens.glassEl.style.setProperty('--smoked-light-x', `${Math.round(clientX - lens.bounds.left)}px`);
      lens.glassEl.style.setProperty('--smoked-light-y', `${Math.round(clientY - lens.bounds.top)}px`);
    });
  }

  const updates = new MutationObserver(records => {
    let controlsChanged = false;
    const movingScenes = new Set();
    const movingControls = new Set();
    for (const { target, type, addedNodes, removedNodes } of records) {
      if (!(target instanceof Element) || target.closest('.lqg-lens, .lqg-glass')) continue;
      if (type === 'childList') {
        controlsChanged ||= [...addedNodes, ...removedNodes].some(node => node instanceof Element
          && (node.matches(chapterGlass) || node.querySelector(chapterGlass)));
      } else {
        if (tracked.has(target)) movingControls.add(target);
        const scene = target.closest('picture');
        if (scenes.has(scene)) movingScenes.add(scene);
      }
    }
    if (controlsChanged) syncChapterControls();
    if (movingControls.size || movingScenes.size) {
      for (const [host, lens] of lenses) {
        const panel = host.parentElement?.closest('[data-chapter-glass="panel"]');
        if (movingScenes.has(lens.background) || movingControls.has(host) || movingControls.has(panel)) {
          lens._onSync();
        }
      }
    }
  });
  for (const chapter of chapterRoots) {
    updates.observe(chapter, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
  }
  syncChapterControls();
  opticalMedia.addEventListener('change', syncChapterControls);
  root.addEventListener('load', syncLoadedScene, true);
  root.addEventListener('pointermove', moveSpecular, { passive: true });

  return () => {
    cancelAnimationFrame(specularFrame);
    opticalMedia.removeEventListener('change', syncChapterControls);
    root.removeEventListener('load', syncLoadedScene, true);
    root.removeEventListener('pointermove', moveSpecular);
    updates.disconnect();
    visible.disconnect();
    resize.disconnect();
    lenses.forEach((_lens, host) => detach(host));
  };
}
