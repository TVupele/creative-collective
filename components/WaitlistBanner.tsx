"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function WaitlistBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (params.get("joined") === "1") {
      setVisible(true);
    }
  }, [params]);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    router.replace(pathname);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-xl items-start gap-3 rounded-lg border border-goldDeep/30 bg-navy px-5 py-4 text-parchment shadow-xl">
        <span className="mt-0.5 text-amber">&#10003;</span>
        <div className="flex-1">
          <p className="font-display text-lg leading-snug">You&apos;re on the list.</p>
          <p className="mt-1 text-sm text-parchment/80">
            Thanks for registering with Creative Collective. You&apos;ve been added to our waiting
            list — we&apos;ll be in touch as Road to FESTAC unfolds.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-parchment/60 hover:text-parchment"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}
