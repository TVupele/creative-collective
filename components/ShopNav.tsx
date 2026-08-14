"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

/** Sticky shop header. The cart count only renders after mount — the cart
 *  lives in localStorage, so rendering it on the server would mismatch. */
export default function ShopNav() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-parchment/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-bone ring-1 ring-ink/10 transition group-hover:ring-amber/60">
            <Image
              src="/patterns/creative-collective-logo.png"
              alt="Creative Collective"
              fill
              className="object-contain p-1"
              sizes="40px"
            />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-sm font-bold text-ink">
              Creative Collective
            </span>
            <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-ink/45">
              Road to FESTAC@50
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink/60 transition hover:bg-ink/[0.05] hover:text-ink sm:inline-flex"
          >
            Shop
          </Link>
          <Link
            href="/join"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink/60 transition hover:bg-ink/[0.05] hover:text-ink sm:inline-flex"
          >
            Join
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart${mounted && totalItems ? `, ${totalItems} items` : ""}`}
            className="pill relative border border-ink/10 bg-bone px-4 py-2 text-ink shadow-soft hover:border-amber/50 hover:bg-sand/50"
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1.5 text-[0.65rem] font-bold text-ink shadow-glow">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
