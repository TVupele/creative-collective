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

      {/* Hero top band — solid black, headline locked to one line */}
      <div className="bg-ink px-4 py-5 text-center sm:py-7">
        <h1 className="whitespace-nowrap font-display text-[5.5vw] font-bold text-parchment sm:text-3xl md:text-4xl">
          One Continent. One Diaspora.
        </h1>
      </div>

      {/* Hero — kente-pattern section */}
      <section className="relative bg-hero bg-cover bg-center px-6 py-16 text-center sm:py-24">
        <div className="relative mx-auto max-w-2xl">
          <Image
            src="/patterns/cbaac-seal.jpg"
            alt="Centre for Black and African Arts and Civilization (CBAAC) seal"
            width={420}
            height={420}
            className="mx-auto h-56 w-56 rounded-full shadow-2xl sm:h-72 sm:w-72"
          />

          <p className="mx-auto mt-10 max-w-xl text-lg text-parchment drop-shadow-md">
            The Centre for Black and African Arts and Civilization (CBAAC).
            <br />
            presents:
          </p>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-2xl font-bold text-parchment drop-shadow-md sm:text-4xl">
            The Official Continental Journey to FESTAC@50.
          </h2>
          <a
            href="#heritage-tour"
            className="mt-8 inline-block border border-ink/10 bg-amber px-8 py-3 font-mono text-sm lowercase tracking-wide text-ink shadow-lg transition hover:bg-gold"
          >
            explore heritage tours
          </a>
        </div>
      </section>

      {/* Creative Collective — flat dark section */}
      <section className="relative bg-charcoal px-6 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <Image
            src="/patterns/creative-collective-logo.png"
            alt="Creative Collective"
            width={1600}
            height={783}
            className="mx-auto h-auto w-72 sm:w-80"
          />

          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.3em] text-amber">
            Africa
          </p>

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
            className="mx-auto mt-10 h-auto w-52 sm:w-64"
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
            src="/patterns/wakanow-logo.png"
            alt="Wakanow"
            width={1132}
            height={349}
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