import Link from "next/link";
import Image from "next/image";
import type { ShopCollection } from "@/lib/collections";

/**
 * One "explore collection" card. The artwork PNG already carries the photo and
 * the pattern bands; the title lockup is overlaid at the top and the pill sits
 * in the black band the artwork leaves at the bottom.
 */
export default function CollectionCard({
  collection,
  count,
  priority = false,
}: {
  collection: ShopCollection;
  count?: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/shop/collection/${collection.slug}`}
      aria-label={`Explore the collection inspired by ${collection.title}`}
      className="group relative flex flex-col overflow-hidden rounded-4xl bg-black shadow-soft ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-sun/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/60"
    >
      <div className="relative">
        <Image
          src={collection.image}
          alt=""
          width={1446}
          height={1639}
          priority={priority}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
        />

        {/* Title lockup, set over the top of the artwork */}
        <div className="absolute left-[4%] right-[4%] top-[2.5%]">
          <Image
            src={collection.titleImage}
            alt={`Artistic creations inspired by ${collection.title}`}
            width={964}
            height={63}
            className="h-auto w-[86%] max-w-[22rem]"
          />
        </div>
      </div>

      {/* Pill sits in the black band at the foot of the artwork */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-[6%]">
        {typeof count === "number" && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
            {count} {count === 1 ? "piece" : "pieces"}
          </span>
        )}
        <span className="pill bg-sun px-7 py-2.5 font-mono text-xs lowercase tracking-wide text-ink shadow-glow transition group-hover:bg-amber">
          explore collection
        </span>
      </div>
    </Link>
  );
}
