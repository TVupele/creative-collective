"use client";

import { usePathname } from "next/navigation";

/** The shop shortcut only makes sense on the marketing pages — inside the
 *  shop itself the header already carries Shop and Cart links. */
const HIDDEN_ON = ["/shop", "/cart", "/checkout", "/order", "/admin"];

export default function FloatingShopButton() {
  const pathname = usePathname();

  if (HIDDEN_ON.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <a
      href="/shop"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 font-body text-sm font-semibold text-ink shadow-glow transition hover:bg-gold active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      Shop the Collective
    </a>
  );
}
