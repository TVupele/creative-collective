import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS, getCollection } from "@/lib/collections";
import ProductResults, { parseSort, sortProducts } from "@/components/ProductResults";
import ShopFilters from "@/components/ShopFilters";
import ShopNav from "@/components/ShopNav";
import ShopEmptyState from "@/components/ShopEmptyState";
import ShopSkeleton from "@/components/ShopSkeleton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found — Creative Collective" };

  return {
    title: `${collection.name} — Creative Collective`,
    description: collection.blurb,
    openGraph: {
      title: collection.title,
      description: collection.blurb,
      images: [collection.image],
    },
  };
}

async function CollectionProducts({
  slug,
  q,
  category,
  view,
  sort,
}: {
  slug: string;
  q?: string;
  category?: string;
  view: "timeline" | "grid";
  sort: ReturnType<typeof parseSort>;
}) {
  const collection = getCollection(slug)!;

  const [rows, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        collection: slug,
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
      where: { status: "ACTIVE", collection: slug },
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
        <ShopEmptyState
          filtered={Boolean(q || category)}
          query={q}
          category={category}
          collectionName={collection.name}
          clearHref={`/shop/collection/${slug}`}
        />
      ) : (
        <ProductResults
          products={products}
          view={view}
          query={q}
          category={category}
          clearHref={`/shop/collection/${slug}`}
        />
      )}
    </>
  );
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; category?: string; view?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const sp = await searchParams;
  const view = sp.view === "grid" ? "grid" : "timeline";
  const sort = parseSort(sp.sort);

  const others = COLLECTIONS.filter((c) => c.slug !== slug);

  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />

      {/* Collection banner — the artwork, with the title lockup over it */}
      <header className="relative overflow-hidden bg-black">
        <div className="relative mx-auto max-w-6xl">
          <div className="relative aspect-[1446/1639] w-full sm:aspect-[16/8]">
            <Image
              src={collection.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent"
              aria-hidden
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:pb-10">
            <Image
              src={collection.titleImage}
              alt={`Artistic creations inspired by ${collection.title}`}
              width={964}
              height={63}
              priority
              className="h-auto w-full max-w-md"
            />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {collection.blurb}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-28 pt-8">
        <nav className="flex items-center gap-2 text-xs text-ink/45" aria-label="Breadcrumb">
          <Link href="/shop" className="transition hover:text-ink">
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink/70">{collection.name}</span>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {collection.name}
        </h1>
        <p className="mt-2 max-w-2xl text-ink/60">{collection.title}</p>

        <div className="mt-8">
          <Suspense
            key={`${slug}|${sp.q ?? ""}|${sp.category ?? ""}|${view}|${sort}`}
            fallback={<ShopSkeleton />}
          >
            <CollectionProducts
              slug={slug}
              q={sp.q}
              category={sp.category}
              view={view}
              sort={sort}
            />
          </Suspense>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Other collections
          </h2>
          <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-1">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/shop/collection/${c.slug}`}
                className="pill flex-shrink-0 border border-ink/10 bg-bone px-5 py-2.5 text-xs text-ink/70 shadow-soft transition hover:border-amber/50 hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/shop/products?scope=all#general"
              className="pill flex-shrink-0 bg-ink px-5 py-2.5 text-xs text-parchment shadow-soft"
            >
              All products
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
