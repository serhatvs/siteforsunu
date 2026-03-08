import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const budgetFormatter = new Intl.NumberFormat("tr-TR");

const getFrameValue = (frame, key, fallback) => {
  const value = Number.parseFloat(frame.dataset[key] ?? "");
  return Number.isFinite(value) ? value : fallback;
};

const setFrameVisibility = (frames, captions, activeIndex) => {
  frames.forEach((frame, index) => {
    frame.setAttribute("aria-hidden", String(index !== activeIndex));
  });

  captions.forEach((caption, index) => {
    caption.setAttribute("aria-hidden", String(index !== activeIndex));
  });
};

const getActiveFrameIndex = (progress) => {
  if (progress < 0.14) return 0;
  if (progress < 0.28) return 1;
  if (progress < 0.42) return 2;
  if (progress < 0.56) return 3;
  if (progress < 0.7) return 4;
  if (progress < 0.84) return 5;
  return 6;
};

const revealHero = (reducedMotion) => {
  const items = gsap.utils.toArray("[data-hero-reveal]");

  if (!items.length) return;

  if (reducedMotion) {
    gsap.set(items, { autoAlpha: 1, y: 0, clearProps: "transform" });
    return;
  }

  gsap.from(items, {
    autoAlpha: 0,
    y: 28,
    duration: 1.1,
    stagger: 0.08,
    ease: "power3.out",
    clearProps: "transform"
  });
};

const initFrameSequence = (reducedMotion) => {
  const container = document.querySelector("[data-frame-scroll]");
  const frameStack = document.querySelector("[data-frame-stack]");
  const grid = document.querySelector(".frame-stage__grid");
  const glow = document.querySelector(".frame-stage__glow");
  const vignette = document.querySelector(".frame-stage__vignette");
  const frames = gsap.utils.toArray("[data-story-frame]");
  const captions = gsap.utils.toArray("[data-frame-caption]");

  if (!container || !frameStack || !frames.length || !captions.length) {
    return;
  }

  if (reducedMotion) {
    gsap.set(frames, { clearProps: "all" });
    gsap.set(captions, { clearProps: "all" });
    gsap.set(frames[0], { autoAlpha: 1, visibility: "visible" });
    gsap.set(captions[0], { autoAlpha: 1, visibility: "visible" });
    setFrameVisibility(frames, captions, 0);
    return;
  }

  frames.forEach((frame, index) => {
    frame.style.zIndex = String(index + 1);

    if (index === 0) {
      gsap.set(frame, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)"
      });
      return;
    }

    gsap.set(frame, {
      autoAlpha: 0,
      scale: getFrameValue(frame, "enterScale", 1.05),
      y: getFrameValue(frame, "enterY", 20),
      filter: `blur(${getFrameValue(frame, "enterBlur", 8)}px)`
    });
  });

  captions.forEach((caption, index) => {
    caption.style.zIndex = String(index + 1);

    if (index === 0) {
      gsap.set(caption, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)"
      });
      return;
    }

    gsap.set(caption, {
      autoAlpha: 0,
      y: 18,
      filter: "blur(6px)"
    });
  });

  gsap.set(frameStack, { scale: 1, yPercent: 0 });
  gsap.set(grid, { autoAlpha: 0.22 });
  gsap.set(glow, { autoAlpha: 0.56, scale: 0.96 });
  gsap.set(vignette, { autoAlpha: 0.86 });
  setFrameVisibility(frames, captions, 0);

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.15,
      onUpdate: (self) => {
        setFrameVisibility(frames, captions, getActiveFrameIndex(self.progress));
      }
    }
  });

  timeline.to(
    glow,
    {
      autoAlpha: 0.84,
      scale: 1.08,
      duration: 100
    },
    0
  );

  timeline.to(
    grid,
    {
      autoAlpha: 0.38,
      duration: 100
    },
    0
  );

  timeline.to(
    vignette,
    {
      autoAlpha: 0.94,
      duration: 100
    },
    0
  );

  timeline.to(
    frameStack,
    {
      scale: 1.015,
      duration: 52
    },
    0
  );

  timeline.to(
    frameStack,
    {
      scale: 0.99,
      yPercent: -1.5,
      duration: 48
    },
    52
  );

  const boundaries = [14, 28, 42, 56, 70, 84];
  const overlap = 8;

  boundaries.forEach((boundary, index) => {
    const outgoing = frames[index];
    const incoming = frames[index + 1];
    const outgoingCaption = captions[index];
    const incomingCaption = captions[index + 1];
    const startAt = boundary - overlap / 2;

    timeline.to(
      outgoing,
      {
        autoAlpha: 0,
        scale: getFrameValue(outgoing, "exitScale", 1.06),
        y: getFrameValue(outgoing, "exitY", -16),
        filter: `blur(${getFrameValue(outgoing, "exitBlur", 8)}px)`,
        duration: overlap
      },
      startAt
    );

    timeline.fromTo(
      incoming,
      {
        autoAlpha: 0,
        scale: getFrameValue(incoming, "enterScale", 1.05),
        y: getFrameValue(incoming, "enterY", 18),
        filter: `blur(${getFrameValue(incoming, "enterBlur", 8)}px)`
      },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: overlap
      },
      startAt
    );

    timeline.to(
      outgoingCaption,
      {
        autoAlpha: 0,
        y: -12,
        filter: "blur(6px)",
        duration: overlap * 0.85
      },
      startAt
    );

    timeline.fromTo(
      incomingCaption,
      {
        autoAlpha: 0,
        y: 18,
        filter: "blur(6px)"
      },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: overlap * 0.85
      },
      startAt + 0.45
    );
  });
};

const initSectionReveals = (reducedMotion) => {
  const items = gsap.utils.toArray("[data-reveal]");

  if (!items.length) return;

  if (reducedMotion) {
    gsap.set(items, { autoAlpha: 1, y: 0, clearProps: "transform" });
    return;
  }

  items.forEach((item) => {
    gsap.from(item, {
      autoAlpha: 0,
      y: 30,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 84%",
        once: true
      }
    });
  });
};

const initChallengeReveals = (reducedMotion) => {
  const section = document.querySelector("#challenges");
  const cards = gsap.utils.toArray("[data-challenge-card]");

  if (!section || !cards.length) return;

  if (reducedMotion) {
    gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: "transform" });
    return;
  }

  gsap.from(cards, {
    autoAlpha: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 78%",
      once: true
    }
  });
};

const initBudgetCounters = (reducedMotion) => {
  const counters = gsap.utils.toArray("[data-budget-value]");

  if (!counters.length) return;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.budgetValue);

    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      counter.textContent = `${budgetFormatter.format(target)} TL`;
      return;
    }

    const state = { value: 0 };

    ScrollTrigger.create({
      trigger: counter,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = `${budgetFormatter.format(Math.round(state.value))} TL`;
          }
        });
      }
    });
  });
};

export const initAnimations = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.toggle("reduced-motion", reducedMotion);

  revealHero(reducedMotion);
  initFrameSequence(reducedMotion);
  initSectionReveals(reducedMotion);
  initChallengeReveals(reducedMotion);
  initBudgetCounters(reducedMotion);

  ScrollTrigger.refresh();
};
