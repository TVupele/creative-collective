"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalPrice } = useCart();

  return (
    <main className="min-h-dvh bg-parchment px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/shop" className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
          &larr; Continue shopping
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Your cart</h1>

        {items.length === 0 ? (
          <p className="mt-8 text-ink/60">
            Your cart is empty.{" "}
            <Link href="/shop" className="text-clay underline">
              Browse the shop
            </Link>
            .
          </p>
        ) : (
          <>
            <ul className="mt-8 space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-4 rounded-lg border border-ink/10 bg-white p-4"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-parchment">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{item.title}</p>
                    <p className="text-sm text-ink/60">{formatNaira(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-ink/50">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                        className="w-16 rounded-md border border-ink/15 px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex-shrink-0 text-sm text-clay hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
              <p className="font-semibold text-ink">Total</p>
              <p className="text-lg font-bold text-ink">{formatNaira(totalPrice)}</p>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-md bg-amber px-8 py-3 text-center font-semibold text-ink shadow-lg transition hover:bg-gold"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
