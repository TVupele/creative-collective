import type { Metadata } from "next";
import Image from "next/image";
import VideoBackdrop from "@/components/VideoBackdrop";

export const metadata: Metadata = {
  title: "Creative Collective — Launching Soon",
  description:
    "Welcome to Creative Collective. Our platform is under development and will be launching soon.",
};

/**
 * Pre-launch landing page, reachable at /coming-soon. To put it back in front
 * of the homepage, add a `beforeFiles` rewrite of "/" to "/coming-soon" in
 * `next.config.ts`.
 */
export default function ComingSoon() {
  return (
    <main
      data-hide-shop-button
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-ink"
    >
      <VideoBackdrop
        src="/patterns/replace-kente-background.mp4"
        poster="/patterns/kente-hero.jpg"
        overlayClassName="bg-ink/65"
      />

      <div className="relative mx-auto flex max-w-2xl animate-fade-up flex-col items-center px-6 py-16 text-center">
        <Image
          src="/patterns/creative-collective-logo.png"
          alt="Creative Collective Africa"
          width={2308}
          height={2241}
          className="h-auto w-40 drop-shadow-2xl sm:w-52"
          priority
        />

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-amber sm:text-sm">
          Welcome
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-parchment drop-shadow-lg sm:text-4xl md:text-5xl">
          Welcome to Creative Collective
        </h1>

        <p className="mx-auto mt-6 max-w-lg font-body text-base text-parchment/90 sm:text-lg">
          Thank you for stopping by. Our platform is currently under development and will be
          launching soon.
        </p>

        <p className="mx-auto mt-4 max-w-lg font-body text-base text-parchment/75 sm:text-lg">
          Creative Collective is where creatives across Africa and the Diaspora will connect,
          create, travel and celebrate on the Road to FESTAC@50.
        </p>

        <span className="mt-10 inline-flex items-center gap-3 rounded-full border border-amber/40 bg-ink/40 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-amber backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber" />
          </span>
          Launching Soon
        </span>

        <p className="mt-12 text-xs text-parchment/50">
          &copy; {new Date().getFullYear()} Creative Collective Africa
        </p>
      </div>
    </main>
  );
}
