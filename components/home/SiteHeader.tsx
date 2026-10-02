"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import styles from "./home.module.css";

export const NAV = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "LEARN", href: "/learn" },
  { label: "EARN", href: "/#earn" },
  { label: "HELP", href: "/#help" },
];

/**
 * Pinned header: a black strip over a frosted rounded menu bar. Like the Wix
 * original, the whole header slides up 40px once the page scrolls, leaving
 * just the bar. Below 750px the menu collapses into a full-screen overlay.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalItems: count } = useCart();
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerStrip} />
        <div className={styles.navBar}>
          <Link href="/" className={styles.brand}>
            CREATIVE.COLLECTIVE.AFRICA
          </Link>

          <ul className={styles.menu}>
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={isCurrent(item.href) ? styles.menuCurrent : undefined}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/join" className={styles.login}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="12" fill="currentColor" />
              <circle cx="12" cy="9.5" r="4" fill="#fff" />
              <path d="M4.8 19.6a8.5 8.5 0 0 1 14.4 0A10.9 10.9 0 0 1 12 23a10.9 10.9 0 0 1-7.2-3.4Z" fill="#fff" />
            </svg>
            Log In
          </Link>

          <Link href="/cart" className={styles.cart} aria-label={`Cart with ${count} items`}>
            <svg viewBox="0 0 18 21.4375" fill="none" aria-hidden>
              <path d="M5.5 6.5V4.8a3.5 3.5 0 0 1 7 0v1.7" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="6.5" width="17" height="14.4" stroke="currentColor" strokeWidth="1" />
              <text
                x="9"
                y="16.6"
                textAnchor="middle"
                fontSize="8"
                fontFamily="var(--font-azeret), monospace"
                fill="currentColor"
              >
                {count}
              </text>
            </svg>
          </Link>

          <button
            type="button"
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 30 30" aria-hidden>
              <path d="M5 10h20M5 15h20M5 20h20" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <nav className={styles.overlay} aria-label="Site navigation">
          <button
            type="button"
            className={styles.overlayClose}
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 30 30" aria-hidden>
              <path d="M7 7l16 16M23 7 7 23" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/join" onClick={() => setOpen(false)}>
            Log In
          </Link>
        </nav>
      )}
    </>
  );
}
