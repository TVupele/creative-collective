import type { CSSProperties } from "react";
import styles from "./home.module.css";

type Item = { src: string; alt: string };

/**
 * Continuous auto-scrolling strip — the Wix Pro Gallery "continuous
 * slideshow" (speed 40, looping). Items keep the gallery's height and their
 * own aspect ratio; the list is repeated so one pass is wider than the widest
 * viewport, then doubled so the -50% keyframe loops seamlessly.
 */
export default function Marquee({
  items,
  ratio,
  gap,
  copies,
  height,
  className,
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
}) {
  const pass = Array.from({ length: copies }, () => items).flat();
  const track = [...pass, ...pass];
  // Wix speed 40 ≈ 40px/s at the desktop item height.
  const passWidth = pass.length * (ratio * height + gap);

  return (
    <div
      className={`${styles.marquee} ${className}`}
      style={{ "--ratio": ratio } as CSSProperties}
    >
      <div
        className={styles.track}
        style={{ "--duration": `${Math.round(passWidth / 40)}s` } as CSSProperties}
      >
        {track.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={item.src}
            alt={i < items.length ? item.alt : ""}
            aria-hidden={i >= items.length || undefined}
            style={{ marginRight: gap }}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}
