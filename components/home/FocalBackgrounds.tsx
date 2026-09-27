"use client";

import { useEffect } from "react";

/**
 * Wix "fill" backgrounds with a focal point: the image covers the section and
 * is shifted so the focal point sits as close to the centre as the edges
 * allow. CSS percentages can't express that (the shift depends on the
 * section's live height), so any element with `data-focal="x y"` (percent)
 * and `data-ratio` (image width ÷ height) is positioned here, and kept in step
 * with its size. The stylesheet's `cover` + percentage stays as the fallback.
 */
export default function FocalBackgrounds() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-focal]"));

    const place = (el: HTMLElement) => {
      const [fx, fy] = (el.dataset.focal ?? "50 50").split(" ").map((v) => Number(v) / 100);
      const ratio = Number(el.dataset.ratio);
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h || !ratio) return;

      const iw = Math.max(w, h * ratio);
      const ih = iw / ratio;
      const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);
      const ox = clamp(fx * iw - w / 2, iw - w);
      const oy = clamp(fy * ih - h / 2, ih - h);

      el.style.backgroundSize = `${iw}px ${ih}px`;
      el.style.backgroundPosition = `${-ox}px ${-oy}px`;
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) place(entry.target as HTMLElement);
    });
    els.forEach((el) => {
      place(el);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
