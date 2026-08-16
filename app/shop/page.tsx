import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS } from "@/lib/collections";
import CollectionCard from "@/components/CollectionCard";
import ProductResults, { parseSort, sortProducts } from "@/components/ProductResults";
import ShopFilters from "@/components/ShopFilters";
import ShopHeader from "@/components/ShopHeader";
import ShopNav from "@/components/ShopNav";
import ShopEmptyState from "@/components/ShopEmptyState";
import ShopSkeleton from "@/components/ShopSkeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop — Creative Collective",
  description:
    "Original work from creatives across Africa and the Diaspora, released drop by drop on the Road to FESTAC@50.",
};

async function CollectionGrid() {
  const counts = await prisma.product.groupBy({
    by: ["collection"],
    where: { status: "ACTIVE", collection: { not: null } },
    _count: { _all: true },
  });

  const countBySlug = new Map(
    counts.map((row) => [row.collection as string, row._count._all])
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {COLLECTIONS.map((collection, index) => (
        <div
          key={collection.slug}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
        >
          <CollectionCard
            collection={collection}
            count={countBySlug.get(collection.slug) ?? 0}
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}

function CollectionGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {COLLECTIONS.map((c) => (
        <div
          key={c.slug}
          className="aspect-[1446/1639] animate-pulse rounded-4xl bg-ink/10"
        />
      ))}
    </div>
  );
}

async function GeneralProducts({
  q,
  category,
  view,
  sort,
  scope,
}: {
  q?: string;
  category?: string;
  view: "timeline" | "grid";
  sort: ReturnType<typeof parseSort>;
  scope: "general" | "all";
}) {
  const [rows, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        // "General" hides pieces that already have their own collection card;
        // "all" is the show-everything view.
        ...(scope === "general" ? { collection: null } : {}),
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
      where: {
        status: "ACTIVE",
        ...(scope === "general" ? { collection: null } : {}),
      },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = categoryRows.map((c) => c.category).sort();
  const products = sortProducts(rows, sort);

  return (
    <>
      <ShopFilters categories={categories} />

      {products.length === 0 ? (
        <ShopEmptyState filtered={Boolean(q || category)} query={q} category={category} />
      ) : (
        <ProductResults
          products={products}
          view={view}
          query={q}
          category={category}
          clearHref={scope === "all" ? "/shop?scope=all#general" : "/shop#general"}
        />
      )}
    </>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    view?: string;
    sort?: string;
    scope?: string;
  }>;
}) {
  const params = await searchParams;
  const view = params.view === "grid" ? "grid" : "timeline";
  const sort = parseSort(params.sort);
  const scope = params.scope === "all" ? "all" : "general";
  const creatorShare = 100 - Number(process.env.COMMISSION_PERCENT ?? 30);

  const scopeHref = (next: "general" | "all") => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.category) qs.set("category", params.category);
    if (params.view) qs.set("view", params.view);
    if (params.sort) qs.set("sort", params.sort);
    if (next === "all") qs.set("scope", "all");
    const s = qs.toString();
    return `/shop${s ? `?${s}` : ""}#general`;
  };

  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />
      <ShopHeader creatorSharePercent={creatorShare} />

      <main className="mx-auto max-w-6xl px-5 pb-28">
        <section className="pt-14 sm:pt-20">
          <div className="text-center">
            <span className="pill border border-ink/10 bg-bone px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink/60">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden />
              Collections
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Artistic creations inspired by Africa.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Six curated collections drawn from the cultures of the continent. Open one to
              see every piece made for it.
            </p>
          </div>

          <div className="mt-10">
            <Suspense fallback={<CollectionGridSkeleton />}>
              <CollectionGrid />
            </Suspense>
          </div>
        </section>

        <section id="general" className="scroll-mt-24 pt-20 sm:pt-24">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {scope === "all" ? "All products" : "General products"}
              </h2>
              <p className="mt-2 max-w-xl text-ink/60">
                {scope === "all"
                  ? "Everything the collective has listed, including every piece inside the six collections."
                  : "Work listed outside the six collections, newest drops first."}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-ink/10 bg-bone p-1 shadow-soft">
              <Link
                href={scopeHref("general")}
                aria-current={scope === "general" ? "true" : undefined}
                className={`pill px-4 py-2 text-xs ${
                  scope === "general"
                    ? "bg-ink text-parchment shadow-soft"
                    : "text-ink/55 hover:text-ink"
                }`}
              >
                General only
              </Link>
              <Link
                href={scopeHref("all")}
                aria-current={scope === "all" ? "true" : undefined}
                className={`pill px-4 py-2 text-xs ${
                  scope === "all"
                    ? "bg-ink text-parchment shadow-soft"
                    : "text-ink/55 hover:text-ink"
                }`}
              >
                Show all products
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Suspense
              key={`${params.q ?? ""}|${params.category ?? ""}|${view}|${sort}|${scope}`}
              fallback={<ShopSkeleton />}
            >
              <GeneralProducts
                q={params.q}
                category={params.category}
                view={view}
                sort={sort}
                scope={scope}
              />
            </Suspense>
          </div>
        </section>
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
