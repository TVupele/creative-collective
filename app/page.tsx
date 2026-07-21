import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import WaitlistBanner from "@/components/WaitlistBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <WaitlistBanner />
      </Suspense>

      {/* Hero — kente background image with text positioned to match reference exactly */}
      <section className="relative w-full">
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
          />
        </div>

        {/* presents */}
        <div className="absolute inset-x-0 top-[70.2%] -translate-y-1/2 px-4 text-center">
          <p className="text-[1.7vw] text-parchment drop-shadow-md sm:text-sm md:text-base">
            The Centre for Black and African Arts and Civilization (CBAAC).
          </p>
        </div>
        <div className="absolute inset-x-0 top-[73.2%] -translate-y-1/2 px-4 text-center">
          <p className="text-[1.7vw] text-parchment drop-shadow-md sm:text-sm md:text-base">
            presents:
          </p>
        </div>

        {/* Journey heading */}
        <div className="absolute inset-x-0 top-[82.7%] -translate-y-1/2 px-6 text-center">
          <h2 className="font-display text-[2.5vw] font-bold text-parchment drop-shadow-md sm:text-lg md:text-2xl">
            The Official Continental Journey to FESTAC@50.
          </h2>
        </div>

        {/* Buttons */}
        <div className="absolute top-[90.6%] left-[24.8%] w-[24.3%] -translate-y-1/2">
          <a
            href="https://cbaac.gov.ng/programs/road2festac"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-ink/10 bg-amber py-2 text-center font-mono text-[1.4vw] lowercase tracking-wide text-ink shadow-lg transition hover:bg-gold sm:text-xs md:text-sm"
          >
            find out more
          </a>
        </div>
        <div className="absolute top-[90.6%] left-[50.9%] w-[24.2%] -translate-y-1/2">
          <Link
            href="/join"
            className="block w-full border border-ink/10 bg-amber py-2 text-center font-mono text-[1.4vw] lowercase tracking-wide text-ink shadow-lg transition hover:bg-gold sm:text-xs md:text-sm"
          >
            join the collective
          </Link>
        </div>
      </section>

      {/* Creative Collective — flat dark section */}
      <section className="relative bg-collective bg-cover bg-center px-6 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <Image
            src="/patterns/creative-collective-logo.png"
            alt="Creative Collective Africa"
            width={1600}
            height={1045}
            className="mx-auto h-auto w-72 sm:w-80"
          />

          <p className="mx-auto mt-6 max-w-xl text-parchment/90">
            Join Africa&apos;s largest community of creatives shaping the Road to FESTAC and
            FESTAC@50.
          </p>

          <ul className="mx-auto mt-6 max-w-xl space-y-1 text-parchment/90">
            <li>. CREATE: Collaborate with creatives across Africa.</li>
            <li>. PERFORM: Participate in official events.</li>
            <li>. TRAVEL: Gain access to heritage tours.</li>
            <li>. EARN: Access commissions, opportunities and partnerships.</li>
          </ul>

          <p className="mx-auto mt-8 max-w-xl text-parchment/90">
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
          <h2 className="font-display text-3xl font-bold text-parchment sm:text-4xl">
            Discover Africa
            <br />
            Through the Africa Heritage Tour
          </h2>

          <Image
            src="/patterns/africa.png"
            alt="The Africa Heritage Tour, presented by CBAAC and Wakanow"
            width={1330}
            height={1600}
            className="mx-auto mt-10 h-auto w-72 sm:w-96"
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
            className="mx-auto mt-6 h-auto w-40"
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
        <p className="text-sm text-parchment/70">Creative Collective is a division of Communify.</p>
        <p className="text-sm text-parchment/70">
          Official execution partner to CBAAC for Road to FESTAC and FESTAC@50.
        </p>
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