import Image from "next/image";

const FEATURES = [
  "Secure Checkout.",
  "70% of sale value goes directly to the creators.",
  "Creators retain full ownership of their work",
  "Creator profiles and dedicated storefronts",
  "Direct connection between creators and customers",
  "Marketing and promotional support for selected creators",
  "Opportunities for featured placement and campaigns",
  "Simple on-boarding for creators",
  "Built to help African creatives earn, grow and reach new markets",
];

/**
 * The shop's masthead: the triangle-ring artwork with live text set inside it.
 * The copy is real HTML rather than the flattened design PNG so it reflows on
 * small screens and stays selectable/indexable.
 */
export default function ShopHeader({
  creatorSharePercent,
}: {
  creatorSharePercent: number;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-night">
      <div className="relative mx-auto flex min-h-[34rem] max-w-6xl items-center justify-center px-5 py-16 sm:min-h-[42rem] sm:py-20">
        {/* Triangle ring. Oversized on small screens so its inner circle still
            frames the copy instead of squeezing it. */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 w-[132vw] max-w-[64rem] -translate-x-1/2 -translate-y-1/2 select-none"
          aria-hidden
        >
          <Image
            src="/patterns/shop-header-ring.png"
            alt=""
            width={1419}
            height={1608}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="relative w-full max-w-[min(34rem,62vw)] text-center">
          <Image
            src="/patterns/creative-collective-logo.png"
            alt="Creative Collective"
            width={2308}
            height={2241}
            priority
            className="mx-auto h-auto w-14 sm:w-20"
          />

          <h1 className="mt-4 font-display text-lg font-semibold leading-tight text-flame sm:mt-6 sm:text-2xl lg:text-[1.75rem]">
            Original work from the Collective.
          </h1>

          <p className="mx-auto mt-4 text-[0.7rem] leading-snug text-flame sm:mt-6 sm:text-base sm:leading-snug">
            Every piece here is listed by a member of Creative Collective.
            <br />
            Artists, designers and craftspeople from across Africa and the Diaspora,
            <br />
            released drop by drop on the Road to FESTAC &lsquo;77@50.
          </p>

          <ul className="mt-5 space-y-0 text-[0.6rem] leading-snug text-sun sm:mt-9 sm:text-sm sm:leading-snug">
            {FEATURES.map((feature) => (
              <li key={feature}>
                {feature === "70% of sale value goes directly to the creators."
                  ? `${creatorSharePercent}% of sale value goes directly to the creators.`
                  : feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
