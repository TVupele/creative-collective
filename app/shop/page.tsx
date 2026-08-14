import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ProductTimeline, { type TimelineProduct } from "@/components/ProductTimeline";
import ShopFilters from "@/components/ShopFilters";
import ShopNav from "@/components/ShopNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop — Creative Collective",
  description:
    "Original work from creatives across Africa and the Diaspora, released drop by drop on the Road to FESTAC@50.",
};

type SortKey = "newest" | "price-asc" | "price-desc" | "title";

function sortProducts(products: TimelineProduct[], sort: SortKey): TimelineProduct[] {
  if (sort === "newest") return products; // already ordered by the query
  const sorted = [...products];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  return sorted;
}

async function ShopResults({
  q,
  category,
  view,
  sort,
}: {
  q?: string;
  category?: string;
  view: "timeline" | "grid";
  sort: SortKey;
}) {
  const [rows, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { memberName: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { category: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = categoryRows.map((c) => c.category).sort();
  const products = sortProducts(rows, sort);
  const makers = new Set(products.map((p) => p.memberName)).size;
  const filtered = Boolean(q || category);

  return (
    <>
      <ShopFilters categories={categories} />

      {products.length === 0 ? (
        <EmptyState filtered={filtered} query={q} category={category} />
      ) : (
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
              {q && (
                <>
                  {" "}
                  matching <span className="font-semibold text-ink">&ldquo;{q}&rdquo;</span>
                </>
              )}
            </p>
            {filtered && (
              <Link
                href="/shop"
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
      )}
    </>
  );
}

function EmptyState({
  filtered,
  query,
  category,
}: {
  filtered: boolean;
  query?: string;
  category?: string;
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
        {filtered ? "Nothing matches that yet" : "The first drop is on its way"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
        {filtered ? (
          <>
            We couldn&apos;t find anything
            {query && <> for &ldquo;{query}&rdquo;</>}
            {category && <> in {category}</>}. Try a different search, or browse everything
            the collective has listed so far.
          </>
        ) : (
          <>
            Members are preparing their pieces for the Road to FESTAC@50. Check back shortly —
            new work is added to the timeline every week.
          </>
        )}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {filtered && (
          <Link href="/shop" className="pill-accent">
            Browse everything
          </Link>
        )}
        <Link href="/join" className="pill-ghost">
          Join the collective
        </Link>
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="h-[7.5rem] rounded-4xl border border-ink/[0.07] bg-bone/70 shadow-soft" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-4xl border border-ink/[0.07] bg-bone p-2 shadow-soft"
          >
            <div className="aspect-[4/5] animate-pulse rounded-[1.35rem] bg-sand" />
            <div className="space-y-2 px-3 pb-3 pt-4">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-sand" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-sand" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; view?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "grid" ? "grid" : "timeline";
  const sort = (["price-asc", "price-desc", "title"] as const).includes(
    params.sort as "price-asc"
  )
    ? (params.sort as SortKey)
    : "newest";

  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />

      <header className="relative overflow-hidden border-b border-ink/[0.06] bg-gradient-to-b from-sand via-parchment to-parchment">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-clay/10 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <span className="pill border border-ink/10 bg-bone/70 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink/60 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden />
            The Collective Shop
          </span>

          <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Original work,
            <br />
            straight from the makers.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
            Every piece here is listed by a member of Creative Collective — artists, designers
            and craftspeople across Africa and the Diaspora, released drop by drop on the Road
            to FESTAC@50.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <TrustPill icon={<LockIcon />} label="Secure Paystack checkout" />
            <TrustPill icon={<TruckIcon />} label="Delivered nationwide" />
            <TrustPill
              icon={<HeartIcon />}
              label={`${100 - Number(process.env.COMMISSION_PERCENT ?? 20)}% goes to the maker`}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-28 pt-8">
        <Suspense
          key={`${params.q ?? ""}|${params.category ?? ""}|${view}|${sort}`}
          fallback={<ShopSkeleton />}
        >
          <ShopResults q={params.q} category={params.category} view={view} sort={sort} />
        </Suspense>
      </main>

      <footer className="border-t border-ink/[0.06] bg-bone/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-ink/50">
            Creative Collective — the official creative industries platform for the Road to
            FESTAC and FESTAC@50.
          </p>
          <div className="flex gap-3">
            <Link href="/" className="pill-ghost px-5 py-2.5 text-xs">
              Back home
            </Link>
            <Link href="/join" className="pill-accent px-5 py-2.5 text-xs">
              Join the collective
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrustPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="pill border border-ink/[0.07] bg-bone/80 px-4 py-2 text-xs font-semibold text-ink/65 shadow-soft backdrop-blur">
      <span className="text-amber">{icon}</span>
      {label}
    </span>
  );
}

function LockIcon() {
  return (
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
  );
}

function TruckIcon() {
  return (
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
      <path d="M2 7h11v9H2zM13 10h4.5L21 13.5V16h-8" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

function HeartIcon() {
  return (
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
      <path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3Z" />
    </svg>
  );
}
