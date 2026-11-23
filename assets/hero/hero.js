(() => {
  const root = document.documentElement;
  const hero = document.querySelector(".abundance-hero");
  if (!hero) return;

  function matchDevicePixels() {
    hero.style.setProperty("--hero-device-pixel", `${1 / window.devicePixelRatio}px`);
  }
  matchDevicePixels();
  window.addEventListener("resize", matchDevicePixels, { passive: true });

  root.dataset.heroReady = "";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const video = hero.querySelector("video");
  const plate = hero.querySelector(".abundance-plate");
  const sampler = hero.querySelector(".abundance-sample");
  const sample = sampler.getContext("2d", { alpha: false });
  const stillReady = (plate.decode ? plate.decode() : Promise.resolve()).then(
    () => true, () => false,
  );
  const eventScope = new AbortController();
  const { signal } = eventScope;
  let entrance;
  let scrollMotion;
  let firstFrameTimer;
  let stallTimer;
  let frameId;
  let observer;
  let settled = false;
  let usedFallback = false;
  let sourceAttempt = 0;
  const hasVideoFrames = typeof video.requestVideoFrameCallback === "function";

  function finishEntrance() {
    entrance?.progress(1);
    root.classList.remove("hero-opening");
  }

  function playEntrance() {
    const gsap = window.gsap;
    if (!gsap) {
      finishEntrance();
      return;
    }

    const papers = hero.querySelectorAll(".abundance-paper");
    const titleLines = hero.querySelectorAll(".abundance-title-line > span");
    entrance = gsap.timeline({
      onComplete: () => root.classList.remove("hero-opening"),
    });
    entrance
      .fromTo(hero, { "--hero-opening-scale": 1.065, "--hero-opening-y": "7px" },
        { "--hero-opening-scale": 1, "--hero-opening-y": "0px", duration: 1.2, ease: "power3.out" }, 0)
      .to(papers[0], { xPercent: -108, duration: 0.92, ease: "power3.inOut" }, 0)
      .to(papers[1], { xPercent: 108, duration: 0.98, ease: "power3.inOut" }, 0.05)
      .fromTo(hero.querySelector(".topbar"), { opacity: 0 },
        { opacity: 1, duration: 0.46, ease: "power2.out" }, 0.37)
      .fromTo(titleLines, { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.72, stagger: 0.075, ease: "power3.out" }, 0.37)
      .fromTo(hero.querySelectorAll(".abundance-project, .abundance-actions, .abundance-scroll"),
        { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.075, duration: 0.60, ease: "power2.out" }, 0.45);

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
      scrollMotion = gsap.to(hero, {
        "--hero-scroll-y": () => `${Math.round(hero.clientHeight * 0.12)}px`,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });
    }
    hero.addEventListener("focusin", finishEntrance, { once: true });
    window.addEventListener("wheel", finishEntrance, { once: true, passive: true });
    window.addEventListener("touchmove", finishEntrance, { once: true, passive: true });
    setTimeout(finishEntrance, 1500);
  }

  function paintLenses() {
    if (!sample || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    sample.drawImage(video, 0, 0, sampler.width, sampler.height);
    for (const lens of hero.querySelectorAll(".lqg-lens-inner .abundance-sample")) {
      if (lens.closest("[hidden]")) continue;
      lens.getContext("2d", { alpha: false })?.drawImage(sampler, 0, 0);
      if (!lens.hasAttribute("data-frame")) lens.dataset.frame = "";
    }
  }

  function sampleNextFrame() {
    if (settled) return;
    paintLenses();
    frameId = hasVideoFrames
      ? video.requestVideoFrameCallback(sampleNextFrame)
      : requestAnimationFrame(sampleNextFrame);
  }

  async function showStill() {
    if (settled) return;
    settled = true;
    clearTimeout(firstFrameTimer);
    clearTimeout(stallTimer);
    observer?.disconnect();
    eventScope.abort();
    if (frameId !== undefined) {
      if (hasVideoFrames) video.cancelVideoFrameCallback(frameId);
      else cancelAnimationFrame(frameId);
    }
    video.pause();

    // The last encoded frame is the same plate. Hold it until the image can paint.
    if (await stillReady) {
      root.dataset.heroFilm = "still";
      video.removeAttribute("src");
      video.load();
    }
  }

  function beginVideo(source) {
    const attempt = ++sourceAttempt;
    video.src = source;
    video.play().catch((error) => {
      if (settled || attempt !== sourceAttempt) return;
      if (video.error || error.name === "NotSupportedError") tryFallback();
      else showStill();
    });
  }

  function tryFallback() {
    if (!usedFallback && root.dataset.heroFilm === "opening") {
      usedFallback = true;
      beginVideo(video.dataset.mp4);
    } else {
      showStill();
    }
  }

  if (root.dataset.heroFilm !== "opening" || reducedMotion.matches) {
    root.dataset.heroFilm = "still";
    finishEntrance();
    return;
  }

  playEntrance();
  reducedMotion.addEventListener?.("change", () => {
    if (!reducedMotion.matches) return;
    finishEntrance();
    scrollMotion?.scrollTrigger?.kill();
    scrollMotion?.revert();
    showStill();
  }, { once: true });
  video.addEventListener("ended", showStill, { signal });
  video.addEventListener("error", tryFallback, { signal });
  video.addEventListener("waiting", () => {
    stallTimer ??= setTimeout(showStill, 3500);
  }, { signal });
  video.addEventListener("playing", () => {
    clearTimeout(firstFrameTimer);
    clearTimeout(stallTimer);
    stallTimer = undefined;
    if (root.dataset.heroFilm === "playing") return;
    root.dataset.heroFilm = "playing";
    sampleNextFrame();
  }, { signal });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) showStill();
  }, { signal });

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.12) {
        finishEntrance();
        showStill();
      }
    }, { threshold: 0.12 });
    observer.observe(hero);
  }

  usedFallback = !video.canPlayType('video/webm; codecs="vp9"');
  firstFrameTimer = setTimeout(showStill, 4200);
  beginVideo(usedFallback ? video.dataset.mp4 : video.dataset.webm);
})();
