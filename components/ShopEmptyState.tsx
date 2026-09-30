import Link from "next/link";

export default function ShopEmptyState({
  filtered,
  query,
  category,
  collectionName,
  clearHref = "/shop/products",
}: {
  filtered: boolean;
  query?: string;
  category?: string;
  collectionName?: string;
  clearHref?: string;
}) {
  return (
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
        {filtered
          ? "Nothing matches that yet"
          : collectionName
            ? `${collectionName} is being prepared`
            : "The first drop is on its way"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
        {filtered ? (
          <>
            We couldn&apos;t find anything
            {query && <> for &ldquo;{query}&rdquo;</>}
            {category && <> in {category}</>}. Try a different search, or browse everything
            the collective has listed so far.
          </>
        ) : collectionName ? (
          <>
            Members are still finishing work for this collection. Check back shortly — or
            browse everything else the collective has listed.
          </>
        ) : (
          <>
            Members are preparing their pieces for the Road to FESTAC@50. Check back shortly —
            new work is added to the timeline every week.
          </>
        )}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {filtered ? (
          <Link href={clearHref} className="pill-accent">
            Browse everything
          </Link>
        ) : (
          <Link href="/shop/products?scope=all#general" className="pill-accent">
            See all products
          </Link>
        )}
        <Link href="/join" className="pill-ghost">
          Join the collective
        </Link>
      </div>
    </div>
  );
}
