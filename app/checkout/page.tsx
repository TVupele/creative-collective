"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

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

  if (items.length === 0) {
    return (
      <main className="min-h-dvh bg-parchment px-6 py-12 text-center">
        <p className="text-ink/60">
          Your cart is empty.{" "}
          <Link href="/shop" className="text-clay underline">
            Browse the shop
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-parchment px-6 py-12">
      <div className="mx-auto max-w-lg">
        <Link href="/cart" className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
          &larr; Cart
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Checkout</h1>

        <div className="mt-6 rounded-lg border border-ink/10 bg-white p-4">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-1 text-sm text-ink/80">
              <span>
                {item.title} &times; {item.quantity}
              </span>
              <span>{formatNaira(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
            <span>Total</span>
            <span>{formatNaira(totalPrice)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full name">
            <input
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              required
              type="tel"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Shipping address">
            <textarea
              required
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className={inputCls}
            />
          </Field>

          {error && (
            <p className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-amber px-8 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Redirecting to Paystack..." : `Pay ${formatNaira(totalPrice)}`}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/30";
