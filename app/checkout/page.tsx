"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";
import ShopNav from "@/components/ShopNav";

export default function CheckoutPage() {
  const { items, hydrated, totalPrice, totalItems } = useCart();

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerEmail,
          buyerPhone,
          shippingAddress,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (hydrated && items.length === 0) {
    return (
      <div className="min-h-dvh bg-parchment font-body text-ink">
        <ShopNav />
        <main className="mx-auto max-w-md px-5 py-24 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-2 text-sm text-ink/55">
            Add a piece to your cart before checking out.
          </p>
          <Link href="/shop" className="pill-accent mt-7">
            Browse the shop
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45 transition hover:text-ink"
        >
          &larr; Back to cart
        </Link>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-ink/55">
          Enter your delivery details — payment is completed securely on Paystack.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_21rem] lg:items-start">
          <form onSubmit={handleSubmit} className="card-soft p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-ink">Delivery details</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" className="sm:col-span-2">
                <input
                  required
                  autoComplete="name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ada Okonkwo"
                  className="field-soft"
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field-soft"
                />
              </Field>
              <Field label="Phone">
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="0801 234 5678"
                  className="field-soft"
                />
              </Field>
              <Field label="Delivery address" className="sm:col-span-2">
                <textarea
                  required
                  rows={3}
                  autoComplete="street-address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street, city, state — plus a landmark if it helps the courier."
                  className="field-soft resize-none"
                />
              </Field>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink/45">
              Your receipt goes to this email address, and the member behind each piece is
              notified to prepare your order once payment is confirmed.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !hydrated}
              className="pill-accent mt-6 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {submitting
                ? "Redirecting to Paystack..."
                : `Pay ${formatNaira(totalPrice)}`}
            </button>

            <p className="mt-3 text-center text-[0.7rem] text-ink/45">
              You&apos;ll be redirected to Paystack to pay by card, bank transfer or USSD.
            </p>
          </form>

          <aside className="card-soft p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Your order</h2>
              <span className="pill-tag">{totalItems}</span>
            </div>

            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-sand">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-ink/50">Qty {item.quantity}</p>
                  </div>
                  <p className="flex-shrink-0 text-sm font-semibold text-ink">
                    {formatNaira(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between border-t border-ink/[0.08] pt-4">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display text-2xl font-bold text-ink">
                {formatNaira(totalPrice)}
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-sand/60 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-ink/70">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-sage"
                  aria-hidden
                >
                  <rect x="4" y="10" width="16" height="11" rx="3" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Payments secured by Paystack
              </p>
              <p className="mt-1.5 text-[0.7rem] leading-relaxed text-ink/50">
                Card details are entered on Paystack&apos;s own page — Creative Collective
                never sees or stores them.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/50">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
