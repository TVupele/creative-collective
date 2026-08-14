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

export default function ProductCard({
  product,
  priority = false,
}: {
  product: ShopProduct;
  priority?: boolean;
}) {
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 3;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col rounded-4xl border border-ink/[0.07] bg-bone p-2 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-amber/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-sand">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-ink/25">
            <ImageIcon />
            <span className="text-xs">No photo yet</span>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/45 to-transparent opacity-90"
          aria-hidden
        />

        <span className="absolute left-3 top-3 rounded-full bg-parchment/90 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink/70 shadow-soft backdrop-blur">
          {product.category}
        </span>

        <span className="absolute bottom-3 left-3 rounded-full bg-parchment px-3.5 py-1.5 text-sm font-bold text-ink shadow-soft">
          {formatNaira(product.price)}
        </span>

        {lowStock && (
          <span className="absolute bottom-3 right-3 rounded-full bg-clay px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-parchment shadow-soft">
            {product.stock} left
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/55 backdrop-blur-[2px]">
            <span className="rounded-full bg-parchment px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink">
          {product.title}
        </h3>
        <p className="mt-1.5 truncate text-sm text-ink/55">by {product.memberName}</p>

        <div className="mt-4 flex items-center justify-between pt-1">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/40 transition group-hover:text-ink/70">
            View piece
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/50 transition group-hover:border-amber group-hover:bg-amber group-hover:text-ink">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m21 15-4.5-4.5L7 20" />
    </svg>
  );
}
