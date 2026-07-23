import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import WaitlistBanner from "@/components/WaitlistBanner";

export default function Home() {
  return (
    <main className="min-h-dvh w-full bg-ink">
      <Suspense fallback={null}>
        <WaitlistBanner />
      </Suspense>

      {/* Hero — kente background image with text positioned to match reference exactly */}
      <section className="relative w-full bg-ink">
        <Image
          src="/patterns/kente-hero.jpg"
          alt="Kente pattern background"
          width={1535}
          height={1600}
          className="h-auto w-full"
          priority
        />

        {/* One Continent. One Diaspora. */}
        <div className="absolute inset-x-0 top-[21.4%] -translate-y-1/2 px-4 text-center">
          <h1 className="whitespace-nowrap font-display text-[4.3vw] font-bold text-parchment sm:text-2xl md:text-3xl">
            One Continent. One Diaspora.
          </h1>
        </div>

        {/* CBAAC seal */}
        <div className="absolute left-[30.3%] top-[26.75%] w-[39.4%]">
          <Image
            src="/patterns/cbaac-seal.jpg"
            alt="Centre for Black and African Arts and Civilization (CBAAC) seal"
            width={420}
            height={420}
            className="h-auto w-full rounded-full shadow-2xl"
            priority
          />
        </div>

        {/* presents — CBAAC header image, centered in the green band */}
        <div className="absolute inset-x-0 top-[71.3%] -translate-y-1/2 px-6">
          <Image
            src="/patterns/cbaac-header.png"
            alt="The Centre for Black and African Arts and Civilizations (CBAAC) presents:"
            width={1471}
            height={200}
            className="mx-auto h-auto w-full max-w-[17rem] sm:max-w-[24rem]"
          />
        </div>

        {/* Journey heading — centered in the red band */}
        <div className="absolute inset-x-0 top-[88.5%] -translate-y-1/2 px-6 text-center">
          <h2 className="font-display text-[4.3vw] font-bold text-parchment drop-shadow-md sm:text-2xl md:text-3xl">
            The Official Continental Journey to FESTAC@50.
          </h2>
        </div>
      </section>

      {/* Road to FESTAC'77 */}
      <section className="relative bg-ink px-6 pb-0 pt-16 text-center sm:pt-24">
        <div className="relative mx-auto max-w-xl">
          <Image
            src="/patterns/festac-logo.png"
            alt="Road to FESTAC'77 — 50 years"
            width={5091}
            height={5091}
            className="mx-auto h-auto w-64 sm:w-80"
          />

          <p className="mx-auto mt-8 max-w-md text-base text-parchment/90 sm:text-lg">
            Join Africa&apos;s official continental journey to FESTAC@50.
          </p>

          <p className="mt-8 text-[3.2vw] font-semibold uppercase tracking-wide text-amber sm:text-lg sm:tracking-widest">
            Connect . Create . Travel . Celebrate
          </p>

          <p className="mx-auto mt-6 max-w-md text-base text-parchment/90 sm:text-lg">
            Join thousands of creatives, entrepreneurs, tourists and cultural enthusiasts
            across Africa and the Diaspora.
          </p>

          <a
            href="https://cbaac.gov.ng/programs/road2festac"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block border border-ink/10 bg-amber px-10 py-3 font-mono text-sm lowercase tracking-wide text-ink shadow-lg transition hover:bg-gold"
          >
            find out more
          </a>
        </div>

        {/* Decorative chevron trim — separate fixed-height strip, never overlaps content above */}
        <div className="relative -mx-6 mt-16">
          <Image
            src="/patterns/festac-chevron.png"
            alt=""
            aria-hidden
            width={1600}
            height={243}
            className="h-auto w-full"
          />
        </div>
      </section>

      {/* Creative Collective — orange section with brown bullet band */}
      <section className="relative bg-saffron px-6 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <Image
            src="/patterns/creative-collective-logo.png"
            alt="Creative Collective Africa"
            width={2051}
            height={1385}
            className="mx-auto h-auto w-72 sm:w-80"
          />

          <p className="mx-auto mt-6 max-w-xl text-ink/80">
            Join Africa&apos;s largest community of creatives shaping the Road to FESTAC and
            FESTAC@50.
          </p>
        </div>

        <div className="relative -mx-6 mt-6 bg-cocoa px-6 py-4">
          <ul className="mx-auto max-w-xl space-y-1 text-parchment/95">
            <li>. CREATE: Collaborate with creatives across Africa.</li>
            <li>. PERFORM: Participate in official events.</li>
            <li>. TRAVEL: Gain access to heritage tours.</li>
            <li>. EARN: Access commissions, opportunities and partnerships.</li>
          </ul>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <p className="mx-auto mt-8 max-w-xl text-ink/80">
            Join creatives from across Africa and the Diaspora preparing for FESTAC@50.
          </p>

          <Link
            href="/join"
            className="mt-10 inline-block border border-parchment/40 bg-[#F5EFC7] px-8 py-3 font-mono text-sm lowercase tracking-wide text-ink shadow-lg transition hover:bg-amber"
          >
            join the collective
          </Link>
        </div>
      </section>

      {/* Africa Heritage Tour — tribal pattern section */}
      <section id="heritage-tour" className="relative bg-tribal bg-cover bg-center px-6 py-20 text-center">
        <div className="absolute inset-0 bg-ink/45" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-parchment sm:text-4xl">
            Discover Africa
            <br />
            Through the Africa Heritage Tour
          </h2>

          <Image
            src="/patterns/africa-heritage-tour.png"
            alt="The Africa Heritage Tour, presented by Wakanow"
            width={4555}
            height={5753}
            className="mx-auto mt-6 h-auto w-[85%] max-w-md sm:w-[75%]"
          />

          <p className="mx-auto mt-10 max-w-xl text-parchment/90">
            The Road to FESTAC is not only for creatives, it&apos;s for everyone who wants to
            experience Africa&apos;s culture, heritage, and creativity firsthand.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-parchment/90">
            Through the Africa Heritage Tour, visitors can explore curated cultural journeys
            across the continent.
          </p>

          <p className="mt-8 font-semibold text-parchment">Official Travel Partner.</p>
          <p className="text-sm text-parchment/80">
            The Africa Heritage Tour is fulfilled by Wakanow.
          </p>

          <Image
            src="/patterns/wakanow.png"
            alt="Wakanow"
            width={1075}
            height={283}
            className="mx-auto mt-6 h-auto w-28"
          />

          <a
            href="https://www.wakanow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border border-ink/10 bg-white px-10 py-3 font-mono text-sm lowercase tracking-wide text-ink shadow-lg transition hover:bg-parchment"
          >
            explore heritage tours
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink px-6 py-12 text-center">
        <Image
          src="/patterns/footer-text.png"
          alt="Creative Collective is the official creative industries mobilization platform for Road to FESTAC and FESTAC@50."
          width={2677}
          height={184}
          className="mx-auto h-auto w-full max-w-md"
        />
        <Image
          src="/patterns/communify-logo.png"
          alt="Communify"
          width={1600}
          height={489}
          className="mx-auto mt-6 h-auto w-64 sm:w-72"
        />
      </footer>
    </main>
  );
}