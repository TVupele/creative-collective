"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-square overflow-hidden rounded-5xl border border-ink/[0.07] bg-sand shadow-soft">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={title}
            fill
            priority
            className="animate-fade-in object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-ink/25">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="9" cy="9" r="1.6" />
              <path d="m21 15-4.5-4.5L7 20" />
            </svg>
            <span className="text-sm">No photo yet</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-pressed={i === active}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 bg-sand transition ${
                i === active
                  ? "border-amber shadow-soft"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
