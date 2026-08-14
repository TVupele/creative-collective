"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";
import ShopNav from "@/components/ShopNav";

export default function CartPage() {
  const { items, hydrated, removeItem, setQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45 transition hover:text-ink"
        >
          &larr; Continue shopping
        </Link>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Your cart
        </h1>
        {items.length > 0 && (
          <p className="mt-2 text-sm text-ink/55">
            {totalItems} {totalItems === 1 ? "item" : "items"} ready for checkout.
          </p>
        )}

        {!hydrated ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="card-soft flex gap-4 p-4">
                <div className="h-24 w-24 flex-shrink-0 animate-pulse rounded-2xl bg-sand sm:h-28 sm:w-28" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-sand" />
                  <div className="h-3 w-1/3 animate-pulse rounded-full bg-sand" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card-soft mt-8 px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-ink/40">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h2 className="mt-5 font-display text-xl font-bold text-ink">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">
              Browse the timeline to find work from members across Africa and the Diaspora.
            </p>
            <Link href="/shop" className="pill-accent mt-7">
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="card-soft flex gap-4 p-3 transition hover:border-ink/15 sm:p-4"
                >
                  <Link
                    href={`/shop/${item.productId}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-sand sm:h-28 sm:w-28"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/shop/${item.productId}`}
                        className="line-clamp-2 font-display font-semibold leading-snug text-ink transition hover:text-clay"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink/35 transition hover:bg-clay/10 hover:text-clay"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          <path d="M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7" />
                        </svg>
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-ink/55">{formatNaira(item.price)} each</p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-parchment/60 p-1">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-ink/70 transition hover:bg-ink/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          &minus;
                        </button>
                        <span className="w-7 text-center text-sm font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-ink/70 transition hover:bg-ink/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-display font-bold text-ink">
                        {formatNaira(item.price * item.quantity)}
                      </p>
                    </div>

                    {item.quantity >= item.maxStock && (
                      <p className="mt-2 text-xs text-clay">
                        That&apos;s all {item.maxStock} available.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <aside className="card-soft p-5 lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold text-ink">Order summary</h2>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-ink/60">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-ink">{formatNaira(totalPrice)}</dd>
                </div>
                <div className="flex justify-between text-ink/60">
                  <dt>Delivery</dt>
                  <dd className="text-xs text-ink/45">Arranged after checkout</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-ink/[0.08] pt-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display text-2xl font-bold text-ink">
                  {formatNaira(totalPrice)}
                </span>
              </div>

              <Link href="/checkout" className="pill-accent mt-5 w-full py-3.5">
                Proceed to checkout
              </Link>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.7rem] text-ink/45">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden
                >
                  <rect x="4" y="10" width="16" height="11" rx="3" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Secured by Paystack
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
