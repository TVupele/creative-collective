import Link from "next/link";
import Image from "next/image";
import type { ShopCollection } from "@/lib/collections";

/**
 * One collection panel.
 *
 * Two things keep the six panels identical:
 *
 * 1. The title is live text, not the title PNG. The PNGs have different
 *    intrinsic widths (607px for Ga vs 964px for Kanuri), so rendering them
 *    at a common width scaled each culture's name differently.
 * 2. The artwork is cropped to `contentAspect` — the height at which its last
 *    colour band ends. The source files carry between 267px and 604px of
 *    black below that band, which is what made the button sit at a different
 *    distance on every panel. Cropping it away lets one shared footer set the
 *    spacing for all six.
 */
export default function CollectionCard({
  collection,
  priority = false,
}: {
  collection: ShopCollection;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/shop/collection/${collection.slug}`}
      aria-label={`Explore the collection inspired by ${collection.title}`}
      className="collection-card group block bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/60"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: collection.contentAspect }}
      >
        <Image
          src={collection.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 45rem"
          className="object-cover object-top"
        />

        <div className="collection-titleblock absolute inset-x-0 top-0">
          <span className="collection-kicker inline-block border-b border-cream/70 font-display font-bold uppercase text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Artistic creations inspired by:
          </span>
          <h3 className="collection-title font-display font-bold uppercase text-cream drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)]">
            {collection.title}
          </h3>
        </div>
      </div>

      {/* Shared footer — identical on every panel */}
      <div className="collection-footer flex justify-center bg-black">
        <span className="collection-cta inline-flex items-center justify-center rounded-full bg-sun font-mono lowercase tracking-wide text-ink transition group-hover:bg-amber">
          explore collection
        </span>
      </div>
    </Link>
  );
}
