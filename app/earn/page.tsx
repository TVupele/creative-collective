import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { Azeret_Mono, Wix_Madefor_Text } from "next/font/google";
import FocalBackgrounds from "@/components/home/FocalBackgrounds";
import Marquee from "@/components/home/Marquee";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import home from "@/components/home/home.module.css";
import styles from "@/components/earn/earn.module.css";

/* Same type as the other pages: Azeret Mono throughout, Madefor on buttons. */
const azeret = Azeret_Mono({ subsets: ["latin"], weight: "400", variable: "--font-azeret" });
const madefor = Wix_Madefor_Text({ subsets: ["latin"], weight: "400", variable: "--font-madefor" });

/*
 * The Wix headlines are set in Impact, which ships with Windows and macOS and
 * is used whenever it's installed. Elsewhere Anton (OFL) stands in, its
 * ascent tuned so the capitals sit on Impact's baselines.
 */
const anton = localFont({
  src: "../../components/earn/anton-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-anton",
  display: "swap",
  declarations: [
    { prop: "ascent-override", value: "105.28%" },
    { prop: "descent-override", value: "21.09%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

export const metadata: Metadata = {
  title: "Earn — Turn your creativity into income | Creative Collective",
  description:
    "Creative Collective Africa connects African creatives to real opportunities, markets and audiences to help you earn and grow.",
};

const WAYS = [
  {
    n: "01",
    alt: "01 · Get paid gigs — access freelance jobs, creative commissions and event opportunities from brands, organizations and individuals.",
  },
  {
    n: "02",
    alt: "02 · Sell your work — monetize your art, fashion, crafts, music, books and digital products through the Creative Collective marketplace.",
  },
  {
    n: "03",
    alt: "03 · Find collaborations — connect with creatives, brands, institutions and investors looking for partners across Africa and the diaspora.",
  },
  {
    n: "04",
    alt: "04 · Access opportunities — discover grants, competitions, residences, exhibitions, festivals and calls for proposals.",
  },
  {
    n: "05",
    alt: "05 · Monetize your skill — sell courses, tutorials, masterclasses and consulting services in design, writing, cooking, video editing, music and more.",
  },
  {
    n: "06",
    alt: "06 · Learn to earn — get practical training on pricing, contracts, branding, marketing, e-commerce and building a sustainable creative business.",
  },
];

/*
 * Gallery lists are in the Wix gallery's own order. The Wix galleries run
 * right-to-left, so on screen they read in reverse, starting from the right.
 */
const JOURNEY = [
  { slug: "develop", alt: "Develop — build your skills and creative identity" },
  { slug: "showcase", alt: "Showcase — display your work and build a profile" },
  { slug: "connect", alt: "Connect — find opportunities and collaborate" },
  { slug: "sell", alt: "Sell — turn your creativity into products" },
  { slug: "earn", alt: "Earn — build a sustainable creative career" },
].map((i) => ({ src: `/earn/icon-${i.slug}.webp`, alt: i.alt }));

const OPPORTUNITIES = [
  { slug: "festivals", alt: "Festivals & exhibitions" },
  { slug: "competitions", alt: "Competitions & awards" },
  { slug: "grants", alt: "Grants & funding" },
  { slug: "residences", alt: "Residences & fellowships" },
  { slug: "jobs", alt: "Jobs & commissions" },
].map((i) => ({ src: `/earn/map-${i.slug}.webp`, alt: i.alt }));

const COURSES = [
  "CREATIVE BUSINESS & ENTREPRENEURSHIP",
  "DESIGN, VISUAL ARTS & PHOTOGRAHY",
  "FILM, VIDEO & ANIMATION",
  "MUSIC, AUDIO & PRODUCTION",
  "FOOD, CULINARY & HOSPITALITY",
  "FASHION, BEAUTY & LIFESTYLE",
  "WRITING, PUBLISHING & MEDIA",
  "MARKETING, BRANDING & DIGITAL SKILLS",
  "GRANTS, FUNDING & BUSINESS GROWTH",
];

export default function EarnPage() {
  return (
    <div
      className={`${home.page} ${azeret.variable} ${madefor.variable} ${anton.variable}`}
      data-hide-shop-button
    >
      <SiteHeader />
      <FocalBackgrounds />

      <main className={styles.main}>
        {/* 1 · Hero */}
        <section
          className={`${home.section} ${styles.hero}`}
          data-focal="34 17"
          data-ratio={8859 / 3858}
        >
          <div className={`${home.inner} ${styles.body} ${styles.heroInner}`}>
            <h1 className={styles.headline}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/earn/headline.webp" alt="Turn your creativity into income." />
            </h1>
            <div className={`${home.box} ${styles.panel} ${styles.heroPanel}`}>
              <hr className={styles.heroRule} />
              <p className={`${styles.copy} ${styles.heroCopy}`}>
                Creative Collective Africa connects African creatives to real opportunities, market
                and audiences to help you earn and grow.
              </p>
              <Link href="/join" className={`${home.btn} ${styles.btnGhost} ${styles.heroJoin}`}>
                Join The Creative
              </Link>
              <a
                href="#opportunities"
                className={`${home.btn} ${styles.btnGhost} ${styles.heroExplore}`}
              >
                Explore Opportunities
              </a>
            </div>
          </div>
        </section>

        {/* 2 · 6 ways to earn */}
        <section className={`${home.section} ${styles.band}`}>
          <div className={`${home.inner} ${styles.body} ${styles.bandInner}`}>
            <h2 className={`${styles.impact} ${styles.bandTitle}`}>6 WAYS TO EARN</h2>
          </div>
        </section>

        {/* 3 · The six cards */}
        <section className={`${home.section} ${styles.cards}`}>
          <div className={styles.cardsGrid}>
            {WAYS.map((w, i) => (
              <div key={w.n} className={styles.cell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/earn/card-${w.n}.webp`}
                  alt={w.alt}
                  loading="lazy"
                  className={`${styles.card} ${styles[`card${i + 1}`]}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 4 · White rule */}
        <section className={`${home.section} ${styles.separator}`}>
          <div className={`${home.inner} ${styles.separatorInner}`} />
        </section>

        {/* 5 · From talent to revenue */}
        <section
          className={`${home.section} ${styles.talent}`}
          data-focal="50 50"
          data-ratio={1739 / 736}
        >
          <div className={`${home.inner} ${styles.body} ${styles.talentInner}`}>
            <h2 className={`${styles.impact} ${styles.big} ${styles.talentTitle}`}>FROM TALENT</h2>
            <h2 className={`${styles.impact} ${styles.big} ${styles.grey} ${styles.revenueTitle}`}>
              TO REVENUE.
            </h2>
            <h3 className={`${styles.lead} ${styles.talentLead}`}>
              FIND THE TOOLS, OPPORTUNITIES AND COMMUNITY TO HELP YOU TURN YOUR CREATIVITY INTO A
              SUSTAINABLE INCOME.
            </h3>
          </div>
        </section>

        {/* 6 · Develop · showcase · connect · sell · earn */}
        <section className={`${home.section} ${styles.icons}`}>
          <div className={`${home.inner} ${styles.body} ${styles.iconsInner}`}>
            <Marquee
              items={JOURNEY}
              ratio={1618 / 2637}
              gap={47}
              copies={2}
              height={271}
              rtl
              className={styles.iconsGallery}
            />
          </div>
        </section>

        {/* 7 · Arts & Culture School Africa courses */}
        <section
          className={`${home.section} ${styles.acsa}`}
          data-focal="2 89"
          data-ratio={1672 / 941}
        >
          <div className={`${home.inner} ${styles.body} ${styles.acsaInner}`}>
            <h3 className={`${styles.lead} ${styles.acsaKicker}`}>
              LEARN PRACTICAL SKILLS FROM SCHOLARS AND EXPERTS
            </h3>
            <div className={styles.acsaLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/learn/logo-acsa.webp"
                alt="ACSA — Arts & Culture School Africa"
                loading="lazy"
              />
            </div>
            <h3 className={`${styles.lead} ${styles.yellow} ${styles.acsaLead}`}>
              ACCESS AFFORDABLE, HIGH QUALITY COURSES AND MASTERCLASSES FROM AFRICAN CREATIVES AND
              GLOBAL EXPERTS.
            </h3>
            <div className={styles.acsaBox} aria-hidden="true" />
            <ul className={styles.courses}>
              {COURSES.map((c) => (
                <li key={c}>
                  <h3 className={styles.lead}>{c}</h3>
                </li>
              ))}
            </ul>
            <Link href="/learn" className={`${home.btn} ${home.btnGold} ${styles.acsaBtn}`}>
              Explore Courses
            </Link>
          </div>
        </section>

        {/* 8 · Shop African creativity */}
        <section className={`${home.section} ${styles.shop}`}>
          <div className={`${home.inner} ${styles.body} ${styles.shopInner}`}>
            <h2 className={`${styles.impact} ${styles.big} ${styles.black} ${styles.shopTitle}`}>
              SHOP AFRICAN <span className={styles.yellow}>CREATIVITY</span>
            </h2>
            <h3 className={`${styles.lead} ${styles.black} ${styles.shopLead}`}>
              DISCOVER UNIQUE AFRICAN FASHION, ARTS, CRAFTS, MUSIC, LITERATURE AND DIGITAL PRODUCTS
              DIRECTLY FROM TALENTED CREATIVES ACROSS THE CONTINENT.
            </h3>
            <Link href="/shop" className={`${home.btn} ${home.btnGold} ${styles.shopBtn}`}>
              Explore The Shop
            </Link>
          </div>
        </section>

        {/* 9 · Fashion photograph */}
        <section className={`${home.section} ${styles.fashion}`}>
          <div className={`${home.inner} ${styles.fashionInner}`} />
        </section>

        {/* 10 · Opportunities at your fingertips */}
        <section id="opportunities" className={`${home.section} ${styles.opps}`}>
          <div className={`${home.inner} ${styles.body} ${styles.oppsInner}`}>
            <h2 className={`${styles.impact} ${styles.big} ${styles.oppsTitle}`}>
              OPPORTUNITIES
              <br />
              <span className={styles.yellow}>AT YOUR FINGERTIPS</span>
            </h2>
            <h3 className={`${styles.lead} ${styles.oppsLead}`}>
              GRANTS, COMPETITIONS, RESIDENCIES, FESTIVALS, EXHIBITIONS, JOBS, INVESTMENT SPOTS AND
              MORE - ALL IN ONE PLACE.
            </h3>
            <Marquee
              items={OPPORTUNITIES}
              ratio={1327 / 1474}
              gap={25}
              copies={2}
              height={318}
              rtl
              className={styles.mapsGallery}
            />
            <Link href="/join" className={`${home.btn} ${home.btnOutlineGold} ${styles.oppsBtn}`}>
              View Opportunities
            </Link>
          </div>
        </section>

        {/* 11 · Ready to turn your creativity into income? */}
        <section className={`${home.section} ${styles.ready}`}>
          <div className={`${home.inner} ${styles.body} ${styles.readyInner}`}>
            <h2 className={`${styles.impact} ${styles.big} ${styles.black} ${styles.readyTitle}`}>
              READY TO TURN YOUR
              <br />
              <span className={styles.yellow}>CREATIVITY INTO INCOME?</span>
            </h2>
            <h3 className={`${styles.lead} ${styles.black} ${styles.readyLead}`}>
              JOIN A GROWING COMMUNITY OF AFRICAN CREATIVES BUILDING CAREERS, BUSINESSES AND NEW
              POSSIBILITIES THROUGH CREATIVITY.
            </h3>
            <Link href="/join" className={`${home.btn} ${home.btnGold} ${styles.readyJoin}`}>
              Join The Collective
            </Link>
            <a
              href="#opportunities"
              className={`${home.btn} ${home.btnGold} ${styles.readyExplore}`}
            >
              Explore Opportunities
            </a>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
