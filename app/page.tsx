import type { Metadata } from "next";
import Link from "next/link";
import { Azeret_Mono, Wix_Madefor_Text } from "next/font/google";
import FocalBackgrounds from "@/components/home/FocalBackgrounds";
import Marquee from "@/components/home/Marquee";
import SiteHeader from "@/components/home/SiteHeader";
import styles from "@/components/home/home.module.css";

/* The Wix page sets everything in Azeret Mono; buttons use Wix Madefor Text. */
const azeret = Azeret_Mono({ subsets: ["latin"], weight: "400", variable: "--font-azeret" });
const madefor = Wix_Madefor_Text({ subsets: ["latin"], weight: "400", variable: "--font-madefor" });

export const metadata: Metadata = {
  title: "Creative Collective Africa — Africa’s Creative Community",
  description:
    "A continental platform connecting creatives, entrepreneurs, students, brands and audiences through learning, opportunity, commerce, culture and experience.",
};

const FESTAC_URL = "https://cbaac.gov.ng/programs/road2festac";

const PILLARS = [
  { src: "/home/pillar-learn.png", alt: "Learn — learn from industry leaders" },
  { src: "/home/pillar-join.png", alt: "Join — find your creative community" },
  { src: "/home/pillar-experience.png", alt: "Experience — discover Africa’s hidden secrets" },
  { src: "/home/pillar-earn.png", alt: "Earn — turn your talent into income" },
  { src: "/home/pillar-create.png", alt: "Create — bring your ideas into reality" },
];

const EXPERIENCES = [
  { src: "/home/exp-music-concerts.png", alt: "Music concerts" },
  { src: "/home/exp-fashion-shows.png", alt: "Fashion shows" },
  { src: "/home/exp-film-theatre.png", alt: "Film & theatre" },
  { src: "/home/exp-art-exhibitions.png", alt: "Art exhibitions" },
  { src: "/home/exp-cultural-festivals.png", alt: "Cultural festivals" },
  { src: "/home/exp-heritage-tours.png", alt: "Heritage tours" },
];

const EARN = [
  { src: "/home/earn-jobs.png", alt: "Jobs — find jobs and paid employment" },
  { src: "/home/earn-licensing.png", alt: "Licensing — monetize your IP and creative work" },
  { src: "/home/earn-gigs.png", alt: "Gigs — find creative work and commissions" },
  { src: "/home/earn-opportunities.png", alt: "Opportunities — discover grants, competitions and calls" },
  { src: "/home/earn-marketplace.png", alt: "Marketplace — sell your creative products and services" },
  { src: "/home/earn-collaborations.png", alt: "Collaborations — connect with brands and organizations" },
];

const LEARN = [
  { src: "/home/learn-projects.png", alt: "Projects — practical initiatives that turn ideas into real-world impact" },
  { src: "/home/learn-mentorship.png", alt: "Mentorship — guidance and support from experienced professionals" },
  { src: "/home/learn-master-classes.png", alt: "Master classes — expert-led sessions offering practical knowledge and skills" },
  { src: "/home/learn-workshops.png", alt: "Workshops — hands-on sessions focused on learning, practice and skill-building" },
  { src: "/home/learn-industry-sessions.png", alt: "Industry sessions — expert-led sessions sharing industry insights" },
  { src: "/home/learn-field-experiences.png", alt: "Field experiences — hands-on learning through real-world experiences" },
];

const SHOP_LINKS = [
  { label: "KANURI INSPIRED FASHION", href: "/shop/collection/kanuri" },
  { label: "GA INSPIRED FASHION", href: "/shop/collection/ga" },
  { label: "BENIN INSPIRED JEWELRY", href: "/shop/collection/benin" },
  { label: "MILITARY MERCHANDISE", href: "/shop/collection/military" },
];

export default function Home() {
  return (
    <div className={`${azeret.variable} ${madefor.variable} ${styles.page}`} data-hide-shop-button>
      <SiteHeader />
      <FocalBackgrounds />

      <main className={styles.sections}>
        {/* 1 · Hero */}
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.inner}>
            <div className={`${styles.box} ${styles.heroBox}`}>
              <div className={styles.heroLogo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home/cc-logo-ring.png" alt="Creative Collective Africa" />
              </div>
              <h1 className={`${styles.display} ${styles.textCenter} ${styles.heroTitle}`}>
                AFRICA’S CREATIVE COMMUNITY IS HERE
              </h1>
            </div>
            <h3 className={`${styles.textCenter} ${styles.heroLead}`}>
              A CONTINENTAL PLATFORM CONNECTING CREATIVES, ENTREPRENEURS, STUDENTS, BRANDS AND
              AUDIENCES THROUGH LEARNING, OPPORTUNITY, COMMERCE, CULTURE AND EXPERIENCE.
              <br />
              <br />
              CREATIVE COLLECTIVE AFRICA IS THE OFFICIAL CREATIVES ACTIVATION PARTNER FOR ROAD TO
              FESTAC’77 @ 50.
            </h3>
            <Link href="/join" className={`${styles.btn} ${styles.btnGhostGold} ${styles.heroBtnLeft}`}>
              Join the Collective
            </Link>
            <Link href="#festac" className={`${styles.btn} ${styles.btnGhostGold} ${styles.heroBtnRight}`}>
              Road to FESTAC
            </Link>
          </div>
        </section>

        {/* 2 · Flags */}
        <section className={`${styles.section} ${styles.flags}`}>
          <div className={styles.inner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/flags.jpg"
              alt="Flags of Ethiopia, Ghana, Kenya, Nigeria, Morocco, Senegal and South Africa"
            />
          </div>
        </section>

        {/* 3 · One Collective */}
        <section className={`${styles.section} ${styles.collective}`}>
          <div className={styles.inner}>
            <h1 className={`${styles.display} ${styles.textCenter} ${styles.collectiveTitle}`}>
              ONE COLLECTIVE.
              <br />
              MANY POSSIBILITIES.
            </h1>
            <h3 className={`${styles.textCenter} ${styles.collectiveLead}`}>
              CREATIVE COLLECTIVE AFRICA BRINGS TOGETHER THE PEOPLE, IDEAS, SKILLS, PRODUCTS AND
              OPPORTUNITIES DRIVING AFRICA’S CREATIVE ECONOMY.
            </h3>
            <Marquee
              items={PILLARS}
              ratio={152 / 213}
              gap={25}
              copies={3}
              height={213}
              className={styles.collectiveGallery}
            />
            <Link href="/join" className={`${styles.btn} ${styles.btnGold} ${styles.collectiveBtn}`}>
              Join the Collective
            </Link>
          </div>
        </section>

        <section className={`${styles.section} ${styles.kente} ${styles.kenteTop}`} aria-hidden>
          <div className={styles.inner} />
        </section>

        {/* 5 · Road to FESTAC banner */}
        <section
          id="festac"
          className={`${styles.section} ${styles.festacBanner}`}
          role="img"
          aria-label="Road to FESTAC’77 @ 50"
        />

        {/* 6 · Road to FESTAC story */}
        <section
          className={`${styles.section} ${styles.festacStory}`}
          data-focal="16 49"
          data-ratio={1672 / 941}
        >
          <div className={styles.inner}>
            <div className={`${styles.textCenter} ${styles.festacCopy}`}>
              <p>
                The Road to FESTAC ’77 @ 50 is a pan-African cultural journey celebrating the
                legacy of the Second World Black and African Festival of Arts and Culture while
                looking toward the future of Africa and the global Black community.
              </p>
              <p>
                Across Africa and the diaspora, the journey brings people together through
                culture, heritage, creativity, tourism, learning and shared experiences —
                reconnecting generations and creating new pathways for collaboration.
              </p>
              <p>&#8203;</p>
              <p>One People. One Journey. One Road.</p>
            </div>
            <a
              href={FESTAC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnOutlineGold} ${styles.festacBtn}`}
            >
              Join the Journey
            </a>
            <div className={styles.festacSeal}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/cbaac-seal.png"
                alt="Centre for Black and African Arts and Civilization (CBAAC) seal"
              />
            </div>
            <div className={`${styles.textCenter} ${styles.festacInitiative}`}>
              <p>Road to FESTAC&apos;77@50 is an initiative of</p>
              <p>The Center for Black and African Arts and Civilization.</p>
            </div>
          </div>
        </section>

        {/* 7 · Africa Heritage Tour */}
        <section
          className={`${styles.section} ${styles.feature} ${styles.heritage}`}
          data-focal="50 29"
          data-ratio={1024 / 1536}
        >
          <div className={styles.inner}>
            <div className={styles.heritageLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/heritage-tour-logo.png" alt="The Africa Heritage Tour" />
            </div>
            <div className={`${styles.box} ${styles.featureBox} ${styles.heritageBox}`}>
              <h1 className={`${styles.display} ${styles.featureTitle} ${styles.white} ${styles.heritageTitle}`}>
                THE AFRICA HERITAGE TOUR
              </h1>
              <div className={styles.heritageCopy}>
                <p className={styles.white}>Part of the Road to FESTAC ’77 @ 50</p>
                <p>
                  Discover Africa beyond the headlines. The Africa Heritage Tour takes you across
                  the continent to experience its remarkable landscapes, historic sites, cultures,
                  traditions and creative communities; connecting people with the stories and
                  heritage that make Africa extraordinary.
                </p>
                <p className={styles.white}>Learn. Explore. Experience Africa.</p>
              </div>
            </div>
            <Link
              href="/join"
              className={`${styles.btn} ${styles.btnGold} ${styles.featureBtn} ${styles.heritageBtn}`}
            >
              Follow The Tour
            </Link>
          </div>
        </section>

        {/* 8 · Experience Africa */}
        <section
          className={`${styles.section} ${styles.feature} ${styles.experience}`}
          data-focal="50 0"
          data-ratio={1024 / 1536}
        >
          <div className={styles.inner}>
            <div className={`${styles.box} ${styles.featureBox} ${styles.experienceBox}`}>
              <Marquee
                items={EXPERIENCES}
                ratio={351 / 122}
                gap={43}
                copies={1}
                height={122}
                className={styles.experienceGallery}
              />
              <h1 className={`${styles.display} ${styles.featureTitle} ${styles.white} ${styles.experienceTitle}`}>
                EXPERIENCE AFRICA THROUGH CULTURE, CREATIVITY, ADVENTURE AND DISCOVERY.
              </h1>
            </div>
            <Link href="/join" className={`${styles.btn} ${styles.btnWhite} ${styles.featureBtn}`}>
              Explore Experiences
            </Link>
          </div>
        </section>

        {/* 9 · Earn */}
        <section
          id="earn"
          className={`${styles.section} ${styles.feature} ${styles.earn}`}
          data-focal="42 43"
          data-ratio={1024 / 1536}
        >
          <div className={styles.inner}>
            <div className={`${styles.box} ${styles.featureBox} ${styles.skillsBox}`}>
              <h1 className={`${styles.display} ${styles.featureTitle} ${styles.gold} ${styles.skillsTitle}`}>
                TURN YOUR TALENT AND SKILL
                <br />
                INTO SUSTAINABLE INCOME
              </h1>
              <Marquee
                items={EARN}
                ratio={230 / 250}
                gap={0}
                copies={2}
                height={250}
                className={styles.earnGallery}
              />
            </div>
            <Link href="/join" className={`${styles.btn} ${styles.btnGold} ${styles.featureBtn}`}>
              Explore Opportunities
            </Link>
          </div>
        </section>

        {/* 10 · Learn */}
        <section
          id="learn"
          className={`${styles.section} ${styles.feature} ${styles.learn}`}
          data-focal="48 31"
          data-ratio={1024 / 1536}
        >
          <div className={styles.inner}>
            <div className={`${styles.box} ${styles.featureBox} ${styles.skillsBox}`}>
              <h1 className={`${styles.display} ${styles.featureTitle} ${styles.gold} ${styles.skillsTitle}`}>
                LEARN FROM&nbsp;ACCOMPLISHED SCHOLARS, PRACTITONERS AND PROFESSIONALS.
              </h1>
              <Marquee
                items={LEARN}
                ratio={188 / 264}
                gap={0}
                copies={2}
                height={264}
                className={styles.learnGallery}
              />
            </div>
            <Link href="/join" className={`${styles.btn} ${styles.btnGold} ${styles.featureBtn}`}>
              Explore Classes
            </Link>
          </div>
        </section>

        <section className={`${styles.section} ${styles.kente} ${styles.kenteBottom}`} aria-hidden>
          <div className={styles.inner} />
        </section>

        {/* 12 · Shop the Collective */}
        <section className={`${styles.section} ${styles.shop}`}>
          <div className={styles.shopInner}>
            <div className={styles.shopHead}>
              <h2>SHOP THE COLLECTIVE</h2>
              <Link href="/shop" className={styles.discover}>
                [ DISCOVER MORE ]
              </Link>
            </div>
            <div className={styles.shopCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/shop-feature.jpg" alt="" />
              <div className={styles.shopLinks}>
                {SHOP_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="help" className={`${styles.section} ${styles.footer}`}>
          <div className={styles.footerGrid}>
            <div className={`${styles.footerCol} ${styles.fHelp}`}>
              <p>HAVE A QUESTION?</p>
              <p>EXPLORE OUR HELP CENTER</p>
              <a href="mailto:info@creativecollective.africa" className={styles.viewMore}>
                VIEW MORE
              </a>
            </div>
            <div className={`${styles.footerCol} ${styles.fShop}`}>
              <p>
                <Link href="/shop">SHOP</Link>
              </p>
              <div>
                <p>
                  <Link href="/shop">ALL PRODUCTS</Link>
                </p>
                <p>
                  <Link href="/shop">BEST SELLERS</Link>
                </p>
                <p>
                  <Link href="/shop">SALE</Link>
                </p>
              </div>
            </div>
            <div className={`${styles.footerCol} ${styles.fContact}`}>
              <p>CONTACT</p>
              <div>
                <p className={styles.email}>
                  <a href="mailto:info@creativecollective.africa">info@creativecollective.africa</a>
                </p>
                <p>
                  <a href="tel:+2349161467262">+234-916-146-7262</a>
                </p>
              </div>
            </div>
            <div className={`${styles.footerCol} ${styles.fFollow}`}>
              <p>FOLLOW</p>
              <div>
                <p>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    INSTAGRAM
                  </a>
                </p>
                <p>
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    FACEBOOK
                  </a>
                </p>
                <p>
                  <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                    TIKTOK
                  </a>
                </p>
                <p>
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                    YOUTUBE
                  </a>
                </p>
              </div>
            </div>
            <div className={`${styles.footerCol} ${styles.fLegal}`}>
              <p>
                <Link href="/">LEGAL</Link>
              </p>
              <div>
                <p>
                  <Link href="/">TERMS &amp; CONDITIONS</Link>
                </p>
                <p>
                  <Link href="/">PRIVACY POLICY</Link>
                </p>
                <p>
                  <Link href="/">SHIPPING POLICY</Link>
                </p>
                <p>
                  <Link href="/">REFUND POLICY</Link>
                </p>
                <p>
                  <Link href="/">ACCESSIBILITY STATEMENT</Link>
                </p>
              </div>
            </div>
            <p className={styles.copyright}>© 2026 CREATIVE COLLECTIVE AFRICA</p>
          </div>
        </footer>
      </main>

      <a href="mailto:info@creativecollective.africa" className={styles.touch}>
        [ GET IN TOUCH ]
      </a>
    </div>
  );
}
