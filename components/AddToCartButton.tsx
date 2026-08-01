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
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-md border border-ink/15 px-8 py-3 font-semibold text-ink/40"
      >
        Sold out
      </button>
    );
  }

  const handleAdd = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? null,
      maxStock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        className="flex-1 rounded-md bg-amber px-8 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <Link
        href="/cart"
        className="rounded-md border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
      >
        View cart
      </Link>
    </div>
  );
}
