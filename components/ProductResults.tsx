import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductTimeline, { type TimelineProduct } from "@/components/ProductTimeline";

export type SortKey = "newest" | "price-asc" | "price-desc" | "title";

export function sortProducts(products: TimelineProduct[], sort: SortKey): TimelineProduct[] {
  if (sort === "newest") return products; // already ordered by the query
  const sorted = [...products];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  return sorted;
}

export function parseSort(value?: string): SortKey {
  return value === "price-asc" || value === "price-desc" || value === "title"
    ? value
    : "newest";
}

export default function ProductResults({
  products,
  view,
  query,
  category,
  clearHref,
}: {
  products: TimelineProduct[];
  view: "timeline" | "grid";
  query?: string;
  category?: string;
  clearHref: string;
}) {
  const makers = new Set(products.map((p) => p.memberName)).size;
  const filtered = Boolean(query || category);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/55">
          <span className="font-semibold text-ink">{products.length}</span>{" "}
          {products.length === 1 ? "piece" : "pieces"} from{" "}
          <span className="font-semibold text-ink">{makers}</span>{" "}
          {makers === 1 ? "member" : "members"}
          {category && (
            <>
              {" "}
              in <span className="font-semibold text-ink">{category}</span>
            </>
          )}
          {query && (
            <>
              {" "}
              matching <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </p>
        {filtered && (
          <Link
            href={clearHref}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-clay hover:underline"
          >
            Clear filters
          </Link>
        )}
      </div>

      {view === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
            >
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </div>
      ) : (
        <ProductTimeline products={products} />
      )}
    </>
  );
}
