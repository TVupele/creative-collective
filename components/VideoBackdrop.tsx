"use client";

/**
 * Full-bleed looping video backdrop. Muted + playsInline so mobile browsers
 * will autoplay it, and `poster` keeps the section from flashing empty while
 * the file loads. Sits behind content via absolute positioning; the parent
 * needs `relative`.
 */
export default function VideoBackdrop({
  src,
  poster,
  className = "",
  overlayClassName = "bg-ink/45",
}: {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
}
