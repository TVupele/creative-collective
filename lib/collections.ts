/**
 * The curated shop collections shown as cards on the shop homepage.
 *
 * `slug` is what gets stored on Product.collection, so changing one means
 * migrating existing rows. Artwork lives in public/patterns/collections:
 * `<slug>.png` is the full card artwork (photo + pattern bands) and
 * `<slug>-title.png` is the "ARTISTIC CREATIONS INSPIRED BY..." lockup.
 */
export interface ShopCollection {
  slug: string;
  /** Short label used in menus, chips and the admin dropdown. */
  name: string;
  /** The full line as set in the artwork, used for page headings. */
  title: string;
  image: string;
  titleImage: string;
  /** width/height of the artwork once the black tail below the last colour
   *  band is cropped off, so every card shares one footer geometry. */
  contentAspect: number;
  blurb: string;
}

export const COLLECTIONS: ShopCollection[] = [
  {
    slug: "kanuri",
    name: "Kanuri Arts",
    title: "The Kanuri Culture of Northern Nigeria",
    image: "/patterns/collections/kanuri.png",
    titleImage: "/patterns/collections/kanuri-title.png",
    contentAspect: 1447 / 1319,
    blurb:
      "Work drawn from the courts, cloth and horn music of Borno — the Kanuri north rendered by members of the collective.",
  },
  {
    slug: "ga",
    name: "Ga Arts",
    title: "The Ga Culture of Ghana",
    image: "/patterns/collections/ga.png",
    titleImage: "/patterns/collections/ga-title.png",
    contentAspect: 1446 / 1319,
    blurb:
      "Accra's Ga traditions — the red of Homowo, the chiefs, the coastline — reimagined as work you can own.",
  },
  {
    slug: "benin",
    name: "Benin Bronze Arts",
    title: "The Benin Culture of Southern Nigeria",
    image: "/patterns/collections/benin.png",
    titleImage: "/patterns/collections/benin-title.png",
    contentAspect: 1446 / 1371,
    blurb:
      "The bronzes, the Oba's court, the plaques of the Kingdom of Benin — reinterpreted by contemporary hands.",
  },
  {
    slug: "masai",
    name: "Masai Arts",
    title: "The Masai Culture of Kenya",
    image: "/patterns/collections/masai.png",
    titleImage: "/patterns/collections/masai-title.png",
    contentAspect: 1446 / 1373,
    blurb:
      "Beadwork, shuka cloth and the colour language of the Masai, carried into new work from across East Africa.",
  },
  {
    slug: "zulu",
    name: "Zulu Arts",
    title: "The Zulu Culture of Southafrica",
    image: "/patterns/collections/zulu.png",
    titleImage: "/patterns/collections/zulu-title.png",
    contentAspect: 1446 / 1372,
    blurb:
      "Shields, isicholo and the regalia of the Zulu kingdom, made new by artists from the south of the continent.",
  },
  {
    slug: "military",
    name: "Military Products",
    title: "The Armed Forces of Nigeria",
    image: "/patterns/collections/military.png",
    titleImage: "/patterns/collections/military-title.png",
    contentAspect: 1446 / 1035,
    blurb:
      "Apparel and merchandise honouring the Nigerian Army, Navy and Air Force, made with and for the service community.",
  },
];

export const COLLECTION_SLUGS = COLLECTIONS.map((c) => c.slug);

export function getCollection(slug: string | null | undefined): ShopCollection | undefined {
  if (!slug) return undefined;
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function collectionName(slug: string | null | undefined): string | null {
  return getCollection(slug)?.name ?? null;
}
