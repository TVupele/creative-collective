import Image from "next/image";

const FEATURES = [
  "Secure Checkout.",
  "__SHARE__% of sale value goes directly to the creators.",
  "Creators retain full ownership of their work",
  "Creator profiles and dedicated storefronts",
  "Direct connection between creators and customers",
  "Marketing and promotional support for selected creators",
  "Opportunities for featured placement and campaigns",
  "Simple on-boarding for creators",
  "Built to help African creatives earn, grow and reach new markets",
];

/**
 * The shop masthead: the triangle-ring artwork with live text set inside it.
 *
 * The ring artwork and every piece of copy share one container, and all sizes
 * are expressed in `cqw` (see .ring-* in globals.css). That keeps the lockup
 * locked to the proportions of the reference comp at any screen width — the
 * copy stays inside the circle and the circle never gets cropped.
 */
export default function ShopHeader({
  creatorSharePercent,
}: {
  creatorSharePercent: number;
}) {
  return (
    <section className="relative flex justify-center overflow-hidden bg-night">
      <div className="ring-frame relative py-6">
        <Image
          src="/patterns/shop-header-ring.png"
          alt=""
          width={1419}
          height={1608}
          priority
          className="h-auto w-full select-none"
        />

        {/* Centred on the ring, matching the comp's optical centre. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ring-copy text-center">
            <Image
              src="/patterns/creative-collective-logo.png"
              alt="Creative Collective"
              width={2308}
              height={2241}
              priority
              className="ring-logo mx-auto h-auto"
            />

            <h1 className="ring-title font-display font-semibold text-flame">
              Original work from the Collective.
            </h1>

            <p className="ring-body text-flame">
              Every piece here is listed by a member of Creative Collective.
              <br />
              Artists, designers and craftspeople from across Africa and the Diaspora,
              <br />
              released drop by drop on the Road to FESTAC &lsquo;77@50.
            </p>

            <ul className="ring-list text-sun">
              {FEATURES.map((feature) => (
                <li key={feature}>
                  {feature.replace("__SHARE__", String(creatorSharePercent))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
