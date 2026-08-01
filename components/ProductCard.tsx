import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/money";

export interface ShopProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  memberName: string;
  stock: number;
}

export default function ProductCard({ product }: { product: ShopProduct }) {
  const soldOut = product.stock <= 0;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-ink/10 bg-white transition hover:border-amber/50 hover:shadow-lg"
    >
      <div className="relative aspect-square bg-parchment">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            No photo
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-parchment">
              Sold out
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
        <p className="mt-0.5 truncate font-semibold text-ink">{product.title}</p>
        <p className="mt-1 text-sm text-ink/70">
          {formatNaira(product.price)} &middot; by {product.memberName}
        </p>
      </div>
    </Link>
  );
}
