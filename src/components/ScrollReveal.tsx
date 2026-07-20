"use client";

import { useEffect } from "react";

/**
 * Reveal-on-scroll for elements marked with `data-reveal`. Elements already in
 * view on load stay visible (no flash); elements below the fold are hidden and
 * fade + slide up as they scroll into view. Fully skipped when the user prefers
 * reduced motion, and degrades to "everything visible" if anything is missing —
 * so content is never left stuck invisible.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const threshold = window.innerHeight * 0.85;
    const pending: HTMLElement[] = [];
    for (const el of els) {
      if (el.getBoundingClientRect().top < threshold) {
        el.classList.add("is-visible"); // already in view — reveal without hiding first
      } else {
        el.classList.add("reveal-hidden");
        pending.push(el);
      }
    }

    if (!pending.length) return;
    if (!("IntersectionObserver" in window)) {
      pending.forEach((el) => {
        el.classList.remove("reveal-hidden");
        el.classList.add("is-visible");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.remove("reveal-hidden");
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
