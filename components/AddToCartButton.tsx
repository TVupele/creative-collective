"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  product,
}: {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="pill w-full cursor-not-allowed border border-ink/10 bg-ink/[0.04] px-8 py-3.5 text-ink/40"
        >
          Sold out
        </button>
        <p className="text-center text-xs text-ink/45">
          This piece is one of a kind and has found its home.
        </p>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] ?? null,
        maxStock: product.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const step = (delta: number) =>
    setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-ink/10 bg-bone p-1 shadow-soft">
          <StepButton label="Decrease quantity" onClick={() => step(-1)} disabled={quantity <= 1}>
            &minus;
          </StepButton>
          <span
            className="w-8 text-center text-sm font-bold tabular-nums text-ink"
            aria-live="polite"
          >
            {quantity}
          </span>
          <StepButton
            label="Increase quantity"
            onClick={() => step(1)}
            disabled={quantity >= product.stock}
          >
            +
          </StepButton>
        </div>

        <button
          onClick={handleAdd}
          className={`pill flex-1 px-8 py-3.5 shadow-glow active:scale-[0.98] ${
            added ? "bg-sage text-parchment" : "bg-amber text-ink hover:bg-gold"
          }`}
        >
          {added ? (
            <>
              <CheckIcon /> Added to cart
            </>
          ) : (
            "Add to cart"
          )}
        </button>
      </div>

      <Link href="/cart" className="pill-ghost w-full py-3.5 text-sm">
        Go to cart &amp; check out
      </Link>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-ink/70 transition hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
