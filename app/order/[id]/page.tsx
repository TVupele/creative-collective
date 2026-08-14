"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import ShopNav from "@/components/ShopNav";

type Status = "checking" | "PAID" | "FULFILLED" | "PENDING" | "error";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />
      <Suspense fallback={<Shell>{null}</Shell>}>
        <OrderConfirmation />
      </Suspense>
    </div>
  );
}

function OrderConfirmation() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    // Paystack appends `reference` (or `trxref`) to the callback URL.
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("error");
      return;
    }

    fetch(`/api/checkout/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "PAID" || data.status === "FULFILLED") {
          clear();
          setStatus(data.status);
        } else if (data.status === "PENDING") {
          setStatus("PENDING");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const paid = status === "PAID" || status === "FULFILLED";

  return (
    <Shell>
      <div className="card-soft animate-fade-up px-6 py-12 text-center sm:px-10">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            paid
              ? "bg-sage/12 text-sage"
              : status === "error"
                ? "bg-clay/10 text-clay"
                : "bg-sand text-ink/45"
          }`}
        >
          {status === "checking" ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink/60" />
          ) : paid ? (
            <CheckIcon />
          ) : status === "PENDING" ? (
            <ClockIcon />
          ) : (
            <AlertIcon />
          )}
        </div>

        {status === "checking" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold text-ink">
              Confirming your payment
            </h1>
            <p className="mt-2 text-sm text-ink/55">
              This only takes a moment — please don&apos;t close this page.
            </p>
          </>
        )}

        {paid && (
          <>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">
              Thank you!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-ink/65">
              Your payment went through. The member behind each piece has been notified to
              prepare your order, and we&apos;ll be in touch about delivery.
            </p>
            <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl bg-sand/60 px-5 py-3">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink/45">
                Order reference
              </span>
              <span className="mt-1 font-mono text-sm text-ink">{params.id}</span>
            </div>
          </>
        )}

        {status === "PENDING" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold text-ink">Still processing</h1>
            <p className="mx-auto mt-3 max-w-md text-ink/65">
              We haven&apos;t had confirmation from Paystack yet. If you completed payment this
              usually clears within a minute — refresh this page to check again.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold text-ink">
              Couldn&apos;t confirm payment
            </h1>
            <p className="mx-auto mt-3 max-w-md text-ink/65">
              If you were charged, send us your order reference{" "}
              <span className="font-mono text-sm text-ink">{params.id}</span> and we&apos;ll
              sort it out straight away.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="pill-accent">
            Keep browsing the shop
          </Link>
          <Link href="/" className="pill-ghost">
            Back home
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-xl px-5 py-16 sm:py-24">{children}</main>;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.2h.01" />
    </svg>
  );
}
