"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import styles from "./home.module.css";

type Item = { src: string; alt: string; href?: string };

/** Pointer travel (px) after which a press counts as a drag, not a click. */
const DRAG_THRESHOLD = 6;

/**
 * Continuous auto-scrolling strip — the Wix Pro Gallery "continuous
 * slideshow" (speed 40, looping, no arrows). Items keep the gallery's height
 * and their own aspect ratio; the list is repeated so one pass is wider than
 * the widest viewport, then doubled so the strip can wrap seamlessly.
 *
 * Like the Wix gallery it can be grabbed and dragged either way with a mouse
 * or a finger; a flick carries on with some momentum and then the strip eases
 * back into its automatic drift. Hovering with a mouse pauses the drift.
 *
 * `rtl` mirrors a gallery set to right-to-left: the first item sits at the
 * right edge, the list runs leftwards from there and the strip drifts right.
 */
export default function Marquee({
  items,
  ratio,
  gap,
  copies,
  height,
  className,
  rtl = false,
}: {
  items: Item[];
  /** Item width ÷ height, from the Wix gallery's item box. */
  ratio: number;
  /** Space between items in px (Wix "imageMargin"). */
  gap: number;
  /** How many times the list repeats in one pass. */
  copies: number;
  /** Desktop gallery height in px — sets the scroll speed. */
  height: number;
  className: string;
  rtl?: boolean;
}) {
  const pass = Array.from({ length: copies }, () => items).flat();
  const track = [...pass, ...pass];
  // Wix speed 40 ≈ 40px/s at the desktop item height; one pass takes this
  // long at every breakpoint, so smaller galleries drift proportionally slower.
  const passSeconds = (pass.length * (ratio * height + gap)) / 40;
  // RTL galleries split the margin around each item; LTR ones trail it.
  const spacing: CSSProperties = rtl
    ? { marginLeft: gap / 2, marginRight: gap / 2 }
    : { marginRight: gap };

  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    offset: 0,
    velocity: 0, // px/s of leftover fling momentum
    hovering: false,
    dragging: false,
    pointerId: -1,
    startX: 0,
    startOffset: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const s = state.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = rtl ? 1 : -1;
    let raf = 0;
    let prev = performance.now();

    // Keep the offset inside one pass so the doubled track always covers the
    // gallery: LTR strips sit in (-pass, 0], RTL ones in [0, pass).
    const wrap = (o: number, passWidth: number) => {
      if (!passWidth) return o;
      const m = ((o % passWidth) + passWidth) % passWidth;
      return rtl ? m : m === 0 ? 0 : m - passWidth;
    };

    const frame = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.1);
      prev = now;
      const passWidth = el.scrollWidth / 2;

      if (!s.dragging) {
        if (Math.abs(s.velocity) > 1) {
          s.offset += s.velocity * dt;
          s.velocity *= Math.exp(-4 * dt); // friction after a flick
        } else {
          s.velocity = 0;
          if (!s.hovering && !reduceMotion && passWidth) {
            s.offset += (dir * passWidth * dt) / passSeconds;
          }
        }
      }
      s.offset = wrap(s.offset, passWidth);
      el.style.transform = `translate3d(${s.offset}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [rtl, passSeconds]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const s = state.current;
    s.dragging = true;
    s.pointerId = e.pointerId;
    s.startX = s.lastX = e.clientX;
    s.lastT = performance.now();
    s.startOffset = s.offset;
    s.velocity = 0;
    s.moved = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      s.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!s.moved) return;
    const now = performance.now();
    const dt = (now - s.lastT) / 1000;
    if (dt > 0) s.velocity = 0.8 * ((e.clientX - s.lastX) / dt) + 0.2 * s.velocity;
    s.lastX = e.clientX;
    s.lastT = now;
    s.offset = s.startOffset + dx;
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    s.dragging = false;
    // A pause before letting go means no fling.
    if (!s.moved || performance.now() - s.lastT > 80) s.velocity = 0;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Swallow the click that ends a drag so linked items don't navigate.
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  return (
    <div
      className={`${styles.marquee} ${rtl ? styles.marqueeRtl : ""} ${className}`}
      style={{ "--ratio": ratio } as CSSProperties}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") state.current.hovering = true;
      }}
      onPointerLeave={() => {
        state.current.hovering = false;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={trackRef} className={styles.track}>
        {track.map((item, i) => {
          const hidden = i >= items.length;
          const img = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={hidden ? "" : item.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          );
          return item.href ? (
            <Link
              key={i}
              href={item.href}
              style={spacing}
              draggable={false}
              aria-hidden={hidden || undefined}
              tabIndex={hidden ? -1 : undefined}
            >
              {img}
            </Link>
          ) : (
            <span key={i} style={spacing} aria-hidden={hidden || undefined}>
              {img}
            </span>
          );
        })}
      </div>
    </div>
  );
}
