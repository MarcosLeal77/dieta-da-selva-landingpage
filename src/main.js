import "./style.css";
import gsap from "gsap";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const pointerFine = window.matchMedia("(pointer: fine)").matches;

const glow = document.querySelector(".cursor-glow");
if (glow && pointerFine && !prefersReducedMotion) {
  let glowVisible = false;
  window.addEventListener("mousemove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    if (!glowVisible) {
      glow.style.opacity = "1";
      glowVisible = true;
    }
  });
  window.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
    glowVisible = false;
  });
}

const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
const hero = document.querySelector(".hero");
if (hero && parallaxItems.length && pointerFine && !prefersReducedMotion) {
  let rafId = null;
  let targetX = 0;
  let targetY = 0;

  const updateParallax = () => {
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.parallax) || 8;
      item.style.setProperty("--parallax-x", `${targetX * depth}px`);
      item.style.setProperty("--parallax-y", `${targetY * depth}px`);
    });
    rafId = null;
  };

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = x;
    targetY = y;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });

  hero.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });
}

const magneticTargets = Array.from(document.querySelectorAll("[data-magnetic]"));
if (magneticTargets.length && pointerFine && !prefersReducedMotion) {
  magneticTargets.forEach((target) => {
    target.addEventListener("mousemove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      target.style.setProperty("--magnet-x", `${x * 0.2}px`);
      target.style.setProperty("--magnet-y", `${y * 0.2}px`);
    });

    target.addEventListener("mouseleave", () => {
      target.style.setProperty("--magnet-x", "0px");
      target.style.setProperty("--magnet-y", "0px");
    });
  });
}

const tiltCards = Array.from(document.querySelectorAll(".tilt"));
if (tiltCards.length && pointerFine && !prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

const revealItems = Array.from(document.querySelectorAll(".reveal"));
if (revealItems.length) {
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const countTargets = Array.from(document.querySelectorAll("[data-count]"));
const formatNumber = (value) => value.toLocaleString("pt-BR");

const animateCount = (el) => {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${formatNumber(value)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

if (countTargets.length) {
  if (prefersReducedMotion) {
    countTargets.forEach((el) => {
      const suffix = el.dataset.suffix || "";
      const target = Number(el.dataset.count) || 0;
      el.textContent = `${formatNumber(target)}${suffix}`;
    });
  } else {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    countTargets.forEach((el) => countObserver.observe(el));
  }
}

if (!prefersReducedMotion) {
  gsap.from("[data-animate]", {
    opacity: 0,
    y: 24,
    duration: 1,
    ease: "power3.out",
    stagger: 0.12,
    delay: 0.1,
  });

  gsap.from(".hero-visual", {
    opacity: 0,
    scale: 0.96,
    duration: 1.1,
    ease: "power3.out",
    delay: 0.25,
  });
}