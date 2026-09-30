import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./home.module.css";

type Item = { src: string; alt: string; href?: string };

/**
 * Continuous auto-scrolling strip — the Wix Pro Gallery "continuous
 * slideshow" (speed 40, looping). Items keep the gallery's height and their
 * own aspect ratio; the list is repeated so one pass is wider than the widest
 * viewport, then doubled so the ±50% keyframe loops seamlessly.
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
  // Wix speed 40 ≈ 40px/s at the desktop item height.
  const passWidth = pass.length * (ratio * height + gap);
  // RTL galleries split the margin around each item; LTR ones trail it.
  const spacing: CSSProperties = rtl
    ? { marginLeft: gap / 2, marginRight: gap / 2 }
    : { marginRight: gap };

  return (
    <div
      className={`${styles.marquee} ${rtl ? styles.marqueeRtl : ""} ${className}`}
      style={{ "--ratio": ratio } as CSSProperties}
    >
      <div
        className={styles.track}
        style={{ "--duration": `${Math.round(passWidth / 40)}s` } as CSSProperties}
      >
        {track.map((item, i) => {
          const hidden = i >= items.length;
          const img = (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt={hidden ? "" : item.alt} loading="lazy" decoding="async" />
          );
          return item.href ? (
            <Link
              key={i}
              href={item.href}
              style={spacing}
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
