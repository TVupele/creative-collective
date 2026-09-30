import type { Metadata } from "next";
import Link from "next/link";
import { Azeret_Mono, Wix_Madefor_Text } from "next/font/google";
import FocalBackgrounds from "@/components/home/FocalBackgrounds";
import Marquee from "@/components/home/Marquee";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import home from "@/components/home/home.module.css";
import styles from "@/components/shop/shop.module.css";

/* Same type as the homepage: Azeret Mono throughout, Madefor on buttons. */
const azeret = Azeret_Mono({ subsets: ["latin"], weight: "400", variable: "--font-azeret" });
const madefor = Wix_Madefor_Text({ subsets: ["latin"], weight: "400", variable: "--font-madefor" });

export const metadata: Metadata = {
  title: "Shop — Creative Collective Africa",
  description:
    "Goods and services from diverse people, cultures and causes — a marketplace where every purchase supports creativity, community and meaningful impact.",
};

const PRODUCTS_URL = "/shop/products";
const search = (q: string) => `${PRODUCTS_URL}?q=${encodeURIComponent(q)}`;

/*
 * Gallery lists are in the Wix gallery's own order. Every gallery on the Wix
 * page runs right-to-left, so on screen they read in reverse, starting from
 * the right edge.
 */
const CATEGORIES = [
  { slug: "celebrity-merchandise", label: "Celebrity merchandise", q: "Celebrity" },
  { slug: "fashion-textiles", label: "Fashion & textiles", q: "Fashion" },
  { slug: "home-living", label: "Home & living", q: "Home" },
  { slug: "music-creative-gear", label: "Music & creative gear", q: "Music" },
  { slug: "packaged-food", label: "Packaged food", q: "Food" },
  { slug: "art-crafts", label: "Art & crafts", q: "Art" },
  { slug: "books-learning", label: "Books & learning", q: "Books" },
  { slug: "african-cultures", label: "African cultures", q: "Culture" },
  { slug: "special-causes", label: "Special causes", q: "Cause" },
  { slug: "gifts", label: "Gifts", q: "Gift" },
].map((c) => ({ src: `/shop/icon-${c.slug}.webp`, alt: c.label, href: search(c.q) }));

/* Cultures with their own collection page link there; the rest search. */
const CULTURES = [
  { slug: "oromo", label: "Oromo" },
  { slug: "maasai", label: "Maasai", collection: "masai" },
  { slug: "yoruba", label: "Yoruba" },
  { slug: "hausa", label: "Hausa" },
  { slug: "amhara", label: "Amhara" },
  { slug: "fulani", label: "Fulani" },
  { slug: "zulu", label: "Zulu", collection: "zulu" },
  { slug: "kanuri", label: "Kanuri", collection: "kanuri" },
  { slug: "tuareg", label: "Tuareg" },
  { slug: "jamaican", label: "Jamaican" },
].map((c) => ({
  src: `/shop/culture-${c.slug}.webp`,
  alt: c.label,
  href: c.collection ? `/shop/collection/${c.collection}` : search(c.label),
}));

const CAUSES = [
  { slug: "philantropy", label: "Philanthropy" },
  { slug: "military-merch", label: "Military merch", collection: "military" },
  { slug: "youth-students", label: "Youth & students" },
  { slug: "women-girls", label: "Women & girls" },
  { slug: "the-disabled", label: "The disabled" },
  { slug: "green-africa", label: "Green Africa" },
].map((c) => ({
  src: `/shop/cause-${c.slug}.webp`,
  alt: c.label,
  href: c.collection ? `/shop/collection/${c.collection}` : search(c.label),
}));

const PRODUCTS = [
  { slug: "kano-leather-tote", label: "Kano leather tote — N85,000", q: "Kano" },
  { slug: "indigo-scarf", label: "Indigo scarf — N15,000", q: "Indigo" },
  { slug: "benin-bronze-bracelet", label: "Benin bronze bracelet — N45,000", q: "Benin" },
  { slug: "ankara-laptop-sleeve", label: "Ankara laptop sleeve — N25,000", q: "Ankara" },
].map((p) => ({ src: `/shop/product-${p.slug}.webp`, alt: p.label, href: search(p.q) }));

export default function ShopPage() {
  return (
    <div className={`${home.page} ${azeret.variable} ${madefor.variable}`}>
      <SiteHeader />
      <FocalBackgrounds />

      <main>
        {/* 1 · Hero */}
        <section
          className={`${home.section} ${styles.hero}`}
          data-focal="57 48"
          data-ratio={1536 / 1024}
        >
          <div className={`${home.inner} ${styles.body} ${styles.heroInner}`}>
            <div className={styles.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/cc-logo-ring.png" alt="Creative Collective Africa" />
            </div>
            <h3 className={styles.kicker}>SHOP THE&nbsp;COLLECTIVE</h3>
            <h1 className={`${home.display} ${styles.title}`}>
              PEOPLE |&nbsp;CULTURES |&nbsp;CAUSES
            </h1>
            <p className={styles.lead}>
              The Creative Collective Shop brings together goods and services from diverse people,
              cultures and causes, creating a marketplace where every purchase supports creativity,
              community and meaningful impact.
            </p>
            <Link href={PRODUCTS_URL} className={`${home.btn} ${home.btnGold} ${styles.heroShop}`}>
              Shop The Collective
            </Link>
            <Link href="/join" className={`${home.btn} ${home.btnGold} ${styles.heroCreate}`}>
              Become A Creator
            </Link>
            <form action={PRODUCTS_URL} role="search" className={styles.search}>
              <input type="search" name="q" placeholder="SEARCH" aria-label="Search the shop" />
            </form>
          </div>
        </section>

        {/* 2 · Category icons */}
        <section className={`${home.section} ${styles.icons}`}>
          <div className={`${home.inner} ${styles.body} ${styles.iconsInner}`}>
            <Marquee
              items={CATEGORIES}
              ratio={161 / 213}
              gap={25}
              copies={1}
              height={213}
              rtl
              className={styles.iconsGallery}
            />
            <hr className={styles.rule} />
          </div>
        </section>

        {/* 3 · Shop by culture */}
        <section
          className={`${home.section} ${styles.cultures}`}
          data-focal="23 53"
          data-ratio={1672 / 940}
        >
          <div className={`${home.inner} ${styles.body} ${styles.culturesInner}`}>
            <div className={`${home.box} ${styles.panel}`}>
              <h2 className={`${styles.heading} ${styles.cultureTitle}`}>SHOP BY CULTURE</h2>
              <Marquee
                items={CULTURES}
                ratio={207 / 83}
                gap={25}
                copies={1}
                height={83}
                rtl
                className={styles.pillsGallery}
              />
              <h3 className={styles.cultureLead}>
                EXPLORE PRODUCTS FROM CULTURES ACROSS AFRICA, THE CARIBBEAN AND THE AFRICAN DIASPORA
              </h3>
            </div>
            <Link
              href="/shop/collection/kanuri"
              className={`${home.btn} ${home.btnGold} ${styles.culturesBtn}`}
            >
              Shop Cultures
            </Link>
          </div>
        </section>

        {/* 4 · Collections for causes */}
        <section
          className={`${home.section} ${styles.causes}`}
          data-focal="44 49"
          data-ratio={1672 / 941}
        >
          <div className={`${home.inner} ${styles.body} ${styles.causesInner}`}>
            <div className={`${home.box} ${styles.panel} ${styles.causesPanel}`}>
              <h2 className={`${styles.heading} ${styles.causesTitle}`}>COLLECTIONS FOR CAUSES</h2>
              <h3 className={styles.causesLead}>
                SUPPORT THE PEOPLE, IDEAS, AND COMMUNITIES, THAT MAKE AFRICA STRONGER
              </h3>
            </div>
            <Marquee
              items={CAUSES}
              ratio={207 / 83}
              gap={25}
              copies={2}
              height={83}
              rtl
              className={styles.causesGallery}
            />
            <Link
              href="/shop/collection/military"
              className={`${home.btn} ${home.btnWhite} ${styles.causesBtn}`}
            >
              Explore Causes
            </Link>
          </div>
        </section>

        {/* 5 · Featured products */}
        <section className={`${home.section} ${styles.featured}`}>
          <div className={`${home.inner} ${styles.body} ${styles.featuredInner}`}>
            <h3 className={styles.featuredTitle}>FEATURED PRODUCTS</h3>
            <Marquee
              items={PRODUCTS}
              ratio={290 / 531}
              gap={25}
              copies={2}
              height={531}
              rtl
              className={styles.productsGallery}
            />
            <Link
              href={PRODUCTS_URL}
              className={`${home.btn} ${home.btnWhite} ${styles.productsBtn}`}
            >
              Shop All Products
            </Link>
            <Link href="/join" className={`${home.btn} ${home.btnWhite} ${styles.featuredCreate}`}>
              Become A Creator
            </Link>
          </div>
        </section>

        <SiteFooter tight />
      </main>
    </div>
  );
}
