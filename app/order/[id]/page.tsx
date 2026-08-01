"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

type Status = "checking" | "PAID" | "FULFILLED" | "PENDING" | "error";

export default function OrderConfirmationPage() {
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

  return (
    <main className="flex min-h-dvh items-center justify-center bg-parchment px-6 py-12">
      <div className="max-w-md text-center">
        {status === "checking" && <p className="text-ink/60">Confirming your payment...</p>}

        {(status === "PAID" || status === "FULFILLED") && (
          <>
            <h1 className="font-display text-2xl font-bold text-ink">Thank you!</h1>
            <p className="mt-3 text-ink/70">
              Your payment was successful. Order reference:{" "}
              <span className="font-mono text-sm">{params.id}</span>
            </p>
            <p className="mt-2 text-sm text-ink/60">
              A confirmation has been recorded — the member behind this piece will be notified
              to prepare it for you.
            </p>
          </>
        )}

        {status === "PENDING" && (
          <>
            <h1 className="font-display text-2xl font-bold text-ink">Still processing</h1>
            <p className="mt-3 text-ink/70">
              We haven&apos;t received confirmation from Paystack yet. If you completed
              payment, this usually resolves within a minute — refresh this page to check
              again.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="font-display text-2xl font-bold text-ink">
              Couldn&apos;t confirm payment
            </h1>
            <p className="mt-3 text-ink/70">
              If you were charged, contact us with your order reference and we&apos;ll sort
              it out.
            </p>
          </>
        )}

        <Link href="/shop" className="mt-8 inline-block text-sm text-clay underline">
          Back to shop
        </Link>
      </div>
    </main>
  );
}
