import type { Metadata } from "next";
import Link from "next/link";
import { Azeret_Mono, Wix_Madefor_Text } from "next/font/google";
import FocalBackgrounds from "@/components/home/FocalBackgrounds";
import Marquee from "@/components/home/Marquee";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import home from "@/components/home/home.module.css";
import styles from "@/components/learn/learn.module.css";

/* Same type as the homepage: Azeret Mono throughout, Madefor on buttons. */
const azeret = Azeret_Mono({ subsets: ["latin"], weight: "400", variable: "--font-azeret" });
const madefor = Wix_Madefor_Text({ subsets: ["latin"], weight: "400", variable: "--font-madefor" });

export const metadata: Metadata = {
  title: "Learn — Arts & Culture School of Africa | Creative Collective",
  description:
    "School of Excellence: Arts & Culture — world-class learning, real-world experience and industry access for Africa’s next generation of creative leaders.",
};

/*
 * Gallery lists are in the Wix gallery's own order. The Wix galleries run
 * right-to-left, so on screen they read in reverse, starting from the right.
 */
const PROGRAMMES = [
  {
    slug: "workshops",
    label: "Workshops — hands-on training to build practical skills and sharpen your craft",
  },
  {
    slug: "masterclasses",
    label:
      "Masterclasses — learn directly from leading creatives, industry icons and cultural thought leaders",
  },
  {
    slug: "projects",
    label:
      "Projects — work on real projects, build your portfolio and solve actual industry challenges",
  },
  {
    slug: "industry-sessions",
    label:
      "Industry sessions — engage with industry leaders, explore trends and discover opportunities",
  },
  {
    slug: "field-experiences",
    label:
      "Field experiences — learn on location through immersive cultural and industry experiences",
  },
  {
    slug: "mentorship",
    label: "Mentorship — get guidance and support from experienced professionals in your field",
  },
].map((p) => ({ src: `/learn/card-${p.slug}.webp`, alt: p.label }));

/* Faculty portraits to come — Wix shows six placeholder rings for now. */
const INSTRUCTORS = Array.from({ length: 6 }, () => ({
  src: "/learn/instructor-placeholder.webp",
  alt: "Featured instructor — coming soon",
}));

const PATHS = [
  {
    slug: "fashion-design",
    label: "Fashion & design — design, branding and creative entrepreneurship",
  },
  { slug: "music-sound", label: "Music & sound — production, business and the future of music" },
  { slug: "arts-crafts", label: "Arts & crafts — traditional and contemporary art forms" },
  {
    slug: "tourism-heritage",
    label: "Tourism & heritage — culture, tourism and creative place-making",
  },
  {
    slug: "science-tech",
    label: "Science & tech — science, technology and innovation for the future",
  },
  { slug: "business", label: "Business — creative enterprise and methods for growth" },
  { slug: "market-access", label: "Market access — creative commerce and global opportunities" },
  { slug: "film-media", label: "Film & media — storytelling, production and digital media skills" },
].map((p) => ({ src: `/learn/path-${p.slug}.webp`, alt: p.label }));

export default function LearnPage() {
  return (
    <div className={`${home.page} ${azeret.variable} ${madefor.variable}`} data-hide-shop-button>
      <SiteHeader />
      <FocalBackgrounds />

      <main className={styles.main}>
        {/* 1 · Hero */}
        <section
          className={`${home.section} ${styles.hero}`}
          data-focal="36 62"
          data-ratio={5466 / 2981}
        >
          <div className={`${home.inner} ${styles.body} ${styles.heroInner}`}>
            <h1 className={styles.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/learn/logo-acsa.webp" alt="ACSA — Arts & Culture School of Africa" />
            </h1>
            <div className={`${home.box} ${styles.panel} ${styles.heroPanel}`}>
              <div className={`${styles.copy} ${styles.heroCopy}`}>
                <p className={styles.yellow}>
                  WORLD-CLASS LEARNING. REAL-WORLD EXPERIENCE. INDUSTRY ACCESS.
                </p>
                <p>
                  School of Excellence: Arts &amp; Culture is the learning platform of Creative
                  Collective, equipping Africa’s next generation of creative leaders with the
                  knowledge, skills, experience and industry connections to build meaningful careers
                  and shape the future of Africa’s creative economy.
                </p>
              </div>
            </div>
            <a href="#paths" className={`${home.btn} ${home.btnGold} ${styles.explore}`}>
              Explore Programs
            </a>
            <div className={styles.features}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/learn/features.webp"
                alt="Expert tutors · Industry access · Pan-Africa network"
              />
            </div>
            <hr className={styles.heroRule} />
          </div>
        </section>

        {/* 2 · More than courses */}
        <section className={`${home.section} ${styles.intro}`}>
          <div className={`${home.inner} ${styles.body} ${styles.introInner}`}>
            <h2 className={`${styles.heading} ${styles.yellow} ${styles.introTitle}`}>
              MORE THAN COURSES
              <br />A CREATIVE JOURNEY
            </h2>
            <h3 className={`${styles.white} ${styles.introLead}`}>
              FROM MASTERCLASSES TO IMMERSIVE FIELD EXPERIENCES AND CREATIVE BUSINESS TRAINING, THE
              SCHOOL OF EXCELLENCE: ARTS &amp; CULTURE IS DESIGNED TO BUILD SKILLS, OPEN DOORS AND
              CONNECT YOU TO REAL OPPORTUNITIES.
            </h3>
          </div>
        </section>

        {/* 3 · Programme cards */}
        <section className={`${home.section} ${styles.programmes}`}>
          <div className={`${home.inner} ${styles.body} ${styles.programmesInner}`}>
            <Marquee
              items={PROGRAMMES}
              ratio={1}
              gap={25}
              copies={2}
              height={213}
              rtl
              className={styles.cardsGallery}
            />
            <hr className={styles.programmesRule} />
          </div>
        </section>

        {/* 4 · Featured instructors & faculty */}
        <section
          className={`${home.section} ${styles.instructors}`}
          data-focal="46 72"
          data-ratio={1698 / 926}
        >
          <div className={`${home.inner} ${styles.body} ${styles.instructorsInner}`}>
            <h3 className={styles.instructorsKicker}>LEARN FROM THE BEST</h3>
            <h2 className={`${styles.heading} ${styles.blue} ${styles.instructorsTitle}`}>
              FEATURED INSTRUCTORS
            </h2>
            <Marquee
              items={INSTRUCTORS}
              ratio={1}
              gap={25}
              copies={2}
              height={213}
              rtl
              className={styles.circlesGallery}
            />
            <div className={`${home.box} ${styles.panel} ${styles.faculty}`}>
              <h2 className={`${styles.heading} ${styles.white} ${styles.facultyTitle}`}>
                FACULTY
              </h2>
              <div className={styles.portrait}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/learn/faculty-olu-obafemi.jpg" alt="Emeritus Professor Olu Obafemi" />
              </div>
              <div className={`${styles.portrait} ${styles.portraitEfe}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/learn/faculty-efe-omorogbe.jpg" alt="Mr. Efe Omorogbe" />
              </div>
              <p className={`${styles.copy} ${styles.bio}`}>
                <span className={styles.yellow}>
                  Faculty of Cultural Arts &amp; Literature
                  <br />
                  Lead: Emeritus Professor Olu Obafemi. FNM, NMON, D.Litt.
                  <br />
                  &nbsp;
                  <br />
                  Scholar, Playwright, Author &amp; Cultural Intellectual
                </span>
                <br />
                <br />
                <span className={styles.white}>
                  An eminent Nigerian scholar and creative thinker with more than five decades of
                  engagement with literature, theatre and cultural expression, Emeritus Professor
                  Olu Obafemi is a former Professor of English and Dramatic Literature at the
                  University of Ilorin and a recipient of the Nigerian National Order of Merit
                  (NNOM).
                  <br />
                  <br />
                  His distinguished career spans literature, theatre, poetry, scholarship and
                  cultural leadership, with extensive experience as a playwright, novelist, poet,
                  critic and translator, alongside leadership of the Nigerian Academy of Letters,
                  the Association of Nigerian Authors and the National Commission for Museums and
                  Monuments.
                </span>
              </p>
              <p className={`${styles.copy} ${styles.bio} ${styles.bioEfe}`}>
                <span className={styles.yellow}>
                  Faculty of Contemporary Arts &amp; Commercialization
                  <br />
                  Lead: Mr. Efe Omorogbe
                  <br />
                  &nbsp;
                  <br />
                  Music Executive, Talent Developer, Creative Entrepreneur &amp; Industry Strategist
                </span>
                <br />
                &nbsp;
                <br />
                <span className={styles.white}>
                  A pioneering Nigerian creative-industry practitioner with more than three decades
                  of engagement with music and popular culture, Efe Omorogbe is the Founder of Now
                  Muzik, Co-Founder of Hypertek Digital/960 Music Group, and Founder of Buckwyld
                  Media Network.
                  <br />
                  <br />
                  His career spans talent management, music, film and television production, live
                  events, creative consulting and intellectual-property advocacy, with extensive
                  experience developing artists, building creative enterprises and taking African
                  creative work to audiences and markets.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 5 · Choose your path */}
        <section id="paths" className={`${home.section} ${styles.choose}`}>
          <div className={`${home.inner} ${styles.body} ${styles.chooseInner}`}>
            <h2 className={`${styles.heading} ${styles.blue} ${styles.chooseTitle}`}>
              CHOOSE YOUR PATH
            </h2>
            <h3 className={`${styles.blue} ${styles.chooseLead}`}>
              LEARNING PATHS FOR YOUR CREATIVE JOURNEY
            </h3>
          </div>
        </section>

        {/* 6 · Learning paths */}
        <section className={`${home.section} ${styles.paths}`}>
          <div className={`${home.inner} ${styles.body} ${styles.pathsInner}`}>
            <Marquee
              items={PATHS}
              ratio={3280 / 2972}
              gap={25}
              copies={1}
              height={209}
              rtl
              className={styles.pathsGallery}
            />
          </div>
        </section>

        {/* 7 · Field experiences */}
        <section
          className={`${home.section} ${styles.field}`}
          data-focal="52 42"
          data-ratio={1024 / 1536}
        >
          <div className={`${home.inner} ${styles.body} ${styles.fieldInner}`}>
            <h2 className={`${styles.heading} ${styles.blue} ${styles.fieldTitle}`}>
              FIELD EXPERIENCES
            </h2>
            <h3 className={`${styles.blue} ${styles.fieldKicker}`}>BEYOND THE CLASSROOM</h3>
            <h3 className={`${styles.blue} ${styles.fieldLead}`}>
              JOIN CURATED FIELD TRIPS, CULTURAL IMMERSIONS AND INDUSTRY EVENTS ACROSS NIGERIA AND
              AFRICA TO DEEPEN YOUR LEARNING AND BUILD REAL-WORLD NETWORKS.
            </h3>
            <Link
              href="/#experience"
              className={`${home.btn} ${styles.btnOutline} ${styles.fieldBtn}`}
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* 8 · Start your journey */}
        <section className={`${home.section} ${styles.journey}`}>
          <div className={`${home.inner} ${styles.body} ${styles.journeyInner}`}>
            <h2 className={`${styles.heading} ${styles.yellow} ${styles.journeyTitle}`}>
              START YOUR JOURNEY
            </h2>
            <div className={styles.journeyLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/learn/logo-acsa.webp" alt="" loading="lazy" />
            </div>
            <h3 className={`${styles.yellow} ${styles.journeyLead}`}>
              GAIN ACCESS TO EXPERT-LED LEARNING, MENTORSHIP, EXCLUSIVE CONTENT, INDUSTRY NETWORKS
              AND REAL OPPORTUNITIES
            </h3>
            <Link href="/join" className={`${home.btn} ${styles.btnBlue} ${styles.journeyBtn}`}>
              Join Now
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
